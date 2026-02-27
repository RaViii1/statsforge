"use client";

import { useState, useEffect } from "react";
import { Trophy, Wheat, Loader2, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getChampionImage } from "@/lib/lol/lolfunctions";

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
  soloStats?: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    winrate: number;
    kda: number;
    kills: number;
    deaths: number;
    assists: number;
    averageCS: number;
  };
  flexStats?: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    winrate: number;
    kda: number;
    kills: number;
    deaths: number;
    assists: number;
    averageCS: number;
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
      filtered = allChampionStats
        .filter(stat => stat.queueBreakdown.soloQueueGames > 0)
        .map(stat => ({
          ...stat,
          ...stat.soloStats,
        }));
    } else {
      filtered = allChampionStats
        .filter(stat => stat.queueBreakdown.flexQueueGames > 0)
        .map(stat => ({
          ...stat,
          ...stat.flexStats,
        }));
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
      
      // Load already processed match IDs from localStorage
      const cachedMatchIds = localStorage.getItem(matchIdsKey);
      if (cachedMatchIds) {
        const parsed = JSON.parse(cachedMatchIds);
        setLoadedMatchIds(parsed.loaded ?? []);
        setTotalAvailableMatches(parsed.total ?? 0);
      }

      setIsLoading(false);

      // If no cached data, fetch fresh stats
      if (!cachedData) {
        updateStats();
      }
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
        
        // Merge solo stats
        const mergedSoloStats = {
          gamesPlayed: (existing.soloStats?.gamesPlayed || 0) + (newStat.soloStats?.gamesPlayed || 0),
          wins: (existing.soloStats?.wins || 0) + (newStat.soloStats?.wins || 0),
          losses: ((existing.soloStats?.gamesPlayed || 0) + (newStat.soloStats?.gamesPlayed || 0)) - ((existing.soloStats?.wins || 0) + (newStat.soloStats?.wins || 0)),
          winrate: 0, // Will be calculated after merging
          kda: 0, // Will be calculated after merging
          kills: (existing.soloStats?.kills || 0) + (newStat.soloStats?.kills || 0),
          deaths: (existing.soloStats?.deaths || 0) + (newStat.soloStats?.deaths || 0),
          assists: (existing.soloStats?.assists || 0) + (newStat.soloStats?.assists || 0),
          averageCS: 0, // Will be calculated after merging
        };
        if (mergedSoloStats.gamesPlayed > 0) {
          mergedSoloStats.winrate = parseFloat(((mergedSoloStats.wins / mergedSoloStats.gamesPlayed) * 100).toFixed(1));
          mergedSoloStats.kda = mergedSoloStats.deaths === 0 ? mergedSoloStats.kills + mergedSoloStats.assists : parseFloat(((mergedSoloStats.kills + mergedSoloStats.assists) / mergedSoloStats.deaths).toFixed(2));
          const totalSoloCS = (existing.soloStats?.averageCS || 0) * (existing.soloStats?.gamesPlayed || 0) + (newStat.soloStats?.averageCS || 0) * (newStat.soloStats?.gamesPlayed || 0);
          mergedSoloStats.averageCS = parseFloat((totalSoloCS / mergedSoloStats.gamesPlayed).toFixed(1));
        }
        
        // Merge flex stats
        const mergedFlexStats = {
          gamesPlayed: (existing.flexStats?.gamesPlayed || 0) + (newStat.flexStats?.gamesPlayed || 0),
          wins: (existing.flexStats?.wins || 0) + (newStat.flexStats?.wins || 0),
          losses: ((existing.flexStats?.gamesPlayed || 0) + (newStat.flexStats?.gamesPlayed || 0)) - ((existing.flexStats?.wins || 0) + (newStat.flexStats?.wins || 0)),
          winrate: 0, // Will be calculated after merging
          kda: 0, // Will be calculated after merging
          kills: (existing.flexStats?.kills || 0) + (newStat.flexStats?.kills || 0),
          deaths: (existing.flexStats?.deaths || 0) + (newStat.flexStats?.deaths || 0),
          assists: (existing.flexStats?.assists || 0) + (newStat.flexStats?.assists || 0),
          averageCS: 0, // Will be calculated after merging
        };
        if (mergedFlexStats.gamesPlayed > 0) {
          mergedFlexStats.winrate = parseFloat(((mergedFlexStats.wins / mergedFlexStats.gamesPlayed) * 100).toFixed(1));
          mergedFlexStats.kda = mergedFlexStats.deaths === 0 ? mergedFlexStats.kills + mergedFlexStats.assists : parseFloat(((mergedFlexStats.kills + mergedFlexStats.assists) / mergedFlexStats.deaths).toFixed(2));
          const totalFlexCS = (existing.flexStats?.averageCS || 0) * (existing.flexStats?.gamesPlayed || 0) + (newStat.flexStats?.averageCS || 0) * (newStat.flexStats?.gamesPlayed || 0);
          mergedFlexStats.averageCS = parseFloat((totalFlexCS / mergedFlexStats.gamesPlayed).toFixed(1));
        }
        
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
            soloQueueGames: mergedSoloStats.gamesPlayed,
            flexQueueGames: mergedFlexStats.gamesPlayed,
          },
          soloStats: mergedSoloStats,
          flexStats: mergedFlexStats,
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

  const getChampionImageUrl = (championId: number) =>
    `${getChampionImage(championId.toString())}`;
    

  const displayedChampions = isExpanded ? filteredChampionStats : filteredChampionStats.slice(0, 5);
  const hasMore = filteredChampionStats.length > 5;

  // Calculate total games being displayed
  const totalGamesDisplayed = filteredChampionStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden mb-6">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 border-orange-500 px-2">
              Champion Stats
            </h2>
            {totalGamesDisplayed > 0 && (
              <span className="text-xs text-zinc-500 font-medium">
                {totalGamesDisplayed} {totalGamesDisplayed === 1 ? 'Game' : 'Games'}
              </span>
            )}
          </div>
          <div className="flex justify-center gap-2">
            <div className="flex gap-0.5 bg-zinc-800/50 rounded p-0.5">
              <button
                onClick={() => setQueueType("all")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  queueType === "all" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setQueueType("solo")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  queueType === "solo" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Solo
              </button>
              <button
                onClick={() => setQueueType("flex")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  queueType === "flex" ? "bg-orange-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Flex
              </button>
            </div>
            <button
              onClick={updateStats}
              disabled={isLoading}
              className="px-2 py-0.5 bg-orange-950/50 border border-orange-600/30 rounded text-orange-400 text-xs font-semibold hover:bg-orange-950/80 transition-all disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? "..." : "Update"}
            </button>
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
          {/* Compact Champion Stats Grid */}
          <div className="space-y-2 p-3">
            {displayedChampions.map((stat) => {
              const avgKills = (stat.kills / stat.gamesPlayed).toFixed(1);
              const avgDeaths = (stat.deaths / stat.gamesPlayed).toFixed(1);
              const avgAssists = (stat.assists / stat.gamesPlayed).toFixed(1);

              return (
                <div 
                  key={`${stat.champion}-${stat.championId}`} 
                  className="flex items-center justify-between p-2 hover:bg-zinc-800/30 rounded-lg transition-colors"
                >
                  {/* Champion Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getChampionImageUrl(stat.championId)}
                      alt={stat.champion}
                      className="w-10 h-10 rounded border border-zinc-700 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "images/nochampionimage.jpg";
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{stat.champion}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>CS {stat.averageCS}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-right">
                    {/* KDA */}
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${
                        stat.kda >= 4 ? "text-orange-400" : stat.kda >= 3 ? "text-green-400" : "text-zinc-300"
                      }`}>
                        {stat.kda.toFixed(2)} KDA
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {avgKills}/{avgDeaths}/{avgAssists}
                      </div>
                    </div>

                    {/* Win Rate */}
                    <div className="text-center">
                      <div className={`font-semibold text-sm ${
                        stat.winrate >= 55 ? "text-green-400" : stat.winrate >= 50 ? "text-blue-400" : "text-red-400"
                      }`}>
                        {stat.winrate}%
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {stat.gamesPlayed} Game{stat.gamesPlayed === 1 ? "" : "s"}
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
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show All ({filteredChampionStats.length} Champions)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}