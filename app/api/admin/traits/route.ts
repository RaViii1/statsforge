import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { TFTTrait } from "@/lib/tft/champions";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tft_traits")
    .select("*, tft_sets(name, set_number), tft_trait_tiers(*)")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json() as TFTTrait;

    const { id, name, set_id, icon_path, description, tiers } = body;
    // Ensure traitId is always a string
    const traitId = String(id || `${set_id}_${name.toLowerCase().replace(/\s+/g, "_")}`);

    const dbData = {
      id: traitId,
      name,
      set_id,
      icon_path,
      description
    };

    // Upsert trait
    const { error: traitError } = await supabase
      .from("tft_traits")
      .upsert([dbData]);

    if (traitError) {
      console.error("Trait upsert error:", traitError);
      return NextResponse.json({ error: traitError.message }, { status: 500 });
    }

    // Upsert tiers
    if (tiers && tiers.length > 0) {
      const tierData = tiers.map(tier => ({
        trait_id: traitId,
        tier: tier.tier,
        units_required: tier.units_required,
        description: tier.description
      }));

      // Delete existing tiers first
      await supabase
        .from("tft_trait_tiers")
        .delete()
        .eq("trait_id", traitId);

      // Insert new tiers
      const { error: tiersError } = await supabase
        .from("tft_trait_tiers")
        .upsert(tierData);

      if (tiersError) {
        console.error("Tiers upsert error:", tiersError);
        return NextResponse.json({ error: tiersError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Delete trait tiers first
  await supabase
    .from("tft_trait_tiers")
    .delete()
    .eq("trait_id", id);

  // Delete trait
  const { error } = await supabase
    .from("tft_traits")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
