"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Loader2, 
  AlertCircle, 
  BarChart3,
  Clock as ClockIcon,
  Crown,
  ArrowRight,
  Trophy
} from "lucide-react";
import { getItemImage, Item } from "@/lib/items";
import SvgIcon from "../SvgIcon";

// Types
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

interface BuildPathBatch {
  timestamp: number;
  minute: number;
  second: number;
  items: BuildPathItem[];
  totalGold: number;
}

interface PlayerSnapshot {
  timestamp: number;
  minute: number;
  level: number;
  gold: number;
  cs: number;
  totalDamage: number;
  xp: number;
  goldPerMinute?: number;
  csPerMinute?: number;
  damagePerMinute?: number;
}

interface MatchTimelineProps {
  server: string;
  matchId: string;
  participantId?: number;
  puuid?: string;
  items?: Item[];
}

// Premium Card Component
const PremiumCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-orange-500/10 bg-gradient-to-br from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm shadow-2xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
    {children}
  </div>
);

// Premium Section Header
const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: any }) => (
  <div className="flex items-start gap-3 mb-6">
    <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
      <Icon className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
    </div>
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="text-xs text-zinc-500 font-medium mt-0.5">{subtitle}</p>
    </div>
  </div>
);

// Gradient Progress Bar
const ProgressBar = ({ value, max = 100, color = "orange" }: { value: number; max?: number; color?: string }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${color === 'orange' ? 'from-orange-500 to-orange-400' : 'from-purple-500 to-purple-400'} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export function MatchTimeline({ server, matchId, participantId, puuid, items: propItems = [] }: MatchTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(participantId || null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>(propItems);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/lol/lol-items');
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error('Failed to fetch items:', err);
      }
    };
    
    if (propItems.length === 0) {
      fetchItems();
    }
  }, [propItems]);

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
      if (!response.ok) throw new Error('Failed to fetch timeline data');
      const data = await response.json();
      setTimelineData(data);
      if (participantId) setSelectedPlayer(participantId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const extractBuildPath = (participantId: number): BuildPathBatch[] => {
    if (!timelineData) return [];
    const buildPath: BuildPathItem[] = [];
    let previousGold = 0;
    
    timelineData.info.frames.forEach((frame) => {
      const participantFrame = frame.participantFrames[participantId.toString()];
      frame.events.forEach((event) => {
        if (event.type === 'ITEM_PURCHASED' && event.participantId === participantId && event.itemId) {
          const minute = Math.floor(event.timestamp / 60000);
          const second = Math.floor((event.timestamp % 60000) / 1000);
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
      if (participantFrame) previousGold = participantFrame.totalGold;
    });
    
    // Group items within 5 seconds of each other
    const batches: BuildPathBatch[] = [];
    let currentBatch: BuildPathBatch | null = null;
    
    buildPath.forEach((item) => {
      if (!currentBatch) {
        currentBatch = {
          timestamp: item.timestamp,
          minute: item.minute,
          second: item.second,
          items: [item],
          totalGold: item.goldCost,
        };
      } else {
        const timeDifference = (item.timestamp - currentBatch.timestamp) / 1000;
        
        if (timeDifference <= 5) {
          currentBatch.items.push(item);
          currentBatch.totalGold += item.goldCost;
          currentBatch.timestamp = Math.min(currentBatch.timestamp, item.timestamp);
          const earliestMinute = Math.floor(currentBatch.timestamp / 60000);
          const earliestSecond = Math.floor((currentBatch.timestamp % 60000) / 1000);
          currentBatch.minute = earliestMinute;
          currentBatch.second = earliestSecond;
        } else {
          batches.push(currentBatch);
          currentBatch = {
            timestamp: item.timestamp,
            minute: item.minute,
            second: item.second,
            items: [item],
            totalGold: item.goldCost,
          };
        }
      }
    });
    
    if (currentBatch) {
      batches.push(currentBatch);
    }
    
    return batches;
  };

  const getItemDetails = (id: string | number) => {
    const item = items?.find((i: Item) => i.id === String(id));
    return { 
      name: item?.name ?? `Item ${id}`, 
      description: item?.description ?? '',
      imagePath: item?.image_path ?? null
    };
  };

  const extractPlayerSnapshots = (participantId: number): PlayerSnapshot[] => {
    if (!timelineData) return [];
    const snapshots: PlayerSnapshot[] = [];
    
    const lastFrame = timelineData.info.frames[timelineData.info.frames.length - 1];
    const gameDurationMinutes = Math.floor(lastFrame.timestamp / 60000);
    
    const intervals: number[] = [];
    for (let i = 5; i <= gameDurationMinutes; i += 5) {
      intervals.push(i);
    }
    
    const lastFrameMinute = Math.floor(lastFrame.timestamp / 60000);
    if (!intervals.includes(lastFrameMinute) && lastFrameMinute > 0) {
      intervals.push(lastFrameMinute);
    }
    
    intervals.forEach((targetMinute) => {
      const targetTimestamp = targetMinute * 60000;
      let closestFrame = null;
      let closestDiff = Infinity;
      
      for (const frame of timelineData.info.frames) {
        const diff = Math.abs(frame.timestamp - targetTimestamp);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestFrame = frame;
        }
      }
      
      if (closestFrame) {
        const participantFrame = closestFrame.participantFrames[participantId.toString()];
        if (participantFrame) {
          const cs = participantFrame.minionsKilled + participantFrame.jungleMinionsKilled;
          const gold = participantFrame.totalGold;
          const damage = participantFrame.damageStats?.totalDamageDoneToChampions || 0;
          const minute = Math.floor(closestFrame.timestamp / 60000);
          
          snapshots.push({
            timestamp: closestFrame.timestamp,
            minute,
            level: participantFrame.level,
            gold,
            cs,
            totalDamage: damage,
            xp: participantFrame.xp,
            goldPerMinute: minute > 0 ? gold / minute : 0,
            csPerMinute: minute > 0 ? cs / minute : 0,
            damagePerMinute: minute > 0 ? damage / minute : 0,
          });
        }
      }
    });
    
    const uniqueSnapshots = snapshots.sort((a, b) => a.minute - b.minute);
    
    const finalFrame = timelineData.info.frames[timelineData.info.frames.length - 1];
    const finalParticipantFrame = finalFrame.participantFrames[participantId.toString()];
    const finalMinute = Math.floor(finalFrame.timestamp / 60000);
    const hasFinal = uniqueSnapshots.some(s => s.minute === finalMinute);
    
    if (!hasFinal && finalParticipantFrame) {
      const finalCs = finalParticipantFrame.minionsKilled + finalParticipantFrame.jungleMinionsKilled;
      const finalGold = finalParticipantFrame.totalGold;
      const finalDamage = finalParticipantFrame.damageStats?.totalDamageDoneToChampions || 0;
      
      uniqueSnapshots.push({
        timestamp: finalFrame.timestamp,
        minute: finalMinute,
        level: finalParticipantFrame.level,
        gold: finalGold,
        cs: finalCs,
        totalDamage: finalDamage,
        xp: finalParticipantFrame.xp,
        goldPerMinute: finalMinute > 0 ? finalGold / finalMinute : 0,
        csPerMinute: finalMinute > 0 ? finalCs / finalMinute : 0,
        damagePerMinute: finalMinute > 0 ? finalDamage / finalMinute : 0,
      });
      
      uniqueSnapshots.sort((a, b) => a.minute - b.minute);
    }
    
    return uniqueSnapshots;
  };

  const extractKeyEvents = (participantId: number) => {
    if (!timelineData) return { kills: 0, deaths: 0, assists: 0, objectives: [] };
    
    let kills = 0, deaths = 0, assists = 0;
    const objectives: Array<{ type: string; minute: number }> = [];
    
    timelineData.info.frames.forEach((frame) => {
      frame.events.forEach((event) => {
        const minute = Math.floor(event.timestamp / 60000);
        if (event.type === 'CHAMPION_KILL') {
          if (event.killerId === participantId) kills++;
          if (event.victimId === participantId) deaths++;
          if (event.assistingParticipantIds?.includes(participantId)) assists++;
        }
        if (event.type === 'ELITE_MONSTER_KILL' && event.killerId === participantId) {
          objectives.push({ type: event.monsterType || 'UNKNOWN', minute });
        }
        if (event.type === 'BUILDING_KILL' && event.killerId === participantId) {
          objectives.push({ type: 'TURRET', minute });
        }
      });
    });
    
    return { kills, deaths, assists, objectives };
  };

  if (loading) {
    return (
      <PremiumCard className="min-h-[400px]">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" strokeWidth={1.5} />
            <div className="absolute inset-0 animate-pulse rounded-full bg-orange-500/20 blur-xl" />
          </div>
          <p className="text-zinc-500 font-medium mt-6">Loading timeline data...</p>
        </div>
      </PremiumCard>
    );
  }

  if (error) {
    return (
      <PremiumCard>
        <div className="p-8 text-center">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <AlertCircle className="h-6 w-6 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-lg text-white mb-2">Unable to Load Timeline</h3>
          <p className="text-sm text-zinc-500">{error}</p>
        </div>
      </PremiumCard>
    );
  }

  if (!timelineData || !selectedPlayer) {
    return (
      <PremiumCard>
        <div className="p-8 text-center">
          <p className="text-zinc-500">No timeline data available</p>
        </div>
      </PremiumCard>
    );
  }

  const buildPathBatches = extractBuildPath(selectedPlayer);
  const snapshots = extractPlayerSnapshots(selectedPlayer);
  const keyEvents = extractKeyEvents(selectedPlayer);
  const totalStats = snapshots[snapshots.length - 1] || { gold: 0, cs: 0, totalDamage: 0, minute: 1 };

  return (
    <div className="space-y-5">
      {/* Objectives Timeline Section */}
      <PremiumCard>
        <div className="p-6">
          {keyEvents.objectives.length > 0 && (
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 shadow-lg">
                  <Crown className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-white">Objectives Timeline</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">Neutral objectives and structures secured</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {keyEvents.objectives.map((obj, idx) => {
                  const getObjectiveIcon = (type: string) => {
                    switch(type) {
                      case 'BARON_NASHOR': return <SvgIcon size={12} type="baron" className="text-white" />;
                      case 'DRAGON': return <SvgIcon size={12} type="dragon" className="text-white" />;
                      case 'RIFT_HERALD': return <SvgIcon size={12} type="herald" className="text-white" />;
                      case 'TURRET': return <SvgIcon size={12} type="tower" className="text-white" />;
                      default: return <SvgIcon size={12} type="dmgamp" className="text-white" />;
                    }
                  };
                  
                  const getDisplayName = (type: string) => {
                    switch(type) {
                      case 'BARON_NASHOR': return 'Baron';
                      case 'DRAGON': return 'Dragon';
                      case 'RIFT_HERALD': return 'Herald';
                      case 'TURRET': return 'Turret';
                      default: return type;
                    }
                  };
                  
                  return (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 hover:bg-orange-500/15 transition-all duration-200"
                    >
                      {getObjectiveIcon(obj.type)}
                      <span className="text-xs font-bold text-orange-400">{getDisplayName(obj.type)}</span>
                      <span className="text-xs text-zinc-500 tabular-nums">{obj.minute}:00</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </PremiumCard>

      {/* Build Path with Arrows and Batch Gold Display */}
      <PremiumCard>
        <div className="p-6">
          <SectionHeader title="Item Progression" subtitle="Purchase timeline and gold investment" icon={ShoppingBag} />
          
          {buildPathBatches.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">No item purchases recorded</div>
          ) : (
            <div className="space-y-8">
              {Array.from({ length: Math.ceil(buildPathBatches.length / 4) }).map((_, rowIndex) => {
                const startIdx = rowIndex * 4;
                const rowBatches = buildPathBatches.slice(startIdx, startIdx + 4);
                
                return (
                  <div key={rowIndex} className="relative">
                    <div className="grid grid-cols-4 gap-8">
                      {rowBatches.map((batch, colIndex) => {
                        const globalIdx = startIdx + colIndex;
                        const isLastInRow = colIndex === rowBatches.length - 1;
                        
                        return (
                          <div key={globalIdx} className="relative group">
                            {!isLastInRow && (
                              <div className="absolute top-1/2 -translate-y-1/2 left-full z-10 -ml-4">
                                <div className="flex flex-col items-center">
                                  <div className="mb-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 shadow-sm">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-bold text-orange-300 whitespace-nowrap">
                                        {batch.totalGold}
                                      </span>
                                      <SvgIcon size={10} type="gold" className="text-amber-400" />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5 text-orange-500/70 drop-shadow-md" strokeWidth={2.5} />
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="relative">
                              <div className="text-center mb-2">
                                <div className="text-[10px] font-mono font-semibold text-orange-400 bg-orange-500/10 inline-block px-2 py-0.5 rounded-md border border-orange-500/30">
                                  {batch.minute}:{batch.second.toString().padStart(2, '0')}
                                </div>
                              </div>
                              
                              <div className={`flex flex-wrap justify-center gap-1 ${batch.items.length === 1 ? 'justify-center' : ''}`}>
                                {batch.items.map((item, itemIdx) => {
                                  const { name, description, imagePath } = getItemDetails(item.itemId);
                                  const uniqueKey = `${globalIdx}-${itemIdx}`;
                                  const isFirstInBatch = itemIdx === 0;
                                  
                                  return (
                                    <div
                                      key={uniqueKey}
                                      className="relative group/item"
                                      onMouseEnter={() => setHoveredItem(globalIdx * 10 + itemIdx)}
                                      onMouseLeave={() => setHoveredItem(null)}
                                    >
                                      <div className="relative">
                                        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-orange-500/30 hover:border-orange-500 transition-all duration-300 overflow-hidden shadow-md cursor-pointer hover:scale-105">
                                          <img
                                            src={getItemImage(imagePath)}
                                            alt={name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src = "/images/noitem.png";
                                            }}
                                          />
                                          
                                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/40 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                          <div className="absolute -top-1 -right-1 px-1 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-[7px] font-bold text-white shadow-lg border border-orange-400/30">
                                            {item.goldCost}g
                                          </div>
                                        </div>
                                        
                                        {isFirstInBatch && (
                                          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-zinc-900 border-1 border-orange-500/50 flex items-center justify-center shadow-md z-[100]">
                                            <span className="text-[8px] font-bold text-orange-400">{globalIdx + 1}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {hoveredItem === globalIdx * 10 + itemIdx && (
                                        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 rounded-lg bg-zinc-900 border border-orange-500/40 shadow-2xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none backdrop-blur-sm">
                                          <p className="text-xs font-bold text-orange-400 mb-1">{name}</p>
                                          <p className="text-[10px] text-zinc-300 leading-relaxed line-clamp-3">
                                            {description}
                                          </p>
                                          <div className="mt-1.5 pt-1 border-t border-orange-500/30">
                                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                                              <span>Cost:</span>
                                              <div className="flex items-center gap-0.5">
                                                <SvgIcon size={10} type="gold" className="text-amber-400" />
                                                <span className="text-orange-400 font-semibold">{item.goldCost}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {batch.items.length > 1 && (
                                <div className="text-center mt-2">
                                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/5 border border-orange-500/20">
                                    <SvgIcon size={8} type="gold" className="text-amber-400" />
                                    <span className="text-[7px] font-semibold text-orange-400">
                                      Total: {batch.totalGold}g
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {rowBatches.length < 4 && (
                        <>
                          {Array.from({ length: 4 - rowBatches.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="opacity-0 pointer-events-none" />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 pt-4 border-t border-orange-500/15">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/5 border border-orange-500/20">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Total Gold Spent:</span>
                    <span className="flex flex-row gap-1 items-center text-sm font-bold text-orange-400">
                      {buildPathBatches.reduce((sum, batch) => sum + batch.totalGold, 0)}
                      <SvgIcon size={14} type="gold" className="text-amber-400" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PremiumCard>

      {/* Performance Analytics */}
      <PremiumCard>
        <div className="p-6">
          <SectionHeader title="Performance Analytics" subtitle="Key metrics at 5-minute intervals" icon={BarChart3} />
          
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              <div className="grid grid-cols-6 gap-3 mb-3 px-2">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Level</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gold</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CS</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gold/Min</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CS/Min</div>
              </div>
              
              <div className="space-y-2">
                {snapshots.map((snapshot, idx) => {
                  const isFinal = idx === snapshots.length - 1 && snapshot.minute !== 5 && snapshot.minute !== 10 && snapshot.minute !== 15 && snapshot.minute !== 20 && snapshot.minute !== 25 && snapshot.minute !== 30;
                  
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-6 gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isFinal 
                          ? 'bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40' 
                          : 'bg-zinc-800/20 border border-orange-500/5 hover:border-orange-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isFinal ? (
                          <Trophy className="w-3 h-3 text-orange-500" strokeWidth={1.5} />
                        ) : (
                          <ClockIcon className="w-3 h-3 text-orange-500" strokeWidth={1.5} />
                        )}
                        <span className="text-sm font-mono text-white">
                          {isFinal ? `${snapshot.minute}:00` : `${snapshot.minute}:00`}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-orange-400">{snapshot.level}</div>
                      <div className="text-sm font-mono text-white">{(snapshot.gold / 1000).toFixed(1)}k</div>
                      <div className="text-sm font-mono text-white">{snapshot.cs}</div>
                      <div className="text-sm font-mono text-white">{Math.round(snapshot.goldPerMinute || 0)}</div>
                      <div className="text-sm font-mono text-white">{(snapshot.csPerMinute || 0).toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-orange-500/10">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">Gold Efficiency</span>
                  <span className="text-xs font-mono text-white">
                    {Math.round((totalStats.gold / 1000) / (totalStats.minute / 10))}k/10min
                  </span>
                </div>
                <ProgressBar value={totalStats.gold / 1000} max={30} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">CS Efficiency</span>
                  <span className="text-xs font-mono text-white">{Math.round(totalStats.cs / (totalStats.minute / 10))}/10min</span>
                </div>
                <ProgressBar value={totalStats.cs / 100} max={10} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">Damage Share</span>
                  <span className="text-xs font-mono text-white">{(totalStats.totalDamage / 1000).toFixed(0)}k</span>
                </div>
                <ProgressBar value={totalStats.totalDamage / 1000} max={50} />
              </div>
            </div>
          </div>
        </div>
      </PremiumCard>
    </div>
  );
}