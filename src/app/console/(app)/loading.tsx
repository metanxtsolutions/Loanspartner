export default function ConsoleLoading() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-live="polite">
      <div className="bg-ink-100 h-7 w-48 animate-pulse" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-ink-50 border-line h-24 animate-pulse border" />
        ))}
      </div>
      <div className="bg-ink-50 border-line h-64 animate-pulse border" />
    </div>
  );
}
