import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    const { userId, role, premium_user } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const updateData: any = {};
    
    if (role !== undefined) {
      const validRoles = ["admin", "moderator", "user"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updateData.role = role;
    }
    
    if (premium_user !== undefined) {
      updateData.premium_user = premium_user;
    }
    
    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}