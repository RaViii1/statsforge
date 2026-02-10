import { NextResponse } from 'next/server';
import axios from 'axios';

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
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; username: string; tagline: string }> }
) {
  const { server, username, tagline } = await context.params;

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    const decodedGameName = decodeURIComponent(username).trim();
    const decodedTagLine = decodeURIComponent(tagline).trim();
    const region = PLATFORM_TO_REGION[server.toLowerCase()] || 'europe';
    const regionalHost = `${region}.api.riotgames.com`;

    // 1. Get Account info (PUUID)
    const accountResponse = await axios.get(
      `https://${regionalHost}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(decodedGameName)}/${encodeURIComponent(decodedTagLine)}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );

    const { puuid, gameName, tagLine } = accountResponse.data;

    // 2. Get Summoner info using PUUID
    const summonerResponse = await axios.get(
      `https://${server}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );

    // 3. Get Ranked info using PUUID
    // The user specifically requested /tft/league/v1/by-puuid/{puuid}
    const leagueResponse = await axios.get(
      `https://${server}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );

    return NextResponse.json({
      ...summonerResponse.data,
      gameName,
      tagLine,
      puuid,
      ranked: leagueResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return NextResponse.json(
        { error: error.response?.data?.status?.message || 'Failed to fetch from Riot API' },
        { status: status || 500 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
