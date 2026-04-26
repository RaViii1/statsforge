import React from 'react';
import { TooltipState } from '@/lib/tft/teamplanner-types';
import { TFTTrait, getTraitIconUrl } from '@/lib/tft/champions';
import { getTierColor } from '@/lib/tft/tftfunctions';

interface TraitTooltipProps extends TooltipState {
  trait?: TFTTrait;
}

export const TraitTooltip = ({
  visible,
  title,
  description,
  x,
  y,
  trait
}: TraitTooltipProps) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-100 pointer-events-none p-4 bg-zinc-950/95 border-2 border-orange-500/30 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.1)] max-w-[260px] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: typeof window !== 'undefined' ? (x + 150 > window.innerWidth ? x - 260 : x + 10) : 0,
        top: typeof window !== 'undefined' ? (y + 80 > window.innerHeight ? y - 100 : y + 10) : 0
      }}
    >
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <p className="text-xs font-black text-white uppercase tracking-wider">{title}</p>
          {trait?.icon_path && (
          <div>
            <img
              src={getTraitIconUrl(trait.icon_path)}
              alt={title}
              className="w-6 h-6 rounded-lg object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium mb-3">{description}</p>

        {/* Trait Tiers */}
        {trait?.tiers && trait.tiers.length > 0 && (
          <div className="mb-3 p-2 border-t border-zinc-900">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Tiers</p>
            <div className="space-y-2">
              {[...trait.tiers].sort((a, b) => a.units_required - b.units_required).map((tier, index) => (
                <div key={index} className="flex items-start gap-2 justify-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getTierColor(tier.tier) || 'bg-orange-500/60'}`}>
                    <span className="text-[9px] font-semibold text-white">{tier.units_required}</span>
                  </div>
                  <div className="flex-1">
                    {/* <p className="text-[10px] text-orange-400 font-bold mb-1 get">
                      ({tier.units_required} units)
                    </p> */}
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
