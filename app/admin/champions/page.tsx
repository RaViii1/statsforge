import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Users } from "lucide-react";
import ChampionForm from "./ChampionsForm";
import ChampionList from "./ChampionList";
import { TFTSet } from "@/lib/tft/champions";
import Link from "next/link";


export default async function AdminChampionsPage() {
  const supabase = await createClient();
  
    const { data: champions } = await supabase
      .from("tft_champions")
      .select("*, tft_sets(name, set_number), tft_champion_traits(trait_id, tft_traits(name, icon_path))")
      .order("cost", { ascending: true });

  const { data: sets } = await supabase
    .from("tft_sets")
    .select("id, name, set_number")
    .order("set_number", { ascending: false });

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
            Champions
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 pt-10 space-y-10">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Champion Management
              </h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Add and edit TFT units, abilities, and base stats
              </p>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">
          <div className="sticky top-20">
            <ChampionForm sets={(sets as (TFTSet & { id: number })[]) || []} />
          </div>
          <div>
            <ChampionList initialChampions={champions || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
