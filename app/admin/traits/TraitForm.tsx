'use client';

import { useState, useEffect } from "react";
import { Plus, Shield, Target } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTTrait, TFTSet } from "@/lib/tft/champions";

interface TraitFormProps {
  sets: (TFTSet & { id: number })[];
}

export default function TraitForm({ sets }: TraitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<TFTTrait>>({
    name: "",
    set_id: sets[0]?.id || 0,
    icon_path: "",
    description: "",
  });

  useEffect(() => {
    const handleEditEvent = (event: any) => {
      const trait = event.detail;
      setIsEditing(true);
      setFormData(trait);
    };

    window.addEventListener('edit-trait', handleEditEvent);
    return () => window.removeEventListener('edit-trait', handleEditEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Trait name is required");
      return;
    }

    setLoading(true);
    try {
      const id = formData.id || formData.name.toLowerCase().replace(/\s+/g, "-");
      
      const res = await fetch("/api/admin/traits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });

      if (!res.ok) throw new Error("Failed to save trait");

      toast.success("Trait saved successfully!");
      setIsEditing(false);
      setFormData({
        name: "",
        set_id: sets[0]?.id || 0,
        icon_path: "",
        description: "",
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className={`w-5 h-5 text-purple-500 transition-transform ${isEditing ? 'rotate-12' : ''}`} />
          {isEditing ? 'Edit Trait' : 'New Trait'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Name</label>
            <input 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Icon URL</label>
          <input 
            value={formData.icon_path}
            onChange={e => setFormData(prev => ({ ...prev, icon_path: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none" 
            placeholder="/images/tft/traits/chembaron.png" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm h-32 resize-none focus:ring-2 focus:ring-purple-500/50 outline-none" 
            placeholder="Trait bonuses and details..."
          />
        </div>

        <button 
          type="submit" 
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
      </form>
    </div>
  );
}
