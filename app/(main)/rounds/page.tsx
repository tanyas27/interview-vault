import Link from 'next/link';
import { getRounds } from '@/actions/rounds';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { RoundsTable } from '@/components/rounds/RoundsTable';

export default async function RoundsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const { rounds, total, pageSize } = await getRounds(page);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1c2024] tracking-tight">Interview Rounds</h1>
          <p className="mt-1 text-sm text-[#717682]">
            Track interview stages, pass/fail outcomes, and logged questions by company
          </p>
        </div>
        <Button variant="yellow" asChild>
          <Link href="/rounds/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Round
          </Link>
        </Button>
      </div>

      {rounds.length === 0 && page === 1 ? (
        <Card className="rounded-[28px] border border-black/5 bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#ffcf36]/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-7 w-7 text-[#1c2024]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1c2024] mb-2">No interview rounds yet</h3>
            <p className="text-sm text-[#717682] max-w-md mb-6">
              When you participate in an interview stage, log it here to track pass/fail results and the exact questions asked.
            </p>
            <div className="flex gap-3">
              <Button variant="default" asChild>
                <Link href="/applications">View Applications</Link>
              </Button>
              <Button variant="yellow" asChild>
                <Link href="/rounds/new">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Round
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <RoundsTable initialRounds={rounds} />
      )}

      {total > pageSize && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#717682]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link
                href={`/rounds?page=${page - 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium hover:bg-zinc-50 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </Link>
            )}
            {page * pageSize < total && (
              <Link
                href={`/rounds?page=${page + 1}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1c2024] text-white text-xs font-medium hover:bg-[#2b3238] transition-colors"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
