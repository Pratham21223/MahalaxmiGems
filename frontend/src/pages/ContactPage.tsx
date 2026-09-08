import { MessageCircle } from 'lucide-react'

const TEXT = encodeURIComponent("Hi Mahalaxmi Gems! I have a question.")

export function ContactPage() {
  return (
    <div className="page-shell py-16">
      <section className="premium-panel mx-auto max-w-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Get in touch</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary md:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
          Reach out on WhatsApp for product questions, availability, pricing, or help choosing the right stone.
        </p>
        <a
          href={`https://wa.me/?text=${TEXT}`}
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <MessageCircle className="size-5" /> Ask on WhatsApp
        </a>
      </section>
    </div>
  )
}
