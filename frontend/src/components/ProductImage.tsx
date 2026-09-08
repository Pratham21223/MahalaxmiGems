import type { Product } from '@/lib/types'

// Distinct navy/gold gradient variants so placeholder "views" visibly change
// when sliding (front / side / close-up / certificate). Replaced by real photos.
const GRADIENTS = [
  'from-[#0b0342] to-[#1a1150]',
  'from-[#181052] to-[#2a1a66]',
  'from-[#2a1a66] to-[#181052]',
  'from-[#0f0a3a] to-[#241a52]',
]

export function PlaceholderView({
  label = '',
  index = 0,
  className = '',
  showText = true,
}: {
  label?: string
  index?: number
  className?: string
  showText?: boolean
}) {
  const gradient = GRADIENTS[((index % GRADIENTS.length) + GRADIENTS.length) % GRADIENTS.length]
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} text-white/70 ${className}`}
    >
      {showText && label && <span className="px-3 text-center text-sm font-medium">{label}</span>}
    </div>
  )
}

export function ProductImage({
  product,
  className = '',
  index = 0,
  showLabel = true,
}: {
  product: Product
  className?: string
  index?: number
  showLabel?: boolean
}) {
  const imgs = product.images || []
  const img = imgs[index] || imgs[0]
  if (img && img.url) {
    return <img src={img.url} alt={img.altText || product.name} className={className} />
  }
  const label = img ? img.altText : product.gemstoneType || product.name
  return <PlaceholderView label={label} index={index} className={className} showText={showLabel} />
}
