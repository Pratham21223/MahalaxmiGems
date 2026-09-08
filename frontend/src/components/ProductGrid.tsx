import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
