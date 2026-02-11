import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

import Footer from '@/components/Footer';
import { TftTeamPlanner } from '@/components/tft/TftTeamPlanner';
import NavbarTft from '@/components/NavbarTft';

// Server-side authentication check
export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const params = await searchParams;
  const editId = params?.edit ?? null;

  if (!session?.user) {
    const redirectUrl = editId 
      ? `/tft/planner?edit=${editId}`
      : '/tft/planner';
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <NavbarTft />

      <main className="relative max-w-[1800px] mx-auto px-4 sm:px-6 py-8">
        <TftTeamPlanner editId={editId} key={editId || 'new'} />
      </main>

      <Footer />
    </div>
  );
}
