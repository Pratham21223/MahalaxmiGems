import { Types } from 'mongoose'
import { Review } from '../models/Review.js'
import { Product } from '../models/Product.js'
import { publicReview } from '../utils/serialize.js'

export async function listReviews(req, res) {
  const productId = String(req.query.product || '')
  if (!Types.ObjectId.isValid(productId)) {
    return res.json({ reviews: [], average: 0, count: 0 })
  }

  const filter = { product: new Types.ObjectId(productId), status: 'APPROVED' }
  const [reviews, aggregate] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).limit(50).lean(),
    Review.aggregate([
      { $match: filter },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
  ])

  const summary = aggregate[0]
  res.json({
    reviews: reviews.map(publicReview),
    average: summary ? Math.round(summary.avg * 10) / 10 : 0,
    count: summary ? summary.count : 0,
  })
}

export async function createReview(req, res) {
  const { product, name, rating, title, comment } = res.locals.review

  const prod = await Product.findOne({ _id: product, status: 'ACTIVE' }).select('_id').lean()
  if (!prod) return res.status(404).json({ error: 'Product not found' })

  const review = await Review.create({ product, name, rating, title, comment })

  const aggregate = await Review.aggregate([
    { $match: { product: new Types.ObjectId(product), status: 'APPROVED' } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  const summary = aggregate[0]

  res.status(201).json({
    review: publicReview(review.toObject()),
    average: summary ? Math.round(summary.avg * 10) / 10 : rating,
    count: summary ? summary.count : 1,
  })
}