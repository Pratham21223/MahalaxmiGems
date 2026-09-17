import crypto from 'node:crypto'
import { Order } from '../models/Order.js'
import { Cart } from '../models/Cart.js'
import { resolveCartOwner } from '../utils/cart.js'
import { reserveInventory, releaseInventory } from '../utils/inventory.js'
import { toPaise } from '../utils/pricing.js'
import {
  createRazorpayOrder,
  verifyWebhookSignature,
  verifyPaymentSignature,
  fetchRazorpayPayment,
} from '../services/razorpay.js'
import { validate } from '../middlewares/validate.js'
import { checkoutSchema } from '../schemas.js'
import { getLab } from '../config/labReports.js'
import { env } from '../config/index.js'
import { logger } from '../config/logger.js'

export const validateCheckout = validate(checkoutSchema)

// Abandoned checkouts must not lock inventory forever. PENDING_PAYMENT orders
// older than the reservation window are cancelled and their stock released.
export const RESERVATION_WINDOW_MS = 15 * 60 * 1000

export async function expireStalePendingOrders() {
  const cutoff = new Date(Date.now() - RESERVATION_WINDOW_MS)
  const stale = await Order.find({ status: 'PENDING_PAYMENT', createdAt: { $lt: cutoff } })
  for (const order of stale) {
    try {
      order.transitionTo('CANCELLED')
      await order.save()
      await releaseInventory(order.items.map((i) => ({ product: { _id: i.product }, qty: i.qty })))
    } catch (e) {
      logger.warn({ err: e.message, reference: order.reference }, 'expiry failed for stale order')
    }
  }
  return stale.length
}

function toOrderPublic(o) {
  return {
    reference: o.reference,
    status: o.status,
    timeline: o.timeline,
    items: o.items,
    subtotal: o.subtotal,
    shippingAmount: o.shippingAmount,
    total: o.total,
    currency: o.currency,
    shippingAddress: o.shippingAddress,
    labReport: o.labReport || { lab: '', label: '', fee: 0, status: 'NONE' },
    payment: {
      provider: o.payment?.provider,
      razorpayOrderId: o.payment?.razorpayOrderId,
      method: o.payment?.method || '',
    },
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  }
}

async function orderItemsFromRequest(req, res) {
  const owner = resolveCartOwner(req)
  const { items: explicit, shippingAddress } = res.locals.validated

  if (explicit && explicit.length > 0) {
    return {
      items: explicit.map((i) => ({ productId: i.productId, qty: i.qty })),
      owner,
      guestEmail: shippingAddress.email,
    }
  }

  const cart = await Cart.findOne(
    owner.kind === 'user' ? { user: owner.id } : { guestId: owner.id },
  )
  const cartItems = (cart?.items || []).map((i) => ({ productId: String(i.product), qty: i.qty }))
  return { items: cartItems, owner, guestEmail: shippingAddress.email }
}

export async function createCheckout(req, res) {
  const { shippingAddress, labReport } = res.locals.validated
  const { items, owner } = await orderItemsFromRequest(req, res)

  if (!items.length) {
    return res.status(400).json({ error: 'Your cart is empty' })
  }

  // Free any expired reservations before creating a new one. Best-effort — a
  // failure here must never block the checkout.
  try {
    await expireStalePendingOrders()
  } catch (e) {
    logger.warn({ err: e.message }, 'expiry sweep failed')
  }

  const reserved = await reserveInventory(items)
  let order
  let rzpOrder
  try {
    const subtotal = Math.round(reserved.reduce((s, r) => s + r.lineTotal, 0) * 100) / 100
    const total = subtotal

    // Create the Razorpay order first so a payment failure never leaves a
    // stray DB order behind.
    rzpOrder = await createRazorpayOrder({
      amountPaise: toPaise(total),
      currency: 'INR',
      receipt: `mg-${crypto.randomUUID().slice(0, 12)}`,
    })

    order = await Order.create({
      user: owner.kind === 'user' ? owner.id : null,
      guestId: owner.kind === 'guest' ? owner.id : null,
      guestEmail: owner.kind === 'guest' ? shippingAddress.email : '',
      items: reserved.map((r) => ({
        product: r.product._id,
        sku: r.product.sku,
        name: r.product.name,
        priceType: r.product.pricing.type,
        purchasedPrice: r.unitPrice,
        currency: r.product.pricing.currency || 'INR',
        qty: r.qty,
        itemTotal: r.lineTotal,
      })),
      subtotal,
      shippingAmount: 0,
      total,
      currency: 'INR',
      shippingAddress,
      ...(labReport
        ? {
            labReport: {
              lab: labReport.lab,
              label: getLab(labReport.lab)?.label || labReport.lab,
              fee: getLab(labReport.lab)?.fee || 0,
              status: 'REQUESTED',
            },
          }
        : {}),
    })
    order.payment.razorpayOrderId = rzpOrder.id
    await order.save()

    res.status(201).json({
      order: toOrderPublic(order),
      payment: {
        key: env.razorpayKeyId,
        orderId: rzpOrder.id,
        amount: toPaise(total),
        currency: 'INR',
      },
    })
  } catch (err) {
    // Payment gateway failure: release reserved inventory.
    await releaseInventory(reserved)
    throw err
  }
}

