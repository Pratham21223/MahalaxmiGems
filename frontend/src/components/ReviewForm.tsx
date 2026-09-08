import { useState } from 'react'
import { createReview } from '@/lib/api'
import { Stars } from './Stars'

const NAME_MAX = 80
const TITLE_MAX = 120
const COMMENT_MAX = 2000

export function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const reset = () => {
    setName('')
    setRating(0)
    setTitle('')
    setComment('')
    setError('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter your name.')
    if (!rating) return setError('Please select a rating.')
    if (!comment.trim()) return setError('Please write a review.')

    setSubmitting(true)
    try {
      await createReview({ product: productId, name: name.trim(), rating, title: title.trim(), comment: comment.trim() })
      reset()
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="premium-panel space-y-4 p-5">
      <h3 className="font-semibold text-primary">Write a review</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className="mb-1 block text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="review-name"
            type="text"
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10"
          />
        </div>
        <div>
          <span className="mb-1 block text-sm font-medium text-foreground">Rating</span>
          <div className="flex h-10 items-center">
            <Stars value={rating} onChange={setRating} />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="mb-1 block text-sm font-medium text-foreground">
          Title <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10"
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-1 block text-sm font-medium text-foreground">
          Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          maxLength={COMMENT_MAX}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this gemstone…"
          rows={4}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10"
        />
      </div>

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
