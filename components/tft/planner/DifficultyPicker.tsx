'use client';

import { DIFFICULTY_LEVELS, getDifficultyConfig } from '@/lib/tft/difficulty';
import { DifficultyLevel, TooltipState } from '@/lib/tft/teamplanner-types';
import { Info } from 'lucide-react';

interface DifficultyPickerProps {
  value?: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipState>>;
}

export const DifficultyPicker = ({ value, onChange, setTooltip }: DifficultyPickerProps) => {
  const currentConfig = value ? getDifficultyConfig(value) : null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Difficulty:</span>
      </div>
      <div className="flex gap-1.5">
        {DIFFICULTY_LEVELS.map((diff) => {
          const isActive = value === diff.id;
          return (
            <button
              key={diff.id}
              onClick={() => onChange(diff.id)}
              onMouseEnter={(e) => setTooltip({ 
                visible: true, 
                title: diff.label, 
                description: diff.description, 
                x: e.clientX, 
                y: e.clientY 
              })}
              onMouseLeave={() => setTooltip(p => ({ ...p, visible: false }))}
              className={`
                px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider
                border transition-all duration-200
                ${isActive 
                  ? 'scale-105 shadow-lg' 
                  : 'opacity-50 hover:opacity-80'
                }
              `}
              style={{
                backgroundColor: isActive ? diff.bgColor : 'transparent',
                borderColor: isActive ? diff.color : 'rgba(255,255,255,0.4)',
                color: isActive ? diff.color : 'rgba(255,255,255,0.7)',
                boxShadow: isActive ? `0 0 20px ${diff.bgColor}` : 'none'
              }}
            >
              {diff.shortLabel}
            </button>
          );
        })}
      </div>
      {currentConfig && (
        <div 
          className="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest"
          style={{
            backgroundColor: currentConfig.bgColor,
            borderColor: currentConfig.borderColor,
            color: currentConfig.color
          }}
        >
          {currentConfig.label}
        </div>
      )}
    </div>
  );
};
