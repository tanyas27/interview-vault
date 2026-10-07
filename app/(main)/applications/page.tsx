import { Suspense } from 'react';
import Link from 'next/link';
import { getApplications } from '@/actions/applications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';
import { ApplicationStatus } from '@prisma/client';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ApplicationsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-[28px] border border-black/5 bg-white p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-32 rounded skeleton" />
            <div className="h-5 w-20 rounded-full skeleton" />
          </div>
          <div className="h-4 w-40 rounded skeleton" />
          <div className="h-16 rounded-2xl skeleton" />
        </div>
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function ApplicationsList({ page }: { page: number }) {
  const { applications, total, pageSize } = await getApplications(page);

  if (applications.length === 0 && page === 1) {
    return (
      <Card className="rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#ffcf36]/20 flex items-center justify-center mb-4">
            <Briefcase className="h-7 w-7 text-[#1c2024]" />
          </div>
          <h3 className="text-xl font-bold text-[#1c2024] mb-2">No applications yet</h3>
          <p className="text-sm text-[#717682] max-w-md mb-6">
            Get started by logging your first job application. Track rounds, extract interview questions, and follow up.
          </p>
          <Button variant="yellow" asChild>
            <Link href="/applications/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Application
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {applications.map((application) => (
          <Link key={application.id} href={`/applications/${application.id}`} className="group block">
            <Card className="h-full rounded-[32px] border border-white/85 bg-white/60 backdrop-blur-2xl p-2 hover:bg-white/80 hover:shadow-[0_14px_36px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-[#1c2024] group-hover:text-black">
                    {application.companyName}
                  </CardTitle>
                  <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
                </div>
                <p className="text-xs text-[#717682] mt-0.5">{application.jobTitle}</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80 space-y-2 text-xs text-[#4b515d] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e939f]">Interview Rounds:</span>
                    <span className="font-bold text-[#1c2024]">{application._count.rounds}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8e939f]">Applied On:</span>
                    <span className="font-medium text-[#1c2024]">
                      {new Date(application.appliedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {application.offeredSalary && (
                    <div className="flex items-center justify-between pt-1 border-t border-black/[0.04]">
                      <span className="text-[#8e939f]">Offered Salary:</span>
                      <span className="font-bold text-emerald-700">
                        ₹{application.offeredSalary.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  {application.hasReferral ? (
                    <Badge variant="outline" className="text-[10px]">
                      Referred by {application.referrerName || 'Contact'}
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-[#8e939f]">Direct Application</span>
                  )}
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors">
                    <ChevronRight className="h-4 w-4 text-[#1c2024]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {total > pageSize && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#717682]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={`/applications?page=${page - 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Link>
            )}
            {page * pageSize < total && (
              <Link
                href={`/applications?page=${page + 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1c2024] text-white text-xs font-medium hover:bg-[#2b3238] transition-colors"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  return (
    <div className="space-y-6">
      {/* Header — renders instantly, no DB needed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Applications</h1>
          <p className="mt-1 text-sm text-[#717682]">
            Track your active job applications, interview stages, and offers
          </p>
        </div>
        <Button variant="yellow" asChild>
          <Link href="/applications/new">
            <Plus className="h-4 w-4 mr-1.5" />
            New Application
          </Link>
        </Button>
      </div>

      {/* Applications list streams in */}
      <Suspense fallback={<ApplicationsListSkeleton />}>
        <ApplicationsList page={page} />
      </Suspense>
    </div>
  );
}

function getStatusVariant(status: ApplicationStatus): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'yellow' {
  switch (status) {
    case 'APPLIED':
      return 'secondary';
    case 'SCREENING':
    case 'INTERVIEWING':
      return 'default';
    case 'OFFER':
    case 'ACCEPTED':
      return 'success';
    case 'REJECTED':
    case 'WITHDRAWN':
      return 'destructive';
    default:
      return 'secondary';
  }
}
