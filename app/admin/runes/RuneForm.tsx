'use client';

import { useState, useEffect } from 'react';
import { Upload, Layers, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { Rune, RuneTree, getRuneIconUrl } from '@/lib/lol/runes';
import ImagePickerModal from '@/components/ImagePickerModal';

const EMPTY_RUNE = (): Partial<Rune> => ({
  id: '',
  name: '',
  icon_path: '',
  description: '',
  tree_id: '',
  is_keystone: false,
  is_stat_shard: false,
});

interface RuneFormProps {
  onSaved?: () => void;
  trees: RuneTree[];
}

export default function RuneForm({ onSaved, trees }: RuneFormProps) {
  const [form, setForm] = useState<Partial<Rune>>(EMPTY_RUNE());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const rune = (e as CustomEvent<Rune | null>).detail;
      if (rune) {
        setForm({ ...rune });
        setIsEditing(true);
      } else {
        reset();
        setIsEditing(false);
      }
    };
    window.addEventListener('edit-rune', handler as EventListener);
    return () => window.removeEventListener('edit-rune', handler as EventListener);
  }, []);

  const reset = () => {
    setForm(EMPTY_RUNE());
    setIsEditing(false);
  };

  const handleImageSelect = (url: string, filename?: string) => {
    // Handle both single-parameter and two-parameter calls
    let iconPath = url;
    if (filename) {
      const cleanFilename = filename.split('/').pop() || filename;
      iconPath = cleanFilename;
    } else if (url) {
      const parts = url.split('/');
      iconPath = parts[parts.length - 1];
    }
    setForm(prev => ({ ...prev, icon_path: iconPath }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error('Rune name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        id: form.id || undefined, // Send the ID if provided (for both create and update)
        tree_id: form.tree_id || null,
        icon_path: form.icon_path,
        name: form.name,
        description: form.description || '',
        is_keystone: form.is_keystone || false,
        is_stat_shard: form.is_stat_shard || false,
      };

      console.log('Submitting rune payload:', payload); // Debug log

      const res = await fetch('/api/runes', {
        method: 'POST', // Always use POST - the API handles both create and update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      console.log('API response:', result); // Debug log
      
      if (!res.ok) throw new Error(result.error || 'Failed to save rune');
      
      toast.success(isEditing ? 'Rune updated!' : 'Rune created!');
      onSaved?.();
      reset();
    } catch (err: any) {
      console.error('Error saving rune:', err); // Debug log
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 outline-none placeholder:text-zinc-600 transition-colors';
  const labelCls = 'text-[10px] uppercase tracking-wider font-semibold text-zinc-500';

  return (
    <>
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-1">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Rune ID - Editable */}
            <div className='flex flex-row gap-4'>
            <div className="space-y-1.5">
              <label className={labelCls}>
                Rune ID 
                {!isEditing && <span className="text-orange-500 ml-1">(Optional)</span>}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  value={form.id ?? ''}
                  onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                  className={`${inputCls} pl-9 text-xs font-mono`}
                  placeholder={isEditing ? "Change rune ID (e.g., rune_conqueror)" : "Leave empty for auto-generated ID"}
                />
              </div>
            </div>
              <div className="space-y-1.5 mb-4">
              <label className={labelCls}>Rune Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_keystone === true}
                    onChange={e => setForm(p => ({ ...p, is_keystone: e.target.checked }))}
                    className="w-4 h-4 text-orange-500 bg-zinc-900 border-white/5 rounded focus:ring-orange-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white">Keystone</span>
                </label>
              </div>
            </div>
            </div>


            {/* Rune Name */}
            <div className="space-y-1.5">
              <label className={labelCls}>Rune Name <span className="text-orange-500">*</span></label>
              <input
                value={form.name ?? ''}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={inputCls}
                placeholder="e.g. Conqueror"
                required
              />
            </div>

            {/* Rune Icon */}
            <div className="space-y-2">
              <label className={labelCls}>Rune Icon</label>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 space-y-1.5">
                  {form.icon_path ? (
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center">
                      <img
                        src={getRuneIconUrl(form.icon_path)}
                        alt="icon"
                        className="w-12 h-12 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-zinc-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-white text-sm cursor-pointer flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-zinc-500" />
                    {form.icon_path ? 'Change Icon' : 'Select Icon'}
                  </button>
                  {form.icon_path && (
                    <button
                      type="button"
                      onClick={() => setForm(p => ({ ...p, icon_path: '' }))}
                      className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove icon
                    </button>
                  )}
                </div>
              </div>
              <input
                value={form.icon_path ?? ''}
                onChange={e => setForm(p => ({ ...p, icon_path: e.target.value }))}
                className={`${inputCls} mt-2 text-xs text-zinc-400`}
                placeholder="…or paste an icon filename (e.g., conqueror.png)"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description ?? ''}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className={`${inputCls} min-h-[80px] resize-none`}
                placeholder="Rune description..."
              />
            </div>

            {/* Tree Selection */}
            <div className="space-y-1.5">
              <label className={labelCls}>Assign to Tree</label>
              <select
                value={form.tree_id ?? ''}
                onChange={e => setForm(p => ({ ...p, tree_id: e.target.value || '' }))}
                className={inputCls}
              >
                <option value="">None (unassigned)</option>
                {trees.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Type Toggles */}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isEditing ? 'Update Rune' : 'Create Rune'}</>
              )}
            </button>
          </form>
        </div>
      </div>

      <ImagePickerModal
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={handleImageSelect}
        currentImage={form.icon_path}
        storageBucket="Lol_runes"
        folder="lol-runes"
      />
    </>
  );
}