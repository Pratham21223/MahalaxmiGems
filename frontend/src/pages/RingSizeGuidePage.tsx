import { Link } from 'react-router-dom'
import { InfoPage, InfoSection, InfoCallout } from '@/components/InfoPage'
import { BUSINESS } from '@/lib/businessInfo'

const ROWS = [
  { india: '8', dia: '15.3', circ: '48.1', us: '4.5', uk: 'I' },
  { india: '10', dia: '15.9', circ: '50.0', us: '5.5', uk: 'K½' },
  { india: '12', dia: '16.5', circ: '51.9', us: '6', uk: 'L½' },
  { india: '14', dia: '17.3', circ: '54.3', us: '7', uk: 'N' },
  { india: '16', dia: '18.1', circ: '56.9', us: '8', uk: 'P' },
  { india: '18', dia: '18.9', circ: '59.4', us: '9', uk: 'R' },
  { india: '20', dia: '19.8', circ: '62.2', us: '10', uk: 'T' },
  { india: '22', dia: '20.6', circ: '64.7', us: '11', uk: 'V' },
]

export function RingSizeGuidePage() {
  return (
    <InfoPage
      eyebrow="Guide"
      title="Ring Size Guide"
      metaTitle="Ring Size Guide | Measure Your Ring Size"
      metaDescription="How to measure your ring size at home, when to measure, and an Indian, US, UK, and European conversion chart based on inside diameter and circumference in millimetres."
      path="/ring-size-guide"
      intro={
        <>
          If you plan to set a gemstone into a ring, the fit matters as much as the stone. This
          guide shows how to measure accurately and how Indian sizes compare with US, UK, and
          European sizes. It applies to gemstone rings; Rudraksha beads are not sized this way.
        </>
      }
    >
      <div className="mx-auto max-w-3xl space-y-12">
        <InfoSection eyebrow="Basics" title="What a ring size means">
          <p>
            A ring size describes the inside opening of the ring, not the outside of the band. The
            most reliable way to compare sizes across countries is the inside diameter or the
            inside circumference in millimetres.
          </p>
          <p>
            Indian sizing uses a numeric scale, the US uses numbers with half sizes, the UK uses
            letters, and European sizes correspond closely to the inside circumference in
            millimetres.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Method 1" title="Measure an existing ring">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Choose a ring that fits the intended finger comfortably.</li>
            <li>Measure the inside diameter across the middle of the opening.</li>
            <li>Do not measure the outer edge or include the metal thickness.</li>
            <li>Compare your measurement in millimetres against the chart below.</li>
          </ol>
        </InfoSection>

        <InfoSection eyebrow="Method 2" title="Measure your finger">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Wrap a narrow, non-stretch strip of paper or thread around the base of the finger.</li>
            <li>Mark the point where the strip meets.</li>
            <li>Lay it flat and measure the length in millimetres — this is the circumference.</li>
            <li>Match it against the circumference column in the chart below.</li>
            <li>Repeat two or three times and use the average.</li>
          </ol>
        </InfoSection>

        <InfoSection eyebrow="Timing" title="When to measure">
          <p>
            Finger size changes during the day and with temperature. Measure when your hands are
            warm and at a normal time of day, not first thing in the morning or after exercise.
            Cold hands can make a finger measure smaller than usual.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Fit" title="Band width, hands, and knuckles">
          <ul className="space-y-2">
            <li>Wide bands feel tighter than narrow bands of the same size.</li>
            <li>Your dominant hand is often slightly larger; measure the exact finger that will wear the ring.</li>
            <li>
              If the base of the finger is much narrower than the knuckle, you may need a size
              that passes the knuckle without being loose.
            </li>
            <li>
              If you are between two sizes, choose the larger size for wide bands and the smaller
              for narrow bands, then confirm before ordering.
            </li>
          </ul>
        </InfoSection>

        <InfoSection eyebrow="Chart" title="Size conversion chart">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Ring size conversion between Indian, US, UK, and European systems
              </caption>
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-3 py-2">Indian size</th>
                  <th scope="col" className="px-3 py-2">Inside diameter (mm)</th>
                  <th scope="col" className="px-3 py-2">Inside circumference (mm)</th>
                  <th scope="col" className="px-3 py-2">US (approx.)</th>
                  <th scope="col" className="px-3 py-2">UK (approx.)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.india} className="border-b border-slate-100 text-foreground">
                    <th scope="row" className="px-3 py-2 font-medium text-primary">{row.india}</th>
                    <td className="px-3 py-2">{row.dia}</td>
                    <td className="px-3 py-2">{row.circ}</td>
                    <td className="px-3 py-2">{row.us}</td>
                    <td className="px-3 py-2">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            Inside circumference is approximately inside diameter × 3.1416. Country conversions
            are approximate because sizing systems do not align exactly. Always use the
            millimetre measurement as your reference.
          </p>
        </InfoSection>

        <InfoSection eyebrow="Resizing" title="Before you assume a ring can be resized">
          <InfoCallout>
            Resizing depends on the ring design, the metal, the setting, and the construction — not
            every ring can be resized, and some stones should not be heated during resizing. Check
            with the jeweller before assuming resizing is possible.
          </InfoCallout>
        </InfoSection>

        <InfoSection eyebrow="Help" title="Not sure about your size?">
          <p>
            If you are between sizes or the measurement is unclear, contact us before ordering
            anything custom. Message us on{' '}
            <a
              href={`https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent('Hi Mahalaxmi Gems! I need help with a ring size.')}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded font-medium text-gold underline"
            >
              WhatsApp
            </a>{' '}
            or email{' '}
            <a href={`mailto:${BUSINESS.email}`} className="focus-ring rounded font-medium text-gold underline">
              {BUSINESS.email}
            </a>
            . See also the{' '}
            <Link to="/gemstone-buying-guide" className="focus-ring rounded font-medium text-gold underline">
              Gemstone Buying Guide
            </Link>
            .
          </p>
        </InfoSection>
      </div>
    </InfoPage>
  )
}
