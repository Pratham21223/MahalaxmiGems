import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Category = mongoose.model('Category', categorySchema)
