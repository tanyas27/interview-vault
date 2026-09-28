'use client';

import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';

interface Referral {
  id: string;
  company: string;
  referrerName: string;
  status: string;
  role?: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-zinc-100 text-zinc-600',
  HR_CONTACTED: 'bg-blue-50 text-blue-600',
  APPLIED: 'bg-[#ffcf36]/20 text-[#8a6b00]',
  REJECTED: 'bg-red-50 text-red-500',
  GHOSTED: 'bg-zinc-200 text-zinc-400',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  HR_CONTACTED: 'HR Contacted',
  APPLIED: 'Applied',
  REJECTED: 'Rejected',
  GHOSTED: 'Ghosted',
};

export function ReferralsWidget({
  referrals,
  pendingCount,
}: {
  referrals: Referral[];
  pendingCount: number;
}) {
  return (
    <div className="h-full flex flex-col rounded-[32px] border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-[#1c2024]">Referrals</h3>
          {pendingCount > 0 && (
            <p className="text-xs text-blue-600 font-medium mt-0.5">
              {pendingCount} awaiting response
            </p>
          )}
        </div>
        <Link
          href="/referrals"
          aria-label="View all referrals"
          className="w-8 h-8 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#1c2024] hover:bg-black/5 transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {referrals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-4">
          <p className="text-xs text-[#717682]">No referrals tracked yet</p>
          <Link
            href="/referrals/new"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1c2024] hover:underline"
          >
            <Plus className="w-3 h-3" /> Add one
          </Link>
        </div>
      ) : (
        <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
          {referrals.map((r) => (
            <Link
              key={r.id}
              href={`/referrals/${r.id}`}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#fcfbf7] transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#1c2024] flex items-center justify-center text-white font-bold text-xs shrink-0">
                {r.company.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1c2024] truncate">{r.company}</p>
                <p className="text-[11px] text-[#717682] truncate">by {r.referrerName}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLES[r.status] || 'bg-zinc-100 text-zinc-600'}`}>
                {STATUS_LABELS[r.status] || r.status}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-black/5 mt-3">
        <Link
          href="/referrals/new"
          className="text-xs font-bold text-[#1c2024] hover:text-black flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Track new referral
        </Link>
      </div>
    </div>
  );
}
