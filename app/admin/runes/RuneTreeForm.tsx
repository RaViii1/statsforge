'use client';

import { useState, useEffect } from 'react';
import { Upload, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { RuneTree, getTreeIconUrl } from '@/lib/lol/runes';
import ImagePickerModal from '@/components/ImagePickerModal';

const EMPTY: Partial<RuneTree> = { id: '', name: '', icon_path: '', slots: [[], [], [], []] };

export default function RuneTreeForm({ onSaved }: { onSaved?: (tree: RuneTree) => void }) {
  const [form, setForm] = useState<Partial<RuneTree>>(EMPTY);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const tree = (e as CustomEvent<RuneTree | null>).detail;
      if (tree) {
        setForm({ ...tree });
        setIsEditing(true);
      } else {
        reset();
        setIsEditing(false);
      }
    };
    window.addEventListener('edit-rune-tree', handler as EventListener);
    return () => window.removeEventListener('edit-rune-tree', handler as EventListener);
  }, []);

  const reset = () => {
    setForm(EMPTY);
    setIsEditing(false);
  };

  const handleImageSelect = (url: string, filename?: string) => {

    let iconPath = url;
    if (filename) {

      const cleanFilename = filename.split('/').pop() || filename;
      iconPath = cleanFilename;
    } else if (url) {
      // If only URL is provided, extract the filename
      const parts = url.split('/');
      iconPath = parts[parts.length - 1];
    }
    setForm(prev => ({ ...prev, icon_path: iconPath }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { 
      toast.error('Tree name is required'); 
      return; 
    }
    setLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const payload = {
        id: form.id || undefined,
        name: form.name,
        icon_path: form.icon_path || '',
        slots: form.slots || [[], [], [], []],
      };
      
      console.log('Submitting tree payload:', payload); // Debug log
      
      const res = await fetch('/api/trees', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const result = await res.json();
      console.log('API response:', result); // Debug log
      
      if (!res.ok) throw new Error(result.error || 'Failed to save tree');
      
      toast.success(isEditing ? 'Tree updated!' : 'Tree created!');
      onSaved?.(result);
      reset();
    } catch (err: any) {
      console.error('Error saving tree:', err); // Debug log
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
            {/* Tree ID - Editable */}
            <div className="space-y-1.5">
              <label className={labelCls}>
                Tree ID 
                {!isEditing && <span className="text-orange-500 ml-1">(Optional)</span>}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  value={form.id ?? ''}
                  onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                  className={`${inputCls} pl-9 text-xs font-mono`}
                  placeholder={isEditing ? "Change tree ID (e.g., tree_precision)" : "Leave empty for auto-generated ID"}
                />
              </div>
            </div>

            {/* Tree Name */}
            <div className="space-y-1.5">
              <label className={labelCls}>Tree Name <span className="text-orange-500">*</span></label>
              <input
                value={form.name ?? ''}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={inputCls}
                placeholder="e.g. Precision"
                required
              />
            </div>

            {/* Tree Icon */}
            <div className="space-y-2">
              <label className={labelCls}>Tree Icon</label>
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 space-y-1.5">
                  {form.icon_path ? (
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center">
                      <img 
                        src={getTreeIconUrl(form.icon_path)} 
                        alt="icon" 
                        className="w-12 h-12 object-contain" 
                        onError={(e) => { 
                          console.error('Failed to load icon:', form.icon_path);
                          (e.target as HTMLImageElement).style.display = 'none'; 
                        }} 
                      />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-zinc-600" />
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
                placeholder="…or paste an icon filename (e.g., precision.png)"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isEditing ? 'Update Tree' : 'Create Tree'}</>
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
        folder="lol-rune-trees" 
      />
    </>
  );
}