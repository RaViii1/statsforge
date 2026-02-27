'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Shield, Search, X } from "lucide-react";
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

const EMPTY_FORM = (setId: number): Partial<TFTTrait> => ({
  name: "",
  set_id: setId,
  icon_path: "",
  description: "",
  tiers: [],
  champions: [],
  is_Hero: false,
  riot_api_name: "",
});

const TIER_ORDER: Record<string, number> = { bronze: 0, silver: 1, gold: 2, prismatic: 3 };

function getTierOrder(tier: string): number {
  const [base, suffix] = tier.split('_');
  return (TIER_ORDER[base] ?? 99) * 100 + (suffix ? parseInt(suffix, 10) : 0);
}

function sortTiers(tiers: TFTTraitTier[]): TFTTraitTier[] {
  return [...tiers].sort((a, b) => getTierOrder(a.tier) - getTierOrder(b.tier));
}

export default function TraitForm({ sets }: TraitFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHeroTrait, setIsHeroTrait] = useState(false);

  const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);
  const [showChampionSuggestions, setShowChampionSuggestions] = useState(false);
  const [championInput, setChampionInput] = useState("");
  const suggestionRef = useRef<HTMLDivElement>(null);

  const defaultSetId = sets[0]?.id || 0;
  const [formData, setFormData] = useState<Partial<TFTTrait>>(EMPTY_FORM(defaultSetId));

  useEffect(() => {
    if (!formData.set_id) return;
    supabase
      .from("tft_champions")
      .select("id, name, cost, image_path")
      .eq("set_id", formData.set_id)
      .then(({ data }: { data: Champion[] | null }) => {
        if (data) setAvailableChampions(data);
      });
  }, [formData.set_id, supabase]);

  useEffect(() => {
    const handleEditEvent = async (event: Event) => {
      const trait = (event as CustomEvent).detail;
      if (!trait) return;

      const { data: championData, error: championError } = await supabase
        .from("tft_champion_traits")
        .select("tft_champions(id, name, cost, image_path)")
        .eq("trait_id", trait.id);

      if (championError) {
        console.error("Error fetching champion data:", championError);
      }

      const champions: Champion[] = (championData ?? [])
        .map((row: any) => row.tft_champions)
        .filter(Boolean);

      const heroTrait = trait.is_hero ?? trait.is_Hero ?? false;

      const existingTiers: TFTTraitTier[] = (trait.tft_trait_tiers ?? []).map((tier: any) => ({
        tier: tier.tier || 'bronze',
        units_required: tier.units_required ?? 0,
        description: tier.description ?? '',
        stats: tier.stats ?? {},
      }));

      let riotApiName = trait.riot_api_name ?? '';
      if (!riotApiName && trait.name) {
        const setNumber = trait.tft_sets?.set_number ?? 0;
        riotApiName = `TFT${setNumber}_${trait.name
          .replace(/[\s_]+/g, '_')
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join('')}`;
      }

      setFormData({
        ...trait,
        tiers: sortTiers(existingTiers),
        champions,
        riot_api_name: riotApiName,
        is_Hero: heroTrait,
      });
      setIsHeroTrait(heroTrait);
      setIsEditing(true);
      setChampionInput("");
    };

    window.addEventListener('edit-trait', handleEditEvent);
    return () => window.removeEventListener('edit-trait', handleEditEvent);
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
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
      setFilteredChampions(
        availableChampions.filter(c =>
          c.name.toLowerCase().includes(value.toLowerCase()) &&
          !formData.champions?.some(fc => fc.id === c.id)
        )
      );
      setShowChampionSuggestions(true);
    } else {
      setShowChampionSuggestions(false);
    }
  };

  const addChampion = (champion: Champion) => {
    if (isHeroTrait && (formData.champions?.length ?? 0) >= 1) {
      toast.error("Hero traits can only have one champion");
      return;
    }
    if (!formData.champions?.some(c => c.id === champion.id)) {
      setFormData(prev => ({ ...prev, champions: [...(prev.champions ?? []), champion] }));
    }
    setChampionInput("");
    setShowChampionSuggestions(false);
  };

  const removeChampion = (id: string) => {
    setFormData(prev => ({ ...prev, champions: prev.champions?.filter(c => c.id !== id) }));
  };

  const addTier = (tierType: 'bronze' | 'silver' | 'gold' | 'prismatic') => {
    const count = formData.tiers?.filter(t => t.tier.startsWith(tierType)).length ?? 0;
    const tierName = count === 0 ? tierType : `${tierType}_${count + 1}`;
    const newTier: TFTTraitTier = { tier: tierName, units_required: 0, description: '', stats: {} };
    setFormData(prev => ({ ...prev, tiers: sortTiers([...(prev.tiers ?? []), newTier]) }));
  };

  const removeTier = (tierType: string) => {
    setFormData(prev => ({ ...prev, tiers: prev.tiers?.filter(t => t.tier !== tierType) }));
  };

  const handleTierChange = (tierType: string, field: keyof TFTTraitTier, value: any) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers?.map(t => t.tier === tierType ? { ...t, [field]: value } : t),
    }));
  };

  const handleHeroTraitChange = (checked: boolean) => {
    setIsHeroTrait(checked);
    setFormData(prev => ({
      ...prev,
      is_Hero: checked,
      champions: checked && (prev.champions?.length ?? 0) > 1 ? [prev.champions![0]] : prev.champions,
      tiers: checked && (prev.tiers?.length ?? 0) > 1 ? [prev.tiers![0]] : prev.tiers,
    }));
  };

  const handleNameChange = (newName: string) => {
    const selectedSet = sets.find(s => s.id === formData.set_id);
    const setNumber = selectedSet?.set_number ?? 0;
    const riotApiName = `TFT${setNumber}_${newName
      .replace(/[\s_]+/g, '_')
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')}`;
    setFormData(prev => ({ ...prev, name: newName, riot_api_name: riotApiName }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setIsHeroTrait(false);
    setChampionInput("");
    setFormData(EMPTY_FORM(defaultSetId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Trait name is required"); return; }

    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast.error("Saving timed out. Please try again.");
    }, 30000);

    try {
      const selectedSet = sets.find(s => s.id === formData.set_id);
      const setNumber = selectedSet?.set_number ?? 0;
      const id = String(formData.id ?? `${setNumber}_${formData.name!.toLowerCase().replace(/\s+/g, "_")}`);

      const res = await fetch("/api/admin/traits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id, tiers: formData.tiers ?? [] }),
      });

      if (!res.ok) throw new Error("Failed to save trait");

      clearTimeout(timeoutId);
      toast.success(isEditing ? "Trait updated!" : "Trait saved!");
      resetForm();
      router.refresh();
    } catch (error: any) {
      clearTimeout(timeoutId);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const base = tier.split('_')[0];
    return ({ bronze: 'text-orange-400', silver: 'text-gray-400', gold: 'text-yellow-500', prismatic: 'text-purple-500' } as Record<string, string>)[base] ?? 'text-gray-500';
  };

  const getCostColor = (cost: number) => {
    return (['', 'text-zinc-400', 'text-emerald-500', 'text-blue-500', 'text-purple-500', 'text-yellow-500', 'text-red-500', 'text-orange-600'] as string[])[cost] ?? 'text-zinc-400';
  };

  const availableTierTypes = ['bronze', 'silver', 'gold', 'prismatic'] as const;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className={`w-5 h-5 text-purple-500 transition-transform ${isEditing ? 'rotate-12' : ''}`} />
          {isEditing ? 'Edit Trait' : 'New Trait'}
        </h2>
        {isEditing && (
          <button type="button" onClick={resetForm} className="text-zinc-500 hover:text-white transition-colors text-sm">
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Name</label>
            <input
              value={formData.name}
              onChange={e => handleNameChange(e.target.value)}
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
            value={formData.riot_api_name ?? ''}
            onChange={e => setFormData(prev => ({ ...prev, riot_api_name: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
            placeholder="e.g. TFT16_Chembaron"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Icon URL</label>
          <input
            value={formData.icon_path ?? ''}
            onChange={e => setFormData(prev => ({ ...prev, icon_path: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none"
            placeholder="/images/tft/traits/chembaron.png"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={isHeroTrait}
            onChange={e => handleHeroTraitChange(e.target.checked)}
            className="w-3.5 h-3.5 text-purple-600 rounded bg-zinc-950 border-zinc-800 focus:ring-purple-500/50"
          />
          <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
            Hero Trait (1 champion only)
          </span>
        </label>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Description</label>
          <textarea
            value={formData.description ?? ''}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm h-20 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none"
            placeholder="Trait bonuses and details..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Units</label>
          <div className="flex flex-wrap gap-2 min-h-9 p-2 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
            {(formData.champions?.length ?? 0) === 0 && (
              <span className="text-zinc-600 text-[10px] italic self-center">No units added</span>
            )}
            {formData.champions?.map(champion => (
              <span
                key={champion.id}
                className={`bg-slate-400/10 border ${getCostBorderColor(champion.cost)} px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1`}
              >
                <span className={`text-[8px] font-bold ${getCostColor(champion.cost)}`}>{champion.cost}</span>
                <span className={getCostColor(champion.cost)}>{champion.name}</span>
                <button type="button" onClick={() => removeChampion(champion.id)} className="text-zinc-500 hover:text-white transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="relative" ref={suggestionRef}>
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={championInput}
              onChange={handleChampionInputChange}
              onFocus={() => championInput && setShowChampionSuggestions(true)}
              disabled={isHeroTrait && (formData.champions?.length ?? 0) >= 1}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none disabled:opacity-40 disabled:cursor-not-allowed"
              placeholder={isHeroTrait ? "Hero trait: only one champion allowed" : "Search champions…"}
            />
            {showChampionSuggestions && filteredChampions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredChampions.map(champion => (
                  <button
                    key={champion.id}
                    type="button"
                    onClick={() => addChampion(champion)}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <div className={`w-6 h-6 bg-zinc-400/10 border ${getCostBorderColor(champion.cost)} rounded-md flex items-center justify-center`}>
                      <span className={`text-[10px] font-bold ${getCostColor(champion.cost)}`}>{champion.cost}</span>
                    </div>
                    {champion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Tiers</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-3">
            {(formData.tiers?.length ?? 0) === 0 && (
              <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-lg p-3 text-center">
                <span className="text-zinc-600 text-xs">No tiers added yet</span>
              </div>
            )}

            {formData.tiers?.map(tier => (
              <div key={tier.tier} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${getTierColor(tier.tier)}`}>
                    {isHeroTrait ? 'Hero Tier' : `${tier.tier} Tier`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeTier(tier.tier)}
                    className="text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3 space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-600 block">Units</label>
                    <input
                      type="number"
                      min="1"
                      value={tier.units_required ?? 0}
                      onChange={e => handleTierChange(tier.tier, 'units_required', parseInt(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-2 focus:ring-purple-500/50 outline-none"
                    />
                  </div>
                  <div className="col-span-9 space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-600 block">Description</label>
                    <textarea
                      value={tier.description ?? ''}
                      onChange={e => handleTierChange(tier.tier, 'description', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-xs h-11 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none"
                      placeholder="+15% Attack Speed"
                    />
                  </div>
                </div>
              </div>
            ))}

            {isHeroTrait ? (
              (formData.tiers?.length ?? 0) === 0 && (
                <button
                  type="button"
                  onClick={() => addTier('bronze')}
                  className="w-full py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-500/20 transition-colors"
                >
                  + Add Hero Tier
                </button>
              )
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {availableTierTypes.map(tierType => (
                  <button
                    key={tierType}
                    type="button"
                    onClick={() => addTier(tierType)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${getTierColor(tierType)} bg-zinc-900 border border-zinc-800 hover:bg-zinc-800`}
                  >
                    + {tierType}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl transition-all shadow-xl shadow-purple-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isEditing ? 'Update Trait' : 'Save Trait'}
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}