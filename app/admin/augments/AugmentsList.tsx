"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type Augment = {
  id: number;
  name: string;
  description: string;
  tier: string | string[];
  icon_path: string;
  gamemode: string | string[];
};

const TIER_STYLES: Record<string, { badge: string; border: string; glow: string, bg: string }> = {
  silver: {
    badge: 'bg-zinc-700/40 text-zinc-300 border-zinc-500/40',
    border: 'border-zinc-500/50',
    glow:  'shadow-zinc-500/10',
    bg: 'bg-zinc-800/40',
  },
  gold: {
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    border: 'border-yellow-500/50',
    glow:  'shadow-yellow-500/10',
    bg: 'bg-yellow-500/10',

  },
  prismatic: {
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    border: 'border-purple-500/50',
    glow:  'shadow-purple-500/10',
    bg: 'bg-purple-500/10',
  },
};

const FALLBACK_TIER = {
  badge: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  border: 'border-white/10',
  glow:  '',
  bg: 'bg-zinc-900/50',
};

export default function AugmentsList() {
  const [augments, setAugments] = useState<Augment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchAugments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/augments");
      if (!res.ok) throw new Error("Failed to fetch augments");
      const data = await res.json();
      setAugments(data);
    } catch (err: any) {
      toast.error(err.message || "Error fetching augments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAugments();
    const handler = () => fetchAugments();
    window.addEventListener('augments-updated', handler);
    return () => window.removeEventListener('augments-updated', handler);
  }, [fetchAugments]);

  const deleteAugment = async (id: number) => {
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/augments?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Failed to delete");
      }
      toast.success("Augment deleted");
      await fetchAugments();
    } catch (err: any) {
      toast.error(err.message || "Error deleting augment");
    } finally {
      setIsDeleting(null);
    }
  };

  const getTier = (tier: string | string[]) =>
    Array.isArray(tier) ? tier[0] : tier;

  const getGamemodes = (gm: string | string[]) =>
    Array.isArray(gm) ? gm : gm ? [gm] : [];

  const filtered = augments.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-[72px] bg-[#111112] border border-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* Search + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search augments..."
            className="w-full bg-[#111112] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 transition-colors"
          />
        </div>
        <div className="flex-shrink-0 px-3 py-2.5 bg-[#111112] border border-white/5 rounded-xl">
          <span className="text-xs font-semibold text-zinc-500">
            {filtered.length}
            <span className="text-zinc-700 font-normal"> / {augments.length}</span>
          </span>
        </div>
      </div>

      {/* Empty states */}
      {augments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm font-medium">No augments yet</p>
          <p className="text-zinc-700 text-xs mt-1">Create one using the form on the left</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-zinc-500 text-sm">No results for "<span className="text-zinc-300">{search}</span>"</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((augment) => {
            const tier = getTier(augment.tier);
            const gamemodes = getGamemodes(augment.gamemode);
            const tierStyle = (tier && TIER_STYLES[tier]) ? TIER_STYLES[tier] : FALLBACK_TIER;
            const imgUrl = augment.icon_path
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/augments/${augment.icon_path}`
              : null;

            return (
              <div
                key={augment.id}
                className="flex items-center gap-4 px-4 py-3 bg-[#111112] border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#141415] transition-all group"
              >
                {/* Icon with tier-colored border */}
                <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 shadow-lg ${tierStyle.border} ${tierStyle.glow} ${tierStyle.bg}`}>
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={augment.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        t.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#18181b;color:#52525b;font-size:14px;font-weight:700">${augment.name?.[0]?.toUpperCase() ?? '?'}</div>`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full ${tierStyle.bg} flex items-center justify-center text-white text-sm font-bold ${tierStyle.border} ${tierStyle.glow} ${tierStyle.bg}`}>
                      {augment.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white text-sm font-semibold">{augment.name}</span>
                    {tier && (
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${tierStyle.badge}`}>
                        {tier}
                      </span>
                    )}
                    {gamemodes.map(gm => (
                      <span
                        key={gm}
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border bg-orange-500/10 text-orange-400 border-orange-500/20"
                      >
                        {gm}
                      </span>
                    ))}
                  </div>
                  {augment.description ? (
                    <p className="text-zinc-600 text-xs leading-relaxed line-clamp-2 break-words">{augment.description}</p>
                  ) : (
                    <p className="text-zinc-800 text-xs italic">No description</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('edit-augment', { detail: augment }));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-zinc-400 hover:text-orange-400 text-xs px-3 py-1.5 bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/20 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAugment(augment.id)}
                    disabled={isDeleting === augment.id}
                    className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isDeleting === augment.id ? (
                      <span className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin inline-block" />
                    ) : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}