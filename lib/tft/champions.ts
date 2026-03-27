import { TFTItem } from "./itemstft";

export interface TFTSet {
  id: number;
  name: string;
  set_number: number;
  is_active: boolean;
  patch_start?: string;
  patch_end?: string;
  created_at?: string;
}

export interface TFTTrait {
  id: string;
  name: string;
  tiers?: TFTTraitTier[];
  description: string;
  icon_path: string;
  set_id?: number;
  champions?: any[];
  is_Hero?: boolean;
  riot_api_name?: string;
  tft_trait_tiers?: TFTTraitTier[];
}

export interface TFTTraitTier {
  id?: number | string;
  trait_id?: string;
  tier: string;
  units_required: number;
  description: string;
  stats?: any;
}


export interface TFTChampion {
  id: string;
  name: string;
  cost: number;
  set_id?: number;
  ability?: {
    name: string,
    description?: {
      passive?: string,
      active?: string,
    },
    damage?: string,
    heal?: string,
    shield?: string,
    stun?: string,
    attackspeed?: string,
    damageReduction?: string,
    special?: string,
  };
  tft_champion_best_items?: TFTItem[];
  image_path?: string;
  stats?: {
    stars: [
      { hp: number, dmg: number, ap: number, armor: number, mr: number, crit: number },
      { hp: number, dmg: number, ap: number, armor: number, mr: number, crit: number },
      { hp: number, dmg: number, ap: number, armor: number, mr: number, crit: number },
    ],
    speed: number,
    mana: number,
    range: number,
  };
  traits: string[];
  trait_details?: TFTTrait[];
  teamcomps?: Array<{
    id: string;
    name: string;
    description?: string;
    patch?: string;
    tier?: string;
    difficulty?: string;
    set_id?: number;
    mainCarryIds?: string[];
    synergiesList?: string[];
    activePresetId?: string;
    phases?: {
      early: { units: any[]; notes: string };
      mid: { units: any[]; notes: string };
      final: { units: any[]; notes: string };
    };
    levelingSteps?: Array<{
      level: number;
      stage: string;
      gold: string;
      description: string;
    }>;
  }>;
}

export const getCostColor = (cost: number): string => {
  switch (cost) {
    case 1: return '#94a3b8';
    case 2: return '#108f6d';
    case 3: return '#3b82f6';
    case 4: return '#a855f7';
    case 5: return '#eab308';
    case 6: return '#ef4444';
    case 7: return '#f97316';
    default: return '#94a3b8';
  }
};


export const getCostBorderColor = (cost: number): string => {
  switch (cost) {
    case 1: return 'border-zinc-400';
    case 2: return 'border-emerald-500';
    case 3: return 'border-blue-500';
    case 4: return 'border-purple-500';
    case 5: return 'border-yellow-500';
    case 6: return 'border-red-500';
    case 7: return 'border-orange-600';
    default: return 'border-zinc-400';
  }
};

export const CurrentSetNumber = 16;
