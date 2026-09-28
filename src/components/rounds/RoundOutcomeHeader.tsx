'use client';

import { useState } from 'react';
import { setRoundOutcome } from '@/actions/rounds';
import { RoundStatus } from '@prisma/client';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface RoundOutcomeHeaderProps {
  roundId: string;
  initialStatus: RoundStatus;
  companyName: string;
  jobTitle: string;
  roundType: string;
  roundNumber: number;
  scheduledDate: Date | null;
}

export function RoundOutcomeHeader({
  roundId,
  initialStatus,
  companyName,
  jobTitle,
  roundType,
  roundNumber,
  scheduledDate,
}: RoundOutcomeHeaderProps) {
  const [status, setStatus] = useState<RoundStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleSetOutcome = async (newStatus: RoundStatus) => {
    if (newStatus === status) return;
    setLoading(true);
    setStatus(newStatus);
    try {
      await setRoundOutcome(roundId, newStatus);
    } catch (err) {
      console.error('Failed to update round outcome:', err);
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  const formattedRoundType = roundType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const formattedDate = scheduledDate
    ? new Date(scheduledDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[32px] bg-white border border-black/5 shadow-sm">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffcf36] bg-[#1c2024] px-2.5 py-1 rounded-full">
            Round #{roundNumber}
          </span>
          <span className="text-xs font-semibold text-[#717682]">{companyName}</span>
          {formattedDate && (
            <span className="text-xs text-zinc-400">• {formattedDate}</span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1c2024] mt-1.5">
          {formattedRoundType}
        </h1>
        <p className="text-xs text-[#717682] mt-0.5">{jobTitle}</p>
      </div>

      {/* Outcome Switcher: Pass / Fail / Pending */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-[#717682] mr-1">Outcome:</span>
        <div className="flex items-center bg-[#fcfbf7] p-1 rounded-2xl border border-black/5 gap-1">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSetOutcome(RoundStatus.PASSED)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              status === RoundStatus.PASSED
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pass
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSetOutcome(RoundStatus.FAILED)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              status === RoundStatus.FAILED
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Fail
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSetOutcome(RoundStatus.PENDING)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              status === RoundStatus.PENDING || status === RoundStatus.SCHEDULED
                ? 'bg-[#ffcf36] text-[#1c2024] shadow-xs'
                : 'text-zinc-600 hover:text-[#1c2024] hover:bg-zinc-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending
          </button>
        </div>
      </div>
    </div>
  );
}
