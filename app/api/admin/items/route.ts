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

export async function POST(request: Request) {
  const supabase = await createClient();
    const body = await request.json() as TFTItem;
  
    const { id, name, set_id, image_path, description, stats, is_component, is_artifact, is_radiant, is_seasonal } = body;
  
    const dbData = {
      id: id || `TFT_Item_${name.toLowerCase().replace(/\s+/g, "_")}`,
      name,
      set_id: set_id === 0 ? null : set_id,
      image_path,
      description,
      stats,
      is_component,
      is_artifact,
      is_radiant,
      is_seasonal
    };

  const { error } = await supabase
    .from("tft_items")
    .upsert([dbData]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

  const { error } = await supabase
    .from("tft_items")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
