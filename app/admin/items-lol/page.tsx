import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Swords } from "lucide-react";
import ItemsLoLForm from "./ItemsLoLForm";
import ItemsLoLList from "./ItemsLoLList";

import Link from "next/link";

export default async function ItemsLoLPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("items_lol")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching LoL items:", error);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-24">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-[#0d0d0f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-400 transition-colors text-[11px] font-semibold tracking-[0.12em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Admin Panel
          </Link>
          <span className="text-white/10 text-lg font-thin">/</span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-400">
            LoL Items
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Swords className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Items Management
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                League of Legends — items, stats &amp; game modes
              </p>
            </div>
          </div>

        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="xl:sticky top-20">
            <ItemsLoLForm />
          </div>
          <div>
            <ItemsLoLList initialItems={items || []} />
          </div>
        </div>
      </div>
    </div>
  );
}