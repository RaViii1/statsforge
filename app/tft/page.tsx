"use client";
import { Search, Loader2, Users, Trophy, Sparkles, Award, BarChart3, Swords } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/Components/footer";
import Navbar from "@/Components/navbar";

const REGIONS = [
  { value: "na1", label: "NA" },
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUNE" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
  { value: "la1", label: "LAN" },
  { value: "la2", label: "LAS" },
  { value: "oc1", label: "OCE" },
  { value: "jp1", label: "JP" },
];

export default function TFTPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("na1");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a summoner name");
      return;
    }

    setIsSearching(true);

    try {
      const input = searchQuery.trim();
      let gameName: string;
      let tagLine: string;

      if (input.includes('#')) {
        const parts = input.split('#');
        gameName = parts[0];
        tagLine = parts[1];
      } else {
        gameName = input;
        const serverDefaults: Record<string, string> = {
          'na1': 'NA1',
          'euw1': 'EUW',
          'eun1': 'EUNE',
          'kr': 'KR',
          'br1': 'BR1',
          'la1': 'LAN',
          'la2': 'LAS',
          'oc1': 'OCE',
          'jp1': 'JP1'
        };
        tagLine = serverDefaults[selectedRegion] || 'NA1';
      }

      if (!gameName || !tagLine) {
        toast.error("Invalid Riot ID format. Use: GameName#TAG");
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `/api/tft/profile/${selectedRegion}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (response.status === 404) {
        router.push(`/tft/profile/player-not-found?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&region=${selectedRegion}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      router.push(`/tft/profile/${selectedRegion}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
<Navbar />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-950/30 border border-purple-900/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-purple-600 text-sm font-medium">Teamfight Tactics Analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Master the
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-blue-500 to-purple-600">
              Strategic Battleground
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Track your TFT performance with detailed match history, comp analytics, placement trends, and climb statistics across all ranks
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
                  className="px-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-600/50 focus:bg-zinc-900/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    placeholder="Enter summoner name (e.g., Dishsoap#NA1)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                Search format: GameName#TAG (e.g., Dishsoap#NA1 or setsuko#KR1)
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tft/leaderboard"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-purple-600 transition-all flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-purple-500" />
              Challenger Leaderboard
            </Link>
            <Link
              href="/tft/meta"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-purple-600 transition-all flex items-center gap-2"
            >
              <Swords className="w-5 h-5 text-purple-500" />
              Meta Compositions
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-purple-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-purple-950/50 border border-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-950/70 transition-colors">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Profiles</h3>
            <p className="text-zinc-400">
              Comprehensive stats including LP gains, average placement, rank progression, and detailed match history analysis
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-blue-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-blue-950/50 border border-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-950/70 transition-colors">
              <Swords className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Comp Analytics</h3>
            <p className="text-zinc-400">
              Discover meta team compositions, trait synergies, item optimization, and unit positioning strategies for every set
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-purple-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-purple-950/50 border border-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-950/70 transition-colors">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Match Insights</h3>
            <p className="text-zinc-400">
              Deep match analysis with placement patterns, economy tracking, augment choices, and performance trends over time
            </p>
          </div>
        </div>

        {/* Stats Preview Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 bg-linear-to-br from-purple-950/30 to-zinc-900/50 border border-purple-900/30 rounded-xl">
            <div className="text-3xl font-bold text-purple-500 mb-1">3.8</div>
            <div className="text-sm text-zinc-400">Avg Placement</div>
          </div>
          <div className="p-6 bg-linear-to-br from-blue-950/30 to-zinc-900/50 border border-blue-900/30 rounded-xl">
            <div className="text-3xl font-bold text-blue-500 mb-1">42%</div>
            <div className="text-sm text-zinc-400">Top 4 Rate</div>
          </div>
          <div className="p-6 bg-linear-to-br from-green-950/30 to-zinc-900/50 border border-green-900/30 rounded-xl">
            <div className="text-3xl font-bold text-green-500 mb-1">+187</div>
            <div className="text-sm text-zinc-400">LP This Week</div>
          </div>
          <div className="p-6 bg-linear-to-br from-pink-950/30 to-zinc-900/50 border border-pink-900/30 rounded-xl">
            <div className="text-3xl font-bold text-pink-500 mb-1">24</div>
            <div className="text-sm text-zinc-400">Games Played</div>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/e991c6b6b89f0e94c8f5643fca56a51654f2f0f7-3840x2160.jpg"
            alt="Teamfight Tactics"
            className="w-full h-96 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Climb to Challenger?</h2>
              <p className="text-zinc-400 mb-6">Optimize your strategy and dominate every lobby</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-lg">
                  <span className="text-purple-400 font-semibold">Ranked</span>
                </div>
                <div className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg">
                  <span className="text-blue-400 font-semibold">Hyper Roll</span>
                </div>
                <div className="px-4 py-2 bg-pink-600/20 border border-pink-600/50 rounded-lg">
                  <span className="text-pink-400 font-semibold">Double Up</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traits Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Traits</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Sentinel", "Bastion", "Invoker", "Gunner", "Quickshot", "Rebel", "Conqueror", "Enforcer", "Sorcerer", "Visionary"].map((trait) => (
              <Link
                key={trait}
                href={`/tft/traits/${trait.toLowerCase()}`}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-purple-600 hover:bg-zinc-900 transition-all text-center group"
              >
                <div className="text-white font-semibold mb-1 group-hover:text-purple-500 transition-colors">{trait}</div>
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