"use client";

import { useState, useEffect, useRef } from "react";
import { Swords, Shield, FlameIcon, Star, Flag, Trophy, Coins, CoinsIcon, BarChart3, Sparkles, Users, ExternalLink } from "lucide-react";
import { Match, MatchParticipant, RankedEntry } from "@/app/types/lolInterfaces";
import { 
  isArena, 
  formatCSDisplay,
  getTeamIcon, 
  getArenaTeamName,
  isRemake,
  getChampionImage
} from "@/lib/lol/lolfunctions";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneName, getRuneDescription, getRuneIcon, getRuneTreeName, getRuneTreeIcon } from "@/lib/runes";
import { getArenaAugmentName, getArenaAugmentIcon } from "@/lib/arena-augments";
import { getItemImage, getItemDescription } from "@/lib/items";
import { MatchRunesTab } from "@/components/lol/MatchRunesTab";
import { MatchPerformanceTab } from "@/components/lol/MatchPerformanceTab";
import { RankedIcon } from "@/components/lol/RankedIcon";
import SvgIcon from "../SvgIcon";

interface MatchDetailsTabProps {
  match: Match;
  summonerPuuid: string;
  playerData: MatchParticipant;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

type TabType = "details" | "performance" | "runes";

export function MatchDetailsTab({ match, summonerPuuid, playerData, onPlayerClick }: MatchDetailsTabProps) {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [rankedDataMap, setRankedDataMap] = useState<Record<string, RankedEntry | null>>({});
  const [isLoadingRanked, setIsLoadingRanked] = useState(true);
  const fetchedMatchIdRef = useRef<string | null>(null);
  const arena = isArena(match.info.queueId);
  const remake = isRemake(match);
  
  // Calculate highest damage dealt and taken in the match
  const highestDamageDealt = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageDealtToChampions));
  const highestDamageTaken = Math.max(...match.info.participants.map((p: MatchParticipant) => p.totalDamageTaken));

  // Split teams
  const team1 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 100);
  const team2 = match.info.participants.filter((p: MatchParticipant) => p.teamId === 200);
  

  // Arena teams - group by playerSubteamId and sort by subteamPlacement
  const arenaTeams: { [key: number]: MatchParticipant[] } = {};
  if (arena) {
    match.info.participants.forEach((p: MatchParticipant) => {
      if (p.playerSubteamId !== undefined) {
        if (!arenaTeams[p.playerSubteamId]) {
          arenaTeams[p.playerSubteamId] = [];
        }
        arenaTeams[p.playerSubteamId].push(p);
      }
    });
  }

  // Extract rune data for runes tab
  const primaryStyle = playerData.perks?.styles?.[0];
  const secondaryStyle = playerData.perks?.styles?.[1];

  // Extract server from match metadata (format: SERVER_matchId)
  const server = match.metadata.matchId.split('_')[0].toLowerCase();
  const matchId = match.metadata.matchId;

  // Fetch all ranked data in parallel once
  useEffect(() => {
    // Prevent duplicate fetches for the same match
    if (fetchedMatchIdRef.current === match.metadata.matchId) {
      return;
    }
    
    const abortController = new AbortController();
    
    const fetchAllRankedData = async () => {
      setIsLoadingRanked(true);
      
      const uniquePuuids = [...new Set(match.info.participants.map((p: MatchParticipant) => p.puuid))];
      
      try {
        // Fetch all ranked data in parallel
        const results = await Promise.allSettled(
          uniquePuuids.map(async (puuid) => {
            const response = await fetch(`/api/lol/ranked/${server}/${puuid}`, {
              signal: abortController.signal
            });
            if (response.ok) {
              const data = await response.json();
              const soloRanked = data.rankedData?.find(
                (r: RankedEntry) => r.queueType === "RANKED_SOLO_5x5"
              );
              return { puuid, data: soloRanked || null };
            }
            return { puuid, data: null };
          })
        );

        // Build map of puuid -> ranked data
        const map: Record<string, RankedEntry | null> = {};
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            map[result.value.puuid] = result.value.data;
          }
        });
        
        if (!abortController.signal.aborted) {
          setRankedDataMap(map);
          // Only mark as fetched after successful completion
          fetchedMatchIdRef.current = match.metadata.matchId;
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch ranked data:", err);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingRanked(false);
        }
      }
    };

    fetchAllRankedData();

    return () => {
      abortController.abort();
    };
  }, [match.metadata.matchId, server]);

  // Handler to open match analytics in new tab
  const handleOpenMatchAnalytics = () => {
    const url = `/lol/match/${server}/${matchId}?puuid=${summonerPuuid}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const tabs = [
    { id: "details" as TabType, label: "Match Details", icon: Users },
    { id: "performance" as TabType, label: "Performance", icon: BarChart3 },
    { id: "runes" as TabType, label: "Runes", icon: Sparkles },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Tabs and Match Analytics Button */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-zinc-800 pb-0">
        {/* Flat Tab Navigation with Bottom Border */}
        <div className="inline-flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            // Hide runes tab for arena games
            if (arena && tab.id === "runes") return null;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap transition-all
                  border-b-2
                  ${isActive 
                    ? 'text-orange-500 border-orange-500' 
                    : 'text-zinc-400 border-transparent hover:text-zinc-200 hover:border-zinc-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === 'details' ? 'Details' : 'Runes'}
                </span>
              </button>
            );
          })}
        </div>

        {!arena && (
          <button
            onClick={handleOpenMatchAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 font-medium text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Match Analytics</span>
            <span className="sm:hidden">Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {/* Match Details Tab */}
        {activeTab === "details" && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            {renderMatchDetails()}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            <MatchPerformanceTab
              match={match}
              summonerPuuid={summonerPuuid}
            />
          </div>
        )}

        {/* Runes Tab */}
        {activeTab === "runes" && !arena && primaryStyle && secondaryStyle && (
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            <MatchRunesTab
              primaryStyle={primaryStyle}
              secondaryStyle={secondaryStyle}
              statPerks={playerData.perks?.statPerks}
            />
          </div>
        )}
      </div>
    </div>
  );

  function renderMatchDetails() {
    if (arena && Object.keys(arenaTeams).length > 0) {
      return (
        <>
          {/* Arena Augments - Enhanced Display */}
          <div className="p-6">
            <h4 className="text-base font-bold text-purple-200 mb-4 flex items-center gap-2.5">
              {playerData.riotIdGameName}'s Arena Augments
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
                    className="group relative flex flex-col items-center gap-2.5 p-3.5 bg-purple-950/40 border border-purple-800/60 rounded-xl hover:bg-purple-900/50 hover:border-purple-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-purple-900/40"
                  >
                    <div className="w-14 h-14 rounded-lg bg-purple-900/50 border border-purple-700 overflow-hidden shrink-0 group-hover:border-purple-500 transition-colors shadow-sm">
                      {augmentIcon ? (
                        <img
                          src={augmentIcon}
                          alt={augmentName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Star className="w-7 h-7 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center text-purple-200 font-medium leading-tight line-clamp-2">{augmentName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arena Teams Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(arenaTeams)
              .sort(([, aPlayers], [, bPlayers]) => {
                const aPlacement = aPlayers[0]?.subteamPlacement ?? 99;
                const bPlacement = bPlayers[0]?.subteamPlacement ?? 99;
                return aPlacement - bPlacement;
              })
              .map(([subteamId, players]) => {
                const teamWon = players[0]?.win;
                const placement = players[0]?.subteamPlacement ?? Number(subteamId);
                const teamIconUrl = getTeamIcon(Number(subteamId));
                
                return (
                  <div
                    key={subteamId}
                    className="space-y-3"
                  >
                    {/* Team Header - Flat Design */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg overflow-hidden">
                          <img
                            src={teamIconUrl}
                            alt={`Team ${subteamId}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = getTeamIcon(Number(subteamId));
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white">
                          Team {subteamId}
                        </span>
                        {teamWon && (
                          <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                            Won
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-zinc-400 font-medium">
                        Place #{placement}
                      </span>
                    </div>

                    {/* Players List - No Container Border */}
                    <div className="space-y-2">
                      {players.map((participant) => {
                        const isPlayer = participant.puuid === summonerPuuid;
                        
                        const augmentIds = [
                          participant.playerAugment1,
                          participant.playerAugment2,
                          participant.playerAugment3,
                          participant.playerAugment4,
                          participant.playerAugment5,
                        ];
                        const itemIds = [
                          participant.item0,
                          participant.item1,
                          participant.item2,
                          participant.item3,
                          participant.item4,
                          participant.item5,
                        ];
                        const normalizedItems = itemIds.map(id => id === 0 ? null : id);

                        return (
                          <div
                            key={participant.puuid}
                            className={`p-3 transition-all duration-200 ${
                              isPlayer
                                ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-l-2 border-orange-500' 
                                : 'hover:bg-zinc-800/30'
                            }`}
                          >
                            {/* Player Header */}
                            <div className="flex items-center gap-3 mb-3 pb-2 border-b border-zinc-700/30">
                              <div className="relative group">
                                <span className="text-[10px] text-white absolute bottom-0.5 left-0.5 bg-zinc-900/90 rounded px-1 py-0.5 font-bold shadow-sm">{participant.champLevel}</span>
                                <img
                                  src={getChampionImage(participant.championId.toString())}
                                  alt={participant.championName}
                                  className="w-14 h-14 rounded-lg border-2 border-zinc-600 shrink-0 shadow-md"
                                  onError={(e) => {
                                    e.currentTarget.src = "images/nochampionimage.jpg";
                                  }}
                                />
                              </div>
                              
                              <div className="flex flex-col gap-1 shrink-0">
                                {[participant.summoner1Id, participant.summoner2Id].map((spellId, idx) => (
                                  <div 
                                    key={idx} 
                                    className="group relative w-6 h-6 rounded border border-zinc-600 overflow-hidden hover:border-orange-500 transition-colors shadow-sm"
                                    title={getSummonerSpellName(spellId)}
                                  >
                                    <img
                                      src={getSummonerSpellIcon(spellId)}
                                      alt={getSummonerSpellName(spellId)}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => onPlayerClick(participant.riotIdGameName, participant.riotIdTagline)}
                                  className="text-sm font-bold text-white truncate hover:text-orange-400 transition-colors cursor-pointer text-left w-full mb-1"
                                  title={`${participant.riotIdGameName}`}
                                >
                                  {participant.riotIdGameName}
                                </button>
                                <p className="text-sm font-semibold">
                                  <span className="text-green-400">{participant.kills}</span>
                                  <span className="text-zinc-500"> / </span>
                                  <span className="text-red-400">{participant.deaths}</span>
                                  <span className="text-zinc-500"> / </span>
                                  <span className="text-blue-400">{participant.assists}</span>
                                </p>
                              </div>
                            </div>

                            {/* Augments & Items Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Augments */}
                              <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                  <p className="text-xs font-bold text-white uppercase tracking-wide">Augments</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {augmentIds.map((augmentId, idx) => {
                                    const augmentIcon = getArenaAugmentIcon(augmentId);
                                    const augmentName = getArenaAugmentName(augmentId);
                                    const hasAugment = augmentId && augmentId !== 0;

                                    return (
                                      <div
                                        key={`augment-${idx}`}
                                        className={`group relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 shadow-sm ${
                                          hasAugment
                                            ? 'bg-purple-900/50 border border-purple-700 hover:border-purple-400 hover:scale-110 hover:shadow-purple-500/30'
                                            : 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                                        }`}
                                        title={hasAugment ? augmentName : 'Empty Augment Slot'}
                                      >
                                        {hasAugment && augmentIcon ? (
                                          <img
                                            src={augmentIcon}
                                            alt={augmentName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                              e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-purple-400 text-sm font-bold">A</div>';
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                            <span className="text-xs">?</span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Items */}
                              <div>
                                <div className="flex items-center gap-2 mb-2.5">
                                  <p className="text-xs font-bold text-white uppercase tracking-wide">Items</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {normalizedItems.map((itemId, idx) => {
                                    const isEmpty = !itemId;
                                    const itemName = itemId ? getItemDescription(itemId.toString()) : 'Empty Item Slot';

                                    return (
                                      <div
                                        key={`item-${idx}`}
                                        className={`group relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 shadow-sm ${
                                          isEmpty
                                            ? 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                                            : 'bg-zinc-700 border border-zinc-600 hover:border-orange-500 hover:scale-110 hover:shadow-orange-500/30'
                                        }`}
                                        title={itemName}
                                      >
                                        {itemId && (
                                          <img
                                            src={getItemImage(itemId.toString())}
                                            alt={itemName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "images/nochampionimage.jpg";
                                            }}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Trinket */}
                                  <div 
                                    className={`group relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-200 shadow-sm ${
                                      participant.item6 && participant.item6 !== 0
                                        ? 'bg-zinc-700 border border-amber-600 hover:border-amber-400 hover:scale-110 hover:shadow-amber-500/30'
                                        : 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                                    }`}
                                    title={participant.item6 && participant.item6 !== 0 ? `Trinket: ${getItemDescription(participant.item6.toString())}` : 'Empty Trinket Slot'}
                                  >
                                    {participant.item6 && participant.item6 !== 0 && (
                                      <img
                                        src={getItemImage(participant.item6.toString())}
                                        alt={`Trinket ${participant.item6}`}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { team: team1, name: "Blue Team", color: "white" },
          { team: team2, name: "Red Team", color: "white" }
        ].map(({ team, name, color }) => (
          <div key={name} className="space-y-2">
             {/* Team Header*/}
            <div className="px-4 py-3 border-b border-zinc-800 bg-gradient-to-t from-zinc-900/40 to-transparent">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold uppercase tracking-tight ${
                    color === 'white' ? 'text-white' : 'text-red-400'
                  }`}>
                    {name}
                  </span>
                  <span className={`text-xs font-semibold uppercase tracking-tight ${
                    team[0]?.win 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    {team[0]?.win ? 'Won' : 'Lost'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-zinc-400 font-medium gap-1.5 flex-wrap">
                <div className="flex items-center">
                  <span>{team.reduce((sum, p) => sum + p.kills, 0)}/</span>
                  <span>{team.reduce((sum, p) => sum + p.deaths, 0)}/</span>
                  <span>{team.reduce((sum, p) => sum + p.assists, 0)}</span>
                </div>
                <div className="w-px h-4 bg-zinc-700 mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-0.5" title="Team gold earned">
                  <SvgIcon size={14} type="gold" className="text-zinc-400" />
                  <span>{(team.reduce((sum, p) => sum + p.goldEarned, 0) / 1000).toFixed(1)}k</span>
                </div>
                <div className="w-px h-4 bg-zinc-700 mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-0.5" title="Turrets destroyed">
                  <SvgIcon size={14} type="tower" className="text-zinc-400" />
                  <span>{team.reduce((sum, p) => sum + (p.turretKills || 0), 0)}</span>
                </div>
                <div className="flex items-center gap-0.5" title="Inhibitors destroyed">
                  <SvgIcon size={14} type="mr" className="text-zinc-400" />
                  <span>{team.reduce((sum, p) => sum + (p.inhibitorKills || 0), 0)}</span>
                </div>
                <div className="flex items-center gap-0.5" title="Dragon kills">
                  <SvgIcon size={14} type="dragon" className="text-zinc-400" />
                  <span>{team.reduce((sum, p) => sum + (p.dragonKills || 0), 0)}</span>
                </div>
                <div className="flex items-center gap-0.5"  title="Baron Nashor kills">
                  <SvgIcon size={14} type="baron" className="text-zinc-400" />
                  <span>{team.reduce((sum, p) => sum + (p.baronKills || 0), 0)}</span>
                </div>

              </div>
            </div>
            
            {/* Players List - No container borders */}
            <div className="space-y-2">
              {team.map((participant: any) => {
                const participantCSDisplay = formatCSDisplay(match, participant);
                const participantPrimaryKeystone = participant.perks?.styles?.[0]?.selections?.[0]?.perk;
                const participantSecondaryTree = participant.perks?.styles?.[1]?.style;
                const damageDealtPercent = (participant.totalDamageDealtToChampions / highestDamageDealt) * 100;
                const damageTakenPercent = (participant.totalDamageTaken / highestDamageTaken) * 100;
                const itemIds = [
                  participant.item0,
                  participant.item1,
                  participant.item2,
                  participant.item3,
                  participant.item4,
                  participant.item5,
                ];
                const isPlayer = participant.puuid === summonerPuuid;
                
                return (
                  <div className="border-b border-zinc-800" key={participant.puuid}>
                  <div 
                    key={participant.puuid}
                    className={`p-3 transition-all duration-300 relative group ${
                      isPlayer
                        ? name === 'Blue Team' ? 'border-l-2 border-orange-500 bg-gradient-to-r from-orange-500/5 to-transparent' : 'border-r-2 border-orange-500 bg-gradient-to-l from-orange-500/5 to-transparent'
                        : ''
                    }`}
                  >
                    {/* Hover gradient effect - left to right for blue team, right to left for red team */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      name === 'Blue Team'
                        ? 'bg-gradient-to-r from-orange-500/10 to-transparent' 
                        : 'bg-gradient-to-l from-orange-500/10 to-transparent'
                    }`}></div>
                    
                    <div className="relative flex flex-col gap-3">
                      {/* Top Row: Champion + Spells + Runes + Player Info + Stats (including gold) */}
                      <div className="flex items-center gap-2.5">
                        {/* Champion + Spells + Runes */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <div className="relative group">
                            <span className="text-[10px] text-white absolute bottom-0.5 left-0.5 bg-zinc-900/90 rounded px-1 py-0.5 font-bold shadow-sm z-10">
                              {participant.champLevel}
                            </span>
                            <img
                              src={getChampionImage(participant.championId.toString() || "images/nochampionimage.jpg")}
                              alt={participant.championName}
                              className="w-12 h-12 rounded-lg border border-zinc-600 group-hover:border-orange-500 shadow-md transition-all"
                              title={participant.championName}
                              onError={(e) => {
                                e.currentTarget.src = "images/nochampionimage.jpg";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="w-5 h-5 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-colors shadow-sm" title={getSummonerSpellName(participant.summoner1Id)}>
                              <img src={getSummonerSpellIcon(participant.summoner1Id)} alt={getSummonerSpellName(participant.summoner1Id)} className="w-full h-full object-cover" />
                            </div>
                            <div className="w-5 h-5 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-colors shadow-sm" title={getSummonerSpellName(participant.summoner2Id)}>
                              <img src={getSummonerSpellIcon(participant.summoner2Id)} alt={getSummonerSpellName(participant.summoner2Id)} className="w-full h-full object-cover" />
                            </div>
                          </div>
                          {!arena && participantPrimaryKeystone && (
                            <div className="flex flex-col gap-0.5">
                              <div 
                                className="w-6 h-6 flex items-center justify-center relative " 
                                title={getRuneName(participantPrimaryKeystone)}
                                onMouseEnter={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.rune-tooltip');
                                  if (tooltip) {
                                    tooltip.classList.remove('opacity-0', 'invisible');
                                    tooltip.classList.add('opacity-100', 'visible');
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  const tooltip = e.currentTarget.querySelector('.rune-tooltip');
                                  if (tooltip) {
                                    tooltip.classList.remove('opacity-100', 'visible');
                                    tooltip.classList.add('opacity-0', 'invisible');
                                  }
                                }}
                              >
                                <img src={getRuneIcon(participantPrimaryKeystone)} onError={(e) => { e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png"; }} alt={getRuneName(participantPrimaryKeystone)} className="w-4 h-4 object-contain" />
                                <div className="rune-tooltip absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible transition-opacity duration-200 z-50 w-64 p-3 bg-zinc-900 border border-orange-500/60 rounded-lg shadow-2xl pointer-events-none">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    <p className="text-xs font-black text-white uppercase tracking-wider">{getRuneName(participantPrimaryKeystone)}</p>
                                  </div>
                                  <p className="text-xs text-zinc-300 leading-relaxed">{getRuneDescription(participantPrimaryKeystone)}</p>
                                </div>
                              </div>
                              {participantSecondaryTree && (
                                <div className="w-6 h-6 flex items-center justify-center" title={getRuneTreeName(participantSecondaryTree)}>
                                  <img src={getRuneTreeIcon(participantSecondaryTree)} alt={getRuneTreeName(participantSecondaryTree)} className="w-3.5 h-3.5 object-contain" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Player Name + Rank + KDA + CS + KP + Gold */}
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <RankedIcon size={25} rankedData={rankedDataMap[participant.puuid]} isLoading={isLoadingRanked} />
                              <button onClick={() => onPlayerClick(participant.riotIdGameName, participant.riotIdTagline)} className="text-sm font-semibold text-white hover:text-orange-400 transition-colors cursor-pointer max-w-32 truncate">
                                {participant.riotIdGameName}
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold whitespace-nowrap border-r border-zinc-700 pr-2">
                                <span className="text-white">{participant.kills}</span>
                                <span className="text-zinc-500"> / </span>
                                <span className="text-red-500">{participant.deaths}</span>
                                <span className="text-zinc-500"> / </span>
                                <span className="text-white">{participant.assists}</span>
                              </p>
                              <span className="text-xs text-orange-500 font-medium">
                                {participant.challenges?.killParticipation 
                                  ? `${(participant.challenges.killParticipation * 100).toFixed(0)}% KP`
                                  : '0% KP'
                                }
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 font-medium border-r border-zinc-700 pr-2" title="Creep Score">
                              {participantCSDisplay.totalCS} ({participantCSDisplay.csPerMin}) CS
                            </span>
                            <div className="flex items-center gap-1 text-xs border-r border-zinc-700 pr-2" title="Gold earned">
                              <span className="text-zinc-400 font-medium">{participant.goldEarned}</span>
                              <SvgIcon size={12} type="gold" className="text-amber-400" />
                            </div>
                            <div className="flex items-center gap-1 text-xs" title="Vision Score">
                              <span className="text-zinc-400 font-medium">{participant.visionScore}</span>
                              <SvgIcon size={12} type="support" className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Damage Stats */}
                      <div className="flex items-center gap-3">
                        <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1">
                                <Swords className="w-3.5 h-3.5 text-red-400" />
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase">Dealt</p>
                              </div>
                              <p className="text-xs font-bold text-white">{(participant.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-700/60 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-300" style={{ width: `${damageDealtPercent}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-orange-400" />
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase">Taken</p>
                              </div>
                              <p className="text-xs font-bold text-white">{(participant.totalDamageTaken / 1000).toFixed(1)}k</p>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-700/60 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-orange-600 to-orange-500 rounded-full transition-all duration-300" style={{ width: `${damageTakenPercent}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Items */}
                      <div className={`flex items-center gap-3 ${name === 'Blue Team' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex flex-wrap gap-1 ${name === 'Red Team' ? 'flex-row-reverse' : ''}`}>
                          {name === 'Red Team' ? [...itemIds].reverse().map((itemId, idx) => {
                            const originalIndex = itemIds.length - 1 - idx;
                            const itemName = itemId && itemId !== 0 ? getItemDescription(itemId.toString()) : 'Empty Item Slot';
                            return (
                              <div
                                key={`item-${originalIndex}`}
                                className={`group relative w-7 h-7 rounded-md overflow-hidden transition-all duration-200 shadow-sm ${
                                  !itemId || itemId === 0
                                    ? 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                                    : 'bg-zinc-700 border border-zinc-600 hover:border-orange-500 hover:scale-110 hover:shadow-orange-500/30'
                                }`}
                                title={itemName}
                              >
                                {itemId && itemId !== 0 ? (
                                  <img
                                    src={getItemImage(itemId.toString())}
                                    alt={itemName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                            );
                          }) : itemIds.map((itemId, idx) => {
                            const itemName = itemId && itemId !== 0 ? getItemDescription(itemId.toString()) : 'Empty Item Slot';
                            return (
                              <div
                                key={`item-${idx}`}
                                className={`group relative w-7 h-7 rounded-md overflow-hidden transition-all duration-200 shadow-sm ${
                                  !itemId || itemId === 0
                                    ? 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                                    : 'bg-zinc-700 border border-zinc-600 hover:border-orange-500 hover:scale-110 hover:shadow-orange-500/30'
                                }`}
                                title={itemName}
                              >
                                {itemId && itemId !== 0 ? (
                                  <img
                                    src={getItemImage(itemId.toString())}
                                    alt={itemName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                            );
                          })}
                          {/* Trinket */}
                          <div
                            className={`group relative w-7 h-7 rounded-md overflow-hidden transition-all duration-200 shadow-sm ${
                              participant.item6 && participant.item6 !== 0
                                ? 'bg-zinc-700 border border-amber-600 hover:border-amber-400 hover:scale-110 hover:shadow-amber-500/30'
                                : 'bg-zinc-700/40 border border-dashed border-zinc-600/60'
                            }`}
                            title={participant.item6 && participant.item6 !== 0 ? `Trinket: ${getItemDescription(participant.item6.toString())}` : 'Empty Trinket Slot'}
                          >
                            {participant.item6 && participant.item6 !== 0 ? (
                              <img
                                src={getItemImage(participant.item6.toString())}
                                alt={`Trinket ${participant.item6}`}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
}


