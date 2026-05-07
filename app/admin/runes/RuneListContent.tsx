'use client';

import { useState } from 'react';
import { Hexagon, GripVertical, Edit2, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Rune, RuneTree, getRuneIconUrl } from '@/lib/lol/runes';

interface RuneListContentProps {
  runes: Rune[];
  trees: RuneTree[];
  onEdit: (rune: Rune) => void;
  onDelete: (id: string) => void;
}

export function RuneListContent({ runes, trees, onEdit, onDelete }: RuneListContentProps) {
  const [search, setSearch] = useState('');
  const [treeFilter, setTreeFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const treeMap = Object.fromEntries(trees.map((t: RuneTree) => [t.id, t]));

  const filtered = runes.filter((r: Rune) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchTree = treeFilter === 'all' || r.tree_id === treeFilter;
    return matchSearch && matchTree;
  });

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/runes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete(id);
      setConfirmDelete(null);
    } catch {
      toast.error('Error deleting rune');
    } finally {
      setDeleting(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, rune: Rune) => {
    e.dataTransfer.setData('application/rune-id', rune.id);
    e.dataTransfer.setData('application/rune-slot', String(0));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <SearchIcon className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search runes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-white/6 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-colors"
          />
        </div>
        <select
          value={treeFilter}
          onChange={e => setTreeFilter(e.target.value)}
          className="w-full bg-zinc-950 border border-white/6 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-white/10"
        >
          <option value="all">All Trees</option>
          {trees.map((t: RuneTree) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <p className="text-[10px] text-zinc-600 flex items-center gap-1.5">
        <GripVertical className="w-3 h-3" />
        Drag to assign to tree
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((rune: Rune) => {
            const tree = rune.tree_id ? treeMap[rune.tree_id] : undefined;
            return (
              <div
                key={rune.id}
                draggable
                onDragStart={e => handleDragStart(e, rune)}
                className="group relative bg-zinc-950 border border-white/6 p-4 rounded-xl hover:border-white/10 transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="w-3.5 h-3.5 text-zinc-700 shrink-0 mt-1 group-hover:text-zinc-500" />
                  <div className="shrink-0 w-10 h-10 rounded bg-zinc-900 border border-white/6 flex items-center justify-center overflow-hidden">
                    {rune.icon_path
                      ? <img src={getRuneIconUrl(rune.icon_path)} alt={rune.name} className="w-8 h-8 object-contain" />
                      : <Hexagon className="w-5 h-5 text-zinc-500" />}
                  </div>
                  <div className="flex-1 min-w-0 pr-14">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white truncate">{rune.name}</span>
                      {rune.is_keystone && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20">
                          Keystones
                        </span>
                      )}
                    </div>
                    {tree && (
                      <p className="text-[10px] text-zinc-500 mt-0.5">{tree.name}</p>
                    )}
                    {rune.description && (
                      <p className="text-[10px] text-zinc-600 mt-1 line-clamp-2">{rune.description}</p>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(rune)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <Edit2 className="w-3 h-3 text-zinc-500" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(rune.id)}
                      className="p-1 hover:bg-red-500/20 rounded"
                    >
                      <X className="w-3 h-3 text-zinc-500" />
                    </button>
                  </div>
                </div>
                {confirmDelete === rune.id && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 z-10">
                    <span className="text-xs text-white font-bold pr-2">Delete?</span>
                    <button
                      onClick={() => handleDelete(rune.id)}
                      disabled={deleting === rune.id}
                      className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting === rune.id ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 bg-zinc-700 text-white text-[10px] font-bold rounded hover:bg-zinc-600"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-600 text-sm">
          <Hexagon className="w-6 h-6 mx-auto mb-2 text-zinc-700" />
          No runes found
        </div>
      )}
    </div>
  );
}
