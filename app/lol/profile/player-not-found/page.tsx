"use client";
import { Search, ArrowLeft, Anvil, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PlayerNotFoundPage() {
  const searchParams = useSearchParams();
  const gameName = searchParams?.get("name") || "";
  const tagLine = searchParams?.get("tag") || "";
  const server = searchParams?.get("server") || "";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className=" border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Anvil className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StatsForge</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
            <div className="w-20 h-20 bg-orange-950/50 border border-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">Player Not Found</h1>
            
            {gameName && tagLine && (
              <p className="text-xl text-zinc-400 mb-2">
                <span className="text-white font-semibold">{gameName}#{tagLine}</span>
              </p>
            )}
            
            {server && (
              <p className="text-sm text-zinc-500 mb-6">
                Server: <span className="text-orange-500 font-medium uppercase">{server}</span>
              </p>
            )}

            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-orange-500" />
                Possible Reasons
              </h3>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>The player name or tagline might be incorrect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>The player might not exist on the selected server</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Make sure to include the tagline (e.g., Player#NA1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>The account might be very new or never played League of Legends</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/40"
              >
                Search Another Player
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl font-semibold transition-all"
              >
                Sign In to Track Your Stats
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
