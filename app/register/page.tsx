import Link from 'next/link'
import { signup } from '../auth/actions';
import { Anvil, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Sparkles, User, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; email?: string }>
}) {
  const params = await searchParams;
  const error = params?.error;
  const success = params?.success === 'true';
  const email = params?.email;
  
  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[25%] -right-[10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"></div>
          </div>
            
          <div className="w-full max-w-md space-y-8 relative z-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 animate-pulse">
                <Mail className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Check your email</h2>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                We've sent a confirmation link to <span className="text-white font-semibold">{email}</span>.
                Please click the link in the email to activate your account.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-left p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-zinc-300">Account created successfully</p>
                </div>
                <div className="flex items-center gap-3 text-left p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-zinc-600 border-t-emerald-500 animate-spin shrink-0" />
                  <p className="text-sm text-zinc-300">Waiting for email verification...</p>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/login" 
                  className="text-orange-500 hover:text-orange-400 font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Back to Login <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <p className="text-zinc-500 text-xs">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[25%] -right-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[25%] -left-[10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]"></div>
        </div>
          
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-zinc-400 mt-2 max-w-[300px]">Join thousands of players tracking their stats and mastering the game.</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
            <form action={signup} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-semibold text-zinc-300 ml-1">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      placeholder="Your summoner name"
                    />
                  </div>
                </div>

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
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-zinc-300 ml-1">
                    Choose Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 ml-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Minimum 6 characters required
                  </p>
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
                className="group relative w-full flex items-center justify-center py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-orange-900/20 active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 grid grid-cols-1 gap-4">
               <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-zinc-400">Unlock advanced analytics and profile tracking</p>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <p className="text-center text-zinc-500 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-orange-500 hover:text-orange-400 font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}