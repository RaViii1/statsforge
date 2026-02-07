'use client';

import { useState, useEffect } from "react";
import { Plus, Box, X, Target } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTItem } from "@/lib/tft/itemstft";
import { TFTSet }  from "@/lib/tft/champions";
import SvgIcon from "@/components/SvgIcon";
import { color } from "framer-motion";

interface ItemFormProps {
  sets: (TFTSet & { id: number })[];
}

export default function ItemForm({ sets }: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<TFTItem>>({
    name: "",
    set_id: 0,
    image_path: "",
    description: "",
    is_component: false,
    is_artifact: false,
    is_radiant: false,
    is_seasonal: false,
    stats: {
      hp: 0,
      ap: 0,
      ad: 0,
      armor: 0,
      mr: 0,
      as: 0,
      mana: 0,
      crit: 0,
      crit_dmg: 0,
      healing: 0,
      shield: 0,
      lifesteal: 0,
      dmgAmp: 0,
    }
  });

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
        stats: item.stats || { hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0 }
      });
    };

    window.addEventListener('edit-item', handleEditEvent);
    return () => window.removeEventListener('edit-item', handleEditEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Item name is required");
      return;
    }

    setLoading(true);
    try {
      const id = formData.id || `TFT_Item_${formData.name?.toLowerCase().replace(/\s+/g, "_")}`;
      
      const res = await fetch("/api/admin/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (!res.ok) throw new Error("Failed to save item");

      toast.success("Item saved successfully!");
      setIsEditing(false);
        setFormData({
          name: "",
          set_id: 0,
          image_path: "",
          description: "",
          is_component: false,
          is_artifact: false,
          is_radiant: false,
          is_seasonal: false,
          stats: { hp: 0, ap: 0, ad: 0, armor: 0, mr: 0, as: 0, mana: 0, crit: 0, crit_dmg: 0, healing: 0, shield: 0, lifesteal: 0, dmgAmp: 0 }
        });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      stats: { ...prev.stats!, [field]: value }
    }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-8 overflow-y-auto max-h-[85vh] scrollbar-hide">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Box className={`w-5 h-5 text-green-500 transition-transform ${isEditing ? 'rotate-45' : ''}`} />
          {isEditing ? 'Edit Item' : 'New Item'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-green-900/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isEditing ? 'Update Item' : 'Save Item'}
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Name</label>
            <input 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none" 
              placeholder="e.g. Infinity Edge" 
            />
          </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Set</label>
                <select 
                  value={formData.set_id || ""}
                  onChange={e => setFormData(prev => ({ ...prev, set_id: e.target.value ? parseInt(e.target.value) : 0 }))}
                  disabled={!formData.is_seasonal}
                  required={formData.is_seasonal}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Not Set</option>
                  {sets.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Set {s.set_number})</option>
                  ))}
                </select>
              </div>
          </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Image URL</label>
          <input 
            value={formData.image_path}
            onChange={e => setFormData(prev => ({ ...prev, image_path: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-green-500/50 outline-none" 
            placeholder="/images/tft/items/ie.png" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm h-24 resize-none focus:ring-2 focus:ring-green-500/50 outline-none" 
            placeholder="Item effects..."
          />
        </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
              <input 
                type="checkbox"
                checked={formData.is_seasonal}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  is_seasonal: e.target.checked,
                  set_id: e.target.checked ? prev.set_id : 0
                }))}
                className="w-4 h-4 rounded border-zinc-800 text-blue-500 focus:ring-blue-500/50 bg-zinc-900"
              />
              <span className="text-[10px] font-black uppercase text-zinc-400">Seasonal Item</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
              <input 
                type="checkbox"
                checked={formData.is_component}
                onChange={e => setFormData(prev => ({ ...prev, is_component: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-800 text-green-500 focus:ring-green-500/50 bg-zinc-900"
              />
              <span className="text-[10px] font-black uppercase text-zinc-400">Component</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
              <input 
                type="checkbox"
                checked={formData.is_artifact}
                onChange={e => setFormData(prev => ({ ...prev, is_artifact: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-800 text-purple-500 focus:ring-purple-500/50 bg-zinc-900"
              />
              <span className="text-[10px] font-black uppercase text-zinc-400">Artifact</span>
            </label>
            <label className="flex items-center gap-2 p-3 bg-zinc-950/50 border border-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
              <input 
                type="checkbox"
                checked={formData.is_radiant}
                onChange={e => setFormData(prev => ({ ...prev, is_radiant: e.target.checked }))}
                className="w-4 h-4 rounded border-zinc-800 text-orange-500 focus:ring-orange-500/50 bg-zinc-900"
              />
              <span className="text-[10px] font-black uppercase text-zinc-400">Radiant</span>
            </label>
          </div>

        <div className="pt-6 border-t border-zinc-800 space-y-4">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-green-500" />
            Item Stats
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'hp', label: 'HP', icon: 'health', color: 'text-green-400' },
              { id: 'ap', label: 'AP', icon: 'ap', color: 'text-blue-500' },
              { id: 'ad', label: 'AD', icon: 'dmg', color: 'text-orange-500' },
              { id: 'as', label: 'AS', icon: 'attackspeed', color: 'text-yellow-300' },
              { id: 'armor', label: 'Armor', icon: 'armor', color: 'text-orange-400' },
              { id: 'mr', label: 'MR', icon: 'mr', color: 'text-purple-500' },
              { id: 'mana', label: 'Mana', icon: 'mana', color: 'text-cyan-400' },
              { id: 'crit', label: 'Crit', icon: 'crit', color: 'text-red-500' },
              { id: 'crit_dmg', label: 'Crit DMG', icon: 'critdmg', color: 'text-pink-500' },
              { id: 'healing', label: 'Healing', icon: 'healing', color: 'text-green-300' },
              { id: 'shield', label: 'Shield', icon: 'shield', color: 'text-blue-300' },
              { id: 'lifesteal', label: 'Lifesteal', icon: 'lifesteal', color: 'text-red-400' },
              { id: 'dmgAmp', label: 'DMG Amp', icon: 'dmgamp', color: 'text-purple-400' },
            ].map(stat => (
              <div key={stat.id} className="space-y-1">
                <label className="text-[9px] uppercase font-black text-zinc-600 flex items-center justify-center gap-1">
                  <SvgIcon type={stat.icon as any} size={12} className={stat.color}/>
                  {stat.label}
                </label>
                <input 
                  type="number"
                  value={(formData.stats as any)?.[stat.id] || 0}
                  onChange={e => updateStat(stat.id, parseInt(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-2 text-white text-[10px] text-center focus:ring-2 focus:ring-green-500/50 outline-none" 
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>


      </form>
    </div>
  );
}
