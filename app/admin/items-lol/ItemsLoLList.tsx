'use client';

import { Trash2, Edit2, Search, Package, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/lib/items";


interface ItemsLoLListProps {
  initialItems: Item[];
}

export default function ItemsLoLList({ initialItems }: ItemsLoLListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/items-lol?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Item deleted");
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (item: Item) => {
    window.dispatchEvent(new CustomEvent("edit-lol-item", { detail: item }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.riot_api_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-orange-500/25 rounded-2xl p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3.5">
                {/* Item icon */}
                <div className="shrink-0 w-13 h-13">
                  <div className="w-[52px] h-[52px] rounded-xl border border-white/[0.1] overflow-hidden bg-black/40 flex items-center justify-center">
                    {item.image_path ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${item.image_path}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/noitem.png";
                        }}
                      />
                    ) : (
                      <Package className="w-5 h-5 text-zinc-700" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 pr-14">
                    <h3 className="text-sm font-semibold text-white leading-tight truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {item.riot_api_id && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
                        #{item.riot_api_id}
                      </span>
                    )}
                    {item.gamemode && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white/[0.06] text-zinc-400 border border-white/[0.08] px-2 py-0.5 rounded-full">
                        <Gamepad2 className="w-2.5 h-2.5" />
                        {item.gamemode}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {Object.keys(item.stats || {}).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(item.stats).map(([key, value]) => (
                        <span
                          key={key}
                          className="px-1.5 py-0.5 text-[10px] bg-white/[0.05] text-zinc-400 rounded-md capitalize border border-white/[0.06]"
                        >
                          <span className="text-zinc-600">{key}:</span>{" "}
                          {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons — absolutely positioned top-right */}
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => handleEdit(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                  title="Edit item"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting === item.id}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                  title="Delete item"
                >
                  {isDeleting === item.id ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-500">No items found</p>
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