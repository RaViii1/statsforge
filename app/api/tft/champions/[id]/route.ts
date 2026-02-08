import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: champion, error } = await supabase
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
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Format champion to flatten traits and best items
    const formattedChampion = {
      ...champion,
      traits: champion.tft_champion_traits?.map((ct: any) => ct.tft_traits.name) || [],
      trait_details: champion.tft_champion_traits?.map((ct: any) => ct.tft_traits) || [],
      tft_champion_best_items: champion.tft_champion_best_items?.map((bi: any) => bi.tft_items) || []
    };

    return NextResponse.json(formattedChampion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
