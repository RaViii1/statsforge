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
  const body = await request.json() as Item & { image?: string } | Array<Item & { image?: string }>;
  
  // Support batch import
  const itemsArray = Array.isArray(body) ? body : [body];
  
  const results = [];
  
  for (const itemData of itemsArray) {
    const { id, riot_api_id, name, stats, description, image_path, image, gamemode } = itemData;
    
    // Use image field as fallback for image_path (from JSON imports)
    let sourceImagePath = image_path || image || '';
    
    // Extract just the filename from the image path if it's a full URL
    let processedImagePath = sourceImagePath;
    if (sourceImagePath) {
      try {
        const url = new URL(sourceImagePath);
        processedImagePath = url.pathname.split('/').pop() || sourceImagePath;
      } catch (e) {
        // If it's not a valid URL, use it as is (assuming it's already a filename)
        processedImagePath = sourceImagePath;
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
      results.push({ id: finalId, success: false, error: error.message });
    } else {
      results.push({ id: finalId, success: true });
    }
  }
  
  const failedCount = results.filter(r => !r.success).length;
  const successCount = results.filter(r => r.success).length;
  
  if (failedCount > 0) {
    console.error(`Batch import: ${successCount} succeeded, ${failedCount} failed`);
    return NextResponse.json({ success: false, results, message: `${successCount} imported, ${failedCount} failed` }, { status: 207 });
  }
  
  return NextResponse.json({ success: true, count: successCount });
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
