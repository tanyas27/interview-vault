export default function ReferralsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-32 rounded-2xl skeleton" />
        <div className="h-9 w-28 rounded-full skeleton" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[32px] border border-white/85 bg-white/60 p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl skeleton shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded skeleton" />
                  <div className="h-3 w-20 rounded skeleton" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full skeleton shrink-0" />
            </div>
            <div className="h-20 rounded-2xl skeleton" />
            <div className="h-6 w-full rounded-xl skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
