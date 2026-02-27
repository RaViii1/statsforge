"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingCart, 
  Loader2, 
  AlertCircle, 
  TrendingUp,
  Coins,
  Zap,
  Clock,
  Swords,
  Target,
  Trophy,
  Skull,
  Shield
} from "lucide-react";
import { getItemImage, getItemDescription } from "@/lib/items";

interface MatchTimelineProps {
  server: string;
  matchId: string;
  participantId?: number; // 1-10, if specified shows only this player
  puuid?: string; // Alternative way to specify player
}

interface TimelineFrame {
  timestamp: number;
  participantFrames: {
    [key: string]: {
      championStats: any;
      currentGold: number;
      damageStats: any;
      goldPerSecond: number;
      jungleMinionsKilled: number;
      level: number;
      minionsKilled: number;
      participantId: number;
      position: { x: number; y: number };
      totalGold: number;
      xp: number;
    };
  };
  events: Array<{
    type: string;
    timestamp: number;
    participantId?: number;
    itemId?: number;
    afterId?: number;
    beforeId?: number;
    killerId?: number;
    victimId?: number;
    assistingParticipantIds?: number[];
    monsterType?: string;
    monsterSubType?: string;
    position?: { x: number; y: number };
  }>;
}

interface TimelineData {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    frameInterval: number;
    frames: TimelineFrame[];
    participants: Array<{
      participantId: number;
      puuid: string;
    }>;
  };
}

interface BuildPathItem {
  itemId: number;
  timestamp: number;
  minute: number;
  second: number;
  goldCost: number;
}

interface PlayerSnapshot {
  timestamp: number;
  minute: number;
  level: number;
  gold: number;
  cs: number;
  totalDamage: number;
  xp: number;
}

