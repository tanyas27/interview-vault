import { Suspense } from 'react';
import Link from 'next/link';
import { getReferrals } from '@/actions/referrals';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-zinc-100 text-zinc-700',
  HR_CONTACTED: 'bg-blue-50 text-blue-700',
  APPLIED: 'bg-[#ffcf36]/20 text-[#8a6b00]',
  REJECTED: 'bg-red-50 text-red-700',
  GHOSTED: 'bg-zinc-200 text-zinc-500',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  HR_CONTACTED: 'HR Contacted',
  APPLIED: 'Applied',
  REJECTED: 'Rejected',
  GHOSTED: 'Ghosted',
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ReferralsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-black/5">
          <div className="w-10 h-10 rounded-2xl skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded skeleton" />
            <div className="h-3 w-48 rounded skeleton" />
          </div>
          <div className="h-6 w-20 rounded-full skeleton" />
        </div>
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function ReferralsList({ page }: { page: number }) {
  const { referrals, total, pageSize } = await getReferrals(page);
  const totalPages = Math.ceil(total / pageSize);

  if (referrals.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-zinc-200 bg-white p-12 text-center">
        <p className="text-sm text-[#717682] font-medium">No referrals yet</p>
        <Link href="/referrals/new" className="mt-3 inline-block text-xs font-bold text-[#1c2024] underline">
          Track your first referral
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[#717682] -mt-4">{total} referral{total !== 1 ? 's' : ''} tracked</p>
      <div className="space-y-3">
        {referrals.map((r) => (
          <Link
            key={r.id}
            href={`/referrals/${r.id}`}
            className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-black/5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1c2024] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {r.company.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#1c2024]">{r.company}</span>
                {r.role && <span className="text-xs text-[#717682]">· {r.role}</span>}
              </div>
              <p className="text-xs text-[#717682] mt-0.5">
                Referred by {r.referrerName} · {new Date(r.contactDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              {r.application && (
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Converted → {r.application.companyName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || 'bg-zinc-100 text-zinc-600'}`}>
                {STATUS_LABELS[r.status] || r.status}
              </span>
              <ChevronRight className="w-4 h-4 text-[#8e939f] group-hover:text-[#1c2024] transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" asChild disabled={page <= 1}>
            <Link href={`/referrals?page=${page - 1}`}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Link>
          </Button>
          <span className="text-xs text-[#717682]">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" asChild disabled={page >= totalPages}>
            <Link href={`/referrals?page=${page + 1}`}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10));

  return (
    <div className="space-y-6">
      {/* Header — renders instantly */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Referrals</h1>
        </div>
        <Button variant="yellow" asChild>
          <Link href="/referrals/new">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Referral
          </Link>
        </Button>
      </div>

      {/* Referrals list streams in */}
      <Suspense fallback={<ReferralsListSkeleton />}>
        <ReferralsList page={page} />
      </Suspense>
    </div>
  );
}
