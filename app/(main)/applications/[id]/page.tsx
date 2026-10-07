import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getApplication } from '@/actions/applications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus } from 'lucide-react';

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {application.companyName}
          </h1>
          <p className="mt-2 text-xl text-zinc-600 dark:text-zinc-400">
            {application.jobTitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/applications/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/rounds/new?applicationId=${id}`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Round
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-500">Status</p>
                <Badge variant={getStatusVariant(application.status)} className="mt-1">{application.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Priority</p>
                <Badge variant="outline" className="mt-1">{application.priority}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Applied Date</p>
                <p className="mt-1">{new Date(application.appliedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Work Mode</p>
                <p className="mt-1">{application.workMode}</p>
              </div>
            </div>

            {application.location && (
              <div>
                <p className="text-sm font-medium text-zinc-500">Location</p>
                <p className="mt-1">{application.location}</p>
              </div>
            )}

            {application.notes && (
              <div>
                <p className="text-sm font-medium text-zinc-500">Notes</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{application.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {application.hasReferral && (
            <Card>
              <CardHeader>
                <CardTitle>Referral</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.referrerName && (
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Referrer Name</p>
                    <p className="mt-1 font-semibold text-[#1c2024]">{application.referrerName}</p>
                  </div>
                )}
                {application.referralNotes && (
                  <div>
                    <p className="text-sm font-medium text-zinc-500">Comment</p>
                    <p className="mt-1 text-sm text-[#4b515d] whitespace-pre-wrap bg-white/60 p-2.5 rounded-xl border border-white/80 shadow-2xs">
                      {application.referralNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(application.expectedSalary || application.offeredSalary) && (
            <Card>
              <CardHeader>
                <CardTitle>Compensation (INR)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.expectedSalary && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Target / Expected Salary</p>
                    <p className="mt-0.5 font-bold text-lg text-[#1c2024]">
                      ₹{application.expectedSalary.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {application.offeredSalary && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Offered Salary</p>
                    <p className="mt-0.5 font-bold text-xl text-emerald-700">
                      ₹{application.offeredSalary.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Interview Rounds ({application.rounds.length})</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/rounds/new?applicationId=${id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {application.rounds.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              No interview rounds yet. Add your first round to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {application.rounds.map((round) => (
                <Link
                  key={round.id}
                  href={`/rounds/${round.id}`}
                  className="block p-4 border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-[#1c2024] break-words">
                        Round #{round.roundNumber}: {round.roundType.replace(/_/g, ' ')}
                      </h4>
                      {round.scheduledDate && (
                        <p className="text-xs text-[#717682] mt-1">
                          {new Date(round.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shrink-0 ${
                        round.status === 'PASSED'
                          ? 'bg-[#EBF7D5] text-[#749c36]'
                          : round.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#ffcf36]/30 text-[#1c2024]'
                      }`}
                    >
                      {round.status === 'PASSED'
                        ? '✓ Passed'
                        : round.status === 'FAILED'
                        ? '✗ Failed'
                        : '⏳ Pending'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
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
