import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE_KB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "TftUnitIcons";
    const folder = (formData.get("folder") as string) || "champions";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // File size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeKB = (file.size / 1024).toFixed(1);
      return NextResponse.json(
        { error: `File too large (${sizeKB}KB). Maximum allowed size is ${MAX_FILE_SIZE_KB}KB.` },
        { status: 413 }
      );
    }

    // File type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Allowed: PNG, JPG, GIF, WebP, SVG.` },
        { status: 415 }
      );
    }

    const supabase = createServiceClient();
    let filePath: string;
    let publicUrl: string;

    if (bucket === "item-icons" || bucket === "TftUnitIcons") {
      if (folder) {
        filePath = `${folder}/${file.name}`;
      } else {
        filePath = file.name;
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
    } else {
      const fileExt = file.name.split(".").pop();
      const baseName = file.name.split(".").slice(0, -1).join(".");
      const uniqueFileName = `${baseName}_${Date.now()}.${fileExt}`;
      filePath = `${folder}/${uniqueFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("TftUnitIcons")
        .upload(filePath, file);

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/TftUnitIcons/${filePath}`;
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}