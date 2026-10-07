'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from './auth';
import { ApplicationStatus } from '@prisma/client';

export async function getConversionFunnel(userId: string) {
  const applications = await db.application.findMany({
    where: { userId },
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      status: true,
      appliedDate: true,
      notes: true,
      rounds: {
        select: { id: true, roundType: true, status: true },
      },
    },
    orderBy: { appliedDate: 'desc' },
  });

  const total = applications.length;

  const screeningCount = applications.filter(
    (a) =>
      a.rounds.length > 0 ||
      ['SCREENING', 'INTERVIEWING', 'OFFER', 'ACCEPTED', 'REJECTED'].includes(a.status),
  ).length;

  const interviewingCount = applications.filter(
    (a) => a.rounds.length > 0 || ['INTERVIEWING', 'OFFER', 'ACCEPTED'].includes(a.status),
  ).length;

  const offerCount = applications.filter(
    (a) => a.status === ApplicationStatus.OFFER || a.status === ApplicationStatus.ACCEPTED,
  ).length;

  // Derive round stats from already-fetched data — no second DB query needed
  const allRounds = applications.flatMap((a) => a.rounds);
  const totalRounds = allRounds.length;
  const passedRounds = allRounds.filter((r) => r.status === 'PASSED').length;
  const roundPassRate = totalRounds > 0 ? Math.round((passedRounds / totalRounds) * 100) : 0;
  const interviewInviteRate = total > 0 ? Math.round((interviewingCount / total) * 100) : 0;

  const stages = [
    { name: 'Applied', status: 'APPLIED', count: total, percentage: total > 0 ? 100 : 0 },
    {
      name: 'Screening',
      status: 'SCREENING',
      count: screeningCount,
      percentage: total > 0 ? Math.round((screeningCount / total) * 100) : 0,
    },
    {
      name: 'Interviews',
      status: 'INTERVIEWING',
      count: interviewingCount,
      percentage: total > 0 ? Math.round((interviewingCount / total) * 100) : 0,
    },
    {
      name: 'Offers',
      status: 'OFFER',
      count: offerCount,
      percentage: total > 0 ? Math.round((offerCount / total) * 100) : 0,
    },
  ];

  const statusCounts = {
    active: applications.filter((a) =>
      ['APPLIED', 'SCREENING', 'INTERVIEWING'].includes(a.status),
    ).length,
    offers: offerCount,
    concluded: applications.filter((a) => ['REJECTED', 'WITHDRAWN'].includes(a.status)).length,
  };

  return {
    totalApplications: total,
    interviewInviteRate,
    totalRounds,
    passedRounds,
    roundPassRate,
    statusCounts,
    stages,
    applications: applications.map((a) => ({
      id: a.id,
      companyName: a.companyName,
      jobTitle: a.jobTitle,
      status: a.status,
      appliedDate: a.appliedDate.toISOString(),
      roundsCount: a.rounds.length,
      roundsPassed: a.rounds.filter((r) => r.status === 'PASSED').length,
      roundsFailed: a.rounds.filter((r) => r.status === 'FAILED').length,
      notes: a.notes,
    })),
  };
}

export async function getQuestionFrequencyHeatmap(userId: string) {
  const questionsByCategory = await db.question.groupBy({
    by: ['category'],
    where: { userId },
    _count: true,
    _sum: { timesAsked: true },
  });

  const rounds = await db.interviewRound.findMany({
    where: { application: { userId } },
    include: {
      application: { select: { companyName: true } },
      roundQuestions: {
        include: { question: { select: { category: true } } },
      },
    },
  });

  const companyCategories: Record<string, Record<string, number>> = {};
  for (const round of rounds) {
    const company = round.application.companyName;
    if (!companyCategories[company]) companyCategories[company] = {};
    for (const rq of round.roundQuestions) {
      const category = rq.question.category;
      companyCategories[company][category] = (companyCategories[company][category] || 0) + 1;
    }
  }

  return { questionsByCategory, companyCategories };
}

export async function getWeakAreas(userId: string) {
  const weakQuestions = await db.question.findMany({
    where: {
      userId,
      OR: [{ confidenceLevel: { lte: 2 } }, { needsReview: true }],
    },
    select: {
      id: true,
      questionText: true,
      category: true,
      confidenceLevel: true,
      timesAsked: true,
      needsReview: true,
    },
    orderBy: { timesAsked: 'desc' },
    take: 20,
  });

  const byCategory: Record<string, typeof weakQuestions> = {};
  for (const q of weakQuestions) {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  }

  return { weakQuestions, byCategory };
}

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const [
    totalApplications,
    activeApplications,
    totalRounds,
    upcomingRounds,
    totalQuestions,
    offersReceived,
    pendingReferrals,
  ] = await Promise.all([
    db.application.count({ where: { userId: user.userId } }),
    db.application.count({
      where: {
        userId: user.userId,
        status: {
          in: [ApplicationStatus.APPLIED, ApplicationStatus.SCREENING, ApplicationStatus.INTERVIEWING],
        },
      },
    }),
    db.interviewRound.count({
      where: { application: { userId: user.userId } },
    }),
    db.interviewRound.count({
      where: {
        application: { userId: user.userId },
        status: { in: ['PENDING', 'SCHEDULED'] },
      },
    }),
    db.question.count({ where: { userId: user.userId } }),
    db.application.count({
      where: {
        userId: user.userId,
        status: { in: [ApplicationStatus.OFFER, ApplicationStatus.ACCEPTED] },
      },
    }),
    db.referral.count({
      where: { userId: user.userId, status: { in: ['PENDING', 'HR_CONTACTED'] } },
    }),
  ]);

  const offerRate =
    totalApplications > 0 ? Math.round((offersReceived / totalApplications) * 100) : 0;

  return {
    totalApplications,
    activeApplications,
    totalRounds,
    upcomingRounds,
    totalQuestions,
    offersReceived,
    offerRate,
    pendingReferrals,
  };
}
