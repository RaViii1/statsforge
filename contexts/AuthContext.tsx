'use client'
import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCachedProfile, setCachedProfile, clearCachedProfile } from '@/lib/auth/profile-cache'
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

const supabase = createClient()

type AuthContextType = {
  user: any | null
  loading: boolean
  userRole: string | null
  userName: string | null
  premium_user: boolean | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchAndCacheProfile(userId: string, email?: string) {
  // Return from cache immediately — no DB hit
  const cached = getCachedProfile(userId)
  if (cached) return cached

  const { data, error } = await supabase
    .from('profiles')
    .select('role, username, premium_user')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Profile fetch error:', error.message)
  }

  const profile = {
    role: data?.role ?? 'user',
    username: data?.username ?? email?.split('@')[0] ?? 'User',
    premium_user: data?.premium_user ?? false,
  }

  if (!error) setCachedProfile(userId, profile)
  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [premium_user, setPremiumUser] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  // Prevent state updates if the component unmounts mid-flight
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // Eagerly resolve the current session so loading never hangs when
    // onAuthStateChange fires late or not at all (e.g. network issues).
    supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
      if (!mountedRef.current) return
      if (session?.user) {
        const profile = await fetchAndCacheProfile(session.user.id, session.user.email)
        if (!mountedRef.current) return
        setUser(session.user)
        setUserRole(profile.role)
        setUserName(profile.username)
        setPremiumUser(profile.premium_user)
      }
      // Always clear the loading gate after the initial session check,
      // regardless of whether a session exists.
      if (mountedRef.current) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      // TOKEN_REFRESHED is noisy — just update the user object, no profile re-fetch needed
      if (event === 'TOKEN_REFRESHED') {
        if (session?.user && mountedRef.current) setUser(session.user)
        return
      }

      if (session?.user) {
        // Fetch profile (instantly returns if cached)
        const profile = await fetchAndCacheProfile(session.user.id, session.user.email)

        if (!mountedRef.current) return  // component unmounted while awaiting

        setUser(session.user)
        setUserRole(profile.role)
        setUserName(profile.username)
        setPremiumUser(profile.premium_user)
      } else {
        clearCachedProfile()
        if (!mountedRef.current) return
        setUser(null)
        setUserRole(null)
        setUserName(null)
      }

      if (mountedRef.current) setLoading(false)
    })

    // writes and re-read the session so all open cards stay in sync.
    const handleStorageChange = (e: StorageEvent) => {
      // Supabase stores the session under a key that contains 'supabase'
      if (!e.key || !e.key.includes('supabase')) return
      supabase.auth.getSession().then(async ({ data: { session } }: { data: { session: Session | null } }) => {
        if (!mountedRef.current) return
        if (session?.user) {
          const profile = await fetchAndCacheProfile(session.user.id, session.user.email)
          if (!mountedRef.current) return
          setUser(session.user)
          setUserRole(profile.role)
          setUserName(profile.username)
          setPremiumUser(profile.premium_user)

        } else {
          clearCachedProfile()
          if (!mountedRef.current) return
          setUser(null)
          setUserRole(null)
          setUserName(null)
          setPremiumUser(null)
        }
        if (mountedRef.current) setLoading(false)
      })
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, userRole, userName, premium_user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}