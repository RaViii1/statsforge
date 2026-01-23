"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Dices,
  Package,
  Star,
  Info,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import NavbarTft from '@/components/navbartft';

const SHOP_ODDS = [
  { level: 2, odds: [100, 0, 0, 0, 0] },
  { level: 3, odds: [75, 25, 0, 0, 0] },
  { level: 4, odds: [55, 30, 15, 0, 0] },
  { level: 5, odds: [45, 33, 20, 2, 0] },
  { level: 6, odds: [30, 40, 25, 5, 0] },
  { level: 7, odds: [19, 30, 40, 10, 1] },
  { level: 8, odds: [15, 20, 32, 30, 3] },
  { level: 9, odds: [10, 17, 25, 33, 15] },
  { level: 10, odds: [5, 10, 20, 40, 25] },
  
];

const POOL_SIZES = [
  { cost: 1, size: 30, color: 'text-slate-400', bgColor: 'bg-slate-500/20', borderColor: 'border-slate-500/30' },
  { cost: 2, size: 25, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30' },
  { cost: 3, size: 18, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
  { cost: 4, size: 10, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
  { cost: 5, size: 9, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
  { cost: 7, size: 9, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' },
];

const COST_COLORS = [
  { color: 'text-slate-400', bgColor: 'bg-slate-500/20', borderColor: 'border-slate-500/30', gradientFrom: 'from-slate-500/30' },
  { color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30', gradientFrom: 'from-emerald-500/30' },
  { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', gradientFrom: 'from-blue-500/30' },
  { color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30', gradientFrom: 'from-purple-500/30' },
  { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30', gradientFrom: 'from-yellow-500/30' },
];

export default function ShopOddsPage() {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [hoveredCost, setHoveredCost] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      <NavbarTft />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/tft" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to TFT
        </Link>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Dices className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Shop Odds & Pool Sizes</h1>
              <p className="text-zinc-400">Set 16 • Last updated: 20.01.2026</p>
            </div>
          </div>
          <p className="text-zinc-400 mt-4 max-w-3xl">
            The chance of getting a certain cost of champion in your shop at each level, and the total pool size for each champion tier.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Shop Odds at Each Level</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-4 px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Level</th>
                  {[1, 2, 3, 4, 5].map(cost => (
                    <th 
                      key={cost} 
                      className={`text-center py-4 px-4 transition-colors ${hoveredCost === cost ? 'bg-zinc-800/50' : ''}`}
                      onMouseEnter={() => setHoveredCost(cost)}
                      onMouseLeave={() => setHoveredCost(null)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${COST_COLORS[cost - 1].bgColor} border ${COST_COLORS[cost - 1].borderColor}`}>
                          <span className={`text-sm font-bold ${COST_COLORS[cost - 1].color}`}>{cost}</span>
                          <Star className={`w-3.5 h-3.5 ${COST_COLORS[cost - 1].color} fill-current`} />
                        </span>
                        <span className="text-[10px] text-zinc-500">Cost</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHOP_ODDS.map(({ level, odds }) => (
                  <tr 
                    key={level}
                    className={`border-b border-zinc-800/50 transition-colors ${hoveredLevel === level ? 'bg-zinc-800/30' : 'hover:bg-zinc-800/20'}`}
                    onMouseEnter={() => setHoveredLevel(level)}
                    onMouseLeave={() => setHoveredLevel(null)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-10 h-10 rounded-lg bg-orange-950/50 border border-orange-900/30 flex items-center justify-center text-orange-500 font-black text-lg">
                          {level}
                        </span>
                        <span className="text-zinc-400 text-sm font-medium">Lvl {level}</span>
                      </div>
                    </td>
                    {odds.map((odd, idx) => (
                      <td 
                        key={idx} 
                        className={`text-center py-4 px-4 transition-colors ${hoveredCost === idx + 1 ? 'bg-zinc-800/50' : ''}`}
                      >
                        {odd > 0 ? (
                          <div className="relative">
                            <span className={`text-lg font-bold ${COST_COLORS[idx].color}`}>
                              {odd}%
                            </span>
                            <div 
                              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full ${COST_COLORS[idx].bgColor.replace('/20', '/50')}`}
                              style={{ width: `${Math.max(odd, 5)}%` }}
                            />
                          </div>
                        ) : (
                          <span className="text-zinc-700 text-lg font-medium">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Pool Sizes</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-6 max-w-2xl">
            The Pool Size (or Bag Size) is the number of each champion available in the shop. For each champion bought, the probability of hitting that champion decreases until it is empty.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            {POOL_SIZES.map(({ cost, size, color, bgColor, borderColor }) => (
              <div 
                key={cost}
                className={`relative rounded-xl ${bgColor} border ${borderColor} p-4 text-center overflow-hidden group hover:scale-105 transition-transform`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className={`text-2xl font-black ${color}`}>{cost}</span>
                    <Star className={`w-4 h-4 ${color} fill-current`} />
                  </div>
                  <span className="text-sm text-zinc-400">Cost</span>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-3xl font-black text-white">{size}</span>
                    <p className="text-xs text-zinc-500 mt-1">per champ</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">

          <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent rounded-xl p-4 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-orange-400 font-bold text-sm mb-1">Pro Tip</p>
                <p className="text-zinc-300 text-sm">
                 Champion duplicator takes units out of pull, but if the pool is empty it creates champion copy just for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
