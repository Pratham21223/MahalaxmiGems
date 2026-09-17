import { Link } from 'react-router-dom'
import { ArrowRight, Gem, MessageCircle, ShieldCheck } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { usePageMeta } from '@/hooks/usePageMeta'
import { BUSINESS } from '@/lib/businessInfo'

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: 'Clear product information',
    text: 'Each product page shows the details we have for that stone, so you can compare before you decide.',
  },
  {
    icon: Gem,
    title: 'Honest description',
    text: 'We describe gemstone identity, treatment, and weight in plain language, and we do not present tradition as fact.',
  },
  {
    icon: MessageCircle,
    title: 'Guidance when you need it',
    text: 'If something is unclear, contact us and we will explain what we know about the item before you buy.',
  },
]

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  )
}

export function AboutPage() {
  usePageMeta({
    title: 'About Mahalaxmi Gems | Natural Gemstones & Rudraksha',
    description:
      'Mahalaxmi Gems has served customers since the 1980s. Learn how we describe natural gemstones and Rudraksha, and how we help you buy with confidence.',
    path: '/about',
  })

  return (
    <div className="page-shell section-stack py-6">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: BUSINESS.name,
            url: window.location.origin,
            email: BUSINESS.email,
            telephone: BUSINESS.phoneE164,
            description:
              'Online store for natural gemstones and Rudraksha, serving customers across India since the 1980s.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About Us',
                item: `${window.location.origin}/about`,
              },
            ],
          },
        ]}
      />

      <section className="premium-panel mx-auto max-w-3xl rounded-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Our story</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">About Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Mahalaxmi Gems has been serving customers since {BUSINESS.sincePhrase}. We are a family
          gemstone business, now selling online, with a simple aim: present natural gemstones and
          Rudraksha clearly so you can buy with confidence.
        </p>
      </section>

      <div className="mx-auto max-w-3xl space-y-12">
        <Section eyebrow="Who we are" title="A family business, now online">
          <p>
            We started serving customers in {BUSINESS.sincePhrase} and continue to work as a family
            business. Today the store operates online and delivers across India, while the way we
            work stays the same: talk to customers directly, explain each stone honestly, and
            answer questions before a purchase.
          </p>
          <p>
            We keep our selection focused rather than vast, so each item can be described properly
            on its product page.
          </p>
        </Section>

        <Section eyebrow="What we sell" title="Natural gemstones and Rudraksha">
          <p>
            Our catalogue covers natural gemstones across the major varieties and traditions,
            together with Rudraksha. Availability changes as stones are added and sold, so the
            catalogue itself is the current list of what is available.
          </p>
          <p>
            Every product page lists the specifications we hold for that item, such as gemstone
            type, weight, origin, treatment, colour, shape, clarity, cut, and dimensions. If a
            detail is not listed, it is not confirmed for that stone.
          </p>
        </Section>

        <Section eyebrow="How we describe stones" title="Facts before opinion">
          <p>
            Gemstone purchases depend on more than a name and a weight. Two stones of the same
            variety can differ in colour, clarity, cut, treatment, and origin, and those
            differences affect how a stone looks and how it should be cared for. We describe each
            item using the information we have and avoid blanket claims.
          </p>
          <p>
            Where a laboratory report has been requested, it is an independent document issued by
            the laboratory the customer selected. We do not describe ordinary seller documents as
            laboratory reports.
          </p>
        </Section>

        <div className="grid gap-3 sm:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="premium-card rounded-2xl p-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/15">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-primary">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <Section eyebrow="Transparency" title="A note on appearance">
          <p>
            Gemstone appearance can vary with lighting, screen settings, and photography, and
            natural stones have characteristics that photographs may not fully capture. Please
            read the specifications on the product page and ask us if you would like more detail
            about a particular stone before purchasing.
          </p>
        </Section>

        <Section eyebrow="Next step" title="Browse or ask">
          <p>
            Explore the catalogue, read the{' '}
            <Link to="/gemstone-buying-guide" className="focus-ring rounded font-medium text-gold underline">
              Gemstone Buying Guide
            </Link>
            , or contact us with any question. We are happy to help you compare.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/gemstones"
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Explore gemstones <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 font-medium text-primary transition hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              Contact us
            </Link>
          </div>
        </Section>
      </div>
    </div>
  )
}
