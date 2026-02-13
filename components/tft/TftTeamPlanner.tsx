"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Trash2, 
  Edit3,
  Share2,
  Save,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { ALL_TRAITS, TFTChampion, TFTSet } from '@/lib/tft/champions';
import { LEVELING_PRESETS } from '@/lib/tft/leveling-presets';
import { 
  TeamComp, 
  TeamPhase, 
  PhaseKey, 
  UnitPosition, 
  LevelingStep,
  TooltipState,
  generatePatchesForSet,
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
import SetPicker from './planner/SetPicker';

interface TftTeamPlannerProps {
  editId?: string | null;
}

const createEmptyTeam = (setId: number = 0, setNumber: number = 16): TeamComp => ({
  id: Math.random().toString(36).substr(2, 9),
  user_id: '',
  set_id: setId,
  name: 'NEW TACTICAL PLAN',
  description: 'Click to add teamcomp description...',
  phases: {
    early: { units: [], notes: '' },
    mid: { units: [], notes: '' },
    final: { units: [], notes: '' }
  },
  mainCarryIds: [],
  levelingSteps: JSON.parse(JSON.stringify(DEFAULT_LEVELING)),
  patch: `${setNumber}.1`,
  difficulty: undefined,
  synergiesList: [],
});

export const TftTeamPlanner = ({ editId }: TftTeamPlannerProps) => {
  const supabase = createClient();
  const { user, userRole, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [currentTeam, setCurrentTeam] = useState<TeamComp | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activePhase, setActivePhase] = useState<PhaseKey>('final');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  
  // Reset to first page when search or traits change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setUnitPage(0);
  };
  
  const handleTraitsChange = (traits: string[]) => {
    setSelectedTraits(traits);
    setUnitPage(0);
  };
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
  const [activeSets, setActiveSets] = useState<TFTSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [champions, setChampions] = useState<TFTChampion[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [allTraits, setAllTraits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data (sets + items only)
  useEffect(() => {
    async function init() {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }

      // Fetch active sets
      const setsRes = await fetch("/api/tft/active-sets");
      if (setsRes.ok) {
        const setsData = await setsRes.json();
        setActiveSets(setsData);
        if (setsData.length > 0 && !editId) {
          setSelectedSetId(setsData[0].id);
        }
      }

      // Always fetch items (set-agnostic)
      const itemsRes = await fetch("/api/tft/items");
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData);
      }

      setLoading(false);
    }
    
    init();
  }, [user]);

  // Refetch champions/traits when selectedSetId changes
  useEffect(() => {
    if (!selectedSetId) {
      return;
    }
    
    const loadSetData = async () => {
      try {
        const [champsRes, traitsRes] = await Promise.all([
          fetch(`/api/tft/champions?set_id=${selectedSetId}`),
          fetch(`/api/tft/traits?set_id=${selectedSetId}`)
        ]);

        if (champsRes.ok) {
          const champsData = await champsRes.json();
          setChampions(champsData);
          // Clear search/traits when champions change
          setSearchQuery('');
          setSelectedTraits([]);
          setUnitPage(0);
        } else {
          console.error('Failed to fetch champions:', champsRes.status);
        }
        
         if (traitsRes.ok) {
            const traitsData = await traitsRes.json();
            setAllTraits(traitsData);
          } else {
            console.error('Failed to fetch traits:', traitsRes.status);
          }
      } catch (error) {
        console.error('Error fetching set data:', error);
      }
    };
    
    loadSetData();
  }, [selectedSetId]);

  const fetchTeamComp = async (id: string) => {
    try {
      const res = await fetch(`/api/tft/team-comps/${id}`);
      if (!res.ok) return null;
      
      const { comp, phases, steps, units } = await res.json();

      const teamPhases: Record<PhaseKey, TeamPhase> = {
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

      const team = {
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
        })),
        set_id: comp.set_id
      };

      return team;
    } catch (error) {
      console.error('Error fetching team comp:', error);
      return null;
    }
  };

  const saveTeamComp = async (comp: TeamComp, userId: string) => {
    try {
      const res = await fetch('/api/tft/team-comps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comp, userId })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save');
      }

      const data = await res.json();
      return data.id;
    } catch (error) {
      console.error('Error saving team comp:', error);
      return null;
    }
  };

  const deleteTeamComp = async (id: string) => {
    try {
      const res = await fetch(`/api/tft/team-comps/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting team comp:', error);
      return false;
    }
  };

  useEffect(() => {
    if (editId) {
      const load = async () => {
        const team = await fetchTeamComp(editId);
        if (team) {
          setCurrentTeam(team);
          setIsEditMode(true);
          setSelectedSetId(team.set_id || selectedSetId);
        } else {
          const currentSet = activeSets.find(s => s.id === selectedSetId);
          setCurrentTeam(createEmptyTeam(selectedSetId || 0, currentSet?.set_number || 16));
          setIsEditMode(false);
        }
      };
      load();
    } else {
      const currentSet = activeSets.find(s => s.id === selectedSetId);
      if (selectedSetId) {
        setCurrentTeam(createEmptyTeam(selectedSetId, currentSet?.set_number || 16));
      }
      setIsEditMode(false);
    }
  }, [editId, selectedSetId, activeSets]);

  const canEdit = useMemo(() => {
    if (!currentTeam) return false;
    if (!isEditMode) return true;
    if (userRole === 'admin') return true;
    return user && currentTeam.user_id === user.id;
  }, [user, userRole, currentTeam, isEditMode]);

  const [isSaving, setIsSaving] = useState(false);

  const saveTeam = async () => {
    if (isSaving || !currentTeam) return;
    if (!user) {
      toast.error("You must be logged in to save team comps");
      return;
    }
    if (!canEdit) {
      toast.error("You do not have permission to edit this team comp");
      return;
    }
    
    setIsSaving(true);
    try {
      const savedId = await saveTeamComp(currentTeam, user.id);
      if (savedId) {
        setCurrentTeam({ ...currentTeam, id: savedId, user_id: user.id });
        toast.success("Teamcomp saved to database");
        setShowSaveToast(true);
        setIsEditMode(true);
      } else {
        toast.error("Failed to save team comp");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTeam = async () => {
    if (!currentTeam) return;
    if (!user) {
      toast.error("You must be logged in to delete team comps");
      return;
    }
    if (!canEdit) {
      toast.error("You do not have permission to delete this team comp");
      return;
    }

    const success = await deleteTeamComp(currentTeam.id);
    if (success) {
      toast.success("Teamcomp deleted from database");
      setCurrentTeam(createEmptyTeam());
      setIsEditMode(false);
    } else {
      toast.error("Failed to delete team comp");
    }
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

    // Find active tiers for each trait
    return Object.entries(traitCounts)
      .map(([name, count]) => {
        const trait = allTraits.find(t => t.name === name);
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

        // Sort tiers by units_required ascending
        const sortedTiers = [...trait.tft_trait_tiers].sort((a, b) => a.units_required - b.units_required);
        
        // Find the highest tier that the count meets or exceeds
        const activeTier = sortedTiers.reduce((best, tier) => {
          if (count >= tier.units_required && tier.units_required > (best?.units_required || 0)) {
            return tier;
          }
          return best;
        }, null);

        // Only include traits with active tiers
         if (activeTier) {
            return { 
              name, 
              count, 
              activeTier: activeTier.tier, 
              unitsRequired: activeTier.units_required,
              iconPath: trait.icon_path, // Include trait icon path
              isHero: trait.is_Hero || false, // Include hero trait flag
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
  }, [currentPhaseData?.units, champions, allTraits]);

  const filteredChampions = useMemo(() => {
    return champions.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTraits = selectedTraits.length === 0 || selectedTraits.every(t => c.traits.includes(t));
      return matchesSearch && matchesTraits;
    }).sort((a, b) => a.cost - b.cost);
  }, [searchQuery, selectedTraits, champions]);

  const updateTeam = (updates: Partial<TeamComp>) => {
    if (!currentTeam || !canEdit) return;
    setCurrentTeam({ ...currentTeam, ...updates });
  };

  const updateCurrentPhase = (updates: Partial<TeamPhase>) => {
    if (!currentTeam || !canEdit) return;
    const updatedPhases = { ...currentTeam.phases };
    updatedPhases[activePhase] = { ...updatedPhases[activePhase], ...updates };
    updateTeam({ phases: updatedPhases });
  };

  const addUnit = (characterId: string, row: number, col: number) => {
    if (!currentPhaseData || !canEdit) return;
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
    if (!currentPhaseData || !canEdit) return;
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
    if (!currentPhaseData || !canEdit) return;
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
    if (!currentTeam || !canEdit) return;
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
    if (!currentTeam || !canEdit) return;
    const newSteps = [...currentTeam.levelingSteps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateTeam({ levelingSteps: newSteps });
  };

  // Handle window scroll to hide tooltip
  useEffect(() => {
    const handleScroll = () => {
      if (tooltip.visible) {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip.visible) {
        setTooltip(prev => ({ 
          ...prev, 
          x: e.clientX, 
          y: e.clientY 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tooltip.visible]);

  const handleSetChange = useCallback((setId: number) => {
    if (!isEditMode) {  
      setSelectedSetId(setId);
      const selectedSet = activeSets.find(s => s.id === setId);
      updateTeam({ 
        set_id: setId, 
        patch: selectedSet ? `${selectedSet.set_number}.1` : '16.1'
      });
    }
  }, [isEditMode, activeSets]);

  if (loading || !currentTeam || !currentPhaseData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedUnit = selectedHex ? currentPhaseData.units.find(u => u.row === selectedHex.row && u.col === selectedHex.col) : null;

  const handleHexDrop = (row: number, col: number) => {
    if (!canEdit) return;
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
    if (!canEdit) return;
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
      <div className="w-full bg-zinc-950/80 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl animate-in fade-in duration-500">
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
              <SetPicker 
                activeSets={activeSets} 
                selectedSetId={selectedSetId}
                onSetChange={handleSetChange} 
                disabled={isEditMode}
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
                <select value={currentTeam.patch} onChange={(e) => updateTeam({ patch: e.target.value })} disabled={!canEdit} className="bg-transparent text-[10px] font-black text-orange-400 focus:bg-zinc-900 focus:outline-none cursor-pointer disabled:cursor-not-allowed">
                  {activeSets.find(s => s.id === selectedSetId) && generatePatchesForSet(activeSets.find(s => s.id === selectedSetId)!.set_number).map(p => (
                    <option key={p} value={p} className="bg-zinc-900">{p}</option>
                  ))}
                </select>
              </div>
            <div className="w-0.5 h-6 bg-linear-to-b from-orange-500 to-amber-600 rounded-full mx-2 content-end"></div>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/tft/comps/${currentTeam.id}`); toast.success("Operation link copied"); }} className="p-2.5 hover:bg-white/5 rounded-xl border border-white/5 text-white/40 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
            {canEdit && (
              <button onClick={deleteTeam} className="p-2.5 hover:bg-red-500/10 rounded-xl border border-white/5 text-white/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] min-h-0">
          <div className="p-8 lg:p-12 space-y-12 border-r border-white/5 min-w-0">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-4 flex-1">
                {isEditingName && canEdit ? (
                  <div className="flex items-center gap-2">
                    <input autoFocus value={currentTeam.name} onChange={(e) => updateTeam({ name: e.target.value })} onBlur={() => setIsEditingName(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)} className="bg-white/5 border border-orange-500/50 rounded-2xl px-5 py-3 text-2xl font-black text-white w-full focus:outline-none" />
                  </div>
                ) : (
                  <div className={`flex items-center gap-4 group ${canEdit ? 'cursor-pointer' : ''}`} onClick={() => canEdit && setIsEditingName(true)}>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{currentTeam.name}</h2>
                    {canEdit && <Edit3 className="w-5 h-5 opacity-0 group-hover:opacity-40 text-white transition-all" />}
                  </div>
                )}
                <div className="w-full md:w-80 group relative">
                  <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest py-2">Teamcomp Description</h3>
                  {isEditingDesc && canEdit ? (
                    <textarea autoFocus value={currentTeam.description} onChange={(e) => updateTeam({ description: e.target.value })} onBlur={() => setIsEditingDesc(false)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-24 focus:outline-none focus:border-orange-500/50 text-xs resize-none" />
                  ) : (
                    <div className={`flex gap-4 p-4 bg-white/2 rounded-2xl border border-white/5 items-start ${canEdit ? 'cursor-pointer hover:bg-white/4' : ''} transition-colors`} onClick={() => canEdit && setIsEditingDesc(true)}>
                      <p className="text-white/40 text-[11px] font-medium leading-relaxed italic flex-1">"{currentTeam.description}"</p>
                      {canEdit && <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-40 text-white" />}
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
                    disabled={!canEdit}
                    placeholder={`Add specific notes for the ${activePhase} game phase...`}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-32 focus:outline-none focus:border-orange-500/50 text-[11px] resize-none leading-relaxed italic disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <MainCarryTray
              mainCarryIds={currentTeam.mainCarryIds}
              units={currentPhaseData.units}
              champions={champions}
              items={items}
              onToggleCarry={toggleMainCarry}
              onItemDrop={addItemToUnit}
              draggedChampionId={draggedChampionId}
              draggedFromBoard={draggedFromBoard}
              draggedItemId={draggedItemId}
              setDraggedChampionId={setDraggedChampionId}
              setDraggedFromBoard={setDraggedFromBoard}
              setDraggedItemId={setDraggedItemId}
              setTooltip={setTooltip}
              canEdit={canEdit}
            />
            <HexGrid
              units={currentPhaseData.units}
              mainCarryIds={currentTeam.mainCarryIds}
              champions={champions}
              items={items}
              selectedHex={selectedHex}
              activeTraits={activeTraits}
              onHexClick={(row, col, isActive) => setSelectedHex(isActive ? null : { row, col })}
              onDrop={handleHexDrop}
              tooltip={tooltip}
              onUnitDragStart={(row, col, characterId) => {
                if (!canEdit) return;
                setDraggedFromBoard({ row, col });
                setDraggedChampionId(characterId);
              }}
              setTooltip={setTooltip}
              canEdit={canEdit}
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
            {/* Save and Clear buttons - always visible */}
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="p-6 space-y-3 bg-black/20 border-t border-white/5 flex flex-col gap-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 rounded-xl">
                <button 
                  onClick={saveTeam} 
                  disabled={!canEdit || isSaving}
                  className="w-full sm:max-w-64 py-4 bg-orange-500 hover:bg-orange-400 text-white rounded-xl shadow-xl shadow-orange-500/20 transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                >
                  <Save className="w-3.5 h-3.5" /> {isSaving ? 'Saving...' : 'Save teamcomp'}
                </button>
                <button 
                  onClick={() => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: [] });
                    setSelectedHex(null);
                    toast.error("Sector cleared");
                  }} 
                  disabled={!canEdit}
                  className="w-full sm:max-w-64 py-4 bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-xl border border-white/10 transition-all text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Board
                </button>
              </div>
            </div>

            {/* Dynamic content */}
            <div className="flex-1 overflow-hidden">
              {selectedUnit ? (
                <UnitDetails
                  unit={selectedUnit}
                  champions={champions}
                  items={items}
                  mainCarryIds={currentTeam.mainCarryIds}
                  onToggleCarry={toggleMainCarry}
                  onRemoveUnit={() => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: currentPhaseData.units.filter(u => u.id !== selectedUnit.id) });
                    setSelectedHex(null);
                    toast.error("Unit removed");
                  }}
                  onUpdateStars={(stars) => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, stars } : u) });
                  }}
                  onAddItem={(itemName) => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, items: [...u.items, itemName] } : u) });
                  }}
                  onRemoveItem={(index) => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: currentPhaseData.units.map(u => u.id === selectedUnit.id ? { ...u, items: u.items.filter((_, idx) => idx !== index) } : u) });
                  }}
                  itemSearch={itemSearch}
                  setItemSearch={setItemSearch}
                  setDraggedItemId={setDraggedItemId}
                  setTooltip={setTooltip}
                  canEdit={canEdit}
                />
              ) : (
                 <UnitSelector
                  searchQuery={searchQuery}
                  setSearchQuery={handleSearchChange}
                  selectedTraits={selectedTraits}
                  setSelectedTraits={handleTraitsChange}
                  filteredChampions={filteredChampions}
                  unitPage={unitPage}
                  setUnitPage={setUnitPage}
                  unitsPerPage={UNITS_PER_PAGE}
                  onAddUnit={handleAddUnitToEmptyHex}
                  onClearBoard={() => {
                    if (!canEdit) return;
                    updateCurrentPhase({ units: [] });
                    setSelectedHex(null);
                    toast.error("Sector cleared");
                  }}
                  onSave={saveTeam}
                  setDraggedChampionId={setDraggedChampionId}
                   canEdit={canEdit}
                  allTraits={allTraits.map(t => t.name)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

