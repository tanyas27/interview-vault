import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { db } from '@/lib/db';
import { exportLimiter } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

function sanitizeCsvCell(cell: string): string {
  let val = cell;
  // Defend against CSV formula injection (=, +, -, @, tab, CR, pipe, backtick)
  if (/^[=+\-@\t\r|`]/.test(val)) {
    val = `'${val}`;
  }
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const headerStore = await headers();
    const ip =
      headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headerStore.get('x-real-ip') ||
      user.userId;
    const rateLimit = await exportLimiter.check(`export:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many export requests. Please wait a minute.' },
        { status: 429 },
      );
    }

    const applications = await db.application.findMany({
      where: { userId: user.userId },
      select: {
        companyName: true,
        jobTitle: true,
        status: true,
        appliedDate: true,
        location: true,
        workMode: true,
        priority: true,
        hasReferral: true,
        referrerName: true,
        offeredSalary: true,
        tags: true,
        _count: { select: { rounds: true } },
      },
    });

    const headerRow = [
      'Company',
      'Job Title',
      'Status',
      'Applied Date',
      'Location',
      'Work Mode',
      'Priority',
      'Has Referral',
      'Referrer Name',
      'Offered Salary',
      'Total Rounds',
      'Tags',
    ];

    const rows = applications.map((app) => [
      app.companyName,
      app.jobTitle,
      app.status,
      new Date(app.appliedDate).toLocaleDateString(),
      app.location || '',
      app.workMode,
      app.priority,
      app.hasReferral ? 'Yes' : 'No',
      app.referrerName || '',
      app.offeredSalary?.toString() || '',
      app._count.rounds.toString(),
      app.tags || '',
    ]);

    const csv = [
      headerRow.join(','),
      ...rows.map((row) => row.map((cell) => sanitizeCsvCell(String(cell))).join(',')),
    ].join('\n');

    const today = new Date().toISOString().split('T')[0];
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="interview-vault-export-${today}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return new Response('Failed to export data', { status: 500 });
  }
}
