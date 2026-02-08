import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Box } from "lucide-react";
import ItemForm from "./ItemsForm";
import ItemList from "./ItemsList";
import { TFTSet }  from "@/lib/tft/champions";
import { TFTItem } from "@/lib/tft/itemstft";
import Link from "next/link";

export default async function AdminItemsPage() {
  const supabase = await createClient();
  
  const { data: items } = await supabase
    .from("tft_items")
    .select("*, tft_sets(name, set_number)")
    .order("name", { ascending: true });

  const { data: sets } = await supabase
    .from("tft_sets")
    .select("id, name, set_number")
    .order("set_number", { ascending: false });

   // Get component items (is_component = true) for build path selection
  const { data: components } = await supabase
    .from("tft_items")
    .select("id, name, image_path")
    .eq("is_component", true)
    .order("name", { ascending: true });

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
          <Box className="text-green-500" />
          Item Management
        </h1>
        <p className="text-zinc-400">Configure TFT items, stats, and artifact status</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <ItemForm 
              sets={(sets as (TFTSet & { id: number })[]) || []} 
              components={(components as TFTItem[]) || []}
            />
          </div>
        </div>

        <div className="xl:col-span-2">
          <ItemList initialItems={items || []} />
        </div>
      </div>
    </div>
  );
}
