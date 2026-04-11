import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServiceClient();

    // First check if bucket exists by trying to access it
    try {
      const { data: files, error } = await supabase.storage
        .from("item-icons")
        .list("", {
          limit: 500,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        console.error("[item-icons] List files error:", error);
        // Try alternative bucket name
        console.log("[item-icons] Trying alternative bucket name...");
        const altResult = await supabase.storage.from("TftUnitIcons").list("", { limit: 500 });
        if (!altResult.error && altResult.data) {
          const images = (altResult.data || [])
            .filter(f => f.name && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f.name))
            .map(f => ({
              name: f.name,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ItemIcons/${f.name}`,
            }));
          return NextResponse.json({ images });
        }
        return NextResponse.json({ error: error.message, images: [] }, { status: 500 });
      }
      const images = (files || [])
        .filter(f => f.name && /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f.name))
        .map(f => ({
          name: f.name,
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-icons/${f.name}`,
        }));

      // console.log("[item-icons] Filtered images:", images.length);
      return NextResponse.json({ images });
    } catch (bucketErr) {
      console.error("[item-icons] Bucket access error:", bucketErr);
      return NextResponse.json({ 
        error: "Bucket not accessible. Check if 'item-icons' bucket exists in Supabase.",
        details: bucketErr instanceof Error ? bucketErr.message : String(bucketErr),
        images: [] 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[item-icons] API error:", error);
    return NextResponse.json({ error: error.message, images: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const fileName = file.name;

    // Try uploading to item-icons first
    let uploadResult = await supabase.storage
      .from("item-icons")
      .upload(fileName, file, { upsert: true });

    // If that fails, try alternative bucket name
    if (uploadResult.error) {
  
      uploadResult = await supabase.storage
        .from("ItemIcons")
        .upload(fileName, file, { upsert: true });
      
      if (!uploadResult.error) {
        return NextResponse.json({
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ItemIcons/${fileName}`,
          filename: fileName,
        });
      }
    }

    if (uploadResult.error) {
      console.error("[item-icons] Upload error:", uploadResult.error);
      return NextResponse.json({ error: uploadResult.error.message }, { status: 500 });
    }

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-icons/${fileName}`,
      filename: fileName,
    });
  } catch (error: any) {
    console.error("[item-icons] Upload API error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}