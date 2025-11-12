import { NextResponse } from 'next/server';
import axios from 'axios';

// Map platform servers to regional routing
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
};

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; puuid: string }> }
) {
  const { server, puuid } = await context.params;
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10', 10);
  const start = parseInt(searchParams.get('start') || '0', 10);

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    // Get regional routing for this server
    const region = PLATFORM_TO_REGION[server.toLowerCase()] || 'americas';
    const regionalHost = `${region}.api.riotgames.com`;

    // Step 1: Get match IDs
    const matchListResponse = await axios.get(
      `https://${regionalHost}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: { 'X-Riot-Token': API_KEY },
        params: { count, start },
      }
    );

    const matchIds: string[] = matchListResponse.data;

    // Step 2: Fetch details for each match
    const matchDetailsPromises = matchIds.map(async (matchId) => {
      try {
        const matchResponse = await axios.get(
          `https://${regionalHost}/lol/match/v5/matches/${matchId}`,
          {
            headers: { 'X-Riot-Token': API_KEY },
          }
        );
        return matchResponse.data;
      } catch (error) {
        console.error(`Failed to fetch match ${matchId}:`, error);
        return null;
      }
    });

    const matchDetails = await Promise.all(matchDetailsPromises);
    const validMatches = matchDetails.filter((match) => match !== null);

    return NextResponse.json({
      matches: validMatches,
      totalMatches: matchIds.length,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'No matches found' }, { status: 404 });
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