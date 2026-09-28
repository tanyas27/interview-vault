'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getCurrentUser } from './auth';
import { QuestionCategory, Difficulty, Prisma } from '@prisma/client';
import { questionFormSchema } from '@/lib/schemas';

const PAGE_SIZE = 20;

export async function getQuestions(
  filters?: {
    category?: QuestionCategory;
    difficulty?: Difficulty;
    needsReview?: boolean;
    search?: string;
  },
  page = 1,
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const where: Prisma.QuestionWhereInput = { userId: user.userId };

  if (filters?.category) where.category = filters.category;
  if (filters?.difficulty) where.difficulty = filters.difficulty;
  if (filters?.needsReview !== undefined) where.needsReview = filters.needsReview;
  if (filters?.search) where.questionText = { contains: filters.search };

  const skip = (page - 1) * PAGE_SIZE;

  const [questions, total] = await db.$transaction([
    db.question.findMany({
      where,
      orderBy: [{ timesAsked: 'desc' }, { lastAskedDate: 'desc' }],
      skip,
      take: PAGE_SIZE,
      include: {
        roundQuestions: {
          include: {
            round: {
              select: {
                id: true,
                roundType: true,
                application: { select: { companyName: true } },
              },
            },
          },
        },
      },
    }),
    db.question.count({ where }),
  ]);

  return { questions, total, page, pageSize: PAGE_SIZE };
}

export async function getQuestion(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  return db.question.findFirst({
    where: { id, userId: user.userId },
    include: {
      roundQuestions: {
        include: {
          round: {
            include: { application: true },
          },
        },
      },
    },
  });
}

// Extract questions from pasted text and link them to a round
export async function extractQuestionsFromText(roundId: string, text: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const round = await db.interviewRound.findFirst({
    where: { id: roundId, application: { userId: user.userId } },
  });
  if (!round) throw new Error('Round not found');

  // Parse numbered lists and double-newline separated blocks
  const lines = text
    .split(/\n\n+|\d+\.\s+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10)
    .slice(0, 50); // Cap at 50 questions per submission

  if (lines.length === 0) return { success: true, extracted: 0, newQuestions: 0, linkedExisting: 0, questions: [] };

  // Fetch all existing questions for this user in one query
  const existingQuestions = await db.question.findMany({
    where: { userId: user.userId },
    select: { id: true, questionText: true, timesAsked: true },
  });

  // Build a prefix-based map for O(1) fuzzy lookup
  const existingByPrefix = new Map<string, typeof existingQuestions[0]>();
  for (const q of existingQuestions) {
    existingByPrefix.set(q.questionText.slice(0, 50).toLowerCase(), q);
  }

  const results: Array<{ question: { id: string; questionText: string }; isNew: boolean }> = [];
  const newQuestionTexts: string[] = [];
  const toLink: Array<{ questionId: string; isNew: boolean }> = [];

  // Separate new vs existing
  for (const questionText of lines) {
    const prefix = questionText.slice(0, 50).toLowerCase();
    const existing = existingByPrefix.get(prefix);

    if (existing) {
      toLink.push({ questionId: existing.id, isNew: false });
      results.push({ question: existing, isNew: false });
    } else {
      newQuestionTexts.push(questionText);
    }
  }

  // Batch create new questions
  if (newQuestionTexts.length > 0) {
    await db.question.createMany({
      data: newQuestionTexts.map((questionText) => ({
        questionText,
        category: QuestionCategory.GENERAL,
        difficulty: Difficulty.MEDIUM,
        userId: user.userId,
      })),
    });

    // Fetch the newly created questions
    const newQuestions = await db.question.findMany({
      where: { userId: user.userId, questionText: { in: newQuestionTexts } },
      select: { id: true, questionText: true },
    });

    for (const q of newQuestions) {
      toLink.push({ questionId: q.id, isNew: true });
      results.push({ question: q, isNew: true });
    }
  }

  // Batch upsert round-question links and increment counters
  await Promise.all(
    toLink.map(({ questionId }) =>
      db.roundQuestion.upsert({
        where: { roundId_questionId: { roundId, questionId } },
        create: { roundId, questionId },
        update: {},
      }),
    ),
  );

  // Increment timesAsked for all linked questions
  const linkedIds = toLink.map((l) => l.questionId);
  if (linkedIds.length > 0) {
    await db.question.updateMany({
      where: { id: { in: linkedIds }, userId: user.userId },
      data: { timesAsked: { increment: 1 }, lastAskedDate: new Date() },
    });
  }

  revalidatePath(`/rounds/${roundId}`);
  revalidatePath('/questions');
  revalidatePath('/dashboard');

  return {
    success: true,
    extracted: results.length,
    newQuestions: results.filter((r) => r.isNew).length,
    linkedExisting: results.filter((r) => !r.isNew).length,
    questions: results.map((r) => r.question),
  };
}

export async function updateQuestion(
  id: string,
  data: {
    questionText?: string;
    category?: QuestionCategory;
    difficulty?: Difficulty;
    myAnswer?: string;
    modelAnswer?: string;
    keyPoints?: string;
    tags?: string;
    confidenceLevel?: number;
    needsReview?: boolean;
  },
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.question.update({
    where: { id, userId: user.userId },
    data,
  });

  revalidatePath('/questions');
  revalidatePath(`/questions/${id}`);
}

export async function deleteQuestion(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.question.delete({ where: { id, userId: user.userId } });

  revalidatePath('/questions');
  revalidatePath('/dashboard');
}

export async function bulkUpdateQuestions(
  ids: string[],
  data: { category?: QuestionCategory; difficulty?: Difficulty; needsReview?: boolean },
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  await db.question.updateMany({
    where: { id: { in: ids }, userId: user.userId },
    data,
  });

  revalidatePath('/questions');
}

export async function updateQuestionFromForm(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const parsed = questionFormSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid question data.');
  }

  const d = parsed.data;
  const confidenceLevel = d.confidenceLevel
    ? Math.min(5, Math.max(1, parseInt(d.confidenceLevel, 10)))
    : null;

  await db.question.update({
    where: { id, userId: user.userId },
    data: {
      questionText: d.questionText,
      category: d.category as QuestionCategory,
      difficulty: d.difficulty as Difficulty,
      myAnswer: d.myAnswer || '',
      modelAnswer: d.modelAnswer || '',
      keyPoints: d.keyPoints || '',
      tags: d.tags || '',
      confidenceLevel,
      needsReview: d.needsReview === 'true',
    },
  });

  revalidatePath('/questions');
  revalidatePath(`/questions/${id}`);
  revalidatePath('/dashboard');
  redirect(`/questions/${id}`);
}
