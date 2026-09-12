import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Zap } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { apiErrorMessage } from '@/lib/errors'
import type { Product } from '@/lib/types'

export function AddToCartButton({ product, className = '' }: { product: Product; className?: string }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  if (product.priceState !== 'PUBLIC_PRICE' || product.inventory <= 0) return null

  const handle = async () => {
    setError('')
    try {
      await add(product.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    } catch (err) {
      setError(apiErrorMessage(err, 'Unable to add to cart'))
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handle}
        className={`focus-ring inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:-translate-y-0.5 hover:border-gold hover:text-gold ${className}`}
      >
        <ShoppingBag className="size-4" />
        {added ? 'Added to cart' : 'Add to Cart'}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  )
}

export function BuyNowButton({ product, className = '' }: { product: Product; className?: string }) {
  const navigate = useNavigate()

  if (product.priceState !== 'PUBLIC_PRICE' || product.inventory <= 0) return null

  return (
    <button
      type="button"
      onClick={() => navigate(`/checkout?buy=${encodeURIComponent(product.id)}&qty=1`)}
      className={`focus-ring inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 ${className}`}
    >
      <Zap className="size-4" />
      Buy Now
    </button>
  )
}