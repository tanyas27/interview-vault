'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from './auth';
import { QuestionCategory } from '@prisma/client';
import { roundSchema, addQuestionToRoundSchema } from '@/lib/schemas';

const PAGE_SIZE = 20;

function parseDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

export async function getRounds(page = 1) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const skip = (page - 1) * PAGE_SIZE;

  const [rounds, total] = await db.$transaction([
    db.interviewRound.findMany({
      where: { application: { userId: user.userId } },
      include: {
        application: { select: { id: true, companyName: true, jobTitle: true } },
        roundQuestions: {
          select: { question: { select: { questionText: true } } },
        },
      },
      orderBy: [{ scheduledDate: 'desc' }, { id: 'desc' }],
      skip,
      take: PAGE_SIZE,
    }),
    db.interviewRound.count({ where: { application: { userId: user.userId } } }),
  ]);

  return { rounds, total, page, pageSize: PAGE_SIZE };
}

export async function getRound(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  return db.interviewRound.findFirst({
    where: { id, application: { userId: user.userId } },
    include: {
      application: true,
      roundQuestions: {
        include: { question: true },
      },
    },
  });
}

export async function createRound(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = roundSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid round data.');
  }

  const d = parsed.data;
  const applicationId = d.applicationId as string;

  const application = await db.application.findFirst({
    where: { id: applicationId, userId: user.userId },
  });
  if (!application) throw new Error('Application not found');

  const scheduledDate = parseDate(d.roundDate);

  const round = await db.interviewRound.create({
    data: {
      applicationId,
      roundType: d.roundType as RoundType,
      roundNumber: d.roundNumber,
      scheduledDate,
      status: d.status as RoundStatus,
      feedback: '',
      generalNotes: '',
    },
  });

  const initialQuestionText = d.initialQuestion?.trim();
  const initialAnswer = d.initialAnswer?.trim();

  if (initialQuestionText) {
    const newQuestion = await db.question.create({
      data: {
        userId: user.userId,
        questionText: initialQuestionText,
        myAnswer: initialAnswer || '',
        category: QuestionCategory.GENERAL,
      },
    });

    await db.roundQuestion.create({
      data: { roundId: round.id, questionId: newQuestion.id },
    });
  }

  revalidatePath(`/applications/${applicationId}`);
  revalidatePath('/rounds');
  revalidatePath('/dashboard');
  redirect(`/rounds/${round.id}`);
}

export async function updateRound(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const existingRound = await db.interviewRound.findFirst({
    where: { id, application: { userId: user.userId } },
  });
  if (!existingRound) throw new Error('Round not found or access denied');

  const raw = Object.fromEntries(formData);
  const parsed = roundSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid round data.');
  }

  const d = parsed.data;
  const scheduledDate = parseDate(d.roundDate);

  const round = await db.interviewRound.update({
    where: { id },
    data: {
      roundType: d.roundType as RoundType,
      roundNumber: d.roundNumber, // Zod coerces and clamps min(1)/max(20)
      scheduledDate,
      status: d.status as RoundStatus,
    },
    include: { application: true },
  });

  revalidatePath(`/applications/${round.applicationId}`);
  revalidatePath(`/rounds/${id}`);
  revalidatePath('/rounds');
  revalidatePath('/dashboard');
  redirect(`/rounds/${id}`);
}

export async function setRoundOutcome(id: string, status: RoundStatus) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const round = await db.interviewRound.findFirst({
    where: { id, application: { userId: user.userId } },
  });
  if (!round) throw new Error('Round not found');

  await db.interviewRound.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/rounds/${id}`);
  revalidatePath('/rounds');
  revalidatePath('/dashboard');
  revalidatePath(`/applications/${round.applicationId}`);
}

export async function addQuestionToRound(roundId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const round = await db.interviewRound.findFirst({
    where: { id: roundId, application: { userId: user.userId } },
  });
  if (!round) throw new Error('Round not found');

  const raw = Object.fromEntries(formData);
  const parsed = addQuestionToRoundSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid question data.');
  }

  const { questionText, myAnswer, category } = parsed.data;

  let question = await db.question.findFirst({
    where: { userId: user.userId, questionText },
  });

  if (question) {
    question = await db.question.update({
      where: { id: question.id },
      data: {
        ...(myAnswer ? { myAnswer } : {}),
        timesAsked: { increment: 1 },
        lastAskedDate: new Date(),
      },
    });
  } else {
    question = await db.question.create({
      data: {
        userId: user.userId,
        questionText,
        myAnswer: myAnswer || '',
        category: category as QuestionCategory,
        timesAsked: 1,
        lastAskedDate: new Date(),
      },
    });
  }

  await db.roundQuestion.upsert({
    where: { roundId_questionId: { roundId, questionId: question.id } },
    create: { roundId, questionId: question.id },
    update: {},
  });

  revalidatePath(`/rounds/${roundId}`);
  revalidatePath('/questions');
  revalidatePath('/dashboard');
}

export async function removeQuestionFromRound(roundId: string, questionId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const round = await db.interviewRound.findFirst({
    where: { id: roundId, application: { userId: user.userId } },
  });
  if (!round) throw new Error('Round not found');

  await db.roundQuestion.deleteMany({ where: { roundId, questionId } });

  revalidatePath(`/rounds/${roundId}`);
}

export async function deleteRound(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const round = await db.interviewRound.findFirst({
    where: { id, application: { userId: user.userId } },
  });
  if (!round) throw new Error('Round not found');

  await db.interviewRound.delete({ where: { id } });

  revalidatePath(`/applications/${round.applicationId}`);
  revalidatePath('/rounds');
  revalidatePath('/dashboard');
  redirect(`/applications/${round.applicationId}`);
}
