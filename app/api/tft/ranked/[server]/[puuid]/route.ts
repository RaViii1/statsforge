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
    const rankedResponse = await axios.get(
      `https://${server}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    return NextResponse.json({
      rankedData: rankedResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      
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
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
