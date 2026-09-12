import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env } from '../config/index.js'
import { logger } from '../config/logger.js'

// Razorpay client. Constructed lazily only when keys are configured so the
// catalog works without payment credentials.
let _client = null
export function razorpayClient() {
  if (!_client) {
    if (!env.razorpayKeyId || !env.razorpayKeySecret) {
      const err = new Error('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)')
      err.status = 503
      throw err
    }
    _client = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    })
  }
  return _client
}

function toProviderError(err) {
  // Razorpay SDK errors carry statusCode + error.description; never leak them
  // to clients, but log them and surface a safe, actionable message.
  const detail = err?.error?.description || err?.message || 'unknown'
  logger.error({ event: 'razorpay.api_error', statusCode: err?.statusCode, detail }, 'razorpay API error')
  if (err?.statusCode === 429) {
    const e = new Error('Too many payment attempts right now - please wait a few seconds and try again')
    e.status = 429
    e.expose = true
    return e
  }
  const e = new Error('Payment provider could not process this order, please try again')
  e.status = 502
  e.expose = true
  return e
}

// Razorpay rate-limits rapid `orders.create` calls (HTTP 429) and can return
// transient 5xx. Retry with backoff: order creation is safe to retry because it
// does not charge, and each attempt uses a fresh receipt.
async function createOrderWithRetry(rzp, payload, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await rzp.orders.create(payload)
    } catch (err) {
      const retryable = err?.statusCode === 429 || err?.statusCode >= 500 || !err?.statusCode
      if (!retryable || i === attempts - 1) throw err
      await new Promise((resolve) => setTimeout(resolve, 800 * (i + 1)))
    }
  }
}

// Create a Razorpay order. amount is in the smallest currency unit (paise).
export async function createRazorpayOrder({ amountPaise, currency = 'INR', receipt }) {
  const rzp = razorpayClient()
  try {
    const order = await createOrderWithRetry(rzp, {
      amount: amountPaise,
      currency,
      receipt,
      payment_capture: 1,
    })
    return order
  } catch (err) {
    throw toProviderError(err)
  }
}

// Verify a payment webhook payload against RAZORPAY_WEBHOOK_SECRET (HMAC-SHA256).
// Used by the authoritative webhook route — never trust a frontend callback.
export function verifyWebhookSignature(bodyRaw, signature) {
  if (!env.razorpayWebhookSecret) return false
  const expected = crypto
    .createHmac('sha256', env.razorpayWebhookSecret)
    .update(bodyRaw)
    .digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature || '', 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// Verify the standard Razorpay payment (order_id + payment_id + signature) that
// the checkout.js callback returns. Still server-verified (never trust client).
export function verifyPaymentSignature({ order_id, payment_id, signature }) {
  const secret = env.razorpayKeySecret
  if (!secret) return false
  const body = `${order_id}|${payment_id}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(signature || '', 'utf8')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

// Fetch payment details server-to-server from Razorpay (authoritative).
export async function fetchRazorpayPayment(paymentId) {
  try {
    return await razorpayClient().payments.fetch(paymentId)
  } catch (err) {
    throw toProviderError(err)
  }
}
