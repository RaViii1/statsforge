"use client";

import { use, useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Eye, ArrowRightIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { getCostBorderColor } from "@/lib/tft/champions";
import SvgIcon from "@/components/SvgIcon";
import { TFTChampion } from "@/lib/tft/champions";
import NavbarTft from "@/components/NavbarTft";
import { UnitTooltip } from "@/components/tft/UnitTooltip";
import { TraitTooltip } from "@/components/tft/planner/TraitTooltip";
import { CustomTooltip } from "@/components/tft/planner/CustomTooltip";
import { TooltipState, META_TIER_CONFIG, MetaTier, DifficultyLevel } from "@/lib/tft/teamplanner-types";
import { getDifficultyConfig } from "@/lib/tft/difficulty";
import { li } from "framer-motion/client";
import { highlightNumbers, parseTextWithIcons, formatText } from "@/lib/highlightNumbers";

const MetaTierBadge = ({ tier }: { tier?: MetaTier }) => {
  if (!tier) return null;
  const config = META_TIER_CONFIG[tier];
  return (
    <div className="inline-flex items-center gap-2">
      <div className={`w-0.5 h-6 bg-linear-to-b ${config.gradient} rounded-full`}></div>
      <span className={`text-sm font-bold ${config.color}`}>{tier}</span>
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">TIER</span>
      <div className={`w-0.5 h-6 bg-linear-to-b ${config.gradient} rounded-full`}></div>
    </div>
  );
};

type SvgIconType =  'mr' | 'health' | 'mana' | 'armor' | 'dps' | 'dmg' | 'crit' | 'attackspeed' | 'ap' | 'gold' | 'dmgamp' | 'lifesteal';
  
const STAT_ICON_MAP: Record<string, { type: SvgIconType; color: string }> = {
  'AP':      { type: 'ap',           color: 'text-blue-400' },
  'AD':      { type: 'dmg',          color: 'text-orange-400' },
  'Hp':      { type: 'health',       color: 'text-emerald-500' },
  'Armor':   { type: 'armor',        color: 'text-orange-400' },
  'MR':      { type: 'mr',           color: 'text-purple-500' },
  'Crit':    { type: 'crit',         color: 'text-red-500' },
  'AS':      { type: 'attackspeed',  color: 'text-yellow-300' },
  'Mana':    { type: 'mana',         color: 'text-cyan-400' },
  'DmgAmp':  { type: 'dmgamp',       color: 'text-white' },
  'Lifesteal': { type: 'lifesteal',    color: 'text-red-600' },
  'CritDmg': { type: 'crit',      color: 'text-white' },
  'Healing': { type: 'health',      color: 'text-green-400' },
  'Shield':  { type: 'armor',       color: 'text-white' },
} as const;

const COST_BG: Record<number, string> = {
  1: 'bg-zinc-400',
  2: 'bg-emerald-400',
  3: 'bg-blue-400',
  4: 'bg-purple-400',
  5: 'bg-[#F4C452]',
};
const COST_TEXT: Record<number, string> = {
  1: 'text-zinc-400',
  2: 'text-emerald-400',
  3: 'text-blue-400',
  4: 'text-purple-400',
  5: 'text-[#F4C452]',
};


// Unified section heading — orange left border, no icon decoration
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-l-2 border-orange-500 pl-3 text-[11px] font-black text-zinc-300 uppercase tracking-[0.3em] leading-none mb-6">
      {children}
    </h2>
  );
}

interface StatTextProps {
  text?: any;
  className?: string;
}

