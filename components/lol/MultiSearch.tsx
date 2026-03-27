"use client";

import { useState, useRef } from "react";
import { Loader2, Search, X, ChevronDown, Clipboard, Swords, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getRankIcon } from "@/lib/lol/lolfunctions";

const SERVERS = [
  { value: "na1",  label: "NA"   },
  { value: "euw1", label: "EUW"  },
  { value: "eun1", label: "EUNE" },
  { value: "kr",   label: "KR"   },
  { value: "br1",  label: "BR"   },
  { value: "la1",  label: "LAN"  },
  { value: "la2",  label: "LAS"  },
  { value: "oc1",  label: "OCE"  },
  { value: "ru",   label: "RU"   },
  { value: "tr1",  label: "TR"   },
  { value: "jp1",  label: "JP"   },
];

interface ParsedPlayer  { gameName: string; tagLine: string; isStreamerMode: boolean; }
interface RankData       { name: string; tier: string; rank: string; leaguePoints: number; wins: number; losses: number; }
interface PlayerData     { gameName: string; tagLine: string; summonerLevel?: number; profileIconId?: number; puuid?: string; soloRank?: RankData; flexRank?: RankData; error?: string; teamId?: number; championId?: number; isFromLiveGame?: boolean; }
interface LiveGameInfo   { gameId: number; gameMode: string; gameType: string; gameLength: number; }

