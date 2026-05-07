'use client';

import { Search, Trash2, Crown, Star, Plus, Backpack, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UnitPosition, TooltipState } from '@/lib/tft/teamplanner-types';
import { TFTChampion, getCostColor, getChampionImageUrl } from '@/lib/tft/champions';
import { getItemImageUrl } from '@/lib/tft/itemstft';
import { toast } from 'sonner';
import { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';

interface UnitDetailsProps {
  unit: UnitPosition;
  champions: TFTChampion[];
  items: any[];
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
  canEdit?: boolean;
}

const ITEMS_PER_PAGE = 48;

export const UnitDetails = ({
  unit,
  champions,
  items,
  mainCarryIds,
  onToggleCarry,
  onRemoveUnit,
  onUpdateStars,
  onAddItem,
  onRemoveItem,
  itemSearch,
  setItemSearch,
  setDraggedItemId,
  setTooltip,
  canEdit = true,
}: UnitDetailsProps) => {
  const [itemPage, setItemPage] = useState(0);

  const champ = champions.find((c) => c.id === unit.characterId);
  const isCarry = mainCarryIds.includes(unit.characterId);
  const cost = champ?.cost || 1;
  const costColor = getCostColor(cost);

  const filteredItems = items.filter((it) =>
    it.name.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const totalItemPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const pagedItems = filteredItems.slice(itemPage * ITEMS_PER_PAGE, (itemPage + 1) * ITEMS_PER_PAGE);

  // Reset to page 0 when search changes
  const handleItemSearch = (val: string) => {
    setItemSearch(val);
    setItemPage(0);
  };

  return (
    <div className="flex flex-col h-full text-white overflow-hidden animate-in slide-in-from-right-4 duration-300">

      {/* ── Banner header ── */}
      <div className="relative overflow-hidden h-32 shrink-0">
        {/* Blurred portrait bg */}
        <div
          className="absolute inset-0 scale-110 blur-md opacity-20 bg-cover bg-top pointer-events-none"
          style={{ backgroundImage: `url(${getChampionImageUrl(champ?.image_path)})` }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative flex items-end gap-4 px-4 pb-3 h-full">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 shadow-lg" style={{ borderColor: costColor }}>
              <img
                src={getChampionImageUrl(champ?.image_path)}
                alt={champ?.name || 'Unknown'}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 bg-black border border-white/10 rounded px-1.5 py-0.5">
              <span className="text-[9px] font-black leading-none" style={{ color: costColor }}>{cost}</span>
              <SvgIcon type="gold" className="text-orange-500" size={8} />
            </div>
          </div>

          {/* Name + traits */}
          <div className="flex-1 min-w-0 pb-0.5">
            <h3 className="text-xl font-black uppercase tracking-tight leading-none text-white truncate">
              {champ?.name || 'Unknown'}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {champ?.traits?.map((t) => (
                <span key={t} className="text-[8px] font-black uppercase tracking-widest text-white/50 border border-white/10 rounded px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={onRemoveUnit}
            disabled={!canEdit}
            className="shrink-0 mb-0.5 w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Stars + Carry ── */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-white/5">
        <button
          onClick={() => onToggleCarry(unit.characterId)}
          disabled={!canEdit}
          className={`col-span-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed
            ${isCarry
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
              : 'bg-white/4 border-white/8 text-white hover:bg-orange-500/10 hover:border-orange-500/25 hover:text-orange-400'
            }`}
        >
          <Crown className={`w-3.5 h-3.5 ${isCarry ? 'fill-current' : ''}`} />
          {isCarry ? 'Main Carry' : 'Set as Carry'}
        </button>
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => onUpdateStars(s)}
            disabled={!canEdit}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed
              ${unit.stars === s
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-white/8 text-white hover:text-white hover:border-white/20 hover:bg-white/5'
              }`}
          >
            <Star className={`w-3 h-3 ${unit.stars >= s ? 'fill-current' : ''}`} />
            {s}
          </button>
        ))}
      </div>

      {/* ── Loadout ── */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3.5 bg-orange-500 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white flex items-center gap-1.5">
              Loadout
            </span>
          </div>
          <span className="text-[9px] font-bold text-white/40">{unit.items.length} / 3</span>
        </div>

        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => {
            const itemName = unit.items[i];
            const itemObj = items.find((it) => it.name === itemName);
            return (
              <div
                key={i}
                onClick={() => { if (itemName && canEdit) onRemoveItem(i); }}
                className={`group relative w-11 h-11 rounded-xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden
                  ${itemName ? 'border-orange-500/40 cursor-pointer' : 'border-white/10 hover:border-white/20'}
                  ${!canEdit ? 'cursor-not-allowed' : ''}`}
              >
                {itemName ? (
                  <>
                    <img
                      src={getItemImageUrl(itemObj?.image_path)}
                      alt={itemName}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-30 transition-opacity rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                    />
                    {canEdit && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4 text-red-400" />
                      </div>
                    )}
                  </>
                ) : (
                  <Plus className="w-3.5 h-3.5 text-white/15" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Item picker ── */}
      <div className="flex flex-col flex-1 min-h-0 px-4 py-3 gap-2.5">

        {/* Header + pagination */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3.5 bg-orange-500 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">Items</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setItemPage((p) => Math.max(0, p - 1))}
              disabled={itemPage === 0}
              className="w-5 h-5 flex items-center justify-center rounded border border-white/10 text-white hover:border-orange-500/35 hover:text-orange-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-black text-white/50 min-w-[36px] text-center">
              {itemPage + 1} / {totalItemPages || 1}
            </span>
            <button
              onClick={() => setItemPage((p) => Math.min(totalItemPages - 1, p + 1))}
              disabled={itemPage >= totalItemPages - 1}
              className="w-5 h-5 flex items-center justify-center rounded border border-white/10 text-white hover:border-orange-500/35 hover:text-orange-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
          <input
            placeholder="Search items…"
            value={itemSearch}
            onChange={(e) => handleItemSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-7 py-2 text-[10px] font-bold uppercase tracking-wider text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-colors"
          />
          {itemSearch && (
            <button
              onClick={() => handleItemSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-6 gap-1.5 flex-1 content-start">
          {pagedItems.map((it) => (
            <button
              key={it.id}
              draggable={canEdit}
              onDragStart={() => canEdit && setDraggedItemId(it.name)}
              onClick={() => {
                if (canEdit && unit.items.length < 3) {
                  onAddItem(it.name);
                  toast.success(`Equipped ${it.name}`);
                }
              }}
              onMouseEnter={(e) =>
                setTooltip({
                  visible: true,
                  title: it.name,
                  description: it.description,
                  x: e.clientX,
                  y: e.clientY,
                  item: it,
                  allItems: items,
                })
              }
              onMouseLeave={() => setTooltip((p) => ({ ...p, visible: false }))}
              className={`aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-orange-500/40 transition-all group cursor-grab active:cursor-grabbing active:scale-90
                ${!canEdit ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <img
                src={getItemImageUrl(it.image_path)}
                alt={it.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};