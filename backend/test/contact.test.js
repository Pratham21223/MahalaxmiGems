import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { setup, teardown } from './helpers.js'

let app
let mongoose
let admin

const VALID = {
  name: 'Asha',
  email: 'asha@example.com',
  phone: '9876543210',
  subject: 'Product enquiry',
  message: 'Please share details about blue sapphire.',
}

before(async () => {
  ;({ app, mongoose } = await setup())
  const { User } = await import('../src/models/User.js')
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

describe('Contact form', () => {
  it('stores a valid enquiry', async () => {
    const res = await request(app).post('/api/contact').send(VALID)
    assert.equal(res.status, 201)
    assert.equal(res.body.ok, true)

    const { ContactMessage } = await import('../src/models/ContactMessage.js')
    assert.equal(await ContactMessage.countDocuments({ email: 'asha@example.com' }), 1)
  })

  it('rejects invalid input', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '', email: 'not-an-email', subject: '', message: '' })
    assert.equal(res.status, 400)
  })

  it('silently absorbs honeypot submissions', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ ...VALID, email: 'bot@example.com', website: 'https://spam.example' })
    assert.equal(res.status, 201)

    const { ContactMessage } = await import('../src/models/ContactMessage.js')
    assert.equal(await ContactMessage.countDocuments({ email: 'bot@example.com' }), 0)
  })

  it('keeps the inbox admin-only and lets admins mark messages read', async () => {
    const anon = await request(app).get('/api/admin/contact-messages')
    assert.equal(anon.status, 401)

    const list = await admin.get('/api/admin/contact-messages')
    assert.equal(list.status, 200)
    assert.equal(list.body.items.length, 1)

    const id = list.body.items[0]._id
    const updated = await admin
      .patch(`/api/admin/contact-messages/${id}/status`)
      .send({ status: 'READ' })
    assert.equal(updated.status, 200)
    assert.equal(updated.body.item.status, 'READ')
  })
})
