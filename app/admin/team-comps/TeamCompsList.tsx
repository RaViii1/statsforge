'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { TeamComp, DifficultyLevel, MetaTier, META_TIERS, META_TIER_CONFIG } from '@/lib/tft/teamplanner-types';
import { TFTSet, getCostBorderColor, getChampionImageUrl, CurrentSetNumber } from '@/lib/tft/champions';
import { DIFFICULTY_LEVELS } from '@/lib/tft/difficulty';
import { getItemImageUrl } from '@/lib/tft/itemstft';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import { Trash2, Pencil, Search, ChevronDown, Crown, Swords, Star, ChevronsUp, Coins, ArrowRight, Sparkles } from 'lucide-react';
import { UnitTooltip } from '@/components/tft/UnitTooltip';
import { CustomTooltip, HexGrid } from '@/components/tft/planner';
import { motion, useReducedMotion } from 'framer-motion';
import {TooltipState} from '@/lib/tft/teamplanner-types';
interface AdminTeamCompCardProps {
  comp: TeamComp;
  expanded: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onDelete: () => void;
  champions: any[];
  items: any[];
  traits: any[];
}

const getPresetStyle = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  return preset ? preset.tagColor : 'text-zinc-400 bg-zinc-700/50 border-zinc-600';
};

const getPresetName = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  return preset?.name || 'Custom';
};

const MetaTierBadge = ({ tier }: { tier?: MetaTier }) => {
  if (!tier) return null;
  const config = META_TIER_CONFIG[tier];
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className={`w-1 h-5 bg-linear-to-b ${config.color} rounded-full`} />
      <span className={`text-xs font-black ${config.color} uppercase tracking-wider`}>{tier}</span>
    </div>
  );
};

