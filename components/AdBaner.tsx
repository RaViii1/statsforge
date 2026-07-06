"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function StatsForgeAdBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-lg border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url("/images/set17.avif")`,
        }}
      />
      
      <div className="absolute inset-0 bg-zinc-950/70 pointer-events-none" />
      
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/50 to-transparent pointer-events-none" />

      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 17.5 L55 42.5 L30 55 L5 42.5 L5 17.5 Z' fill='none' stroke='%23f97316' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-orange-500/40 rounded-full" />

      <div className="relative z-10 px-5 py-3.5">
        <div className="flex items-center gap-5">

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-0">
              <span className="font-bebas text-xl text-white tracking-wide leading-none">
                Stats
              </span>
              <span className="font-bebas text-xl text-orange-500 tracking-wide leading-none">
                Forge
              </span>
            </div>
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em] border-l border-orange-500/30 pl-2.5">
              Premium
            </span>
          </div>

          {/* Center: Message */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <p className="text-sm text-zinc-400 truncate">
                Unlock advanced analytics, real-time overlays & exclusive meta builds
              </p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="shrink-0 flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-zinc-500">From</span>
              <span className="block text-sm font-bold text-white">$4.99/mo</span>
            </div>
            <Link href="/premium">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-400 text-zinc-900 font-black text-xs uppercase tracking-wider rounded-md transition-colors"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}