import { NextResponse } from 'next/server';
import axios from 'axios';

// Champion roles mapping (simplified)
const CHAMPION_ROLES: Record<string, string[]> = {
  // This would ideally come from a database or Riot's Data Dragon
  // For now, using a subset as example
  "Aatrox": ["TOP"],
  "Ahri": ["MID"],
  "Akali": ["MID", "TOP"],
  "Alistar": ["SUPPORT"],
  "Amumu": ["JUNGLE"],
  "Anivia": ["MID"],
  "Annie": ["MID", "SUPPORT"],
  "Ashe": ["ADC"],
  "Bard": ["SUPPORT"],
  "Blitzcrank": ["SUPPORT"],
  "Caitlyn": ["ADC"],
  "Darius": ["TOP"],
  "Diana": ["JUNGLE", "MID"],
  "Draven": ["ADC"],
  "Ekko": ["JUNGLE", "MID"],
  "Elise": ["JUNGLE"],
  "Ezreal": ["ADC"],
  "Fiora": ["TOP"],
  "Garen": ["TOP"],
  "Graves": ["JUNGLE"],
  "Irelia": ["TOP", "MID"],
  "Janna": ["SUPPORT"],
  "Jax": ["TOP", "JUNGLE"],
  "Jinx": ["ADC"],
  "Karma": ["SUPPORT", "MID"],
  "Katarina": ["MID"],
  "Kayn": ["JUNGLE"],
  "LeBlanc": ["MID"],
  "Lee Sin": ["JUNGLE"],
  "Leona": ["SUPPORT"],
  "Lux": ["MID", "SUPPORT"],
  "Malphite": ["TOP", "SUPPORT"],
  "Master Yi": ["JUNGLE"],
  "Miss Fortune": ["ADC"],
  "Morgana": ["SUPPORT", "MID"],
  "Nami": ["SUPPORT"],
  "Nautilus": ["SUPPORT"],
  "Orianna": ["MID"],
  "Pyke": ["SUPPORT"],
  "Rakan": ["SUPPORT"],
  "Renekton": ["TOP"],
  "Riven": ["TOP"],
  "Senna": ["ADC", "SUPPORT"],
  "Seraphine": ["SUPPORT", "MID"],
  "Sett": ["TOP", "SUPPORT"],
  "Shen": ["TOP", "SUPPORT"],
  "Sivir": ["ADC"],
  "Sona": ["SUPPORT"],
  "Soraka": ["SUPPORT"],
  "Syndra": ["MID"],
  "Thresh": ["SUPPORT"],
  "Tristana": ["ADC"],
  "Twisted Fate": ["MID"],
  "Twitch": ["ADC"],
  "Varus": ["ADC"],
  "Vayne": ["ADC"],
  "Veigar": ["MID"],
  "Vi": ["JUNGLE"],
  "Viktor": ["MID"],
  "Warwick": ["JUNGLE"],
  "Xayah": ["ADC"],
  "Xerath": ["MID", "SUPPORT"],
  "Yasuo": ["MID", "TOP"],
  "Yone": ["MID", "TOP"],
  "Yuumi": ["SUPPORT"],
  "Zed": ["MID"],
  "Ziggs": ["MID", "ADC"],
  "Zoe": ["MID"],
  "Zyra": ["SUPPORT"],
};

// Generate realistic mock statistics for champions
function generateChampionStats(championName: string, role: string) {
  // Use champion name for consistent randomization
  const seed = championName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const roleSeed = role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate consistent but varied stats
  const baseWinrate = 48 + ((seed + roleSeed) % 8); // 48-56%
  const variance = ((seed * roleSeed) % 10) / 10; // 0-1
  
  return {
    championName,
    role,
    winRate: Number((baseWinrate + variance).toFixed(2)),
    pickRate: Number((2 + ((seed % 15)) / 10).toFixed(2)),
    banRate: Number((1 + ((seed % 20)) / 10).toFixed(2)),
    matches: 5000 + (seed * 100) % 10000,
    kda: Number((2.5 + ((seed % 15) / 10)).toFixed(2)),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role')?.toUpperCase();
    const championName = searchParams.get('champion');

    // Get current patch version from Data Dragon
    const versionsResponse = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    const currentPatch = versionsResponse.data[0];

    // Get all champions data
    const championsResponse = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/data/en_US/champion.json`
      // https://ddragon.leagueoflegends.com/cdn/15.22.1/data/en_US/champion.json
    );
    
    const championsData = championsResponse.data.data;
    const championsList: any[] = [];

    // Generate stats for each champion
    for (const [key, champion] of Object.entries(championsData)) {
      const champ = champion as any;
      const roles = CHAMPION_ROLES[champ.name] || ['TOP']; // Default to TOP if not found
      
      // Filter by champion name if provided
      if (championName && !champ.name.toLowerCase().includes(championName.toLowerCase())) {
        continue;
      }

      // Filter by role if provided, or generate for all roles
      const rolesToGenerate = role ? (roles.includes(role) ? [role] : []) : roles;

      for (const championRole of rolesToGenerate) {
        const stats = generateChampionStats(champ.name, championRole);
        championsList.push({
          id: champ.id,
          name: champ.name,
          title: champ.title,
          image: `https://ddragon.leagueoflegends.com/cdn/${currentPatch}/img/champion/${champ.id}.png`,
          ...stats,
        });
      }
    }

    // Sort by win rate descending
    championsList.sort((a, b) => b.winRate - a.winRate);

    return NextResponse.json({
      patch: currentPatch,
      champions: championsList,
      totalChampions: championsList.length,
      filters: {
        role: role || 'ALL',
        champion: championName || null,
      },
    });
  } catch (error) {
    console.error('Champions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion statistics' },
      { status: 500 }
    );
  }
}
