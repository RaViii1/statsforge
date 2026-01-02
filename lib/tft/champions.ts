export interface TFTChampion {
  id: string;
  name: string;
  cost: number;
  traits: string[];
}

export const SET_16_CHAMPIONS: TFTChampion[] = [
  // 1-cost
  { id: 'TFT16_Anivia',   name: 'Anivia',   cost: 1, traits: ['Freljord', 'Invoker'] },
  { id: 'TFT16_Blitzcrank',name:'Blitzcrank',cost:1, traits: ['Zaun', 'Juggernaut'] },
  { id: 'TFT16_Briar',    name: 'Briar',    cost: 1, traits: ['Noxus', 'Slayer', 'Juggernaut'] },
  { id: 'TFT16_Caitlyn',  name: 'Caitlyn',  cost: 1, traits: ['Piltover', 'Longshot'] },
  { id: 'TFT16_Illaoi',   name: 'Illaoi',   cost: 1, traits: ['Bilgewater', 'Bruiser'] },
  { id: 'TFT16_JarvanIV', name: 'Jarvan IV',cost: 1, traits: ['Demacia', 'Defender'] },
  { id: 'TFT16_Jhin',     name: 'Jhin',     cost: 1, traits: ['Ionia', 'Gunslinger'] },
  { id: 'TFT16_KogMaw',   name: 'Kog\'Maw', cost: 1, traits: ['Void', 'Arcanist', 'Longshot'] },
  { id: 'TFT16_Lulu',     name: 'Lulu',     cost: 1, traits: ['Yordle', 'Arcanist'] },
  { id: 'TFT16_Qiyana',   name: 'Qiyana',   cost: 1, traits: ['Ixtal', 'Slayer'] },
  { id: 'TFT16_Rumble',   name: 'Rumble',   cost: 1, traits: ['Yordle', 'Defender'] },
  { id: 'TFT16_Shen',     name: 'Shen',     cost: 1, traits: ['Ionia', 'Bruiser'] },
  { id: 'TFT16_Sona',     name: 'Sona',     cost: 1, traits: ['Demacia', 'Invoker'] },
  { id: 'TFT16_Viego',    name: 'Viego',    cost: 1, traits: ['Shadow Isles', 'Quickstriker'] },

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

export const getChampionById = (characterId: string): TFTChampion | undefined => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId);
};

export const getChampionCost = (characterId: string): number => {
  return SET_16_CHAMPIONS.find(c => c.id === characterId)?.cost || 1;
};

export const getCostColor = (cost: number): string => {
  switch (cost) {
    case 1: return '#94a3b8';
    case 2: return '#10b981';
    case 3: return '#3b82f6';
    case 4: return '#a855f7';
    case 5: return '#eab308';
    case 6: return '#ef4444';
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
    default: return 'border-zinc-400';
  }
};

export const CurrentSetNumber = 16;
