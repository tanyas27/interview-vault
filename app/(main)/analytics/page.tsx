import { getConversionFunnel, getQuestionFrequencyHeatmap, getWeakAreas } from '@/actions/analytics';
import { getCurrentUser } from '@/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [funnel, heatmap, weakAreas] = await Promise.all([
    getConversionFunnel(user.userId),
    getQuestionFrequencyHeatmap(user.userId),
    getWeakAreas(user.userId),
  ]);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-[#1c2024] tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-[#717682]">
          Deep dive into your interview conversion funnel, frequently tested topics, and preparation focus areas
        </p>
      </div>

      {/* Modern Conversion Funnel */}
      <ConversionFunnel data={funnel} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Frequency */}
        <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Question Frequency by Category</CardTitle>
            <CardDescription>
              Which categories are most frequently asked in your rounds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const sorted = heatmap.questionsByCategory
                  .sort((a, b) => (b._sum.timesAsked || 0) - (a._sum.timesAsked || 0))
                  .slice(0, 8);
                const maxAsked = Math.max(1, ...sorted.map((i) => i._sum.timesAsked || 0));
                return sorted.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1c2024]">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[#717682]">
                        {item._count} questions, {item._sum.timesAsked || 0}x total
                      </span>
                    </div>
                    <div className="w-full bg-[#f3efe6] rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-[#ffcf36]"
                        style={{
                          width: `${Math.max(8, Math.round(((item._sum.timesAsked || 0) / maxAsked) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ));
              })()}
              {heatmap.questionsByCategory.length === 0 && (
                <p className="text-xs text-[#717682] text-center py-8">
                  No question data yet. Extract questions from rounds to populate!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card className="rounded-[32px] border border-black/5 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Focus Areas & Confidence</CardTitle>
            <CardDescription>
              Questions with lower confidence ratings or flagged for revision
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(weakAreas.byCategory).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  ✓
                </div>
                <p className="text-xs font-semibold text-[#1c2024]">All topics in good standing!</p>
                <p className="text-[11px] text-[#717682] mt-1">Keep tracking confidence levels in rounds.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(weakAreas.byCategory)
                  .sort(([, a], [, b]) => b.length - a.length)
                  .slice(0, 5)
                  .map(([category, questions]) => (
                    <div key={category} className="p-3 rounded-2xl bg-[#fcfbf7] border border-black/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#1c2024]">{category.replace(/_/g, ' ')}</span>
                        <Badge variant="warning" className="text-[10px]">
                          {questions.length} to review
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {questions.slice(0, 2).map((q) => (
                          <Link
                            key={q.id}
                            href={`/questions/${q.id}`}
                            className="block text-xs text-[#717682] hover:text-[#1c2024] line-clamp-1"
                          >
                            • {q.questionText}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
