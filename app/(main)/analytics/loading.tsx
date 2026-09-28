export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-36 rounded-lg skeleton" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl skeleton" />
        ))}
      </div>
      <div className="h-64 rounded-2xl skeleton" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-56 rounded-2xl skeleton" />
        <div className="h-56 rounded-2xl skeleton" />
      </div>
    </div>
  );
}
