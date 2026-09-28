'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Settings, TrendingUp, IndianRupee } from 'lucide-react';

interface ApplicationSpotlight {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  workMode: string;
  location?: string | null;
  priority: string;
  expectedSalary?: number | null;
  offeredSalary?: number | null;
  notes?: string | null;
}

interface UserProfile {
  name: string;
  email: string;
  currentRole?: string;
  currentCompany?: string;
  targetRole?: string;
  currentSalary?: number | null;
  expectedSalary?: number | null;
  location?: string;
}

export function SpotlightWidget({
  candidateName = 'Candidate',
  application,
  userProfile,
}: {
  candidateName?: string;
  application?: ApplicationSpotlight | null;
  userProfile?: UserProfile | null;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const currentSalary = userProfile?.currentSalary ?? null;
  const expectedSalary = application?.expectedSalary ?? userProfile?.expectedSalary ?? null;
  const offeredSalary = application?.offeredSalary ?? null;

  const userInitials = candidateName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'IV';

  // Compute profile headline: Current Role & Company
  let profileHeadline = '';
  if (userProfile?.currentRole && userProfile?.currentCompany) {
    profileHeadline = `${userProfile.currentRole} at ${userProfile.currentCompany}`;
  } else if (userProfile?.currentRole) {
    profileHeadline = userProfile.currentRole;
  }

  // Calculate potential hike if both current and offered/expected exist
  const compareTarget = offeredSalary || expectedSalary;
  const hikePercentage =
    currentSalary && compareTarget && currentSalary > 0
      ? Math.round(((compareTarget - currentSalary) / currentSalary) * 100)
      : null;

  return (
    <div className="space-y-4">
      {/* Candidate Profile Card */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#2f3540] via-[#1c2024] to-[#121519] min-h-[220px] p-6 flex flex-col justify-end text-white shadow-md">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#ffcf36]/15 rounded-full blur-2xl pointer-events-none" />

        {/* User initials badge */}
        <div className="absolute top-5 right-5 w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center font-bold text-sm text-[#ffcf36]">
          {userInitials}
        </div>

        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-white tracking-tight truncate">
              {candidateName}
            </h3>

            {profileHeadline ? (
              <p className="text-xs text-zinc-300 mt-0.5 truncate font-medium">
                {profileHeadline}
              </p>
            ) : (
              <Link
                href="/settings#profile"
                className="text-xs text-[#ffcf36] hover:underline mt-0.5 inline-block"
              >
                + Set current role & company
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Compensation Details Card */}
      <div className="rounded-[28px] bg-white border border-black/5 shadow-xs p-4 space-y-3">
        {/* Header toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs font-bold text-[#1c2024] hover:text-black transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-[#ffcf36]/25 flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5 text-[#1c2024]" />
            </div>
            <span>Compensation (INR)</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <Link
            href="/settings#profile"
            title="Edit Profile & Compensation"
            className="text-[11px] font-semibold text-[#5d636f] hover:text-[#1c2024] flex items-center gap-1 transition-colors"
          >
            <Settings className="w-3 h-3" />
            <span>Edit</span>
          </Link>
        </div>

        {isOpen && (
          <div className="space-y-2.5 pt-1 text-xs">
            {/* 1. Current Salary */}
            <div className="flex items-center justify-between py-1 px-1.5 rounded-xl hover:bg-black/[0.02]">
              <span className="text-[#717682] font-medium">Current Salary:</span>
              <span className="font-semibold text-[#1c2024]">
                {currentSalary ? (
                  `₹${currentSalary.toLocaleString('en-IN')}`
                ) : (
                  <Link href="/settings#profile" className="text-[#8e939f] hover:underline text-[11px]">
                    + Add in profile
                  </Link>
                )}
              </span>
            </div>

            {/* 2. Expected Salary */}
            <div className="flex items-center justify-between py-1 px-1.5 rounded-xl hover:bg-black/[0.02]">
              <span className="text-[#717682] font-medium">Expected Salary:</span>
              <span className="font-semibold text-[#1c2024]">
                {expectedSalary ? (
                  `₹${expectedSalary.toLocaleString('en-IN')}`
                ) : (
                  <Link href="/settings#profile" className="text-[#8e939f] hover:underline text-[11px]">
                    + Add target
                  </Link>
                )}
              </span>
            </div>

            {/* 3. Offered Salary */}
            <div className="flex items-center justify-between py-1 px-1.5 rounded-xl hover:bg-black/[0.02]">
              <span className="text-[#717682] font-medium">Offered Salary:</span>
              <span className={`font-semibold ${offeredSalary ? 'text-emerald-700' : 'text-[#8e939f]'}`}>
                {offeredSalary
                  ? `₹${offeredSalary.toLocaleString('en-IN')}${application?.companyName ? ` (${application.companyName})` : ''}`
                  : 'Pending offer'}
              </span>
            </div>

            {/* Hike calculation tag if applicable */}
            {hikePercentage !== null && (
              <div className="mt-2 pt-2 border-t border-dashed border-black/10 flex items-center justify-between text-[11px]">
                <span className="text-[#717682] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Hike:</span>
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  +{hikePercentage}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
