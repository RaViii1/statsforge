'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Shield, Target, Trash2, Code2, Eye, EyeOff, Search, X, Box } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTTrait, TFTSet, TFTTraitTier, getCostBorderColor } from "@/lib/tft/champions";
import { createClient } from "@/lib/supabase/client";

interface TraitFormProps {
  sets: (TFTSet & { id: number })[];
}

interface Champion {
  id: string;
  name: string;
  cost: number;
  image_path: string | null;
}

export default function TraitForm({ sets }: TraitFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const [showChampionSuggestions, setShowChampionSuggestions] = useState(false);
  const [championInput, setChampionInput] = useState("");
  const [isHeroTrait, setIsHeroTrait] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<TFTTrait>>({
    name: "",
    set_id: sets[0]?.id || 0,
    icon_path: "",
    description: "",
    tiers: [],
    champions: [],
    is_Hero: false,
    riot_api_name: ""
  });

  useEffect(() => {
    const handleEditEvent = async (event: any) => {
      console.log('Edit event received:', event.detail);
      const trait = event.detail;
      setIsEditing(true);
      
      // Get champions associated with this trait
      const { data: championData, error: championError } = await supabase
        .from("tft_champion_traits")
        .select("champion_id, tft_champions(*)")
        .eq("trait_id", trait.id);
      
      if (championError) {
        console.error('Error fetching champion data:', championError);
      }
      
      const champions = championData?.map(c => c.tft_champions) || [];

      // Determine if it's a hero trait (from is_hero property)
      const heroTrait = trait.is_hero || false;

      // Get existing tiers or start with empty
      const existingTiers = trait.tft_trait_tiers || [];
      console.log('Existing tiers:', existingTiers);
      
      setIsHeroTrait(heroTrait);
      const formattedTiers = existingTiers.map((tier: any) => ({
        tier: tier.tier || 'bronze',
        units_required: tier.units_required || 0,
        description: tier.description || '',
        stats: tier.stats || {}
      }));
      
      // Sort tiers correctly
      const sortedTiers = formattedTiers.sort((a: TFTTraitTier, b: TFTTraitTier) => {
        const getTierOrder = (tier: string): number => {
          const [base, suffix] = tier.split('_');
          const order = { bronze: 0, silver: 1, gold: 2, prismatic: 3 };
          const baseOrder = order[base as keyof typeof order] ?? 99;
          const suffixNum = suffix ? parseInt(suffix, 10) : 0;
          return baseOrder * 100 + suffixNum;
        };
        
        return getTierOrder(a.tier) - getTierOrder(b.tier);
      });
      
      // Generate riot_api_name if it doesn't exist
      let riotApiName = trait.riot_api_name;
      if (!riotApiName && trait.name) {
        // Get set data directly from trait's relation (tft_sets) which has set_number
        const setNumber = trait.tft_sets?.set_number || 0;
        riotApiName = `TFT${setNumber}_${trait.name.replace(/[\s_]+/g, '_').split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
      }

      setFormData({
        ...trait,
        tiers: sortedTiers,
        champions: champions,
        riot_api_name: riotApiName
      });
    };

    window.addEventListener('edit-trait', handleEditEvent);
    console.log('Edit event listener added');
    return () => {
      window.removeEventListener('edit-trait', handleEditEvent);
      console.log('Edit event listener removed');
    };
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.set_id) return;
      
      const { data: championData } = await supabase
        .from("tft_champions")
        .select("id, name, cost, image_path")
        .eq("set_id", formData.set_id);
      
      if (championData) setAvailableChampions(championData);
    };
    fetchData();
  }, [formData.set_id, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowChampionSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChampionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChampionInput(value);
    
    if (value.trim()) {
      const filtered = availableChampions.filter(champion => 
        champion.name.toLowerCase().includes(value.toLowerCase()) && 
        !formData.champions?.some(c => c.id === champion.id)
      );
      setFilteredChampions(filtered);
      setShowChampionSuggestions(true);
    } else {
      setShowChampionSuggestions(false);
    }
  };

  const addChampion = (champion: Champion) => {
    if (isHeroTrait && (formData.champions?.length || 0) >= 1) {
      toast.error("Hero traits can only have one champion");
      return;
    }

    if (!formData.champions?.some(c => c.id === champion.id)) {
      setFormData(prev => ({
        ...prev,
        champions: [...(prev.champions || []), champion]
      }));
    }
    setChampionInput("");
    setShowChampionSuggestions(false);
  };

  const removeChampion = (championId: string) => {
    setFormData(prev => ({
      ...prev,
      champions: prev.champions?.filter(c => c.id !== championId)
    }));
  };

  const addTier = (tierType: 'bronze' | 'silver' | 'gold' | 'prismatic') => {
    // Check how many tiers of this type already exist
    const existingTiersOfType = formData.tiers?.filter(t => 
      t.tier.startsWith(tierType)
    ).length || 0;

    let tierName: string;
    if (existingTiersOfType === 0) {
      tierName = tierType;
    } else {
      tierName = `${tierType}_${existingTiersOfType + 1}`;
    }

    const newTier: TFTTraitTier = {
      tier: tierName,
      units_required: 0,
      description: '',
      stats: {}
    };

    const updatedTiers = [...(formData.tiers || []), newTier];
    console.log('Before sorting:', updatedTiers.map(t => t.tier));
    
    const sortedTiers = updatedTiers.sort((a, b) => {
      const getTierOrder = (tier: string): number => {
        const [base, suffix] = tier.split('_');
        const order = { bronze: 0, silver: 1, gold: 2, prismatic: 3 };
        const baseOrder = order[base as keyof typeof order] ?? 99;
        const suffixNum = suffix ? parseInt(suffix, 10) : 0;
        const totalOrder = baseOrder * 100 + suffixNum;
        console.log(`Tier ${tier} - Base: ${base}, Order: ${baseOrder}, Suffix: ${suffixNum}, Total: ${totalOrder}`);
        return totalOrder;
      };
      
      const orderA = getTierOrder(a.tier);
      const orderB = getTierOrder(b.tier);
      console.log(`Comparing ${a.tier} (${orderA}) with ${b.tier} (${orderB}): ${orderA - orderB}`);
      return orderA - orderB;
    });
    
    console.log('After sorting:', sortedTiers.map(t => t.tier));
    
    setFormData(prev => ({
      ...prev,
      tiers: sortedTiers
    }));
  };

  const removeTier = (tierType: string) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers?.filter(t => t.tier !== tierType)
    }));
  };

  const handleTierChange = (tierType: string, field: keyof TFTTraitTier, value: any) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers?.map(tier => 
        tier.tier === tierType ? { ...tier, [field]: value } : tier
      )
    }));
  };

  const handleHeroTraitChange = (checked: boolean) => {
    setIsHeroTrait(checked);
    if (checked) {
      // Hero trait should only have 1 champion
      if (formData.champions && formData.champions.length > 1) {
        setFormData(prev => ({
          ...prev,
          is_Hero: true,
          champions: prev.champions ? [prev.champions[0]] : [],
          tiers: (prev.tiers || []).length > 0 ? [(prev.tiers || [])[0]] : []
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          is_Hero: true,
          tiers: (prev.tiers || []).length > 0 ? [(prev.tiers || [])[0]] : []
        }));
      }
    } else {
      // Regular trait can have multiple tiers
      setFormData(prev => ({
        ...prev,
        is_Hero: false
      }));
      // If there are no tiers, create default bronze tier
      if (!formData.tiers || formData.tiers.length === 0) {
        setFormData(prev => ({
          ...prev,
          is_Hero: false,
          tiers: [{ tier: 'bronze', units_required: 0, description: '', stats: {} }]
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Trait name is required");
      return;
    }

    const validTiers = formData.tiers || [];

    setLoading(true);
    
    // Set a timeout to ensure loading is always set to false
    const timeoutId = setTimeout(() => {
      console.error("Timeout: Saving trait took too long");
      setLoading(false);
      toast.error("Saving timed out. Please try again.");
    }, 30000); // 30 second timeout

    try {
      // Get the set number from the sets array using set_id
      const selectedSet = sets.find(s => s.id === formData.set_id);
      const setNumber = selectedSet?.set_number || 0;
      const id = String(formData.id || `${setNumber}_${formData.name.toLowerCase().replace(/\s+/g, "_")}`);
      
      const res = await fetch("/api/admin/traits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          id, 
          tiers: validTiers 
        }),
      });

      if (!res.ok) throw new Error("Failed to save trait");

      clearTimeout(timeoutId);
      toast.success("Trait saved successfully!");
      setIsEditing(false);
      setFormData({
        name: "",
        set_id: sets[0]?.id || 0,
        icon_path: "",
        description: "",
        tiers: [],
        champions: [],
        is_Hero: false,
        riot_api_name: ""
      });

      setIsHeroTrait(false);
      router.refresh();
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error saving trait:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const baseTier = tier.split('_')[0];
    switch (baseTier) {
      case 'bronze': return 'text-orange-400';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-500';
      case 'prismatic': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getCostColor = (cost: number) => {
    switch (cost) {
      case 1: return 'text-zinc-400';
      case 2: return 'text-emerald-500';
      case 3: return 'text-blue-500';
      case 4: return 'text-purple-500';
      case 5: return 'text-yellow-500';
      case 6: return 'text-red-500';
      case 7: return 'text-orange-600';
      default: return 'text-zinc-400';
    }
  };

  const availableTierTypes: Array<'bronze' | 'silver' | 'gold' | 'prismatic'> = ['bronze', 'silver', 'gold', 'prismatic'];

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className={`w-5 h-5 text-purple-500 transition-transform ${isEditing ? 'rotate-12' : ''}`} />
          {isEditing ? 'Edit Trait' : 'New Trait'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
      setFormData({
        name: "",
        set_id: sets[0]?.id || 0,
        icon_path: "",
        description: "",
        tiers: [],
        champions: [],
        is_Hero: false,
        riot_api_name: ""
      });
              setIsHeroTrait(false);
            }}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <button 
        type="submit" 
        form="trait-form"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-purple-900/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {isEditing ? 'Update Trait' : 'Save Trait'}
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </>
        )}
      </button>

      <form id="trait-form" onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Name</label>
            <input 
              value={formData.name}
              onChange={e => {
                const newName = e.target.value;
                // Generate Riot API name
                const selectedSet = sets.find(s => s.id === formData.set_id);
                const setNumber = selectedSet?.set_number || 0;
                const riotApiName = `TFT${setNumber}_${newName.replace(/[\s_]+/g, '_').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
                setFormData(prev => ({ 
                  ...prev, 
                  name: newName, 
                  riot_api_name: riotApiName 
                }));
              }}
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none" 
              placeholder="e.g. Chembaron" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Set</label>
            <select 
              value={formData.set_id}
              onChange={e => setFormData(prev => ({ ...prev, set_id: parseInt(e.target.value) }))}
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
            >
              {sets.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Riot API Name</label>
          <input 
            value={formData.riot_api_name}
            onChange={e => setFormData(prev => ({ ...prev, riot_api_name: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none" 
            placeholder="e.g. TFT16_Chembaron" 
          />
        </div>
       
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Icon URL</label>
            <input 
              value={formData.icon_path || ""}
              onChange={e => setFormData(prev => ({ ...prev, icon_path: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none" 
              placeholder="/images/tft/traits/chembaron.png" 
            />
          </div>
        
          <div className="space-y-2 flex items-end py-2">
            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">
              <input
                type="checkbox"
                checked={isHeroTrait}
                onChange={(e) => handleHeroTraitChange(e.target.checked)}
                className="w-3 h-3 text-purple-600 rounded bg-zinc-950 border-zinc-800 focus:ring-purple-500/50"
              />
              Hero Trait (Only 1 champion)
            </label>
          </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm h-24 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none" 
            placeholder="Trait bonuses and details..."
          />
        </div>

        <div className="space-y-3 relative">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Units</label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[30px] p-2 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
            {formData.champions?.length === 0 && <span className="text-zinc-600 text-[10px] italic">No units added</span>}
            {formData.champions?.map(champion => (
              <span key={champion.id} className={`bg-slate-400/10 border ${getCostColor(champion.cost)} ${getCostBorderColor(champion.cost)} px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 group`}>
                <span className={`text-[8px] font-bold ${getCostColor(champion.cost)}`}>
                  {champion.cost}
                </span>
                {champion.name}
                <button type="button" onClick={() => removeChampion(champion.id)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input 
              value={championInput}
              onChange={handleChampionInputChange}
              onFocus={() => championInput && setShowChampionSuggestions(true)}
              disabled={isHeroTrait && (formData.champions?.length || 0) >= 1}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder={isHeroTrait ? "Hero trait can only have one champion" : "Type to search champions..."} 
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          
          {showChampionSuggestions && filteredChampions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
            >
              {filteredChampions.map(champion => (
                <button
                  key={champion.id}
                  type="button"
                  onClick={() => addChampion(champion)}
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                >
                  <div className={`w-6 h-6 bg-zinc-400/10 border ${getCostBorderColor(champion.cost)} rounded-md flex items-center justify-center overflow-hidden`}>
                    <span className={`text-[10px] font-bold ${getCostColor(champion.cost)} ${getCostBorderColor(champion.cost)}`}>
                      {champion.cost}
                    </span>
                  </div>
                  {champion.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Tiers</label>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-3">
                {isHeroTrait ? (
                 // Hero trait has only one tier
                 <div className="space-y-3">
                   {formData.tiers?.length === 0 && (
                     <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-lg p-3 text-center">
                       <span className="text-zinc-500 text-sm">No tiers added</span>
                     </div>
                   )}
                   {formData.tiers?.map((tier, index) => (
                     <div key={tier.tier} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                       <div className="flex items-center justify-between mb-2">
                         <h3 className={`font-bold text-sm ${getTierColor(tier.tier)} capitalize`}>
                           Hero Trait
                         </h3>
                         {(formData.tiers?.length || 0) > 1 && (
                           <button
                             type="button"
                             onClick={() => removeTier(tier.tier)}
                             className="text-zinc-500 hover:text-red-500 transition-colors"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         )}
                       </div>
                       <div className="grid grid-cols-12 gap-2 items-end">
                         <div className="col-span-3">
                           <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1 block mb-1">
                             Units
                           </label>
                           <input
                             type="number"
                             min="1"
                              value={tier.units_required || 0}
                             onChange={e => handleTierChange(tier.tier, 'units_required', parseInt(e.target.value))}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-2 focus:ring-purple-500/50 outline-none"
                             placeholder="1"
                           />
                         </div>
                         <div className="col-span-9">
                           <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1 block mb-1">
                             Description
                           </label>
                           <textarea
                             value={tier.description}
                             onChange={e => handleTierChange(tier.tier, 'description', e.target.value)}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs h-12 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none"
                             placeholder="Hero trait bonus"
                           />
                         </div>
                       </div>
                     </div>
                   ))}
                   {formData.tiers?.length === 0 && (
                     <button
                       type="button"
                       onClick={() => addTier('bronze')}
                       className="w-full py-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 rounded-lg text-sm hover:bg-purple-500/20 transition-colors"
                     >
                       Add Hero Trait Tier
                     </button>
                   )}
                 </div>
               ) : (
                 // Regular trait with multiple tiers
                 <div className="space-y-3">
                   {formData.tiers?.length === 0 && (
                     <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-lg p-3 text-center">
                       <span className="text-zinc-500 text-sm">No tiers added</span>
                     </div>
                   )}
                   {formData.tiers?.map((tier, index) => (
                     <div key={tier.tier} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                       <div className="flex items-center justify-between mb-2">
                         <h3 className={`font-bold text-sm ${getTierColor(tier.tier)} capitalize`}>
                           {tier.tier} Tier
                         </h3>
                         <button
                           type="button"
                           onClick={() => removeTier(tier.tier)}
                           className="text-zinc-500 hover:text-red-500 transition-colors"
                         >
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                       <div className="grid grid-cols-12 gap-2 items-end">
                         <div className="col-span-3">
                           <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1 block mb-1">
                             Units
                           </label>
                           <input
                             type="number"
                             min="1"
                              value={tier.units_required || 0}
                             onChange={e => handleTierChange(tier.tier, 'units_required', parseInt(e.target.value))}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-2 focus:ring-purple-500/50 outline-none"
                             placeholder="2"
                           />
                         </div>
                         <div className="col-span-9">
                           <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1 block mb-1">
                             Description
                           </label>
                           <textarea
                             value={tier.description}
                             onChange={e => handleTierChange(tier.tier, 'description', e.target.value)}
                             className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs h-12 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none"
                             placeholder="+15% Attack Speed"
                           />
                         </div>
                       </div>
                     </div>
                   ))}
                    <div className="grid grid-cols-2 gap-2">
                      {availableTierTypes.map(tierType => (
                        <button
                          key={tierType}
                          type="button"
                          onClick={() => addTier(tierType)}
                          className={`px-3 py-1.5 w-full rounded-lg text-xs font-bold capitalize transition-colors ${getTierColor(tierType)} bg-zinc-900 border border-zinc-800 hover:bg-zinc-800`}
                        >
                          Add {tierType} Tier
                        </button>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

