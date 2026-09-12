import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { setup, teardown } from './helpers.js'

let app
let mongoose
let admin

before(async () => {
  ;({ app, mongoose } = await setup())
  const { Category } = await import('../src/models/Category.js')
  const { User } = await import('../src/models/User.js')
  await Category.create({ name: 'Sapphire', slug: 'sapphire' })
  await User.create({
    name: 'Root Admin',
    email: 'root@example.com',
    passwordHash: await bcrypt.hash('AdminPass123!', 12),
    role: 'admin',
  })
  admin = request.agent(app)
  await admin.post('/api/auth/login').send({ email: 'root@example.com', password: 'AdminPass123!' })
})

after(async () => {
  await teardown(mongoose)
})

describe('Admin catalog management', () => {
  it('creates and updates a category', async () => {
    const created = await admin.post('/api/admin/categories').send({
      name: 'Premium Ruby',
      slug: 'premium-ruby',
      order: 5,
      active: true,
      parent: null,
    })
    assert.equal(created.status, 201)
    assert.equal(created.body.item.slug, 'premium-ruby')

    const updated = await admin.put(`/api/admin/categories/${created.body.item.id || created.body.item._id}`).send({
      name: 'Premium Ruby Edited',
      slug: 'premium-ruby',
      order: 6,
      active: false,
      parent: null,
    })
    assert.equal(updated.status, 200)
    assert.equal(updated.body.item.name, 'Premium Ruby Edited')
    assert.equal(updated.body.item.active, false)
  })

  it('rejects a duplicate slug', async () => {
    const res = await admin.post('/api/admin/categories').send({ name: 'Sapphire 2', slug: 'sapphire', active: true })
    assert.equal(res.status, 409)
  })

  it('creates, publishes and archives a product', async () => {
    const { Category } = await import('../src/models/Category.js')
    const category = await Category.findOne({ slug: 'sapphire' })

    const created = await admin.post('/api/admin/products').send({
      sku: 'TEST-ADMIN-1',
      name: 'Admin Created Stone',
      slug: 'admin-created-stone',
      category: String(category._id),
      priceState: 'PUBLIC_PRICE',
      pricingType: 'FIXED',
      priceAmount: 12000,
      inventory: 3,
      status: 'ACTIVE',
      isUnique: false,
    })
    assert.equal(created.status, 201)
    assert.equal(created.body.item.status, 'ACTIVE')

    const updated = await admin.put(`/api/admin/products/${created.body.item._id}`).send({
      sku: 'TEST-ADMIN-1',
      name: 'Admin Created Stone',
      slug: 'admin-created-stone',
      category: String(category._id),
      priceState: 'PUBLIC_PRICE',
      pricingType: 'FIXED',
      priceAmount: 12000,
      inventory: 3,
      status: 'ON_HOLD',
      isUnique: false,
    })
    assert.equal(updated.body.item.status, 'ON_HOLD')

    // Public API must not expose non-ACTIVE products.
    const publicList = await request(app).get('/api/products').query({ q: undefined })
    assert.ok(!publicList.body.items.some((p) => p.sku === 'TEST-ADMIN-1'))

    await admin.delete(`/api/admin/products/${created.body.item._id}`).expect(204)
  })

  it('rejects admin mutations without admin role', async () => {
    const customer = request.agent(app)
    await customer.post('/api/auth/register').send({ name: 'C', email: 'c@example.com', password: 'password123' })
    const res = await customer.post('/api/admin/categories').send({ name: 'Nope', slug: 'nope' })
    assert.equal(res.status, 403)
  })
})