"use client";

import { getRankIcon } from "@/lib/lol/lolfunctions";
import { RankedEntry } from "@/app/types/lolInterfaces";

interface RankedIconProps {
  rankedData: RankedEntry | null | undefined;
  isLoading?: boolean;
}

export function RankedIcon({ rankedData, isLoading = false }: RankedIconProps) {
  if (isLoading) {
    return (
      <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 animate-pulse" >
        <img
        src={"https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/unranked.png"}
        alt={"ranked icon loading"}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.src = getRankIcon(undefined);
        }}
      />
        </div>

    );
  }

  const rankIcon = getRankIcon(rankedData?.tier);
  const rankText = rankedData 
    ? `${rankedData.tier} ${rankedData.rank} - ${rankedData.leaguePoints} LP`
    : "Unranked";

  return (
    <div
      className="w-8 h-8 rounded overflow-hidden hover:opacity-70 transition-opacity duration-200 group relative"
      title={rankText}
    >
      <img
        src={rankIcon}
        alt={rankText}
        className="w-full h-full object-contain"
        onError={(e) => {
          e.currentTarget.src = getRankIcon(undefined);
        }}
      />
      
      {/* Tooltip on hover */}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-[9999] whitespace-nowrap p-2 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-xl pointer-events-none">
        <p className="text-xs font-bold text-orange-400">{rankText}</p>
      </div>
    </div>
  );
}