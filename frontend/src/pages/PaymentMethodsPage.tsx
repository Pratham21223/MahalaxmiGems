import { Link } from 'react-router-dom'
import { CreditCard, MessageCircle } from 'lucide-react'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS, waLink } from '@/lib/businessInfo'

export function PaymentMethodsPage() {
  return (
    <InfoPage
      eyebrow="Policies"
      title="Payment Methods"
      metaTitle="Payment Methods | Mahalaxmi Gems"
      metaDescription="Ways to pay at Mahalaxmi Gems: UPI, credit and debit cards, netbanking, and wallets through Razorpay. No cash on delivery, no EMI, and no extra payment charges."
      path="/payment-methods"
      intro={
        <>
          Checkout is handled through Razorpay. The payment options available to you are shown at
          checkout before you pay.
        </>
      }
    >
      <InfoSection eyebrow="Accepted" title="Payment methods">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'UPI', desc: 'Pay using a UPI app or a UPI QR flow where available.' },
            { title: 'Credit & debit cards', desc: 'Visa, Mastercard, RuPay, and other supported cards.' },
            { title: 'Netbanking', desc: 'Pay from your bank account through supported banks.' },
            { title: 'Wallets', desc: 'Pay using wallets supported by the payment gateway.' },
          ].map((m) => (
            <div key={m.title} className="premium-card rounded-2xl p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CreditCard className="size-4 text-gold" aria-hidden="true" />
                {m.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
        <p>
          The exact options shown can vary based on your bank, device, and the payment gateway. If
          a method is unavailable for your order, another supported method can be used instead.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Not offered" title="Cash on delivery and EMI">
        <p>
          We do not currently offer cash on delivery (COD) or EMI options. Orders are paid online
          at checkout.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Charges" title="Payment charges">
        <p>
          We do not add extra charges for using a card, UPI, netbanking, or wallet at checkout. The
          amount you see in the order summary is the amount payable.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Security" title="Keeping your payment safe">
        <p>
          Payments are processed by Razorpay. We do not receive or store your full card number,
          CVV, UPI PIN, or banking passwords.
        </p>
        <InfoCallout>
          Never share your OTP, CVV, PIN, or full card details with anyone who contacts you
          claiming to represent the business. We will never ask for them.
        </InfoCallout>
      </InfoSection>

      <InfoSection eyebrow="Confirmation" title="When your payment is confirmed">
        <p>
          Your order is confirmed only after the payment is verified. If a payment fails or is
          interrupted, any stock reserved for your order is released, and you can try again.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Refunds" title="Refunds">
        <p>
          Refunds are made to the original payment method, in line with the{' '}
          <Link to="/return-exchange" className="focus-ring rounded font-medium text-gold underline">
            Return &amp; Exchange
          </Link>{' '}
          policy. Your bank or payment provider may take additional time to reflect the amount.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Support" title="Payment questions">
        <p>
          If you have a payment issue, contact us on{' '}
          <a href={waLink('Hi Mahalaxmi Gems! I have a payment question.')} target="_blank" rel="noreferrer" className="focus-ring rounded font-medium text-gold underline">
            <MessageCircle className="mr-1 inline size-4" aria-hidden="true" />
            WhatsApp
          </a>{' '}
          or email{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>
          . You can also check the{' '}
          <Link to="/faqs" className="focus-ring rounded font-medium text-gold underline">
            FAQs
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPage>
  )
}
