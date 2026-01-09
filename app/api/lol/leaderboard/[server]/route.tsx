import { NextResponse } from 'next/server';
import axios from 'axios';

const PLATFORM_TO_REGION: Record<string, string> = {
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  'kr': 'asia',
  'jp1': 'asia',
  'oc1': 'sea',
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string }> }
) {
  const { server } = await context.params;
  const platform = server.toLowerCase();
  
  // 1. Validate platform
  if (!PLATFORM_TO_REGION[platform]) {
    return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const queueType = searchParams.get('queue') || 'RANKED_SOLO_5x5';
  
  // 2. Validate queueType
  const validQueues = ['RANKED_SOLO_5x5', 'RANKED_FLEX_SR'];
  if (!validQueues.includes(queueType)) {
    return NextResponse.json({ error: 'Invalid queue type' }, { status: 400 });
  }

  // 3. Bound pagination
  const page = Math.max(1, Math.min(100, parseInt(searchParams.get('page') || '1') || 1));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50') || 50));
  
  const API_KEY = process.env.RIOT_API_KEY as string;

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    const region = PLATFORM_TO_REGION[platform];
    const regionalHost = `${region}.api.riotgames.com`;

    let entries: any[] = [];
    let currentTier = 'CHALLENGER';
    let currentLeagueName = '';

    // Try Challenger
    try {
      const challengerResponse = await axios.get(
        `https://${platform}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/${queueType}`,
        { headers: { 'X-Riot-Token': API_KEY } }
      );
      entries = challengerResponse.data.entries || [];
      currentLeagueName = challengerResponse.data.name;
    } catch (e) {
      console.error('Challenger league fetch failed', e);
    }

    // Fallback to Grandmaster
    if (entries.length === 0) {
      try {
        const gmResponse = await axios.get(
          `https://${platform}.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/${queueType}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        entries = gmResponse.data.entries || [];
        currentLeagueName = gmResponse.data.name;
        currentTier = 'GRANDMASTER';
      } catch (e) {
        console.error('Grandmaster league fetch failed', e);
      }
    }

    // Fallback to Master
    if (entries.length === 0) {
      try {
        const masterResponse = await axios.get(
          `https://${platform}.api.riotgames.com/lol/league/v4/masterleagues/by-queue/${queueType}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        entries = masterResponse.data.entries || [];
        currentLeagueName = masterResponse.data.name;
        currentTier = 'MASTER';
      } catch (e) {
        console.error('Master league fetch failed', e);
      }
    }

    // Sort by leaguePoints descending
    entries.sort((a: any, b: any) => b.leaguePoints - a.leaguePoints);

    const totalPlayers = entries.length;
    const startIndex = (page - 1) * limit;
    const paginatedEntries = entries.slice(startIndex, startIndex + limit);

    // Resolve players for current page
    const resolvedPlayers: any[] = [];
    
    for (let i = 0; i < paginatedEntries.length; i++) {
      const entry = paginatedEntries[i];
      const position = startIndex + i + 1;
      const puuid = entry.puuid;
      
      if (!puuid) {
        resolvedPlayers.push({
          ...entry,
          position,
          tier: currentTier,
          rank: 'I',
          gameName: 'Unknown',
          tagLine: '',
        });
        continue;
      }

      try {
        // Rate limit optimization: only delay if needed
        if (i > 0 && i % 5 === 0) await delay(400);

        // 1. Get summoner details (profileIconId, summonerLevel) using PUUID
        const summonerResponse = await axios.get(
          `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        
        const level = summonerResponse.data.summonerLevel;
        const profileIconId = summonerResponse.data.profileIconId;

        // 2. Get Riot ID (gameName + tagLine) from Account API
        const accountResponse = await axios.get(
          `https://${regionalHost}/riot/account/v1/accounts/by-puuid/${puuid}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );

        const gameName = accountResponse.data.gameName;
        const tagLine = accountResponse.data.tagLine;

        resolvedPlayers.push({
          ...entry,
          position,
          puuid,
          level,
          profileIconId,
          gameName: gameName || 'Unknown',
          tagLine: tagLine || '',
          tier: currentTier,
          rank: 'I',
        });
      } catch (err: any) {
        console.error(`Failed to resolve player ${position} (puuid: ${puuid}):`, err.response?.status);
        
        if (err.response?.status === 429) {
          // If we hit rate limit, push placeholder and continue (or break if too many)
          resolvedPlayers.push({
            ...entry,
            position,
            puuid,
            tier: currentTier,
            rank: 'I',
            gameName: 'RateLimited',
            tagLine: '',
          });
        } else {
          resolvedPlayers.push({
            ...entry,
            position,
            puuid,
            tier: currentTier,
            rank: 'I',
            gameName: 'PLAYER',
            tagLine: 'NA1',
          });
        }
      }
    }

    return NextResponse.json({
      players: resolvedPlayers,
      totalPlayers,
      page,
      limit,
      leagueName: currentLeagueName,
      tier: currentTier
    });

  } catch (error) {
    console.error('[LEADERBOARD ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
