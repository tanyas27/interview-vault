export default function ApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg skeleton" />
          <div className="h-4 w-64 rounded skeleton" />
        </div>
        <div className="h-9 w-36 rounded-full skeleton" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-[28px] border border-black/5 bg-white p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-32 rounded skeleton" />
              <div className="h-5 w-20 rounded-full skeleton" />
            </div>
            <div className="h-4 w-40 rounded skeleton" />
            <div className="h-16 rounded-2xl skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
