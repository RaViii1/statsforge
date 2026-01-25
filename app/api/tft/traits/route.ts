import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { CurrentSetNumber } from "@/lib/tft/champions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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

    const { data: traits, error } = await supabase
      .from("tft_traits")
      .select("*")
      .eq("set_id", setId)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out duplicates by name
    const uniqueTraits = traits.filter((trait, index, self) =>
      index === self.findIndex((t) => t.name === trait.name)
    );

    return NextResponse.json(uniqueTraits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
