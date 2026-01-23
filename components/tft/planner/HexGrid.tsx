'use client';

import { Plus, Star, Crown } from 'lucide-react';
import { UnitPosition, TooltipState } from '@/lib/tft/teamplanner-types';
import { SET_16_CHAMPIONS, getCostColor, getChampionCost, CurrentSetNumber } from '@/lib/tft/champions';
import { getTFTUnitIcon, getTFTItemIcon } from '@/lib/tft/tftfunctions';
import { getItemDescription } from '@/lib/tft/itemstft';

interface HexGridProps {
  units: UnitPosition[];
  mainCarryIds: string[];
  selectedHex: { row: number; col: number } | null;
  activeTraits: { name: string; count: number }[];
  onHexClick: (row: number, col: number, isActive: boolean) => void;
  onDrop: (row: number, col: number) => void;
  onUnitDragStart: (row: number, col: number, characterId: string) => void;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export const HexGrid = ({
  units,
  mainCarryIds,
  selectedHex,
  activeTraits,
  onHexClick,
  onDrop,
  onUnitDragStart,
  setTooltip
}: HexGridProps) => {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-wrap justify-center gap-2 px-10">
        {activeTraits.map(trait => (
          <div key={trait.name} className="group relative flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/4 border border-white/5 rounded-full hover:border-orange-500/30 transition-all cursor-default shadow-sm">
            <div className="w-5 h-5 flex items-center justify-center bg-orange-500/60 rounded-full"><span className="text-[9px] font-black text-white">{trait.count}</span></div>
            <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{trait.name}</span>
          </div>
        ))}
        {activeTraits.length === 0 && <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] py-4">Sector Clear: No Active Synergies</p>}
      </div>

      <div className="relative w-full max-w-4xl py-12 px-10 rounded-[4rem] bg-black/40 border border-white/5 shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.02),transparent_70%)] pointer-events-none"></div>
        
        <div className="relative mx-auto" style={{ width: '780px', height: '440px' }}>
          {[0, 1, 2, 3].map(row => [0, 1, 2, 3, 4, 5, 6].map(col => {
            const unit = units.find(u => u.row === row && u.col === col);
            const isOffset = row % 2 !== 0;
            const isActive = selectedHex?.row === row && selectedHex?.col === col;
            const isCarry = unit && mainCarryIds.includes(unit.characterId);
            
            return (
              <div 
                key={`${row}-${col}`} 
                className="absolute transition-all duration-500" 
                style={{ 
                  left: `${col * 105 + (isOffset ? 52.5 : 0)}px`, 
                  top: `${row * 105}px`, 
                  width: '90px', 
                  height: '104px' 
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  onDrop(row, col);
                }}
                onClick={() => onHexClick(row, col, isActive)}
              >
                <div 
                  draggable={!!unit} 
                  onDragStart={() => unit && onUnitDragStart(unit.row, unit.col, unit.characterId)} 
                  className={`relative w-full h-full flex items-center justify-center transition-all ${unit ? 'scale-100 cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'scale-95 group/hex'}`}
                >
                  <svg viewBox="-10 -10 120 135.47" className="w-full h-full filter drop-shadow-2xl overflow-visible">
                    <path 
                      d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" 
                      fill={unit ? '#000000' : 'rgba(24, 24, 27, 0.4)'} 
                      stroke={unit ? (isCarry ? '#f97316' : getCostColor(getChampionCost(unit.characterId))) : 'rgba(63, 63, 70, 0.3)'} 
                      strokeWidth={unit ? (isActive ? '10' : '5') : '2'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className={`transition-all duration-300 ${!unit ? 'group-hover/hex:stroke-white/40 group-hover/hex:fill-white/5' : ''}`}
                    />
                    {!unit && (
                      <circle cx="50" cy="57.7" r="2" fill="rgba(63, 63, 70, 0.6)" className="group-hover/hex:fill-white/30" />
                    )}
                    {unit && (
                      <>
                        <defs><clipPath id={`clip-${row}-${col}`}><path d="M50 0 L100 28.867 L100 86.602 L50 115.47 L0 86.602 L0 28.867 Z" /></clipPath></defs>
                        <image href={getTFTUnitIcon(unit.characterId, CurrentSetNumber)} width="94" height="108" x="3" y="3.7" clipPath={`url(#clip-${row}-${col})`} preserveAspectRatio="xMidYMid slice" className="opacity-95" />
                      </>
                    )}
                  </svg>
                  
                  {unit && (
                    <>
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
                        {isCarry && <Crown className="w-5 h-5 text-orange-400 fill-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />}
                        <div className="flex -space-x-1 ml-1">
                          {Array.from({ length: unit.stars }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 drop-shadow-lg" />)}
                        </div>
                      </div>
                      {unit.items.length > 0 && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex -space-x-1 z-30">
                          {unit.items.map((it, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg border-2 border-black overflow-hidden shadow-2xl transform hover:scale-110 transition-transform">
                              <img src={getTFTItemIcon(it)} alt={it} className="w-full h-full object-cover" onMouseEnter={(e) => setTooltip({ visible: true, title: it, description: getItemDescription(it) || 'No description available', x: e.clientX, y: e.clientY })} onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))} />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                
                  {isActive && !unit && (
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <Plus className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    </div>
  );
};
