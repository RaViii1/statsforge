import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const setIdParam = searchParams.get("set_id");

  let targetSetId: number | null = null;
  if (setIdParam) {
    targetSetId = parseInt(setIdParam, 10);
  }

  // Base query: always exclude component items
  let query = supabase
    .from("tft_items")
    .select("*, tft_sets(name, set_number)")
    .or("is_component.eq.false,is_component.is.null")
    .order("name", { ascending: true });

  // Apply set filtering:
  // - If set_id provided: show items from that set + items with no set (global items)
  // - If no set_id: show only items with no set (global items only)
  if (targetSetId !== null) {
    query = query.or(`set_id.eq.${targetSetId},set_id.is.null`);
  } else {
    query = query.is("set_id", null);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
