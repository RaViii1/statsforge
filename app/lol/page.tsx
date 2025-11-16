"use client";
import { Search, Loader2, TrendingUp, Users, Target } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import NavbarLol from "@/Components/navbarlol";
import Footer from "@/Components/footer";


const SERVERS = [
  { value: "na1", label: "NA" },
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUNE" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
  { value: "la1", label: "LAN" },
  { value: "la2", label: "LAS" },
  { value: "oc1", label: "OCE" },
  { value: "ru", label: "RU" },
  { value: "tr1", label: "TR" },
  { value: "jp1", label: "JP" },
];

export default function LolPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
          'ru': 'RU',
          'tr1': 'TR1',
          'jp1': 'JP1'
        };
        tagLine = serverDefaults[selectedServer] || 'EUNE';
      }

      if (!gameName || !tagLine) {
        toast.error("Invalid Riot ID format. Use: GameName#TAG");
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `/api/lol/profile/${selectedServer}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (response.status === 404) {
        router.push(`/lol/profile/player-not-found?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&server=${selectedServer}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      router.push(`/lol/profile/${selectedServer}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <NavbarLol />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-950/30 border border-orange-900/30 rounded-full">
            <span className="text-orange-600 text-sm font-medium">League of Legends Stats</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Track Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-500">
              Summoner Stats
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Search any League of Legends player, view match history, champion mastery, and ranked statistics across all regions
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
                {/* Server Selector */}
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  disabled={isSearching}
                  className="px-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {SERVERS.map((server) => (
                    <option key={server.value} value={server.value}>
                      {server.label}
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
                    placeholder="Enter summoner name (e.g., Faker#KR1)"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
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
                Search format: GameName#TAG (e.g., Faker#KR1 or Doublelift#NA1)
              </p>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/lol/champions"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-800 hover:border-orange-600 transition-all flex items-center gap-2"
            >
              <Target className="w-5 h-5 text-orange-500" />
              Champion Statistics
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 transition-all">
            <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Player Profiles</h3>
            <p className="text-zinc-400">
              View detailed summoner profiles with ranked stats, match history, and champion mastery across all regions
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-purple-900/50 hover:bg-zinc-900/80 transition-all">
            <div className="w-12 h-12 bg-purple-950/50 border border-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Champion Stats</h3>
            <p className="text-zinc-400">
              Explore champion win rates, pick rates, and performance across different roles and patches
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 transition-all">
            <div className="w-12 h-12 bg-orange-950/50 border border-orange-900/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Match Analysis</h3>
            <p className="text-zinc-400">
              Deep dive into match details with performance metrics, damage stats, and comprehensive rune analysis
            </p>
          </div>
        </div>

        {/* Background Image */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 mt-16 ">
          <img
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/5255b8c8fc9946d9313a244ef6f1a91d046b0bde-1920x1080.jpg?auto=format&fit=fill&q=80&w=1184"
            alt="League of Legends"
            className="w-full h-96 object-cover opacity-20 "
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to Analyze Your Performance?</h2>
              <p className="text-zinc-400">Search for any summoner to get started</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
