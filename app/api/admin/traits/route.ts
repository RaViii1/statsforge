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
    
    // First, get the set number from the tft_sets table using set_id
    const { data: setData, error: setError } = await supabase
      .from("tft_sets")
      .select("set_number")
      .eq("id", set_id)
      .single();

    if (setError) {
      console.error("Error fetching set data:", setError);
      return NextResponse.json({ error: "Invalid set" }, { status: 400 });
    }

    const setNumber = setData.set_number;
    
    // Ensure traitId is always a string
    const traitId = String(id || `${setNumber}_${name.toLowerCase().replace(/\s+/g, "_")}`);

    const dbData = {
      id: traitId,
      name,
      set_id,
      icon_path,
      description,
      is_Hero: body.is_Hero || false
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

    // Handle champion associations
    if (body.champions && Array.isArray(body.champions)) {
      // Delete existing associations
      await supabase
        .from("tft_champion_traits")
        .delete()
        .eq("trait_id", traitId);

      // Insert new associations
      if (body.champions.length > 0) {
        const associations = body.champions.map((champion: any) => ({
          trait_id: traitId,
          champion_id: champion.id
        }));

        const { error: championError } = await supabase
          .from("tft_champion_traits")
          .insert(associations);

        if (championError) {
          console.error("Champion associations error:", championError);
          return NextResponse.json({ error: championError.message }, { status: 500 });
        }
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
