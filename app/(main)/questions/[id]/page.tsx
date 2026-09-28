import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuestion } from '@/actions/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export default async function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/questions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Question Bank
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {question.questionText}
            </h1>
            <div className="flex gap-2 mt-3">
              <Badge>{question.category}</Badge>
              <Badge variant="secondary">Asked {question.timesAsked}x</Badge>
              {question.needsReview && <Badge variant="warning">Needs Review</Badge>}
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/questions/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            {question.myAnswer ? (
              <p className="text-sm whitespace-pre-wrap">{question.myAnswer}</p>
            ) : (
              <p className="text-sm text-zinc-500 italic">
                No answer recorded yet. Click Edit to add your answer.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {question.confidenceLevel && (
            <Card>
              <CardHeader>
                <CardTitle>Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < question.confidenceLevel! ? 'text-yellow-400' : 'text-zinc-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  {question.confidenceLevel}/5
                </p>
              </CardContent>
            </Card>
          )}

          {question.tags && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {question.tags.split(',').map((tag) => (
                    <Badge key={tag.trim()} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {question.modelAnswer && (
        <Card>
          <CardHeader>
            <CardTitle>Model Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{question.modelAnswer}</p>
          </CardContent>
        </Card>
      )}

      {question.keyPoints && (
        <Card>
          <CardHeader>
            <CardTitle>Key Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{question.keyPoints}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Asked in {question.roundQuestions.length} Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          {question.roundQuestions.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">
              This question hasn't been linked to any rounds yet.
            </p>
          ) : (
            <div className="space-y-3">
              {question.roundQuestions.map((rq) => (
                <Link
                  key={rq.id}
                  href={`/rounds/${rq.round.id}`}
                  className="block p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {rq.round.application.companyName}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {rq.round.roundType.replace(/_/g, ' ')}
                      </p>
                      {rq.round.scheduledDate && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(rq.round.scheduledDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge>{rq.round.status}</Badge>
                  </div>
                  {rq.contextNotes && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                      {rq.contextNotes}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
