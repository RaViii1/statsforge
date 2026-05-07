'use client';

import { Search, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import { TFTChampion, getCostColor, getChampionImageUrl } from '@/lib/tft/champions';
import { useState } from 'react';
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
  allTraits,
}: UnitSelectorProps) => {
  const [traitsOpen, setTraitsOpen] = useState(true);

  const paginatedChampions = filteredChampions.slice(
    unitPage * unitsPerPage,
    (unitPage + 1) * unitsPerPage
  );
  const totalPages = Math.ceil(filteredChampions.length / unitsPerPage);

  const visibleTraits = allTraits.filter((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTrait = (trait: string) => {
    const has = selectedTraits.includes(trait);
    setSelectedTraits(has ? selectedTraits.filter((x) => x !== trait) : [...selectedTraits, trait]);
    if (!has) setSearchQuery('');
  };

  return (
    <div className="flex flex-col h-full text-white overflow-hidden">

      {/* Search */}
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-8 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white placeholder:text-white/20 outline-none focus:border-orange-500/40 transition-colors"
            placeholder="Search units or traits…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Traits section */}
      <div className="border-b border-white/5">

        {/* Traits header */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-3.5 bg-orange-500 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white">Traits</span>
            {selectedTraits.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/15 border border-orange-500/30 rounded-full text-[9px] font-black text-orange-500">
                {selectedTraits.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedTraits.length > 0 && (
              <button
                onClick={() => setSelectedTraits([])}
                className="text-[9px] font-black uppercase tracking-wider text-red-400/70 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setTraitsOpen((v) => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-wider transition-all
                ${traitsOpen
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                  : 'bg-white/5 border-white/10 text-white/35 hover:border-orange-500/25 hover:text-orange-500'
                }`}
            >
              <SlidersHorizontal className="w-2.5 h-2.5" />
              {traitsOpen ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Selected chips */}
        {selectedTraits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
            {selectedTraits.map((t) => (
              <button
                key={t}
                onClick={() => toggleTrait(t)}
                className="flex items-center gap-1 px-2.5 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[9px] font-black uppercase tracking-wider text-orange-500 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                {t}
                <X className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Traits grid */}
        {traitsOpen && (
          <div className="grid grid-cols-3 gap-1 px-4 pb-3 max-h-36 overflow-y-auto">
            {visibleTraits.map((t) => {
              const active = selectedTraits.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTrait(t)}
                  title={t}
                  className={`px-2 py-2 rounded-md text-[9px] font-black uppercase tracking-wider text-center truncate border transition-all
                    ${active
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-500'
                      : 'bg-white/4 border-white/8 text-white/40 hover:bg-orange-500/10 hover:border-orange-500/25 hover:text-orange-400'
                    }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Units header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3.5 bg-orange-500 rounded-full" />
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white">Units</span>
          <span className="text-[9px] font-bold text-white/20">{filteredChampions.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setUnitPage(Math.max(0, unitPage - 1))}
            disabled={unitPage === 0}
            className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/35 hover:border-orange-500/35 hover:text-orange-500 hover:bg-orange-500/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-black text-white/40 min-w-[40px] text-center">
            {unitPage + 1} / {totalPages || 1}
          </span>
          <button
            onClick={() => setUnitPage(Math.min(totalPages - 1, unitPage + 1))}
            disabled={unitPage >= totalPages - 1}
            className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/35 hover:border-orange-500/35 hover:text-orange-500 hover:bg-orange-500/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Units list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {paginatedChampions.length === 0 && (
          <div className="py-10 text-center text-[11px] font-bold uppercase tracking-wider text-white/20">
            No units found
          </div>
        )}
        {paginatedChampions.map((c) => {
          const costColor = getCostColor(c.cost);
          return (
            <div
              key={c.id}
              draggable={canEdit}
              onDragStart={() => canEdit && setDraggedChampionId(c.id)}
              onClick={() => canEdit && onAddUnit(c.id)}
              className={`relative flex items-center gap-3 p-1.5 rounded-xl border border-transparent overflow-hidden transition-all group
                ${canEdit
                  ? 'hover:bg-white/4 hover:border-white/8 cursor-grab active:cursor-grabbing'
                  : 'opacity-20 cursor-not-allowed'
                }`}
            >
              {/* Blurred bg splash */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity scale-110 blur-xs pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: `url(${getChampionImageUrl(c.image_path)})` }}
              />

              {/* Avatar */}
              <div
                className="relative shrink-0 w-9 h-9 rounded-lg overflow-hidden border-2"
                style={{ borderColor: costColor }}
              >
                <img
                  src={getChampionImageUrl(c.image_path)}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg';
                  }}
                />
              </div>

              {/* Info */}
              <div className="relative flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-white/70 group-hover:text-white truncate transition-colors">
                  {c.name}
                </p>
                <div className="flex items-center flex-wrap gap-x-1.5 mt-0.5">
                  {c.traits?.map((t, i) => (
                    <span key={t} className="text-[9px] font-semibold uppercase text-white/25">
                      {i > 0 && <span className="mr-1 opacity-40">·</span>}
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cost */}
              <div
                className="relative flex items-center gap-1 text-[11px] font-black pr-1 shrink-0"
                style={{ color: costColor }}
              >
                {c.cost}
                <SvgIcon type="gold" className="text-orange-500" size={10} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};