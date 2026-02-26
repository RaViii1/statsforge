'use client';

import { Search, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { UnitPosition, TooltipState } from '@/lib/tft/teamplanner-types';
import { TFTChampion, SET_16_CHAMPIONS, getCostColor, CurrentSetNumber } from '@/lib/tft/champions';
import { getTFTUnitIcon } from '@/lib/tft/tftfunctions';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';

interface UnitSelectorProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTraits: string[];
  setSelectedTraits: (traits: string[]) => void;
  filteredChampions: TFTChampion[];
  unitPage: number;
  setUnitPage: (page: number) => void;
  unitsPerPage: number;
  onAddUnit: (championId: string) => void;
  onClearBoard: () => void;
  onSave: () => void;
  setDraggedChampionId: (id: string | null) => void;
  canEdit?: boolean;
  allTraits: string[];
}

export const UnitSelector = ({
  searchQuery,
  setSearchQuery,
  selectedTraits,
  setSelectedTraits,
  filteredChampions,
  unitPage,
  setUnitPage,
  unitsPerPage,
  onAddUnit,
  onClearBoard,
  onSave,
  setDraggedChampionId,
  canEdit = true,
  allTraits
}: UnitSelectorProps) => {
  const paginatedChampions = filteredChampions.slice(unitPage * unitsPerPage, (unitPage + 1) * unitsPerPage);
  const totalPages = Math.ceil(filteredChampions.length / unitsPerPage);
  

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-white/5 space-y-4">

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            placeholder="Search for units..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-11 pr-5 py-3 bg-black/40 border border-white/5 rounded-xl text-[10px] font-black uppercase text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/20 transition-all shadow-inner" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em]">Synergies</p>
            {selectedTraits.length > 0 && <button onClick={() => setSelectedTraits([])} className="text-[8px] font-black text-orange-400 uppercase">Reset</button>}
          </div>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto no-scrollbar">
            {allTraits.map(t => (
              <button 
                key={t} 
                onClick={() => setSelectedTraits(selectedTraits.includes(t) ? selectedTraits.filter(x => x !== t) : [...selectedTraits, t])} 
                className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${selectedTraits.includes(t) ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-white/2 border-white/10 text-white/30 hover:border-white/20'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.3em]">Operational Roster</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setUnitPage(Math.max(0, unitPage - 1))} disabled={unitPage === 0} className="p-1 text-orange-500 hover:bg-white/5 rounded-md disabled:opacity-10"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[14px] font-black text-orange-500/50">{unitPage + 1}</span>
            <button onClick={() => setUnitPage(Math.min(totalPages - 1, unitPage + 1))} disabled={unitPage >= totalPages - 1} className="p-1 text-orange-500 hover:bg-white/5 rounded-md disabled:opacity-10"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-1.5">
            {paginatedChampions.map(c => (
              <div 
                key={c.id} 
                draggable={canEdit}
                onDragStart={() => canEdit && setDraggedChampionId(c.id)}
                onClick={() => canEdit && onAddUnit(c.id)}
                className={`flex items-center gap-3 p-1.5 bg-white/1 border border-white/5 rounded-xl transition-all group ${canEdit ? 'hover:bg-white/4 hover:border-white/10 cursor-grab active:cursor-grabbing' : 'opacity-50 cursor-not-allowed'}`}
              >

                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-lg border overflow-hidden" style={{ borderColor: getCostColor(c.cost) }}>
                    <img 
                      src={c.image_path || '/images/nochampionimage.jpg'} 
                      alt={c.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100" 
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
                      />
                  </div>
                </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-orange-500 group-hover:text-white truncate uppercase tracking-widest">{c.name}</p>
                <div className="flex gap-1 mt-0.5">
                  {c.traits?.map(t => (
                    <span key={t} className="text-[9px] font-bold text-white/30 uppercase">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-black mr-2 flex items-center justify-center gap-1" style={{ color: getCostColor(c.cost) }}>{c.cost} <SvgIcon type="gold" className="text-yellow-500" size={9} /></div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};
