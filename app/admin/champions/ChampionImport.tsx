'use client';

import { Upload, ChevronDown, X, FileText, CheckSquare, Square, CheckCircle, Circle, ArrowRight, Loader2, Database, FileJson, Filter, Download } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { getCostColor, TFTSet } from "@/lib/tft/champions";
import SvgIcon from "@/components/SvgIcon";

interface CDSet {
  set_number: number;
  champions: any;
}

interface ImportChampion {
  id: string;
  name: string;
  cost: number;
  image_path: string;
  set_id: number;
  ability: {
    name: string;
    description: {
      active: string;
      passive: string;
    };
  };
  stats: {
    hp: number;
    armor: number;
    mr: number;
    dmg: number;
    ap: number;
    crit: number;
    mana: number;
    range: number;
    speed: number;
  };
}

interface ImportPreview {
  champions: ImportChampion[];
}

interface ChampionImportProps {
  sets: (TFTSet & { id: number })[];
}

const CD_URL = "https://raw.communitydragon.org/16.10/cdragon/tft/en_us.json";

const STEPS = [
  { id: 'source', label: 'Load Source', icon: FileJson },
  { id: 'target', label: 'Pick Target', icon: Database },
  { id: 'preview', label: 'Preview', icon: Filter },
  { id: 'import', label: 'Import', icon: Download },
] as const;

type StepId = typeof STEPS[number]['id'];

