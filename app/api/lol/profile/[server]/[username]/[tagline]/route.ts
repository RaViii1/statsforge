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
  context: { params: Promise<{ server: string; username: string; tagline: string }> }
) {
  const { server, username, tagline } = await context.params;

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing. Get one from https://developer.riotgames.com' },
      { status: 500 }
    );
  }

  try {
    const decodedGameName = decodeURIComponent(username);
    const decodedTagLine = decodeURIComponent(tagline);
    
    // Get regional routing for this server
    const region = PLATFORM_TO_REGION[server.toLowerCase()] || 'europe';
    const regionalHost = `${region}.api.riotgames.com`;

    // Step 1: Get account info (PUUID) using Riot ID
    const accountResponse = await axios.get(
      `https://${regionalHost}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(decodedGameName)}/${encodeURIComponent(decodedTagLine)}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    const accountData = accountResponse.data;

    // Step 2: Get summoner info using PUUID
    const summonerResponse = await axios.get(
      `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${accountData.puuid}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );




    // Combine both data sources
    return NextResponse.json({
      ...summonerResponse.data,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      puuid: accountData.puuid,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 404) {
        return NextResponse.json({ error: 'Summoner not found' }, { status: 404 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
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
