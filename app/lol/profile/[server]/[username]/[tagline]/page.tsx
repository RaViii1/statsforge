"use client";
import { Search, TrendingUp, Trophy, Target, Swords, Shield, Clock, ArrowLeft, Loader2, Anvil, CheckCircle, XCircle, ChevronDown, ChevronUp, Star, Book, FlameIcon, Crown } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getChampionNameById } from "@/lib/champion-data";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getArenaAugmentName, getArenaAugmentIcon } from "@/lib/arena-augments";
import LolBanner from "@/Components/lolbaner";

interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface MatchParticipant {
  puuid: string;
  summonerName: string;
  riotIdGameName: string;
  riotIdTagline: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  teamId: number;
  totalMinionsKilled: number;
  goldEarned: number;
  champLevel: number;
  summoner1Id: number;
  summoner2Id: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  perks?: {
    styles: Array<{
      selections: Array<{
        perk: number;
      }>;
    }>;
  };
  playerAugment1?: number;
  playerAugment2?: number;
  playerAugment3?: number;
  playerAugment4?: number;
}

interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  participants: MatchParticipant[];
  gameEndedInEarlySurrender?: boolean;
  gameEndedInSurrender?: boolean;
}

interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo;
}

interface MatchHistory {
  matches: Match[];
  totalMatches: number;
}

interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
}

interface RankedEntry {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
}

const CHAMPION_ID_TO_NAME: Record<number, string> = {
  1: "Annie", 2: "Olaf", 3: "Galio", 4: "TwistedFate", 5: "XinZhao",
  6: "Urgot", 7: "LeBlanc", 8: "Vladimir", 9: "Fiddlesticks", 10: "Kayle",
  // Add more as needed - this is just a sample
};

