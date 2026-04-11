'use client';

import { useState, useEffect, useRef } from "react";
import { Plus, Box, X, Target, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTItem } from "@/lib/tft/itemstft";
import { TFTSet }  from "@/lib/tft/champions";
import SvgIcon from "@/components/SvgIcon";
import ImagePickerModal from "@/components/ImagePickerModal";

interface ItemFormProps {
  sets: (TFTSet & { id: number })[];
  components: TFTItem[];
}

export default function ItemForm({ sets, components }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [componentInput, setComponentInput] = useState("");
  const [filteredComponents, setFilteredComponents] = useState<TFTItem[]>([]);
  const [showComponentSuggestions, setShowComponentSuggestions] = useState(false);
  const componentSuggestionRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (url: string, filename: string) => {
    setFormData(prev => ({ ...prev, image_path: url }));
  };

  const [formData, setFormData] = useState<Partial<TFTItem>>({
    name: "",
    set_id: 0,
    image_path: "",
    description: "",
    is_component: false,
    is_artifact: false,
    is_radiant: false,
    is_seasonal: false,
    build_path: [],
    stats: {
      hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentSuggestionRef.current && !componentSuggestionRef.current.contains(event.target as Node)) {
        setShowComponentSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleComponentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setComponentInput(value);
    if (value.trim()) {
      setFilteredComponents(components.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
      setShowComponentSuggestions(true);
    } else {
      setShowComponentSuggestions(false);
    }
  };

  const addComponent = (component: TFTItem) => {
    setFormData(prev => ({ ...prev, build_path: [...(prev.build_path || []), component.id] }));
    setComponentInput("");
    setShowComponentSuggestions(false);
  };

  const removeComponent = (index: number) => {
    setFormData(prev => ({ ...prev, build_path: prev.build_path?.filter((_, i) => i !== index) }));
  };

  useEffect(() => {
    const handleEditEvent = (event: any) => {
      const item = event.detail;
      setIsEditing(true);
      setFormData({
        ...item,
        is_seasonal: !!item.is_seasonal,
        is_component: !!item.is_component,
        is_artifact: !!item.is_artifact,
        is_radiant: !!item.is_radiant,
        set_id: item.set_id || 0,
        build_path: item.build_path || [],
        stats: item.stats || { hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0 }
      });
    };
    window.addEventListener('edit-item', handleEditEvent);
    return () => window.removeEventListener('edit-item', handleEditEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Item name is required"); return; }
    setLoading(true);
    try {
      const id = formData.id || `TFT_Item_${formData.name?.toLowerCase().replace(/\s+/g, "_")}`;
      const res = await fetch("/api/admin/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, id }) });
      if (!res.ok) throw new Error("Failed to save item");
      toast.success("Item saved successfully!");
      setIsEditing(false);
      setFormData({ name: "", set_id: 0, image_path: "", description: "", is_component: false, is_artifact: false, is_radiant: false, is_seasonal: false, build_path: [], stats: { hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0 } });
      router.refresh();
    } catch (error: any) { toast.error(error.message); } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: "", set_id: 0, image_path: "", description: "", is_component: false, is_artifact: false, is_radiant: false, is_seasonal: false, build_path: [], stats: { hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0 } });
  };

  const updateStat = (field: string, value: number) => setFormData(prev => ({ ...prev, stats: { ...prev.stats!, [field]: value } }));

  const previewUrl = formData.image_path || null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Box className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            {isEditing ? 'Edit Item' : 'New Item'}
          </span>
        </div>
        {isEditing && (
          <button type="button" onClick={handleCancel} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5">
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
                <img src={previewUrl} alt="icon" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }} />
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
              <input value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors" placeholder="e.g. Infinity Edge" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Set</label>
              <select value={formData.set_id || ""} onChange={e => setFormData(prev => ({ ...prev, set_id: e.target.value ? parseInt(e.target.value) : 0 }))} disabled={!formData.is_seasonal} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">Not Set</option>
                {sets.map(s => <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Item type</label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.is_seasonal ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-white/5 hover:bg-white/5'}`}>
              <input type="checkbox" checked={formData.is_seasonal} onChange={e => setFormData(prev => ({ ...prev, is_seasonal: e.target.checked, set_id: e.target.checked ? prev.set_id : 0 }))} className="w-4 h-4 rounded border-white/10 accent-orange-500 bg-zinc-950" />
              <span className={`text-[10px] font-semibold uppercase ${formData.is_seasonal ? 'text-orange-400' : 'text-zinc-400'}`}>Seasonal</span>
            </label>
            <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.is_component ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-white/5 hover:bg-white/5'}`}>
              <input type="checkbox" checked={formData.is_component} onChange={e => setFormData(prev => ({ ...prev, is_component: e.target.checked }))} className="w-4 h-4 rounded border-white/10 accent-orange-500 bg-zinc-950" />
              <span className={`text-[10px] font-semibold uppercase ${formData.is_component ? 'text-orange-400' : 'text-zinc-400'}`}>Component</span>
            </label>
            <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.is_artifact ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-white/5 hover:bg-white/5'}`}>
              <input type="checkbox" checked={formData.is_artifact} onChange={e => setFormData(prev => ({ ...prev, is_artifact: e.target.checked }))} className="w-4 h-4 rounded border-white/10 accent-orange-500 bg-zinc-950" />
              <span className={`text-[10px] font-semibold uppercase ${formData.is_artifact ? 'text-orange-400' : 'text-zinc-400'}`}>Artifact</span>
            </label>
            <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${formData.is_radiant ? 'bg-orange-500/10 border-orange-500/30' : 'bg-zinc-900 border-white/5 hover:bg-white/5'}`}>
              <input type="checkbox" checked={formData.is_radiant} onChange={e => setFormData(prev => ({ ...prev, is_radiant: e.target.checked }))} className="w-4 h-4 rounded border-white/10 accent-orange-500 bg-zinc-950" />
              <span className={`text-[10px] font-semibold uppercase ${formData.is_radiant ? 'text-orange-400' : 'text-zinc-400'}`}>Radiant</span>
            </label>
          </div>
        </div>

        {!formData.is_component && !formData.is_artifact && !formData.is_radiant && (
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Build Path <span className="text-orange-500">*</span></label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-zinc-950/50 rounded-xl border border-dashed border-white/5">
                {formData.build_path?.length === 0 && <span className="text-zinc-600 text-[10px] italic self-center">No components added</span>}
                {formData.build_path?.map((componentId: string, index: number) => {
                  const component = components.find(c => c.id === componentId);
                  return (
                    <span key={`${componentId}-${index}`} className="bg-orange-500/10 border border-orange-500/30 text-orange-500 px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                      {component?.name || componentId}
                      <button type="button" onClick={() => removeComponent(index)} className="hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  );
                })}
              </div>
              {(formData.build_path || []).length < 2 && (
                <div className="relative mt-2">
                  <input value={componentInput} onChange={handleComponentInputChange} onFocus={() => componentInput && setShowComponentSuggestions(true)} className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 outline-none placeholder:text-zinc-600" placeholder="Search components..." />
                  <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              )}
              {showComponentSuggestions && filteredComponents.length > 0 && (
                <div ref={componentSuggestionRef} className="absolute z-50 w-full mt-1 bg-[#111112] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredComponents.map(component => (
                    <button key={component.id} type="button" onClick={() => addComponent(component)} className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
                      <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden">
                        {component.image_path ? <img src={component.image_path} alt="" className="w-4 h-4 object-cover" /> : <Box className="w-3 h-3 text-zinc-600" />}
                      </div>
                      {component.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Stats</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[{ id: 'hp', label: 'HP', icon: 'health', color: 'text-green-400' },{ id: 'ap', label: 'AP', icon: 'ap', color: 'text-blue-500' },{ id: 'ad', label: 'AD', icon: 'dmg', color: 'text-orange-500' },{ id: 'as', label: 'AS', icon: 'attackspeed', color: 'text-yellow-300' },{ id: 'armor', label: 'Armor', icon: 'armor', color: 'text-orange-400' },{ id: 'mr', label: 'MR', icon: 'mr', color: 'text-purple-500' },{ id: 'mana', label: 'Mana', icon: 'mana', color: 'text-cyan-400' },{ id: 'crit', label: 'Crit', icon: 'crit', color: 'text-red-500' },{ id: 'crit_dmg', label: 'Crit DMG', icon: 'critdmg', color: 'text-pink-500' },{ id: 'healing', label: 'Healing', icon: 'healing', color: 'text-green-300' },{ id: 'shield', label: 'Shield', icon: 'shield', color: 'text-blue-300' },{ id: 'lifesteal', label: 'Lifesteal', icon: 'lifesteal', color: 'text-red-600' },{ id: 'dmgAmp', label: 'DMG Amp', icon: 'dmgamp', color: 'text-white' }].map(stat => (
              <div key={stat.id} className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-zinc-600 flex items-center justify-center gap-8"><SvgIcon type={stat.icon as any} size={12} className={stat.color}/>{stat.label}</label>
                <input type="number" value={(formData.stats as any)?.[stat.id] || 0} onChange={e => updateStat(stat.id, parseInt(e.target.value))} className="w-full bg-zinc-950 border border-white/5 rounded-lg px-2 py-2 text-white text-[10px] text-center focus:ring-1 focus:ring-orange-500/30 outline-none" placeholder="0" />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
          {loading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : isEditing ? 'Update Item' : 'Create Item'}
        </button>
      </form>
      </div>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.image_path} storageBucket="item-icons" />
    </div>
  );
}