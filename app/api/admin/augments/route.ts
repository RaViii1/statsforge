import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("augments")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  
  const isArray = Array.isArray(body);
  const items = isArray ? body : [body];

  if (items.length === 0) {
    return NextResponse.json({ error: "No augments provided" }, { status: 400 });
  }

  const stripTags = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const results = [];

  for (const item of items) {
    const { id, name, description, tier, icon_path, gamemode, apiname } = item;

    if (!name) {
      results.push({ success: false, id: id || null, error: "Name is required" });
      continue;
    }

    let processedIconPath = icon_path;
    if (icon_path) {
      try {
        const url = new URL(icon_path);
        processedIconPath = url.pathname.split("/").pop() || icon_path;
      } catch {
        processedIconPath = icon_path;
      }
    }

    const insertData: any = {
      name,
      description: stripTags(description) || '',
      tier: tier !== undefined && tier !== null ? Number(tier) : null,
      icon_path: processedIconPath,
      gamemode: gamemode || [],
      apiname: apiname || ''
    };
    
    if (id && id > 0) {
      insertData.id = id;
    }

    const { error } = await supabase
      .from("augments")
      .insert([insertData]);

    if (error) {
      results.push({ success: false, id: id || null, error: error.message });
    } else {
      results.push({ success: true, id: id || null });
    }
  }

  const successCount = results.filter(r => r.success).length;
  return NextResponse.json({ success: true, count: successCount, results });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("augments")
    .delete()
    .eq("id", Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  const { id, name, description, tier, icon_path, gamemode, apiname } = body;

  if (!id || !name) {
    return NextResponse.json(
      { error: "ID and name are required" },
      { status: 400 }
    );
  }

  const numericTier = tier !== undefined && tier !== null ? Number(tier) : null;

  let processedIconPath = icon_path;
  if (icon_path) {
    try {
      const url = new URL(icon_path);
      processedIconPath = url.pathname.split("/").pop() || icon_path;
    } catch {
      processedIconPath = icon_path;
    }
  }

  const { error } = await supabase
    .from("augments")
    .update({ name, description, tier: numericTier, icon_path: processedIconPath, gamemode, apiname })
    .eq("id", Number(id));

  if (error) {
    console.error("Error updating augment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}