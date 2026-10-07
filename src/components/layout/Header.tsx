'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Settings, Bell, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/navigation';

interface HeaderProps {
  userName: string;
  userEmail: string;
}

const NAV_WITHOUT_SETTINGS = NAV_ITEMS.filter((item) => item.href !== '/settings');

export function Header({ userName, userEmail }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="relative z-30 w-full max-w-full">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border border-black/15 bg-white/70 backdrop-blur-md shadow-xs hover:bg-white transition-all text-[#1c2024] shrink-0"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffcf36] ring-2 ring-[#ffcf36]/40" />
          <span className="font-bold tracking-tight text-sm sm:text-base">InterviewVault</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full bg-white/60 backdrop-blur-md border border-black/[0.06] shadow-xs"
        >
          {NAV_WITHOUT_SETTINGS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'px-3.5 xl:px-5 py-1.5 xl:py-2 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 shrink-0',
                  isActive
                    ? 'bg-[#1c2024] text-white shadow-sm'
                    : 'text-[#5d636f] hover:text-[#1c2024] hover:bg-black/5',
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/settings"
            className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white/70 hover:bg-white text-xs font-semibold text-[#1c2024] shadow-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-[#5d636f]" />
            <span>Settings</span>
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="w-10 h-10 rounded-full border border-black/10 bg-white/70 hover:bg-white flex items-center justify-center text-[#5d636f] hover:text-[#1c2024] shadow-xs transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          <div
            className="w-10 h-10 rounded-full bg-[#ffcf36] text-[#1c2024] font-bold text-sm flex items-center justify-center border border-black/10 shadow-xs"
            title={`${userName} (${userEmail})`}
            aria-label={`Signed in as ${userName}`}
          >
            {initial}
          </div>

          <form action={logout} className="hidden md:block">
            <button
              type="submit"
              title="Logout"
              aria-label="Log out"
              className="w-10 h-10 rounded-full border border-black/10 bg-white/70 hover:bg-white flex items-center justify-center text-[#5d636f] hover:text-red-600 shadow-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>

          <button
            type="button"
            id="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            className="lg:hidden w-10 h-10 rounded-full border border-black/10 bg-white/70 flex items-center justify-center text-[#1c2024]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          className="lg:hidden mt-3 p-4 rounded-3xl bg-white border border-black/10 shadow-xl space-y-2 animate-slide-down"
        >
          {NAV_WITHOUT_SETTINGS.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2.5 rounded-full text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#1c2024] text-white'
                    : 'text-[#5d636f] hover:bg-black/5 hover:text-[#1c2024]',
                )}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-[#5d636f] px-3 py-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit" className="text-red-600">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
