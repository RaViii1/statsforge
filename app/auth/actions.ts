'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string)?.trim(),
    password: formData.get('password') as string,
  }

  console.log('Attempting login for:', data.email)
  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    const redirectUrl = formData.get('redirect') as string | undefined
    const errorUrl = redirectUrl 
      ? `/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectUrl)}`
      : `/login?error=${encodeURIComponent(error.message)}`
    return redirect(errorUrl)
  }

  console.log('Login successful for:', authData.user?.email)
  
  const redirectUrl = formData.get('redirect') as string | undefined
  const targetUrl = redirectUrl || '/'
  
  // Clear all caches to ensure fresh data is loaded
  revalidatePath('/', 'layout')
  revalidatePath('/', 'page')
  
  redirect(targetUrl)
}

export async function signup(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string)?.trim(),
    password: formData.get('password') as string,
    username: formData.get('username') as string,
  }

  console.log('Attempting signup for:', data.email)
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          display_name: data.username,
          full_name: data.username,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (error) {
      console.error('Signup error:', error.message)
      return redirect('/register?error=' + encodeURIComponent(error.message))
    }

    // If identities is empty, it means the user already exists
    if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
      return redirect('/login?error=' + encodeURIComponent('An account with this email already exists. Please sign in instead.'))
    }


  console.log('Signup successful, user:', authData.user?.id)
  revalidatePath('/', 'layout')
  return redirect('/register?success=true&email=' + encodeURIComponent(data.email))
}

export async function signOut() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
