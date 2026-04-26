"use client";

import { Match, MatchParticipant } from "@/app/types/lolInterfaces";
import { getChampionImage } from "@/lib/lol/lolfunctions";

interface MatchPerformanceTabProps {
  match: Match;
  summonerPuuid: string;
}

export function MatchPerformanceTab({ match, summonerPuuid }: MatchPerformanceTabProps) {
  // Calculate max values for scaling
  const maxDamageDealt = Math.max(...match.info.participants.map(p => p.totalDamageDealtToChampions));
  const maxDamageTaken = Math.max(...match.info.participants.map(p => p.totalDamageTaken));
  const maxGold = Math.max(...match.info.participants.map(p => p.goldEarned));
  const maxCS = Math.max(...match.info.participants.map(p => p.totalMinionsKilled + p.neutralMinionsKilled));
  const maxVisionScore = Math.max(...match.info.participants.map(p => p.visionScore));

  // Split into blue and red teams
  const blueTeam = match.info.participants.filter(p => p.teamId === 100);
  const redTeam = match.info.participants.filter(p => p.teamId === 200);

  // Reusable stat row component
  const StatRow = ({ 
    participant, 
    value, 
    maxValue, 
    color, 
    isPlayer, 
    isLeftSide 
  }: { 
    participant: MatchParticipant; 
    value: number; 
    maxValue: number; 
    color: string; 
    isPlayer: boolean; 
    isLeftSide: boolean;
  }) => {
    const percent = (value / maxValue) * 100;
    
    if (isLeftSide) {
      return (
        <div className="flex items-center gap-2 mb-2">
          <img
            src={getChampionImage(participant.championId.toString() || "/images/nochampionimage.jpg")}
            alt={participant.championName}
            className="w-6 h-6 rounded-full flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = "/images/nochampionimage.jpg";
            }}
          />
          <span className={`text-xs font-bold w-16 text-right ${isPlayer ? 'text-orange-400' : 'text-zinc-400'}`}>
            {value.toLocaleString()}
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${color} rounded-full`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 rounded-full overflow-hidden flex justify-end">
          <div
            className={`h-full transition-all duration-500 ${color} rounded-full`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`text-xs font-bold w-16 text-left ${isPlayer ? 'text-orange-400' : 'text-zinc-400'}`}>
          {value.toLocaleString()}
        </span>
        <img
          src={getChampionImage(participant.championId.toString() || "/images/nochampionimage.jpg")}
          alt={participant.championName}
          className="w-6 h-6 rounded-full flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src = "/images/nochampionimage.jpg";
          }}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Damage Dealt */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          Damage Dealt to Champions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {blueTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.totalDamageDealtToChampions}
                maxValue={maxDamageDealt}
                color="bg-blue-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={true}
              />
            ))}
          </div>
          <div>
            {redTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.totalDamageDealtToChampions}
                maxValue={maxDamageDealt}
                color="bg-red-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Damage Taken */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          Damage Taken
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {blueTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.totalDamageTaken}
                maxValue={maxDamageTaken}
                color="bg-blue-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={true}
              />
            ))}
          </div>
          <div>
            {redTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.totalDamageTaken}
                maxValue={maxDamageTaken}
                color="bg-red-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gold Earned */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          Gold Earned
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {blueTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.goldEarned}
                maxValue={maxGold}
                color="bg-blue-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={true}
              />
            ))}
          </div>
          <div>
            {redTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.goldEarned}
                maxValue={maxGold}
                color="bg-red-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vision Score */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
          Vision Score
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {blueTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.visionScore}
                maxValue={maxVisionScore}
                color="bg-blue-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={true}
              />
            ))}
          </div>
          <div>
            {redTeam.map((p, idx) => (
              <StatRow
                key={idx}
                participant={p}
                value={p.visionScore}
                maxValue={maxVisionScore}
                color="bg-red-500"
                isPlayer={p.puuid === summonerPuuid}
                isLeftSide={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}