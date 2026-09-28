import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/auth';
import { db } from '@/lib/db';
import { exportLimiter } from '@/lib/ratelimit';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

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

    const [applications, questions] = await Promise.all([
      db.application.findMany({
        where: { userId: user.userId },
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
          jobUrl: true,
          location: true,
          workMode: true,
          status: true,
          appliedDate: true,
          lastUpdated: true,
          hasReferral: true,
          referrerName: true,
          referralNotes: true,
          resumeVersion: true,
          resumeUrl: true,
          coverLetterUrl: true,
          expectedSalary: true,
          offeredSalary: true,
          priority: true,
          notes: true,
          tags: true,
          rounds: {
            select: {
              id: true,
              roundType: true,
              roundNumber: true,
              scheduledDate: true,
              completedDate: true,
              durationMinutes: true,
              status: true,
              feedback: true,
              rating: true,
              generalNotes: true,
              roundQuestions: {
                select: {
                  contextNotes: true,
                  wasAnswered: true,
                  performance: true,
                  question: {
                    select: {
                      id: true,
                      questionText: true,
                      category: true,
                      myAnswer: true,
                      modelAnswer: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      db.question.findMany({
        where: { userId: user.userId },
        select: {
          id: true,
          questionText: true,
          category: true,
          myAnswer: true,
          modelAnswer: true,
          keyPoints: true,
          tags: true,
          timesAsked: true,
          lastAskedDate: true,
          confidenceLevel: true,
          needsReview: true,
        },
      }),
    ]);

    const data = {
      exportedAt: new Date().toISOString(),
      user: { email: user.email, name: user.name },
      applications,
      questions,
    };

    const today = new Date().toISOString().split('T')[0];
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="interview-vault-export-${today}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
