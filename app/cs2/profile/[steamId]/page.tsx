"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  ExternalLink, 
  Clock, 
  Shield, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Crosshair,
  Target,
  Skull,
  Trophy,
  Zap,
  BarChart3,
  Map,
  History,
  UserPlus,
  Flame,
  Bomb,
  TrendingUp
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { toast } from "sonner";

interface GameStats {
  totalKills: number;
  totalDeaths: number;
  totalTimePlayed: number;
  totalWins: number;
  totalMatchesPlayed: number;
  totalMVPs: number;
  totalHeadshots: number;
  totalDamage: number;
  totalMoneyEarned: number;
  totalWeaponsDoanted: number;
  totalRoundsPlayed: number;
  totalBombsPlanted: number;
  totalBombsDefused: number;
  killsAK47: number;
  killsM4A1: number;
  killsAWP: number;
  killsDeagle: number;
  killsKnife: number;
  shotsHit: number;
  shotsFired: number;
  lastMatchKills: number;
  lastMatchDeaths: number;
  lastMatchMVPs: number;
  lastMatchDamage: number;
  lastMatchRounds: number;
  lastMatchWins: number;
}

interface SteamProfile {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  personastateText: string;
  communityvisibilitystate: number;
  profilestate: number;
  lastlogoff?: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
  gameextrainfo?: string;
  gameid?: string;
  bans?: {
    SteamId: string;
    CommunityBanned: boolean;
    VACBanned: boolean;
    NumberOfVACBans: number;
    DaysSinceLastBan: number;
    NumberOfGameBans: number;
    EconomyBan: string;
  };
  friendCount?: number | null;
  totalGames?: number | null;
  cs2Stats?: {
    playtime_forever: number;
    playtime_2weeks: number;
  } | null;
  gameStats?: GameStats | null;
  gameStatsError?: string | null;
}

type TabType = "stats" | "graphs" | "weapons" | "maps" | "matches" | "playedWith";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "graphs", label: "Graphs", icon: TrendingUp },
  { id: "weapons", label: "Weapons", icon: Crosshair },
  { id: "maps", label: "Maps", icon: Map },
  { id: "matches", label: "Matches", icon: History },
  { id: "playedWith", label: "Played With", icon: UserPlus },
];

const weapons = [
  { name: "AK-47", key: "killsAK47", image: "https://raw.githubusercontent.com/Flavor/CSGOWeaponData/main/img/ak47_transparent.png" },
  { name: "M4A1-S", key: "killsM4A1", image: "https://raw.githubusercontent.com/Flavor/CSGOWeaponData/main/img/m4a1s_transparent.png" },
  { name: "AWP", key: "killsAWP", image: "https://raw.githubusercontent.com/Flavor/CSGOWeaponData/main/img/awp_transparent.png" },
  { name: "Desert Eagle", key: "killsDeagle", image: "https://raw.githubusercontent.com/Flavor/CSGOWeaponData/main/img/deagle_transparent.png" },
  { name: "Knife", key: "killsKnife", image: "https://raw.githubusercontent.com/Flavor/CSGOWeaponData/main/img/knife_ct_transparent.png" },
];

