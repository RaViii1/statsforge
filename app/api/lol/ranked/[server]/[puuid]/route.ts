import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; puuid: string }> }
) {
  const { server, puuid } = await context.params;

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    // Use PUUID directly to get ranked data
    // console.log(`[RANKED] Fetching ranked data for PUUID: ${puuid} on ${server}`);
    const rankedResponse = await axios.get(
      `https://${server}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    // console.log(`[RANKED] Success! Got ${rankedResponse.data.length} ranked entries`);
    return NextResponse.json({
      rankedData: rankedResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      
      console.error(`[RANKED ERROR] Status: ${status}`);
      console.error(`[RANKED ERROR] Response:`, JSON.stringify(errorData, null, 2));
      console.error(`[RANKED ERROR] URL:`, error.config?.url);
      
      if (status === 404) {
        return NextResponse.json({ error: 'No ranked data found' }, { status: 404 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch ranked data', details: errorData }, 
        { status: status || 500 }
      );
    }
    
    console.error('[RANKED ERROR] Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}