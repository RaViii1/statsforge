"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Trash2, 
  Edit3,
  Share2,
  Save,
  ArrowLeft,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { TFTChampion, TFTSet } from '@/lib/tft/champions';
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
  UNITS_PER_PAGE,
  META_TIERS,
  META_TIER_CONFIG,
  MetaTier
} from '@/lib/tft/teamplanner-types';
import { DIFFICULTY_LEVELS } from '@/lib/tft/difficulty';

const TIER_DESCRIPTIONS: Record<MetaTier, string> = {
  S: 'Top meta comp - Consistently top 4',
  A: 'Strong comp - High win rate',
  B: 'Solid comp - Situationally strong',
  C: 'Below average - Needs high roll',
  F: 'Weak comp - Not recommended',
};

import {
  CustomTooltip,
  HexGrid,
  LevelingTempo,
  MainCarryTray,
  UnitDetails,
  UnitSelector
} from './planner';
import { UnitTooltip } from './UnitTooltip';


interface TftTeamPlannerProps {
  editId?: string | null;
  initialSetId?: number | null;
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

export const TftTeamPlanner = ({ editId, initialSetId }: TftTeamPlannerProps) => {
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

  const initDoneRef = useRef(false);

   useEffect(() => {
     if (initDoneRef.current) return;
     initDoneRef.current = true;

     async function init() {
       if (user) {
         const { data: profileData } = await supabase
           .from('profiles')
           .select('*')
           .eq('id', user.id)
           .single();
         setProfile(profileData);
       }

       try {
         // Fetch active sets first
         const setsRes = await fetch("/api/tft/active-sets");
         let fetchedSets: TFTSet[] = [];
         let targetSetId: number | null = null;

         if (setsRes.ok) {
           fetchedSets = await setsRes.json();
           setActiveSets(fetchedSets);
           if (fetchedSets.length > 0 && !editId) {
             // Determine which set to use
             if (initialSetId) {
               const matchedSet = fetchedSets.find(s => s.set_number === initialSetId);
               if (matchedSet) {
                 targetSetId = matchedSet.id;
               } else {
                 targetSetId = fetchedSets[0].id;
               }
             } else {
               targetSetId = fetchedSets[0].id;
             }
             setSelectedSetId(targetSetId);
           }
         } else {
           console.error('Failed to fetch active sets:', setsRes.status);
         }

         // Fetch items with set_id filter if available
         const itemsUrl = targetSetId ? `/api/tft/items?set_id=${targetSetId}` : "/api/tft/items";
         const itemsRes = await fetch(itemsUrl);

         if (itemsRes.ok) {
           const itemsData = await itemsRes.json();
           setItems(itemsData);
         } else {
           console.error('Failed to fetch items:', itemsRes.status);
         }

         // If no sets came back and we are not in edit mode, still create an
         // empty team so the planner renders instead of hanging on the spinner.
         if (fetchedSets.length === 0 && !editId) {
           setCurrentTeam(createEmptyTeam(0, 16));
         }
       } catch (err) {
         console.error('Error during planner init:', err);
         // Ensure the planner always exits the loading state even on network error.
         if (!editId) {
           setCurrentTeam(createEmptyTeam(0, 16));
         }
       } finally {
         setLoading(false);
       }
     }

     init();
   }, [user]);

   // Refetch champions, traits, and items when selectedSetId changes
   useEffect(() => {
     if (!selectedSetId) {
       return;
     }
     
     const loadSetData = async () => {
       try {
         const [champsRes, traitsRes, itemsRes] = await Promise.all([
           fetch(`/api/tft/champions?set_id=${selectedSetId}`),
           fetch(`/api/tft/traits?set_id=${selectedSetId}`),
           fetch(`/api/tft/items?set_id=${selectedSetId}`)
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

         if (itemsRes.ok) {
           const itemsData = await itemsRes.json();
           setItems(itemsData);
         } else {
           console.error('Failed to fetch items:', itemsRes.status);
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
    if (loading) return;

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
  }, [editId, selectedSetId, activeSets, loading]);

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

  // Compute top bar status pills
  const tierConfig = currentTeam.tier ? META_TIER_CONFIG[currentTeam.tier] : null;
  const tierPill = tierConfig ? (
    <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${tierConfig.bgColor} ${tierConfig.color}`}>
      {tierConfig.label}
    </div>
  ) : null;

  const difficultyConfig = currentTeam.difficulty ? DIFFICULTY_LEVELS.find(d => d.id === currentTeam.difficulty) : null;
  const difficultyPill = difficultyConfig ? (
    <div 
      className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-widest"
      style={{
        backgroundColor: difficultyConfig.bgColor,
        borderColor: difficultyConfig.borderColor,
        color: difficultyConfig.color
      }}
    >
      {difficultyConfig.label}
    </div>
  ) : null;

  const setConfig = selectedSetId ? activeSets.find(s => s.id === selectedSetId) : null;
  const setPill = setConfig ? (
    <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-white/10 border-white/20 text-white/90">
      S{setConfig.set_number}
    </div>
  ) : null;

   return (
    <>
      <div className="flex items-center gap-4 py-4">
            <Link
              href="/tft"
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-300 mb-6 transition-colors group uppercase text-[10px] font-black tracking-widest"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              TFT Hub
            </Link>
      </div>
      <div className="w-full bg-zinc-950/80 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl animate-in fade-in duration-500">
        <CustomTooltip {...tooltip} />
        <UnitTooltip
          visible={tooltip.visible && !!tooltip.champion}
          title={tooltip.title}
          description={tooltip.description}
          x={tooltip.x}
          y={tooltip.y}
          champion={tooltip.champion}
          setNumber={tooltip.setNumber}
        />
        <div className="flex items-center gap-3 justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/2 border-b border-white/5">
          <span className="text-[11px] font-black text-orange-500 tracking-[0.2em]">
            {isEditMode ? 'EDITING' : 'NEW COMP'}
          </span>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {tierPill}
            {difficultyPill}
            {setPill}
            
            {/* Active Preset Pill */}
            {activePreset && (
              <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg ${activePreset.tagColor}`}>
                {activePreset.name}
              </div>
            )}

            {/* Action buttons */}
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/tft/comps/${currentTeam.id}`); toast.success("Operation link copied"); }} className="p-2 sm:p-2.5 hover:bg-white/5 rounded-xl border border-white/5 text-white/40 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            {canEdit && (
              <button onClick={deleteTeam} className="p-2 sm:p-2.5 hover:bg-red-500/10 rounded-xl border border-white/5 text-white/20 hover:text-red-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
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
                    <textarea autoFocus value={currentTeam.description} onChange={(e) => updateTeam({ description: e.target.value })} onBlur={() => setIsEditingDesc(false)} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-24 max-h-64 overflow-y-auto focus:outline-none focus:border-orange-500/50 text-xs resize-none" />
                  ) : (
                    <div className={`flex gap-4 p-4 bg-white/2 rounded-2xl border border-white/5 items-start ${canEdit ? 'cursor-pointer hover:bg-white/4' : ''} transition-colors`} onClick={() => canEdit && setIsEditingDesc(true)}>
                      <p className="text-white/40 text-[11px] font-medium leading-relaxed italic flex-1 max-h-64 truncate">"{currentTeam.description}"</p>
                      {canEdit && <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-40 text-white" />}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3">
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
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1 bg-orange-500 rounded-full" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    Phase Notes
                  </h3>
                  <span className="text-[10px] font-medium text-white/30 hidden sm:inline tracking-normal normal-case">Add notes specific to each game phase</span>
                </div>
                  <textarea 
                    key={activePhase}
                    value={currentPhaseData.notes} 
                    onChange={(e) => updateCurrentPhase({ notes: e.target.value })} 
                    disabled={!canEdit}
                    placeholder={`Add specific notes for the ${activePhase} game phase...`}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/60 w-full h-32 max-h-64 overflow-y-auto focus:outline-none focus:border-orange-500/50 text-[11px] resize-none leading-relaxed italic disabled:cursor-not-allowed"
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

             {/* Tier / Difficulty / Set / Patch selectors - responsive grid */}
             <div className="px-3 py-3 border-b border-white/5 min-h-64">
               <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Tier Picker */}
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] sm:text-[9px] font-black text-orange-500 uppercase tracking-widest">Tier</span>
                  <div className="flex gap-0.5 sm:gap-1">
                    {META_TIERS.map((tier) => {
                      const config = META_TIER_CONFIG[tier];
                      const isActive = currentTeam.tier === tier;
                      return (
                        <button
                          key={tier}
                          onClick={() => updateTeam({ tier: tier })}
                          onMouseEnter={(e) => setTooltip({ 
                            visible: true, 
                            title: `${tier} Tier`, 
                            description: TIER_DESCRIPTIONS[tier], 
                            x: e.clientX, 
                            y: e.clientY 
                          })}
                          onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                          className={`
                            w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-[11px] font-black uppercase
                            border transition-all duration-200
                            ${isActive 
                              ? `${config.bgColor} ${config.color} shadow-lg` 
                              : 'opacity-40 hover:opacity-70 border-white/40 text-white/70'
                            }
                          `}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Picker - same square shape as tier */}
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] sm:text-[9px] font-black text-orange-500 uppercase tracking-widest">Difficulty</span>
                  <div className="flex gap-0.5 sm:gap-1 flex-wrap">
                    {DIFFICULTY_LEVELS.map((diff) => {
                      const isActive = currentTeam.difficulty === diff.id;
                      return (
                        <button
                          key={diff.id}
                          onClick={() => updateTeam({ difficulty: diff.id })}
                          onMouseEnter={(e) => setTooltip({ 
                            visible: true, 
                            title: diff.label, 
                            description: diff.description, 
                            x: e.clientX, 
                            y: e.clientY 
                          })}
                          onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                          className={`
                            w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[8px] sm:text-[9px] font-black uppercase
                            border transition-all duration-200
                            ${isActive 
                              ? 'scale-105 shadow-lg' 
                              : 'opacity-50 hover:opacity-80'
                            }
                          `}
                          style={{
                            backgroundColor: isActive ? diff.bgColor : 'transparent',
                            borderColor: isActive ? diff.color : 'rgba(255,255,255,0.4)',
                            color: isActive ? diff.color : 'rgba(255,255,255,0.7)',
                            boxShadow: isActive ? `0 0 20px ${diff.bgColor}` : 'none'
                          }}
                        >
                          {diff.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                 {/* Set Picker */}
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] sm:text-[9px] font-black text-orange-500 uppercase tracking-widest">Set</span>
                  <div className="relative">
                    <select 
                      value={selectedSetId || ''} 
                      onChange={(e) => handleSetChange(parseInt(e.target.value))}
                      disabled={isEditMode}
                      className={`
                        w-full appearance-none px-4 py-2 pr-10 rounded-xl text-[9px] sm:text-[10px] font-black transition-all
                        ${isEditMode
                          ? 'bg-zinc-900/40 text-zinc-500 cursor-not-allowed opacity-50'
                          : 'bg-zinc-900/60 text-orange-400 hover:bg-zinc-900/80 cursor-pointer ring-1 ring-white/5'
                        }
                      `}
                    >
                      {activeSets.map((set: any) => (
                        <option 
                          key={set.id} 
                          value={set.id}
                          className="bg-[#111112] text-orange-400"
                        >
                          S{set.set_number} - {set.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400" />
                  </div>
                </div>
                 {/* Patch Picker */}
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] sm:text-[9px] font-black text-orange-500 uppercase tracking-widest">Patch</span>
                  <div className="relative">
                    <select 
                      value={currentTeam.patch} 
                      onChange={(e) => updateTeam({ patch: e.target.value })}
                      disabled={!canEdit}
                      className={`
                        w-full appearance-none px-4 py-2 pr-10 rounded-xl text-[9px] sm:text-[10px] font-black transition-all
                        ${!canEdit
                          ? 'bg-zinc-900/40 text-zinc-500 cursor-not-allowed opacity-50'
                          : 'bg-zinc-900/60 text-orange-400 hover:bg-zinc-900/80 cursor-pointer ring-1 ring-white/5'
                        }
                      `}
                    >
                      {activeSets.find(s => s.id === selectedSetId) && generatePatchesForSet(activeSets.find(s => s.id === selectedSetId)!.set_number).map(p => (
                        <option key={p} value={p} className="bg-[#111112] text-orange-400">
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400" />
                  </div>
                </div>
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


