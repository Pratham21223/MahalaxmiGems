# Phase 1 — Catalog (admin + public): Detailed Plan

> Reference: `plan.txt` is the source of truth. This document is a planning
> artifact only — it describes **what** each route, page, and component does and
> does **not** do. It contains no implementation. Routes/UI marked **"pending
> confirmation"** are proposals; plan.txt §39/§40 forbid inventing final routes
> or UI without approval.
>
> **SCOPE CHANGE (product owner):** admin functionality is deferred. Build the
> customer-facing website first (public catalog only); products are loaded via a
> clearly-marked demo seed script. All admin routes/pages/components below are
> **DEFERRED** and listed only for later reference.

## 1. Scope & goal

Customers can discover, browse, filter, search, and inspect products. Admin
(create/manage categories & products) is **deferred** — products are loaded via a
clearly-marked demo seed script for now. The catalog is fully database-driven
(plan.txt §12, §14) — no category or product data is hardcoded into React. The
backend is authoritative for price and inventory (§11).

**Phase 1 does NOT include** (deferred to later phases): cart, checkout,
payment, orders, customer auth/accounts, wishlist, reviews/testimonials,
astrology/birthstone logic, admin order management.

---

## 2. Dependencies on Phase 0 (assumed complete before Phase 1)

- Stack-gap resolution (TypeScript adoption decision; Mongoose, JWT installed).
- Backend bootstrap: env loading, pino logging, CORS, health route, MongoDB
  connection.
- Mongoose `Category` and `Product` models exist (fields defined in §4).
- Frontend: `react-router-dom` wired into `main.jsx`; shadcn/ui set up; API
  client module scaffolded.

---

## 3. Non-negotiable rules carried into every item below

1. Backend never trusts frontend-submitted price, totals, or status for
   business-critical decisions (§11).
2. Public endpoints expose **only `ACTIVE`** products (§15).
3. `CONTACT_FOR_PRICE` products never expose a numeric price (§18).
4. Every product image has meaningful `altText`; images are placeholders (§9).
5. Every page/component handles loading, success, empty, and error states (§47).
6. Demo/test data must be clearly marked as demo data (§46).

---

## 4. Data models (backend, Mongoose)

### 4.1 Category (§14)

| Field | Type | Purpose / behavior |
| --- | --- | --- |
| `name` | String | Display name. |
| `slug` | String | Unique, URL-safe; auto-derived from name on create. |
| `parent` | ObjectId? | Self-reference for hierarchy; null for top level. |
| `description` | String? | Optional long description. |
| `seoTitle` / `seoDescription` | String? | SEO metadata (§35). |
| `active` | Boolean | `false` hides the category and (transitively) its children from public. |
| `order` | Number | Manual ordering for nav/display. |

**Indexes:** unique on `slug`.
**Does NOT hold:** product lists (products reference category, not vice versa),
pricing, inventory.

### 4.2 Product (§13, §19)

| Field | Type | Purpose / behavior |
| --- | --- | --- |
| `sku` | String | Unique, human-readable. |
| `name` | String | Display name. |
| `slug` | String | Unique; auto-derived from name. |
| `category` | ObjectId | Reference to Category. |
| `description` | String | Long description. |
| `gemstoneType` | String | e.g. "Blue Sapphire". |
| `origin` | String? | e.g. "Ceylon". |
| `treatment` | String? | e.g. "Heat treated". |
| `weightCarat` | Number? | Weight in carats. |
| `weightRatti` | Number? | Weight in ratti. |
| `color` | String? | — |
| `shape` | String? | — |
| `clarity` | String? | — |
| `cut` | String? | — |
| `dimensions` | String? | — |
| `pricing` | Object | `{ type: 'FIXED'|'PER_CARAT', amount: Number, currency: String }` (§17). |
| `priceState` | Enum | `PUBLIC_PRICE` \| `CONTACT_FOR_PRICE` (§18). |
| `inventory` | Number | Default 0; governs availability. |
| `isUnique` | Boolean | Unique physical stone; forces quantity semantics (§16). |
| `status` | Enum | `DRAFT`/`ACTIVE`/`ON_HOLD`/`SOLD`/`ARCHIVED` (§15). |
| `images` | Array | `{ url, altText, order }` — 3–4 images, gallery order (§9). |
| `certificates` | Array | `{ labName, reportNumber, issueDate, verificationUrl, verificationStatus, documentRef }` (§19). |
| `seoTitle` / `seoDescription` | String? | SEO (§35). |
| `createdAt` / `updatedAt` | Date | Timestamps. |

**Indexes:** unique `slug`, unique `sku`, index on `category`, `status`,
`gemstoneType`.
**Does NOT hold:** prices set by the frontend, order history, reviews, live
reservation state (that arrives in later phases).

### 4.3 Search aliases (§22)

Maintainable alias map, e.g. `Pukhraj→Yellow Sapphire`, `Panna→Emerald`,
`Manik→Ruby`, `Neelam→Blue Sapphire`, `Gomed→Hessonite`, `Lehsunia→Cat's Eye`.
Used only by search; does not mutate stored data.

---

