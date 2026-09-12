import crypto from 'node:crypto'
import { Types } from 'mongoose'
import { Cart } from '../models/Cart.js'
import { effectiveUnitPrice } from './pricing.js'

// Resolve which owner this request's cart belongs to. Logged-in users get a
// user cart; anonymous guests get a persistent guestId stored in the session.
export function resolveCartOwner(req) {
  if (req.user) {
    return { kind: 'user', id: req.user._id }
  }
  if (!req.session.guestId) {
    req.session.guestId = crypto.randomUUID()
  }
  return { kind: 'guest', id: req.session.guestId }
}

function ownerQuery(owner) {
  return owner.kind === 'user' ? { user: owner.id } : { guestId: owner.id }
}

export async function getCart(owner) {
  let cart = await Cart.findOne(ownerQuery(owner))
  if (!cart) {
    cart = await Cart.create(
      owner.kind === 'user' ? { user: owner.id, items: [] } : { guestId: owner.id, items: [] },
    )
  }
  return cart
}

// Recompute the cart from current Product docs. Non-purchasable items (inactive
// or contact-for-price) are excluded; totals are always authoritative.
export async function computeCart(cart) {
  const items = await Cart.aggregate([
    { $match: { _id: cart._id } },
    { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
  ])

  const rows = []
  let subtotal = 0
  let count = 0

  for (const row of items) {
    const p = row.product
    if (!p || p.status !== 'ACTIVE' || p.priceState !== 'PUBLIC_PRICE') continue
    const unitPrice = effectiveUnitPrice(p)
    if (unitPrice == null) continue
    const qty = Math.min(row.items.qty, p.inventory)
    if (qty <= 0) continue
    const lineTotal = Math.round(unitPrice * qty * 100) / 100
    subtotal += lineTotal
    count += qty
    rows.push({
      productId: String(p._id),
      sku: p.sku,
      name: p.name,
      qty,
      unitPrice,
      lineTotal,
      currency: p.pricing.currency || 'INR',
      inventory: p.inventory,
      isUnique: p.isUnique,
      image: (p.images && p.images[0]) || null,
    })
  }

  return {
    items: rows,
    count,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingAmount: 0,
    total: Math.round(subtotal * 100) / 100,
    currency: rows[0]?.currency || 'INR',
  }
}

export async function addToCart(owner, productId, qty) {
  if (!Types.ObjectId.isValid(productId)) {
    const err = new Error('Invalid product')
    err.status = 400
    throw err
  }
  const { Product } = await import('../models/Product.js')
  const product = await Product.findOne({ _id: productId, status: 'ACTIVE' })
  if (!product) {
    const err = new Error('Product not found')
    err.status = 404
    throw err
  }
  if (product.priceState !== 'PUBLIC_PRICE') {
    const err = new Error('This product cannot be added to cart')
    err.status = 400
    throw err
  }
  const requestedQty = Number(qty)
  if (!Number.isInteger(requestedQty) || requestedQty < 1) {
    const err = new Error('Quantity must be a positive whole number')
    err.status = 400
    throw err
  }
  if (product.isUnique && requestedQty > 1) {
    const err = new Error('Unique stones are limited to 1 per order')
    err.status = 400
    throw err
  }
  if (requestedQty > product.inventory) {
    const err = new Error('Not enough stock available')
    err.status = 400
    throw err
  }

  const cart = await getCart(owner)
  const existing = cart.items.find((i) => String(i.product) === String(productId))
  if (existing) {
    existing.qty = Math.min(existing.qty + requestedQty, product.inventory)
  } else {
    cart.items.push({ product: productId, qty: requestedQty })
  }
  await cart.save()
  return computeCart(cart)
}

export async function updateCartItem(owner, productId, qty) {
  const cart = await getCart(owner)
  const existing = cart.items.find((i) => String(i.product) === String(productId))
  if (!existing) {
    const err = new Error('Item not in cart')
    err.status = 404
    throw err
  }
  const nextQty = Number(qty)
  if (nextQty <= 0) {
    cart.items = cart.items.filter((i) => String(i.product) !== String(productId))
  } else {
    const { Product } = await import('../models/Product.js')
    const product = await Product.findById(productId)
    if (product && nextQty > product.inventory) {
      const err = new Error('Not enough stock available')
      err.status = 400
      throw err
    }
    existing.qty = nextQty
  }
  await cart.save()
  return computeCart(cart)
}

export async function removeFromCart(owner, productId) {
  const cart = await getCart(owner)
  cart.items = cart.items.filter((i) => String(i.product) !== String(productId))
  await cart.save()
  return computeCart(cart)
}

export async function clearCart(owner) {
  const cart = await getCart(owner)
  cart.items = []
  await cart.save()
  return cart
}

// Merge a guest cart into a user cart on login; the guest cart is removed.
export async function mergeGuestCartIntoUser(guestId, userId) {
  const [guestCart, userCart] = await Promise.all([
    Cart.findOne({ guestId }),
    Cart.findOne({ user: userId }),
  ])
  if (!guestCart || guestCart.items.length === 0) return
  const target = userCart || (await Cart.create({ user: userId, items: [] }))
  for (const item of guestCart.items) {
    const existing = target.items.find((i) => String(i.product) === String(item.product))
    if (existing) {
      existing.qty += item.qty
    } else {
      target.items.push({ product: item.product, qty: item.qty })
    }
  }
  await target.save()
  await Cart.deleteOne({ _id: guestCart._id })
}
