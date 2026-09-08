import { Types } from 'mongoose'
import { Product } from '../models/Product.js'
import { toPublicProduct } from '../utils/serialize.js'
import { escapeRegex } from '../utils/util.js'
import { getCategoryAndDescendantIds } from '../utils/categoryDescendants.js'

const SORT_MAP = {
  default: { createdAt: -1 },
  price_asc: { priceState: -1, 'pricing.amount': 1 },
  price_desc: { priceState: -1, 'pricing.amount': -1 },
  newest: { createdAt: -1 },
}

const FACET_FIELDS = ['origin', 'color', 'shape', 'treatment', 'cut', 'gemstoneType']

export async function listProducts(req, res) {
  const q = req.query
  const filter = { status: 'ACTIVE' }

  if (q.category) {
    const ids = await getCategoryAndDescendantIds(q.category)
    if (!ids.length) {
      return res.json({ items: [], total: 0, page: 1, limit: 12, totalPages: 0 })
    }
    filter.category = { $in: ids }
  }

  if (q.notCategory) {
    const excluded = await getCategoryAndDescendantIds(q.notCategory)
    if (excluded.length) {
      filter.category = { ...(filter.category || {}), $nin: excluded }
    }
  }

  for (const f of FACET_FIELDS) {
    if (q[f]) filter[f] = new RegExp(escapeRegex(q[f]), 'i')
  }

  if (q.minPrice || q.maxPrice) {
    filter.priceState = 'PUBLIC_PRICE'
    const price = {}
    if (q.minPrice) price.$gte = Number(q.minPrice)
    if (q.maxPrice) price.$lte = Number(q.maxPrice)
    filter['pricing.amount'] = price
  }

  if (q.minCarat || q.maxCarat) {
    const w = {}
    if (q.minCarat) w.$gte = Number(q.minCarat)
    if (q.maxCarat) w.$lte = Number(q.maxCarat)
    filter.weightCarat = w
  }

  const sort = SORT_MAP[q.sort] || SORT_MAP.default
  const page = Math.max(1, parseInt(q.page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(q.limit, 10) || 12))

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ])

  res.json({
    items: items.map(toPublicProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function getProductById(req, res) {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ error: 'Product not found' })
  }
  const p = await Product.findOne({ _id: req.params.id, status: 'ACTIVE' })
    .populate('category', 'name slug')
    .lean()
  if (!p) return res.status(404).json({ error: 'Product not found' })
  res.json(toPublicProduct(p))
}