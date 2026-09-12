import mongoose from 'mongoose'

// A cart belongs to exactly one owner: a logged-in User OR an anonymous guest
// (identified by a guestId stored in the session cookie). Prices, subtotals and
// totals are always recomputed server-side from the current Product documents —
// the frontend never supplies monetary values (plan.txt §25, backend-principles).
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false },
)

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true },
)

cartSchema.index({ user: 1 })
cartSchema.index({ guestId: 1 })

export const Cart = mongoose.model('Cart', cartSchema)
