import { itemstft } from "./itemstft";

export const PLATFORM_TO_REGION: Record<string, string> = {
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

// TFT DTOs based on Riot API documentation
export interface MetadataDto {
  data_version: string;
  match_id: string;
  participants: string[];
}

export interface TraitDto {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

export interface UnitDto {
  items: number[];
  character_id: string;
  itemNames: string[];
  chosen?: string;
  name: string;
  rarity: number;
  tier: number;
}

export interface CompanionDto {
  content_ID: string;
  item_ID: number;
  skin_ID: number;
  species: string;
}

export interface ParticipantDto {
  companion: CompanionDto;
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: TraitDto[];
  units: UnitDto[];
  win: boolean;
}

export interface InfoDto {
  endOfGameResult: string;
  gameCreation: number;
  gameId: number;
  game_datetime: number;
  game_length: number;
  game_version: string;
  game_variation?: string;
  mapId: number;
  participants: ParticipantDto[];
  queue_id: number;
  tft_game_type: string;
  tft_set_core_name: string;
  tft_set_number: number;
}

export interface MatchDto {
  metadata: MetadataDto;
  info: InfoDto;
}

export interface RankedDto {
  summonerId: string;
  summonerName: string;
  queueType: string;
  ratedTier?: string;
  ratedRating?: number;
  tier?: string;
  rank?: string;
  leaguePoints?: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  companion?: CompanionDto;
}

export const getTFTUnitIcon = (characterId: string, tft_set_number: number) => {

  const id = characterId.toLowerCase();
  const setNumber = `tft_set${tft_set_number}`;
  // console.log('Getting icon for:', id, 'Set:', );
  // console.log(`https://raw.communitydragon.org/latest/game/assets/characters/${id}/hud/${id}_square.${setNumber}.png`);
  return `https://raw.communitydragon.org/latest/game/assets/characters/${id}/hud/${id}_square.${setNumber}.png`;
};

export const getTFTUnitSplash = (characterId: string, tft_set_number: number) => {
  const id = characterId.toLowerCase();
  const setNumber = `tft_set${tft_set_number}`;
  return `https://raw.communitydragon.org/latest/game/assets/characters/${id}/skins/base/images/${id}_splash_tile_0.${setNumber}.png`;
};
export const getTFTUnitIconOutdated = (characterId: string, tft_set_number: number) => {
  
  const baseName = characterId.replace(/^TFT\d+_/i, '').toLowerCase(); // 'Anivia'
  const setNumber = `tft_set${tft_set_number}`;          // 'tft_set16'
  // console.log('Getting icon for:', baseName, 'Set:', tft_set_number);
  // console.log(`https://raw.communitydragon.org/latest/game/assets/characters/${baseName}/hud/${baseName}_square.png`);
  return `https://raw.communitydragon.org/latest/game/assets/characters/${baseName}/hud/${baseName}_square.png`;
  
};

export const getTFTTraitIcon = (trait: string) => {
  const traitKey = trait.toLowerCase().replace(/\s+/g, '');
  return `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_16_${traitKey}.png`;
};

const ITEM_MAPPING: Record<string, string> = itemstft.reduce((acc, item) => {
  acc[item.id] = item.path || 'tft_item_emptybag.tft_set13.png';
  acc[item.name] = item.path || 'tft_item_emptybag.tft_set13.png';
  return acc;
}, {} as Record<string, string>);

export const getTFTItemIcon = (itemName: string) => {
  if (ITEM_MAPPING[itemName]) {
    return `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/${ITEM_MAPPING[itemName]}`;
  }
  return 'https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_emptybag.tft_set13.png';
}

// export const getTFTTraitIcon = (traitId: string, setNumber?: number) => {
//   if (setNumber) {
//     const traitName = traitId.toLowerCase().replace(new RegExp(`tft${setNumber}_`, 'i'), '');
//     return `https://raw.communitydragon.org/latest/game/assets/ux/traiticons/trait_icon_${setNumber}_${traitName}.png`;
//   }
//   const name = traitId.toLowerCase();
//   return `https://raw.communitydragon.org/latest/game/assets/ux/tft/traits/${name}.png`;
// };

export const formatGameDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
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

export const getPlacementColor = (placement: number) => {
  if (placement === 1) return "text-yellow-500";
  if (placement === 2) return "text-slate-300";
  if (placement === 3) return "text-orange-400";
  if (placement <= 4) return "text-orange-400";
  return "text-zinc-400";
};

export const getPlacementBg = (placement: number) => {
  if (placement === 1) return "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:border-yellow-500/70";
   if (placement === 2) return "bg-slate-500/20 border-slate-500/50 shadow-[0_0_10px_rgba(148,163,184,0.1)] hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] hover:border-slate-500/70";
   if (placement === 3) return "bg-orange-800/10 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:border-orange-500/70";
  if (placement <= 4) return "bg-orange-500/10 border-orange-500/50 hover:border-orange-500/70";
  return "bg-zinc-900/50 border-zinc-800  hover:border-zinc-700";
};

export const getRankIcon = (tier: string | undefined, queueType?: string) => {
  if (!tier) return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png';
  
  const tierLower = tier.toLowerCase();

  // Handle Hyper Roll (Turbo) badges
  if (queueType === 'RANKED_TFT_TURBO') {
    const turboTiers: Record<string, string> = {
      'gray': 'gray',
      'green': 'green',
      'blue': 'blue',
      'purple': 'purple',
      'orange': 'hyper',
      'hyper': 'hyper'
    };
    const badge = turboTiers[tierLower] || 'gray';
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/tft/turbobadge/tft_turbo_badge_${badge}.png`;
  }

  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${tierLower}.png`;
};
export const getQueueName = (queueId: number) => {
  const queues: Record<number, string> = {
    1090: "Normal",
    1100: "Ranked",
    1110: "Tutorial",
    1130: "Hyper Roll",
    1150: "Double Up",
    1160: "Double Up",
  };
  return queues[queueId] || "TFT Match";
};

export const convertRoundToStage = (round: number): string => {

  if (round <= 4) {
    return `1-${round}`;

  }
  const roundSinceStage2 = round - 4;
  const stage = Math.floor((roundSinceStage2 - 1) / 7) + 2;
  const roundInStage = ((roundSinceStage2 - 1) % 7) + 1;
  return `${stage}-${roundInStage}`;

};

export const getTFTCompanionIcon = (skinId: number) => {
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/companions/${skinId}.png`;

};

export const getQueueDisplayName = (queueType: string) => {
  const names: Record<string, string> = {
    'RANKED_TFT': 'Ranked',
    'RANKED_TFT_TURBO': 'Hyper Roll',
    'RANKED_TFT_DOUBLE_UP': 'Double Up',
  };
  return names[queueType] || 'Standard';
};
