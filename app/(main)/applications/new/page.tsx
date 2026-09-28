import { createApplication } from '@/actions/applications';
import { getReferral } from '@/actions/referrals';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ referralId?: string }>;
}) {
  const { referralId } = await searchParams;

  let initialData: Record<string, unknown> | undefined;
  let fromReferral = false;

  if (referralId) {
    const referral = await getReferral(referralId);
    if (referral) {
      fromReferral = true;
      initialData = {
        companyName: referral.company,
        jobTitle: referral.role ?? '',
        hasReferral: true,
        referrerName: referral.referrerName,
        referralNotes: referral.notes ?? '',
      };
    }
  }

  return (
    <div className="space-y-6">
      <div>
        {fromReferral && (
          <Link
            href={`/referrals/${referralId}`}
            className="inline-flex items-center gap-1 text-xs text-[#717682] hover:text-[#1c2024] mb-4 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Referral
          </Link>
        )}
        <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">New Application</h1>
        {fromReferral && (
          <p className="mt-1 text-sm text-[#717682]">
            Pre-filled from referral — review and complete the details below.
          </p>
        )}
      </div>
      <ApplicationForm
        action={createApplication}
        initialData={initialData}
        referralId={referralId}
      />
    </div>
  );
}
