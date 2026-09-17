import { z } from 'zod'
import { LAB_IDS } from './config/labReports.js'

// Allow-list input schemas (backend-principles.md). All write endpoints validate
// against these before touching the database.

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80, 'Name is too long'),
  email: z.string().trim().email('A valid email is required').max(120),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
})

export const loginSchema = z.object({
  email: z.string().trim().email('A valid email is required').max(120),
  password: z.string().min(1, 'Password is required').max(128),
})

export const cartAddSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  qty: z.number().int().min(1).max(99).default(1),
})

export const cartUpdateSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  qty: z.number().int().min(0).max(99),
})

export const wishlistSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
})

export const addressSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('A valid email is required').max(120),
  phone: z.string().trim().min(7, 'A valid phone is required').max(20),
  address: z.string().trim().min(1, 'Address is required').max(200),
  city: z.string().trim().min(1, 'City is required').max(80),
  state: z.string().trim().min(1, 'State is required').max(80),
  postalCode: z.string().trim().min(1, 'Postal code is required').max(20),
  country: z.string().trim().min(1, 'Country is required').max(80),
})

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  // Optional explicit items for "Buy Now". When omitted the server uses the
  // request owner's cart. The server always revalidates against the DB.
  items: z
    .array(z.object({ productId: z.string().min(1), qty: z.number().int().min(1).max(99) }))
    .max(100)
    .optional(),
  // Optional laboratory report choice; the server resolves the label/fee from
  // config (never trusts client-supplied pricing).
  labReport: z.object({ lab: z.enum(LAB_IDS) }).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  email: z.string().trim().email('A valid email is required').max(120),
  phone: z.string().trim().max(20).optional().default(''),
  subject: z.string().trim().min(1, 'Subject is required').max(60),
  message: z.string().trim().min(1, 'Message is required').max(2000),
  // Honeypot: hidden from people, filled by bots. Never rejected outright.
  website: z.string().max(200).optional().default(''),
})

export const contactStatusSchema = z.object({
  status: z.enum(['NEW', 'READ']),
})

export const labReportStatusSchema = z.object({
  status: z.enum(['REQUESTED', 'SENT_TO_LAB', 'REPORT_RECEIVED']),
})

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens'),
  parent: z.string().optional().nullable(),
  description: z.string().max(2000).optional().default(''),
  seoTitle: z.string().max(160).optional().default(''),
  seoDescription: z.string().max(300).optional().default(''),
  active: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
})

export const productSchema = z.object({
  sku: z.string().trim().min(1, 'SKU is required').max(40),
  name: z.string().trim().min(1, 'Name is required').max(120),
  slug: z.string().trim().min(1, 'Slug is required').max(120),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(10000).optional().default(''),
  gemstoneType: z.string().max(60).optional().default(''),
  origin: z.string().max(60).optional().default(''),
  treatment: z.string().max(60).optional().default(''),
  weightCarat: z.number().positive().optional().nullable(),
  weightRatti: z.number().positive().optional().nullable(),
  color: z.string().max(60).optional().default(''),
  shape: z.string().max(60).optional().default(''),
  clarity: z.string().max(60).optional().default(''),
  cut: z.string().max(60).optional().default(''),
  dimensions: z.string().max(120).optional().default(''),
  pricingType: z.enum(['FIXED', 'PER_CARAT']).optional().default('FIXED'),
  priceAmount: z.number().min(0).optional().default(0),
  currency: z.string().max(10).optional().default('INR'),
  priceState: z.enum(['PUBLIC_PRICE', 'CONTACT_FOR_PRICE']).optional().default('PUBLIC_PRICE'),
  inventory: z.number().int().min(0).optional().default(0),
  isUnique: z.boolean().optional().default(false),
  status: z.enum(['DRAFT', 'ACTIVE', 'ON_HOLD', 'SOLD', 'ARCHIVED']).optional().default('DRAFT'),
  seoTitle: z.string().max(160).optional().default(''),
  seoDescription: z.string().max(300).optional().default(''),
  images: z
    .array(z.object({ url: z.string().max(500).optional().default(''), altText: z.string().min(1) }))
    .optional()
    .default([]),
})

export const orderStatusSchema = z.object({
  status: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
})
