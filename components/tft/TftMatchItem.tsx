"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Users, Clock, Star, Coins, Sword, Trophy, Shield } from "lucide-react";
import { TFTItem, getItemImageUrl } from "@/lib/tft/itemstft";
import {
  ParticipantDto,
  getTFTUnitIcon,
  getPlacementColor,
  getPlacementBg,
  formatGameDuration,
  formatTimestamp,
  getQueueName,
  convertRoundToStage,
  getRankIcon,
  UnitDto,
  TraitDto,
  getTierColorOpaque,
  getTierBorderColor,
} from "@/lib/tft/tftfunctions";
import { TFTChampion, TFTTrait } from "@/lib/tft/champions";
import { TraitTooltip } from "./planner/TraitTooltip";
import { CustomTooltip } from "./planner/CustomTooltip";
import { UnitTooltip } from "./UnitTooltip";

interface TFTMatchCardProps {
  match: any;
  puuid: string;
  items: TFTItem[];
  traits: TFTTrait[];
  units: TFTChampion[];
}

const RARITY_BORDER: Record<number, string> = {
  6: "border-orange-400",
  5: "border-orange-400",
  4: "border-fuchsia-500",
  2: "border-blue-400",
  1: "border-emerald-400",
  0: "border-zinc-600",
};

const PLACEMENT_LABEL: Record<number, string> = {
  1: "1st", 2: "2nd", 3: "3rd", 4: "4th",
  5: "5th", 6: "6th", 7: "7th", 8: "8th",
};

