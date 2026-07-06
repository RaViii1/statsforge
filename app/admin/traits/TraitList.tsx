'use client';

import { Trash2, Edit2, Search, Shield } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TFTTrait, getTraitIconUrl } from "@/lib/tft/champions";

interface TraitListProps {
  initialTraits: any[];
  sets?: any[];
}

export default function TraitList({ initialTraits, sets = [] }: TraitListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | 'all' | 'universal'>('all');
  const [traits, setTraits] = useState<any[]>(initialTraits);

  useEffect(() => {
    const handleTraitsUpdated = () => {
      router.refresh();
    };
    window.addEventListener('traits-updated', handleTraitsUpdated);
    return () => window.removeEventListener('traits-updated', handleTraitsUpdated);
  }, [router]);

  const filtered = traits.filter(t => {
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
      setTraits(traits.filter(t => t.id !== id));
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

  // Helper to get tier color - text colors only
  const getTierTextColor = (tier: string): string => {
    const base = tier.split('_')[0];
    const colors: Record<string, string> = {
      bronze: '#cd7f32',
      silver: '#cd7f32', // Using bronze color for silver
      gold: '#cd7f32', // Bronze color for gold too
      prismatic: '#cd7f32', // Bronze color for prismatic
    };
    return colors[base] || '#a1a1aa';
  };

  // Get text color class for tiers
  const getTierTextClass = (tier: string): string => {
    const base = tier.split('_')[0];
    const colors: Record<string, string> = {
      bronze: 'text-amber-600',
      silver: 'text-amber-600',
      gold: 'text-yellow-400',
      prismatic: 'text-purple-400',
    };
    return colors[base] || 'text-zinc-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search traits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-zinc-900/80 transition-all"
          />
        </div>
        {sets.length > 0 && (
          <select
            value={selectedSetId as any}
            onChange={(e) => setSelectedSetId(e.target.value as any)}
            className="bg-zinc-900/60 rounded-xl px-3 py-2.5 text-xs text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all"
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((trait) => {
          const iconUrl = trait.icon_path 
            ? trait.icon_path.startsWith('http') 
              ? trait.icon_path 
              : getTraitIconUrl(trait.icon_path)
            : null;

          const sortedTiers = trait.tft_trait_tiers 
            ? [...trait.tft_trait_tiers].sort((a, b) => {
                const getTierOrder = (tier: string): number => {
                  const [base, suffix] = tier.split('_');
                  const order = { bronze: 0, silver: 1, gold: 2, prismatic: 3 };
                  const baseOrder = order[base as keyof typeof order] ?? 99;
                  const suffixNum = suffix ? parseInt(suffix, 10) : 0;
                  return baseOrder * 100 + suffixNum;
                };
                return getTierOrder(a.tier) - getTierOrder(b.tier);
              })
            : [];

          return (
            <div 
              key={trait.id} 
              className="group relative rounded-2xl overflow-hidden bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 90% 70% at 100% 0%, ${trait.is_Hero ? '#a855f718' : '#f9731618'} 0%, transparent 60%),
                      linear-gradient(200deg, ${trait.is_Hero ? '#a855f710' : '#f9731610'} 0%, transparent 45%),
                      linear-gradient(to bottom, transparent 0%, rgba(24,24,27,0.5) 55%, rgba(24,24,27,0.92) 100%)
                    `
                  }}
                />
              </div>

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  {/* Icon with glow */}
                  <div className="relative shrink-0">
                    <div 
                      className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-zinc-800 bg-zinc-950 flex items-center justify-center p-2"
                      style={{ 
                        boxShadow: `0 0 20px ${trait.is_Hero ? '#a855f720' : '#f9731620'}, 0 4px 12px rgba(0,0,0,0.3)` 
                      }}
                    >
                      {iconUrl ? (
                        <img 
                          src={iconUrl}
                          alt={trait.name} 
                          className="w-full h-full object-contain brightness-200" 
                        />
                      ) : (
                        <Shield size={24} className="text-zinc-700" />
                      )}
                    </div>
                    {trait.is_Hero && (
                      <div 
                        className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-white shadow-lg"
                        style={{ backgroundColor: '#a855f7' }}
                      >
                        H
                      </div>
                    )}
                  </div>

                  {/* Header */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                          {trait.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                          {trait.set_id ? `Set ${trait.tft_sets?.set_number} — ${trait.tft_sets?.name}` : 'Universal Trait'}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button 
                          onClick={() => handleEdit(trait)}
                          className="p-2 rounded-lg bg-zinc-800/60 text-zinc-500 hover:text-white hover:bg-zinc-700/60 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(trait.id)}
                          disabled={isDeleting === trait.id}
                          className="p-2 rounded-lg bg-zinc-800/60 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Tier List */}
                {sortedTiers.length > 0 ? (
                  <div className="mt-4 space-y-1.5">
                    {sortedTiers.map((tier: any, index: number) => {
                      const tierText = getTierTextClass(tier.tier);
                      const tierName = tier.tier.replace('_', ' ');
                      
                      return (
                        <div key={index} className="flex items-baseline gap-2.5">
                          {/* Units required - aligned baseline with text */}
                          <span 
                            className={`shrink-0 text-xs font-black tabular-nums ${tierText}`}
                            style={{ minWidth: '1.25rem' }}
                          >
                            {tier.units_required}
                          </span>
                          
                          {/* Tier name + description inline */}
                          <div className="min-w-0 flex items-baseline gap-1.5 flex-wrap">
                            <span 
                              className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${tierText}`}
                            >
                              {tierName}
                            </span>
                            <span className="text-xs text-zinc-400 leading-snug">
                              {tier.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-zinc-400 leading-relaxed italic">
                    {trait.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}