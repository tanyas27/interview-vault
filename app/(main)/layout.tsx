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
    <div className="min-h-screen relative flex flex-col items-center w-full max-w-full overflow-x-clip bg-[linear-gradient(135deg,#dce1e7_0%,#e8ecf1_22%,#f2f3f5_42%,#f8f5ea_62%,#fdebb2_82%,#fce186_100%)] bg-fixed">
      {/* Ambient background glows (top-left slate mist, bottom-right warm yellow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        {/* Top-left cool slate ambient aura */}
        <div className="absolute -left-24 -top-24 w-[650px] h-[650px] bg-[radial-gradient(circle_at_center,_rgba(203,213,225,0.45),_transparent_70%)] blur-3xl rounded-full" />

        {/* Mid-right warm golden glow */}
        <div className="absolute -right-24 top-1/4 w-[620px] h-[620px] bg-[radial-gradient(circle_at_center,_rgba(255,207,54,0.22),_transparent_70%)] blur-3xl rounded-full" />

        {/* Bottom-right luminous warm yellow ambient aura */}
        <div className="absolute -right-28 -bottom-28 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(255,207,54,0.36),_rgba(254,235,160,0.2)_45%,_transparent_70%)] blur-3xl rounded-full" />
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
