import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS } from '@/lib/businessInfo'

const INCLUDED = [
  'A protective packaging box',
  'Your gemstone or Rudraksha item',
  'An invoice for your order',
  'A product information card',
  'The laboratory report you selected at checkout, when one was requested',
]

export function PackagingPage() {
  return (
    <InfoPage
      eyebrow="Your order"
      title="Packaging & Insert"
      metaTitle="Packaging & Insert | Mahalaxmi Gems"
      metaDescription="How Mahalaxmi Gems packs and ships orders, what is included in the box, and what to check when your delivery arrives."
      path="/packaging"
      intro={
        <>
          Every order is packed to protect the item in transit and to make it easy to match what
          you receive against what you ordered.
        </>
      }
    >
      <InfoSection eyebrow="Packing" title="How your order is packed">
        <p>
          Gemstones are wrapped for protection and placed inside a packaging box with the order
          documents. Multiple items may be packed together unless they need separate protection.
        </p>
        <p>
          If a laboratory report was requested at checkout, the report is provided with the
          delivered package.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Contents" title="What's inside your package">
        <ul className="space-y-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          Packaging contents are kept simple and consistent. We do not include certificates or
          documents that were not part of your order.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Documents" title="Report, invoice, and product card">
        <p>
          The <strong className="font-medium text-foreground">invoice</strong> is your proof of
          purchase and lists what you paid. The{' '}
          <strong className="font-medium text-foreground">product information card</strong> helps
          you identify the item in your order.
        </p>
        <p>
          A <strong className="font-medium text-foreground">laboratory report</strong>, when
          requested at checkout, is an independent document issued by the laboratory you chose and
          describes what that laboratory identified. It is not the same as the seller invoice.
        </p>
      </InfoSection>

      <InfoSection eyebrow="On delivery" title="Receiving your package">
        <p>
          Where practical, check the outer packaging before opening. Once opened, confirm the item
          matches your order and keep the invoice and any laboratory report safely.
        </p>
        <InfoCallout>
          If your order arrives damaged, or you receive the wrong item, contact us within{' '}
          {BUSINESS.damageWindow} of delivery with photographs of the package and item. Please
          contact us before sending anything back. See the{' '}
          <Link to="/return-exchange" className="focus-ring rounded font-medium text-gold underline">
            Return &amp; Exchange
          </Link>{' '}
          page for the full process.
        </InfoCallout>
      </InfoSection>
    </InfoPage>
  )
}
