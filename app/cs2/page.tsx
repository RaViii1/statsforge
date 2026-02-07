"use client";
import { Search, Loader2, TrendingUp, Users, Target, Crosshair, Award, BarChart3, Anvil, Clock, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface RecentSearch {
  steamId: string;
  displayName: string;
  timestamp: number;
}

export default function CS2Page() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("cs2_recent_searches");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed);
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const saveRecentSearch = (steamId: string, displayName: string) => {
    const newSearch: RecentSearch = {
      steamId,
      displayName,
      timestamp: Date.now(),
    };

    const filtered = recentSearches.filter(
      (s) => s.steamId !== steamId
    );

    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("cs2_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("cs2_recent_searches", JSON.stringify(updated));
  };

  const handleRecentSearchClick = (search: RecentSearch) => {
    setSearchQuery(search.steamId);
    setShowDropdown(false);
    performSearch(search.steamId);
  };

  const performSearch = async (steamId: string) => {
    setIsSearching(true);

    try {
      saveRecentSearch(steamId, steamId);
      router.push(`/cs2/profile/${encodeURIComponent(steamId)}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
      setIsSearching(false);
    }
  };


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error("Please enter a Steam ID or profile URL");
      return;
    }

    const input = searchQuery.trim();
    
    let steamId = input;
    if (input.includes('steamcommunity.com')) {
      const urlMatch = input.match(/\/profiles\/(\d+)|\/id\/([a-zA-Z0-9_-]+)/);
      if (urlMatch) {
        steamId = urlMatch[1] || urlMatch[2];
      }
    }

    if (!steamId) {
      toast.error("Invalid Steam ID or profile URL");
      return;
    }

    performSearch(steamId);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-3xl"></div>
      </div>

      <Navbar/>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-950/30 border border-orange-900/30 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-orange-600 text-sm font-medium">Counter-Strike 2 Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-yellow-500 to-orange-600">
              CS2 Performance
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Track detailed statistics, analyze match performance, weapon accuracy, and competitive rankings for Counter-Strike 2 players worldwide
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
            <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
                <div className="relative flex-1" ref={dropdownRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Steam ID, profile URL, or custom ID"
                    onFocus={() => {
                      setSearchFocused(true);
                      setShowDropdown(true);
                    }}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />

                  {showDropdown && recentSearches.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-400">Recent Searches</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 bg-orange-950/30 border border-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                                <Crosshair className="w-4 h-4 text-orange-500" />
                              </div>
                              <div className="text-left min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {search.displayName}
                                </p>
                                <p className="text-xs text-zinc-500">
                                  {new Date(search.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => removeRecentSearch(index, e)}
                              className="p-1.5 rounded-lg hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <X className="w-4 h-4 text-zinc-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                Enter your Steam ID64, custom URL, or full profile link (e.g., 76561198123456789 or steamcommunity.com/id/username)
              </p>
            </div>
          </form>
        </div>

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

      </main>




      <Footer />
    </div>
  );
}
