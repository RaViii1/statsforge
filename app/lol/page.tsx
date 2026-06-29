"use client";

import { Search, Loader2, TrendingUp, Users, Target, Clock, X, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import NavbarLoL from "@/components/NavbarLol";
import { SERVERS } from "@/lib/utils";

interface RecentSearch {
  gameName: string;
  tagLine: string;
  server: string;
  timestamp: number;
}

export default function LolPage() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("lol_recent_searches");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed);
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Close dropdown when clicking outside
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

    // Remove duplicate if exists
    const filtered = recentSearches.filter(
      (s) => !(s.gameName === gameName && s.tagLine === tagLine && s.server === server)
    );

    // Add to beginning, keep only last 10
    const updated = [newSearch, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("lol_recent_searches", JSON.stringify(updated));
  };

  const removeRecentSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("lol_recent_searches", JSON.stringify(updated));
  };

  const handleRecentSearchClick = (search: RecentSearch) => {
    setSearchQuery(`${search.gameName}#${search.tagLine}`);
    setSelectedServer(search.server);
    setShowDropdown(false);
    // Automatically search
    performSearch(search.gameName, search.tagLine, search.server);
  };

  const performSearch = async (gameName: string, tagLine: string, server: string) => {
    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (response.status === 404) {
        router.push(`/lol/profile/player-not-found?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&server=${server}`);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch player data");
        setIsSearching(false);
        return;
      }

      // Save to recent searches
      saveRecentSearch(gameName, tagLine, server);

      router.push(`/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching");
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error("Please enter a summoner name");
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
      return;
    }

    performSearch(gameName, tagLine, selectedServer);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <NavbarLoL />

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
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12" style={{ position: 'relative', zIndex: 9999 }}>
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

                {/* Search Input with Dropdown */}
                <div className="relative flex-1" ref={dropdownRef} style={{ position: 'relative', zIndex: 9999 }}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 z-10" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter summoner name (e.g., Faker#KR1)"
                    onFocus={() => {
                      setSearchFocused(true);
                      setShowDropdown(true);
                    }}
                    onBlur={() => setSearchFocused(false)}
                    disabled={isSearching}
                    className="w-full pl-12 pr-4 py-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:bg-zinc-900/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  />

                  {/* Recent Searches Dropdown */}
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
                            onClick={() => handleRecentSearchClick(search)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 bg-orange-950/30 border border-orange-900/30 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-orange-500 m-3">
                                  {SERVERS.find(s => s.value === search.server)?.label || search.server.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-left min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {search.gameName}
                                  <span className="text-zinc-500">#{search.tagLine}</span>
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
        <div className="flex flex-wrap items-center justify-center gap-8 relative z-10 text-left">
          {/* Multi Search Button */}
          <Link 
            href="/lol/multisearch"
            className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full max-w-sm block no-underline"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
            
            {/* Background image - kept */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-20 transition-opacity duration-500 bg-[url('/images/Texture.jpg')] bg-cover bg-center" />
            
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
            
            {/* Top line accent */}
            <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
                    Tool
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                    Multi Search
                  </h3>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Search and compare multiple League of Legends players at once.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    Launch <span className="text-orange-500">→</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom glow on hover */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
          </Link>
          
          {/* Leaderboard Button */}
          <Link 
            href="/lol/leaderboard"
            className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full max-w-sm block no-underline"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.05),transparent_60%)]" />
            
            {/* Background image - kept */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-20 transition-opacity duration-500 bg-[url('/images/lol/leaderboards.webp')] bg-cover bg-center" />
            
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
            <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
            
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-950/80 border border-orange-900/50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Layers className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
                    Rankings
                  </span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                    Leaderboard
                  </h3>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  View the top ranked players across all regions and queues.
                </p>
                
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    View <span className="text-orange-500">→</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
          </Link>
          
          {/* Tier Lists Button */}
          <Link 
            href="/lol/champions"
            className="group relative h-[320px] overflow-hidden rounded-[2rem] border border-zinc-900 bg-zinc-900/30 transition-all duration-700 hover:border-orange-500/30 hover:-translate-y-1 p-8 w-full max-w-sm block no-underline"
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
                    Tier Lists
                  </h3>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Explore champion tier lists for all regions and patches. Follow the meta!
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                    View <span className="text-orange-500">→</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
          </Link>
        </div>
        </div>

        <div className="relative h-[400px] rounded-[2rem] overflow-hidden border border-zinc-900 mt-16 group">
          {/* Background image */}
          <img
            src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/5255b8c8fc9946d9313a244ef6f1a91d046b0bde-1920x1080.jpg?auto=format&fit=fill&q=80&w=1184"
            alt="League of Legends"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
          />
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_60%)]" />
          
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")', mixBlendMode: 'overlay' }} />
          
          {/* Top line accent */}
          <div className="absolute top-0 left-8 w-12 h-px bg-white/10 group-hover:w-20 group-hover:bg-orange-500/40 transition-all duration-700" />
          
          {/* Bottom glow on hover */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/0 to-transparent group-hover:via-orange-500/30 transition-all duration-700" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-orange-500 transition-colors duration-500">
                Get Started
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                Ready to Analyze Your Performance?
              </h2>
              <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                Search for any summoner to get started
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 group-hover:text-orange-500 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                Begin Search <span className="text-orange-500">→</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