export default function ChampionImport({ sets }: ChampionImportProps) {
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [selectedTargetSetId, setSelectedTargetSetId] = useState<number | null>(null);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);
  const [availableSourceSets, setAvailableSourceSets] = useState<CDSet[]>([]);
  const [selectedSourceSet, setSelectedSourceSet] = useState<number | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [selectedChampions, setSelectedChampions] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState<StepId>('source');

  const stripTags = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/@[a-zA-Z0-9_]+@/g, '')
      .replace(/%i:[a-zA-Z0-9_%]+%/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getIconFilename = (iconPath?: string) => {
    if (!iconPath) return '';
    let filename = iconPath.split('/').pop() || iconPath;
    filename = filename.replace(/\.tex$/, '.png');
    return filename;
  };

  const roundTo2Decimals = (num?: number) => {
    if (num === undefined || num === null) return 0;
    return Math.round(num * 100) / 100;
  };

  const processChampionsData = (championsData: any[], set_id: number, setNum: number): ImportChampion[] => {
    return championsData
      .map((c: any) => {
        const stats = c.stats || {};
        const starStats = stats.stars?.[0] || {};
        const championName = (c.name || c.displayName || 'unnamed').toLowerCase().replace(/\s+/g, '');
        const championId = `${setNum}_${championName}`;

        return {
          id: c.id || championId,
          name: c.name || c.displayName || 'Unnamed Champion',
          cost: c.cost || 1,
          image_path: getIconFilename(c.icon || c.image_path || ''),
          set_id,
          ability: {
            name: c.ability?.name || '',
            description: {
              active: stripTags(c.ability?.description?.active || c.ability?.desc || ''),
              passive: stripTags(c.ability?.description?.passive || '')
            }
          },
          stats: {
            hp: roundTo2Decimals(starStats.hp ?? stats.hp),
            armor: roundTo2Decimals(starStats.armor ?? stats.armor),
            mr: roundTo2Decimals(starStats.mr ?? stats.magicResist),
            dmg: roundTo2Decimals(starStats.dmg ?? stats.damage),
            ap: roundTo2Decimals(starStats.ap),
            crit: roundTo2Decimals(starStats.crit ?? stats.critChance),
            mana: roundTo2Decimals(stats.mana),
            range: roundTo2Decimals(stats.range),
            speed: roundTo2Decimals(stats.attackSpeed ?? stats.speed)
          }
        };
      })
      .filter((c: ImportChampion) => c.image_path);
  };

  const handleFileSelect = (raw: any) => {
    const setsData = raw.sets;
    if (!setsData) {
      toast.error('No sets found in JSON');
      return;
    }

    const cdSets = Object.entries(setsData).map(([setNum, setData]: any) => ({
      set_number: parseInt(setNum),
      champions: setData?.champions || []
    }));

    setAvailableSourceSets(cdSets);
    setSelectedSourceSet(null);
    setCurrentStep('target');
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

  const handlePreviewChampions = useCallback(() => {
    if (!selectedSourceSet || !selectedTargetSetId) return;

    const cdSet = availableSourceSets.find(s => s.set_number === selectedSourceSet);
    if (!cdSet?.champions) return;

    const championData = Object.values(cdSet.champions).filter((c: any) => typeof c === 'object');

    if (championData.length === 0) {
      toast.error('No champions found in this set');
      return;
    }

    const previewChampions = processChampionsData(championData, selectedTargetSetId, selectedSourceSet);

    if (previewChampions.length === 0) {
      toast.error('No valid champions found (all entries have missing icon paths)');
      return;
    }

    setImportPreview({ champions: previewChampions });
    const allSelected = new Set(Array.from({ length: previewChampions.length }, (_, i) => i));
    setSelectedChampions(allSelected);
    setShowSourceDropdown(false);
    setCurrentStep('preview');
  }, [availableSourceSets, selectedSourceSet, selectedTargetSetId]);

  const handleConfirmImport = async () => {
    if (!importPreview || !selectedTargetSetId) return;
    setImporting(true);
    setCurrentStep('import');

    try {
      const championsToImport = importPreview.champions
        .filter((_, idx) => selectedChampions.has(idx))
        .map(c => ({
          id: c.id,
          name: c.name,
          cost: c.cost,
          set_id: selectedTargetSetId,
          image_path: c.image_path,
          ability: c.ability,
          stats: {
            speed: c.stats.speed,
            mana: c.stats.mana,
            range: c.stats.range,
            stars: [
              { hp: c.stats.hp, dmg: c.stats.dmg, ap: c.stats.ap, armor: c.stats.armor, mr: c.stats.mr, crit: c.stats.crit },
              { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 },
              { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 }
            ]
          }
        }));

      if (championsToImport.length === 0) {
        toast.error('No champions selected for import');
        setImporting(false);
        setCurrentStep('preview');
        return;
      }

      const res = await fetch('/api/admin/champions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(championsToImport),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Imported ${result.count} champions`);
      } else {
        const failed = result.results?.filter((r: any) => !r.success).length ?? championsToImport.length;
        const ok = (result.results?.filter((r: any) => r.success).length ?? championsToImport.length) - failed;
        if (ok > 0) {
          toast.warning(`Imported ${ok} of ${championsToImport.length} champions. ${failed} failed.`);
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
    setSelectedChampions(new Set());
    setCurrentStep('source');
    setShowTargetDropdown(false);
    setShowSourceDropdown(false);
  };

  const toggleChampionSelection = (idx: number) => {
    const newSelected = new Set(selectedChampions);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }
    setSelectedChampions(newSelected);
  };

  const selectAllChampions = () => {
    if (!importPreview) return;
    const all = new Set(Array.from({ length: importPreview.champions.length }, (_, i) => i));
    setSelectedChampions(all);
  };

  const clearSelection = () => {
    setSelectedChampions(new Set());
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
                        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111112] border border-white/5 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
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
                              <span className="text-xs text-zinc-500">{Object.keys(s.champions || {}).length} champions</span>
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
                        <div className="absolute top-full mt-2 left-0 right-0 bg-[#111112] border border-white/5 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
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

              {importPreview && !importing && currentStep !== 'import' && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between shrink-0">
                    <div>
                      <h3 className="text-lg font-bold text-white">Import Preview</h3>
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {selectedChampions.size} of {importPreview.champions.length} selected · Importing to {selectedTargetSet?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={selectAllChampions} 
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
                    {importPreview.champions.map((champ, idx) => {
                      const isSelected = selectedChampions.has(idx);
                      const costColor = getCostColor(champ.cost);
                      
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleChampionSelection(idx)}
                          className={`
                            group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
                            ${isSelected ? 'bg-white/[0.03]' : ''}
                          `}
                        >
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{ 
                              background: `linear-gradient(90deg, ${costColor}10 0%, ${costColor}05 40%, transparent 70%)`
                            }}
                          />

                          {isSelected && (
                            <div 
                              className="absolute inset-0 pointer-events-none"
                              style={{ 
                                background: `linear-gradient(90deg, ${costColor}08 0%, transparent 60%)`
                              }}
                            />
                          )}

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChampionSelection(idx);
                            }}
                            className="shrink-0 p-0.5 relative z-10"
                          >
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center ring-1 ring-white/20">
                                <CheckSquare className="w-3.5 h-3.5 text-zinc-200" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md bg-zinc-800/50 flex items-center justify-center ring-1 ring-white/5">
                                <Square className="w-3.5 h-3.5 text-zinc-600" />
                              </div>
                            )}
                          </button>

                          <div 
                            className="w-11 h-11 rounded-xl overflow-hidden shrink-0 ring-1 relative z-10 transition-all duration-200"
                          >
                            <img
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/champions/${champ.image_path}`}
                              alt={champ.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg';
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                {champ.name}
                              </p>
                              <span 
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                style={{ 
                                  backgroundColor: `${costColor}15`,
                                  color: costColor
                                }}
                              >
                                {champ.cost}G
                              </span>
                            </div>
                          <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-emerald-500"><SvgIcon type="health" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.hp}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-orange-400"><SvgIcon type="dmg" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.dmg}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-yellow-400"><SvgIcon type="armor" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.armor}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-purple-400"><SvgIcon type="mr" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.mr}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-amber-400"><SvgIcon type="attackspeed" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.speed}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-red-500"><SvgIcon type="crit" size={12} /></span>
                              <span className="text-zinc-500">{champ.stats.crit}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-cyan-400"><SvgIcon type="mana" size={10} /></span>
                              <span className="text-zinc-500">{champ.stats.mana}</span>
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1 text-[11px]">
                              <span className="text-zinc-400">Range: </span>
                              <span className="text-zinc-500">{champ.stats.range}</span>
                              <span className="flex gap-px ml-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-3 rounded-sm ${i <= (champ.stats?.range || 1) ? "bg-orange-500" : "bg-zinc-800"}`}
                                  />
                                ))}
                              </span>
                            </span>
                          </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {importing && (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white">Importing Champions</h3>
                    <p className="text-sm text-zinc-500">
                      Processing {selectedChampions.size} champions into {selectedTargetSet?.name}...
                    </p>
                  </div>
                  <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full animate-pulse w-2/3" />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-[#111112]">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {!importPreview && (
                  <button
                    onClick={handlePreviewChampions}
                    disabled={!selectedSourceSet || !selectedTargetSetId}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <span>Preview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {importPreview && !importing && (
                  <button
                    onClick={handleConfirmImport}
                    disabled={!selectedTargetSetId || selectedChampions.size === 0}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import {selectedChampions.size > 0 && `(${selectedChampions.size})`}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}