import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'
import { CardGallery } from './CardGallery'
import { PriceDisplay } from './PriceDisplay'

export function ProductCard({ product }: { product: Product }) {
  const facts = [
    product.weightCarat ? `${product.weightCarat} ct` : '',
    product.origin || '',
    product.treatment || '',
  ].filter(Boolean)

  return (
    <article className="premium-card group flex h-full flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-card">
      <div className="relative overflow-hidden">
        <CardGallery key={product.id} product={product} />
        {product.isUnique && (
          <Badge className="absolute left-2 top-2 bg-gold text-primary">Unique piece</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.id}`} className="focus-ring rounded-md group-hover:text-primary/80">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground">{product.name}</h3>
        </Link>
        {facts.length > 0 && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{facts.join(' · ')}</p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3 text-sm">
          <PriceDisplay priceState={product.priceState} price={product.price} />
          <Link
            to={`/products/${product.id}`}
            className="focus-ring shrink-0 rounded-full border border-gold/40 px-3 py-1 text-xs font-medium text-primary transition hover:border-gold hover:bg-gold/10"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}
