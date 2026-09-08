import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

export function ProductScroller({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  }

  useEffect(() => {
    if (paused || products.length <= 2) return
    const id = window.setInterval(() => {
      const el = ref.current
      if (!el) return
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      if (nearEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' })
    }, 3500)
    return () => window.clearInterval(id)
  }, [paused, products.length])

  if (!products || products.length === 0) return null

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="focus-ring absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-white p-2 text-primary shadow hover:bg-muted sm:block"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div ref={ref} className="flex snap-x gap-4 overflow-x-auto pb-4 scrollbar-none">
        {products.map((p) => (
          <div key={p.id} className="w-[72vw] max-w-64 shrink-0 snap-start sm:w-64">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="focus-ring absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-white p-2 text-primary shadow hover:bg-muted sm:block"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}
