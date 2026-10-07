import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createQuestionFromForm } from '@/actions/questions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { QUESTION_CATEGORIES } from '@/lib/categories';
import { QuestionCategory } from '@prisma/client';

export default function NewQuestionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/questions">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1c2024]">
            Add Question
          </h1>
          <p className="text-xs text-[#717682] mt-0.5">
            Quickly dump your questions, answers, and notes
          </p>
        </div>
      </div>

      <form action={createQuestionFromForm} className="space-y-6">
        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm p-6 space-y-5">
          {/* 1. Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-bold text-[#1c2024]">
              Category *
            </Label>
            <select
              id="category"
              name="category"
              defaultValue={QuestionCategory.MACHINE_CODING}
              className="w-full rounded-2xl border border-zinc-200 bg-[#fcfbf7] px-3.5 py-2.5 text-sm font-medium text-[#1c2024] focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
            >
              {QUESTION_CATEGORIES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Questions (dump area) */}
          <div className="space-y-2">
            <Label htmlFor="questionText" className="text-xs font-bold text-[#1c2024]">
              Questions *
            </Label>
            <p className="text-[11px] text-[#717682]">
              Paste or type your questions, answers, and notes together.
            </p>
            <Textarea
              id="questionText"
              name="questionText"
              required
              rows={12}
              placeholder="Dump all question text, answers, and prep notes here..."
              className="rounded-2xl border-zinc-200 bg-[#fcfbf7] text-sm leading-relaxed p-4 font-mono sm:font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-black/5">
            <Button variant="outline" asChild>
              <Link href="/questions">Cancel</Link>
            </Button>
            <Button variant="yellow" type="submit">
              Save Question
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
