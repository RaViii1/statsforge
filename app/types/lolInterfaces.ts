// League of Legends TypeScript Interfaces

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface MatchParticipant {
  puuid: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagline: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  teamId: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  perks?: {
    styles: Array<{
      selections: Array<{
        perk: number;
      }>;
    }>;
    statPerks: {
        defense: number;
        flex: number;
        offense: number;
    };
  };
  playerAugment1?: number;
  playerAugment2?: number;
  playerAugment3?: number;
  playerAugment4?: number;
  playerAugment5?: number;
  playerSubteamId?: number;
  subteamPlacement?: number;
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  participants: MatchParticipant[];
  gameEndedInEarlySurrender?: boolean;
  gameEndedInSurrender?: boolean;
  teams: Array<{
    teamId: number;}>;
}

export interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
}

export interface MatchHistory {
  matches: Match[];
  totalMatches: number;
}

export interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
}

export interface RankedEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
}
