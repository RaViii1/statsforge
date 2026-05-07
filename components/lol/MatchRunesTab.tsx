"use client";

import { useMemo } from 'react';
import { Rune, RuneTree } from '@/lib/lol/runes';
import { getRuneIconUrl, getTreeIconUrl } from '@/lib/lol/runes';

interface MatchRunesTabProps {
  primaryStyle: any;
  secondaryStyle: any;
  statPerks: any;
  runesData?: { runes: any[]; trees: any[] };
}

export function MatchRunesTab({ primaryStyle, secondaryStyle, statPerks, runesData }: MatchRunesTabProps) {
  const runesMap = useMemo(() => {
    const map = new Map<number, Rune>();
    runesData?.runes?.forEach((rune: Rune) => {
      const runeIdNum = parseInt(rune.id.split('_')[1] || rune.id);
      map.set(runeIdNum, rune);
    });
    return map;
  }, [runesData]);

  const { treesMap, shardsTree } = useMemo(() => {
    const map = new Map<number, RuneTree>();
    let foundShardsTree: RuneTree | null = null;
    
    runesData?.trees?.forEach((tree: RuneTree) => {
      const treeIdNum = parseInt(tree.id.split('_')[1] || tree.id);
      map.set(treeIdNum, tree);
      
      if (tree.name?.toLowerCase().includes('shard') || tree.id?.toLowerCase().includes('shard')) {
        foundShardsTree = tree;
      }
    });
    
    return { treesMap: map, shardsTree: foundShardsTree };
  }, [runesData]);
  
  const selectedStatPerks = {
    offense: statPerks?.offense ?? 0,
    flex: statPerks?.flex ?? 0,
    defense: statPerks?.defense ?? 0,
  };

  // Get all selected runes
  const selectedPrimaryRunes = primaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
  const selectedSecondaryRunes = secondaryStyle?.selections?.map((s: { perk: number }) => s.perk) || [];
  const allSelectedRunes = [...selectedPrimaryRunes, ...selectedSecondaryRunes];

  // Get rune rows for a tree (based on slots)
  const getRuneRowsForTree = (tree: RuneTree, runesMapData: Map<number, Rune>) => {
    if (!tree || !tree.slots) return [];
    
    return tree.slots.map((slotRow) => {
      return slotRow.map((runeId) => {
        if (!runeId) return null;
        // Convert rune ID string to number for lookup
        const runeIdNum = parseInt(runeId.split('_')[1] || runeId);
        return runesMapData.get(runeIdNum);
      }).filter(rune => rune !== undefined && rune !== null);
    }).filter(row => row.length > 0);
  };

  // Get tree objects
  const primaryTreeObj = treesMap.get(primaryStyle?.style);
  const secondaryTreeObj = treesMap.get(secondaryStyle?.style);
  
  const primaryRuneRows = primaryTreeObj ? getRuneRowsForTree(primaryTreeObj, runesMap) : [];
  const secondaryRuneRows = secondaryTreeObj ? getRuneRowsForTree(secondaryTreeObj, runesMap) : [];
  const statShardRows = shardsTree ? getRuneRowsForTree(shardsTree, runesMap) : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Primary Rune Tree */}
      {primaryTreeObj && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            {primaryTreeObj.icon_path ? (
              <img
                src={getTreeIconUrl(primaryTreeObj.icon_path)}
                alt={primaryTreeObj.name}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/nochampionimage.jpg";
                }}
              />
            ) : (
              <div className="w-7 h-7 bg-zinc-800 rounded-lg" />
            )}
            <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
              {primaryTreeObj.name}
            </h4>
            <span className="text-xs text-zinc-500 font-medium">Primary</span>
          </div>

          {/* Rune Rows */}
          <div className="space-y-6 px-4">
            {primaryRuneRows.map((row, rowIdx) => (
              <div 
                key={rowIdx} 
                className={`flex items-center justify-center gap-4 ${rowIdx === 0 ? 'pb-6 border-b border-zinc-800' : ''}`}
              >
                {row.map((rune) => {
                  const runeIdNum = parseInt(rune.id.split('_')[1] || rune.id);
                  const isSelected = allSelectedRunes.includes(runeIdNum);
                  const isKeystone = rowIdx === 0;
                  
                  return (
                    <div key={rune.id} className="group relative">
                      {/* Rune Container */}
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
                        
                        {rune.icon_path ? (
                          <img
                            src={getRuneIconUrl(rune.icon_path)}
                            onError={(e) => {
                              e.currentTarget.src = "/images/nochampionimage.jpg";
                            }}
                            alt={rune.name}
                            className={`object-contain ${isKeystone ? 'w-14 h-14' : 'w-10 h-10'}`}
                          />
                        ) : (
                          <div className={`rounded-lg bg-zinc-800 flex items-center justify-center ${isKeystone ? 'w-14 h-14' : 'w-10 h-10'}`}>
                            <span className="text-xs text-zinc-500">?</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{rune.name}</p>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{rune.description || "No description available"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Rune Tree + Stat Shards */}
      {secondaryTreeObj && (
        <div className="space-y-4">
          {/* Secondary Tree Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            {secondaryTreeObj.icon_path ? (
              <img
                src={getTreeIconUrl(secondaryTreeObj.icon_path)}
                alt={secondaryTreeObj.name}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/nochampionimage.jpg";
                }}
              />
            ) : (
              <div className="w-7 h-7 bg-zinc-800 rounded-lg" />
            )}
            <h4 className="text-sm font-semibold text-white uppercase tracking-tight">
              {secondaryTreeObj.name}
            </h4>
            <span className="text-xs text-zinc-500 font-medium">Secondary</span>
          </div>

          {/* Secondary Runes (skip keystone row - row 0) */}
          <div className="space-y-6 px-4">
            {secondaryRuneRows.slice(1).map((row, rowIdx) => (
              <div key={rowIdx} className="flex items-center justify-center gap-4">
                {row.map((rune) => {
                  const runeIdNum = parseInt(rune.id.split('_')[1] || rune.id);
                  const isSelected = allSelectedRunes.includes(runeIdNum);
                  
                  return (
                    <div key={rune.id} className="group relative">
                      {/* Rune Container */}
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
                        
                        {rune.icon_path ? (
                          <img
                            src={getRuneIconUrl(rune.icon_path)}
                            onError={(e) => {
                              e.currentTarget.src = "/images/nochampionimage.jpg";
                            }}
                            alt={rune.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <span className="text-xs text-zinc-500">?</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{rune.name}</p>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{rune.description || "No description available"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Stat Shards Section - Using the fetched Stat Shards tree */}
          {shardsTree && statShardRows.length > 0 && (
             <div className="pt-6 border-t border-zinc-800">
               <div className="px-4 mb-4">
                 <h5 className="text-xs font-semibold text-white uppercase tracking-tight">Rune Shards</h5>
              </div>
              <div className="px-4 space-y-4">
                {statShardRows.map((row, rowIdx) => (
                  <div key={rowIdx}>
                    <div className="flex justify-center gap-4">
                      {row.map((shard) => {
                        const shardIdNum = parseInt(shard.id.split('_')[1] || shard.id);
                        // Determine which row this shard belongs to based on its position
                        let isSelected = false;
                        if (rowIdx === 0) isSelected = selectedStatPerks.offense === shardIdNum;
                        else if (rowIdx === 1) isSelected = selectedStatPerks.flex === shardIdNum;
                        else if (rowIdx === 2) isSelected = selectedStatPerks.defense === shardIdNum;
                        
                        return (
                          <div key={shard.id} className="group relative">
                            <div
                              className={`w-8 h-8 flex items-center justify-center transition-opacity cursor-pointer ${
                                isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute inset-0 border-2 border-orange-500 rounded-lg"></div>
                              )}
                              {shard.icon_path ? (
                                <img
                                  src={getRuneIconUrl(shard.icon_path)}
                                  onError={(e) => {
                                    e.currentTarget.src = "/images/nochampionimage.jpg";
                                  }}
                                  alt={shard.name}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                                  <span className="text-xs text-zinc-500">?</span>
                                </div>
                              )}
                            </div>
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                              <div className="w-64 p-3 bg-zinc-900 border border-orange-500/30 rounded-lg shadow-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                  <p className="text-xs font-bold text-white uppercase tracking-wider">{shard.name}</p>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">{shard.description || "No description available"}</p>
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
          )}
        </div>
      )}
    </div>
  );
}