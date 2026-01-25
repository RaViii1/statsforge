import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TFTTrait } from "@/lib/tft/champions";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tft_traits")
    .select("*, tft_sets(name, set_number)")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json() as TFTTrait;

  const { id, name, set_id, icon_path, description } = body;

  const dbData = {
    id: id || name.toLowerCase().replace(/\s+/g, "-"),
    name,
    set_id,
    icon_path,
    description
  };

  const { error } = await supabase
    .from("tft_traits")
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
    .from("tft_traits")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
