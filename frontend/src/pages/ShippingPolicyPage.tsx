import { Link } from 'react-router-dom'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS, waLink } from '@/lib/businessInfo'

export function ShippingPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policies"
      title="Shipping Policy"
      metaTitle="Shipping Policy | Mahalaxmi Gems"
      metaDescription="Mahalaxmi Gems shipping policy: free delivery across India, order processing, dispatch, delivery timelines, tracking, and what to do about delayed or damaged shipments."
      path="/shipping-policy"
      intro={
        <>
          We deliver across India. This page explains how an order moves from payment to delivery,
          and what to do if something goes wrong on the way.
        </>
      }
    >
      <InfoSection eyebrow="Overview" title="Shipping at a glance">
        <ul className="space-y-2">
          <li>Shipping is {BUSINESS.shippingCharge} across India.</li>
          <li>Orders are processed in {BUSINESS.processingTime} before dispatch.</li>
          <li>Delivery takes up to {BUSINESS.shippingDays} across India after dispatch.</li>
          <li>We currently ship within India only.</li>
        </ul>
      </InfoSection>

      <InfoSection eyebrow="Step 1" title="Order processing">
        <p>
          &ldquo;Processing&rdquo; is the time before your parcel leaves us. Once payment is
          confirmed, we prepare, check, and pack your order. Processing usually takes{' '}
          {BUSINESS.processingTime}.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Step 2" title="Dispatch and delivery">
        <p>
          &ldquo;Delivery&rdquo; is the time the parcel spends with the shipping partner after
          dispatch. Delivery can take up to {BUSINESS.shippingDays} depending on your location.
          Processing and delivery are separate steps; the two together make up the total time
          before your order reaches you.
        </p>
        <InfoCallout>
          If you requested a laboratory report at checkout and it needs additional time, we will
          contact you before dispatch.
        </InfoCallout>
      </InfoSection>

      <InfoSection eyebrow="Charges" title="Shipping charges">
        <p>
          Shipping is {BUSINESS.shippingCharge} for orders across India. There are no separate
          handling charges added at checkout.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Tracking" title="Tracking your order">
        <p>
          Once your order is dispatched, tracking details are shared so you can follow the
          delivery. If you do not receive tracking information, contact us with your order
          reference and we will check the status for you.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Address" title="Please check your address">
        <p>
          Enter a complete address with a correct PIN code and a reachable phone number. If you
          notice a mistake after ordering, contact us as early as possible. Once a parcel is
          dispatched, changing the address may not be possible.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Delays" title="Delayed shipments">
        <p>
          Delivery can occasionally take longer due to weather, regional disruptions, or shipping
          partner delays. If your order has not arrived within the expected window, contact us and
          we will follow up with the shipping partner.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Problems" title="Lost, damaged, or failed deliveries">
        <p>
          <strong className="font-medium text-foreground">Damaged parcel:</strong> report it within{' '}
          {BUSINESS.damageWindow} of delivery with photographs of the outer package and the item.
          Keep the packaging until we advise you. Please contact us before sending anything back.
        </p>
        <p>
          <strong className="font-medium text-foreground">Lost shipment:</strong> if tracking shows
          no movement or the parcel is declared lost, contact us and we will work with the shipping
          partner to resolve it.
        </p>
        <p>
          <strong className="font-medium text-foreground">Failed delivery:</strong> if delivery
          fails because no one is available or the address or phone number is incorrect, the
          shipping partner may attempt delivery again or return the parcel to us. Contact us and we
          will help arrange the next step.
        </p>
      </InfoSection>

      <InfoSection eyebrow="International" title="International shipping">
        <p>
          We currently do not offer international shipping. This page and our checkout cover
          delivery within India only.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Support" title="Contact us">
        <p>
          For any shipping question, message us on{' '}
          <a href={waLink('Hi Mahalaxmi Gems! I have a shipping question.')} target="_blank" rel="noreferrer" className="focus-ring rounded font-medium text-gold underline">
            WhatsApp
          </a>{' '}
          or email{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>
          . You can also read the{' '}
          <Link to="/return-exchange" className="focus-ring rounded font-medium text-gold underline">
            Return &amp; Exchange
          </Link>{' '}
          policy and the{' '}
          <Link to="/faqs" className="focus-ring rounded font-medium text-gold underline">
            FAQs
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPage>
  )
}
