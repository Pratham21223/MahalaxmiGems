import { Product } from '../models/Product.js'
import { effectiveUnitPrice } from './pricing.js'

// Atomically reserve inventory for a set of items, preventing overselling
// unique stones (plan.txt §16, §49). Returns per-item pricing snapshots.
// On any shortfall it releases what was already reserved and throws.
export async function reserveInventory(items) {
  const reserved = []
  try {
    for (const { productId, qty } of items) {
      const product = await Product.findOneAndUpdate(
        { _id: productId, status: 'ACTIVE', inventory: { $gte: qty } },
        { $inc: { inventory: -qty } },
        { returnDocument: 'after' },
      ).lean()
      if (!product) {
        const name = await Product.findById(productId).select('name').lean()
        const err = new Error(
          name ? `${name.name} is no longer available or out of stock` : 'A product is no longer available or out of stock',
        )
        err.status = 409
        throw err
      }
      if (product.priceState !== 'PUBLIC_PRICE') {
        const err = new Error(`${product.name} is contact-for-price and cannot be ordered`)
        err.status = 400
        throw err
      }
      const unitPrice = effectiveUnitPrice(product)
      if (unitPrice == null) {
        const err = new Error(`${product.name} has no purchasable price`)
        err.status = 400
        throw err
      }
      const lineTotal = Math.round(unitPrice * qty * 100) / 100
      reserved.push({ product, qty, unitPrice, lineTotal })
    }
    return reserved
  } catch (err) {
    await releaseInventory(reserved)
    throw err
  }
}

// Restore reserved inventory (payment failed, cancelled, or expired).
export async function releaseInventory(reserved) {
  for (const { product, qty } of reserved) {
    await Product.updateOne({ _id: product._id }, { $inc: { inventory: qty } })
  }
}
