"use client";

import { Trophy, FlameIcon } from "lucide-react";
import { RankedEntry } from "@/app/types/lolInterfaces";
import { getQueueTypeName, getRankIcon } from "@/lib/lol/lolfunctions";

interface RankedStatsSectionProps {
  rankedData: RankedEntry[];
}

export function RankedStatsSection({ rankedData }: RankedStatsSectionProps) {
  if (rankedData.length === 0) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 h-fit">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 border-l-2 px-2 border-orange-500">
        Ranked Stats
      </h3>
      <div className="space-y-3">
        {rankedData.map((ranked) => {
          const winRate = ((ranked.wins / (ranked.wins + ranked.losses)) * 100).toFixed(1);
          return (
            <div
              key={ranked.queueType}
              className="p-4 rounded-lg "
            >
              {ranked.hotStreak && (
                <div className="flex items-center justify-end gap-1 text-xs text-orange-400 mb-2">
                  <FlameIcon className="w-4 h-4" />
                  <span>Hot Streak</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getRankIcon(ranked.tier)}
                  alt={`${ranked.tier} ${ranked.rank}`}
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs text-zinc-400 mb-1">
                    {getQueueTypeName(ranked.queueType)}
                  </h4>
                  <p className="text-lg font-bold text-white">
                    {ranked.tier} {ranked.rank}
                  </p>
                  <p className="text-sm font-semibold text-orange-500">{ranked.leaguePoints} LP</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-700/50">
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Wins</p>
                  <p className="text-sm font-bold text-emerald-400">{ranked.wins}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Losses</p>
                  <p className="text-sm font-bold text-red-400">{ranked.losses}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">WR</p>
                  <p className="text-sm font-bold text-white">{winRate}%</p>
                </div>
              </div>
            </div>
          );
        }).reverse()}
      </div>
    </div>
  );
}