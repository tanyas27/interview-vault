export default function QuestionsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg skeleton" />
          <div className="h-4 w-56 rounded skeleton" />
        </div>
        <div className="h-9 w-36 rounded-full skeleton" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 rounded-2xl skeleton" />
        ))}
      </div>
    </div>
  );
}
