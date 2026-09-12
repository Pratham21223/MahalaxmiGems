import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { getReviews } from '@/lib/api'
import type { Review, ReviewSummary } from '@/lib/types'
import { Loading, ErrorState } from './Status'
import { Stars } from './Stars'
import { ReviewForm } from './ReviewForm'

const VISIBLE_REVIEWS = 3

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">{review.name}</span>
          {review.verified && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
              Verified
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Stars value={review.rating} />
          {review.createdAt && (
            <time className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</time>
          )}
        </div>
      </div>
      {review.title && <h4 className="mt-2 text-sm font-medium text-foreground">{review.title}</h4>}
      <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
    </article>
  )
}

export function ReviewSection({ productId }: { productId: string }) {
  const list = useFetch<ReviewSummary>(() => getReviews(productId), [productId])
  const [showForm, setShowForm] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const reviews = list.data?.reviews || []
  const count = list.data?.count || 0
  const average = list.data?.average || 0
  const visible = showAll ? reviews : reviews.slice(0, VISIBLE_REVIEWS)
  const hasReviews = count > 0 || reviews.length > 0
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    total: reviews.filter((r) => r.rating === rating).length,
  }))

  const writeButton = (
    <button
      type="button"
      onClick={() => setShowForm((open) => !open)}
      className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:-translate-y-0.5 hover:border-gold hover:text-gold"
    >
      {showForm ? 'Close' : 'Write a review'}
    </button>
  )

  return (
    <section className="space-y-4">
      {hasReviews && (
        <div className="flex flex-wrap items-end justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Feedback</p>
              <h2 className="mt-1 text-2xl font-semibold text-primary">Customer Reviews</h2>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center">
                <span className="block text-4xl font-semibold leading-none text-primary">
                  {average ? average.toFixed(1) : '—'}
                </span>
                <Stars value={average} className="mt-1.5 justify-center" />
                <span className="mt-1.5 block text-xs text-muted-foreground">
                  {count} review{count === 1 ? '' : 's'}
                </span>
              </div>
              <div className="w-40 space-y-1.5">
                {distribution.map(({ rating, total }) => (
                  <div key={rating} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-3 shrink-0 text-right">{rating}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${reviews.length ? Math.round((total / reviews.length) * 100) : 0}%` }}
                      />
                    </div>
                    <span className="w-4 shrink-0 tabular-nums">{total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {writeButton}
        </div>
      )}

      {!hasReviews && !list.loading && !list.error && (
        <div className="flex justify-end">{writeButton}</div>
      )}

      {showForm && <ReviewForm productId={productId} onSubmitted={list.refetch} />}

      {list.loading ? (
        <Loading label="Loading reviews…" />
      ) : list.error ? (
        <ErrorState message="Could not load reviews." onRetry={list.refetch} />
      ) : hasReviews ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {visible.map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </div>
          {reviews.length > VISIBLE_REVIEWS && (
            <button
              type="button"
              onClick={() => setShowAll((all) => !all)}
              className="focus-ring rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:border-gold hover:text-gold"
            >
              {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </div>
      ) : null}
    </section>
  )
}
