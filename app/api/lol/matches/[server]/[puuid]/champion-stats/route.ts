import { NextResponse } from 'next/server';
import axios from 'axios';
import { MatchParticipant } from '@/app/types/lolInterfaces';

const QUEUES_RANKED_SOLO = 420;
const QUEUES_RANKED_FLEX = 440;
const BATCH_SIZE = 30; 
const START_DATE = new Date('2026-01-08T20:00:00Z'); 
const START_TIME_EPOCH = Math.floor(START_DATE.getTime() / 1000);

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
        params: { start: 0, count: 100, type: "ranked", startTime: START_TIME_EPOCH },
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

    // Aggregation with matchIds tracked per champion and queue type
    const championAggregates: Record<
      string,
      {
        championId: number;
        stats: ChampionStats;
        soloStats: ChampionStats;
        flexStats: ChampionStats;
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
          soloStats: { gamesPlayed: 0, wins: 0, kills: 0, deaths: 0, assists: 0, totalCS: 0 },
          flexStats: { gamesPlayed: 0, wins: 0, kills: 0, deaths: 0, assists: 0, totalCS: 0 },
          matchIds: [],
        };
      }

      if (!championAggregates[champ].matchIds.includes(matchId)) {
        championAggregates[champ].matchIds.push(matchId);
      }
      
      // Update total stats
      const totalStats = championAggregates[champ].stats;
      totalStats.gamesPlayed++;
      if (participant.win) totalStats.wins++;
      totalStats.kills += participant.kills;
      totalStats.deaths += participant.deaths;
      totalStats.assists += participant.assists;
      totalStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;

      // Update per-queue stats
      if (queue === QUEUES_RANKED_SOLO) {
        const soloStats = championAggregates[champ].soloStats;
        soloStats.gamesPlayed++;
        if (participant.win) soloStats.wins++;
        soloStats.kills += participant.kills;
        soloStats.deaths += participant.deaths;
        soloStats.assists += participant.assists;
        soloStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
      } else if (queue === QUEUES_RANKED_FLEX) {
        const flexStats = championAggregates[champ].flexStats;
        flexStats.gamesPlayed++;
        if (participant.win) flexStats.wins++;
        flexStats.kills += participant.kills;
        flexStats.deaths += participant.deaths;
        flexStats.assists += participant.assists;
        flexStats.totalCS += participant.totalMinionsKilled + participant.neutralMinionsKilled;
      }
    });

    const championStats = Object.entries(championAggregates)
      .map(([champ, data]) => {
        const stats = data.stats;
        const soloStats = data.soloStats;
        const flexStats = data.flexStats;
        
        const winrate = stats.gamesPlayed ? (stats.wins / stats.gamesPlayed) * 100 : 0;
        const kda = stats.deaths === 0 ? stats.kills + stats.assists : (stats.kills + stats.assists) / stats.deaths;
        
        const soloWinrate = soloStats.gamesPlayed ? (soloStats.wins / soloStats.gamesPlayed) * 100 : 0;
        const soloKda = soloStats.deaths === 0 ? soloStats.kills + soloStats.assists : (soloStats.kills + soloStats.assists) / soloStats.deaths;
        
        const flexWinrate = flexStats.gamesPlayed ? (flexStats.wins / flexStats.gamesPlayed) * 100 : 0;
        const flexKda = flexStats.deaths === 0 ? flexStats.kills + flexStats.assists : (flexStats.kills + flexStats.assists) / flexStats.deaths;
        
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
            soloQueueGames: soloStats.gamesPlayed,
            flexQueueGames: flexStats.gamesPlayed,
          },
          soloStats: {
            gamesPlayed: soloStats.gamesPlayed,
            wins: soloStats.wins,
            losses: soloStats.gamesPlayed - soloStats.wins,
            winrate: parseFloat(soloWinrate.toFixed(1)),
            kda: parseFloat(soloKda.toFixed(2)),
            kills: soloStats.kills,
            deaths: soloStats.deaths,
            assists: soloStats.assists,
            averageCS: soloStats.gamesPlayed > 0 ? parseFloat((soloStats.totalCS / soloStats.gamesPlayed).toFixed(1)) : 0,
          },
          flexStats: {
            gamesPlayed: flexStats.gamesPlayed,
            wins: flexStats.wins,
            losses: flexStats.gamesPlayed - flexStats.wins,
            winrate: parseFloat(flexWinrate.toFixed(1)),
            kda: parseFloat(flexKda.toFixed(2)),
            kills: flexStats.kills,
            deaths: flexStats.deaths,
            assists: flexStats.assists,
            averageCS: flexStats.gamesPlayed > 0 ? parseFloat((flexStats.totalCS / flexStats.gamesPlayed).toFixed(1)) : 0,
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