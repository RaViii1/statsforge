"use client";
import { Search, Loader2, Users, Trophy, Target, Award, BarChart3, Crosshair, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "pc", label: "PC" },
  { value: "psn", label: "PlayStation" },
  { value: "xbl", label: "Xbox" },
  { value: "switch", label: "Nintendo Switch" },
  { value: "mobile", label: "Mobile" },
];

export default function FortnitePage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an Epic Games username");
      return;
    }

    setIsSearching(true);

    try {
      const username = searchQuery.trim();

      const response = await fetch(
        `/api/fortnite/profile/${selectedPlatform}/${encodeURIComponent(username)}`
      );

      if (response.status === 404) {
        router.push(`/fortnite/profile/player-not-found?username=${encodeURIComponent(username)}&platform=${selectedPlatform}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      router.push(`/fortnite/profile/${selectedPlatform}/${encodeURIComponent(username)}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
<Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-cyan-950/30 border border-cyan-900/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-600 text-sm font-medium">Fortnite Battle Royale Analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Track Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-cyan-500 via-blue-500 to-purple-600">
              Victory Royales
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Comprehensive Fortnite statistics including wins, K/D ratio, win rate, and detailed match history across all game modes and platforms
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
                {/* Platform Selector */}
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  disabled={isSearching}
                  className="px-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-cyan-600/50 focus:bg-zinc-900/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Epic Games username (e.g., Ninja)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-left">
                Enter your Epic Games display name (e.g., Ninja, Bugha, SypherPK)
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/fortnite/leaderboard"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-cyan-600 transition-all flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-cyan-500" />
              Global Leaderboard
            </Link>
            <Link
              href="/fortnite/shop"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-cyan-600 transition-all flex items-center gap-2"
            >
              <Trophy className="w-5 h-5 text-cyan-500" />
              Item Shop
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-950/70 transition-colors">
              <Users className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Profiles</h3>
            <p className="text-zinc-400">
              Detailed statistics including total wins, K/D ratio, win rate, matches played, and performance trends across all modes
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-purple-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-purple-950/50 border border-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-950/70 transition-colors">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Mode Statistics</h3>
            <p className="text-zinc-400">
              Break down your performance across Solo, Duo, Trio, and Squad modes with detailed analytics for each playlist
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-cyan-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-950/70 transition-colors">
              <BarChart3 className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Match History</h3>
            <p className="text-zinc-400">
              View recent matches with placement, eliminations, accuracy stats, and performance graphs over time
            </p>
          </div>
        </div>

        {/* Stats Preview Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 bg-linear-to-br from-cyan-950/30 to-zinc-900/50 border border-cyan-900/30 rounded-xl">
            <div className="text-3xl font-bold text-cyan-500 mb-1">1,247</div>
            <div className="text-sm text-zinc-400">Total Wins</div>
          </div>
          <div className="p-6 bg-linear-to-br from-green-950/30 to-zinc-900/50 border border-green-900/30 rounded-xl">
            <div className="text-3xl font-bold text-green-500 mb-1">2.8</div>
            <div className="text-sm text-zinc-400">K/D Ratio</div>
          </div>
          <div className="p-6 bg-linear-to-br from-purple-950/30 to-zinc-900/50 border border-purple-900/30 rounded-xl">
            <div className="text-3xl font-bold text-purple-500 mb-1">18.4%</div>
            <div className="text-sm text-zinc-400">Win Rate</div>
          </div>
          <div className="p-6 bg-linear-to-br from-blue-950/30 to-zinc-900/50 border border-blue-900/30 rounded-xl">
            <div className="text-3xl font-bold text-blue-500 mb-1">6,782</div>
            <div className="text-sm text-zinc-400">Total Matches</div>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src="https://cdn2.unrealengine.com/ch5s4-keyart-3840x2160-1-3840x2160-a87bbe27f06e.jpg"
            alt="Fortnite"
            className="w-full h-96 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Claim Victory Royale?</h2>
              <p className="text-zinc-400 mb-6">Track your progress and dominate the island</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="px-4 py-2 bg-cyan-600/20 border border-cyan-600/50 rounded-lg">
                  <span className="text-cyan-400 font-semibold">Battle Royale</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-lg">
                  <span className="text-purple-400 font-semibold">Zero Build</span>
                </div>
                <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                  <span className="text-blue-400 font-semibold">Ranked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Modes Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Game Modes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Solo", icon: "👤" },
              { name: "Duos", icon: "👥" },
              { name: "Trios", icon: "👥👤" },
              { name: "Squads", icon: "👥👥" },
              { name: "Zero Build", icon: "🚫" },
              { name: "Ranked", icon: "🏆" },
              { name: "Arena", icon: "⚔️" },
              { name: "Creative", icon: "🎨" }
            ].map((mode) => (
              <Link
                key={mode.name}
                href={`/fortnite/modes/${mode.name.toLowerCase().replace(' ', '-')}`}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-cyan-600 hover:bg-zinc-900 transition-all text-center group"
              >
                <div className="text-2xl mb-2">{mode.icon}</div>
                <div className="text-white font-semibold mb-1 group-hover:text-cyan-500 transition-colors">{mode.name}</div>
                <div className="text-xs text-zinc-500">View Stats</div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
<Footer />
    </div>
  );
}