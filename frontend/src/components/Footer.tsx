import { Link } from 'react-router-dom'
import { ArrowRight, Gem, MessageCircle } from 'lucide-react'

const COLUMNS: { title: string; items: string[] }[] = [
  {
    title: 'Our Company',
    items: ['About Us', 'Testimonials', 'Blog', 'Our Location', 'Contact Us'],
  },
  {
    title: 'Information',
    items: ['FAQs', 'Gemstone Buying Guide', 'Ring Size Guide', 'Packaging & Insert'],
  },
  {
    title: 'Policies',
    items: ['Shipping Policy', 'Return & Exchange', 'Payment Methods', 'Privacy Policy'],
  },
]

// Routes for links that exist today; the rest remain placeholders → /contact.
function itemHref(item: string): string {
  if (item === 'About Us') return '/about'
  if (item === 'Contact Us') return '/contact'
  return '/contact'
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-primary text-white">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-gold">
              <Gem className="size-5" />
            </span>
            <span className="text-lg font-semibold">Mahalaxmi Gems</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Certified natural gemstones and Rudraksha presented with clear product details and easy enquiry paths.
          </p>
          <Link
            to="/contact"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:-translate-y-0.5"
          >
            <MessageCircle className="size-4" />
            Contact for guidance
          </Link>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.items.map((item) => (
                <li key={item}>
                  <Link to={itemHref(item)} className="focus-ring group inline-flex items-center gap-1.5 rounded-md text-sm text-white/70 transition hover:text-white">
                    {item}
                    <ArrowRight className="size-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Mahalaxmi Gems.</span>
          <span>Product images and final store policies will be added by the owner.</span>
        </div>
      </div>
    </footer>
  )
}