// Server-verified payment confirmation (used after Razorpay checkout completes).
// We still validate the signature and re-fetch from Razorpay rather than
// trusting the frontend callback alone (plan.txt §28).
export async function confirmPayment(req, res) {
  const { order_id, payment_id, signature } = req.body || {}
  if (!order_id || !payment_id || !signature) {
    return res.status(400).json({ error: 'Missing payment details' })
  }

  const order = await Order.findOne({ reference: req.params.reference })
  if (!order || order.payment.razorpayOrderId !== order_id) {
    return res.status(404).json({ error: 'Order not found' })
  }
  assertOrderOwner(req, order)

  if (!verifyPaymentSignature({ order_id, payment_id, signature })) {
    return res.status(400).json({ error: 'Payment signature verification failed' })
  }

  const payment = await fetchRazorpayPayment(payment_id)
  if (payment.status === 'captured') {
    if (order.status === 'PENDING_PAYMENT') {
      order.payment.razorpayPaymentId = payment_id
      order.payment.method = payment.method || ''
      order.transitionTo('PAID')
      await order.save()
      await removeOrderedItemsFromCart(order)
    }
  } else {
    if (order.status === 'PENDING_PAYMENT') {
      order.transitionTo('CANCELLED')
      await order.save()
      await releaseInventory(
        order.items.map((i) => ({ product: { _id: i.product }, qty: i.qty })),
      )
    }
  }
  res.json({ order: toOrderPublic(order) })
}

// Authoritative Razorpay webhook. Mounted with a raw body parser.
export async function handleWebhook(req, res) {
  const raw = req.body
  const signature = req.headers['x-razorpay-signature']
  if (!verifyWebhookSignature(raw, signature)) {
    logger.warn({ event: 'payment.webhook_bad_signature' }, 'rejected webhook')
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const payload = JSON.parse(Buffer.isBuffer(raw) ? raw.toString('utf8') : raw)
  const event = payload.event
  const entity = payload.payload?.payment?.entity
  if (!entity?.order_id) {
    return res.status(200).json({ received: true })
  }

  const order = await Order.findOne({ 'payment.razorpayOrderId': entity.order_id })
  if (!order || order.status !== 'PENDING_PAYMENT') {
    return res.status(200).json({ received: true })
  }

  if (event === 'payment.captured') {
    order.payment.razorpayPaymentId = entity.id
    order.payment.method = entity.method || ''
    order.transitionTo('PAID')
    await order.save()
    await removeOrderedItemsFromCart(order)
  } else if (event === 'payment.failed') {
    order.transitionTo('CANCELLED')
    await order.save()
    await releaseInventory(order.items.map((i) => ({ product: { _id: i.product }, qty: i.qty })))
  }

  res.status(200).json({ received: true })
}

function assertOrderOwner(req, order) {
  if (req.user && order.user && String(order.user) === String(req.user._id)) return
  if (!req.user && order.guestId && order.guestId === req.session.guestId) return
  const err = new Error('Order not found')
  err.status = 404
  throw err
}

// Once an order is PAID, remove its items from the owner's cart so the sold
// stones aren't offered again (their stock is now reserved for this order).
async function removeOrderedItemsFromCart(order) {
  const productIds = order.items.map((i) => i.product)
  if (order.user) {
    await Cart.updateOne({ user: order.user }, { $pull: { items: { product: { $in: productIds } } } })
  } else if (order.guestId) {
    await Cart.updateOne({ guestId: order.guestId }, { $pull: { items: { product: { $in: productIds } } } })
  }
}

export async function getOrder(req, res) {
  await expireStalePendingOrders()
  const order = await Order.findOne({ reference: req.params.reference })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  assertOrderOwner(req, order)
  res.json({ order: toOrderPublic(order) })
}

export async function listMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean()
  res.json({ orders: orders.map(toOrderPublic) })
}

export async function cancelOrder(req, res) {
  const order = await Order.findOne({ reference: req.params.reference })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  assertOrderOwner(req, order)
  if (order.status !== 'PENDING_PAYMENT') {
    return res.status(400).json({ error: 'Only pending orders can be cancelled' })
  }
  order.transitionTo('CANCELLED')
  await order.save()
  await releaseInventory(order.items.map((i) => ({ product: { _id: i.product }, qty: i.qty })))
  res.json({ order: toOrderPublic(order) })
}
