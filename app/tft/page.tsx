"use client";

import { Search, Loader2, Clock, X, Trophy, TrendingUp, Store, Users2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import NavbarTft from "@/components/NavbarTft";
import { CurrentSetNumber } from "@/lib/tft/champions";

import { SERVERS } from "@/lib/utils";
interface RecentSearch {
  gameName: string;
  tagLine: string;
  server: string;
  timestamp: number;
}

export default function TFTPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stats, setStats] = useState({  activeSetNumbers: [] as number[] });
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [compsRes, champsRes, traitsRes, setsRes] = await Promise.all([
          fetch('/api/tft/team-comps'),
          fetch('/api/tft/champions'),
          fetch('/api/tft/traits'),
          fetch('/api/tft/active-sets')
        ]);
        
        const [compsData, champsData, traitsData, setsData] = await Promise.all([
          compsRes.ok ? compsRes.json() : [],
          champsRes.ok ? champsRes.json() : [],
          traitsRes.ok ? traitsRes.json() : [],
          setsRes.ok ? setsRes.json() : []
        ]);
        
        setStats({
          activeSetNumbers: Array.isArray(setsData) ? setsData.map((s: any) => s.set_number).sort((a: number, b: number) => b - a) : []
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("tft_recent_searches");
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

  const saveRecentSearch = (gameName: string, tagLine: string, server: string) => {
    const newSearch: RecentSearch = {
      gameName,
      tagLine,
      server,
      timestamp: Date.now(),
    };
    const filtered = recentSearches.filter(
      (s) => !(s.gameName === gameName && s.tagLine === tagLine && s.server === server)
    );
    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("tft_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("tft_recent_searches", JSON.stringify(updated));
  };

  const performSearch = async (gameName: string, tagLine: string, server: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/tft/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (response.status === 404) {
        toast.error("Player not found");
        setIsSearching(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      saveRecentSearch(gameName, tagLine, server);
      router.push(`/tft/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a Riot ID");
      return;
    }

    const input = searchQuery.trim();
    let gameName: string;
    let tagLine: string;

    if (input.includes('#')) {
      const parts = input.split('#');
      gameName = parts[0].trim();
      tagLine = parts[1].trim();
    } else {
      gameName = input;
      const serverDefaults: Record<string, string> = {
        'na1': 'NA1', 'euw1': 'EUW', 'eun1': 'EUNE', 'kr': 'KR',
        'br1': 'BR1', 'la1': 'LAN', 'la2': 'LAS', 'oc1': 'OCE',
        'ru': 'RU', 'tr1': 'TR1', 'jp1': 'JP1'
      };
      tagLine = serverDefaults[selectedServer] || 'EUNE';
    }

    if (!gameName || !tagLine) {
      toast.error("Invalid Riot ID format. Use: Name#TAG");
      return;
    }

    performSearch(gameName, tagLine, selectedServer);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavbarTft />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-950/30 border border-orange-900/30 rounded-full">
            <span className="text-orange-600 text-sm font-medium">Teamfight Tactics Stats</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Analyze Your
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-yellow-500">
              TFT Performance
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12">
            Search any TFT player, view match history, synergies, and ranked progression
          </p>

          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12" style={{ position: 'relative', zIndex: 9999 }}>
            <div className={`transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : 'scale-100'}`}>
              <div className="flex gap-2">
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

                <div className="relative flex-1" ref={dropdownRef} style={{ position: 'relative', zIndex: 9999 }}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-20" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Riot ID (e.g., Faker#KR1)"
                      onFocus={() => {
                        setSearchFocused(true);
                        setShowDropdown(true);
                      }}
                      onBlur={() => setSearchFocused(false)}
                      disabled={isSearching}
                      className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg relative z-10"
                    />
                  </div>

                  {showDropdown && recentSearches.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', zIndex: 9999, overflow: 'hidden' }}>
                      <div className="p-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-zinc-400">Recent Searches</span>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSearchQuery(`${search.gameName}#${search.tagLine}`);
                              setSelectedServer(search.server);
                              setShowDropdown(false);
                              performSearch(search.gameName, search.tagLine, search.server);
                            }}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-pointer bg-zinc-900"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 bg-orange-950/30 border border-orange-900/50 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-orange-500">
                                  {SERVERS.find(s => s.value === search.server)?.label || search.server.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-left min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {search.gameName}
                                  <span className="text-zinc-500">#{search.tagLine}</span>
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
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  <span>{isSearching ? 'Searching...' : 'Search'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-3 text-left">
                Search format: Name#TAG (e.g., Player#EUNE)
              </p>
            </div>
          </form>
        </div>

      
<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
  {/* Team Planner */}
  <Link 
    href="/tft/planner"
    className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full block no-underline"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
    
    <div className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500 bg-[url('/images/planner.png')] bg-cover bg-center" />

    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />

    <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />

    <div className="relative z-10 h-full flex flex-col justify-end">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <Search className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
            Tool
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            Team Planner
          </h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed">
          Build and save your perfect compositions with our interactive hex-grid tool.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            Launch tool <span className="text-orange-500">→</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Bottom glow on hover */}
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
  </Link>

  {/* Meta Comps */}
  <Link 
    href="/tft/comps"
    className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full block no-underline"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
    
    {/* Background image - kept */}
    <div className="absolute inset-0 opacity-20 group-hover:opacity-20 transition-opacity duration-500 bg-[url('/images/Texture.jpg')] bg-cover bg-center" />
    
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
    <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
    
    <div className="relative z-10 h-full flex flex-col justify-end">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <TrendingUp className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
            Meta
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            Meta Comps
          </h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed">
          {loading ? 'Loading...' : (
            <>
              {stats.activeSetNumbers.length === 1 
                ? `Check most popular team comps in Set ${stats.activeSetNumbers[0]}`
                : `Check most popular team comps in Sets ${stats.activeSetNumbers.join(', ')}`}
            </>
          )}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            View Meta <span className="text-orange-500">→</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
  </Link>

  {/* Shop Odds */}
  <Link 
    href="/tft/shop-odds"
    className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full block no-underline"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
    
    {/* Background image - kept */}
    <div className="absolute inset-0 opacity-20 group-hover:opacity-20 transition-opacity duration-500 bg-[url('/images/Texture.jpg')] bg-cover bg-center" />
    
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
    <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
    
    <div className="relative z-10 h-full flex flex-col justify-end">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <Store className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
            Info
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            Shop Odds
          </h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed">
          Know exactly when to roll with our detailed champion drop rate reference.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            Check Odds <span className="text-orange-500">→</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
  </Link>

  {/* Units */}
  <Link 
    href="/tft/units"
    className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full block no-underline"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
    
    {/* Background image - kept */}
    <div className="absolute inset-0 opacity-20 group-hover:opacity-20 transition-opacity duration-500 bg-[url('/images/Texture.jpg')] bg-cover bg-center" />
    
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
    <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
    
    <div className="relative z-10 h-full flex flex-col justify-end">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
          <Users2 className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
            Info
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
            Units
          </h3>
        </div>
        
        <p className="text-zinc-400 text-sm leading-relaxed">
          {loading ? 'Loading...' : (
            <>
              {stats.activeSetNumbers.length === 1 
                ? `Explore all champions in Set ${stats.activeSetNumbers[0]} with stats`
                : `Explore all champions in Sets ${stats.activeSetNumbers.join(', ')} with stats`}
            </>
          )}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            View Units <span className="text-orange-500">→</span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
  </Link>
</div>

        
        <div className="grid md:grid-cols-3 gap-12 mt-20 pt-20 border-t border-zinc-900">
          <div className="text-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 hover:bg-orange-950 transition-all">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3 italic uppercase tracking-tight hover:text-orange-400 transition-all">Ranked Tracking</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Real-time monitoring of your LP gains, placement history, and climb progression through the ranks.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 hover:bg-orange-950 transition-all">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3 italic uppercase tracking-tight hover:text-orange-400 transition-all">Lobby Analysis</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Deep-dive into your recent lobbies. See what your opponents built and how they performed.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500 hover:bg-trending-950 transition-all">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-3 italic uppercase tracking-tight hover:text-orange-400 transition-all">Trait Synergy</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Analyze your performance with specific traits and champions to identify your winning playstyles.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}