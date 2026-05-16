
export function getSummonerSpellIconUrl(iconPath: string | undefined): string {
  if (!iconPath) return '/images/nochampionimage.jpg';
  if (iconPath.startsWith('http')) return iconPath;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/summoner_spells/${iconPath}`;
}

export interface SummonerSpell {
  id: string;
  name: string;
  cooldown: number;
  description: string;
  icon_path: string;
  created_at?: string;
  updated_at?: string;
}

export function getSummonerSpellRecordById(
  summonerSpells: Record<string, SummonerSpell>,
  spellId: number
): SummonerSpell | undefined {
  return summonerSpells[String(spellId)];
}
