'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReferralData {
  company?: string;
  role?: string | null;
  referrerName?: string;
  status?: string;
  notes?: string | null;
  contactDate?: Date | string;
  followUpDate?: Date | string | null;
}

interface ReferralFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: ReferralData;
  submitLabel?: string;
}

function toDateInputValue(val: Date | string | null | undefined): string {
  if (!val) return '';
  const d = typeof val === 'string' ? new Date(val) : val;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function ReferralForm({ action, initialData, submitLabel = 'Add Referral' }: ReferralFormProps) {
  return (
    <form action={action} className="space-y-5">
      <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Referral Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                required
                placeholder="e.g. Google, Stripe"
                defaultValue={initialData?.company}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (optional)</Label>
              <Input
                id="role"
                name="role"
                placeholder="e.g. Senior Software Engineer"
                defaultValue={initialData?.role ?? undefined}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referrerName">Referred by *</Label>
              <Input
                id="referrerName"
                name="referrerName"
                required
                placeholder="e.g. Alex Johnson"
                defaultValue={initialData?.referrerName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={initialData?.status || 'PENDING'}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              >
                <option value="PENDING">Pending</option>
                <option value="HR_CONTACTED">HR Contacted</option>
                <option value="APPLIED">Applied</option>
                <option value="REJECTED">Rejected</option>
                <option value="GHOSTED">Ghosted</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactDate">Contact Date *</Label>
              <Input
                id="contactDate"
                name="contactDate"
                type="date"
                required
                defaultValue={toDateInputValue(initialData?.contactDate) || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up by (optional)</Label>
              <Input
                id="followUpDate"
                name="followUpDate"
                type="date"
                defaultValue={toDateInputValue(initialData?.followUpDate)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any context about the referral, connection, or role..."
              defaultValue={initialData?.notes ?? undefined}
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
