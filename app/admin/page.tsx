import Link from 'next/link'
import { createClient } from "@/lib/supabase/server";
import { Layers, Users, Shield, Box, TrendingUp, ChevronRight, Users2, Database, BarChart3 } from 'lucide-react'
import AdminTabs, { UserList } from "./AdminsTab";

const adminLinks = [
  {
    title: 'TFT Sets',
    description: 'Manage game sets, active status and patches',
    href: '/admin/sets',
    icon: Layers,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    title: 'Champions',
    description: 'Add or edit unit stats, costs and abilities',
    href: '/admin/champions',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Traits',
    description: 'Configure synergies and trait bonuses',
    href: '/admin/traits',
    icon: Shield,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    title: 'Items',
    description: 'Manage items, recipes and artifact status',
    href: '/admin/items',
    icon: Box,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  }
]

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch actual stats
  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: compCount } = await supabase.from("tft_team_comps").select("*", { count: "exact", head: true });
  const { data: activeSets } = await supabase.from("tft_sets").select("set_number").eq("is_active", true).order("set_number", { ascending: false });
  
  // Fetch users for the tab
  const { data: users } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false });

  const overview = (
    <div className="space-y-8">

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        
        <div className="p-8 bg-gradient-to-br from-orange-50/5 to-orange-50/2 via-zinc-900/90 border border-orange-400/20 rounded-2xl shadow-xl shadow-orange-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-400/20 border-2 border-emerald-500/40 rounded-xl flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">System Status</h3>
              <p className="text-zinc-500 text-sm">Core infrastructure & database health</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl group hover:border-orange-400/60 hover:shadow-md transition-all duration-200">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Database
              </div>
              <div className="text-2xl font-bold text-emerald-400">Live</div>
            </div>
            
            <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl group hover:border-orange-400/60 hover:shadow-md transition-all duration-200">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Registered Users</div>
              <div className="text-2xl font-bold text-white">{userCount?.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>

        {/* TFT Analytics - Unchanged */}
        <div className="p-8 bg-gradient-to-br from-orange-50/5 to-orange-50/2 via-zinc-900/90 border border-orange-400/20 rounded-2xl shadow-xl shadow-orange-500/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-400/20 border-2 border-orange-500/40 rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">TFT Analytics</h3>
              <p className="text-zinc-500 text-sm">Active set & team composition stats</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Active Set */}
            <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-xl group hover:border-orange-400/60 hover:shadow-md transition-all duration-200">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-3">Active Set</div>
              <div className="space-y-2">
                  {activeSets && activeSets.length > 0 ? (
                    activeSets.length === 1 ? (
                      <div className="text-2xl font-bold text-white flex items-center gap-2">
                        Set {activeSets[0].set_number}
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      </div>
                    ) : (
                      <>
                        <div className="text-lg font-bold text-white mb-2">Active Sets ({activeSets.length})</div>
                        <div className="flex flex-wrap gap-2">
                          {activeSets.map((set) => (
                            <span key={set.set_number} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-bold">
                              Set {set.set_number}
                            </span>
                          ))}
                        </div>
                      </>
                    )
                  ) : (
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      Set N/A
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  )}
                </div>
            </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400/90 to-orange-500/90 bg-clip-text text-transparent">
                 TFT Quick Actions
                </h2>
                <p className="text-zinc-400">Manage your TFT game data and configurations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group p-6 bg-linear-to-r from-zinc-900/80 to-orange-500/10 border border-orange-400/20 rounded-2xl hover:border-orange-400/60 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/10"
                  >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${link.bgColor} rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/50 shadow-sm`}>
                      <link.icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-200">
                          {link.title}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-orange-400 transition-all duration-200 group-hover:translate-x-1" />
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">{link.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Teamcomps */}
            <div className="space-y-4 border-t border-amber-600/30 py-4 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-white ">Team Compositions</h4>
                <Link 
                  href="/tft/comps" 
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-orange-500/90 to-orange-600/90 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl border border-orange-500/30"
                >
                  <BarChart3 className="w-4 h-4" />
                  View All
                </Link>
              </div>
              
              <div className="p-6 bg-gradient-to-r from-zinc-950/70 to-zinc-900/70 border border-orange-400/20 rounded-xl shadow-inner">
                <div className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-4">Total Compositions</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {compCount?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="space-y-4 pb-12 border-b border-zinc-800">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400/90 to-orange-500/90 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>

      <AdminTabs 
        overviewContent={overview} 
        usersContent={<UserList users={users || []} />} 
      />
    </div>
  )
}
