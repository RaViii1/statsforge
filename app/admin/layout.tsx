// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import { AdminSidebar } from "./SidePanel"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile && profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)]">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/30 via-transparent to-transparent" />
          <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}