import { Match, MatchParticipant } from "@/types/lolInterfaces";

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
    };
    return queues[queueId] || "Custom Game";
  };

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
      return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png';
    }
    const tierLower = tier.toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${tierLower}.png`;
  };

 export const getQueueTypeName = (queueType: string) => {
    const names: Record<string, string> = {
      'RANKED_SOLO_5x5': 'Ranked Solo/Duo',
      'RANKED_FLEX_SR': 'Ranked Flex',
      'RANKED_TFT': 'Ranked TFT',
    };
    return names[queueType] || queueType;
  };
