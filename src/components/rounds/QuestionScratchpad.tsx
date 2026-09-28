'use client';

import { useState } from 'react';
import { extractQuestionsFromText } from '@/actions/questions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface QuestionScratchpadProps {
  roundId: string;
}

export function QuestionScratchpad({ roundId }: QuestionScratchpadProps) {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    extracted: number;
    newQuestions: number;
    linkedExisting: number;
  } | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  async function handleExtract() {
    if (!rawText.trim()) return;

    setLoading(true);
    setResult(null);
    setExtractError(null);

    try {
      const response = await extractQuestionsFromText(roundId, rawText);
      setResult(response);
      setRawText('');
    } catch (error) {
      console.error('Failed to extract questions:', error);
      setExtractError('Failed to extract questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-2 border-dashed border-zinc-300 dark:border-zinc-700">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <CardTitle>Question Scratchpad</CardTitle>
        </div>
        <CardDescription>
          Paste your interview questions here. The system will automatically extract and categorize them into your central question bank.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={`Paste questions here (numbered or separated by double newlines)...

Examples:

1. Explain the difference between process and thread
2. How would you design a URL shortener?

Tell me about a time you resolved a conflict

What's your greatest weakness?`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            disabled={loading}
          />
          <p className="text-xs text-zinc-500">
            Tip: Numbered lists (1., 2., 3.) or double line breaks will be detected as separate questions
          </p>
        </div>

        <Button
          onClick={handleExtract}
          disabled={loading || !rawText.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting Questions...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Extract to Question Bank
            </>
          )}
        </Button>

        {extractError && (
          <p role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {extractError}
          </p>
        )}

        {result && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-green-900 dark:text-green-100">
                  Successfully extracted {result.extracted} questions!
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-green-800 dark:text-green-200">
                  <Badge variant="success">
                    {result.newQuestions} new
                  </Badge>
                  <Badge variant="outline">
                    {result.linkedExisting} existing (frequency updated)
                  </Badge>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All questions have been added to your question bank. You can now categorize and review them.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            How it works
          </h4>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• Questions are automatically parsed from your text</li>
            <li>• Duplicate questions are detected and linked (frequency counter increases)</li>
            <li>• New questions are added with default category (GENERAL); context comes from the round type</li>
            <li>• Visit the Question Bank to categorize, add answers, and track confidence levels</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
