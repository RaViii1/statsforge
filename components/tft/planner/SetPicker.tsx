'use client';

interface SetPickerProps {
  activeSets: any[];
  selectedSetId: number | null;
  onSetChange: (setId: number) => void;
  disabled?: boolean;
}

export default function SetPicker({ 
  activeSets, 
  selectedSetId, 
  onSetChange,
  disabled = false
}: SetPickerProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-1.5 bg-white/4 border border-white/5 rounded-xl">
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Set:</span>
      <select 
        value={selectedSetId || ''} 
        onChange={(e) => !disabled && onSetChange(parseInt(e.target.value))}
        disabled={disabled}
        className={`
          bg-transparent text-[10px] font-black text-orange-400 
          focus:bg-zinc-900 focus:outline-none cursor-pointer disabled:cursor-not-allowed
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        {activeSets.map((set: any) => (
          <option key={set.id} value={set.id} className="bg-zinc-900">
            S{set.set_number} - {set.name}
          </option>
        ))}
      </select>
    </div>
  );
}
