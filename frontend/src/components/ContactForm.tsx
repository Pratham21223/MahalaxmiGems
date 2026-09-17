import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Send } from 'lucide-react'
import { submitContact } from '@/lib/api'
import { apiErrorMessage } from '@/lib/errors'
import { BUSINESS, waLink } from '@/lib/businessInfo'
import { Input } from '@/components/ui/input'

const SUBJECTS = [
  'Product enquiry',
  'Gemstone guidance',
  'Order support',
  'Shipping',
  'Return or exchange',
  'Ring size',
  'Custom request',
  'Other',
]

const FIELD =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/15'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.')
      return
    }
    if (!consent) {
      setError('Please agree to the privacy note before sending.')
      return
    }
    setSubmitting(true)
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject,
        message: message.trim(),
        website,
      })
      setSent(true)
      setName('')
      setEmail('')
      setPhone('')
      setSubject(SUBJECTS[0])
      setMessage('')
      setConsent(false)
    } catch (err) {
      setError(apiErrorMessage(err, 'We could not send your message. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="premium-panel rounded-2xl p-6" noValidate>
      <h2 className="text-lg font-semibold text-primary">Send an enquiry</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Share a few details and we will get back to you. Prefer to chat? Message us on WhatsApp.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-foreground">
          Name <span aria-hidden="true" className="text-gold">*</span>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            autoComplete="name"
            className="mt-1.5"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          Email <span aria-hidden="true" className="text-gold">*</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={120}
            autoComplete="email"
            className="mt-1.5"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          Phone <span className="font-normal text-muted-foreground">(optional)</span>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            autoComplete="tel"
            className="mt-1.5"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          Subject
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`mt-1.5 h-9 ${FIELD}`}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-foreground sm:col-span-2">
          Message <span aria-hidden="true" className="text-gold">*</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={2000}
            rows={5}
            className={`mt-1.5 ${FIELD}`}
          />
        </label>
      </div>

      {/* Honeypot: hidden from people; bots that fill it are ignored. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-4 rounded border-slate-300 text-gold focus-ring"
        />
        <span>
          I agree that {BUSINESS.name} may use these details to respond to my enquiry, as described
          in the <Link to="/privacy-policy" className="focus-ring rounded font-medium text-gold underline">Privacy Policy</Link>.
        </span>
      </label>

      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {sent && (
        <p className="mt-3 text-sm font-medium text-emerald-600" role="status">
          Thank you — your message has been sent. We will reply as soon as possible.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-4" />
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        <a
          href={waLink("Hi Mahalaxmi Gems! I'd like some help with a gemstone.")}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:brightness-105"
        >
          <MessageCircle className="size-5" /> WhatsApp instead
        </a>
      </div>
    </form>
  )
}
