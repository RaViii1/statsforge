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
    // Get champion mastery data
    const masteryResponse = await axios.get(
      `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    return NextResponse.json({
      masteries: masteryResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'No mastery data found' }, { status: 404 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch mastery data' }, 
        { status: status || 500 }
      );
    }
    
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
