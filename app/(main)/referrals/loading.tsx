export default function ReferralsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-9 w-32 rounded-2xl skeleton" />
        <div className="h-9 w-28 rounded-full skeleton" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-[24px] skeleton" />
        ))}
      </div>
    </div>
  );
}
