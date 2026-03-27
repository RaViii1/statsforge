type Profile = { role: string; username: string; premium_user: boolean }

const cache = new Map<string, Profile>()

export function getCachedProfile(userId: string) {
  return cache.get(userId) ?? null
}

export function setCachedProfile(userId: string, profile: Profile) {
  cache.set(userId, profile)
}

export function clearCachedProfile(userId?: string) {
  if (userId) cache.delete(userId)
  else cache.clear()
}