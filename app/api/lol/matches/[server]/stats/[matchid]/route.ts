import { NextResponse } from 'next/server';
import axios from 'axios';

const PLATFORM_TO_REGION: Record<string, string> = {
  'na1': 'americas', 'br1': 'americas', 'la1': 'americas', 'la2': 'americas',
  'euw1': 'europe', 'eun1': 'europe', 'tr1': 'europe', 'ru': 'europe',
  'kr': 'asia', 'jp1': 'asia', 'oc1': 'sea',
  // Also accept regional routing values directly
  'americas': 'americas',
  'europe': 'europe',
  'asia': 'asia',
  'sea': 'sea',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; matchId: string }> }
) {
  const { server, matchId } = await context.params;
  const region = PLATFORM_TO_REGION[server.toLowerCase()];
  
  if (!region) {
    return NextResponse.json({ 
      error: `Invalid server/region: ${server}. Use platform codes (eun1, euw1, na1, etc.) or regional routing values (europe, americas, asia, sea)` 
    }, { status: 400 });
  }
  
  const regionalHost = `${region}.api.riotgames.com`;
  const API_KEY = process.env.RIOT_API_KEY as string;

  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const response = await axios.get(
      `https://${regionalHost}/lol/match/v5/matches/${matchId}`,
      {
        headers: { 'X-Riot-Token': API_KEY },
      }
    );

    const matchData = response.data;
    const participants = matchData.info.participants;

    // Process each participant's data
    const processedParticipants = participants.map((p: any) => {
      const gameDuration = matchData.info.gameDuration / 60; // Convert to minutes
      const kda = p.deaths === 0 ? p.kills + p.assists : (p.kills + p.assists) / p.deaths;
      
      return {
        // Basic Info
        puuid: p.puuid,
        summonerName: p.riotIdGameName || p.summonerName,
        championName: p.championName,
        teamPosition: p.teamPosition,
        win: p.win,
        
        // Combat metrics
        kills: p.kills,
        assists: p.assists,
        deaths: p.deaths,
        kda: kda,
        damagePerMinute: p.totalDamageDealtToChampions / gameDuration,
        totalDamageDealtToChampions: p.totalDamageDealtToChampions,
        teamDamagePercentage: p.challenges?.teamDamagePercentage || 0,
        killParticipation: p.challenges?.killParticipation || 0,
        
        // Objective metrics
        baronKills: p.challenges?.baronTakedowns || 0,
        dragonKills: p.challenges?.dragonTakedowns || 0,
        turretTakedowns: p.challenges?.turretTakedowns || 0,
        objectivesStolen: p.objectivesStolen || 0,
        
        // Economy metrics
        goldEarned: p.goldEarned,
        goldPerMinute: p.goldEarned / gameDuration,
        totalMinionsKilled: p.totalMinionsKilled,
        neutralMinionsKilled: p.neutralMinionsKilled,
        
        // Survivability metrics
        totalDamageTaken: p.totalDamageTaken,
        damageSelfMitigated: p.damageSelfMitigated,
        timeSpentDead: p.totalTimeSpentDead,
        
        // Vision metrics
        visionScore: p.visionScore,
        visionScorePerMinute: p.visionScore / gameDuration,
        wardsPlaced: p.wardsPlaced,
        wardsKilled: p.wardsKilled,
        
        // Other
        level: p.champLevel,
        timePlayed: matchData.info.gameDuration,
      };
    });

    return NextResponse.json({
      matchId: matchData.metadata.matchId,
      gameDuration: matchData.info.gameDuration,
      participants: processedParticipants,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch match data' }, 
        { status: status || 500 }
      );
    }
    
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}