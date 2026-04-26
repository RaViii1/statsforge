'use client';

import { Trash2, Edit2, Search, Shield } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TFTTrait } from "@/lib/tft/champions";

interface TraitListProps {
  initialTraits: any[];
  sets?: any[];
}

export default function TraitList({ initialTraits, sets = [] }: TraitListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | 'all' | 'universal'>('all');

  const filtered = initialTraits.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesSet = true;

    if (selectedSetId === 'all') {
      matchesSet = true;
    } else if (selectedSetId === 'universal') {
      matchesSet = t.set_id === null;
    } else {
      matchesSet = t.set_id === Number(selectedSetId);
    }

    return matchesSearch && matchesSet;
  });

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this trait?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/traits?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Trait deleted");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting trait");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (trait: any) => {
    window.dispatchEvent(new CustomEvent('edit-trait', { detail: trait }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search traits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111112] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 transition-colors"
          />
        </div>
        {sets.length > 0 && (
          <select
            value={selectedSetId as any}
            onChange={(e) => setSelectedSetId(e.target.value as any)}
            className="bg-[#111112] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Sets</option>
            <option value="universal">Universal (No Set)</option>
            {sets.map((set: any) => (
              <option key={set.id} value={set.id}>
                {set.name} (Set {set.set_number}){set.is_active ? ' - Active' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((trait) => (
          <div key={trait.id} className="bg-zinc-900 border border-zinc-800 p-4 max-h-48 rounded-3xl hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl border-2 border-zinc-800 overflow-hidden bg-zinc-950 flex items-center justify-center p-2">
                  {trait.icon_path ? (
                    <img 
                      src={trait.icon_path.startsWith('http') ? trait.icon_path : trait.icon_path.includes('/') ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${trait.icon_path}` : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/traits/${trait.icon_path}`} 
                      alt={trait.name} 
                      className="w-full h-full object-contain filter brightness-200" 
                    />
                  ) : (
                    <Shield size={24} className="text-zinc-700" />
                  )}
                </div>
              </div>

               <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                  {trait.name}
                  {trait.is_Hero && (
                    <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      Hero
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-500">Set {trait.tft_sets?.set_number} • {trait.tft_sets?.name}</p>
                
                {/* Trait Tiers */}
                {trait.tft_trait_tiers && trait.tft_trait_tiers.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {[...trait.tft_trait_tiers].sort((a, b) => {
                      const getTierOrder = (tier: string): number => {
                        const [base, suffix] = tier.split('_');
                        const order = { bronze: 0, silver: 1, gold: 2, prismatic: 3 };
                        const baseOrder = order[base as keyof typeof order] ?? 99;
                        const suffixNum = suffix ? parseInt(suffix, 10) : 0;
                        return baseOrder * 100 + suffixNum;
                      };
                      
                      return getTierOrder(a.tier) - getTierOrder(b.tier);
                    }).map((tier: any, index: number) => (
                      <div key={index} className="text-[10px] text-zinc-400 truncate">
                        <span className="font-semibold text-zinc-300">
                          ({tier.units_required} units):
                        </span>{" "}
                        {tier.description}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 italic ">{trait.description}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEdit(trait)}
                  className="p-2 bg-zinc-800/50 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(trait.id)}
                  disabled={isDeleting === trait.id}
                  className="p-2 bg-zinc-800/50 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
