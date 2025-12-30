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
  context: { params: Promise<{ server: string; puuid: string }> }
) {
  const { server, puuid } = await context.params;
  const { searchParams } = new URL(request.url);
  const start = parseInt(searchParams.get('start') || '0', 10);
  const count = parseInt(searchParams.get('count') || '10', 10);

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'RIOT_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    const region = PLATFORM_TO_REGION[server.toLowerCase()] || 'europe';
    const regionalHost = `${region}.api.riotgames.com`;

    // 1. Get Match IDs
    const matchIdsResponse = await axios.get(
      `https://${regionalHost}/tft/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );

    const matchIds = matchIdsResponse.data;

    // 2. Get Details for each match
    const matchDetailsPromises = matchIds.map((id: string) =>
      axios.get(`https://${regionalHost}/tft/match/v1/matches/${id}`, {
        headers: { 'X-Riot-Token': API_KEY },
      }).catch(err => {
        console.error(`Failed to fetch TFT match ${id}:`, err);
        return null;
      })
    );

    const matchesResponses = await Promise.all(matchDetailsPromises);
    const matches = matchesResponses
      .filter(res => res !== null)
      .map((res) => res.data);

    return NextResponse.json({
      matches: matches,
      totalMatches: matchIds.length,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      return NextResponse.json(
        { error: 'Failed to fetch matches from Riot API' },
        { status: status || 500 }
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
