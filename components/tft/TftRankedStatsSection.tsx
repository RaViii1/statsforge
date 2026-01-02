"use client";

import { Trophy } from "lucide-react";
import { getRankIcon, getQueueDisplayName } from "@/lib/tft/tftfunctions";

interface TftRankedStatsSectionProps {
  rankedData: any[];
}

export function TftRankedStatsSection({ rankedData = [] }: TftRankedStatsSectionProps) {
  const desiredQueues = [
    'RANKED_TFT',
    'RANKED_TFT_DOUBLE_UP',
    'RANKED_TFT_TURBO'
  ];

  const sortedData = desiredQueues
    .map(queueType => {
      const entry = rankedData.find((r: any) => r.queueType === queueType);
      if (!entry) return {
        queueType,
        tier: 'UNRANKED',
        rank: '',
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        unranked: true
      };
      return entry;
    });

  if (sortedData.every(r => r.unranked)) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 h-fit backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-orange-500" />
        Ranked Stats
      </h3>
      <div className="space-y-3">
        {sortedData.map((ranked) => {
          if (ranked.unranked) return null;

            const isHyperRoll = ranked.queueType === 'RANKED_TFT_TURBO';
            const tier = isHyperRoll ? (ranked.ratedTier || 'GRAY') : (ranked.tier || 'UNRANKED');
            const rank = isHyperRoll ? '' : (ranked.rank || '');
            const lp = isHyperRoll ? (ranked.ratedRating ?? 0) : (ranked.leaguePoints ?? 0);
            const wins = ranked.wins || 0;
            const losses = ranked.losses || 0;
            const games = wins + losses;
            const winRate = games > 0 ? ((wins / games) * 100).toFixed(1) : "0.0";

          return (
            <div
              key={ranked.queueType}
              className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg hover:border-orange-900/50 hover:bg-zinc-800 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getRankIcon(tier, ranked.queueType)}
                  alt={`${tier} ${rank}`}
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs text-zinc-400 mb-1">
                    {getQueueDisplayName(ranked.queueType)}
                  </h4>
                  <p className="text-lg font-bold text-white uppercase tracking-tight">
                    {tier} {rank}
                  </p>
                  <p><span className="text-sm font-semibold text-green-500">{wins}W</span> <span className="text-sm font-semibold text-red-500">{losses}L</span></p>
                  <p className="text-sm font-semibold text-orange-500">{lp} {isHyperRoll ? 'Points' : 'LP'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-700/50">
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">Played</p>
                  <p className="text-sm font-bold text-white">{games}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 mb-1">WR</p>
                  <p className="text-sm font-bold text-emerald-400">{winRate}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
