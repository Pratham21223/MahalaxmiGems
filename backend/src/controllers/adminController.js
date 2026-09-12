import { Types } from 'mongoose'
import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { validate } from '../middlewares/validate.js'
import { categorySchema, productSchema, orderStatusSchema } from '../schemas.js'
import { releaseInventory } from '../utils/inventory.js'

export const validateCategory = validate(categorySchema)
export const validateProduct = validate(productSchema)
export const validateOrderStatus = validate(orderStatusSchema)

function categoryDoc(c) {
  return { ...c, id: c._id }
}

// ---- Categories ------------------------------------------------------------

export async function adminListCategories(_req, res) {
  const cats = await Category.find().sort({ order: 1, name: 1 }).lean()
  res.json({ items: cats.map(categoryDoc) })
}

export async function adminCreateCategory(req, res) {
  const data = res.locals.validated
  let parent = null
  if (data.parent) {
    const p = await Category.findById(data.parent).lean()
    if (!p) return res.status(400).json({ error: 'Parent category not found' })
    parent = p._id
  }
  const exists = await Category.findOne({ slug: data.slug }).lean()
  if (exists) return res.status(409).json({ error: 'A category with this slug already exists' })
  const cat = await Category.create({ ...data, parent })
  res.status(201).json({ item: categoryDoc(cat.toObject()) })
}

export async function adminUpdateCategory(req, res) {
  const data = res.locals.validated
  const cat = await Category.findById(req.params.id)
  if (!cat) return res.status(404).json({ error: 'Category not found' })
  if (data.parent) {
    const p = await Category.findById(data.parent).lean()
    if (!p) return res.status(400).json({ error: 'Parent category not found' })
    cat.parent = p._id
  } else if ('parent' in data) {
    cat.parent = null
  }
  cat.name = data.name
  cat.slug = data.slug
  cat.description = data.description
  cat.seoTitle = data.seoTitle
  cat.seoDescription = data.seoDescription
  cat.active = data.active
  cat.order = data.order
  await cat.save()
  res.json({ item: categoryDoc(cat.toObject()) })
}

export async function adminDeleteCategory(req, res) {
  const cat = await Category.findByIdAndDelete(req.params.id)
  if (!cat) return res.status(404).json({ error: 'Category not found' })
  await Product.updateMany({ category: req.params.id }, { $set: { status: 'ARCHIVED' } })
  res.status(204).end()
}

// ---- Products --------------------------------------------------------------

export async function adminListProducts(req, res) {
  const { status, q, page = 1, limit = 20 } = req.query
  const filter = {}
  if (status) filter.status = status
  if (q) {
    const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { sku: rx }]
  }
  const p = Math.max(1, parseInt(page, 10) || 1)
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .populate('category', 'name slug')
      .lean(),
    Product.countDocuments(filter),
  ])
  res.json({ items, total, page: p, limit: l, totalPages: Math.ceil(total / l) })
}

export async function adminGetProduct(req, res) {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').lean()
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json({ item: product })
}

export async function adminCreateProduct(req, res) {
  const data = res.locals.validated
  if (!Types.ObjectId.isValid(data.category)) {
    return res.status(400).json({ error: 'Valid category is required' })
  }
  const cat = await Category.findById(data.category)
  if (!cat) return res.status(400).json({ error: 'Category not found' })
  const exists = await Product.findOne({ $or: [{ sku: data.sku }, { slug: data.slug }] }).lean()
  if (exists) return res.status(409).json({ error: 'A product with this SKU or slug already exists' })
  const product = await Product.create(toProductData(data))
  res.status(201).json({ item: product })
}

export async function adminUpdateProduct(req, res) {
  const data = res.locals.validated
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  Object.assign(product, toProductData(data))
  await product.save()
  res.json({ item: product })
}

export async function adminDeleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.status(204).end()
}

function toProductData(d) {
  const { pricingType, priceAmount, currency, ...rest } = d
  return {
    ...rest,
    pricing: { type: pricingType, amount: priceAmount, currency },
  }
}

// ---- Orders ----------------------------------------------------------------

export async function adminListOrders(req, res) {
  const { status, page = 1, limit = 20 } = req.query
  const filter = {}
  if (status) filter.status = status
  const p = Math.max(1, parseInt(page, 10) || 1)
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
    Order.countDocuments(filter),
  ])
  res.json({ items, total, page: p, limit: l, totalPages: Math.ceil(total / l) })
}

export async function adminGetOrder(req, res) {
  const order = await Order.findOne({ reference: req.params.reference }).lean()
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json({ item: order })
}

export async function adminUpdateOrderStatus(req, res) {
  const order = await Order.findOne({ reference: req.params.reference })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const { status } = res.locals.validated
  if (status === 'CANCELLED' && order.status === 'PENDING_PAYMENT') {
    order.transitionTo('CANCELLED')
    await order.save()
    await releaseInventory(order.items.map((i) => ({ product: { _id: i.product }, qty: i.qty })))
    return res.json({ item: order })
  }
  order.transitionTo(status)
  await order.save()
  res.json({ item: order })
}
