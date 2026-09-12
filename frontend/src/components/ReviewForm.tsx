import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createReview } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { apiErrorMessage } from '@/lib/errors'
import { Stars } from './Stars'

const TITLE_MAX = 120
const COMMENT_MAX = 2000

export function ReviewForm({
  productId,
  onSubmitted,
}: {
  productId: string
  onSubmitted?: () => void
}) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-muted-foreground">
        <Link
          to={`/login?redirect=${encodeURIComponent(`/products/${productId}`)}`}
          className="focus-ring font-medium text-gold underline"
        >
          Sign in
        </Link>{' '}
        to write a review.
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!rating) return setError('Please select a rating.')
    if (!comment.trim()) return setError('Please write a review.')

    setSubmitting(true)
    try {
      await createReview({ product: productId, rating, title: title.trim(), comment: comment.trim() })
      setRating(0)
      setTitle('')
      setComment('')
      setSuccess(true)
      onSubmitted?.()
    } catch (err) {
      setError(apiErrorMessage(err, 'Something went wrong. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-100 bg-surface-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Your rating</span>
          <Stars value={rating} onChange={setRating} />
        </div>
        <span className="text-xs text-muted-foreground">Reviewing as {user.name}</span>
      </div>

      <input
        type="text"
        value={title}
        maxLength={TITLE_MAX}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (optional)"
        aria-label="Review title (optional)"
        className="focus-ring h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10"
      />

      <textarea
        value={comment}
        maxLength={COMMENT_MAX}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this gemstone…"
        aria-label="Your review"
        rows={3}
        className="focus-ring w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm font-medium text-emerald-600">
          Thank you! Your review has been published.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  )
}
