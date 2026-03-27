import { NextResponse } from 'next/server';
import axios from 'axios';
import { createServiceClient } from '@/lib/supabase/service';
import { PLATFORM_TO_REGION } from '@/lib/utils';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// How old a cached profile can be before we refresh it from Riot.
// 15 minutes keeps LP/rank fresh without hammering the API.
const CACHE_TTL_MS = 15 * 60 * 1000;

// How many Riot API calls to allow per page before falling back to cached data.
// Riot's dev key allows ~20 req/s on platform endpoints; production key is higher.
// We keep this conservative so a single page load never blows the budget.
const MAX_RIOT_CALLS_PER_PAGE = 50;

interface RiotEntry {
  puuid: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string }> }
) {
  const { server } = await context.params;
  const platform = server.toLowerCase();

  if (!PLATFORM_TO_REGION[platform]) {
    return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const queueType = searchParams.get('queue') || 'RANKED_SOLO_5x5';

  const validQueues = ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'];
  if (!validQueues.includes(queueType)) {
    return NextResponse.json({ error: 'Invalid queue type' }, { status: 400 });
  }

  const page  = Math.max(1, Math.min(100, parseInt(searchParams.get('page')  || '1')  || 1));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50') || 50));

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  const supabase = createServiceClient();
  const region = PLATFORM_TO_REGION[platform];
  const regionalHost = `${region}.api.riotgames.com`;

  try {
    let entries: RiotEntry[] = [];
    let currentTier = 'CHALLENGER';
    let currentLeagueName = '';

    for (const [tier, endpoint] of [
      ['CHALLENGER',  `challengerleagues`],
      ['GRANDMASTER', `grandmasterleagues`],
      ['MASTER',      `masterleagues`],
    ] as const) {
      if (entries.length > 0) break;
      try {
        const res = await axios.get(
          `https://${platform}.api.riotgames.com/lol/league/v4/${endpoint}/by-queue/${queueType}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        entries = res.data.entries || [];
        currentLeagueName = res.data.name;
        currentTier = tier;
      } catch (e: any) {
        console.error(`${tier} fetch failed:`, e?.response?.status ?? e?.message);
      }
    }

    // Sort by LP and paginate on the full list
    entries.sort((a, b) => b.leaguePoints - a.leaguePoints);

    const totalPlayers  = entries.length;
    const startIndex    = (page - 1) * limit;
    const pageEntries   = entries.slice(startIndex, startIndex + limit);
    const pagePuuids    = pageEntries.map(e => e.puuid).filter(Boolean);
   
    const { data: cachedRows } = await supabase
      .from('lol_profiles')
      .select('*')
      .in('puuid', pagePuuids)
      .eq('platform', platform)
      .eq('queueType', queueType);

    const cacheMap = new Map<string, any>();
    for (const row of cachedRows ?? []) {
      cacheMap.set(row.puuid, row);
    }

    const now = Date.now();
    const stale = (row: any) =>
      !row || now - new Date(row.lastUpdated).getTime() > CACHE_TTL_MS;


    const puuidsNeedingIdentity = pagePuuids.filter(p => stale(cacheMap.get(p)));

    let riotCallsMade = 0;
    const upsertRows: any[] = [];

    for (let i = 0; i < puuidsNeedingIdentity.length; i++) {
      if (riotCallsMade >= MAX_RIOT_CALLS_PER_PAGE) break;

      const puuid = puuidsNeedingIdentity[i];
      // Gentle pacing: 400 ms pause every 5 calls
      if (i > 0 && i % 5 === 0) await delay(400);

      try {
        const [summonerRes, accountRes] = await Promise.all([
          axios.get(
            `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
            { headers: { 'X-Riot-Token': API_KEY } }
          ),
          axios.get(
            `https://${regionalHost}/riot/account/v1/accounts/by-puuid/${puuid}`,
            { headers: { 'X-Riot-Token': API_KEY } }
          ),
        ]);
        riotCallsMade += 2;

        const entry = pageEntries.find(e => e.puuid === puuid)!;
        upsertRows.push({
          puuid,
          platform,
          queueType,
          gameName:      accountRes.data.gameName      || null,
          tagLine:       accountRes.data.tagLine        || null,
          summonerId:    entry.summonerId,
          profileIconId: summonerRes.data.profileIconId,
          summonerLevel: summonerRes.data.summonerLevel,
          tier:          currentTier,
          rank:          'I',
          leaguePoints:  entry.leaguePoints,
          wins:          entry.wins,
          losses:        entry.losses,
          hotStreak:     entry.hotStreak,
          veteran:       entry.veteran,
          freshBlood:    entry.freshBlood,
          inactive:      entry.inactive,
          lastUpdated:   new Date().toISOString(),
        });

        // Update local cache map so Step 5 sees the fresh data immediately
        cacheMap.set(puuid, upsertRows[upsertRows.length - 1]);
      } catch (err: any) {
        console.error(`Identity fetch failed for ${puuid}:`, err?.response?.status ?? err?.message);
        // Leave whatever was in cache; Step 5 will use it if available
      }
    }


    const lpUpdateRows: any[] = [];
    for (const entry of pageEntries) {
      if (!entry.puuid) continue;
      // Only write a full LP update row if we didn't already upsert this puuid above
      if (!upsertRows.find(r => r.puuid === entry.puuid)) {
        const existing = cacheMap.get(entry.puuid);
        if (existing) {
          lpUpdateRows.push({
            ...existing,
            leaguePoints: entry.leaguePoints,
            wins:         entry.wins,
            losses:       entry.losses,
            hotStreak:    entry.hotStreak,
            veteran:      entry.veteran,
            freshBlood:   entry.freshBlood,
            inactive:     entry.inactive,
            tier:         currentTier,
            // lastUpdated intentionally NOT bumped here — only identity refresh resets TTL
          });
        }
      }
    }

    // Fire-and-forget upsert — don't block the response on DB writes
    const allUpserts = [...upsertRows, ...lpUpdateRows];
    if (allUpserts.length > 0) {
      supabase
        .from('lol_profiles')
        .upsert(allUpserts, { onConflict: 'puuid,platform,queueType' })
        .then(({ error }) => {
          if (error) console.error('[lol_profiles upsert error]', error.message);
        });
    }

    const resolvedPlayers = pageEntries.map((entry, i) => {
      const position = startIndex + i + 1;
      const cached   = cacheMap.get(entry.puuid);

      return {
        summonerId:    entry.summonerId,
        puuid:         entry.puuid,
        position,
        tier:          currentTier,
        rank:          'I',
        leaguePoints:  entry.leaguePoints,
        wins:          entry.wins,
        losses:        entry.losses,
        hotStreak:     entry.hotStreak,
        veteran:       entry.veteran,
        freshBlood:    entry.freshBlood,
        inactive:      entry.inactive,
        // Identity fields from cache (may be null for brand-new entries that hit the call cap)
        gameName:      cached?.gameName      ?? 'Unknown',
        tagLine:       cached?.tagLine       ?? '',
        profileIconId: cached?.profileIconId ?? null,
        level:         cached?.summonerLevel ?? null,
        // Expose cache age so the UI can optionally show a freshness indicator
        cachedAt:      cached?.lastUpdated   ?? null,
      };
    });

    return NextResponse.json({
      players: resolvedPlayers,
      totalPlayers,
      page,
      limit,
      leagueName:    currentLeagueName,
      tier:          currentTier,
      riotCallsMade,
      // How many players were served from cache vs freshly fetched
      fromCache:     resolvedPlayers.length - upsertRows.length,
    });

  } catch (error) {
    console.error('[LEADERBOARD ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
