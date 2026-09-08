import { BadgeCheck, Gem, MessageCircle } from 'lucide-react'

const ITEMS = [
  { icon: BadgeCheck, title: 'Certificate Details', desc: 'Report information appears clearly when it is available.' },
  { icon: Gem, title: 'Clear Stone Facts', desc: 'Weight, origin, treatment, shape, and color are easy to compare.' },
  { icon: MessageCircle, title: 'Direct Assistance', desc: 'Ask about availability or price from the product you are viewing.' },
]

export function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="page-shell grid grid-cols-1 gap-3 py-5 sm:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="premium-card flex min-h-24 items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/15">
              <Icon className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-primary">{title}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
