'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Shield, Search, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTTrait, TFTSet, TFTTraitTier, getCostBorderColor } from "@/lib/tft/champions";
import { createClient } from "@/lib/supabase/client";
import ImagePickerModal from "@/components/ImagePickerModal";

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
  const [showImagePicker, setShowImagePicker] = useState(false);
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
    supabase.from("tft_champions").select("id, name, cost, image_path").eq("set_id", formData.set_id).then(({ data }: { data: Champion[] | null }) => { if (data) setAvailableChampions(data); });
  }, [formData.set_id, supabase]);

  useEffect(() => {
    const handleEditEvent = async (event: Event) => {
      const trait = (event as CustomEvent).detail;
      if (!trait) return;
      const { data: championData } = await supabase.from("tft_champion_traits").select("tft_champions(id, name, cost, image_path)").eq("trait_id", trait.id);
      const champions: Champion[] = (championData ?? []).map((row: any) => row.tft_champions).filter(Boolean);
      const heroTrait = trait.is_hero ?? trait.is_Hero ?? false;
      const existingTiers: TFTTraitTier[] = (trait.tft_trait_tiers ?? []).map((tier: any) => ({ tier: tier.tier || 'bronze', units_required: tier.units_required ?? 0, description: tier.description ?? '', stats: tier.stats ?? {} }));
      let riotApiName = trait.riot_api_name ?? '';
      if (!riotApiName && trait.name) {
        const setNumber = trait.tft_sets?.set_number ?? 0;
        riotApiName = `TFT${setNumber}_${trait.name.replace(/[\s_]+/g, '_').split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
      }
      setFormData({ ...trait, tiers: sortTiers(existingTiers), champions, riot_api_name: riotApiName, is_Hero: heroTrait });
      setIsHeroTrait(heroTrait);
      setIsEditing(true);
      setChampionInput("");
    };
    window.addEventListener('edit-trait', handleEditEvent);
    return () => window.removeEventListener('edit-trait', handleEditEvent);
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) setShowChampionSuggestions(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChampionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChampionInput(value);
    if (value.trim()) {
      setFilteredChampions(availableChampions.filter(c => c.name.toLowerCase().includes(value.toLowerCase()) && !formData.champions?.some(fc => fc.id === c.id)));
      setShowChampionSuggestions(true);
    } else { setShowChampionSuggestions(false); }
  };

  const addChampion = (champion: Champion) => {
    if (isHeroTrait && (formData.champions?.length ?? 0) >= 1) { toast.error("Hero traits can only have one champion"); return; }
    if (!formData.champions?.some(c => c.id === champion.id)) setFormData(prev => ({ ...prev, champions: [...(prev.champions ?? []), champion] }));
    setChampionInput("");
    setShowChampionSuggestions(false);
  };

  const removeChampion = (id: string) => setFormData(prev => ({ ...prev, champions: prev.champions?.filter(c => c.id !== id) }));

  const addTier = (tierType: 'bronze' | 'silver' | 'gold' | 'prismatic') => {
    const count = formData.tiers?.filter(t => t.tier.startsWith(tierType)).length ?? 0;
    const tierName = count === 0 ? tierType : `${tierType}_${count + 1}`;
    setFormData(prev => ({ ...prev, tiers: sortTiers([...(prev.tiers ?? []), { tier: tierName, units_required: 0, description: '', stats: {} }]) }));
  };

  const removeTier = (tierType: string) => setFormData(prev => ({ ...prev, tiers: prev.tiers?.filter(t => t.tier !== tierType) }));
  const handleTierChange = (tierType: string, field: keyof TFTTraitTier, value: any) => setFormData(prev => ({ ...prev, tiers: prev.tiers?.map(t => t.tier === tierType ? { ...t, [field]: value } : t) }));

  const handleHeroTraitChange = (checked: boolean) => {
    setIsHeroTrait(checked);
    setFormData(prev => ({ ...prev, is_Hero: checked, champions: checked && (prev.champions?.length ?? 0) > 1 ? [prev.champions![0]] : prev.champions, tiers: checked && (prev.tiers?.length ?? 0) > 1 ? [prev.tiers![0]] : prev.tiers }));
  };

  const handleNameChange = (newName: string) => {
    const selectedSet = sets.find(s => s.id === formData.set_id);
    const setNumber = selectedSet?.set_number ?? 0;
    const riotApiName = `TFT${setNumber}_${newName.replace(/[\s_]+/g, '_').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
    setFormData(prev => ({ ...prev, name: newName, riot_api_name: riotApiName }));
  };

  const handleImageSelect = (url: string, filename: string) => {
    const parts = filename.split('/');
    const cleanFilename = parts.length > 1 ? parts[1] : filename;
    setFormData(prev => ({ ...prev, icon_path: cleanFilename }));
  };

  const resetForm = () => { setIsEditing(false); setIsHeroTrait(false); setChampionInput(""); setFormData(EMPTY_FORM(defaultSetId)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Trait name is required"); return; }
    setLoading(true);
    try {
      const selectedSet = sets.find(s => s.id === formData.set_id);
      const setNumber = selectedSet?.set_number ?? 0;
      const id = String(formData.id ?? `${setNumber}_${formData.name!.toLowerCase().replace(/\s+/g, "_")}`);
      const res = await fetch("/api/admin/traits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, id, tiers: formData.tiers ?? [] }) });
      if (!res.ok) throw new Error("Failed to save trait");
      toast.success(isEditing ? "Trait updated!" : "Trait saved!");
      resetForm();
      router.refresh();
    } catch (error: any) { toast.error(error.message || "An unexpected error occurred"); } finally { setLoading(false); }
  };

  const getTierColor = (tier: string) => {
    const base = tier.split('_')[0];
    return ({ bronze: 'text-orange-400', silver: 'text-gray-400', gold: 'text-yellow-500', prismatic: 'text-purple-500' } as Record<string, string>)[base] ?? 'text-gray-500';
  };

  const getCostColor = (cost: number) => (['', 'text-zinc-400', 'text-emerald-500', 'text-blue-500', 'text-purple-500', 'text-yellow-500', 'text-red-500', 'text-orange-600'] as string[])[cost] ?? 'text-zinc-400';

  const availableTierTypes = ['bronze', 'silver', 'gold', 'prismatic'] as const;
  const previewUrl = formData.icon_path 
    ? formData.icon_path.startsWith('http')
      ? formData.icon_path
      : formData.icon_path.includes('/')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${formData.icon_path}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/traits/${formData.icon_path}`
    : null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">{isEditing ? 'Edit Trait' : 'New Trait'}</span>
        </div>
        {isEditing && (
          <button type="button" onClick={resetForm} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5">
            <X className="w-3 h-3" /> Cancel
          </button>
        )}
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Icon</label>
            <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="icon" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = '/images/notrait.png'; }} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <ImageIcon className="w-4 h-4 text-zinc-600" />
                  <span className="text-[9px] text-zinc-700">Select</span>
                </div>
              )}
              <button type="button" onClick={() => setShowImagePicker(true)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </button>
            </div>
            {previewUrl && (
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, icon_path: '' }))} className="text-[9px] text-red-400 hover:text-red-300 transition-colors mt-1.5 block">Remove</button>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Name <span className="text-orange-500">*</span></label>
              <input value={formData.name} onChange={e => handleNameChange(e.target.value)} required className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors" placeholder="e.g. Chembaron" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Set</label>
              <select value={formData.set_id} onChange={e => setFormData(prev => ({ ...prev, set_id: parseInt(e.target.value) }))} required className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none">
                {sets.map(s => <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Riot API Name</label>
          <input value={formData.riot_api_name ?? ''} onChange={e => setFormData(prev => ({ ...prev, riot_api_name: e.target.value }))} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600" placeholder="e.g. TFT16_Chembaron" />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
          <input type="checkbox" checked={isHeroTrait} onChange={e => handleHeroTraitChange(e.target.checked)} className="w-3.5 h-3.5 text-orange-600 rounded bg-zinc-950 border-white/10 focus:ring-orange-500/50" />
          <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Hero Trait (1 champion only)</span>
        </label>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Description</label>
          <textarea value={formData.description ?? ''} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none placeholder:text-zinc-600 transition-colors" placeholder="Trait bonuses and details..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Units</label>
          <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-zinc-950/50 rounded-xl border border-dashed border-white/5">
            {(formData.champions?.length ?? 0) === 0 && <span className="text-zinc-600 text-[10px] italic self-center">No units added</span>}
            {formData.champions?.map(champion => (
              <span key={champion.id} className={`bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1`}>
                <span className={`text-[8px] font-bold ${getCostColor(champion.cost)}`}>{champion.cost}</span>
                <span className={getCostColor(champion.cost)}>{champion.name}</span>
                <button type="button" onClick={() => removeChampion(champion.id)} className="text-zinc-500 hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input value={championInput} onChange={handleChampionInputChange} onFocus={() => championInput && setShowChampionSuggestions(true)} disabled={isHeroTrait && (formData.champions?.length ?? 0) >= 1} className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 outline-none disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-zinc-600" placeholder={isHeroTrait ? "Hero trait: only one champion allowed" : "Search champions…"} />
            {showChampionSuggestions && filteredChampions.length > 0 && (
              <div ref={suggestionRef} className="absolute z-50 w-full mt-1 bg-[#111112] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                {filteredChampions.map(champion => (
                  <button key={champion.id} type="button" onClick={() => addChampion(champion)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-3">
                    <div className={`w-6 h-6 bg-zinc-900 border ${getCostBorderColor(champion.cost)} rounded-md flex items-center justify-center`}><span className={`text-[10px] font-bold ${getCostColor(champion.cost)}`}>{champion.cost}</span></div>
                    {champion.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Tiers</label>
          <div className="bg-zinc-950 border border-white/5 rounded-xl p-3 space-y-3">
            {(formData.tiers?.length ?? 0) === 0 && <div className="bg-zinc-900/50 border border-dashed border-white/5 rounded-lg p-3 text-center"><span className="text-zinc-600 text-xs">No tiers added yet</span></div>}
            {formData.tiers?.map(tier => (
              <div key={tier.tier} className="p-3 bg-zinc-900 border border-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold text-xs uppercase tracking-wider ${getTierColor(tier.tier)}`}>{isHeroTrait ? 'Hero Tier' : `${tier.tier} Tier`}</h3>
                  <button type="button" onClick={() => removeTier(tier.tier)} className="text-zinc-600 hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3 space-y-1"><label className="text-[9px] uppercase font-semibold text-zinc-600 block">Units</label><input type="number" min="1" value={tier.units_required ?? 0} onChange={e => handleTierChange(tier.tier, 'units_required', parseInt(e.target.value))} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-1.5 text-white text-xs outline-none" /></div>
                  <div className="col-span-9 space-y-1"><label className="text-[9px] uppercase font-semibold text-zinc-600 block">Description</label><textarea value={tier.description ?? ''} onChange={e => handleTierChange(tier.tier, 'description', e.target.value)} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-1.5 text-white text-xs h-11 resize-none outline-none" placeholder="+15% Attack Speed" /></div>
                </div>
              </div>
            ))}
            {isHeroTrait ? ((formData.tiers?.length ?? 0) === 0 && (<button type="button" onClick={() => addTier('bronze')} className="w-full py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-semibold hover:bg-orange-500/20">+ Add Hero Tier</button>)) : (
              <div className="grid grid-cols-2 gap-2">
                {availableTierTypes.map(tierType => (<button key={tierType} type="button" onClick={() => addTier(tierType)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${getTierColor(tierType)} bg-zinc-900 border border-white/5 hover:bg-white/5`}>+ {tierType}</button>))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
          {loading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : isEditing ? 'Update Trait' : 'Save Trait'}
        </button>
      </form>
      </div>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.icon_path} storageBucket="TftUnitIcons" folder="traits" />
    </div>
  );
}