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

describe('Wishlist', () => {
  it('lists items in the public product shape', async () => {
    const agent = request.agent(app)
    await agent
      .post('/api/auth/register')
      .send({ name: 'Wish List', email: 'wishlist@example.com', password: 'password123' })
      .expect(201)

    const productId = String(data.normalProduct._id)
    await agent.post('/api/wishlist').send({ productId }).expect(201)

    const list = await agent.get('/api/wishlist').expect(200)
    assert.equal(list.body.items.length, 1)
    assert.equal(list.body.items[0].id, productId)
    assert.ok(list.body.items[0].price)
    assert.equal(list.body.items[0].price.amount, 8000)
  })

  it('removes an item and returns the updated id list', async () => {
    const agent = request.agent(app)
    await agent
      .post('/api/auth/register')
      .send({ name: 'Wish Two', email: 'wishlist2@example.com', password: 'password123' })
      .expect(201)

    const productId = String(data.normalProduct._id)
    await agent.post('/api/wishlist').send({ productId }).expect(201)
    const removed = await agent.delete(`/api/wishlist/${productId}`).expect(200)
    assert.deepEqual(removed.body.items, [])
  })
})
