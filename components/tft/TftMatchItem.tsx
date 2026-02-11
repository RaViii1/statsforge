"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Users, Clock, Star, Coins, Skull, Trophy, Sword } from "lucide-react";
import { TFTItem } from "@/lib/tft/itemstft";
import { 
    ParticipantDto, 
    getTFTUnitIcon, 
    getTFTItemIcon, 
    getPlacementColor, 
    getPlacementBg,
    formatGameDuration,
    formatTimestamp,
    getQueueName,
    convertRoundToStage,
    getTFTCompanionIcon,
    getRankIcon,
    UnitDto,
    TraitDto,
  } from "@/lib/tft/tftfunctions";
import TftTraitIcon from "./TftTraitIcon";

interface TFTMatchCardProps {
  match: any;
  puuid: string;
}

export default function TFTMatchCard({ match, puuid }: TFTMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rankedDataMap, setRankedDataMap] = useState<Record<string, any>>({});
  const [items, setItems] = useState<TFTItem[]>([]);
  const playerData = match.info.participants.find((p: ParticipantDto) => p.puuid === puuid);
  const server = match.metadata.match_id.split('_')[0].toLowerCase();

  // Fetch items from database on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/tft/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch TFT items:', error);
      }
    };

    fetchItems();
  }, []);
  
  useEffect(() => {
    if (!isExpanded) return;

      const fetchRanks = async () => {
        const puuids = match.info.participants.map((p: ParticipantDto) => p.puuid);
        const server = match.metadata.match_id.split('_')[0].toLowerCase();
        
        const queueMapping: Record<number, string> = {
          1100: "RANKED_TFT",
          1130: "RANKED_TFT_TURBO",
          1150: "RANKED_TFT_DOUBLE_UP",
          1160: "RANKED_TFT_DOUBLE_UP"
        };
        const targetQueue = queueMapping[match.info.queue_id] || "RANKED_TFT";

        try {
          const results = await Promise.allSettled(
            puuids.map(async (puid: string) => {
              const res = await fetch(`/api/tft/ranked/${server}/${puid}`);
              if (res.ok) {
                const data = await res.json();
                const tftRanked = data.rankedData?.find((r: any) => r.queueType === targetQueue);
                return { puuid: puid, data: tftRanked || null };
              }
              return { puuid: puid, data: null };
            })
          );

        
        const map: Record<string, any> = {};
        results.forEach((res) => {
          if (res.status === 'fulfilled' && res.value) {
            map[res.value.puuid] = res.value.data;
          }
        });
        setRankedDataMap(map);
      } catch (err) {
        console.error("Failed to fetch TFT ranks:", err);
      }
    };

    fetchRanks();
  }, [isExpanded, match.info.participants, match.metadata.match_id]);

  if (!playerData) return null;

  const participantsSorted = [...match.info.participants].sort((a, b) => a.placement - b.placement);
  const placementColor = getPlacementColor(playerData.placement);
  const placementBg = getPlacementBg(playerData.placement);

  const getTraitStyleClasses = (tier_current: number, tierTotal: number, units: number ) => {
        if (tierTotal === 1 && units === 1) {
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.1)]";
    }
    switch (tier_current) {
      case 1:
        return "bg-orange-900/30 border-orange-700/40 text-orange-200";
      case 2:
        return "bg-zinc-400/20 border-zinc-400/50 text-zinc-300";
      case 3:
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.1)]";
      case 4:
        return "bg-purple-500/30 border-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      default:
        return "bg-zinc-950/50 border-zinc-800 text-zinc-400";
    }
  };

  const getUnitBorderColor = (rarity: number) => {
    switch (rarity) {
      case 6: return 'border-orange-500';
      case 5: return 'border-orange-500';
      case 4: return 'border-pink-500';
      case 2: return 'border-blue-500';
      case 1: return 'border-emerald-500';
      case 0: return 'border-gray-500';
      default: return 'border-slate-200';
    }
  };

  return (
    <div className={`rounded-xl border transition-all overflow-hidden mb-4 ${placementBg}`}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
            {/* Match Info & Placement */}
              <div className="flex md:flex-col justify-between md:justify-center items-center md:items-start gap-2 md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/50 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center gap-3 ">
                  <div className="text-left">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    {getQueueName(match.info.queue_id)}
                  </p>
                  <p className="text-xs text-zinc-500 font-medium">
                    {formatTimestamp(match.info.game_datetime)}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className={`text-3xl font-black ${placementColor}`}>
                  #{playerData.placement}
                </p>
                <p className="text-xs font-bold text-zinc-500 uppercase">
                  {playerData.placement <= 4 ? "Victory" : "Defeat"}
                </p>
                
              </div>
              <div className="hidden md:block">
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatGameDuration(match.info.game_length)} | Stage {convertRoundToStage(playerData.last_round)} 
                </p>
              </div>
            </div>

            {/* Synergies & Units */}
            <div className="flex-1 space-y-4">
                {/* Active Synergies */}
                <div className="flex flex-wrap gap-2">
                  {playerData.traits
                    .filter((t: TraitDto) => t.tier_current > 0)
                    .sort((a: TraitDto, b: TraitDto) => b.tier_current - a.tier_current)
                    .map((trait: TraitDto, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg group transition-all border ${getTraitStyleClasses(trait.tier_current, trait.tier_total, trait.num_units)}`}
                          title={`${trait.name}: Tier ${trait.tier_current}/${trait.tier_total}`}
                        >
                          <div className={`w-5 h-5 flex items-center justify-center rounded p-0.5 bg-black/20`}>
                            <TftTraitIcon 
                              traitId={trait.name} 
                              setNumber={match.info.tft_set_number}
                              tierStyle={trait.style}
                              className="w-full h-full object-contain brightness-125"
                            />
                          </div>
                        <div className="flex flex-col">
                        <span className="text-xs font-bold">Units: {trait.num_units}</span>
                        {/* <span className="text-xs font-bold">Style: {trait.style}</span>
                        <span className="text-xs font-bold">Tier current: {trait.tier_current}</span>
                        <span className="text-xs font-bold">Tier total: {trait.tier_total}</span> */}
                      </div>
                      </div>
                    ))}
                </div>

              {/* Units & Items */}
              <div className="flex flex-wrap gap-3">
                {playerData.units.map((unit: UnitDto, idx: number) => (
                  <div key={idx} className="relative group">
                    <div className="relative">
                      {/* Star Level */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
                        {[...Array(unit.tier)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      
                      {/* Unit Icon */}
                        <div className={`w-11 h-11 rounded-lg border-2 overflow-hidden bg-zinc-900 transition-transform group-hover:scale-110 ${getUnitBorderColor(unit.rarity)}`}
                          title={unit.character_id.replace("TFT13_", "")}>
                          <img 
                            src={getTFTUnitIcon(unit.character_id, match.info.tft_set_number)} 
                            alt={unit.character_id}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex justify-center">
                          {unit.itemNames?.slice(0, 3).map((itemName: string, i: number) => {
                            const item = items.find(it => it.Riot_Api_Name === itemName);
                            return (
                              <div 
                                key={i} 
                                className="w-3.5 h-3.5 rounded overflow-hidden bg-zinc-950 border border-zinc-800"
                                title={item?.name || itemName.replace("TFT_Item_", "").replace(/_/g, " ")}
                              >
                                <img 
                                  src={item?.image_path || '/images/noitem.png'} 
                                  alt={ itemName} //item?.name ||
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                                />
                              </div>
                            );
                          })}
                        </div>
                    </div>
                  </div>
                ))}
                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 10 - playerData.units.length) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="relative group">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-lg border-2 border-zinc-800/50 bg-zinc-900/30" />
                      <div className="flex justify-center mt-0.5">
                        <div className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* Lobby Summary & Expand */}
          <div className="flex md:flex-col justify-between md:justify-center items-center gap-4 shrink-0 md:pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-300">Lobby</span>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-zinc-800/50 rounded-lg transition-all text-zinc-500 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Lobby View */}
      {isExpanded && (
        <div className="border-t border-zinc-800/50 bg-zinc-950/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Level/Stage</th>
                  <th className="px-4 py-3">Traits</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3 text-right">Stats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {participantsSorted.map((p: ParticipantDto, idx: number) => {
                  const rankInfo = rankedDataMap[p.puuid];
                  return (
                    <tr 
                      key={idx} 
                      className={`group transition-all ${
                        p.puuid === puuid 
                          ? 'bg-orange-500/10' 
                          : 'hover:bg-zinc-900/50'
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className={`text-lg font-black ${getPlacementColor(p.placement)}`}>
                          {p.placement}
                        </div>
                      </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Link 
                                href={`/tft/profile/${server}/${p.riotIdGameName}/${p.riotIdTagline}`}
                                className="text-sm font-bold text-white hover:text-orange-400 transition-colors cursor-pointer"
                              >
                                {p.riotIdGameName || "Hidden"}
                              </Link>
                              <p className="text-sm text-zinc-500">#{p.riotIdTagline || "???"}</p>
                            {rankInfo ? (
                              <div className="flex items-center gap-1.5 mt-1" title={rankInfo.queueType === 'RANKED_TFT_TURBO' ? `${rankInfo.ratedTier} - ${rankInfo.ratedRating} Points` : `${rankInfo.tier} ${rankInfo.rank} - ${rankInfo.leaguePoints} LP`}>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                  {rankInfo.queueType === 'RANKED_TFT_TURBO' ? rankInfo.ratedTier : `${rankInfo.tier} ${rankInfo.rank}`}
                                </span>
                                <img 
                                  src={getRankIcon(rankInfo.queueType === 'RANKED_TFT_TURBO' ? rankInfo.ratedTier : rankInfo.tier, rankInfo.queueType)} 
                                  alt={rankInfo.queueType === 'RANKED_TFT_TURBO' ? rankInfo.ratedTier : rankInfo.tier} 
                                  className="w-5 h-5 object-contain"
                                />
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-600 mt-1">Unranked</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col" title={`Last Round: ${p.last_round}`}>
                          <span className="text-sm font-bold text-zinc-300">Lvl {p.level}</span>
                          <span className="text-xs text-zinc-500">Stage {convertRoundToStage(p.last_round)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {p.traits
                            .filter((t: TraitDto) => t.tier_current > 0)
                            .sort((a: TraitDto, b: TraitDto) => b.tier_current - a.tier_current)
                            .map((trait: TraitDto, tIdx: number) => (
                              <div 
                                key={tIdx} 
                                className={`p-1.5 rounded bg-black/40 border ${getTraitStyleClasses(trait.tier_current, trait.tier_total, trait.num_units)}`}
                                title={`${trait.name}: ${trait.num_units} units (Tier ${trait.tier_current}/${trait.tier_total})`}
                              >
                                <TftTraitIcon 
                                  traitId={trait.name} 
                                  setNumber={match.info.tft_set_number}
                                  tierStyle={trait.style}
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-3">
                          {p.units.map((unit: UnitDto, uIdx: number) => (
                            <div key={uIdx} className="flex flex-col items-center gap-1">
                              
                              <div className="flex gap-0.5 h-3">
                                {[...Array(unit.tier)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className="w-3 h-3 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]"
                                    
                                  />
                                ))}
                              </div>
                              
                              <div 
                                className={`w-10 h-10 rounded-lg border-2 overflow-hidden bg-zinc-900 ${getUnitBorderColor(unit.rarity)}`}
                                title={unit.character_id.replace("TFT16_", "")}
                              >
                                <img 
                                  src={getTFTUnitIcon(unit.character_id, match.info.tft_set_number)} 
                                  alt={unit.character_id}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                               {/* Items - below unit, 3 items fit */}
                               <div className="flex justify-center">
                                 {unit.itemNames?.slice(0, 3).map((itemName: string, i: number) => {
                                   const item = items.find(it => it.Riot_Api_Name === itemName);
                                   return (
                                     <div 
                                       key={i} 
                                       className="w-4 h-4 rounded overflow-hidden bg-zinc-950 border border-zinc-800"
                                       title={item?.name || itemName}
                                     >
                                       <img 
                                         src={item?.image_path || '/images/noitem.png'} 
                                         alt={item?.name || itemName}
                                         className="w-full h-full object-cover"
                                         onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                                       />
                                     </div>
                                   );
                                 })}
                               </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500" title="Gold Remaining">
                            <Coins className="w-4 h-4" />
                            {p.gold_left}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-red-500" title="Players Eliminated">
                            <Sword className="w-4 h-4" />
                            {p.players_eliminated}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400" title="Total Damage to Players">
                            <Trophy className="w-4 h-4" />
                            {p.total_damage_to_players}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
