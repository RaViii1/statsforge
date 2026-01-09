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

      console.log(`[Spectator] Fetching from Riot: https://${platformHost}/lol/spectator/v5/active-games/by-summoner/${puuid}`);

      // Fetch active game data
      const response = await axios.get(
        `https://${platformHost}/lol/spectator/v5/active-games/by-summoner/${puuid}`,
        {
          headers: { 'X-Riot-Token': API_KEY },
        }
      );

      console.log(`[Spectator] SUCCESS: Live game found for puuid: ${puuid} on ${server}`);

      return NextResponse.json({
        inGame: true,
        gameData: response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        console.log(`[Spectator] Riot API returned status ${status} for ${puuid} on ${server}`);

        if (status === 404) {
          // Player not in game
          return NextResponse.json({ inGame: false }, { status: 200 });
        }
        
        console.error(`[Spectator] Riot API Error:`, {
          status,
          data: errorData,
          url: error.config?.url
        });

      return NextResponse.json(
        { error: 'Failed to fetch spectator data' },
        { status: status || 500 }
      );
    }

    console.error('[Spectator] Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
