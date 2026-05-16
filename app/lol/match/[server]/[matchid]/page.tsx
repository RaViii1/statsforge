"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MatchAnalytics } from "@/components/lol/matchanalitics/MatchAnalitics";
import NavbarLoL from "@/components/NavbarLol";

export default function MatchAnalyticsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const server = params?.server as string;
  const matchid = params?.matchid as string;
  const targetPuuid = searchParams?.get("puuid") || undefined;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavbarLoL />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-b border-white/[0.06] bg-[#0d0d0f]/80 backdrop-blur-sm  top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            href="/lol"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-400 transition-colors text-[11px] font-semibold tracking-[0.12em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Lol
          </Link>
          <span className="text-white/10 text-lg font-thin">/</span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-400">
            Match Analytics
          </span>
        </div>
          <div className="mb-8 p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Match Performance Analysis v0.5
          </h1>
          <p className="text-zinc-400">
            Detailed performance breakdown and player statistics for this match
          </p>
        </div>
      </div>

        {/* Page Header */}


        {/* Match Analytics Component */}
        <MatchAnalytics 
          server={server} 
          matchid={matchid} 
          targetPuuid={targetPuuid}
        />
      </main>

      <Footer />
    </div>
  );
}
