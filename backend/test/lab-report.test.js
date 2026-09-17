import { describe, it, before, after, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { setup, teardown, seedCatalog } from './helpers.js'

// In-memory Razorpay stand-in, same pattern as checkout-orders.test.js.
let rzpOrderCounter = 0
mock.module('../src/services/razorpay.js', {
  namedExports: {
    createRazorpayOrder: async () => ({ id: `rzp_test_order_${++rzpOrderCounter}` }),
    fetchRazorpayPayment: async () => ({ status: 'captured', method: 'card' }),
    verifyPaymentSignature: () => true,
    verifyWebhookSignature: () => true,
  },
})

let app
let mongoose
let data

const SHIPPING = {
  name: 'Test Buyer',
  email: 'buyer@example.com',
  phone: '9876543210',
  address: '1 Main Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400001',
  country: 'India',
}

before(async () => {
  ;({ app, mongoose } = await setup())
  data = await seedCatalog()
})

beforeEach(async () => {
  const { Product } = await import('../src/models/Product.js')
  await Product.updateMany({}, { $set: { inventory: 5, status: 'ACTIVE' } })
})

after(async () => {
  await teardown(mongoose)
})

describe('Lab report selection', () => {
  it('lists the selectable laboratories', async () => {
    const res = await request(app).get('/api/labs')
    assert.equal(res.status, 200)
    const ids = res.body.items.map((lab) => lab.id)
    assert.ok(ids.includes('GIA'))
    assert.ok(ids.includes('IGI'))
    assert.ok(ids.includes('GII'))
    assert.ok(ids.includes('IIGJ'))
  })

  it('snapshots the chosen lab on the order without changing the total', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })

    const res = await agent
      .post('/api/orders')
      .send({ shippingAddress: SHIPPING, labReport: { lab: 'GIA' } })

    assert.equal(res.status, 201)
    assert.equal(res.body.order.labReport.lab, 'GIA')
    assert.equal(res.body.order.labReport.label, 'GIA')
    assert.equal(res.body.order.labReport.status, 'REQUESTED')
    assert.equal(res.body.order.labReport.fee, 0)
    assert.equal(res.body.order.total, res.body.order.subtotal)
  })

  it('rejects an unknown laboratory', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })

    const res = await agent
      .post('/api/orders')
      .send({ shippingAddress: SHIPPING, labReport: { lab: 'XYZ' } })
    assert.equal(res.status, 400)
  })

  it('lets an admin advance the lab report status for the customer to see', async () => {
    const { User } = await import('../src/models/User.js')
    await User.create({
      name: 'Root Admin',
      email: 'labadmin@example.com',
      passwordHash: await bcrypt.hash('AdminPass123!', 12),
      role: 'admin',
    })
    const admin = request.agent(app)
    await admin
      .post('/api/auth/login')
      .send({ email: 'labadmin@example.com', password: 'AdminPass123!' })

    const buyer = request.agent(app)
    await buyer.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const created = await buyer
      .post('/api/orders')
      .send({ shippingAddress: SHIPPING, labReport: { lab: 'IGI' } })
    const reference = created.body.order.reference

    const updated = await admin
      .patch(`/api/admin/orders/${reference}/lab-report`)
      .send({ status: 'SENT_TO_LAB' })
    assert.equal(updated.status, 200)
    assert.equal(updated.body.item.labReport.status, 'SENT_TO_LAB')

    const publicOrder = await buyer.get(`/api/orders/${reference}`)
    assert.equal(publicOrder.status, 200)
    assert.equal(publicOrder.body.order.labReport.status, 'SENT_TO_LAB')

    const invalid = await admin
      .patch(`/api/admin/orders/${reference}/lab-report`)
      .send({ status: 'NONE' })
    assert.equal(invalid.status, 400)
  })
})
