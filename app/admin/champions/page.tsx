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
    <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all group uppercase text-[10px] font-black tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Panel
          </Link>
        </div>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="text-orange-500" />
          Champion Management
        </h1>
        <p className="text-zinc-400">Add and edit TFT units, abilities, and base stats</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <ChampionForm sets={(sets as (TFTSet & { id: number })[]) || []} />
          </div>
        </div>

        <div className="xl:col-span-2">
          <ChampionList initialChampions={champions || []} />
        </div>
      </div>
    </div>
  );
}
