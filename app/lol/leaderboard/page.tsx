"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Loader2, ArrowUpRight, Medal, TrendingUp, Users, Search, Globe, ChevronLeft, ChevronRight, Layers, User2, Star, ArrowLeft, ArrowRight } from "lucide-react";
import NavbarLoL from "@/components/NavbarLol";
import Footer from "@/components/Footer";
import { getRankIcon } from "@/lib/lol/lolfunctions";
import { toast } from "sonner";
import  { SERVERS } from "@/lib/utils";

const QUEUES = [
  { value: "RANKED_SOLO_5x5", label: "Ranked Solo/Duo" },
  { value: "RANKED_FLEX_SR", label: "Ranked Flex" },
];

interface LeaderboardPlayer {
  summonerId: string;
  gameName: string;
  tagLine: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  position: number;
  level?: number;
  profileIconId?: number;
  tier: string;
  rank: string;
  freshBlood?: boolean;
  hotStreak?: boolean;
  inactive?: boolean;
  veteran?: boolean;
}

const LeaderboardContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Safe param extraction
  const getParam = (key: string, fallback: string) => {
    try {
      return searchParams?.get(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const initialServer = SERVERS.some(s => s.value === getParam("server", "")) 
    ? getParam("server", "euw1") 
    : "euw1";
    
  const initialQueue = QUEUES.some(q => q.value === getParam("queue", "")) 
    ? getParam("queue", "RANKED_SOLO_5x5") 
    : "RANKED_SOLO_5x5";
    
  const initialPage = Math.max(1, parseInt(getParam("page", "1")) || 1);
  
  const [selectedServer, setSelectedServer] = useState(initialServer);
  const [selectedQueue, setSelectedQueue] = useState(initialQueue);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState("");
  const [currentTier, setCurrentTier] = useState("CHALLENGER");
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [limit, setLimit] = useState(50);

  const fetchLeaderboard = async (server: string, queue: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/lol/leaderboard/${encodeURIComponent(server)}?queue=${encodeURIComponent(queue)}&page=${page}&limit=50`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch leaderboard");
      }
      const data = await response.json();
      setPlayers(data.players || []);
      setLeagueName(data.leagueName || "");
      setCurrentTier(data.tier || "CHALLENGER");
      setTotalPlayers(data.totalPlayers ?? 0);
      setLimit(data.limit || 50);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error loading leaderboard");
      toast.error(err.message || "Error loading leaderboard");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedServer, selectedQueue, currentPage);
  }, [selectedServer, selectedQueue, currentPage]);

  const handleServerChange = (server: string) => {
    setSelectedServer(server);
    setCurrentPage(1);
    router.push(`/lol/leaderboard?server=${server}&queue=${selectedQueue}&page=1`, { scroll: false });
  };

  const handleQueueChange = (queue: string) => {
    setSelectedQueue(queue);
    setCurrentPage(1);
    router.push(`/lol/leaderboard?server=${selectedServer}&queue=${queue}&page=1`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(totalPlayers / limit)) return;
    setCurrentPage(page);
    router.push(`/lol/leaderboard?server=${selectedServer}&queue=${selectedQueue}&page=${page}`, { scroll: true });
  };

  const calculateWinrate = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

    const totalPages = Math.max(1, Math.ceil(totalPlayers / limit) || 0);
  
  // Logic for podium and list
  // Only show podium on the first page
  const showPodium = currentPage === 1;
  const firstPlayer = showPodium ? players[0] : null;
  const nextThree = showPodium ? players.slice(1, 4) : [];
  const remainingPlayers = showPodium ? players.slice(4) : players;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <NavbarLoL />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6">
          <Link href="/lol" className="hover:text-orange-500 transition-colors uppercase tracking-widest">League of Legends</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-300 uppercase tracking-widest">Leaderboards</span>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-xl backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Region</span>
              <div className="relative group">
                <select
                  value={selectedServer}
                  onChange={(e) => handleServerChange(e.target.value)}
                  className="appearance-none bg-zinc-950 border border-zinc-800 text-white text-[13px] font-black px-4 py-2 pr-10 rounded-lg focus:outline-none focus:border-orange-500 cursor-pointer transition-all hover:bg-zinc-900"
                >
                  {SERVERS.map((server) => (
                    <option key={server.value} value={server.value}>{server.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="w-px h-6 bg-zinc-800 mx-2 hidden md:block" />

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Queue</span>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {QUEUES.map((queue) => (
                  <button
                    key={queue.value}
                    onClick={() => handleQueueChange(queue.value)}
                    className={`px-4 py-1.5 rounded-md text-[12px] font-black transition-all uppercase tracking-tighter ${
                      selectedQueue === queue.value
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {queue.label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="text-right">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Current Peak</div>
              <div className="text-[14px] font-black text-orange-500 uppercase flex items-center gap-2 justify-end">
                {currentTier} <span className="text-zinc-400 font-bold">|</span> <span className="text-zinc-100">{selectedServer.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg mb-1 uppercase tracking-widest">Updating Rankings</p>
              <p className="text-zinc-500 text-sm font-medium italic">Fetching the latest high-elo data from Riot APIs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6 bg-zinc-900/20 border border-red-900/50 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Globe className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg mb-1 uppercase tracking-widest">Connection Failed</p>
              <p className="text-zinc-500 text-sm font-medium italic mb-6 max-w-md px-4">{error}</p>
              <button 
                onClick={() => fetchLeaderboard(selectedServer, selectedQueue, currentPage)}
                className="px-6 py-2 bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : players.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <Users className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg mb-1 uppercase tracking-widest">No Contenders Found</p>
              <p className="text-zinc-500 text-sm font-medium italic">No ranked data available for this selection.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Podium Section - Only on Page 1 */}
            {showPodium && firstPlayer && (
              <div className="flex flex-col items-center">
                {/* Featured Player #1 - High-end integrated design */}
                <div className="w-full">
                  <div className="relative group overflow-hidden rounded-3xl border border-zinc-800/50 bg-linear-to-b from-zinc-900/40 to-black shadow-[0_0_50px_-12px_rgba(249,115,22,0.15)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.08),transparent_70%)]" />

                    
                    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                      {/* Avatar & Rank */}
                      <div className="relative">
                        <div className="relative z-10 w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-linear-to-br from-orange-500 via-yellow-500 to-orange-600 shadow-2xl">
                          <div className="w-full h-full rounded-full overflow-hidden border-4 border-black bg-zinc-900 relative">
                            {firstPlayer.profileIconId !== undefined ? (
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${firstPlayer.profileIconId}.jpg` || "/images/nochampionimage.jpg"}
                                alt="Profile Icon"
                                className="w-full h-full object-cover scale-105"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/nochampionimage.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                <User2 className="w-16 h-16" />
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Rank Badge Floating */}
                        <div className="absolute -bottom-4 -right-2 z-20 w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-float">
                          <img src={getRankIcon(firstPlayer.tier)} alt="" className="w-full h-full object-contain" />
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="flex-1 text-center md:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                          <Medal className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Rank #1 Contender</span>
                        </div>
                        
                        <Link 
                          href={`/lol/profile/${selectedServer}/${firstPlayer.gameName}/${firstPlayer.tagLine || 'NA1'}`}
                          className="group/name block mb-6"
                        >
                          <h2 className="text-4xl md:text-4xl font-black text-white group-hover/name:text-orange-500 transition-all duration-500 uppercase tracking-tighter leading-none">
                            {firstPlayer.gameName}
                            <span className="text-zinc-600 ml-2 text-2xl md:text-4xl">#{firstPlayer.tagLine || 'NA1'}</span>
                          </h2>
                        </Link>

                        <div className="grid grid-cols-2 md:flex items-center gap-x-12 gap-y-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Rating</span>
                            <span className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-2">
                              {firstPlayer.leaguePoints.toLocaleString()} <span className="text-orange-500 text-xs">LP</span>
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Winrate</span>
                            <span className="text-2xl md:text-3xl font-black text-green-500">
                              {calculateWinrate(firstPlayer.wins, firstPlayer.losses)}%
                            </span>
                          </div>
                          <div className="flex flex-col col-span-2 md:col-span-1">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Total Games</span>
                            <span className="text-2xl md:text-3xl font-black text-zinc-300">
                              {firstPlayer.wins + firstPlayer.losses} <span className="text-zinc-600 text-[10px] uppercase ml-1">Matches</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex flex-col items-center md:items-end gap-4">
                        <Link
                          href={`/lol/profile/${selectedServer}/${firstPlayer.gameName}/${firstPlayer.tagLine || 'NA1'}`}
                          className="px-8 py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-2xl shadow-white/5"
                        >
                          View Full Profile
                        </Link>
                        <div className="flex items-center gap-4 text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                          <span className="text-green-500/70">{firstPlayer.wins} Wins</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-800" />
                          <span className="text-red-500/70">{firstPlayer.losses} Losses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank 2-4 Integration */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {nextThree.map((player) => {
                    const winrate = calculateWinrate(player.wins, player.losses);
                    return (
                      <Link 
                        key={`podium-${player.position}-${player.summonerId}`}
                        href={`/lol/profile/${selectedServer}/${player.gameName}/${player.tagLine || 'NA1'}`}
                        className="group relative flex flex-col p-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-orange-500/30 transition-all duration-500 overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                          <img src={getRankIcon(player.tier)} alt="" className="w-32 h-32" />
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                            player.position === 2 ? "bg-zinc-300 text-black" :
                            player.position === 3 ? "bg-orange-400 text-black" :
                            "bg-zinc-800 text-zinc-400"
                          }`}>
                            #{player.position}
                          </div>
                          <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                            {player.leaguePoints} LP
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-zinc-800 group-hover:border-orange-500/50 transition-colors p-0.5 bg-black/40">
                            {player.profileIconId !== undefined ? (
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId}.jpg` || "/images/nochampionimage.jpg"}
                                alt="Profile Icon"
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/nochampionimage.jpg";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                <User2 className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm text-white truncate group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                              {player.gameName}
                            </div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                              {winrate}% Win Rate
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Leaderboard Table */}
            <div className="bg-[#09090b] border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <Layers className="w-4 h-4 text-orange-500" />
                  Ladder Rankings
                </h3>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Showing {players.length} contenders (Page {currentPage})
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800/50 bg-zinc-950">
                      <th className="pl-6 pr-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Rank</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Player Name</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Tier & Rank</th>
                      <th className="px-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">LP Points</th>
                      <th className="pr-6 pl-4 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Winrate / Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/30">
                    {remainingPlayers.map((player) => {
                      const winrate = calculateWinrate(player.wins, player.losses);
                      
                      return (
                        <tr 
                          key={`row-${player.position}-${player.summonerId}`}
                          className="hover:bg-zinc-900/40 transition-all group"
                        >
                          <td className="pl-6 pr-4 py-4">
                            <span className="text-sm font-black text-zinc-500 w-8 inline-block group-hover:text-zinc-300 transition-colors">
                              {player.position}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Link 
                              href={`/lol/profile/${selectedServer}/${player.gameName}/${player.tagLine || 'NA1'}`}
                              className="flex items-center gap-4 group/player"
                            >
                              <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 group-hover/player:border-orange-500/50 transition-colors bg-zinc-900 p-0.5">
                                  {player.profileIconId !== undefined ? (
                                    <img
                                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId}.jpg` || "/images/nochampionimage.jpg"}
                                      alt="Profile Icon"
                                      className="w-full h-full object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.src = "/images/nochampionimage.jpg";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700 bg-zinc-950 rounded-lg">
                                      <User2 className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                {player.level && (
                                  <div className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-zinc-950 border border-zinc-800 rounded-sm text-[7px] font-black text-zinc-400">
                                    {player.level}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-[14px] text-zinc-100 group-hover/player:text-orange-500 transition-colors uppercase tracking-tight">
                                    {player.gameName === 'Unknown' ? `Player ${player.position}` : player.gameName}
                                  </span>
                                  {player.tagLine && (
                                    <span className="text-zinc-600 font-bold text-[11px]">#{player.tagLine}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                                  <span className="text-green-500/70">{player.wins} W</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                  <span className="text-red-500/70">{player.losses} L</span>
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shrink-0">
                                <img 
                                  src={getRankIcon(player.tier)} 
                                  alt={player.tier} 
                                  className="w-6 h-6 object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-zinc-100 uppercase tracking-tight">
                                  {player.tier}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Rank {player.rank}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-zinc-100">
                                {player.leaguePoints}
                              </span>
                              <span className="text-[10px] text-orange-500 font-bold uppercase">LP</span>
                            </div>
                          </td>
                          <td className="pr-6 pl-4 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-lg font-black ${winrate >= 55 ? 'text-green-500' : winrate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {winrate}%
                              </span>
                              <span className="text-[10px] font-black text-zinc-500">
                                {player.wins} - {player.losses}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-4 px-6">
              <div className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                Showing <span className="text-zinc-300">{currentPage}</span> of <span className="text-zinc-300">{totalPages}</span> Pages
              </div>
              
              <div className="flex items-center gap-1 bg-zinc-900/40 p-1 rounded-lg border border-zinc-800/50">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-400" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - (i - (totalPages - currentPage + 2)));
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-black transition-all ${
                          currentPage === pageNum
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  );
}
