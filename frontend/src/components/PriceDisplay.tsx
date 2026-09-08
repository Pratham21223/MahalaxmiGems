import { formatPrice } from '@/lib/format'
import type { Price } from '@/lib/types'

export function PriceDisplay({
  priceState,
  price,
  className = '',
}: {
  priceState: 'PUBLIC_PRICE' | 'CONTACT_FOR_PRICE'
  price: Price | null
  className?: string
}) {
  if (priceState === 'PUBLIC_PRICE') {
    return <span className={`font-semibold text-primary ${className}`}>{formatPrice(price) || 'Price unavailable'}</span>
  }
  return <span className={`font-medium text-muted-foreground ${className}`}>Contact for price</span>
}
