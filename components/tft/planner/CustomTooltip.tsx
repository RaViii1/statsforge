import React from 'react';
import { TooltipState } from "@/lib/tft/teamplanner-types";
import { TFTItem, getItemImageUrl } from "@/lib/tft/itemstft";
import { getTFTItemIcon } from "@/lib/tft/tftfunctions";
import SvgIcon from "@/components/SvgIcon";

interface CustomTooltipProps extends TooltipState {
  item?: TFTItem;
  allItems?: TFTItem[];
}

export const CustomTooltip = ({ 
  visible, 
  title, 
  description, 
  x, 
  y,
  item,
  allItems = []
}: CustomTooltipProps) => {
  if (!visible || !item) return null;

  // Check if item is artifact, seasonal, or radiant
  const isSpecialItem = item?.is_artifact || item?.is_seasonal || item?.is_radiant;
  
  // Get component items if available
  const componentItems = item?.build_path ? 
    item.build_path.map(componentId => allItems.find(it => it.id === componentId)).filter(Boolean) : 
    [];

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
        </div>
        
        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium mb-3">{description}</p>

        {/* Show stats for all items that have stats */}
        {item?.stats && Object.keys(item.stats).length > 0 && (
          <div className="mb-3 p-2 border-t border-zinc-900">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Stats</p>
            <div className="space-y-1 ">
              {Object.entries(item.stats).filter(([_, value]) => value > 0).map(([stat, value]) => {
                // Map stat keys to SvgIcon types and colors
                const statTypeMap: Record<string, { type: 'mr' | 'health' | 'mana' | 'armor' | 'dps' | 'dmg' | 'crit' | 'attackspeed' | 'ap' | 'gold' | 'dmgamp' | 'lifesteal', color: string }> = {
                  hp: { type: 'health', color: 'text-green-400' },
                  ap: { type: 'ap', color: 'text-blue-500' },
                  ad: { type: 'dmg', color: 'text-orange-500' },
                  as: { type: 'attackspeed', color: 'text-yellow-300' },
                  armor: { type: 'armor', color: 'text-orange-400' },
                  mr: { type: 'mr', color: 'text-purple-500' },
                  mana: { type: 'mana', color: 'text-cyan-400' },
                  crit: { type: 'crit', color: 'text-red-500' },
                  crit_dmg: { type: 'crit', color: 'text-pink-500' },
                  healing: { type: 'lifesteal', color: 'text-green-300' },
                  shield: { type: 'armor', color: 'text-blue-300' },
                  lifesteal: { type: 'lifesteal', color: 'text-red-600' },
                  dmgAmp: { type: 'dmgamp', color: 'text-white' }
                };

                const statConfig = statTypeMap[stat] || { type: 'dmg', color: 'text-orange-500' };
                
                return (
                  <div key={stat} className="flex items-center gap-2 text-[10px]">
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
                  <span className="text-white font-bold">+{value}</span>
                    <div className="flex items-center gap-1">
                      <SvgIcon type={statConfig.type} size={12} className={statConfig.color} />
                      <span className="text-zinc-400">{stat.replace('_', ' ').toUpperCase()}</span>
                    </div>
                   
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Show components for normal items */}
        {!isSpecialItem && componentItems.length > 0 && (
          <div className="mt-3 pt-2 border-t border-zinc-900">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">Item Components</p>
            <div className="flex items-center gap-2">
              {componentItems.map((component, index) => {
                if (!component) return null;
                // Use index as fallback key if component.id is duplicate
                const key = component.id + index;
                const isLast = index === componentItems.length - 1;
                return (
                  <React.Fragment key={key}>
                    <div className="relative group">
                      <img 
                        src={getItemImageUrl(component.image_path)}
                        alt={component.name}
                        className="w-6 h-6 rounded object-cover border border-zinc-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/noitem.png'; }}
                      />
                    </div>
                    {!isLast && (
                      <span className="text-orange-500 font-bold text-xs">+</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
