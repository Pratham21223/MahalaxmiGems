import { BadgeCheck, Gem, Compass, MessageCircle } from 'lucide-react'

const ITEMS = [
  {
    icon: BadgeCheck,
    title: 'Certified & Documented',
    text: 'Certificate details are kept close to the product information when they are available.',
  },
  {
    icon: Gem,
    title: 'Stone Facts First',
    text: 'Weight, origin, treatment, shape, and color are surfaced for quick comparison.',
  },
  {
    icon: Compass,
    title: 'Expert Guidance',
    text: 'Browse with useful filters, then ask for help when a personal conversation matters.',
  },
  {
    icon: MessageCircle,
    title: 'Direct WhatsApp Access',
    text: 'Enquiry links include the product context so follow-up can start with the right stone.',
  },
]

export function WhyUs() {
  return (
    <section>
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Why Mahalaxmi Gems</p>
        <h2 className="mt-1 text-2xl font-semibold text-primary md:text-3xl">A clearer way to compare stones</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="premium-card group p-6 transition hover:-translate-y-1 hover:border-gold hover:shadow-card"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/5 text-gold ring-1 ring-primary/5 transition group-hover:bg-primary group-hover:text-gold">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-4 font-semibold text-primary">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
