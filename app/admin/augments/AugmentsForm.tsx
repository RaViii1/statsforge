'use client';

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImagePickerModal from "@/components/ImagePickerModal";

interface AugmentFormData {
  id?: number;
  name: string;
  description: string;
  tier: string;
  icon_path: string;
  gamemode: string[];
}

const TIERS = [
  { id: 'silver',    label: 'Silver',    active: 'bg-zinc-300/10 text-zinc-300 border-zinc-300/30' },
  { id: 'gold',      label: 'Gold',      active: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { id: 'prismatic', label: 'Prismatic', active: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
];

const GAMEMODES = [
  { id: 'tft',   label: 'TFT'   },
  { id: 'arena', label: 'Arena' },
  { id: 'aram',  label: 'ARAM'  },
];

const EMPTY: AugmentFormData = {
  name: "", description: "", tier: "", icon_path: "", gamemode: []
};

export default function AugmentsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState<AugmentFormData>(EMPTY);

  useEffect(() => {
    const handler = (e: any) => {
      const a = e.detail;
      setIsEditing(true);
      setFormData({
        id: a.id,
        name: a.name ?? "",
        description: a.description ?? "",
        tier: Array.isArray(a.tier) ? (a.tier[0] ?? "") : (a.tier ?? ""),
        icon_path: a.icon_path ?? "",
        gamemode: Array.isArray(a.gamemode) ? a.gamemode : (a.gamemode ? [a.gamemode] : []),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('edit-augment', handler);
    return () => window.removeEventListener('edit-augment', handler);
  }, []);

  const toggleGamemode = (gm: string) => {
    setFormData(prev => ({
      ...prev,
      gamemode: prev.gamemode.includes(gm)
        ? prev.gamemode.filter(g => g !== gm)
        : [...prev.gamemode, gm]
    }));
  };

  const handleImageSelect = (url: string, filename: string) => {
    const parts = filename.split('/');
    const cleanFilename = parts.length > 1 ? parts[1] : filename;
    setFormData(prev => ({ ...prev, icon_path: cleanFilename }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Name is required"); return; }
    if (!formData.tier) { toast.error("Select a tier"); return; }
    if (formData.gamemode.length === 0) { toast.error("Select at least one gamemode"); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/augments', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save");
      toast.success(isEditing ? "Augment updated" : "Augment created");
      setFormData(EMPTY);
      setIsEditing(false);
      router.refresh();
      window.dispatchEvent(new Event('augments-updated'));
    } catch (err: any) {
      toast.error(err.message || "Error saving augment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(EMPTY);
    setIsEditing(false);
  };

  const previewUrl = formData.icon_path
    ? formData.icon_path.startsWith('http') 
      ? formData.icon_path 
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/augments/${formData.icon_path}`
    : null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            {isEditing ? 'Edit Augment' : 'New Augment'}
          </span>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
        )}
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">

        {/* Icon + Name row */}
        <div className="flex gap-3 items-start">
          {/* Icon preview / upload */}
          <div className="flex-shrink-0 space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block">
              Icon
            </label>
            <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group cursor-pointer">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="icon"
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <Sparkles className="w-4 h-4 text-zinc-600" />
                  <span className="text-[9px] text-zinc-700">Select</span>
                </div>
              )}
              <button type="button" onClick={() => setShowImagePicker(true)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </button>
            </div>
            {previewUrl && (
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, icon_path: '' }))} className="text-[9px] text-red-400 hover:text-red-300 transition-colors mt-1.5 block">Remove</button>
            )}
          </div>

          {/* Name + Description stacked */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
                Name <span className="text-orange-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors"
                placeholder="e.g. Golden Gift"
              />
            </div>
          </div>
        </div>

        {/* Tier */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
            Tier <span className="text-orange-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map(tier => {
              const active = formData.tier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tier: tier.id }))}
                  className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    active
                      ? `${tier.active} scale-[1.02]`
                      : 'bg-zinc-900 text-zinc-600 border-white/5 hover:text-zinc-300 hover:border-white/10'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gamemode */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
              Gamemode <span className="text-orange-500">*</span>
            </label>
            <span className="text-[10px] text-zinc-700">multiple allowed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GAMEMODES.map(gm => {
              const active = formData.gamemode.includes(gm.id);
              return (
                <button
                  key={gm.id}
                  type="button"
                  onClick={() => toggleGamemode(gm.id)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    active
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 scale-[1.02]'
                      : 'bg-zinc-900 text-zinc-600 border-white/5 hover:text-zinc-300 hover:border-white/10'
                  }`}
                >
                  {gm.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none placeholder:text-zinc-600 transition-colors leading-relaxed"
            placeholder="What does this augment do?"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
        >
          {loading
            ? <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
            : isEditing ? 'Update Augment' : 'Create Augment'
          }
        </button>

      </form>
      </div>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.icon_path} storageBucket="TftUnitIcons" folder="augments" />
    </div>
  );
}