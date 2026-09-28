import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#9da5b0] py-4 sm:py-8 px-3 sm:px-4 flex justify-center items-center relative overflow-hidden">
      {/* Subtle warm golden ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ffcf36]/25 via-[#ffcf36]/8 to-transparent blur-3xl rounded-full"
      />
      <div className="w-full max-w-[420px] relative z-10">
        {children}
      </div>
    </div>
  );
}
