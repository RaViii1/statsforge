    'use client';

import { ArrowLeft, Zap, Upload, FileText, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import SummonerSpellsForm from "./SummonerSpellsForm";
import SummonerSpellsList from "./SummonerSpellsList";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getSummonerSpellIconUrl, SummonerSpell } from "@/lib/summoner-spell";


interface ImportSpell {
  id: number;
  name: string;
  description: string;
  cooldown: number;
  iconPath: string;
}

interface ImportPreview {
  spells: ImportSpell[];
}

export default function SummonerSpellsPage() {
  const [spells, setSpells] = useState<SummonerSpell[]>([]);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSpells = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/summoner-spells');
      if (res.ok) {
        const data = await res.json();
        setSpells(data);
      }
    } catch (error) {
      console.error('Failed to load spells:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSpells();
  }, [loadSpells]);

  const handleImportJSON = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        let spellsData: any[] = [];
        if (Array.isArray(raw)) {
          spellsData = raw;
        } else if (raw.data && Array.isArray(raw.data)) {
          spellsData = raw.data;
        } else if (raw.data && typeof raw.data === 'object') {
          spellsData = Object.values(raw.data).filter(Boolean);
        } else {
          spellsData = Object.values(raw).filter(v => typeof v === 'object') as any[];
        }

        if (!Array.isArray(spellsData) || spellsData.length === 0) {
          throw new Error('Invalid format: expected array of summoner spells');
        }

        const stripTags = (text?: string) => {
          if (!text) return '';
          return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        };

        const previewSpells: ImportSpell[] = spellsData.map((spell: any) => {
          let iconPath = spell.iconPath || spell.icon_path || '';
          // Always take only the last path segment as the filename
          iconPath = iconPath.split('/').pop() || iconPath;

          return {
            id: spell.id && spell.id > 0 ? spell.id : null,
            name: spell.name || 'Unnamed Spell',
            description: stripTags(spell.description || ''),
            cooldown: spell.cooldown ?? 0,
            iconPath,
          };
        }).filter(s => s.iconPath);

        if (previewSpells.length === 0 && spellsData.length > 0) {
          toast.error('No valid spells found in JSON (all entries have missing icon paths)');
          return;
        }

        setImportPreview({ spells: previewSpells });
      } catch (err: any) {
        toast.error('Invalid JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  }, []);

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    setImporting(true);

    try {
      const spellsToImport = importPreview.spells
        .filter(spell => spell.name && spell.iconPath)
        .map(spell => ({
          id: spell.id && spell.id > 0 ? spell.id : null,
          name: spell.name,
          description: spell.description,
          cooldown: spell.cooldown,
          icon_path: spell.iconPath,
        }));

      const res = await fetch('/api/admin/summoner-spells', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spellsToImport),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Imported ${result.count} spells`);
      } else {
        const failed = result.results?.filter((r: any) => !r.success).length ?? result.count;
        const ok = (result.results?.filter((r: any) => r.success).length ?? result.count) - failed;
        if (ok > 0) {
          toast.warning(`Imported ${ok} of ${spellsToImport.length} spells. ${failed} failed.`);
        } else {
          toast.error(`Import failed: ${result.message || 'Unknown error'}`);
        }
      }
      setImportPreview(null);
      loadSpells();
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0f]/80 backdrop-blur-sm sticky top-0 z-10">
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
            Summoner Spells
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Summoner Spells
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                League of Legends — cooldowns, descriptions and icon management
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800/40 text-zinc-200 rounded-xl font-semibold transition-all cursor-pointer hover:bg-zinc-800/60">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="xl:sticky top-20">
            <SummonerSpellsForm />
          </div>
          <div>
            <SummonerSpellsList initialSpells={spells} />
          </div>
        </div>
      </div>

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Warning Banner */}
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold mb-1">This will add spells to your database</p>
                  <p className="text-yellow-300/70 text-xs">{importPreview.spells.length} spells will be imported.</p>
                </div>
              </div>

              {/* Spells Preview */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {importPreview.spells.slice(0, 20).map((spell, idx) => (
                  <div key={idx} className="bg-zinc-900/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      {spell.iconPath ? (
                        <img
                          src={getSummonerSpellIconUrl(spell.iconPath)}
                          alt={spell.name}
                          className="w-10 h-10 rounded-lg object-contain bg-zinc-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/noitem.png';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white">{spell.name}</p>
                        <p className="text-xs text-zinc-500">ID: {spell.id} · {spell.cooldown}s CD</p>
                        {spell.description && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{spell.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {importPreview.spells.length > 20 && (
                  <p className="text-xs text-zinc-500 text-center">...and {importPreview.spells.length - 20} more spells</p>
                )}
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
