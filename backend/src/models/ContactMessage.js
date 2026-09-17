import mongoose from 'mongoose'

// Enquiry submitted from the public Contact page. Read and actioned by admins.
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    subject: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['NEW', 'READ'], default: 'NEW' },
  },
  { timestamps: true },
)

contactMessageSchema.index({ status: 1, createdAt: -1 })

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
