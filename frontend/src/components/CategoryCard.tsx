import { Link } from 'react-router-dom'
import { Gem, ArrowRight } from 'lucide-react'
import type { Category } from '@/lib/types'

export function CategoryCard({ category }: { category: Category }) {
  const children = category.children || []
  let subtitle = 'Explore collection'
  if (category.slug === 'rudraksha' && children.length > 0) {
    subtitle = `${children.length} varieties`
  } else if (children.length > 0) {
    subtitle = children.map((c) => c.name).join(' · ')
  }

  const href = category.slug === 'rudraksha' ? '/rudraksha' : `/categories/${category.slug}`

  return (
    <Link
      to={href}
      className="premium-card focus-ring group relative flex min-h-28 items-center gap-4 overflow-hidden rounded-xl p-5 transition duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-xl"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold/0 transition-colors group-hover:bg-gold" />
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/5 text-gold transition group-hover:bg-primary group-hover:text-gold">
        <Gem className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-foreground">{category.name}</h3>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-gold" />
    </Link>
  )
}
