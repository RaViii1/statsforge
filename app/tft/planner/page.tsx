import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

import Footer from '@/components/Footer';
import { TftTeamPlanner } from '@/components/tft/TftTeamPlanner';
import NavbarTft from '@/components/NavbarTft';

// Server-side authentication check
export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; set_id?: string }>
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const params = await searchParams;
  const editId = params?.edit ?? null;
  const setIdFromUrl = params?.set_id ?? null;

  if (!session?.user) {
    const redirectUrl = editId 
      ? `/tft/planner?edit=${editId}`
      : '/tft/planner';
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-0 w-[700px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute left-0 w-[600px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[120px]" />
        </div>

      <NavbarTft />

      <main className="relative max-w-[1800px] mx-auto px-4 sm:px-6 py-8">
        <TftTeamPlanner editId={editId} initialSetId={setIdFromUrl ? parseInt(setIdFromUrl) : null} key={editId || 'new'} />
      </main>

      <Footer />
    </div>
  );
}
