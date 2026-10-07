'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Settings, Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/navigation';

interface HeaderProps {
  userName: string;
  userEmail: string;
}

const NAV_WITHOUT_SETTINGS = NAV_ITEMS.filter((item) => item.href !== '/settings');

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Header({ userName, userEmail }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = getInitials(userName);

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
            title="Settings"
            aria-label="Settings"
            className="w-10 h-10 rounded-full border border-black/10 bg-white/70 hover:bg-white flex items-center justify-center text-[#5d636f] hover:text-[#1c2024] shadow-xs transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setShowLogoutDialog(true)}
            className="w-10 h-10 rounded-full bg-white/70 hover:bg-white active:scale-95 text-[#5d636f] hover:text-[#1c2024] flex items-center justify-center border border-black/10 shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2"
            title={`${userName} (${userEmail}) • Click to log out`}
            aria-label={`User profile for ${userName}. Click to log out`}
          >
            <User className="w-4 h-4" />
          </button>

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
          <div className="pt-2 border-t border-black/5">
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-[#5d636f] hover:text-[#1c2024] px-3 py-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[360px] p-6 rounded-[28px] bg-[#fcfbf7] border border-[#ede9df] shadow-[0_20px_50px_rgba(28,32,36,0.12)]">
          <div className="space-y-1.5 text-left">
            <DialogTitle className="text-lg font-bold text-[#1c2024] tracking-tight">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-sm text-[#717682] leading-relaxed">
              Are you sure you want to logout
            </DialogDescription>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
              className="w-full h-10 rounded-full bg-[#EBF7D5] hover:bg-[#dfeec4] text-[#658b2d] border border-[#749c36]/20 font-semibold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer"
            >
              Cancel
            </Button>
            <form action={logout} className="w-full">
              <Button
                type="submit"
                disabled={isLoggingOut}
                onClick={() => setIsLoggingOut(true)}
                className="w-full h-10 rounded-full bg-[#ffcf36] hover:bg-[#f5be24] text-[#1c2024] font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
