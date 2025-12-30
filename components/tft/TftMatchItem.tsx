"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users, Clock, Star } from "lucide-react";
import { 
  ParticipantDto, 
  getTFTUnitIcon, 
  getTFTItemIcon, 
  getPlacementColor, 
  getPlacementBg,
  formatGameDuration,
  formatTimestamp,
  getQueueName
} from "@/lib/tft/tftfunctions";
import TftTraitIcon from "./TftTraitIcon";

interface TFTMatchCardProps {
  match: any; // MatchDto
  puuid: string;
}

export default function TFTMatchCard({ match, puuid }: TFTMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const me = match.info.participants.find((p: ParticipantDto) => p.puuid === puuid);
  
  if (!me) return null;

  const participantsSorted = [...match.info.participants].sort((a, b) => a.placement - b.placement);
  const placementColor = getPlacementColor(me.placement);
  const placementBg = getPlacementBg(me.placement);

  const getTraitStyleClasses = (tier_current: number, tierTotal: number) => {
    // if (tierTotal === 1 && tier_current > 0) {
    //   return "bg-rose-500/20 border-rose-500/50 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
    // }
    switch (tier_current) {
      case 1: // Bronze
        return "bg-orange-900/30 border-orange-700/40 text-orange-200";
      case 2: // Silver
        return "bg-zinc-400/20 border-zinc-400/50 text-zinc-300";
      case 3: // Gold
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.1)]";
      case 4: // Chromatic
        return "bg-purple-500/30 border-purple-500/50 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      default:
        return "bg-zinc-950/50 border-zinc-800 text-zinc-400";
    }
  };

  return (
    <div className={`rounded-xl border transition-all overflow-hidden mb-4 ${placementBg}`}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Match Info & Placement */}
          <div className="flex md:flex-col justify-between md:justify-center items-center md:items-start gap-2 md:w-32 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/50 pb-4 md:pb-0 md:pr-4">
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                {getQueueName(match.info.queue_id)}
              </p>
              <p className="text-xs text-zinc-500 font-medium">
                {formatTimestamp(match.info.game_datetime)}
              </p>
            </div>
            <div className="text-center md:text-left">
              <p className={`text-3xl font-black ${placementColor}`}>
                #{me.placement}
              </p>
              <p className="text-xs font-bold text-zinc-500 uppercase">
                {me.placement <= 4 ? "Victory" : "Defeat"}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatGameDuration(match.info.game_length)}
              </p>
            </div>
          </div>

          {/* Synergies & Units */}
          <div className="flex-1 space-y-4">
              {/* Active Synergies */}
              <div className="flex flex-wrap gap-2">
                {me.traits
                  .filter((t: any) => t.tier_current > 0)
                  .sort((a: any, b: any) => b.tier_current - a.tier_current)
                  .map((trait: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg group transition-all border ${getTraitStyleClasses(trait.tier_current, trait.tier_total)}`}
                        title={`${trait.name}: Tier ${trait.tier_current}/${trait.tier_total}`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center rounded p-0.5 bg-black/20`}>
                          <TftTraitIcon 
                            traitId={trait.name} 
                            setNumber={match.info.tft_set_number}
                            tierStyle={trait.style}
                            className="w-full h-full object-contain brightness-125"
                          />
                        </div>
                      <div className="flex flex-col">
                      {/* <span className="text-xs font-bold">style: {trait.style}</span>
                      <span className="text-xs font-bold">current: {trait.tier_current}</span>
                      <span className="text-xs font-bold">total: {trait.tier_total}</span> */}
                      <span className="text-xs font-bold">{trait.num_units}</span>
                    </div>
                    </div>
                  ))}
              </div>

            {/* Units & Items */}
            <div className="flex flex-wrap gap-3">
              {me.units.map((unit: any, idx: number) => (
                <div key={idx} className="relative group">
                  <div className="relative">
                    {/* Star Level */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
                      {[...Array(unit.tier)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    
                    {/* Unit Icon */}
                      <div className={`w-12 h-12 rounded-lg border-2 overflow-hidden bg-zinc-900 transition-transform group-hover:scale-110 ${
                        unit.rarity === 6 ? 'border-orange-500' : 
                        unit.rarity === 5 ? 'border-orange-500' : 
                        unit.rarity === 4 ? 'border-pink-500' :
                        unit.rarity === 2 ? 'border-blue-500' :
                        unit.rarity === 1 ? 'border-emerald-500' : 
                        unit.rarity === 0 ? 'border-gray-500' : 'border-slate-200'
                      }`}>
                        <img 
                          src={getTFTUnitIcon(unit.character_id, match.info.tft_set_number)} 
                          alt={unit.character_id}
                          className="w-full h-full object-cover"
                        />
                      </div>

                    {/* Items */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex -gap-1 z-10">
                      {unit.itemNames?.map((itemName: string, i: number) => (
                        <div key={i} className="relative w-5 h-5 hover:scale-150 transition-all hover:z-20">
                          <div className="absolute inset-[15%] overflow-hidden rounded-sm bg-zinc-950">
                            <img 
                              src={getTFTItemIcon(itemName)} 
                              alt={itemName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lobby Summary & Expand */}
          <div className="flex md:flex-col justify-between md:justify-center items-center gap-4 shrink-0 md:pl-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950/50 border border-zinc-800 rounded-lg">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-300">Lobby</span>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-zinc-800/50 rounded-lg transition-all text-zinc-500 hover:text-white"
            >
              {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Lobby View */}
      {isExpanded && (
        <div className="border-t border-zinc-800/50 bg-zinc-950/30 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {participantsSorted.map((p: ParticipantDto, idx: number) => (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  p.puuid === puuid 
                    ? 'bg-orange-500/10 border-orange-500/30' 
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${getPlacementColor(p.placement)}`}>
                  #{p.placement}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {p.riotIdGameName || "Hidden"}
                    <span className="text-zinc-500 ml-1">#{p.riotIdTagline || "???"}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Level {p.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
