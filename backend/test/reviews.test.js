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

describe('Reviews', () => {
  it('rejects anonymous review submission', async () => {
    const res = await request(app).post('/api/reviews').send({
      product: String(data.normalProduct._id),
      rating: 5,
      comment: 'Anonymous attempt',
    })
    assert.equal(res.status, 401)
  })

  it('accepts a review from a signed-in customer and lists it publicly', async () => {
    const agent = request.agent(app)
    await agent
      .post('/api/auth/register')
      .send({ name: 'Reviewer', email: 'reviewer@example.com', password: 'password123' })
      .expect(201)

    const created = await agent.post('/api/reviews').send({
      product: String(data.normalProduct._id),
      rating: 5,
      title: 'Beautiful stone',
      comment: 'Exactly as described.',
    })
    assert.equal(created.status, 201)
    assert.equal(created.body.review.name, 'Reviewer')

    const list = await request(app)
      .get('/api/reviews')
      .query({ product: String(data.normalProduct._id) })
    assert.equal(list.status, 200)
    assert.equal(list.body.count, 1)
    assert.equal(list.body.average, 5)
    assert.equal(list.body.reviews[0].name, 'Reviewer')
  })
})