## 5. Backend API routes

Base URL: `http://localhost:4000/api`. Auth status noted per route.

### 5.1 Public category routes

#### `GET /api/categories`
- **What it does:** returns active categories as a tree (nested by `parent`,
  ordered by `order`). Used by the site navigation and category landing.
- **Does NOT:** return inactive categories; paginate; include products; expose
  internal fields.

#### `GET /api/categories/:slug`
- **What it does:** returns one active category (name, description, SEO fields,
  ancestors for breadcrumbs).
- **Does NOT:** return products (products are fetched via `GET /api/products`);
  return inactive categories (404).

### 5.2 Public product routes

#### `GET /api/products`
- **What it does:** list ACTIVE products with query-string controls:
  - **filters** (`category`, `origin`, `color`, `shape`, `treatment`, `cut`,
    `gemstoneType`, `minPrice`, `maxPrice`, `weightCarat`, `weightRatti`,
    `certificate` presence) — final filter set pending confirmation (§21),
  - **sort** `default` \| `price_asc` \| `price_desc` \| `newest` (§23),
  - **pagination** `page` / `limit`.
- **Response:** paginated items with total count. Numeric price is present only
  for `PUBLIC_PRICE`; `CONTACT_FOR_PRICE` items carry a price-state flag and no
  amount (§18).
- **Does NOT:** return non-ACTIVE products; accept client-computed totals;
  apply sort/filter options outside the approved list.

#### `GET /api/products/:slug`
- **What it does:** full detail for one ACTIVE product — specs, `priceState`,
  price (if public), `images[]`, `certificates[]`, category/SEO info.
- **Does NOT:** return DRAFT/SOLD/ARCHIVED/ON_HOLD products; include cart or
  checkout state; expose admin-only fields.

#### `GET /api/search?q=`
- **What it does:** MongoDB text search across `name`, `gemstoneType`, `sku`,
  `category`, `origin`, expanded via the alias map (§22). Returns ACTIVE
  products in the same shape as `GET /api/products`.
- **Does NOT:** use Elasticsearch/Algolia/Redis; perform semantic/AI search;
  leak non-ACTIVE products.

### 5.3 Admin category routes (auth-protected) — DEFERRED

Auth guard is stubbed in Phase 1 (real JWT auth lands in a later phase); this is
flagged as a security decision to resolve before production.

- `POST /api/admin/categories` — create; auto-generates unique slug.
- `PUT /api/admin/categories/:id` — update fields incl. `active`/`order`/parent.
- `DELETE /api/admin/categories/:id` — delete (business rule pending: block if
  children/products exist vs. cascade).
- `PATCH /api/admin/categories/:id/reorder` — set `order`.

### 5.4 Admin product routes (auth-protected) — DEFERRED

- `GET /api/admin/products` — list **all** statuses (admin view), paginated,
  filterable by status/category.
- `GET /api/admin/products/:id` — single product incl. non-ACTIVE states.
- `POST /api/admin/products` — create (validates required fields, unique
  slug/SKU).
- `PUT /api/admin/products/:id` — update any field incl. images/certificates.
- `PATCH /api/admin/products/:id/status` — transition status; only valid
  transitions from §15 (e.g. DRAFT→ACTIVE, ACTIVE→ON_HOLD/SOLD/ARCHIVED).
- `DELETE /api/admin/products/:id` — remove or archive (business rule pending).

### 5.5 Health

- `GET /health` — liveness probe; returns OK. No data.

---

## 6. Frontend routes & pages

All public routes below are **pending confirmation** (plan.txt §39).

### Public

#### `/` — Home
- **What it does:** hero/brand intro, category navigation, featured/selected
  products, footer. Serves as the discovery entry point.
- **Does NOT:** implement astrology/recommendation/birthstone logic; fetch the
  whole catalog.
- **Design prompt required** (§40).

#### `/categories/:slug` — Category page (§21)
- **What it does:** breadcrumbs, category title + description, product grid,
  filter UI, sorting, pagination, loading/empty/error states.
- **Does NOT:** manage products; contain cart logic; hardcode categories.

#### `/products/:slug` — Product page (§20)
- **What it does:** breadcrumbs, image gallery (3–4 images), name, SKU,
  price-or-contact, availability, weight/origin/treatment/color/shape/clarity/
  cut/dimensions, certificate info, description, "Ask on WhatsApp" (product
  name/SKU/weight/URL — §31), related products.
- **Does NOT (Phase 1):** Add to Cart / Buy Now (Phase 2/3); reviews; live
  inventory reservation.
- **Design prompt required** (§40).

#### `/search?q=` — Search results page
- **What it does:** search input + results grid reusing the product-grid
  component; empty ("No gemstones match your search") and error states (§47).
- **Does NOT:** show non-ACTIVE products.

#### `/404` — Not found
- Generic fallback for unknown routes.

### Admin (DEFERRED — auth & pages exist for Phase 1 CRUD only when admin is built)

#### `/admin/categories`
- **What it does:** list categories (tree view), links to create/edit,
  activate/deactivate, reorder (§32).

