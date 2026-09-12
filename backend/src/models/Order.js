import crypto from 'node:crypto'
import mongoose from 'mongoose'

export const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]

// Allowed transitions per plan.txt §30. Anything else is rejected so we never
// accept an arbitrary/invalid state change.
const TRANSITIONS = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
}

const orderItemSchema = new mongoose.Schema(
  {
    // Historical snapshot — never rebuilt from live Product data (§29).
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    priceType: { type: String, enum: ['FIXED', 'PER_CARAT'], required: true },
    purchasedPrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    qty: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    // Non-guessable reference used in customer-facing URLs (BOLA hardening).
    reference: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    guestEmail: { type: String, trim: true, lowercase: true, default: '' },

    items: { type: [orderItemSchema], default: [] },

    subtotal: { type: Number, required: true },
    shippingAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    payment: {
      provider: { type: String, default: 'razorpay' },
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      method: { type: String, default: '' },
    },

    status: { type: String, enum: ORDER_STATUSES, default: 'PENDING_PAYMENT' },
    timeline: {
      type: [
        {
          status: { type: String, enum: ORDER_STATUSES },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
)

orderSchema.index({ user: 1 })
orderSchema.index({ guestId: 1 })
orderSchema.index({ status: 1 })

orderSchema.pre('validate', function preValidate() {
  if (!this.reference) this.reference = crypto.randomUUID()
  if (this.timeline.length === 0) {
    this.timeline = [{ status: this.status, at: new Date() }]
  }
})

orderSchema.methods.transitionTo = function transitionTo(nextStatus) {
  const allowed = TRANSITIONS[this.status] || []
  if (!allowed.includes(nextStatus)) {
    const err = new Error(`Invalid order transition ${this.status} -> ${nextStatus}`)
    err.status = 400
    throw err
  }
  this.status = nextStatus
  this.timeline.push({ status: nextStatus, at: new Date() })
  return this
}

export const Order = mongoose.model('Order', orderSchema)
export { TRANSITIONS as ORDER_TRANSITIONS }
