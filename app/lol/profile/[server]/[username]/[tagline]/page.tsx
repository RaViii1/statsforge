"use client";
import { Search, TrendingUp, Trophy, Target, Swords, Shield, Clock, ArrowLeft, Loader2, Anvil, CheckCircle, XCircle, ChevronDown, ChevronUp, Star, Book, FlameIcon, Crown } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getChampionNameById } from "@/lib/champion-data";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getArenaAugmentName, getArenaAugmentIcon } from "@/lib/arena-augments";
import { getRuneName, getRuneDescription, getRuneIcon, getRuneTreeName, getRuneTreeIcon, getRunesForTree, STAT_SHARDS_GRID } from "@/lib/runes";
import LolBanner from "@/Components/lolbaner";
import NavbarLol from "@/Components/navbarlol";
import { isRemake, isArena, formatGameDuration, formatTimestamp, getQueueName, getQueueTypeName, getRankIcon, formatCSDisplay } from "@/lib/lol/lolfunctions";

import { SummonerData, MatchHistory, ChampionMastery, RankedEntry, Match, MatchParticipant  } from "@/types/lolInterfaces";
import Footer from "@/Components/footer";
import ChampionStatsCard from "@/Components/ChampionStatsCard";


export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
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
  const [expandedMatchTab, setExpandedMatchTab] = useState<"teams" | "runes">("teams");
  
  // Use ref to track offset to avoid stale closure issues
  const offsetRef = useRef(0);

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
          setMatchHistory((prev: MatchHistory | null) => prev ? {
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
      }
    } catch (err) {
      console.error("Failed to fetch champion mastery:", err);
    } finally {
      setMasteryLoading(false);
    }
  };

  const loadMoreMatches = () => {
    if (summonerData && !loadingMore) {
      // Use current offset directly, don't update it here
      const currentOffset = offsetRef.current;
      
      // Fetch 10 more matches starting from current offset
      fetchMatchHistory(summonerData.puuid, currentOffset, 10, true);
    }
  };



  const getLPChange = (match: Match, playerData: MatchParticipant) => {
    // Only calculate for ranked games
    if (match.info.queueId !== 420 && match.info.queueId !== 440) {
      return null;
    }

    // Don't show LP for remakes
    if (isRemake(match)) {
      return null;
    }

    const queueType = match.info.queueId === 420 ? "RANKED_SOLO_5x5" : "RANKED_FLEX_SR";
    const rankedInfo = rankedData.find(r => r.queueType === queueType);
    
    if (!rankedInfo) return null;

    // Calculate performance score
    const kda = playerData.deaths === 0 ? 10 : (playerData.kills + playerData.assists) / playerData.deaths;
    const gameDurationMin = match.info.gameDuration / 60;
    const csPerMin = gameDurationMin > 0 ? (playerData.totalMinionsKilled + playerData.neutralMinionsKilled) / gameDurationMin : 0;
    
    // Performance multiplier (0.8 to 1.2)
    let performanceMultiplier = 1.0;
    if (playerData.win) {
      // Good performance increases LP gain
      if (kda > 5) performanceMultiplier += 0.1;
      if (csPerMin > 7) performanceMultiplier += 0.05;
      if (playerData.visionScore > 30) performanceMultiplier += 0.05;
    } else {
      // Good performance reduces LP loss
      if (kda > 3) performanceMultiplier -= 0.1;
      if (csPerMin > 7) performanceMultiplier -= 0.05;
    }

    const hotStreakMultiplier = rankedInfo.hotStreak ? 1.1 : 1.0;
    let baseLPChange = playerData.win ? 18 : -17;
    let lpChange = Math.round(baseLPChange * performanceMultiplier * hotStreakMultiplier);
    
    // Format output
    return playerData.win ? `+${lpChange} LP` : `${lpChange} LP`;
  };

  const toggleMatchExpansion = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
    // Reset to teams tab when expanding a new match
    if (expandedMatch !== matchId) {
      setExpandedMatchTab("teams");
    }
  };

  const handlePlayerClick = (gameName: string, tagLine: string) => {
    router.push(`/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
  };

  const renderMatchCard = (match: Match) => {
    const playerData = match.info.participants.find(
      (p : MatchParticipant) => p.puuid === summonerData?.puuid
    );

    if (!playerData) return null;

    const remake = isRemake(match);
    const arena = isArena(match.info.queueId);
    const isExpanded = expandedMatch === match.metadata.matchId;
    const lpChange = getLPChange(match, playerData);
    const csDisplay = formatCSDisplay(match, playerData);
    
    // Extract rune data
    const primaryStyle = playerData.perks?.styles?.[0];
    const secondaryStyle = playerData.perks?.styles?.[1];
    const primaryKeystone = primaryStyle?.selections?.[0]?.perk;
    const secondaryTree = secondaryStyle?.style;
    const statPerks = playerData.perks?.statPerks;
    
    // Get all selected runes for the player
    const selectedPrimaryRunes = primaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
    const selectedSecondaryRunes = secondaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
    const allSelectedRunes = [...selectedPrimaryRunes, ...selectedSecondaryRunes];
    const selectedStatPerksByRow = [
      statPerks?.offense ?? 0,  // Row 0
      statPerks?.flex ?? 0,     // Row 1
      statPerks?.defense ?? 0,  // Row 2
    ];
    
    // Calculate highest damage dealt and taken in the match
    const highestDamageDealt = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageDealtToChampions));
    const highestDamageTaken = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageTaken));
    
    const kda = playerData.deaths === 0 
      ? "Perfect" 
      : ((playerData.kills + playerData.assists) / playerData.deaths).toFixed(2);

    // Split teams
    const team1 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 100);
    const team2 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 200);

    return (
      <div
        key={match.metadata.matchId}
        className={`rounded-xl border transition-all ${
          remake 
            ? "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50"
            : playerData.win
            ? "bg-emerald-950/30 border-emerald-900/50 hover:border-emerald-800 hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-900/20"
            : "bg-red-950/30 border-red-900/50 hover:border-red-800 hover:bg-red-950/40 hover:shadow-lg hover:shadow-red-900/20"
        }`}
      >
        {/* Main Match Card */}
        <div className="p-4 cursor-pointer" onClick={() => toggleMatchExpansion(match.metadata.matchId)}>
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

              {/* Champion Icon with Summoner Spells and Runes */}
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 hover:border-orange-500 transition-all">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${playerData.championName}.png`}
                    alt={playerData.championName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Summoner Spells */}
                <div className="flex flex-col gap-1 mx-1">
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

                {/* Runes Display */}
                {!arena && primaryKeystone && secondaryTree && (
                  <div className="flex flex-col gap-1">
                    <div 
                      className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative"
                      title={`${getRuneName(primaryKeystone)}: ${getRuneDescription(primaryKeystone)}`}
                    >
                      <img
                        src={getRuneIcon(primaryKeystone)}
                        onError={(e) => {
                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                        }}
                        alt={getRuneName(primaryKeystone)}
                        className="w-5 h-5 object-contain"
                      />
                      {/* Tooltip */}
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-99 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
                        <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(primaryKeystone)}</p>
                        <p className="text-xs text-zinc-300">{getRuneDescription(primaryKeystone)}</p>
                      </div>
                    </div>
                    <div 
                      className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative"
                      title={getRuneTreeName(secondaryTree)}
                    >
                      <img
                        src={getRuneTreeIcon(secondaryTree)}
                        alt={getRuneTreeName(secondaryTree)}
                        className="w-4 h-4 object-contain"
                      />
                      {/* Tooltip */}
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-99999 p-2 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
                        <p className="text-sm font-bold text-orange-400">{getRuneTreeName(secondaryTree)}</p>
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="grid grid-cols-3 gap-1">
                  {[
                    playerData.playerAugment1,
                    playerData.playerAugment2,
                    playerData.playerAugment3,
                    playerData.playerAugment4,
                    playerData.playerAugment5,
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
                {csDisplay.totalCS} CS 
              </span>
    
              {csDisplay.csPerMin ? (
                csDisplay.showFlame ? (
                  <span className="flex items-center gap-1 justify-end">
                    <FlameIcon className="text-orange-400 w-4 h-4" />
                    <span className="text-sm text-zinc-400">{csDisplay.csPerMin} CS/min</span>
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">{csDisplay.csPerMin} CS/min</span>
                )
              ) : (
                <span className="text-sm text-zinc-500">-</span>
              )}
            </div>

            {/* Expand Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMatchExpansion(match.metadata.matchId);
              }}
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
          <div className="border-t border-zinc-700/50 bg-zinc-900/30 overflow-visible">
            {/* Tab Navigation */}
            <div className="flex gap-2 px-4 pt-4 border-b border-zinc-700/50">
              <button
                onClick={() => setExpandedMatchTab("teams")}
                className={`px-4 py-2 font-semibold transition-all relative rounded-t-lg ${
                  expandedMatchTab === "teams"
                    ? "text-orange-500 bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                }`}
              >
                Match Details
              </button>
              {!arena && (
              <button
                onClick={() => setExpandedMatchTab("runes")}
                className={`px-4 py-2 font-semibold transition-all relative rounded-t-lg ${
                  expandedMatchTab === "runes"
                    ? "text-orange-500 bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                }`}
              >
                Runes
              </button>
              )}
            </div>

            <div className="p-4 overflow-visible">
              {/* Teams Tab */}
              {expandedMatchTab === "teams" && (
                <>
                  {/* Arena Augments - Full Details */}
                  {arena && (
                    <div className="mb-6 p-4 bg-purple-950/20 border border-purple-900/30 rounded-lg">
                      <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Arena Augments
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {[
                          playerData.playerAugment1,
                          playerData.playerAugment2,
                          playerData.playerAugment3,
                          playerData.playerAugment4,
                          playerData.playerAugment5,
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
                    <div className="overflow-visible">
                      <h3 className={`text-sm font-bold mb-3 ${team1[0]?.win ? 'text-emerald-400' : 'text-red-400'}`}>
                        {team1[0]?.win ? 'Victory' : 'Defeat'} - Team 1
                      </h3>
                      <div className="space-y-2 overflow-visible">
                        {team1.map((participant : any) => {
                          const participantCSDisplay = formatCSDisplay(match, participant);
                          const participantPrimaryKeystone = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
                          const participantSecondaryTree = participant.perks?.styles?.[1]?.style;
                          const damageDealtPercent = (participant.totalDamageDealtToChampions / highestDamageDealt) * 100;
                          const damageTakenPercent = (participant.totalDamageTaken / highestDamageTaken) * 100;
                          
                          return (
                            <div 
                              key={participant.puuid}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-all overflow-visible ${
                                participant.puuid === summonerData?.puuid 
                                  ? 'bg-orange-950/30 border border-orange-900/30 hover:bg-orange-950/40 hover:border-orange-800' 
                                  : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center gap-1 overflow-visible">
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
                                { !arena && participantPrimaryKeystone && (
                                  <div className="flex flex-col gap-0.5 overflow-visible">
                                    <div 
                                      className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-visible flex items-center justify-center group relative"
                                      title={getRuneName(participantPrimaryKeystone)}
                                    >
                                      <img
                                        src={getRuneIcon(participantPrimaryKeystone)}
                                        onError={(e) => {
                                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                                        }}
                                        alt={getRuneName(participantPrimaryKeystone)}
                                        className="w-4 h-4 object-contain"
                                      />
                                      
                                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                                        <p className="text-xs font-bold text-orange-400 mb-1">{getRuneName(participantPrimaryKeystone)}</p>
                                        <p className="text-xs text-zinc-300">{getRuneDescription(participantPrimaryKeystone)}</p>
                                      </div>
                                    </div>
                                    {participantSecondaryTree && (
                                      <div 
                                        className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center"
                                        title={getRuneTreeName(participantSecondaryTree)}
                                      >
                                        <img
                                          src={getRuneTreeIcon(participantSecondaryTree)}
                                          alt={getRuneTreeName(participantSecondaryTree)}
                                          className="w-3 h-3 object-contain"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => handlePlayerClick(participant.riotIdGameName, participant.riotIdTagline)}
                                  className="text-sm font-medium text-white truncate hover:text-orange-500 transition-colors cursor-pointer text-left w-full"
                                >
                                  {participant.riotIdGameName}#{participant.riotIdTagline}
                                </button>
                                <p className="text-xs text-zinc-400">{participant.championName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">
                                  {participant.kills}/{participant.deaths}/{participant.assists}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {participantCSDisplay.totalCS} CS
                                </p>
                                {participantCSDisplay.csPerMin ? (
                                  participantCSDisplay.showFlame ? (
                                    <span className="flex items-center justify-end gap-1">
                                      <FlameIcon size={14} className="text-orange-400" />
                                      <span className="text-xs text-zinc-400">{participantCSDisplay.csPerMin} CS/min</span>
                                    </span>
                                  ) : (
                                    <span className="text-xs text-zinc-400">{participantCSDisplay.csPerMin} CS/min</span>
                                  )
                                ) : (
                                  <span className="text-xs text-zinc-500">-</span>
                                )}
                              </div>
                              <div className="text-right min-w-20">
                                {/* Damage Dealt Visualization */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-end gap-1 mb-0.5">
                                    <Swords className="w-3 h-3 text-red-400" />
                                    <p className="text-xs text-zinc-400">
                                      {(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k
                                    </p>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-linear-to-r from-red-500 to-red-800 rounded-full transition-all"
                                      style={{ width: `${damageDealtPercent}%` }}
                                    />
                                  </div>
                                </div>
                                
                                {/* Damage Taken Visualization */}
                                <div>
                                  <div className="flex items-center justify-end gap-1 mb-0.5">
                                    <Shield className="w-3 h-3 text-orange-400" />
                                    <p className="text-xs text-zinc-400">
                                      {(participant.totalDamageTaken / 1000).toFixed(1)}k
                                    </p>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-linear-to-r from-orange-600 to-orange-500 rounded-full transition-all"
                                      style={{ width: `${damageTakenPercent}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <p className="text-xs text-zinc-500 mt-1">
                                  vision: {participant.visionScore}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className="overflow-visible">
                      <h3 className={`text-sm font-bold mb-3 ${team2[0]?.win ? 'text-emerald-400' : 'text-red-400'}`}>
                        {team2[0]?.win ? 'Victory' : 'Defeat'} - Team 2
                      </h3>
                      <div className="space-y-2 overflow-visible">
                        {team2.map((participant : any) => {
                          const participantCSDisplay = formatCSDisplay(match, participant);
                          const participantPrimaryKeystone = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
                          const participantSecondaryTree = participant.perks?.styles?.[1]?.style;
                          const damageDealtPercent = (participant.totalDamageDealtToChampions / highestDamageDealt) * 100;
                          const damageTakenPercent = (participant.totalDamageTaken / highestDamageTaken) * 100;
                          

                          return (
                            <div 
                              key={participant.puuid}
                              className={`flex items-center gap-3 p-2 rounded-lg transition-all overflow-visible ${
                                participant.puuid === summonerData?.puuid 
                                  ? 'bg-orange-950/30 border border-orange-900/30 hover:bg-orange-950/40 hover:border-orange-800' 
                                  : 'bg-zinc-800/30 hover:bg-zinc-800/50 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-center gap-1 overflow-visible">
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
                                { !arena && participantPrimaryKeystone && (
                                  <div className="flex flex-col gap-0.5 overflow-visible">
                                    <div 
                                      className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-visible flex items-center justify-center group relative"
                                      title={getRuneName(participantPrimaryKeystone)}
                                    >
                                      <img
                                        src={getRuneIcon(participantPrimaryKeystone)}
                                        onError={(e) => {
                                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                                        }}
                                        alt={getRuneName(participantPrimaryKeystone)}
                                        className="w-4 h-4 object-contain"
                                      />
                                      {/* Tooltip */}
                                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                                        <p className="text-xs font-bold text-orange-400 mb-1">{getRuneName(participantPrimaryKeystone)}</p>
                                        <p className="text-xs text-zinc-300">{getRuneDescription(participantPrimaryKeystone)}</p>
                                      </div>
                                    </div>
                                    {participantSecondaryTree && (
                                      <div 
                                        className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center"
                                        title={getRuneTreeName(participantSecondaryTree)}
                                      >
                                        <img
                                          src={getRuneTreeIcon(participantSecondaryTree)}
                                          alt={getRuneTreeName(participantSecondaryTree)}
                                          className="w-3 h-3 object-contain"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => handlePlayerClick(participant.riotIdGameName, participant.riotIdTagline)}
                                  className="text-sm font-medium text-white truncate hover:text-orange-500 transition-colors cursor-pointer text-left w-full"
                                >
                                  {participant.riotIdGameName}#{participant.riotIdTagline}
                                </button>
                                <p className="text-xs text-zinc-400">{participant.championName}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-white">
                                  {participant.kills}/{participant.deaths}/{participant.assists}
                                </p>
                                <p className="text-xs text-zinc-400">
                                  {participantCSDisplay.totalCS} CS
                                </p>
                                {participantCSDisplay.csPerMin ? (
                                  participantCSDisplay.showFlame ? (
                                    <span className="flex items-center justify-end gap-1">
                                      <FlameIcon size={14} className="text-orange-400" />
                                      <span className="text-xs text-zinc-400">{participantCSDisplay.csPerMin} CS/min</span>
                                    </span>
                                  ) : (
                                    <span className="text-xs text-zinc-400">{participantCSDisplay.csPerMin} CS/min</span>
                                  )
                                ) : (
                                  <span className="text-xs text-zinc-500">-</span>
                                )}
                              </div>
                              <div className="text-right min-w-20">
                                {/* Damage Dealt Visualization */}
                                <div className="mb-2">
                                  <div className="flex items-center justify-end gap-1 mb-0.5">
                                    <Swords className="w-3 h-3 text-red-400" />
                                    <p className="text-xs text-zinc-400">
                                      {(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k
                                    </p>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-linear-to-r from-red-500 to-red-800 rounded-full transition-all"
                                      style={{ width: `${damageDealtPercent}%` }}
                                    />
                                  </div>
                                </div>
                                
                                {/* Damage Taken Visualization */}
                                <div>
                                  <div className="flex items-center justify-end gap-1 mb-0.5">
                                    <Shield className="w-3 h-3 text-orange-400" />
                                    <p className="text-xs text-zinc-400">
                                      {(participant.totalDamageTaken / 1000).toFixed(1)}k
                                    </p>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-700/50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-linear-to-r from-orange-600 to-orange-500 rounded-full transition-all"
                                      style={{ width: `${damageTakenPercent}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <p className="text-xs text-zinc-500 mt-1">
                                  vision: {participant.visionScore}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Runes Tab */}
              { !arena && expandedMatchTab === "runes" && primaryStyle && secondaryStyle && (
                <div className="overflow-visible flex md:flex-row flex-col items-center md:items-stretch md:justify-evenly gap-6">

                  {/* Primary Rune Tree */}
                  <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-visible min-w-1/3 max-w-1/2 h-max">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={getRuneTreeIcon(primaryStyle.style)}
                        alt={getRuneTreeName(primaryStyle.style)}
                        className="w-8 h-8 object-contain"
                      />
                      <h4 className="text-lg font-bold text-orange-400">
                        {getRuneTreeName(primaryStyle.style)} (Primary)
                      </h4>
                    </div>
                    <div className="grid gap-6 overflow-visible">
                      {getRunesForTree(primaryStyle.style).map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center justify-center gap-4 overflow-visible">
                          {row.map((runeId) => {
                            const isSelected = allSelectedRunes.includes(runeId);
                            return (
                              <div
                                key={runeId}
                                className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 transition-all overflow-visible hover:z-100000 ${
                                  isSelected
                                    ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/50 scale-110'
                                    : 'border-2 border-zinc-700 opacity-40 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={getRuneIcon(runeId)}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                                  }}
                                  alt={getRuneName(runeId)}
                                  className={rowIdx === 0 ? "w-10 h-10 object-contain" : "w-8 h-8 object-contain"}
                                />
                                {/* Tooltip - Fixed positioning */}
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                                  <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(runeId)}</p>
                                  <p className="text-xs text-zinc-300">{getRuneDescription(runeId)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Rune Tree */}
                  <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-visible  min-w-1/3 max-w-1/2">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={getRuneTreeIcon(secondaryStyle.style)}
                        alt={getRuneTreeName(secondaryStyle.style)}
                        className="w-8 h-8 object-contain"
                      />
                      <h4 className="text-lg font-bold text-orange-400">
                        {getRuneTreeName(secondaryStyle.style)} (Secondary)
                      </h4>
                    </div>
                    <div className="grid gap-6 overflow-visible">
                      {getRunesForTree(secondaryStyle.style).slice(1).map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center justify-center gap-4 overflow-visible">
                          {row.map((runeId) => {
                            const isSelected = allSelectedRunes.includes(runeId);
                            return (
                              <div
                                key={runeId}
                                className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 transition-all overflow-visible hover:z-99 ${
                                  isSelected
                                    ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/50 scale-110'
                                    : 'border-2 border-zinc-700 opacity-40 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={getRuneIcon(runeId)}
                                    onError={(e) => {
                                      e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                                    }}
                                  
                                  alt={getRuneName(runeId)}
                                  className="w-8 h-8 object-contain"
                                />
                                

                                {/* Tooltip - Fixed positioning */}
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                                  <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(runeId)}</p>
                                  <p className="text-xs text-zinc-300">{getRuneDescription(runeId)}</p>
                                </div>
                              </div>
                            );

                          })}
                        </div>
                        
                      ))}
                    </div>
                    {/* Bonus runes - FIXED: Check by row position */}
                    <div className="mt-6 pt-6 border-t border-zinc-700 z-10">
                      <div className="space-y-2">
                        {STAT_SHARDS_GRID.map((row, rowIdx) => (
                          <div key={rowIdx} className="flex justify-center gap-6">
                            {row.map((shardId) => {
                              // FIXED: Check if this shard matches the selected shard for this row
                              const isSelected = selectedStatPerksByRow[rowIdx] === shardId;
                              return (
                                <div
                                  key={shardId}
                                  className={`group relative w-8 h-8 rounded flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-2 border-orange-500 bg-orange-950/30 scale-105 z-10'
                                      : 'border border-zinc-700 bg-zinc-900 opacity-40 hover:opacity-100 z-10'
                                  }`}
                                >
                                  <img
                                    src={getRuneIcon(shardId)}
                                    onError={(e) => {
                                      e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                                    }}
                                    alt={getRuneName(shardId)}
                                    className="w-5 h-5 object-contain"
                                  />
                                  {/* Tooltip */}
                                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                                    <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(shardId)}</p>
                                    <p className="text-xs text-zinc-300">{getRuneDescription(shardId)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
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
        <NavbarLol />

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
                  <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/40"></div>
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
                {<ChampionStatsCard server={server} puuid={summonerData.puuid}></ChampionStatsCard>}
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
                      {matchHistory.matches.map((match: Match) => renderMatchCard(match))}
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
      <Footer />
      </div>
  );
}