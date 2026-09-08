import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    labName: { type: String, default: '' },
    reportNumber: { type: String, default: '' },
    issueDate: { type: Date },
    verificationUrl: { type: String, default: '' },
    verificationStatus: { type: String, default: '' },
    documentRef: { type: String, default: '' },
  },
  { _id: false },
)

const imageSchema = new mongoose.Schema(
  {
    // `url` is optional until real product photos are added; empty means the
    // frontend renders a labeled placeholder view (plan.txt §9).
    url: { type: String, default: '' },
    altText: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    gemstoneType: { type: String, default: '' },
    origin: { type: String, default: '' },
    treatment: { type: String, default: '' },
    weightCarat: { type: Number },
    weightRatti: { type: Number },
    color: { type: String, default: '' },
    shape: { type: String, default: '' },
    clarity: { type: String, default: '' },
    cut: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    pricing: {
      type: { type: String, enum: ['FIXED', 'PER_CARAT'], default: 'FIXED' },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    priceState: {
      type: String,
      enum: ['PUBLIC_PRICE', 'CONTACT_FOR_PRICE'],
      default: 'PUBLIC_PRICE',
    },
    inventory: { type: Number, default: 0 },
    isUnique: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'ON_HOLD', 'SOLD', 'ARCHIVED'],
      default: 'DRAFT',
    },
    images: { type: [imageSchema], default: [] },
    certificates: { type: [certificateSchema], default: [] },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true },
)

productSchema.index({ category: 1, status: 1 })
productSchema.index({ gemstoneType: 1 })

export const Product = mongoose.model('Product', productSchema)
