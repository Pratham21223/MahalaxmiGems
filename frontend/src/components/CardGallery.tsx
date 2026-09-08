import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { viewLabel } from '@/lib/images'
import { ProductImage } from './ProductImage'

// Mini image gallery for product cards: slideable 3–4 views with prev/next
// buttons and dot indicators. Arrows/dots never navigate — only the image does.
// Keyed by product.id by the parent so index resets per product.
export function CardGallery({ product }: { product: Product }) {
  const images = product.images || []
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const hoverTimer = useRef<number | null>(null)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  const productHref = `/products/${product.id}`
  const current = images[index]
  const label = viewLabel(current?.altText)

  const stopLoop = () => {
    if (!hoverTimer.current) return
    window.clearInterval(hoverTimer.current)
    hoverTimer.current = null
  }

  const startLoop = () => {
    if (images.length <= 1 || hoverTimer.current) return
    hoverTimer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 950)
  }

  useEffect(
    () => () => {
      if (hoverTimer.current) window.clearInterval(hoverTimer.current)
    },
    [],
  )

  if (images.length === 0) {
    return (
      <Link to={productHref} aria-label={product.name} className="block">
        <ProductImage product={product} index={0} showLabel={false} className="aspect-square w-full object-cover" />
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={startLoop}
      onMouseLeave={stopLoop}
      onFocus={startLoop}
      onBlur={stopLoop}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
        touchX.current = null
      }}
    >
      <Link to={productHref} aria-label={product.name} className="block">
        <ProductImage
          product={product}
          index={index}
          showLabel={false}
          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      {images.length > 1 && label && (
        <span className="pointer-events-none absolute left-2 bottom-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/90">
          {label}
        </span>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/90 p-1.5 text-primary opacity-0 shadow transition hover:bg-white focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-white/90 p-1.5 text-primary opacity-0 shadow transition hover:bg-white focus:opacity-100 group-hover:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`size-1.5 rounded-full transition ${
                i === index ? 'w-4 bg-gold' : 'bg-white/80 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
