"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { TftTeamPlanner } from '@/components/tft/TftTeamPlanner';

function PlannerContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get('edit') ??null;
  
  return <TftTeamPlanner key={editId || 'new'} editId={editId} />;
}

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="relative max-w-[1800px] mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <PlannerContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

