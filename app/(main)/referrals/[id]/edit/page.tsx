import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReferral, updateReferral } from '@/actions/referrals';
import { ReferralForm } from '@/components/referrals/ReferralForm';
import { ChevronLeft } from 'lucide-react';

export default async function EditReferralPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const referral = await getReferral(id);
  if (!referral) notFound();

  const updateWithId = updateReferral.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href={`/referrals/${id}`}
          className="inline-flex items-center gap-1 text-xs text-[#717682] hover:text-[#1c2024] mb-4 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Referral
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Edit Referral</h1>
      </div>
      <ReferralForm
        action={updateWithId}
        initialData={referral}
        submitLabel="Save Changes"
      />
    </div>
  );
}
