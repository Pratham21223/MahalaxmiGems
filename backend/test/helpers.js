// Shared test setup. Runs against a dedicated test database (never the dev DB).
// Tests run sequentially (--test-concurrency=1) and each file resets the DB.

process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/gemstone_store_test'
process.env.SESSION_SECRET = 'test-session-secret'
process.env.NODE_ENV = 'test'

export async function setup() {
  const mongoose = (await import('mongoose')).default
  const { createApp } = await import('../src/app.js')
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  await mongoose.connection.dropDatabase()
  return { app: createApp(), mongoose }
}

export async function teardown(mongoose) {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
}

// Seed a minimal purchasable catalog for order/cart tests.
export async function seedCatalog() {
  const { Category } = await import('../src/models/Category.js')
  const { Product } = await import('../src/models/Product.js')
  const category = await Category.create({ name: 'Test Sapphire', slug: 'test-sapphire' })
  const uniqueProduct = await Product.create({
    sku: 'TEST-UNIQUE-1',
    name: 'Unique Blue Sapphire',
    slug: 'unique-blue-sapphire',
    category: category._id,
    priceState: 'PUBLIC_PRICE',
    pricing: { type: 'FIXED', amount: 50000, currency: 'INR' },
    inventory: 1,
    isUnique: true,
    status: 'ACTIVE',
  })
  const normalProduct = await Product.create({
    sku: 'TEST-NORMAL-1',
    name: 'Yellow Sapphire',
    slug: 'yellow-sapphire-test',
    category: category._id,
    priceState: 'PUBLIC_PRICE',
    pricing: { type: 'FIXED', amount: 8000, currency: 'INR' },
    inventory: 5,
    isUnique: false,
    status: 'ACTIVE',
  })
  const contactProduct = await Product.create({
    sku: 'TEST-CONTACT-1',
    name: 'Ruby',
    slug: 'ruby-test',
    category: category._id,
    priceState: 'CONTACT_FOR_PRICE',
    pricing: { type: 'FIXED', amount: 0, currency: 'INR' },
    inventory: 2,
    isUnique: false,
    status: 'ACTIVE',
  })
  return { category, uniqueProduct, normalProduct, contactProduct }
}