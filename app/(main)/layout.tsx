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
    <div className="min-h-screen bg-[#9da5b0] py-0 md:py-6 px-0 md:px-6 flex justify-center items-start">
      <div className="w-full max-w-[1580px] min-h-[calc(100vh-3rem)] rounded-none md:rounded-[40px] bg-[#fcfbf7] shadow-[0_25px_70px_rgba(0,0,0,0.18)] border border-white/60 p-5 md:p-8 relative flex flex-col overflow-hidden">
        {/* Subtle warm golden ambient glow in the top-right / mid-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-20 w-[620px] h-[620px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffcf36]/22 via-[#ffcf36]/6 to-transparent blur-3xl rounded-full"
        />

        {/* Top horizontal navigation bar matching the reference image */}
        <Header userName={user.name} userEmail={user.email} />

        {/* Main Content Area */}
        <main className="flex-1 mt-6 relative z-10 w-full min-w-0 overflow-x-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
