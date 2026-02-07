import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Box } from "lucide-react";
import Link from "next/link";
import SetsList from "./SetList";
import SetForm from "./SetForm";

export default async function AdminSetsPage() {
  const supabase = await createClient();
  
  const { data: sets } = await supabase
    .from("tft_sets")
    .select("*")
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
          <Box className="text-orange-500" />
          Set Management
        </h1>
        <p className="text-zinc-400">Configure TFT sets, numbers, and active status</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <SetForm />
          </div>
        </div>

        <div className="xl:col-span-2">
          <SetsList initialSets={sets || []} />
        </div>
      </div>
    </div>
  );
}
