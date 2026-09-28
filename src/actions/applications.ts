'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from './auth';
import { ApplicationStatus, WorkMode, Priority } from '@prisma/client';
import { applicationSchema } from '@/lib/schemas';

const PAGE_SIZE = 20;

function parseSalary(val: string | null | undefined): number | null {
  if (!val) return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : Math.max(0, n);
}

export async function getApplications(page = 1) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const skip = (page - 1) * PAGE_SIZE;

  const [applications, total] = await db.$transaction([
    db.application.findMany({
      where: { userId: user.userId },
      orderBy: { appliedDate: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: {
        _count: { select: { rounds: true } },
      },
    }),
    db.application.count({ where: { userId: user.userId } }),
  ]);

  return { applications, total, page, pageSize: PAGE_SIZE };
}

export async function getApplication(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  return db.application.findFirst({
    where: { id, userId: user.userId },
    include: {
      rounds: {
        orderBy: { scheduledDate: 'asc' },
        include: {
          roundQuestions: {
            include: {
              question: true,
            },
          },
        },
      },
    },
  });
}

export async function createApplication(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid application data.');
  }

  const d = parsed.data;
  const comment = d.comment || d.referralNotes || null;

  const application = await db.application.create({
    data: {
      userId: user.userId,
      companyName: d.companyName,
      jobTitle: d.jobTitle,
      jobDescription: '',
      jobUrl: d.jobUrl || null,
      location: d.location || null,
      workMode: d.workMode as WorkMode,
      status: ApplicationStatus.APPLIED,
      hasReferral: d.hasReferral === 'true',
      referrerName: d.referrerName || null,
      referrerEmail: null,
      referrerLinkedIn: null,
      referralNotes: comment,
      resumeVersion: null,
      resumeUrl: d.resumeUrl || null,
      coverLetterUrl: d.coverLetterUrl || null,
      expectedSalary: parseSalary(d.expectedSalary),
      offeredSalary: parseSalary(d.offeredSalary),
      priority: d.priority as Priority,
      notes: d.notes || '',
      tags: d.tags || '',
    },
  });

  if (d.referralId) {
    await db.referral.updateMany({
      where: { id: d.referralId, userId: user.userId },
      data: { applicationId: application.id, status: 'APPLIED' },
    });
  }

  revalidatePath('/applications');
  revalidatePath('/referrals');
  revalidatePath('/dashboard');
  redirect(`/applications/${application.id}`);
}

export async function updateApplication(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid application data.');
  }

  const d = parsed.data;
  const comment = d.comment || d.referralNotes || null;

  await db.application.update({
    where: { id, userId: user.userId },
    data: {
      companyName: d.companyName,
      jobTitle: d.jobTitle,
      jobDescription: '',
      jobUrl: d.jobUrl || null,
      location: d.location || null,
      workMode: d.workMode as WorkMode,
      status: d.status as ApplicationStatus,
      hasReferral: d.hasReferral === 'true',
      referrerName: d.referrerName || null,
      referrerEmail: null,
      referrerLinkedIn: null,
      referralNotes: comment,
      resumeVersion: null,
      resumeUrl: d.resumeUrl || null,
      coverLetterUrl: d.coverLetterUrl || null,
      expectedSalary: parseSalary(d.expectedSalary),
      offeredSalary: parseSalary(d.offeredSalary),
      priority: d.priority as Priority,
      notes: d.notes || '',
      tags: d.tags || '',
    },
  });

  revalidatePath('/applications');
  revalidatePath(`/applications/${id}`);
  revalidatePath('/dashboard');
  redirect(`/applications/${id}`);
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.application.update({
    where: { id, userId: user.userId },
    data: { status, lastUpdated: new Date() },
  });

  revalidatePath('/applications');
  revalidatePath(`/applications/${id}`);
  revalidatePath('/dashboard');
}

export async function deleteApplication(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.application.delete({
    where: { id, userId: user.userId },
  });

  revalidatePath('/applications');
  revalidatePath('/dashboard');
  redirect('/applications');
}