export function MatchTimeline({ server, matchId, participantId, puuid }: MatchTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(participantId || null);

  useEffect(() => {
    fetchTimeline();
  }, [server, matchId]);

  useEffect(() => {
    if (puuid && timelineData) {
      const participant = timelineData.info.participants.find(p => p.puuid === puuid);
      if (participant) {
        setSelectedPlayer(participant.participantId);
      }
    }
  }, [puuid, timelineData]);

  const fetchTimeline = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lol/matches/${server}/timeline/${matchId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      
      const data = await response.json();
      setTimelineData(data);
      
      // If participantId provided, set it
      if (participantId) {
        setSelectedPlayer(participantId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const extractBuildPath = (participantId: number): BuildPathItem[] => {
    if (!timelineData) return [];
    
    const buildPath: BuildPathItem[] = [];
    let previousGold = 0;
    
    timelineData.info.frames.forEach((frame) => {
      const participantFrame = frame.participantFrames[participantId.toString()];
      
      frame.events.forEach((event) => {
        if (
          event.type === 'ITEM_PURCHASED' && 
          event.participantId === participantId &&
          event.itemId
        ) {
          const minute = Math.floor(event.timestamp / 60000);
          const second = Math.floor((event.timestamp % 60000) / 1000);
          
          // Calculate actual gold cost
          const totalGoldBefore = previousGold || participantFrame?.totalGold || 0;
          const totalGoldAfter = participantFrame?.totalGold || 0;
          const goldCost = Math.max(0, totalGoldBefore - totalGoldAfter);
          
          buildPath.push({
            itemId: event.itemId,
            timestamp: event.timestamp,
            minute,
            second,
            goldCost,
          });
        }
      });
      
      // Update previous gold for next iteration
      if (participantFrame) {
        previousGold = participantFrame.totalGold;
      }
    });
    
    return buildPath;
  };

  const extractPlayerSnapshots = (participantId: number): PlayerSnapshot[] => {
    if (!timelineData) return [];
    
    const snapshots: PlayerSnapshot[] = [];
    
    // Take snapshots every 5 minutes
    const intervals = [5, 10, 15, 20, 25, 30];
    
    timelineData.info.frames.forEach((frame) => {
      const minute = Math.floor(frame.timestamp / 60000);
      
      if (intervals.includes(minute)) {
        const participantFrame = frame.participantFrames[participantId.toString()];
        
        if (participantFrame) {
          snapshots.push({
            timestamp: frame.timestamp,
            minute,
            level: participantFrame.level,
            gold: participantFrame.totalGold,
            cs: participantFrame.minionsKilled + participantFrame.jungleMinionsKilled,
            totalDamage: participantFrame.damageStats?.totalDamageDoneToChampions || 0,
            xp: participantFrame.xp,
          });
        }
      }
    });
    
    return snapshots;
  };

  const extractKeyEvents = (participantId: number) => {
    if (!timelineData) return { kills: 0, deaths: 0, assists: 0, objectives: [] };
    
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    const objectives: Array<{ type: string; minute: number }> = [];
    
    timelineData.info.frames.forEach((frame) => {
      frame.events.forEach((event) => {
        const minute = Math.floor(event.timestamp / 60000);
        
        // Kills
        if (event.type === 'CHAMPION_KILL') {
          if (event.killerId === participantId) kills++;
          if (event.victimId === participantId) deaths++;
          if (event.assistingParticipantIds?.includes(participantId)) assists++;
        }
        
        // Elite monster kills
        if (
          event.type === 'ELITE_MONSTER_KILL' && 
          event.killerId === participantId
        ) {
          objectives.push({
            type: event.monsterType || 'UNKNOWN',
            minute,
          });
        }
        
        // Building kills
        if (
          event.type === 'BUILDING_KILL' && 
          event.killerId === participantId
        ) {
          objectives.push({
            type: 'TURRET',
            minute,
          });
        }
      });
    });
    
    return { kills, deaths, assists, objectives };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-zinc-900/50 rounded-xl border border-zinc-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">Loading match timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
        <div className="flex items-center gap-3 text-red-400">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Failed to Load Timeline</h3>
            <p className="text-sm text-zinc-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!timelineData || !selectedPlayer) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <p className="text-zinc-400">No timeline data available</p>
      </div>
    );
  }

  const buildPath = extractBuildPath(selectedPlayer);
  const snapshots = extractPlayerSnapshots(selectedPlayer);
  const keyEvents = extractKeyEvents(selectedPlayer);

  return (
    <div className="space-y-4">
      {/* Build Path Section - More Compact */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-orange-950/50 border border-orange-900/30">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Build Path</h3>
            <p className="text-xs text-zinc-500">Item purchases during the game</p>
          </div>
        </div>

        {buildPath.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-sm">
            No item purchases recorded
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {buildPath.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                {/* Item image */}
                <div className="group relative w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden hover:border-orange-500 transition-all hover:scale-105">
                  <img
                    src={getItemImage(item.itemId.toString())}

                    alt={getItemDescription(item.itemId.toString())}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Order badge */}
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-orange-500 border border-zinc-900 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{idx + 1}</span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="bg-zinc-900 border border-orange-500/60 rounded-lg p-2 shadow-2xl min-w-[160px]">
                      <p className="text-xs font-bold text-orange-400 mb-0.5">
                        {getItemDescription(item.itemId.toString())}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        Cost: {item.goldCost}g
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Timestamp and cost */}
                <div className="text-center w-full">
                  <div className="text-[10px] font-bold text-white tabular-nums">
                    {item.minute}:{item.second.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[10px] text-orange-400 font-medium tabular-nums">
                    {item.goldCost}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Statistics Over Time - More Compact */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-purple-950/50 border border-purple-900/30">
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Performance Over Time</h3>
            <p className="text-xs text-zinc-500">Statistics at 5-minute intervals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {snapshots.map((snapshot, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all"
            >
              {/* Minute header */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span className="text-sm font-bold text-white tabular-nums">{snapshot.minute}m</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-orange-950/30 border border-orange-900/30">
                  <span className="text-[10px] font-bold text-orange-400">Lv{snapshot.level}</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] text-zinc-500">Gold</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">
                    {(snapshot.gold / 1000).toFixed(1)}k
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-green-400" />
                    <span className="text-[10px] text-zinc-500">CS</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">{snapshot.cs}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Swords className="w-3 h-3 text-red-400" />
                    <span className="text-[10px] text-zinc-500">DMG</span>
                  </div>
                  <span className="text-xs font-bold text-white tabular-nums">
                    {(snapshot.totalDamage / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Events Summary - More Compact */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-green-950/50 border border-green-900/30">
            <Trophy className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Match Summary</h3>
            <p className="text-xs text-zinc-500">KDA and objectives</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* KDA Summary */}
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Swords className="w-4 h-4 text-green-500" />
              <span className="text-xs font-semibold text-zinc-500">Kills</span>
            </div>
            <div className="text-2xl font-bold text-green-400 tabular-nums">{keyEvents.kills}</div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Skull className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-zinc-500">Deaths</span>
            </div>
            <div className="text-2xl font-bold text-red-400 tabular-nums">{keyEvents.deaths}</div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-zinc-500">Assists</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 tabular-nums">{keyEvents.assists}</div>
          </div>

          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-zinc-500">Objectives</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 tabular-nums">
              {keyEvents.objectives.length}
            </div>
          </div>
        </div>

        {/* Objectives Timeline */}
        {keyEvents.objectives.length > 0 && (
          <div className="pt-3 border-t border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Objective Timeline
            </h4>
            <div className="flex flex-wrap gap-2">
              {keyEvents.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-md bg-purple-950/30 border border-purple-900/50 flex items-center gap-1.5"
                >
                  <Trophy className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-semibold text-white">{obj.type}</span>
                  <span className="text-[10px] text-zinc-500 tabular-nums">@{obj.minute}m</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}