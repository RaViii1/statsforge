"use client";

import { Target, Loader2 } from "lucide-react";
import { SummonerData } from "@/app/types/lolInterfaces";
import { 
  getQueueName, 
  isArena,
  formatGamenametoNameandTagline 
} from "@/lib/lol/lolfunctions";
import { getChampionNameById } from "@/lib/champion-data";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneTreeIcon, getRuneTreeName } from "@/lib/runes";

interface LiveGameTabProps {
  summonerData: SummonerData;
  isInGame: boolean;
  liveGameData: any;
  loading: boolean;
  onRefresh: () => void;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function LiveGameTab({ 
  summonerData, 
  isInGame, 
  liveGameData, 
  loading,
  onRefresh,
  onPlayerClick 
}: LiveGameTabProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-orange-500 animate-pulse" />
          Live Game
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Checking for live game...</p>
        </div>
      ) : isInGame && liveGameData ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-950/30 border text-md border-emerald-900/50 rounded-lg flex flex-row items-center justify-center text-bold">
            <span className="text-orange-500">{summonerData.gameName}
            <span className="text-zinc-400">#{summonerData.tagLine}</span></span>
            <p className="text-zinc-300 text-center border-l border-orange-400 px-4 ml-4">
              {getQueueName(liveGameData.gameQueueConfigId)}
            </p>
            <p className="text-zinc-400 text-sm text-center border-l border-orange-400 px-4 ">
              Game Duration: {Math.floor(((Date.now() - liveGameData.gameStartTime) / 1000) / 60)} minutes
            </p>
          </div>
          
          {/* Display all players in live game */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team 100 (Blue) */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-blue-400 flex items-center gap-2">
                Blue Team
              </h3>
              <div className="space-y-2">
                {liveGameData.participants
                  .filter((p: any) => p.teamId === 100)
                  .map((participant: any, idx: number) => {
                    const championName = getChampionNameById(participant.championId);
                    const isCurrentPlayer = participant.puuid === summonerData?.puuid;
                    const isArenaGame = isArena(liveGameData.gameQueueConfigId);
                    
                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg transition-all ${
                          isCurrentPlayer 
                            ? 'bg-orange-950/30 border border-orange-900/30' 
                            : 'bg-zinc-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Champion */}
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`}
                            alt={championName}
                            className="w-12 h-12 rounded"
                          />
                          
                          {/* Summoner Spells */}
                          <div className="flex flex-col gap-1">
                            <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                              <img
                                src={getSummonerSpellIcon(participant.spell1Id)}
                                alt={getSummonerSpellName(participant.spell1Id)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                              <img
                                src={getSummonerSpellIcon(participant.spell2Id)}
                                alt={getSummonerSpellName(participant.spell2Id)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Runes */}
                          {!isArenaGame && participant.perks && (
                            <div className="flex flex-col gap-1">
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <img
                                  src={getRuneTreeIcon(participant.perks.perkStyle)}
                                  alt="Primary Rune"
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <img
                                  src={getRuneTreeIcon(participant.perks.perkSubStyle)}
                                  alt="Secondary Rune"
                                  className="w-3 h-3 object-contain"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {participant.summonerName}
                              {isCurrentPlayer && (
                                <span className="ml-2 text-xs text-orange-500">{summonerData.gameName}
                                <span className="text-zinc-400"> #{summonerData.tagLine}</span></span>
                              )}
                            </p>
                            <button
                              onClick={() => onPlayerClick(formatGamenametoNameandTagline(participant.riotId).liveGameParticipantGameName, formatGamenametoNameandTagline(participant.riotId)?.liveGameTagLine)}
                              className="text-xs font-medium text-white truncate hover:text-orange-500 transition-colors cursor-pointer text-left w-full"
                            >
                              {participant.riotId}
                            </button>
                            <p className="text-xs text-zinc-400">{championName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Team 200 (Red) */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-red-400 flex items-center gap-2">
                Red Team
              </h3>
              <div className="space-y-2">
                {liveGameData.participants
                  .filter((p: any) => p.teamId === 200)
                  .map((participant: any, idx: number) => {
                    const championName = getChampionNameById(participant.championId);
                    const isCurrentPlayer = participant.puuid === summonerData?.puuid;
                    const isArenaGame = isArena(liveGameData.gameQueueConfigId);
                    
                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-lg transition-all ${
                          isCurrentPlayer 
                            ? 'bg-orange-950/30 border border-orange-900/30' 
                            : 'bg-zinc-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Champion */}
                          <img
                            src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/${championName}.png`}
                            alt={championName}
                            className="w-12 h-12 rounded"
                          />
                          
                          {/* Summoner Spells */}
                          <div className="flex flex-col gap-1">
                            <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                              <img
                                src={getSummonerSpellIcon(participant.spell1Id)}
                                alt={getSummonerSpellName(participant.spell1Id)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-6 h-6 rounded border border-zinc-700 overflow-hidden">
                              <img
                                src={getSummonerSpellIcon(participant.spell2Id)}
                                alt={getSummonerSpellName(participant.spell2Id)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Runes */}
                          {!isArenaGame && participant.perks && (
                            <div className="flex flex-col gap-1">
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <img
                                  src={getRuneTreeIcon(participant.perks.perkStyle)}
                                  alt="Primary Rune"
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                <img
                                  src={getRuneTreeIcon(participant.perks.perkSubStyle)}
                                  alt="Secondary Rune"
                                  className="w-3 h-3 object-contain"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {participant.summonerName}
                              {isCurrentPlayer && (
                                <span className="ml-2 text-xs text-orange-500">{summonerData.gameName}
                                <span className="text-zinc-400"> #{summonerData.tagLine}</span></span>
                              )}
                            </p>
                            <button
                              onClick={() => onPlayerClick(formatGamenametoNameandTagline(participant.riotId).liveGameParticipantGameName, formatGamenametoNameandTagline(participant.riotId)?.liveGameTagLine)}
                              className="text-xs font-medium text-white truncate hover:text-orange-500 transition-colors cursor-pointer text-left w-full"
                            >
                              {participant.riotId}
                            </button>
                            <p className="text-xs text-zinc-400">{championName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          <Target className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <p className="text-lg font-medium mb-2">Not in game</p>
          <p className="text-sm">
            This player is not currently in an active game
          </p>
        </div>
      )}
    </div>
  );
}