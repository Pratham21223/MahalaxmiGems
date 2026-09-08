import type { Price } from './types'

export function formatPrice(price: Price | null): string | null {
  if (!price) return null
  const amount = Number(price.amount)
  if (Number.isNaN(amount)) return null
  const value = amount.toLocaleString('en-IN')
  if (price.type === 'PER_CARAT') return `₹${value} / carat`
  return `₹${value}`
}
