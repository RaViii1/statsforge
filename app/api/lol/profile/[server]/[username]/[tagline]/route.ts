import { NextResponse } from 'next/server';
import axios from 'axios';
import { profile } from 'console';
import { PLATFORM_TO_REGION } from '@/lib/utils';
// Map platform servers to regional routing


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
    const decodedGameName = decodeURIComponent(username).trim();
    const decodedTagLine = decodeURIComponent(tagline).trim();
    
    const region = PLATFORM_TO_REGION[server.toLowerCase()] || 'europe';
    const regionalHost = `${region}.api.riotgames.com`;

    // Step 1: Get account info (PUUID) using Riot ID (GameName + Tagline)
    const accountResponse = await axios.get(
      `https://${regionalHost}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(decodedGameName)}/${encodeURIComponent(decodedTagLine)}`,
      {
        headers: {
          'X-Riot-Token': API_KEY,
        },
      }
    );

    const accountData = accountResponse.data;

    // Step 2: Get summoner info using PUUID (summonerLevel, profileIconId, revisionDate.)
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
      profileIconId: summonerResponse.data.profileIconId,
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
