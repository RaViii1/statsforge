'use client';

import { Search, Trash2, Crown, Star, Plus, Backpack } from 'lucide-react';
import { UnitPosition, TooltipState } from '@/lib/tft/teamplanner-types';
import { SET_16_CHAMPIONS, getCostColor, getChampionCost, CurrentSetNumber } from '@/lib/tft/champions';
import { getTFTUnitIcon, getTFTItemIcon } from '@/lib/tft/tftfunctions';
import { getItemDescription, itemstft } from '@/lib/tft/itemstft';
import { toast } from 'sonner';

interface UnitDetailsProps {
  unit: UnitPosition;
  mainCarryIds: string[];
  onToggleCarry: (characterId: string) => void;
  onRemoveUnit: () => void;
  onUpdateStars: (stars: number) => void;
  onAddItem: (itemName: string) => void;
  onRemoveItem: (index: number) => void;
  itemSearch: string;
  setItemSearch: (search: string) => void;
  setDraggedItemId: (id: string | null) => void;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export const UnitDetails = ({
  unit,
  mainCarryIds,
  onToggleCarry,
  onRemoveUnit,
  onUpdateStars,
  onAddItem,
  onRemoveItem,
  itemSearch,
  setItemSearch,
  setDraggedItemId,
  setTooltip
}: UnitDetailsProps) => {
  const champ = SET_16_CHAMPIONS.find(c => c.id === unit.characterId);
  const isCarry = mainCarryIds.includes(unit.characterId);

  return (
    <div className="flex-1 flex flex-col p-8 space-y-10 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 overflow-hidden shadow-2xl" style={{ borderColor: getCostColor(getChampionCost(unit.characterId)) }}>
              <img src={getTFTUnitIcon(unit.characterId, CurrentSetNumber)} alt={unit.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 px-2 py-1 rounded-lg">
              <p className="text-[10px] font-black text-white" style={{ color: getCostColor(getChampionCost(unit.characterId)) }}>${getChampionCost(unit.characterId)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{unit.name}</h3>
            <div className="flex flex-wrap gap-1">
              {champ?.traits.map(t => (
                <span key={t} className="text-[8px] font-black text-white/40 uppercase tracking-widest">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={onRemoveUnit} className="p-3 bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-2xl transition-all border border-white/5"><Trash2 className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onToggleCarry(unit.characterId)} 
          className={`col-span-2 flex items-center justify-center gap-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${isCarry ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
        >
          <Crown className="w-4 h-4" /> {isCarry ? 'Confirmed Main Carry' : 'Designate as Carry'}
        </button>
        {[1, 2, 3].map(s => (
          <button key={s} onClick={() => onUpdateStars(s)} className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${unit.stars === s ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/20 hover:text-white/40'}`}>
            <Star className={`w-3.5 h-3.5 ${unit.stars >= s ? 'fill-current' : ''}`} /> {s}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2"><Backpack className="w-4 h-4" /> Loadout Analysis</p>
          <span className="text-[9px] font-black text-white/20">{unit.items.length} / 3</span>
        </div>
        <div className="flex gap-4">
          {[0, 1, 2].map(i => {
            const it = unit.items[i];
            return (
              <div key={i} onClick={() => { if (it) onRemoveItem(i); }} className={`group relative w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${it ? 'border-orange-500/30 bg-white/5' : 'border-white/5 bg-black/20 hover:border-white/10'}`}>
                {it ? (
                  <>
                    <img src={getTFTItemIcon(it)} alt={it} className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-red-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity"><Trash2 className="w-5 h-5 text-white" /></div>
                  </>
                ) : <Plus className="w-5 h-5 text-white/5" />}
              </div>
            );
          })}
        </div>

        <div className="pt-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
            <input placeholder="Search Item List..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="w-full pl-11 pr-5 py-4 bg-black/30 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/20 transition-all shadow-inner" />
          </div>
          <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
            {itemstft.filter(it => it.name.toLowerCase().includes(itemSearch.toLowerCase())).map(it => (
              <button 
                key={it.id} 
                draggable
                onDragStart={() => setDraggedItemId(it.name)}
                onClick={() => { if (unit.items.length < 3) { onAddItem(it.name); toast.success(`Equipped ${it.name}`); } }} 
                onMouseEnter={(e) => setTooltip({ visible: true, title: it.name, description: it.description, x: e.clientX, y: e.clientY })} 
                onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))} 
                className="aspect-square bg-white/4 border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/40 transition-all group active:scale-90 cursor-grab active:cursor-grabbing"
              >
                <img src={getTFTItemIcon(it.name)} alt={it.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
