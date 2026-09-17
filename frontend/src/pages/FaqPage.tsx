import { Link } from 'react-router-dom'
import { InfoPage } from '@/components/InfoPage'
import { FaqAccordion } from '@/components/FaqAccordion'
import { JsonLd } from '@/components/JsonLd'
import { BUSINESS, waLink } from '@/lib/businessInfo'

interface FaqGroup {
  title: string
  items: { q: string; a: string }[]
}

const GROUPS: FaqGroup[] = [
  {
    title: 'Gemstone basics',
    items: [
      {
        q: 'What is a natural gemstone?',
        a: 'A natural gemstone is material formed by natural geological processes and then cut or polished for use in jewellery or collecting. Gemstones are identified by their material and properties, not by colour alone.',
      },
      {
        q: 'What is the difference between natural and laboratory-grown gemstones?',
        a: 'Natural gemstones form in the earth. Laboratory-grown gemstones are man-made materials with essentially the same relevant chemical and physical properties as the natural material, and they are sold under that description. They are not the same product as a natural stone.',
      },
      {
        q: 'What is an imitation gemstone?',
        a: 'An imitation, or simulant, is material used to imitate the appearance of another gemstone without being that gemstone. Imitation material should always be described as imitation and not passed off as the natural stone.',
      },
      {
        q: 'Why do natural gemstones have inclusions?',
        a: 'Inclusions are internal features that formed while the stone grew. They are normal in natural gemstones, can help identify the material, and do not by themselves mean a stone is fake or low quality. Clarity expectations differ from one gemstone species to another.',
      },
      {
        q: 'Why can two gemstones with the same name have very different prices?',
        a: 'Because colour, clarity, cut, carat weight, treatment, and origin can all differ. A name alone does not tell you quality, so compare the actual specifications and, where relevant, a laboratory report rather than the name and weight alone.',
      },
    ],
  },
  {
    title: 'Treatments',
    items: [
      {
        q: 'What does a treated gemstone mean?',
        a: 'A treatment is a process used to change or improve a gemstone’s appearance or durability, such as heating, filling, or oiling. Treatment is common in the gem trade and is not a defect by itself.',
      },
      {
        q: 'Does treatment mean the gemstone is fake?',
        a: 'No. Many natural gemstones are treated. What matters is that the treatment is disclosed so you understand what you are buying and how to care for it. Treatment can affect appearance, durability, and value.',
      },
      {
        q: 'Which treatments should I ask about?',
        a: 'Ask about heating, fracture filling, oiling or clarity enhancement, diffusion, dyeing, and irradiation where relevant to the stone you are considering. We describe treatments in the product specifications where we hold that information.',
      },
      {
        q: 'Does treatment affect how I care for a gemstone?',
        a: 'Yes. Some treated or included stones need gentler handling, may not be suitable for ultrasonic cleaning, and should be kept away from chemicals or prolonged heat. Ask us about care for the specific item you are considering.',
      },
    ],
  },
  {
    title: 'Laboratory reports',
    items: [
      {
        q: 'What is a gemstone laboratory report?',
        a: 'A laboratory report is a document issued by a gem-testing laboratory describing what that laboratory identified about a stone, based on its own testing and reporting methods. It is not a valuation and it is not the same as a seller invoice.',
      },
      {
        q: 'What does a laboratory report usually contain?',
        a: 'Depending on the laboratory, a report can include the gemstone species and variety, whether the material is natural or laboratory-grown, weight, measurements, shape or cut, colour, treatment comments, and a photograph. Origin may be stated when the laboratory can determine it.',
      },
      {
        q: 'Does a report prove a gemstone’s value?',
        a: 'No. A report describes characteristics identified by the laboratory; it is not a price guarantee or a valuation. Value depends on the market, the specific stone, and other factors.',
      },
      {
        q: 'Can I request a laboratory report?',
        a: 'Yes. At checkout you can choose a laboratory for your order, and where a report is requested it is provided with your delivered order. If the report needs additional time, we will contact you before dispatch.',
      },
    ],
  },
  {
    title: 'Product details',
    items: [
      {
        q: 'What should I check before buying?',
        a: 'Compare the gemstone type, weight, measurements, treatment, colour, clarity, cut, and price basis. Read the product page fully and ask us if any detail you need is not shown.',
      },
      {
        q: 'What does contact-for-price mean?',
        a: 'Some items are sold by enquiry instead of a public price. Use the WhatsApp or contact option on that product page; contact-for-price items do not have an Add to Cart button.',
      },
      {
        q: 'Why does a product photo look different from the stone in person?',
        a: 'Lighting, screen settings, and photography affect appearance, and every natural stone is unique. Use the specifications and measurements as your reference, and ask us for more detail if you would like it before purchasing.',
      },
      {
        q: 'What happens if an item sells out?',
        a: 'Availability is shown on the product page. Unique stones are limited to one, and if stock runs out while you are ordering, checkout will not let the item proceed so you are not charged for something unavailable.',
      },
    ],
  },
  {
    title: 'Weight: carat and ratti',
    items: [
      {
        q: 'What is carat weight?',
        a: 'Carat is the standard unit used to weigh gemstones. One carat equals 0.2 grams. Carat is a measure of weight, not of quality or size in millimetres.',
      },
      {
        q: 'What is ratti?',
        a: 'Ratti is a traditional Indian weight term used for gemstones. Historical conventions for ratti have varied, so a ratti value should always be read together with the exact standard or conversion being used.',
      },
      {
        q: 'Are carat and ratti the same?',
        a: 'No, they are different units. Compare the exact weight and unit shown in the product details or laboratory report. Do not assume a conversion between them unless the seller states the convention used.',
      },
    ],
  },
  {
    title: 'Ring sizing and jewellery',
    items: [
      {
        q: 'Do you sell finished jewellery?',
        a: 'We currently sell loose gemstones and Rudraksha. Our Ring Size Guide is provided to help when you have a gemstone set into a ring or buy a ring elsewhere.',
      },
      {
        q: 'How do I choose a ring size?',
        a: 'Measure the intended finger or an existing ring in millimetres and match it against the chart in our Ring Size Guide. Measure more than once, because finger size changes with temperature and time of day.',
      },
      {
        q: 'Can a ring always be resized?',
        a: 'No. Resizing depends on the ring design, the metal, the setting, and the construction. Check with the jeweller before assuming a ring can be resized.',
      },
      {
        q: 'Which gemstones need extra care?',
        a: 'Emeralds and other stones with inclusions or treatments generally need gentler care. Avoid knocks, chemicals, and ultrasonic cleaners unless the stone is confirmed safe for them. Ask us about the specific item.',
      },
    ],
  },
  {
    title: 'Shipping',
    items: [
      {
        q: 'Where do you ship?',
        a: 'We ship across India. We do not currently offer international shipping.',
      },
      {
        q: 'How long does delivery take?',
        a: `Orders are processed in ${BUSINESS.processingTime} before dispatch, and delivery then takes up to ${BUSINESS.shippingDays} across India. If a requested laboratory report needs additional time, we contact you before dispatch.`,
      },
      {
        q: 'Is shipping free?',
        a: 'Yes. Shipping across India is free, and no separate handling charge is added at checkout.',
      },
      {
        q: 'Will I get tracking details?',
        a: 'Yes. Once your order is dispatched, tracking details are shared so you can follow the delivery.',
      },
    ],
  },
  {
    title: 'Returns and exchanges',
    items: [
      {
        q: 'Can I return an item?',
        a: `You can raise a return or exchange request within ${BUSINESS.returnWindow} of delivery. The item must be unused, with the original packaging and invoice, and any laboratory report issued with the order must be returned with it. Please contact us before sending anything back.`,
      },
      {
        q: 'When will I receive my refund?',
        a: `Approved refunds go to the original payment method and are typically processed within ${BUSINESS.refundTimeline}. Your bank or payment provider may take additional time to reflect the amount. See the Return & Exchange page for deduction details.`,
      },
      {
        q: 'What if my order arrives damaged or wrong?',
        a: `Contact us within ${BUSINESS.damageWindow} of delivery with photographs of the package and item. Do not use the item or send it back before we confirm the return instructions.`,
      },
    ],
  },
  {
    title: 'Payments',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'Payments are processed through Razorpay and include UPI, credit and debit cards, netbanking, and supported wallets. The exact options are shown at checkout.',
      },
      {
        q: 'Is cash on delivery available?',
        a: 'No. We do not currently offer cash on delivery or EMI options. Orders are paid online at checkout.',
      },
      {
        q: 'Is it safe to pay online?',
        a: 'Payments are handled by Razorpay, and we do not receive or store your full card number, CVV, or UPI PIN. Never share your OTP, CVV, PIN, or full card details with anyone claiming to represent us.',
      },
    ],
  },
  {
    title: 'Packaging',
    items: [
      {
        q: 'What is included in my package?',
        a: 'Your order includes the item, an invoice, a product information card, and protective packaging. If you requested a laboratory report at checkout, it is provided with your delivered order.',
      },
    ],
  },
  {
    title: 'Orders and support',
    items: [
      {
        q: 'Do I need an account to place an order?',
        a: 'No. Guest checkout is available. Creating an account lets you track orders and save items to your wishlist.',
      },
      {
        q: 'How do I contact you?',
        a: `Message us on WhatsApp or call ${BUSINESS.phoneDisplay}, email ${BUSINESS.email}, or use the contact form on the Contact page. Our hours are ${BUSINESS.hours}, ${BUSINESS.hoursDays}.`,
      },
    ],
  },
  {
    title: 'Astrology and traditional use',
    items: [
      {
        q: 'Are gemstones recommended for astrology?',
        a: 'In traditional astrological practice, certain gemstones are associated with planets and beliefs. These associations are matters of tradition and personal choice. We present product facts and do not represent astrological outcomes as scientifically proven.',
      },
      {
        q: 'Do gemstones or Rudraksha have health benefits?',
        a: 'We make no medical claims. Gemstones and Rudraksha are not medicines, and they do not diagnose, prevent, treat, or cure any health condition. Please consult a qualified health professional for medical matters.',
      },
    ],
  },
  {
    title: 'Care and maintenance',
    items: [
      {
        q: 'How should I store my gemstone?',
        a: 'Store each stone separately in a soft pouch or compartment so harder stones do not scratch softer ones, and keep it away from prolonged heat and chemicals.',
      },
      {
        q: 'How should I clean my gemstone?',
        a: 'For most stones, gentle lukewarm water with a soft cloth is safe. Avoid ultrasonic cleaners and harsh chemicals for treated or heavily included stones unless their care requirements are confirmed. Ask us about your specific item.',
      },
    ],
  },
]

