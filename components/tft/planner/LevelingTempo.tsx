'use client';

import React from 'react';
import { ChevronRight, Settings2, Target } from 'lucide-react';
import { LevelingStep } from '@/lib/tft/teamplanner-types';
import { LEVELING_PRESETS, LEVEL_COLORS, LEVEL_BG_COLORS } from '@/lib/tft/leveling-presets';

interface LevelingTempoProps {
  steps?: LevelingStep[];
  activePresetId?: string;
  onStepChange: (index: number, updates: Partial<LevelingStep>) => void;
  onApplyPreset: (presetId: string, steps: LevelingStep[]) => void;
}

export const LevelingTempo = ({ 
  steps = [], 
  activePresetId, 
  onStepChange, 
  onApplyPreset 
}: LevelingTempoProps) => {
  const activePreset = LEVELING_PRESETS.find(p => p.id === activePresetId);

  // Robust check for steps
  const safeSteps = Array.isArray(steps) ? steps : [];

  if (safeSteps.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-1 bg-orange-500 rounded-full" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              Leveling / Tempo
              <span className="text-[10px] font-medium text-white/30 hidden sm:inline tracking-normal normal-case">Operational timing and economy benchmarks</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/5 rounded-xl border border-white/10 shrink-0">
            <Settings2 className="w-3 h-3 text-white/40" />
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-tight">Presets:</span>
          </div>
          {LEVELING_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.id, preset.steps)}
              className={`px-2.5 py-1.5 border rounded-xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-wider ${
                activePresetId === preset.id 
                  ? `${preset.tagColor} border-current ring-1 ring-current/20 shadow-lg shadow-current/5` 
                  : 'bg-white/3 border-white/5 text-white/40 hover:border-orange-500/50 hover:bg-orange-500/5 hover:text-orange-400'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-stretch gap-2 overflow-x-auto pb-4 px-2 no-scrollbar scroll-smooth">
        {safeSteps.map((step, idx) => {
          const levelColor =  'text-white'; //LEVEL_COLORS[step.level] ||
          const levelBg =  'bg-white/5 border-white/10'; //LEVEL_BG_COLORS[step.level] ||
          const isHighlighted = activePreset?.highlightLevel === step.level;
          
          return (
            <React.Fragment key={idx}>
              <div 
                className={`relative flex flex-col gap-2 p-3 rounded-xl border transition-all min-w-[130px] max-w-[150px] flex-1 ${
                  isHighlighted 
                    ? 'ring-2 ring-orange-500/50 bg-orange-500/5 border-orange-500 shadow-lg shadow-orange-500/10' 
                    : 'bg-white/2 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg border ${levelBg}`}>
                    <span className={`text-base font-black ${levelColor}`}>{step.level}</span>
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-tighter">lvl</span>
                  </div>
                  {isHighlighted && <Target className="w-2.5 h-2.5 text-orange-400" />}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-medium text-white/30 uppercase tracking-tighter block">stage</span>
                    <input 
                      value={step.stage} 
                      onChange={(e) => onStepChange(idx, { stage: e.target.value })}
                      className="w-full bg-transparent text-[10px] font-black text-white focus:outline-none border-b border-white/5 focus:border-orange-500/50 pb-0.5"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-medium text-white/30 uppercase tracking-tighter block">gold</span>
                    <input 
                      value={step.gold} 
                      onChange={(e) => onStepChange(idx, { gold: e.target.value })}
                      className="w-full bg-transparent text-[10px] font-black text-orange-400 focus:outline-none border-b border-white/5 focus:border-orange-500/50 pb-0.5"
                    />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[7px] font-medium text-white/30 uppercase tracking-tighter block">Note</span>
                  <input 
                    value={step.description || ''} 
                    onChange={(e) => onStepChange(idx, { description: e.target.value })}
                    placeholder="Note..."
                    className="w-full bg-transparent text-[9px] font-black text-orange-400 focus:outline-none border-b border-white/5 focus:border-orange-500/50 pb-0.5 placeholder:text-white/10"
                  />
                </div>
              </div>
              {idx < safeSteps.length - 1 && (
                <div className="flex items-center">
                  <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
