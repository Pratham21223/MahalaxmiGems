import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { setup, teardown } from './helpers.js'

let app
let mongoose

before(async () => {
  ;({ app, mongoose } = await setup())
})

after(async () => {
  await teardown(mongoose)
})

describe('Auth', () => {
  it('registers a customer and establishes a session', async () => {
    const agent = request.agent(app)
    const res = await agent.post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    })
    assert.equal(res.status, 201)
    assert.equal(res.body.user.role, 'customer')

    const me = await agent.get('/api/auth/me')
    assert.equal(me.status, 200)
    assert.equal(me.body.user.email, 'alice@example.com')
  })

  it('rejects duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'password123' })
      .expect(201)
    const dup = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob2', email: 'bob@example.com', password: 'password123' })
    assert.equal(dup.status, 409)
  })

  it('rejects weak passwords and malformed emails (validation)', async () => {
    const weak = await request(app).post('/api/auth/register').send({ name: 'X', email: 'x@example.com', password: 'short' })
    assert.equal(weak.status, 400)
    const bad = await request(app).post('/api/auth/login').send({ email: 'not-an-email', password: 'whatever1' })
    assert.equal(bad.status, 400)
  })

  it('rejects wrong password without leaking user existence', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'alice@example.com', password: 'wrongpass' })
    assert.equal(res.status, 401)
    assert.match(res.body.error, /invalid/i)
  })

  it('logs out and invalidates the session', async () => {
    const agent = request.agent(app)
    await agent.post('/api/auth/register').send({ name: 'Carol', email: 'carol@example.com', password: 'password123' })
    await agent.post('/api/auth/logout').expect(204)
    const me = await agent.get('/api/auth/me')
    assert.equal(me.status, 401)
  })

  it('guards /me and admin endpoints without auth', async () => {
    assert.equal((await request(app).get('/api/auth/me')).status, 401)
    assert.equal((await request(app).get('/api/admin/categories')).status, 401)
  })
})