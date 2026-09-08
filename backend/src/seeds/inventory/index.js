// Additive real inventory import.
// This script never deletes records. Existing records are skipped unless
// --update-existing is passed intentionally.
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import mongoose from 'mongoose'
import { env } from '../../config/index.js'
import { connectDB } from '../../config/db.js'
import { Category } from '../../models/Category.js'
import { Product } from '../../models/Product.js'

const DEFAULT_FILE = './inventory.sample.js'

function argValue(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function hasArg(name) {
  return process.argv.includes(name)
}

function resolveSeedFile(filePath) {
  if (!filePath) return new URL(DEFAULT_FILE, import.meta.url)
  const absolute = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath)
  return pathToFileURL(absolute)
}

function requireString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} is required`)
  }
  return value.trim()
}

function cleanImages(images = []) {
  return images
    .map((image, index) => ({
      url: image.url || '',
      altText: requireString(image.altText, `images[${index}].altText`),
      order: Number.isFinite(image.order) ? image.order : index,
    }))
    .sort((a, b) => a.order - b.order)
}

function cleanCertificates(certificates = []) {
  return certificates.map((certificate) => ({
    labName: certificate.labName || '',
    reportNumber: certificate.reportNumber || '',
    issueDate: certificate.issueDate || undefined,
    verificationUrl: certificate.verificationUrl || '',
    verificationStatus: certificate.verificationStatus || '',
    documentRef: certificate.documentRef || '',
  }))
}

async function findParent(parentSlug) {
  if (!parentSlug) return null
  const parent = await Category.findOne({ slug: parentSlug }).select('_id slug').lean()
  if (!parent) throw new Error(`Parent category not found: ${parentSlug}`)
  return parent._id
}

async function importCategory(input, options) {
  const slug = requireString(input.slug, 'category.slug').toLowerCase()
  const existing = await Category.findOne({ slug })
  const payload = {
    name: requireString(input.name, `category ${slug}.name`),
    slug,
    parent: await findParent(input.parentSlug),
    description: input.description || '',
    seoTitle: input.seoTitle || '',
    seoDescription: input.seoDescription || '',
    active: input.active !== false,
    order: Number.isFinite(input.order) ? input.order : 0,
  }

  if (options.dryRun) return { action: existing ? 'would-skip' : 'would-create', type: 'category', key: slug }
  if (existing && !options.updateExisting) return { action: 'skipped', type: 'category', key: slug }
  if (existing) {
    await Category.updateOne({ _id: existing._id }, { $set: payload }, { runValidators: true })
    return { action: 'updated', type: 'category', key: slug }
  }
  await Category.create(payload)
  return { action: 'created', type: 'category', key: slug }
}

async function importProduct(input, options) {
  const sku = requireString(input.sku, 'product.sku')
  const slug = requireString(input.slug, `product ${sku}.slug`).toLowerCase()
  const categorySlug = requireString(input.categorySlug, `product ${sku}.categorySlug`).toLowerCase()
  const category = await Category.findOne({ slug: categorySlug }).select('_id slug').lean()
  if (!category) throw new Error(`Product ${sku} references missing category: ${categorySlug}`)

  const existing = await Product.findOne({ $or: [{ sku }, { slug }] })
  if (existing?.sku?.startsWith('DEMO-')) {
    throw new Error(`Refusing to modify demo product ${existing.sku}. Use a unique real SKU and slug.`)
  }

  const payload = {
    sku,
    name: requireString(input.name, `product ${sku}.name`),
    slug,
    category: category._id,
    description: input.description || '',
    gemstoneType: input.gemstoneType || '',
    origin: input.origin || '',
    treatment: input.treatment || '',
    weightCarat: input.weightCarat ?? undefined,
    weightRatti: input.weightRatti ?? undefined,
    color: input.color || '',
    shape: input.shape || '',
    clarity: input.clarity || '',
    cut: input.cut || '',
    dimensions: input.dimensions || '',
    pricing: {
      type: input.pricing?.type || 'FIXED',
      amount: Number(input.pricing?.amount || 0),
      currency: input.pricing?.currency || 'INR',
    },
    priceState: input.priceState || 'PUBLIC_PRICE',
    inventory: Number(input.inventory || 0),
    isUnique: Boolean(input.isUnique),
    status: input.status || 'DRAFT',
    images: cleanImages(input.images || []),
    certificates: cleanCertificates(input.certificates || []),
    seoTitle: input.seoTitle || '',
    seoDescription: input.seoDescription || '',
  }

  if (options.dryRun) return { action: existing ? 'would-skip' : 'would-create', type: 'product', key: sku }
  if (existing && !options.updateExisting) return { action: 'skipped', type: 'product', key: sku }
  if (existing) {
    await Product.updateOne({ _id: existing._id }, { $set: payload }, { runValidators: true })
    return { action: 'updated', type: 'product', key: sku }
  }
  await Product.create(payload)
  return { action: 'created', type: 'product', key: sku }
}

function printSummary(results) {
  const totals = results.reduce((acc, result) => {
    const key = `${result.type}:${result.action}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  // eslint-disable-next-line no-console
  console.table(totals)
}

async function run() {
  const file = resolveSeedFile(argValue('--file'))
  const options = {
    dryRun: hasArg('--dry-run'),
    updateExisting: hasArg('--update-existing'),
  }
  const data = await import(file.href)
  const categories = Array.isArray(data.categories) ? data.categories : []
  const products = Array.isArray(data.products) ? data.products : []

  await connectDB(env.mongodbUri)
  const results = []
  for (const category of categories) results.push(await importCategory(category, options))
  for (const product of products) results.push(await importProduct(product, options))
  printSummary(results)
  await mongoose.disconnect()
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
