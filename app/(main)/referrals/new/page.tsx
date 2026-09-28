import Link from 'next/link';
import { createReferral } from '@/actions/referrals';
import { ReferralForm } from '@/components/referrals/ReferralForm';
import { ChevronLeft } from 'lucide-react';

export default function NewReferralPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/referrals"
          className="inline-flex items-center gap-1 text-xs text-[#717682] hover:text-[#1c2024] mb-4 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Referrals
        </Link>
        <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Add Referral</h1>
      </div>
      <ReferralForm action={createReferral} />
    </div>
  );
}
