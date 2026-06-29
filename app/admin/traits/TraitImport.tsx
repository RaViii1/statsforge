'use client';

import { Upload, ChevronDown, X, FileJson, Database, Filter, Download, CheckCircle, Circle, CheckSquare, Square } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { TFTSet } from "@/lib/tft/champions";

interface CDSet {
  set_number: number;
  traits: any;
}

interface ImportTrait {
  id: string;
  name: string;
  set_id: number;
  description: string;
  icon_path: string;
  is_Hero: boolean;
  riot_api_name: string;
}

interface ImportPreview {
  traits: ImportTrait[];
}

interface TraitImportProps {
  sets: (TFTSet & { id: number })[];
}

const STEPS = [
  { id: 'source', label: 'Load Source', icon: FileJson },
  { id: 'target', label: 'Pick Target', icon: Database },
  { id: 'preview', label: 'Preview', icon: Filter },
  { id: 'import', label: 'Import', icon: Download },
] as const;

type StepId = typeof STEPS[number]['id'];

const CD_URL = "https://raw.communitydragon.org/16.10/cdragon/tft/en_us.json";

export default function TraitImport({ sets }: TraitImportProps) {
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [selectedTargetSetId, setSelectedTargetSetId] = useState<number | null>(null);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [availableSourceSets, setAvailableSourceSets] = useState<CDSet[]>([]);
  const [selectedSourceSet, setSelectedSourceSet] = useState<number | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState<StepId>('source');

const stripTags = (text?: string) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')                    // HTML tags: <tag>
    .replace(/@[^@]+@/g, '')                     // @...@ tags (any content between @)
    .replace(/%i:[^%]+%/g, '')                   // %i:...% tags
    .replace(/\([^)]*\)/g, '')                   // (parenthesis) tags
    .replace(/\{[^}]*\}/g, '')                    // {curly brace} tags
    .replace(/\*+/, '')                           // stray asterisks
    .replace(/\s+/g, ' ')
    .trim();
};

  const getIconFilename = (iconPath?: string) => {
    if (!iconPath) return '';
    let filename = iconPath.split('/').pop() || iconPath;
    filename = filename.replace(/\.tex$/, '.png');
    return filename;
  };

  const processTraitsData = (traitsData: any[], set_id: number, setNum: number): ImportTrait[] => {
    return traitsData
      .map((t: any) => {
        const apiName = t.apiName || '';
        const isHero = /unique/i.test(apiName);
        const traitName = t.name || t.displayName || 'unnamed';
        const traitId = `${setNum}_${traitName.toLowerCase().replace(/\s+/g, '')}`;

        return {
          id: t.id || traitId,
          name: traitName,
          set_id,
          description: stripTags(t.desc || ''),
          icon_path: getIconFilename(t.icon || t.icon_path || ''),
          is_Hero: isHero,
          riot_api_name: apiName
        };
      })
      .filter((t: ImportTrait) => t.icon_path);
  };

  const handleFileSelect = (raw: any) => {
    const setsData = raw.sets;
    if (!setsData) {
      toast.error('No sets found in JSON');
      return;
    }

    const cdSets = Object.entries(setsData).map(([setNum, setData]: any) => ({
      set_number: parseInt(setNum),
      traits: setData?.traits || []
    }));

    setAvailableSourceSets(cdSets);
    setSelectedSourceSet(null);
    setCurrentStep('source');
  };

  const handleImportJSON = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        handleFileSelect(raw);
      } catch (err: any) {
        toast.error('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  }, []);

  const handleImportFromURL = useCallback(async () => {
    try {
      const res = await fetch(CD_URL);
      if (!res.ok) throw new Error('Failed to fetch from CommunityDragon');
      const raw = await res.json();
      handleFileSelect(raw);
    } catch (err: any) {
      toast.error('Import failed: ' + err.message);
    }
  }, []);

  const handlePreviewTraits = useCallback(() => {
    if (!selectedSourceSet || !selectedTargetSetId) return;

    const cdSet = availableSourceSets.find(s => s.set_number === selectedSourceSet);
    if (!cdSet?.traits) return;

    const traitsData = Object.values(cdSet.traits).filter((t: any) => typeof t === 'object');

    if (traitsData.length === 0) {
      toast.error('No traits found in this set');
      return;
    }

    const previewTraits = processTraitsData(traitsData, selectedTargetSetId, selectedSourceSet);

    if (previewTraits.length === 0) {
      toast.error('No valid traits found (all entries have missing icon paths)');
      return;
    }

    setImportPreview({ traits: previewTraits });
    const allSelected = new Set(Array.from({ length: previewTraits.length }, (_, i) => i));
    setSelectedTraits(allSelected);
    setShowSourceDropdown(false);
    setCurrentStep('preview');
  }, [availableSourceSets, selectedSourceSet, selectedTargetSetId]);

  const handleConfirmImport = async () => {
    if (!importPreview || !selectedTargetSetId) return;
    setImporting(true);
    setCurrentStep('import');

    try {
      const traitsToImport = importPreview.traits
        .filter((_, idx) => selectedTraits.has(idx))
        .map(t => ({
          id: t.id,
          name: t.name,
          set_id: selectedTargetSetId,
          description: t.description,
          icon_path: t.icon_path,
          is_Hero: t.is_Hero,
          riot_api_name: t.riot_api_name
        }));

      if (traitsToImport.length === 0) {
        toast.error('No traits selected for import');
        setImporting(false);
        setCurrentStep('preview');
        return;
      }

      const res = await fetch('/api/admin/traits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(traitsToImport),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Imported ${result.count} traits`);
      } else {
        const failed = result.results?.filter((r: any) => !r.success).length ?? traitsToImport.length;
        const ok = (result.results?.filter((r: any) => r.success).length ?? traitsToImport.length) - failed;
        if (ok > 0) {
          toast.warning(`Imported ${ok} of ${traitsToImport.length} traits. ${failed} failed.`);
        } else {
          toast.error(`Import failed: ${result.message || 'Unknown error'}`);
        }
      }
      closeModal();
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
      setCurrentStep('preview');
    } finally {
      setImporting(false);
    }
  };

  const closeModal = () => {
    setImportPreview(null);
    setAvailableSourceSets([]);
    setSelectedSourceSet(null);
    setSelectedTraits(new Set());
    setCurrentStep('source');
    setShowTargetDropdown(false);
    setShowSourceDropdown(false);
  };

  const toggleTraitSelection = (idx: number) => {
    const newSelected = new Set(selectedTraits);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedTraits(newSelected);
  };

  const selectAllTraits = () => {
    if (!importPreview) return;
    const all = new Set(Array.from({ length: importPreview.traits.length }, (_, i) => i));
    setSelectedTraits(all);
  };

  const clearSelection = () => {
    setSelectedTraits(new Set());
  };

  const isModalOpen = availableSourceSets.length > 0 || importPreview !== null;

  const stepIndex = useMemo(() => STEPS.findIndex(s => s.id === currentStep), [currentStep]);

  const selectedTargetSet = sets.find(s => s.id === selectedTargetSetId);

  return (
    <div className="flex items-center gap-3">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl h-[640px] flex flex-col">
            
            <div className="px-6 py-5 border-b border-white/5 shrink-0">
              <div className="flex items-center justify-between">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === stepIndex;
                  const isCompleted = idx < stepIndex;
                  const isPending = idx > stepIndex;

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                          ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : ''}
                          ${isActive ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/40 shadow-lg shadow-orange-500/10' : ''}
                          ${isPending ? 'bg-zinc-800/50 text-zinc-600 ring-1 ring-white/5' : ''}
                        `}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <span className={`
                          text-[11px] font-bold uppercase tracking-wider transition-colors duration-300
                          ${isActive ? 'text-orange-400' : ''}
                          ${isCompleted ? 'text-emerald-400/70' : ''}
                          ${isPending ? 'text-zinc-600' : ''}
                        `}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className="w-12 h-px mx-2 shrink-0">
                          <div className={`
                            h-full rounded-full transition-all duration-500
                            ${isCompleted ? 'bg-emerald-500/40' : 'bg-zinc-800'}
                          `} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!importPreview && (
                <div className="h-full flex flex-col space-y-6">
                  <div className="text-center space-y-2">
                    <FileJson className="w-8 h-8 text-zinc-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">Select Data Source</h3>
                    <p className="text-sm text-zinc-500">
                      {availableSourceSets.length} sets found in loaded data
                    </p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto w-full">
                    <div className="relative">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Source Set
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-zinc-900/60 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-900/80 transition-colors ring-1 ring-white/5"
                      >
                        <span>{selectedSourceSet ? `Set ${selectedSourceSet}` : 'Choose source set...'}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showSourceDropdown && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111112] border border-white/5 rounded-xl shadow-xl z-[100] max-h-48 overflow-y-auto">
                          {availableSourceSets.map(s => (
                            <button
                              key={s.set_number}
                              onClick={() => {
                                setSelectedSourceSet(s.set_number);
                                setShowSourceDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center justify-between"
                            >
                              <span>Set {s.set_number}</span>
                              <span className="text-xs text-zinc-500">{Object.keys(s.traits || {}).length} traits</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Target Set
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTargetDropdown(!showTargetDropdown)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-zinc-900/60 text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-900/80 transition-colors ring-1 ring-white/5"
                      >
                        <span>
                          {selectedTargetSetId 
                            ? selectedTargetSet?.name || `Set ID: ${selectedTargetSetId}`
                            : 'Choose target set...'
                          }
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showTargetDropdown && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111112] border border-white/5 rounded-xl shadow-xl z-[100] max-h-48 overflow-y-auto">
                          {sets.map(s => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setSelectedTargetSetId(s.id);
                                setShowTargetDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors"
                            >
                              {s.name} (Set {s.set_number})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="max-w-md mx-auto w-full">
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                      ${selectedSourceSet && selectedTargetSetId 
                        ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                        : 'bg-zinc-900/40 text-zinc-500 ring-1 ring-white/5'
                      }
                    `}>
                      {selectedSourceSet && selectedTargetSetId ? (
                        <>
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Ready to preview — both sets selected</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 shrink-0" />
                          <span>Select both source and target sets to continue</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {importPreview && !importing && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-lg font-bold text-white">Import Preview</h3>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {selectedTraits.size} of {importPreview.traits.length} selected · Importing to {selectedTargetSet?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={selectAllTraits} 
                        className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Select All
                      </button>
                      <button 
                        onClick={clearSelection} 
                        className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
                    {importPreview.traits.map((trait, idx) => {
                      const isSelected = selectedTraits.has(idx);
                      const isHero = trait.is_Hero;
                      
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleTraitSelection(idx)}
                          className={`
                            group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
                            ${isSelected ? 'bg-white/[0.03]' : ''}
                            ${isHero ? 'ring-1 ring-purple-500/10' : ''}
                          `}
                        >
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ 
                              background: isHero 
                                ? `linear-gradient(90deg, rgba(168,85,247,0.08) 0%, rgba(168,85,247,0.03) 40%, transparent 70%)`
                                : `linear-gradient(90deg, rgba(249,115,22,0.06) 0%, rgba(249,115,22,0.02) 40%, transparent 70%)`
                            }}
                          />
                          
                          {isSelected && (
                            <div 
                              className="absolute inset-0 pointer-events-none"
                              style={{ 
                                background: isHero
                                  ? `linear-gradient(90deg, rgba(168,85,247,0.05) 0%, transparent 60%)`
                                  : `linear-gradient(90deg, rgba(249,115,22,0.04) 0%, transparent 60%)`
                              }}
                            />
                          )}

                          {isHero && (
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <div className="absolute inset-0 bg-purple-500/[0.02]" />
                            </div>
                          )}

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTraitSelection(idx);
                            }}
                            className="relative z-10 shrink-0 p-0.5"
                          >
                            {isSelected ? (
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center ring-1 ${isHero ? 'bg-purple-500/10 ring-purple-500/30' : 'bg-white/10 ring-white/20'}`}>
                                <CheckSquare className={`w-3.5 h-3.5 ${isHero ? 'text-purple-400' : 'text-zinc-200'}`} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md bg-zinc-800/50 flex items-center justify-center ring-1 ring-white/5">
                                <Square className="w-3.5 h-3.5 text-zinc-600" />
                              </div>
                            )}
                          </button>

                          <div className={`relative z-10 w-11 h-11 rounded-xl overflow-hidden shrink-0 ring-1 ${isHero ? 'ring-purple-500/30' : 'ring-white/5'}`}>
                            {trait.icon_path ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/traits/${trait.icon_path}`}
                                alt={trait.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.classList.add('bg-zinc-800', 'flex', 'items-center', 'justify-center');
                                    parent.innerHTML = `<span class="text-white font-bold text-sm">${trait.name.charAt(0).toUpperCase()}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {trait.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="relative z-10 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                {trait.name}
                              </p>
                              {isHero && (
                                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-md ring-1 ring-purple-500/20">
                                  Hero
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 truncate">{trait.riot_api_name}</p>
                            {trait.description && (
                              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{trait.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {importing && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-lg font-bold text-white">Importing Traits...</p>
                  <p className="text-sm text-zinc-500">Please wait</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-[#111112]">
              {!importPreview ? (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => {
                    setImportPreview(null);
                    setSelectedTraits(new Set());
                    setCurrentStep('target');
                  }}
                  disabled={importing}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg transition-all"
                >
                  Back
                </button>
              )}
              
              {!importPreview ? (
                <button
                  onClick={handlePreviewTraits}
                  disabled={!selectedSourceSet || !selectedTargetSetId}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                >
                  Preview Traits
                </button>
              ) : (
                <button
                  onClick={handleConfirmImport}
                  disabled={selectedTraits.size === 0}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import {selectedTraits.size} Traits
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}