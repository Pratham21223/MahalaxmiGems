import { describe, it, before, after, beforeEach, mock } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { setup, teardown, seedCatalog } from './helpers.js'

// Patch the Razorpay integration with an in-memory stand-in. The order flow
// itself (validation, reservation, snapshots, state machine) is exercised for
// real against the test DB.
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

async function adminAgent() {
  const { User } = await import('../src/models/User.js')
  await User.create({
    name: 'Root Admin',
    email: 'root@example.com',
    passwordHash: await bcrypt.hash('AdminPass123!', 12),
    role: 'admin',
  })
  const agent = request.agent(app)
  await agent.post('/api/auth/login').send({ email: 'root@example.com', password: 'AdminPass123!' })
  return agent
}

before(async () => {
  ;({ app, mongoose } = await setup())
  data = await seedCatalog()
})

beforeEach(async () => {
  // Restore stock so tests are independent.
  const { Product } = await import('../src/models/Product.js')
  await Product.updateMany({}, { $set: { inventory: 5, status: 'ACTIVE' } })
  await Product.updateOne({ _id: data.uniqueProduct._id }, { $set: { inventory: 1 } })
})

after(async () => {
  await teardown(mongoose)
})

describe('Checkout & Orders', () => {
  it('checkout creates a PENDING_PAYMENT order and reserves unique stock', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.uniqueProduct._id), qty: 1 })

    const res = await agent.post('/api/orders').send({ shippingAddress: SHIPPING })
    assert.equal(res.status, 201)
    assert.equal(res.body.order.status, 'PENDING_PAYMENT')
    assert.equal(res.body.order.total, 50000)
    assert.equal(res.body.order.items[0].sku, 'TEST-UNIQUE-1')
    assert.ok(res.body.order.reference)
    assert.ok(res.body.payment.orderId)
    assert.ok(res.body.payment.key)

    const { Product } = await import('../src/models/Product.js')
    assert.equal((await Product.findById(data.uniqueProduct._id)).inventory, 0)
  })

  it('Buy Now (explicit items) also works', async () => {
    const agent = request.agent(app)
    const res = await agent.post('/api/orders').send({
      shippingAddress: SHIPPING,
      items: [{ productId: String(data.normalProduct._id), qty: 2 }],
    })
    assert.equal(res.status, 201)
    assert.equal(res.body.order.items[0].qty, 2)
    assert.equal(res.body.order.total, 16000)
  })

  it('confirm payment verifies signature server-side and marks PAID', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const checkout = await agent.post('/api/orders').send({ shippingAddress: SHIPPING })
    const reference = checkout.body.order.reference

    const confirm = await agent.post(`/api/orders/${reference}/confirm`).send({
      order_id: checkout.body.payment.orderId,
      payment_id: 'pay_test_1',
      signature: 'sig',
    })
    assert.equal(confirm.status, 200)
    assert.equal(confirm.body.order.status, 'PAID')

    // Paid items are removed from the cart so sold stones aren't re-offered.
    const cartAfter = await agent.get('/api/cart')
    assert.equal(cartAfter.body.items.length, 0)
  })

  it('rejects an order from another user (BOLA -> 404)', async () => {
    const buyer = request.agent(app)
    await buyer.post('/api/auth/register').send({ name: 'Buyer', email: 'buyer@example.com', password: 'password123' })
    await buyer.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const checkout = await buyer.post('/api/orders').send({ shippingAddress: SHIPPING })
    const reference = checkout.body.order.reference

    const stranger = request.agent(app)
    await stranger.post('/api/auth/register').send({ name: 'Stranger', email: 'stranger@example.com', password: 'password123' })
    const res = await stranger.get(`/api/orders/${reference}`)
    assert.equal(res.status, 404)
  })

  it('guest order is retrievable with the same guest session', async () => {
    const guest = request.agent(app)
    await guest.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const checkout = await guest.post('/api/orders').send({ shippingAddress: SHIPPING })
    const reference = checkout.body.order.reference
    const res = await guest.get(`/api/orders/${reference}`)
    assert.equal(res.status, 200)
    assert.equal(res.body.order.reference, reference)
  })

  it('admin can process, ship, deliver; invalid transitions are rejected', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const checkout = await agent.post('/api/orders').send({ shippingAddress: SHIPPING })
    const reference = checkout.body.order.reference
    await agent.post(`/api/orders/${reference}/confirm`).send({
      order_id: checkout.body.payment.orderId,
      payment_id: 'pay_test_1',
      signature: 'sig',
    })
    const admin = await adminAgent()

    await admin.patch(`/api/admin/orders/${reference}/status`).send({ status: 'PROCESSING' }).expect(200)
    await admin.patch(`/api/admin/orders/${reference}/status`).send({ status: 'SHIPPED' }).expect(200)
    await admin.patch(`/api/admin/orders/${reference}/status`).send({ status: 'DELIVERED' }).expect(200)

    const bad = await admin.patch(`/api/admin/orders/${reference}/status`).send({ status: 'PROCESSING' })
    assert.equal(bad.status, 400)
  })

  it('non-admin cannot touch admin endpoints (RBAC)', async () => {
    const customer = request.agent(app)
    await customer.post('/api/auth/register').send({ name: 'RBAC', email: 'rbac@example.com', password: 'password123' })
    const res = await customer.get('/api/admin/orders')
    assert.equal(res.status, 403)
  })

  it('cancelling a pending order releases reserved inventory', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.uniqueProduct._id), qty: 1 })
    const checkout = await agent.post('/api/orders').send({ shippingAddress: SHIPPING })
    const reference = checkout.body.order.reference

    await agent.post(`/api/orders/${reference}/cancel`).expect(200)

    const { Product } = await import('../src/models/Product.js')
    assert.equal((await Product.findById(data.uniqueProduct._id)).inventory, 1)
  })

  it('webhook marks PAID once and is idempotent on duplicates', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    const checkout = await agent.post('/api/orders').send({ shippingAddress: SHIPPING })
    const orderId = checkout.body.payment.orderId

    const payload = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_wh_1', order_id: orderId, method: 'upi' } } },
    })

    const first = await request(app)
      .post('/api/orders/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', 'sig')
      .send(payload)
    assert.equal(first.status, 200)

    await request(app)
      .post('/api/orders/webhook')
      .set('Content-Type', 'application/json')
      .set('x-razorpay-signature', 'sig')
      .send(payload)
      .expect(200)

    const { Order } = await import('../src/models/Order.js')
    const order = await Order.findOne({ reference: checkout.body.order.reference })
    assert.equal(order.status, 'PAID')
  })
})