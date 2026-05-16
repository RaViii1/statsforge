"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Star,
  Crown,
  Pencil,
  ChevronsUp,
  Coins,
  Swords,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Info,
  Terminal,
  Activity,
  Layers,
  Share2
} from 'lucide-react';
import { copyToClipboard, getTierBorderColor, getTierColor } from '@/lib/tft/tftfunctions';
import { TeamComp, DifficultyLevel, UnitPosition, PhaseKey, META_TIER_CONFIG, MetaTier } from '@/lib/tft/teamplanner-types';
import { CustomTooltip } from '@/components/tft/planner';
import { TraitTooltip } from '@/components/tft/planner/TraitTooltip';
import { UnitTooltip } from '@/components/tft/UnitTooltip';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import { CurrentSetNumber, getCostBorderColor, getCostColor, getChampionImageUrl, getTraitIconUrl } from '@/lib/tft/champions';
import { getItemImageUrl } from '@/lib/tft/itemstft';
import Footer from '@/components/Footer';
import { getDifficultyConfig } from '@/lib/tft/difficulty';
import { toast } from 'sonner';
import NavbarTft from '@/components/NavbarTft';

import { createClient } from '@/lib/supabase/client';
import SvgIcon from '@/components/SvgIcon';



const PHASE_CONFIG: Record<PhaseKey, { label: string; color: string; accentColor: string; icon: React.ReactNode; desc: string }> = {
  early: { 
    label: 'Early game', 
    color: 'text-emerald-400', 
    accentColor: 'emerald',
    desc: 'Establish early economy and secure key low-cost foundations.',
    icon: <Target className="w-5 h-5" /> 
  },
  mid: { 
    label: 'Mid game', 
    color: 'text-blue-400', 
    accentColor: 'blue',
    desc: 'Transition into core synergies and stabilize against the lobby.',
    icon: <Zap className="w-5 h-5" /> 
  },
  final: { 
    label: 'Final board', 
    color: 'text-orange-400', 
    accentColor: 'orange',
    desc: 'Final board execution. Maximize power spikes and cap out levels.',
    icon: <Swords className="w-5 h-5" /> 
  }
};

const getPresetStyle = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  return preset?.tagColor || 'text-zinc-400 bg-zinc-800/50 border-zinc-700';
};

