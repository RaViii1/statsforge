'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: (formData.get('email') as string)?.trim(),
    password: formData.get('password') as string,
  })

  if (error) {
    const redirectUrl = formData.get('redirect') as string | undefined
    const errorUrl = redirectUrl
      ? `/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectUrl)}`
      : `/login?error=${encodeURIComponent(error.message)}`
    return redirect(errorUrl)
  }

  revalidatePath('/', 'layout')
  redirect((formData.get('redirect') as string) || '/')
}

export async function signup(formData: FormData) {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || 'http'

  const { data: authData, error } = await supabase.auth.signUp({
    email: (formData.get('email') as string)?.trim(),
    password: formData.get('password') as string,
    options: {
      data: {
        username: formData.get('username') as string,
        display_name: formData.get('username') as string,
      },
      emailRedirectTo: `${protocol}://${host}`,
    },
  })

  if (error) return redirect('/register?error=' + encodeURIComponent(error.message))

  if (authData.user?.identities?.length === 0) {
    return redirect('/login?error=' + encodeURIComponent('An account with this email already exists.'))
  }

  revalidatePath('/', 'layout')
  return redirect('/register?success=true&email=' + encodeURIComponent(authData.user?.email ?? ''))
}

export async function signOut() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
