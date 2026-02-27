import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import { Item } from "@/lib/items";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items_lol")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json() as Item;
  
  // console.log('Received LoL item data:', body);
  
  const { id, riot_api_id, name, stats, description, image_path, gamemode } = body;
  
  // Extract just the filename from the image path if it's a full URL
  let processedImagePath = image_path;
  if (image_path) {
    try {
      const url = new URL(image_path);
      processedImagePath = url.pathname.split('/').pop() || image_path;
    } catch (e) {
      // If it's not a valid URL, use it as is (assuming it's already a filename)
      processedImagePath = image_path;
    }
  }

  const finalId = id || `LoL_Item_${name.toLowerCase().replace(/\s+/g, "_")}`;
  const finalRiotApiId = riot_api_id || finalId;

  const dbData = {
    id: finalId,
    riot_api_id: finalRiotApiId,
    name,
    stats,
    description,
    image_path: processedImagePath,
    gamemode
  };

  const { error } = await supabase
    .from("items_lol")
    .upsert([dbData]);

  if (error) {
    console.error('Error saving LoL item:', error);
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
    .from("items_lol")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