export default function ProfilePage() {
  const params = useParams();
  const server = params?.server as string;
  const username = params?.username as string;
  const tagline = params?.tagline as string;

  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchHistory | null>(null);
  const [championMastery, setChampionMastery] = useState<ChampionMastery[]>([]);
  const [rankedData, setRankedData] = useState<RankedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [masteryLoading, setMasteryLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "mastery">("matches");
  
  // Use ref to track offset to avoid stale closure issues
  const offsetRef = useRef(0);

  const decodedGameName = decodeURIComponent(username);
  const decodedTagLine = decodeURIComponent(tagline);

  // Get highest mastery champion for background
  const highestMasteryChampion = championMastery.length > 0 
    ? championMastery.reduce((prev, current) => 
        (prev.championPoints > current.championPoints) ? prev : current
      )
    : null;

  const highestMasteryChampionName = highestMasteryChampion 
    ? getChampionNameById(highestMasteryChampion.championId)
    : null;

  const highestMasterySplashArt = highestMasteryChampion && highestMasteryChampionName
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${highestMasteryChampionName.toLowerCase()}/skins/base/images/${highestMasteryChampionName.toLowerCase()}_splash_centered_0.jpg`
    : null;
      console.log("Highest Mastery Champion Splash Art URL:", highestMasterySplashArt);
      console.log("Highest :", highestMasteryChampionName);

  // Single fetchMatchHistory function
  const fetchMatchHistory = async (puuid: string, start: number, count: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setMatchesLoading(true);
      }
      
      const matchResponse = await fetch(`/api/lol/matches/${server}/${puuid}?count=${count}&start=${start}`);
      
      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        if (isLoadMore) {
          // Append new matches
          setMatchHistory(prev => prev ? {
            ...prev,
            matches: [...prev.matches, ...matchData.matches]
          } : matchData);
        } else {
          // Initial load
          setMatchHistory(matchData);
        }
        // Update offset ref AFTER successful fetch
        offsetRef.current = start + count;
      }
    } catch (err) {
      console.error("Failed to fetch match history:", err);
    } finally {
      setMatchesLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchSummonerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/lol/profile/${server}/${username}/${tagline}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch summoner data");
        }

        const data = await response.json();
        setSummonerData(data);

        // Fetch all data in parallel - including mastery data
        Promise.all([
          fetchMatchHistory(data.puuid, 0, 10, false),
          fetchRankedData(data.puuid),
          fetchChampionMastery(data.puuid),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchRankedData = async (puuid: string) => {
      try {
        const rankedResponse = await fetch(`/api/lol/ranked/${server}/${puuid}`);
        if (rankedResponse.ok) {
          const data = await rankedResponse.json();
          setRankedData(data.rankedData);
        }
      } catch (err) {
        console.error("Failed to fetch ranked data:", err);
      }
    };

    fetchSummonerData();
  }, [server, username, tagline]);

  const fetchChampionMastery = async (puuid: string) => {
    if (championMastery.length > 0) return;
    
    try {
      setMasteryLoading(true);
      const response = await fetch(`/api/lol/mastery/${server}/${puuid}`);
      if (response.ok) {
        const data = await response.json();
        setChampionMastery(data.masteries);
        console.log("Champion Mastery Data:", data.masteries.slice(0, 3)); // Log first 3
      }
    } catch (err) {
      console.error("Failed to fetch champion mastery:", err);
    } finally {
      setMasteryLoading(false);
    }
  };

  useEffect(() => {
    // No longer needed - mastery is fetched on initial load
    // This useEffect can be removed
  }, [activeTab]);

  const loadMoreMatches = () => {
    if (summonerData && !loadingMore) {
      // Use current offset directly, don't update it here
      const currentOffset = offsetRef.current;
      
      // Fetch 10 more matches starting from current offset
      fetchMatchHistory(summonerData.puuid, currentOffset, 10, true);
    }
  };

  const formatGameDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getQueueName = (queueId: number) => {
    const queues: Record<number, string> = {
      420: "Ranked Solo/Duo",
      440: "Ranked Flex",
      450: "ARAM",
      400: "Normal Draft",
      430: "Normal Blind",
      490: "Normal Quickplay",
      1700: "Arena",
      1710: "Arena",
    };
    return queues[queueId] || "Custom Game";
  };

  const isRemake = (match: Match) => {
    return match.info.gameDuration < 300 && (
      match.info.gameEndedInEarlySurrender || 
      match.info.gameEndedInSurrender
    );
  };

  const isArena = (queueId: number) => {
    return queueId === 1700 || queueId === 1710;
  };

  const getLPChange = (match: Match, playerData: MatchParticipant) => {
    // This is an approximation - exact LP changes require timeline data
    // For ranked games, estimate based on win/loss
    if (match.info.queueId === 420 || match.info.queueId === 440) {
      const soloQRanked = rankedData.find(r => r.queueType === "RANKED_SOLO_5x5");
      if (soloQRanked) {
        // Rough estimate: +15-25 for win, -15-20 for loss
        return playerData.win ? "+18 LP" : "-17 LP";
      }
    }
    return null;
  };

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const getRankIcon = (tier: string | undefined) => {
    if (tier === null || !tier) {
      return 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png';
    }
    const tierLower = tier.toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${tierLower}.png`;
  };

  const getQueueTypeName = (queueType: string) => {
    const names: Record<string, string> = {
      'RANKED_SOLO_5x5': 'Ranked Solo/Duo',
      'RANKED_FLEX_SR': 'Ranked Flex',
      'RANKED_TFT': 'Ranked TFT',
    };
    return names[queueType] || queueType;
  };

  const renderMatchCard = (match: Match) => {
    const playerData = match.info.participants.find(
      (p) => p.puuid === summonerData?.puuid
    );

    if (!playerData) return null;

    const remake = isRemake(match);
    const arena = isArena(match.info.queueId);
    const isExpanded = expandedMatch === match.metadata.matchId;
    const lpChange = getLPChange(match, playerData);

    const kda = playerData.deaths === 0 
      ? "Perfect" 
      : ((playerData.kills + playerData.assists) / playerData.deaths).toFixed(2);

    // Split teams
    const team1 = match.info.participants.filter(p => p.teamId === 100);
    const team2 = match.info.participants.filter(p => p.teamId === 200);

    return (
      <div
        key={match.metadata.matchId}
        className={`rounded-xl border transition-all cursor-pointer ${
          remake 
            ? "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50"
            : playerData.win
            ? "bg-emerald-950/30 border-emerald-900/50 hover:border-emerald-800 hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-900/20"
            : "bg-red-950/30 border-red-900/50 hover:border-red-800 hover:bg-red-950/40 hover:shadow-lg hover:shadow-red-900/20"
        }`}
      >
        {/* Main Match Card */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Game Result */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 min-w-[120px] ${
                remake 
                  ? "text-zinc-400"
                  : playerData.win ? "text-emerald-400" : "text-red-400"
              }`}>
                {remake ? (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-bold">Remake</span>
                  </>
                ) : playerData.win ? (
                  <>
                    <Crown className="w-5 h-5" />
                    <span className="font-bold">Victory</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-5 h-5" />
                    <span className="font-bold">Defeat</span>
                  </>
                )}
              </div>

              {/* Champion Icon with Summoner Spells */}
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-zinc-700 hover:border-orange-500 hover:scale-110 transition-all">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${playerData.championName}.png`}
                    alt={playerData.championName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Summoner Spells */}
                <div className="flex flex-col gap-1">
                  <div 
                    className="w-7 h-7 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                    title={getSummonerSpellName(playerData.summoner1Id)}
                  >
                    <img
                      src={getSummonerSpellIcon(playerData.summoner1Id)}
                      alt={getSummonerSpellName(playerData.summoner1Id)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    className="w-7 h-7 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                    title={getSummonerSpellName(playerData.summoner2Id)}
                  >
                    <img
                      src={getSummonerSpellIcon(playerData.summoner2Id)}
                      alt={getSummonerSpellName(playerData.summoner2Id)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-white">
                  {playerData.kills} / {playerData.deaths} / {playerData.assists}
                </span>
                <span className="text-sm text-zinc-400">
                  {kda} KDA
                </span>
              </div>
            </div>

            {/* Game Info */}
            <div className="flex flex-col items-end gap-1 text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {getQueueName(match.info.queueId)}
                </span>
                {lpChange && (
                  <span className={`text-sm font-bold ${
                    lpChange.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {lpChange}
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400">
                {formatGameDuration(match.info.gameDuration)}
              </span>
              <span className="text-xs text-zinc-500">
                {formatTimestamp(match.info.gameCreation)}
              </span>
            </div>

            {/* Items */}
            <div className={`hidden lg:grid gap-1 ${arena ? 'grid-cols-6' : 'grid-cols-7'}`}>
              {arena ? (
                // Arena items (slots 0-5, no trinket)
                <>
                  {[
                    playerData.item0,
                    playerData.item1,
                    playerData.item2,
                    playerData.item3,
                    playerData.item4,
                    playerData.item5,
                  ].map((itemId, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 hover:scale-110 transition-all"
                    >
                      {itemId !== 0 && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`}
                          alt={`Item ${itemId}`}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                // Normal items
                <>
                  {[
                    playerData.item0,
                    playerData.item1,
                    playerData.item2,
                    playerData.item3,
                    playerData.item4,
                    playerData.item5,
                    playerData.item6,
                  ].map((itemId, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 hover:scale-110 transition-all"
                    >
                      {itemId !== 0 && (
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`}
                          alt={`Item ${itemId}`}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Arena Augments with Names and Icons */}
            {arena && (
              <div className="hidden xl:flex flex-col gap-1">
                <span className="text-xs text-zinc-400 mb-1">Augments</span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    playerData.playerAugment1,
                    playerData.playerAugment2,
                    playerData.playerAugment3,
                    playerData.playerAugment4,
                  ].filter(Boolean).map((augmentId, idx) => {
                    const augmentIcon = getArenaAugmentIcon(augmentId);
                    const augmentName = getArenaAugmentName(augmentId);
                    return (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded bg-purple-900/30 border border-purple-700 overflow-hidden hover:border-purple-500 hover:scale-110 transition-all"
                        title={augmentName}
                      >
                        {augmentIcon ? (
                          <img
                            src={augmentIcon}
                            alt={augmentName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to star icon if image fails
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-purple-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CS & Gold */}
            <div className="hidden xl:flex flex-col gap-1 text-right min-w-20">
              <span className="text-sm text-zinc-400">
                {playerData.totalMinionsKilled} CS
              </span>
              <span className="text-sm text-zinc-400">
                {(playerData.goldEarned / 1000).toFixed(1)}k Gold
              </span>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => toggleMatchExpansion(match.metadata.matchId)}
              className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-zinc-700/50 p-4 bg-zinc-900/30">
            {/* Arena Augments - Full Details */}
            {arena && (
              <div className="mb-6 p-4 bg-purple-950/20 border border-purple-900/30 rounded-lg">
                <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Arena Augments
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    playerData.playerAugment1,
                    playerData.playerAugment2,
                    playerData.playerAugment3,
                    playerData.playerAugment4,
                  ].filter(Boolean).map((augmentId, idx) => {
                    const augmentIcon = getArenaAugmentIcon(augmentId);
                    const augmentName = getArenaAugmentName(augmentId);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-purple-900/20 border border-purple-800/50 rounded-lg hover:bg-purple-900/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded bg-purple-900/30 border border-purple-700 overflow-hidden shrink-0">
                          {augmentIcon ? (
                            <img
                              src={augmentIcon}
                              alt={augmentName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-purple-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-purple-200 font-medium">{augmentName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div>
                <h3 className={`text-sm font-bold mb-3 ${team1[0]?.win ? 'text-emerald-400' : 'text-red-400'}`}>
                  {team1[0]?.win ? 'Victory' : 'Defeat'} - Team 1
                </h3>
                <div className="space-y-2">
                  {team1.map((participant) => (
                    <div 
                      key={participant.puuid}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                        participant.puuid === summonerData?.puuid 
                          ? 'bg-orange-950/30 border border-orange-900/30 hover:bg-orange-950/40 hover:border-orange-800' 
                          : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                          alt={participant.championName}
                          className="w-10 h-10 rounded hover:scale-110 transition-transform"
                        />
                        <div className="flex flex-col gap-0.5">
                          <div 
                            className="w-5 h-5 rounded border border-zinc-700 overflow-hidden"
                            title={getSummonerSpellName(participant.summoner1Id)}
                          >
                            <img
                              src={getSummonerSpellIcon(participant.summoner1Id)}
                              alt={getSummonerSpellName(participant.summoner1Id)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div 
                            className="w-5 h-5 rounded border border-zinc-700 overflow-hidden"
                            title={getSummonerSpellName(participant.summoner2Id)}
                          >
                            <img
                              src={getSummonerSpellIcon(participant.summoner2Id)}
                              alt={getSummonerSpellName(participant.summoner2Id)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {participant.riotIdGameName}#{participant.riotIdTagline}
                        </p>
                        <p className="text-xs text-zinc-400">{participant.championName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          {participant.kills}/{participant.deaths}/{participant.assists}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {participant.totalMinionsKilled} CS
                        </p>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-xs text-zinc-400">
                          {(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k DMG
                        </p>
                        <p className="text-xs text-zinc-500">
                          vision: {participant.visionScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team 2 */}
              <div>
                <h3 className={`text-sm font-bold mb-3 ${team2[0]?.win ? 'text-emerald-400' : 'text-red-400'}`}>
                  {team2[0]?.win ? 'Victory' : 'Defeat'} - Team 2
                </h3>
                <div className="space-y-2">
                  {team2.map((participant) => (
                    <div 
                      key={participant.puuid}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                        participant.puuid === summonerData?.puuid 
                          ? 'bg-orange-950/30 border border-orange-900/30 hover:bg-orange-950/40 hover:border-orange-800' 
                          : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <img
                          src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${participant.championName}.png`}
                          alt={participant.championName}
                          className="w-10 h-10 rounded hover:scale-110 transition-transform"
                        />
                        <div className="flex flex-col gap-0.5">
                          <div 
                            className="w-5 h-5 rounded border border-zinc-700 overflow-hidden"
                            title={getSummonerSpellName(participant.summoner1Id)}
                          >
                            <img
                              src={getSummonerSpellIcon(participant.summoner1Id)}
                              alt={getSummonerSpellName(participant.summoner1Id)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div 
                            className="w-5 h-5 rounded border border-zinc-700 overflow-hidden"
                            title={getSummonerSpellName(participant.summoner2Id)}
                          >
                            <img
                              src={getSummonerSpellIcon(participant.summoner2Id)}
                              alt={getSummonerSpellName(participant.summoner2Id)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {participant.riotIdGameName}#{participant.riotIdTagline}
                        </p>
                        <p className="text-xs text-zinc-400">{participant.championName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          {participant.kills}/{participant.deaths}/{participant.assists}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {participant.totalMinionsKilled} CS
                        </p>
                      </div>
                      <div className="text-right min-w-[60px]">
                        <p className="text-xs text-zinc-400">
                          {(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k DMG
                        </p>
                        <p className="text-xs text-zinc-500">
                          vision: {participant.visionScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform">
              <Anvil className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-orange-500 transition-colors">StatsForge</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-orange-500 hover:bg-zinc-900/50 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-zinc-400">Loading player data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 bg-red-950/30 border border-red-900/30 rounded-xl text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
              <p className="text-zinc-400 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
              >
                Search Another Player
              </Link>
            </div>
          </div>
        )}

        {/* Success State - Show Profile */}
        {!loading && !error && summonerData && (
          <>
            {/* Summoner Profile Section with Champion Splash Art Background */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 relative">
              {/* Champion Splash Art Background */}
              {highestMasterySplashArt && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${highestMasterySplashArt})`,
                    backgroundPosition: 'right 0% top 20%'
                  }}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/60"></div>
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-zinc-750"></div>
                </div>
              )}
              
              {/* Summoner Info Content */}
              <div className="relative z-10 p-8">
                <div className="flex items-center gap-6">
                  {/* Profile Icon */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-orange-600 shadow-2xl shadow-orange-900/50 hover:scale-105 hover:border-orange-500 transition-all">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summonerData.profileIconId}.png`}
                      alt="Profile Icon"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name and Level */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                        {summonerData.gameName}
                        <span className="text-zinc-400"> #{summonerData.tagLine}</span>
                      </h1>
                      <span className="px-2 py-1 bg-orange-950/80 border border-orange-600/50 rounded-lg text-orange-400 text-sm font-semibold uppercase backdrop-blur-sm">
                        {server}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
                        <Book className="w-5 h-5 text-orange-500" />
                        <span className="text-zinc-400 text-md">Level {summonerData.summonerLevel}</span>
                      </div>
                      {highestMasteryChampionName && (
                        <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
                          <span className="text-sm text-zinc-400">Main Champion: </span>
                          <span className="text-md font-semibold text-orange-500">{highestMasteryChampionName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ranked Stats - Display all competitive modes */}
            {rankedData.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-orange-500" />
                  Ranked Stats
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {rankedData.map((ranked) => {
                    const winRate = ((ranked.wins / (ranked.wins + ranked.losses)) * 100).toFixed(1);
                    return (
                      <div
                        key={ranked.queueType}
                        className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-orange-900/20 transition-all cursor-pointer"
                      >
                        <span className="text-sm text-zinc-400 mb-3 block text-right">
                            {ranked.hotStreak ? (
                              <>
                                Hot streak <FlameIcon className="w-5 h-5 inline-block text-orange-500" />
                              </>
                            ) : (
                              ""
                            )}
                          </span>

                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {/* Official Rank Icon */}
                            <img
                              src={getRankIcon(ranked.tier)}
                              alt={`${ranked.tier} ${ranked.rank}`}
                              className="w-16 h-16 object-contain"
                              onError={(e) => {
                                // Fallback to generic trophy icon if image fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                {getQueueTypeName(ranked.queueType)}
                              </h3>
                              <span className="text-xl font-bold text-white">
                                {ranked.tier} {ranked.rank}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-500">{ranked.leaguePoints} LP</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                          <div>
                            <p className="text-xs text-zinc-500 mb-1">Wins</p>
                            <p className="text-lg font-bold text-emerald-400">{ranked.wins}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 mb-1">Losses</p>
                            <p className="text-lg font-bold text-red-400">{ranked.losses}</p>
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 mb-1">Win Rate</p>
                            <p className="text-lg font-bold text-white">{winRate}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b border-zinc-800">
              <button
                onClick={() => setActiveTab("matches")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === "matches"
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Recent Matches
                {activeTab === "matches" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("mastery")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === "mastery"
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Champion Mastery
                {activeTab === "mastery" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            </div>

            {/* Matches Tab */}
            {activeTab === "matches" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Recent Matches
                </h2>
                
                {matchesLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading match history...</p>
                  </div>
                ) : matchHistory && matchHistory.matches.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {matchHistory.matches.map((match) => renderMatchCard(match))}
                    </div>
                    <div className="text-center">
                      <button
                        onClick={loadMoreMatches}
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
                  </>
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                    <p className="text-lg font-medium mb-2">No matches found</p>
                    <p className="text-sm">
                      This player hasn't played any recent games
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Champion Mastery Tab */}
            {activeTab === "mastery" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-orange-500" />
                  Champion Mastery
                </h2>
                
                {masteryLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading champion mastery...</p>
                  </div>
                ) : championMastery.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {championMastery.map((mastery) => {
                      const championName = getChampionNameById(mastery.championId);
                      return (
                        <div
                          key={mastery.championId}
                          className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-orange-900/50 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-orange-900/20 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`}
                              alt={championName}
                              className="w-12 h-12 rounded hover:scale-110 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/29.png`;
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{championName}</p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-orange-500 font-bold">
                                  Level {mastery.championLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-400">
                              {mastery.championPoints.toLocaleString()} points
                            </p>
                            {mastery.championLevel < 7 && (
                              <p className="text-xs text-zinc-500">
                                {mastery.championPointsUntilNextLevel.toLocaleString()} to next level
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-400">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                    <p className="text-lg font-medium mb-2">No mastery data</p>
                    <p className="text-sm">
                      This player hasn't earned champion mastery yet
                    </p>
                  </div>
                )}
              </div>
            )}

          <LolBanner />
          </>
        )}
      </main>
    </div>
  );
}