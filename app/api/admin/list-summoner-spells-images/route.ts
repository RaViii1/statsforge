import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data: files, error } = await supabase.storage
      .from("summoner_spells")
      .list("", {
        limit: 500,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("List files error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = (files || [])
      .filter(f => f.name && /\.(png|jpg|jpeg|gif|webp|svg|webmanifest)$/i.test(f.name))
      .map(f => ({
        name: f.name,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/summoner_spells/${f.name}`,
      }));

    return NextResponse.json({ files: images });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
