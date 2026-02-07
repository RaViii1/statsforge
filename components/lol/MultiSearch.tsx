"use client";

import { useState, useRef } from "react";
import { Loader2, Search, X, ChevronDown, Clipboard, Sparkles, Swords, Users } from "lucide-react";
import Link from "next/link";
import { getRankIcon } from "@/lib/lol/lolfunctions";

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

interface ParsedPlayer {
  gameName: string;
  tagLine: string;
  isStreamerMode: boolean;
}

interface RankData {
  name: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface PlayerData {
  gameName: string;
  tagLine: string;
  summonerLevel?: number;
  profileIconId?: number;
  puuid?: string;
  soloRank?: RankData;
  flexRank?: RankData;
  error?: string;
  teamId?: number;
  championId?: number;
  isFromLiveGame?: boolean;
}

interface LiveGameInfo {
  gameId: number;
  gameMode: string;
  gameType: string;
  gameLength: number;
}



export default function MultiSearch() {
  const [lobbyText, setLobbyText] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [liveGameInfo, setLiveGameInfo] = useState<LiveGameInfo | null>(null);
  const [enemyTeam, setEnemyTeam] = useState<PlayerData[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const parseLobbyText = (text: string): ParsedPlayer[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const parsed: ParsedPlayer[] = [];
    const seen = new Set<string>();

    for (let line of lines) {
      line = line
        .replace(/⁦/g, "")
        .replace(/⁩/g, "")
        .replace(/\u2066/g, "")
        .replace(/\u2069/g, "")
        .replace(/\u202A/g, "")
        .replace(/\u202C/g, "")
        .replace(/joined\s+the\s+lobby/gi, "")
        .trim();
      
      if (!line) continue;
      
      if (line.includes("#")) {
        const match = line.match(/^(.+?)\s*#\s*(.+)$/);
        if (match) {
          const gameName = match[1].trim();
          const tagLine = match[2].trim();
          const key = `${gameName.toLowerCase()}#${tagLine.toLowerCase()}`;
          
          if (!seen.has(key) && gameName && tagLine) {
            seen.add(key);
            parsed.push({ gameName, tagLine, isStreamerMode: false });
          }
        }
      }
    }

    return parsed.slice(0, 5);
  };

  const fetchPlayerData = async (gameName: string, tagLine: string, server: string): Promise<PlayerData> => {
    try {
      const response = await fetch(
        `/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (!response.ok) {
        return { gameName, tagLine, error: "Player not found" };
      }

      const data = await response.json();
      
      const rankedResponse = await fetch(`/api/lol/ranked/${server}/${data.puuid}`);
      let soloRank: RankData | undefined;
      let flexRank: RankData | undefined;
      
      if (rankedResponse.ok) {
        const rankedResult = await rankedResponse.json();
        const ranked = rankedResult.rankedData || rankedResult;
        
        const soloQueue = ranked.find((r: any) => r.queueType === "RANKED_SOLO_5x5");
        if (soloQueue) {
          soloRank = {
            name: "Solo/Duo",
            tier: soloQueue.tier,
            rank: soloQueue.rank,
            leaguePoints: soloQueue.leaguePoints,
            wins: soloQueue.wins,
            losses: soloQueue.losses,
          };
        }
        
        const flexQueue = ranked.find((r: any) => r.queueType === "RANKED_FLEX_SR");
        if (flexQueue) {
          flexRank = {
            name: "Flex",
            tier: flexQueue.tier,
            rank: flexQueue.rank,
            leaguePoints: flexQueue.leaguePoints,
            wins: flexQueue.wins,
            losses: flexQueue.losses,
          };
        }
      }

      return {
        gameName,
        tagLine,
        puuid: data.puuid,
        summonerLevel: data.summonerLevel,
        profileIconId: data.profileIconId,
        soloRank,
        flexRank,
      };
    } catch {
      return { gameName, tagLine, error: "Failed to fetch data" };
    }
  };

  const checkLiveGame = async (puuid: string, server: string): Promise<{ inGame: boolean; gameData?: any }> => {
    try {
      const response = await fetch(`/api/lol/spectator/${server}/${puuid}`);
      if (!response.ok) return { inGame: false };
      const data = await response.json();
      return data;
    } catch {
      return { inGame: false };
    }
  };

  const fetchPlayerFromPuuid = async (puuid: string, server: string, teamId: number, championId: number, rankedData: any): Promise<PlayerData> => {
    try {
      // Get account info (gameName, tagLine) from puuid
      const regionMap: Record<string, string> = {
        na1: "americas", euw1: "europe", eun1: "europe", kr: "asia",
        br1: "americas", la1: "americas", la2: "americas", oc1: "sea",
        ru: "europe", tr1: "europe", jp1: "asia"
      };
      const continent = regionMap[server] || "europe";
      
      const accountRes = await fetch(`/api/lol/account/${continent}/${puuid}`);
      let gameName = "Unknown";
      let tagLine = "???";
      
      if (accountRes.ok) {
        const accountData = await accountRes.json();
        gameName = accountData.gameName || "Unknown";
        tagLine = accountData.tagLine || "???";
      }

      // Get profile data
      const profileRes = await fetch(`/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      let summonerLevel: number | undefined;
      let profileIconId: number | undefined;
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        summonerLevel = profileData.summonerLevel;
        profileIconId = profileData.profileIconId;
      }

      // Process rank data
      let soloRank: RankData | undefined;
      let flexRank: RankData | undefined;

      if (rankedData) {
        if (rankedData.queueType === "RANKED_SOLO_5x5") {
          soloRank = {
            name: "Solo/Duo",
            tier: rankedData.tier,
            rank: rankedData.rank,
            leaguePoints: rankedData.leaguePoints,
            wins: rankedData.wins,
            losses: rankedData.losses,
          };
        } else if (rankedData.queueType === "RANKED_FLEX_SR") {
          flexRank = {
            name: "Flex",
            tier: rankedData.tier,
            rank: rankedData.rank,
            leaguePoints: rankedData.leaguePoints,
            wins: rankedData.wins,
            losses: rankedData.losses,
          };
        }
      }

      return {
        gameName,
        tagLine,
        puuid,
        summonerLevel,
        profileIconId,
        soloRank,
        flexRank,
        teamId,
        championId,
        isFromLiveGame: true,
      };
    } catch {
      return {
        gameName: "Unknown",
        tagLine: "???",
        puuid,
        teamId,
        championId,
        isFromLiveGame: true,
        error: "Failed to fetch player data",
      };
    }
  };

  const handleSearch = async () => {
    if (!lobbyText.trim()) return;

    setIsSearching(true);
    setLiveGameInfo(null);
    setEnemyTeam([]);
    
    const parsedPlayers = parseLobbyText(lobbyText);

    const results = await Promise.all(
      parsedPlayers.map((player) => 
        fetchPlayerData(player.gameName, player.tagLine, selectedServer)
      )
    );

    setPlayers(results);

    // Check if any successfully fetched player is in a live game
    const validPlayers = results.filter(p => !p.error && p.puuid);
    
    for (const player of validPlayers) {
      const liveCheck = await checkLiveGame(player.puuid!, selectedServer);
      
      if (liveCheck.inGame && liveCheck.gameData) {
        const gameData = liveCheck.gameData;
        const participants = gameData.participants || [];
        const playerRanks = gameData.playerRanks || {};
        
        // Find which team our searched players are on
        const searchedPuuids = new Set(results.filter(p => p.puuid).map(p => p.puuid));
        let myTeamId: number | null = null;
        
        for (const p of participants) {
          if (searchedPuuids.has(p.puuid)) {
            myTeamId = p.teamId;
            break;
          }
        }
        
        if (myTeamId !== null) {
          // Fetch enemy team players
          const enemyParticipants = participants.filter((p: any) => p.teamId !== myTeamId);
          
          const enemyPromises = enemyParticipants.map((p: any) => 
            fetchPlayerFromPuuid(
              p.puuid, 
              selectedServer, 
              p.teamId, 
              p.championId,
              playerRanks[p.puuid] || null
            )
          );
          
          const enemyResults = await Promise.all(enemyPromises);
          setEnemyTeam(enemyResults);
          
          setLiveGameInfo({
            gameId: gameData.gameId,
            gameMode: gameData.gameMode,
            gameType: gameData.gameType,
            gameLength: gameData.gameLength,
          });
        }
        
        break; // Found a live game, stop checking
      }
    }

    setIsSearching(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleClear = () => {
    setLobbyText("");
    setPlayers([]);
    setEnemyTeam([]);
    setLiveGameInfo(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLobbyText(text);
    } catch {
      // Clipboard access denied
    }
  };

  const getRankColor = (tier?: string) => {
    if (!tier) return "text-zinc-500";
    const t = tier.toLowerCase();
    if (t === "challenger") return "text-yellow-400";
    if (t === "grandmaster") return "text-red-400";
    if (t === "master") return "text-purple-400";
    if (t === "diamond") return "text-blue-400";
    if (t === "emerald") return "text-emerald-400";
    if (t === "platinum") return "text-cyan-400";
    if (t === "gold") return "text-yellow-500";
    if (t === "silver") return "text-zinc-400";
    if (t === "bronze") return "text-orange-700";
    return "text-zinc-500";
  };

  const calculateWinRate = (wins?: number, losses?: number) => {
    if (!wins || !losses) return null;
    const total = wins + losses;
    return ((wins / total) * 100).toFixed(1);
  };

  const RankBadge = ({ rank, label }: { rank?: RankData; label: string }) => {
    if (!rank) return null;
    const winRate = calculateWinRate(rank.wins, rank.losses);
    
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
        <img 
          className="w-6 h-6"
          src={getRankIcon(rank.tier)} 
          alt={rank.tier} 
        />
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider leading-none">{label}</span>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-bold ${getRankColor(rank.tier)}`}>
              {rank.tier} {rank.rank}
            </span>
            <span className="text-[10px] text-zinc-500">{rank.leaguePoints} LP</span>
          </div>
        </div>
        {winRate && (
          <span className={`text-[10px] font-semibold ml-auto ${
            parseFloat(winRate) >= 50 ? "text-emerald-400" : "text-rose-400"
          }`}>
            {winRate}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Input Section */}
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-white">Lobby Scanner</span>
            <span className="text-xs text-zinc-500">• Up to 5 players</span>
          </div>
          
          {/* Server Selector */}
          <div className="relative">
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              disabled={isSearching}
              className="appearance-none pl-3 pr-8 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-orange-500/50 transition-all disabled:opacity-50 cursor-pointer"
            >
              {SERVERS.map((server) => (
                <option key={server.value} value={server.value}>
                  {server.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Textarea with Paste Button */}
        <div className="relative">
          <textarea
            value={lobbyText}
            onChange={(e) => setLobbyText(e.target.value)}
            placeholder="Paste lobby chat here...&#10;&#10;Example:&#10;Faker #KR1&#10;Doublelift#NA1"
            disabled={isSearching}
            rows={5}
            className="w-full px-4 py-3 bg-transparent text-white text-sm placeholder-zinc-600 focus:outline-none disabled:opacity-50 font-mono resize-none"
          />
          {!lobbyText && (
            <button
              onClick={handlePaste}
              className="absolute right-3 top-3 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-500/50 rounded-lg text-xs font-medium text-zinc-300 hover:text-white transition-all"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste
            </button>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/30">
          <div className="text-xs text-zinc-500">
            Format: <code className="text-orange-400/80 bg-zinc-800 px-1.5 py-0.5 rounded">Player#TAG</code>
          </div>
          <div className="flex items-center gap-2">
            {(lobbyText || players.length > 0) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/50 hover:border-red-500/50 text-xs font-medium text-zinc-400 hover:text-red-400 bg-zinc-800/50 hover:bg-red-500/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={isSearching || !lobbyText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Scan Lobby
                </>
              )}
            </button>
          </div>
        </div>
      </div>

        {/* Results Section */}
        {players.length > 0 && (
          <div ref={resultsRef} className="space-y-4">
            {/* Live Game Banner */}
            {liveGameInfo && (
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <Swords className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-white">Live Game Detected</span>
                <span className="text-xs text-zinc-400 ml-auto">
                  {liveGameInfo.gameMode} • {Math.floor(liveGameInfo.gameLength / 60)}:{String(liveGameInfo.gameLength % 60).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Your Team Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">
                  {liveGameInfo ? "Your Team" : "Players Found"}
                </span>
                <span className="text-xs text-zinc-500">
                  {players.filter((p) => !p.error).length}/{players.length}
                </span>
                <span className="text-xs text-zinc-500 ml-auto">
                  {SERVERS.find(s => s.value === selectedServer)?.label}
                </span>
              </div>

              {/* Player Cards */}
              <div className="grid gap-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className={`bg-zinc-900/80 backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${
                      player.error 
                        ? "border-red-500/20" 
                        : "border-zinc-800/50 hover:border-orange-500/30"
                    }`}
                  >
                    {player.error ? (
                      <div className="flex items-center gap-3 p-4">
                        <div className="w-12 h-12 bg-red-950/30 border border-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {player.gameName}
                            <span className="text-zinc-500">#{player.tagLine}</span>
                          </p>
                          <p className="text-xs text-red-400 mt-0.5">{player.error}</p>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/lol/profile/${selectedServer}/${encodeURIComponent(player.gameName)}/${encodeURIComponent(player.tagLine)}`}
                        className="block group"
                      >
                        <div className="flex items-center gap-4 p-4">
                          <div className="relative shrink-0">
                            <img
                              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId || "29"}.jpg`}
                              alt="Profile Icon"
                              className="w-12 h-12 rounded-lg border border-zinc-700 group-hover:border-orange-500 transition-all"
                            />
                            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px] font-bold text-orange-400">
                              {player.summonerLevel}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                              {player.gameName}
                              <span className="text-zinc-500 font-normal">#{player.tagLine}</span>
                            </p>
                            
                            {(player.soloRank || player.flexRank) ? (
                              <div className="flex flex-wrap gap-2 mt-2">
                                <RankBadge rank={player.soloRank} label="Solo/Duo" />
                                <RankBadge rank={player.flexRank} label="Flex" />
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500 mt-1 block">Unranked</span>
                            )}
                          </div>

                          <div className="text-zinc-600 group-hover:text-orange-500 transition-colors">
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enemy Team Section */}
            {enemyTeam.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Swords className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-white">Enemy Team</span>
                  <span className="text-xs text-zinc-500">{enemyTeam.length} players</span>
                </div>

                <div className="grid gap-2">
                  {enemyTeam.map((player, index) => (
                    <div
                      key={`enemy-${index}`}
                      className={`bg-zinc-900/80 backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${
                        player.error 
                          ? "border-red-500/20" 
                          : "border-red-500/20 hover:border-red-500/40"
                      }`}
                    >
                      {player.error ? (
                        <div className="flex items-center gap-3 p-4">
                          <div className="w-12 h-12 bg-red-950/30 border border-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <X className="w-5 h-5 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {player.gameName}
                              <span className="text-zinc-500">#{player.tagLine}</span>
                            </p>
                            <p className="text-xs text-red-400 mt-0.5">{player.error}</p>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/lol/profile/${selectedServer}/${encodeURIComponent(player.gameName)}/${encodeURIComponent(player.tagLine)}`}
                          className="block group"
                        >
                          <div className="flex items-center gap-4 p-4">
                            <div className="relative shrink-0">
                              <img
                                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId || "29"}.jpg`}
                                alt="Profile Icon"
                                className="w-12 h-12 rounded-lg border border-red-500/30 group-hover:border-red-500 transition-all"
                              />
                              {player.summonerLevel && (
                                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[10px] font-bold text-orange-400">
                                  {player.summonerLevel}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                                  {player.gameName}
                                  <span className="text-zinc-500 font-normal">#{player.tagLine}</span>
                                </p>
                                {player.isFromLiveGame && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 rounded">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              
                              {(player.soloRank || player.flexRank) ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <RankBadge rank={player.soloRank} label="Solo/Duo" />
                                  <RankBadge rank={player.flexRank} label="Flex" />
                                </div>
                              ) : (
                                <span className="text-xs text-zinc-500 mt-1 block">Unranked</span>
                              )}
                            </div>

                            <div className="text-zinc-600 group-hover:text-red-500 transition-colors">
                              <ChevronDown className="w-4 h-4 -rotate-90" />
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
}
