import { Link } from 'react-router-dom'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { JsonLd } from '@/components/JsonLd'

const COMPARE = [
  'Same gemstone identity?',
  'Natural or laboratory-grown?',
  'Treatment disclosed?',
  'Similar size and measurements?',
  'Similar colour?',
  'Similar clarity for that species?',
  'Similar cut quality?',
  'Similar documentation?',
  'Origin stated, and by whom?',
  'Any damage or chips?',
  'Price stated on the same basis (per stone or per carat)?',
]

const ASK = [
  'What gemstone is it, and what variety?',
  'Is it natural or laboratory-grown?',
  'Has it been treated, and with what?',
  'What is the exact carat weight?',
  'What are the measurements?',
  'Is there a laboratory report, and which laboratory issued it?',
  'Can the report be verified with the laboratory?',
  'Is origin stated?',
  'What care does the stone need?',
  'What is the return policy?',
]

const RED_FLAGS = [
  'Prices that sound too good for the described stone.',
  'Vague wording about treatment or origin.',
  'Promises of guaranteed luck, wealth, or health results.',
  'No gemstone identity stated at all.',
  'No weight or measurements.',
  'No treatment information where treatment is common.',
  'Artificial urgency or pressure to pay immediately.',
  'Reports that cannot be verified with the issuing laboratory.',
  'A return policy that is unclear or impossible to find.',
  'Details that do not match between the listing and the report.',
]

const FINAL_CHECKLIST = [
  'I know the gemstone type and variety.',
  'I know whether it is natural or laboratory-grown.',
  'I understand the treatment status.',
  'I have the exact weight and measurements.',
  'I know how the colour and clarity compare for this species.',
  'I know what documentation is included.',
  'I know the origin claim and its basis.',
  'I have read the care requirements.',
  'I have read the shipping and return policies.',
  'I have kept the invoice and any report safe.',
]

