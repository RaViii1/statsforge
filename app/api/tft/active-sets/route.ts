import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: activeSets, error } = await supabase
    .from("tft_sets")
    .select("id, set_number, name, patch_start, patch_end")
    .eq("is_active", true)
    .order("set_number", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(activeSets || []);
}
