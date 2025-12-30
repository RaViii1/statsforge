"use client";

import { Clock, Loader2, Search, ChevronDown, Filter, X } from "lucide-react";
import { Match } from "@/app/types/lolInterfaces";
import { MatchCard } from "./MatchCard";
import { useMemo, useState } from "react";
import { determineRole, getQueueName, getRoleIcon } from "@/lib/lol/lolfunctions";
import { getChampionIdByName } from "@/lib/champion-data";

interface MatchHistoryTabProps {
  matches: Match[];
  loading: boolean;
  loadingMore: boolean;
  summonerPuuid: string;
  server: string;
  rankedData: any[];
  onLoadMore: () => void;
  onPlayerClick: (gameName: string, tagLine: string) => void;
  onRefresh?: () => void;
}

interface ChampionStats {
  championName: string;
  championId: number;
  games: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  roles: Map<string, number>;
}

export function MatchHistoryTab({ 
  matches, 
  loading, 
  loadingMore,
  summonerPuuid,
  server,
  rankedData,
  onLoadMore,
  onPlayerClick,
  onRefresh
}: MatchHistoryTabProps) {
  const [expandedChampion, setExpandedChampion] = useState<string | null>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [filterChampion, setFilterChampion] = useState<string>("");
  const [championInput, setChampionInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterGameMode, setFilterGameMode] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "champion" | "role">("recent");

  // Calculate winrate graph data (last 20 games max)
  const recentResults = useMemo(() => {
    return matches.slice(0, 20).map(match => {
      const player = match.info.participants.find(p => p.puuid === summonerPuuid);
      return player?.win || false;
    }).reverse();
  }, [matches, summonerPuuid]);

  const overallStats = useMemo(() => {
    let wins = 0;
    let totalKills = 0, totalDeaths = 0, totalAssists = 0;
    
    matches.forEach(match => {
      const player = match.info.participants.find(p => p.puuid === summonerPuuid);
      if (player) {
        if (player.win) wins++;
        totalKills += player.kills;
        totalDeaths += player.deaths;
        totalAssists += player.assists;
      }
    });
    
    const avgKills = (totalKills / matches.length).toFixed(1);
    const avgDeaths = (totalDeaths / matches.length).toFixed(1);
    const avgAssists = (totalAssists / matches.length).toFixed(1);
    const kda = totalDeaths === 0 ? ((totalKills + totalAssists) / 1).toFixed(1) : ((totalKills + totalAssists) / totalDeaths).toFixed(1);
    
    return {
      winrate: matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0,
      wins,
      losses: matches.length - wins,
      kda,
      avgKDA: `${avgKills} / ${avgDeaths} / ${avgAssists}`
    };
  }, [matches, summonerPuuid]);

  // Calculate role distribution
  const roleStats = useMemo(() => {
    const rolesMap = new Map<string, number>();
    
    matches.forEach(match => {
      const player = match.info.participants.find(p => p.puuid === summonerPuuid);
      if (!player) return;
      
      const role = determineRole(player as any);
      rolesMap.set(role, (rolesMap.get(role) || 0) + 1);
    });
    
    return Array.from(rolesMap.entries())
      .map(([role, count]) => ({
        role,
        count,
        percentage: matches.length > 0 ? Math.round((count / matches.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [matches, summonerPuuid]);

  const topChampions = useMemo(() => {
    const champMap = new Map<string, ChampionStats>();
    
    matches.forEach((match) => {
      const player = match.info.participants.find(p => p.puuid === summonerPuuid);
      if (!player) return;
      
      const key = player.championName;
      const existing = champMap.get(key);
      
      const role = determineRole(player as any);
      
      if (existing) {
        existing.games += 1;
        existing.wins += player.win ? 1 : 0;
        existing.kills += player.kills;
        existing.deaths += player.deaths;
        existing.assists += player.assists;
        existing.roles.set(role, (existing.roles.get(role) || 0) + 1);
      } else {
        const rolesMap = new Map<string, number>();
        rolesMap.set(role, 1);
        champMap.set(key, {
          championName: player.championName,
          championId: player.championId,
          games: 1,
          wins: player.win ? 1 : 0,
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          roles: rolesMap,
        });
      }
    });
    
    return Array.from(champMap.values())
      .map(champ => ({
        ...champ,
        winrate: Math.round((champ.wins / champ.games) * 100),
        kda: champ.deaths === 0 
          ? (champ.kills + champ.assists).toFixed(1) 
          : ((champ.kills + champ.assists) / champ.deaths).toFixed(2),
      }))
        .sort((a, b) => b.games - a.games)
      .slice(0, 3);
  }, [matches, summonerPuuid]);

  // Get unique champions and game modes for filters
  const uniqueChampions = useMemo(() => {
    const champs = new Set<string>();
    matches.forEach(match => {
      const player = match.info.participants.find(p => p.puuid === summonerPuuid);
      if (player) champs.add(player.championName);
    });
    return Array.from(champs).sort();
  }, [matches, summonerPuuid]);

  // Filter champions based on input
  const filteredChampionSuggestions = useMemo(() => {
    if (!championInput) return [];
    const lowerInput = championInput.toLowerCase();
    return uniqueChampions.filter(champ => 
      champ.toLowerCase().includes(lowerInput)
    ).slice(0, 5);
  }, [championInput, uniqueChampions]);

  const uniqueGameModes = useMemo(() => {
    const modes = new Set<string>();
    matches.forEach(match => {
      const modeName = getQueueName(match.info.queueId);
      modes.add(modeName);
    });
    return Array.from(modes).sort();
  }, [matches]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];
    
    if (filterChampion) {
      filtered = filtered.filter(match => {
        const player = match.info.participants.find(p => p.puuid === summonerPuuid);
        return player?.championName === filterChampion;
      });
    }
    
    if (filterRole) {
      filtered = filtered.filter(match => {
        const player = match.info.participants.find(p => p.puuid === summonerPuuid);
        if (!player) return false;
        return determineRole(player as any) === filterRole;
      });
    }
    
    if (filterGameMode) {
      filtered = filtered.filter(match => {
        return getQueueName(match.info.queueId) === filterGameMode;
      });
    }
    
    if (sortBy === "champion") {
      filtered.sort((a, b) => {
        const playerA = a.info.participants.find(p => p.puuid === summonerPuuid);
        const playerB = b.info.participants.find(p => p.puuid === summonerPuuid);
        return (playerA?.championName || "").localeCompare(playerB?.championName || "");
      });
    } else if (sortBy === "role") {
      filtered.sort((a, b) => {
        const playerA = a.info.participants.find(p => p.puuid === summonerPuuid);
        const playerB = b.info.participants.find(p => p.puuid === summonerPuuid);
        const roleA = determineRole(playerA as any);
        const roleB = determineRole(playerB as any);
        return roleA.localeCompare(roleB);
      });
    }
    
    return filtered;
  }, [matches, filterChampion, filterRole, filterGameMode, sortBy, summonerPuuid]);

  const hasActiveFilters = filterChampion || filterRole || filterGameMode;
  const hasRankedGames = matches.some(m => m.info.queueId === 420 || m.info.queueId === 440);

  return (
    <div>
      {/* Header with Stats and Top Champions */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 mb-4">
        {/* Title Row with Roles Button */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            Recent Matches
          </h2>
          
          {/* Role Distribution Dropdown - Moved to Right */}
          {roleStats.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowRoles(!showRoles)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
              >
                <span className="text-xs text-zinc-400 uppercase tracking-wide">Roles</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${showRoles ? 'rotate-180' : ''}`} />
              </button>
              
              {showRoles && (
                <div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 z-50 min-w-[220px]">
                  <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">Role Distribution</div>
                  <div className="space-y-2">
                    {roleStats.map(({ role, count, percentage }) => (
                      <div key={role} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={getRoleIcon(role)}
                              alt={role}
                              className="w-4 h-4"
                            />
                            <span className="text-zinc-300 capitalize font-medium">{role}</span>
                          </div>
                          <span className="text-zinc-400">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          {/* Overall Stats */}
          <div className="flex items-center gap-3">
            <div className="space-y-0.5">
              <div className={`text-xl font-bold ${overallStats.winrate >= 60 ? 'text-green-400' : overallStats.winrate >= 50 ? 'text-white' : 'text-red-400'}`}>
                {overallStats.winrate}% WR
              </div>
              <div className="text-xs text-zinc-400">
                Last {matches.length} game{matches.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs sm:text-sm text-orange-400 font-medium">
                {overallStats.kda} KDA
              </div>
              <div className="text-xs text-zinc-500">
                {overallStats.avgKDA}
              </div>
            </div>
            
            {/* Circular Winrate Graph */}
            {matches.length > 0 && (
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wide">Winrate</div>
                <div className="relative w-14 h-14 sm:w-16 sm:h-16">
                  <svg className="transform -rotate-90 w-14 h-14 sm:w-16 sm:h-16">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      className="text-gray-600/70"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - overallStats.winrate / 100)}`}
                      className={`transition-all ${
                        overallStats.winrate >= 60 ? 'text-green-500' : 
                        overallStats.winrate >= 50 ? 'text-orange-500' : 
                        'text-red-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-xs font-bold text-white">
                      {overallStats.winrate}%
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500">
                  {overallStats.wins}W {overallStats.losses}L
                </div>
              </div>
            )}
          </div>
          
          {/* Top Champions - Single Row */}
          {!loading && topChampions.length > 0 && (
            <div className="flex-1 w-full sm:w-auto">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-2">Top Champions</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {topChampions.map((champ) => {
                  const isExpanded = expandedChampion === champ.championName;
                  const sortedRoles = Array.from(champ.roles.entries()).sort((a, b) => b[1] - a[1]);
                  const primaryRole = sortedRoles[0];
                  
                  return (
                    <div 
                      key={champ.championName}
                      className="relative flex items-center gap-2 px-2 py-1.5 bg-zinc-800/60 border border-zinc-700 rounded-lg hover:border-orange-500/30 transition-colors"
                    >
                      <img
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${getChampionIdByName(champ.championName)}.png`}
                        alt={champ.championName}
                        className="w-7 h-7 rounded-full shrink-0"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white truncate">{champ.championName}</span>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className={`font-semibold ${champ.winrate >= 60 ? 'text-green-400' : champ.winrate >= 50 ? 'text-zinc-300' : 'text-red-400'}`}>
                            {champ.winrate}% ({champ.wins}W {champ.games - champ.wins}L)
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-orange-400 font-medium">{champ.kda} KDA</span>
                        </div>
                      </div>
                      
                      {hasRankedGames && primaryRole && (
                        <img
                          src={getRoleIcon(primaryRole[0])}
                          alt={primaryRole[0]}
                          className="w-6 h-6 shrink-0"
                          title={`${primaryRole[0]} (${primaryRole[1]}x)`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters Section */}
      {!loading && matches.length > 0 && (
        <div className="bg-zinc-900/50 border-zinc-800 rounded-t-xl p-4 ">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-white">Filters</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Champion Filter - Autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={championInput}
                  onChange={(e) => {
                    setChampionInput(e.target.value);
                    setShowSuggestions(true);
                    if (!e.target.value) {
                      setFilterChampion("");
                    }
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search champion..."
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors w-48"
                />
                {showSuggestions && filteredChampionSuggestions.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 w-full max-h-48 overflow-y-auto">
                    {filteredChampionSuggestions.map(champ => (
                      <button
                        key={champ}
                        onClick={() => {
                          setChampionInput(champ);
                          setFilterChampion(champ);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                      >
                        <img
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${getChampionIdByName(champ)}.png`}
                          alt={champ}
                          className="w-6 h-6 rounded"
                        />
                        {champ}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="">All Roles</option>
                <option value="top">Top</option>
                <option value="jungle">Jungle</option>
                <option value="mid">Mid</option>
                <option value="adc">ADC</option>
                <option value="support">Support</option>
              </select>
              
              {/* Game Mode Filter */}
              <select
                value={filterGameMode}
                onChange={(e) => setFilterGameMode(e.target.value)}
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="">All Modes</option>
                {uniqueGameModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
              
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="recent">Sort: Recent</option>
                <option value="champion">Sort: Champion</option>
                <option value="role">Sort: Role</option>
              </select>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilterChampion("");
                    setChampionInput("");
                    setFilterRole("");
                    setFilterGameMode("");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-900/20 border border-red-800/50 hover:bg-red-900/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
            
            <div className="text-xs text-zinc-500">
              {filteredMatches.length} / {matches.length} matches
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-900/20 border border-orange-800/50 hover:bg-orange-900/30 text-orange-400 rounded-lg text-sm font-medium transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      )}
      
      {/* Match List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-b-xl p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-zinc-400">Loading match history...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <>
            <div className="space-y-3 mb-6">
              {filteredMatches.map((match: Match) => (
                <MatchCard
                  key={match.metadata.matchId}
                  match={match}
                  summonerPuuid={summonerPuuid}
                  server={server}
                  rankedData={rankedData}
                  onPlayerClick={onPlayerClick}
                />
              ))}
            </div>
            {!hasActiveFilters && (
              <div className="text-center">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-900/40 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load 10 More Games"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-zinc-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <p className="text-lg font-medium mb-2">No matches found</p>
            <p className="text-sm">
              {hasActiveFilters 
                ? "Try adjusting your filters" 
                : "This player hasn't played any recent games"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}