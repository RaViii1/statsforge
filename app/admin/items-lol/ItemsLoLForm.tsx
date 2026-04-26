'use client';

import { useState, useEffect } from "react";
import { Plus, X, Sword, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Item } from "@/lib/items";
import ImagePickerModal from "@/components/ImagePickerModal";

export default function ItemsLoLForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Item>>({
    id: "",
    riot_api_id: "",
    name: "",
    stats: "",
    description: "",
    image_path: "",
    gamemode: ""
  });

  useEffect(() => {
    const handleEditEvent = (event: any) => {
      const item = event.detail;
      setIsEditing(true);
      setFormData({ ...item });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('edit-lol-item', handleEditEvent);
    return () => window.removeEventListener('edit-lol-item', handleEditEvent);
  }, []);

  const handleImageSelect = (url: string, filename: string) => {
    setFormData(prev => ({ ...prev, image_path: filename }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'stats') {
      try {
        setFormData(prev => ({ ...prev, stats: value ? JSON.parse(value) : {} }));
      } catch {
        toast.error("Invalid JSON format for stats");
      }
    } else if (name === 'id' && !formData.riot_api_id) {
      setFormData(prev => ({ ...prev, id: value, riot_api_id: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/items-lol', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error("Failed to save item");
      toast.success(isEditing ? "Item updated" : "Item created");
      setFormData({ id: "", riot_api_id: "", name: "", stats: {}, description: "", image_path: "", gamemode: "" });
      setIsEditing(false);
      router.refresh();
    } catch { toast.error("Error saving item"); } finally { setLoading(false); }
  };

  const handleCancel = () => {
    setFormData({ id: "", riot_api_id: "", name: "", stats: {}, description: "", image_path: "", gamemode: "" });
    setIsEditing(false);
  };

  const previewUrl = formData.image_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${formData.image_path}` : null;

  return (
    <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Sword className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-white">{isEditing ? 'Edit LoL Item' : 'New LoL Item'}</span>
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
              <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors" placeholder="Item name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Gamemode</label>
              <select name="gamemode" value={formData.gamemode || ''} onChange={handleChange} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none cursor-pointer">
                <option value="">All Gamemodes</option>
                <option value="CLASSIC">Classic</option>
                <option value="ARAM">ARAM</option>
                <option value="URF">URF</option>
                <option value="ARENA">Arena</option>
                <option value="ARAM_MAYHEM">ARAM Mayhem</option>
                <option value="ALL">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Item ID</label>
            <div className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-zinc-600 font-mono min-h-[38px] flex items-center">{formData.id || <span className="italic">Auto-generated</span>}</div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500">Riot API ID</label>
            <input type="text" name="riot_api_id" value={formData.riot_api_id || ''} onChange={handleChange} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600" placeholder="e.g. 3031" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none placeholder:text-zinc-600 transition-colors" placeholder="Item description..." />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Stats <span className="normal-case tracking-normal text-zinc-600 font-normal">(JSON)</span></label>
          <textarea name="stats" value={JSON.stringify(formData.stats, null, 2)} onChange={handleChange} rows={3} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-xs font-mono focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none text-emerald-400" placeholder='{ "hp": 300, "ad": 25 }' />
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