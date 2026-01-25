"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, 
  Edit3,
  Share2,
  Save,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { SET_16_CHAMPIONS, ALL_TRAITS, TFTChampion } from '@/lib/tft/champions';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import { 
  TeamComp, 
  TeamPhase, 
  PhaseKey, 
  UnitPosition, 
  LevelingStep,
  TooltipState,
  DifficultyLevel,
  MetaTier,
  PATCHES, 
  DEFAULT_LEVELING, 
  UNITS_PER_PAGE 
} from '@/lib/tft/teamplanner-types';

import {
  CustomTooltip,
  DifficultyPicker,
  HexGrid,
  LevelingTempo,
  MainCarryTray,
  TierPicker,
  UnitDetails,
  UnitSelector
} from './planner';


interface TftTeamPlannerProps {
  editId?: string | null;
}



const createEmptyTeam = (): TeamComp => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'NEW TACTICAL PLAN',
  description: 'Click to add teamcomp description...',
  phases: {
    early: { units: [], notes: '' },
    mid: { units: [], notes: '' },
    final: { units: [], notes: '' }
  },
  mainCarryIds: [],
  levelingSteps: JSON.parse(JSON.stringify(DEFAULT_LEVELING)),
    patch: PATCHES[0],
    difficulty: undefined,
    synergiesList: [],
  });


export const TftTeamPlanner = ({ editId }: TftTeamPlannerProps) => {
  const [currentTeam, setCurrentTeam] = useState<TeamComp | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activePhase, setActivePhase] = useState<PhaseKey>('final');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [draggedChampionId, setDraggedChampionId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedFromBoard, setDraggedFromBoard] = useState<{row: number, col: number} | null>(null);
  const [selectedHex, setSelectedHex] = useState<{row: number, col: number} | null>(null);
  const [itemSearch, setItemSearch] = useState('');
  const [unitPage, setUnitPage] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [champions, setChampions] = useState<TFTChampion[]>([]);
  const [allTraits, setAllTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [champsRes, traitsRes] = await Promise.all([
          fetch("/api/tft/champions"),
          fetch("/api/tft/traits")
        ]);

        if (champsRes.ok) {
          const champsData = await champsRes.json();
          setChampions(champsData);
        }

        if (traitsRes.ok) {
          const traitsData = await traitsRes.json();
          setAllTraits(traitsData.map((t: any) => t.name));
        }
      } catch (error) {
        console.error("Error fetching TFT data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
  }, []);
