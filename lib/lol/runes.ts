const SUPABASE_URL = 'https://dipfvxvowddjqjyohknj.supabase.co/storage/v1/object/public/Lol_runes';

export const RUNE_ASSETS = {
  runes: `${SUPABASE_URL}/lol-runes`,
  trees: `${SUPABASE_URL}/lol-rune-trees`,
} as const;

export const getRuneIconUrl = (filename: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  return `${RUNE_ASSETS.runes}/${filename}`;
};

export const getTreeIconUrl = (filename: string): string => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  return `${RUNE_ASSETS.trees}/${filename}`;
};

export interface RuneTree {
  id: string;
  name: string;
  icon_path: string;
  description?: string;
  slots: string[][];
}

export interface Rune {
  id: string;
  tree_id?: string;
  icon_path: string;
  name: string;
  description?: string;
  is_keystone?: boolean;
  is_stat_shard?: boolean;
  slot_row?: number; // 0=keystone row, 1-3 = minor rows
  slot_col?: number; // 0-2 = column within row
}
