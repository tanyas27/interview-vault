'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/navigation';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Applications: Briefcase,
  Referrals: Users,
  Rounds: MessageSquare,
  'Question Bank': BookOpen,
  Analytics: BarChart3,
  Settings: Settings,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-black/[0.06] bg-[#fcfbf7]">
        <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto px-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-3 h-3 rounded-full bg-[#ffcf36]" />
            <h1 className="text-lg font-bold text-[#1c2024]">InterviewVault</h1>
          </div>
          <nav aria-label="Main navigation" className="mt-8 flex-1 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = ICONS[item.name];
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all',
                    isActive
                      ? 'bg-[#1c2024] text-white shadow-xs'
                      : 'text-[#717682] hover:bg-black/5 hover:text-[#1c2024]',
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-4 w-4',
                        isActive ? 'text-white' : 'text-[#8e939f] group-hover:text-[#1c2024]',
                      )}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
