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
  const { name, description, tier, icon_path, gamemode } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

  const { error } = await supabase
    .from("augments")
    .insert([{ name, description, tier, icon_path: processedIconPath, gamemode }]);

  if (error) {
    console.error("Error saving augment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
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
  const { id, name, description, tier, icon_path, gamemode } = body;

  if (!id || !name) {
    return NextResponse.json(
      { error: "ID and name are required" },
      { status: 400 }
    );
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

  const { error } = await supabase
    .from("augments")
    .update({ name, description, tier, icon_path: processedIconPath, gamemode })
    .eq("id", Number(id));

  if (error) {
    console.error("Error updating augment:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}