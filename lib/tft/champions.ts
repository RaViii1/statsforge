import { TFTItem } from "./itemstft";

export interface TFTChampion {
  id: string;
  name: string;
  cost: number;
  set?: number;
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
  bestItems?: TFTItem[];
  image?: string;
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
}


export const getChampionById = (characterId: string): TFTChampion | undefined => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId);
};

export const getChampionCost = (characterId: string): number => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId)?.cost || 1;
};

export const getChampionBestItems = (characterId: string): TFTItem[] => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId)?.bestItems || [];
};

export const getChampionStats = (characterId: string): TFTChampion['stats'] | undefined => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId)?.stats;
};

export const getChampionAbility = (characterId: string): TFTChampion['ability'] => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId)?.ability
}

export const getCostColor = (cost: number): string => {
  switch (cost) {
    case 1: return '#94a3b8';
    case 2: return '#10b981';
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


export const SET_16_CHAMPIONS: TFTChampion[] = [
  // 1-cost
  {
    id: 'TFT16_Anivia',
    name: 'Anivia',
    set: 16,
    cost: 1,
    traits: ['Freljord', 'Invoker'],
    ability: {name: 'Glacial Storm', description:{active:"Fire an ice shard at target that deals 325/455/650 (Ability power) magic damage. If they are Chilled, the damage Critically Strikes."}},
    bestItems: [
      { id: 'TFT_Item_RabadonsDeathcap', stats: '+50 AP', description: '', name: 'Rabadons Deathcap' },
      { id: 'TFT_Item_ArchangelsStaff', stats: '+20 AP, +15 Mana', description: '', name: 'Archangels Staff' },
      { id: 'TFT_Item_JeweledGauntlet', stats: '+35 AP, +15% Crit', description: '', name: 'Jeweled Gauntlet' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 500, dmg: 40, ap: 40, armor: 20, mr: 20, crit: 25 },
        { hp: 900, dmg: 60, ap: 60, armor: 20, mr: 20, crit: 25 },
        { hp: 1620, dmg: 90, ap: 90, armor: 20, mr: 20, crit: 25 },
      ],
      speed: 0.65,
      mana: 60,
      range: 4,
    },
  },
  {
    id: 'TFT16_Blitzcrank',
    name: 'Blitzcrank',
    set: 16,
    cost: 1,
    traits: ['Zaun', 'Juggernaut'],
    ability: {name: 'Rocket Grab'},
    bestItems: [
      { id: 'TFT_Item_WarmogsArmor', stats: '+150 HP, +150 HP', description: '', name: 'Warmogs Armor' },
      { id: 'TFT_Item_GargoyleStoneplate', stats: '+20 Armor, +20 MR', description: '', name: 'Gargoyle Stoneplate' },
      { id: 'TFT_Item_DragonsClaw', stats: '+300 HP, x2 MR', description: '', name: 'Dragons Claw' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 650, dmg: 50, ap: 0, armor: 35, mr: 35, crit: 25 },
        { hp: 1170, dmg: 75, ap: 0, armor: 35, mr: 35, crit: 25 },
        { hp: 2106, dmg: 113, ap: 0, armor: 35, mr: 35, crit: 25 },
      ],
      speed: 0.6,
      mana: 120,
      range: 1,
    },
  },
  {
    id: 'TFT16_Briar',
    name: 'Briar',
    set: 16,
    cost: 1,
    traits: ['Noxus', 'Slayer', 'Juggernaut'],
    ability: {name: 'Blood Frenzy'},
    bestItems: [
      { id: 'TFT_Item_Bloodthirster', stats: '+20 AD, +20% Omnivamp', description: '', name: 'Bloodthirster' },
      { id: 'TFT_Item_TitansResolve', stats: '+20 AD, +20 Armor', description: '', name: 'Titans Resolve' },
      { id: 'TFT_Item_Deathblade', stats: '+55 AD', description: '', name: 'Deathblade' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 600, dmg: 55, ap: 0, armor: 30, mr: 30, crit: 25 },
        { hp: 1080, dmg: 83, ap: 0, armor: 30, mr: 30, crit: 25 },
        { hp: 1944, dmg: 124, ap: 0, armor: 30, mr: 30, crit: 25 },
      ],
      speed: 0.7,
      mana: 50,
      range: 1,
    },
  },
  {
    id: 'TFT16_Caitlyn',
    name: 'Caitlyn',
    set: 16,
    cost: 1,
    traits: ['Piltover', 'Longshot'],
    ability: {name: 'Ace in the Hole'},
    bestItems: [
      { id: 'TFT_Item_InfinityEdge', stats: '+35 AD, +35% Crit', description: '', name: 'Infinity Edge' },
      { id: 'TFT_Item_LastWhisper', stats: '+25 AD, +25% AS', description: '', name: 'Last Whisper' },
      { id: 'TFT_Item_GiantSlayer', stats: '+25 AD, +10% AS', description: '', name: 'Giant Slayer' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 500, dmg: 55, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 900, dmg: 83, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 1620, dmg: 124, ap: 0, armor: 15, mr: 15, crit: 25 },
      ],
      speed: 0.75,
      mana: 100,
      range: 5,
    },
  },
  {
    id: 'TFT16_Illaoi',
    name: 'Illaoi',
    set: 16,
    cost: 1,
    traits: ['Bilgewater', 'Bruiser'],
    ability: {name: 'Tentacle Smash'},
    bestItems: [
      { id: 'TFT_Item_WarmogsArmor', stats: '+150 HP, +150 HP', description: '', name: 'Warmogs Armor' },
      { id: 'TFT_Item_BrambleVest', stats: '+55 Armor', description: '', name: 'Bramble Vest' },
      { id: 'TFT_Item_DragonsClaw', stats: '+300 HP, x2 MR', description: '', name: 'Dragons Claw' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 700, dmg: 60, ap: 0, armor: 40, mr: 25, crit: 25 },
        { hp: 1260, dmg: 90, ap: 0, armor: 40, mr: 25, crit: 25 },
        { hp: 2268, dmg: 135, ap: 0, armor: 40, mr: 25, crit: 25 },
      ],
      speed: 0.6,
      mana: 100,
      range: 1,
    },
  },
  {
    id: 'TFT16_JarvanIV',
    name: 'Jarvan IV',
    set: 16,
    cost: 1,
    traits: ['Demacia', 'Defender'],
    ability: {name: 'Cataclysm'},
    bestItems: [
      { id: 'TFT_Item_GargoyleStoneplate', stats: '+20 Armor, +20 MR', description: '', name: 'Gargoyle Stoneplate' },
      { id: 'TFT_Item_WarmogsArmor', stats: '+150 HP, +150 HP', description: '', name: 'Warmogs Armor' },
      { id: 'TFT_Item_BrambleVest', stats: '+55 Armor', description: '', name: 'Bramble Vest' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 650, dmg: 50, ap: 0, armor: 40, mr: 40, crit: 25 },
        { hp: 1170, dmg: 75, ap: 0, armor: 40, mr: 40, crit: 25 },
        { hp: 2106, dmg: 113, ap: 0, armor: 40, mr: 40, crit: 25 },
      ],
      speed: 0.55,
      mana: 80,
      range: 1,
    },
  },
  {
    id: 'TFT16_Jhin',
    name: 'Jhin',
    set: 16,
    cost: 1,
    traits: ['Ionia', 'Gunslinger'],
    ability: {name: 'Curtain Call', description:{passive:"For the next 4 attacks, Jhin gains infinite range and replace attacks with a cannon shot. Cannon shots deal physical damage. The 4th shot deals 1.44% more damage.", active:"125/190/280 + 15/22/34 (AD & AP)" }, damage:"125/190/280 + 15/22/34 (AD & AP)" },
    bestItems: [
      { id: 'TFT_Item_InfinityEdge', stats: '+35 AD, +35% Crit', description: '', name: 'Infinity Edge' },
      { id: 'TFT_Item_Deathblade', stats: '+55 AD', description: '', name: 'Deathblade' },
      { id: 'TFT_Item_LastWhisper', stats: '+25 AD, +25% AS', description: '', name: 'Last Whisper' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 500, dmg: 70, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 900, dmg: 105, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 1620, dmg: 158, ap: 0, armor: 15, mr: 15, crit: 25 },
      ],
      speed: 0.85,
      mana: 70,
      range: 4,
    },
  },
  {
    id: 'TFT16_KogMaw',
    name: "Kog'Maw",
    set: 16,
    cost: 1,
    traits: ['Void', 'Arcanist', 'Longshot'],
    ability: {name: 'Living Artillery'},
    bestItems: [
      { id: 'TFT_Item_GuinsoosRageblade', stats: '+10 AD, +10% AS', description: '', name: 'Guinsoos Rageblade' },
      { id: 'TFT_Item_GiantSlayer', stats: '+25 AD, +10% AS', description: '', name: 'Giant Slayer' },
      { id: 'TFT_Item_RabadonsDeathcap', stats: '+50 AP', description: '', name: 'Rabadons Deathcap' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 450, dmg: 45, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 810, dmg: 68, ap: 0, armor: 15, mr: 15, crit: 25 },
        { hp: 1458, dmg: 101, ap: 0, armor: 15, mr: 15, crit: 25 },
      ],
      speed: 0.7,
      mana: 50,
      range: 4,
    },
  },
  {
    id: 'TFT16_Lulu',
    name: 'Lulu',
    set: 16,
    cost: 1,
    traits: ['Yordle', 'Arcanist'],
    ability: {name: 'Wild Growth'},
    bestItems: [
      { id: 'TFT_Item_SpearOfShojin', stats: '+20 AD, +15 Mana', description: '', name: 'Spear of Shojin' },
      { id: 'TFT_Item_Morellonomicon', stats: '+25 AP, +150 HP', description: '', name: 'Morellonomicon' },
      { id: 'TFT_Item_ArchangelsStaff', stats: '+20 AP, +15 Mana', description: '', name: 'Archangels Staff' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 500, dmg: 35, ap: 0, armor: 15, mr: 20, crit: 25 },
        { hp: 900, dmg: 53, ap: 0, armor: 15, mr: 20, crit: 25 },
        { hp: 1620, dmg: 79, ap: 0, armor: 15, mr: 20, crit: 25 },
      ],
      speed: 0.65,
      mana: 60,
      range: 4,
    },
  },
  {
    id: 'TFT16_Qiyana',
    name: 'Qiyana',
    set: 16,
    cost: 1,
    traits: ['Ixtal', 'Slayer'],
    ability: {name: 'Elemental Wrath'},
    bestItems: [
      { id: 'TFT_Item_Deathblade', stats: '+55 AD', description: '', name: 'Deathblade' },
      { id: 'TFT_Item_Bloodthirster', stats: '+20 AD, +20% Omnivamp', description: '', name: 'Bloodthirster' },
      { id: 'TFT_Item_InfinityEdge', stats: '+35 AD, +35% Crit', description: '', name: 'Infinity Edge' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 550, dmg: 55, ap: 0, armor: 25, mr: 25, crit: 25 },
        { hp: 990, dmg: 83, ap: 0, armor: 25, mr: 25, crit: 25 },
        { hp: 1782, dmg: 124, ap: 0, armor: 25, mr: 25, crit: 25 },
      ],
      speed: 0.75,
      mana: 70,
      range: 1,
    },
  },
  {
    id: 'TFT16_Rumble',
    name: 'Rumble',
    set: 16,
    cost: 1,
    traits: ['Yordle', 'Defender'],
    ability: {name: 'Flamespitter'},
    bestItems: [
      { id: 'TFT_Item_WarmogsArmor', stats: '+150 HP, +150 HP', description: '', name: 'Warmogs Armor' },
      { id: 'TFT_Item_GargoyleStoneplate', stats: '+20 Armor, +20 MR', description: '', name: 'Gargoyle Stoneplate' },
      { id: 'TFT_Item_DragonsClaw', stats: '+300 HP, x2 MR', description: '', name: 'Dragons Claw' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 700, dmg: 45, ap: 0, armor: 45, mr: 45, crit: 25 },
        { hp: 1260, dmg: 68, ap: 0, armor: 45, mr: 45, crit: 25 },
        { hp: 2268, dmg: 101, ap: 0, armor: 45, mr: 45, crit: 25 },
      ],
      speed: 0.5,
      mana: 80,
      range: 1,
    },
  },
  {
    id: 'TFT16_Shen',
    name: 'Shen',
    set: 16,
    cost: 1,
    traits: ['Ionia', 'Bruiser'],
    ability: {name: 'Spirit Blade'},
    bestItems: [
      { id: 'TFT_Item_GargoyleStoneplate', stats: '+20 Armor, +20 MR', description: '', name: 'Gargoyle Stoneplate' },
      { id: 'TFT_Item_WarmogsArmor', stats: '+150 HP, +150 HP', description: '', name: 'Warmogs Armor' },
      { id: 'TFT_Item_BrambleVest', stats: '+55 Armor', description: '', name: 'Bramble Vest' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 700, dmg: 55, ap: 0, armor: 40, mr: 40, crit: 25 },
        { hp: 1260, dmg: 83, ap: 0, armor: 40, mr: 40, crit: 25 },
        { hp: 2268, dmg: 124, ap: 0, armor: 40, mr: 40, crit: 25 },
      ],
      speed: 0.6,
      mana: 100,
      range: 1,
    },
  },
  {
    id: 'TFT16_Sona',
    name: 'Sona',
    set: 16,
    cost: 1,
    traits: ['Demacia', 'Invoker'],
    ability: {name: 'Crescendo'},
    bestItems: [
      { id: 'TFT_Item_SpearOfShojin', stats: '+20 AD, +15 Mana', description: '', name: 'Spear of Shojin' },
      { id: 'TFT_Item_ArchangelsStaff', stats: '+20 AP, +15 Mana', description: '', name: 'Archangels Staff' },
      { id: 'TFT_Item_Morellonomicon', stats: '+25 AP, +150 HP', description: '', name: 'Morellonomicon' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 500, dmg: 35, ap: 0, armor: 15, mr: 20, crit: 25 },
        { hp: 900, dmg: 53, ap: 0, armor: 15, mr: 20, crit: 25 },
        { hp: 1620, dmg: 79, ap: 0, armor: 15, mr: 20, crit: 25 },
      ],
      speed: 0.65,
      mana: 50,
      range: 4,
    },
  },
  {
    id: 'TFT16_Viego',
    name: 'Viego',
    set: 16,
    cost: 1,
    traits: ['Shadow Isles', 'Quickstriker'],
    ability: {name: 'Spectral Maw'},
    bestItems: [
      { id: 'TFT_Item_Bloodthirster', stats: '+20 AD, +20% Omnivamp', description: '', name: 'Bloodthirster' },
      { id: 'TFT_Item_Quicksilver', stats: '+20 AD, +20% AS', description: '', name: 'Quicksilver' },
      { id: 'TFT_Item_InfinityEdge', stats: '+35 AD, +35% Crit', description: '', name: 'Infinity Edge' }
    ],
    image: '',
    stats: {
      stars: [
        { hp: 550, dmg: 60, ap: 0, armor: 25, mr: 25, crit: 25 },
        { hp: 990, dmg: 90, ap: 0, armor: 25, mr: 25, crit: 25 },
        { hp: 1782, dmg: 135, ap: 0, armor: 25, mr: 25, crit: 25 },
      ],
      speed: 0.75,
      mana: 40,
      range: 1,
    },
  },

  // 2-cost
  { id: 'TFT16_Aphelios', name: 'Aphelios', cost: 2, traits: ['Targon'] },
  { id: 'TFT16_Ashe',     name: 'Ashe',    cost: 2, traits: ['Freljord', 'Quickstriker'] },
  { id: 'TFT16_Bard',     name: 'Bard',    cost: 2, traits: ['Caretaker'] },
  { id: 'TFT16_ChoGath',  name: 'Cho\'Gath',cost:2, traits: ['Void', 'Juggernaut'] },
  { id: 'TFT16_Ekko',     name: 'Ekko',    cost: 2, traits: ['Zaun', 'Disruptor'] },
  { id: 'TFT16_Graves',   name: 'Graves',  cost: 2, traits: ['Bilgewater', 'Gunslinger'] },
  { id: 'TFT16_Neeko',    name: 'Neeko',   cost: 2, traits: ['Ixtal', 'Arcanist', 'Defender'] },
  { id: 'TFT16_Orianna',  name: 'Orianna', cost: 2, traits: ['Piltover', 'Invoker'] },
  { id: 'TFT16_Poppy',    name: 'Poppy',   cost: 2, traits: ['Demacia', 'Yordle', 'Juggernaut'] },
  { id: 'TFT16_RekSai',   name: 'Rek\'Sai',cost: 2, traits: ['Void', 'Vanquisher'] },
  { id: 'TFT16_Sion',     name: 'Sion',    cost: 2, traits: ['Noxus', 'Bruiser'] },
  { id: 'TFT16_Teemo',    name: 'Teemo',   cost: 2, traits: ['Yordle', 'Longshot'] },
  { id: 'TFT16_Tristana', name: 'Tristana',cost: 2, traits: ['Yordle', 'Gunslinger'] },
  { id: 'TFT16_Tryndamere',name:'Tryndamere',cost:2,traits:['Freljord', 'Slayer'] },
  { id: 'TFT16_TwistedFate',name:'Twisted Fate',cost:2,traits:['Bilgewater','Quickstriker'] },
  { id: 'TFT16_Vi',       name: 'Vi',      cost: 2, traits: ['Piltover', 'Zaun', 'Defender'] },
  { id: 'TFT16_XinZhao',  name: 'Xin Zhao',cost: 2, traits: ['Demacia', 'Ionia', 'Warden'] },
  { id: 'TFT16_Yasuo',    name: 'Yasuo',   cost: 2, traits: ['Ionia', 'Slayer'] },
  { id: 'TFT16_Yorick',   name: 'Yorick',  cost: 2, traits: ['Shadow Isles', 'Warden'] },

  // 3-cost
  { id: 'TFT16_Ahri',     name: 'Ahri',    cost: 3, traits: ['Ionia', 'Arcanist'] },
  { id: 'TFT16_Darius',   name: 'Darius',  cost: 3, traits: ['Noxus', 'Defender'] },
  { id: 'TFT16_DrMundo',  name: 'Dr Mundo',cost: 3, traits: ['Zaun', 'Bruiser'] },
  { id: 'TFT16_Draven',   name: 'Draven',  cost: 3, traits: ['Noxus', 'Quickstriker'] },
  { id: 'TFT16_Gangplank',name:'Gangplank',cost:3, traits: ['Bilgewater', 'Slayer', 'Vanquisher'] },
  { id: 'TFT16_Gwen',     name: 'Gwen',    cost: 3, traits: ['Shadow Isles', 'Disruptor'] },
  { id: 'TFT16_Jinx',     name: 'Jinx',    cost: 3, traits: ['Zaun', 'Gunslinger'] },
  { id: 'TFT16_Kennen',   name: 'Kennen',  cost: 3, traits: ['Ionia', 'Yordle', 'Defender'] },
  { id: 'TFT16_KobukoYuumi',name:'Kobuko & Yuumi',cost:3,traits:['Yordle','Bruiser','Invoker'] },
  { id: 'TFT16_LeBlanc',  name: 'LeBlanc', cost: 3, traits: ['Noxus', 'Invoker'] },
  { id: 'TFT16_Leona',    name: 'Leona',   cost: 3, traits: ['Targon'] },
  { id: 'TFT16_Loris',    name: 'Loris',   cost: 3, traits: ['Piltover', 'Warden'] },
  { id: 'TFT16_Malzahar', name: 'Malzahar',cost:3, traits: ['Void', 'Disruptor'] },
  { id: 'TFT16_Milio',    name: 'Milio',   cost: 3, traits: ['Ixtal', 'Invoker'] },
  { id: 'TFT16_Nautilus', name: 'Nautilus',cost:3, traits: ['Bilgewater', 'Juggernaut', 'Warden'] },
  { id: 'TFT16_Sejuani',  name: 'Sejuani', cost: 3, traits: ['Freljord', 'Defender'] },
  { id: 'TFT16_Vayne',    name: 'Vayne',   cost: 3, traits: ['Demacia', 'Longshot'] },
  { id: 'TFT16_Zoe',      name: 'Zoe',     cost: 3, traits: ['Targon'] },

  // 4-cost
  { id: 'TFT16_Ambessa',  name: 'Ambessa', cost: 4, traits: ['Noxus', 'Vanquisher'] },
  { id: 'TFT16_BelVeth',  name: 'Bel\'Veth',cost:4, traits: ['Void', 'Slayer'] },
  { id: 'TFT16_Braum',    name: 'Braum',   cost: 4, traits: ['Freljord', 'Warden'] },
  { id: 'TFT16_Diana',    name: 'Diana',   cost: 4, traits: ['Targon'] },
  { id: 'TFT16_Fizz',     name: 'Fizz',    cost: 4, traits: ['Bilgewater', 'Yordle'] },
  { id: 'TFT16_Garen',    name: 'Garen',   cost: 4, traits: ['Demacia', 'Defender'] },
  { id: 'TFT16_Kaisa',    name: 'Kai\'Sa', cost: 4, traits: ['Assimilator', 'Void', 'Longshot'] },
  { id: 'TFT16_Kalista',  name: 'Kalista', cost: 4, traits: ['Shadow Isles', 'Vanquisher'] },
  { id: 'TFT16_Lissandra',name:'Lissandra',cost:4, traits: ['Freljord', 'Invoker'] },
  { id: 'TFT16_Lux',      name: 'Lux',     cost: 4, traits: ['Demacia', 'Arcanist'] },
  { id: 'TFT16_MissFortune',name:'Miss Fortune',cost:4,traits:['Bilgewater','Gunslinger'] },
  { id: 'TFT16_Nasus',    name: 'Nasus',   cost: 4, traits: ['Shurima'] },
  { id: 'TFT16_Nidalee',  name: 'Nidalee', cost: 4, traits: ['Ixtal', 'Huntress'] },
  { id: 'TFT16_Renekton', name: 'Renekton',cost:4, traits: ['Shurima'] },
  { id: 'TFT16_RiftHerald',name:'Rift Herald',cost:4,traits:['Void','Bruiser'] },
  { id: 'TFT16_Seraphine',name:'Seraphine',cost:4,traits:['Piltover','Disruptor'] },
  { id: 'TFT16_Singed',   name: 'Singed',  cost: 4, traits: ['Zaun', 'Juggernaut'] },
  { id: 'TFT16_Skarner',  name: 'Skarner', cost: 4, traits: ['Ixtal'] },
  { id: 'TFT16_Swain',    name: 'Swain',   cost: 4, traits: ['Noxus', 'Arcanist', 'Juggernaut'] },
  { id: 'TFT16_Taric',    name: 'Taric',   cost: 4, traits: ['Targon'] },
  { id: 'TFT16_Veigar',   name: 'Veigar',  cost: 4, traits: ['Yordle', 'Arcanist'] },
  { id: 'TFT16_Warwick',  name: 'Warwick', cost: 4, traits: ['Zaun', 'Quickstriker'] },
  { id: 'TFT16_Wukong',   name: 'Wukong',  cost: 4, traits: ['Ionia', 'Bruiser'] },
  { id: 'TFT16_Yone',     name: 'Yone',    cost: 4, traits: ['Ionia', 'Slayer'] },
  { id: 'TFT16_Yunara',   name: 'Yunara',  cost: 4, traits: ['Ionia', 'Quickstriker'] },

  // 5-cost
  { id: 'TFT16_Aatrox',   name: 'Aatrox',  cost: 5, traits: ['Darkin', 'World Ender', 'Slayer'] },
  { id: 'TFT16_Annie',    name: 'Annie',   cost: 5, traits: ['Dark Child', 'Arcanist'] },
  { id: 'TFT16_Azir',     name: 'Azir',    cost: 5, traits: ['Shurima', 'Emperor', 'Disruptor'] },
  { id: 'TFT16_Fiddlesticks',name:'Fiddlesticks',cost:5,traits:['Harvester','Vanquisher'] },
  { id: 'TFT16_Galio',    name: 'Galio',   cost: 5, traits: ['Demacia', 'Heroic'] },
  { id: 'TFT16_Kindred',  name: 'Kindred', cost: 5, traits: ['Eternal', 'Quickstriker'] },
  { id: 'TFT16_LucianSenna',name:'Lucian & Senna',cost:5,traits:['Soulbound','Gunslinger'] },
  { id: 'TFT16_Mel',      name: 'Mel',     cost: 5, traits: ['Noxus', 'Disruptor'] },
  { id: 'TFT16_Ornn',     name: 'Ornn',    cost: 5, traits: ['Blacksmith', 'Warden'] },
  { id: 'TFT16_Sett',     name: 'Sett',    cost: 5, traits: ['Ionia', 'The Boss'] },
  { id: 'TFT16_Shyvana',  name: 'Shyvana', cost: 5, traits: ['Dragonborn', 'Juggernaut'] },
  { id: 'TFT16_THex',     name: 'T-Hex',   cost: 5, traits: ['HexMech', 'Piltover', 'Gunslinger'] },
  { id: 'TFT16_TahmKench',name:'Tahm Kench',cost:5,traits:['Bilgewater','Glutton','Bruiser'] },
  { id: 'TFT16_Thresh',   name: 'Thresh',  cost: 5, traits: ['Shadow Isles', 'Warden'] },
  { id: 'TFT16_Tibbers',  name: 'Tibbers', cost: 5, traits: ['Arcanist'] },
  { id: 'TFT16_Volibear', name: 'Volibear',cost:5, traits: ['Freljord', 'Bruiser'] },
  { id: 'TFT16_Xerath',   name: 'Xerath',  cost: 5, traits: ['Shurima', 'Ascendant'] },
  { id: 'TFT16_Ziggs',    name: 'Ziggs',   cost: 5, traits: ['Zaun', 'Yordle', 'Longshot'] },
  { id: 'TFT16_Zilean',   name: 'Zilean',  cost: 5, traits: ['Chronokeeper', 'Invoker'] },

  // 7-cost
  { id: 'TFT16_AurelionSol', name: 'Aurelion Sol', cost: 7, traits: ['Targon', 'Star Forger'] },
  { id: 'TFT16_BaronNashor', name: 'Baron Nashor', cost: 7, traits: ['Void', 'Riftscourge'] },
  { id: 'TFT16_Brock',       name: 'Brock',        cost: 7, traits: ['Ixtal'] },
  { id: 'TFT16_Ryze',        name: 'Ryze',         cost: 7, traits: ['Rune Mage'] },
  { id: 'TFT16_Sylas',       name: 'Sylas',        cost: 7, traits: ['Chainbreaker', 'Arcanist', 'Defender'] },
  { id: 'TFT16_Zaahen',      name: 'Zaahen',       cost: 7, traits: ['Darkin', 'Immortal'] },
];


export const ALL_TRAITS = Array.from(new Set(SET_16_CHAMPIONS.flatMap(c => c.traits))).sort();