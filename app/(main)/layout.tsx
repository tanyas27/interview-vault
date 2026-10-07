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
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center w-full max-w-full overflow-x-clip">
      <div className="w-full max-w-[1580px] min-h-screen p-4 sm:p-5 md:p-6 lg:p-8 relative flex flex-col overflow-x-clip">
        {/* Subtle warm golden ambient glow in the top-right / mid-right (contained to avoid horizontal overflow) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-24 top-20 w-[620px] h-[620px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffcf36]/22 via-[#ffcf36]/6 to-transparent blur-3xl rounded-full"
          />
        </div>

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
