import { Link } from 'react-router-dom'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS, waLink } from '@/lib/businessInfo'

export function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Policies"
      title="Privacy Policy"
      metaTitle="Privacy Policy | Mahalaxmi Gems"
      metaDescription="How Mahalaxmi Gems collects, uses, shares, and protects personal information for orders, accounts, reviews, and enquiries."
      path="/privacy-policy"
      intro={
        <>
          This policy explains what information {BUSINESS.name} collects when you use this website,
          why we collect it, who it is shared with, and the choices you have. It describes our
          actual practices in plain language. Last updated: 12 September 2026.
        </>
      }
    >
      <InfoSection eyebrow="Who we are" title="About this policy">
        <p>
          {BUSINESS.name} is an online gemstone and Rudraksha store serving customers across India.
          For the personal data described here, we act as the party that decides why and how it is
          processed. You can reach us about anything on this page at{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection eyebrow="Collection" title="Information we collect">
        <ul className="space-y-2">
          <li>
            <strong className="font-medium text-foreground">Account:</strong> your name, email
            address, and password. Passwords are stored only as a secure hash and are never kept in
            plain text.
          </li>
          <li>
            <strong className="font-medium text-foreground">Orders:</strong> name, email, phone
            number, and shipping address, along with the items you ordered and payment references
            returned by the payment gateway.
          </li>
          <li>
            <strong className="font-medium text-foreground">Cart and wishlist:</strong> the
            products you save. Your cart works even without an account.
          </li>
          <li>
            <strong className="font-medium text-foreground">Reviews:</strong> the name shown on
            your account, your rating, and the review text you submit.
          </li>
          <li>
            <strong className="font-medium text-foreground">Enquiries:</strong> the details you
            enter in the contact form (name, email, optional phone, subject, and message).
          </li>
          <li>
            <strong className="font-medium text-foreground">Technical data:</strong> a session
            cookie, and standard server logs such as request time and error information used to
            operate and secure the site.
          </li>
        </ul>
      </InfoSection>

      <InfoSection eyebrow="Purpose" title="How we use your information">
        <ul className="space-y-2">
          <li>To process, pack, and deliver your order.</li>
          <li>To take payment and process refunds through the payment gateway.</li>
          <li>To provide customer support and respond to your enquiries.</li>
          <li>To publish reviews you choose to submit.</li>
          <li>To keep the website working and protect it against misuse or fraud.</li>
          <li>To meet accounting, tax, and legal record-keeping requirements.</li>
        </ul>
        <p>
          We do not use your data for advertising, profiling, or automated decision-making, and we
          do not sell your personal information.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Cookies" title="Cookies">
        <p>
          We use a session cookie to keep you signed in and to remember your cart between visits.
          It is set as an HttpOnly cookie, which means scripts on the page cannot read it. We do
          not use analytics, advertising, or tracking cookies.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Sharing" title="Who we share information with">
        <ul className="space-y-2">
          <li>
            <strong className="font-medium text-foreground">Razorpay</strong> processes online
            payments. Payment card details are handled by the gateway and are not stored by us.
          </li>
          <li>
            <strong className="font-medium text-foreground">Our shipping partner</strong> receives
            the delivery name, address, and phone number needed to deliver your order.
          </li>
          <li>
            <strong className="font-medium text-foreground">The laboratory you select</strong> at
            checkout receives the order details necessary to process the requested report, where a
            laboratory report is requested.
          </li>
          <li>
            <strong className="font-medium text-foreground">Database and hosting providers</strong>{' '}
            store the site data on our behalf under our instructions.
          </li>
          <li>
            <strong className="font-medium text-foreground">Google Fonts</strong> serves the fonts
            used on this website; as with any web request, the provider can see the request
            information needed to deliver the files.
          </li>
        </ul>
        <p>
          We may also disclose information where required by law or to protect the rights and
          safety of customers, the public, or the business.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Marketing" title="Marketing messages">
        <p>
          We do not send marketing or promotional messages, and we do not sell or rent your contact
          details to anyone. We contact you only about your account, an order, or an enquiry you
          have sent us.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Retention" title="How long we keep information">
        <ul className="space-y-2">
          <li>
            Order and invoice records are kept for as long as applicable tax and accounting rules
            require.
          </li>
          <li>
            Account details are kept while your account is active. If you ask us to delete your
            account, we remove or anonymise your details except where we must keep records by law.
          </li>
          <li>
            Contact enquiries are kept only as long as needed to resolve them and for a reasonable
            follow-up period.
          </li>
        </ul>
      </InfoSection>

      <InfoSection eyebrow="Security" title="How we protect information">
        <p>
          We use reasonable technical and organisational safeguards, including hashed passwords,
          HttpOnly session cookies, and restricted access to order data. No method of storage or
          transmission is completely secure, so we cannot promise absolute security.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Your choices" title="Access, correction, and deletion">
        <p>
          You can ask us to access, correct, or delete the personal information we hold about you,
          or withdraw consent for a use described in this policy. Email{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>{' '}
          with your request. Some records, such as invoices, may need to be retained as required by
          law even after a request.
        </p>
        <InfoCallout>
          Grievance Officer, {BUSINESS.name} —{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>
          . We aim to respond to privacy requests and complaints within a reasonable time.
        </InfoCallout>
      </InfoSection>

      <InfoSection eyebrow="Children" title="Children">
        <p>
          This website is intended for adults. We do not knowingly collect personal information
          from children. If you believe a child has provided us with personal information, contact
          us and we will remove it.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Updates" title="Changes to this policy">
        <p>
          If our data practices change, we will update this page and revise the date at the top.
          Material changes will be highlighted on this page so you can review them.
        </p>
      </InfoSection>

      <InfoSection eyebrow="Contact" title="Questions">
        <p>
          For any question about this policy, message us on{' '}
          <a href={waLink('Hi Mahalaxmi Gems! I have a privacy question.')} target="_blank" rel="noreferrer" className="focus-ring rounded font-medium text-gold underline">
            WhatsApp
          </a>{' '}
          or email{' '}
          <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
            {BUSINESS.email}
          </a>
          . See also our{' '}
          <Link to="/payment-methods" className="focus-ring rounded font-medium text-gold underline">
            Payment Methods
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
