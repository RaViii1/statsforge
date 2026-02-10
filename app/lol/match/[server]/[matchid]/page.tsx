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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Profile</span>
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <Link 
            href="/lol" 
            className="text-zinc-400 hover:text-orange-500 transition-colors"
          >
            League of Legends
          </Link>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
          <span className="text-orange-500 font-medium">Match Analytics</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Match Performance Analysis v0.4.1
          </h1>
          <p className="text-zinc-400">
            Detailed performance breakdown and player statistics for this match
          </p>
        </div>

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
