import type { ReactNode } from 'react';
import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/layout/PageTransition';

export const dynamic = 'force-dynamic';

export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center w-full max-w-full overflow-x-clip bg-[linear-gradient(135deg,#f6f4ee_0%,#faf4e4_20%,#f8eccb_45%,#f3dfa4_72%,#ebce82_100%)] bg-fixed">
      {/* Ambient background glows (soft warm champagne and gentle warm honey auras) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {/* Top-left soft warm champagne glow */}
        <div className="absolute -left-24 -top-24 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,_rgba(254,235,160,0.25),_transparent_70%)] blur-3xl rounded-full" />

        {/* Mid-right gentle golden glow */}
        <div className="absolute -right-24 top-1/4 w-[620px] h-[620px] bg-[radial-gradient(circle_at_center,_rgba(240,210,120,0.18),_transparent_70%)] blur-3xl rounded-full" />

        {/* Bottom-right softened warm amber aura */}
        <div className="absolute -right-28 -bottom-28 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(238,205,115,0.22),_rgba(254,235,160,0.1)_45%,_transparent_70%)] blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-[1580px] min-h-screen p-4 sm:p-5 md:p-6 lg:p-8 relative flex flex-col overflow-x-clip">

        {/* Top horizontal navigation bar */}
        <Header userName={user.name} userEmail={user.email} />

        {/* Main Content Area */}
        <main className="flex-1 mt-4 md:mt-6 relative z-10 w-full min-w-0 overflow-x-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
