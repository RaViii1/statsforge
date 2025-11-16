"use client";
import { Search, Loader2, Filter, TrendingUp, Target } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/Components/navbar";
import Footer from "@/Components/footer";

interface ChampionStats {
  id: string;
  name: string;
  title: string;
  image: string;
  championName: string;
  role: string;
  winRate: number;
  pickRate: number;
  banRate: number;
  matches: number;
  kda: number;
}

interface ChampionsResponse {
  patch: string;
  champions: ChampionStats[];
  totalChampions: number;
  filters: {
    role: string;
    champion: string | null;
  };
}

const ROLES = [
  { value: "ALL", label: "All Roles", color: "zinc" },
  { value: "TOP", label: "Top", color: "blue" },
  { value: "JUNGLE", label: "Jungle", color: "green" },
  { value: "MID", label: "Mid", color: "purple" },
  { value: "ADC", label: "ADC", color: "red" },
  { value: "SUPPORT", label: "Support", color: "yellow" },
];

export default function ChampionsPage() {
  const [champions, setChampions] = useState<ChampionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [patch, setPatch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch champions data
  useEffect(() => {
    const fetchChampions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedRole !== "ALL") {
          params.append("role", selectedRole);
        }
        if (debouncedSearch) {
          params.append("champion", debouncedSearch);
        }

        const response = await fetch(`/api/lol/champions?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch champions");
        }

        const data: ChampionsResponse = await response.json();
        setChampions(data.champions);
        setPatch(data.patch);
      } catch (error) {
        console.error("Error fetching champions:", error);
        toast.error("Failed to load champion statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchChampions();
  }, [selectedRole, debouncedSearch]);

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 53) return "text-emerald-400";
    if (winRate >= 51) return "text-green-400";
    if (winRate >= 49) return "text-zinc-400";
    if (winRate >= 47) return "text-orange-400";
    return "text-red-400";
  };

  const getWinRateBgColor = (winRate: number) => {
    if (winRate >= 53) return "bg-emerald-500/20 border-emerald-500/30";
    if (winRate >= 51) return "bg-green-500/20 border-green-500/30";
    if (winRate >= 49) return "bg-zinc-500/20 border-zinc-500/30";
    if (winRate >= 47) return "bg-orange-500/20 border-orange-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/lol" className="text-zinc-400 hover:text-orange-500 transition-colors">
              League of Legends
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white">Champion Statistics</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Champion Statistics
              </h1>
              <p className="text-zinc-400">
                Patch <span className="text-orange-500 font-semibold">{patch || "..."}</span> • {champions.length} Champions
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search champion name..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-600/50 transition-all"
              />
            </div>

            {/* Role Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedRole === role.value
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-orange-600"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-zinc-400">Loading champion statistics...</p>
          </div>
        )}

        {/* Champions Grid */}
        {!loading && champions.length > 0 && (
          <div className="grid gap-3">
            {/* Header Row */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <div className="col-span-4 text-sm font-semibold text-zinc-400">Champion</div>
              <div className="col-span-2 text-sm font-semibold text-zinc-400 text-center">Role</div>
              <div className="col-span-1 text-sm font-semibold text-zinc-400 text-center">Win Rate</div>
              <div className="col-span-1 text-sm font-semibold text-zinc-400 text-center">Pick Rate</div>
              <div className="col-span-1 text-sm font-semibold text-zinc-400 text-center">Ban Rate</div>
              <div className="col-span-2 text-sm font-semibold text-zinc-400 text-center">Matches</div>
              <div className="col-span-1 text-sm font-semibold text-zinc-400 text-center">KDA</div>
            </div>

            {/* Champion Rows */}
            {champions.map((champion, index) => (
              <div
                key={`${champion.id}-${champion.role}-${index}`}
                className="grid lg:grid-cols-12 gap-4 p-4 lg:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-purple-900/50 hover:bg-zinc-900/80 transition-all"
              >
                {/* Champion Info */}
                <div className="lg:col-span-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-zinc-700 shrink-0">
                    <img
                      src={champion.image}
                      alt={champion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{champion.name}</h3>
                    <p className="text-xs text-zinc-500 truncate">{champion.title}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="lg:col-span-2 flex items-center lg:justify-center">
                  <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300">
                    {champion.role}
                  </span>
                </div>

                {/* Win Rate */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className={`px-3 py-1 ${getWinRateBgColor(champion.winRate)} border rounded-lg text-sm font-bold ${getWinRateColor(champion.winRate)}`}>
                    {champion.winRate}%
                  </span>
                </div>

                {/* Pick Rate */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className="text-zinc-400 text-sm font-medium">{champion.pickRate}%</span>
                </div>

                {/* Ban Rate */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className="text-zinc-400 text-sm font-medium">{champion.banRate}%</span>
                </div>

                {/* Matches */}
                <div className="lg:col-span-2 flex items-center lg:justify-center">
                  <span className="text-zinc-400 text-sm font-medium">{champion.matches.toLocaleString()}</span>
                </div>

                {/* KDA */}
                <div className="lg:col-span-1 flex items-center lg:justify-center">
                  <span className="text-zinc-400 text-sm font-medium">{champion.kda}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && champions.length === 0 && (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No champions found</h3>
            <p className="text-zinc-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 p-6 bg-linear-to-r from-purple-950/30 to-blue-950/30 border border-purple-900/30 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600/20 border border-purple-600/30 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">About These Statistics</h3>
              <p className="text-zinc-400 text-sm mb-3">
                Champion statistics are calculated based on ranked games across all regions. Win rates, pick rates, and ban rates are updated regularly with each patch.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                <div>
                  <span className="text-emerald-400 font-semibold">≥53%</span> - Strong
                </div>
                <div>
                  <span className="text-green-400 font-semibold">51-53%</span> - Good
                </div>
                <div>
                  <span className="text-zinc-400 font-semibold">49-51%</span> - Balanced
                </div>
                <div>
                  <span className="text-orange-400 font-semibold">47-49%</span> - Weak
                </div>
                <div>
                  <span className="text-red-400 font-semibold">&lt;47%</span> - Very Weak
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
