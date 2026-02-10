"use client";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import LolBanner from "@/components/LolBaner";
import NavbarLol from "@/components/NavbarLol";
import Footer from "@/components/Footer";
import ChampionStatsCard from "@/components/lol/ChampionStatsCard";

import { SummonerData, MatchHistory, ChampionMastery, RankedEntry } from "@/app/types/lolInterfaces";

// Import new modular components
import { SummonerProfileHeader } from "@/components/lol/SummonerProfileHeader";
import { RankedStatsSection } from "@/components/lol/RankedStatsSection";
import { MatchHistoryTab } from "@/components/lol/MatchHistoryTab";
import { ChampionMasteryTab } from "@/components/lol/ChampionMasteryTab";
import { LiveGameTab } from "@/components/lol/LiveGameTab";
import { PlayedWithComponent } from "@/components/lol/PlayedWithComponent";


export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const server = params?.server as string;
  const username = params?.username as string;
  const tagline = params?.tagline as string;

  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchHistory | null>(null);
  const [championMastery, setChampionMastery] = useState<ChampionMastery[]>([]);
  const [rankedData, setRankedData] = useState<RankedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [masteryLoading, setMasteryLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "mastery" | "livegame">("matches");
  const [liveGameData, setLiveGameData] = useState<any>(null);
  const [liveGameLoading, setLiveGameLoading] = useState(false);
  const [isInGame, setIsInGame] = useState(false);
  
  const offsetRef = useRef(0);

  // Check for live game when switching to livegame tab
  useEffect(() => {
    if (summonerData && activeTab === "livegame") {
      checkLiveGame();
    }
  }, [activeTab, summonerData]);

  const checkLiveGame = async () => {
    if (!summonerData) return;
    
    try {
      setLiveGameLoading(true);
      const response = await fetch(`/api/lol/spectator/${server}/${summonerData.puuid}`);
      
      if (!response.ok) {
        setIsInGame(false);
        setLiveGameData(null);
        return;
      }
      
      const text = await response.text();
      if (!text || text.trim() === '') {
        setIsInGame(false);
        setLiveGameData(null);
        return;
      }
      
      const data = JSON.parse(text);
      
      if (data.inGame) {
        setIsInGame(true);
        setLiveGameData(data.gameData);
      } else {
        setIsInGame(false);
        setLiveGameData(null);
      }
    } catch (err) {
      console.error("Failed to check live game:", err);
      setIsInGame(false);
      setLiveGameData(null);
    } finally {
      setLiveGameLoading(false);
    }
  };

  const fetchMatchHistory = async (puuid: string, start: number, count: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setMatchesLoading(true);
      }
      
      const matchResponse = await fetch(`/api/lol/matches/${server}/${puuid}?count=${count}&start=${start}`);
      
      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        if (isLoadMore) {
          setMatchHistory((prev: MatchHistory | null) => prev ? {
            ...prev,
            matches: [...prev.matches, ...matchData.matches]
          } : matchData);
        } else {
          setMatchHistory(matchData);
        }
        offsetRef.current = start + count;
      }
    } catch (err) {
      console.error("Failed to fetch match history:", err);
    } finally {
      setMatchesLoading(false);
      setLoadingMore(false);
    }
  };

  const refreshMatches = () => {
    if (summonerData && !matchesLoading) {
      offsetRef.current = 0;
      fetchMatchHistory(summonerData.puuid, 0, 10, false);
    }
  };

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

        Promise.all([
          fetchMatchHistory(data.puuid, 0, 10, false),
          fetchRankedData(data.puuid),
          fetchChampionMastery(data.puuid),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchRankedData = async (puuid: string) => {
      try {
        const rankedResponse = await fetch(`/api/lol/ranked/${server}/${puuid}`);
        if (rankedResponse.ok) {
          const data = await rankedResponse.json();
          setRankedData(data.rankedData);
        }
      } catch (err) {
        console.error("Failed to fetch ranked data:", err);
      }
    };

    fetchSummonerData();
  }, [server, username, tagline]);

  const fetchChampionMastery = async (puuid: string) => {
    if (championMastery.length > 0) return;
    
    try {
      setMasteryLoading(true);
      const response = await fetch(`/api/lol/mastery/${server}/${puuid}`);
      if (response.ok) {
        const data = await response.json();
        setChampionMastery(data.masteries);
      }
    } catch (err) {
      console.error("Failed to fetch champion mastery:", err);
    } finally {
      setMasteryLoading(false);
    }
  };

  const loadMoreMatches = () => {
    if (summonerData && !loadingMore) {
      const currentOffset = offsetRef.current;
      fetchMatchHistory(summonerData.puuid, currentOffset, 10, true);
    }
  };

  const handlePlayerClick = (gameName: string, tagLine: string) => {
    router.push(`/lol/profile/${server}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavbarLol />

      <main className="relative max-w-[1400px] mx-auto px-6 lg:px-8 pb-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-zinc-400">Loading player data...</p>
            
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto my-16">
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
            {/* Summoner Profile Header */}
            <SummonerProfileHeader 
              summonerData={summonerData}
              championMastery={championMastery}
              server={server}
            />

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b border-zinc-800">
              <button
                onClick={() => setActiveTab("matches")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === "matches"
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Recent Matches
                {activeTab === "matches" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("mastery")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === "mastery"
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Champion Mastery
                {activeTab === "mastery" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("livegame")}
                className={`px-4 py-3 font-semibold transition-all relative ${
                  activeTab === "livegame"
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1 group hover:text-white transition-all transition-100">
                  <span className="bg-orange-700 text-zinc-400 rounded-md py-1 px-1.5 shadow shadow-orange-700 group-hover:text-white">
                    Live
                  </span>
                  Game
                </span>
                {activeTab === "livegame" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            </div>

            {/* Tab Content with Two-Column Layout */}
            {activeTab === "matches" && matchHistory && (
              <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
                {/* Left Sidebar */}
                <div className="space-y-6">
                  <RankedStatsSection rankedData={rankedData} />
                  {rankedData.length > 0 && (
                      <ChampionStatsCard server={server} puuid={summonerData.puuid} />
                    )}
                  <PlayedWithComponent
                    matches={matchHistory.matches}
                    matchesLoaded={matchHistory.matches.length || 0}
                    summonerPuuid={summonerData.puuid}
                    onPlayerClick={handlePlayerClick}
                  />
                  
                </div>

                {/* Right Main Content */}
                <div className="min-w-0 mb-8">
                  <MatchHistoryTab
                    matches={matchHistory.matches}
                    loading={matchesLoading}
                    loadingMore={loadingMore}
                    summonerPuuid={summonerData.puuid}
                    server={server}
                    rankedData={rankedData}
                    onLoadMore={loadMoreMatches}
                    onPlayerClick={handlePlayerClick}
                    onRefresh={refreshMatches}
                  />
                </div>
              </div>
            )}

            {activeTab === "mastery" && (
              <ChampionMasteryTab
                championMastery={championMastery}
                loading={masteryLoading}
              />
            )}

            {activeTab === "livegame" && (
              <LiveGameTab
                summonerData={summonerData}
                isInGame={isInGame}
                liveGameData={liveGameData}
                loading={liveGameLoading}
                onRefresh={checkLiveGame}
                onPlayerClick={handlePlayerClick}
              />
            )}

            <LolBanner />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
