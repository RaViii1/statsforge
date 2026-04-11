'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  User, Mail, Shield, Clock,
  Check, Crown, Zap,
  ChevronRight, Loader2, Settings
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease, delay },
})

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, userRole, userName, premium_user } = useAuth()
  const [profileLoading, setProfileLoading] = useState(true)
  const [linkedAccounts, setLinkedAccounts] = useState({ riot: false, steam: false })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login?redirect=' + encodeURIComponent('/profile'))
      else setProfileLoading(false)
    }
  }, [user, loading, router])

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') {
      toast.success('Payment successful! Your account has been upgraded to Premium.')
      router.replace('/profile')
    } else if (checkout === 'cancelled') {
      toast.info('Checkout cancelled. You can upgrade anytime from your profile.')
      router.replace('/profile')
    }
  }, [searchParams, router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/')
    router.refresh()
  }

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session')
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setCheckoutLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to open billing portal')
      window.location.href = data.url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setPortalLoading(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—'
  const initials = (userName || 'U').slice(0, 2).toUpperCase()
  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[500px] bg-blue-600/4 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[400px] bg-purple-600/4 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <motion.div {...fadeUp(0)} className="relative rounded-2xl bg-zinc-900/50 shadow-xl shadow-black/40 overflow-hidden mb-8">
          <div className="relative z-10 flex items-start justify-between flex-wrap gap-8 p-8 md:p-10">
            <div className="flex items-end gap-5 flex-1 min-w-0">
              <div className="relative shrink-0">
                <div className={`absolute -inset-2 rounded-[20px] blur-xl opacity-40
                  ${premium_user ? 'bg-amber-400/50' : 'bg-orange-500/30'}`} />
                <div className={`relative w-20 h-20 rounded-[18px] flex items-center justify-center
                  text-white text-2xl font-black select-none tracking-tight
                  ${premium_user
                    ? 'bg-linear-to-br from-amber-400 to-orange-500'
                    : 'bg-linear-to-br from-orange-500 to-red-600'}`}>
                  {initials}
                  {premium_user && (
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.3 }}
                      className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full
                        bg-linear-to-br from-amber-300 to-yellow-500
                        flex items-center justify-center shadow-lg
                        border-2 border-zinc-950"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-900" />
                    </motion.span>
                  )}
                </div>
              </div>

              <div className="pb-0.5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {premium_user ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      bg-orange-950/40 border border-orange-900/40
                      text-[11px] font-bold uppercase tracking-widest text-orange-500">
                      <Crown className="w-2.5 h-2.5" /> Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      bg-zinc-900 border border-zinc-800
                      text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                      Free
                    </span>
                  )}
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      bg-red-950/40 border border-red-900/40
                      text-[11px] font-bold uppercase tracking-widest text-red-500">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                  {userName}
                </h1>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 space-y-6">

            <motion.div {...fadeUp(0.07)}>
              <section className="rounded-2xl bg-zinc-900/50 p-8 shadow-lg shadow-black/30">
                <h2 className="border-l-2 border-orange-500 pl-3 text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] leading-none mb-6">
                  Account details
                </h2>

                <div className="rounded-xl overflow-hidden">
                  {[
                    { icon: <User className="w-4 h-4" />, label: 'Username', value: userName || '—' },
                    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: user.email || '—' },
                    { icon: <Shield className="w-4 h-4" />, label: 'Role', value: isAdmin ? 'Administrator' : 'Member', highlight: isAdmin },
                    { icon: <Clock className="w-4 h-4" />, label: 'Member since', value: memberSince },
                  ].map(({ icon, label, value, highlight }, i) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-zinc-800/30' : 'bg-transparent'} hover:bg-zinc-800/50 transition-colors`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-orange-500 opacity-70">{icon}</span>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</span>
                      </div>
                      <span className={`text-sm font-medium ${highlight ? 'text-red-400' : 'text-white'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>

            <motion.div {...fadeUp(0.12)}>
              <section className="rounded-2xl bg-zinc-900/50 p-8 shadow-lg shadow-black/30">
                <h2 className="border-l-2 border-orange-500 pl-3 text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] leading-none mb-6">
                  Connected accounts
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Riot Games', sub: 'League of Legends · TFT', accentColor: '#C89B3C', letter: 'R', linked: linkedAccounts.riot },
                    { name: 'Steam', sub: 'CS2 · profile sync', accentColor: '#4a9eda', letter: 'S', linked: linkedAccounts.steam },
                  ].map(({ name, sub, accentColor, letter, linked }) => (
                    <div
                      key={name}
                      className={`rounded-xl p-4 transition-all duration-200
                        ${linked
                          ? 'border-emerald-900/40 bg-emerald-950/20'
                          : 'border-zinc-800/60 bg-zinc-950/60 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center
                          text-sm font-black shrink-0"
                          style={{
                            background: `${accentColor}18`,
                            border: `1px solid ${accentColor}35`,
                            color: accentColor,
                          }}>
                          {letter}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white leading-none mb-1">{name}</p>
                          <p className="text-[10px] text-zinc-600">{sub}</p>
                        </div>
                      </div>

                      {linked ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                          <Check className="w-3 h-3" /> Connected
                        </div>
                      ) : (
                        <button
                          onClick={() => toast.info(`${name} linking coming soon`)}
                          className="w-full py-2 rounded-lg
                            border border-zinc-800 text-zinc-500 text-[11px] font-bold uppercase tracking-widest
                            hover:border-orange-900/50 hover:text-orange-500 hover:bg-orange-950/20
                            transition-all duration-150">
                          Connect
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>

          </div>

          <div className="lg:col-span-4 space-y-6">

            <motion.div {...fadeUp(0.09)}>
              {premium_user ? (
                <div className="relative overflow-hidden rounded-2xl border border-orange-900/40
                  bg-linear-to-br from-zinc-900 to-zinc-950">
                  <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-orange-500/60 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-br from-orange-600/10 via-orange-500/5 to-transparent" />

                  <div className="relative z-10 p-6 flex flex-col items-center text-center gap-4">
                    <div className="relative mt-1">
                      <div className="absolute inset-0 rounded-full blur-xl bg-amber-400/30 scale-150" />
                      <div className="relative w-16 h-16 rounded-2xl
                        bg-linear-to-br from-amber-400 to-orange-500
                        flex items-center justify-center shadow-2xl shadow-orange-900/50">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500/70 mb-1">You're on</p>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Premium</h3>
                      <p className="text-xs text-zinc-500 mt-1.5">Full access to all features</p>
                    </div>

                    <button
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      className="mt-1 w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest
                        border border-orange-900/50 text-orange-500 hover:bg-orange-950/30
                        transition-all duration-150 flex items-center justify-center gap-2
                        disabled:opacity-50 disabled:cursor-not-allowed">
                      {portalLoading
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Settings className="w-3.5 h-3.5" />}
                      Manage Billing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-zinc-900/50 shadow-lg shadow-black/30 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-center gap-2.5">
                    <span className="w-1 h-4 rounded-full bg-orange-500 opacity-80 shrink-0" />
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Membership</h2>
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700
                        flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">Free plan</p>
                        <p className="text-[11px] text-zinc-600">Limited access</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-3.5 space-y-2.5">
                      {[
                        'Unlimited match history',
                        'Advanced stats & overlays',
                        'Priority support',
                      ].map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700
                            flex items-center justify-center shrink-0">
                            <ChevronRight className="w-2.5 h-2.5 text-zinc-600" />
                          </div>
                          <span className="text-xs text-zinc-500">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleUpgrade}
                      disabled={checkoutLoading}
                      className="w-full py-3 rounded-xl font-black text-sm text-white
                        italic uppercase tracking-tight
                        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl
                        active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
                        boxShadow: '0 0 24px rgba(234,88,12,0.3), inset 0 1px 0 rgba(255,255,255,0.12)'
                      }}>
                      {checkoutLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                        : 'Upgrade to Premium'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div {...fadeUp(0.14)}>
              <section className="rounded-2xl bg-zinc-900/50 p-6 shadow-lg shadow-black/30">
                <h2 className="border-l-2 border-orange-500 pl-3 text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] leading-none mb-6">
                  Stats
                </h2>

                <div className="rounded-xl overflow-hidden">
                  {[
                    { n: '—', label: 'Matches' },
                    { n: Object.values(linkedAccounts).filter(Boolean).length.toString(), label: 'Linked' },
                    { n: '—', label: 'Reports' },
                    { n: '—', label: 'Days active' },
                  ].map(({ n, label }, i) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-zinc-800/30' : 'bg-transparent'} hover:bg-zinc-800/50 transition-colors`}
                    >
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</span>
                      <span className="text-lg font-black text-white italic tabular-nums">{n}</span>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>


      </main>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}