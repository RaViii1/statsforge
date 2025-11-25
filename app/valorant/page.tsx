"use client";
import { Search, Loader2, Users, Target, Crosshair, Award, BarChart3, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const REGIONS = [
  { value: "na", label: "North America" },
  { value: "eu", label: "Europe" },
  { value: "ap", label: "Asia Pacific" },
  { value: "kr", label: "Korea" },
  { value: "latam", label: "Latin America" },
  { value: "br", label: "Brazil" },
];

export default function ValorantPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("na");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a Riot ID");
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
        toast.error("Invalid Riot ID format. Use: Name#TAG");
        setIsSearching(false);
        return;
      }

      if (!gameName || !tagLine) {
        toast.error("Invalid Riot ID format. Use: Name#TAG");
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `/api/valorant/profile/${selectedRegion}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (response.status === 404) {
        router.push(`/valorant/profile/player-not-found?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&region=${selectedRegion}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      router.push(`/valorant/profile/${selectedRegion}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
<Navbar></Navbar>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-red-950/30 border border-red-900/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-600 text-sm font-medium">VALORANT Analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Elevate Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-red-500 via-pink-500 to-red-600">
              Agent Gameplay
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Track competitive stats, agent performance, weapon accuracy, and ranked progression for VALORANT players across all regions
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
                  className="px-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    placeholder="Enter Riot ID (e.g., TenZ#TENZ)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                Search format: RiotID#TAG (e.g., TenZ#TENZ or Shroud#NA1)
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/valorant/leaderboard"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-red-600 transition-all flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-red-500" />
              Radiant Leaderboard
            </Link>
            <Link
              href="/valorant/agents"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-red-600 transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-red-500" />
              Agent Stats
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-red-950/50 border border-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-950/70 transition-colors">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Profiles</h3>
            <p className="text-zinc-400">
              Detailed statistics including KDA, win rates, rank history, agent mastery, and comprehensive match performance tracking
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-pink-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-pink-950/50 border border-pink-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-950/70 transition-colors">
              <Target className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Agent Analytics</h3>
            <p className="text-zinc-400">
              Deep dive into agent-specific performance, ability usage statistics, pick rates, and role effectiveness across all ranks
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-red-900/50 hover:bg-zinc-900/80 transition-all group">
            <div className="w-12 h-12 bg-red-950/50 border border-red-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-950/70 transition-colors">
              <Crosshair className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Weapon Mastery</h3>
            <p className="text-zinc-400">
              Precision tracking for every weapon including headshot percentage, spray patterns, and damage efficiency metrics
            </p>
          </div>
        </div>

        {/* Stats Preview Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 bg-linear-to-br from-red-950/30 to-zinc-900/50 border border-red-900/30 rounded-xl">
            <div className="text-3xl font-bold text-red-500 mb-1">32.4%</div>
            <div className="text-sm text-zinc-400">Headshot Rate</div>
          </div>
          <div className="p-6 bg-linear-to-br from-green-950/30 to-zinc-900/50 border border-green-900/30 rounded-xl">
            <div className="text-3xl font-bold text-green-500 mb-1">54.2%</div>
            <div className="text-sm text-zinc-400">Win Rate</div>
          </div>
          <div className="p-6 bg-linear-to-br from-purple-950/30 to-zinc-900/50 border border-purple-900/30 rounded-xl">
            <div className="text-3xl font-bold text-purple-500 mb-1">1.24</div>
            <div className="text-sm text-zinc-400">Average KDA</div>
          </div>
          <div className="p-6 bg-linear-to-br from-pink-950/30 to-zinc-900/50 border border-pink-900/30 rounded-xl">
            <div className="text-3xl font-bold text-pink-500 mb-1">187</div>
            <div className="text-sm text-zinc-400">Average ACS</div>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
          <img
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/a2c0727439e828e0b4a7210dabb803bd91b3ab1b-3840x2160.jpg"
            alt="VALORANT"
            className="w-full h-96 object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Climb the Ranks?</h2>
              <p className="text-zinc-400 mb-6">Analyze your gameplay and reach Radiant</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <span className="text-red-400 font-semibold">Competitive</span>
                </div>
                <div className="px-4 py-2 bg-pink-600/20 border border-pink-600/50 rounded-lg">
                  <span className="text-pink-400 font-semibold">Premier</span>
                </div>
                <div className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 rounded-lg">
                  <span className="text-purple-400 font-semibold">Deathmatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Agents</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {["Jett", "Reyna", "Omen", "Sage", "Phoenix", "Sova", "Viper", "Cypher", "Raze", "Killjoy"].map((agent) => (
              <Link
                key={agent}
                href={`/valorant/agents/${agent.toLowerCase()}`}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-red-600 hover:bg-zinc-900 transition-all text-center group"
              >
                <div className="text-white font-semibold mb-1 group-hover:text-red-500 transition-colors">{agent}</div>
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