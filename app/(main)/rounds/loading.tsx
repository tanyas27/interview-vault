export default function RoundsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-24 rounded-lg skeleton" />
          <div className="h-4 w-52 rounded skeleton" />
        </div>
        <div className="h-9 w-28 rounded-full skeleton" />
      </div>
      <div className="rounded-[28px] border border-black/5 bg-white overflow-hidden">
        <div className="h-12 skeleton" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 border-t border-black/5 px-4 flex items-center gap-4">
            <div className="h-4 w-28 rounded skeleton" />
            <div className="h-4 w-20 rounded skeleton" />
            <div className="h-4 w-16 rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
