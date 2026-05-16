'use client';

import { Trash2, Edit2, Search, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  SummonerSpell,
  getSummonerSpellIconUrl
} from "@/lib/summoner-spell";

interface SummonerSpellsListProps {
  initialSpells?: SummonerSpell[];
}

const SPELLS_PER_PAGE = 20;

export default function SummonerSpellsList({ initialSpells = [] }: SummonerSpellsListProps) {
  const router = useRouter();
  const [spells, setSpells] = useState<SummonerSpell[]>(initialSpells);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadSpells = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/summoner-spells');
      if (res.ok) {
        const data = await res.json();
        setSpells(data);
      }
    } catch (error) {
      console.error('Failed to load summoner spells:', error);
    }
  }, []);

  useEffect(() => {
    if (initialSpells.length > 0) {
      setSpells(initialSpells);
    } else {
      loadSpells();
    }
  }, [initialSpells, loadSpells]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this summoner spell?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/summoner-spells?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Summoner spell deleted");
      setSpells((prev) => prev.filter((spell) => spell.id !== id));
      router.refresh();
    } catch (error) {
      toast.error("Error deleting spell");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (spell: SummonerSpell) => {
    window.dispatchEvent(new CustomEvent("edit-summoner-spell", { detail: spell }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = spells.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.id).toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / SPELLS_PER_PAGE);
  const startIndex = (currentPage - 1) * SPELLS_PER_PAGE;
  const paginatedSpells = filtered.slice(startIndex, startIndex + SPELLS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header + Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or Riot ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.12] focus:border-orange-500/50 focus:ring-0 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>
        <div className="shrink-0 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-orange-500 tabular-nums">
          {filtered.length}
          <span className="text-orange-500 font-normal ml-1 text-xs">
            {filtered.length === 1 ? "spell" : "spells"}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginatedSpells.map((spell) => (
              <div
                key={spell.id}
                className="group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-orange-500/25 rounded-2xl p-4 transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  {/* Spell icon */}
                  <div className="shrink-0 w-[52px] h-[52px]">
                    <div className="w-[52px] h-[52px] rounded-xl border border-white/[0.1] overflow-hidden bg-black/40 flex items-center justify-center">
                      {spell.icon_path ? (
                        <img
                          src={getSummonerSpellIconUrl(spell.icon_path)}
                          alt={spell.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/noitem.png";
                          }}
                        />
                      ) : (
                        <Zap className="w-5 h-5 text-zinc-700" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 pr-14">
                      <h3 className="text-sm font-semibold text-white leading-tight truncate">
                        {spell.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      {spell.cooldown != null && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-white/[0.06] text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded-full">
                          <Zap className="w-2.5 h-2.5" />
                          {spell.cooldown}s CD
                        </span>
                      )}
                    </div>

                    {spell.description && (
                      <p className="mt-2 text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {spell.description}
                      </p>
                    )}

                  </div>
                </div>

                {/* Action buttons — absolutely positioned top-right */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => handleEdit(spell)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                    title="Edit spell"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(spell.id)}
                    disabled={isDeleting === spell.id}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                    title="Delete spell"
                  >
                    {isDeleting === spell.id ? (
                      <svg
                        className="w-3.5 h-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <div className="text-xs text-zinc-500">
                Showing {startIndex + 1} to {Math.min(startIndex + SPELLS_PER_PAGE, filtered.length)} of {filtered.length} spells
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-zinc-300" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-orange-500 text-white'
                            : 'bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-500">No spells found</p>
          {searchTerm && (
            <p className="text-xs text-zinc-600 mt-1">
              Try a different search term
            </p>
          )}
        </div>
      )}
    </div>
  );
}
