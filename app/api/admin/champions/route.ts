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
  const body = await request.json() as TFTChampion;

  // Destructure everything that IS NOT a column in 'tft_champions'
  // to avoid PGRST204 "column not found" errors.
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
    // Capture any other fields that might be sent but aren't in the table
    ...rest
  } = body;

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
    console.error("Supabase champion upsert error:", champError);
    return NextResponse.json({ error: champError.message, detail: champError }, { status: 500 });
  }

  // 2. Handle Traits if provided (separate table tft_champion_traits)
  if (traits && Array.isArray(traits)) {
    await supabase
      .from("tft_champion_traits")
      .delete()
      .eq("champion_id", id);

     if (traits.length > 0) {
       // Remove duplicates before inserting
       const uniqueTraits = [...new Set(traits)];
       const traitInserts = uniqueTraits.map(traitId => ({
         champion_id: id,
         trait_id: traitId
       }));

      const { error: traitError } = await supabase
        .from("tft_champion_traits")
        .insert(traitInserts);

      if (traitError) {
        console.error("Supabase traits insert error:", traitError);
      }
    }
  }

  // 3. Handle Best Items if provided (separate table tft_champion_best_items)
  if (tft_champion_best_items && Array.isArray(tft_champion_best_items)) {
    await supabase
      .from("tft_champion_best_items")
      .delete()
      .eq("champion_id", id);

    if (tft_champion_best_items.length > 0) {
      const itemInserts = tft_champion_best_items.map((item, index) => ({
        champion_id: id,
        item_id: item.id,
        priority: index + 1
      }));

      const { error: itemError } = await supabase
        .from("tft_champion_best_items")
        .insert(itemInserts);

      if (itemError) {
        console.error("Supabase best items insert error:", itemError);
      }
    }
  }

  return NextResponse.json({ success: true });
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
