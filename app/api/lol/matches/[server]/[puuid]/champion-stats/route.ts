import { NextResponse } from 'next/server';
import axios from 'axios';
import { MatchParticipant } from '@/app/types/lolInterfaces';

const QUEUES_RANKED_SOLO = 420;
const QUEUES_RANKED_FLEX = 440;
const BATCH_SIZE = 30; 
const endDate = new Date('2025-08-27T12:00:00Z'); // UTC time for noon Aug 27, 2025
const endTimeEpoch = Math.floor(endDate.getTime() / 1000);

const REGIONAL_ROUTING: Record<string, string> = {
  na1: 'americas',
  br1: 'americas',
  la1: 'americas',
  la2: 'americas',
  kr: 'asia',
  jp1: 'asia',
  eun1: 'europe',
  euw1: 'europe',
  tr1: 'europe',
  ru: 'europe',
  me1: 'europe',
  oc1: 'sea',
  sg2: 'sea',
  tw2: 'sea',
  vn2: 'sea',
};

type ChampionStats = {
  gamesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  totalCS: number;
};

export async function GET(request: Request, { params }: { params: Promise<{ server: string; puuid: string }> }) {
  const { server, puuid } = await params;
  const { searchParams } = new URL(request.url);
  const loadedMatchesParam = searchParams.get('loadedMatches');
  
  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const region = REGIONAL_ROUTING[server.toLowerCase()];
    if (!region) {
      return NextResponse.json({ error: 'Invalid server region' }, { status: 400 });
    }
    const regionalHost = `${region}.api.riotgames.com`;

    // Parse already loaded match IDs
    let loadedMatchIds: string[] = [];
    try {
      if (loadedMatchesParam) {
        loadedMatchIds = JSON.parse(decodeURIComponent(loadedMatchesParam));
      }
    } catch (e) {
      console.error('Failed to parse loadedMatches:', e);
    }

    // Fetch all available match IDs (up to 100 most recent)
    const allMatchIdsResponse = await axios.get(
      `https://${regionalHost}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: { 'X-Riot-Token': API_KEY },
        params: { start: 0, count: 100, type: "ranked", endTime: endTimeEpoch },
      }
    );
    const allMatchIds: string[] = allMatchIdsResponse.data;
    
    if (!allMatchIds || allMatchIds.length === 0) {
      return NextResponse.json({ 
        championStats: [], 
        totalMatches: 0,
        processedMatchIds: [],
        totalAvailableMatches: 0
      });
    }

    // Filter out already loaded matches
    const unloadedMatchIds = allMatchIds.filter(id => !loadedMatchIds.includes(id));
    
    // If no new matches, return empty
    if (unloadedMatchIds.length === 0) {
      return NextResponse.json({ 
        championStats: [], 
        totalMatches: 0,
        processedMatchIds: [],
        totalAvailableMatches: allMatchIds.length,
        message: 'All available matches already loaded'
      });
    }

    // Take only BATCH_SIZE new matches to respect rate limits
    const matchIdsToFetch = unloadedMatchIds.slice(0, BATCH_SIZE);
    const processedMatchIds: string[] = [];

    // Fetch match details with delay to avoid rate limits
    const matches = [];
    for (const matchId of matchIdsToFetch) {
      try {
        const matchResponse = await axios.get(
          `https://${regionalHost}/lol/match/v5/matches/${matchId}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        matches.push(matchResponse.data);
        processedMatchIds.push(matchId);
        
        // Small delay to help with rate limits (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        // If we hit rate limit, stop fetching more
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          console.log('Rate limit hit, stopping fetch');
          break;
        }
        // For other errors, just skip this match
        console.error(`Failed to fetch match ${matchId}:`, error);
      }
    }

    const validMatches = matches.filter((m) => m !== null);

    // Aggregation with matchIds tracked per champion
    const championAggregates: Record<
      string,
      {
        championId: number;
        stats: ChampionStats;
        queues: Record<number, number>;
        matchIds: string[];
      }
    > = {};
    
    validMatches.forEach((match: any) => {
      const participant = match.info.participants.find((p: MatchParticipant) => p.puuid === puuid);
      if (!participant) return;

      const champ = participant.championName;
      const champId = participant.championId;
      const queue = match.info.queueId;
      const matchId = match.metadata.matchId;

      if (!championAggregates[champ]) {
        championAggregates[champ] = {
          championId: champId,
          stats: { gamesPlayed: 0, wins: 0, kills: 0, deaths: 0, assists: 0, totalCS: 0 },
          queues: {},
          matchIds: [],
        };
      }

      if (!championAggregates[champ].matchIds.includes(matchId)) {
        championAggregates[champ].matchIds.push(matchId);
      }
      
      const stats = championAggregates[champ].stats;
      stats.gamesPlayed++;
      if (participant.win) stats.wins++;
      stats.kills += participant.kills;
      stats.deaths += participant.deaths;
      stats.assists += participant.assists;
      stats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
      championAggregates[champ].queues[queue] = (championAggregates[champ].queues[queue] || 0) + 1;
    });

    const championStats = Object.entries(championAggregates)
      .map(([champ, data]) => {
        const stats = data.stats;
        const winrate = stats.gamesPlayed ? (stats.wins / stats.gamesPlayed) * 100 : 0;
        const kda = stats.deaths === 0 ? stats.kills + stats.assists : (stats.kills + stats.assists) / stats.deaths;
        return {
          champion: champ,
          championId: data.championId,
          gamesPlayed: stats.gamesPlayed,
          wins: stats.wins,
          losses: stats.gamesPlayed - stats.wins,
          winrate: parseFloat(winrate.toFixed(1)),
          kda: parseFloat(kda.toFixed(2)),
          kills: stats.kills,
          deaths: stats.deaths,
          assists: stats.assists,
          averageCS: parseFloat((stats.totalCS / stats.gamesPlayed).toFixed(1)),
          queueBreakdown: {
            soloQueueGames: data.queues[QUEUES_RANKED_SOLO] || 0,
            flexQueueGames: data.queues[QUEUES_RANKED_FLEX] || 0,
          },
          matchIds: data.matchIds,
        };
      })
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed);

    return NextResponse.json({ 
      totalMatches: validMatches.length, 
      championStats,
      processedMatchIds,
      totalAvailableMatches: allMatchIds.length,
      remainingMatches: allMatchIds.length - (loadedMatchIds.length + processedMatchIds.length)
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) return NextResponse.json({ error: 'No matches found' }, { status: 404 });
      if (status === 401) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      if (status === 429) return NextResponse.json({ error: 'Rate limit exceeded. Please wait before updating again.' }, { status: 429 });
      return NextResponse.json({ error: 'Failed to fetch match data' }, { status: status || 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}