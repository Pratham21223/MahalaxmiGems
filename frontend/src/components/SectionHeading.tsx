import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  eyebrow,
  title,
  action,
  center = false,
}: {
  eyebrow?: string
  title: string
  action?: { label: string; to: string }
  center?: boolean
}) {
  return (
    <div className={center ? 'mb-8 text-center' : 'mb-6 flex items-end justify-between gap-4'}>
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>}
        <h2 className="text-balance mt-1 text-2xl font-semibold text-primary md:text-3xl">{title}</h2>
      </div>
      {action && !center && (
        <Link to={action.to} className="focus-ring group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:border-gold hover:text-gold">
          {action.label}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
