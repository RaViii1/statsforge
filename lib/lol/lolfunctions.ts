import { Match, MatchParticipant } from "@/app/types/lolInterfaces";

 export const formatGameDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

 export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

export const getQueueName = (queueId: number) => {
  const queues: Record<number, string> = {
    420: "Ranked Solo/Duo",
    440: "Ranked Flex",
    450: "ARAM",
    400: "Normal Draft",
    430: "Normal Blind",
    490: "Normal Quickplay",
    1700: "Arena",
    1710: "Arena",
    900: "ARURF",
    62: "ARAM",
    63: "ARAM",
    64: "ARAM",
    65: "ARAM",
    // Clash modes
    700: "Clash",
    701: "Clash",
    720: "Clash (ARAM)",
    740: "Clash (ARURF)",
    741: "Clash (ARURF)",
    // Doom Bots modes
    4200: "Doom Bots 5v5",
    // Nexus Blitz
    2400: "ARAM: Mayhem",
    1200: "Nexus Blitz",
    1300: "Nexus Blitz",
    3270: "ARAM: Mayhem",
    1400: "Ultimate Spellbook",
    1900: "Ultra rapid Fire",
  
  };
  return queues[queueId] || "Custom Game";
};

export const isGamemodeWithoutRoles = (queueId: number): boolean => {
  if ([450, 900, 1700, 1710, 4200, 2400, 3270].includes(queueId)) {
    return true;
  }else{
    return false;
  }
}

export const getRoleIcon = (role: string): string => {
  const baseUrl = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/svg/";
  const roleMap: Record<string, string> = {
    top: "position-top.svg",
    jungle: "position-jungle.svg",
    mid: "position-middle.svg",
    adc: "position-bottom.svg",
    support: "position-utility.svg",
    unknown: "position-fill.svg"
  };
  return baseUrl + (roleMap[role] || roleMap.unknown);
}

export const determineRole = (player: any): string => {
  const lane = player.lane || player.teamPosition || "";
  const position = player.teamPosition || player.individualPosition || "";
  
  // Map API positions to role names
  if (position === "TOP" || lane === "TOP") return "top";
  if (position === "JUNGLE" || lane === "JUNGLE") return "jungle";
  if (position === "MIDDLE" || lane === "MIDDLE" || lane === "MID") return "mid";
  if (position === "BOTTOM" || lane === "BOTTOM") return "adc";
  if (position === "UTILITY" || lane === "UTILITY") return "support";
  
  return "unknown";
}

export function getTeamIcon(teamId: number): string {
    // Base URL fragment for all specific team icons
    const baseIconPath = "https://raw.communitydragon.org/latest/game/assets/ux/cherry/teamicons/";

    // Handle traditional LoL 5v5 team IDs (100 and 200) as primary check
    if (teamId === 100) {
        return baseIconPath + "teamsentinels.png";
    }
    if (teamId === 200) {
        return baseIconPath + "teamraptors.png";
    }

    // Map Arena Subteam IDs (1-8) to their specific icons
    switch (teamId) {
        case 1: // Team Poro
            return baseIconPath + "teamporos.png";
        case 2: // Team Minion
            return baseIconPath + "teamminions.png";
        case 3: // Team Scuttle
            return baseIconPath + "teamscuttles.png";
        case 4: // Team Krug
            return baseIconPath + "teamkrugs.png";
        case 5: // Team Raptor
            return baseIconPath + "teamraptors.png";
        case 6: // Team Sentinel
            return baseIconPath + "teamsentinel.png";
        case 7: // Team Wolf (Murk Wolf)
            return baseIconPath + "teamwolves.png";
        case 8: // Team Gromp
            return baseIconPath + "teamgromp.png";
        default:
            // Fallback for an unknown or unassigned team ID
            return baseIconPath + "teamgromp.png"; 
    }
}

export function getArenaTeamName(teamId: number): string {
    switch (teamId) {
        case 1:
            return "Team Poro";
        case 2:
            return "Team Minion";
        case 3:
            return "Team Scuttle";
        case 4:
            return "Team Krug";
        case 5:
            return "Team Raptor";
        case 6:
            return "Team Sentinel";
        case 7:
            return "Team Wolf";
        case 8:
            return "Team Gromp";
        default:
            return "Unknown Team";
    }
}

export function formatGamenametoNameandTagline(gamename?: string | "noname") {
  if (gamename?.includes('#')) {
    const parts = gamename.split('#');
    return { 
      liveGameParticipantGameName: parts[0] ?? "unknown", 
      liveGameTagLine: parts[1] ?? "unknown" 
    };
  }
  return { 
    liveGameParticipantGameName: "unknown", 
    liveGameTagLine: "unknown" 
  };
}
 export const isRemake = (match: Match) => {
    return match.info.gameDuration < 300 || (
      match.info.gameEndedInEarlySurrender || 
      match.info.gameEndedInSurrender
    );
  };

 export const isArena = (queueId: number) => {
    return queueId === 1700 || queueId === 1710;
  };

   export const formatCSDisplay = (match: Match, participant: MatchParticipant) => {
    const totalCS = participant.totalMinionsKilled + participant.neutralMinionsKilled;
    const gameDurationMin = match.info.gameDuration / 60;
    
    // For very short games (under 5 min) or remakes, don't show CS/min
    if (gameDurationMin < 5 || isRemake(match)) {
      return {
        totalCS,
        csPerMin: null,
        showFlame: false
      };
    }
    
    const csPerMin = totalCS / gameDurationMin;
    const showFlame = csPerMin > 10.0;
    
    return {
      totalCS,
      csPerMin: csPerMin.toFixed(1),
      showFlame
    };
  };


  export const getRankIcon = (tier: string | undefined) => {
    if (tier === null || !tier) {
      return '/images/ranks/unranked.png';
    }
    const tierCapitalized = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
    return `/images/ranks/${tierCapitalized}.png`;
  };

  export const getChampionSplashByName = (championName: string) => {
        if (championName === null || !championName) {
      return 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/akshan/skins/base/images/akshan_splash_centered_0.jpg';

    }
    else{
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${championName}/skins/base/images/${championName}_splash_centered_0.jpg`;
    }
  }

 export const getQueueTypeName = (queueType: string) => {
    const names: Record<string, string> = {
      'RANKED_SOLO_5x5': 'Ranked Solo/Duo',
      'RANKED_FLEX_SR': 'Ranked Flex',
      'RANKED_TFT': 'Ranked TFT',
    };
    return names[queueType] || queueType;
  };
