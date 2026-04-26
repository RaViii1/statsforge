'use client';

import { Crown, X, Plus } from 'lucide-react';
import { UnitPosition, TooltipState } from '@/lib/tft/teamplanner-types';
import { getCostColor, CurrentSetNumber, TFTChampion, getChampionImageUrl } from '@/lib/tft/champions';
import { getItemImageUrl } from '@/lib/tft/itemstft';
import { useEffect, useState } from 'react';

interface MainCarryTrayProps {
  mainCarryIds: string[];
  units: UnitPosition[];
  champions: TFTChampion[];
  items: any[];
  onToggleCarry: (characterId: string) => void;
  onItemDrop: (characterId: string, itemName: string) => void;
  draggedChampionId: string | null;
  draggedFromBoard: { row: number; col: number } | null;
  draggedItemId: string | null;
  setDraggedChampionId: (id: string | null) => void;
  setDraggedFromBoard: (pos: { row: number; col: number } | null) => void;
  setDraggedItemId: (id: string | null) => void;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
  canEdit?: boolean;
}

export const MainCarryTray = ({
  mainCarryIds,
  units,
  champions,
  items,
  onToggleCarry,
  onItemDrop,
  draggedChampionId,
  draggedFromBoard,
  draggedItemId,
  setDraggedChampionId,
  setDraggedFromBoard,
  setDraggedItemId,
  setTooltip,
  canEdit = true
}: MainCarryTrayProps) => {



  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-4 w-1 bg-orange-500 rounded-full" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          Main Carries
        </h3>
         <span className="text-[10px] font-medium text-white/30 hidden sm:inline tracking-normal normal-case">Your main carry champions</span>
    </div>
    <div 
      className="p-4 sm:p-6 bg-white/2 rounded-2xl  relative group/tray"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        let cid = draggedChampionId;
        if (draggedFromBoard) {
          const u = units.find(un => un.row === draggedFromBoard.row && un.col === draggedFromBoard.col);
          if (u) cid = u.characterId;
        }
        
        if (cid) {
          if (!mainCarryIds.includes(cid)) {
            onToggleCarry(cid);
          }
        }
        setDraggedChampionId(null);
        setDraggedFromBoard(null);
      }}
    >
      <div className="flex items-center justify-end mb-4 px-2">
        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{mainCarryIds.length} / 3</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => {
            const carryCharacterId = mainCarryIds[i];
            const champ = carryCharacterId && champions ? champions.find(c => c.id === carryCharacterId) : null;
            const unitOnBoard = carryCharacterId ? units.find(u => u.characterId === carryCharacterId) : null;
            
            return (
              <div 
                key={i} 
                className={`relative h-24 sm:h-28 rounded-2xl border transition-all duration-300 flex items-center gap-3 sm:gap-4 px-3 sm:px-4 ${champ ? 'bg-white/4 border-orange-500/20 shadow-xl' : 'bg-transparent border-white/5 border-dashed hover:border-orange-500/20'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  if (!carryCharacterId || !canEdit) return;
                  e.stopPropagation();
                  if (draggedItemId) {
                    onItemDrop(carryCharacterId, draggedItemId);
                  }
                  setDraggedItemId(null);
                }}
              >
                {champ ? (
                  <>
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 border-orange-500/40 overflow-hidden">
                           <img 
                              src={getChampionImageUrl(champ.image_path)} 
                              alt={champ.name} 
                              className="w-full h-full object-cover" 
                              onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
                              onMouseEnter={(e) => setTooltip({
                                visible: true,
                                title: champ.name,
                                description: champ.ability?.description?.active || champ.ability?.description?.passive || "",
                                x: e.clientX,
                                y: e.clientY,
                                champion: champ,
                                setNumber: CurrentSetNumber
                              })}
                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                            />
                        </div>

                      {canEdit && <button onClick={(e) => { e.stopPropagation(); onToggleCarry(champ.id); }} className="absolute -top-2 -right-2 p-1.5 bg-zinc-900 border border-white/10 rounded-lg hover:bg-red-900/40 text-white/20 hover:text-red-500 hover:border-red-500 transition-all"><X className="w-3 h-3" /></button>}
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-[10px] font-black text-white uppercase truncate tracking-widest">{champ.name}</p>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(idx => {
                          const itemName = unitOnBoard?.items[idx];
                          const itemObj = items?.find(it => it.name === itemName);
                            return (
                              <div key={idx} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border transition-all overflow-hidden ${itemName ? 'border-orange-500/40 bg-zinc-800' : 'border-white/5 bg-black/20'}`}>
                                {itemName && (
                                  <img 
                                    src={getItemImageUrl(itemObj?.image_path)} 
                                    alt={itemName} 
                                    className="w-full h-full object-cover" 
                                    onMouseEnter={(e) => setTooltip({ 
                                      visible: true, 
                                      title: itemName, 
                                      description: itemObj?.description || 'No description available', 
                                      x: e.clientX, 
                                      y: e.clientY,
                                      item: itemObj,
                                      allItems: items
                                    })} 
                                    onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))} 
                                     onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                                  />
                                  
                                )}
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                <div className="w-full flex flex-col items-center gap-2 opacity-10 group-hover/tray:opacity-40 transition-opacity">
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-[8px] text-white uppercase">Assign</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
  
};
