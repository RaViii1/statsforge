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
  context: { params: Promise<{ server: string; matchid: string }> }
) {
  const { server, matchid } = await context.params;
  const region = PLATFORM_TO_REGION[server.toLowerCase()];
  
  console.log('=== MATCH STATS API DEBUG ===');
  console.log('Received server:', server);
  console.log('Received matchid:', matchid);
  console.log('Mapped region:', region);
  
  if (!region) {
    return NextResponse.json({ 
      error: `Invalid server/region: ${server}. Use platform codes (eun1, euw1, na1, etc.) or regional routing values (europe, americas, asia, sea)` 
    }, { status: 400 });
  }
  
  const regionalHost = `${region}.api.riotgames.com`;
  const fullUrl = `https://${regionalHost}/lol/match/v5/matches/${matchid}`;
  const API_KEY = process.env.RIOT_API_KEY as string;

  console.log('Full API URL:', fullUrl);
  console.log('API Key present:', !!API_KEY);

  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const response = await axios.get(fullUrl, {
      headers: { 'X-Riot-Token': API_KEY },
    });

    console.log('✅ API request successful!');
    console.log('Response status:', response.status);

    const matchData = response.data;
    
    const participants = matchData.info.participants;

    // Process each participant's data
    const processedParticipants = participants.map((p: any) => {
      const gameDuration = matchData.info.gameDuration / 60; // Convert to minutes
      const kda = p.deaths === 0 ? p.kills + p.assists : (p.kills + p.assists) / p.deaths;
      
      return {
        // Basic Info
        puuid: p.puuid,
        profileIcon: p.profileIcon,
        summonerName: p.riotIdGameName || p.summonerName,
        championName: p.championName,
        teamPosition: p.teamPosition,
        teamId: p.teamId,
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
          soloKills: p.challenges?.soloKills || 0,
          
          // Multikills
          pentaKills: p.pentaKills || 0,
          quadraKills: p.quadraKills || 0,
          tripleKills: p.tripleKills || 0,
          doubleKills: p.doubleKills || 0,
          
          // Objective metrics
          baronKills: p.challenges?.baronTakedowns || 0,
          dragonKills: p.challenges?.dragonTakedowns || 0,
          riftHeraldTakedowns: p.challenges?.riftHeraldTakedowns || 0,
          turretTakedowns: p.challenges?.turretTakedowns || 0,
          inhibitorTakedowns: p.challenges?.inhibitorTakedowns || 0,
          objectivesStolen: p.objectivesStolen || 0,
          
          // Economy metrics
          goldEarned: p.goldEarned,
          goldPerMinute: p.goldEarned / gameDuration,
          totalMinionsKilled: p.totalMinionsKilled,
          neutralMinionsKilled: p.neutralMinionsKilled,
          
          // Survivability metrics
          totalDamageTaken: p.totalDamageTaken,
          totalHeal: p.totalHeal || 0,
          totalHealsOnTeammates: p.totalHealsOnTeammates || 0,
          totalDamageShieldedOnTeammates: p.totalDamageShieldedOnTeammates || 0,
          damageSelfMitigated: p.damageSelfMitigated,
          timeSpentDead: p.totalTimeSpentDead,
          longestTimeSpentLiving: p.longestTimeSpentLiving || 0,
          
          // CC metrics
          timeCCingOthers: p.timeCCingOthers || 0,
          
          // Vision metrics
          visionScore: p.visionScore,
          visionScorePerMinute: p.visionScore / gameDuration,
          wardsPlaced: p.wardsPlaced,
          wardsKilled: p.wardsKilled,
          controlWardsPlaced: p.challenges?.controlWardsPlaced || 0,
          
            // Structure damage
            turretDamageDealt: p.damageDealtToTurrets || 0,
            damageDealtToObjectives: p.damageDealtToObjectives || 0,
            
            // Counter-jungling
            enemyJungleMonsterKills: p.challenges?.enemyJungleMonsterKills || 0,
            
            // Early game
            laneMinionsFirst10Minutes: p.challenges?.laneMinionsFirst10Minutes || 0,
            jungleCsBefore10Minutes: p.challenges?.jungleCsBefore10Minutes || 0,
            
            // Role detection
            lane: p.lane || '',
            individualPosition: p.individualPosition || '',
            
            // Other
            level: p.champLevel,
            timePlayed: matchData.info.gameDuration,
      };
    });

    return NextResponse.json({
      matchid: matchData.metadata.matchid,
      gameDuration: matchData.info.gameDuration,
      participants: processedParticipants,
    });
  } catch (error) {
    console.error('❌ API request failed!');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      const data = error.response?.data;
      
      console.error('Axios error status:', status);
      console.error('Axios error statusText:', statusText);
      console.error('Axios error data:', data);
      console.error('Request URL:', error.config?.url);
      
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
        { error: 'Failed to fetch match data', details: data }, 
        { status: status || 500 }
      );
    }
    
    console.error('Non-Axios error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}