export default function TFTMatchCard({ match, puuid, items, traits, units }: TFTMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rankedDataMap, setRankedDataMap] = useState<Record<string, any>>({});
  const [tooltip, setTooltip] = useState<any>({ visible: false });

  const playerData = match.info.participants.find((p: ParticipantDto) => p.puuid === puuid);
  const server = match.metadata.match_id.split("_")[0].toLowerCase();
  const isWin = playerData?.placement <= 4;

  useEffect(() => {
    if (!isExpanded) return;
    const fetchRanks = async () => {
      const puuids = match.info.participants.map((p: ParticipantDto) => p.puuid);
      const queueMapping: Record<number, string> = {
        1100: "RANKED_TFT",
        1130: "RANKED_TFT_TURBO",
        1150: "RANKED_TFT_DOUBLE_UP",
        1160: "RANKED_TFT_DOUBLE_UP",
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
          if (res.status === "fulfilled" && res.value) {
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

  const participantsSorted = [...match.info.participants].sort(
    (a, b) => a.placement - b.placement
  );

  const getTraitClasses = (num_units: number, matchedTrait?: TFTTrait) => {
    if (matchedTrait?.tft_trait_tiers) {
      // Find the highest tier that is active based on num_units
      const activeTier = matchedTrait.tft_trait_tiers
        .filter(tier => num_units >= tier.units_required)
        .sort((a, b) => b.units_required - a.units_required)[0];
      
      if (activeTier) {
        return `${getTierColorOpaque(activeTier.tier).split(" ")[0]} ${getTierBorderColor(activeTier.tier)}`;
      }
    }
    
    // Fallback to default if no matched trait or tiers
    return `${getTierColorOpaque("gold").split(" ")[0]} ${getTierBorderColor("gold")}`;
  };

  const unitBorderColor = (rarity: number) =>
    RARITY_BORDER[rarity] ?? "border-zinc-600";

  const placementNum = playerData.placement;
  const placementLabel = PLACEMENT_LABEL[placementNum] ?? `${placementNum}th`;

  const UnitCell = ({ unit, size = "sm" }: { unit: UnitDto; size?: "sm" | "xs" }) => {
    const dim = size === "sm" ? "w-10 h-10" : "w-9 h-9";
    const itemDim = size === "sm" ? "w-3.5 h-3.5" : "w-3 h-3";
    
    // Find champion from units array passed to TftMatchItem
    const champion = units.find((u: any) => u.id === unit.character_id);
    
    return (
      <div className="flex flex-col items-center gap-0.5">
      
        <div className="flex gap-px h-2.5">
          {[...Array(unit.tier)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      
        <div
          className={`${dim} rounded-md border-2 overflow-hidden bg-zinc-800 transition-transform hover:scale-110 ${unitBorderColor(unit.rarity)} cursor-pointer`}
          onMouseEnter={(e) => {
            if (champion) {
              setTooltip({
                visible: true,
                title: champion.name,
                description: champion.ability?.description?.active || champion.ability?.description?.passive || "",
                x: e.clientX,
                y: e.clientY,
                champion,
                setNumber: match.info.tft_set_number
              });
            }
          }}
          onMouseLeave={() => setTooltip({ visible: false })}
        >
          <img
            src={getTFTUnitIcon(unit.character_id, match.info.tft_set_number) || "/images/nochampionimage.jpg"}
            alt={unit.character_id}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
          />
        </div>
    
        <div className="flex gap-px">
          {(unit.itemNames ?? []).slice(0, 3).map((itemName: string, i: number) => {
            const item = items.find((it) => it.Riot_Api_Name === itemName);
            return (
              <div
                key={i}
                className={`${itemDim} rounded-sm overflow-hidden bg-zinc-950 border border-zinc-700/60 cursor-pointer`}
                onMouseEnter={(e) =>
                  setTooltip({
                    visible: true,
                    title: item?.name ?? itemName.replace(/TFT_Item_|_/g, " ").trim(),
                    description: item?.description ?? "",
                    x: e.clientX,
                    y: e.clientY,
                    item,
                  })
                }
                onMouseLeave={() => setTooltip({ visible: false })}
              >
                <img
                  src={getItemImageUrl(item?.image_path)}
                  alt={item?.name ?? itemName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/noitem.png";
                  }}
                />
              </div>
            );
          })}
    
          {Array.from({ length: Math.max(0, 3 - (unit.itemNames?.length ?? 0)) }).map((_, i) => (
            <div key={`ph-${i}`} className={`${itemDim} rounded-sm bg-zinc-900/40`} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all duration-200 mb-3 ${
        isWin
          ? "border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-orange-950/20 to-zinc-950"
          : "border-zinc-800/60 bg-zinc-950"
      }`}
    >
      <div className="flex items-stretch gap-0">

        <div
          className={`w-1 shrink-0 rounded-l-xl ${
            isWin ? "bg-gradient-to-b from-amber-400 to-amber-600" : "bg-zinc-700"
          }`}
        />

        <div className="flex-1 flex flex-col sm:flex-row gap-0 px-4 py-3">

          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 sm:w-28 shrink-0 sm:pr-4 sm:border-r border-zinc-800/60 pb-3 sm:pb-0 border-b sm:border-b-0">
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                {getQueueName(match.info.queue_id)}
              </p>
              <p className="text-[10px] text-zinc-600">{formatTimestamp(match.info.game_datetime)}</p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0.5">
              <span
                className={`text-2xl font-black tabular-nums leading-none ${getPlacementColor(placementNum)}`}
              >
                {placementLabel}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isWin ? "text-amber-400" : "text-zinc-500"
                }`}
              >
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-zinc-600">
              <Clock className="w-3 h-3" />
              <span>{formatGameDuration(match.info.game_length)}</span>
              <span className="text-zinc-700">·</span>
              <span>Stage {convertRoundToStage(playerData.last_round)}</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 sm:px-4 py-1 text-zinc-200">
            {/* Traits strip */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {playerData.traits
                .filter((t: TraitDto) => t.tier_current > 0)
                .sort((a: TraitDto, b: TraitDto) => {
                  // Define tier order: Prismatic > Gold/Hero > Silver > Bronze
                  const tierOrder: Record<string, number> = {
                    prismatic: 4,
                    gold: 3,
                    silver: 2,
                    bronze: 1
                  };

                  const aMatched = traits.find((t) => t.riot_api_name === a.name);
                  const bMatched = traits.find((t) => t.riot_api_name === b.name);

                  // Get active tier for trait a
                  let aTier = "bronze";
                  if (aMatched?.is_Hero) {
                    aTier = "gold"; // Hero traits should have gold tier priority
                  } else if (aMatched?.tft_trait_tiers) {
                    const aActiveTier = aMatched.tft_trait_tiers
                      .filter(tier => a.num_units >= tier.units_required)
                      .sort((x, y) => y.units_required - x.units_required)[0];
                    if (aActiveTier) {
                      aTier = aActiveTier.tier;
                    }
                  }

                  // Get active tier for trait b
                  let bTier = "bronze";
                  if (bMatched?.is_Hero) {
                    bTier = "gold"; // Hero traits should have gold tier priority
                  } else if (bMatched?.tft_trait_tiers) {
                    const bActiveTier = bMatched.tft_trait_tiers
                      .filter(tier => b.num_units >= tier.units_required)
                      .sort((x, y) => y.units_required - x.units_required)[0];
                    if (bActiveTier) {
                      bTier = bActiveTier.tier;
                    }
                  }

                  // Sort by tier order
                  if (tierOrder[aTier] !== tierOrder[bTier]) {
                    return tierOrder[bTier] - tierOrder[aTier];
                  }

                  // If same tier, sort hero traits first
                  if (aMatched?.is_Hero && !bMatched?.is_Hero) return -1;
                  if (!aMatched?.is_Hero && bMatched?.is_Hero) return 1;

                  // If same tier and both are hero or both are regular, sort by count descending
                  return b.num_units - a.num_units;
                })
                .map((trait: TraitDto, idx: number) => {
                  const matchedTrait = traits.find((t) => t.riot_api_name === trait.name);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-md border text-[10px] font-bold ${getTraitClasses(
                          trait.num_units,
                          matchedTrait
                        )}`}
                      onMouseEnter={(e) =>
                        setTooltip({
                          visible: true,
                          title: matchedTrait?.name ?? trait.name,
                          description: matchedTrait?.description ?? "",
                          x: e.clientX,
                          y: e.clientY,
                          trait: {
                            id: matchedTrait?.name ?? trait.name,
                            name: matchedTrait?.name ?? trait.name,
                            description: matchedTrait?.description ?? "",
                            icon_path: matchedTrait?.icon_path ?? "",
                            tiers: matchedTrait?.tft_trait_tiers ?? [],
                            is_Hero: matchedTrait?.is_Hero ?? false,
                          },
                        })
                      }
                      onMouseLeave={() => setTooltip({ visible: false })}
                    >
                      <div className="w-3.5 h-3.5 shrink-0">
                      <img 
                        src={matchedTrait?.icon_path || "/images/notfound.png"} 
                        alt={matchedTrait?.name || trait.name} 
                        className="w-3.5 h-3.5 object-contain" 
                        onError={(e) => { (e.target as HTMLImageElement).src = "/images/notfound.png"; }}
                      />
                      </div>
                      <span className="opacity-90">{matchedTrait?.name ?? trait.name}</span>
                      <span className="opacity-60 ml-0.5">{trait.num_units}</span>
                    </div>
                  );
                })}
            </div>

            {/* Units row */}
            <div className="flex flex-wrap gap-2">
              {playerData.units.map((unit: UnitDto, idx: number) => (
                <UnitCell key={idx} unit={unit} size="sm" />
              ))}
              {Array.from({ length: Math.max(0, 10 - playerData.units.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-col items-center gap-0.5">
                  <div className="h-2.5" />
                  <div className="w-10 h-10 rounded-md border-2 border-dashed border-zinc-800/50 bg-zinc-900/20" />
                  <div className="h-3.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex sm:flex-col items-center justify-end sm:justify-center gap-2 shrink-0 sm:pl-4 sm:border-l border-zinc-800/60 pt-3 sm:pt-0 border-t sm:border-t-0">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              <Users className="w-3 h-3" />
              <span>Lobby</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border transition-all ${
                isExpanded
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
              aria-label="Toggle lobby"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-zinc-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[860px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/40">
                  {["#", "Player", "Lvl / Stage", "Traits", "Units", "Stats"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest ${
                        i === 5 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participantsSorted.map((p: ParticipantDto, idx: number) => {
                  const rankInfo = rankedDataMap[p.puuid];
                  const isSelf = p.puuid === puuid;
                  const rowWin = p.placement <= 4;
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-zinc-800/30 transition-colors text-sm ${
                        isSelf
                          ? "bg-orange-500/8 border-l-2 border-l-orange-500/40"
                          : "hover:bg-zinc-900/40"
                      }`}
                    >
                      {/* Placement */}
                      <td className="px-4 py-3 w-10">
                        <span
                          className={`text-base font-black tabular-nums ${getPlacementColor(p.placement)}`}
                        >
                          {p.placement}
                        </span>
                      </td>

                      {/* Player */}
                      <td className="px-4 py-3 min-w-[160px]">
                        <div className="flex flex-col gap-0.5">
                          <Link
                            href={`/tft/profile/${server}/${p.riotIdGameName}/${p.riotIdTagline}`}
                            className={`font-bold leading-none hover:text-orange-400 transition-colors ${
                              isSelf ? "text-orange-300" : "text-zinc-100"
                            }`}
                          >
                            {p.riotIdGameName || "Hidden"}
                          </Link>
                          <span className="text-[10px] text-zinc-600">#{p.riotIdTagline || "???"}</span>
                          {rankInfo ? (
                            <div
                              className="flex items-center gap-1 mt-0.5"
                              title={
                                rankInfo.queueType === "RANKED_TFT_TURBO"
                                  ? `${rankInfo.ratedTier} · ${rankInfo.ratedRating} pts`
                                  : `${rankInfo.tier} ${rankInfo.rank} · ${rankInfo.leaguePoints} LP`
                              }
                            >
                              <img
                                src={getRankIcon(
                                  rankInfo.queueType === "RANKED_TFT_TURBO"
                                    ? rankInfo.ratedTier
                                    : rankInfo.tier,
                                  rankInfo.queueType
                                )}
                                alt="rank"
                                className="w-4 h-4 object-contain"
                              />
                              <span className="text-[10px] font-semibold text-zinc-400">
                                {rankInfo.queueType === "RANKED_TFT_TURBO"
                                  ? rankInfo.ratedTier
                                  : `${rankInfo.tier} ${rankInfo.rank}`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-700 mt-0.5">Unranked</span>
                          )}
                        </div>
                      </td>

                      {/* Level / Stage */}
                      <td className="px-4 py-3 w-24">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-zinc-200 text-xs">Lv {p.level}</span>
                          <span className="text-[10px] text-zinc-500">
                            Stage {convertRoundToStage(p.last_round)}
                          </span>
                        </div>
                      </td>

                      {/* Traits */}
                      <td className="px-4 py-3 max-w-[160px]">
                        <div className="flex flex-wrap gap-1">
                          {p.traits
                            .filter((t: TraitDto) => t.tier_current > 0)
                            .sort((a: TraitDto, b: TraitDto) => {
                              // Define tier order: Prismatic > Gold/Hero > Silver > Bronze
                              const tierOrder: Record<string, number> = {
                                prismatic: 4,
                                gold: 3,
                                silver: 2,
                                bronze: 1
                              };

                              const aMatched = traits.find((t) => t.riot_api_name === a.name);
                              const bMatched = traits.find((t) => t.riot_api_name === b.name);

                              // Get active tier for trait a
                              let aTier = "bronze";
                              if (aMatched?.is_Hero) {
                                aTier = "gold"; // Hero traits should have gold tier priority
                              } else if (aMatched?.tft_trait_tiers) {
                                const aActiveTier = aMatched.tft_trait_tiers
                                  .filter(tier => a.num_units >= tier.units_required)
                                  .sort((x, y) => y.units_required - x.units_required)[0];
                                if (aActiveTier) {
                                  aTier = aActiveTier.tier;
                                }
                              }

                              // Get active tier for trait b
                              let bTier = "bronze";
                              if (bMatched?.is_Hero) {
                                bTier = "gold"; // Hero traits should have gold tier priority
                              } else if (bMatched?.tft_trait_tiers) {
                                const bActiveTier = bMatched.tft_trait_tiers
                                  .filter(tier => b.num_units >= tier.units_required)
                                  .sort((x, y) => y.units_required - x.units_required)[0];
                                if (bActiveTier) {
                                  bTier = bActiveTier.tier;
                                }
                              }

                              // Sort by tier order
                              if (tierOrder[aTier] !== tierOrder[bTier]) {
                                return tierOrder[bTier] - tierOrder[aTier];
                              }

                              // If same tier, sort hero traits first
                              if (aMatched?.is_Hero && !bMatched?.is_Hero) return -1;
                              if (!aMatched?.is_Hero && bMatched?.is_Hero) return 1;

                              // If same tier and both are hero or both are regular, sort by count descending
                              return b.num_units - a.num_units;
                            })
                            .map((trait: TraitDto, tIdx: number) => {
                              const matchedTrait = traits.find(
                                (t) => t.riot_api_name === trait.name
                              );
                              return (
                                <div
                                  key={tIdx}
                                  className={`p-1 rounded border ${getTraitClasses(
                                    trait.num_units,
                                    matchedTrait
                                  )}`}
                                  onMouseEnter={(e) =>
                                    setTooltip({
                                      visible: true,
                                      title: matchedTrait?.name ?? trait.name,
                                      description: matchedTrait?.description ?? "",
                                      x: e.clientX,
                                      y: e.clientY,
                                      trait: {
                                        id: matchedTrait?.name ?? trait.name,
                                        name: matchedTrait?.name ?? trait.name,
                                        description: matchedTrait?.description ?? "",
                                        icon_path: matchedTrait?.icon_path ?? "",
                                        tiers: matchedTrait?.tft_trait_tiers ?? [],
                                        is_Hero: matchedTrait?.is_Hero ?? false,
                                      },
                                    })
                                  }
                                  onMouseLeave={() => setTooltip({ visible: false })}
                                >
                                  <img 
                                    src={matchedTrait?.icon_path || "/images/notfound.png"} 
                                    alt={matchedTrait?.name || trait.name} 
                                    className="w-3.5 h-3.5 object-contain" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/notfound.png"; }}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </td>

                      {/* Units */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {p.units.map((unit: UnitDto, uIdx: number) => (
                            <UnitCell key={uIdx} unit={unit} size="xs" />
                          ))}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div
                            className="flex items-center gap-1 text-[11px] font-semibold text-amber-400"
                            title="Gold remaining"
                          >
                            <Coins className="w-3 h-3" />
                            {p.gold_left}g
                          </div>
                          <div
                            className="flex items-center gap-1 text-[11px] font-semibold text-red-400"
                            title="Players eliminated"
                          >
                            <Sword className="w-3 h-3" />
                            {p.players_eliminated}
                          </div>
                          <div
                            className="flex items-center gap-1 text-[11px] font-semibold text-sky-400"
                            title="Total damage to players"
                          >
                            <Shield className="w-3 h-3" />
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

      {/* Tooltips */}
      <TraitTooltip
        visible={tooltip.visible && !!tooltip.trait}
        title={tooltip.title}
        description={tooltip.description}
        x={tooltip.x}
        y={tooltip.y}
        trait={tooltip.trait}
      />
      <CustomTooltip
        visible={tooltip.visible && !!tooltip.item}
        title={tooltip.title}
        description={tooltip.description}
        x={tooltip.x}
        y={tooltip.y}
        item={tooltip.item}
        allItems={items}
      />
      <UnitTooltip
        visible={tooltip.visible && !!tooltip.champion}
        title={tooltip.title}
        description={tooltip.description}
        x={tooltip.x}
        y={tooltip.y}
        champion={tooltip.champion}
        setNumber={tooltip.setNumber}
      />
    </div>
  );
}