import Link from 'next/link'
import { createClient } from "@/lib/supabase/server";
import {
  Layers, Users, Shield, Box, TrendingUp, ChevronRight,
  Database, BarChart3, Swords, Package, Activity, Zap, Sparkles, UsersRound
} from 'lucide-react'
import AdminTabs, { UserList } from "./AdminsTab";

/* ─── Link configs ──────────────────────────────────────────────── */

const tftLinks = [
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
]

const lolLinks = [
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
    title: 'Champions',
    description: 'Add or edit champion data and abilities',
    href: '/admin/champions-lol',
    icon: Swords,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
]

/* ─── Reusable components ───────────────────────────────────────── */

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-8 bg-gradient-to-br from-orange-50/5 via-zinc-900/90 to-zinc-950/90 border border-orange-400/20 rounded-2xl shadow-xl shadow-orange-500/5 ${className}`}>
      {children}
    </div>
  )
}

function PanelHeader({
  icon: Icon,
  iconBg = 'from-orange-500/20 to-orange-400/20',
  iconBorder = 'border-orange-500/40',
  iconColor = 'text-orange-400',
  title,
  subtitle,
}: {
  icon: React.ElementType
  iconBg?: string
  iconBorder?: string
  iconColor?: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-12 h-12 bg-gradient-to-br ${iconBg} border-2 ${iconBorder} rounded-xl flex items-center justify-center shadow-md shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-zinc-500 text-sm mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, pulse }: { label: string; value: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-orange-400/40 hover:shadow-md transition-all duration-200">
      <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  )
}

function QuickLinkCard({ link }: { link: typeof tftLinks[0] }) {
  return (
    <Link
      href={link.href}
      className="group p-6 bg-gradient-to-r from-zinc-900/80 to-orange-500/5 border border-orange-400/20 rounded-2xl hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${link.bgColor} border ${link.borderColor} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
          <link.icon className={`w-6 h-6 ${link.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
              {link.title}
            </h3>
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-200" />
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed">{link.description}</p>
        </div>
      </div>
    </Link>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 border-t border-orange-400/10 pt-6 mt-2">
      <h4 className="text-base font-bold text-white shrink-0">{label}</h4>
      <div className="flex-1 h-px bg-orange-400/10" />
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: compCount } = await supabase.from("tft_team_comps").select("*", { count: "exact", head: true });
  const { data: activeSets } = await supabase.from("tft_sets").select("set_number").eq("is_active", true).order("set_number", { ascending: false });
  const { data: users } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });

  const overview = (
    <div className="space-y-6">

      {/* ── System Status ── */}
      <Panel>
        <PanelHeader
          icon={Database}
          iconBg="from-emerald-500/20 to-emerald-400/20"
          iconBorder="border-emerald-500/40"
          iconColor="text-emerald-400"
          title="System Status"
          subtitle="Core infrastructure & database health"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-orange-400/40 hover:shadow-md transition-all duration-200">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Database
            </div>
            <div className="text-2xl font-bold text-emerald-400">Live</div>
          </div>
          <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-orange-400/40 hover:shadow-md transition-all duration-200">
            <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              Registered Users
            </div>
            <div className="text-2xl font-bold text-white">{userCount?.toLocaleString() ?? 0}</div>
          </div>
        </div>
      </Panel>

      {/* ── TFT ── */}
      <Panel>
        <PanelHeader
          icon={TrendingUp}
          title="TFT Management"
          subtitle="Active set, champions, traits and items"
        />

        {/* Active Set */}
        <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl hover:border-orange-400/40 transition-all duration-200">
          <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Active Set</div>
          {activeSets && activeSets.length > 0 ? (
            activeSets.length === 1 ? (
              <div className="text-2xl font-bold text-white flex items-center gap-3">
                Set {activeSets[0].set_number}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
            ) : (
              <>
                <div className="text-lg font-bold text-white mb-3">Active Sets ({activeSets.length})</div>
                <div className="flex flex-wrap gap-2">
                  {activeSets.map((set) => (
                    <span key={set.set_number} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold">
                      Set {set.set_number}
                    </span>
                  ))}
                </div>
              </>
            )
          ) : (
            <div className="text-2xl font-bold text-zinc-500">No active set</div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-6 space-y-4">
          <SectionDivider label="Quick Actions" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tftLinks.map(link => <QuickLinkCard key={link.href} link={link} />)}
          </div>
        </div>

        {/* Team comps */}
        <div className="mt-6 space-y-4">
          <SectionDivider label="Team Compositions" />
          <div className="flex items-center justify-between">
            <div className="flex flex-row justify-between p-6 bg-gradient-to-r from-zinc-950/70 to-zinc-900/70 border border-orange-400/20 rounded-xl flex-1 mr-4">
              <div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-3">Total Compositions</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {compCount?.toLocaleString() ?? 0}
                </div>
              </div>
              <Link
                href="/tft/comps"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/90 to-orange-600/90 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 border border-orange-500/30 shrink-0"
              >
                <BarChart3 className="w-4 h-4" />
                View All
              </Link>
            </div>

          </div>
        </div>
      </Panel>

      {/* ── LoL ── */}
      <Panel>
        <PanelHeader
          icon={Swords}
          title="LoL Management"
          subtitle="Champions, items and game data"
        />

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lolLinks.map(link => <QuickLinkCard key={link.href} link={link} />)}
          </div>
        </div>

        {/* Analytics placeholder */}
        <div className="mt-6 space-y-4">
          <SectionDivider label="LoL Analytics" />
          <div className="p-6 bg-zinc-950/50 border border-dashed border-zinc-700/50 rounded-xl flex items-center gap-4">
            <Activity className="w-5 h-5 text-zinc-600 shrink-0" />
            <p className="text-sm text-zinc-500">Analytics will appear here once data is ingested.</p>
          </div>
        </div>
      </Panel>

    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="pb-8 border-b border-zinc-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400/90 to-orange-500/90 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">Manage TFT &amp; League of Legends data</p>
      </div>

      <AdminTabs
        overviewContent={overview}
        usersContent={<UserList users={users ?? []} />}
      />
    </div>
  );
}