const ALL = GROUPS.flatMap((group) => group.items)

export function FaqPage() {
  return (
    <InfoPage
      eyebrow="Help centre"
      title="FAQs"
      metaTitle="Mahalaxmi Gems FAQs | Gemstone & Order Questions"
      metaDescription="Answers about natural gemstones, treatments, laboratory reports, carat and ratti, ring sizing, shipping, returns, payments, packaging, and support at Mahalaxmi Gems."
      path="/faqs"
      intro={
        <>
          Answers to the questions we are asked most. If your question is not here, contact us and
          we will help directly.
        </>
      }
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: ALL.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />

      <div className="mx-auto max-w-3xl space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-2xl font-semibold text-primary">{group.title}</h2>
            <div className="mt-4">
              <FaqAccordion items={group.items} />
            </div>
          </section>
        ))}
      </div>

      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary">Still have a question?</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Read the{' '}
          <Link to="/gemstone-buying-guide" className="focus-ring rounded font-medium text-gold underline">
            Gemstone Buying Guide
          </Link>
          , the{' '}
          <Link to="/shipping-policy" className="focus-ring rounded font-medium text-gold underline">
            Shipping Policy
          </Link>
          , or the{' '}
          <Link to="/return-exchange" className="focus-ring rounded font-medium text-gold underline">
            Return &amp; Exchange
          </Link>{' '}
          policy. For anything else,{' '}
          <a href={waLink('Hi Mahalaxmi Gems! I have a question.')} target="_blank" rel="noreferrer" className="focus-ring rounded font-medium text-gold underline">
            message us on WhatsApp
          </a>{' '}
          or use the{' '}
          <Link to="/contact" className="focus-ring rounded font-medium text-gold underline">
            contact form
          </Link>
          .
        </p>
      </section>
    </InfoPage>
  )
}
