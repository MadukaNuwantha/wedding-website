// Shown instantly (via Suspense) when navigating between dashboard pages,
// while the next page's data loads — the sidebar/header stay in place.
export default function DashboardLoading() {
  return (
    <div className="animate-pulse" aria-hidden>
      <span className="sr-only">Loading…</span>

      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="h-2.5 w-20 rounded bg-line" />
        <div className="mt-3 h-8 w-52 max-w-[70%] rounded bg-line" />
        <div className="mt-3 h-3 w-72 max-w-full rounded bg-line/70" />
      </div>

      {/* Content placeholders */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card rounded-2xl p-5">
            <div className="h-2.5 w-24 rounded bg-line" />
            <div className="mt-4 h-8 w-16 rounded bg-line" />
            <div className="mt-3 h-2.5 w-28 rounded bg-line/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
