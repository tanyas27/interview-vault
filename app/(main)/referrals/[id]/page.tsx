import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReferral, deleteReferral } from '@/actions/referrals';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Pencil, ArrowRight } from 'lucide-react';
import { DeleteReferralButton } from '@/components/referrals/DeleteReferralButton';

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

export default async function ReferralDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const referral = await getReferral(id);
  if (!referral) notFound();

  const canConvert = !referral.applicationId && !['REJECTED', 'GHOSTED'].includes(referral.status);
  const deleteWithId = deleteReferral.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/referrals"
            className="inline-flex items-center gap-1 text-xs text-[#717682] hover:text-[#1c2024] mb-4 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Referrals
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1c2024] flex items-center justify-center text-white font-bold text-sm">
              {referral.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1c2024] tracking-tight">{referral.company}</h1>
              {referral.role && <p className="text-sm text-[#717682]">{referral.role}</p>}
            </div>
          </div>
        </div>
        <Link href={`/referrals/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
        </Link>
      </div>

      {/* Details card */}
      <div className="rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-1">Status</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[referral.status] || 'bg-zinc-100 text-zinc-600'}`}>
              {STATUS_LABELS[referral.status] || referral.status}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-1">Referred by</p>
            <p className="text-sm font-medium text-[#1c2024]">{referral.referrerName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-1">Contact Date</p>
            <p className="text-sm text-[#1c2024]">
              {new Date(referral.contactDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          {referral.followUpDate && (
            <div>
              <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-1">Follow-up by</p>
              <p className="text-sm text-[#1c2024]">
                {new Date(referral.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {referral.notes && (
          <div className="pt-4 border-t border-black/5">
            <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-[#1c2024] whitespace-pre-wrap">{referral.notes}</p>
          </div>
        )}
      </div>

      {/* Convert to Application */}
      {canConvert && (
        <div className="rounded-[28px] border border-[#ffcf36]/40 bg-white/50 backdrop-blur-2xl p-5 flex items-center justify-between gap-4 shadow-2xs">
          <div>
            <p className="text-sm font-bold text-[#1c2024]">Ready to apply?</p>
            <p className="text-xs text-[#717682] mt-0.5">Convert this referral into a tracked application — fields will be pre-filled.</p>
          </div>
          <Link href={`/applications/new?referralId=${id}`}>
            <Button variant="yellow" size="sm" className="shrink-0 font-bold">
              Convert to App <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Linked application */}
      {referral.application && (
        <div className="rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]">
          <p className="text-xs font-semibold text-[#8e939f] uppercase tracking-wider mb-3">Linked Application</p>
          <Link
            href={`/applications/${referral.application.id}`}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white/85 border border-white/80 transition-all group shadow-2xs"
          >
            <div>
              <p className="text-sm font-bold text-[#1c2024]">{referral.application.companyName}</p>
              <p className="text-xs text-[#717682]">{referral.application.jobTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {referral.application.status}
              </span>
              <ChevronLeft className="w-4 h-4 rotate-180 text-[#8e939f] group-hover:text-[#1c2024] transition-colors" />
            </div>
          </Link>
        </div>
      )}

      <DeleteReferralButton deleteAction={deleteWithId} />
    </div>
  );
}
