import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TFTChampion } from "@/lib/tft/champions";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tft_champions")
    .select("*, tft_sets(name, set_number)")
    .order("cost", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json() as TFTChampion | TFTChampion[];

  const isArray = Array.isArray(body);
  const champions = isArray ? body : [body];

  if (champions.length === 0) {
    return NextResponse.json({ error: "No champions provided" }, { status: 400 });
  }

  const results = [];

  for (const champ of champions) {
    const { 
      traits, 
      tft_champion_best_items, 
      id,
      name,
      cost,
      set_id,
      image_path,
      ability,
      stats,
      ...rest
    } = champ;

    if (!id || !name) {
      results.push({ success: false, id: id || null, error: "ID and name are required" });
      continue;
    }

    const dbData = {
      id,
      name,
      cost,
      set_id,
      image_path,
      ability,
      stats,
    };

    // 1. Upsert the champion to 'tft_champions'
    const { error: champError } = await supabase
      .from("tft_champions")
      .upsert([dbData]);

    if (champError) {
      results.push({ success: false, id, error: champError.message });
      continue;
    }

    results.push({ success: true, id });
  }

  const successCount = results.filter(r => r.success).length;
  return NextResponse.json({ success: true, count: successCount, results });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Related data is deleted via ON DELETE CASCADE if configured, 
  // but let's be explicit just in case since we don't know the exact constraint config
  await supabase.from("tft_champion_traits").delete().eq("champion_id", id);
  await supabase.from("tft_champion_best_items").delete().eq("champion_id", id);
  await supabase.from("tft_unit_positions").delete().eq("champion_id", id);

  const { error } = await supabase
    .from("tft_champions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
