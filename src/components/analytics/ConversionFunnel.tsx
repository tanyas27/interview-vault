'use client';

import Link from 'next/link';
import { ChevronRight, Award, CheckCircle2, TrendingUp, Clock, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ApplicationItem {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  roundsCount: number;
  roundsPassed: number;
  roundsFailed: number;
  notes?: string | null;
}

interface ConversionFunnelProps {
  data: {
    totalApplications: number;
    totalRounds: number;
    passedRounds: number;
    roundPassRate: number;
    statusCounts: {
      active: number;
      offers: number;
      concluded: number;
    };
    stages: Array<{
      name: string;
      status: string;
      count: number;
      percentage: number;
    }>;
    applications: ApplicationItem[];
  };
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const {
    totalApplications,
    totalRounds,
    passedRounds,
    roundPassRate,
    statusCounts,
    stages,
    applications,
  } = data;

  return (
    <div className="space-y-4">
      {/* 1. Minimal KPI Strip: High-Signal, Empowering Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Applied */}
        <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
            Total Applications
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#1c2024]">
              {totalApplications}
            </span>
            <span className="text-xs text-[#717682]">Tracked</span>
          </div>
          <p className="text-[11px] text-[#717682] mt-0.5">
            {statusCounts.concluded > 0 ? `${statusCounts.concluded} Concluded` : 'All Active'}
          </p>
        </div>

        {/* Metric 2: Rounds Attended & Cleared */}
        <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
            Rounds Cleared
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#1c2024]">
              {passedRounds}
            </span>
            <span className="text-xs text-[#717682]">/ {totalRounds} Rounds</span>
          </div>
          <p className="text-[11px] text-[#749c36] font-semibold mt-0.5">
            {roundPassRate}% Pass Rate
          </p>
        </div>

        {/* Metric 3: Pipeline Status */}
        <div className="p-3.5 rounded-2xl bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <span className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
            Pipeline Status
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#1c2024]">
              {statusCounts.offers > 0 ? statusCounts.offers : statusCounts.active}
            </span>
            <span className="text-xs text-[#717682]">
              {statusCounts.offers > 0 ? 'Offers' : 'Active'}
            </span>
          </div>
          <p className="text-[11px] text-[#717682] mt-0.5">
            {statusCounts.concluded} rounds completed
          </p>
        </div>
      </div>

      {/* 2. Compact Funnel Strip - Mobile Optimized */}
      <div className="p-4 sm:p-5 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-[#1c2024]">Conversion Pipeline</span>
            <span className="text-xs text-[#717682]">
              • {totalApplications} {totalApplications === 1 ? 'application' : 'applications'} tracked
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold self-start sm:self-auto bg-[#fcfbf7] sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg border sm:border-0 border-black/5">
            <span className="text-[#717682]">Round Pass Rate:</span>
            <span className="text-[#749c36] font-bold bg-[#EBF7D5] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#749c36]" />
              {roundPassRate}%
            </span>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div
          className="grid gap-1.5 h-1.5 rounded-full overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        >
          {stages.map((stage) => {
            const hasData = stage.count > 0;
            return (
              <div
                key={stage.status}
                className={`h-full rounded-full transition-all ${hasData ? 'bg-[#ffcf36]' : 'bg-black/5'
                  }`}
              />
            );
          })}
        </div>

        {/* Responsive Stage Grid: 2x2 on Mobile, 1x4 on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stages.map((stage, idx) => {
            const hasData = stage.count > 0;
            const displayName = stage.name === 'Interview Loops' ? 'Interviews' : stage.name;

            return (
              <div
                key={stage.status}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-xs transition-all ${hasData
                    ? 'bg-[#fcfbf7] border-black/5 text-[#1c2024]'
                    : 'bg-black/[0.02] border-transparent text-[#8e939f]'
                  }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${hasData
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-black/5 text-[#8e939f]'
                      }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-[#1c2024] truncate">
                    {displayName}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 shrink-0 ml-1.5">
                  <span className="font-black text-xs sm:text-sm text-[#1c2024]">
                    {stage.count}
                  </span>
                  <span className="text-[10px] text-[#8e939f]">({stage.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Application Experience & Learnings (Minimal row cards, not demotivating) */}
      <Card className="rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-[#1c2024]">
              Application Outcomes & Stage Reached
            </CardTitle>
            <span className="text-xs text-[#717682]">
              {applications.length} applications logged
            </span>
          </div>
          <CardDescription className="text-xs text-[#717682]">
            Detailed stage reached and rounds passed for each company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {applications.length === 0 && (
            <p className="text-xs text-[#717682] text-center py-8">
              No applications logged yet. Add your first application to see outcomes here.
            </p>
          )}
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-[#fcfbf7] hover:bg-zinc-100/70 border border-black/[0.03] transition-colors gap-2 group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1c2024] group-hover:text-black">
                    {app.companyName}
                  </span>
                  <span className="text-[11px] text-[#717682]">
                    • {app.jobTitle}
                  </span>
                </div>

                {app.notes && (
                  <p className="text-[11px] text-[#717682] mt-0.5 line-clamp-1 italic">
                    &quot;{app.notes}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 text-xs">
                {app.roundsCount > 0 ? (
                  <span className="font-semibold text-[#749c36] bg-[#EBF7D5] px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#749c36]" />
                    {app.roundsPassed} of {app.roundsCount} Rounds Passed
                  </span>
                ) : (
                  <span className="text-zinc-500 text-[11px]">Applied</span>
                )}

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.status === 'REJECTED'
                      ? 'bg-zinc-200/80 text-zinc-700'
                      : app.status === 'OFFER'
                        ? 'bg-[#ffcf36] text-[#1c2024]'
                        : 'bg-zinc-100 text-zinc-800'
                    }`}
                >
                  {app.status === 'REJECTED' ? 'Concluded' : app.status}
                </span>

                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#1c2024]" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
