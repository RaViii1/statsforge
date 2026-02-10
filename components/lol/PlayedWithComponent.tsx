"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Match } from "@/app/types/lolInterfaces";

interface TeammateStats {
  puuid: string;
  gameName: string;
  tagLine: string;
  profileIconId?: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winrate: number;
}

interface FrequentTeammatesCardProps {
  matches: Match[];
  matchesLoaded: number;
  summonerPuuid: string;
  onPlayerClick: (gameName: string, tagLine: string) => void;
}

export function PlayedWithComponent({ 
  matches, 
  summonerPuuid,
  matchesLoaded,
  onPlayerClick 
}: FrequentTeammatesCardProps) {
  const [teammateStats, setTeammateStats] = useState<TeammateStats[]>([]);

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    const teammatesMap = new Map<string, TeammateStats>();

    matches.forEach((match) => {
      const participant = match.info.participants.find(p => p.puuid === summonerPuuid);
      if (!participant) return;

      const playerTeamId = participant.teamId;
      const playerWon = participant.win;

      const teammates = match.info.participants.filter(p => p.teamId === playerTeamId && p.puuid !== summonerPuuid);

      teammates.forEach((teammate) => {
        const key = `${teammate.riotIdGameName}#${teammate.riotIdTagline}`;
        if (teammatesMap.has(key)) {
          const stats = teammatesMap.get(key)!;
          stats.gamesPlayed += 1;
          if (playerWon) {
            stats.wins += 1;
          } else {
            stats.losses += 1;
          }
          stats.winrate = Math.round((stats.wins / stats.gamesPlayed) * 100);
        } else {
          teammatesMap.set(key, {
            puuid: teammate.puuid,
            gameName: teammate.riotIdGameName || "Unknown",
            tagLine: teammate.riotIdTagline || "0000",
            profileIconId: teammate.profileIconId,
            gamesPlayed: 1,
            wins: playerWon ? 1 : 0,
            losses: playerWon ? 0 : 1,
            winrate: playerWon ? 100 : 0,
          });
        }
      });
    });

    const sortedTeammates = Array.from(teammatesMap.values())
      .sort((a, b) => b.gamesPlayed - a.gamesPlayed)
      .slice(0, 10);

    setTeammateStats(sortedTeammates);
  }, [matches, summonerPuuid]);

  if (teammateStats.length === 0) {
    return null;
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
      <h2 className="text-md font-bold text-white mb-4 flex  gap-2 items-end">
        <Users className="w-5 h-5 text-orange-500 " />
        Recent teammates
        <span className="ml-4 text-xs text-zinc-500 font-medium">last {matchesLoaded} matches</span>
      </h2>
      

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs border-b border-zinc-800">
              <th className="text-left text-sm font-medium text-zinc-400 pb-3">Summoner</th>
              <th className="text-center text-xs pr-2 font-medium text-zinc-400 pb-3">Played</th>
              <th className="text-center pr-2 text-xs font-medium text-zinc-400 pb-3">W - L</th>
              <th className="text-center pr-2 text-xs font-medium text-zinc-400 pb-3">Win Ratio</th>
            </tr>
          </thead>
          <tbody>
            {teammateStats.map((teammate) => (
              <tr
                key={`${teammate.gameName}#${teammate.tagLine}`}
                onClick={() => onPlayerClick(teammate.gameName, teammate.tagLine)}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors group"
              >
                {/* Summoner Column */}
                <td className="py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-zinc-700">
                      <img
                        src={teammate.profileIconId
                          ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${teammate.profileIconId}.jpg`
                          : "/images/lol/default.png"}
                        alt="Profile Icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium  text-white group-hover:text-orange-400 transition-colors truncate">
                        {teammate.gameName}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">#{teammate.tagLine}</div>
                    </div>
                  </div>
                </td>

                {/* Played Column */}
                <td className="text-center text-sm text-zinc-300">
                  {teammate.gamesPlayed}
                </td>

                {/* W - L Column */}
                <td className="text-center text-sm">
                  <span className="text-green-400">{teammate.wins}</span>
                  <span className="text-zinc-500"> - </span>
                  <span className="text-red-400">{teammate.losses}</span>
                </td>

                {/* Win Ratio Column */}
                <td className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      teammate.winrate >= 60
                        ? " text-green-400"
                        : teammate.winrate >= 50
                        ? " text-blue-400"
                        : " text-red-400"
                    }`}
                  >
                    {teammate.winrate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
