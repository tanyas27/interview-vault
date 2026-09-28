'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addQuestionToRound, removeQuestionFromRound } from '@/actions/rounds';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit3, MessageCircleQuestion, Sparkles } from 'lucide-react';
import { QuestionCategory } from '@prisma/client';
import { QuestionScratchpad } from './QuestionScratchpad';

interface LinkedQuestion {
  id: string;
  contextNotes?: string | null;
  question: {
    id: string;
    questionText: string;
    myAnswer?: string | null;
    modelAnswer?: string | null;
    category: string;
    timesAsked: number;
  };
}

interface RoundQuestionsManagerProps {
  roundId: string;
  roundQuestions: LinkedQuestion[];
  roundType: string;
  companyName: string;
}

export function RoundQuestionsManager({
  roundId,
  roundQuestions,
  roundType,
  companyName,
}: RoundQuestionsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [loading, setLoading] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [category, setCategory] = useState<QuestionCategory>(QuestionCategory.GENERAL);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('questionText', questionText.trim());
    formData.append('myAnswer', myAnswer.trim());
    formData.append('category', category);

    try {
      await addQuestionToRound(roundId, formData);
      setQuestionText('');
      setMyAnswer('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (questionId: string) => {
    if (!confirm('Remove this question from the round?')) return;
    try {
      await removeQuestionFromRound(roundId, questionId);
    } catch (err) {
      console.error('Failed to remove question:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1c2024] flex items-center gap-2">
            <MessageCircleQuestion className="w-5 h-5 text-[#ffcf36]" />
            Questions & Answers Asked ({roundQuestions.length})
          </h2>
          <p className="text-xs text-[#717682] mt-0.5">
            Log the exact questions asked in this round and your answers or approaches
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScratchpad(!showScratchpad)}
            className="text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#ffcf36]" />
            Bulk Paste
          </Button>

          <Button
            variant="yellow"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Question & Answer
          </Button>
        </div>
      </div>

      {/* Add Question & Answer Form */}
      {isAdding && (
        <Card className="rounded-[28px] border-2 border-[#ffcf36]/50 bg-white p-5 shadow-md">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <h4 className="text-sm font-bold text-[#1c2024]">Add Question Asked</h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-zinc-400 hover:text-zinc-700"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c2024]">Question Text *</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="e.g. How would you design a distributed rate limiter? or: Describe a project failure and your learnings."
                rows={2}
                required
                className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-xs text-[#1c2024] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c2024]">Your Answer / Approach</label>
              <textarea
                value={myAnswer}
                onChange={(e) => setMyAnswer(e.target.value)}
                placeholder="What answer did you give? Token bucket algorithm with Redis, sliding window counter trade-offs..."
                rows={4}
                className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-xs text-[#1c2024] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#ffcf36]/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#717682]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-[#1c2024]"
                >
                  {Object.values(QuestionCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#717682]">Round context</label>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-100 bg-zinc-50 text-xs text-[#4b515d]">
                  <span className="font-semibold text-[#1c2024]">{companyName}</span>
                  <span className="text-zinc-400">·</span>
                  <span>{roundType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="yellow"
                size="sm"
                disabled={loading || !questionText.trim()}
              >
                {loading ? 'Saving...' : 'Add to Round'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Optional Bulk Paste Scratchpad */}
      {showScratchpad && (
        <div className="p-4 rounded-3xl bg-zinc-50 border border-black/5">
          <QuestionScratchpad roundId={roundId} />
        </div>
      )}

      {/* Question & Answer Cards */}
      {roundQuestions.length === 0 ? (
        <Card className="rounded-[28px] border border-dashed border-zinc-200 bg-white p-8 text-center">
          <MessageCircleQuestion className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#1c2024]">No questions recorded yet</h4>
          <p className="text-xs text-[#717682] max-w-sm mx-auto mt-1">
            Log the questions you were asked and your answers so you can review them before future interview rounds.
          </p>
          <Button
            variant="yellow"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="mt-4"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add First Question & Answer
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {roundQuestions.map((rq, idx) => (
            <Card
              key={rq.id}
              className="rounded-[28px] border border-black/5 bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-[#1c2024] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {rq.question.category.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {companyName} · {roundType.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#1c2024]">
                    {rq.question.questionText}
                  </h3>

                  {/* Your Answer */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-[#fcfbf7] border border-black/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#1c2024] uppercase tracking-wider">
                        Your Answer / Approach:
                      </span>
                      <Link
                        href={`/questions/${rq.question.id}/edit`}
                        className="text-[11px] font-semibold text-[#717682] hover:text-[#1c2024] flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit Answer
                      </Link>
                    </div>

                    {rq.question.myAnswer ? (
                      <p className="text-xs text-[#4b515d] whitespace-pre-wrap leading-relaxed">
                        {rq.question.myAnswer}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400 italic">
                        No answer recorded yet. Click Edit Answer to write your response approach.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(rq.question.id)}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                    title="Remove question from this round"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
