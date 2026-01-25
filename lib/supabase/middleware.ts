import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // getUser(). A simple mistake could make it very hard to debug
  // issues with sessions being lost.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const is_admin_route = request.nextUrl.pathname.startsWith('/admin')

  if (is_admin_route) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

        // Fetch the user's role from the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        // Check if any profiles exist in the system
        const { count: profileCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Block non-admins from /admin
        // Fallback: If no profiles exist yet, allow the first user to access to set it up
        if (profileCount !== 0 && (!profile || profile.role !== 'admin')) {
          const url = request.nextUrl.clone()
          url.pathname = '/'
          return NextResponse.redirect(url)
        }
    }

  return response
}
