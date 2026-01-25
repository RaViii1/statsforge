import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CurrentSetNumber } from "@/lib/tft/champions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const setNumber = searchParams.get("set") || CurrentSetNumber;

    const supabase = await createClient();

    // First, find the set_id for this set_number
    const { data: setData, error: setError } = await supabase
      .from("tft_sets")
      .select("id")
      .eq("set_number", setNumber)
      .single();

    if (setError || !setData) {
      return NextResponse.json({ error: "Set not found" }, { status: 404 });
    }

    const setId = setData.id;

    let query = supabase
      .from("tft_champions")
      .select(`
        *,
        tft_champion_traits (
          tft_traits (
            *
          )
        ),
        tft_champion_best_items (
          tft_items (
            *
          )
        )
      `)
      .eq("set_id", setId);

    if (name) {
      // Handle slugs (replace hyphens with spaces or just try both)
      const nameWithSpaces = name.replace(/-/g, " ");
      query = query.or(`name.ilike."${name}",name.ilike."${nameWithSpaces}"`);
    }

    const { data: champions, error } = await query.order("cost", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format champions to match the TFTChampion type
    const formattedChampions = champions.map((champ: any) => ({
      ...champ,
      traits: champ.tft_champion_traits?.map((ct: any) => ct.tft_traits.name) || [],
      trait_details: champ.tft_champion_traits?.map((ct: any) => ct.tft_traits) || [],
      tft_champion_best_items: champ.tft_champion_best_items?.map((bi: any) => bi.tft_items) || []
    }));

    if (name && formattedChampions.length > 0) {
      return NextResponse.json(formattedChampions[0]);
    }

    return NextResponse.json(formattedChampions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
