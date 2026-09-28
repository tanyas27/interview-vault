'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationData {
  companyName?: string;
  jobTitle?: string;
  jobUrl?: string | null;
  location?: string | null;
  workMode?: string;
  status?: string;
  hasReferral?: boolean;
  referrerName?: string | null;
  resumeUrl?: string | null;
  coverLetterUrl?: string | null;
  expectedSalary?: number | null;
  offeredSalary?: number | null;
  priority?: string;
  notes?: string | null;
  tags?: string | null;
  referralNotes?: string | null;
}

interface ApplicationFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: ApplicationData;
  submitLabel?: string;
  referralId?: string;
}

export function ApplicationForm({ action, initialData, submitLabel = 'Create Application', referralId }: ApplicationFormProps) {
  return (
    <form action={action} className="space-y-6">
      {referralId && <input type="hidden" name="referralId" value={referralId} />}
      {/* Basic Information */}
      <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                defaultValue={initialData?.companyName}
                placeholder="e.g. Google, Stripe, Microsoft"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                defaultValue={initialData?.jobTitle}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job Posting URL</Label>
              <Input
                id="jobUrl"
                name="jobUrl"
                type="url"
                placeholder="https://..."
                defaultValue={initialData?.jobUrl ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Bangalore, Remote"
                defaultValue={initialData?.location ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workMode">Work Mode</Label>
              <select
                id="workMode"
                name="workMode"
                defaultValue={initialData?.workMode || 'HYBRID'}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">On-site</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Information */}
      <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Referral Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasReferral"
              name="hasReferral"
              value="true"
              defaultChecked={initialData?.hasReferral}
              className="w-4 h-4 rounded border-zinc-300 text-[#1c2024] focus:ring-[#ffcf36]"
            />
            <Label htmlFor="hasReferral" className="cursor-pointer font-medium text-sm">
              I have a referral
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referrerName">Referrer Name</Label>
            <Input
              id="referrerName"
              name="referrerName"
              placeholder="e.g. Alex Johnson"
              defaultValue={initialData?.referrerName ?? undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Add any comments or notes about this referral..."
              defaultValue={initialData?.referralNotes ?? undefined}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Documents & Compensation */}
      <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Documents & Compensation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/..."
                defaultValue={initialData?.resumeUrl ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverLetterUrl">Cover Letter URL</Label>
              <Input
                id="coverLetterUrl"
                name="coverLetterUrl"
                type="url"
                placeholder="https://..."
                defaultValue={initialData?.coverLetterUrl ?? undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Target / Expected Salary (INR ₹)</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                type="number"
                placeholder="e.g. 2800000"
                defaultValue={initialData?.expectedSalary ?? ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offeredSalary">Offered Salary (INR ₹)</Label>
              <Input
                id="offeredSalary"
                name="offeredSalary"
                type="number"
                placeholder="e.g. 3200000"
                defaultValue={initialData?.offeredSalary ?? ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                defaultValue={initialData?.priority || 'MEDIUM'}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={initialData?.status || 'APPLIED'}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              >
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEWING">Interviewing</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g., backend, fintech, tier-1"
              defaultValue={initialData?.tags ?? undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">General Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any general notes about the company or interview process..."
              defaultValue={initialData?.notes ?? undefined}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="yellow" type="submit" size="lg" className="font-bold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
