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
    <div className="grid md:grid-cols-2 gap-6">
      {/* Primary Rune Tree */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <img
            src={getRuneTreeIcon(primaryStyle.style)}
            alt={getRuneTreeName(primaryStyle.style)}
            className="w-7 h-7 object-contain"
          />
          <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
            {getRuneTreeName(primaryStyle.style)}
          </h4>
          <span className="text-xs text-zinc-500 font-medium">Primary</span>
        </div>

        {/* Rune Rows */}
        <div className="space-y-6 px-4">
          {getRunesForTree(primaryStyle.style).map((row, rowIdx) => (
            <div 
              key={rowIdx} 
              className={`flex items-center justify-center gap-4 ${rowIdx === 0 ? 'pb-6 border-b border-zinc-800' : ''}`}
            >
              {row.map((runeId) => {
                const isSelected = allSelectedRunes.includes(runeId);
                const isKeystone = rowIdx === 0;
                return (
                  <div
                    key={runeId}
                    className="group relative"
                  >
                    {/* Rune Container - opacity applied here only */}
                    <div
                      className={`flex items-center justify-center transition-opacity ${
                        isKeystone ? 'w-16 h-16' : 'w-12 h-12'
                      } ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-30 group-hover:opacity-60'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className={`absolute inset-0 border-2 border-orange-500 rounded-lg`}></div>
                      )}
                      
                      <img
                        src={getRuneIcon(runeId)}
                        onError={(e) => {
                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                        }}
                        alt={getRuneName(runeId)}
                        className={`object-contain ${isKeystone ? 'w-14 h-14' : 'w-10 h-10'}`}
                      />
                    </div>
                    
                    {/* Tooltip - outside opacity container */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                      <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">{getRuneName(runeId)}</p>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{getRuneDescription(runeId)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Rune Tree + Stat Shards */}
      <div className="space-y-4">
        {/* Secondary Tree Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <img
            src={getRuneTreeIcon(secondaryStyle.style)}
            alt={getRuneTreeName(secondaryStyle.style)}
            className="w-7 h-7 object-contain"
          />
          <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
            {getRuneTreeName(secondaryStyle.style)}
          </h4>
          <span className="text-xs text-zinc-500 font-medium">Secondary</span>
        </div>


        <div className="space-y-6 px-4">
          {getRunesForTree(secondaryStyle.style).slice(1).map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center gap-4">
              {row.map((runeId) => {
                const isSelected = allSelectedRunes.includes(runeId);
                return (
                  <div
                    key={runeId}
                    className="group relative"
                  >
                    {/* Rune Container - opacity applied here only */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 transition-opacity ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-30 group-hover:opacity-60'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 border-2 border-orange-500 rounded-lg"></div>
                      )}
                      
                      <img
                        src={getRuneIcon(runeId)}
                        onError={(e) => {
                          e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                        }}
                        alt={getRuneName(runeId)}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                    
                    
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                      <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">{getRuneName(runeId)}</p>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{getRuneDescription(runeId)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Stat Shards Section */}
        <div className="pt-6 border-t border-zinc-800">
          <div className="px-4 mb-4">
            <h5 className="text-xs font-semibold text-white uppercase tracking-tight">Stat Shards</h5>
          </div>
          <div className="px-4 space-y-3">
            {STAT_SHARDS_GRID.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-4">
                {row.map((shardId) => {
                  const isSelected = selectedStatPerksByRow[rowIdx] === shardId;
                  return (
                    <div
                      key={shardId}
                      className="group relative"
                    >
                      {/* Shard Container - opacity applied here only */}
                      <div
                        className={`w-10 h-10 flex items-center justify-center transition-opacity ${
                          isSelected
                            ? 'opacity-100'
                            : 'opacity-30 group-hover:opacity-60'
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute inset-0 border-2 border-orange-500 rounded"></div>
                        )}
                        
                        <img
                          src={getRuneIcon(shardId)}
                          onError={(e) => {
                            e.currentTarget.src = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/runesicon.png";
                          }}
                          alt={getRuneName(shardId)}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      
                      {/* Tooltip - outside opacity container */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{getRuneName(shardId)}</p>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{getRuneDescription(shardId)}</p>
                        </div>
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