import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { setup, teardown, seedCatalog } from './helpers.js'

let app
let mongoose
let data

before(async () => {
  ;({ app, mongoose } = await setup())
  data = await seedCatalog()
})

after(async () => {
  await teardown(mongoose)
})

describe('Cart', () => {
  it('guest cart: add, totals are server-computed, update, remove', async () => {
    const agent = request.agent(app)
    const add = await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 2 })
    assert.equal(add.status, 201)
    assert.equal(add.body.items.length, 1)
    assert.equal(add.body.subtotal, 16000)
    assert.equal(add.body.count, 2)

    const update = await agent.patch(`/api/cart/${data.normalProduct._id}`).send({ productId: String(data.normalProduct._id), qty: 3 })
    assert.equal(update.body.count, 3)
    assert.equal(update.body.total, 24000)

    const remove = await agent.delete(`/api/cart/${data.normalProduct._id}`)
    assert.equal(remove.body.items.length, 0)
  })

  it('rejects contact-for-price products in cart', async () => {
    const agent = request.agent(app)
    const res = await agent.post('/api/cart').send({ productId: String(data.contactProduct._id), qty: 1 })
    assert.equal(res.status, 400)
  })

  it('limits quantity to available stock and unique stones to 1', async () => {
    const agent = request.agent(app)
    const over = await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 99 })
    assert.equal(over.status, 400)
    const unique2 = await agent.post('/api/cart').send({ productId: String(data.uniqueProduct._id), qty: 2 })
    assert.equal(unique2.status, 400)
  })

  it('merges guest cart into account on register', async () => {
    const agent = request.agent(app)
    await agent.post('/api/cart').send({ productId: String(data.normalProduct._id), qty: 1 })
    await agent.post('/api/auth/register').send({ name: 'Cart Merge', email: 'cartmerge@example.com', password: 'password123' })
    const cart = await agent.get('/api/cart')
    assert.equal(cart.body.items.length, 1)
    assert.equal(cart.body.items[0].sku, 'TEST-NORMAL-1')
  })
})