export default function CS2ProfilePage() {
  const params = useParams();
  const steamId = params.steamId as string;

  const [profile, setProfile] = useState<SteamProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("stats");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/cs2/profile/${encodeURIComponent(steamId)}`);
        
        if (response.status === 404) {
          setError("Player not found");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to fetch profile");
          setLoading(false);
          return;
        }

          const data = await response.json();
          console.log("Profile data received:", data);
          setProfile(data);

        const stored = localStorage.getItem("cs2_recent_searches");
        const recentSearches = stored ? JSON.parse(stored) : [];
        const newSearch = {
          steamId: data.steamid,
          displayName: data.personaname,
          timestamp: Date.now(),
        };
        const filtered = recentSearches.filter(
          (s: { steamId: string }) => s.steamId !== data.steamid
        );
        const updated = [newSearch, ...filtered].slice(0, 5);
        localStorage.setItem("cs2_recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while fetching the profile");
      } finally {
        setLoading(false);
      }
    };

    if (steamId) {
      fetchProfile();
    }
  }, [steamId]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(true);
    toast.success("Steam ID copied!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours >= 1000) {
      return `${(hours / 1000).toFixed(1)}k`;
    }
    return `${hours}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (state: number) => {
    switch (state) {
      case 1: return "bg-emerald-500";
      case 2: return "bg-red-500";
      case 3: return "bg-amber-500";
      case 4: return "bg-amber-600";
      case 5:
      case 6: return "bg-sky-500";
      default: return "bg-zinc-500";
    }
  };

  const calculateKD = (kills: number, deaths: number) => {
    if (deaths === 0) return kills.toFixed(2);
    return (kills / deaths).toFixed(2);
  };

  const calculateHSPercent = (headshots: number, kills: number) => {
    if (kills === 0) return "0";
    return ((headshots / kills) * 100).toFixed(1);
  };

  const calculateAccuracy = (hits: number, shots: number) => {
    if (shots === 0) return "0";
    return ((hits / shots) * 100).toFixed(1);
  };

  const calculateWinRate = (wins: number, matches: number) => {
    if (matches === 0) return "0";
    return ((wins / matches) * 100).toFixed(1);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">Loading CS2 Stats...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
            <p className="text-zinc-400 mb-6">{error || "The Steam profile could not be found."}</p>
            <Link
              href="/cs2"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isPrivate = profile.communityvisibilitystate !== 3;
  const stats = profile.gameStats;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Link
          href="/cs2"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        <div className="relative rounded-2xl overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-zinc-900/80 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative h-40 bg-gradient-to-r from-amber-950/40 via-zinc-900/60 to-amber-950/40 border-b border-zinc-800/50">
            <div className="absolute inset-0 bg-[url('/images/cs2.png')] bg-cover bg-center opacity-10" />
            {profile.gameextrainfo && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg backdrop-blur-sm">
                <span className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Playing: {profile.gameextrainfo}
                </span>
              </div>
            )}
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col lg:flex-row gap-6 -mt-20">
              <div className="relative shrink-0">
                <div className="relative">
                  <img
                    src={profile.avatarfull}
                    alt={profile.personaname}
                    className="w-36 h-36 rounded-2xl border-4 border-[#0a0a0f] shadow-2xl"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0a0a0f] ${getStatusColor(profile.personastate)}`} />
                </div>
              </div>

              <div className="flex-1 pt-4 lg:pt-20">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white tracking-tight">
                        {profile.personaname}
                      </h1>
                      {profile.loccountrycode && (
                        <img
                          src={`https://flagcdn.com/24x18/${profile.loccountrycode.toLowerCase()}.png`}
                          alt={profile.loccountrycode}
                          className="w-6 h-4 rounded-sm"
                        />
                      )}
                    </div>
                    {profile.realname && (
                      <p className="text-zinc-400 text-sm mb-2">{profile.realname}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        profile.personastate === 1 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        profile.personastate === 0 ? "bg-zinc-700/50 text-zinc-400 border border-zinc-600/30" :
                        "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      }`}>
                        {profile.personastateText}
                      </span>
                      {isPrivate && (
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30">
                          Private Profile
                        </span>
                      )}
                      {profile.bans?.VACBanned && (
                        <span className="px-3 py-1 rounded-full bg-red-600/30 text-red-400 text-xs font-semibold border border-red-500/40">
                          VAC Banned
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => copyToClipboard(profile.steamid)}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-white rounded-lg transition-all border border-zinc-700/50 text-sm"
                    >
                      {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      Copy ID
                    </button>
                    <a
                      href={profile.profileurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Steam Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 to-amber-950/20 border border-amber-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-zinc-400 uppercase tracking-wide">K/D Ratio</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{calculateKD(stats.totalKills, stats.totalDeaths)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/40 to-rose-950/20 border border-rose-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Crosshair className="w-4 h-4 text-rose-500" />
                      <span className="text-xs text-zinc-400 uppercase tracking-wide">HS %</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{calculateHSPercent(stats.totalHeadshots, stats.totalKills)}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-sky-950/40 to-sky-950/20 border border-sky-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-sky-500" />
                      <span className="text-xs text-zinc-400 uppercase tracking-wide">Win Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{calculateWinRate(stats.totalWins, stats.totalMatchesPlayed)}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-purple-950/20 border border-purple-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-zinc-400 uppercase tracking-wide">Accuracy</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{calculateAccuracy(stats.shotsHit, stats.shotsFired)}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-orange-950/40 to-orange-950/20 border border-orange-900/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-zinc-400 uppercase tracking-wide">Hours</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{profile.cs2Stats ? formatPlaytime(profile.cs2Stats.playtime_forever) : "N/A"}</p>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
{activeTab === "stats" && (
              <div className="space-y-6">
                {stats ? (
                  <>
                    <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Skull className="w-5 h-5 text-amber-500" />
                        Combat Statistics
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total Kills</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.totalKills)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total Deaths</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.totalDeaths)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Headshots</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.totalHeadshots)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Total Damage</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.totalDamage)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Shots Fired</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.shotsFired)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Shots Hit</p>
                          <p className="text-xl font-bold text-white">{formatNumber(stats.shotsHit)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Match Statistics
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                          <span className="text-zinc-400">Matches Played</span>
                          <span className="font-bold text-white">{formatNumber(stats.totalMatchesPlayed)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                          <span className="text-zinc-400">Total Wins</span>
                          <span className="font-bold text-emerald-400">{formatNumber(stats.totalWins)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-zinc-800/50">
                          <span className="text-zinc-400">Rounds Played</span>
                          <span className="font-bold text-white">{formatNumber(stats.totalRoundsPlayed)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-zinc-400">MVPs</span>
                          <span className="font-bold text-amber-400">{formatNumber(stats.totalMVPs)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Bomb className="w-5 h-5 text-amber-500" />
                        Objective Stats
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/30 to-transparent border border-red-900/20">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Bombs Planted</p>
                          <p className="text-2xl font-bold text-red-400">{formatNumber(stats.totalBombsPlanted)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-transparent border border-blue-900/20">
                          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Bombs Defused</p>
                          <p className="text-2xl font-bold text-blue-400">{formatNumber(stats.totalBombsDefused)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        Last Match
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-xl bg-zinc-800/30">
                          <p className="text-xs text-zinc-500 mb-1">Kills</p>
                          <p className="text-xl font-bold text-white">{stats.lastMatchKills}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-zinc-800/30">
                          <p className="text-xs text-zinc-500 mb-1">Deaths</p>
                          <p className="text-xl font-bold text-white">{stats.lastMatchDeaths}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-zinc-800/30">
                          <p className="text-xs text-zinc-500 mb-1">MVPs</p>
                          <p className="text-xl font-bold text-amber-400">{stats.lastMatchMVPs}</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 rounded-xl bg-zinc-800/20 border border-zinc-700/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-400">Damage Dealt</span>
                          <span className="text-white font-medium">{stats.lastMatchDamage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Game Stats Unavailable</h3>
                      <p className="text-zinc-500 max-w-md text-sm">
                        {isPrivate 
                          ? "This player's profile is private. CS2 statistics are not available for private profiles."
                          : profile.gameStatsError 
                            ? `${profile.gameStatsError}`
                            : "Unable to load CS2 statistics. The player may not have played CS2 or their game details are set to private."}
                      </p>
                      {!isPrivate && (
                        <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 max-w-lg">
                          <p className="text-zinc-400 text-xs leading-relaxed">
                            <span className="text-amber-500 font-semibold block mb-1">Why am I seeing this?</span>
                            Even if a Steam profile is <span className="text-emerald-400 font-medium">Public</span>, Steam has a separate privacy setting for <span className="text-white font-medium">&quot;Game details&quot;</span>. 
                            If this is set to &quot;Private&quot;, external sites cannot access CS2 statistics like kills, deaths, or wins.
                          </p>
                        </div>
                      )}
                    </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" />
                    Profile Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                      <span className="text-zinc-400">Steam ID64</span>
                      <span className="font-mono text-sm text-white">{profile.steamid}</span>
                    </div>
                    {profile.timecreated && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Account Created</span>
                        <span className="text-white">{formatDate(profile.timecreated)}</span>
                      </div>
                    )}
                    {profile.lastlogoff && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Last Online</span>
                        <span className="text-white">{formatDate(profile.lastlogoff)}</span>
                      </div>
                    )}
                    {profile.friendCount !== null && profile.friendCount !== undefined && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Friends</span>
                        <span className="text-white">{profile.friendCount}</span>
                      </div>
                    )}
                    {profile.totalGames !== null && profile.totalGames !== undefined && (
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Games Owned</span>
                        <span className="text-white">{profile.totalGames}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-2">
                      <span className="text-zinc-400">Profile Visibility</span>
                      <span className={isPrivate ? "text-red-400" : "text-emerald-400"}>
                        {isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-500" />
                    Ban Status
                  </h2>
                  {profile.bans ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">VAC Status</span>
                        <span className="flex items-center gap-2">
                          {profile.bans.VACBanned ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-400">{profile.bans.NumberOfVACBans} ban(s)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-400">Clean</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Game Bans</span>
                        <span className="flex items-center gap-2">
                          {profile.bans.NumberOfGameBans > 0 ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-400">{profile.bans.NumberOfGameBans} ban(s)</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-400">None</span>
                            </>
                          )}
                        </span>
                      </div>
                      {profile.bans.DaysSinceLastBan > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                          <span className="text-zinc-400">Days Since Last Ban</span>
                          <span className="text-amber-400">{profile.bans.DaysSinceLastBan} days</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                        <span className="text-zinc-400">Community Ban</span>
                        <span className="flex items-center gap-2">
                          {profile.bans.CommunityBanned ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-400">Banned</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-400">None</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Trade Ban</span>
                        <span className="flex items-center gap-2">
                          {profile.bans.EconomyBan !== "none" ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-400">{profile.bans.EconomyBan}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-emerald-400">None</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-500 text-sm py-4 text-center">
                      Ban status information unavailable
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "weapons" && stats && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-amber-500" />
                Weapon Statistics
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weapons.map((weapon) => {
                  const kills = stats[weapon.key as keyof GameStats] as number;
                  return (
                    <div key={weapon.name} className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30 hover:border-amber-900/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 bg-zinc-700/30 rounded-lg flex items-center justify-center p-2">
                          <img
                            src={weapon.image}
                            alt={weapon.name}
                            className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{weapon.name}</p>
                          <p className="text-2xl font-bold text-amber-400">{formatNumber(kills)}</p>
                          <p className="text-xs text-zinc-500">kills</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "graphs" && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <TrendingUp className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Performance Graphs</h3>
                <p className="text-zinc-500 max-w-md">
                  Detailed performance graphs and trend analysis coming soon. Track your improvement over time.
                </p>
              </div>
            </div>
          )}

          {activeTab === "maps" && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Map className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Map Statistics</h3>
                <p className="text-zinc-500 max-w-md">
                  Detailed map-specific statistics coming soon. See your win rates and performance on each map.
                </p>
              </div>
            </div>
          )}

          {activeTab === "matches" && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <History className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Match History</h3>
                <p className="text-zinc-500 max-w-md">
                  Recent match history coming soon. Review your past games and track your progress.
                </p>
              </div>
            </div>
          )}

          {activeTab === "playedWith" && (
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <UserPlus className="w-16 h-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Played With</h3>
                <p className="text-zinc-500 max-w-md">
                  See players you frequently play with coming soon. Track your team&apos;s performance together.
                </p>
              </div>
            </div>
          )}

          </div>

        {isPrivate && (
          <div className="mt-6 p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm text-zinc-400">
                <span className="font-semibold text-amber-400">Private Profile:</span> Some information may be unavailable due to privacy settings.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
