import Link from 'next/link';
import { getDashboardStats } from '@/actions/analytics';
import { getApplications } from '@/actions/applications';
import { getRounds } from '@/actions/rounds';
import { getCurrentUser } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DarkTaskWidget } from '@/components/dashboard/DarkTaskWidget';
import { TopicsWidget } from '@/components/dashboard/TopicsWidget';
import { ReferralsWidget } from '@/components/dashboard/ReferralsWidget';
import { WeeklyScheduleWidget } from '@/components/dashboard/WeeklyScheduleWidget';
import { SpotlightWidget } from '@/components/dashboard/SpotlightWidget';
import { getReferrals } from '@/actions/referrals';
import { Plus, Users, Calendar, FolderKanban, Briefcase, ChevronRight } from 'lucide-react';

export default async function DashboardPage() {
  const [stats, { applications }, { rounds }, user, { referrals }] = await Promise.all([
    getDashboardStats(),
    getApplications(),
    getRounds(),
    getCurrentUser(),
    getReferrals(1),
  ]);

  const userName = user?.name ? user.name.split(' ')[0] : 'there';
  const spotlightApp = applications[0] || null;

  // Calculate real readiness score based on tracked items
  const totalAppsScore = Math.min(35, stats.totalApplications * 7); // up to 35%
  const totalRoundsScore = Math.min(35, rounds.length * 10); // up to 35%
  const questionsScore = Math.min(30, stats.totalQuestions * 3); // up to 30%
  const readinessPercent = Math.min(100, totalAppsScore + totalRoundsScore + questionsScore);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Header / Welcome Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1c2024]">
            Welcome in, {userName}
          </h1>

          {/* Real Dynamic Segmented status pill bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="px-4 py-1.5 rounded-full bg-[#1c2024] text-white text-xs font-semibold shadow-xs">
              {stats.upcomingRounds} Upcoming Rounds
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#ffcf36] text-[#1c2024] text-xs font-bold shadow-xs">
              {stats.offersReceived > 0
                ? `${stats.offersReceived} Offers Received`
                : `${stats.totalApplications} Applications Tracked`}
            </div>
            <div className="px-4 py-1.5 rounded-full border border-black/10 text-[#4b515d] text-xs font-semibold bg-white/40">
              {stats.activeApplications} Active Pipeline
            </div>
            <div className="px-4 py-1.5 rounded-full border border-black/15 text-[#717682] text-xs font-medium bg-white/60">
              {stats.totalQuestions} Questions Bank
            </div>
            {stats.pendingReferrals > 0 && (
              <div className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-700 text-xs font-semibold bg-blue-50">
                {stats.pendingReferrals} Referral{stats.pendingReferrals !== 1 ? 's' : ''} Pending
              </div>
            )}
          </div>
        </div>

        {/* Right side Big Metric Counters */}
        <div className="flex items-center gap-6 sm:gap-10 shrink-0">
          {/* Metric 1 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0ece1] border border-black/5 flex items-center justify-center">
              <Users className="w-4 h-4 text-[#1c2024]" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-light tracking-tight text-[#1c2024]">
                {stats.totalApplications}
              </span>
              <p className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
                Pipeline
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0ece1] border border-black/5 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#1c2024]" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-light tracking-tight text-[#1c2024]">
                {stats.upcomingRounds}
              </span>
              <p className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
                Rounds
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f0ece1] border border-black/5 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-[#1c2024]" />
            </div>
            <div>
              <span className="text-3xl md:text-4xl font-light tracking-tight text-[#1c2024]">
                {stats.totalQuestions}
              </span>
              <p className="text-[11px] font-semibold text-[#8e939f] uppercase tracking-wider">
                Questions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {/* Card 1: Candidate / Target Spotlight & Accordion */}
        <div className="h-full">
          <SpotlightWidget
            candidateName={user?.name || 'Candidate'}
            application={spotlightApp}
            userProfile={user}
          />
        </div>

        {/* Card 2: Topics to learn / read next */}
        <div className="h-full min-h-[360px]">
          <TopicsWidget />
        </div>

        {/* Card 3: Referrals */}
        <div className="h-full min-h-[360px]">
          <ReferralsWidget
            referrals={referrals.slice(0, 5)}
            pendingCount={stats.pendingReferrals}
          />
        </div>

        {/* Card 4: Readiness + Task Widget */}
        <div className="space-y-4">
          {/* Top Readiness Card */}
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

          {/* Bottom Task Widget */}
          <DarkTaskWidget />
        </div>
      </div>

      {/* 3. Bottom Section: Weekly Schedule & Interview Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Weekly Schedule / Calendar */}
        <div className="lg:col-span-2">
          <WeeklyScheduleWidget rounds={rounds} />
        </div>

        {/* Active Applications Quick Access */}
        <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm space-y-4">
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
            <div className="p-6 text-center rounded-2xl bg-[#fcfbf7] border border-dashed border-zinc-200">
              <Briefcase className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-xs text-zinc-600 font-medium">No applications created yet</p>
              <Link
                href="/applications/new"
                className="mt-3 inline-block text-xs font-bold text-[#1c2024] underline"
              >
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {applications.slice(0, 4).map((app) => (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#fcfbf7] hover:bg-zinc-100/70 border border-black/[0.03] transition-colors group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1c2024] group-hover:text-black">
                      {app.companyName}
                    </p>
                    <p className="text-[11px] text-[#717682]">{app.jobTitle}</p>
                    {app.offeredSalary && (app.status === 'ACCEPTED' || app.status === 'OFFER') && (
                      <p className="text-[10px] font-semibold text-emerald-700">
                        ₹{app.offeredSalary.toLocaleString('en-IN')} (INR)
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {app.status}
                    </Badge>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-[#1c2024]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-black/5">
            <Link
              href="/applications"
              className="text-xs font-bold text-[#1c2024] hover:text-black flex items-center justify-between"
            >
              <span>View all applications</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
