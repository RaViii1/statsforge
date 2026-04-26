import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from("augments")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
