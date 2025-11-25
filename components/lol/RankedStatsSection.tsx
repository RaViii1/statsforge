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
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-orange-500" />
        Ranked Stats
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {rankedData.map((ranked) => {
          const winRate = ((ranked.wins / (ranked.wins + ranked.losses)) * 100).toFixed(1);
          return (
            <div
              key={ranked.queueType}
              className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-orange-900/20 transition-all cursor-pointer"
            >
              <span className="text-sm text-zinc-400 mb-3 block text-right">
                {ranked.hotStreak ? (
                  <>
                    Hot streak <FlameIcon className="w-5 h-5 inline-block text-orange-500" />
                  </>
                ) : (
                  ""
                )}
              </span>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getRankIcon(ranked.tier)}
                    alt={`${ranked.tier} ${ranked.rank}`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {getQueueTypeName(ranked.queueType)}
                    </h3>
                    <span className="text-xl font-bold text-white">
                      {ranked.tier} {ranked.rank}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{ranked.leaguePoints} LP</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Wins</p>
                  <p className="text-lg font-bold text-emerald-400">{ranked.wins}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Losses</p>
                  <p className="text-lg font-bold text-red-400">{ranked.losses}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Win Rate</p>
                  <p className="text-lg font-bold text-white">{winRate}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
