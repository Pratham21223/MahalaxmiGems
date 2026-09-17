import { Link } from 'react-router-dom'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS, waLink } from '@/lib/businessInfo'

const FLOW = [
  'Your order is delivered.',
  'Inspect the item and keep the packaging.',
  'Check whether your reason is covered by this policy.',
  'Contact us within the return window to raise a request.',
  'We review the request and confirm return instructions.',
  'Send the item back only after we confirm the return.',
  'We inspect the item after it reaches us.',
  'If approved, the refund or exchange is processed.',
]

export function ReturnExchangePage() {
  return (
    <InfoPage
      eyebrow="Policies"
      title="Return & Exchange"
      metaTitle="Return & Exchange Policy | Mahalaxmi Gems"
      metaDescription="Mahalaxmi Gems return and exchange policy: 7-day window, eligibility, condition requirements, refund method and timeline, cancellations, and damaged or wrong items."
      path="/return-exchange"
      intro={
        <>
          We want you to be confident about your purchase. If something is not right, this page
          explains what is eligible, how to request a return or exchange, and how refunds work.
        </>
      }
    >
      <InfoSection eyebrow="Window" title="Return and exchange window">
        <p>
          Raise a return or exchange request within {BUSINESS.returnWindow} of delivery. Requests
          raised after this window may not be accepted.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Eligibility" title="What can be returned">
        <ul className="space-y-2">
          <li>The item must be unused and in the condition you received it.</li>
          <li>Original packaging, invoice, and any product card must be included.</li>
          <li>Any laboratory report issued with the order must be returned with the item.</li>
          <li>The request must be raised within {BUSINESS.returnWindow} of delivery.</li>
        </ul>
        <p>
          Items that show signs of use, damage from misuse, or missing documents may not be
          eligible.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Exclusions" title="What is not eligible">
        <ul className="space-y-2">
          <li>Custom or made-to-order items.</li>
          <li>Items returned without the invoice or, where issued, the laboratory report.</li>
          <li>Items damaged after delivery through use, mishandling, or improper storage.</li>
          <li>Requests raised after the {BUSINESS.returnWindow} window.</li>
        </ul>
      </InfoSection>

      <InfoSection eyebrow="Process" title="How to request a return or exchange">
        <InfoCallout>
          Please contact us before sending anything back. Do not ship an item to an address that
          has not been confirmed by our team.
        </InfoCallout>
        <ol className="list-decimal space-y-2 pl-5">
          {FLOW.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </InfoSection>

      <InfoSection eyebrow="Refunds" title="How refunds are processed">
        <p>
          Approved refunds are made to the original payment method used at checkout. After the
          returned item reaches us and passes inspection, refunds are typically processed within{' '}
          {BUSINESS.refundTimeline}. Your bank or payment provider may take additional time to
          reflect the amount.
        </p>
        <p>
          Shipping deductions may apply: if shipping was provided free and you return an item for
          a reason other than our error or a damaged or wrong item, the actual return shipping
          cost and payment-gateway charges may be deducted from the refund.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Exchange" title="Exchanges">
        <p>
          If you would prefer an exchange, contact us within the same {BUSINESS.returnWindow}{' '}
          window. Exchanges depend on availability of a replacement item, and any price difference
          is settled before the replacement is dispatched.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Cancellation" title="Order cancellation">
        <p>
          You can request cancellation before your order is dispatched. Once an order has been
          dispatched, the return process above applies instead. To cancel, contact us with your
          order reference as soon as possible.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Problems" title="Damaged, defective, or wrong item">
        <p>
          If your order arrives damaged, defective, or different from what you ordered, contact us
          within {BUSINESS.damageWindow} of delivery with photographs of the package and item. Do
          not use the item. We will arrange a replacement or refund once we review the issue.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Support" title="Start a request">
        <p>
          Message us on{' '}
          <a href={waLink('Hi Mahalaxmi Gems! I would like help with a return or exchange.')} target="_blank" rel="noreferrer" className="focus-ring rounded font-medium text-gold underline">
            WhatsApp
          </a>{' '}
          or email{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>{' '}
          with your order reference and a short description. See also the{' '}
          <Link to="/shipping-policy" className="focus-ring rounded font-medium text-gold underline">
            Shipping Policy
          </Link>{' '}
          and{' '}
          <Link to="/faqs" className="focus-ring rounded font-medium text-gold underline">
            FAQs
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPage>
  )
}
