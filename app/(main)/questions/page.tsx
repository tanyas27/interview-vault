import Link from 'next/link';
import { getQuestions } from '@/actions/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { QuestionCategory } from '@prisma/client';

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; needsReview?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const filters: {
    category?: QuestionCategory;
    needsReview?: boolean;
    search?: string;
  } = {};

  if (params.category && Object.values(QuestionCategory).includes(params.category as QuestionCategory)) {
    filters.category = params.category as QuestionCategory;
  }
  if (params.needsReview) filters.needsReview = params.needsReview === 'true';
  if (params.search) filters.search = params.search.slice(0, 200);

  const { questions, total, pageSize } = await getQuestions(filters, page);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Question Bank</h1>
          <p className="mt-1 text-sm text-[#717682]">
            Your central repository of extracted interview questions, confidence scores, and company tags
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-1.5 rounded-full bg-[#ffcf36] text-[#1c2024] font-bold text-xs shadow-xs">
            {total} Questions Saved
          </span>
        </div>
      </div>

      {questions.length === 0 && page === 1 ? (
        <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#ffcf36]/20 flex items-center justify-center mb-4">
              <BookOpen className="h-7 w-7 text-[#1c2024]" />
            </div>
            <h3 className="text-xl font-bold text-[#1c2024] mb-2">
              No questions yet
            </h3>
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
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {questions.map((question) => (
              <Link key={question.id} href={`/questions/${question.id}`} className="group block">
                <Card className="rounded-[24px] border border-black/5 bg-white p-2 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-bold leading-snug flex-1 text-[#1c2024] group-hover:text-black">
                        {question.questionText}
                      </CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {question.category.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#717682]">
                      <div className="flex items-center gap-3">
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
                        {question.needsReview && (
                          <>
                            <span>•</span>
                            <Badge variant="warning" className="text-[10px]">
                              Needs Review
                            </Badge>
                          </>
                        )}
                      </div>

                      {question.roundQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {Array.from(new Set(question.roundQuestions.map((rq) => rq.round.application.companyName)))
                            .slice(0, 3)
                            .map((company) => (
                              <Badge key={company} variant="secondary" className="text-[11px]">
                                {company}
                              </Badge>
                            ))}
                          <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-[#ffcf36] transition-colors ml-1">
                            <ChevronRight className="w-3.5 h-3.5 text-[#1c2024]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}
