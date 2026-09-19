export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <div className="flex items-center justify-between gap-3">
        <div className="bg-cream h-7 w-56 animate-pulse" />
        <div className="bg-cream h-11 w-36 animate-pulse" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-line bg-cream h-24 animate-pulse border" />
        ))}
      </div>
      <div className="border-line bg-cream h-64 animate-pulse border" />
    </div>
  );
}
