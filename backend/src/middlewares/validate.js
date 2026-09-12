import { Types } from 'mongoose'

// validate: Zod-based allow-list validation (backend-principles.md). Runs the
// schema against the chosen request source and attaches cleaned data at
// res.locals.validated. Rejects malformed input with a generic 400.
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Invalid input'
      return res.status(400).json({ error: message })
    }
    res.locals.validated = result.data
    next()
  }
}

// Validates the review submission body and passes cleaned values via res.locals.
// The reviewer's name comes from the authenticated session (routes apply
// requireAuth), never from client input.
export function validateCreateReview(req, res, next) {
  const { product, rating, title, comment } = req.body || {}

  if (!Types.ObjectId.isValid(product)) {
    return res.status(400).json({ error: 'Valid product id is required' })
  }

  const cleanComment = String(comment || '').trim()
  const cleanTitle = String(title || '').trim()
  const numericRating = Number(rating)

  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5' })
  }
  if (!cleanComment || cleanComment.length > 2000) {
    return res.status(400).json({ error: 'A comment (max 2000 characters) is required' })
  }
  if (cleanTitle.length > 120) {
    return res.status(400).json({ error: 'Title must be 120 characters or fewer' })
  }

  res.locals.review = {
    product,
    rating: numericRating,
    title: cleanTitle,
    comment: cleanComment,
  }
  next()
}