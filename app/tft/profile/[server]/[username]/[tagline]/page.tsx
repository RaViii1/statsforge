"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TftProfileHeader from "@/components/tft/TftProfileHeader";
import TftMatchItem from "@/components/tft/TftMatchItem";
import { TftRankedStatsSection } from "@/components/tft/TftRankedStatsSection";
import { TftTeamPlanner } from "@/components/tft/TftTeamPlanner";
import { AlertCircle, Gamepad2, Loader2, Anvil, Clock, Award, Target } from 'lucide-react';

export default function TftProfilePage() {
  const params = useParams();
  const router = useRouter();
  const server = params?.server as string;
  const username = params?.username as string;
  const tagline = params?.tagline as string;

  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [rankedData, setRankedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const fetchRankedData = async (puuid: string) => {
    try {
      const response = await fetch(`/api/tft/ranked/${server}/${puuid}`);
      if (response.ok) {
        const data = await response.json();
        setRankedData(data.rankedData || []);
      }
    } catch (err) {
      console.error("Failed to fetch ranked data:", err);
    }
  };

  const fetchMatches = async (puuid: string, start: number, count: number, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setMatchesLoading(true);
      }

      const response = await fetch(`/api/tft/matches/${server}/${puuid}?start=${start}&count=${count}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data = await response.json();
      
        const newMatches = data.matches || [];
        const totalFetched = data.totalMatches || newMatches.length;
        
        if (totalFetched < count) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (append) {
          setMatches(prev => [...prev, ...newMatches]);
        } else {
          setMatches(newMatches);
        }

        offsetRef.current = start + totalFetched;
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setMatchesLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/tft/profile/${server}/${username}/${tagline}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);

        // Parallel fetch matches and ranked data (13 = 10 + 3 extra rows)
        await Promise.all([
          fetchMatches(data.puuid, 0, 13, false),
          fetchRankedData(data.puuid),
        ]);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (server && username && tagline) {
      fetchProfileData();
    }
  }, [server, username, tagline]);

  const loadMore = () => {
    if (loadingMore || !hasMore || !profile) return;
    fetchMatches(profile.puuid, offsetRef.current, 10, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Anvil className="w-8 h-8 text-orange-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-zinc-400 font-bold tracking-widest uppercase text-sm">Loading Convergence Data</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-12 rounded-[2.5rem] max-w-md w-full text-center backdrop-blur-xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Tactician Not Found</h2>
            <p className="text-zinc-500 mb-8 font-medium">{error || 'Could not find the player in this region.'}</p>
            <button 
              onClick={() => router.push('/tft')}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-900/20"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const allPlacements = matches.map(m => m.info.participants.find((p: any) => p.puuid === profile.puuid)?.placement || 8);
  const avgPlacement = allPlacements.length > 0 
    ? (allPlacements.reduce((a, b) => a + b, 0) / allPlacements.length).toFixed(1)
    : '0.0';

  const last10Placements = allPlacements.slice(0, 10);

  const placementDistribution = allPlacements.reduce((acc: Record<number, number>, p: number) => {
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-orange-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-orange-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-amber-600/5 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-8 relative z-10">
        <TftProfileHeader profile={{...profile, ranked: rankedData}} avgPlacement={avgPlacement} server={server} />

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mt-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <TftRankedStatsSection rankedData={rankedData} />
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Recent Placements
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {last10Placements.map((p, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-bold transition-all ${
                      p === 1 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 
                      p === 2 ? 'bg-slate-500/20 border-slate-500/50 text-slate-300' : 
                      p === 3 ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' :
                      p <= 4 ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 
                      'bg-zinc-800/50 border-zinc-700/50 text-zinc-500'
                    }`}
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Placement Distribution
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((pos) => (
                  <div 
                    key={pos} 
                    className={`flex items-center justify-between py-2 px-4 border rounded-xl ${
                      pos === 1 ? 'bg-yellow-500/10 border-yellow-500/40' :
                      pos === 2 ? 'bg-slate-500/10 border-slate-500/40' :
                      pos === 3 ? 'bg-orange-500/10 border-orange-500/40' :
                      pos <= 4 ? 'bg-orange-500/5 border-orange-500/20' :
                      'bg-zinc-800/20 border-zinc-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-zinc-500">#{pos}</span>
                    <span className="text-base font-bold text-white">{placementDistribution[pos] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        
            {/* Right Main Content */}
            <div className="min-w-0 space-y-6">
              
              
              <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">

              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-orange-500" />
                Recent Matches
              </h2>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400">
                  {matches.length} Games Loaded
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              {matchesLoading && matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                  <p className="text-zinc-400 font-bold">Summoning match history...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-20 text-center">
                  <Gamepad2 className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold text-lg">No matches found in the Convergence.</p>
                </div>
              ) : (
                <>
                  {matches.map((match) => (
                    <TftMatchItem key={match.metadata.match_id} match={match} puuid={profile.puuid} />
                  ))}
                  
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto mt-8 shadow-lg shadow-orange-900/20"
                    >
                      {loadingMore ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Load 10 More Games
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
