import { ContactMessage } from '../models/ContactMessage.js'
import { validate } from '../middlewares/validate.js'
import { contactSchema, contactStatusSchema } from '../schemas.js'

export const validateContact = validate(contactSchema)
export const validateContactStatus = validate(contactStatusSchema)

// Public enquiry. Honeypot hits are silently accepted so bots do not learn.
export async function submitContact(req, res) {
  const { name, email, phone, subject, message, website } = res.locals.validated
  if (website) return res.status(201).json({ ok: true })
  await ContactMessage.create({ name, email, phone, subject, message })
  res.status(201).json({ ok: true })
}

export async function adminListContactMessages(req, res) {
  const { status, page = 1, limit = 20 } = req.query
  const filter = {}
  if (status) filter.status = status
  const p = Math.max(1, parseInt(page, 10) || 1)
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const [items, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
    ContactMessage.countDocuments(filter),
  ])
  res.json({ items, total, page: p, limit: l, totalPages: Math.ceil(total / l) })
}

export async function adminUpdateContactStatus(req, res) {
  const { status } = res.locals.validated
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true },
  ).lean()
  if (!message) return res.status(404).json({ error: 'Message not found' })
  res.json({ item: message })
}
