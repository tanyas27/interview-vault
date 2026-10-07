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
  const offeredSalary =
    (application?.status === 'ACCEPTED' || application?.status === 'OFFER')
      ? (application?.offeredSalary ?? null)
      : null;

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
      {/* Candidate Profile Credit Card */}
      <div className="relative rounded-[26px] overflow-hidden bg-gradient-to-br from-[#242930] via-[#15191d] to-[#0c0e11] p-5 sm:p-6 flex flex-col justify-between text-white border border-white/15 min-h-[215px] group transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
        {/* Specular lighting & Holographic glare overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_40%,transparent_65%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#ffcf36]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#ffcf36]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header: EMV Chip + Contactless wave + Initials Crest */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* EMV Gold Chip */}
            <div className="w-10 h-7 rounded-[6px] bg-gradient-to-br from-[#fae69e] via-[#dfb743] to-[#997314] p-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.4)] border border-[#caa33a] flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full rounded-[4px] border border-[#805e07]/40 relative flex items-center justify-center">
                <div className="absolute inset-x-0 h-[1px] bg-[#805e07]/50" />
                <div className="absolute inset-y-0 w-[1px] bg-[#805e07]/50" />
                <div className="w-3.5 h-3 rounded-[2px] border border-[#805e07]/40 bg-[#dfb743]/25" />
              </div>
            </div>

            {/* Contactless Wave */}
            <svg
              className="w-4 h-4 text-white/50 rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M8.5 16.5a5 5 0 0 1 0-9" />
              <path d="M12 19a8.5 8.5 0 0 1 0-14" />
              <path d="M15.5 21.5a12 12 0 0 1 0-19" />
            </svg>
          </div>

          {/* User initials badge styled as a metallic seal */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold tracking-[0.2em] text-white/40 uppercase hidden sm:inline-block">
              VAULT ELITE
            </span>
            <div className="w-10 h-10 rounded-full border border-[#ffcf36]/40 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md flex items-center justify-center font-bold text-xs tracking-wider text-[#ffcf36] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_6px_rgba(0,0,0,0.35)]">
              {userInitials}
            </div>
          </div>
        </div>

        {/* Card Middle: Embossed masked card number */}
        <div className="relative z-10 my-3">
          <p className="font-mono text-sm tracking-[0.28em] text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] select-none">
            •••• •••• •••• 2026
          </p>
        </div>

        {/* Card Footer: Cardholder info + Brand Hologram Circles */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="block text-[8px] uppercase tracking-widest text-white/45 font-semibold">
              CARDHOLDER
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              {candidateName}
            </h3>

            {profileHeadline ? (
              <p className="text-[11px] text-zinc-300 mt-0.5 truncate font-medium">
                {profileHeadline}
              </p>
            ) : (
              <Link
                href="/settings#profile"
                className="text-[11px] text-[#ffcf36] hover:underline mt-0.5 inline-block"
              >
                + Set current role & company
              </Link>
            )}
          </div>

          {/* Interlocking card circles network emblem */}
          <div className="flex -space-x-2 shrink-0 opacity-80 pb-0.5" aria-hidden="true">
            <div className="w-6 h-6 rounded-full bg-[#ffcf36]/80 backdrop-blur-xs shadow-xs" />
            <div className="w-6 h-6 rounded-full bg-[#ff6b4a]/75 backdrop-blur-xs shadow-xs" />
          </div>
        </div>
      </div>

      {/* Compensation Details Card */}
      <div className="rounded-[28px] bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] p-4 space-y-3">
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
                  <TrendingUp className="w-3.5 h-3.5 text-[#749c36]" />
                  <span>Target Hike:</span>
                </span>
                <span className="font-bold text-[#749c36] bg-[#EBF7D5] px-2 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#749c36]" />
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
