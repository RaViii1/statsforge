"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Plus,
  Star,
  Eye,
  Pencil,
  Search,
  Crown,
  Swords,
  Coins,
  ChevronsUp,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { getTFTUnitIcon, getTFTItemIcon } from '@/lib/tft/tftfunctions';
import { TeamComp, DifficultyLevel, UnitPosition, TooltipState, META_TIER_CONFIG, MetaTier, META_TIERS } from '@/lib/tft/teamplanner-types';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import Footer from '@/components/footer';
import { CurrentSetNumber, getChampionCost, getCostBorderColor, SET_16_CHAMPIONS } from '@/lib/tft/champions';
import { HexGrid } from '@/components/tft/planner'; 
import { getItemDescription } from '@/lib/tft/itemstft';
import { getDifficultyConfig, DIFFICULTY_LEVELS } from '@/lib/tft/difficulty';
import NavbarTft from '@/components/navbartft';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const getPresetStyle = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  if (preset) {
    return preset.tagColor;
  }
  return 'text-zinc-400 bg-zinc-700/50 border-zinc-600';
};

const getPresetName = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  return preset?.name || 'Custom';
};

const MetaTierBadge = ({ tier }: { tier?: MetaTier }) => {
  if (!tier) return null;
  
  const config = META_TIER_CONFIG[tier];
  
  return (
    <div className="inline-flex items-center gap-2">
      <div className={`w-0.5 h-6 bg-gradient-to-b ${config.gradient} rounded-full`}></div>
      <span className={`text-sm font-bold ${config.color}`}>
        {tier}
      </span>
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
        TIER
      </span>
      <div className={`w-0.5 h-6 bg-gradient-to-b ${config.gradient} rounded-full`}></div>
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
}

const TeamCompCard = ({ comp, expanded, onToggle, canEdit, onDelete, champions, items }: TeamCompCardProps) => {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });
  const difficulty = getDifficultyConfig(comp.difficulty || 'medium');
  const finalUnits = comp.phases.final.units;
  
  const carries = comp.mainCarryIds
    .map(id => {
      const unit = finalUnits.find(u => u.characterId === id);
      return unit ? { unit, cost: getChampionCost(id) } : null;
    })
    .filter(Boolean) as { unit: UnitPosition; cost: number }[];

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
          champ.traits.forEach((t: string) => {
            traitCounts[t] = (traitCounts[t] || 0) + 1;
          });
        }
      });

      return Object.entries(traitCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }, [finalUnits, champions]);


  return (
    <>
    
      {tooltip.visible && (
        <div 
          className="fixed z-100 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <p className="text-sm font-bold text-white">{tooltip.title}</p>
          <p className="text-xs text-zinc-400 max-w-[200px]">{tooltip.description}</p>
        </div>
      )}
      <div 
        
        className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-900/50 transition-all cursor-pointer"
      >
        <div className="p-5">
          <div className="flex items-center gap-6">
            <div className="shrink-0 min-w-[180px]">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <MetaTierBadge tier={comp.tier} />
                <span className='max-w-60 truncate'>{comp.name}</span>
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                
                <span className="px-2.5 py-1 bg-orange-950/50 border border-orange-900/30 text-orange-500 text-xs font-bold rounded">
                  {comp.patch}
                </span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded border ${presetStyle}`}>
                  {presetName}
                </span>
                  <span 
                    className="px-2.5 py-1 text-xs font-bold rounded border"
                    style={{ 
                      backgroundColor: difficulty.bgColor, 
                      color: difficulty.color, 
                      borderColor: difficulty.borderColor 
                    }}
                  >
                    {difficulty.label}
                  </span>
              </div>
            </div>
            {carries.length > 0 && (
              <div className="shrink-0 flex items-center gap-1 border border-r-orange-500/40 pr-4">
                {carries.map(({ unit, cost }, i) => {
                  const champ = champions.find(c => c.id === unit.characterId);
                  return (
                    <div key={i} className="relative">
                      <div className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)}`}>
                        <img 
                          src={champ?.image_path || '/images/nochampionimage.jpg'} 
                          alt={unit.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {unit.items.slice(0, 3).map((item, idx) => {
                            const itemObj = items.find(it => it.name === item);
                            return (
                              <div key={idx} className="w-4 h-4 rounded bg-zinc-800 border border-zinc-600 overflow-hidden">
                                <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {unit.stars === 3 && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              {finalUnits.map((unit, i) => {
                const cost = getChampionCost(unit.characterId);
                const isCarry = comp.mainCarryIds.includes(unit.characterId);
                const champ = champions.find(c => c.id === unit.characterId);
                
                return (
                  <div key={i} className="relative shrink-0 py-1">
                    <div className={`w-10 h-10 rounded-full border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)} ${isCarry ? 'ring-2 ring-orange-500/50' : ''}`}>
                      <img 
                        src={champ?.image_path || '/images/nochampionimage.jpg'} 
                        alt={unit.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {unit.items.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                        {unit.items.slice(0, 3).map((item, idx) => {
                          const itemObj = items.find(it => it.name === item);
                          return (
                            <div key={idx} className="w-3.5 h-3.5 rounded-sm bg-zinc-800 border border-zinc-600 overflow-hidden">
                              <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {unit.stars >= 3 && (
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 flex">
                        {[...Array(3)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    )}
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-zinc-400 whitespace-nowrap max-w-[50px] truncate">
                      {unit.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href={`/tft/comps/${comp.id}`} onClick={(e) => e.stopPropagation()}>
                <button data-action="view" className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <Eye className="w-5 h-5 text-white" />
                </button>
              </Link>
              {canEdit && (
                <>
                  <Link href={`/tft/planner?edit=${comp.id}`} onClick={(e) => e.stopPropagation()}>
                    <button data-action="edit" className="w-10 h-10 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors">
                      <Pencil className="w-4 h-4 text-white" />
                    </button>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this team composition?')) {
                        onDelete();
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-red-900/50 hover:bg-red-800 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}
              <div 
                className="w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors"
                onClick={onToggle}
              >
                <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="px-5 pb-5 border-t border-zinc-800 pt-4">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h4 className="text-sm font-bold text-orange-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Swords className="w-4 h-4" />
                  Final Board
                </h4>
                {comp.description && comp.description !== 'Click to add operational notes...' && (
                  <div className='mb-8'>
                    <h4 className="text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider">Notes</h4>
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
                />

              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Crown className="w-4 h-4 text-orange-400" />
                    Main Carries
                  </h4>
                  <div className="space-y-3">
                    {carries.map(({ unit, cost }, i) => {
                      const champ = champions.find(c => c.id === unit.characterId);
                      return (
                        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                          <div className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)}`}>
                            <img 
                              src={champ?.image_path || '/images/nochampionimage.jpg'} 
                              alt={unit.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{unit.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {unit.items.map((item, idx) => {
                                const itemObj = items.find(it => it.name === item);
                                return (
                                  <div 
                                    key={idx} 
                                    className="w-6 h-6 rounded bg-zinc-700 border border-zinc-600 overflow-hidden"
                                    onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY })}
                                    onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                  >
                                    <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
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
              <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-[10px] font-black text-amber-500 mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  Itemization Priority
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  {priorityItems.map((item, idx) => {
                    const itemObj = items.find(it => it.name === item);
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div 
                          className="relative w-10 h-10 rounded-2xl bg-zinc-800/50 border border-white/10 overflow-hidden hover:border-orange-500/50 hover:scale-110 transition-all cursor-help shadow-2xl group"
                          onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || '', x: e.clientX, y: e.clientY })}
                          onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                        >
                          <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {idx < priorityItems.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-white/10" />
                        )}
                      </div>
                    );
                  })}

                </div>
              </div>
            )}


              </div>
              
            </div>

              <div className="border-t border-zinc-800/50 pt-5 mt-8">
                <h4 className="text-xs font-bold text-amber-500/80 mb-4 uppercase tracking-widest">
                  Levelling Guide
                </h4>
                <div className="inline-flex items-center bg-zinc-900/80 rounded-lg px-3 py-2 border border-zinc-800/50">
                  {comp.levelingSteps.map((step, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[70px]">
                        <div className="flex items-center gap-1">
                          <ChevronsUp className={`w-4 h-4 text-yellow-600`} />
                          <span className={`text-2xl font-black text-white border-l border-orange-500/40  pl-2`}>
                            {step.level}
                          </span>
                        
                          <div className="flex flex-col items-start ml-0.5">
                            <span className="text-[12px] text-zinc-500 leading-none">{step.stage}</span>
                            <div className="flex items-center gap-0.5">
                              <span className={`text-sm font-semibold ${step.isCurrent ? 'text-yellow-400' : 'text-zinc-300'}`}>
                                {step.gold}
                              </span>
                              <Coins className="w-3 h-3 text-yellow-500" />
                            </div>
                          </div>
                        </div>
                        <div className="h-4 flex items-center justify-center">
                          {step.description && (
                            <span className="text-[11px] text-orange-500 text-center leading-tight whitespace-nowrap truncate max-w-[100px]">{step.description}</span>
                          )}
                        </div>
                      </div>
                      {i < comp.levelingSteps.length - 1 && (
                        <span className="text-zinc-600 text-lg font-light mx-3"> &gt; </span>
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

export default function TeamCompsPage() {
  const [teamComps, setTeamComps] = useState<TeamComp[]>([]);
  const [champions, setChampions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<DifficultyLevel | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<MetaTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ id: string; role?: string } | null>(null);
  const [activeSets, setActiveSets] = useState<any[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserAndComps = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUser({ id: session.user.id, role: profile?.role });
        }

        // Fetch active sets
        const setsRes = await fetch('/api/tft/active-sets');
        if (setsRes.ok) {
          const setsData = await setsRes.json();
          setActiveSets(setsData);
        }

        // Fetch team comps
        let compsUrl = '/api/tft/team-comps';
        if (selectedSetId) {
          compsUrl += `?set_id=${selectedSetId}`;
        }
        const [compsRes, champsRes, itemsRes] = await Promise.all([
          fetch(compsUrl),
          fetch('/api/tft/champions'),
          fetch('/api/tft/items')
        ]);

        if (compsRes.ok) {
          const data = await compsRes.json();
          setTeamComps(data);
        }
        if (champsRes.ok) {
          const data = await champsRes.json();
          setChampions(data);
        }
        if (itemsRes.ok) {
          const data = await itemsRes.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndComps();
  }, [selectedSetId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tft/team-comps/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTeamComps(prev => prev.filter(c => c.id !== id));
        toast.success('Team composition deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete team composition');
      }
    } catch (error) {
      console.error('Error deleting comp:', error);
      toast.error('An error occurred while deleting');
    }
  };

  const filteredComps = useMemo(() => {
    let comps = teamComps.filter(c => c.phases.final.units.length > 0);
    
    if (selectedSetId) {
      comps = comps.filter(c => c.set_id === selectedSetId);
    }
    
    if (filter !== 'all') {
      comps = comps.filter(c => c.difficulty === filter);
    }

    if (tierFilter !== 'all') {
      comps = comps.filter(c => c.tier === tierFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      comps = comps.filter(comp => {
        if (comp.name.toLowerCase().includes(query)) return true;
        
        const allUnits = [
          ...comp.phases.early.units,
          ...comp.phases.mid.units,
          ...comp.phases.final.units
        ];
        const hasMatchingUnit = allUnits.some(unit => 
          unit.name.toLowerCase().includes(query) || 
          unit.characterId.toLowerCase().includes(query)
        );
        if (hasMatchingUnit) return true;
        
        const presetName = getPresetName(comp.activePresetId);
        if (presetName.toLowerCase().includes(query)) return true;
        
        return false;
      });
    }
    
    return comps;
  }, [teamComps, filter, tierFilter, searchQuery, selectedSetId]);

  const totalWithUnits = teamComps.filter(c => c.phases.final.units.length > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavbarTft />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-4 py-4">
          <Link href="/tft" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all group uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back tft hub
          </Link>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Team Compositions</h1>
          <p className="text-zinc-400">Current popular team compositions</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <Link href="/tft/planner">
            <button className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-500/20">
              CREATE COMP
            </button>
          </Link>
          
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilter('all');
              setTierFilter('all');
              setSelectedSetId(null);
            }}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg text-sm font-bold transition-all border border-zinc-700"
          >
            CLEAR FILTERS
          </button>
        </div>

        {/* Premium Filters Bar */}
        <div className="mb-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:bg-zinc-800 transition-all"
              />
            </div>

            {/* Set Filter */}
            {activeSets.length > 1 && (
              <div className="relative">
                <select 
                  value={selectedSetId || ''} 
                  onChange={(e) => setSelectedSetId(e.target.value ? parseInt(e.target.value) : null)}
                  className="px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm font-medium text-white focus:outline-none focus:border-orange-500/50 focus:bg-zinc-800 transition-all"
                >
                  <option value="" className="bg-zinc-900 text-white">All Sets</option>
                  {activeSets.map((set: any) => (
                    <option key={set.id} value={set.id} className="bg-zinc-900 text-white">
                      S{set.set_number} - {set.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tier Filter */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setTierFilter('all')}
                className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${tierFilter === 'all' ? 'bg-orange-950/50 border border-orange-900/30 text-orange-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                *
              </button>
              {META_TIERS.map((tier) => {
                const config = META_TIER_CONFIG[tier];
                const count = teamComps.filter(c => c.tier === tier && c.phases.final.units.length > 0).length;
                return (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all border ${tierFilter === tier ? `${config.bgColor} ${config.color}` : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-transparent'}`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-orange-950/50 border border-orange-900/30 text-orange-500' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                All
              </button>
              {DIFFICULTY_LEVELS.map((config) => (
                <button
                  key={config.id}
                  onClick={() => setFilter(config.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${filter === config.id ? '' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-transparent'}`}
                  style={filter === config.id ? { 
                    backgroundColor: config.bgColor, 
                    color: config.color,
                    borderColor: config.borderColor
                  } : {}}
                >
                  {config.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredComps.length > 0 ? (
          <div className="space-y-4">
            {filteredComps.map((comp) => {
              const isAdmin = user?.role === 'admin';
              const isOwner = user?.id === comp.user_id;
              const canEdit = isAdmin || isOwner;

              return (
                <TeamCompCard 
                  key={comp.id} 
                  comp={comp} 
                  expanded={expandedId === comp.id}
                  onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                  canEdit={canEdit}
                  onDelete={() => handleDelete(comp.id)}
                  champions={champions}
                  items={items}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? 'No Matching Comps' : 'No Team Comps Yet'}
            </h3>
            <p className="text-zinc-400 text-center max-w-md mb-6">
              {searchQuery 
                ? `No comps found matching "${searchQuery}"`
                : filter === 'all' 
                  ? "Create your first team composition in the Team Planner."
                  : `No ${getDifficultyConfig(filter as DifficultyLevel).label.toLowerCase()} difficulty comps found.`
              }
            </p>
            {!searchQuery && (
              <Link href="/tft/planner">
                <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold transition-all">
                  <Plus className="w-5 h-5" />
                  Create Your First Comp
                </button>
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
