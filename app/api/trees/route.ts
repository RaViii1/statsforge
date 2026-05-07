import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trees")
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
  const { id: providedId, name, icon_path, slots } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Use provided ID if present, otherwise generate new
  const treeId = providedId || `tree_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

  const processedSlots = Array.isArray(slots) && slots.length === 4
    ? slots.map((slot: unknown) => (Array.isArray(slot) ? slot : []))
    : [[], [], [], []];

  // Check if tree with this ID already exists
  const { data: existingTree } = await supabase
    .from("trees")
    .select("id")
    .eq("id", treeId)
    .single();

  if (existingTree) {
    // Update existing tree instead of inserting
    const { error: updateError } = await supabase
      .from("trees")
      .update({ name, icon_path, slots: processedSlots })
      .eq("id", treeId);

    if (updateError) {
      console.error("Error updating tree:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: treeId, updated: true });
  }

  // Insert new tree
  const { data, error } = await supabase
    .from("trees")
    .insert([{ id: treeId, name, icon_path, slots: processedSlots }])
    .select()
    .single();

  if (error) {
    console.error("Error saving tree:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  const { id, name, icon_path, slots } = body;

  if (!id || !name) {
    return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
  }

  const processedSlots = Array.isArray(slots) && slots.length === 4
    ? slots.map((slot: unknown) => (Array.isArray(slot) ? slot : []))
    : [[], [], [], []];

  const { error } = await supabase
    .from("trees")
    .update({ name, icon_path, slots: processedSlots })
    .eq("id", id);

  if (error) {
    console.error("Error updating tree:", error);
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

  // First, remove references to this tree from all runes
  const { error: runesUpdateError } = await supabase
    .from("runes")
    .update({ tree_id: null, slot_row: null, slot_col: null, is_keystone: false })
    .eq("tree_id", id);

  if (runesUpdateError) {
    console.error("Error updating runes for tree:", runesUpdateError);
    // Continue with deletion even if update fails
  }

  // Delete the tree
  const { error } = await supabase
    .from("trees")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting tree:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}