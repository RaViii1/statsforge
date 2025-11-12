"use client";
import { Search, TrendingUp, Trophy, Target, Swords, Shield, Clock, ArrowLeft, Loader2, Anvil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export default function ProfilePage() {
  const params = useParams();
  const server = params?.server as string;
  const username = params?.username as string;
  const tagline = params?.tagline as string;

  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedGameName = decodeURIComponent(username);
  const decodedTagLine = decodeURIComponent(tagline);

  useEffect(() => {
    const fetchSummonerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/lol/profile/${server}/${username}/${tagline}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch summoner data");
        }

        const data = await response.json();
        setSummonerData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSummonerData();
  }, [server, username, tagline]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Anvil className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">StatsForge</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-zinc-400">Loading player data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="p-8 bg-red-950/30 border border-red-900/30 rounded-xl text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
              <p className="text-zinc-400 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
              >
                Search Another Player
              </Link>
            </div>
          </div>
        )}

        {/* Success State - Show Profile */}
        {!loading && !error && summonerData && (
          <>
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  {/* Profile Icon */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-orange-600 shadow-lg shadow-orange-900/30">
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summonerData.profileIconId}.png`}
                      alt="Profile Icon"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold text-white">
                        {summonerData.gameName}
                        <span className="text-zinc-500">#{summonerData.tagLine}</span>
                      </h1>
                      <span className="px-3 py-1 bg-orange-950/50 border border-orange-900/30 rounded-lg text-orange-500 text-sm font-medium uppercase">
                        {server}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-lg">Level {summonerData.summonerLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Trophy, label: "Summoner Level", value: summonerData.summonerLevel.toString(), color: "orange" },
                { icon: Target, label: "Profile Icon", value: `#${summonerData.profileIconId}`, color: "orange" },
                { icon: Shield, label: "PUUID", value: summonerData.puuid.substring(0, 8) + "...", color: "orange" },
                { icon: Swords, label: "Region", value: server.toUpperCase(), color: "orange" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-orange-900/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500">{value}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent Matches Placeholder */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-500" />
                Recent Matches
              </h2>
              
              <div className="space-y-4">
                <div className="text-center py-12 text-zinc-400">
                  <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                  <p className="text-lg font-medium mb-2">Match history coming soon</p>
                  <p className="text-sm">
                    We're working on bringing you detailed match statistics
                  </p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="p-6 bg-orange-950/30 border border-orange-900/30 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Want to track your stats automatically?
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Sign in with your Riot Games account to sync your profile and get real-time match updates.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-orange-900/30"
                  >
                    Connect Riot Account
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
