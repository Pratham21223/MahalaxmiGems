import { useFetch } from '@/hooks/useFetch'
import { getReviews } from '@/lib/api'
import type { Review, ReviewSummary } from '@/lib/types'
import { Loading, ErrorState } from './Status'
import { Stars } from './Stars'
import { ReviewForm } from './ReviewForm'

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="premium-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">{review.name}</span>
          {review.verified && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              Verified
            </span>
          )}
        </div>
        {review.createdAt && (
          <time className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</time>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Stars value={review.rating} />
      </div>
      {review.title && <h4 className="mt-2 font-medium text-foreground">{review.title}</h4>}
      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
    </article>
  )
}

export function ReviewSection({ productId }: { productId: string }) {
  const list = useFetch<ReviewSummary>(() => getReviews(productId), [productId])

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Feedback</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary">Customer Reviews</h2>
      </div>

      {list.loading ? (
        <Loading label="Loading reviews…" />
      ) : list.error ? (
        <ErrorState message="Could not load reviews." onRetry={list.refetch} />
      ) : (
        <>
          <div className="premium-panel flex flex-wrap items-center gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-semibold text-primary">{list.data?.average || '—'}</span>
              <div>
                <Stars value={list.data?.average || 0} />
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on {list.data?.count || 0} review{list.data?.count === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>

          {list.data?.reviews.length ? (
            <div className="space-y-3">
              {list.data.reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-muted-foreground">
              No reviews yet — be the first to review.
            </p>
          )}

          <ReviewForm productId={productId} />
        </>
      )}
    </section>
  )
}
