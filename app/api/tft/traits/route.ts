import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const setIdParam = searchParams.get("set_id");

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

    const { data: traits, error } = await supabase
      .from("tft_traits")
      .select("*")
      .eq("set_id", targetSetId)
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
