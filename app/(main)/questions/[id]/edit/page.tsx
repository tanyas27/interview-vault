import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getQuestion, updateQuestionFromForm } from '@/actions/questions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionCategory } from '@prisma/client';

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) {
    notFound();
  }

  const updateActionWithId = updateQuestionFromForm.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/questions/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1c2024]">
            Edit Question
          </h1>
          <p className="text-xs text-[#717682] mt-0.5">
            Refine question prompt, answer notes, and mastery tags
          </p>
        </div>
      </div>

      <form action={updateActionWithId} className="space-y-6">
        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Question Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                name="questionText"
                defaultValue={question.questionText}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={question.category}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
                >
                  {Object.values(QuestionCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Answers & Key Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="myAnswer">Your Answer / Approach</Label>
              <Textarea
                id="myAnswer"
                name="myAnswer"
                defaultValue={question.myAnswer || ''}
                rows={5}
                placeholder="Write out your answer or STAR response..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelAnswer">Model / Reference Answer</Label>
              <Textarea
                id="modelAnswer"
                name="modelAnswer"
                defaultValue={question.modelAnswer || ''}
                rows={4}
                placeholder="Ideal reference answer or system design points..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points (Bullets for quick review)</Label>
              <Textarea
                id="keyPoints"
                name="keyPoints"
                defaultValue={question.keyPoints || ''}
                rows={3}
                placeholder="Bullet points to memorize before rounds..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Review & Mastery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="confidenceLevel">Confidence Level (1 - 5)</Label>
                <Input
                  id="confidenceLevel"
                  name="confidenceLevel"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={question.confidenceLevel ?? ''}
                  placeholder="Rate 1-5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={question.tags || ''}
                  placeholder="e.g. distributed-systems, redis, cache"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="needsReview"
                name="needsReview"
                value="true"
                defaultChecked={question.needsReview}
                className="w-4 h-4 rounded border-zinc-300 text-[#1c2024] focus:ring-[#ffcf36]"
              />
              <Label htmlFor="needsReview" className="cursor-pointer font-medium text-sm">
                Mark as Needs Review (flagged in weak areas)
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href={`/questions/${id}`}>Cancel</Link>
          </Button>
          <Button variant="yellow" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
