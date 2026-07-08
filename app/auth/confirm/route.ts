import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'email' | 'recovery'
  const next = searchParams.get('next') ?? '/'

  console.log('[AUTH CONFIRM] token_hash:', token_hash?.slice(0, 20) + '...')
  console.log('[AUTH CONFIRM] type:', type)

  if (!token_hash || !type) {
    console.log('[AUTH CONFIRM] Missing token_hash or type')
    return NextResponse.redirect('https://statsforge.vercel.app/login?error=Invalid confirmation link')
  }

  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  console.log('[AUTH CONFIRM] Calling verifyOtp...')
  const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
  
  console.log('[AUTH CONFIRM] verifyOtp result:', { 
    hasSession: !!data?.session, 
    error: error?.message || null 
  })

  if (error) {
    console.log('[AUTH CONFIRM] ERROR:', error.message)
    return NextResponse.redirect('https://statsforge.vercel.app/login?error=' + encodeURIComponent(error.message))
  }

  if (!data.session) {
    console.log('[AUTH CONFIRM] No session created')
    return NextResponse.redirect('https://statsforge.vercel.app/login?error=No session created')
  }

  console.log('[AUTH CONFIRM] Success! Redirecting to /')
  return NextResponse.redirect('https://statsforge.vercel.app' + next)
}
