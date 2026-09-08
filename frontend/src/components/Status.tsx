export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex justify-center py-16 text-muted-foreground" role="status" aria-live="polite">
      <div className="w-full max-w-4xl space-y-4">
        <span className="sr-only">{label}</span>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border bg-white">
              <div className="skeleton aspect-square rounded-none" />
              <div className="space-y-2 p-4">
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-4 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ message = 'No gemstones found.' }: { message?: string }) {
  return (
    <div className="premium-panel rounded-2xl px-6 py-14 text-center text-muted-foreground">
      <p className="mx-auto max-w-md text-sm">{message}</p>
    </div>
  )
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-14 text-center text-muted-foreground" role="alert">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="focus-ring mt-5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Retry
        </button>
      )}
    </div>
  )
}
