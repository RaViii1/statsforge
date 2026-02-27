'use client';

import { useState, useEffect } from "react";
import { Plus, X, Sword } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Item } from "@/lib/items";


export default function ItemsLoLForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      const res = await fetch('/api/admin/items-lol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save item");
      toast.success(isEditing ? "Item updated" : "Item created");
      setFormData({ id: "", riot_api_id: "", name: "", stats: {}, description: "", image_path: "", gamemode: "" });
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Error saving item");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ id: "", riot_api_id: "", name: "", stats: {}, description: "", image_path: "", gamemode: "" });
    setIsEditing(false);
  };

  const inputClass = "w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30";
  const labelClass = "block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-800">
        <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <Sword className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-zinc-100">
            {isEditing ? 'Edit LoL Item' : 'Add LoL Item'}
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">League of Legends item registry</p>
        </div>
        {isEditing && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-md px-2.5 py-1">
            Editing
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item ID */}
          <div>
            <label className={labelClass}>Item ID</label>
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-600 font-mono min-h-[38px] flex items-center">
              {formData.id || <span className="italic">Auto-generated</span>}
            </div>
          </div>

          {/* Riot API ID */}
          <div>
            <label className={labelClass}>Riot API ID</label>
            <input
              type="text"
              name="riot_api_id"
              value={formData.riot_api_id || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. 3031"
            />
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>
              Name <span className="text-orange-500 normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Item name"
              required
            />
          </div>

          {/* Gamemode */}
          <div>
            <label className={labelClass}>Gamemode</label>
            <select
              name="gamemode"
              value={formData.gamemode || ''}
              onChange={handleChange}
              className={inputClass + " cursor-pointer"}
            >
              <option value="">All Gamemodes</option>
              <option value="CLASSIC">Classic</option>
              <option value="ARAM">ARAM</option>
              <option value="URF">URF</option>
              <option value="ARENA">Arena</option>
              <option value="ARAM_MAYHEM">ARAM Mayhem</option>
              <option value="ALL">Other</option>
            </select>
          </div>

          {/* Image Path */}
          <div className="md:col-span-2">
            <label className={labelClass}>Image Path</label>
            <input
              type="text"
              name="image_path"
              value={formData.image_path}
              onChange={handleChange}
              className={inputClass}
              placeholder="URL or path to image"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={inputClass + " resize-none leading-relaxed"}
            placeholder="Item description and effects..."
          />
        </div>

        {/* Stats */}
        <div>
          <label className={labelClass}>
            Stats <span className="normal-case tracking-normal text-zinc-600 font-normal">(JSON)</span>
          </label>
          <textarea
            name="stats"
            value={JSON.stringify(formData.stats, null, 2)}
            onChange={handleChange}
            rows={4}
            className={inputClass + " resize-none font-mono text-xs leading-relaxed text-emerald-400"}
            placeholder='{ "hp": 300, "ad": 25 }'
          />
          <p className="text-xs text-zinc-600 mt-1.5">Enter stat key-value pairs as a valid JSON object</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors"
          >
            {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Item' : 'Create Item')}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}