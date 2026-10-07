'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from './auth';
import { ReferralStatus } from '@prisma/client';
import { referralSchema } from '@/lib/schemas';

const PAGE_SIZE = 20;

export async function getReferrals(page = 1) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const skip = (page - 1) * PAGE_SIZE;

  const [referrals, total] = await db.$transaction([
    db.referral.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: { application: { select: { id: true, companyName: true, status: true } } },
    }),
    db.referral.count({ where: { userId: user.userId } }),
  ]);

  return { referrals, total, page, pageSize: PAGE_SIZE };
}

export async function getReferral(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return db.referral.findFirst({
    where: { id, userId: user.userId },
    include: { application: { select: { id: true, companyName: true, jobTitle: true, status: true } } },
  });
}

export async function createReferral(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = referralSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid referral data.');
  }

  const d = parsed.data;

  await db.referral.create({
    data: {
      userId: user.userId,
      company: d.company,
      role: d.role || null,
      referrerName: d.referrerName,
      status: d.status,
      notes: d.notes || '',
      contactDate: new Date(d.contactDate),
      followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
    },
  });

  revalidatePath('/referrals');
  revalidatePath('/dashboard');
  redirect('/referrals');
}

export async function updateReferral(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = referralSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid referral data.');
  }

  const d = parsed.data;

  await db.referral.updateMany({
    where: { id, userId: user.userId },
    data: {
      company: d.company,
      role: d.role || null,
      referrerName: d.referrerName,
      status: d.status,
      notes: d.notes || '',
      contactDate: new Date(d.contactDate),
      followUpDate: d.followUpDate ? new Date(d.followUpDate) : null,
    },
  });

  revalidatePath('/referrals');
  redirect('/referrals');
}

export async function deleteReferral(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.referral.deleteMany({ where: { id, userId: user.userId } });

  revalidatePath('/referrals');
  revalidatePath('/dashboard');
  redirect('/referrals');
}

export async function getPendingReferralsCount(userId: string) {
  return db.referral.count({
    where: { userId, status: { in: [ReferralStatus.PENDING, ReferralStatus.HR_CONTACTED] } },
  });
}
