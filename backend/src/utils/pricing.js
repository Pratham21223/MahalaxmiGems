// Authoritative price calculation. The frontend never determines payable
// amounts — only these functions (and the DB records) decide price/total.
export function effectiveUnitPrice(product) {
  if (product.priceState !== 'PUBLIC_PRICE') return null
  if (!product.pricing) return null
  if (product.pricing.type === 'PER_CARAT') {
    return product.pricing.amount * (product.weightCarat || 0)
  }
  return product.pricing.amount
}

export function toPaise(rupees) {
  return Math.round(Number(rupees) * 100)
}
