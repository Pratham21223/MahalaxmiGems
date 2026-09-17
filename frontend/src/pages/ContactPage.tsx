import { Clock, Mail, MessageCircle, Phone } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'
import { JsonLd } from '@/components/JsonLd'
import { usePageMeta } from '@/hooks/usePageMeta'
import { BUSINESS, waLink } from '@/lib/businessInfo'

const CHANNELS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: BUSINESS.phoneDisplay,
    desc: 'Quickest for product questions and photos.',
    href: waLink("Hi Mahalaxmi Gems! I'd like some help with a gemstone."),
    external: true,
  },
  {
    icon: Phone,
    title: 'Phone',
    value: BUSINESS.phoneDisplay,
    desc: `Available ${BUSINESS.hours}, ${BUSINESS.hoursDays}.`,
    href: BUSINESS.phoneHref,
    external: false,
  },
  {
    icon: Mail,
    title: 'Email',
    value: BUSINESS.email,
    desc: 'Best for order details, documents, and follow-ups.',
    href: `mailto:${BUSINESS.email}`,
    external: false,
  },
  {
    icon: Clock,
    title: 'Hours',
    value: `${BUSINESS.hours}`,
    desc: `${BUSINESS.hoursDays.charAt(0).toUpperCase()}${BUSINESS.hoursDays.slice(1)}.`,
    href: '',
    external: false,
  },
]

export function ContactPage() {
  usePageMeta({
    title: 'Contact Mahalaxmi Gems | Gemstone Enquiries',
    description:
      'Contact Mahalaxmi Gems by WhatsApp, phone, email, or the enquiry form for help choosing a gemstone, understanding a product detail, or checking an order.',
    path: '/contact',
  })

  return (
    <div className="page-shell section-stack py-6">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Mahalaxmi Gems',
          url: `${window.location.origin}/contact`,
        }}
      />

      <section className="premium-panel mx-auto max-w-3xl rounded-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Get in touch</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
          Need help choosing a gemstone, understanding a product detail, or checking an order?
          Reach us on WhatsApp, phone, or email, or send a message using the form below.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map(({ icon: Icon, title, value, desc, href, external }) => {
          const inner = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/15">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-primary">{title}</span>
                <span className="block truncate text-sm text-foreground">{value}</span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{desc}</span>
              </span>
            </>
          )
          return href ? (
            <a
              key={title}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="focus-ring premium-card flex items-start gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-gold"
            >
              {inner}
            </a>
          ) : (
            <div key={title} className="premium-card flex items-start gap-3 rounded-2xl p-4">
              {inner}
            </div>
          )
        })}
      </div>

      <div className="mx-auto max-w-3xl">
        <ContactForm />
      </div>
    </div>
  )
}
