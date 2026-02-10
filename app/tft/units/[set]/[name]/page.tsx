"use client";

import { use, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";
import { CurrentSetNumber, getCostBorderColor } from "@/lib/tft/champions";
import { getTFTUnitIcon, getTFTItemIcon, getTFTTraitIcon, getTFTUnitSplash } from "@/lib/tft/tftfunctions";
import { TRAIT_DESCRIPTIONS } from "@/lib/tft/tftTraits";
import SvgIcon from "@/components/SvgIcon";
import { TFTChampion } from "@/lib/tft/champions";
import Navbar from "@/components/Navbar";
import NavbarTft from "@/components/NavbarTft";

type SvgIconType = 'ap' | 'dmg' | 'health' | 'armor' | 'mr' | 'crit' | 'attackspeed' | 'mana' | 'dps' | 'gold';

const STAT_ICON_MAP: Record<string, { type: SvgIconType; color: string }> = {
  'AP': { type: 'ap', color: 'text-cyan-200' },
  'AD': { type: 'dmg', color: 'text-orange-500' },
  'Health': { type: 'health', color: 'text-emerald-500' },
  'Armor': { type: 'armor', color: 'text-orange-500' },
  'MR': { type: 'mr', color: 'text-purple-500' },
  'Crit': { type: 'crit', color: 'text-red-400' },
  'AS': { type: 'attackspeed', color: 'text-[#F4C452]' },
  'Mana': { type: 'mana', color: 'text-[#26c2f4]' },
} as const;

interface StatTextProps {
  text?: any;
  className?: string;
}

export function StatText({ text, className = "" }: StatTextProps) {
  if (!text) return null;
  
  let segments: string[] = [];
  if (typeof text === 'string') {
    segments = text.split(',').map(segment => segment.trim());
  } else if (typeof text === 'object') {
    // If it's an object (like the JSONB from DB), convert to segments
    segments = Object.entries(text as any)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${value} ${key.toUpperCase()}`);
  }

  if (segments.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {segments.map((segment, index) => {
        const statEntry = Object.entries(STAT_ICON_MAP).find(([keyword]) => 
          segment.toUpperCase().includes(keyword.toUpperCase())
        );
        if (!statEntry) return <span key={index} className="text-xs text-zinc-400">{segment}</span>;
        const [keyword, { type, color }] = statEntry;
        const value = segment.toUpperCase().replace(keyword.toUpperCase(), '').trim();
        return (
          <div key={index} className="flex items-center gap-1">
            <span className={`text-xs font-bold ${color}`}>{value}</span>
            <SvgIcon type={type} size={14} className={color} />
          </div>
        );
      })}
    </div>
  );
}

export default function UnitDetailPage({ params }: { params: Promise<{ set: string; name: string }> }) {
  const resolvedParams = use(params);
  const setNumber = parseInt(resolvedParams.set);
  const unitName = decodeURIComponent(resolvedParams.name);

  const [champion, setChampion] = useState<TFTChampion | null>(null);
  const [allChampions, setAllChampions] = useState<TFTChampion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [champRes, allChampsRes] = await Promise.all([
          fetch(`/api/tft/champions?name=${unitName}&set=${setNumber}`),
          fetch(`/api/tft/champions?set=${setNumber}`)
        ]);

        if (champRes.ok) {
          const data = await champRes.json();
          setChampion(data);
        }

        if (allChampsRes.ok) {
          const data = await allChampsRes.json();
          setAllChampions(data);
        }
      } catch (error) {
        console.error("Error fetching champion details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setNumber, unitName]);

  const traitChampions = useMemo(() => {
    const result: Record<string, TFTChampion[]> = {};
    if (champion) {
      champion.traits.forEach(trait => {
        result[trait] = allChampions.filter(c => c.traits.includes(trait));
      });
    }
    return result;
  }, [champion, allChampions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading Unit Details...</p>
      </div>
    );
  }

  if (!champion) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-black text-white mb-2">Unit Not Found</h2>
          <Link href="/tft/units" className="text-orange-500 hover:underline font-bold">
            Back to Units
          </Link>
        </div>
      </div>
    );
  }

  const stats = champion.stats?.stars?.[0] || { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 };
  const speed = champion.stats?.speed || 0;
  const mana = champion.stats?.mana || 0;
  const range = champion.stats?.range || 1;
  const ability = champion.ability || { name: "Unknown Ability", description: { active: "Details unavailable." } };
  const bestItems = champion.tft_champion_best_items || [];

  const RangeIndicator = ({ range }: { range: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-5 rounded-sm ${i <= range ? "bg-orange-500" : "bg-zinc-700"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      <NavbarTft/>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/tft/units"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Units</span>
        </Link>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          <div className="space-y-6">
            <div className={`relative rounded-3xl overflow-hidden border-2 ${getCostBorderColor(champion.cost)} bg-zinc-900/50 backdrop-blur-xl`}>
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent z-10"></div>
              <img
                src={champion.image_path || "images/nochampionimage.png"}
                alt={champion.name}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `images/nochampionimage.png`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex items-center gap-3 mb-3">
                  {champion.traits.map((trait) => (
                    <div key={trait} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-full text-xs text-zinc-200 font-bold">
                      <img src={getTFTTraitIcon(trait)} alt={trait} className="w-4 h-4" />
                      {trait}
                    </div>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">{champion.name}</h1>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-black text-xl">{champion.cost}</span>
                    <SvgIcon type="gold" size={24} className={`ml-1 text-amber-400`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-5">Recommended Items</h3>
              <div className="space-y-3">
                {bestItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl border border-zinc-700/50 transition-all group">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl border-2 border-zinc-600 overflow-hidden bg-zinc-800 shrink-0 group-hover:border-orange-500/50 transition-colors">
                        <img src={item.image_path || "images/noitemimage.png"} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-orange-400 font-bold truncate pb-1">{item.name}</p>
                      <StatText text={item.stats} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-5">Ability</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={`https://raw.communitydragon.org/latest/game/assets/characters/${champion.id.toLowerCase()}/hud/${champion.id.toLowerCase()}_square.tft_set${setNumber}.png`}
                    alt={ability.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-white italic">{ability.name}</h4>
                  {ability.description?.passive && (
                    <div className="mt-2">
                      <h4 className="text-orange-500 font-black text-xs">Passive:</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed mt-1">{ability.description.passive}</p>
                    </div>
                  )}
                  {ability.description?.active && (
                    <div className="mt-2">
                      <h4 className="text-orange-500 font-black text-xs">Active:</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed mt-1">{ability.description.active}</p>
                    </div>
                  )}
                </div>
              </div>
              {(ability.heal || ability.damage || ability.shield || ability.stun || ability.special) && (
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800">
                  {ability.damage && (
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Damage</p>
                      <p className="text-lg text-orange-400 font-black">{ability.damage}</p>
                    </div>
                  )}
                  {ability.heal && (
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Healing</p>
                      <p className="text-lg text-emerald-400 font-black">{ability.heal}</p>
                    </div>
                  )}
                  {ability.shield && (
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Shield</p>
                      <p className="text-lg text-blue-400 font-black">{ability.shield}</p>
                    </div>
                  )}
                  {ability.stun && (
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Stun Duration</p>
                      <p className="text-lg text-yellow-400 font-black">{ability.stun}</p>
                    </div>
                  )}
                  {ability.special && (
                    <div className="bg-zinc-800/50 rounded-2xl p-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase mb-1">Special Effect</p>
                      <p className="text-lg text-purple-400 font-black">{ability.special}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-5">{champion.name} Stats (1-Star)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Health</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="health" size={14} className="text-emerald-500" />
                    <p className="text-sm text-emerald-400 font-black">{stats.hp}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Damage</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="dmg" size={14} className="text-orange-500" />
                    <p className="text-sm text-orange-400 font-black">{stats.dmg}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Armor</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="armor" size={14} className="text-orange-500" />
                    <p className="text-sm text-orange-500 font-black">{stats.armor}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">MR</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="mr" size={14} className="text-purple-500" />
                    <p className="text-sm text-purple-400 font-black">{stats.mr}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Speed</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="attackspeed" size={14} className="text-[#F4C452]" />
                    <p className="text-sm text-[#F4C452] font-black">{speed}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Mana</span>
                  <div className="flex items-center gap-2">
                    <SvgIcon type="mana" size={14} className="text-[#26c2f4]" />
                    <p className="text-sm text-[#26c2f4] font-black">{mana}</p>
                  </div>
                </div>
                <div className="rounded-2xl p-4 border border-zinc-700/30">
                  <span className="text-xs text-zinc-500 font-bold uppercase block mb-2">Range</span>
                  <RangeIndicator range={range} />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-black text-orange-500 uppercase tracking-wider mb-6">{champion.name} Synergies</h3>
              <div className="space-y-8">
                {champion.traits.map((trait) => {
                  const traitDesc = TRAIT_DESCRIPTIONS[trait];
                  const championsWithTrait = traitChampions[trait] || [];
                  return (
                    <div key={trait} className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                          <img src={getTFTTraitIcon(trait)} alt={trait} className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-white italic">{trait}</h4>
                          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{traitDesc?.description || "Trait description unavailable."}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-16">
                        {championsWithTrait.map((c) => (
                          <Link
                            key={c.id}
                            href={`/tft/units/${setNumber}/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className={`relative w-12 h-12 rounded-xl border-2 ${getCostBorderColor(c.cost)} overflow-hidden hover:scale-110 hover:z-10 transition-all duration-200 ${c.id === champion.id ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-zinc-950' : ''}`}
                          >
                            <img src={getTFTUnitIcon(c.id, setNumber)} alt={c.name} className="w-full h-full object-cover" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
