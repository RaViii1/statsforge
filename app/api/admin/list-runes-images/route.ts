import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "lol-runes";

    const supabase = createServiceClient();

    const { data: files, error } = await supabase.storage
      .from("Lol_runes")
      .list(folder, {
        limit: 500,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("List runes files error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images = (files || [])
      .filter(f => f.name && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f.name))
      .map(f => ({
        name: `${folder}/${f.name}`,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Lol_runes/${folder}/${f.name}`,
      }));

    return NextResponse.json({ files: images });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}