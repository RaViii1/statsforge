"use client";

import { Book } from "lucide-react";
import { SummonerData, ChampionMastery } from "@/app/types/lolInterfaces";
import { getChampionNameById } from "@/lib/champion-data";

interface SummonerProfileHeaderProps {
  summonerData: SummonerData;
  championMastery: ChampionMastery[];
  server: string;
}

export function SummonerProfileHeader({ summonerData, championMastery, server }: SummonerProfileHeaderProps) {
  // Get highest mastery champion for background
  const highestMasteryChampion = championMastery.length > 0 
    ? championMastery.reduce((prev, current) => 
        (prev.championPoints > current.championPoints) ? prev : current
      )
    : null;

  const highestMasteryChampionName = highestMasteryChampion 
    ? getChampionNameById(highestMasteryChampion.championId)
    : null;

  const highestMasterySplashArt = highestMasteryChampion && highestMasteryChampionName
    ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${highestMasteryChampionName.toLowerCase()}/skins/base/images/${highestMasteryChampionName.toLowerCase()}_splash_centered_0.jpg`
    : null;

  return (
    <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-800 relative">
      {/* Champion Splash Art Background */}
      {highestMasterySplashArt && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${highestMasterySplashArt})`,
            backgroundPosition: 'right 0% top 20%'
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/95 to-zinc-950/40"></div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-zinc-750"></div>
        </div>
      )}
      
      {/* Summoner Info Content */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-6">
          {/* Profile Icon */}
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-orange-600 shadow-2xl shadow-orange-900/50 hover:scale-105 hover:border-orange-500 transition-all">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${summonerData.profileIconId}.png`}
              alt="Profile Icon"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Level */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                {summonerData.gameName}
                <span className="text-zinc-400"> #{summonerData.tagLine}</span>
              </h1>
              <span className="px-2 py-1 bg-orange-950/80 border border-orange-600/50 rounded-lg text-orange-400 text-sm font-semibold uppercase backdrop-blur-sm">
                {server}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
                <Book className="w-5 h-5 text-orange-500" />
                <span className="text-zinc-400 text-md">Level {summonerData.summonerLevel}</span>
              </div>
              {highestMasteryChampionName && (
                <div className="px-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg backdrop-blur-sm">
                  <span className="text-sm text-zinc-400">Main Champion: </span>
                  <span className="text-md font-semibold text-orange-500">{highestMasteryChampionName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
