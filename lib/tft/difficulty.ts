import { DifficultyLevel } from './teamplanner-types';

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const DIFFICULTY_LEVELS: DifficultyConfig[] = [
  {
    id: 'easy',
    label: 'Easy',
    shortLabel: 'E',
    description: 'Beginner friendly. Strong with minimal items and easy to hit.',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  {
    id: 'medium',
    label: 'Medium',
    shortLabel: 'M',
    description: 'Requires good positioning and specific items to perform well.',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  {
    id: 'hard',
    label: 'Hard',
    shortLabel: 'H',
    description: 'High skill cap. Requires perfect items, positioning, and game knowledge.',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  {
    id: 'augment-dependent',
    label: 'Augment Dependent',
    shortLabel: 'A',
    description: 'Comp strength heavily relies on hitting specific augments to function.',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
];

export const getDifficultyConfig = (level: DifficultyLevel): DifficultyConfig => {
  return DIFFICULTY_LEVELS.find(d => d.id === level) || DIFFICULTY_LEVELS[0];
};
