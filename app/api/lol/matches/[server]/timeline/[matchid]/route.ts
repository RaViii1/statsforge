import { NextResponse } from 'next/server';
import axios from 'axios';

const PLATFORM_TO_REGION: Record<string, string> = {
  'na1': 'americas', 'br1': 'americas', 'la1': 'americas', 'la2': 'americas',
  'euw1': 'europe', 'eun1': 'europe', 'tr1': 'europe', 'ru': 'europe',
  'kr': 'asia', 'jp1': 'asia', 'oc1': 'sea',
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
  
  if (!region) {
    return NextResponse.json({ 
      error: `Invalid server/region: ${server}` 
    }, { status: 400 });
  }
  
  const regionalHost = `${region}.api.riotgames.com`;
  const timelineUrl = `https://${regionalHost}/lol/match/v5/matches/${matchid}/timeline`;
  const API_KEY = process.env.RIOT_API_KEY as string;

  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const response = await axios.get(timelineUrl, {
      headers: { 'X-Riot-Token': API_KEY },
    });

    const timelineData = response.data;
    
    // Process timeline data for easier consumption
    const processedTimeline = {
      metadata: timelineData.metadata,
      info: {
        frameInterval: timelineData.info.frameInterval,
        frames: timelineData.info.frames.map((frame: any) => ({
          timestamp: frame.timestamp,
          participantFrames: frame.participantFrames,
          events: frame.events.map((event: any) => ({
            type: event.type,
            timestamp: event.timestamp,
            participantId: event.participantId,
            killerId: event.killerId,
            victimId: event.victimId,
            assistingParticipantIds: event.assistingParticipantIds,
            itemId: event.itemId,
            afterId: event.afterId,
            beforeId: event.beforeId,
            goldGain: event.goldGain,
            level: event.level,
            position: event.position,
            monsterType: event.monsterType,
            monsterSubType: event.monsterSubType,
            killType: event.killType,
            bounty: event.bounty,
            shutdownBounty: event.shutdownBounty,
          }))
        })),
        participants: timelineData.info.participants
      }
    };

    return NextResponse.json(processedTimeline);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'Timeline not found' }, { status: 404 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch timeline data' }, 
        { status: status || 500 }
      );
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
