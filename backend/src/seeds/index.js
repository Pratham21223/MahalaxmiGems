// Demo seed script (DEVELOPMENT ONLY).
// Populates categories + products with clearly-marked DEMO data so the
// customer-facing catalog renders before admin exists (plan.txt §46).
// Run: npm run seed --workspace backend
import mongoose from 'mongoose'
import { env } from '../config/index.js'
import { connectDB } from '../config/db.js'
import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { Review } from '../models/Review.js'

const categories = [
  { name: 'Sapphire', slug: 'sapphire', parent: null, description: 'Sapphire family of gemstones.', order: 1 },
  { name: 'Blue Sapphire (Neelam)', slug: 'blue-sapphire', parent: 'sapphire', order: 1 },
  { name: 'Yellow Sapphire (Pukhraj)', slug: 'yellow-sapphire', parent: 'sapphire', order: 2 },
  { name: 'Pink Sapphire', slug: 'pink-sapphire', parent: 'sapphire', order: 3 },
  { name: 'Ruby (Manik)', slug: 'ruby', parent: null, order: 2 },
  { name: 'Emerald (Panna)', slug: 'emerald', parent: null, order: 3 },
  { name: 'Pearl (Moti)', slug: 'pearl', parent: null, order: 4 },
  { name: 'Coral (Moonga)', slug: 'coral', parent: null, order: 5 },
  { name: 'Hessonite (Gomed)', slug: 'hessonite', parent: null, order: 6 },
  { name: "Cat's Eye (Lehsunia)", slug: 'cats-eye', parent: null, order: 7 },
  { name: 'Diamond (Heera)', slug: 'diamond', parent: null, order: 8 },
  { name: 'Amethyst', slug: 'amethyst', parent: null, order: 9 },
  { name: 'Aquamarine', slug: 'aquamarine', parent: null, order: 10 },
  { name: 'Blue Topaz', slug: 'blue-topaz', parent: null, order: 11 },
  { name: 'Citrine Stone (Sunela)', slug: 'citrine', parent: null, order: 12 },
  { name: 'Tourmaline', slug: 'tourmaline', parent: null, order: 13 },
  { name: 'Opal', slug: 'opal', parent: null, order: 14 },
  { name: 'Tanzanite', slug: 'tanzanite', parent: null, order: 15 },
  { name: 'Iolite (Neeli)', slug: 'iolite', parent: null, order: 16 },
  { name: 'Jasper (Mahe Mariyam)', slug: 'jasper', parent: null, order: 17 },
  { name: 'Lapis', slug: 'lapis', parent: null, order: 18 },
  { name: 'Rudraksha', slug: 'rudraksha', parent: null, description: 'Sacred Rudraksha beads.', order: 19 },
  { name: '1 Mukhi Rudraksha', slug: '1-mukhi', parent: 'rudraksha', order: 1 },
  { name: '2 Mukhi Rudraksha', slug: '2-mukhi', parent: 'rudraksha', order: 2 },
  { name: '3 Mukhi Rudraksha', slug: '3-mukhi', parent: 'rudraksha', order: 3 },
  { name: '4 Mukhi Rudraksha', slug: '4-mukhi', parent: 'rudraksha', order: 4 },
  { name: '5 Mukhi Rudraksha', slug: '5-mukhi', parent: 'rudraksha', order: 5 },
  { name: '6 Mukhi Rudraksha', slug: '6-mukhi', parent: 'rudraksha', order: 6 },
  { name: '7 Mukhi Rudraksha', slug: '7-mukhi', parent: 'rudraksha', order: 7 },
  { name: '8 Mukhi Rudraksha', slug: '8-mukhi', parent: 'rudraksha', order: 8 },
  { name: '9 Mukhi Rudraksha', slug: '9-mukhi', parent: 'rudraksha', order: 9 },
  { name: '10 Mukhi Rudraksha', slug: '10-mukhi', parent: 'rudraksha', order: 10 },
  { name: '11 Mukhi Rudraksha', slug: '11-mukhi', parent: 'rudraksha', order: 11 },
  { name: '12 Mukhi Rudraksha', slug: '12-mukhi', parent: 'rudraksha', order: 12 },
  { name: '13 Mukhi Rudraksha', slug: '13-mukhi', parent: 'rudraksha', order: 13 },
  { name: '14 Mukhi Rudraksha', slug: '14-mukhi', parent: 'rudraksha', order: 14 },
]

