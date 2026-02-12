'use client';

import { Trash2, Edit2, Search, Shield } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TFTTrait } from "@/lib/tft/champions";

interface TraitListProps {
  initialTraits: any[];
}

export default function TraitList({ initialTraits }: TraitListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  const filtered = initialTraits.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-white shrink-0">Traits ({filtered.length})</h2>
        <div className="relative flex-1 max-w-xs">
          <input 
            type="text"
            placeholder="Search traits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((trait) => (
          <div key={trait.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl border-2 border-zinc-800 overflow-hidden bg-zinc-950 flex items-center justify-center p-2">
                  {trait.icon_path ? (
                    <img src={trait.icon_path} alt={trait.name} className="w-full h-full object-contain filter brightness-200" />
                  ) : (
                    <Shield size={24} className="text-zinc-700" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{trait.name}</h3>
                <p className="text-xs text-zinc-500">Set {trait.tft_sets?.set_number} • {trait.tft_sets?.name}</p>
                
                {/* Trait Tiers */}
                {trait.tft_trait_tiers && trait.tft_trait_tiers.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {trait.tft_trait_tiers.map((tier: any, index: number) => (
                      <div key={index} className="text-[10px] text-zinc-400 truncate">
                        <span className="font-semibold text-zinc-300">
                          ({tier.units_required} units):
                        </span>{" "}
                        {tier.description}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 italic">{trait.description}</p>
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
