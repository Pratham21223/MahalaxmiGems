# Real Inventory Seeding Guide

This guide explains how to add real gemstone and Rudraksha inventory without deleting or replacing the existing demo products.

## What Exists Today

The backend already has:

- `Category` model in `backend/src/models/Category.js`
- `Product` model in `backend/src/models/Product.js`
- destructive demo seed in `backend/src/seeds/index.js`
- public product APIs that show only products with `status: "ACTIVE"`

The existing command below is still for demo data only. It deletes and recreates demo records:

```bash
npm run seed --workspace backend
```

Do not use that command for real inventory.

## New Real Inventory Workflow

The real inventory importer lives here:

- `backend/src/seeds/inventory/index.js`
- `backend/src/seeds/inventory/inventory.sample.js`

It is additive by default:

- it never deletes records
- it creates new categories and products
- it skips existing categories and products unless you pass `--update-existing`
- it refuses to modify products whose SKU starts with `DEMO-`

Sample products use `status: "DRAFT"`, so they do not appear on the customer site unless you intentionally change them to `ACTIVE`.

## Create Your Editable Inventory File

Copy the sample file:

```bash
copy backend\src\seeds\inventory\inventory.sample.js backend\src\seeds\inventory\inventory.local.js
```

Edit:

```text
backend/src/seeds/inventory/inventory.local.js
```

The `.local.js` file is ignored by git because it may contain private stock, prices, and certificate details.

## Dry Run First

Dry run checks the file and shows what would happen without writing to MongoDB:

```bash
npm run seed:inventory -- --file src/seeds/inventory/inventory.local.js --dry-run
```

If you prefer the backend workspace command directly:

```bash
npm run seed:inventory --workspace backend -- --file src/seeds/inventory/inventory.local.js --dry-run
```

## Import New Records

Run the import:

```bash
npm run seed:inventory -- --file src/seeds/inventory/inventory.local.js
```

By default, existing matching records are skipped.

## Update Existing Real Records

If you intentionally want to update products or categories already imported from your real inventory file, run:

```bash
npm run seed:inventory -- --file src/seeds/inventory/inventory.local.js --update-existing
```

Matching is based on:

- category `slug`
- product `sku` or `slug`

Use stable SKUs. Do not reuse any `DEMO-` SKU for real inventory.

## Add Categories

Categories are added in the exported `categories` array.

Required fields:

- `name`
- `slug`

Optional fields:

- `parentSlug`
- `description`
- `seoTitle`
- `seoDescription`
- `active`
- `order`

Example:

```js
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
]
```

`parentSlug` must point to an existing category slug or to another category in the same file that has already been imported.

## Add Gemstone Products

Products are added in the exported `products` array.

Required fields:

- `sku`
- `name`
- `slug`
- `categorySlug`

Important fields used by the website:

- `description`
- `gemstoneType`
- `origin`
- `treatment`
- `weightCarat`
- `weightRatti`
- `color`
- `shape`
- `clarity`
- `cut`
- `dimensions`
- `pricing`
- `priceState`
- `inventory`
- `isUnique`
- `status`
- `images`
- `certificates`
- `seoTitle`
- `seoDescription`

Use `status: "DRAFT"` while preparing products. Change to `status: "ACTIVE"` when the product is ready for customers.

Example:

```js
{
  sku: 'MG-BS-0001',
  name: 'Blue Sapphire 2.35 Carat',
  slug: 'blue-sapphire-2-35-carat-mg-bs-0001',
  categorySlug: 'blue-sapphire',
  description: 'Owner approved description for this specific stone.',
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
  pricing: { type: 'FIXED', amount: 125000, currency: 'INR' },
  priceState: 'PUBLIC_PRICE',
  inventory: 1,
  isUnique: true,
  status: 'DRAFT',
  images: [],
  certificates: [],
  seoTitle: 'Blue Sapphire 2.35 Carat',
  seoDescription: 'Blue Sapphire 2.35 carat with product details and certificate information.',
}
```

