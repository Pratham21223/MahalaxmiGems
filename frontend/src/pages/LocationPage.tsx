import { Clock, Mail, MessageCircle, Phone, ShoppingBag } from 'lucide-react'
import { InfoPage, InfoSection } from '@/components/InfoPage'
import { BUSINESS, waLink } from '@/lib/businessInfo'

const CONTACT_CARDS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: BUSINESS.phoneDisplay,
    href: waLink("Hi Mahalaxmi Gems! I'd like to ask about a gemstone."),
    external: true,
  },
  { icon: Phone, title: 'Phone', value: BUSINESS.phoneDisplay, href: BUSINESS.phoneHref, external: false },
  { icon: Mail, title: 'Email', value: BUSINESS.email, href: `mailto:${BUSINESS.email}`, external: false },
  { icon: Clock, title: 'Hours', value: `${BUSINESS.hours}, ${BUSINESS.hoursDays}`, href: '', external: false },
]

export function LocationPage() {
  return (
    <InfoPage
      eyebrow="Visit & contact"
      title="Our Location"
      metaTitle="Mahalaxmi Gems | Location & Visiting Information"
      metaDescription="Mahalaxmi Gems is an online gemstone store serving customers across India. Find our contact details, support hours, and how orders reach you."
      path="/location"
      intro={
        <>
          {BUSINESS.onlineOnly} You can reach us by WhatsApp, phone, or email, and we help with
          product questions before you order.
        </>
      }
    >
      <InfoSection eyebrow="Reach us" title="Contact details">
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTACT_CARDS.map(({ icon: Icon, title, value, href, external }) => {
            const inner = (
              <>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/15">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-primary">{title}</span>
                  <span className="block truncate text-sm text-muted-foreground">{value}</span>
                </span>
              </>
            )
            return href ? (
              <a
                key={title}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="focus-ring premium-card flex items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-gold"
              >
                {inner}
              </a>
            ) : (
              <div key={title} className="premium-card flex items-center gap-3 rounded-2xl p-4">
                {inner}
              </div>
            )
          })}
        </div>
      </InfoSection>

      <InfoSection eyebrow="Online store" title="How ordering works">
        <p>
          Browse the catalogue, open a product for full specifications, and buy online where a
          public price is shown. Products marked contact-for-price are handled through a direct
          enquiry instead, so we can confirm availability and pricing with you.
        </p>
        <p>
          Orders are delivered across India. See the{' '}
          <a href="/shipping-policy" className="focus-ring rounded font-medium text-gold underline">
            Shipping Policy
          </a>{' '}
          for processing and delivery details, and the{' '}
          <a href="/return-exchange" className="focus-ring rounded font-medium text-gold underline">
            Return &amp; Exchange
          </a>{' '}
          page for post-delivery support.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Before travelling" title="No public walk-in address">
        <p>
          We do not publish a physical store address, so please do not travel to any address you
          may find elsewhere under a similar name. All assistance happens through the contact
          channels above, and every order is delivered to the address you provide at checkout.
        </p>
        <a
          href={waLink("Hi Mahalaxmi Gems! I'd like to plan a purchase.")}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90"
        >
          <ShoppingBag className="size-4" /> Ask before you buy
        </a>
      </InfoSection>
    </InfoPage>
  )
}
