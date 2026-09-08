import { Product } from '../models/Product.js'
import { Category } from '../models/Category.js'
import { toPublicProduct } from '../utils/serialize.js'
import { escapeRegex } from '../utils/util.js'
import { getCategoryAndDescendantIds } from '../utils/categoryDescendants.js'

const ALIASES = {
  pukhraj: 'yellow sapphire',
  panna: 'emerald',
  manik: 'ruby',
  neelam: 'blue sapphire',
  gomed: 'hessonite',
  lehsunia: "cat's eye",
}

export async function search(req, res) {
  const raw = (req.query.q || '').trim()
  const categorySlug = (req.query.category || '').trim()

  if (!raw && !categorySlug) return res.json({ items: [], total: 0 })

  const filter = { status: 'ACTIVE' }

  if (categorySlug) {
    const ids = await getCategoryAndDescendantIds(categorySlug)
    if (!ids.length) return res.json({ items: [], total: 0 })
    filter.category = { $in: ids }
  }

  if (raw) {
    const term = ALIASES[raw.toLowerCase()] || raw
    const rx = new RegExp(escapeRegex(term), 'i')
    const matchingCats = await Category.find({ name: rx, active: true }).select('_id').lean()
    const catIds = matchingCats.map((c) => c._id)
    const or = [{ name: rx }, { gemstoneType: rx }, { sku: rx }, { origin: rx }]
    if (catIds.length) or.push({ category: { $in: catIds } })
    filter.$or = or
  }

  const items = await Product.find(filter).sort({ createdAt: -1 }).limit(50).lean()

  res.json({ items: items.map(toPublicProduct), total: items.length })
}

export async function suggest(req, res) {
  const raw = (req.query.q || '').trim()
  const limit = Math.min(8, Math.max(1, parseInt(req.query.limit, 10) || 6))
  if (!raw) return res.json({ products: [], categories: [] })

  const term = ALIASES[raw.toLowerCase()] || raw
  const rx = new RegExp(escapeRegex(term), 'i')

  const matchingCats = await Category.find({ name: rx, active: true })
    .select('name slug _id')
    .limit(5)
    .lean()
  const catIds = matchingCats.map((c) => c._id)

  const or = [{ name: rx }, { gemstoneType: rx }, { sku: rx }, { origin: rx }]
  if (catIds.length) or.push({ category: { $in: catIds } })

  const products = await Product.find({ status: 'ACTIVE', $or: or })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category', 'name slug')
    .lean()

  res.json({
    products: products.map((p) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      gemstoneType: p.gemstoneType,
      category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
      priceState: p.priceState,
      price:
        p.priceState === 'PUBLIC_PRICE'
          ? { type: p.pricing.type, amount: p.pricing.amount, currency: p.pricing.currency }
          : null,
      image:
        p.images && p.images.length
          ? { url: p.images[0].url, altText: p.images[0].altText }
          : null,
    })),
    categories: matchingCats.map((c) => ({ name: c.name, slug: c.slug })),
  })
}