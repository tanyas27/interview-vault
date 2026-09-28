'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Plus, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScheduleRound {
  id: string;
  roundType: string;
  roundNumber: number;
  scheduledDate: Date | string | null;
  durationMinutes?: number | null;
  status: string;
  application: {
    companyName: string;
    jobTitle: string;
  };
}

export function WeeklyScheduleWidget({ rounds = [] }: { rounds?: ScheduleRound[] }) {
  const today = new Date();

  // Calculate current week days (Monday through Sunday)
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  // Distance to Monday (if Sunday, go back 6 days, else go back currentDayOfWeek - 1)
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + distanceToMonday);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dateNum = d.getDate();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    return {
      date: d,
      name: dayName,
      dateNum,
      isToday,
    };
  });

  const monthYearLabel = today.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Filter rounds scheduled in the current week
  const startOfWeek = new Date(monday);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(monday);
  endOfWeek.setDate(monday.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  const weeklyRounds = rounds.filter((r) => {
    if (!r.scheduledDate) return false;
    const roundDate = new Date(r.scheduledDate);
    return roundDate >= startOfWeek && roundDate <= endOfWeek;
  });

  const formatRoundType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#ffcf36]" />
          <h4 className="font-bold text-sm text-[#1c2024]">{monthYearLabel}</h4>
        </div>

        <Link
          href="/rounds/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c2024] text-white hover:bg-black text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Schedule Round
        </Link>
      </div>

      {/* Days row */}
      <div className="grid grid-cols-7 gap-1 text-center pb-4 border-b border-black/[0.04]">
        {weekDays.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[11px] font-medium text-[#717682]">{d.name}</span>
            <span
              className={`text-sm font-bold mt-1 ${
                d.isToday
                  ? 'w-7 h-7 rounded-full bg-[#ffcf36] text-[#1c2024] flex items-center justify-center shadow-xs'
                  : 'text-[#1c2024]'
              }`}
            >
              {d.dateNum}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Content: Weekly rounds or clean empty state */}
      <div className="mt-4 min-h-[160px] flex flex-col justify-center">
        {weeklyRounds.length === 0 ? (
          <div className="py-8 text-center rounded-2xl bg-[#fcfbf7] border border-dashed border-zinc-200">
            <Clock className="w-7 h-7 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1c2024]">No interview rounds this week</p>
            <p className="text-[11px] text-[#717682] mt-0.5 max-w-sm mx-auto">
              Schedule your upcoming technical screens, behavioral rounds, or chats to view them here.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Link
                href="/rounds/new"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffcf36] text-[#1c2024] text-xs font-bold hover:bg-[#fed65a] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule an Interview Round
              </Link>
              <Link
                href="/rounds"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-black/10 text-xs font-semibold text-[#717682] hover:bg-zinc-100 transition-colors"
              >
                View all rounds
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {weeklyRounds.map((round) => {
              const roundDate = round.scheduledDate ? new Date(round.scheduledDate) : null;
              const dayStr = roundDate
                ? roundDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                : '';

              return (
                <Link
                  key={round.id}
                  href={`/rounds/${round.id}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1c2024] text-white hover:bg-black transition-colors group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        round.status === 'PASSED'
                          ? 'bg-emerald-400'
                          : round.status === 'FAILED'
                          ? 'bg-rose-400'
                          : 'bg-[#ffcf36]'
                      }`}
                    />
                    <div>
                      <h5 className="font-bold text-xs text-white">
                        {round.application.companyName} • {formatRoundType(round.roundType)}
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {dayStr || 'Scheduled round'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        round.status === 'PASSED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : round.status === 'FAILED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-[#ffcf36]/20 text-[#ffcf36]'
                      }`}
                    >
                      {round.status === 'PASSED'
                        ? 'Passed'
                        : round.status === 'FAILED'
                        ? 'Failed'
                        : 'Pending'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ffcf36] group-hover:text-[#1c2024] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
