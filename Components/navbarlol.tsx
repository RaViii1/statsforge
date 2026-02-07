"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Anvil, Search, Loader2, X, Menu, Clock } from 'lucide-react';
import UserMenu from "./UserMenu";
import { SERVERS } from "@/lib/utils";

interface RecentSearch {
  gameName: string;
  tagLine: string;
  server: string;
  timestamp: number;
}

export default function NavbarLoL() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const updated = [newSearch, ...filtered].slice(0, 10);
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
    setMobileMenuOpen(false);
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
        setMobileMenuOpen(false);
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
      setMobileMenuOpen(false);
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
    let gameName: string, tagLine: string;
    
    if (input.includes('#')) {
      const parts = input.split('#');
      gameName = parts[0];
      tagLine = parts[1];
    } else {
      gameName = input;
      const serverDefaults: Record<string, string> = {
        'na1': 'NA1', 'euw1': 'EUW', 'eun1': 'EUNE', 'kr': 'KR', 
        'br1': 'BR', 'la1': 'LAN', 'la2': 'LAS', 'oc1': 'OCE', 
        'ru': 'RU', 'tr1': 'TR', 'jp1': 'JP'
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
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-950/90">
        <div className="max-w-7xl mx-auto pl-2 pr-2 sm:pl-3 sm:pr-3">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center gap-2 shrink-0 mr-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
                <Anvil className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-xl">StatsForge</span>
            </Link>

            {/* Search - Center (Desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 max-w-xl mx-4">
              <select
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                disabled={isSearching}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-600 transition-colors disabled:opacity-50"
              >
                {SERVERS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <div className="relative flex-1" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Player#TAG"
                  disabled={isSearching}
                  className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600 transition-colors disabled:opacity-50"
                />

                {/* Recent Searches Dropdown */}
                {showDropdown && recentSearches.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-zinc-800 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span className="text-xs font-medium text-zinc-400">Recent Searches</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="w-full px-4 py-2 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-orange-950/30 border border-orange-900/30 rounded-lg  flex items-center justify-center ">
                              <span className="text-xs text-orange-500 "> 
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
                            className="p-1.5 rounded-lg hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
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
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/40 transition-colors disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Links - Right (Desktop) */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              <a href="/lol/multisearch" className="px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium">
                Multi Search
              </a>
              <a href="/#games" className="px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium">
                Games
              </a>
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <UserMenu />
            </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800/50 bg-zinc-950">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="space-y-2">
                <select
                  value={selectedServer}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  disabled={isSearching}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-orange-600 transition-colors disabled:opacity-50"
                >
                  {SERVERS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Player#TAG"
                    disabled={isSearching}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600 transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Recent Searches in Mobile */}
                {recentSearches.length > 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="p-2 border-b border-zinc-800 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span className="text-xs font-medium text-zinc-400">Recent</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="px-3 py-2 flex items-center justify-between hover:bg-zinc-800 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="w-6 h-6 bg-orange-950/30 border border-orange-900/30 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-orange-500">
                                {SERVERS.find(s => s.value === search.server)?.label || search.server.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-white truncate">
                              {search.gameName}<span className="text-zinc-500">#{search.tagLine}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(index, e)}
                            className="p-1 rounded hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          >
                            <X className="w-3 h-3 text-zinc-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-900/40 transition-colors disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </form>

              {/* Mobile Links */}
              <div className="pt-4 border-t border-zinc-800/50 space-y-2">
              <UserMenu />
                <a 
                  href="/lol/multisearch" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
                >
                  MultiSearch
                </a>
                <a 
                  href="/#games"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-zinc-400 hover:text-orange-500 transition-colors text-sm font-medium"
                >
                  Games
                </a>
            
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
