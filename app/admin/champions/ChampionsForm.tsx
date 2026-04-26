'use client';

import { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Star, Search, X, Box, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTChampion, TFTSet, getTraitIconUrl } from "@/lib/tft/champions";
import SvgIcon from "@/components/SvgIcon";
import { createClient } from "@/lib/supabase/client";
import ImagePickerModal from "@/components/ImagePickerModal";

interface ChampionFormProps {
  sets: (TFTSet & { id: number })[];
}

interface Trait {
  id: string;
  name: string;
  icon_path: string | null;
}

export default function ChampionForm({ sets }: ChampionFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [availableTraits, setAvailableTraits] = useState<Trait[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [filteredTraits, setFilteredTraits] = useState<Trait[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const itemSuggestionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<Partial<TFTChampion>>({
    name: "",
    cost: 1,
    set_id: sets[0]?.id || 0,
    image_path: "",
    ability: {
      name: "",
      description: { passive: "", active: "" },
      damage: "",
      heal: "",
      shield: "",
      stun: "",
      attackspeed: "",
      damageReduction: "",
      special: "",
    },
    stats: {
      stars: [
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
      ],
      speed: 0.7,
      mana: 50,
      range: 1,
    },
    traits: [],
    tft_champion_best_items: [],
  });

  const [traitInput, setTraitInput] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleEditEvent = async (event: any) => {
      const champ = event.detail;
      setIsEditing(true);

      const { data: traitData } = await supabase
        .from("tft_champion_traits")
        .select("trait_id")
        .eq("champion_id", champ.id);

      const traitIds = traitData ? [...new Set(traitData.map((t: any) => t.trait_id))] : [];

      const { data: itemData } = await supabase
        .from("tft_champion_best_items")
        .select("item_id, tft_items(*)")
        .eq("champion_id", champ.id)
        .order("priority", { ascending: true });

      const bestItems = itemData?.map((i: any) => i.tft_items) || [];

      setFormData({
        ...champ,
        traits: traitIds,
        tft_champion_best_items: bestItems,
        stats: {
          speed: champ.stats?.speed || 0.7,
          mana: champ.stats?.mana || 50,
          range: champ.stats?.range || 1,
          stars: champ.stats?.stars || [
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
          ],
        },
      });
    };

    window.addEventListener('edit-champion', handleEditEvent);
    return () => window.removeEventListener('edit-champion', handleEditEvent);
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.set_id) return;

      const { data: traitData } = await supabase
        .from("tft_traits")
        .select("id, name, icon_path")
        .eq("set_id", formData.set_id);

      if (traitData) setAvailableTraits(traitData);

      const { data: itemData } = await supabase
        .from("tft_items")
        .select("*")
        .or(`set_id.eq.${formData.set_id},set_id.is.null`);

      if (itemData) setAvailableItems(itemData);
    };
    fetchData();
  }, [formData.set_id, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (itemSuggestionRef.current && !itemSuggestionRef.current.contains(event.target as Node)) {
        setShowItemSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTraitInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTraitInput(value);
    if (value.trim()) {
      const filtered = availableTraits.filter(t =>
        t.name.toLowerCase().includes(value.toLowerCase()) &&
        !formData.traits?.includes(t.id)
      );
      setFilteredTraits(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setItemInput(value);
    if (value.trim()) {
      const filtered = availableItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) &&
        !formData.tft_champion_best_items?.some(bi => bi.id === item.id)
      );
      setFilteredItems(filtered);
      setShowItemSuggestions(true);
    } else {
      setShowItemSuggestions(false);
    }
  };

  const addTrait = (traitId: string) => {
    if (!formData.traits?.includes(traitId)) {
      setFormData(prev => ({ ...prev, traits: [...(prev.traits || []), traitId] }));
    }
    setTraitInput("");
    setShowSuggestions(false);
  };

  const addItem = (item: any) => {
    if (!formData.tft_champion_best_items?.some(bi => bi.id === item.id)) {
      setFormData(prev => ({
        ...prev,
        tft_champion_best_items: [...(prev.tft_champion_best_items || []), item],
      }));
    }
    setItemInput("");
    setShowItemSuggestions(false);
  };

  const removeTrait = (traitId: string) => {
    setFormData(prev => ({ ...prev, traits: prev.traits?.filter(id => id !== traitId) }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      tft_champion_best_items: prev.tft_champion_best_items?.filter(item => item.id !== itemId),
    }));
  };

  const updateStat = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, stats: { ...prev.stats!, [field]: value } }));
  };

  const updateStarStat = (starIndex: number, field: string, value: number) => {
    setFormData(prev => {
      const stars = [...(prev.stats?.stars || [
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
        { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
      ])] as any;
      stars[starIndex] = { ...stars[starIndex], [field]: value };
      return { ...prev, stats: { ...prev.stats!, stars } };
    });
  };

  const handleImageSelect = (url: string, filename: string) => {
    const parts = filename.split('/');
    const cleanFilename = parts.length > 1 ? parts[1] : filename;
    setFormData(prev => ({ ...prev, image_path: cleanFilename }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Champion name is required");
      return;
    }

    setLoading(true);
    try {
      const selectedSet = sets.find(s => s.id === formData.set_id);
      const setNumber = selectedSet?.set_number || 16;
      const id = formData.id || `${setNumber}_${formData.name.toLowerCase().replace(/\s+/g, "_")}`;

      const res = await fetch("/api/admin/champions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save champion");

      toast.success("Champion saved successfully!");
      setIsEditing(false);
      setFormData({
        name: "",
        cost: 1,
        set_id: sets[0]?.id || 0,
        image_path: "",
        ability: {
          name: "",
          description: { passive: "", active: "" },
          damage: "",
          heal: "",
          shield: "",
          stun: "",
          attackspeed: "",
          damageReduction: "",
          special: "",
        },
        stats: {
          stars: [
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
            { hp: 0, dmg: 0, ap: 100, armor: 40, mr: 40, crit: 25 },
          ],
          speed: 0.7,
          mana: 50,
          range: 1,
        },
        traits: [],
        tft_champion_best_items: [],
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = formData.image_path 
    ? formData.image_path.startsWith('http')
      ? formData.image_path
      : formData.image_path.includes('/')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${formData.image_path}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/champions/${formData.image_path}`
    : null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Plus className={`w-3.5 h-3.5 text-orange-400 transition-transform ${isEditing ? 'rotate-45' : ''}`} />
          </div>
          <span className="text-sm font-semibold text-white">
            {isEditing ? 'Edit Champion' : 'New Champion'}
          </span>
        </div>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* Cost selector */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, cost: c }))}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                  formData.cost === c
                    ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20'
                    : 'bg-zinc-900 border border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
            ) : isEditing ? (
              'Update Champion'
            ) : (
              'Create Champion'
            )}
          </button>

          {/* Name + Set */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 ml-1">
                Name <span className="text-orange-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none"
                placeholder="e.g. Jinx"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 ml-1">Set</label>
              <select
                value={formData.set_id}
                onChange={e => setFormData(prev => ({ ...prev, set_id: parseInt(e.target.value) }))}
                required
                className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none"
              >
                {sets.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image */}
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Icon</label>
              <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="icon" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
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
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image_path: '' }))} className="text-[9px] text-red-400 hover:text-red-300 transition-colors mt-1.5 block">Remove</button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Name <span className="text-orange-500">*</span></label>
                <input
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none"
                  placeholder="e.g. Jinx"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Set</label>
                <select
                  value={formData.set_id}
                  onChange={e => setFormData(prev => ({ ...prev, set_id: parseInt(e.target.value) }))}
                  required
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none"
                >
                  {sets.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Traits */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 ml-1 block mb-1.5">Traits</label>
            <div className="flex flex-wrap gap-2 min-h-9 p-2 bg-zinc-950/50 rounded-xl border border-dashed border-white/5">
              {formData.traits?.length === 0 && (
                <span className="text-zinc-600 text-[10px] italic self-center">No traits added</span>
              )}
              {formData.traits?.map((traitId, index) => {
                const trait = availableTraits.find(t => t.id === traitId);
                return (
                  <span
                    key={`${traitId}-${index}`}
                    className="bg-orange-500/10 border border-orange-500/30 text-orange-500 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 group"
                  >
                    <div className="w-4 h-4 bg-zinc-800 rounded flex items-center justify-center overflow-hidden">
                      {trait?.icon_path ? (
                        <img src={getTraitIconUrl(trait.icon_path)} alt="" className="w-3 h-3 object-contain" />
                      ) : (
                        <Box className="w-2.5 h-2.5 text-zinc-600" />
                      )}
                    </div>
                    {trait?.name || traitId}
                    <button type="button" onClick={() => removeTrait(traitId)} className="hover:text-white transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="relative">
              <input
                value={traitInput}
                onChange={handleTraitInputChange}
                onFocus={() => traitInput && setShowSuggestions(true)}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 outline-none"
                placeholder="Search traits..."
              />
              <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {showSuggestions && filteredTraits.length > 0 && (
              <div
                ref={suggestionRef}
                className="absolute z-50 w-full mt-1 bg-[#111112] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
              >
                {filteredTraits.map(trait => (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => addTrait(trait.id)}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden">
                      {trait.icon_path ? (
                        <img src={getTraitIconUrl(trait.icon_path)} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <Box className="w-3 h-3 text-zinc-600" />
                      )}
                    </div>
                    {trait.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Best Items */}
          <div className="space-y-1.5 relative">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 ml-1 block mb-1.5">Best Items</label>
            <div className="flex flex-wrap gap-2 min-h-9 p-2 bg-zinc-950/50 rounded-xl border border-dashed border-white/5">
              {formData.tft_champion_best_items?.length === 0 && (
                <span className="text-zinc-600 text-[10px] italic self-center">No best items added</span>
              )}
              {formData.tft_champion_best_items?.map(item => (
                <span
                  key={item.id}
                  className="bg-blue-500/10 border border-blue-500/30 text-blue-500 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 group"
                >
                  <div className="w-4 h-4 rounded overflow-hidden">
                    <img src={item.image_path} alt="" className="w-full h-full object-cover" />
                  </div>
                  {item.name}
                  <button type="button" onClick={() => removeItem(item.id)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                value={itemInput}
                onChange={handleItemInputChange}
                onFocus={() => itemInput && setShowItemSuggestions(true)}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 outline-none"
                placeholder="Type to search items..."
              />
              <Box className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {showItemSuggestions && filteredItems.length > 0 && (
              <div
                ref={itemSuggestionRef}
                className="absolute z-50 w-full mt-1 bg-[#111112] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto"
              >
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => addItem(item)}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-zinc-800 rounded-md flex items-center justify-center overflow-hidden">
                      {item.image_path ? (
                        <img src={item.image_path} alt="" className="w-4 h-4 object-cover" />
                      ) : (
                        <Box className="w-3 h-3 text-zinc-600" />
                      )}
                    </div>
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ability Section */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Ability Name</label>
            <input
              value={formData.ability?.name || ''}
              onChange={e => setFormData(prev => ({ ...prev, ability: { ...prev.ability!, name: e.target.value } }))}
              placeholder="Ability Name"
              className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none font-bold"
            />

            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Passive Description</label>
            <textarea
              value={formData.ability?.description?.passive || ''}
              onChange={e => setFormData(prev => ({ ...prev, ability: { ...prev.ability!, description: { ...prev.ability!.description!, passive: e.target.value } } }))}
              placeholder="Passive Description"
              className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none"
            />

            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Active Description</label>
            <textarea
              value={formData.ability?.description?.active || ''}
              onChange={e => setFormData(prev => ({ ...prev, ability: { ...prev.ability!, description: { ...prev.ability!.description!, active: e.target.value } } }))}
              placeholder="Active Description"
              className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none"
            />
          </div>

          {/* Ability Effects */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Ability Effects</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'damage', label: 'Damage', icon: 'dmg' },
                { id: 'heal', label: 'Heal', icon: 'health' },
                { id: 'shield', label: 'Shield', icon: 'armor' },
                { id: 'stun', label: 'Stun', icon: 'mr' },
                { id: 'attackspeed', label: 'Atk Speed', icon: 'attackspeed' },
                { id: 'damageReduction', label: 'Dmg Red', icon: 'armor' },
                { id: 'special', label: 'Special', icon: 'ap' },
              ].map(effect => (
                <div key={effect.id} className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-zinc-600 flex items-center justify-center gap-1">
                    <SvgIcon type={effect.icon as any} size={8} />
                    {effect.label}
                  </label>
                  <input
                    value={(formData.ability as any)?.[effect.id] || ''}
                    onChange={e => setFormData(prev => ({ ...prev, ability: { ...prev.ability!, [effect.id]: e.target.value } }))}
                    className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-2 text-white text-[10px] text-center outline-none"
                    placeholder="e.g. 200/300/400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Base Stats */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Base Stats</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-zinc-600 flex items-center justify-center gap-1">
                  <SvgIcon type="attackspeed" size={10} className="text-yellow-200" />
                  Speed
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.stats?.speed || ''}
                  onChange={e => updateStat('speed', parseFloat(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-2 text-white text-[10px] text-center outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-zinc-600 flex items-center justify-center gap-1">
                  <SvgIcon type="mana" size={10} className="text-blue-500" />
                  Mana
                </label>
                <input
                  type="number"
                  value={formData.stats?.mana || ''}
                  onChange={e => updateStat('mana', parseFloat(e.target.value))}
                  className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-2 text-white text-[10px] text-center outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-zinc-600">Range</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateStat('range', r)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-semibold transition-all ${
                        formData.stats?.range === r
                          ? 'bg-orange-500 text-white'
                          : 'bg-zinc-950 border border-white/5 text-zinc-500'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Star Stats */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Star Stats</label>
            <div className="space-y-4">
              {[0, 1, 2].map(starIndex => (
                <div key={starIndex} className="bg-zinc-950/30 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(starIndex + 1)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase">{starIndex + 1} Star</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hp', label: 'HP', icon: 'health', color: "text-green-400" },
                      { id: 'dmg', label: 'Dmg', icon: 'dmg', color: "text-orange-500" },
                      { id: 'ap', label: 'AP', icon: 'ap', color: "text-blue-400" },
                      { id: 'armor', label: 'Armor', icon: 'armor', color: "text-orange-400" },
                      { id: 'mr', label: 'MR', icon: 'mr', color: "text-purple-500" },
                      { id: 'crit', label: 'Crit', icon: 'crit', color: "text-red-500" },
                    ].map(stat => (
                      <div key={stat.id} className="space-y-1">
                        <label className="text-[8px] uppercase font-semibold text-zinc-600 flex items-center justify-center gap-1">
                          <SvgIcon type={stat.icon as any} size={10} className={stat.color} />
                          {stat.label}
                        </label>
                        <input
                          type="number"
                          value={(formData.stats?.stars?.[starIndex] as any)?.[stat.id] || 0}
                          onChange={e => updateStarStat(starIndex, stat.id, parseFloat(e.target.value))}
                          className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-1.5 text-white text-[10px] text-center outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>
      </div>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.image_path} storageBucket="TftUnitIcons" folder="champions" />
    </div>
  );
}