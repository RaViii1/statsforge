'use client';

import { ArrowLeft, Sparkles, Upload, FileText, X, AlertCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import AugmentsList from "./AugmentsList";
import AugmentsForm from "./AugmentsForm";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ImportAugment {
  id: number;
  name: string;
  description: string;
  icon_path: string;
  gamemode: string;
  apiname: string;
  rarity?: number;
}

interface ImportPreview {
  augments: ImportAugment[];
}

const GAMEMODES = [
  { id: 'arena', label: 'Arena' },
  { id: 'tft', label: 'TFT' },
  { id: 'aram', label: 'ARAM' },
];

export default function AdminAugmentsPage() {
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [selectedGamemode, setSelectedGamemode] = useState<string>('arena');
  const [showGamemodeDropdown, setShowGamemodeDropdown] = useState(false);

  const stripTags = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getIconFilename = (iconPath?: string) => {
    if (!iconPath) return '';
    const parts = iconPath.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : iconPath;
  };

  const processAugmentsData = (augmentsData: any[]): ImportAugment[] => {
    return augmentsData
      .map((a: any) => ({
        id: a.id && a.id > 0 ? a.id : null,
        name: a.name || a.displayName || 'Unnamed Augment',
        description: stripTags(a.desc || a.description || ''),
        icon_path: getIconFilename(a.iconSmall || a.icon_path || ''),
        gamemode: selectedGamemode,
        apiname: a.apiName || a.name || '',
        rarity: a.rarity,
      }))
      .filter((a: ImportAugment) => a.icon_path);
  };

  const handleImportJSON = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);

        let augmentsData: any[] = [];
        if (raw.augments && typeof raw.augments === 'object') {
          augmentsData = Object.values(raw.augments).filter((v: any) => typeof v === 'object');
        }

        if (augmentsData.length === 0) {
          throw new Error('No augments found in JSON');
        }

        const previewAugments = processAugmentsData(augmentsData);

        if (previewAugments.length === 0 && augmentsData.length > 0) {
          toast.error('No valid augments found (all entries have missing icon paths)');
          return;
        }

        setImportPreview({ augments: previewAugments });
        toast.success(`Found ${previewAugments.length} augments to import`);
      } catch (err: any) {
        toast.error('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  }, [selectedGamemode]);

  const handleConfirmImport = async () => {
    if (!importPreview) return;
    setImporting(true);

    try {
      const augmentsToImport = importPreview.augments.map(a => {
        // Map rarity to tier: 0=silver, 1=gold, 2=prismatic, 4=special
        let tier = 1; // default to gold
        if (a.rarity === 0) tier = 0; // silver
        else if (a.rarity === 2) tier = 2; // prismatic
        else if (a.rarity === 4) tier = 4; // special

        return {
          id: a.id && a.id > 0 ? a.id : null,
          name: a.name,
          description: a.description,
          tier,
          icon_path: a.icon_path,
          gamemode: [a.gamemode],
          apiname: a.apiname,
        };
      });

      const res = await fetch('/api/admin/augments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(augmentsToImport),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Imported ${result.count} augments`);
      } else {
        const failed = result.results?.filter((r: any) => !r.success).length ?? result.count;
        const ok = (result.results?.filter((r: any) => r.success).length ?? result.count) - failed;
        if (ok > 0) {
          toast.warning(`Imported ${ok} of ${augmentsToImport.length} augments. ${failed} failed.`);
        } else {
          toast.error(`Import failed: ${result.message || 'Unknown error'}`);
        }
      }
      setImportPreview(null);
      window.dispatchEvent(new Event('augments-updated'));
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
  };

  const handleImportFromURL = useCallback(async () => {
    const url = `https://raw.communitydragon.org/latest/cdragon/arena/en_us.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch from CommunityDragon');
      const raw = await res.json();

      let augmentsData: any[] = [];
      if (raw.augments && typeof raw.augments === 'object') {
        augmentsData = Object.values(raw.augments).filter((v: any) => typeof v === 'object');
      }

      if (augmentsData.length === 0) {
        throw new Error('No augments found in JSON');
      }

      const previewAugments = processAugmentsData(augmentsData);

      if (previewAugments.length === 0 && augmentsData.length > 0) {
        toast.error('No valid augments found (all entries have missing icon paths)');
        return;
      }

      setImportPreview({ augments: previewAugments });
      toast.success(`Found ${previewAugments.length} augments to import`);
    } catch (err: any) {
      toast.error('Import failed: ' + err.message);
    }
  }, [selectedGamemode]);

  const getGamemodeLabel = (id: string) => {
    return GAMEMODES.find(g => g.id === id)?.label || id;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
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
            Augments
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Augment Management
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Add and edit augments for TFT, Arena, and ARAM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGamemodeDropdown(!showGamemodeDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/40 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-800/60 transition-colors"
              >
                {getGamemodeLabel(selectedGamemode)}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showGamemodeDropdown && (
                <div className="absolute top-full mt-2 right-0 bg-[#111112] border border-white/5 rounded-xl shadow-xl min-w-[140px] z-20">
                  {GAMEMODES.map(gm => (
                    <button
                      key={gm.id}
                      onClick={() => {
                        setSelectedGamemode(gm.id);
                        setShowGamemodeDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors"
                    >
                      {gm.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-zinc-800/40 text-zinc-200 rounded-xl font-semibold transition-all cursor-pointer hover:bg-zinc-800/60">
              <Upload className="w-4 h-4" /> Import JSON
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleImportFromURL}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/20 text-zinc-400 rounded-xl font-semibold transition-all hover:bg-zinc-800/40"
            >
              From URL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="xl:sticky top-20">
            <AugmentsForm />
          </div>
          <div>
            <AugmentsList />
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
              <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold mb-1">This will add augments to your database</p>
                  <p className="text-yellow-300/70 text-xs">{importPreview.augments.length} augments will be imported for {getGamemodeLabel(selectedGamemode)} mode.</p>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {importPreview.augments.slice(0, 20).map((augment, idx) => (
                  <div key={idx} className="bg-zinc-900/20 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/augments/${augment.icon_path}`}
                          alt={augment.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/noitem.png';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{augment.name}</p>
                        <p className="text-xs text-zinc-500">ID: {augment.id} · {augment.apiname}</p>
                        {augment.description && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{augment.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {importPreview.augments.length > 20 && (
                  <p className="text-xs text-zinc-500 text-center">...and {importPreview.augments.length - 20} more augments</p>
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