import { Types } from 'mongoose'

// Validates the review submission body and passes cleaned values via res.locals.
export function validateCreateReview(req, res, next) {
  const { product, name, rating, title, comment } = req.body || {}

  if (!Types.ObjectId.isValid(product)) {
    return res.status(400).json({ error: 'Valid product id is required' })
  }

  const cleanName = String(name || '').trim()
  const cleanComment = String(comment || '').trim()
  const cleanTitle = String(title || '').trim()
  const numericRating = Number(rating)

  if (!cleanName || cleanName.length > 80) {
    return res.status(400).json({ error: 'A name (max 80 characters) is required' })
  }
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
    name: cleanName,
    rating: numericRating,
    title: cleanTitle,
    comment: cleanComment,
  }
  next()
}