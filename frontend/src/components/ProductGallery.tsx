import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { PlaceholderView } from './ProductImage'

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images || []
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <PlaceholderView
        label={product.gemstoneType || product.name}
        index={0}
        className="aspect-square w-full rounded-2xl border border-slate-100 shadow-card"
      />
    )
  }

  const current = images[index]
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  return (
    <div>
      <div className="relative">
        {current.url ? (
          <img
            src={current.url}
            alt={current.altText || product.name}
            className="aspect-square w-full rounded-2xl border border-slate-100 object-cover shadow-card"
          />
        ) : (
          <PlaceholderView
            label={current.altText || product.name}
            index={index}
            className="aspect-square w-full rounded-2xl border border-slate-100 shadow-card"
          />
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="focus-ring absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-primary shadow hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-primary shadow hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`focus-ring h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === index ? 'border-gold' : 'border-transparent opacity-70'
              }`}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.altText || `${product.name} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PlaceholderView index={i} className="h-full w-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
