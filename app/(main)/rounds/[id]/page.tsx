import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRound, deleteRound } from '@/actions/rounds';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { RoundOutcomeHeader } from '@/components/rounds/RoundOutcomeHeader';
import { RoundQuestionsManager } from '@/components/rounds/RoundQuestionsManager';

export default async function RoundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const round = await getRound(id);

  if (!round) {
    notFound();
  }

  const deleteActionWithId = deleteRound.bind(null, id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/applications/${round.applicationId}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to {round.application.companyName}
          </Link>
        </Button>

        <form action={deleteActionWithId}>
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="text-zinc-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete Round
          </Button>
        </form>
      </div>

      {/* Outcome Header (Pass / Fail / Pending) */}
      <RoundOutcomeHeader
        roundId={id}
        initialStatus={round.status}
        companyName={round.application.companyName}
        jobTitle={round.application.jobTitle}
        roundType={round.roundType}
        roundNumber={round.roundNumber}
        scheduledDate={round.scheduledDate}
      />

      {/* Questions & Answers Asked Section */}
      <RoundQuestionsManager
        roundId={id}
        roundQuestions={round.roundQuestions}
        roundType={round.roundType}
        companyName={round.application.companyName}
      />


    </div>
  );
}
