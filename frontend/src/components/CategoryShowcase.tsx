import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Gem } from 'lucide-react'
import { GEMSTONE_COLUMNS } from '@/lib/nav'

interface ShowcaseItem {
  label: string
  slug: string
  route: string
}

const NAVRATNA_ITEMS: ShowcaseItem[] = [
  ...GEMSTONE_COLUMNS[0].items.map((item) => ({
    label: item.label.replace(/\s+\(.+\)$/, ''),
    slug: item.slug,
    route: `/categories/${item.slug}`,
  })),
  {
    label: 'Rudraksha',
    slug: 'rudraksha',
    route: '/rudraksha',
  },
]

function useAutoIndex(length: number, intervalMs = 3600) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const safeIndex = length > 0 ? activeIndex % length : 0

  useEffect(() => {
    if (length <= 1 || paused) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs, length, paused])

  return { activeIndex: safeIndex, setPaused }
}

export function HeroCategoryShowcase() {
  const { activeIndex, setPaused } = useAutoIndex(NAVRATNA_ITEMS.length)
  const visibleItems = Array.from({ length: 4 }, (_, offset) => {
    const itemIndex = (activeIndex + offset) % NAVRATNA_ITEMS.length
    return NAVRATNA_ITEMS[itemIndex]
  })

  return (
    <div
      className="premium-panel relative overflow-hidden rounded-2xl p-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid grid-cols-2 gap-3">
        {visibleItems.map((item, index) => (
          <Link
            key={`${item.slug}-${activeIndex}`}
            to={item.route}
            className="focus-ring group relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[var(--ease-premium)] motion-safe:animate-[showcase-card-in_420ms_var(--ease-premium)_both] hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_18px_45px_rgba(5,0,64,0.12)]"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(201,162,75,0.16),transparent_34%),linear-gradient(135deg,rgba(250,248,242,0.88),rgba(255,255,255,0.96)_54%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            />
            <span className="relative flex items-start justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border border-gold/15 bg-primary/5 text-gold shadow-sm transition duration-300 group-hover:scale-105 group-hover:border-gold/30 group-hover:bg-primary">
                <Gem className="size-5 transition duration-300 group-hover:rotate-6" aria-hidden="true" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-full border border-slate-100 bg-white/90 text-primary opacity-0 shadow-sm transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </span>
            <span className="relative">
              <span className="block text-base font-semibold leading-5 text-primary transition duration-300">
                {item.label}
              </span>
              <span className="mt-2 inline-flex rounded-full border border-slate-100 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition duration-300 group-hover:border-gold/20 group-hover:text-primary">
                {item.slug === 'rudraksha' ? 'Mukhi varieties' : 'Stone details'}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
