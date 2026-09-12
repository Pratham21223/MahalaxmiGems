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

## Catalog Workflow (one file per gemstone)

The importer lives here:

- `backend/src/seeds/seedInventory.js` — the additive importer
- `backend/src/seeds/inventory/catalog/index.js` — aggregates the gemstone files
- `backend/src/seeds/inventory/catalog/<gemstone>.js` — one file per gemstone, each holding one sample product

It is additive by default:

- it never deletes records
- it creates new categories and products
- it skips existing categories and products unless you pass `--update-existing`
- it refuses to modify products whose SKU starts with `DEMO-`
- it matches categories by `slug`, and products by `sku` or `slug`

Sample products use `status: "DRAFT"`, so they do not appear on the customer site unless you intentionally change them to `ACTIVE`.

## Edit The Catalog Files

Each gemstone family has its own file:

```text
backend/src/seeds/inventory/catalog/
├── blueSapphire.js      ├── citrine.js
├── yellowSapphire.js    ├── tourmaline.js
├── pinkSapphire.js      ├── opal.js
├── ruby.js              ├── tanzanite.js
├── emerald.js           ├── iolite.js
├── diamond.js           ├── jasper.js
├── pearl.js             ├── lapis.js
├── coral.js             ├── rudraksha.js
├── catsEye.js           └── index.js
├── hessonite.js
├── amethyst.js
├── aquamarine.js
└── topaz.js
```

Everything in those files is placeholder data. To add stock, duplicate the sample product object inside the relevant file and replace the values with real details. Keep `sku` and `slug` unique — the aggregator refuses to load duplicate values.

To add a new gemstone family, create `<gemstone>.js` next to them and register it in `catalog/index.js`.

If you would rather keep private inventory in a single file, the importer still accepts `--file`:

```bash
npm run seed:catalog -- --file src/seeds/inventory/<your-file>.js
```

## Dry Run First

Dry run shows what would happen without writing to MongoDB:

```bash
npm run seed:catalog --workspace backend -- --dry-run
```

The short root form also works:

```bash
npm run seed:catalog -- --dry-run
```

Both forms forward `--file` / `--dry-run` / `--update-existing` to the importer,
and the importer prints the source it resolved. Always confirm the printed source
and the summary table before dropping `--dry-run`.

> Warning: never call the importer with args on a script that does not end in
> `--`. npm then treats `--file` as an npm config flag, silently falls back to
> the default source, and runs in **write** mode.

## Import New Records

Run the import:

```bash
npm run seed:catalog
```

By default, existing matching records are skipped.

## Update Existing Real Records

If you intentionally want to update products or categories already imported, run:

```bash
npm run seed:catalog -- --update-existing
```

Two things worth knowing about `--update-existing`:

- It also updates every category listed in the gemstone files. `topaz.js` lists `blue-topaz` so it can re-parent it under the new `topaz` parent — that re-parent is applied on this run.
- It overwrites the fields present in the catalog file, so edits made only in the admin UI are reset to the catalog values.

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
    name: "Premium Blue Sapphire",
    slug: "premium-blue-sapphire",
    parentSlug: "sapphire",
    description:
      "Selected blue sapphire stones for customers comparing color, origin, and certification.",
    seoTitle: "Premium Blue Sapphire Gemstones",
    seoDescription:
      "Browse selected blue sapphire gemstones with clear product details.",
    active: true,
    order: 101,
  },
];
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
  seoTitle: 'Blue Sapphire 2.35 Carat',
  seoDescription: 'Blue Sapphire 2.35 carat with product details and specifications.',
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
}
```

## Attach Images

Each product supports multiple images.

Use 3 or 4 images when possible:

```js
images: [
  {
    url: "/uploads/products/blue-sapphire-2-35-front.jpg",
    altText: "Blue Sapphire 2.35 carat front view",
    order: 0,
  },
  {
    url: "/uploads/products/blue-sapphire-2-35-side.jpg",
    altText: "Blue Sapphire 2.35 carat side view",
    order: 1,
  },
  {
    url: "/uploads/products/blue-sapphire-2-35-close-up.jpg",
    altText: "Blue Sapphire 2.35 carat close-up",
    order: 2,
  },
];
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

## Verify Imports

After importing, start the backend and frontend:

```bash
npm run dev
```

Check MongoDB directly:

```js
db.categories.find({ slug: "blue-sapphire" });
db.products.find({ sku: "MG-BS-0001" });
```

Check the public API:

```text
http://localhost:4000/api/categories
http://localhost:4000/api/products
```

Only `ACTIVE` products appear in public product APIs. If your imported product is `DRAFT`, that is expected.

To publish a product, change `status` to `"ACTIVE"` in its catalog file and rerun:

```bash
npm run seed:catalog -- --update-existing
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

1. replace the placeholder products in `src/seeds/inventory/catalog/*.js` with real stones
2. import them as `DRAFT`
3. verify them in MongoDB
4. set selected products to `ACTIVE`
5. rerun with `--update-existing`
6. once the real inventory covers the storefront, decide separately how and when to archive or remove demo products

Do not delete demo data until you are ready and have a separate cleanup plan.
