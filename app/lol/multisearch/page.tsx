"use client";

import Footer from "@/components/Footer";
import MultiSearch from "@/components/lol/MultiSearch";
import NavbarLoL from "@/components/NavbarLol";
import LolBanner from "@/components/LolBaner";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MultiSearchPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-orange-500/30">

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-[700px] h-[500px] bg-orange-500/3 rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-600/3 rounded-full blur-[160px]" />
        </div>

        <NavbarLoL />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6">

          <div className="pt-10 pb-8 border-b border-zinc-900">
            <Link
              href="/lol"
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-300 mb-6 transition-colors group uppercase text-[10px] font-black tracking-widest"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              LoL Hub
            </Link>

            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">
                  League of Legends
                </p>
                <h1 className="font-bebas text-7xl md:text-8xl leading-none text-white tracking-wide">
                  MULTI SEARCH
                </h1>
                <p className="text-zinc-500 text-sm mt-2 max-w-md leading-relaxed">
                  Paste your lobby chat and instantly get rank, winrate, and stats for every player in seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="py-10">
            <MultiSearch />
          </div>


          <div className="pb-12">
            <LolBanner />
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}