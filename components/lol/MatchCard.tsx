"use client";

import { useState } from "react";
import { Crown, Swords, XCircle, ChevronDown, ChevronUp, FlameIcon, Star, Flag } from "lucide-react";
import { Match, MatchParticipant } from "@/app/types/lolInterfaces";
import { 
  isRemake, 
  isArena, 
  formatGameDuration, 
  formatTimestamp, 
  getQueueName,
  formatCSDisplay,
  getTeamIcon
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
  const secondaryTree = secondaryStyle?.style;

  const lpChange = getLPChange(match, playerData, rankedData);

  const kda = playerData.deaths === 0 
    ? "Perfect" 
    : ((playerData.kills + playerData.assists) / playerData.deaths).toFixed(2);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setExpandedTab("teams");
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all ${
        remake 
          ? "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50"
          : playerData.win
          ? "bg-emerald-950/30 border-emerald-900/50 hover:border-emerald-800 hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-900/20"
          : "bg-red-950/30 border-red-900/50 hover:border-red-800 hover:bg-red-950/40 hover:shadow-lg hover:shadow-red-900/20"
      }`}
    >
      {/* Main Match Card */}
      <div className="p-4 cursor-pointer" onClick={toggleExpansion}>
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
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative hover:z-100000"
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
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
                      <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(primaryKeystone)}</p>
                      <p className="text-xs text-zinc-300">{getRuneDescription(primaryKeystone)}</p>
                    </div>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all flex items-center justify-center group relative hover:z-100000"
                    title={getRuneTreeName(secondaryTree)}
                  >
                    <img
                      src={getRuneTreeIcon(secondaryTree)}
                      alt={getRuneTreeName(secondaryTree)}
                      className="w-4 h-4 object-contain"
                    />
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
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                        alt={`Item ${itemId}`}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ))}
              </>
            ) : (
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
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${getItemImage(itemId.toString())}`}
                        alt={`Item ${itemId}`}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Arena Augments */}
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
              toggleExpansion();
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
              onClick={() => setExpandedTab("teams")}
              className={`px-4 py-2 font-semibold transition-all relative rounded-t-lg ${
                expandedTab === "teams"
                  ? "text-orange-500 bg-zinc-800/50"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
              }`}
            >
              Match Details
            </button>
            {!arena && (
              <button
                onClick={() => setExpandedTab("runes")}
                className={`px-4 py-2 font-semibold transition-all relative rounded-t-lg ${
                  expandedTab === "runes"
                    ? "text-orange-500 bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/30"
                }`}
              >
                Runes
              </button>
            )}
          </div>

          <div className="p-4 overflow-visible">
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
