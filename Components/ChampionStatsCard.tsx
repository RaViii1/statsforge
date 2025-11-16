"use client";

import { useState, useEffect } from "react";
import { Trophy, Wheat, Loader2, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type QueueType = "all" | "solo" | "flex";
type SortField = "champion" | "games" | "winrate" | "kda" | "cs";
type SortDirection = "asc" | "desc";

type ChampionStat = {
  champion: string;
  championId: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winrate: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
  averageCS: number;
  queueBreakdown: {
    soloQueueGames: number;
    flexQueueGames: number;
  };
  matchIds: string[];
};

interface ChampionStatsCardProps {
  server: string;
  puuid: string;
}

export default function ChampionStatsCard({ server, puuid }: ChampionStatsCardProps) {
  const [queueType, setQueueType] = useState<QueueType>("all");
  const [allChampionStats, setAllChampionStats] = useState<ChampionStat[]>([]);
  const [filteredChampionStats, setFilteredChampionStats] = useState<ChampionStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField>("games");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [loadedMatchIds, setLoadedMatchIds] = useState<string[]>([]);
  const [totalAvailableMatches, setTotalAvailableMatches] = useState(0);

  const localStorageKey = `championStats_${server}_${puuid}`;
  const matchIdsKey = `loadedMatches_${server}_${puuid}`;

  useEffect(() => {
    if (!allChampionStats.length) {
      setFilteredChampionStats([]);
      return;
    }
    let filtered = [];
    if (queueType === "all") {
      filtered = allChampionStats;
    } else if (queueType === "solo") {
      filtered = allChampionStats.filter(stat => stat.queueBreakdown.soloQueueGames > 0);
    } else {
      filtered = allChampionStats.filter(stat => stat.queueBreakdown.flexQueueGames > 0);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "champion":
          aVal = a.champion.toLowerCase();
          bVal = b.champion.toLowerCase();
          break;
        case "games":
          aVal = a.gamesPlayed;
          bVal = b.gamesPlayed;
          break;
        case "winrate":
          aVal = a.winrate;
          bVal = b.winrate;
          break;
        case "kda":
          aVal = a.kda;
          bVal = b.kda;
          break;
        case "cs":
          aVal = a.averageCS;
          bVal = b.averageCS;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setFilteredChampionStats(sorted);
  }, [queueType, allChampionStats, sortField, sortDirection]);

  useEffect(() => {
    if (!server || !puuid) return;

    setError(null);
    setIsLoading(true);

    try {
      const cachedData = localStorage.getItem(localStorageKey);
      if (cachedData) {
        const parsed = JSON.parse(cachedData) as ChampionStat[];
        setAllChampionStats(parsed.map(stat => ({ ...stat, matchIds: stat.matchIds ?? [] })));
      }
      setIsLoading(false);
    } catch {
      setError("Failed to load cached champion stats");
      setIsLoading(false);
    }
  }, [server, puuid]);

  const updateStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Send already loaded match IDs to skip them
      const response = await fetch(
        `/api/lol/matches/${server}/${puuid}/champion-stats?loadedMatches=${encodeURIComponent(JSON.stringify(loadedMatchIds))}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch champion stats");
      }
      
      const data = await response.json();
      
      // Merge new stats with existing ones
      const mergedStats = mergeChampionStats(allChampionStats, data.championStats);
      setAllChampionStats(mergedStats);
      
      // Update loaded match IDs
      const newLoadedMatchIds = [...new Set([...loadedMatchIds, ...data.processedMatchIds])];
      setLoadedMatchIds(newLoadedMatchIds);
      setTotalAvailableMatches(data.totalAvailableMatches || 0);
      
      // Save to localStorage
      localStorage.setItem(localStorageKey, JSON.stringify(mergedStats));
      localStorage.setItem(matchIdsKey, JSON.stringify({
        loaded: newLoadedMatchIds,
        total: data.totalAvailableMatches || 0
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update champion stats");
    } finally {
      setIsLoading(false);
    }
  };

  const mergeChampionStats = (existing: ChampionStat[], newStats: ChampionStat[]): ChampionStat[] => {
    const merged = new Map<string, ChampionStat>();
    
    // Add existing stats
    existing.forEach(stat => {
      merged.set(stat.champion, { ...stat });
    });
    
    // Merge with new stats
    newStats.forEach(newStat => {
      const existing = merged.get(newStat.champion);
      if (existing) {
        // Merge the stats
        const totalGames = existing.gamesPlayed + newStat.gamesPlayed;
        const totalWins = existing.wins + newStat.wins;
        const totalKills = existing.kills + newStat.kills;
        const totalDeaths = existing.deaths + newStat.deaths;
        const totalAssists = existing.assists + newStat.assists;
        const totalCS = existing.averageCS * existing.gamesPlayed + newStat.averageCS * newStat.gamesPlayed;
        
        merged.set(newStat.champion, {
          champion: newStat.champion,
          championId: newStat.championId,
          gamesPlayed: totalGames,
          wins: totalWins,
          losses: totalGames - totalWins,
          winrate: parseFloat(((totalWins / totalGames) * 100).toFixed(1)),
          kda: totalDeaths === 0 ? totalKills + totalAssists : parseFloat(((totalKills + totalAssists) / totalDeaths).toFixed(2)),
          kills: totalKills,
          deaths: totalDeaths,
          assists: totalAssists,
          averageCS: parseFloat((totalCS / totalGames).toFixed(1)),
          queueBreakdown: {
            soloQueueGames: existing.queueBreakdown.soloQueueGames + newStat.queueBreakdown.soloQueueGames,
            flexQueueGames: existing.queueBreakdown.flexQueueGames + newStat.queueBreakdown.flexQueueGames,
          },
          matchIds: [...new Set([...existing.matchIds, ...newStat.matchIds])],
        });
      } else {
        merged.set(newStat.champion, { ...newStat });
      }
    });
    
    return Array.from(merged.values()).sort((a, b) => b.gamesPlayed - a.gamesPlayed);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="w-3 h-3" /> : 
      <ArrowDown className="w-3 h-3" />;
  };

  const getChampionImageUrl = (championName: string) =>
    `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${championName}.png`;

  const displayedChampions = isExpanded ? filteredChampionStats : filteredChampionStats.slice(0, 5);
  const hasMore = filteredChampionStats.length > 5;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mt-8">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            Champion Stats for recent ranked games
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
              <button
                onClick={() => setQueueType("all")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  queueType === "all" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setQueueType("solo")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  queueType === "solo" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Solo
              </button>
              <button
                onClick={() => setQueueType("flex")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  queueType === "flex" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Flex
              </button>
            </div>
            <button
              onClick={updateStats}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Loading..." : "Update"}
            </button>
            {/* {loadedMatchIds.length > 0 && (
              <span className="text-xs text-zinc-400">
                {loadedMatchIds.length}/{totalAvailableMatches} matches loaded
              </span>
            )} */}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-12 px-4">
          <p className="text-red-400 text-sm mb-1">Error loading champion stats</p>
          <p className="text-zinc-500 text-xs">{error}</p>
        </div>
      )}

      {!isLoading && !error && filteredChampionStats.length === 0 && (
        <div className="text-center py-12 text-zinc-400 text-sm">No ranked games found</div>
      )}

      {!isLoading && !error && filteredChampionStats.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr className="text-xs text-zinc-400 uppercase">
                  <th className="text-left py-3 px-4 font-semibold">
                    <button 
                      onClick={() => handleSort("champion")}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Champion
                      <SortIcon field="champion" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <button 
                      onClick={() => handleSort("games")}
                      className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                    >
                      Games
                      <SortIcon field="games" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">W/L</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <button 
                      onClick={() => handleSort("winrate")}
                      className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                    >
                      WR%
                      <SortIcon field="winrate" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <button 
                      onClick={() => handleSort("kda")}
                      className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                    >
                      KDA
                      <SortIcon field="kda" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    <button 
                      onClick={() => handleSort("cs")}
                      className="flex items-center gap-1 hover:text-white transition-colors mx-auto"
                    >
                      CS
                      <SortIcon field="cs" />
                    </button>
                  </th>
                  {queueType === "all" && <th className="text-center py-3 px-4 font-semibold">Queue</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {displayedChampions.map((stat) => {
                  const avgKills = (stat.kills / stat.gamesPlayed).toFixed(1);
                  const avgDeaths = (stat.deaths / stat.gamesPlayed).toFixed(1);
                  const avgAssists = (stat.assists / stat.gamesPlayed).toFixed(1);

                  return (
                    <tr key={`${stat.champion}-${stat.championId}`} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={getChampionImageUrl(stat.champion)}
                            alt={stat.champion}
                            className="w-8 h-8 rounded border border-zinc-700"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/32?text=" + stat.champion.charAt(0);
                            }}
                          />
                          <span className="text-white text-sm font-medium">{stat.champion}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center text-white text-sm">{stat.gamesPlayed}</td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <span className="text-green-400 font-medium">{stat.wins}</span>
                          <span className="text-zinc-600">/</span>
                          <span className="text-red-400 font-medium">{stat.losses}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          stat.winrate >= 55
                            ? "bg-green-500/20 text-green-400"
                            : stat.winrate >= 50
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {stat.winrate}%
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold text-sm ${
                            stat.kda >= 4 ? "text-orange-400" : stat.kda >= 3 ? "text-green-400" : "text-zinc-300"
                          }`}>
                            {stat.kda}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            <span className="text-green-400">{avgKills}</span>/
                            <span className="text-red-400">{avgDeaths}</span>/
                            <span className="text-blue-400">{avgAssists}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Wheat className="w-3 h-3 text-orange-400" />
                          <span className="text-white text-sm font-medium">{stat.averageCS}</span>
                        </div>
                      </td>
                      {queueType === "all" && (
                        <td className="py-2 px-4 text-center">
                          <div className="flex gap-1 justify-center">
                            {stat.queueBreakdown.soloQueueGames > 0 && (
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px] font-medium">
                                S:{stat.queueBreakdown.soloQueueGames}
                              </span>
                            )}
                            {stat.queueBreakdown.flexQueueGames > 0 && (
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-medium">
                                F:{stat.queueBreakdown.flexQueueGames}
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-zinc-800/50">
            {displayedChampions.map((stat) => {
              const avgKills = (stat.kills / stat.gamesPlayed).toFixed(1);
              const avgDeaths = (stat.deaths / stat.gamesPlayed).toFixed(1);
              const avgAssists = (stat.assists / stat.gamesPlayed).toFixed(1);

              return (
                <div key={`${stat.champion}-${stat.championId}`} className="p-3 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <img
                      src={getChampionImageUrl(stat.champion)}
                      alt={stat.champion}
                      className="w-12 h-12 rounded border border-zinc-700 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/48?text=" + stat.champion.charAt(0);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold text-sm truncate">{stat.champion}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          stat.winrate >= 55
                            ? "bg-green-500/20 text-green-400"
                            : stat.winrate >= 50
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {stat.winrate}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex flex-col">
                          <span className="text-zinc-400">Games</span>
                          <span className="text-white font-medium">{stat.gamesPlayed}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-400">W/L</span>
                          <span className="text-white font-medium">
                            <span className="text-green-400">{stat.wins}</span>/
                            <span className="text-red-400">{stat.losses}</span>
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-400">KDA</span>
                          <span className={`font-bold ${
                            stat.kda >= 4 ? "text-orange-400" : stat.kda >= 3 ? "text-green-400" : "text-zinc-300"
                          }`}>
                            {stat.kda}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                        <span className="text-[10px] text-zinc-500">
                          <span className="text-green-400">{avgKills}</span>/
                          <span className="text-red-400">{avgDeaths}</span>/
                          <span className="text-blue-400">{avgAssists}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <Wheat className="w-3 h-3 text-orange-400" />
                          <span className="text-white text-xs font-medium">{stat.averageCS}</span>
                        </div>
                        {queueType === "all" && (
                          <div className="flex gap-1">
                            {stat.queueBreakdown.soloQueueGames > 0 && (
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px]">
                                S:{stat.queueBreakdown.soloQueueGames}
                              </span>
                            )}
                            {stat.queueBreakdown.flexQueueGames > 0 && (
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px]">
                                F:{stat.queueBreakdown.flexQueueGames}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand/Collapse Button */}
          {hasMore && (
            <div className="border-t border-zinc-800">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3 hover:bg-zinc-800/30 transition-colors flex items-center justify-center gap-2 text-zinc-400 hover:text-white text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-left mr-8">
                      Champions: <span className="text-white font-semibold">{filteredChampionStats.length}</span>
                    </span>
                    <ChevronDown className="w-4 h-4" />
                    Show All ({filteredChampionStats.length})

                    <span className="ml-8">
                      Total Games: <span className="text-white font-semibold">
                        {filteredChampionStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0)}
                      </span>
                    </span>

                  </div>
                )}
              </button>
            </div>
          )}

          {/* Footer Stats */}

        </>
      )}
    </div>
  );
}