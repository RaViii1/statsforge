'use client';

import { Trash2, Edit2, Sword, Shield, Zap, Heart, Search, Target, Star, Brain, Box } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SvgIcon from "@/components/SvgIcon";
import { getCostColor, getCostBorderColor } from "@/lib/tft/champions";

interface ChampionListProps {
  initialChampions: any[];
}

export default function ChampionList({ initialChampions }: ChampionListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this champion?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/champions?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Champion deleted");
      router.refresh();
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

  const RangeIndicator = ({ range }: { range: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-1.5 h-3 rounded-[1px] ${i <= range ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" : "bg-zinc-800"}`}
        />
      ))}
    </div>
  );

  const filtered = initialChampions.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            Units
            <span className="text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg text-xs font-bold">{filtered.length}</span>
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Manage TFT Champion Database</p>
        </div>
        <div className="relative group">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text"
            placeholder="Filter by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
          />
        </div>
      </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((champ) => (
            <div key={champ.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] hover:border-orange-500/30 transition-all group relative overflow-hidden">
              {/* Background Accent */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20" 
                style={{ backgroundColor: getCostColor(champ.cost) }}
              />

              <div className="flex gap-5 relative z-10">
                {/* Champion Image/Icon */}
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 rounded-2xl border-2 overflow-hidden flex items-center justify-center bg-zinc-950 shadow-2xl transition-colors duration-300 ${getCostBorderColor(champ.cost)}`}>
                    {champ.image_path ? (
                      <img src={champ.image_path} alt={champ.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                    ) : (
                      <img src="/images/nochampionimage.jpg" alt={champ.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                    )}
                  </div>
                  <div 
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl border-4 border-zinc-900 flex items-center justify-center text-[10px] font-black shadow-xl text-white"
                    style={{ backgroundColor: getCostColor(champ.cost) }}
                  >
                    {champ.cost}
                  </div>
                </div>

                {/* Champion Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight group-hover:text-orange-500 transition-colors">{champ.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Set {champ.tft_sets?.set_number}</span>
                          <div className="w-1 h-1 rounded-full bg-zinc-700" />
                          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{champ.tft_sets?.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEdit(champ)}
                          className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white hover:border-orange-500/50 rounded-xl transition-all shadow-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(champ.id)}
                          disabled={isDeleting === champ.id}
                          className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/50 rounded-xl transition-all shadow-lg disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="health" size={10} className="text-red-500/70" />
                            Health: 
                          </div>
                          <span className="text-zinc-400 ml-1">
                            {champ.stats?.stars?.[0]?.hp}/{champ.stats?.stars?.[1]?.hp}/{champ.stats?.stars?.[2]?.hp}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="dmg" size={10} className="text-orange-500/70" />
                            Attack: 
                          </div>
                          <span className="text-zinc-400 ml-1">
                            {champ.stats?.stars?.[0]?.dmg}/{champ.stats?.stars?.[1]?.dmg}/{champ.stats?.stars?.[2]?.dmg}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="ap" size={10} className="text-blue-500/70" />
                            Ability: 
                          </div>
                          <span className="text-zinc-400 ml-1">
                            {champ.stats?.stars?.[0]?.ap}/{champ.stats?.stars?.[1]?.ap}/{champ.stats?.stars?.[2]?.ap}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="armor" size={10} className="text-yellow-500/70" />
                            Armor: 
                          </div>
                          <span className="text-zinc-400 ml-1">
                            {champ.stats?.stars?.[0]?.armor}/{champ.stats?.stars?.[1]?.armor}/{champ.stats?.stars?.[2]?.armor}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="mr" size={10} className="text-purple-500/70" />
                            Mr: 
                          </div>
                          <span className="text-zinc-400 ml-1">
                            {champ.stats?.stars?.[0]?.mr}/{champ.stats?.stars?.[1]?.mr}/{champ.stats?.stars?.[2]?.mr}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 border-l border-zinc-800/50 pl-6">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="mana" size={10} className="text-blue-400/70" />
                            Mana: 
                          </div>
                          <span className="text-zinc-400 ml-">{champ.stats?.mana || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="crit" size={10} className="text-red-400/70" />
                            Crit: 
                          </div>
                          <span className="text-zinc-400 ml-">{champ.stats?.stars?.[0]?.crit || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            <SvgIcon type="attackspeed" size={10} className="text-amber-400/70" />
                            Speed: 
                          </div>
                          <span className="text-zinc-400">{champ.stats?.speed || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          <div className="flex items-center gap-1.5">
                            Range: 
                          </div>
                          <RangeIndicator range={champ.stats?.range || 1} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Traits Footer */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-wrap gap-1.5">
                    {champ.tft_champion_traits?.map((t: any) => (
                      <div key={t.trait_id} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg">
                        <div className="w-3.5 h-3.5 overflow-hidden flex items-center justify-center">
                          {t.tft_traits?.icon_path ? (
                            <img src={t.tft_traits?.icon_path} alt="" className="w-full h-full object-contain brightness-200" />
                          ) : (
                            <Box className="w-3 h-3 text-zinc-600" />
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-zinc-400">{t.tft_traits?.name}</span>
                      </div>
                    ))}
                    {(!champ.tft_champion_traits || champ.tft_champion_traits.length === 0) && (
                      <span className="text-[9px] text-zinc-600 italic">No traits assigned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
