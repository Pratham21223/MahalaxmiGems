import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { setup, teardown, seedCatalog } from './helpers.js'

let mongoose
let data

before(async () => {
  ;({ mongoose } = await setup())
  data = await seedCatalog()
})

after(async () => {
  await teardown(mongoose)
})

describe('Concurrency (plan.txt §49): two buyers, one unique stone', () => {
  it('only one of two simultaneous reservations succeeds; release restores stock', async () => {
    const { reserveInventory, releaseInventory } = await import('../src/utils/inventory.js')
    const { Product } = await import('../src/models/Product.js')
    const productId = String(data.uniqueProduct._id)

    const [r1, r2] = await Promise.allSettled([
      reserveInventory([{ productId, qty: 1 }]),
      reserveInventory([{ productId, qty: 1 }]),
    ])

    // Exactly one buyer wins the race; the other is rejected.
    const fulfilled = [r1, r2].filter((r) => r.status === 'fulfilled').length
    const rejected = [r1, r2].filter((r) => r.status === 'rejected').length
    assert.equal(fulfilled, 1)
    assert.equal(rejected, 1)

    // Overselling is impossible: inventory is now zero.
    assert.equal((await Product.findById(productId)).inventory, 0)

    // A third attempt is also rejected while reserved.
    const third = await reserveInventory([{ productId, qty: 1 }]).then(
      () => 'fulfilled',
      () => 'rejected',
    )
    assert.equal(third, 'rejected')

    // Releasing the winner restores the single stone.
    const winner = [r1, r2].find((r) => r.status === 'fulfilled')
    await releaseInventory(winner.value)
    assert.equal((await Product.findById(productId)).inventory, 1)
  })

  it('rejects a request that exceeds remaining stock (normal product)', async () => {
    const { reserveInventory } = await import('../src/utils/inventory.js')
    const { Product } = await import('../src/models/Product.js')
    const productId = String(data.normalProduct._id)
    const r = await reserveInventory([{ productId, qty: 99 }]).then(
      () => 'fulfilled',
      () => 'rejected',
    )
    assert.equal(r, 'rejected')
    assert.equal((await Product.findById(productId)).inventory, 5)
  })
})