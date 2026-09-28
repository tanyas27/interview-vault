import Link from 'next/link';
import { getApplications } from '@/actions/applications';
import { createRound } from '@/actions/rounds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { RoundType, RoundStatus } from '@prisma/client';

export default async function NewRoundPage({
  searchParams,
}: {
  searchParams: Promise<{ applicationId?: string }>;
}) {
  const params = await searchParams;
  // Load all applications for the dropdown (no pagination needed here — form select)
  const { applications } = await getApplications();

  const selectedApp = applications.find((a) => a.id === params.applicationId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={params.applicationId ? `/applications/${params.applicationId}` : '/rounds'}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1c2024]">Add Interview Round</h1>
          <p className="text-xs text-[#717682]">
            {selectedApp
              ? `For ${selectedApp.companyName} (${selectedApp.jobTitle})`
              : 'Record details, pass/fail outcome, and questions asked for an interview stage'}
          </p>
        </div>
      </div>

      <form action={createRound} className="space-y-6">
        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Round Overview</CardTitle>
            <CardDescription>Select application, round type, and stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicationId">Job Application *</Label>
              <select
                id="applicationId"
                name="applicationId"
                defaultValue={params.applicationId || ''}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              >
                <option value="" disabled>Select an application</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.companyName} — {app.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roundType">Round Type *</Label>
                <select
                  id="roundType"
                  name="roundType"
                  defaultValue={RoundType.TECHNICAL_CODING}
                  required
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
                >
                  <option value={RoundType.RECRUITER_SCREEN}>Recruiter / HR Screen</option>
                  <option value={RoundType.PHONE_SCREEN}>Phone Screen</option>
                  <option value={RoundType.TECHNICAL_CODING}>Technical Coding</option>
                  <option value={RoundType.TECHNICAL_SYSTEM_DESIGN}>System Design</option>
                  <option value={RoundType.BEHAVIORAL}>Behavioral</option>
                  <option value={RoundType.HIRING_MANAGER}>Hiring Manager</option>
                  <option value={RoundType.PANEL}>Panel Interview</option>
                  <option value={RoundType.ONSITE}>Onsite</option>
                  <option value={RoundType.FINAL}>Final Round</option>
                  <option value={RoundType.OTHER}>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roundNumber">Round Number</Label>
                <Input
                  id="roundNumber"
                  name="roundNumber"
                  type="number"
                  defaultValue="1"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Outcome (Pass / Fail / Pending) and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="status">Round Outcome *</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={RoundStatus.PENDING}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
                >
                  <option value={RoundStatus.PASSED}>✓ Passed</option>
                  <option value={RoundStatus.FAILED}>✗ Failed</option>
                  <option value={RoundStatus.PENDING}>⏳ Pending / In Progress</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roundDate">Interview Date</Label>
                <Input
                  id="roundDate"
                  name="roundDate"
                  type="date"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question & Answer Asked */}
        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Questions & Answers Asked</CardTitle>
            <CardDescription>
              Record the primary question and your answer (you can also add more questions once the round is created)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initialQuestion">Question Asked</Label>
              <Textarea
                id="initialQuestion"
                name="initialQuestion"
                placeholder="e.g. Design a distributed cache like Redis, or: Tell me about a time you had a tight deadline."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialAnswer">Your Answer / Approach</Label>
              <Textarea
                id="initialAnswer"
                name="initialAnswer"
                placeholder="Write your answer, key points, trade-offs discussed, or STAR response..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>


        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href={params.applicationId ? `/applications/${params.applicationId}` : '/rounds'}>
              Cancel
            </Link>
          </Button>
          <Button variant="yellow" type="submit">
            Save Round
          </Button>
        </div>
      </form>
    </div>
  );
}
