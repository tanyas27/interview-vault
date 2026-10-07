import { Suspense } from 'react';
import Link from 'next/link';
import { getReferrals } from '@/actions/referrals';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, ChevronLeft, User, Calendar, Clock, Pencil, ArrowRight } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[32px] border border-white/85 bg-white/60 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl skeleton shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded skeleton" />
                <div className="h-3 w-20 rounded skeleton" />
              </div>
            </div>
            <div className="h-5 w-16 rounded-full skeleton shrink-0" />
          </div>
          <div className="h-20 rounded-2xl skeleton" />
          <div className="h-6 w-full rounded-xl skeleton" />
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
      <div className="rounded-[32px] border border-dashed border-white/90 bg-white/50 backdrop-blur-2xl p-12 text-center shadow-2xs">
        <p className="text-sm text-[#717682] font-medium">No referrals yet</p>
        <Link href="/referrals/new" className="mt-3 inline-block text-xs font-bold text-[#1c2024] underline">
          Track your first referral
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[#717682] -mt-2">{total} referral{total !== 1 ? 's' : ''} tracked</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {referrals.map((r) => {
          const canConvert = !r.applicationId && !['REJECTED', 'GHOSTED'].includes(r.status);

          return (
            <div
              key={r.id}
              className="group flex flex-col justify-between rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-5 hover:bg-white/75 hover:shadow-[0_14px_36px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-200 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div className="space-y-3.5">
                {/* Header: Company Avatar + Name/Role + Status + Edit Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-white/80 shadow-2xs flex items-center justify-center text-[#1c2024] font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                      {r.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/referrals/${r.id}/edit`}
                        className="font-bold text-sm text-[#1c2024] hover:underline truncate block"
                      >
                        {r.company}
                      </Link>
                      <p className="text-xs text-[#717682] truncate">
                        {r.role || 'Role not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] || 'bg-zinc-100 text-zinc-600'
                        }`}
                    >
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                    <Link
                      href={`/referrals/${r.id}/edit`}
                      aria-label={`Edit ${r.company} referral`}
                      title="Edit referral"
                      className="w-7 h-7 rounded-full bg-white/70 hover:bg-white border border-white/80 flex items-center justify-center text-[#717682] hover:text-[#1c2024] transition-colors shadow-2xs"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Meta details card */}
                <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 space-y-2 text-xs text-[#4b515d] shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#8e939f] flex items-center gap-1.5 shrink-0">
                      <User className="w-3.5 h-3.5 text-zinc-400" /> Referrer:
                    </span>
                    <span className="font-semibold text-[#1c2024] truncate">
                      {r.referrerName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#8e939f] flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Contacted:
                    </span>
                    <span className="font-medium text-[#1c2024]">
                      {new Date(r.contactDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {r.followUpDate && (
                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-black/[0.04]">
                      <span className="text-[#8e939f] flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Follow-up:
                      </span>
                      <span className="font-semibold text-[#1c2024]">
                        {new Date(r.followUpDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  )}

                  {r.notes && (
                    <p className="text-[11px] text-[#717682] line-clamp-1 italic pt-1.5 border-t border-black/[0.04]">
                      &ldquo;{r.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Footer row: Convert to application action */}
              <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
                {r.application ? (
                  <Link
                    href={`/applications/${r.application.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 px-2.5 py-1 rounded-full transition-colors truncate"
                  >
                    <span className="truncate">Converted → {r.application.companyName}</span>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </Link>
                ) : canConvert ? (
                  <Link
                    href={`/applications/new?referralId=${r.id}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1c2024] bg-[#ffcf36] hover:bg-[#fed65a] px-3 py-1.5 rounded-full shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Convert to Application</span>
                  </Link>
                ) : (
                  <span className="text-[11px] font-medium text-[#8e939f]">
                    Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
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