const AdminTeamCompCard = ({ comp, expanded, onToggle, canEdit, onDelete, champions, items, traits }: AdminTeamCompCardProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const difficulty = DIFFICULTY_LEVELS.find(d => d.id === comp.difficulty) || DIFFICULTY_LEVELS[1];
  const finalUnits = comp.phases.final.units;

  const carries = comp.mainCarryIds
    .map(id => {
      const unit = finalUnits.find(u => u.characterId === id);
      const champ = champions.find(c => c.id === id);
      return unit ? { unit, cost: champ?.cost || 1 } : null;
    })
    .filter(Boolean) as { unit: any; cost: number }[];

  const presetStyle = getPresetStyle(comp.activePresetId);
  const presetName = getPresetName(comp.activePresetId);
  const carryItems = carries.flatMap(c => c.unit.items);
  const priorityItems = [...new Set(carryItems)];

  // Get first carry's splash art for background
  const bgChampion = carries.length > 0 ? champions.find(c => c.id === carries[0].unit.characterId) : null;
  const bgImageUrl = bgChampion ? getChampionImageUrl(bgChampion.image_path) : null;

  const finalTraits = useMemo(() => {
    const traitCounts: Record<string, number> = {};
    const seenUnits = new Set<string>();
    finalUnits.forEach(u => {
      if (seenUnits.has(u.characterId)) return;
      seenUnits.add(u.characterId);
      const champ = champions.find(c => c.id === u.characterId);
      if (champ && champ.traits) {
        champ.traits.forEach((t: string) => { traitCounts[t] = (traitCounts[t] || 0) + 1; });
      }
    });
    return Object.entries(traitCounts)
      .map(([name, count]) => {
        const trait = traits.find(t => t.name === name);
        if (!trait) return null;
        if (trait.is_Hero) {
          return { name, count, activeTier: undefined, unitsRequired: 0, iconPath: trait.icon_path, isHero: true, description: trait.description, tiers: trait.tft_trait_tiers || [] };
        }
        if (!trait?.tft_trait_tiers) return null;
        const sortedTiers = [...trait.tft_trait_tiers].sort((a: any, b: any) => a.units_required - b.units_required);
        const activeTier = sortedTiers.reduce((best: any, tier: any) => {
          if (count >= tier.units_required && tier.units_required > (best?.units_required || 0)) return tier;
          return best;
        }, null);
        if (activeTier) {
          return { name, count, activeTier: activeTier.tier, unitsRequired: activeTier.units_required, iconPath: trait.icon_path, isHero: trait.is_Hero || false, description: trait.description, tiers: trait.tft_trait_tiers || [] };
        }
        return null;
      })
      .filter((t): t is any => t !== null)
      .sort((a, b) => {
        if (a.isHero && b.isHero) return b.count - a.count;
        if (a.isHero) return -1;
        if (b.isHero) return 1;
        return b.count - a.count;
      });
  }, [finalUnits, champions, traits]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
      return;
    }
    await onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {tooltip.visible && tooltip.champion && (
        <UnitTooltip visible={tooltip.visible} title={tooltip.title} description={tooltip.description} x={tooltip.x} y={tooltip.y} champion={tooltip.champion} setNumber={CurrentSetNumber} />
      )}
      {tooltip.visible && !tooltip.trait && !tooltip.champion && (
        <CustomTooltip visible={tooltip.visible} title={tooltip.title} description={tooltip.description} x={tooltip.x} y={tooltip.y} item={items.find(it => it.name === tooltip.title)} allItems={items} />
      )}

      <div className="group relative bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
        {/* Side accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Background image from main carry */}
        {bgImageUrl && (
          <div className="absolute inset-0 pointer-events-none bg-[#181415]">
            <img
              src={bgImageUrl}
              alt=""
              className="absolute right-0 top-0 h-full w-[45%] object-cover object-top opacity-[0.08] mask-image-gradient"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
              }}
            />
          </div>
        )}

        <div className="p-4 pl-5 relative z-10">
          <div className="flex items-center gap-5">
            {/* Left: Tier + Name + Tags */}
            <div className="shrink-0 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <MetaTierBadge tier={comp.tier} />
                <h3 className="text-base font-bold text-white truncate max-w-[180px]">{comp.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 bg-orange-950/40 border border-orange-900/20 text-orange-500/80 text-[10px] font-bold rounded">{comp.patch}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${presetStyle}`}>{presetName}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded border" style={{ backgroundColor: difficulty.bgColor, color: difficulty.color, borderColor: difficulty.borderColor }}>{difficulty.label}</span>
              </div>
            </div>

            {/* Carries */}
            {carries.length > 0 && (
              <div className="shrink-0 flex items-center gap-2 border-r border-zinc-800/50 pr-4">
                {carries.map(({ unit, cost }, i) => {
                  const champ = champions.find(c => c.id === unit.characterId);
                  return (
                    <div key={i} className="relative">
                      <div
                        className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-zinc-900/80 ${getCostBorderColor(cost)} cursor-pointer transition-transform hover:scale-105`}
                        onMouseEnter={(e) => {
                          if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber: CurrentSetNumber });
                        }}
                        onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                      >
                        <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                          {unit.items.slice(0, 3).map((item: string, idx: number) => {
                            const itemObj = items.find(it => it.name === item);
                            return (
                              <div key={idx} className="w-3.5 h-3.5 rounded-[2px] bg-zinc-800 border border-zinc-700/80 overflow-hidden"
                                onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                                onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                              >
                                <img src={getItemImageUrl(itemObj?.image_path)} alt={item} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {unit.stars === 3 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex">
                          {[...Array(3)].map((_, i) => <Star key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400" />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* All units row */}
            <div className="flex-1 flex items-center gap-3.5 overflow-x-auto overflow-y-hidden px-1 pt-4 pb-1">
              {finalUnits.map((unit: any, i: number) => {
                const champ = champions.find(c => c.id === unit.characterId);
                const cost = champ?.cost || 1;
                const isCarry = comp.mainCarryIds.includes(unit.characterId);
                return (
                  <div key={i} className="relative shrink-0 py-1">
                    <div
                      className={`w-11 h-11 rounded-full border-2 overflow-hidden bg-zinc-900/80 ${getCostBorderColor(cost)} ${isCarry ? 'ring-1 ring-orange-500/40' : ''} cursor-pointer transition-transform hover:scale-110`}
                      onMouseEnter={(e) => {
                        if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber: CurrentSetNumber });
                      }}
                      onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                    >
                      <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                    </div>
                    {unit.items.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                        {unit.items.slice(0, 3).map((item: string, idx: number) => {
                          const itemObj = items.find(it => it.name === item);
                          return (
                            <div key={idx} className="w-3.5 h-3.5 rounded-[1px] bg-zinc-800 border border-zinc-700/60 overflow-hidden"
                              onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                            >
                              <img src={getItemImageUrl(itemObj?.image_path)} alt={item} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {unit.stars >= 3 && (
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex">
                        {[...Array(3)].map((_, i) => <Star key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400" />)}
                      </div>
                    )}
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 whitespace-nowrap max-w-[45px] truncate">{unit.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`/tft/comps/${comp.id}`, '_blank'); }}
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
                title="View comp"
              >
                <Search className="w-4 h-4 text-zinc-300" />
              </button>
              {canEdit && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); window.location.href = `/tft/planner?edit=${comp.id}`; }}
                    className="w-9 h-9 rounded-lg bg-orange-600/90 hover:bg-orange-500 flex items-center justify-center transition-colors"
                    title="Edit in planner"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showDeleteConfirm ? 'bg-red-600 hover:bg-red-500' : 'bg-red-950/40 hover:bg-red-900/60 border border-red-900/20'}`}
                    title={showDeleteConfirm ? 'Click again to confirm' : 'Delete comp'}
                  >
                    <Trash2 className={`w-3.5 h-3.5 ${showDeleteConfirm ? 'text-white' : 'text-red-400'}`} />
                  </button>
                </>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors"
              >
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="px-5 pb-5 border-t border-zinc-800/40 pt-4 relative z-10">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {comp.description && comp.description !== 'Click to add operational notes...' && (
                  <div className='mb-6'>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-3 w-0.5 bg-orange-500 rounded-full" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Notes</h3>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{comp.description}</p>
                  </div>
                )}
                <HexGrid
                  units={finalUnits}
                  mainCarryIds={comp.mainCarryIds}
                  champions={champions}
                  items={items}
                  selectedHex={null}
                  activeTraits={finalTraits}
                  onHexClick={() => {}}
                  onDrop={() => {}}
                  onUnitDragStart={() => {}}
                  setTooltip={setTooltip}
                  tooltip={tooltip}
                />
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Main Carries</h3>
                  </div>
                  <div className="space-y-2">
                    {carries.map(({ unit, cost }, i) => {
                      const champ = champions.find(c => c.id === unit.characterId);
                      return (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-zinc-800/30 rounded-lg border border-zinc-800/50">
                          <div className={`w-10 h-10 rounded-full border-2 overflow-hidden bg-zinc-900/80 ${getCostBorderColor(cost)}`}>
                            <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">{unit.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {unit.items.map((item: string, idx: number) => {
                                const itemObj = items.find(it => it.name === item);
                                return (
                                  <div key={idx} className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700/60 overflow-hidden"
                                    onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                                    onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                  >
                                    <img src={getItemImageUrl(itemObj?.image_path)} alt={item} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {priorityItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Itemization Priority</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {priorityItems.map((item: string, idx: number) => {
                        const itemObj = items.find(it => it.name === item);
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div
                              className="relative w-9 h-9 rounded-xl bg-zinc-800/40 border border-zinc-700/40 overflow-hidden hover:border-orange-500/40 hover:scale-110 transition-all duration-200 group"
                              onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || '', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                            >
                              <img src={getItemImageUrl(itemObj?.image_path)} alt={item} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {idx < priorityItems.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-700" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-800/30 pt-4 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Levelling Guide</h3>
              </div>
              <div className="inline-flex items-center bg-zinc-900/50 rounded-lg px-3 py-2 border border-zinc-800/40">
                {comp.levelingSteps.map((step: any, i: number) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[65px]">
                      <div className="flex items-center gap-1">
                        <ChevronsUp className="w-3.5 h-3.5 text-yellow-600/80" />
                        <span className="text-xl font-black text-white border-l border-orange-500/30 pl-1.5">{step.level}</span>
                        <div className="flex flex-col items-start ml-0.5">
                          <span className="text-[11px] text-zinc-600 leading-none">{step.stage}</span>
                          <div className="flex items-center gap-0.5">
                            <span className={`text-xs font-semibold ${step.isCurrent ? 'text-yellow-400' : 'text-zinc-400'}`}>{step.gold}</span>
                            <Coins className="w-2.5 h-2.5 text-yellow-600" />
                          </div>
                        </div>
                      </div>
                      <div className="h-3.5 flex items-center justify-center">
                        {step.description && (
                          <span className="text-[10px] text-orange-500/80 text-center leading-tight whitespace-nowrap truncate max-w-[90px]">{step.description}</span>
                        )}
                      </div>
                    </div>
                    {i < comp.levelingSteps.length - 1 && <span className="text-zinc-700 text-base font-light mx-2"> &gt; </span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface TeamCompsListProps {
  initialComps: TeamComp[];
  sets: (TFTSet & { id: number })[];
  champions: any[];
  items: any[];
  traits: any[];
}

export default function TeamCompsList({ initialComps, sets, champions, items, traits }: TeamCompsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [setFilter, setSetFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<MetaTier | 'all'>('all');
  const [diffFilter, setDiffFilter] = useState<DifficultyLevel | 'all'>('all');
  const [comps, setComps] = useState<TeamComp[]>(initialComps);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tft/team-comps/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setComps(prev => prev.filter(c => c.id !== id));
      toast.success('Team comp deleted');
    } catch (error) {
      toast.error('Error deleting team comp');
    }
  };

  const filtered = comps.filter(comp => {
    const hasUnits = comp.phases.final.units.length > 0;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSet = setFilter === 'all' || comp.set_id === parseInt(setFilter);
    const matchesTier = tierFilter === 'all' || comp.tier === tierFilter;
    const matchesDiff = diffFilter === 'all' || comp.difficulty === diffFilter;
    return hasUnits && matchesSearch && matchesSet && matchesTier && matchesDiff;
  });

  return (
    <div className="space-y-4">
      {/* Filters - responsive 2-row on mobile, 1-row on desktop */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 order-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Search team comps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none transition-colors"
          />
        </div>

        {/* Desktop filters - hidden on mobile, inline after search */}
        <div className="hidden lg:flex items-center gap-2 flex-wrap order-3 lg:order-2">
          <select
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value)}
            className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
          >
            <option value="all">All Sets</option>
            {sets.map(set => (
              <option key={set.id} value={set.id}>Set {set.set_number}: {set.name}</option>
            ))}
          </select>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as MetaTier | 'all')}
            className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
          >
            <option value="all">All Tiers</option>
            {META_TIERS.map(tier => (
              <option key={tier} value={tier}>{tier} Tier</option>
            ))}
          </select>
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value as DifficultyLevel | 'all')}
            className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
          >
            <option value="all">All Difficulties</option>
            {DIFFICULTY_LEVELS.map(diff => (
              <option key={diff.id} value={diff.id}>{diff.label}</option>
            ))}
          </select>
        </div>

        {/* Count badge */}
        <div className="flex-shrink-0 self-start lg:self-auto px-3 py-2 bg-[#111112] border border-white/5 rounded-xl order-2 lg:order-3">
          <span className="text-xs font-semibold text-zinc-500">
            {filtered.length}
            <span className="text-zinc-700 font-normal"> / {comps.length}</span>
          </span>
        </div>
      </div>

      {/* Mobile filters - separate row below */}
      <div className="flex lg:hidden flex-col gap-2">
        <select
          value={setFilter}
          onChange={(e) => setSetFilter(e.target.value)}
          className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
        >
          <option value="all">All Sets</option>
          {sets.map(set => (
            <option key={set.id} value={set.id}>Set {set.set_number}: {set.name}</option>
          ))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as MetaTier | 'all')}
          className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
        >
          <option value="all">All Tiers</option>
          {META_TIERS.map(tier => (
            <option key={tier} value={tier}>{tier} Tier</option>
          ))}
        </select>
        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value as DifficultyLevel | 'all')}
          className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 outline-none"
        >
          <option value="all">All Difficulties</option>
          {DIFFICULTY_LEVELS.map(diff => (
            <option key={diff.id} value={diff.id}>{diff.label}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((comp) => {
          const set = sets.find(s => s.id === comp.set_id);
          const canEdit = true;

          return (
            <AdminTeamCompCard
              key={comp.id}
              comp={comp}
              expanded={expandedId === comp.id}
              onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
              canEdit={canEdit}
              onDelete={() => handleDelete(comp.id)}
              champions={champions}
              items={items}
              traits={traits}
            />
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Swords className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No team comps found</p>
          </div>
        )}
      </div>
    </div>
  );
}