// Per-category demo product generation spec. `sapphire` (the parent) has no products.
const CATALOG = [
  { category: 'blue-sapphire', gemstoneType: 'Blue Sapphire', origins: ['Ceylon', 'Kashmir', 'Thailand', 'Madagascar'], colors: ['Royal Blue', 'Cornflower Blue'], basePrice: 45000, count: 33 },
  { category: 'yellow-sapphire', gemstoneType: 'Yellow Sapphire', origins: ['Ceylon', 'Thailand'], colors: ['Golden Yellow', 'Lemon Yellow'], basePrice: 32000, count: 3 },
  { category: 'ruby', gemstoneType: 'Ruby', origins: ['Burma', 'Mozambique', 'Thailand', 'Tanzania'], colors: ['Pigeon Blood', 'Vivid Red'], basePrice: 98000, count: 5 },
  { category: 'emerald', gemstoneType: 'Emerald', origins: ['Colombia', 'Zambia', 'Panjshir', 'Ethiopia'], colors: ['Vivid Green', 'Green'], basePrice: 56000, count: 5 },
  { category: 'diamond', gemstoneType: 'Diamond', origins: ['Africa', 'India'], colors: ['White', 'Colorless'], basePrice: 120000, count: 3 },
  { category: 'pearl', gemstoneType: 'Pearl', origins: ['Basra', 'South Sea'], colors: ['White', 'Cream'], basePrice: 21000, count: 3 },
  { category: 'coral', gemstoneType: 'Coral', origins: ['Italy', 'Japan'], colors: ['Red', 'Orange'], basePrice: 8000, count: 3 },
  { category: 'hessonite', gemstoneType: 'Hessonite', origins: ['Ceylon', 'Africa'], colors: ['Honey', 'Cinnamon'], basePrice: 6000, count: 3 },
  { category: 'cats-eye', gemstoneType: "Cat's Eye", origins: ['Sri Lanka', 'Brazil'], colors: ['Honey', 'Green'], basePrice: 15000, count: 3 },
  { category: 'amethyst', gemstoneType: 'Amethyst', origins: ['Brazil', 'Zambia'], colors: ['Purple', 'Violet'], basePrice: 4000, count: 3 },
  { category: 'aquamarine', gemstoneType: 'Aquamarine', origins: ['Brazil', 'Mozambique'], colors: ['Light Blue', 'Sea Blue'], basePrice: 12000, count: 3 },
  { category: 'blue-topaz', gemstoneType: 'Blue Topaz', origins: ['Brazil', 'Nigeria'], colors: ['Sky Blue', 'Swiss Blue'], basePrice: 5000, count: 2 },
  { category: 'citrine', gemstoneType: 'Citrine', origins: ['Brazil', 'Madagascar'], colors: ['Yellow', 'Golden'], basePrice: 3500, count: 2 },
  { category: 'tourmaline', gemstoneType: 'Tourmaline', origins: ['Brazil', 'Afghanistan'], colors: ['Pink', 'Green', 'Watermelon'], basePrice: 9000, count: 3 },
  { category: 'opal', gemstoneType: 'Opal', origins: ['Australia', 'Ethiopia'], colors: ['White', 'Fire'], basePrice: 11000, count: 3 },
  { category: 'tanzanite', gemstoneType: 'Tanzanite', origins: ['Tanzania'], colors: ['Blue-Violet'], basePrice: 20000, count: 2 },
  { category: 'iolite', gemstoneType: 'Iolite', origins: ['India', 'Sri Lanka'], colors: ['Violet-Blue'], basePrice: 3000, count: 2 },
  { category: 'jasper', gemstoneType: 'Jasper', origins: ['India', 'Brazil'], colors: ['Red', 'Brown', 'Multicolor'], basePrice: 2000, count: 2 },
  { category: 'lapis', gemstoneType: 'Lapis Lazuli', origins: ['Afghanistan', 'Chile'], colors: ['Deep Blue'], basePrice: 6000, count: 2 },
]

const SHAPES = ['Oval', 'Round', 'Cushion', 'Emerald Cut', 'Cabochon', 'Pear']
const TREATMENTS = ['Unheated', 'Heated', 'Natural', 'Minor Oil', 'No Oil']

