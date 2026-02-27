"use client";

import { Trophy, Loader2, Search } from "lucide-react";
import { ChampionMastery } from "@/app/types/lolInterfaces";
import { getChampionNameById } from "@/lib/champion-data";

interface ChampionMasteryTabProps {
  championMastery: ChampionMastery[];
  loading: boolean;
}

export function ChampionMasteryTab({ championMastery, loading }: ChampionMasteryTabProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-orange-500" />
        Champion Mastery
      </h2>
      
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading champion mastery...</p>
        </div>
      ) : championMastery.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {championMastery.map((mastery) => {
            const championName = getChampionNameById(mastery.championId);
            return (
              <div
                key={mastery.championId}
                className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-orange-900/50 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-orange-900/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`${mastery.championId}.png`}
                    alt={championName}
                    className="w-12 h-12 rounded hover:scale-110 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = `/images/lol/default.png`;
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{championName}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-orange-500 font-bold">
                        Level {mastery.championLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">
                    {mastery.championPoints.toLocaleString()} points
                  </p>
                  {mastery.championLevel < 7 && (
                    <p className="text-xs text-zinc-500">
                      {mastery.championPointsUntilNextLevel.toLocaleString()} to next level
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <p className="text-lg font-medium mb-2">No mastery data</p>
          <p className="text-sm">
            This player hasn't earned champion mastery yet
          </p>
        </div>
      )}
    </div>
  );
}
