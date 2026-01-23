export const PLATFORM_TO_REGION: Record<string, string> = {
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',
  'kr': 'asia',
  'jp1': 'asia',
  'oc1': 'sea',
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
};

export const isValidPlatform = (platform: string): boolean => {
  return !!PLATFORM_TO_REGION[platform.toLowerCase()];
};

export const getRegionForPlatform = (platform: string): string => {
  return PLATFORM_TO_REGION[platform.toLowerCase()] || 'americas';
};
