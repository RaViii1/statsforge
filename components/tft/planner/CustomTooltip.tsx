import { TooltipState } from "@/lib/tft/teamplanner-types";

interface CustomTooltipProps extends TooltipState {}

export const CustomTooltip = ({ 
  visible, 
  title, 
  description, 
  x, 
  y 
}: CustomTooltipProps) => {
  if (!visible) return null;
  return (
    <div 
      className="fixed z-100 pointer-events-none p-4 bg-zinc-950/95 border-2 border-orange-500/30 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.1)] max-w-[260px] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
      style={{ left: Math.min(x + 20, typeof window !== 'undefined' ? window.innerWidth - 280 : 0), top: Math.min(y + 10, typeof window !== 'undefined' ? window.innerHeight - 150 : 0) }}
    >
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <p className="text-xs font-black text-white uppercase tracking-wider">{title}</p>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{description}</p>
        <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between">
          <span className="text-[9px] font-black text-orange-500/50 uppercase tracking-[0.2em]">Tactical Intel</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
          </div>
        </div>
        <span className="text-[9px] font-black text-orange-500/50 uppercase tracking-[0.2em]">Item components</span>
      </div>
    </div>
  );
};
