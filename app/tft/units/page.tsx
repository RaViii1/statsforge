"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search, ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getCostColor, getCostBorderColor, CurrentSetNumber } from "@/lib/tft/champions";
import { TFTChampion } from "@/lib/tft/champions";
import NavbarTft from "@/components/NavbarTft";
import { UnitTooltip } from "@/components/tft/UnitTooltip";
import { TraitTooltip } from "@/components/tft/planner/TraitTooltip";
import { TooltipState } from "@/lib/tft/teamplanner-types";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const COSTS = [1, 2, 3, 4, 5, 6, 7];

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 animate-pulse">
      <div className="aspect-[3/4] bg-zinc-800" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-2 bg-zinc-800 rounded w-3/4" />
        <div className="flex gap-1">
          <div className="h-4 w-10 bg-zinc-800 rounded" />
          <div className="h-4 w-12 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

interface ChampionCardProps {
  champion: TFTChampion;
  setNumber: number;
  index: number;
  onShowTooltip: (e: React.MouseEvent, data: Partial<TooltipState>) => void;
  onHideTooltip: () => void;
  buildTraitPayload: (trait: any) => any;
  prefersReduced: boolean | null;
}

function ChampionCard({ champion, setNumber, index, onShowTooltip, onHideTooltip, buildTraitPayload, prefersReduced }: ChampionCardProps) {
  const costColor = getCostColor(champion.cost);
  const borderClass = getCostBorderColor(champion.cost);

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
    >
      <Link
        href={`/tft/units/${setNumber}/${champion.name.toLowerCase().replace(/\s+/g, "-")}`}
        className="group block"
      >
        <motion.div
          className={`relative rounded-xl overflow-hidden bg-zinc-900 border-b-2 ${borderClass} shadow-lg shadow-black/50`}
          whileHover={prefersReduced ? {} : { y: -4, transition: { duration: 0.15 } }}
          style={{ "--cost": costColor } as React.CSSProperties}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
            style={{ boxShadow: `0 8px 32px ${costColor}22, 0 0 0 1px ${costColor}15` }}
          />

          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={champion.image_path || "/images/nochampionimage.jpg"}
              alt={champion.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/nochampionimage.jpg"; }}
              onMouseEnter={(e) => onShowTooltip(e, {
                title: champion.name,
                description: champion.ability?.description?.active || champion.ability?.description?.passive || "",
                champion,
                setNumber,
              })}
              onMouseLeave={onHideTooltip}
            />

            <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none bg-linear-to-t from-(--cost)/15 to-transparent" />

            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/95 via-zinc-950/20 to-transparent" />

            <div className="absolute top-0 left-0 right-0 px-2.5 pt-2.5 flex items-start justify-between gap-1">
              <p className="text-xs font-black text-white italic uppercase tracking-tight truncate leading-none drop-shadow-md">
                {champion.name}
              </p>

              <div
                className="shrink-0 w-5 h-5 rounded flex items-center justify-center font-black text-[10px] leading-none"
                style={{
                  backgroundColor: `${costColor}25`,
                  color: costColor,
                  border: `1px solid ${costColor}50`,
                }}
              >
                {champion.cost}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
              <div className="flex flex-wrap gap-1">
                {(champion.trait_details ?? []).slice(0, 3).map((trait: any) => (
                  <span
                    key={trait.name}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold text-zinc-300 uppercase tracking-wider cursor-default"
                    onMouseEnter={(e) => { e.stopPropagation(); onShowTooltip(e, { title: trait.name, description: trait.description || "", trait: buildTraitPayload(trait) }); }}
                    onMouseLeave={onHideTooltip}
                  >
                    {trait.icon_path && (
                      <img src={trait.icon_path} alt={trait.name} className="w-3 h-3 object-contain shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                    {trait.name}
                  </span>
                ))}
                {champion.traits.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold text-zinc-600">
                    +{champion.traits.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function TFTUnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCost, setSelectedCost] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState("");
  const [champions, setChampions] = useState<TFTChampion[]>([]);
  const [allTraits, setAllTraits] = useState<any[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: "", description: "", x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const prefersReduced = useReducedMotion();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((val: string) => {
    setSearchQuery(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(val), 200);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [champsRes, traitsRes] = await Promise.all([
          fetch("/api/tft/champions"),
          fetch("/api/tft/traits"),
        ]);
        if (champsRes.ok) setChampions(await champsRes.json());
        if (traitsRes.ok) setAllTraits(await traitsRes.json());
      } catch (err) {
        console.error("Error fetching TFT data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredChampions = useMemo(() =>
    champions.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCost   = selectedCost === 0 || c.cost === selectedCost;
      const matchesTrait  = !selectedTrait || c.traits.includes(selectedTrait);
      return matchesSearch && matchesCost && matchesTrait;
    }),
  [debouncedSearch, selectedCost, selectedTrait, champions]);

  const groupedBySection = useMemo(() => {
    const grouped: Record<number, TFTChampion[]> = {};
    filteredChampions.forEach((c) => {
      if (!grouped[c.cost]) grouped[c.cost] = [];
      grouped[c.cost].push(c);
    });
    return grouped;
  }, [filteredChampions]);

  const clearFilters = () => { setSearchQuery(""); setDebouncedSearch(""); setSelectedCost(0); setSelectedTrait(""); };
  const hasActiveFilters = debouncedSearch || selectedCost !== 0 || selectedTrait;

  const showTooltip = (e: React.MouseEvent, data: Partial<TooltipState>) =>
    setTooltip({ visible: true, title: "", description: "", x: e.clientX, y: e.clientY, ...data });
  const hideTooltip = () => setTooltip((p) => ({ ...p, visible: false }));

  const buildTraitPayload = (trait: any) => ({
    id: trait.name, name: trait.name,
    description: trait.description || "",
    icon_path: trait.icon_path || "",
    tiers: trait.tft_trait_tiers?.map((t: any) => ({
      id: t.id, trait_id: t.trait_id, tier: t.tier,
      units_required: t.units_required, description: t.description, stats: t.stats,
    })) || trait.tiers || [],
    is_Hero: trait.is_Hero || false,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,700&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-orange-500/30">

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-[700px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[180px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[160px]" />
        </div>

        <NavbarTft />

        <UnitTooltip
          visible={tooltip.visible && !!tooltip.champion}
          title={tooltip.title} description={tooltip.description}
          x={tooltip.x} y={tooltip.y}
          champion={tooltip.champion} setNumber={CurrentSetNumber}
        />
        <TraitTooltip
          visible={tooltip.visible && !!tooltip.trait}
          title={tooltip.title} description={tooltip.description}
          x={tooltip.x} y={tooltip.y} trait={tooltip.trait}
        />

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Header ────────────────────────────────────────────── */}
          <div className="pt-10 pb-8 border-b border-zinc-900">
            <Link
              href="/tft"
              className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-300 mb-6 transition-colors group uppercase text-[10px] font-black tracking-widest"
            >
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              TFT Hub
            </Link>

            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Set {CurrentSetNumber}</p>
                <h1 className="font-bebas text-7xl md:text-8xl leading-none text-white tracking-wide">UNITS</h1>
                <p className="text-zinc-500 text-sm mt-2 max-w-md">
                  Every champion — costs, abilities, synergies, and optimal items.
                </p>
              </div>

              <div className="text-right">
                <motion.p
                  key={filteredChampions.length}
                  initial={prefersReduced ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bebas text-5xl text-white tabular-nums leading-none"
                >
                  {loading ? "—" : filteredChampions.length}
                </motion.p>
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                  {filteredChampions.length === champions.length ? "champions" : `of ${champions.length}`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Filters ───────────────────────────────────────────── */}
          <div className="py-5 border-b border-zinc-900 flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                aria-label="Search champions"
                className="pl-9 pr-8 py-2 bg-zinc-900 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-800 transition-colors w-44"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => handleSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1" role="group" aria-label="Filter by cost">
              <button
                onClick={() => setSelectedCost(0)}
                aria-pressed={selectedCost === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-150 ${
                  selectedCost === 0
                    ? "bg-zinc-300 text-zinc-950 shadow-md"
                    : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                All
              </button>

              {COSTS.map((cost) => {
                const color    = getCostColor(cost);
                const isActive = selectedCost === cost;
                return (
                  <motion.button
                    key={cost}
                    onClick={() => setSelectedCost(cost)}
                    aria-pressed={isActive}
                    aria-label={`${cost} gold`}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-150"
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    style={isActive
                      ? { backgroundColor: color, color: "#0c0c0e", boxShadow: `0 4px 16px ${color}40` }
                      : { backgroundColor: "#18181b", color: "#71717a" }
                    }
                    whileHover={prefersReduced ? {} : { backgroundColor: isActive ? color : "#27272a" }}
                  >
                    {cost}G
                  </motion.button>
                );
              })}
            </div>

            <div className="w-px h-5 bg-zinc-800" />

            <div className="relative">
              <select
                value={selectedTrait}
                onChange={(e) => setSelectedTrait(e.target.value)}
                aria-label="Filter by trait"
                className="appearance-none pl-3 pr-7 py-2 bg-zinc-900 rounded-lg text-xs text-zinc-400 focus:outline-none focus:bg-zinc-800 transition-colors cursor-pointer"
              >
                <option value="">All Traits</option>
                {allTraits.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[10px] font-black text-orange-600 hover:text-orange-400 uppercase tracking-widest transition-colors"
                  aria-label="Clear all filters"
                >
                  <X className="w-3 h-3" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Grid ──────────────────────────────────────────────── */}
          <div className="py-10">

            {loading && (
              <div className="space-y-14">
                {[1, 2, 3].map((tier) => (
                  <div key={tier}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-0.5 h-5 bg-zinc-800 rounded-full" />
                      <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                      <div className="flex-1 h-px bg-zinc-900" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {Array.from({ length: tier === 1 ? 6 : tier === 2 ? 8 : 10 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && Object.keys(groupedBySection).length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 space-y-3"
              >
                <p className="font-bebas text-3xl text-zinc-700 tracking-wide">No units found</p>
                <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-400 font-black uppercase tracking-widest transition-colors">
                  Clear filters
                </button>
              </motion.div>
            )}

            {!loading && (
              <div className="space-y-14">
                {COSTS.map((cost) => {
                  const champs = groupedBySection[cost];
                  if (!champs || champs.length === 0) return null;
                  const costColor = getCostColor(cost);

                  return (
                    <motion.div
                      key={cost}
                      initial={prefersReduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative p-0 pb-5">
                        {/* Section header */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="w-0.5 h-5 rounded-full shrink-0" style={{ backgroundColor: costColor }} />
                          <h2
                            className="font-bebas text-lg tracking-[0.15em] leading-none"
                            style={{ color: costColor }}
                          >
                            {cost} Gold
                          </h2>
                          <div className="flex-1 h-px" style={{ backgroundColor: `${costColor}20` }} />
                          <span className="text-[10px] font-black uppercase tracking-widest tabular-nums" style={{ color: `${costColor}60` }}>
                            {champs.length}
                          </span>
                        </div>

                        {/* Cards */}
                        <motion.div
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
                          layout
                        >
                          <AnimatePresence mode="popLayout">
                            {champs.map((champion, index) => (
                              <ChampionCard
                                key={champion.id}
                                champion={champion}
                                setNumber={CurrentSetNumber}
                                index={index}
                                onShowTooltip={showTooltip}
                                onHideTooltip={hideTooltip}
                                buildTraitPayload={buildTraitPayload}
                                prefersReduced={prefersReduced}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}