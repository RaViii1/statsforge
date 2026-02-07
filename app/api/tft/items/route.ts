import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TFTItem } from "@/lib/tft/itemstft";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tft_items")
    .select("*, tft_sets(name, set_number)")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

