import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Database, Shield, UserCircle, KeyRound } from 'lucide-react';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-[#717682]">
          Manage your personal profile, baseline compensation targets, and data portability
        </p>
      </div>

      {/* 1. Basic Profile & Compensation */}
      <div id="profile">
        <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm overflow-hidden">
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ffcf36]/25 flex items-center justify-center">
                <UserCircle className="h-4 w-4 text-[#1c2024]" />
              </div>
              <div>
                <CardTitle className="text-lg">Basic Profile & Compensation</CardTitle>
                <CardDescription>
                  Setup your headline role, current salary, and target compensation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>

      {/* 2. Data Export */}
      <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1c2024] text-white flex items-center justify-center">
              <Database className="h-4 w-4 text-[#ffcf36]" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Export & Backup</CardTitle>
              <CardDescription>
                Export your private applications, rounds, and question bank anytime
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-black/5 rounded-2xl bg-[#fcfbf7] gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#1c2024]">Export as JSON</h4>
              <p className="text-xs text-[#717682] mt-0.5">
                Full structured database export with applications, rounds, and questions
              </p>
            </div>
            <Button variant="default" size="sm" asChild>
              <Link href="/api/export/json" target="_blank">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download JSON
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-black/5 rounded-2xl bg-[#fcfbf7] gap-3">
            <div>
              <h4 className="text-sm font-bold text-[#1c2024]">Export as CSV</h4>
              <p className="text-xs text-[#717682] mt-0.5">
                Spreadsheet-friendly export for pipeline reporting and analysis
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/api/export/csv" target="_blank">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download CSV
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Account Privacy & Vault Isolation */}
      <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Shield className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <CardTitle className="text-lg">Private Vault Security</CardTitle>
              <CardDescription>Multi-tenant data isolation and encryption</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-black/5 rounded-2xl bg-[#fcfbf7]">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-[#1c2024]">Private Account Vault</h4>
              <p className="text-xs text-[#717682]">
                Signed in as <span className="font-semibold text-[#1c2024]">{user.email}</span>. Your data is isolated and invisible to other users.
              </p>
            </div>
            <Badge variant="success">Active & Isolated</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
