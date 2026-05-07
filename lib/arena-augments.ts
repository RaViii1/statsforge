
export interface Augment {
  id: number;
  name: string | null;
  description: string | null;
  tier: any;
  icon_path: string | null;
  gamemode: any;
  apiname: string | null;
}

export type AugmentTier = 'silver' | 'gold' | 'prismatic' | 'special';

export const getArenaAugmentTier = (augment: Augment | undefined): AugmentTier => {
  if (!augment) return 'silver';
  const tierValue = augment.tier;
  if (typeof tierValue === 'string') {
    const lower = tierValue.toLowerCase();
    if (lower === 'gold') return 'gold';
    if (lower === 'prismatic') return 'prismatic';
    if (lower === 'special' || lower === 'emerald') return 'special';
    return 'silver';
  }
  if (typeof tierValue === 'number') {
    // DB tier mapping: 0=silver, 1=gold, 2=prismatic, 3/4=special
    if (tierValue === 1) return 'gold';
    if (tierValue === 2) return 'prismatic';
    if (tierValue === 3 || tierValue === 4) return 'special';
    // Default to silver for tier 0 or any other value
    return 'silver';
  }
  return 'silver';
};

export const getAugmentTierBorderColor = (tier: AugmentTier): string => {
  switch (tier) {
    case 'gold':
      return 'border-yellow-400';
    case 'prismatic':
      return 'border-purple-500';
    case 'special':
      return 'border-emerald-400';
    default:
      return 'border-zinc-400';
  }
};

export const getAugmentTierBgColor = (tier: AugmentTier): string => {
  switch (tier) {
    case 'gold':
      return 'bg-yellow-950/40';
    case 'prismatic':
      return 'bg-purple-900/50';
    case 'special':
      return 'bg-emerald-900/50';
    default:
      return 'bg-zinc-800/40';
  }
};

export const getAugmentTierGlow = (tier: AugmentTier): string => {
  switch (tier) {
    case 'gold':
      return 'shadow-md shadow-yellow-500/30';
    case 'prismatic':
      return 'shadow-md shadow-purple-500/30';
    case 'special':
      return 'shadow-md shadow-emerald-500/30';
    default:
      return 'shadow-md shadow-zinc-800/40';
  }
};

export const getArenaAugmentIconUrl = (iconPath: string | null | undefined): string => {
  if (!iconPath) return '/images/nochampionimage.jpg';
  if (iconPath.startsWith('http')) return iconPath;
  if (iconPath.includes('/')) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${iconPath}`;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/augments/${iconPath}`;
};

export const getAugmentById = (
  augmentId: string | number | null | undefined,
  augments: Augment[]
): Augment | undefined => {
  if (!augmentId) return undefined;
  const numericId = typeof augmentId === 'string' ? parseInt(augmentId, 10) : augmentId;
  return augments.find((a) => a.id === numericId);
};

export const getArenaAugmentName = (
  augmentId: string | number | null | undefined,
  augments: Augment[]
): string => {
  const augment = getAugmentById(augmentId, augments);
  return augment?.name ?? `Augment ${augmentId}`;
};

export const getArenaAugmentDescription = (
  augmentId: string | number | null | undefined,
  augments: Augment[]
): string => {
  const augment = getAugmentById(augmentId, augments);
  return augment?.description ?? '';
};

export const getArenaAugmentIcon = (
  augmentId: string | number | null | undefined,
  augments: Augment[]
): string => {
  const augment = getAugmentById(augmentId, augments);
  return getArenaAugmentIconUrl(augment?.icon_path);
};