## Add Rudraksha Products

Rudraksha uses the same `Product` model. Use:

- `gemstoneType: "Rudraksha"`
- a Rudraksha category slug such as `5-mukhi`, `rudraksha`, or your own category
- `cut: "Natural"`
- size details in `dimensions`

Example:

```js
{
  sku: 'MG-RUD-0001',
  name: '5 Mukhi Nepal Rudraksha 18 mm',
  slug: '5-mukhi-nepal-rudraksha-18-mm-mg-rud-0001',
  categorySlug: '5-mukhi',
  description: 'Owner approved description for this Rudraksha bead.',
  gemstoneType: 'Rudraksha',
  origin: 'Nepal',
  treatment: 'Natural',
  color: 'Brown',
  shape: 'Round',
  cut: 'Natural',
  dimensions: '18 mm bead',
  pricing: { type: 'FIXED', amount: 3500, currency: 'INR' },
  priceState: 'PUBLIC_PRICE',
  inventory: 3,
  isUnique: false,
  status: 'DRAFT',
  images: [],
  certificates: [],
}
```

## Attach Images

Each product supports multiple images.

Use 3 or 4 images when possible:

```js
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
]
```

If `url` is empty, the frontend shows the existing placeholder view. `altText` is required.

This project does not yet include a production image upload system. For now, image URLs should point to files you serve later from your backend, CDN, or hosting setup.

## Pricing Rules

Use public price:

```js
pricing: { type: 'FIXED', amount: 125000, currency: 'INR' },
priceState: 'PUBLIC_PRICE',
```

Use contact for price:

```js
pricing: { type: 'FIXED', amount: 0, currency: 'INR' },
priceState: 'CONTACT_FOR_PRICE',
```

The frontend will not show a numeric price for `CONTACT_FOR_PRICE`.

Per carat pricing is supported by the schema:

```js
pricing: { type: 'PER_CARAT', amount: 45000, currency: 'INR' },
priceState: 'PUBLIC_PRICE',
```

## Certificates

Certificates are stored inside each product:

```js
certificates: [
  {
    labName: 'GIA',
    reportNumber: 'REAL-REPORT-NUMBER',
    issueDate: '2026-08-30',
    verificationUrl: 'https://example.com/real-verification-url',
    verificationStatus: 'Verified',
    documentRef: '/uploads/certificates/mg-bs-0001.pdf',
  },
]
```

Do not enter certificate values unless they are real.

## Verify Imports

After importing, start the backend and frontend:

```bash
npm run dev
```

Check MongoDB directly:

```js
db.categories.find({ slug: 'premium-blue-sapphire' })
db.products.find({ sku: 'MG-BS-0001' })
```

Check the public API:

```text
http://localhost:4000/api/categories
http://localhost:4000/api/products
```

Only `ACTIVE` products appear in public product APIs. If your imported product is `DRAFT`, that is expected.

To publish a product, change `status` to `"ACTIVE"` in your inventory file and rerun:

```bash
npm run seed:inventory -- --file src/seeds/inventory/inventory.local.js --update-existing
```

## Future CSV Or Excel Imports

This workflow is intentionally simple:

- one importer resolves categories by slug
- one product shape mirrors the Mongoose schema
- insert-only is safe by default
- `--update-existing` supports ongoing inventory corrections

A later CSV or Excel importer can convert rows into the same `categories` and `products` arrays, then reuse this importer logic or write through the same model fields.

## Replacing Demo Content Later

For now, demo products remain untouched.

When your real inventory is ready:

1. add real categories and products in `inventory.local.js`
2. import them as `DRAFT`
3. verify them in MongoDB
4. set selected products to `ACTIVE`
5. rerun with `--update-existing`
6. once the real inventory covers the storefront, decide separately how and when to archive or remove demo products

Do not delete demo data until you are ready and have a separate cleanup plan.
