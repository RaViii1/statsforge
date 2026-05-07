'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Zap, Plus, Upload, Edit2, Trash2, Copy, Layers, GripVertical, Hexagon, X, ArrowLeft, Star, FileText, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import RuneTreeList from './RuneTreeList';
import RuneTreeForm from './RuneTreeForm';
import RuneTreeEditor from './RuneTreeEditor';
import RuneForm from './RuneForm';
import { RuneTree, Rune, getRuneIconUrl, getTreeIconUrl } from '@/lib/lol/runes';

export default function RunesPage() {
  const [trees, setTrees] = useState<RuneTree[]>([]);
  const [runes, setRunes] = useState<Rune[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTreeForm, setShowTreeForm] = useState(false);
  const [editingTree, setEditingTree] = useState<RuneTree | null>(null);
  const [showRuneForm, setShowRuneForm] = useState(false);
  const [editingRune, setEditingRune] = useState<Rune | null>(null);
  const [importPreview, setImportPreview] = useState<{ trees: Array<{ id: string; name: string; icon_path: string; icon_filename: string; runeCount: number; slots: string[][] }>; runeLookup: Record<string, { id: string; name: string; description: string; icon_path: string }> } | null>(null);
  const [importing, setImporting] = useState(false);

  const selectedTree = selectedTreeId ? trees.find(t => t.id === selectedTreeId) ?? null : null;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [treesRes, runesRes] = await Promise.all([fetch('/api/trees'), fetch('/api/runes')]);
      if (!treesRes.ok || !runesRes.ok) throw new Error('Failed to fetch data');
      const treesData = await treesRes.json();
      const runesData = await runesRes.json();
      setTrees(Array.isArray(treesData) ? treesData : []);
      setRunes(Array.isArray(runesData) ? runesData : []);
    } catch (error: any) {
      toast.error(error.message);
      setTrees([]);
      setRunes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteTree = async (treeId: string) => {
    if (!confirm('Delete this tree and all its runes?')) return;
    try {
      const res = await fetch(`/api/trees?id=${treeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete tree');
      toast.success('Tree deleted');
      await loadData();
      const remaining = trees.filter(t => t.id !== treeId);
      if (remaining.length > 0) setSelectedTreeId(remaining[0].id);
      else setSelectedTreeId(null);
    } catch (error: any) { toast.error(error.message); }
  };

  const handleDuplicateTree = async () => {
    if (!selectedTree) return;
    try {
      const newId = `tree_${selectedTree.name.toLowerCase().replace(/\s+/g, '_')}_copy_${Date.now()}`;
      const payload = { id: newId, name: `${selectedTree.name} (Copy)`, icon_path: selectedTree.icon_path, slots: selectedTree.slots.map(s => [...s]) };
      const res = await fetch('/api/trees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to duplicate tree');
      toast.success('Tree duplicated!');
      await loadData();
      setSelectedTreeId(newId);
    } catch (error: any) { toast.error(error.message); }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    setImporting(true);
    try {
      // Delete all existing data
      const deleteRunesPromises = runes.map(r => 
        fetch(`/api/runes?id=${r.id}`, { method: 'DELETE' }).catch(e => console.error(`Failed to delete rune ${r.id}:`, e))
      );
      const deleteTreesPromises = trees.map(t => 
        fetch(`/api/trees?id=${t.id}`, { method: 'DELETE' }).catch(e => console.error(`Failed to delete tree ${t.id}:`, e))
      );
      
      await Promise.all([...deleteRunesPromises, ...deleteTreesPromises]);

      // Create all trees first (with their IDs preserved)
      for (const pt of importPreview.trees) {
        const treeRes = await fetch('/api/trees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: pt.id,
            name: pt.name,
            icon_path: pt.icon_filename,
            slots: pt.slots,
          }),
        });
        
        if (!treeRes.ok) {
          const error = await treeRes.json();
          throw new Error(`Failed to create tree ${pt.name}: ${error.error}`);
        }
      }

      // Create all runes with their relationships
      for (const pt of importPreview.trees) {
        for (let rowIdx = 0; rowIdx < pt.slots.length; rowIdx++) {
          const row = pt.slots[rowIdx];
          for (let colIdx = 0; colIdx < row.length; colIdx++) {
            const runeId = row[colIdx];
            if (runeId && importPreview.runeLookup[runeId]) {
              const rune = importPreview.runeLookup[runeId];
              
              const runeRes = await fetch('/api/runes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: rune.id,
                  name: rune.name,
                  description: rune.description,
                  icon_path: rune.icon_path,
                  tree_id: pt.id,
                  slot_row: rowIdx,
                  slot_col: colIdx,
                  is_keystone: rowIdx === 0,
                }),
              });
              
              if (!runeRes.ok) {
                const error = await runeRes.json();
                console.error(`Failed to create rune ${rune.name}:`, error);
                throw new Error(`Failed to create rune ${rune.name}: ${error.error}`);
              }
            }
          }
        }
      }

      toast.success(`Successfully imported ${importPreview.trees.length} trees`);
      setImportPreview(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message);
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
  };

  const handleDeleteRune = async (runeId: string) => {
    if (!confirm('Delete this rune?')) return;
    try {
      const res = await fetch(`/api/runes?id=${runeId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete rune');
      toast.success('Rune deleted');
      await loadData();
    } catch (error: any) { toast.error(error.message); }
  };

  const handleSlotsChange = async (newSlots: string[][]) => {
    if (!selectedTree) return;
    try {
      const res = await fetch('/api/trees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedTree.id, name: selectedTree.name, icon_path: selectedTree.icon_path, slots: newSlots }),
      });
      if (!res.ok) throw new Error('Failed to update slots');

      const oldFlat = selectedTree.slots.flat();
      const newFlat = newSlots.flat();
      const oldIds = new Set(oldFlat.filter((id): id is string => Boolean(id)));
      const newIds = new Set(newFlat.filter((id): id is string => Boolean(id)));
      const addedIds = newFlat.filter((id): id is string => Boolean(id) && !oldIds.has(id));
      const removedIds = oldFlat.filter((id): id is string => Boolean(id) && !newIds.has(id));

      const promises: Promise<unknown>[] = [];

      for (const runeId of addedIds) {
        const otherTrees = trees.filter(t => t.id !== selectedTree.id && t.slots.some(s => s.includes(runeId)));
        for (const t of otherTrees) {
          const cleaned = t.slots.map(s => s.filter(rid => rid !== runeId));
          promises.push(fetch('/api/trees', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: t.id, name: t.name, icon_path: t.icon_path, slots: cleaned }),
          }).catch(() => {}));
        }
      }

      for (let r = 0; r < newSlots.length; r++) {
        const slot = newSlots[r];
        if (!Array.isArray(slot)) continue;
        for (let c = 0; c < slot.length; c++) {
          const runeId = slot[c];
          if (!runeId) continue;
          promises.push(fetch('/api/runes', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: runeId, slot_row: r, slot_col: c, is_keystone: r === 0, tree_id: selectedTree.id }),
          }).catch(() => {}));
        }
      }

      for (const runeId of removedIds) {
        promises.push(fetch('/api/runes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: runeId, tree_id: null, slot_row: null, slot_col: null, is_keystone: false }),
        }).catch(() => {}));
      }

      await Promise.allSettled(promises);
      await loadData();
    } catch (error: any) { toast.error(error.message); }
  };

  const openTreeForm = (tree?: RuneTree) => {
    if (tree) { setEditingTree(tree); window.dispatchEvent(new CustomEvent('edit-rune-tree', { detail: tree })); }
    else { setEditingTree(null); }
    setShowTreeForm(true);
  };

  const openRuneForm = (rune?: Rune) => {
    if (rune) { setEditingRune(rune); window.dispatchEvent(new CustomEvent('edit-rune', { detail: rune })); }
    else { setEditingRune(null); }
    setShowRuneForm(true);
  };

  const handleImportJSON = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        
        // Support both array format (runesReforged.json) and object with trees array
        const treesData = Array.isArray(raw) ? raw : (raw.trees || []);
        
        if (!Array.isArray(treesData) || treesData.length === 0) {
          throw new Error('Invalid format: expected array of trees or { trees: [...] }');
        }

        const stripPath = (path?: string) => {
          if (!path) return '';
          const parts = path.split('/');
          return parts[parts.length - 1].toLowerCase();
        };

        const stripTags = (text?: string) => {
          if (!text) return '';
          return text.replace(/<[^>]*>/g, '').trim();
        };

        const runeLookup: Record<string, { id: string; name: string; description: string; icon_path: string }> = {};

        const previewTrees = treesData.map((tree: any) => {
          const normalizedSlots: string[][] = [];
          let totalRunes = 0;

          if (Array.isArray(tree.slots)) {
            tree.slots.forEach((slot: any, rowIdx: number) => {
              const expectedCols = rowIdx === 0 ? 4 : 3;
              
              // Handle slot.runes array format (runesReforged.json)
              const runesArray = slot.runes || slot;
              
              if (Array.isArray(runesArray)) {
                const normalizedRow: string[] = [];
                runesArray.forEach((rune: any) => {
                  if (rune?.id) {
                    const runeId = String(rune.id);
                    normalizedRow.push(runeId);
                    totalRunes++;
                    if (!runeLookup[runeId]) {
                      runeLookup[runeId] = {
                        id: runeId,
                        name: rune.name || 'Unnamed Rune',
                        description: stripTags(rune.shortDesc || rune.description || ''),
                        icon_path: stripPath(rune.icon || rune.icon_path || ''),
                      };
                    }
                  } else {
                    normalizedRow.push('');
                  }
                });
                while (normalizedRow.length < expectedCols) normalizedRow.push('');
                normalizedSlots.push(normalizedRow.slice(0, expectedCols));
              } else {
                normalizedSlots.push(Array(expectedCols).fill(''));
              }
            });
          }

          while (normalizedSlots.length < 4) {
            const rowIdx = normalizedSlots.length;
            const expectedCols = rowIdx === 0 ? 4 : 3;
            normalizedSlots.push(Array(expectedCols).fill(''));
          }

          return {
            id: String(tree.id),
            name: tree.name || 'Unnamed Tree',
            icon_path: tree.icon || tree.icon_path || '',
            icon_filename: stripPath(tree.icon || tree.icon_path || ''),
            runeCount: totalRunes,
            slots: normalizedSlots,
          };
        });

        setImportPreview({ trees: previewTrees, runeLookup });
      } catch (err: any) {
        toast.error('Invalid JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  }, []);

  if (isLoading && trees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 text-sm">Loading rune trees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24" data-component="rune-trees-manager">
      {/* Breadcrumbs */}
      <div className="border-b border-white/6 bg-[#0d0d0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-400 transition-colors text-[11px] font-semibold tracking-[0.12em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Admin Panel
          </Link>
          <span className="text-white/10 text-lg font-thin">/</span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-400">
            Rune Trees
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Rune Trees Manager
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Create and manage League of Legends rune trees and runes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <label className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800/40 text-zinc-200 rounded-xl font-semibold transition-all cursor-pointer disabled:opacity-50 hover:bg-zinc-800/60">
               <Upload className="w-4 h-4" /> Import
               <input type="file" accept=".json" onChange={handleImportJSON} disabled={isLoading} className="hidden" />
             </label>
             <button onClick={() => openTreeForm()} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg">
               <Plus className="w-4 h-4" /> New Tree
             </button>
           </div>
         </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <div className="xl:sticky top-20">
            <RuneTreeList trees={trees} runes={runes} selectedTreeId={selectedTreeId} searchTerm={searchTerm} onSearchChange={setSearchTerm} onSelectTree={setSelectedTreeId} onCreateTree={openTreeForm} previewMode={false} />
          </div>

          {/* Main content */}
          <div className="space-y-8">
            {/* All Runes Section */}
            <section className="bg-zinc-800/20 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">All Runes</h2>
                </div>
                <button onClick={() => openRuneForm()} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg">
                  <Plus className="w-4 h-4" /> Add Rune
                </button>
              </div>
              <RuneListContent runes={runes} trees={trees} onEdit={openRuneForm} onDelete={handleDeleteRune} />
            </section>

            {/* Tree Editor */}
            {selectedTree ? (
              <section className="bg-zinc-800/20 rounded-3xl p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {selectedTree.icon_path ? (
                      <img src={getTreeIconUrl(selectedTree.icon_path)} alt={selectedTree.name} className="w-10 h-10 rounded-2xl" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                        <Layers className="w-7 h-7 text-zinc-500" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedTree.name}</h2>
                      <p className="text-zinc-500 text-sm mt-1">{runes.filter(r => r.tree_id === selectedTree.id).length} <span className='text-orange-500/40'>•</span> runes in tree</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openTreeForm(selectedTree)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 hover:bg-zinc-800/60 text-zinc-200 rounded-xl transition-all">
                      <Edit2 className="w-4 h-4" /> Edit Tree
                    </button>
                    <button onClick={handleDuplicateTree} className="p-2 bg-zinc-800/40 hover:bg-zinc-800/60 text-zinc-300 rounded-xl transition-all" title="Duplicate Tree">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTree(selectedTree.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <RuneTreeEditor tree={selectedTree} runes={runes} onSlotsChange={handleSlotsChange} />
              </section>
          ) : (
            <section className="bg-zinc-800/20 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-7 h-7 text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-300 mb-2">Select a Tree to Edit</h3>
                <p className="text-zinc-500 text-sm">Choose a rune tree from the sidebar to arrange its runes</p>
              </section>
            )}
          </div>
        </div>
      </div>

       {/* Modals */}
       <RuneTreeFormModal show={showTreeForm} onClose={() => { setShowTreeForm(false); setEditingTree(null); }} onSaved={(tree: RuneTree) => { setShowTreeForm(false); setEditingTree(null); loadData(); setSelectedTreeId(tree.id); }} editingTree={editingTree} />
       <RuneFormModal show={showRuneForm} onClose={() => { setShowRuneForm(false); setEditingRune(null); }} onSaved={() => { setShowRuneForm(false); setEditingRune(null); loadData(); }} trees={trees} editingRune={editingRune} />
       
       {/* Import Preview Modal */}
    {importPreview && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <span className="text-sm font-semibold text-white">Import Preview</span>
            </div>
            <button onClick={handleCancelImport} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Warning Banner */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-1">This will replace all existing trees and runes</p>
                <p className="text-yellow-300/70 text-xs">{importPreview.trees.length} trees and {importPreview.trees.reduce((sum, t) => sum + t.runeCount, 0)} runes will be imported.</p>
              </div>
            </div>

            {/* Trees Grid */}
            <div className="space-y-4">
              {importPreview.trees.map((tree, idx) => (
                <div key={idx} className="bg-zinc-900/20 rounded-xl border border-white/5 overflow-hidden">
                  {/* Tree Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-zinc-900/30">
                    {tree.icon_filename ? (
                      <img
                        src={getTreeIconUrl(tree.icon_filename)}
                        alt={tree.name}
                        className="w-8 h-8 rounded-lg object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/nochampionimage.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-zinc-500" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{tree.name}</h4>
                      <p className="text-[10px] text-zinc-500">{tree.runeCount} runes</p>
                    </div>
                  </div>
                  
                  {/* Slots Grid */}
                  <div className="p-4 space-y-4">
                    {tree.slots.map((row, rowIdx) => {
                      const isPrimary = rowIdx === 0;
                      const rowLabel = isPrimary ? 'Keystones' : `Row ${rowIdx}`;
                      const displayCols = isPrimary ? 4 : 3;
                      const displayRow = row.slice(0, displayCols);
                      
                      return (
                        <div key={rowIdx} className="space-y-2">
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                            {rowLabel}
                          </p>
                          <div className={`grid ${isPrimary ? 'grid-cols-4' : 'grid-cols-3'} gap-3`}>
                            {displayRow.map((runeId, colIdx) => {
                              const rune = runeId ? importPreview.runeLookup[runeId] : null;
                              const hasRune = !!rune;
                              
                              return (
                                <div
                                  key={colIdx}
                                  className={`
                                    flex items-center gap-2 p-2 rounded-lg transition-all
                                    ${hasRune 
                                      ? 'bg-zinc-800/40 border border-white/5' 
                                      : 'bg-zinc-800/20 border border-dashed border-white/5'
                                    }
                                  `}
                                >
                                  {hasRune ? (
                                    <>
                                      {/* Rune Icon */}
                                      <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-800/60 flex items-center justify-center overflow-hidden">
                                        {rune.icon_path ? (
                                          <img
                                            src={getRuneIconUrl(rune.icon_path)}
                                            alt={rune.name}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = "/images/nochampionimage.jpg";
                                            }}
                                          />
                                        ) : (
                                          <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center">
                                            <span className="text-red-400 text-[10px] font-bold">X</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Rune Info */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-white truncate">{rune.name}</p>
                                        {rune.description && (
                                          <p className="text-[9px] text-zinc-400 truncate">{rune.description}</p>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="w-full flex items-center justify-center gap-2 py-1">
                                      <div className="w-5 h-5 rounded bg-zinc-800/50 flex items-center justify-center">
                                        <span className="text-zinc-600 text-[10px]">?</span>
                                      </div>
                                      <span className="text-[9px] text-zinc-500">Empty</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-end gap-3 shrink-0 bg-[#111112]">
            <button
              onClick={handleCancelImport}
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmImport} 
              disabled={importing}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import All</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}
     </div>
   );
 }

function RuneTreeFormModal({ show, onClose, onSaved, editingTree }: { show: boolean; onClose: () => void; onSaved: (tree: RuneTree) => void; editingTree: RuneTree | null; }) {
  useEffect(() => { 
    if (show) {
      if (editingTree) {
        window.dispatchEvent(new CustomEvent('edit-rune-tree', { detail: editingTree }));
      } else {
        window.dispatchEvent(new CustomEvent('edit-rune-tree', { detail: null }));
      }
    }
  }, [show, editingTree]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              {editingTree ? 'Edit Tree' : 'New Tree'}
            </span>
          </div>
           <div className="flex items-center gap-2">
             <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
               <X className="w-4 h-4 text-zinc-400" />
             </button>
           </div>
        </div>
        <RuneTreeForm onSaved={onSaved} />
      </div>
    </div>
  );
}

function RuneFormModal({ show, onClose, onSaved, trees, editingRune }: { show: boolean; onClose: () => void; onSaved: () => void; trees: RuneTree[]; editingRune: Rune | null; }) {
  useEffect(() => { 
    if (show) {
      if (editingRune) {
        window.dispatchEvent(new CustomEvent('edit-rune', { detail: editingRune }));
      } else {
        window.dispatchEvent(new CustomEvent('edit-rune', { detail: null }));
      }
    }
  }, [show, editingRune]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="text-sm font-semibold text-white">
              {editingRune ? 'Edit Rune' : 'New Rune'}
            </span>
          </div>
           <div className="flex items-center gap-2">
             <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
               <X className="w-4 h-4 text-zinc-400" />
             </button>
           </div>
        </div>
        <RuneForm onSaved={onSaved} trees={trees} />
      </div>
    </div>
  );
}

function RuneListContent({ runes, trees, onEdit, onDelete }: { runes: Rune[]; trees: RuneTree[]; onEdit: (r: Rune) => void; onDelete: (id: string) => void; }) {
  const [search, setSearch] = useState('');
  const [treeFilter, setTreeFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const treeMap = Object.fromEntries(trees.map(t => [t.id, t]));

  const filtered = runes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchTree = treeFilter === 'all' || r.tree_id === treeFilter;
    return matchSearch && matchTree;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRunes = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/runes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete(id);
      setConfirmDelete(null);
      if (paginatedRunes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch { 
      toast.error('Error deleting rune'); 
    } finally { 
      setDeleting(null); 
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, rune: Rune) => {
    e.dataTransfer.setData('application/rune-id', rune.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, treeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search runes…" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full bg-zinc-900/90 border border-zinc-800 hover:border-orange-500/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all" 
          />
        </div>
        <select 
          value={treeFilter} 
          onChange={e => setTreeFilter(e.target.value)} 
          className="w-80 bg-zinc-900/90 border border-zinc-800 hover:border-orange-500/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23f97316%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[position:right_1rem_center] bg-no-repeat"
        >
          <option value="all" className="bg-zinc-900 text-white">All Trees</option>
          {trees.map(t => (
            <option key={t.id} value={t.id} className="bg-zinc-900 text-white hover:bg-orange-500/20">
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5">
        <GripVertical className="w-3 h-3" />
        Drag runes into the tree editor to assign them
      </p>

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedRunes.map((rune: Rune) => {
              const tree = treeMap[rune.tree_id || ''];
              return (
                <div key={rune.id} draggable onDragStart={e => handleDragStart(e, rune)} className="group relative bg-zinc-800/20 hover:bg-zinc-800/30 p-4 rounded-2xl transition-all cursor-grab active:cursor-grabbing active:scale-[0.99]">
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-zinc-600 shrink-0 mt-1 group-hover:text-orange-500 transition-colors" />
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-zinc-800/50 flex items-center justify-center overflow-hidden">
                       {rune.icon_path ? <img src={getRuneIconUrl(rune.icon_path)} alt={rune.name} className="w-9 h-9 object-contain" /> : <Hexagon className="w-5 h-5 text-zinc-600" />}
                    </div>
                    <div className="flex-1 min-w-0 pr-14">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white truncate">{rune.name}</span>
                        {rune.is_keystone === true && <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/15 text-orange-400 rounded-full font-semibold">Keystone</span>}
                      </div>
                      {tree && <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                         {tree.icon_path && <img src={getTreeIconUrl(tree.icon_path)} alt="" className="w-3.5 h-3.5 object-contain" />}
                        {tree.name} Tree
                      </p>}
                      {rune.description && <p className="text-[10px] text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">{rune.description}</p>}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(rune)} className="p-1.5 hover:bg-white/5 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-zinc-500" /></button>
                      <button onClick={() => setConfirmDelete(rune.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-zinc-500" /></button>
                    </div>
                  </div>
                  {confirmDelete === rune.id && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 z-10">
                      <span className="text-xs text-white font-bold">Delete?</span>
                      <button onClick={() => handleDelete(rune.id)} disabled={deleting === rune.id} className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">{deleting === rune.id ? '...' : 'Yes'}</button>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 py-1 bg-zinc-700 text-white text-[10px] font-bold rounded-lg hover:bg-zinc-600">No</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
              <div className="text-xs text-zinc-500">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} runes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-300" />
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'bg-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/30 flex items-center justify-center mb-4">
            <Hexagon className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-semibold text-zinc-400">No runes found</p>
          {search && <p className="text-xs text-zinc-600 mt-1">Try a different search</p>}
        </div>
      )}
    </div>
  );
}