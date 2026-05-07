import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("runes")
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
  const {
    id: providedId,
    tree_id,
    icon_path,
    name,
    description,
    is_keystone,
    is_stat_shard,
    slot_row,
    slot_col
  } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Use provided ID if present, otherwise generate new
  const runeId = providedId || `rune_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

  // Check if rune with this ID already exists
  const { data: existingRune } = await supabase
    .from("runes")
    .select("id")
    .eq("id", runeId)
    .single();

  if (existingRune) {
    // Update existing rune instead of inserting
    const updateData: any = {
      tree_id: tree_id || null,
      icon_path,
      name,
      description: description || "",
      is_keystone: is_keystone || false,
      is_stat_shard: is_stat_shard || false,
      slot_row: slot_row ?? null,
      slot_col: slot_col ?? null,
    };

    const { error: updateError } = await supabase
      .from("runes")
      .update(updateData)
      .eq("id", runeId);

    if (updateError) {
      console.error("Error updating rune:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: runeId, updated: true });
  }

  // Insert new rune
  const insertData = {
    id: runeId,
    tree_id: tree_id || null,
    icon_path,
    name,
    description: description || "",
    is_keystone: is_keystone || false,
    is_stat_shard: is_stat_shard || false,
    slot_row: slot_row ?? null,
    slot_col: slot_col ?? null,
  };

  const { error } = await supabase.from("runes").insert([insertData]);

  if (error) {
    console.error("Error saving rune:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: runeId });
}

export async function PUT(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const body = await request.json();
  const {
    id,
    tree_id,
    icon_path,
    name,
    description,
    is_keystone,
    is_stat_shard,
    slot_row,
    slot_col,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Build update object with only provided fields
  const updateData: Record<string, any> = {};

  if (tree_id !== undefined) updateData.tree_id = tree_id;
  if (icon_path !== undefined) updateData.icon_path = icon_path;
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (is_keystone !== undefined) updateData.is_keystone = is_keystone;
  if (is_stat_shard !== undefined) updateData.is_stat_shard = is_stat_shard;
  if (slot_row !== undefined) updateData.slot_row = slot_row ?? null;
  if (slot_col !== undefined) updateData.slot_col = slot_col ?? null;

  // No fields to update
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("runes")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating rune:", error);
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

  // Optional: clean up references in `trees.slots`
  const { data: treesData, error: treesError } = await supabase
    .from("trees")
    .select("id, slots");

  if (treesError) {
    console.error("Error fetching trees for cleanup:", treesError);
  } else if (treesData) {
    const treesToUpdate: Array<{ id: string; slots: string[][] }> = [];

    for (const tree of treesData) {
      // Safely cast `slots` as `string[][]` (or fall back to `[]`)
      const slots: string[][] =
        Array.isArray(tree.slots)
          ? tree.slots.map((row): string[] => {
              // Cast each slot array as `string[]` (or `[]` if not array)
              return Array.isArray(row) ? row : [];
            })
          : [];

      const newSlots = slots.map((row: string[]) =>
        row.filter((runeId) => runeId !== id)
      );

      // Only push if something changed
      if (JSON.stringify(newSlots) !== JSON.stringify(slots)) {
        treesToUpdate.push({ id: tree.id, slots: newSlots });
      }
    }

    for (const tree of treesToUpdate) {
      const { error: updateError } = await supabase
        .from("trees")
        .update({ slots: tree.slots })
        .eq("id", tree.id);

      if (updateError) {
        console.error(`Error updating tree ${tree.id}:`, updateError);
      }
    }
  }

  const { error: deleteError } = await supabase
    .from("runes")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}