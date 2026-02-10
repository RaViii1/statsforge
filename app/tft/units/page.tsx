"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, Users, Filter, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getCostBorderColor, getCostColor, CurrentSetNumber } from "@/lib/tft/champions";
import { getTFTUnitSplash } from "@/lib/tft/tftfunctions";
import { TFTChampion } from "@/lib/tft/champions";
import NavbarTft from "@/components/NavbarTft";

const COST_FILTERS = [
  { value: 0, label: "All", color: "bg-zinc-700" },
  { value: 1, label: "1", color: "#94a3b8" },
  { value: 2, label: "2", color: "#10b981" },
  { value: 3, label: "3", color: "#3b82f6" },
  { value: 4, label: "4", color: "#a855f7" },
  { value: 5, label: "5", color: "#eab308" },
  { value: 6, label: "6", color: "#ef4444" },
  { value: 7, label: "7", color: "#f97316" },
];

const COST_BG_COLORS: Record<number, string> = {
  1: "from-zinc-600/20 to-zinc-800/40",
  2: "from-emerald-600/20 to-emerald-900/40",
  3: "from-blue-600/20 to-blue-900/40",
  4: "from-purple-600/20 to-purple-900/40",
  5: "from-yellow-600/20 to-yellow-900/40",
  6: "from-red-600/20 to-red-900/40",
  7: "from-orange-600/20 to-orange-900/40",
};

const COST_ICON_BG: Record<number, string> = {
  1: "bg-zinc-500",
  2: "bg-emerald-500",
  3: "bg-blue-500",
  4: "bg-purple-500",
  5: "bg-yellow-500",
  6: "bg-orange-500",
  7: "bg-orange-500",
};

export default function TFTUnitsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCost, setSelectedCost] = useState(0);
  const [selectedTrait, setSelectedTrait] = useState("");
  const [champions, setChampions] = useState<TFTChampion[]>([]);
  const [allTraits, setAllTraits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [champsRes, traitsRes] = await Promise.all([
          fetch("/api/tft/champions"),
          fetch("/api/tft/traits")
        ]);

        if (champsRes.ok) {
          const champsData = await champsRes.json();
          setChampions(champsData);
        }

        if (traitsRes.ok) {
          const traitsData = await traitsRes.json();
          setAllTraits(traitsData.map((t: any) => t.name));
        }
      } catch (error) {
        console.error("Error fetching TFT data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesSearch = champion.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCost = selectedCost === 0 || champion.cost === selectedCost;
      const matchesTrait = !selectedTrait || champion.traits.includes(selectedTrait);
      return matchesSearch && matchesCost && matchesTrait;
    });
  }, [searchQuery, selectedCost, selectedTrait, champions]);

  const groupedBySection = useMemo(() => {
    const grouped: Record<number, typeof champions> = {};
    filteredChampions.forEach((champ) => {
      if (!grouped[champ.cost]) grouped[champ.cost] = [];
      grouped[champ.cost].push(champ);
    });
    return grouped;
  }, [filteredChampions]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCost(0);
    setSelectedTrait("");
  };

  const hasActiveFilters = searchQuery || selectedCost !== 0 || selectedTrait;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading Units...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      <NavbarTft />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12">
          <Link
            href="/tft"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to TFT Hub</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-orange-950/30 border border-orange-900/30 rounded-full">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600 text-xs font-bold uppercase tracking-wider">Set {CurrentSetNumber} Champions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tighter">
                Explore <span className="text-orange-500">Units</span>
              </h1>
              <p className="text-zinc-400 mt-2 max-w-xl">
                Research all there is to know about champs from their cost and abilities to their recommended items and synergies.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 mb-10 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search champions by name..."
                className="w-full pl-12 pr-4 py-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600/50 focus:ring-2 focus:ring-orange-600/10 transition-all text-lg font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
                <Filter className="w-4 h-4" />
                Cost:
              </div>
              <div className="flex gap-2 flex-wrap">
                {COST_FILTERS.map((cost) => (
                  <button
                    key={cost.value}
                    onClick={() => setSelectedCost(cost.value)}
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all ${
                      selectedCost === cost.value
                        ? `${typeof cost.color === 'string' && cost.color.startsWith('#') ? '' : cost.color} text-white shadow-lg scale-110`
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    }`}
                    style={typeof cost.color === 'string' && cost.color.startsWith('#') && selectedCost === cost.value ? { backgroundColor: cost.color } : {}}
                  >
                    {cost.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
              Trait:
            </div>
            <select
              value={selectedTrait}
              onChange={(e) => setSelectedTrait(e.target.value)}
              className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-orange-600/50 focus:bg-zinc-800 transition-all cursor-pointer"
            >
              <option value="">All Traits</option>
              {allTraits.map((trait) => (
                <option key={trait} value={trait}>
                  {trait}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all text-sm font-bold"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-zinc-500">
            Showing <span className="text-orange-500 font-bold">{filteredChampions.length}</span> of{" "}
            <span className="font-bold">{champions.length}</span> champions
          </div>
        </div>

        {Object.keys(groupedBySection).length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Champions Found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-12">
            {[1, 2, 3, 4, 5, 6, 7].map((cost) => {
              const champs = groupedBySection[cost];
              if (!champs || champs.length === 0) return null;

              return (
                <div key={cost}>
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: getCostColor(cost) }}
                    >
                      <span className="text-white font-black">{cost}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                      {cost}-Cost Champions
                    </h2>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <span className="text-zinc-500 text-sm font-bold">{champs.length} units</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {champs.map((champion) => (
                      <Link href={`/tft/units/${CurrentSetNumber}/${champion.name.toLowerCase().replace(/\s+/g, '-')}`}
                        key={champion.id}>
                      <div
                        className={`group relative bg-linear-to-br ${COST_BG_COLORS[champion.cost] || "from-zinc-600/20 to-zinc-800/40"} border-2 ${getCostBorderColor(champion.cost)} rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer h-full`}
                      >
                        <div className="absolute top-3 right-3 z-10">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg border border-white/20"
                            style={{ backgroundColor: getCostColor(champion.cost) }}
                          >
                            <span className="text-white font-black text-xs">{champion.cost}</span>
                          </div>
                        </div>

                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={champion.image_path || "/images/nochampionimage.jpg"}
                            alt={champion.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/nochampionimage.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {champion.traits.slice(0, 3).map((trait) => (
                              <span
                                key={trait}
                                className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-zinc-300 uppercase tracking-wider border border-white/10"
                              >
                                {trait}
                              </span>
                            ))}
                            {champion.traits.length > 3 && (
                              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-zinc-500 uppercase tracking-wider border border-white/10">
                                +{champion.traits.length - 3}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white italic uppercase tracking-tight truncate">
                            {champion.name}
                          </h3>
                        </div>
                      </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
