// Single source of truth for owner-confirmed business facts and policies.
// Every information, FAQ, and policy page reads from here so the numbers can
// never contradict each other. Update a value once and the whole site follows.
export const BUSINESS = {
  name: 'Mahalaxmi Gems',
  sincePhrase: 'the 1980s',
  email: 'mahalaxmigems@gmail.com',
  phoneDisplay: '+91 89496 86903',
  phoneE164: '+918949686903',
  phoneHref: 'tel:+918949686903',
  whatsappNumber: '918949686903',
  hours: '8:00 AM to 10:00 PM',
  hoursDays: 'every day',
  onlineOnly:
    'Mahalaxmi Gems is an online store serving customers across India. We do not have a public walk-in address.',
  shippingDays: '10 working days',
  processingTime: '1–2 business days',
  shippingCharge: 'free',
  returnWindow: '7 days',
  refundTimeline: '5–7 business days after the returned item passes inspection',
  damageWindow: '48 hours',
} as const

export function waLink(text: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`
}
