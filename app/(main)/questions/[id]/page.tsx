import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuestion } from '@/actions/questions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

import { formatQuestionCategory } from '@/lib/categories';

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  const titleLine = question.questionText.split('\n')[0]?.trim() || 'Question Details';

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3">
          <Link href="/questions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Question Bank
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-black/5 text-[#1c2024] text-xs font-bold uppercase tracking-wider">
                {formatQuestionCategory(question.category)}
              </span>
              <span className="text-xs text-[#717682]">
                Asked {question.timesAsked}x
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2024] leading-snug line-clamp-2">
              {titleLine}
            </h1>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 self-start sm:self-auto">
            <Link href={`/questions/${id}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content Column: Questions & Answers dump */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm p-6 sm:p-7">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8e939f] mb-4">
              Questions & Answers
            </h2>
            <div className="text-sm text-[#1c2024] whitespace-pre-wrap leading-relaxed font-mono sm:font-sans">
              {question.questionText}
            </div>
            {question.myAnswer && question.myAnswer !== question.questionText && (
              <div className="mt-6 pt-6 border-t border-black/5 text-sm text-[#1c2024] whitespace-pre-wrap leading-relaxed">
                {question.myAnswer}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Column: Minimal Asked in Rounds */}
        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8e939f]">
                Asked in Rounds
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-[#717682]">
                {question.roundQuestions.length}
              </span>
            </div>

            {question.roundQuestions.length === 0 ? (
              <p className="text-xs text-[#717682] py-1">
                Not linked to any rounds yet.
              </p>
            ) : (
              <div className="space-y-2">
                {question.roundQuestions.map((rq) => {
                  const statusStyle =
                    rq.round.status === 'PASSED'
                      ? 'bg-[#EBF7D5] text-[#749c36] border border-[#d2ebaa]/60'
                      : rq.round.status === 'FAILED'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60';

                  const formattedDate = rq.round.scheduledDate
                    ? new Date(rq.round.scheduledDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : null;

                  return (
                    <Link
                      key={rq.id}
                      href={`/rounds/${rq.round.id}`}
                      className="block p-3 rounded-2xl bg-white/70 hover:bg-white border border-white/80 hover:border-black/10 shadow-2xs transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-[#1c2024] truncate group-hover:text-black">
                          {rq.round.application.companyName}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusStyle}`}>
                          {rq.round.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-[#f8f7fb] text-[#6d6282] border border-[#ece8f4] text-[10px] font-semibold uppercase tracking-wider">
                          {rq.round.roundType.replace(/_/g, ' ')}
                        </span>
                        {formattedDate && (
                          <span className="text-[11px] text-[#717682]">
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {rq.contextNotes && (
                        <p className="text-[11px] text-[#717682] mt-1.5 line-clamp-2 italic">
                          {rq.contextNotes}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