const getPresetName = (presetId: string | undefined) => {
  const preset = LEVELING_PRESETS.find(p => p.id === presetId);
  return preset?.name || 'Custom Tempo';
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

import { TooltipState } from '@/lib/tft/teamplanner-types';

const ReadOnlyHexGrid = ({ 
  units, 
  mainCarryIds,
  champions,
  items,
  setTooltip,
  tooltip,
  phase,
  activeTraits
}: { 
  units: UnitPosition[]; 
  mainCarryIds: string[];
  champions: any[];
  items: any[];
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
  tooltip: TooltipState;
  phase: PhaseKey;
  activeTraits: { name: string; count: number; activeTier?: string; unitsRequired?: number; iconPath?: string; isHero?: boolean; description?: string; tiers?: any[] }[];
}) => {
  const hexWidth = 70;
  const hexHeight = 81;
  const spacing = 82;

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Trait Tooltip */}
      <TraitTooltip
        visible={tooltip.visible && !!tooltip.trait}
        title={tooltip.title}
        description={tooltip.description}
        x={tooltip.x}
        y={tooltip.y}
        trait={tooltip.trait}
      />

      {/* Unit Tooltip */}
      <UnitTooltip
        visible={tooltip.visible && !!tooltip.champion}
        title={tooltip.title}
        description={tooltip.description}
        x={tooltip.x}
        y={tooltip.y}
        champion={tooltip.champion}
        setNumber={tooltip.setNumber}
      />
      {/* Active Traits Display */}
      <div className="flex flex-wrap justify-center gap-2">
        {activeTraits.map(trait => (
          <div 
            key={trait.name} 
            className={`group relative flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/4 border rounded-full transition-all cursor-default shadow-sm ${
              trait.isHero ? getTierBorderColor('gold') : (trait.activeTier ? getTierBorderColor(trait.activeTier) : 'border-white/5 hover:border-orange-500/30')
            }`}
            onMouseEnter={(e) => setTooltip({ 
              visible: true, 
              title: trait.name, 
              description: trait.description || '', 
              x: e.clientX, 
              y: e.clientY,
              trait: {
                id: trait.name,
                name: trait.name,
                description: trait.description || '',
                icon_path: trait.iconPath || '',
                tiers: trait.tiers || [],
                is_Hero: trait.isHero || false
              }
            })}
            onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
          >
            <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
              trait.isHero ? getTierColor('gold').split(' ')[0] : (trait.activeTier ? getTierColor(trait.activeTier).split(' ')[0] : 'bg-orange-500/60')
            }`}>
               {trait.iconPath ? (
                <img 
                  src={getTraitIconUrl(trait.iconPath)} 
                  alt={trait.name} 
                  className="w-3.5 h-3.5 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span className="text-[9px] font-black text-white">{trait.count}</span>
              )}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${
              trait.isHero ? getTierColor('gold').split(' ')[1] : (trait.activeTier ? getTierColor(trait.activeTier).split(' ')[1] : 'text-white/60')
            }`}>
              {trait.name}
            </span>
            <span className="text-[10px] font-black text-white bg-black/20 px-1.5 py-0.5 rounded">
              {trait.count}
            </span>
          </div>
        ))}
        {activeTraits.length === 0 && <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] py-4">Sector Clear: No Active Synergies</p>}
      </div>
      <div 
        className="relative rounded-3xl bg-black/40 border border-white/5 overflow-hidden p-8 backdrop-blur-md shadow-2xl"
        style={{ width: '680px', height: '390px' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]" />
        
        <div className="relative" style={{ width: '600px', height: '330px' }}>
          {[0, 1, 2, 3].map(row => [0, 1, 2, 3, 4, 5, 6].map(col => {
            const unit = units.find(u => u.row === row && u.col === col);
            const isOffset = row % 2 !== 0;
            const isCarry = unit && mainCarryIds.includes(unit.characterId);
            const champ = unit ? champions.find(c => c.id === unit.characterId) : null;
            const cost = unit ? champ?.cost || 1 : 1;
            
            return (
              <div 
                key={`${phase}-${row}-${col}`} 
                className="absolute transition-all duration-500" 
                style={{ 
                  left: `${col * spacing + (isOffset ? spacing / 2 : 0)}px`, 
                  top: `${row * 75}px`, 
                  width: `${hexWidth}px`, 
                  height: `${hexHeight}px` 
                }}
              >
                <div className={`relative w-full h-full flex items-center justify-center ${unit ? 'scale-100' : 'scale-90 opacity-10'}`}>
                  <svg viewBox="-10 -10 120 135.47" className="w-full h-full filter drop-shadow-xl overflow-visible">
                    <path 
                      d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" 
                      fill={unit ? '#09090b' : 'rgba(70, 70, 72, 0.9)'} 
                      stroke={unit ? (isCarry ? '#f97316' : getCostColor(cost)) : 'rgba(100, 100, 102, 0.6)'} 
                      strokeWidth={unit ? (isCarry ? '4' : '2') : '2'}
                      className="transition-colors duration-300"
                    />
                    {unit && (
                      <>
                        <defs>
                          <clipPath id={`clip-${phase}-${row}-${col}`}>
                            <path d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" />
                          </clipPath>
                        </defs>
                        <image 
                          href={getChampionImageUrl(champ?.image_path)} 
                          width="94" 
                          height="108" 
                          x="3" 
                          y="3.7" 
                          clipPath={`url(#clip-${phase}-${row}-${col})`} 
                          preserveAspectRatio="xMidYMid slice" 
                          onMouseEnter={(e) => {
                            if (champ) {
                              setTooltip({
                                visible: true,
                                title: champ.name,
                                description: champ.ability?.description?.active || champ.ability?.description?.passive || "",
                                x: e.clientX,
                                y: e.clientY,
                                champion: champ,
                                setNumber: CurrentSetNumber
                              });
                            }
                          }}
                          onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                        />
                      </>
                    )}
                  </svg>
                  
                  {unit && (
                    <>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
                        {isCarry && <Crown className="w-4 h-4 text-orange-500 fill-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
                        <div className="flex -space-x-1">
                          {Array.from({ length: unit.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex -space-x-1 z-30 gap-1.5">
                          {unit.items.map((item, i) => {
                            const itemObj = items.find(it => it.name === item);
                            return (
                              <div 
                                key={i} 
                                className="w-5 h-5 rounded-md border border-zinc-700 overflow-hidden bg-zinc-900  hover:scale-150 hover:z-10 transition-all duration-300 shadow-xl"
                                onMouseEnter={(e) => setTooltip({ 
                                  visible: true, 
                                  title: item, 
                                  description: itemObj?.description || 'No description', 
                                  x: e.clientX, 
                                  y: e.clientY 
                                })}
                                onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                              >
                                <img src={getItemImageUrl(itemObj?.image_path)} 
                                alt={item} 
                                className="w-full h-full object-cover" 
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};


export default function CompDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [comp, setComp] = useState<TeamComp | null>(null);
  const [champions, setChampions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [traits, setTraits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });

    useEffect(() => {
      const fetchCompData = async () => {
        try {
          // First fetch the comp to get its set_id
          const compRes = await fetch(`/api/tft/team-comps/${resolvedParams.id}`);
          if (!compRes.ok) throw new Error('Failed to fetch comp');
          
          const { comp, phases, steps, units } = await compRes.json();
          const targetSetId = comp.set_id;

          // Build URLs with set_id if available
          const baseSetUrl = targetSetId ? `?set_id=${targetSetId}` : '';
          const champsUrl = `/api/tft/champions${baseSetUrl}`;
          const itemsUrl = `/api/tft/items${baseSetUrl}`;
          const traitsUrl = `/api/tft/traits${baseSetUrl}`;

          // Fetch champions, items, and traits in parallel
          const [champsRes, itemsRes, traitsRes] = await Promise.all([
            fetch(champsUrl),
            fetch(itemsUrl),
            fetch(traitsUrl)
          ]);

         const champsData = champsRes.ok ? await champsRes.json() : [];
         const itemsData = itemsRes.ok ? await itemsRes.json() : [];
         const traitsData = traitsRes.ok ? await traitsRes.json() : [];
         setChampions(champsData);
         setItems(itemsData);
         setTraits(traitsData);
        const teamPhases: Record<PhaseKey, any> = {
          early: { units: [], notes: '' },
          mid: { units: [], notes: '' },
          final: { units: [], notes: '' }
        };

        phases.forEach((p: any) => {
          const phaseKey = p.phase as PhaseKey;
            const phaseUnits = units
              .filter((u: any) => u.phase_id === p.id)
              .map((u: any) => ({
                id: u.id,
                characterId: u.champion_id,
                name: u.name,
                row: u.row,
                col: u.col,
                stars: u.stars,
                items: u.items || []
              }));

          teamPhases[phaseKey] = {
            units: phaseUnits,
            notes: p.notes || ''
          };
        });

        setComp({
          id: comp.id,
          name: comp.name,
          description: comp.description || '',
          patch: comp.patch || '16.1',
          tier: comp.tier,
          difficulty: comp.difficulty,
          mainCarryIds: comp.main_carry_ids || [],
          synergiesList: comp.synergies_list || [],
          activePresetId: comp.active_preset_id,
          user_id: comp.user_id,
          phases: teamPhases,
          levelingSteps: steps.map((s: any) => ({
            level: s.level,
            stage: s.stage,
            gold: s.gold,
            description: s.description
          }))
        });
      } catch (e) {
        console.error("Failed to load comp", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCompData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!comp) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 mx-auto animate-pulse">
            <Activity className="w-10 h-10 text-zinc-700" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tighter uppercase">Comp Missing</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-sm">The requested tactical data could not be retrieved from the cloud database.</p>
          <Link href="/tft/comps" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl">
            <ChevronLeft className="w-4 h-4" />
            Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = getDifficultyConfig(comp.difficulty || 'medium');
  const presetStyle = getPresetStyle(comp.activePresetId);
  const presetName = getPresetName(comp.activePresetId);

  const finalUnits = comp.phases.final.units;
      const carries = comp.mainCarryIds
      .map(id => {
        const unit = finalUnits.find(u => u.characterId === id);
        const champ = champions.find(c => c.id === id);
        return unit ? { unit, cost: champ?.cost || 1 } : null;
      })
      .filter(Boolean) as { unit: UnitPosition; cost: number }[];

  const carryItems = carries.flatMap(c => c.unit.items);
  const priorityItems = [...new Set(carryItems)];

  // Helper function to calculate active traits for a phase
  const getActiveTraits = (units: UnitPosition[]) => {
    const traitCounts: Record<string, number> = {};
    const seenUnits = new Set<string>();

    units.forEach(u => {
      if (seenUnits.has(u.characterId)) return;
      seenUnits.add(u.characterId);
      const champ = champions.find(c => c.id === u.characterId);
      champ?.traits.forEach((t: string) => {
        traitCounts[t] = (traitCounts[t] || 0) + 1;
      });
    });

    return Object.entries(traitCounts)
      .map(([name, count]) => {
        const trait = traits.find(t => t.name === name);
        if (!trait) return null;

        // For hero traits, show them even if they don't have tiers
        if (trait.is_Hero) {
          return {
            name,
            count,
            activeTier: undefined,
            unitsRequired: 0,
            iconPath: trait.icon_path,
            isHero: true,
            description: trait.description,
            tiers: trait.tft_trait_tiers || []
          };
        }

        // For regular traits, require active tiers
        if (!trait?.tft_trait_tiers) return null;

        const sortedTiers = [...trait.tft_trait_tiers].sort((a, b) => a.units_required - b.units_required);
        
        const activeTier = sortedTiers.reduce((best, tier) => {
          if (count >= tier.units_required && tier.units_required > (best?.units_required || 0)) {
            return tier;
          }
          return best;
        }, null);

          if (activeTier) {
            return { 
              name, 
              count, 
              activeTier: activeTier.tier, 
              unitsRequired: activeTier.units_required,
              iconPath: trait.icon_path,
              isHero: trait.is_Hero || false,
              description: trait.description,
              tiers: trait.tft_trait_tiers || []
            };
          }
        
        return null;
      })
      .filter((t): t is any => t !== null)
      .sort((a, b) => {
        // Hero traits should appear with gold tier priority
        if (a.isHero && b.isHero) return b.count - a.count;
        if (a.isHero) return -1; // Hero trait comes first
        if (b.isHero) return 1; // Hero trait comes first
        
        // For regular traits, sort by count
        return b.count - a.count;
      });
  };

  // Calculate active traits for each phase
  const earlyTraits = getActiveTraits(comp.phases.early.units);
  const midTraits = getActiveTraits(comp.phases.mid.units);
  const finalTraits = getActiveTraits(comp.phases.final.units);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <NavbarTft />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tft/comps" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-all group uppercase text-[10px] font-black tracking-widest">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Teamcomps list
        </Link>

        {/* Header Section */}
        <div className="relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-12 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Layers className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 flex items-start justify-between flex-wrap gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                 <MetaTierBadge tier={comp.tier} />
                <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black rounded tracking-widest uppercase">
                  {comp.patch} Build
                </span>
                <span className={`px-3 py-1 text-[10px] font-black rounded border uppercase tracking-widest ${presetStyle}`}>
                  {presetName}
                </span>
                  <span 
                    className="px-3 py-1 text-[10px] font-black rounded border uppercase tracking-widest"
                    style={{ 
                      backgroundColor: difficulty.bgColor, 
                      color: difficulty.color, 
                      borderColor: difficulty.borderColor 
                    }}
                  >
                    {difficulty.label}
                  </span>
                  
              </div>
              
              {/* Active Traits Next to Team Comp Name */}
              {finalTraits.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {finalTraits.map(trait => (
                    <div 
                      key={trait.name} 
                      className={`group relative flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/4 border rounded-full transition-all cursor-default shadow-sm ${
                        trait.isHero ? getTierBorderColor('gold') : (trait.activeTier ? getTierBorderColor(trait.activeTier) : 'border-white/5 hover:border-orange-500/30')
                      }`}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                        trait.isHero ? getTierColor('gold').split(' ')[0] : (trait.activeTier ? getTierColor(trait.activeTier).split(' ')[0] : 'bg-orange-500/60')
                      }`}>
                          {trait.iconPath ? (
                            <img 
                              src={getTraitIconUrl(trait.iconPath)} 
                              alt={trait.name} 
                              className="w-3.5 h-3.5 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-[9px] font-black text-white">{trait.count}</span>
                          )}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        trait.isHero ? getTierColor('gold').split(' ')[1] : (trait.activeTier ? getTierColor(trait.activeTier).split(' ')[1] : 'text-white/60')
                      }`}>
                        {trait.name}
                      </span>
                      <span className="text-[10px] font-black text-white bg-black/20 px-1.5 py-0.5 rounded">
                        {trait.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                {comp.name}
              </h1>
              
              {comp.description && comp.description !== 'Click to add operational notes...' && (
                <p className="text-zinc-400 max-w-2xl leading-relaxed text-sm font-medium border-l-2 border-orange-500/50 pl-6 py-1">
                  {comp.description}
                </p>
              )}
            </div>
            
            <Link href={`/tft/planner?edit=${comp.id}`}>
              <button className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95 group">
                <Pencil className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Edit in Planner
              </button>
            </Link>
          </div>
        </div>

        {/* Tactical Overview Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Main Carries */}
            {carries.length > 0 && (
              <div className="lg:col-span-5 bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-[10px] font-black text-orange-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Crown className="w-4 h-4" />
                  Main Carry Units
                </h3>
                <div className="grid gap-4">
                    {carries.map(({ unit, cost }, i) => {
                      const champ = champions.find(c => c.id === unit.characterId);

                      return (
                      <div 
                        key={i} 
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group"
                      >
                          <div 
                            className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)} shadow-lg transform group-hover:scale-105 transition-transform`}
                          >
                            <img src={getChampionImageUrl(champ?.image_path)} alt={champ?.name || unit.name} className="w-full h-full object-cover" />
                          </div>
                            <div className="flex-1">
                              <p className="font-black text-white uppercase tracking-tight text-lg italic">{champ?.name || unit.name}</p>
                              <div className="flex items-center gap-2">
                                 <div className="flex items-center gap-1 text-[12px] font-bold text-zinc-500 uppercase tracking-widest">
                                   <span className='font-black'>{cost}</span>
                                   <SvgIcon type="gold" className="text-yellow-500" size={12} />
                                 </div>
                              </div>
                            </div>
                        {unit.items.length > 0 && (
                          <div className="flex gap-1.5">
                            {unit.items.map((item, idx) => {
                              const itemObj = items.find(it => it.name === item);
                              return (
                                <div 
                                  key={idx} 
                                  className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 overflow-hidden  hover:scale-125 transition-all shadow-xl"
                                  onMouseEnter={(e) => setTooltip({ 
                                    visible: true, 
                                    title: item, 
                                    description: itemObj?.description || 'No description', 
                                    x: e.clientX, 
                                    y: e.clientY 
                                  })}
                                  onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                >
                                  <img 
                                    src={itemObj?.image_path || '/images/noitem.png'} 
                                    alt={item} 
                                    className="w-full h-full object-cover"
                                   />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Levelling & Priority Items */}
            <div className={`${carries.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8`}>
              {/* Priority Items */}
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
                            className="relative w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden hover:border-orange-500/50 hover:scale-110 transition-all  shadow-2xl group"
                            onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || '', x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                          >
                            <img src={getItemImageUrl(itemObj?.image_path)} alt={item} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {idx < priorityItems.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-white/10" />
                          )}
                        </div>
                      );
                    })}
                    <div className="ml-auto bg-white/5 border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-3">
                      <Info className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">Sequence: Standard Optimization</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
                <div className="border-t border-zinc-800/50 pt-5">
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
          {/* Detailed Phase Analysis */}
          <div className="space-y-24 mt-24">
            {(['early', 'mid', 'final'] as PhaseKey[]).map((phase, idx) => {
              const config = PHASE_CONFIG[phase];
              const units = comp.phases[phase].units;
              const hasNotes = comp.phases[phase].notes && comp.phases[phase].notes.length > 0;
              
              return (
                <div key={phase} className="relative">
                  {/* Connector Line */}
                  {idx < 2 && (
                    <div className="absolute left-10 top-full h-24 w-px bg-linear-to-b from-white/10 to-transparent" />
                  )}
  
                  <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4 space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-900 border border-white/10 ${config.color} shadow-xl`}>
                            {config.icon}
                          </div>
                          <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">{config.label}</h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{units.length} units Deployed</p>
                          </div>
                        </div>
                        <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-sm">
                          {config.desc}
                        </p>
                      </div>
  
                      {/* Aesthetic Notes Display */}
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-linear-to-r from-zinc-800 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <div className="relative space-y-4">
                          <div className="flex items-center gap-3 px-4 py-1.5 bg-black/40 border border-white/5 rounded-full w-fit">
                            <Terminal className={`w-3 h-3 ${config.color}`} />
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Game Plan</span>
                          </div>
  
                          {hasNotes ? (
                            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                              <p className="text-zinc-300 text-sm font-medium leading-relaxed italic whitespace-pre-wrap">
                                {comp.phases[phase].notes}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-white/2 border border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                              <Info className="w-5 h-5 text-zinc-800 mb-2" />
                              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No phase plan logged</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                      <div className="lg:col-span-8 flex justify-center">
                      {units.length > 0 ? (
                        <ReadOnlyHexGrid 
                          units={units} 
                          mainCarryIds={comp.mainCarryIds}
                          champions={champions}
                          items={items}
                          setTooltip={setTooltip}
                          tooltip={tooltip}
                          phase={phase}
                          activeTraits={
                            phase === 'early' ? earlyTraits : 
                            phase === 'mid' ? midTraits : 
                            finalTraits
                          }
                        />
                      ) : (

                      <div className="w-[680px] h-[390px] flex items-center justify-center bg-white/2 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto shadow-2xl">
                            {config.icon}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Sector Inactive</p>
                            <p className="text-[10px] font-medium text-zinc-800 uppercase tracking-widest">No units placed for this phase</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <div className='flex flex-row items-center justify-center mb-16'>
        <button 
            onClick={async () => { 
              const success = await copyToClipboard(window.location.href);
              if (success) toast.success("Copied link to clipboard"); 
              else toast.error("Failed to copy link");
            }} 
            className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:scale-105 active:scale-95 group"
          >
            <Share2 className="w-4 h-4" /> 
            Share Teamcomp
          </button>
</div>
     

      <Footer />
 
      {tooltip.visible && !tooltip.trait && (
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

      <style jsx global>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.3; }    
          50% { opacity: 0.6; }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