function Checklist({ items }: { items: string[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ol>
  )
}

export function BuyingGuidePage() {
  return (
    <InfoPage
      eyebrow="Buying guide"
      title="Gemstone Buying Guide"
      metaTitle="Gemstone Buying Guide | How to Buy Natural Gemstones"
      metaDescription="A practical guide to buying gemstones: identity, natural vs laboratory-grown, treatments, the four quality factors, carat and ratti, certification, origin, comparison checklists, and red flags."
      path="/gemstone-buying-guide"
      intro={
        <>
          Buying a gemstone takes more than checking a name and a carat weight. This guide explains
          the terms sellers use, what each factor means, and the questions worth asking before you
          pay.
        </>
      }
    >
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Gemstone Buying Guide',
              item: `${window.location.origin}/gemstone-buying-guide`,
            },
          ],
        }}
      />

      <div className="mx-auto max-w-3xl space-y-12">
        <InfoSection eyebrow="Step 1" title="Decide your purpose">
          <p>
            People buy gemstones for different reasons: to set into jewellery, to collect, as a
            gift, for personal preference, or as part of traditional astrological practice. Your
            purpose changes what matters. A stone for occasional wear has different priorities from
            one kept in a collection.
          </p>
          <p>
            If astrology is part of your reason, treat the recommendation as tradition and personal
            belief. We do not present astrological associations as scientifically proven outcomes.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 2" title="Understand the gemstone identity">
          <p>
            Identity is the foundation. &ldquo;Species&rdquo; is the mineral family (for example,
            corundum), and &ldquo;variety&rdquo; is the named form within it (for example, ruby or
            blue sapphire). Two stones with the same colour can have completely different
            identities and values.
          </p>
          <p>
            Start every comparison by confirming the species and variety. If a listing does not
            state them, ask before going further.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 3" title="Natural, laboratory-grown, or imitation">
          <ul className="space-y-2">
            <li>
              <strong className="font-medium text-foreground">Natural:</strong> formed by natural
              geological processes.
            </li>
            <li>
              <strong className="font-medium text-foreground">Laboratory-grown:</strong> man-made
              material with essentially the same relevant chemical, physical, and optical
              properties as the natural material, sold under that description.
            </li>
            <li>
              <strong className="font-medium text-foreground">Imitation or simulant:</strong>{' '}
              material that resembles another gemstone in appearance but is not that gemstone.
            </li>
          </ul>
          <p>
            Words like &ldquo;original&rdquo; or &ldquo;genuine&rdquo; are not technical
            definitions. Ask for the actual identity: what the material is, and whether it is
            natural or laboratory-grown.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 4" title="Gemstone treatments">
          <p>
            A treatment is a process used to change or improve a gemstone&rsquo;s appearance or
            durability. Heat treatment, fracture filling, oiling or clarity enhancement, diffusion,
            dyeing, and irradiation are all used in the trade. Treatment is common and does not
            automatically mean a stone is fake.
          </p>
          <p>
            Treatment can affect appearance, durability, care requirements, rarity, and market
            value. The important thing is disclosure: you should know what has been done to the
            stone you are buying.
          </p>
          <InfoCallout>
            When a product page states a treatment, read it as part of the item&rsquo;s identity.
            If a treatment claim is vague, ask for the specifics.
          </InfoCallout>
        </InfoSection>

        <InfoSection eyebrow="Step 5" title="The key quality factors">
          <p>
            Colour, clarity, cut, and carat weight are the factors most often discussed. Their
            relative importance changes from one gemstone to another. There is no single universal
            formula for coloured gemstones.
          </p>
          <ul className="space-y-2">
            <li>Colour often has a major influence on appearance and value.</li>
            <li>Clarity expectations differ significantly by species.</li>
            <li>Cut affects brilliance, symmetry, and how colour is displayed.</li>
            <li>Carat weight is simply weight; it does not by itself indicate quality.</li>
          </ul>
        </InfoSection>

        <InfoSection eyebrow="Step 6" title="Colour">
          <p>
            Gemologists describe colour using hue (the basic colour), tone (how light or dark it
            is), and saturation (how strong or vivid it is). Evenness matters too; some stones show
            colour zoning, where colour is unevenly distributed.
          </p>
          <p>
            There is no universal &ldquo;best&rdquo; colour for every buyer. Preference matters,
            and two people can reasonably prefer different stones.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 7" title="Clarity">
          <p>
            Clarity describes how free a stone is of internal features. Inclusions are normal in
            natural gemstones and are often evidence of natural origin. Their presence does not
            automatically make a stone fake or low quality.
          </p>
          <p>
            Different species naturally show different inclusion patterns. A clarity level that is
            excellent for one gemstone may be unrealistic for another.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 8" title="Cut">
          <p>
            Cut covers proportions, symmetry, and polish. A well-cut stone handles light well and
            shows the colour evenly. Poor proportions can cause windowing (light passing straight
            through) or dark, lifeless areas.
          </p>
          <p>
            Cut quality is not only about shape. Two stones of the same shape can be cut very
            differently.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 9" title="Carat weight and ratti">
          <p>
            Carat is the standard unit of gemstone weight: one carat equals 0.2 grams. Ratti is a
            traditional Indian weight term whose historical conventions have varied. Because they
            are different units, never assume a single conversion.
          </p>
          <p>
            Compare the exact weight and unit stated in the product details or laboratory report.
            If a seller converts between carat and ratti, they should state the convention they
            use.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 10" title="Documentation and reports">
          <p>
            A laboratory report is issued by a gem-testing laboratory and describes what that
            laboratory identified. Depending on the laboratory and service, it can state the
            species and variety, whether the material is natural or laboratory-grown, weight,
            measurements, shape, colour, treatment comments, and sometimes origin. Reports are not
            valuations.
          </p>
          <p>
            Report terminology depends on the issuing laboratory, so reports from different
            laboratories are not directly interchangeable. Where a report number is provided, use
            the laboratory&rsquo;s official verification system to check it.
          </p>
          <p>
            At checkout you can choose a laboratory for your order, and where a report is requested
            it is provided with your delivered order.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 11" title="Origin">
          <p>
            Origin is the geographic source of a gemstone, and it is separate from quality. A stone
            from a famous location is not automatically better than one from elsewhere.
          </p>
          <p>
            Origin determination is not always possible. Where origin is used as a selling point,
            it should be supported by a respected laboratory report rather than a guess.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 12" title="How to compare two stones">
          <p>Work through the same list for both stones:</p>
          <Checklist items={COMPARE} />
        </InfoSection>

        <InfoSection eyebrow="Step 13" title="Questions to ask before buying">
          <Checklist items={ASK} />
        </InfoSection>

        <InfoSection eyebrow="Step 14" title="Buying online">
          <ul className="space-y-2">
            <li>Check the exact measurements, not only the weight.</li>
            <li>View more than one image where available.</li>
            <li>Remember that lighting and screens change appearance.</li>
            <li>Compare report measurements against the listing.</li>
            <li>Read the treatment information carefully.</li>
            <li>Read the return policy before paying.</li>
            <li>Keep the invoice and any report after delivery.</li>
          </ul>
          <p>
            Our{' '}
            <Link to="/ring-size-guide" className="focus-ring rounded font-medium text-gold underline">
              Ring Size Guide
            </Link>{' '}
            covers sizing if you plan to set a gemstone into a ring.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Step 15" title="Red flags">
          <p>Pause and ask questions if you see any of these:</p>
          <ul className="space-y-2">
            {RED_FLAGS.map((flag) => (
              <li key={flag} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </InfoSection>

        <InfoSection eyebrow="Step 16" title="Final buying checklist">
          <Checklist items={FINAL_CHECKLIST} />
          <p>
            If any item is unclear, ask us before purchasing. See the{' '}
            <Link to="/faqs" className="focus-ring rounded font-medium text-gold underline">
              FAQs
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="focus-ring rounded font-medium text-gold underline">
              contact us
            </Link>
            .
          </p>
        </InfoSection>
      </div>
    </InfoPage>
  )
}
