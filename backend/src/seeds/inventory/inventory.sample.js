// Copy this file to inventory.local.js, replace the sample values with real
// inventory, then import it with:
// npm run seed:inventory --workspace backend -- --file src/seeds/inventory/inventory.local.js
//
// Samples use status DRAFT so they do not appear on the public site unless you
// intentionally change a product to ACTIVE.

export const categories = [
  {
    name: 'Premium Blue Sapphire',
    slug: 'premium-blue-sapphire',
    parentSlug: 'sapphire',
    description: 'Selected blue sapphire stones for customers comparing color, origin, and certification.',
    seoTitle: 'Premium Blue Sapphire Gemstones',
    seoDescription: 'Browse selected blue sapphire gemstones with clear product details.',
    active: true,
    order: 101,
  },
  {
    name: 'Nepal Rudraksha',
    slug: 'nepal-rudraksha',
    parentSlug: 'rudraksha',
    description: 'Selected Nepal Rudraksha beads organized for assisted buying.',
    seoTitle: 'Nepal Rudraksha Beads',
    seoDescription: 'Browse Nepal Rudraksha beads with size, mukhi, and price details.',
    active: true,
    order: 102,
  },
]

export const products = [
  {
    sku: 'REAL-SAMPLE-BS-001',
    name: 'Blue Sapphire 2.35 Carat',
    slug: 'blue-sapphire-2-35-carat-real-sample',
    categorySlug: 'premium-blue-sapphire',
    description:
      'Replace this with the real stone description, including visible color, buying notes, and any owner approved details.',
    gemstoneType: 'Blue Sapphire',
    origin: 'Ceylon',
    treatment: 'Heated',
    weightCarat: 2.35,
    weightRatti: 2.59,
    color: 'Royal Blue',
    shape: 'Oval',
    clarity: 'Eye Clean',
    cut: 'Faceted',
    dimensions: '8.2 x 6.1 x 4.0 mm',
    pricing: {
      type: 'FIXED',
      amount: 125000,
      currency: 'INR',
    },
    priceState: 'PUBLIC_PRICE',
    inventory: 1,
    isUnique: true,
    status: 'DRAFT',
    images: [
      {
        url: '/uploads/products/blue-sapphire-2-35-front.jpg',
        altText: 'Blue Sapphire 2.35 carat front view',
        order: 0,
      },
      {
        url: '/uploads/products/blue-sapphire-2-35-side.jpg',
        altText: 'Blue Sapphire 2.35 carat side view',
        order: 1,
      },
      {
        url: '/uploads/products/blue-sapphire-2-35-close-up.jpg',
        altText: 'Blue Sapphire 2.35 carat close-up',
        order: 2,
      },
      {
        url: '/uploads/products/blue-sapphire-2-35-certificate.jpg',
        altText: 'Blue Sapphire 2.35 carat certificate',
        order: 3,
      },
    ],
    certificates: [
      {
        labName: 'Replace with lab name',
        reportNumber: 'Replace with report number',
        issueDate: '2026-08-30',
        verificationUrl: 'https://example.com/replace-with-real-certificate-link',
        verificationStatus: 'Replace with status',
        documentRef: '/uploads/certificates/blue-sapphire-2-35.pdf',
      },
    ],
    seoTitle: 'Blue Sapphire 2.35 Carat',
    seoDescription: 'Blue Sapphire 2.35 carat with product details and certificate information.',
  },
  {
    sku: 'REAL-SAMPLE-RUD-001',
    name: '5 Mukhi Nepal Rudraksha 18 mm',
    slug: '5-mukhi-nepal-rudraksha-18-mm-real-sample',
    categorySlug: 'nepal-rudraksha',
    description:
      'Replace this with real Rudraksha details such as size, origin, bead appearance, and buying notes.',
    gemstoneType: 'Rudraksha',
    origin: 'Nepal',
    treatment: 'Natural',
    weightCarat: null,
    weightRatti: null,
    color: 'Brown',
    shape: 'Round',
    clarity: '',
    cut: 'Natural',
    dimensions: '18 mm bead',
    pricing: {
      type: 'FIXED',
      amount: 3500,
      currency: 'INR',
    },
    priceState: 'PUBLIC_PRICE',
    inventory: 3,
    isUnique: false,
    status: 'DRAFT',
    images: [
      {
        url: '/uploads/products/5-mukhi-rudraksha-front.jpg',
        altText: '5 Mukhi Nepal Rudraksha front view',
        order: 0,
      },
      {
        url: '/uploads/products/5-mukhi-rudraksha-side.jpg',
        altText: '5 Mukhi Nepal Rudraksha side view',
        order: 1,
      },
      {
        url: '/uploads/products/5-mukhi-rudraksha-close-up.jpg',
        altText: '5 Mukhi Nepal Rudraksha close-up',
        order: 2,
      },
    ],
    certificates: [],
    seoTitle: '5 Mukhi Nepal Rudraksha 18 mm',
    seoDescription: '5 Mukhi Nepal Rudraksha bead with size, price, and product details.',
  },
  {
    sku: 'REAL-SAMPLE-EM-001',
    name: 'Emerald 1.82 Carat',
    slug: 'emerald-1-82-carat-real-sample',
    categorySlug: 'emerald',
    description:
      'Replace this with real emerald details. This example uses an existing category slug and contact for price.',
    gemstoneType: 'Emerald',
    origin: 'Zambia',
    treatment: 'Minor Oil',
    weightCarat: 1.82,
    weightRatti: 2.0,
    color: 'Green',
    shape: 'Emerald Cut',
    clarity: 'Included',
    cut: 'Faceted',
    dimensions: '7.4 x 5.8 x 3.6 mm',
    pricing: {
      type: 'FIXED',
      amount: 0,
      currency: 'INR',
    },
    priceState: 'CONTACT_FOR_PRICE',
    inventory: 1,
    isUnique: true,
    status: 'DRAFT',
    images: [
      {
        url: '',
        altText: 'Emerald 1.82 carat front view',
        order: 0,
      },
      {
        url: '',
        altText: 'Emerald 1.82 carat side view',
        order: 1,
      },
      {
        url: '',
        altText: 'Emerald 1.82 carat close-up',
        order: 2,
      },
      {
        url: '',
        altText: 'Emerald 1.82 carat certificate',
        order: 3,
      },
    ],
    certificates: [],
    seoTitle: 'Emerald 1.82 Carat',
    seoDescription: 'Emerald 1.82 carat available for price enquiry.',
  },
]
