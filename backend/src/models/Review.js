import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING', 'APPROVED'], default: 'APPROVED' },
  },
  { timestamps: true },
)

reviewSchema.index({ product: 1, status: 1, createdAt: -1 })

export const Review = mongoose.model('Review', reviewSchema)