"use client";
import { Search, Loader2, Filter, TrendingUp, Target } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MatchAnalytics } from "@/components/lol/MatchAnalitics";
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
  const [mvp, setMvp] = useState<PlayerStats | null>(null);
  const [smvp, setSmvp] = useState<PlayerStats | null>(null);
  const [ranking, setRanking] = useState<PlayerStats[]>([]);
  const [error, setError] = useState<string | null>(null);

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
     
     <MatchAnalytics
  server="europe"
  matchId="EUN1_3864129880"
  targetPuuid="FJkDyTT96Ue-kG70ccyEBw0p-8jow-w4nS0uH4EZC9McX9YxE9sGDukjJfH-dBJxIwGKK8E62NPpfQ" 
/>

    </div>
  );
}
