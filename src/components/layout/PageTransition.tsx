'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="w-full min-w-0 animate-page-in">
      {children}
    </div>
  );
}
