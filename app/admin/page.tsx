import Link from 'next/link'
import { Layers, Users, Shield, Box, Plus, TrendingUp, ChevronRight } from 'lucide-react'

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
    description: 'Configure synergies and trait tier bonuses',
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

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400">Manage TFT game data and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-orange-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${link.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                <link.icon className={`w-6 h-6 ${link.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">
                    {link.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-all group-hover:translate-x-1" />
                </div>
                <p className="text-zinc-400 mt-1">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-8 bg-linear-to-br from-orange-600/20 to-amber-600/10 border border-orange-500/20 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">System Status</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Database</div>
            <div className="text-lg font-bold text-green-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Connected
            </div>
          </div>
          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Active Set</div>
            <div className="text-lg font-bold text-white">Set 13</div>
          </div>
          <div className="p-4 bg-black/20 rounded-xl border border-white/5">
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Total Comps</div>
            <div className="text-lg font-bold text-white">1,234</div>
          </div>
        </div>
      </div>
    </div>
  )
}
