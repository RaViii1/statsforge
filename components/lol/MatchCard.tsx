"use client";

import { useState } from "react";
import { Crown, Swords, XCircle, ChevronDown, ChevronUp, FlameIcon, Star, Flag, Zap, Droplet } from "lucide-react";
import { Match, MatchParticipant } from "@/app/types/lolInterfaces";
import { 
  isRemake, 
  isArena, 
  formatGameDuration, 
  formatTimestamp, 
  getQueueName,
  formatCSDisplay,
  getTeamIcon,
  getRoleIcon,
  determineRole,
  isGamemodeWithoutRoles
} from "@/lib/lol/lolfunctions";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneName, getRuneDescription, getRuneIcon, getRuneTreeName, getRuneTreeIcon } from "@/lib/runes";
import { getItemImage } from "@/lib/items";
import { getArenaAugmentName, getArenaAugmentIcon } from "@/lib/arena-augments";
import { MatchDetailsTab } from "./MatchDetailsTab";
import { MatchRunesTab } from "./MatchRunesTab";

interface MatchCardProps {
  match: Match;
  summonerPuuid: string;
  server: string;
  rankedData: any[];
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function MatchCard({ match, summonerPuuid, server, rankedData, onPlayerClick }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTab, setExpandedTab] = useState<"teams" | "runes">("teams");

  const playerData = match.info.participants.find(
    (p: MatchParticipant) => p.puuid === summonerPuuid
  );

  if (!playerData) return null;

  const remake = isRemake(match);
  const arena = isArena(match.info.queueId);
  const csDisplay = formatCSDisplay(match, playerData);

  // Extract rune data
  const primaryStyle = playerData.perks?.styles?.[0];
  const secondaryStyle = playerData.perks?.styles?.[1];
  const primaryKeystone = primaryStyle?.selections?.[0]?.perk;
  const secondaryTree = (secondaryStyle as any)?.style;

  const lpChange = getLPChange(match, playerData, rankedData);

  const kda = playerData.deaths === 0 
    ? "Perfect" 
    : ((playerData.kills + playerData.assists) / playerData.deaths).toFixed(2);

