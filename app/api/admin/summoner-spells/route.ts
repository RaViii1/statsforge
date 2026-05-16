import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SummonerSpell } from "@/lib/summoner-spell";

function extractFilename(iconPath: string | undefined): string | undefined {
  if (!iconPath) return undefined;
  try {
    const url = new URL(iconPath);
    const parts = url.pathname.split('/');
    return (parts[parts.length - 1] || '').replace(/^\//, '');
  } catch {
    return (iconPath.split('/').pop() || '').replace(/^\//, '');
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("summoner_spells_lol")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json() as SummonerSpell | SummonerSpell[];

  const spellsArray = Array.isArray(body) ? body : [body];

  const results = [];

  for (const spellData of spellsArray) {
    const {
      id,
      name,
      cooldown,
      description,
      icon_path,
    } = spellData;

    const finalId = id || name;

    const dbData = {
      id: finalId,
      name,
      cooldown,
      description,
      icon_path: extractFilename(icon_path),
    };

    const { error } = await supabase
      .from("summoner_spells_lol")
      .upsert([dbData]);

    if (error) {
      console.error("Error saving summoner spell:", error);
      results.push({ id: finalId, success: false, error: error.message });
    } else {
      results.push({ id: finalId, success: true });
    }
  }

  const failedCount = results.filter((r) => !r.success).length;
  const successCount = results.filter((r) => r.success).length;

  if (failedCount > 0) {
    console.error(
      `Batch import: ${successCount} succeeded, ${failedCount} failed`
    );
    return NextResponse.json(
      { success: false, results, message: `${successCount} imported, ${failedCount} failed` },
      { status: 207 }
    );
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
    .from("summoner_spells_lol")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
