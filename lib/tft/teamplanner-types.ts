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

export interface TeamComp {
  id: string;
  name: string;
  description: string;
  phases: Record<PhaseKey, TeamPhase>;
  mainCarryIds: string[];
  levelingSteps: LevelingStep[];
  patch: string;
  difficulty?: DifficultyLevel;
  activePresetId?: string;
}

export interface TooltipState {
  visible: boolean;
  title: string;
  description: string;
  x: number;
  y: number;
}

export const PATCHES = ['14.23', '14.24', '16.1c'];

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
