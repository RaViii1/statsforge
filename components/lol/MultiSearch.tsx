"use client";

import { useState, useRef } from "react";
import { Users, Loader2, EyeOff, Search, X } from "lucide-react";
import Link from "next/link";
import { SummonerData } from "@/app/types/lolInterfaces";
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



export default function MultiSearch() {
  const [lobbyText, setLobbyText] = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching] = useState(false);
  const [players, setPlayers] = useState<SummonerData[]>([]);
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

  const fetchPlayerData = async (gameName: string, tagLine: string, server: string): Promise<SummonerData | { gameName: string; tagLine: string; error: string }> => {
    try {
      const response = await fetch(
        `/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );

      if (!response.ok) {
        return {
          gameName,
          tagLine,
          error: "Player not found",
        };
      }

      const data = await response.json();
      
      const rankedResponse = await fetch(`/api/lol/ranked/${server}/${data.puuid}`);
      let rankedData = {};
      
      if (rankedResponse.ok) {
        const rankedResult = await rankedResponse.json();
        const ranked = rankedResult.rankedData || rankedResult;
        const soloQueue = ranked.find((r: any) => r.queueType === "RANKED_SOLO_5x5");
        if (soloQueue) {
          rankedData = {
            tier: soloQueue.tier,
            rank: soloQueue.rank,
            leaguePoints: soloQueue.leaguePoints,
            wins: soloQueue.wins,
            losses: soloQueue.losses,
          };
        }
      }

      return {
        gameName,
        tagLine,
        summonerLevel: data.summonerLevel,
        profileIconId: data.profileIconId,
        rankedData,
      };
    } catch (error) {
      return {
        gameName,
        tagLine,
        error: "Failed to fetch data",
      };
    }
  };

    const handleSearch = async () => {
      if (!lobbyText.trim()) return;

      setIsSearching(true);
      const parsedPlayers = parseLobbyText(lobbyText);

      const results = await Promise.all(
        parsedPlayers.map((player) => 
          fetchPlayerData(player.gameName, player.tagLine, selectedServer)
        )
      );

      setPlayers(results);
      setIsSearching(false);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    };

  const handleClear = () => {
    setLobbyText("");
    setPlayers([]);
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

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="p-6 sm:p-8 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700/50 transition-all group">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-orange-600/60 border border-orange-500/30 rounded-lg flex items-center justify-center group-hover:bg-orange-600/30 group-hover:scale-110 transition-all">
            <Search className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Paste Lobby Chat</h3>
            <p className="text-xs text-zinc-500">Analyzes up to 5 players automatically</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              disabled={isSearching}
              className="px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/50 focus:bg-zinc-900 transition-all font-semibold disabled:opacity-50"
            >
              {SERVERS.map((server) => (
                <option key={server.value} value={server.value}>
                  {server.label}
                </option>
              ))}
            </select>

            <div className="flex-1 flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching || !lobbyText.trim()}
                className="group relative flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-bold overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search All</span>
                    </>
                  )}
                </span>
              </button>

              {(lobbyText || players.length > 0) && (
                <button
                  onClick={handleClear}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700/50 hover:border-orange-500/50 font-semibold text-sm text-white bg-zinc-900/50 hover:bg-zinc-800/50 backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

            <textarea
              value={lobbyText}
              onChange={(e) => setLobbyText(e.target.value)}
              placeholder={`Example:
Faker #KR1
Doublelift#NA1
Gromp`}
              disabled={isSearching}
              rows={10}
              className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 focus:bg-zinc-900 transition-all disabled:opacity-50 font-mono resize-none"
            />

            <div className="flex items-start gap-2 px-3 py-2 bg-zinc-900/60 border border-zinc-800/50 rounded-lg">
              <div className="text-orange-500 text-sm flex-shrink-0 mt-0.5">💡</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  Paste usernames with Riot ID tags. Formats: <span className="text-orange-400 font-semibold">Player#TAG</span>, <span className="text-orange-400 font-semibold">Player #TAG</span>, <span className="text-orange-400 font-semibold">Player#TAG joined the lobby</span>. One per line. Names without # are ignored.
                </div>
            </div>
        </div>
      </div>

        {players.length > 0 && (
          <div ref={resultsRef} className="space-y-4">
            <div className="p-5 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">
                  Found {players.length} {players.length === 1 ? "Player" : "Players"}
                </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {players.filter((p) => !p.error).length} profiles successfully loaded
                  </p>
              </div>
              <div className="px-3 py-1.5 bg-orange-600/20 border border-orange-500/30 rounded-lg">
                <span className="text-lg font-black text-orange-400">{players.filter((p) => !p.error).length}/{players.length}</span>
              </div>
            </div>
          </div>

            <div className="grid gap-3 md:grid-cols-2">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="p-5 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50 rounded-xl hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all group"
                >
                  {player.error ? (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-red-950/30 border border-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-white truncate">
                        {player.gameName}
                        <span className="text-zinc-500">#{player.tagLine}</span>
                      </p>
                      <p className="text-xs text-red-400 mt-1">{player.error}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/lol/profile/${selectedServer}/${encodeURIComponent(player.gameName)}/${encodeURIComponent(player.tagLine)}`}
                    className="block"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId || "default"}.jpg`}
                          alt="Profile Icon"
                          className="w-14 h-14 rounded-lg border border-zinc-700 group-hover:border-orange-500 transition-all"
                        />
                        <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 rounded">
                          <span className="text-xs font-bold text-orange-400">{player.summonerLevel}</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                          {player.gameName}
                          <span className="text-zinc-500">#{player.tagLine}</span>
                        </p>

                        {player.rankedData?.tier ? (
                          <div className="mt-1.5 space-y-1">
                            <div className="flex items-center gap-2">
                               <img 
                              className="w-9 h-9"
                              src={getRankIcon(player.rankedData.tier)} alt={(player.rankedData.tier)} />
                              <span className={`text-sm font-bold ${getRankColor(player.rankedData.tier)}`}>
                                {player.rankedData.tier} {player.rankedData.rank}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {player.rankedData.leaguePoints} LP
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-zinc-400">
                                {player.rankedData.wins}W {player.rankedData.losses}L
                              </span>
                              {calculateWinRate(player.rankedData.wins, player.rankedData.losses) && (
                                <span className={`font-bold ${
                                  parseFloat(calculateWinRate(player.rankedData.wins, player.rankedData.losses)!) >= 50
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                }`}>
                                  {calculateWinRate(player.rankedData.wins, player.rankedData.losses)}% WR
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1.5">
                            <span className="text-sm text-zinc-500">Unranked</span>
                          </div>
                        )}
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
  );
}