// console.log("Fetching TFT data... champioms", champions);
// console.log("Fetching TFT data... Traits", allTraits);

  useEffect(() => {
    if (editId) {
      const saved = localStorage.getItem('tft_planned_teams_v3');
      if (saved) {
        try {
          const teams: TeamComp[] = JSON.parse(saved);
          const teamToEdit = teams.find(t => t.id === editId);
          if (teamToEdit) {
            setCurrentTeam(teamToEdit);
            setIsEditMode(true);
            return;
          }
        } catch (e) {
          console.error("Failed to parse saved teams", e);
        }
      }
    }
    setCurrentTeam(createEmptyTeam());
    setIsEditMode(false);
  }, [editId]);

  const saveTeam = () => {
    if (!currentTeam) return;
    
    const saved = localStorage.getItem('tft_planned_teams_v3');
    let teams: TeamComp[] = [];
    
    if (saved) {
      try {
        teams = JSON.parse(saved);
      } catch (e) {
        teams = [];
      }
    }
    
    const existingIndex = teams.findIndex(t => t.id === currentTeam.id);
    if (existingIndex >= 0) {
      teams[existingIndex] = currentTeam;
    } else {
      teams.push(currentTeam);
    }
    
    localStorage.setItem('tft_planned_teams_v3', JSON.stringify(teams));
    toast.success("Teamcomp saved locally");
    setShowSaveToast(true);
    setIsEditMode(true);
  };

  const deleteTeam = () => {
    if (!currentTeam) return;
    
    const saved = localStorage.getItem('tft_planned_teams_v3');
    if (saved) {
      try {
        const teams: TeamComp[] = JSON.parse(saved);
        const updated = teams.filter(t => t.id !== currentTeam.id);
        localStorage.setItem('tft_planned_teams_v3', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to delete team", e);
      }
    }
    
    setCurrentTeam(createEmptyTeam());
    setIsEditMode(false);
    toast.success("Operation deleted");
  };

  const activePreset = useMemo(() => 
    LEVELING_PRESETS.find(p => p.id === currentTeam?.activePresetId), 
    [currentTeam?.activePresetId]
  );

  const currentPhaseData = useMemo(() => currentTeam?.phases[activePhase] || null, [currentTeam, activePhase]);

  const activeTraits = useMemo(() => {
    if (!currentPhaseData) return [];
    const traitCounts: Record<string, number> = {};
    const seenUnits = new Set<string>();

    currentPhaseData.units.forEach(u => {
      if (seenUnits.has(u.characterId)) return;
      seenUnits.add(u.characterId);
      const champ = champions.find(c => c.id === u.characterId);
      champ?.traits.forEach(t => {
        traitCounts[t] = (traitCounts[t] || 0) + 1;
      });
    });

    return Object.entries(traitCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [currentPhaseData?.units]);

  const filteredChampions = useMemo(() => {
    return champions.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTraits = selectedTraits.length === 0 || selectedTraits.every(t => c.traits.includes(t));
      return matchesSearch && matchesTraits;
    }).sort((a, b) => a.cost - b.cost);
  }, [searchQuery, selectedTraits]);

  const updateTeam = (updates: Partial<TeamComp>) => {
    if (!currentTeam) return;
    setCurrentTeam({ ...currentTeam, ...updates });
  };

  const updateCurrentPhase = (updates: Partial<TeamPhase>) => {
    if (!currentTeam) return;
    const updatedPhases = { ...currentTeam.phases };
    updatedPhases[activePhase] = { ...updatedPhases[activePhase], ...updates };
    updateTeam({ phases: updatedPhases });
  };

  const addUnit = (characterId: string, row: number, col: number) => {
    if (!currentPhaseData) return;
    const champ = champions.find(c => c.id === characterId);
    if (!champ) return;

    const newUnit: UnitPosition = {
      id: Math.random().toString(36).substr(2, 9),
      characterId,
      name: champ.name,
      row,
      col,
      stars: 1,
      items: []
    };

    const updatedUnits = currentPhaseData.units.filter(u => !(u.row === row && u.col === col));
    updatedUnits.push(newUnit);
    updateCurrentPhase({ units: updatedUnits });
    toast.success(`${champ.name} deployed`);
  };

  const moveUnit = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!currentPhaseData) return;
    const unit = currentPhaseData.units.find(u => u.row === fromRow && u.col === fromCol);
    if (!unit) return;

    const targetUnit = currentPhaseData.units.find(u => u.row === toRow && u.col === toCol);
    let updatedUnits = currentPhaseData.units.filter(u => 
      !(u.row === fromRow && u.col === fromCol) && 
      !(u.row === toRow && u.col === toCol)
    );

    updatedUnits.push({ ...unit, row: toRow, col: toCol });
    if (targetUnit) updatedUnits.push({ ...targetUnit, row: fromRow, col: fromCol });

    updateCurrentPhase({ units: updatedUnits });
  };

  const addItemToUnit = (characterId: string, itemName: string) => {
    if (!currentPhaseData) return;
    const unit = currentPhaseData.units.find(u => u.characterId === characterId);
    if (!unit) {
      toast.warning("Unit must be deployed on board to equip items");
      return;
    }

    if (unit.items.length < 3) {
      updateCurrentPhase({
        units: currentPhaseData.units.map(u => 
          u.id === unit.id ? { ...u, items: [...u.items, itemName] } : u
        )
      });
      toast.success(`Equipped ${itemName}`);
    } else {
      toast.warning("Unit inventory full");
    }
  };

  const toggleMainCarry = (characterId: string) => {
    if (!currentTeam) return;
    const isCarry = currentTeam.mainCarryIds.includes(characterId);
    let newCarryIds = [...currentTeam.mainCarryIds];

    if (isCarry) {
      newCarryIds = newCarryIds.filter(id => id !== characterId);
      toast.info("Carry status revoked");
    } else {
      if (newCarryIds.length >= 3) {
        toast.warning("Carry limit reached (3/3)");
        return;
      }
      newCarryIds.push(characterId);
      toast.success("Designated as Main Carry");
    }
    updateTeam({ mainCarryIds: newCarryIds });
  };

  const updateLevelingStep = (index: number, updates: Partial<LevelingStep>) => {
    if (!currentTeam) return;
    const newSteps = [...currentTeam.levelingSteps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateTeam({ levelingSteps: newSteps });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    }
  };

  if (!currentTeam || !currentPhaseData) return null;

  const selectedUnit = selectedHex ? currentPhaseData.units.find(u => u.row === selectedHex.row && u.col === selectedHex.col) : null;

  const handleHexDrop = (row: number, col: number) => {
    const unit = currentPhaseData.units.find(u => u.row === row && u.col === col);
    if (draggedFromBoard) {
      moveUnit(draggedFromBoard.row, draggedFromBoard.col, row, col);
    } else if (draggedChampionId) {
      addUnit(draggedChampionId, row, col);
    } else if (draggedItemId && unit) {
      addItemToUnit(unit.characterId, draggedItemId);
    }
    setDraggedFromBoard(null);
    setDraggedChampionId(null);
    setDraggedItemId(null);
  };

  const handleAddUnitToEmptyHex = (championId: string) => {
    const emptyHex = [0, 1, 2, 3].flatMap(r => [0, 1, 2, 3, 4, 5, 6].map(col => ({ r, col }))).find(hex => !currentPhaseData.units.find(u => u.row === hex.r && u.col === hex.col));
    if (emptyHex) addUnit(championId, emptyHex.r, emptyHex.col);
    else toast.warning("Deployment grid full");
  };

  return (
      <>
        <div className="flex items-center gap-4 py-4">
          <Link href="/tft/comps" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all group uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back to Comps
          </Link>
        </div>
      <div className="w-full bg-zinc-950/80 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl animate-in fade-in duration-500" onMouseMove={handleMouseMove}>
        <CustomTooltip {...tooltip} />
      <div className="flex items-center gap-4 justify-between px-6 py-4 bg-white/2 border-b border-white/5">
          <span className="text-[11px] font-black text-orange-500 tracking-[0.2em]">
            {isEditMode ? 'EDITING' : 'NEW COMP'}
          </span>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2"></div>
              <TierPicker 
                value={currentTeam.tier} 
                onChange={(tier) => updateTeam({ tier })} 
                setTooltip={setTooltip}
              />
              <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2"></div>
              <DifficultyPicker 
                value={currentTeam.difficulty} 
                onChange={(level) => updateTeam({ difficulty: level })} 
                setTooltip={setTooltip}
              />
              <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2"></div>
            {activePreset && (
              <>
                <div className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-lg ${activePreset.tagColor}`}>
                  {activePreset.name}
                </div>
                <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2"></div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/4 border border-white/5 rounded-xl">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Patch:</span>
            <select value={currentTeam.patch} onChange={(e) => updateTeam({ patch: e.target.value })} className="bg-transparent text-[10px] font-black text-orange-400 focus:bg-zinc-900 focus:outline-none cursor-pointer">
              {PATCHES.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
            </select>
          </div>
          <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2 content-end"></div>
          <button onClick={() => { navigator.clipboard.writeText(`http://localhost:3000/tft/comps/${currentTeam.id}`); toast.success("Operation link copied"); }} className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 text-white/40 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
          <button onClick={deleteTeam} className="p-2.5 hover:bg-red-500/10 rounded-xl border border-white/5 text-white/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
        
      </div>

        <div className="grid lg:grid-cols-[1fr_400px] min-h-0">
          <div className="p-8 lg:p-12 space-y-12 border-r border-white/5 min-w-0">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4 flex-1">
              
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={currentTeam.name} onChange={(e) => updateTeam({ name: e.target.value })} onBlur={() => setIsEditingName(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)} className="bg-white/5 border border-orange-500/50 rounded-2xl px-5 py-3 text-2xl font-black text-white w-full focus:outline-none" />
                </div>
              ) : (
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{currentTeam.name}</h2>
                  <Edit3 className="w-5 h-5 opacity-0 group-hover:opacity-40 text-white transition-all" />
                </div>
              )}
            <div className="w-full md:w-80 group relative">
              <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest py-2">Teamcomp Description</h3>
              {isEditingDesc ? (
                <textarea autoFocus value={currentTeam.description} onChange={(e) => updateTeam({ description: e.target.value })} onBlur={() => setIsEditingDesc(false)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-24 focus:outline-none focus:border-orange-500/50 text-xs resize-none" />
              ) : (
                
                <div className="flex gap-4 p-4 bg-white/2 rounded-2xl border border-white/5 items-start cursor-pointer hover:bg-white/4 transition-colors" onClick={() => setIsEditingDesc(true)}>
                  <p className="text-white/40 text-[11px] font-medium leading-relaxed italic flex-1">"{currentTeam.description}"</p>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-40 text-white" />
                </div>
              )}
            </div>

              <div className="flex items-center gap-3">
                <div className="flex p-1 bg-white/4 border border-white/5 rounded-2xl shadow-inner">
                  {(['early', 'mid', 'final'] as PhaseKey[]).map(phase => (
                    <button 
                      key={phase} 
                      onClick={() => { setActivePhase(phase); setSelectedHex(null); }}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePhase === phase ? 'bg-orange-500 text-white shadow-xl' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Phase Strategy Notes</span>
                </div>
                  <textarea 
                    key={activePhase}
                    value={currentPhaseData.notes} 
                    onChange={(e) => updateCurrentPhase({ notes: e.target.value })} 

                  placeholder={`Add specific notes for the ${activePhase} game phase...`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-32 focus:outline-none focus:border-orange-500/50 text-[11px] resize-none leading-relaxed italic"
                />
              </div>
            </div>
          </div>

          <MainCarryTray
            mainCarryIds={currentTeam.mainCarryIds}
            units={currentPhaseData.units}
            onToggleCarry={toggleMainCarry}
            onItemDrop={addItemToUnit}
            draggedChampionId={draggedChampionId}
            draggedFromBoard={draggedFromBoard}
            draggedItemId={draggedItemId}
            setDraggedChampionId={setDraggedChampionId}
            setDraggedFromBoard={setDraggedFromBoard}
            setDraggedItemId={setDraggedItemId}
            setTooltip={setTooltip}
          />
          <HexGrid
            units={currentPhaseData.units}
            mainCarryIds={currentTeam.mainCarryIds}
            selectedHex={selectedHex}
            activeTraits={activeTraits}
            onHexClick={(row, col, isActive) => setSelectedHex(isActive ? null : { row, col })}
            onDrop={handleHexDrop}
            onUnitDragStart={(row, col, characterId) => {
              setDraggedFromBoard({ row, col });
              setDraggedChampionId(characterId);
            }}
            setTooltip={setTooltip}
          />

          <LevelingTempo
              steps={currentTeam.levelingSteps}
              activePresetId={currentTeam.activePresetId}
              onStepChange={updateLevelingStep}
              onApplyPreset={(presetId, steps) => updateTeam({ 
                levelingSteps: steps,
                activePresetId: presetId
              })}
            />

        </div>

        <div className="flex flex-col bg-white/2 backdrop-blur-xl h-full border-l border-white/5">
          {selectedUnit ? (
            <UnitDetails
              unit={selectedUnit}
              mainCarryIds={currentTeam.mainCarryIds}
              onToggleCarry={toggleMainCarry}
              onRemoveUnit={() => {
                updateCurrentPhase({ units: currentPhaseData.units.filter(u => u.id !== selectedUnit.id) });
                setSelectedHex(null);
                toast.error("Unit removed");
              }}
              onUpdateStars={(stars) => {
                updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, stars } : u) });
              }}
              onAddItem={(itemName) => {
                updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, items: [...u.items, itemName] } : u) });
              }}
              onRemoveItem={(index) => {
                updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, items: u.items.filter((_, idx) => idx !== index) } : u) });
              }}
              itemSearch={itemSearch}
              setItemSearch={setItemSearch}
              setDraggedItemId={setDraggedItemId}
              setTooltip={setTooltip}
            />
          ) : (
            <UnitSelector
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTraits={selectedTraits}
              setSelectedTraits={setSelectedTraits}
              filteredChampions={filteredChampions}
              unitPage={unitPage}
              setUnitPage={setUnitPage}
              unitsPerPage={UNITS_PER_PAGE}
              onAddUnit={handleAddUnitToEmptyHex}
              onClearBoard={() => {
                updateCurrentPhase({ units: [] });
                setSelectedHex(null);
                toast.error("Sector cleared");
              }}
                onSave={saveTeam}
              setDraggedChampionId={setDraggedChampionId}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};
