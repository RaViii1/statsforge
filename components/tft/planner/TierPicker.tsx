'use client';

import { MetaTier, META_TIERS, META_TIER_CONFIG, TooltipState } from '@/lib/tft/teamplanner-types';
import { TrendingUp } from 'lucide-react';

interface TierPickerProps {
  value?: MetaTier;
  onChange: (tier: MetaTier) => void;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

const TIER_DESCRIPTIONS: Record<MetaTier, string> = {
  S: 'Top meta comp - Consistently top 4',
  A: 'Strong comp - High win rate',
  B: 'Solid comp - Situationally strong',
  C: 'Below average - Needs high roll',
  F: 'Weak comp - Not recommended',
};

export const TierPicker = ({ value, onChange, setTooltip }: TierPickerProps) => {
  const currentConfig = value ? META_TIER_CONFIG[value] : null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Tier:</span>
      </div>
      <div className="flex gap-1">
        {META_TIERS.map((tier) => {
          const config = META_TIER_CONFIG[tier];
          const isActive = value === tier;
          return (
            <button
              key={tier}
              onClick={() => onChange(tier)}
              onMouseEnter={(e) => setTooltip({ 
                visible: true, 
                title: `${tier} Tier`, 
                description: TIER_DESCRIPTIONS[tier], 
                x: e.clientX, 
                y: e.clientY 
              })}
              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
              className={`
                w-7 h-7 rounded-lg text-[11px] font-black uppercase
                border transition-all duration-200
                ${isActive 
                  ? `${config.bgColor} ${config.color} shadow-lg` 
                  : 'opacity-40 hover:opacity-70 border-white/40 text-white/70'
                }
              `}
            >
              {tier}
            </button>
          );
        })}
      </div>
      {currentConfig && (
        <div 
          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${currentConfig.bgColor} ${currentConfig.color}`}
        >
          {currentConfig.label}
        </div>
      )}
    </div>
  );
};
