'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Anvil, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const [error, setError] = useState<string | null>(searchParams.get('error'))
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string)?.trim()
    const password = formData.get('password') as string

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setSubmitting(false)
      return
    }

    toast.success('Signed in successfully!')
    router.push(redirectUrl || '/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-3 group mb-8">
            <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-900/40 group-hover:scale-105 transition-transform duration-300">
              <Anvil className="w-8 h-8 text-white" />
            </div>
            <span className="font-black text-white text-4xl tracking-tighter">StatsForge</span>
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight text-center">Welcome back</h2>
          <p className="text-zinc-400 mt-2 text-center max-w-[280px]">Enter your credentials to access your dashboard</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-zinc-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    className="block w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all disabled:opacity-50"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="password" className="text-sm font-semibold text-zinc-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={submitting}
                    className="block w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex items-center justify-center py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-orange-900/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-center text-zinc-500 text-sm">
              New to StatsForge?{' '}
              <Link href="/register" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