// Deterministic demo product generator — no randomness, reproducible reseeds.
function buildGemstoneProducts() {
  const list = []
  let n = 0
  for (const c of CATALOG) {
    for (let i = 0; i < c.count; i++) {
      n++
      const weight = +(1 + ((i * 0.25) % 29)).toFixed(2)
      const origin = c.origins[i % c.origins.length]
      const color = c.colors[i % c.colors.length]
      const shape = SHAPES[i % SHAPES.length]
      const treatment = TREATMENTS[(i + n) % TREATMENTS.length]
      const isUnique = weight <= 2.5
      const priceState = i % 6 === 5 ? 'CONTACT_FOR_PRICE' : 'PUBLIC_PRICE'
      const pricingType = i % 5 === 4 ? 'PER_CARAT' : 'FIXED'
      const amount = Math.round((c.basePrice * (0.5 + weight / 5)) / 100) * 100
      const code = c.category.replace(/-/g, '').toUpperCase().slice(0, 6)
      const images = [
        `${c.gemstoneType} front view`,
        `${c.gemstoneType} side view`,
        `${c.gemstoneType} close-up`,
      ].map((altText, i) => ({ url: '', altText, order: i }))

      list.push({
        sku: `${code}-${String(n).padStart(3, '0')}`,
        name: `${c.gemstoneType} ${weight.toFixed(2)} Carat`,
        slug: `${c.category}-${n}`,
        category: c.category,
        gemstoneType: c.gemstoneType,
        origin,
        treatment,
        weightCarat: weight,
        weightRatti: +(weight * 1.1).toFixed(2),
        color,
        shape,
        clarity: shape === 'Cabochon' ? 'Clean' : 'Eye Clean',
        cut: shape === 'Cabochon' ? 'Cabochon' : 'Faceted',
        dimensions: `${(6 + i).toFixed(1)} x ${(5 + i).toFixed(1)} x ${(3 + i).toFixed(1)} mm`,
        pricing: { type: pricingType, amount, currency: 'INR' },
        priceState,
        inventory: isUnique ? 1 : 2 + (i % 3),
        isUnique,
        description: 'DEMO DATA — development placeholder. Replace with real inventory.',
        images,
      })
    }
  }
  return list
}

function buildRudrakshaProducts() {
  const list = []
  let n = 0
  for (let mukhi = 1; mukhi <= 14; mukhi++) {
    for (let i = 0; i < 2; i++) {
      n++
      const size = +(0.9 + mukhi * 0.04 + i * 0.12).toFixed(2)
      const priceState = i % 2 === 0 ? 'PUBLIC_PRICE' : 'CONTACT_FOR_PRICE'
      const amount = Math.round((600 + mukhi * 350 + i * 150) / 100) * 100
      const images = ['front view', 'side view', 'close-up'].map((v, idx) => ({
        url: '',
        altText: `Rudraksha ${mukhi} Mukhi ${v}`,
        order: idx,
      }))

      list.push({
        sku: `DEMO-RUD-${String(n).padStart(3, '0')}`,
        name: `${mukhi} Mukhi Rudraksha ${size.toFixed(2)} cm`,
        slug: `demo-rudraksha-${mukhi}-mukhi-${i + 1}`,
        category: `${mukhi}-mukhi`,
        gemstoneType: 'Rudraksha',
        origin: 'Nepal',
        treatment: 'Natural',
        color: i % 2 === 0 ? 'Dark Brown' : 'Brown',
        shape: 'Round',
        clarity: '',
        cut: 'Natural',
        dimensions: `${size.toFixed(2)} cm bead`,
        pricing: { type: 'FIXED', amount, currency: 'INR' },
        priceState,
        inventory: 1,
        isUnique: true,
        description: 'DEMO DATA — development placeholder. Replace with real inventory.',
        images,
      })
    }
  }
  return list
}

const products = [...buildGemstoneProducts(), ...buildRudrakshaProducts()]

async function run() {
  await connectDB(env.mongodbUri)
  await Category.deleteMany({})
  await Product.deleteMany({})
  await Review.deleteMany({})

  const catById = new Map()
  for (const c of categories) {
    const doc = await Category.create({ ...c, parent: null })
    catById.set(c.slug, doc)
  }
  for (const c of categories) {
    if (c.parent) {
      const doc = catById.get(c.slug)
      doc.parent = catById.get(c.parent)._id
      await doc.save()
    }
  }

  for (const p of products) {
    const cat = catById.get(p.category)
    const { category, ...rest } = p
    await Product.create({ ...rest, category: cat._id, status: 'ACTIVE' })
  }

  // eslint-disable-next-line no-console
  console.log('Seeded', categories.length, 'categories and', products.length, 'DEMO products.')
  await mongoose.disconnect()
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})