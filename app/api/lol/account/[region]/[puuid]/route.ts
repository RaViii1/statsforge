import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  context: { params: Promise<{ region: string; puuid: string }> }
) {
  const { region, puuid } = await context.params;
  
  const validRegions = ['americas', 'europe', 'asia', 'sea'];
  if (!validRegions.includes(region.toLowerCase())) {
    return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
  }

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const regionalHost = `${region.toLowerCase()}.api.riotgames.com`;

    const accountResponse = await axios.get(
      `https://${regionalHost}/riot/account/v1/accounts/by-puuid/${puuid}`,
      {
        headers: { 'X-Riot-Token': API_KEY },
      }
    );

    return NextResponse.json(accountResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch from Riot API' }, 
        { status: status || 500 }
      );
    }
    
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