export default function MultiSearch() {
  const [lobbyText, setLobbyText]       = useState("");
  const [selectedServer, setSelectedServer] = useState("eun1");
  const [isSearching, setIsSearching]   = useState(false);
  const [players, setPlayers]           = useState<PlayerData[]>([]);
  const [liveGameInfo, setLiveGameInfo] = useState<LiveGameInfo | null>(null);
  const [enemyTeam, setEnemyTeam]       = useState<PlayerData[]>([]);
  const resultsRef                      = useRef<HTMLDivElement>(null);

  const parseLobbyText = (text: string): ParsedPlayer[] => {
    const lines = text.split("\n").filter(line => line.trim());
    const parsed: ParsedPlayer[] = [];
    const seen = new Set<string>();
    for (let line of lines) {
      line = line.replace(/⁦/g,"").replace(/⁩/g,"").replace(/\u2066/g,"").replace(/\u2069/g,"").replace(/\u202A/g,"").replace(/\u202C/g,"").replace(/joined\s+the\s+lobby/gi,"").trim();
      if (!line) continue;
      if (line.includes("#")) {
        const match = line.match(/^(.+?)\s*#\s*(.+)$/);
        if (match) {
          const gameName = match[1].trim();
          const tagLine  = match[2].trim();
          const key      = `${gameName.toLowerCase()}#${tagLine.toLowerCase()}`;
          if (!seen.has(key) && gameName && tagLine) { seen.add(key); parsed.push({ gameName, tagLine, isStreamerMode: false }); }
        }
      }
    }
    return parsed.slice(0, 5);
  };

  const fetchPlayerData = async (gameName: string, tagLine: string, server: string): Promise<PlayerData> => {
    try {
      const response = await fetch(`/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      if (!response.ok) return { gameName, tagLine, error: "Player not found" };
      const data = await response.json();
      const rankedResponse = await fetch(`/api/lol/ranked/${server}/${data.puuid}`);
      let soloRank: RankData | undefined;
      let flexRank: RankData | undefined;
      if (rankedResponse.ok) {
        const rankedResult = await rankedResponse.json();
        const ranked = rankedResult.rankedData || rankedResult;
        const soloQueue = ranked.find((r: any) => r.queueType === "RANKED_SOLO_5x5");
        if (soloQueue) soloRank = { name: "Solo/Duo", tier: soloQueue.tier, rank: soloQueue.rank, leaguePoints: soloQueue.leaguePoints, wins: soloQueue.wins, losses: soloQueue.losses };
        const flexQueue = ranked.find((r: any) => r.queueType === "RANKED_FLEX_SR");
        if (flexQueue) flexRank = { name: "Flex", tier: flexQueue.tier, rank: flexQueue.rank, leaguePoints: flexQueue.leaguePoints, wins: flexQueue.wins, losses: flexQueue.losses };
      }
      return { gameName, tagLine, puuid: data.puuid, summonerLevel: data.summonerLevel, profileIconId: data.profileIconId, soloRank, flexRank };
    } catch { return { gameName, tagLine, error: "Failed to fetch data" }; }
  };

  const checkLiveGame = async (puuid: string, server: string): Promise<{ inGame: boolean; gameData?: any }> => {
    try {
      const response = await fetch(`/api/lol/spectator/${server}/${puuid}`);
      if (!response.ok) return { inGame: false };
      return await response.json();
    } catch { return { inGame: false }; }
  };

  const fetchPlayerFromPuuid = async (puuid: string, server: string, teamId: number, championId: number, rankedData: any): Promise<PlayerData> => {
    try {
      const regionMap: Record<string, string> = { na1:"americas", euw1:"europe", eun1:"europe", kr:"asia", br1:"americas", la1:"americas", la2:"americas", oc1:"sea", ru:"europe", tr1:"europe", jp1:"asia" };
      const continent  = regionMap[server] || "europe";
      const accountRes = await fetch(`/api/lol/account/${continent}/${puuid}`);
      let gameName = "Unknown"; let tagLine = "???";
      if (accountRes.ok) { const d = await accountRes.json(); gameName = d.gameName || "Unknown"; tagLine = d.tagLine || "???"; }
      const profileRes = await fetch(`/api/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      let summonerLevel: number | undefined; let profileIconId: number | undefined;
      if (profileRes.ok) { const d = await profileRes.json(); summonerLevel = d.summonerLevel; profileIconId = d.profileIconId; }
      let soloRank: RankData | undefined; let flexRank: RankData | undefined;
      if (rankedData) {
        if (rankedData.queueType === "RANKED_SOLO_5x5") soloRank = { name:"Solo/Duo", tier:rankedData.tier, rank:rankedData.rank, leaguePoints:rankedData.leaguePoints, wins:rankedData.wins, losses:rankedData.losses };
        else if (rankedData.queueType === "RANKED_FLEX_SR") flexRank = { name:"Flex", tier:rankedData.tier, rank:rankedData.rank, leaguePoints:rankedData.leaguePoints, wins:rankedData.wins, losses:rankedData.losses };
      }
      return { gameName, tagLine, puuid, summonerLevel, profileIconId, soloRank, flexRank, teamId, championId, isFromLiveGame: true };
    } catch { return { gameName:"Unknown", tagLine:"???", puuid, teamId, championId, isFromLiveGame:true, error:"Failed to fetch player data" }; }
  };

  const handleSearch = async () => {
    if (!lobbyText.trim()) return;
    setIsSearching(true); setLiveGameInfo(null); setEnemyTeam([]);
    const parsedPlayers = parseLobbyText(lobbyText);
    const results = await Promise.all(parsedPlayers.map(p => fetchPlayerData(p.gameName, p.tagLine, selectedServer)));
    setPlayers(results);
    const validPlayers = results.filter(p => !p.error && p.puuid);
    for (const player of validPlayers) {
      const liveCheck = await checkLiveGame(player.puuid!, selectedServer);
      if (liveCheck.inGame && liveCheck.gameData) {
        const gameData     = liveCheck.gameData;
        const participants = gameData.participants || [];
        const playerRanks  = gameData.playerRanks || {};
        const searchedPuuids = new Set(results.filter(p => p.puuid).map(p => p.puuid));
        let myTeamId: number | null = null;
        for (const p of participants) { if (searchedPuuids.has(p.puuid)) { myTeamId = p.teamId; break; } }
        if (myTeamId !== null) {
          const enemyParticipants = participants.filter((p: any) => p.teamId !== myTeamId);
          const enemyResults = await Promise.all(enemyParticipants.map((p: any) => fetchPlayerFromPuuid(p.puuid, selectedServer, p.teamId, p.championId, playerRanks[p.puuid] || null)));
          setEnemyTeam(enemyResults);
          setLiveGameInfo({ gameId:gameData.gameId, gameMode:gameData.gameMode, gameType:gameData.gameType, gameLength:gameData.gameLength });
        }
        break;
      }
    }
    setIsSearching(false);
    setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }); }, 100);
  };

  const handleClear  = () => { setLobbyText(""); setPlayers([]); setEnemyTeam([]); setLiveGameInfo(null); };
  const handlePaste  = async () => { try { const text = await navigator.clipboard.readText(); setLobbyText(text); } catch {} };

  const getRankColor = (tier?: string) => {
    if (!tier) return "text-zinc-500";
    const t = tier.toLowerCase();
    if (t === "challenger")  return "text-yellow-400";
    if (t === "grandmaster") return "text-red-400";
    if (t === "master")      return "text-purple-400";
    if (t === "diamond")     return "text-blue-400";
    if (t === "emerald")     return "text-emerald-400";
    if (t === "platinum")    return "text-cyan-400";
    if (t === "gold")        return "text-yellow-500";
    if (t === "silver")      return "text-zinc-400";
    if (t === "bronze")      return "text-orange-700";
    return "text-zinc-500";
  };

  const calculateWinRate = (wins?: number, losses?: number) => {
    if (!wins || !losses) return null;
    return (((wins / (wins + losses)) * 100).toFixed(1));
  };


  const RankBadge = ({ rank, label }: { rank?: RankData; label: string }) => {
    if (!rank) return null;
    const winRate = calculateWinRate(rank.wins, rank.losses);
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/60 rounded-lg">
        <img className="w-5 h-5" src={getRankIcon(rank.tier)} alt={rank.tier} />
        <div className="flex flex-col leading-none">
          <span className="text-[9px] text-zinc-600 uppercase tracking-wider">{label}</span>
          <span className={`text-[11px] font-black ${getRankColor(rank.tier)}`}>
            {rank.tier} {rank.rank}
            <span className="text-zinc-500 font-normal ml-1">{rank.leaguePoints} LP</span>
          </span>
        </div>
        {winRate && (
          <span className={`text-[10px] font-black ml-1 ${parseFloat(winRate) >= 50 ? "text-emerald-400" : "text-rose-400"}`}>
            {winRate}%
          </span>
        )}
      </div>
    );
  };

  const PlayerRow = ({ player, isEnemy = false }: { player: PlayerData; isEnemy?: boolean }) => {
    const hoverBorder = isEnemy ? "hover:border-red-500/30" : "hover:border-orange-500/30";
    const hoverChevron = isEnemy ? "group-hover:text-red-400" : "group-hover:text-orange-400";
    const hoverName = isEnemy ? "group-hover:text-red-400" : "group-hover:text-orange-400";
    const avatarBorder = isEnemy ? "border-red-500/20 group-hover:border-red-500/60" : "border-zinc-700 group-hover:border-orange-500/60";

    if (player.error) {
      return (
        <div className="flex items-center gap-3 p-3.5 bg-zinc-900/50 border border-red-500/10 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-950/20 border border-red-900/20 flex items-center justify-center shrink-0">
            <X className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate uppercase tracking-tight">
              {player.gameName}<span className="text-zinc-600 font-normal">#{player.tagLine}</span>
            </p>
            <p className="text-[11px] text-red-500 mt-0.5">{player.error}</p>
          </div>
        </div>
      );
    }

    return (
      <Link
        href={`/lol/profile/${selectedServer}/${encodeURIComponent(player.gameName)}/${encodeURIComponent(player.tagLine)}`}
        className="group block"
      >
        <div className={`flex items-center gap-3.5 p-3.5 bg-zinc-900/50 border border-zinc-800 ${hoverBorder} rounded-xl transition-colors`}>
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.profileIconId || "29"}.jpg`}
              alt="icon"
              className={`w-11 h-11 rounded-lg border ${avatarBorder} transition-colors`}
            />
            <div className="absolute -bottom-1 -right-1 px-1 py-px bg-zinc-950 border border-zinc-800 rounded text-[9px] font-black text-orange-400 leading-none">
              {player.summonerLevel}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <p className={`text-sm font-black text-white uppercase tracking-tight truncate ${hoverName} transition-colors`}>
                {player.gameName}<span className="text-zinc-600 font-normal normal-case">#{player.tagLine}</span>
              </p>
              {player.isFromLiveGame && (
                <span className="shrink-0 px-1.5 py-px text-[9px] font-black bg-red-500/15 text-red-400 rounded uppercase tracking-wider">
                  LIVE
                </span>
              )}
            </div>
            {(player.soloRank || player.flexRank) ? (
              <div className="flex flex-wrap gap-1.5">
                <RankBadge rank={player.soloRank} label="Solo/Duo" />
                <RankBadge rank={player.flexRank} label="Flex" />
              </div>
            ) : (
              <span className="text-[11px] text-zinc-600 font-black uppercase tracking-wider">Unranked</span>
            )}
          </div>

          {/* Arrow */}
          <ChevronRight className={`w-4 h-4 text-zinc-700 ${hoverChevron} transition-colors shrink-0`} />
        </div>
      </Link>
    );
  };

  const SectionHeader = ({ icon, label, count, accent = "orange" }: { icon: React.ReactNode; label: string; count?: string; accent?: "orange" | "red" }) => (
    <div className="flex items-center gap-4 mb-3">
      <div className={`w-0.5 h-5 rounded-full shrink-0 ${accent === "red" ? "bg-red-500" : "bg-orange-500"}`} />
      <div className="flex items-center gap-2">
        {icon}
        <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] leading-none ${accent === "red" ? "text-red-400" : "text-zinc-300"}`}>
          {label}
        </h3>
        {count && <span className="text-[10px] font-black text-zinc-700 tabular-nums">{count}</span>}
      </div>
      <div className="flex-1 h-px bg-zinc-900" />
    </div>
  );

  return (
    <div className="w-full space-y-8">

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">

        {/* Top bar — label + server select */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-4 bg-orange-500 rounded-full" />
            <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">Lobby Scanner</span>
            <span className="text-[10px] text-zinc-700 font-black uppercase tracking-wider">· up to 5 players</span>
          </div>

          {/* Server selector — bare, design-system style */}
          <div className="relative">
            <select
              value={selectedServer}
              onChange={e => setSelectedServer(e.target.value)}
              disabled={isSearching}
              className="appearance-none pl-3 pr-7 py-1.5 bg-zinc-800 rounded-lg text-xs font-black text-zinc-300 focus:outline-none focus:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer uppercase tracking-wider"
            >
              {SERVERS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={lobbyText}
            onChange={e => setLobbyText(e.target.value)}
            placeholder={"Paste lobby chat here...\n\nExample:\nFaker #KR1\nDoublelift #NA1"}
            disabled={isSearching}
            rows={5}
            className="w-full px-4 py-3.5 bg-transparent text-sm text-white placeholder-zinc-700 focus:outline-none disabled:opacity-50 font-mono resize-none leading-relaxed"
          />
          {!lobbyText && (
            <button
              onClick={handlePaste}
              className="absolute right-3 top-3 flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[11px] font-black text-zinc-500 hover:text-zinc-200 uppercase tracking-wider transition-colors"
            >
              <Clipboard className="w-3 h-3" />
              Paste
            </button>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/30">
          <span className="text-[11px] text-zinc-700">
            Format: <code className="text-orange-400/80 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">Player#TAG</code>
          </span>
          <div className="flex items-center gap-2">
            {(lobbyText || players.length > 0) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-black text-zinc-500 hover:text-zinc-200 uppercase tracking-wider transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={isSearching || !lobbyText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-zinc-950 text-[11px] font-black uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <><Loader2 className="w-3 h-3 animate-spin" />Scanning...</>
              ) : (
                <><Search className="w-3 h-3" />Scan Lobby</>
              )}
            </button>
          </div>
        </div>
      </div>

      {players.length > 0 && (
        <div ref={resultsRef} className="space-y-8">

          {/* Live game banner */}
          {liveGameInfo && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shrink-0" />
              <Swords className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-sm font-black text-white uppercase tracking-tight">Live Game Detected</span>
              <span className="text-[11px] text-zinc-500 ml-auto tabular-nums">
                {liveGameInfo.gameMode} · {Math.floor(liveGameInfo.gameLength / 60)}:{String(liveGameInfo.gameLength % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Your team */}
          <div>
            <SectionHeader
              icon={<Users className="w-3.5 h-3.5 text-zinc-500" />}
              label={liveGameInfo ? "Your Team" : "Players Found"}
              count={`${players.filter(p => !p.error).length}/${players.length}`}
            />
            <div className="space-y-2">
              {players.map((player, i) => <PlayerRow key={i} player={player} />)}
            </div>
          </div>

          {/* Enemy team */}
          {enemyTeam.length > 0 && (
            <div>
              <SectionHeader
                icon={<Swords className="w-3.5 h-3.5 text-red-500" />}
                label="Enemy Team"
                count={`${enemyTeam.length}`}
                accent="red"
              />
              <div className="space-y-2">
                {enemyTeam.map((player, i) => <PlayerRow key={i} player={player} isEnemy />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}