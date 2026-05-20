export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded bg-stone-100" />
          <div className="h-3 w-1/4 rounded bg-stone-100" />
        </div>
        <div className="h-5 w-16 rounded-full bg-stone-100" />
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-3.5 w-3.5 rounded-full bg-stone-100" />
        <div className="h-3 w-20 rounded bg-stone-100" />
      </div>
    </div>
  );
}
