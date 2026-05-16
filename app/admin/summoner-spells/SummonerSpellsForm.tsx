'use client';

import { useState, useEffect } from "react";
import { X, Zap, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getSummonerSpellIconUrl,
} from "@/lib/summoner-spell";
import { SummonerSpell } from "@/lib/summoner-spell";
import ImagePickerModal from "@/components/ImagePickerModal";

const EMPTY: SummonerSpell = {
  id: "",
  name: "",
  cooldown: 0,
  description: "",
  icon_path: "",
};

export default function SummonerSpellsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<SummonerSpell>>({ ...EMPTY });

  useEffect(() => {
    const handleEditEvent = (event: any) => {
      const spell = event.detail;
      setIsEditing(true);
      setFormData({ ...spell });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('edit-summoner-spell', handleEditEvent);
    return () => window.removeEventListener('edit-summoner-spell', handleEditEvent);
  }, []);

  const handleImageSelect = (_url: string, filename: string) => {
    setFormData(prev => ({ ...prev, icon_path: filename }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'cooldown') {
      setFormData(prev => ({
        ...prev,
        cooldown: value === '' ? 0 : Number(value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const { icon_path, name, cooldown, description, id } = formData;

      const res = await fetch('/api/admin/summoner-spells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id || undefined,
          name,
          cooldown,
          description,
          icon_path,
        }),
      });
      if (!res.ok) throw new Error("Failed to save spell");
      toast.success(isEditing ? "Spell updated" : "Spell created");
      setFormData({ ...EMPTY });
      setIsEditing(false);
      router.refresh();
    } catch { toast.error("Error saving spell"); } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setFormData({ ...EMPTY });
    setIsEditing(false);
  };

  const previewUrl = formData.icon_path
    ? getSummonerSpellIconUrl(formData.icon_path)
    : null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            {isEditing ? 'Edit Summoner Spell' : 'New Summoner Spell'}
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
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, icon_path: '' }))} className="text-[9px] text-red-400 hover:text-red-300 transition-colors mt-1.5 block">Remove</button>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">ID</label>
                <input type="number" name="id" value={formData.id || ''} onChange={handleChange} placeholder="e.g. 54" className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Name <span className="text-orange-500">*</span></label>
                <input name="name" value={formData.name || ''} onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors" placeholder="e.g. Flash" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Cooldown (s)</label>
              <input type="number" name="cooldown" value={formData.cooldown || ''} onChange={handleChange} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600" placeholder="e.g. 300" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none placeholder:text-zinc-600 transition-colors" placeholder="What does this spell do?" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
            {loading ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /> : isEditing ? 'Update Spell' : 'Create Spell'}
          </button>
        </form>
      </div>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.icon_path} storageBucket="summoner_spells" />
    </div>
  );
}
