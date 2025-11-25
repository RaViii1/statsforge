"use client";
import { Search, Loader2, TrendingUp, Users, Target, Crosshair, Award, BarChart3, Anvil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/navbar";

const REGIONS = [
  { value: "global", label: "Global" },
  { value: "eu", label: "Europe" },
  { value: "na", label: "North America" },
  { value: "sa", label: "South America" },
  { value: "asia", label: "Asia" },
  { value: "oce", label: "Oceania" },
  { value: "me", label: "Middle East" },
  { value: "africa", label: "Africa" },
];

export default function CS2Page() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("global");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a Steam ID or profile URL");
      return;
    }

    setIsSearching(true);

    try {
      const input = searchQuery.trim();
      
      // Extract Steam ID from URL or use as-is
      let steamId = input;
      if (input.includes('steamcommunity.com')) {
        const urlMatch = input.match(/\/profiles\/(\d+)|\/id\/([a-zA-Z0-9_-]+)/);
        if (urlMatch) {
          steamId = urlMatch[1] || urlMatch[2];
        }
      }

      if (!steamId) {
        toast.error("Invalid Steam ID or profile URL");
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `/api/cs2/profile/${selectedRegion}/${encodeURIComponent(steamId)}`
      );

      if (response.status === 404) {
        router.push(`/cs2/profile/player-not-found?id=${encodeURIComponent(steamId)}&region=${selectedRegion}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      router.push(`/cs2/profile/${selectedRegion}/${encodeURIComponent(steamId)}`);
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
<Navbar/>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-950/30 border border-orange-900/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-600 text-sm font-medium">Counter-Strike 2 Analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-yellow-500 to-orange-600">
              CS2 Performance
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Track detailed statistics, analyze match performance, weapon accuracy, and competitive rankings for Counter-Strike 2 players worldwide
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
                {/* Region Selector */}
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={isSearching}
                  className="px-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
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
                    placeholder="Steam ID, profile URL, or custom ID"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-orange-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                Enter your Steam ID64, custom URL, or full profile link (e.g., 76561198123456789 or steamcommunity.com/id/username)
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cs2/leaderboard"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-orange-600 transition-all flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-orange-500" />
              Global Leaderboard
            </Link>
            <Link
              href="/cs2/weapons"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-orange-600 transition-all flex items-center gap-2"
            >
              <Crosshair className="w-5 h-5 text-orange-500" />
              Weapon Stats
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-950/70 transition-colors">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Profiles</h3>
            <p className="text-zinc-400">
              Comprehensive player statistics including K/D ratio, headshot percentage, match history, and competitive rank progression
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-yellow-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-yellow-950/50 border border-yellow-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-950/70 transition-colors">
              <Crosshair className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Weapon Analytics</h3>
            <p className="text-zinc-400">
              Detailed weapon statistics with accuracy metrics, kill counts, damage per round, and spray control analysis
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-950/70 transition-colors">
              <BarChart3 className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Match Insights</h3>
            <p className="text-zinc-400">
              In-depth match breakdowns with round-by-round analysis, economy management, and performance heatmaps
            </p>
          </div>
        </div>

        {/* Stats Preview Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 bg-linear-to-br from-orange-950/30 to-zinc-900/50 border border-orange-900/30 rounded-xl">
            <div className="text-3xl font-bold text-orange-500 mb-1">98.4%</div>
            <div className="text-sm text-zinc-400">Headshot Accuracy</div>
          </div>
          <div className="p-6 bg-linear-to-br from-green-950/30 to-zinc-900/50 border border-green-900/30 rounded-xl">
            <div className="text-3xl font-bold text-green-500 mb-1">1.47</div>
            <div className="text-sm text-zinc-400">Average K/D Ratio</div>
          </div>
          <div className="p-6 bg-linear-to-br from-blue-950/30 to-zinc-900/50 border border-blue-900/30 rounded-xl">
            <div className="text-3xl font-bold text-blue-500 mb-1">23K</div>
            <div className="text-sm text-zinc-400">Active Players</div>
          </div>
          <div className="p-6 bg-linear-to-br from-purple-950/30 to-zinc-900/50 border border-purple-900/30 rounded-xl">
            <div className="text-3xl font-bold text-purple-500 mb-1">156</div>
            <div className="text-sm text-zinc-400">Matches Analyzed</div>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/ss_34a4e0dd339ecb42bf3b7ea2f09d2f11bada43c1.1920x1080.jpg"
            alt="Counter-Strike 2"
            className="w-full h-96 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Dominate the Competition?</h2>
              <p className="text-zinc-400 mb-6">Analyze your gameplay and climb the ranks</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="px-4 py-2 bg-orange-600/20 border border-orange-600/50 rounded-lg">
                  <span className="text-orange-400 font-semibold">Premier Mode</span>
                </div>
                <div className="px-4 py-2 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                  <span className="text-yellow-400 font-semibold">Competitive</span>
                </div>
                <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                  <span className="text-blue-400 font-semibold">Wingman</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Stats Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Maps</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Dust II", "Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Overpass", "Vertigo"].map((map) => (
              <Link
                key={map}
                href={`/cs2/maps/${map.toLowerCase().replace(' ', '-')}`}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-orange-600 hover:bg-zinc-900 transition-all text-center group"
              >
                <div className="text-white font-semibold mb-1 group-hover:text-orange-500 transition-colors">{map}</div>
                <div className="text-xs text-zinc-500">View Stats</div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-zinc-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Anvil className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-white">StatsForge</span>
              </div>
              <p className="text-sm text-zinc-400">
                Advanced Counter-Strike 2 statistics and analytics platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/cs2/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link></li>
                <li><Link href="/cs2/weapons" className="hover:text-white transition-colors">Weapon Stats</Link></li>
                <li><Link href="/cs2/maps" className="hover:text-white transition-colors">Map Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="/cs2/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/cs2/api" className="hover:text-white transition-colors">API Docs</Link></li>
                <li><Link href="/cs2/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500">
            <p>© 2025 StatsForge. Not affiliated with Valve Corporation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}