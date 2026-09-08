import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight } from 'lucide-react'

const TEXT = encodeURIComponent(
  "Hi Mahalaxmi Gems! I'd like some help choosing a gemstone.",
)

export function WhatsAppCta() {
  return (
    <section className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-[0_28px_80px_rgba(5,0,64,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Assisted buying</p>
      <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Have a question about a gemstone?</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70 md:text-base">
        Message us on WhatsApp to check availability, ask about pricing, or get help
        choosing the right stone.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={`https://wa.me/?text=${TEXT}`}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <MessageCircle className="size-5" /> Ask on WhatsApp
        </a>
        <Link
          to="/contact"
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 font-medium transition hover:bg-white/10"
        >
          Contact Us <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
