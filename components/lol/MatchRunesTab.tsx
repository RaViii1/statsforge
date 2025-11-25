"use client";

import { getRuneName, getRuneDescription, getRuneIcon, getRuneTreeName, getRuneTreeIcon, getRunesForTree, STAT_SHARDS_GRID } from "@/lib/runes";

interface MatchRunesTabProps {
  primaryStyle: any;
  secondaryStyle: any;
  statPerks: any;
}

export function MatchRunesTab({ primaryStyle, secondaryStyle, statPerks }: MatchRunesTabProps) {
  // Get all selected runes
  const selectedPrimaryRunes = primaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
  const selectedSecondaryRunes = secondaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
  const allSelectedRunes = [...selectedPrimaryRunes, ...selectedSecondaryRunes];
  
  const selectedStatPerksByRow = [
    statPerks?.offense ?? 0,
    statPerks?.flex ?? 0,
    statPerks?.defense ?? 0,
  ];

  return (
    <div className="overflow-visible flex md:flex-row flex-col items-center md:items-stretch md:justify-evenly gap-6">
      {/* Primary Rune Tree */}
      <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-visible min-w-1/3 max-w-1/2 h-max">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={getRuneTreeIcon(primaryStyle.style)}
            alt={getRuneTreeName(primaryStyle.style)}
            className="w-8 h-8 object-contain"
          />
          <h4 className="text-lg font-bold text-orange-400">
            {getRuneTreeName(primaryStyle.style)} (Primary)
          </h4>
        </div>
        <div className="grid gap-6 overflow-visible">
          {getRunesForTree(primaryStyle.style).map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center gap-4 overflow-visible">
              {row.map((runeId) => {
                const isSelected = allSelectedRunes.includes(runeId);
                return (
                  <div
                    key={runeId}
                    className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 transition-all overflow-visible hover:z-100000 ${
                      isSelected
                        ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/50 scale-110'
                        : 'border-2 border-zinc-700 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getRuneIcon(runeId)}
                      onError={(e) => {
                        e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                      }}
                      alt={getRuneName(runeId)}
                      className={rowIdx === 0 ? "w-10 h-10 object-contain" : "w-8 h-8 object-contain"}
                    />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                      <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(runeId)}</p>
                      <p className="text-xs text-zinc-300">{getRuneDescription(runeId)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Rune Tree */}
      <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg overflow-visible min-w-1/3 max-w-1/2">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={getRuneTreeIcon(secondaryStyle.style)}
            alt={getRuneTreeName(secondaryStyle.style)}
            className="w-8 h-8 object-contain"
          />
          <h4 className="text-lg font-bold text-orange-400">
            {getRuneTreeName(secondaryStyle.style)} (Secondary)
          </h4>
        </div>
        <div className="grid gap-6 overflow-visible">
          {getRunesForTree(secondaryStyle.style).slice(1).map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center gap-4 overflow-visible">
              {row.map((runeId) => {
                const isSelected = allSelectedRunes.includes(runeId);
                return (
                  <div
                    key={runeId}
                    className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 transition-all overflow-visible hover:z-99 ${
                      isSelected
                        ? 'border-2 border-orange-500 shadow-lg shadow-orange-500/50 scale-110'
                        : 'border-2 border-zinc-700 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getRuneIcon(runeId)}
                      onError={(e) => {
                        e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                      }}
                      alt={getRuneName(runeId)}
                      className="w-8 h-8 object-contain"
                    />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                      <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(runeId)}</p>
                      <p className="text-xs text-zinc-300">{getRuneDescription(runeId)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Stat Shards */}
        <div className="mt-6 pt-6 border-t border-zinc-700 z-10">
          <div className="space-y-2">
            {STAT_SHARDS_GRID.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-6">
                {row.map((shardId) => {
                  const isSelected = selectedStatPerksByRow[rowIdx] === shardId;
                  return (
                    <div
                      key={shardId}
                      className={`group relative w-8 h-8 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-2 border-orange-500 bg-orange-950/30 scale-105 z-10'
                          : 'border border-zinc-700 bg-zinc-900 opacity-40 hover:opacity-100 z-10'
                      }`}
                    >
                      <img
                        src={getRuneIcon(shardId)}
                        onError={(e) => {
                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                        }}
                        alt={getRuneName(shardId)}
                        className="w-5 h-5 object-contain"
                      />
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-99999 w-64 p-3 bg-zinc-900 border border-orange-500/50 rounded-lg shadow-2xl pointer-events-none">
                        <p className="text-sm font-bold text-orange-400 mb-1">{getRuneName(shardId)}</p>
                        <p className="text-xs text-zinc-300">{getRuneDescription(shardId)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
