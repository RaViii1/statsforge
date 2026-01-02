"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Star,
  Crown,
  Pencil
} from 'lucide-react';
import { getTFTUnitIcon, getTFTItemIcon } from '@/lib/tft/tftfunctions';
import { TeamComp, DifficultyLevel, UnitPosition, PhaseKey } from '@/lib/tft/teamplanner-types';
import { getItemDescription } from '@/lib/tft/itemstft';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; color: string; bgColor: string }> = {
  easy: { 
    label: 'Easy', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/20 border border-emerald-500/30',
  },
  medium: { 
    label: 'Medium', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/20 border border-amber-500/30',
  },
  hard: { 
    label: 'Hard', 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20 border border-red-500/30',
  },
  'augment-dependent': { 
    label: 'Augment', 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/20 border border-purple-500/30',
  }
};

const PHASE_CONFIG: Record<PhaseKey, { label: string; color: string; bgColor: string }> = {
  early: { label: 'Early Game', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/30' },
  mid: { label: 'Mid Game', color: 'text-blue-400', bgColor: 'bg-blue-500/10 border-blue-500/30' },
  final: { label: 'Final Board', color: 'text-orange-400', bgColor: 'bg-orange-500/10 border-orange-500/30' }
};

const getCostColor = (cost: number): string => {
  switch (cost) {
    case 1: return '#94a3b8';
    case 2: return '#10b981';
    case 3: return '#3b82f6';
    case 4: return '#a855f7';
    case 5: return '#eab308';
    case 6: return '#ef4444';
    default: return '#94a3b8';
  }
};

const getUnitCost = (characterId: string): number => {
  const costMap: Record<string, number> = {
    'TFT16_Sion': 1, 'TFT16_Shen': 2, 'TFT16_Aphelios': 3, 'TFT16_Bard': 3,
    'TFT16_DrMundo': 1, 'TFT16_Illaoi': 1, 'TFT16_Volibear': 3, 'TFT16_Wukong': 2,
    'TFT16_KobukoYuumi': 3, 'TFT16_JarvanIV': 1
  };
  return costMap[characterId] || 1;
};

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

interface TooltipState {
  visible: boolean;
  title: string;
  description: string;
  x: number;
  y: number;
}

const ReadOnlyHexGrid = ({ 
  units, 
  mainCarryIds,
  setTooltip,
  phase
}: { 
  units: UnitPosition[]; 
  mainCarryIds: string[];
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
  phase: PhaseKey;
}) => {
  const hexWidth = 75;
  const hexHeight = 87;
  const spacing = 88;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative rounded-2xl bg-zinc-900/30 border border-zinc-800 overflow-hidden p-6"
        style={{ width: '698px', height: '402px' }}
      >
        <div className="relative" style={{ width: '650px', height: '370px' }}>
          {[0, 1, 2, 3].map(row => [0, 1, 2, 3, 4, 5, 6].map(col => {
            const unit = units.find(u => u.row === row && u.col === col);
            const isOffset = row % 2 !== 0;
            const isCarry = unit && mainCarryIds.includes(unit.characterId);
            const cost = unit ? getUnitCost(unit.characterId) : 1;
            
            return (
              <div 
                key={`${phase}-${row}-${col}`} 
                className="absolute transition-all" 
                style={{ 
                  left: `${col * spacing + (isOffset ? spacing / 2 : 0)}px`, 
                  top: `${row * spacing}px`, 
                  width: `${hexWidth}px`, 
                  height: `${hexHeight}px` 
                }}
              >
                <div className={`relative w-full h-full flex items-center justify-center ${unit ? 'scale-100' : 'scale-90 opacity-20'}`}>
                  <svg viewBox="-10 -10 120 135.47" className="w-full h-full filter drop-shadow-lg overflow-visible">
                    <path 
                      d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" 
                      fill={unit ? '#18181b' : 'rgba((53, 54, 54, 0.3)'} 
                      stroke={unit ? (isCarry ? '#ea580c' : getCostColor(cost)) : 'rgb(53, 54, 54)'} 
                      strokeWidth={unit ? '4' : '1'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    {unit && (
                      <>
                        <defs>
                          <clipPath id={`clip-${phase}-${row}-${col}`}>
                            <path d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" />
                          </clipPath>
                        </defs>
                        <image 
                          href={getTFTUnitIcon(unit.characterId, 16)} 
                          width="94" 
                          height="108" 
                          x="3" 
                          y="3.7" 
                          clipPath={`url(#clip-${phase}-${row}-${col})`} 
                          preserveAspectRatio="xMidYMid slice" 
                        />
                      </>
                    )}
                  </svg>
                  
                  {unit && (
                    <>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
                        {isCarry && <Crown className="w-4 h-4 text-orange-500 fill-orange-500" />}
                        <div className="flex -space-x-0.5 ml-0.5">
                          {Array.from({ length: unit.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex -space-x-0.5 z-30">
                          {unit.items.map((item, i) => (
                            <div 
                              key={i} 
                              className="w-5 h-5 rounded border border-zinc-600 overflow-hidden bg-zinc-800 cursor-help"
                              onMouseEnter={(e) => setTooltip({ 
                                visible: true, 
                                title: item, 
                                description: getItemDescription(item) || 'No description', 
                                x: e.clientX, 
                                y: e.clientY 
                              })}
                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                            >
                              <img src={getTFTItemIcon(item)} alt={item} className="w-full h-full object-cover" />
                            </div>
                          ))}
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
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('tft_planned_teams_v3');
    if (saved) {
      try {
        const comps: TeamComp[] = JSON.parse(saved);
        const foundComp = comps.find(c => c.id === resolvedParams.id);
        if (foundComp) {
          setComp(foundComp);
        }
      } catch (e) {
        console.error("Failed to load comp", e);
      }
    }
  }, [resolvedParams.id]);

  if (!comp) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Comp Not Found</h2>
          <Link href="/tft/comps" className="text-orange-500 hover:underline">
            Back to Comps
          </Link>
        </div>
      </div>
    );
  }

  const difficulty = DIFFICULTY_CONFIG[comp.difficulty || 'medium'];
  const presetStyle = getPresetStyle(comp.activePresetId);
  const presetName = getPresetName(comp.activePresetId);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/tft/comps" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Comps
        </Link>

        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-3xl font-bold text-white">{comp.name}</h1>
              <span className="px-3 py-1 bg-orange-950/50 border border-orange-900/30 text-orange-500 text-sm font-bold rounded">
                {comp.patch}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded border ${presetStyle}`}>
                {presetName}
              </span>
              <span className={`px-3 py-1 ${difficulty.bgColor} ${difficulty.color} text-sm font-bold rounded`}>
                {difficulty.label}
              </span>
            </div>
            {comp.description && comp.description !== 'Click to add operational notes...' && (
              <p className="text-zinc-400 max-w-2xl">{comp.description}</p>
            )}
          </div>
          <Link href={`/tft/planner?edit=${comp.id}`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg transition-colors">
              <Pencil className="w-4 h-4" />
              Edit in Planner
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {comp.mainCarryIds.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-4 h-4 text-orange-500" />
                Main Carries
              </h3>
              <div className="space-y-3">
                {comp.mainCarryIds.map(id => {
                  const unit = comp.phases.final.units.find(u => u.characterId === id);
                  if (!unit) return null;
                  const cost = getUnitCost(id);
                  
                  return (
                    <div key={id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 overflow-hidden"
                        style={{ borderColor: getCostColor(cost) }}
                      >
                        <img src={getTFTUnitIcon(id, 16)} alt={unit.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white">{unit.name}</p>
                        <p className="text-xs text-zinc-500">{cost} cost</p>
                      </div>
                      {unit.items.length > 0 && (
                        <div className="flex gap-1">
                          {unit.items.map((item, i) => (
                            <div 
                              key={i} 
                              className="w-7 h-7 rounded bg-zinc-700 border border-zinc-600 overflow-hidden cursor-help"
                              onMouseEnter={(e) => setTooltip({ 
                                visible: true, 
                                title: item, 
                                description: getItemDescription(item) || 'No description', 
                                x: e.clientX, 
                                y: e.clientY 
                              })}
                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                            >
                              <img src={getTFTItemIcon(item)} alt={item} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 ${comp.mainCarryIds.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <h3 className="text-sm font-bold text-zinc-300 mb-4 uppercase tracking-wider">Leveling Guide</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {comp.levelingSteps.map((step, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${step.isCurrent ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-zinc-800/30 border border-zinc-800'}`}
                >
                  <span className="w-10 h-10 rounded-lg bg-orange-950/50 border border-orange-900/30 flex items-center justify-center text-orange-500 font-bold text-lg mb-2">
                    {step.level}
                  </span>
                  <span className="text-zinc-300 text-sm font-medium">{step.stage}</span>
                  <span className="text-orange-400 text-xs font-bold">{step.gold}g</span>
                  {step.description && (
                    <span className="text-[10px] text-zinc-500 mt-1 text-center">{step.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {(['early', 'mid', 'final'] as PhaseKey[]).map(phase => {
            const config = PHASE_CONFIG[phase];
            const units = comp.phases[phase].units;
            
            return (
              <div key={phase} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold ${config.color}`}>{config.label}</h2>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${config.bgColor} ${config.color}`}>
                      {units.length} units
                    </span>
                  </div>
                </div>
                
                {units.length > 0 ? (
                  <div className="flex justify-center">
                    <ReadOnlyHexGrid 
                      units={units} 
                      mainCarryIds={comp.mainCarryIds}
                      setTooltip={setTooltip}
                      phase={phase}
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">
                    No units placed for {config.label.toLowerCase()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />

      {tooltip.visible && (
        <div 
          className="fixed z-50 pointer-events-none bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-2xl max-w-xs"
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
        >
          <p className="font-bold text-orange-400 text-sm mb-1">{tooltip.title}</p>
          <p className="text-xs text-zinc-300 leading-relaxed">{tooltip.description}</p>
        </div>
      )}
    </div>
  );
}
