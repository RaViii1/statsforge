"use client";

import { useState, useEffect } from "react";
import { Plus, Hash, Type, Power, X, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TFTSet } from "@/lib/tft/champions";
import ImagePickerModal from "@/components/ImagePickerModal";

export default function SetForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [formData, setFormData] = useState<Partial<TFTSet>>({
    name: "",
    set_number: 0,
    description: "",
    image_path: "",
    is_active: true,
  });

  useEffect(() => {
    const handleEditEvent = (event: CustomEvent) => {
      const setData = event.detail as TFTSet;
      
      if (!setData || !setData.id) {
        return;
      }

      setIsEditing(true);
      setFormData({
        id: setData.id,
        name: setData.name || "",
        description: setData.description || "",
        set_number: setData.set_number || 0,
        image_path: setData.image_path || "",
        is_active: setData.is_active ?? true,
      });
    };

    window.addEventListener('edit-set', handleEditEvent as EventListener);
    return () => window.removeEventListener('edit-set', handleEditEvent as EventListener);
  }, []);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: "", description: "", set_number: 0, image_path: "", is_active: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.error("Set name is required");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        set_number: Number(formData.set_number) || 0,
        is_active: Boolean(formData.is_active),
        image_path: formData.image_path || "",
      };
      
      if (isEditing && formData.id) {
        (submitData as any).id = formData.id;
      }

      const res = await fetch("/api/admin/sets", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Failed to save set");
      }

      toast.success(isEditing ? "Set updated successfully!" : "Set created successfully!");
      setIsEditing(false);
      setFormData({ name: "", description: "", set_number: 0, image_path: "", is_active: true });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save set");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (url: string, filename: string) => {
    const parts = filename.split('/');
    const cleanFilename = parts.length > 1 ? parts[1] : filename;
    setFormData(prev => ({ ...prev, image_path: cleanFilename }));
  };

  const previewUrl = formData.image_path
    ? formData.image_path.startsWith('http')
      ? formData.image_path
      : formData.image_path.includes('/')
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${formData.image_path}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/set-banners/${formData.image_path}`
    : null;

  return (
    <div className="p-6 space-y-8 overflow-y-auto max-h-[85vh] scrollbar-hide bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {isEditing ? (
            <Save className="w-5 h-5 text-orange-500" />
          ) : (
            <Plus className="w-5 h-5 text-orange-500" />
          )}
          {isEditing ? 'Edit Set' : 'New Set'}
        </h2>
        {isEditing && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="p-1.5 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg transition-colors group"
            title="Cancel edit"
          >
            <X className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">
              Set Name {isEditing && formData.id && <span className="text-[10px] text-orange-400 font-mono ml-2">ID: {formData.id}</span>}
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                value={formData.name || ""}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500/50 outline-none" 
                placeholder="e.g. Into the Arcane" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Set Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input 
                type="number"
                min="1"
                value={formData.set_number || ""}
                onChange={e => setFormData(prev => ({ ...prev, set_number: parseInt(e.target.value) || 0 }))}
                required 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-orange-500/50 outline-none" 
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Banner Image</label>
            <div className="flex gap-3 items-start">
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="banner" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }} />
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
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, image_path: '' }))} className="text-[9px] text-red-400 hover:text-red-300 transition-colors self-center">Remove</button>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-zinc-500 block mb-1.5">Description</label>
            <textarea name="description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none resize-none placeholder:text-zinc-600 transition-colors" placeholder="Item description..." />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500 ml-1">Status</label>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_active: !(prev.is_active ?? true) }))}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-xs font-bold ${
              formData.is_active 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:bg-zinc-700'
            }`}
          >
            <Power className={`w-3 h-3 transition-colors ${formData.is_active ? 'text-emerald-500' : 'text-zinc-500'}`} />
            {formData.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-orange-900/20 active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isEditing ? 'Update Set' : 'Create Set'}
              <Plus className={`w-5 h-5 transition-transform ${isEditing ? 'rotate-45' : 'group-hover:rotate-90'}`} />
            </>
          )}
        </button>
      </form>

      <ImagePickerModal isOpen={showImagePicker} onClose={() => setShowImagePicker(false)} onSelect={handleImageSelect} currentImage={formData.image_path} storageBucket="TftUnitIcons" folder="set-banners" />
    </div>
  );
}