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
    const body = await request.json() as TFTTrait | TFTTrait[];

    const isArray = Array.isArray(body);
    const traits = isArray ? body : [body];

    if (traits.length === 0) {
      return NextResponse.json({ error: "No traits provided" }, { status: 400 });
    }

    const results = [];

    for (const trait of traits) {
      const { id, name, set_id, icon_path, description, tiers, champions, is_Hero, riot_api_name } = trait;

      if (!name) {
        results.push({ success: false, id: id || null, error: "Name is required" });
        continue;
      }

      // Get set number
      const { data: setData, error: setError } = await supabase
        .from("tft_sets")
        .select("set_number")
        .eq("id", set_id)
        .single();

      if (setError) {
        results.push({ success: false, id: id || null, error: "Invalid set" });
        continue;
      }

      const setNumber = setData.set_number;
      const traitId = String(id || `${setNumber}_${name.toLowerCase().replace(/\s+/g, "_")}`);

      let finalRiotApiName = riot_api_name;
      if (!finalRiotApiName) {
        finalRiotApiName = `TFT${setNumber}_${name.replace(/[\s_]+/g, '_').split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
      }

      const dbData = {
        id: traitId,
        name,
        set_id,
        icon_path,
        description,
        is_Hero: is_Hero || false,
        riot_api_name: finalRiotApiName
      };

      // Upsert trait
      const { error: traitError } = await supabase
        .from("tft_traits")
        .upsert([dbData]);

      if (traitError) {
        results.push({ success: false, id: traitId, error: traitError.message });
        continue;
      }

      // Upsert tiers
      if (tiers && tiers.length > 0) {
        const tierData = tiers.map((tier: any) => ({
          trait_id: traitId,
          tier: tier.tier,
          units_required: tier.units_required,
          description: tier.description
        }));

        await supabase
          .from("tft_trait_tiers")
          .delete()
          .eq("trait_id", traitId);

        const { error: tiersError } = await supabase
          .from("tft_trait_tiers")
          .upsert(tierData);

        if (tiersError) {
          results.push({ success: false, id: traitId, error: tiersError.message });
          continue;
        }
      }

      // Handle champion associations
      if (champions && Array.isArray(champions)) {
        await supabase
          .from("tft_champion_traits")
          .delete()
          .eq("trait_id", traitId);

        if (champions.length > 0) {
          const associations = champions.map((champion: any) => ({
            trait_id: traitId,
            champion_id: champion.id
          }));

          const { error: championError } = await supabase
            .from("tft_champion_traits")
            .insert(associations);

          if (championError) {
            results.push({ success: false, id: traitId, error: championError.message });
            continue;
          }
        }
      }

      results.push({ success: true, id: traitId });
    }

    const successCount = results.filter(r => r.success).length;
    return NextResponse.json({ success: true, count: successCount, results });
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
