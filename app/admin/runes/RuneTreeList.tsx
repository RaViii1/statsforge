'use client';

import { Rune, RuneTree, getTreeIconUrl } from "@/lib/lol/runes";

interface RuneTreeListProps {
  trees: RuneTree[];
  runes:  Rune[];
  selectedTreeId: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectTree: (treeId: string) => void;
  onCreateTree: () => void;
  previewMode: boolean;
}

export default function RuneTreeList({
  trees,
  runes,
  selectedTreeId,
  searchTerm,
  onSearchChange,
  onSelectTree,
  onCreateTree,
  previewMode
}: RuneTreeListProps) {
  const safeTrees = Array.isArray(trees) ? trees : [];
  const safeRunes = Array.isArray(runes) ? runes : [];

  const filteredTrees = safeTrees.filter(tree =>
    tree.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Search = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  return (
    <div className="bg-zinc-800/20 rounded-3xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Rune Trees</h2>
          {/* {!previewMode && (
            <button
              onClick={onCreateTree}
              className="p-2 bg-zinc-800/40 hover:bg-zinc-800/60 hover:text-orange-400 text-zinc-300 rounded-xl transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )} */}
        </div>

        <div className="relative mb-4">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trees…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-800/30 hover:bg-zinc-800/40 focus:bg-zinc-800/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {filteredTrees.length > 0 ? (
            filteredTrees.map(tree => {
              const treeRunes = safeRunes.filter(r => r.tree_id === tree.id);
              return (
                <button
                  key={tree.id}
                  onClick={() => onSelectTree(tree.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedTreeId === tree.id
                      ? 'bg-orange-500/10 shadow-md'
                      : 'bg-zinc-800/20 hover:bg-zinc-800/30 hover:shadow-md hover:shadow-orange-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-zinc-800/50 flex items-center justify-center">
{tree.icon_path ? (
                         <img src={getTreeIconUrl(tree.icon_path)} alt={tree.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                       ) : (
                        <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate text-sm">{tree.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
                        {treeRunes.length} runes
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/30 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-zinc-400">No trees found</p>
              {searchTerm && <p className="text-xs text-zinc-600 mt-1">Try a different search</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
