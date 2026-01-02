import { LevelingPreset, LevelingStep } from './teamplanner-types';

export const LEVELING_PRESETS: LevelingPreset[] = [
  {
    id: 'fast-9',
    name: 'Fast 9',
    highlightLevel: 9,
    tagColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    steps: [
      { level: 4, stage: '2-1', gold: '5+' },
      { level: 5, stage: '2-5', gold: '10+' },
      { level: 6, stage: '3-2', gold: '30+' },
      { level: 7, stage: '4-1', gold: '50+' },
      { level: 8, stage: '4-2', gold: '30+', description: 'Stabilize board' },
      { level: 9, stage: '5-2', gold: '20+', description: 'Roll for 5-costs' },
    ],
  },
  {
    id: 'fast-8',
    name: 'Fast 8',
    highlightLevel: 8,
    tagColor: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    steps: [
      { level: 4, stage: '2-1', gold: '5+' },
      { level: 5, stage: '2-5', gold: '10+' },
      { level: 6, stage: '3-2', gold: '30+' },
      { level: 7, stage: '4-1', gold: '50+' },
      { level: 8, stage: '4-2', gold: '30+', description: 'Reroll for carries' },
      { level: 9, stage: '5-5', gold: '20+' },
    ],
  },
  {
    id: 'level-7-slow-roll',
    name: 'Level 7 Slow Roll',
    highlightLevel: 7,
    tagColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    steps: [
      { level: 4, stage: '2-1', gold: '5+' },
      { level: 5, stage: '2-5', gold: '10+' },
      { level: 6, stage: '3-2', gold: '30+' },
      { level: 7, stage: '3-7', gold: '50+', description: 'Slowroll for carries' },
      { level: 8, stage: '5-5', gold: '20+' },
      { level: 9, stage: '6-2', gold: '10+' },
    ],
  },
  {
    id: 'level-6-slow-roll',
    name: 'Level 6 Slow Roll',
    highlightLevel: 6,
    tagColor: 'text-green-400 bg-green-400/10 border-green-400/20',
    steps: [
      { level: 3, stage: '2-1', gold: '10+', description: 'DO NOT buy XP' },
      { level: 4, stage: '2-3', gold: '20+' },
      { level: 5, stage: '3-1', gold: '30+' },
      { level: 6, stage: '3-2', gold: '30+', description: 'Slowroll for carries' },
      { level: 7, stage: '4-7', gold: '50+' },
      { level: 8, stage: '5-7', gold: '20+' },
      { level: 9, stage: '6-5', gold: '20+' },
    ],
  },
  {
    id: 'level-5-slow-roll',
    name: 'Level 5 Slow Roll',
    highlightLevel: 5,
    tagColor: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    steps: [
      { level: 3, stage: '2-1', gold: '10+', description: 'DO NOT buy XP' },
      { level: 4, stage: '2-3', gold: '20+' },
      { level: 5, stage: '3-2', gold: '50+', description: 'Slowroll for carries' },
      { level: 6, stage: '3-7', gold: '50+' },
      { level: 7, stage: '4-5', gold: '50+' },
      { level: 8, stage: '5-2', gold: '30+' },
      { level: 9, stage: '6-2', gold: '20+' },
    ],
  },
];

export const LEVEL_COLORS: Record<number, string> = {
  3: 'text-gray-400',
  4: 'text-emerald-400',
  5: 'text-blue-400',
  6: 'text-purple-400',
  7: 'text-pink-400',
  8: 'text-orange-400',
  9: 'text-yellow-400',
};

export const LEVEL_BG_COLORS: Record<number, string> = {
  3: 'bg-gray-400/10 border-gray-400/20',
  4: 'bg-emerald-400/10 border-emerald-400/20',
  5: 'bg-blue-400/10 border-blue-400/20',
  6: 'bg-purple-400/10 border-purple-400/20',
  7: 'bg-pink-400/10 border-pink-400/20',
  8: 'bg-orange-400/10 border-orange-400/20',
  9: 'bg-yellow-400/10 border-yellow-400/20',
};
