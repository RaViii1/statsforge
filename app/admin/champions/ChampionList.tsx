'use client';

import { Trash2, Edit2, Search, Box } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SvgIcon from "@/components/SvgIcon";
import { getCostColor, TFTSet, getTraitIconUrl } from "@/lib/tft/champions";

interface ChampionListProps {
  initialChampions: any[];
  sets: (TFTSet & { id: number })[];
}

export default function ChampionList({ initialChampions, sets }: ChampionListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | 'all' | 'active'>(() => {
    const activeSets = sets.filter(s => s.is_active);
    if (activeSets.length === 1) {
      return activeSets[0].id;
    }
    return 'active';
  });
  const [champions, setChampions] = useState<any[]>(initialChampions);

  useEffect(() => {
    const handleChampionsUpdated = () => {
      router.refresh();
    };
    window.addEventListener('champions-updated', handleChampionsUpdated);
    return () => window.removeEventListener('champions-updated', handleChampionsUpdated);
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this champion?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/champions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Champion deleted");
      setChampions(champions.filter(c => c.id !== id));
    } catch (error) {
      toast.error("Error deleting champion");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (champ: any) => {
    window.dispatchEvent(new CustomEvent('edit-champion', { detail: champ }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = champions.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesSet = true;
    
    if (selectedSetId === 'active') {
      const activeSetIds = sets.filter(s => s.is_active).map(s => s.id);
      matchesSet = c.set_id != null && activeSetIds.includes(Number(c.set_id));
    } else if (selectedSetId !== 'all') {
      matchesSet = Number(c.set_id) === Number(selectedSetId);
    }
    
    return matchesSearch && matchesSet;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search units..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-zinc-900/80 transition-all"
          />
        </div>
        {sets.length > 0 && (
          <select
            value={selectedSetId as any}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all' || value === 'active') {
                setSelectedSetId(value);
              } else {
                setSelectedSetId(parseInt(value));
              }
            }}
            className="bg-zinc-900/60 rounded-xl px-3 py-2.5 text-xs text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all"
          >
            <option value="active">Active Sets ({sets.filter(s => s.is_active).length})</option>
            <option value="all">All Sets</option>
            {sets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name} (Set {set.set_number}){set.is_active ? ' - Active' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((champ) => {
          const costColor = getCostColor(champ.cost);
          const imageUrl = champ.image_path 
            ? champ.image_path.startsWith('http') 
              ? champ.image_path 
              : champ.image_path.includes('/')
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${champ.image_path}`
                : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/champions/${champ.image_path}`
            : "/images/nochampionimage.jpg";
          
          return (
            <div 
              key={champ.id} 
              className="group relative rounded-2xl overflow-hidden bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300"
            >
              <div className="absolute inset-0 pointer-events-none">
                <img 
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ 
                    objectPosition: 'top left',
                    maskImage: 'radial-gradient(ellipse 100% 80% at 0% 0%, black 30%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 100% 80% at 0% 0%, black 30%, transparent 75%)'
                  }}
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 90% 70% at 100% 0%, ${costColor}18 0%, transparent 60%),
                      linear-gradient(200deg, ${costColor}10 0%, transparent 45%),
                      linear-gradient(to bottom, transparent 0%, rgba(24,24,27,0.5) 55%, rgba(24,24,27,0.92) 100%)
                    `
                  }}
                />
              </div>

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div 
                      className="w-16 h-16 rounded-xl overflow-hidden ring-2"
                      style={{ 
                        boxShadow: `0 0 24px ${costColor}25, 0 4px 12px rgba(0,0,0,0.3)` 
                      }}
                    >
                      <img 
                        src={imageUrl}
                        alt={champ.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== '/images/nochampionimage.jpg') {
                            target.src = '/images/nochampionimage.jpg';
                          }
                        }}
                      />
                    </div>
                    <div 
                      className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white shadow-lg"
                      style={{ backgroundColor: costColor }}
                    >
                      {champ.cost}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                          {champ.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                          Set {champ.tft_sets?.set_number} — {champ.tft_sets?.name}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button 
                          onClick={() => handleEdit(champ)}
                          className="p-2 rounded-lg bg-zinc-800/60 text-zinc-500 hover:text-white hover:bg-zinc-700/60 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(champ.id)}
                          disabled={isDeleting === champ.id}
                          className="p-2 rounded-lg bg-zinc-800/60 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
                  <StatRow 
                    icon={<SvgIcon type="health" size={10} />}
                    label="Health"
                    values={[champ.stats?.stars?.[0]?.hp, champ.stats?.stars?.[1]?.hp, champ.stats?.stars?.[2]?.hp]}
                    color="text-red-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="dmg" size={10} />}
                    label="Attack"
                    values={[champ.stats?.stars?.[0]?.dmg, champ.stats?.stars?.[1]?.dmg, champ.stats?.stars?.[2]?.dmg]}
                    color="text-orange-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="ap" size={10} />}
                    label="Ability"
                    values={[champ.stats?.stars?.[0]?.ap, champ.stats?.stars?.[1]?.ap, champ.stats?.stars?.[2]?.ap]}
                    color="text-blue-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="armor" size={10} />}
                    label="Armor"
                    values={[champ.stats?.stars?.[0]?.armor, champ.stats?.stars?.[1]?.armor, champ.stats?.stars?.[2]?.armor]}
                    color="text-yellow-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="mr" size={10} />}
                    label="Magic Res"
                    values={[champ.stats?.stars?.[0]?.mr, champ.stats?.stars?.[1]?.mr, champ.stats?.stars?.[2]?.mr]}
                    color="text-purple-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="mana" size={10} />}
                    label="Mana"
                    value={champ.stats?.mana}
                    color="text-cyan-400"
                  />
                  <StatRow 
                    icon={<SvgIcon type="crit" size={10} />}
                    label="Crit"
                    value={champ.stats?.stars?.[0]?.crit}
                    color="text-red-300"
                  />
                  <StatRow 
                    icon={<SvgIcon type="attackspeed" size={10} />}
                    label="Speed"
                    value={champ.stats?.speed}
                    color="text-amber-400"
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Range</span>
                      <div className="flex gap-[3px]">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-4 rounded-sm ${i <= (champ.stats?.range || 1) ? "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.3)]" : "bg-zinc-800"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{champ.stats?.range || 1}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800/40 flex flex-wrap gap-1.5">
                  {champ.tft_champion_traits?.map((t: any) => (
                    <div 
                      key={t.trait_id} 
                      className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-1 rounded-lg ring-1 ring-white/5"
                    >
                      <div className="w-3.5 h-3.5 overflow-hidden flex items-center justify-center">
                        {t.tft_traits?.icon_path ? (
                          <img 
                            src={getTraitIconUrl(t.tft_traits.icon_path)}
                            alt="" 
                            className="w-full h-full object-contain brightness-150" 
                          />
                        ) : (
                          <Box className="w-3 h-3 text-zinc-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-400">{t.tft_traits?.name}</span>
                    </div>
                  ))}
                  {(!champ.tft_champion_traits || champ.tft_champion_traits.length === 0) && (
                    <span className="text-[10px] text-zinc-600 italic">No traits assigned</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatRow({ icon, label, values, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  values?: (number | undefined)[]; 
  value?: number;
  color: string;
}) {
  const displayValue = values 
    ? values.filter((v): v is number => v !== undefined && v !== null).join(' / ')
    : value ?? '—';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className={color}>{icon}</span>
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <span className={`text-xs font-bold ${color}`}>{displayValue}</span>
    </div>
  );
}