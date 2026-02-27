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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchAndCacheProfile(userId: string, email?: string) {
  // Return from cache immediately — no DB hit
  const cached = getCachedProfile(userId)
  if (cached) return cached

  const { data, error } = await supabase
    .from('profiles')
    .select('role, username')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Profile fetch error:', error.message)
  }

  const profile = {
    role: data?.role ?? 'user',
    username: data?.username ?? email?.split('@')[0] ?? 'User',
  }

  if (!error) setCachedProfile(userId, profile)
  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Prevent state updates if the component unmounts mid-flight
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session ) => {
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
      } else {
        clearCachedProfile()
        if (!mountedRef.current) return
        setUser(null)
        setUserRole(null)
        setUserName(null)
      }

      if (mountedRef.current) setLoading(false)
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, userRole, userName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
  return context
}