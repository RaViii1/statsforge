"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FlameIcon, Star, Flag, Zap, Droplet } from "lucide-react";
import { Match, MatchParticipant } from "@/app/types/lolInterfaces";
import {
  isRemake,
  isArena,
  formatGameDuration,
  formatTimestamp,
  getQueueName,
  formatCSDisplay,
  getRoleIcon,
  determineRole,
  isGamemodeWithoutRoles,
  getChampionImage,
} from "@/lib/lol/lolfunctions";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneIconUrl, getTreeIconUrl } from "@/lib/lol/runes";
import { getItemImage } from "@/lib/items";
import { MatchDetailsTab } from "./MatchDetailsTab";
import { MatchRunesTab } from "./MatchRunesTab";
import { getArenaAugmentIconUrl, Augment, getAugmentById, getArenaAugmentTier, getAugmentTierBorderColor, getAugmentTierBgColor, getAugmentTierGlow } from "@/lib/arena-augments";

interface MatchCardProps {
  match: Match;
  summonerPuuid: string;
  server: string;
  rankedData: any[];
  augments: Augment[];
  onPlayerClick: (gameName: string, tagLine: string) => void;
  runesData?: { runes: any[]; trees: any[] };
}

export function MatchCard({
  match,
  summonerPuuid,
  server,
  rankedData,
  augments,
  onPlayerClick,
  runesData,
}: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTab, setExpandedTab] = useState<"teams" | "runes">("teams");

  const playerData = match.info.participants.find(
    (p: MatchParticipant) => p.puuid === summonerPuuid
  );

  if (!playerData) return null;

  const remake = isRemake(match);
  const arena = isArena(match.info.queueId);
  const csDisplay = formatCSDisplay(match, playerData);

  const primaryStyle = playerData.perks?.styles?.[0];
  const secondaryStyle = playerData.perks?.styles?.[1];
  const primaryKeystoneId = primaryStyle?.selections?.[0]?.perk;
  const secondaryTreeId = (secondaryStyle as any)?.style;

  // Find rune and tree data from the passed runesData
  const primaryKeystone = runesData?.runes?.find(
    (rune) => parseInt(rune.id.split('_')[1] || rune.id) === primaryKeystoneId
  );
  
  const secondaryTree = runesData?.trees?.find(
    (tree) => parseInt(tree.id.split('_')[1] || tree.id) === secondaryTreeId
  );

  const lpChange = getLPChange(match, playerData, rankedData);

  const getOrdinal = (number: number): string => {
    if (number === 1) return "1st";
    if (number === 2) return "2nd";
    if (number === 3) return "3rd";
    return `${number}th`;
  };

  const kda =
    playerData.deaths === 0
      ? "Perfect"
      : ((playerData.kills + playerData.assists) / playerData.deaths).toFixed(2);

  const getBiggestMultikill = () => {
    if (playerData.pentaKills && playerData.pentaKills > 0) return "PENTA KILL";
    if (playerData.quadraKills && playerData.quadraKills > 0) return "QUADRA KILL";
    if (playerData.tripleKills && playerData.tripleKills > 0) return "TRIPLE KILL";
    if (playerData.doubleKills && playerData.doubleKills > 0) return "DOUBLE KILL";
    return null;
  };

  const firstBloodKill = playerData.firstBloodKill;
  const biggestMultikill = getBiggestMultikill();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) setExpandedTab("teams");
  };

  // Augment IDs for this player
  const augmentIds = [
    playerData.playerAugment1,
    playerData.playerAugment2,
    playerData.playerAugment3,
    playerData.playerAugment4,
    playerData.playerAugment5,
  ].filter(Boolean);

  const renderAugments = () =>
    augmentIds.map((augmentId, idx) => {
      const augment = getAugmentById(augmentId, augments);
      const augmentName = augment?.name ?? `Augment ${augmentId}`;
      const augmentDesc = augment?.description ?? '';
      const iconUrl = getArenaAugmentIconUrl(augment?.icon_path);
      const tier = getArenaAugmentTier(augment);
      const borderColor = getAugmentTierBorderColor(tier);
      const bgColor = getAugmentTierBgColor(tier);
      const glow = getAugmentTierGlow(tier);

      return (
        <div
          key={idx}
          className={`w-6 h-6 shrink-0 rounded overflow-hidden border-1 ${borderColor} ${bgColor} ${glow} hover:opacity-80 transition-all`}
          title={`${augmentName}${augmentDesc ? `\n\n${augmentDesc}` : ''}`}
        >
          {augment?.icon_path ? (
            <img
              src={iconUrl}
              alt={augmentName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/nochampionimage.jpg";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-400" />
            </div>
          )}
        </div>
      );
    });

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden ${
        remake
          ? "bg-zinc-900/40 border-zinc-700/50 hover:border-zinc-600"
          : playerData.win
          ? "bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-900 hover:shadow-md hover:shadow-emerald-900/10"
          : "bg-red-950/20 border-red-900/30 hover:border-red-900 hover:shadow-md hover:shadow-red-900/10"
      }`}
    >
      {/* Main Match Card */}
      <div className="p-3 sm:p-4 cursor-pointer" onClick={toggleExpansion}>
        <div className="block md:hidden space-y-3">
          {/* Top Row: Game Mode + Result */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-zinc-400">
                {getQueueName(match.info.queueId)}
              </span>
              <div
                className={`flex items-center gap-2 ${
                  remake
                    ? "text-zinc-400"
                    : arena
                    ? "text-white"
                    : playerData.win
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {remake ? (
                  <span className="font-bold text-sm">Remake</span>
                ) : arena && playerData.subteamPlacement ? (
                  <span className="font-bold text-sm">
                    {getOrdinal(playerData.subteamPlacement)}
                  </span>
                ) : playerData.win ? (
                  <span className="font-bold text-sm">Victory {lpChange}</span>
                ) : (
                  <span className="font-bold text-sm">Defeat {lpChange}</span>
                )}
              </div>
            </div>

            <div className="text-right flex flex-col gap-0.5 items-end">
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <span>{formatGameDuration(match.info.gameDuration)}</span>
              </div>
              <span className="text-xs text-zinc-500">
                {formatTimestamp(match.info.gameCreation)}
              </span>
            </div>
          </div>

          {/* Middle Row: Champion + Stats */}
          <div className="flex items-center gap-3">
            {/* Champion with spells and runes */}
            <div className="flex items-center gap-2">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-zinc-700">
                <span className="absolute bottom-0 left-0 bg-zinc-900/90 text-white text-xs px-1.5 py-0.5 rounded-tr font-medium">
                  {playerData.champLevel}
                </span>
                <img
                  src={getChampionImage(
                    playerData.championId.toString() || "/images/nochampionimage.jpg"
                  )}
                  alt={playerData.championName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/nochampionimage.jpg";
                  }}
                />
              </div>

              {/* Summoner Spells */}
              <div className="flex flex-col gap-1">
                <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                  <img
                    src={getSummonerSpellIcon(playerData.summoner1Id)}
                    alt={getSummonerSpellName(playerData.summoner1Id)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                  <img
                    src={getSummonerSpellIcon(playerData.summoner2Id)}
                    alt={getSummonerSpellName(playerData.summoner2Id)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Runes */}
              {!arena && primaryKeystone && secondaryTree && (
                <div className="flex flex-col gap-1">
                  <div 
                    className="w-6 h-6 bg-zinc-800/40 border border-zinc-700 overflow-hidden flex items-center justify-center rounded"
                    title={primaryKeystone.name}
                  >
                    {primaryKeystone.icon_path && (
                      <img
                        src={getRuneIconUrl(primaryKeystone.icon_path)}
                        alt={primaryKeystone.name}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/images/noruneicon.png";
                        }}
                      />
                    )}
                  </div>
                  <div 
                    className="w-6 h-6 bg-zinc-800/40 border border-zinc-700 overflow-hidden flex items-center justify-center rounded"
                    title={secondaryTree.name}
                  >
                    {secondaryTree.icon_path && (
                      <img
                        src={getTreeIconUrl(secondaryTree.icon_path)}
                        alt={secondaryTree.name}
                        className="w-3 h-3 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/images/norunetreeicon.png";
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* KDA Stats */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-base sm:text-lg font-bold text-white">
                {playerData.kills} /{" "}
                <span
                  className={
                    playerData.deaths === 0 ? "text-orange-400" : "text-red-500"
                  }
                >
                  {playerData.deaths}
                </span>{" "}
                / {playerData.assists}
              </span>
              <span className="text-sm text-zinc-400">{kda} KDA</span>
              <span className="text-xs text-zinc-500 mt-0.5">
                {csDisplay.totalCS} CS ({csDisplay.csPerMin || "-"}/min)
              </span>
            </div>

            {/* Expand Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion();
              }}
              className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Bottom Row: Items */}
          <div className="flex items-center gap-1 flex-wrap">
            {(arena
              ? [
                  playerData.item0,
                  playerData.item1,
                  playerData.item2,
                  playerData.item3,
                  playerData.item4,
                  playerData.item5,
                ]
              : [
                  playerData.item0,
                  playerData.item1,
                  playerData.item2,
                  playerData.item3,
                  playerData.item4,
                  playerData.item5,
                  playerData.item6,
                ]
            ).map((itemId, idx) => (
              <div
                key={idx}
                className="w-7 h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden"
              >
                {itemId !== 0 && (
                  <img
                    src={getItemImage(itemId.toString())}
                    alt={`Item ${itemId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Item image failed to load:', {
                        itemId: itemId,
                        src: e.currentTarget.src
                      });
                      e.currentTarget.src = "/images/noitem.png";
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Mobile Augments */}
          {arena && augmentIds.length > 0 && (
            <div className="grid grid-cols-5 gap-1">
              {renderAugments()}
            </div>
          )}

          {/* First Blood and Multikill Pills */}
          <div className="flex gap-2 flex-wrap">
            {firstBloodKill && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600/20 border border-red-500/40 rounded">
                <Flag className="w-3 h-3 text-red-400" />
                <span className="text-xs font-bold text-red-400">First Blood</span>
              </div>
            )}
            {!arena && biggestMultikill && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-600/20 border border-orange-500/40 rounded">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">
                  {biggestMultikill}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 xl:gap-3">
          {/* Game Mode + Result */}
          <div className="flex flex-col gap-0.5 min-w-[90px] xl:min-w-[110px] shrink-0">
            <span className="text-xs text-zinc-400 font-bold pb-0.5">
              {getQueueName(match.info.queueId)}
            </span>
            <div
              className={`flex items-center gap-1.5 pb-0.5 ${
                remake
                  ? "text-zinc-400"
                  : arena
                  ? "text-white"
                  : playerData.win
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {remake ? (
                <span className="font-bold text-sm">Remake</span>
              ) : arena && playerData.subteamPlacement ? (
                <span className="font-bold text-sm">
                  {getOrdinal(playerData.subteamPlacement)}
                </span>
              ) : playerData.win ? (
                <span className="font-bold text-sm">Victory {lpChange}</span>
              ) : (
                <span className="font-bold text-sm">Defeat {lpChange}</span>
              )}
            </div>
            <div className="flex flex-row border-t border-zinc-700/50 pt-2 mt-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-zinc-400">
                  {formatGameDuration(match.info.gameDuration)}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatTimestamp(match.info.gameCreation)}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                {!isGamemodeWithoutRoles(match.info.queueId) && (
                  <img
                    src={getRoleIcon(
                      determineRole(playerData, match.info.queueId) || "unknown"
                    )}
                    alt={playerData.lane}
                    className="w-6 h-6"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Champion Icon + Summoner Spells + Runes */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative w-14 h-14 xl:w-16 xl:h-16 rounded-lg overflow-hidden border-2 border-zinc-700 hover:border-orange-500 transition-all">
              <span className="absolute bottom-0 left-0 bg-zinc-900/90 text-white text-xs px-1.5 py-0.5 rounded-tr font-medium">
                {playerData.champLevel}
              </span>
              <img
                src={getChampionImage(playerData.championId.toString())}
                alt={playerData.championName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Summoner Spells */}
            <div className="flex flex-col gap-1">
              <div
                className="w-6 h-6 xl:w-7 xl:h-7 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                title={getSummonerSpellName(playerData.summoner1Id)}
              >
                <img
                  src={getSummonerSpellIcon(playerData.summoner1Id)}
                  alt={getSummonerSpellName(playerData.summoner1Id)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="w-6 h-6 xl:w-7 xl:h-7 rounded border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                title={getSummonerSpellName(playerData.summoner2Id)}
              >
                <img
                  src={getSummonerSpellIcon(playerData.summoner2Id)}
                  alt={getSummonerSpellName(playerData.summoner2Id)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Runes */}
            {!arena && primaryKeystone && secondaryTree && (
              <div className="flex flex-col gap-1">
                <div
                  className="w-6 h-6 xl:w-7 xl:h-7 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center rounded"
                  title={`${primaryKeystone.name}: ${primaryKeystone.description || "No description"}`}
                >
                  {primaryKeystone.icon_path && (
                    <img
                      src={getRuneIconUrl(primaryKeystone.icon_path)}
                      onError={(e) => {
                        e.currentTarget.src = "/images/noruneicon.png";
                      }}
                      alt={primaryKeystone.name}
                      className="w-4 h-4 xl:w-5 xl:h-5 object-contain"
                    />
                  )}
                </div>
                <div
                  className="w-6 h-6 xl:w-7 xl:h-7 border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center rounded"
                  title={secondaryTree.name}
                >
                  {secondaryTree.icon_path && (
                    <img
                      src={getTreeIconUrl(secondaryTree.icon_path)}
                      onError={(e) => {
                        e.currentTarget.src = "/images/norunetreeicon.png";
                      }}
                      alt={secondaryTree.name}
                      className="w-3 h-3 xl:w-4 xl:h-4 object-contain"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* KDA Stats */}
          <div className="flex flex-col gap-0.5 min-w-[100px] shrink-0">
            <span className="text-base xl:text-lg font-bold text-white">
              {playerData.kills} /{" "}
              <span
                className={
                  playerData.deaths === 0 ? "text-orange-400" : "text-red-500"
                }
              >
                {playerData.deaths}
              </span>{" "}
              / {playerData.assists}
            </span>
            <span className="text-sm text-zinc-400">{kda} KDA</span>
          </div>

          {/* Items */}
          <div className="flex gap-0.5 xl:gap-1 shrink-0">
            {(arena
              ? [
                  playerData.item0,
                  playerData.item1,
                  playerData.item2,
                  playerData.item3,
                  playerData.item4,
                  playerData.item5,
                ]
              : [
                  playerData.item0,
                  playerData.item1,
                  playerData.item2,
                  playerData.item3,
                  playerData.item4,
                  playerData.item5,
                  playerData.item6,
                ]
            ).map((itemId, idx) => (
              <div
                key={idx}
                className="w-6 h-6 xl:w-7 xl:h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
              >
                {itemId !== 0 && (
                  <img
                    src={getItemImage(itemId.toString())}
                    alt={`Item ${itemId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Item image failed to load:', {
                        itemId: itemId,
                        src: e.currentTarget.src
                      });
                      e.currentTarget.src = "/images/noitem.png";
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* CS & Gold — hidden on md, shown on lg+ */}
          <div className="hidden lg:flex flex-col gap-0.5 text-right min-w-[80px] shrink-0">
            <span className="text-sm text-zinc-300">{csDisplay.totalCS} CS</span>
            {csDisplay.csPerMin ? (
              csDisplay.showFlame ? (
                <span className="flex items-center gap-1 justify-end">
                  <FlameIcon className="text-orange-400 w-4 h-4" />
                  <span className="text-sm text-zinc-400">{csDisplay.csPerMin}/min</span>
                </span>
              ) : (
                <span className="text-sm text-zinc-400">{csDisplay.csPerMin}/min</span>
              )
            ) : (
              <span className="text-sm text-zinc-500">-</span>
            )}
          </div>

          {/* Arena Augments — hidden on md, shown on xl+ */}
          {arena && (
            <div className="hidden xl:flex flex-col gap-1 shrink-0">
              <span className="text-xs text-zinc-400">Augments</span>
              <div className="grid grid-cols-2 gap-1 max-w-[120px]">
                {renderAugments()}
              </div>
            </div>
          )}

          {/* Multikill + First Blood */}
          <div className="flex flex-col gap-0.5 text-right min-w-[100px] xl:min-w-[120px] ml-auto shrink-0">
            {!arena && biggestMultikill && (
              <div className="flex items-center gap-1 px-2 py-0.5 mt-1 bg-orange-600/20 border border-orange-500/40 rounded justify-end ml-auto">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">
                  {biggestMultikill}
                </span>
              </div>
            )}
            {firstBloodKill && (
              <div className="flex items-center gap-1 px-2 py-0.5 my-1 bg-red-600/10 border border-red-500/40 rounded justify-end ml-auto">
                <Droplet className="w-3 h-3 text-red-500" />
                <span className="text-xs font-bold uppercase text-red-500">
                  First Blood
                </span>
              </div>
            )}
          </div>

          {/* Expand Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpansion();
            }}
            className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-400 hover:text-orange-500 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-zinc-700/50">
          <div className="p-3 sm:p-4 bg-gradient-to-r from-slate-800/20 via-black/2 to-orange-900/10">


            {/* Tab Content */}
            {expandedTab === "teams" && (
              <MatchDetailsTab
                match={match}
                summonerPuuid={summonerPuuid}
                playerData={playerData}
                onPlayerClick={onPlayerClick}
                augments={augments}
                runesData={runesData}
              />
            )}

            {!arena && expandedTab === "runes" && primaryStyle && secondaryStyle && (
              <MatchRunesTab
                primaryStyle={primaryStyle}
                secondaryStyle={secondaryStyle}
                statPerks={playerData.perks?.statPerks}
                runesData={runesData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getLPChange(
  match: Match,
  playerData: MatchParticipant,
  rankedData: any[]
): string | null {
  if (match.info.queueId !== 420 && match.info.queueId !== 440) return null;
  if (isRemake(match)) return null;

  const queueType =
    match.info.queueId === 420 ? "RANKED_SOLO_5x5" : "RANKED_FLEX_SR";
  const rankedInfo = rankedData.find((r) => r.queueType === queueType);
  if (!rankedInfo) return null;

  const kda =
    playerData.deaths === 0
      ? 10
      : (playerData.kills + playerData.assists) / playerData.deaths;
  const gameDurationMin = match.info.gameDuration / 60;
  const csPerMin =
    gameDurationMin > 0
      ? (playerData.totalMinionsKilled + playerData.neutralMinionsKilled) /
        gameDurationMin
      : 0;

  let performanceMultiplier = 1.0;
  if (playerData.win) {
    if (kda > 5) performanceMultiplier += 0.1;
    if (csPerMin > 7) performanceMultiplier += 0.05;
    if (playerData.visionScore > 30) performanceMultiplier += 0.05;
  } else {
    if (kda > 3) performanceMultiplier -= 0.1;
    if (csPerMin > 7) performanceMultiplier -= 0.05;
  }

  const hotStreakMultiplier = rankedInfo.hotStreak ? 1.1 : 1.0;
  const baseLPChange = playerData.win ? 18 : -17;
  const lpChange = Math.round(
    baseLPChange * performanceMultiplier * hotStreakMultiplier
  );

  return playerData.win ? `+${lpChange} LP` : `${lpChange} LP`;
}