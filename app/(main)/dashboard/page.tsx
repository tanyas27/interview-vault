import { Suspense } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/actions/auth';
import { getDashboardStats } from '@/actions/analytics';
import { getApplications } from '@/actions/applications';
import { getRounds } from '@/actions/rounds';
import { getReferrals } from '@/actions/referrals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DarkTaskWidget } from '@/components/dashboard/DarkTaskWidget';
import { TopicsWidget } from '@/components/dashboard/TopicsWidget';
import { ReferralsWidget } from '@/components/dashboard/ReferralsWidget';
import { WeeklyScheduleWidget } from '@/components/dashboard/WeeklyScheduleWidget';
import { SpotlightWidget } from '@/components/dashboard/SpotlightWidget';
import { Plus, Users, Calendar, FolderKanban, Briefcase, ChevronRight } from 'lucide-react';

// ─── Skeletons ────────────────────────────────────────────────────────────────

function HeaderDataSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-7 w-[125px] rounded-full skeleton" />
          <div className="h-7 w-[115px] rounded-full skeleton" />
        </div>
      </div>
      <div className="flex items-center gap-6 sm:gap-10 shrink-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full skeleton" />
            <div className="space-y-1">
              <div className="h-8 w-12 rounded skeleton" />
              <div className="h-2.5 w-14 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-[30px] h-[360px] skeleton" />
      ))}
    </div>
  );
}

function BottomSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 rounded-[30px] h-[280px] skeleton" />
      <div className="rounded-[32px] h-[280px] skeleton" />
    </div>
  );
}

// ─── Async data components ────────────────────────────────────────────────────

async function DashboardHeaderData() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      {/* Left: stat pills */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="px-4 py-1.5 rounded-full border border-black/10 text-[#4b515d] text-xs font-semibold bg-white/40">
          {stats.activeApplications} Active Pipeline
        </div>
        <div className="px-4 py-1.5 rounded-full bg-[#EAE3F5] text-[#5832a8] border border-[#d8cceb] text-xs font-semibold">
          {stats.totalReferrals} Total Referral{stats.totalReferrals !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Right: big metric counters */}
      <div className="flex flex-wrap items-center gap-6 sm:gap-10 shrink-0">
        {[
          { icon: <Users className="w-4 h-4 text-[#1c2024]" />, value: stats.totalApplications, label: 'Pipeline' },
          { icon: <Calendar className="w-4 h-4 text-[#1c2024]" />, value: stats.totalRounds, label: 'Rounds' },
          { icon: <FolderKanban className="w-4 h-4 text-[#1c2024]" />, value: stats.totalQuestions, label: 'Questions' },
        ].map(({ icon, value, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0ece1] border border-black/5 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-light tracking-tight text-[#1c2024]">{value}</span>
              <p className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function DashboardWidgets() {
  const [{ applications }, { rounds }, user, { referrals }, stats] = await Promise.all([
    getApplications(),
    getRounds(),
    getCurrentUser(),
    getReferrals(1),
    getDashboardStats(),
  ]);

  const spotlightApp = applications[0] || null;
  const totalAppsScore = Math.min(35, stats.totalApplications * 7);
  const totalRoundsScore = Math.min(35, stats.totalRounds * 10);
  const questionsScore = Math.min(30, stats.totalQuestions * 3);
  const readinessPercent = Math.min(100, totalAppsScore + totalRoundsScore + questionsScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      <div className="h-full">
        <SpotlightWidget
          candidateName={user?.name || 'Candidate'}
          application={spotlightApp}
          userProfile={user}
        />
      </div>
      <div className="h-full min-h-[360px]">
        <TopicsWidget />
      </div>
      <div className="h-full min-h-[360px]">
        <ReferralsWidget referrals={referrals.slice(0, 5)} pendingCount={stats.pendingReferrals} />
      </div>
      <div className="space-y-4">
        <div className="rounded-[30px] border border-black/5 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-[#1c2024]">Readiness</h4>
            <span className="text-lg font-bold text-[#1c2024]">{readinessPercent}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 py-1.5 rounded-full bg-[#ffcf36] text-[10px] font-bold text-[#1c2024] text-center shadow-xs">
              {stats.totalApplications} Apps
            </div>
            <div className="flex-1 py-1.5 rounded-full bg-[#1c2024] text-[10px] font-bold text-white text-center shadow-xs">
              {rounds.length} Rounds
            </div>
            <div className="flex-1 py-1.5 rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-700 text-center">
              {stats.totalQuestions} Qs
            </div>
          </div>
        </div>
        <DarkTaskWidget />
      </div>
    </div>
  );
}

async function DashboardBottom() {
  const [{ applications }, { rounds }] = await Promise.all([
    getApplications(),
    getRounds(),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2">
        <WeeklyScheduleWidget rounds={rounds} />
      </div>

      <div className="rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1c2024]">Active Pipeline</h3>
            <p className="text-xs text-[#717682]">{applications.length} applications logged</p>
          </div>
          <Button variant="yellow" size="sm" asChild>
            <Link href="/applications/new">
              <Plus className="w-3.5 h-3.5 mr-1" />
              New
            </Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-white/40 border border-dashed border-white/80">
            <Briefcase className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-600 font-medium">No applications created yet</p>
            <Link href="/applications/new" className="mt-3 inline-block text-xs font-bold text-[#1c2024] underline">
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {applications.slice(0, 4).map((app) => (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white/85 border border-white/80 hover:border-white transition-all group shadow-2xs"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#1c2024] group-hover:text-black">{app.companyName}</p>
                  <p className="text-[11px] text-[#717682]">{app.jobTitle}</p>
                  {app.offeredSalary && (app.status === 'ACCEPTED' || app.status === 'OFFER') && (
                    <p className="text-[10px] font-semibold text-emerald-700">
                      ₹{app.offeredSalary.toLocaleString('en-IN')} (INR)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{app.status}</Badge>
                  <div className="w-6 h-6 rounded-full bg-white/80 border border-white/80 flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors shadow-2xs">
                    <ChevronRight className="w-3.5 h-3.5 text-[#1c2024]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-black/5">
          <Link href="/applications" className="text-xs font-bold text-[#1c2024] hover:text-black flex items-center justify-between">
            <span>View all applications</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Only fetch user here — it's a fast cookie+DB lookup (already warm via layout).
  // All heavy data streams in behind Suspense boundaries.
  const user = await getCurrentUser();
  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome heading */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1c2024]">
          Welcome in, {userName}
        </h1>

        <Suspense fallback={<HeaderDataSkeleton />}>
          <DashboardHeaderData />
        </Suspense>
      </div>

      {/* 2. Widgets grid */}
      <Suspense fallback={<WidgetsSkeleton />}>
        <DashboardWidgets />
      </Suspense>

      {/* 3. Bottom section — schedule + pipeline */}
      <Suspense fallback={<BottomSkeleton />}>
        <DashboardBottom />
      </Suspense>
    </div>
  );
}
