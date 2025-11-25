import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; puuid: string }> }
) {
  const { server, puuid } = await context.params;

  const API_KEY = process.env.RIOT_API_KEY as string;
  if (!API_KEY) {
    return NextResponse.json({ error: 'RIOT_API_KEY is missing' }, { status: 500 });
  }

  try {
    const platformHost = `${server}.api.riotgames.com`;

    console.log(`[Spectator] Checking live game for puuid: ${puuid} on ${server}`);

    // Fetch active game data
    const response = await axios.get(
      `https://${platformHost}/lol/spectator/v5/active-games/by-summoner/${puuid}`,
      {
        headers: { 'X-Riot-Token': API_KEY },
      }
    );

    console.log(`[Spectator] Live game found for puuid: ${puuid}`);

    return NextResponse.json({
      inGame: true,
      gameData: response.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        // Player not in game
        return NextResponse.json({ inGame: false }, { status: 200 });
      }
      if (status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
      if (status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
      }

      console.error(`[Spectator] Error:`, error.response?.data);
      return NextResponse.json(
        { error: 'Failed to fetch spectator data' },
        { status: status || 500 }
      );
    }

    console.error('[Spectator] Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
