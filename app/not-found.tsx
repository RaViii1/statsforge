"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, BarChart3, ShieldAlert, Search, RefreshCcw, Activity, Hammer, Flame, Terminal, Database, Cpu, HardDrive } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-orange-500/30 font-sans selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px]" />

        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <Navbar />

      <main className="relative flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square max-w-[540px] mx-auto flex items-center justify-center"
            >

              <div className="absolute inset-0 border border-zinc-900 rounded-full scale-[1.15] opacity-20" />
              <div className="absolute inset-0 border border-zinc-900 rounded-full scale-[1.05]" />
              <div className="absolute inset-0 bg-linear-to-b from-zinc-900/40 to-transparent border border-zinc-800 rounded-full" />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t border-orange-500/10 rounded-full"
              />

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="relative"
                >
                  <div className="text-[200px] lg:text-[240px] font-black text-white/2 leading-none tracking-tighter select-none">
                    404
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <Hammer className="w-20 h-20 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
                      <motion.div
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 30, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        {/* <Flame className="w-8 h-8 text-orange-400" /> */}
                      </motion.div>
                    </motion.div>
                    <span className="mt-6 text-[10px] font-mono tracking-[0.5em] text-zinc-500 uppercase ml-2">Foundry Status: Dormant</span>
                  </div>
                </motion.div>
              </div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute w-1.5 h-1.5 bg-orange-500/40 rounded-full blur-[1px]"
                  style={{
                    top: `${50 + 42 * Math.sin(i * (Math.PI / 4))}%`,
                    left: `${50 + 42 * Math.cos(i * (Math.PI / 4))}%`,
                  }}
                />
              ))}

              <div className="absolute top-0 right-0 p-4 border-t border-r border-zinc-800 rounded-tr-3xl opacity-40">
                <Terminal className="w-4 h-4 text-zinc-600 mb-2" />
                <div className="space-y-1">
                  <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-48, 48] }} transition={{ duration: 2, repeat: Infinity }} className="w-full h-full bg-orange-500/50" />
                  </div>
                  <div className="w-8 h-1 bg-zinc-800 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em] backdrop-blur-sm">
                <ShieldAlert className="w-3.5 h-3.5" />
                Forge Diagnostics: Error 404
              </div>
              
              <h1 className="text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                The Forge has <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">Gone Cold.</span>
              </h1>
              
              <p className="text-zinc-400 text-lg xl:text-xl max-w-xl leading-relaxed">
                The data point you are attempting to access has been decoupled from the StatsForge mainnet. It may have been relocated to a different sector or did not exist in the first place.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid sm:grid-cols-3 gap-4"
            >
              {[
                { label: "Core Temp", value: "0°K", icon: Flame, status: "Critical" },
                { label: "Integrity", value: "99.9%", icon: Database, status: "Optimal" },
                { label: "Resource", value: "Null", icon: Cpu, status: "Missing" }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-700 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-4 h-4 text-zinc-500 group-hover:text-orange-500 transition-colors" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-bold text-white">{stat.value}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${stat.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {stat.status}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link 
                href="/"
                className="relative group flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all hover:scale-[1.02] shadow-[0_10px_30px_-10px_rgba(249,115,22,0.3)]"
              >
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Home className="w-5 h-5" />
                Return to Forge
              </Link>
              <button 
                onClick={() => window.history.back()}
                className="group flex items-center justify-center gap-3 px-10 py-4 rounded-xl border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 transition-all font-bold"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Previous Chamber
              </button>
            </motion.div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-zinc-900/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Quick Relocation:</span>
              </div>
              <div className="flex gap-6">
                {['lol', 'cs2', 'tft', 'Valorant', 'Fortnite'].map((game) => (
                  <Link 
                    key={game}
                    href={`/${game.toLowerCase()}`} 
                    className="text-xs text-zinc-500 hover:text-orange-500 transition-colors font-bold uppercase tracking-widest"
                  >
                    {game}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
