import React from 'react';
import { TooltipState } from '@/lib/tft/teamplanner-types';
import { getCostColor, TFTChampion, TFTTrait } from '@/lib/tft/champions';
import SvgIcon from '../SvgIcon';
import { TraitDto } from '@/lib/tft/tftfunctions';

interface UnitTooltipProps extends TooltipState {
  champion?: TFTChampion;
  setNumber?: number;
}

export const UnitTooltip = ({
  visible,
  title,
  description,
  x,
  y,
  champion,
  setNumber,
}: UnitTooltipProps) => {
  if (!visible) return null;

  const positionStyle: React.CSSProperties =
    typeof window !== 'undefined'
      ? {
          left: x + 260 > window.innerWidth ? x - 250 : x + 14,
          top: y + 80 > window.innerHeight ? y - 140 : y + 14,
        }
      : { left: 0, top: 0 };

  const costColor = champion?.cost ? getCostColor(champion.cost) : '#94a3b8';

  return (
    <div
      className="fixed z-[999] pointer-events-none w-[240px]"
      style={positionStyle}
    >
      <div className="rounded-xl overflow-hidden bg-zinc-950 border-2 border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)]">

        <div className="relative w-full h-[140px]"
         style={{ borderColor: costColor }}>

          {champion?.image_path ? (
            <img
              src={champion.image_path}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="absolute inset-0 bg-orange-950" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-transparent" />
          <div className="absolute top-2 left-2">
            <span className="text-[12px] font-black text-white tracking-wide uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">{title}</span>
          </div>

          {champion?.cost && (
            <div
              className="absolute top-2 right-2 flex items-center gap-0.5 px-2.5 py-1 rounded"
              style={{ backgroundColor: costColor }}
            >
              <span className="text-[11px] font-black text-zinc-200 leading-none">{champion.cost}</span>
          
            </div>
          )}
          {champion?.tft_champion_best_items && champion.tft_champion_best_items.length > 0 && (
            <div className="absolute bottom-2 right-2 flex gap-1 flex-wrap justify-end">
              {champion.tft_champion_best_items.slice(0, 6).map((item, i) =>
                item.image_path ? (
                  <img
                    key={i}
                    src={item.image_path}
                    alt={item.name}
                    title={item.name}
                    className="w-[24px] h-[24px] rounded object-cover border border-orange-500/40 shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div key={i} className="w-[24px] h-[24px] rounded bg-zinc-800 border border-orange-500/20" />
                )
              )}
            </div>
          )}

          {/* BOTTOM-LEFT: Traits */}
          <div className="absolute bottom-2 left-2 space-y-1">
            {(champion as any)?.trait_details?.map((trait: TFTTrait, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                {trait.icon_path && (
                  <img
                    src={trait.icon_path}
                    alt={trait.name}
                    className="w-3.5 h-3.5 rounded-sm object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <span className="text-[10px] text-orange-100 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-none">{trait.name}</span>
              </div>
            ))}
          </div>
        </div>

        {champion?.ability && (
          <div className="px-3 pt-2.5 pb-3 border-t border-orange-500/20 bg-zinc-950">

            {/* Header: icon + name + mana */}
            <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-800 pb-1">
              <div className="w-5 h-5 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 text-[9px] leading-none">✦</span>
              </div>
              <span className="text-[11px] font-bold text-orange-500 truncate flex-1 leading-none">
                {champion.ability.name ?? title}
              </span>
              {champion.stats?.mana && (
                <span className="flex items-center gap-0.5 text-[10px] text-blue-400 font-semibold flex-shrink-0">
                  <SvgIcon className="w-3 h-3 text-blue-400" type="mana" />
                  0/{champion.stats.mana}
                </span>
              )}
            </div>

            {/* Description text */}
            <div className="text-[10px] space-y-1 text-zinc-200">
              {champion.ability.description?.passive && (
                <p>
                  <span className="font-bold text-zinc-200">Passive: </span>
                  {champion.ability.description.passive}
                </p>
              )}
              {champion.ability.description?.active && (
                <p>
                  <span className="font-bold text-zinc-200">Active: </span>
                  {champion.ability.description.active}
                </p>
              )}
              {!champion.ability.description?.passive && !champion.ability.description?.active && description && (
                <p>{description}</p>
              )}

              {/* Stat pills */}
              {(champion.ability.damage || champion.ability.heal || champion.ability.shield || champion.ability.stun) && (
                <div className="flex flex-wrap gap-1 pt-1 text-orange-500">
                  {champion.ability.damage && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.damage}
                    </span>
                  )}
                  {champion.ability.heal && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.heal}
                    </span>
                  )}
                  {champion.ability.shield && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.shield}
                    </span>
                  )}
                  {champion.ability.stun && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.stun}
                    </span>
                  )}
                  {champion.ability.attackspeed && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.attackspeed}
                    </span>
                  )}
                  {champion.ability.damageReduction && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                      {champion.ability.damageReduction}
                    </span>
                  )}
                  {champion.ability.special && (
                    <span className="pt-0.5 rounded text-[9px] font-bold text-orange-400">
                       {champion.ability.special}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fallback description */}
        {!champion?.ability && description && (
          <div className="px-3 pt-2 pb-3 border-t border-orange-500/10 bg-zinc-950">
            <p className="text-[10px] text-zinc-300 leading-relaxed">{description}</p>
          </div>
        )}

      </div>
    </div>
  );
};