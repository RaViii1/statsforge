"use client";

import { useState, useEffect } from "react";
import { Target, Loader2, Zap, User, Clock } from "lucide-react";
import { SummonerData } from "@/app/types/lolInterfaces";
import { 
  getQueueName, 
  isArena,
  formatGamenametoNameandTagline 
} from "@/lib/lol/lolfunctions";
import { getChampionIdByName, getChampionNameById } from "@/lib/champion-data";
import { getSummonerSpellName, getSummonerSpellIcon } from "@/lib/summoner-spells";
import { getRuneIcon, getRuneTreeIcon } from "@/lib/runes";

interface LiveGameTabProps {
  summonerData: SummonerData;
  isInGame: boolean;
  liveGameData: any;
  loading: boolean;
  error?: string | null;
  onRefresh: () => void;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function LiveGameTab({ 
  summonerData, 
  isInGame, 
  liveGameData, 
  loading,
  error,
  onRefresh,
  onPlayerClick 
}: LiveGameTabProps) {
  const isArenaGame = liveGameData && isArena(liveGameData.gameQueueConfigId);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (isInGame && liveGameData?.gameStartTime > 0) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isInGame, liveGameData?.gameStartTime]);

  const getElapsedTime = () => {
    if (!liveGameData?.gameStartTime || liveGameData.gameStartTime <= 0) return "00:00";
    const elapsedMs = currentTime - liveGameData.gameStartTime;
    const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const RunesDisplay = ({ participant }: { participant: any }) => {
    if (!participant.perks || !participant.perks.perkIds) return null;

    const selectedPrimaryRunes = participant.perks.perkIds.slice(0, 4);
    const selectedSecondaryRunes = participant.perks.perkIds.slice(4, 6);
    const secondaryTreeId = participant.perks.perkSubStyle;

    return (
      <div className="flex items-center gap-1.5 ml-2">
        <div className="flex items-center gap-0.5">
          {selectedPrimaryRunes.map((runeId: number, idx: number) => (
            <img
              key={`primary-${runeId}-${idx}`}
              src={getRuneIcon(runeId)}
              alt=""
              className={`${idx === 0 ? 'w-5 h-5' : 'w-4 h-4'} object-contain`}
            />
          ))}
        </div>
        <div className="w-px h-4 bg-zinc-700" />
        <div className="flex items-center gap-0.5">
          <img
            src={getRuneTreeIcon(secondaryTreeId)}
            alt=""
            className="w-4 h-4 object-contain opacity-60"
          />
          {selectedSecondaryRunes.map((runeId: number, idx: number) => (
            <img
              key={`secondary-${runeId}-${idx}`}
              src={getRuneIcon(runeId)}
              alt=""
              className="w-4 h-4 object-contain opacity-80"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
              <Target className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            Live Game Status
          </h2>
          <p className="text-zinc-500 text-sm ml-13">Real-time match data and player insights</p>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={loading}
          className="group px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
              Refresh Feed
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/20 rounded-2xl border border-zinc-800/30">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full animate-ping absolute"></div>
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin relative" />
          </div>
          <p className="mt-8 text-xl font-medium text-white">Scanning Servers</p>
          <p className="text-zinc-500 mt-2">Connecting to Riot Games infrastructure...</p>
        </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-950/20 rounded-2xl border border-red-900/30 text-center px-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Service Temporarily Unavailable</h3>
            <p className="text-zinc-400 max-w-md">{error}</p>
            <button 
              onClick={onRefresh}
              className="mt-8 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all border border-zinc-700"
            >
              Try Again
            </button>
          </div>
        ) : isInGame && liveGameData ? (

        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                <User className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Current Player</p>
                <p className="text-lg font-bold text-white">
                  {summonerData.gameName}<span className="text-orange-500/70">#{summonerData.tagLine}</span>
                </p>
              </div>
            </div>
            <div className="p-5 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                <Target className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Queue Type</p>
                <p className="text-lg font-bold text-white">{getQueueName(liveGameData.gameQueueConfigId)}</p>
              </div>
            </div>
            <div className="p-5 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Time Elapsed</p>
                <p className="text-lg font-bold text-white tabular-nums">{getElapsedTime()}</p>
              </div>
            </div>
          </div>
          
          <div className={isArenaGame ? "grid gap-4" : "grid md:grid-cols-2 gap-8"}>
            {(isArenaGame ? [null] : [100, 200]).map((teamId) => (
              <div key={teamId || 'arena'} className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                    teamId === 100 ? 'text-blue-400' : teamId === 200 ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      teamId === 100 ? 'bg-blue-400' : teamId === 200 ? 'bg-red-400' : 'bg-orange-400'
                    }`} />
                    {teamId === 100 ? 'Blue Team' : teamId === 200 ? 'Red Team' : 'All Participants'}
                  </h3>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    {liveGameData.participants.filter((p: any) => !teamId || p.teamId === teamId).length} Players
                  </span>
                </div>
                
                <div className="space-y-2">
                  {liveGameData.participants
                    .filter((p: any) => !teamId || p.teamId === teamId)
                    .map((participant: any, idx: number) => {
                      const championName = getChampionNameById(participant.championId);
                      const isCurrentPlayer = participant.puuid === summonerData?.puuid;
                      
                      return (
                        <div 
                          key={idx}
                          className={`group relative p-3 rounded-xl transition-all border ${
                            isCurrentPlayer 
                              ? 'bg-orange-500/10 border-orange-500/40' 
                              : 'bg-zinc-900/40 border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${getChampionIdByName(championName)}.png`}
                              alt={championName}
                              className="w-12 h-12 rounded-lg border border-zinc-800"
                            />
                            
                            <div className="flex flex-col gap-1 shrink-0">
                              <img
                                src={getSummonerSpellIcon(participant.spell1Id)}
                                alt={getSummonerSpellName(participant.spell1Id)}
                                className="w-5 h-5 rounded"
                              />
                              <img
                                src={getSummonerSpellIcon(participant.spell2Id)}
                                alt={getSummonerSpellName(participant.spell2Id)}
                                className="w-5 h-5 rounded"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const formatted = formatGamenametoNameandTagline(participant.riotId || "unknown");
                                    if (formatted) {
                                      onPlayerClick(formatted.liveGameParticipantGameName, formatted.liveGameTagLine);
                                    }
                                  }}
                                  className="text-sm font-bold text-white truncate hover:text-orange-500 transition-colors cursor-pointer text-left"
                                >
                                  {participant.riotId?.split('#')[0] || participant.summonerName || championName}
                                </button>
                                {isCurrentPlayer && (
                                  <span className="px-1.5 py-0.5 bg-orange-500 text-[9px] font-black uppercase text-white rounded">YOU</span>
                                )}
                                <RunesDisplay participant={participant} />
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-orange-500/80">{championName}</p>
                                <span className="text-[10px] text-zinc-600">#{participant.riotId?.split('#')[1] || 'RIOT'}</span>
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-zinc-950/20 rounded-3xl border border-zinc-800/30 text-center">
          <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <Target className="w-12 h-12 text-zinc-700" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Active Session Found</h3>
          <p className="text-zinc-500 max-w-sm px-6">
            We couldn't find a live League of Legends match for this account. Make sure you're currently in a loading screen or active game.
          </p>
          <button 
            onClick={onRefresh}
            className="mt-8 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all border border-zinc-700"
          >
            Check Again
          </button>
        </div>
      )}
    </div>
  );
}
