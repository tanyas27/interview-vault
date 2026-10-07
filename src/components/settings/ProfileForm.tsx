'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Briefcase, IndianRupee, MapPin, CheckCircle2 } from 'lucide-react';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    currentRole?: string;
    currentCompany?: string;
    targetRole?: string;
    currentSalary?: number | null;
    expectedSalary?: number | null;
    location?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setSaved(false);

    try {
      const formData = new FormData(e.currentTarget);
      await updateUserProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <div className="p-3.5 rounded-2xl bg-[#EBF7D5] text-[#749c36] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#749c36] shrink-0" />
          <span>Profile and compensation targets updated successfully!</span>
        </div>
      )}

      {/* Row 1: Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-[#1c2024]">
            Full Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              required
              placeholder="e.g. Alex Morgan"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-[#1c2024]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
            <Input
              id="email"
              value={user.email}
              disabled
              className="pl-10 bg-zinc-100/70 text-zinc-500 cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-[#8e939f]">Email is linked to your vault account authentication</p>
        </div>
      </div>

      {/* Row 2: Current Role and Current Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentRole" className="text-xs font-semibold text-[#1c2024]">
            Current Title / Role
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
            <Input
              id="currentRole"
              name="currentRole"
              defaultValue={user.currentRole || ''}
              placeholder="e.g. Senior Software Engineer"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currentCompany" className="text-xs font-semibold text-[#1c2024]">
            Current Company / Employer
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
            <Input
              id="currentCompany"
              name="currentCompany"
              defaultValue={user.currentCompany || ''}
              placeholder="e.g. Current Tech Corp"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Compensation (Current & Expected) */}
      <div className="p-4 rounded-2xl bg-[#ffcf36]/10 border border-[#ffcf36]/25 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#ffcf36] flex items-center justify-center">
            <IndianRupee className="w-3.5 h-3.5 text-[#1c2024]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1c2024]">Compensation Setup</h4>
            <p className="text-[11px] text-[#5d636f]">
              Used to calculate salary hikes and spotlight benchmarks on your dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentSalary" className="text-xs font-semibold text-[#1c2024]">
              Current Salary (₹ INR)
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
              <Input
                id="currentSalary"
                name="currentSalary"
                defaultValue={user.currentSalary ? user.currentSalary.toLocaleString('en-IN') : ''}
                placeholder="e.g. 18,00,000 or 18 LPA"
                className="pl-10 bg-white"
              />
            </div>
            <p className="text-[11px] text-[#8e939f]">Enter either annual CTC (e.g. 1800000) or LPA (e.g. 18 LPA)</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expectedSalary" className="text-xs font-semibold text-[#1c2024]">
              Expected / Target Salary (₹ INR)
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
              <Input
                id="expectedSalary"
                name="expectedSalary"
                defaultValue={user.expectedSalary ? user.expectedSalary.toLocaleString('en-IN') : ''}
                placeholder="e.g. 28,00,000 or 28 LPA"
                className="pl-10 bg-white"
              />
            </div>
            <p className="text-[11px] text-[#8e939f]">Your target baseline when negotiating new offers</p>
          </div>
        </div>
      </div>

      {/* Row 4: Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location" className="text-xs font-semibold text-[#1c2024]">
          Location / Preference
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e939f]" />
          <Input
            id="location"
            name="location"
            defaultValue={user.location || ''}
            placeholder="e.g. Bengaluru, India or Remote"
            className="pl-10"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 rounded-full bg-[#1c2024] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
        >
          {isPending ? 'Saving Changes...' : 'Save Profile & Compensation'}
        </Button>
      </div>
    </form>
  );
}
