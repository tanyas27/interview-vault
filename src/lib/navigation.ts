export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Applications', href: '/applications' },
  { name: 'Referrals', href: '/referrals' },
  { name: 'Rounds', href: '/rounds' },
  { name: 'Question Bank', href: '/questions' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
