export default function MainLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-lg skeleton" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl skeleton" />
        ))}
      </div>
      <div className="h-64 rounded-2xl skeleton" />
      <div className="h-48 rounded-2xl skeleton" />
    </div>
  );
}
