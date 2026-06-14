export function SkeletonLoading() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border-2 border-wine-100/30 p-4 dark:border-wine-900/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded-full bg-wine-100/50 dark:bg-wine-900/20" />
              <div className="h-4 w-28 rounded-full bg-wine-100/50 dark:bg-wine-900/20" />
              <div className="h-3 w-24 rounded-full bg-wine-100/30 dark:bg-wine-900/10" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded-full bg-wine-100/50 dark:bg-wine-900/20" />
              <div className="h-3 w-12 rounded-full bg-wine-100/30 dark:bg-wine-900/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
