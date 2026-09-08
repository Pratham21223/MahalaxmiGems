import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Gem, MessageCircle, ShieldCheck } from 'lucide-react'
import { HeroCategoryShowcase } from '@/components/CategoryShowcase'

const TRUST = [
  { icon: BadgeCheck, label: 'Certificate details' },
  { icon: ShieldCheck, label: 'Clear pricing' },
  { icon: MessageCircle, label: 'Personal assistance' },
]

export function Hero() {
  return (
    <section className="bg-grid relative w-full overflow-hidden border-b bg-surface-soft text-primary">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-20 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-gold">
            <Gem className="size-4" aria-hidden="true" />
            Mahalaxmi Gems
          </div>

          <h1 className="text-balance mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            Certified natural <span className="text-gold">gemstones</span> for confident buying
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Browse natural gemstone and Rudraksha selections with clear specifications,
            certificate details where available, and easy enquiry when you need personal guidance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/gemstones"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/15 transition hover:bg-primary/90"
            >
              Browse gemstones <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/rudraksha"
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/15 bg-white px-7 py-3 font-medium text-primary transition hover:border-gold hover:bg-white"
            >
              Explore Rudraksha
            </Link>
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-gold" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroCategoryShowcase />
      </div>
    </section>
  )
}
