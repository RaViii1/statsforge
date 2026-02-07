import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const setIdParam = searchParams.get("set_id");  // New param

    const supabase = await createClient();

    let targetSetId: number;

    if (setIdParam) {
      // Frontend specified set_id - use it directly
      targetSetId = parseInt(setIdParam);
    } else {
      // No set_id - use first active set
      const { data: setData, error: setError } = await supabase
        .from("tft_sets")
        .select("id")
        .eq("is_active", true)
        .order("set_number", { ascending: false })  // Latest active first
        .limit(1);

      if (setError || !setData?.length) {
        return NextResponse.json({ error: "Active set not found" }, { status: 404 });
      }
      targetSetId = setData[0].id;
    }

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
      .eq("set_id", targetSetId);

    if (name) {
      const nameWithSpaces = name.replace(/-/g, " ");
      query = query.or(`name.ilike."${name}",name.ilike."${nameWithSpaces}"`);
    }

    const { data: champions, error } = await query.order("cost", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
