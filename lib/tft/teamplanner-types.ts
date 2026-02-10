export interface UnitPosition {
  id: string;
  characterId: string;
  name: string;
  row: number;
  col: number;
  stars: number;
  items: string[];
}

export type PhaseKey = 'early' | 'mid' | 'final';

export interface TeamPhase {
  units: UnitPosition[];
  notes?: string;
}

export interface LevelingStep {
  level: number;
  stage: string;
  gold: string;
  description?: string;
  isCurrent?: boolean;
}

export interface LevelingPreset {
  id: string;
  name: string;
  highlightLevel: number;
  tagColor: string;
  steps: LevelingStep[];
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'augment-dependent';

export type MetaTier = 'S' | 'A' | 'B' | 'C' | 'F';

export const META_TIERS: MetaTier[] = ['S', 'A', 'B', 'C', 'F'];


export const META_TIER_CONFIG: Record<MetaTier, {
  color: string;
  bgColor: string;
  glowColor: string;
  icon: string;
  label: string;
  gradient: string;
}> = {
  S: {
    color: 'text-amber-300',
    bgColor: 'bg-amber-950/60',
    glowColor: 'shadow-amber-500/50',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    icon: '★',
    label: 'S Tier'
  },
  A: {
    color: 'text-violet-300',
    bgColor: 'bg-violet-950/60',
    glowColor: 'shadow-violet-500/50',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    icon: '◆',
    label: 'A Tier'
  },
  B: {
    color: 'text-sky-300',
    bgColor: 'bg-sky-950/60',
    glowColor: 'shadow-sky-500/50',
    gradient: 'from-sky-400 via-blue-500 to-cyan-600',
    icon: '▲',
    label: 'B Tier'
  },
  C: {
    color: 'text-slate-400',
    bgColor: 'bg-slate-900/60',
    glowColor: 'shadow-slate-500/50',
    gradient: 'from-slate-400 via-zinc-500 to-stone-600',
    icon: '■',
    label: 'C Tier'
  },
  F: {
    color: 'text-rose-300',
    bgColor: 'bg-rose-950/60',
    glowColor: 'shadow-rose-500/50',
    gradient: 'from-rose-400 via-red-500 to-pink-600',
    icon: '✕',
    label: 'F Tier'
  }
};

export interface TeamComp {
  id: string;
  name: string;
  set_id?: number;
  description: string;
  phases: Record<PhaseKey, TeamPhase>;
  mainCarryIds: string[];
  levelingSteps: LevelingStep[];
  patch: string;
  tier?: MetaTier;
  difficulty?: DifficultyLevel;
  activePresetId?: string;
  synergiesList?: string[];
  user_id: string;
}

export interface TooltipState {
  visible: boolean;
  title: string;
  description: string;
  x: number;
  y: number;
}

export const generatePatchesForSet = (setNumber: number): string[] => {
  // Generate patches for a set: 16.1, 16.1c, 16.2, 16.3, etc.
  const patches: string[] = [];
  
  // Most TFT sets have around 6-8 patches
  for (let i = 1; i <= 8; i++) {
    patches.push(`${setNumber}.${i}`);
    // Add common variants like 16.1c
    if (i === 1) {
      patches.push(`${setNumber}.${i}c`);
    }
  }
  
  return patches;
};

export const DEFAULT_LEVELING: LevelingStep[] = [
  { level: 3, stage: '2-1', gold: '0' },
  { level: 4, stage: '2-1', gold: '0' },
  { level: 5, stage: '2-5', gold: '10' },
  { level: 6, stage: '3-2', gold: '30+' },
  { level: 7, stage: '3-7', gold: '40+' },
  { level: 8, stage: '4-2', gold: '30+', isCurrent: true },
];

export const UNITS_PER_PAGE = 16;
export const GRID_ROWS = 4;
export const GRID_COLS = 7;
