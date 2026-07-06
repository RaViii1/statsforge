"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronDown, Plus, Star, Eye, Pencil, Search,
  Coins, ChevronsUp, ArrowRight,
  ChevronLeft, Trash2, X
} from 'lucide-react';
import { StatsForgeAdBanner } from '@/components/AdBaner';
import { TeamComp, DifficultyLevel, UnitPosition, TooltipState, META_TIER_CONFIG, MetaTier, META_TIERS } from '@/lib/tft/teamplanner-types';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import Footer from '@/components/Footer';
import { getCostBorderColor, getChampionImageUrl, CurrentSetNumber } from '@/lib/tft/champions';
import { getItemImageUrl } from '@/lib/tft/itemstft';
import { HexGrid } from '@/components/tft/planner';
import { CustomTooltip } from '@/components/tft/planner';
import { UnitTooltip } from '@/components/tft/UnitTooltip';
import { getDifficultyConfig, DIFFICULTY_LEVELS } from '@/lib/tft/difficulty';
import NavbarTft from '@/components/NavbarTft';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

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
      <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${config.gradient}`} />
      <span className={`text-xl font-black ${config.color} uppercase tracking-wider`}>{tier}</span>
    </div>
  );
};

interface TeamCompCardProps {
  comp: TeamComp;
  expanded: boolean;
  onToggle: () => void;
  canEdit: boolean;
  onDelete: () => void;
  champions: any[];
  items: any[];
  traits: any[];
}

const TeamCompCard = ({ comp, expanded, onToggle, canEdit, onDelete, champions, items, traits, setNumber }: TeamCompCardProps & { setNumber: number }) => {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });
  const difficulty = getDifficultyConfig(comp.difficulty || 'medium');
  const finalUnits = comp.phases.final.units;

  const carries = comp.mainCarryIds
    .map(id => {
      const unit = finalUnits.find(u => u.characterId === id);
      const champ = champions.find(c => c.id === id);
      return unit ? { unit, cost: champ?.cost || 1 } : null;
    })
    .filter(Boolean) as { unit: UnitPosition; cost: number }[];

  // Get first carry's splash art for background
  const bgChampion = carries.length > 0 ? champions.find(c => c.id === carries[0].unit.characterId) : null;
  const bgImageUrl = bgChampion ? getChampionImageUrl(bgChampion.image_path) : null;

  const presetStyle = getPresetStyle(comp.activePresetId);
  const presetName = getPresetName(comp.activePresetId);
  const carryItems = carries.flatMap(c => c.unit.items);
  const priorityItems = [...new Set(carryItems)];

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
        const sortedTiers = [...trait.tft_trait_tiers].sort((a, b) => a.units_required - b.units_required);
        const activeTier = sortedTiers.reduce((best, tier) => {
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

  return (
    <>
      {tooltip.visible && tooltip.champion && (
        <UnitTooltip
          visible={tooltip.visible}
          title={tooltip.title}
          description={tooltip.description}
          x={tooltip.x}
          y={tooltip.y}
          champion={tooltip.champion}
          setNumber={setNumber}
        />
      )}
      {tooltip.visible && !tooltip.trait && !tooltip.champion && (
        <CustomTooltip
          visible={tooltip.visible}
          title={tooltip.title}
          description={tooltip.description}
          x={tooltip.x}
          y={tooltip.y}
          item={items.find(it => it.name === tooltip.title)}
          allItems={items}
        />
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
                <span className="px-2 py-0.5 bg-orange-950/40 border border-orange-900/20 text-orange-500/80 text-[10px] font-bold rounded">
                  {comp.patch}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${presetStyle}`}>
                  {presetName}
                </span>
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded border"
                  style={{ backgroundColor: difficulty.bgColor, color: difficulty.color, borderColor: difficulty.borderColor }}
                >
                  {difficulty.label}
                </span>
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
                          if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber: setNumber || CurrentSetNumber });
                        }}
                        onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                      >
                        <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                          {unit.items.slice(0, 3).map((item, idx) => {
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
              {finalUnits.map((unit, i) => {
                const champ = champions.find(c => c.id === unit.characterId);
                const cost = champ?.cost || 1;
                const isCarry = comp.mainCarryIds.includes(unit.characterId);
                return (
                   <div key={i} className="relative shrink-0 py-1">
                    <div
                       className={`w-11 h-11 rounded-full border-2 overflow-hidden bg-zinc-900/80 ${getCostBorderColor(cost)} ${isCarry ? 'ring-1 ring-orange-500/40' : ''} cursor-pointer transition-transform hover:scale-110`}
                      onMouseEnter={(e) => {
                        if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber: setNumber || CurrentSetNumber });
                      }}
                      onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                    >
                      <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                    </div>
                    {unit.items.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                        {unit.items.slice(0, 3).map((item, idx) => {
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
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-zinc-500 whitespace-nowrap max-w-[45px] truncate">
                      {unit.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/tft/comps/${comp.id}`} onClick={(e) => e.stopPropagation()} prefetch={false}>
                <button data-action="view" className="w-9 h-9 rounded-lg bg-orange-600/90 hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
              </Link>
              {canEdit && (
                <>
                  <Link href={`/tft/planner?edit=${comp.id}`} onClick={(e) => e.stopPropagation()} prefetch={false}>
                    <button data-action="edit" className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-zinc-300" />
                    </button>
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('Are you sure you want to delete this team composition?')) onDelete(); }}
                    className="w-9 h-9 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-900/20 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </>
              )}
              <div
                className="w-9 h-9 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors cursor-pointer"
                onClick={onToggle}
              >
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-5 pb-5 border-t border-zinc-800/40 pt-4 relative z-10">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {comp.description && comp.description !== 'Click to add operational notes...' && (
                  <div className='mb-6'>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">
                        General info
                      </h3>
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
                {/* Main carries */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">
                      Main carries
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {carries.map(({ unit, cost }, i) => {
                      const champ = champions.find(c => c.id === unit.characterId);
                      return (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-zinc-800/30 rounded-lg border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                          <div className={`w-10 h-10 rounded-full border-2 overflow-hidden bg-zinc-900/80 ${getCostBorderColor(cost)}`}>
                            <img src={getChampionImageUrl(champ?.image_path)} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white">{unit.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {unit.items.map((item, idx) => {
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

                {/* Item priority */}
                {priorityItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">
                        Itemization Priority
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {priorityItems.map((item, idx) => {
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

            {/* Leveling guide */}
            <div className="border-t border-zinc-800/30 pt-4 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-0.5 bg-orange-500 rounded-full" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  Leveling Guide
                </h3>
              </div>
              <div className="inline-flex items-center bg-zinc-900/50 rounded-lg px-3 py-2 border border-zinc-800/40">
                {comp.levelingSteps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[65px]">
                      <div className="flex items-center gap-1">
                        <ChevronsUp className="w-3.5 h-3.5 text-yellow-600/80" />
                        <span className="text-xl font-black text-white border-l border-orange-500/30 pl-1.5">
                          {step.level}
                        </span>
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
                    {i < comp.levelingSteps.length - 1 && (
                      <span className="text-zinc-700 text-base font-light mx-2"> &gt; </span>
                    )}
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

export default function SetTeamCompsPage() {
  const params = useParams();
  const setParam = params?.set as string;
  const setNumber = setParam ? parseInt(setParam.replace(/^S/, '')) : null;

  const [teamComps, setTeamComps] = useState<TeamComp[]>([]);
  const [champions, setChampions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [traits, setTraits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<DifficultyLevel | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<MetaTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeSets, setActiveSets] = useState<any[]>([]);
  const [currentSetData, setCurrentSetData] = useState<any>(null);
  const prefersReduced  = useReducedMotion();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user, userRole } = useAuth();

  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(val), 200);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const setsRes = await fetch('/api/tft/active-sets');
        if (setsRes.ok) {
          const sets = await setsRes.json();
          setActiveSets(sets);
          
          if (setNumber) {
            const found = sets.find((s: any) => s.set_number === setNumber);
            if (found) setCurrentSetData(found);
          } else if (sets.length > 0) {
            setCurrentSetData(sets[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching sets:', err);
      }
    }
    load();
  }, [setNumber]);

  useEffect(() => {
    async function loadData() {
      if (!currentSetData) return;
      try {
        setLoading(true);
         const [compsRes, champsRes, itemsRes, traitsRes] = await Promise.all([
           fetch(`/api/tft/team-comps?set_id=${currentSetData.id}`),
           fetch(`/api/tft/champions?set_id=${currentSetData.id}`),
           fetch(`/api/tft/items?set_id=${currentSetData.id}`),
           fetch(`/api/tft/traits?set_id=${currentSetData.id}`)
         ]);
        if (compsRes.ok)  setTeamComps(await compsRes.json());
        if (champsRes.ok) setChampions(await champsRes.json());
        if (itemsRes.ok)  setItems(await itemsRes.json());
        if (traitsRes.ok) setTraits(await traitsRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentSetData?.id]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tft/team-comps/${id}`, { method: 'DELETE' });
      if (res.ok) { setTeamComps(p => p.filter(c => c.id !== id)); toast.success('Team composition deleted successfully'); }
      else { const d = await res.json(); toast.error(d.error || 'Failed to delete team composition'); }
    } catch { toast.error('An error occurred while deleting'); }
  };

  const filteredComps = useMemo(() => {
    let comps = teamComps.filter(c => c.phases.final.units.length > 0);
    if (filter !== 'all') comps = comps.filter(c => c.difficulty === filter);
    if (tierFilter !== 'all') comps = comps.filter(c => c.tier === tierFilter);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      comps = comps.filter(comp => {
        if (comp.name.toLowerCase().includes(q)) return true;
        const allUnits = [...comp.phases.early.units, ...comp.phases.mid.units, ...comp.phases.final.units];
        if (allUnits.some(u => u.name.toLowerCase().includes(q) || u.characterId.toLowerCase().includes(q))) return true;
        if (getPresetName(comp.activePresetId).toLowerCase().includes(q)) return true;
        return false;
      });
    }
    return comps;
  }, [teamComps, filter, tierFilter, debouncedSearch]);

  const totalWithUnits    = teamComps.filter(c => c.phases.final.units.length > 0).length;
  const clearFilters      = () => { setSearchQuery(''); setDebouncedSearch(''); setFilter('all'); setTierFilter('all'); };
  const hasActiveFilters  = debouncedSearch || filter !== 'all' || tierFilter !== 'all';

  const currentSetName = currentSetData ? `S${currentSetData.set_number} — ${currentSetData.name}` : `Set ${setNumber || ''}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-orange-500/30">

        {/* Ambient glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-[700px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[160px]" />
        </div>

        <NavbarTft />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative pt-10 pb-8">
            <div className="absolute inset-0 -mx-4 sm:-mx-6 rounded-2xl overflow-hidden opacity-90">
              {currentSetData?.image_path ? (
                <>
                  <img
                    src={currentSetData.image_path.startsWith('http')
                      ? currentSetData.image_path
                      : currentSetData.image_path.includes('/')
                        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${currentSetData.image_path}`
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/set-banners/${currentSetData.image_path}`}
                    alt="TFT Set Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-zinc-900/90 via-purple-900/50 to-blue-900/50" />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
            </div>

            <div className="relative z-10">
              <Link
                href="/tft"
                className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 mb-6 transition-colors group uppercase text-[10px] font-black tracking-widest"
              >
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                TFT Hub
              </Link>

              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">{currentSetName}</p>
                  <h1 className="font-bebas text-7xl md:text-8xl leading-none text-white tracking-wide drop-shadow-2xl">COMPS</h1>
                  <p className="text-zinc-400 text-sm mt-2 max-w-md drop-shadow-lg">
                    Current meta team compositions — carries, items, and levelling guides.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <motion.p
                      key={filteredComps.length}
                      initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-bebas text-5xl text-white tabular-nums leading-none drop-shadow-lg"
                    >
                      {filteredComps.length}
                    </motion.p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] drop-shadow-lg">
                      {filteredComps.length === totalWithUnits ? 'comps' : `of ${totalWithUnits}`}
                    </p>
                  </div>
                  <Link href={`/tft/planner?set_id=${currentSetData?.set_number || CurrentSetNumber}`}>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase text-xs tracking-widest rounded-lg transition-colors shadow-lg shadow-orange-500/30">
                      <Plus className="w-3.5 h-3.5" />
                      Create
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {activeSets.length > 1 && (
            <div className="flex items-end gap-0 mt-auto">
              {activeSets.map((set: any) => (
                <Link
                  key={set.id}
                  href={`/tft/comps/sets/S${set.set_number}`}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${
                    currentSetData?.id === set.id
                      ? 'bg-transparent text-orange-500 border-orange-500 -mb-px pb-3'
                      : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  Set {set.set_number}
                </Link>
              ))}
            </div>
          )}

          <div className="py-5 border-b border-zinc-900 flex flex-wrap gap-4 items-center">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-8 py-2 bg-zinc-900 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-800 transition-colors w-44"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => setTierFilter('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider"
                animate={tierFilter === 'all' ? { scale: 1.05 } : { scale: 1 }}
                style={tierFilter === 'all' ? { backgroundColor: '#d4d4d8', color: '#0c0c0e' } : { backgroundColor: '#18181b', color: '#71717a' }}
                whileHover={prefersReduced ? {} : { backgroundColor: tierFilter === 'all' ? '#d4d4d8' : '#27272a' }}
              >
                All
              </motion.button>
              {META_TIERS.map(tier => {
                const cfg = META_TIER_CONFIG[tier];
                const isActive = tierFilter === tier;
                const colorMap: Record<string, string> = { 'text-yellow-400': '#facc15', 'text-blue-400': '#60a5fa', 'text-purple-400': '#c084fc', 'text-green-400': '#4ade80', 'text-red-400': '#f87171', 'text-zinc-300': '#d4d4d8' };
                const rawColor = Object.entries(colorMap).find(([cls]) => cfg.color.includes(cls))?.[1] ?? '#fff';
                return (
                  <motion.button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider font-bebas text-base"
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    style={isActive
                      ? { backgroundColor: '#27272a', color: rawColor, boxShadow: `0 4px 12px rgba(0,0,0,0.4)` }
                      : { backgroundColor: '#18181b', color: '#52525b' }}
                    whileHover={prefersReduced ? {} : { backgroundColor: '#27272a' }}
                  >
                    {tier}
                  </motion.button>
                );
              })}
            </div>

            <div className="w-px h-5 bg-zinc-800" />

            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => setFilter('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider"
                animate={filter === 'all' ? { scale: 1.05 } : { scale: 1 }}
                style={filter === 'all' ? { backgroundColor: '#d4d4d8', color: '#0c0c0e' } : { backgroundColor: '#18181b', color: '#71717a' }}
                whileHover={prefersReduced ? {} : { backgroundColor: filter === 'all' ? '#d4d4d8' : '#27272a' }}
              >
                All
              </motion.button>
              {DIFFICULTY_LEVELS.map(cfg => {
                const isActive = filter === cfg.id;
                return (
                  <motion.button
                    key={cfg.id}
                    onClick={() => setFilter(cfg.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider"
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    style={isActive
                      ? { backgroundColor: cfg.bgColor, color: cfg.color, boxShadow: `0 4px 12px ${cfg.color}30` }
                      : { backgroundColor: '#18181b', color: '#71717a' }}
                    whileHover={prefersReduced ? {} : { backgroundColor: isActive ? cfg.bgColor : '#27272a' }}
                  >
                    {cfg.label.split(' ')[0]}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[10px] font-black text-zinc-600 hover:text-orange-400 uppercase tracking-widest transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="py-10">
            {filteredComps.length > 0 ? (
              <div className="space-y-4">
                  {filteredComps.slice(0, 5).map((comp) => {
                    const isAdmin = userRole === 'admin';
                    const isOwner = user?.id === comp.user_id;
                    return (
                      <TeamCompCard
                        key={comp.id}
                        comp={comp}
                        expanded={expandedId === comp.id}
                        onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                        canEdit={isAdmin || isOwner}
                        onDelete={() => handleDelete(comp.id)}
                        champions={champions}
                        items={items}
                        traits={traits}
                        setNumber={setNumber || currentSetData?.set_number || 14}
                      />
                    );
                  })}

                  {filteredComps.length >= 5 && (
                    <StatsForgeAdBanner />
                  )}

                  {filteredComps.slice(5).map((comp) => {
                    const isAdmin = userRole === 'admin';
                    const isOwner = user?.id === comp.user_id;
                    return (
                      <TeamCompCard
                        key={comp.id}
                        comp={comp}
                        expanded={expandedId === comp.id}
                        onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                        canEdit={isAdmin || isOwner}
                        onDelete={() => handleDelete(comp.id)}
                        champions={champions}
                        items={items}
                        traits={traits}
                        setNumber={setNumber || currentSetData?.set_number || 14}
                      />
                    );
                  })}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 space-y-4">
                <p className="font-bebas text-3xl text-zinc-700 tracking-wide">
                  {debouncedSearch ? `No comps matching "${debouncedSearch}"` : 'No team comps yet'}
                </p>
                <Link href="/tft/planner">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase text-xs tracking-widest rounded-lg transition-colors mx-auto">
                    <Plus className="w-3.5 h-3.5" />
                    Create First Comp
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}