#### `/admin/categories/new` and `/admin/categories/:id/edit`
- **What it does:** category form (name, parent, description, SEO, active,
  order).

#### `/admin/products`
- **What it does:** list all products across statuses with status badges,
  filter by status/category, links to create/edit.

#### `/admin/products/new` and `/admin/products/:id/edit`
- **What it does:** product form — SKU, name, category, description,
  gemstoneType, origin, treatment, weights, color/shape/clarity/cut/dimensions,
  pricing, priceState, inventory, isUnique, status, image placeholders with alt
  text, certificate metadata (§32).

#### `/admin/login`, `/admin`, `/admin/orders`
- **Explicitly deferred** to later phases (auth & order management).

---

## 7. Frontend components

Each component describes behavior and, where relevant, what it does **not** do.

### Layout / shell
- **`PublicLayout`** — header (nav, search trigger), footer, `<Outlet>`. Does
  not fetch catalog data itself.
- **`AdminLayout`** — admin nav/sidebar, `<Outlet>`. Does not enforce auth
  (guard is deferred).
- **`Header` / `Footer`** — nav + search entry; footer holds placeholder links.

### Data display
- **`ProductCard`** — image + alt, name, price (or "Contact for price"), link to
  product. Does NOT handle add-to-cart (Phase 2).
- **`ProductGrid`** — maps cards into a responsive grid. Owns no data-fetching.
- **`ProductGallery`** (§10) — main image, thumbnails, previous/next, loading
  state, missing-image fallback. Does NOT upload files.
- **`Breadcrumbs`** — renders ancestor path.
- **`CertificateDisplay`** — lists cert fields (lab, report no., issue date,
  verification URL/status). Does NOT verify or link to fake certs.
- **`PriceDisplay`** — renders price for `PUBLIC_PRICE`, "Contact for price" +
  WhatsApp link for `CONTACT_FOR_PRICE`.
- **`StatusBadge`** — admin-only visual for product/category status.

### Controls / filters
- **`FilterSidebar`** — renders the approved filter controls; emits filter state
  upward. Does NOT fetch products or decide the filter set.
- **`SortDropdown`** — only the four approved sorts (§23).
- **`Pagination`** — page navigation; disabled/loading states.

### Forms (admin)
- **`CategoryForm`** — create/edit fields; client validation; submits to admin
  API.
- **`ProductForm`** — create/edit fields incl. pricing, priceState, inventory,
  isUnique, status, images + alt text, certificates.
- **`ImagePlaceholderManager`** — add/reorder/remove placeholder images with
  mandatory alt text; no real upload in Phase 1.
- **`CertificateFields`** — add/remove certificate metadata entries.

### Feedback / states (§47)
- **`LoadingSpinner`**, **`EmptyState`** (e.g. "No gemstones found."),
  **`ErrorState`** (message + retry).

### Infrastructure
- **`apiClient`** — axios instance with base URL; centralizes error handling.
- **`useProducts` / `useCategory` / `useSearch`** hooks — thin data-fetching
  wrappers around `apiClient` (React Query is optional; see open questions).

---

## 8. Sorting, filtering, search behavior

- **Sorting (§23):** default/relevance, price low→high, price high→low, newest.
  No invented options.
- **Filters (§21):** only the approved subset. Backend applies filters; frontend
  only reflects them.
- **Search (§22):** name, gemstoneType, SKU, category, origin + aliases;
  MongoDB-backed; no external search service.

---

## 9. Images & placeholders (§9, §10)

- 3–4 placeholder images per product, gallery order, mandatory `altText`.
- Reusable missing-image fallback component.
- No scraping, downloading, or generating real gemstone photos. Real images are
  added manually later.

---

## 10. Verification (no test framework configured yet)

Manual/automated checks once implemented:
1. Category create/edit/delete/reorder + hierarchy renders in nav.
2. Product create/edit + status transitions (valid only).
3. Public list respects status gating (non-ACTIVE hidden) and pagination.
4. Filters + all four sort options work; pagination correct.
5. Search returns matches via aliases (e.g. "Pukhraj" finds "Yellow Sapphire").
6. `CONTACT_FOR_PRICE` products never expose a price.
7. Product/category slug lookup returns 404 for unknown/inactive.
8. Loading, empty, and error states render (no blank screens).

---

## 11. Blocking decisions (must confirm before/while building)

1. **Public routes** (§39): confirm `/categories/:slug`, `/products/:slug`,
   `/search`, and home.
2. **Design prompts** (§40): required for Home, Category page, Product page, and
   admin pages.
3. **Approved Phase 1 filter list** (§21).
4. **Admin auth timing**: build real JWT guard now or stub until later phase?
5. **Category delete policy**: block vs. cascade when children/products exist.
6. **Data-fetching choice**: plain axios hooks vs. React Query.
7. **Validation library**: OK to add `express-validator`?

---

## 12. Explicitly out of scope for Phase 1

Cart, checkout, payments, orders, customer accounts/auth, wishlist, reviews,
testimonials, astrology/birthstone/zodiac logic, AI search, multi-vendor,
mobile app, CRM, coupons, multi-currency, multi-language, real image sourcing.