export function StatText({ text, className = "" }: StatTextProps) {
  if (!text) return null;

  let segments: string[] = [];
  if (typeof text === 'string') {
    segments = text.split(',').map(s => s.trim());
  } else if (typeof text === 'object') {
    segments = Object.entries(text as any)
      .filter(([_, v]) => v !== null && v !== undefined && v !== 0 && v !== '0')
      .map(([k, v]) => `${v} ${k.toUpperCase()}`);
  }

  if (segments.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {segments.map((segment, index) => {
        const statEntry = Object.entries(STAT_ICON_MAP).find(([keyword]) =>
          segment.toUpperCase().includes(keyword.toUpperCase())
        );
        if (!statEntry) return <span key={index} className="text-xs text-zinc-500">{segment}</span>;
        const [keyword, { type, color }] = statEntry;
        const value = segment.toUpperCase().replace(keyword.toUpperCase(), '').trim();
        return (
          <div key={index} className="flex items-center gap-1">
            <span className={`text-xs font-bold ${color}`}>{value}</span>
            <SvgIcon type={type} size={13} className={color} />
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
  const [items, setItems] = useState<any[]>([]);
  const [traits, setTraits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, title: '', description: '', x: 0, y: 0 });
  const [selectedStarLevel, setSelectedStarLevel] = useState(0);
  const [showAllTeamComps, setShowAllTeamComps] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [champRes, allChampsRes, itemsRes, traitsRes] = await Promise.all([
          fetch(`/api/tft/champions?name=${unitName}&set=${setNumber}`),
          fetch(`/api/tft/champions?set=${setNumber}`),
          fetch(`/api/tft/items`),
          fetch(`/api/tft/traits`)
        ]);
        if (champRes.ok) setChampion(await champRes.json());
        if (allChampsRes.ok) setAllChampions(await allChampsRes.json());
        if (itemsRes.ok) setItems(await itemsRes.json());
        if (traitsRes.ok) setTraits(await traitsRes.json());
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  if (!champion) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-zinc-700 mx-auto animate-pulse" />
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Unit not found</h2>
          <p className="text-zinc-500 text-sm max-w-xs mx-auto">This unit could not be retrieved.</p>
          <Link href="/tft/units" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-black uppercase text-xs tracking-widest transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Units
          </Link>
        </div>
      </div>
    );
  }

  const allStarsStats = champion.stats?.stars || [
    { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 },
    { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 },
    { hp: 0, dmg: 0, ap: 0, armor: 0, mr: 0, crit: 0 },
  ];
  const speed  = champion.stats?.speed || 0;
  const mana   = champion.stats?.mana  || 0;
  const range  = champion.stats?.range || 1;
  const ability    = champion.ability || { name: "Unknown Ability", description: { active: "Details unavailable." } };
  const bestItems  = champion.tft_champion_best_items || [];
  const stats      = allStarsStats[selectedStarLevel];

  const showTooltip = (e: React.MouseEvent, data: Partial<TooltipState>) =>
    setTooltip({ visible: true, title: '', description: '', x: e.clientX, y: e.clientY, ...data });
  const hideTooltip = () => setTooltip(p => ({ ...p, visible: false }));

  const buildTraitTooltip = (trait: any): TooltipState['trait'] => ({
    id: trait.name, name: trait.name,
    description: trait.description || '',
    icon_path: trait.icon_path || '',
    tiers: trait.tft_trait_tiers?.map((t: any) => ({
      id: t.id, trait_id: t.trait_id, tier: t.tier,
      units_required: t.units_required, description: t.description, stats: t.stats,
    })) || trait.tiers || [],
    is_Hero: trait.is_Hero || false,
  });

  const statRows: { label: string; value: string | number; icon: SvgIconType; color: string }[] = [
    { label: 'Health',        value: stats.hp,         icon: 'health',       color: 'text-emerald-400' },
    { label: 'Attack Damage', value: stats.dmg,        icon: 'dmg',          color: 'text-orange-400'  },
    { label: 'Ability Power', value: stats.ap,         icon: 'ap',           color: 'text-blue-400'    },
    { label: 'Armor',         value: stats.armor,      icon: 'armor',        color: 'text-orange-400'  },
    { label: 'Magic Resist',  value: stats.mr,         icon: 'mr',           color: 'text-purple-500'  },
    { label: 'Crit Chance',   value: `${stats.crit}%`, icon: 'crit',         color: 'text-red-500'     },
    { label: 'Attack Speed',  value: speed,            icon: 'attackspeed',  color: 'text-yellow-300'   },
    { label: 'Mana',          value: mana,             icon: 'mana',         color: 'text-cyan-400'   },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">

      {/* Ambient glows — atmosphere, not structure */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[500px] bg-blue-600/4 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[500px] h-[400px] bg-purple-600/4 rounded-full blur-[140px]" />
      </div>

      <NavbarTft />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">

        <UnitTooltip
          visible={tooltip.visible && !!tooltip.champion}
          title={tooltip.title} description={tooltip.description}
          x={tooltip.x} y={tooltip.y}
          champion={tooltip.champion} setNumber={setNumber}
        />
        <TraitTooltip
          visible={tooltip.visible && !!tooltip.trait}
          title={tooltip.title} description={tooltip.description}
          x={tooltip.x} y={tooltip.y} trait={tooltip.trait}
        />
        <CustomTooltip
          visible={tooltip.visible && !tooltip.champion && !tooltip.trait}
          title={tooltip.title} description={tooltip.description}
          x={tooltip.x} y={tooltip.y}
          item={items.find(it => it.name === tooltip.title)}
          allItems={items}
        />

        <Link
          href="/tft/units"
          className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-300 mb-10 transition-colors group uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Units
        </Link>

        <div className="relative rounded-2xl bg-zinc-900/50 shadow-xl shadow-black/40 overflow-hidden mb-8">
          {/* Faint splash art wash */}
          <div className="absolute inset-0 opacity-[0.08]">
            <img src={champion.image_path || "/images/nochampionimage.jpg"} alt="" aria-hidden
              className="w-full h-full object-cover object-top scale-110 blur-sm"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
            <div className="absolute inset-0 bg-linear-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
          </div>

          <div className="relative z-10 flex items-start justify-between flex-wrap gap-8 p-8 md:p-10">
            <div className="space-y-4 flex-1 min-w-0">

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Set {setNumber}</span>
                <span className="text-zinc-700">·</span>
                <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${COST_TEXT[champion.cost] || 'text-zinc-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${COST_BG[champion.cost] || 'bg-zinc-400'}`} />
                  {champion.cost} Gold
                </span>
              </div>

              {/* Trait pills */}
              {(champion.trait_details ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(champion.trait_details ?? []).map((trait: any) => (
                    <button
                      key={trait.name}
                      className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-default"
                      onMouseEnter={(e) => showTooltip(e, { title: trait.name, description: trait.description || '', trait: buildTraitTooltip(trait) })}
                      onMouseLeave={hideTooltip}
                    >
                      <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                        {trait.icon_path
                          ? <img src={trait.icon_path} alt="" className="w-3 h-3 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          : <span className="text-[8px] font-black text-orange-400">{trait.name[0]}</span>}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-200">{trait.name}</span>
                    </button>
                  ))}
                </div>
              )}

              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                {champion.name}
              </h1>

              <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                {formatText(champion.ability?.description?.passive || champion.ability?.description?.active || "Unit details unavailable")}
              </p>
            </div>

            <div className="w-44 h-44 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 shrink-0">
              <img
                src={champion.image_path || "/images/nochampionimage.jpg"}
                alt={champion.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
                onMouseEnter={(e) => showTooltip(e, { title: champion.name, description: champion.ability?.description?.active || champion.ability?.description?.passive || '', champion, setNumber })}
                onMouseLeave={hideTooltip}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 mb-24">

          <div className="lg:col-span-8 space-y-6">

            <section className="rounded-2xl bg-zinc-900/50 p-8 shadow-lg shadow-black/30">
              <SectionHeading>Ability</SectionHeading>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800/80 shrink-0 shadow-md shadow-black/40">
                  <img
                    src={`https://raw.communitydragon.org/latest/game/assets/characters/${champion.id.toLowerCase()}/hud/${champion.id.toLowerCase()}_square.tft_set${setNumber}.png`}
                    alt={ability.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-white italic mb-3">{ability.name}</h3>

                  {ability.description?.passive && (
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">Passive</span>
                      <p className="text-sm text-zinc-400 leading-relaxed mt-1">
                        {formatText(ability.description.passive)}
                      </p>
                    </div>
                  )}
                  {ability.description?.active && (
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">Active</span>
                      <p className="text-sm text-zinc-400 leading-relaxed mt-1">
                        {formatText(ability.description.active)}
                      </p>
                    </div>
                  )}

                  {(ability.damage || ability.heal || ability.shield || ability.stun || ability.special) && (
                    <div className="flex flex-wrap gap-6 pt-3 mt-2 border-t border-zinc-800/60">
                      {[
                        { label: 'Damage',  value: ability.damage, },
                        { label: 'Healing', value: ability.heal,},
                        { label: 'Shield',  value: ability.shield,},
                        { label: 'Stun',    value: ability.stun,},
                        { label: 'Special', value: ability.special,},
                      ].filter(s => s.value).map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase mb-0.5">{label}</p>
                          <p className={`text-sm font-black`}>{parseTextWithIcons(value || '0')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="rounded-2xl bg-zinc-900/50 p-8 shadow-lg shadow-black/30">
              <SectionHeading>Base Statistics</SectionHeading>

              <div className="flex items-center gap-1 mb-6 bg-zinc-800/40 rounded-xl p-1 w-fit">
                {[0, 1, 2].map((starIndex) => (
                  <button
                    key={starIndex}
                    onClick={() => setSelectedStarLevel(starIndex)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                      selectedStarLevel === starIndex
                        ? 'bg-zinc-700 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span className="flex gap-px">
                      {[...Array(starIndex + 1)].map((_, i) => (
                        <span key={i} className="text-[#F4C452] text-[10px]">★</span>
                      ))}
                    </span>
                    <span>{starIndex + 1} Star</span>
                  </button>
                ))}
              </div>

              <div className="rounded-xl overflow-hidden">
                {statRows.map(({ label, value, icon, color }, i) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? 'bg-zinc-800/30' : 'bg-transparent'} hover:bg-zinc-800/50 transition-colors`}
                  >
                    <div className="flex items-center gap-2.5">
                      <SvgIcon type={icon} size={15} className={`${color} opacity-70`} />
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{label}</span>
                    </div>
                    <span className={`text-sm font-black tabular-nums ${color}`}>{value}</span>
                  </div>
                ))}

                <div className={`flex items-center justify-between px-4 py-3 ${statRows.length % 2 === 0 ? 'bg-zinc-800/30' : 'bg-transparent'} hover:bg-zinc-800/50 transition-colors`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-[15px] h-[15px] flex items-center justify-center opacity-70">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Range</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`rounded-full transition-all ${i <= range ? 'w-1 h-5 bg-orange-500' : 'w-1 h-5 bg-zinc-700'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">

            <section className="rounded-2xl bg-zinc-900/50 p-6 shadow-lg shadow-black/30">
              <SectionHeading>Recommended Items</SectionHeading>

              <div className="space-y-1">
                {bestItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-zinc-800/50 transition-colors group"
                  >
                    <span className="text-[10px] font-black text-zinc-700 w-4 text-right shrink-0 tabular-nums">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 shadow-md shadow-black/50">
                      <img src={item.image_path || "/images/noitem.png"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-200 truncate mb-0.5 group-hover:text-orange-400 transition-colors">{item.name}</p>
                      <StatText text={item.stats} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Synergies */}
            <section className="rounded-2xl bg-zinc-900/50 p-6 shadow-lg shadow-black/30">
              <SectionHeading>{champion.name} Synergies</SectionHeading>

              <div className="space-y-7">
                {champion.trait_details?.map((trait: any) => {
                  const traitDesc = traits.find((t) => t.name === trait.name)?.description || 'No description found';
                  const championsWithTrait = traitChampions[trait.name] || [];
                  return (
                    <div key={trait.name}>
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-9 h-9 rounded-lg bg-zinc-800/80 flex items-center justify-center shrink-0 cursor-default"
                          onMouseEnter={(e) => showTooltip(e, { title: trait.name, description: trait.description || '', trait: buildTraitTooltip(trait) })}
                          onMouseLeave={hideTooltip}
                        >
                          <img src={trait.icon_path || "/images/notraitimage.png"} alt={trait.name} className="w-5 h-5 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="text-sm font-black text-white italic leading-none mb-1">{trait.name}</h4>
                          <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-4">
                            {trait.description || traitDesc?.description || "Trait description unavailable."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pl-12">
                        {championsWithTrait.map((c) => {
                          const isActive = c.id === champion.id;
                          return (
                            <Link
                              key={c.id}
                              href={`/tft/units/${setNumber}/${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className={`relative w-9 h-9 rounded-lg overflow-hidden transition-all duration-150 border-2 ${
                                isActive
                                  ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20 opacity-100'
                                  : `${getCostBorderColor(c.cost) || 'border-zinc-600'} opacity-50 hover:opacity-90 hover:scale-105`
                              }`}
                            >
                              <img
                                src={c.image_path || "/images/nochampionimage.jpg"}
                                alt={c.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }}
                                onMouseEnter={(e) => showTooltip(e, { title: c.name, description: c.ability?.description?.active || c.ability?.description?.passive || '', champion: c, setNumber })}
                                onMouseLeave={hideTooltip}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            
          </div>
        </div>
            <section className="rounded-2xl bg-zinc-900/50 p-8 shadow-lg shadow-black/30">
              <SectionHeading>Popular {champion.name} teamcomps</SectionHeading>
              
              {champion.teamcomps && champion.teamcomps.length > 0 ? (
                <div className="space-y-4">
                  {champion.teamcomps.slice(0, showAllTeamComps ? champion.teamcomps.length : 5).map((teamcomp) => {
                    // Get final phase units
                    const finalUnits = teamcomp.phases?.final?.units || [];
                    // Get carries
                    const carries = teamcomp.mainCarryIds?.map(id => {
                      const unit = finalUnits.find(u => u.characterId === id);
                      const champ = allChampions.find(c => c.id === id);
                      return unit ? { unit, cost: champ?.cost || 1 } : null;
                    }).filter(Boolean) as any[];
                    
                    return (
                      <Link
                        key={teamcomp.id}
                        href={`/tft/comps/${teamcomp.id}`}
                        className="block bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-900/50 transition-all"
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-6">
                            <div className="shrink-0 min-w-[180px]">
                              <h3 className="text-lg font-bold text-white mb-2">
                                {teamcomp.name}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                {teamcomp.tier && <MetaTierBadge tier={teamcomp.tier as MetaTier} />}
                                {teamcomp.difficulty && (
                                  <span
                                    className="px-2.5 py-1 text-xs font-bold rounded border"
                                    style={{ 
                                      backgroundColor: getDifficultyConfig(teamcomp.difficulty as DifficultyLevel).bgColor, 
                                      color: getDifficultyConfig(teamcomp.difficulty as DifficultyLevel).color, 
                                      borderColor: getDifficultyConfig(teamcomp.difficulty as DifficultyLevel).borderColor 
                                    }}
                                  >
                                    {getDifficultyConfig(teamcomp.difficulty as DifficultyLevel).label}
                                  </span>
                                )}
                                {teamcomp.patch && (
                                  <span className="px-2.5 py-1 bg-orange-950/50 border border-orange-900/30 text-orange-500 text-xs font-bold rounded">
                                    {teamcomp.patch}
                                  </span>
                                )}

                              </div>
                            </div>

                            {carries.length > 0 && (
                              <div className="shrink-0 flex items-center gap-1 border-r border-r-orange-500/40 pr-4">
                                {carries.map(({ unit, cost }, i) => {
                                  const champ = allChampions.find(c => c.id === unit.characterId);
                                  return (
                                    <div key={i} className="relative">
                                      <div
                                        className={`w-14 h-14 rounded-full border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)} cursor-pointer`}
                                        onMouseEnter={(e) => {
                                          if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber });
                                        }}
                                        onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                      >
                                        <img src={champ?.image_path || '/images/nochampionimage.jpg'} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                                      </div>
                                      {unit.items.length > 0 && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                          {unit.items.slice(0, 3).map((item: any, idx: number) => {
                                            const itemObj = items.find(it => it.name === item);
                                            return (
                                              <div key={idx} className="w-4 h-4 rounded bg-zinc-800 border border-zinc-600 overflow-hidden"
                                                onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                                                onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                              >
                                                <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="flex-1 flex items-center gap-2 overflow-hidden p-2">
                              {finalUnits.map((unit, i) => {
                                const champ = allChampions.find(c => c.id === unit.characterId);
                                const cost = champ?.cost || 1;
                                const isCarry = teamcomp.mainCarryIds?.includes(unit.characterId);
                                return (
                                  <div key={i} className="relative shrink-0 py-1">
                                    <div
                                      className={`w-10 h-10 rounded-full border-2 overflow-hidden bg-zinc-900 ${getCostBorderColor(cost)} ${isCarry ? 'ring-2 ring-orange-500/50' : ''} cursor-pointer`}
                                      onMouseEnter={(e) => {
                                        if (champ) setTooltip({ visible: true, title: champ.name, description: champ.ability?.description?.active || champ.ability?.description?.passive || "", x: e.clientX, y: e.clientY, champion: champ, setNumber });
                                      }}
                                      onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                    >
                                      <img src={champ?.image_path || '/images/nochampionimage.jpg'} alt={unit.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/nochampionimage.jpg'; }} />
                                    </div>
                                    {unit.items.length > 0 && (
                                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-px">
                                        {unit.items.slice(0, 3).map((item: any, idx: number) => {
                                          const itemObj = items.find(it => it.name === item);
                                          return (
                                            <div key={idx} className="w-3.5 h-3.5 rounded-sm bg-zinc-800 border border-zinc-600 overflow-hidden"
                                              onMouseEnter={(e) => setTooltip({ visible: true, title: item, description: itemObj?.description || 'No description', x: e.clientX, y: e.clientY, item: itemObj, allItems: items })}
                                              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
                                            >
                                              <img src={itemObj?.image_path || '/images/noitem.png'} alt={item} className="w-full h-full object-cover" />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 flex items-center justify-center transition-colors">
                                <ArrowRightIcon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  
                  {champion.teamcomps.length > 5 && (
                    <div className="text-center">
                      <button
                        onClick={() => setShowAllTeamComps(!showAllTeamComps)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        {showAllTeamComps ? 'Show Less' : 'Show More'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <p className="text-sm">No team comps found for {champion.name}</p>
                </div>
              )}
            </section>
      </main>

      <Footer />
    </div>
  );
}