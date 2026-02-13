import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Shield } from "lucide-react";
import TraitForm from "./TraitForm";
import TraitList from "./TraitList";
import { TFTSet } from "@/lib/tft/champions";
import Link from "next/link";

export default async function AdminTraitsPage() {
  const supabase = await createClient();
  
  const { data: traits } = await supabase
    .from("tft_traits")
    .select("*, tft_sets(name, set_number), tft_trait_tiers(*)")
    .order("name", { ascending: true });

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
          <Shield className="text-purple-500" />
          Trait Management
        </h1>
        <p className="text-zinc-400">Configure synergies and trait tier bonuses</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <TraitForm key="trait-form" sets={(sets as (TFTSet & { id: number })[]) || []} />
          </div>
        </div>

        <div className="xl:col-span-2">
          <TraitList initialTraits={traits || []} />
        </div>
      </div>
    </div>
  );
}
