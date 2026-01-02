"use client";

import Image from "next/image";
import { Globe, User, Trophy, Target } from "lucide-react";

interface TFTProfileHeaderProps {
  profile: {
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    ranked?: Array<{
      tier: string;
      rank: string;
      leaguePoints: number;
    }>;
    
  };
  server: string;
  avgPlacement: string;
}

export default function TftProfileHeader({
  profile,
  server = "euw1",
  avgPlacement,
}: TFTProfileHeaderProps) {
  const profileIconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profile?.profileIconId || 0}.jpg`;
  const mainRank = profile?.ranked?.[0] || { tier: 'UNRANKED', rank: '', leaguePoints: 0 };

  const safeServer = server || "euw1";

  return (
    <div className="relative p-8 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden mb-12 shadow-2xl">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -ml-32 -mb-32" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-10">
        {/* Profile Icon Section */}
        <div className="relative">
          <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-orange-500/30 relative group shadow-2xl shadow-orange-500/10">
            <img
              src={profileIconUrl}
              alt={profile?.gameName || "Tactician"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-zinc-900 border-2 border-orange-500/50 rounded-2xl px-4 py-1.5 shadow-xl">
            <span className="text-sm font-black text-orange-500 italic tracking-tighter">LVL {profile?.summonerLevel}</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              {profile?.gameName || "Unknown"}
              <span className="text-zinc-600 font-medium not-italic ml-2 text-3xl">#{profile?.tagLine || "000"}</span>
            </h1>
            <div className="flex gap-2">
              <span className="px-4 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-black text-orange-500 uppercase tracking-widest">
                {safeServer.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            {/* Rank Badge */}
            <div className="flex items-center gap-3 px-6 py-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 shadow-inner group hover:border-orange-500/30 transition-all">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Current Rank</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">
                  {mainRank.tier} {mainRank.rank} 
                  <span className="text-orange-500 ml-2">{mainRank.leaguePoints} LP</span>
                </p>
              </div>

            </div>

            {/* Avg Placement Badge */}
            <div className="flex items-center gap-3 px-6 py-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 shadow-inner group hover:border-orange-500/30 transition-all">
              <Target className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Avg. Place</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">
                  #{avgPlacement} <span className="text-zinc-500 font-medium text-[10px] ml-1">Lately</span>
                </p>
              </div>
            </div>

            {/* Region Badge */}
            <div className="flex items-center gap-3 px-6 py-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 shadow-inner">
              <Globe className="w-5 h-5 text-zinc-600" />
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Server</p>
                <p className="text-sm font-black text-zinc-300 uppercase tracking-tight">{safeServer.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
