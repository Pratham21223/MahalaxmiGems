export function toPublicProduct(p) {
  const showPrice = p.priceState === 'PUBLIC_PRICE'
  return {
    id: p._id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    category: p.category,
    gemstoneType: p.gemstoneType,
    origin: p.origin,
    treatment: p.treatment,
    weightCarat: p.weightCarat,
    weightRatti: p.weightRatti,
    color: p.color,
    shape: p.shape,
    clarity: p.clarity,
    cut: p.cut,
    dimensions: p.dimensions,
    priceState: p.priceState,
    price: showPrice
      ? { type: p.pricing.type, amount: p.pricing.amount, currency: p.pricing.currency }
      : null,
    inventory: p.inventory,
    isUnique: p.isUnique,
    images: p.images,
    description: p.description,
    createdAt: p.createdAt,
  }
}

export function publicReview(r) {
  return {
    id: r._id,
    name: r.name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    verified: r.verified,
    createdAt: r.createdAt,
  }
}