import Link from 'next/link'
import { createClient } from "@/lib/supabase/server";
import {
  Layers, Users, Shield, Box, TrendingUp, ChevronRight,
  Database, BarChart3, Swords, Package, Activity, Zap, Sparkles, UsersRound,
  ArrowLeft, Crown, Globe, Server, CheckCircle2, AlertCircle,
  Bell, Settings, Cloud
} from 'lucide-react'
import AdminTabs, { UserList } from "./AdminsTab";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: compCount } = await supabase.from("tft_team_comps").select("*", { count: "exact", head: true });
  const { data: activeSets } = await supabase.from("tft_sets").select("set_number, name").eq("is_active", true).order("set_number", { ascending: false });
  const { data: users } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });

  const overview = (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/20 via-zinc-900/40 to-zinc-950/40 border border-orange-500/20 p-8 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">
              Admin Control Center
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Admin <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-base text-zinc-400 max-w-2xl">
            Configure TFT &amp; League of Legends data, monitor platform metrics, and oversee content across all game titles
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-orange-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/10 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Total Users</p>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-orange-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {userCount?.toLocaleString() ?? '0'}
          </p>
        </div>

        <div className="group p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-blue-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Team Comps</p>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <UsersRound className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {compCount?.toLocaleString() ?? '0'}
          </p>
        </div>

        <div className="group p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-purple-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Active TFT Sets</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {activeSets?.length ?? 0}
          </p>
        </div>

        <div className="group p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">System Status</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <p className="text-lg font-bold text-emerald-400 tracking-tight">Operational</p>
          </div>
        </div>
      </div>

      {/* TFT Management */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">TFT Management</h2>
            <p className="text-xs text-zinc-500">Game data editor and configuration tools</p>
          </div>
        </div>

        {/* Active Set */}
        <div className="p-4 bg-gradient-to-r from-orange-500/5 via-orange-500/10 to-purple-500/5 border border-orange-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-2">Active Set</p>
              {activeSets && activeSets.length > 0 ? (
                activeSets.length === 1 ? (
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-bold text-white">Set {activeSets[0].set_number} - {activeSets[0].name}</div>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-bold text-white mb-2">
                      Active Sets ({activeSets.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeSets.map((set) => (
                        <span key={set.set_number} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                          Set {set.set_number} - {set.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <p className="text-sm text-zinc-500">No active set configured</p>
              )}
            </div>
            <Link
              href="/admin/sets"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-orange-600 border border-orange-500 rounded-lg hover:bg-orange-700 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Manage
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-t border-orange-500/10 pt-4">
           <h4 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-orange-500 px-2">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</p>
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                title: 'TFT Sets',
                description: 'Manage game sets, active status and patches',
                href: '/admin/sets',
                icon: Layers,
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/20',
              },
              {
                title: 'Champions',
                description: 'Add or edit unit stats, costs and abilities',
                href: '/admin/champions',
                icon: Users,
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/20',
              },
              {
                title: 'Traits',
                description: 'Configure synergies and trait bonuses',
                href: '/admin/traits',
                icon: Shield,
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10',
                borderColor: 'border-purple-500/20',
              },
              {
                title: 'Items',
                description: 'Manage items, recipes and artifact status',
                href: '/admin/items',
                icon: Box,
                color: 'text-green-400',
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/20',
              },
              {
                title: 'Augments',
                description: 'Add or edit TFT, Arena & ARAM augments',
                href: '/admin/augments',
                icon: Sparkles,
                color: 'text-pink-400',
                bgColor: 'bg-pink-500/10',
                borderColor: 'border-pink-500/20',
              },
              {
                title: 'Team Comps',
                description: 'View and edit team compositions',
                href: '/admin/team-comps',
                icon: UsersRound,
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-500/10',
                borderColor: 'border-cyan-500/20',
              },
            ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative block rounded-2xl bg-linear-to-br from-zinc-900/95 to-zinc-900/80 p-5 transition-all duration-500 "
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-px rounded-2xl bg-linear-to-br from-zinc-900/95 to-zinc-900/80" />
              
              <div className="relative flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${link.bgColor} border ${link.borderColor} flex items-center justify-center shrink-0 shadow-lg transition-all duration-300 `}>
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-semibold tracking-tight text-white group-hover:text-orange-500 transition-colors duration-200">
                      {link.title}
                    </h3>
                    <div className="flex items-center gap-1 text-orange-400/60">
                      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>

        {/* Team Compositions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-t border-orange-500/10 pt-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-orange-500 px-2">
            <p className="text-sm font-bold text-white uppercase tracking-wider">Team Compositions</p>
            </h4>
          </div>
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-orange-500/10 to-blue-500/5 border border-orange-400/20 rounded-xl">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">Total Compositions</p>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                {compCount?.toLocaleString() ?? 0}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Across all active sets</p>
            </div>
            <Link
              href="/tft/comps"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-orange-600 border border-orange-500 rounded-lg hover:bg-orange-700 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* League of Legends */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center">
            <Swords className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">League of Legends</h2>
            <p className="text-xs text-zinc-500">Champions, items and game data management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'LoL Items',
              description: 'Manage items, stats and game modes',
              href: '/admin/items-lol',
              icon: Package,
              color: 'text-orange-400',
              bgColor: 'bg-orange-500/10',
              borderColor: 'border-orange-500/20',
            },
            {
              title: 'Rune Trees',
              description: 'Manage rune trees and their configurations',
              href: '/admin/runes',
              icon: Zap,
              color: 'text-yellow-400',
              bgColor: 'bg-yellow-500/10',
              borderColor: 'border-yellow-500/20',
            },
            {
              title: 'Champions',
              description: 'Add or edit champion data and abilities',
              href: '/admin/champions-lol',
              icon: Swords,
              color: 'text-orange-400',
              bgColor: 'bg-orange-500/10',
              borderColor: 'border-orange-500/20',
            },
            {
              title: 'Summoner Spells',
              description: 'Manage summoner spells, cooldowns and icons',
              href: '/admin/summoner-spells',
              icon: Zap,
              color: 'text-amber-400',
              bgColor: 'bg-amber-500/10',
              borderColor: 'border-amber-500/20',
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative block rounded-2xl bg-gradient-to-br from-zinc-900/95 to-zinc-900/80 p-5 transition-all duration-500"
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/0 via-orange-500/30 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-zinc-900/95 to-zinc-900/80" />
              
              <div className="relative flex items-start gap-4">
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${link.bgColor} border ${link.borderColor} flex items-center justify-center shrink-0 shadow-lg transition-all duration-300`}>
                  <link.icon className={`w-5 h-5 ${link.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-semibold tracking-tight text-white group-hover:text-orange-500 transition-colors duration-200">
                      {link.title}
                    </h3>
                    <div className="flex items-center gap-1 text-orange-400/60">
                      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Analytics placeholder */}
        <div className='h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-opacity duration-200'></div>
        <div className="p-4 bg-white/5 border border-dashed border-zinc-700/50 rounded-xl">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5 text-zinc-600 shrink-0" />
            <div>
              <p className="text-sm text-zinc-300">Advanced analytics coming soon</p>
              <p className="text-xs text-zinc-500 mt-0.5">Real-time metrics and insights will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Top bar */}
      <div className="border-b border-white/6 bg-[#0d0d0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-400 transition-colors text-[11px] font-semibold tracking-[0.12em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Site
          </Link>
          <span className="text-white/10 text-lg font-thin">/</span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-400">
            Admin Dashboard
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 pb-24 space-y-6">
        <AdminTabs
          overviewContent={overview}
          usersContent={<UserList users={users ?? []} />}
        />
      </div>
    </div>
  );
}
