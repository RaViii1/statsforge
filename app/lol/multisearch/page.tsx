"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MultiSearch from "@/components/lol/MultiSearch";
import { Users, ArrowRight } from "lucide-react";
import NavbarLoL from "@/components/navbarlol";
import LolBanner from "@/components/lolbaner";

export default function MultiSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/5 rounded-full blur-[150px]"></div>
      </div>

      <NavbarLoL />

      <main className="relative">
        <section className="relative overflow-hidden pt-8 pb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center space-y-6">

              <h1 className="text-3xl sm:text-6xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Multi-Player
                <span className="block bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">Scout System</span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-base text-zinc-400 leading-relaxed">
                Paste your entire lobby chat and instantly analyze all players. Get rank, winrate, and stats for your entire team in seconds.
              </p>
            </div>

          </div>
        </section>

        <section className="relative mb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <MultiSearch />
          </div>
        </section>
      </main>

      <div className="w-2/3 mx-auto">
      <LolBanner/>
      </div>
      

      <Footer />
    </div>
  );
}
