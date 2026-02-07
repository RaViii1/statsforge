import { NextResponse } from 'next/server';
import axios from 'axios';
import { isValidPlatform } from '@/lib/lol/platforms';

export async function GET(
  request: Request,
  context: { params: Promise<{ server: string; puuid: string }> }
) {
    const { server, puuid } = await context.params;
    const platform = server.toLowerCase();

    if (!isValidPlatform(platform)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

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

      const gameData = response.data;
      const participants = gameData.participants || [];

        // Fetch ranked data for all participants in parallel
        const rankedDataPromises = participants.map(async (p: any) => {
          try {
            if (!p.puuid) {
              throw new Error('PUUID missing for participant');
            }

            const rankedRes = await axios.get(
              `https://${platformHost}/lol/league/v4/entries/by-puuid/${p.puuid}`,
              {
                headers: { 'X-Riot-Token': API_KEY },
              }
            );
          
            // Find Solo/Duo rank (RANKED_SOLO_5x5) or Flex rank if Solo is not available
            const soloRank = rankedRes.data.find((entry: any) => entry.queueType === 'RANKED_SOLO_5x5');
            const flexRank = rankedRes.data.find((entry: any) => entry.queueType === 'RANKED_FLEX_SR');
            
            return { 
              puuid: p.puuid, 
              summonerId: p.summonerId,
              rank: soloRank || flexRank || null 
            };
          } catch (error) {
            console.error(`[Spectator] Failed to fetch rank for participant ${p.summonerId || p.puuid}:`, error);
            return { puuid: p.puuid, summonerId: p.summonerId, rank: null };
          }
        });
  
        const rankedResults = await Promise.all(rankedDataPromises);
        const rankedMap = rankedResults.reduce((acc, curr) => {
          if (curr.puuid) acc[curr.puuid] = curr.rank;
          if (curr.summonerId) acc[curr.summonerId] = curr.rank;
          return acc;
        }, {} as any);
  
        return NextResponse.json({
          inGame: true,
          gameData: {
            ...gameData,
            playerRanks: rankedMap
          },
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