  // Get biggest multikill
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
    if (!isExpanded) {
      setExpandedTab("teams");
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden ${
        remake 
          ? "bg-zinc-900/40 border-zinc-700/50 hover:border-zinc-600"
          : playerData.win
          ? "bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-700 hover:shadow-md hover:shadow-emerald-900/10"
          : "bg-red-950/20 border-red-900/30 hover:border-red-700 hover:shadow-md hover:shadow-red-900/10"
      }`}
    >
      {/* Main Match Card */}
      <div className="p-3 sm:p-4 cursor-pointer" onClick={toggleExpansion}>
        {/* Mobile Layout (< md) */}
        <div className="block md:hidden space-y-3">
          {/* Top Row: Game Mode + Result */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium text-zinc-400">
                {getQueueName(match.info.queueId)}
              </span>
              <div className={`flex items-center gap-2 ${
                remake 
                  ? "text-zinc-400"
                  : playerData.win ? "text-emerald-400" : "text-red-400"
              }`}>
                {remake ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span className="font-bold text-sm">Remake</span>
                  </>
                ) : playerData.win ? (
                  <>
                    <Crown className="w-4 h-4" />
                    <span className="font-bold text-sm">Victory</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-4 h-4" />
                    <span className="font-bold text-sm">Defeat</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-right flex flex-col gap-0.5 items-end">
              {lpChange && (
                <span className={`text-xs font-bold ${
                  lpChange.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {lpChange}
                </span>
              )}
              { !arena && biggestMultikill && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-600/20 border border-orange-500/40 rounded">
                  <Zap className="w-3 h-3 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">{biggestMultikill}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <span>{formatGameDuration(match.info.gameDuration)}</span>
              </div>
              <span className="text-xs text-zinc-500">{formatTimestamp(match.info.gameCreation)}</span>
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
                  src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${playerData.championId}.png`}
                  alt={playerData.championName}
                  className="w-full h-full object-cover"
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
                  <div className="w-6 h-6 bg-zinc-800/40 border border-zinc-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={getRuneIcon(primaryKeystone)}
                      alt={getRuneName(primaryKeystone)}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="w-6 h-6 bg-zinc-800/40 border border-zinc-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={getRuneTreeIcon(secondaryTree)}
                      alt={getRuneTreeName(secondaryTree)}
                      className="w-3 h-3 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* KDA Stats */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-base sm:text-lg font-bold text-red-">
                {playerData.kills} / <span className={playerData.deaths === 0 ? "text-orange-400" : "text-red-500"}>{playerData.deaths}</span> / {playerData.assists}
              </span>
              <span className="text-sm text-zinc-400">
                {kda} KDA
              </span>
              <span className="text-xs text-zinc-500 mt-0.5">
                {csDisplay.totalCS} CS ({csDisplay.csPerMin || '-'}/min)
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
            {arena ? (
              [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5].map((itemId, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden"
                >
                  {itemId !== 0 && (
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                      alt={`Item ${itemId}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))
            ) : (
              [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5, playerData.item6].map((itemId, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden"
                >
                  {itemId !== 0 && (
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                      alt={`Item ${itemId}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Desktop/Tablet Layout (>= md) */}
        <div className="hidden md:flex items-center gap-2 xl:gap-3">
          {/* Game Mode + Result */}
          <div className="flex flex-col gap-0.5 min-w-[90px] xl:min-w-[110px] shrink-0">
            <span className="text-xs text-zinc-400 font-bold pb-0.5">
              {getQueueName(match.info.queueId)}
            </span>
            <div className={`flex items-center gap-1.5 pb-0.5 ${
              remake 
                ? "text-zinc-400"
                : playerData.win ? "text-emerald-400" : "text-red-400"
            }`}>
              {remake ? (
                <>
                  <XCircle className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-bold text-sm">Remake</span>
                </>
              ) : playerData.win ? (
                <>
                  <Crown className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-bold text-sm">Victory</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="font-bold text-sm">Defeat</span>
                </>
              )}
            </div>
            <div className="flex flex-row border-t border-zinc-700/50 pt-2 mt-1 ">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-zinc-400">
                  {formatGameDuration(match.info.gameDuration)}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatTimestamp(match.info.gameCreation)}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                { !isGamemodeWithoutRoles(match.info.queueId) && (
                  <img
                    src={getRoleIcon(determineRole(playerData))}
                    alt={playerData.lane}
                    className="w-6 h-6"
                  />
                )}
              </div>
            </div>

          </div>

          {/* Champion Icon with Summoner Spells and Runes */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative w-14 h-14 xl:w-16 xl:h-16 rounded-lg overflow-hidden border-2 border-zinc-700 hover:border-orange-500 transition-all">
              <span className="absolute bottom-0 left-0 bg-zinc-900/90 text-white text-xs px-1.5 py-0.5 rounded-tr font-medium">
                {playerData.champLevel}
              </span>
              <img
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${playerData.championId}.png`}
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

            {/* Runes Display */}
            {!arena && primaryKeystone && secondaryTree && (
              <div className="flex flex-col gap-1">
                <div 
                  className="w-6 h-6 xl:w-7 xl:h-7 bg-zinc-800/40  border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative"
                  title={`${getRuneName(primaryKeystone)}: ${getRuneDescription(primaryKeystone)}`}
                >
                  <img
                    src={getRuneIcon(primaryKeystone)}
                    onError={(e) => {
                      e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                    }}
                    alt={getRuneName(primaryKeystone)}
                    className="w-4 h-4 xl:w-5 xl:h-5 object-contain"
                  />
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
                    <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(primaryKeystone)}</p>
                    <p className="text-xs text-zinc-300">{getRuneDescription(primaryKeystone)}</p>
                  </div>
                </div>
                <div 
                  className="w-6 h-6 xl:w-7 xl:h-7 bg-zinc-800/40 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative"
                  title={getRuneTreeName(secondaryTree)}
                >
                  <img
                    src={getRuneTreeIcon(secondaryTree)}
                    alt={getRuneTreeName(secondaryTree)}
                    className="w-3 h-3 xl:w-4 xl:h-4 object-contain"
                  />
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 p-2 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
                    <p className="text-sm font-bold text-orange-400">{getRuneTreeName(secondaryTree)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-0.5 min-w-[100px] shrink-0">
            <span className="text-base xl:text-lg font-bold text-white">
              {playerData.kills} / <span className={playerData.deaths === 0 ? "text-orange-400" : "text-red-500"}>{playerData.deaths}</span> / {playerData.assists}
            </span>
            <span className="text-sm text-zinc-400">
              {kda} KDA
            </span>
          </div>

          {/* Items */}
          <div className="flex gap-0.5 xl:gap-1 shrink-0">
            {arena ? (
              [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5].map((itemId, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 xl:w-7 xl:h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                >
                  {itemId !== 0 && (
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                      alt={`Item ${itemId}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))
            ) : (
              [playerData.item0, playerData.item1, playerData.item2, playerData.item3, playerData.item4, playerData.item5, playerData.item6].map((itemId, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 xl:w-7 xl:h-7 shrink-0 rounded bg-zinc-800/50 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all"
                >
                  {itemId !== 0 && (
                    <img
                      src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                      alt={`Item ${itemId}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* CS & Gold - Hidden on md, shown on lg+ */}
          <div className="hidden lg:flex flex-col gap-0.5 text-right min-w-[80px] shrink-0">
            <span className="text-sm text-zinc-300">
              {csDisplay.totalCS} CS 
            </span>
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

          {/* Arena Augments - Hidden on md, shown on xl+ */}
          {arena && (
            <div className="hidden xl:flex flex-col gap-1 shrink-0">
              <span className="text-xs text-zinc-400">Augments</span>
              <div className="flex flex-wrap gap-1 max-w-[60px]">
                {[playerData.playerAugment1, playerData.playerAugment2, playerData.playerAugment3, playerData.playerAugment4, playerData.playerAugment5].filter(Boolean).map((augmentId, idx) => {
                  const augmentIcon = getArenaAugmentIcon(augmentId);
                  const augmentName = getArenaAugmentName(augmentId);
                  return (
                    <div
                      key={idx}
                      className="w-6 h-6 shrink-0 rounded bg-purple-900/30 border border-purple-700 overflow-hidden hover:border-purple-500 transition-all"
                      title={augmentName}
                    >
                      {augmentIcon ? (
                        <img
                          src={augmentIcon}
                          alt={augmentName}
                          className="w-full h-full object-cover"
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

          {/* Game Info + Multikill */}
          <div className="flex flex-col gap-0.5 text-right min-w-[100px] xl:min-w-[120px] ml-auto shrink-0">
            {lpChange && (
              <span className={`text-sm font-bold shrink-0 ${
                lpChange.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {lpChange}
              </span>
            )}
            {!arena && biggestMultikill && (
              <div className="flex items-center gap-1 px-2 py-0.5 mt-1 bg-orange-600/20 border border-orange-500/40 rounded justify-end ml-auto">
                <Zap className="w-3 h-3 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">{biggestMultikill}</span>
              </div>
            )}
            {firstBloodKill && (              
              <div className="flex items-center gap-1 px-2 py-0.5 my-1 bg-red-600/10 border border-red-500/40 rounded justify-end ml-auto">
                <Droplet className="w-3 h-3 text-red-500" />
                <span className="text-xs font-bold uppercase text-red-500">First Blood</span>
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

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-700/50 bg-zinc-900/30">
          <div className="p-3 sm:p-4">
            {expandedTab === "teams" && (
              <MatchDetailsTab
                match={match}
                summonerPuuid={summonerPuuid}
                playerData={playerData}
                onPlayerClick={onPlayerClick}
              />
            )}

            {!arena && expandedTab === "runes" && primaryStyle && secondaryStyle && (
              <MatchRunesTab
                primaryStyle={primaryStyle}
                secondaryStyle={secondaryStyle}
                statPerks={playerData.perks?.statPerks}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate LP change
function getLPChange(match: Match, playerData: MatchParticipant, rankedData: any[]) {
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
}