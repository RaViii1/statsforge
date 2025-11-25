"use client";

import { Clock, Loader2, Search } from "lucide-react";
import { Match } from "@/app/types/lolInterfaces";
import { MatchCard } from "./MatchCard";

interface MatchHistoryTabProps {
  matches: Match[];
  loading: boolean;
  loadingMore: boolean;
  summonerPuuid: string;
  server: string;
  rankedData: any[];
  onLoadMore: () => void;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function MatchHistoryTab({ 
  matches, 
  loading, 
  loadingMore,
  summonerPuuid,
  server,
  rankedData,
  onLoadMore,
  onPlayerClick
}: MatchHistoryTabProps) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-orange-500" />
        Recent Matches
      </h2>
      
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading match history...</p>
        </div>
      ) : matches.length > 0 ? (
        <>
          <div className="space-y-3 mb-6">
            {matches.map((match: Match) => (
              <MatchCard
                key={match.metadata.matchId}
                match={match}
                summonerPuuid={summonerPuuid}
                server={server}
                rankedData={rankedData}
                onPlayerClick={onPlayerClick}
              />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-900/40 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load 10 More Games"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          <Search className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
          <p className="text-lg font-medium mb-2">No matches found</p>
          <p className="text-sm">
            This player hasn't played any recent games
          </p>
        </div>
      )}
    </div>
  );
}
