"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Navbar from "@/Components/navbar";
import Footer from "@/Components/footer";
import TftProfileHeader from "@/components/tft/TftProfileHeader";
import TftMatchItem from "@/components/tft/TftMatchItem";
import { AlertCircle, Trophy, Target, Gamepad2, Loader2, FlameIcon } from 'lucide-react';
import { getRankIcon } from '@/lib/tft/tftfunctions';

export default function TftProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const fetchData = useCallback(async (currentOffset: number = 0, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }
      setError(null);

      let currentProfile = profile;
      if (!profile) {
        const profileRes = await fetch(`/api/tft/profile/${params.server}/${params.username}/${params.tagline}`);
        if (!profileRes.ok) {
          const errorData = await profileRes.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        currentProfile = await profileRes.json();
        setProfile(currentProfile);
      }

      const count = 10;
      const matchesRes = await fetch(`/api/tft/matches/${params.server}/${currentProfile.puuid}?start=${currentOffset}&count=${count}`);
      if (!matchesRes.ok) throw new Error('Failed to fetch matches');
      const matchesData = await matchesRes.json();
      
      const newMatches = matchesData.matches || [];
      
      if (newMatches.length < count) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (append) {
        setMatches(prev => [...prev, ...newMatches]);
      } else {
        setMatches(newMatches);
      }

      offsetRef.current = currentOffset + newMatches.length;

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [params.server, params.username, params.tagline, profile]);

  useEffect(() => {
    if (params.server && params.username && params.tagline) {
      fetchData(0, false);
    }
  }, [params.server, params.username, params.tagline, fetchData]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchData(offsetRef.current, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-orange-500 animate-pulse" />
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
              onClick={() => window.location.href = '/tft'}
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

  const mainRank = profile.ranked?.[0] || { tier: 'UNRANKED', rank: '', leaguePoints: 0, wins: 0, losses: 0 };
  const totalGames = mainRank.wins + mainRank.losses;
  const winRate = totalGames > 0 ? Math.round((mainRank.wins / totalGames) * 100) : 0;

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
          <TftProfileHeader profile={profile} avgPlacement={avgPlacement} server={params.server as string} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 backdrop-blur-sm">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  Ranked Progress
                </h3>
                
                  <div className="space-y-6">
                    <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-sm hover:border-orange-900/50 hover:bg-zinc-800 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={getRankIcon(mainRank.tier)}
                          alt={`${mainRank.tier} ${mainRank.rank}`}
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                            Ranked
                          </h4>
                          <p className="text-lg font-black text-white italic uppercase tracking-tighter">
                            {mainRank.tier} {mainRank.rank}
                          </p>
                          <p className="text-sm font-bold text-orange-500">{mainRank.leaguePoints} LP</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-700/50">
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Avg</p>
                          <p className="text-sm font-bold text-orange-400">#{avgPlacement}/8</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">WR</p>
                          <p className={`text-sm font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>{winRate}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Played</p>
                          <p className="text-sm font-bold text-white">{totalGames}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 mt-4 border border-zinc-800/50 rounded-sm p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex justify-between items-center">
                    History
                    <span className="text-orange-500 lowercase">Last {last10Placements.length} games</span>
                  </h3>
                <div className="grid grid-cols-5 gap-2">
                  {last10Placements.map((p, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square flex items-center justify-center rounded-lg border lg:text-sm lg:font-bold font-black transition-all sm:text-6xl md:font-medium ${
                        p === 1 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                        p === 2 ? 'bg-slate-500/40 border-slate-500/50 text-slate-300 shadow-[0_0_10px_rgba(148,163,184,0.2)]' : 
                        p === 3 ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]' :
                        p <= 4 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 
                        'bg-zinc-800/50 border-zinc-700/50 text-zinc-500'
                      }`}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              </div>

                <div className="bg-zinc-900/50 border border-zinc-800/50  p-6 backdrop-blur-sm">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex justify-between items-center">
                    Placement Stats
                    <span className="text-orange-500 lowercase">last {matches.length}</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((pos) => (

                    <div 
                      key={pos} 
                      className={`flex items-center justify-between py-1 px-3 border rounded-xl ${
                        pos === 1 ? 'bg-yellow-500/20 border-yellow-500/80' :
                        pos === 2 ? 'bg-slate-500/20 border-slate-500/80' :
                        pos === 3 ? 'bg-orange-500/20 border-orange-500/80' :
                        pos <= 4 ? 'bg-orange-500/10 border-orange-500/40' :
                        'bg-zinc-800/30 border-zinc-800'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-300 uppercase">#{pos}</span>
                      <span className="text-lg font-black text-slate-300">{placementDistribution[pos] || 0}</span>
                    </div>

                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-9 space-y-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <span className="w-2.5 h-10 bg-gradient-to-b from-orange-500 to-orange-700 rounded-full"></span>
                  Match History
                </h2>
                <div className="flex gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400">
                    Showing {matches.length} Games
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="bg-zinc-900/20 border-2 border-zinc-800/50 border-dashed rounded-[2.5rem] p-20 text-center">
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
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-900/40 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        {loadingMore ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Load 10 More Games
                            <Target className="w-4 h-4 transition-transform group-hover:rotate-45" />
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
