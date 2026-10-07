import { Suspense } from 'react';
import Link from 'next/link';
import { getQuestions } from '@/actions/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { QuestionCategory } from '@prisma/client';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function QuestionsListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-14 rounded-2xl skeleton" />
      ))}
    </div>
  );
}

// ─── Async data component ─────────────────────────────────────────────────────

async function QuestionsList({
  page,
  filters,
}: {
  page: number;
  filters: { category?: QuestionCategory; needsReview?: boolean; search?: string };
}) {
  const { questions, total, pageSize } = await getQuestions(filters, page);

  if (questions.length === 0 && page === 1) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[#ffcf36]/20 flex items-center justify-center mb-4">
            <BookOpen className="h-7 w-7 text-[#1c2024]" />
          </div>
          <h3 className="text-xl font-bold text-[#1c2024] mb-2">No questions yet</h3>
          <p className="text-sm text-[#717682] max-w-md mb-6">
            Questions appear here automatically when you extract them from interview rounds using the Question Scratchpad.
          </p>
          <Link
            href="/rounds"
            className="px-5 py-2.5 rounded-full bg-[#1c2024] text-white text-xs font-semibold hover:bg-black transition-colors"
          >
            Go to Interview Rounds
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {questions.map((question) => (
          <Link
            key={question.id}
            href={`/questions/${question.id}`}
            className="group block rounded-2xl bg-white/60 backdrop-blur-2xl hover:bg-white/85 border border-white/85 hover:border-white px-4 py-2.5 sm:py-3 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                {/* Question title & category badge */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-sm font-bold text-[#1c2024] group-hover:text-black truncate leading-tight"
                    title={question.questionText}
                  >
                    {question.questionText}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0 uppercase tracking-wide">
                    {question.category.replace(/_/g, ' ')}
                  </Badge>
                  {question.needsReview && (
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0.5 shrink-0">
                      Needs Review
                    </Badge>
                  )}
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#717682]">
                  <span className="font-semibold text-[#1c2024]">Asked {question.timesAsked}x</span>
                  <span>•</span>
                  <span>
                    {question.roundQuestions.length} round{question.roundQuestions.length !== 1 ? 's' : ''}
                  </span>
                  {question.confidenceLevel && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-amber-700">
                        Confidence: {question.confidenceLevel}/5
                      </span>
                    </>
                  )}
                  {question.roundQuestions.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="inline-flex flex-wrap gap-1 items-center">
                        {Array.from(new Set(question.roundQuestions.map((rq) => rq.round.application.companyName)))
                          .slice(0, 3)
                          .map((company) => (
                            <Badge key={company} variant="yellow" className="text-[10px] px-2 py-0.5 font-bold">
                              {company}
                            </Badge>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Chevron icon */}
              <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors shrink-0">
                <ChevronRight className="w-3.5 h-3.5 text-[#1c2024]" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {total > pageSize && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#717682]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={`/questions?page=${page - 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Link>
            )}
            {page * pageSize < total && (
              <Link
                href={`/questions?page=${page + 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1c2024] text-white text-xs font-medium hover:bg-[#2b3238] transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; needsReview?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const filters: { category?: QuestionCategory; needsReview?: boolean; search?: string } = {};
  if (params.category && Object.values(QuestionCategory).includes(params.category as QuestionCategory)) {
    filters.category = params.category as QuestionCategory;
  }
  if (params.needsReview) filters.needsReview = params.needsReview === 'true';
  if (params.search) filters.search = params.search.slice(0, 200);

  return (
    <div className="space-y-6">
      {/* Header — renders instantly */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Question Bank</h1>
          <p className="mt-1 text-sm text-[#717682]">
            Your central repository of extracted interview questions, confidence scores, and company tags
          </p>
        </div>
      </div>

      {/* Questions list streams in */}
      <Suspense fallback={<QuestionsListSkeleton />}>
        <QuestionsList page={page} filters={filters} />
      </Suspense>
    </div>
  );
}
