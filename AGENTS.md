# AGENTS.md

## Overview

Gemstone e-commerce platform (MERN) for a family gemstone business. Monorepo via
npm workspaces: `frontend` (React 19 + Vite + TypeScript + shadcn/ui) and
`backend` (Express 4 + Mongoose 9, plain JS, ESM).

`docs/plan.txt` is the source of truth — read it before any feature work. It
defines scope, the mandated stack, and hard behavioral rules, and wins over this
file on any conflict. Phase/design context: `docs/implementation-phases.md`,
`real-inventory-seeding.md`, `ui-registry.md`, `backend-principles.md`,
`docs/specs/`.

**Git reality check:** `main` has a single initial-catalog commit; most Phase 2–4
code and doc edits are uncommitted or untracked (`git status` has ~60 entries).
Confirm against the working tree, not HEAD, and never `git clean`/`git checkout .`
blindly.

## Status

Phases 0–4 are code-complete (catalog, auth, cart/wishlist, checkout + Razorpay,
orders, admin, tests). The live end-to-end §54 gate is untested until real
Razorpay test-mode keys + `ADMIN_EMAIL`/`ADMIN_PASSWORD` are set in
`backend/.env`.

Routes live in `frontend/src/App.tsx` (pages lazy-loaded). Customer: `/`,
`/categories/:slug`, `/products/:id`, `/search`, `/gemstones`, `/rudraksha`,
`/about`, `/contact`, `/gem-suggestions`, `/login`, `/register`, `/account`,
`/cart`, `/checkout`, `/order/:reference`, 404. Info/policy pages:
`/location`, `/faqs`, `/gemstone-buying-guide`, `/ring-size-guide`,
`/packaging`, `/shipping-policy`, `/return-exchange`, `/payment-methods`,
`/privacy-policy`. Admin is one tabbed `/admin` page (orders, categories,
products, messages) — there are no `/admin/*` subroutes. Owner-confirmed
contact/policy facts live in `frontend/src/lib/businessInfo.ts` (single source
consumed by the info/FAQ/policy pages); change values there, not per page.

## Commands (from repo root)

- `npm run dev` — Vite :5173 + backend `node --watch` :4000 (`dev:client` /
  `dev:server` for one side)
- `npm run lint` — frontend `eslint .` + backend `node --check src/server.js`;
  the backend has no ESLint or typecheck
- `npm run typecheck --workspace frontend` — root has no `typecheck` script
  (`tsc --noEmit`)
- `npm run test --workspace backend` — node:test + supertest. One file:
  `npm run test --workspace backend -- test/auth.test.js`. Needs a local MongoDB;
  each test file drops `gemstone_store_test` and tests run sequentially
  (`--test-concurrency=1`).
- `npm run build` — frontend `vite build`, then fails at backend `build`, which
  does not exist (expected)
- No root `test` or `seed` scripts — go through `--workspace backend`.

## Seeding — two very different paths

- **Demo reseed (DESTRUCTIVE, dev only):** `npm run seed --workspace backend`
  deletes ALL categories/products/reviews and recreates development data
  (descriptions marked "DEMO DATA"; Rudraksha SKUs `DEMO-RUD-*`). Never run once
  real inventory is loaded.
- **Catalog import (SAFE/ADDITIVE):** `npm run seed:catalog` runs
  `backend/src/seeds/seedInventory.js`. Its default source is
  `backend/src/seeds/inventory/catalog/index.js`; that directory is empty in the
  current tree, so without catalog files the command dies with
  `ERR_MODULE_NOT_FOUND` — pass `--file <path>` or add the catalog files. The
  importer never deletes; matches categories by `slug` and products by
  `sku|slug`; refuses to modify `DEMO-*` SKUs; creates products as `DRAFT`
  (publicly invisible) until set `ACTIVE`. `--dry-run` previews,
  `--update-existing` overwrites catalog fields. Full workflow:
  `docs/real-inventory-seeding.md`.
- Pass importer flags after `--` (`npm run seed:catalog -- --dry-run`). Without
  the `--`, npm swallows the flag and the importer runs in write mode against the
  default source.

## Stack / layout

- Frontend: Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`;
  `@import "tailwindcss"` in `src/index.css`), shadcn/ui (`components.json`, `@/`
  alias to `src/`, consolidated `radix-ui` package), `tw-animate-css`.
  `vite.config.js` (not `.ts`) proxies `/api` and `/health` to :4000, so dev is
  same-origin; `src/lib/api.ts` axios uses `baseURL: '/api'` + `withCredentials`.
  Auth/cart contexts in `src/context/`.
- Backend: `src/app.js` is the `createApp()` factory (tests import it after
  connecting); `src/server.js` is the entry (connect + `ensureAdmin` + listen).
  `models/` (Category, Product, Review, User, Cart, Order), `routes/` (categories,
  products, search, reviews, auth, cart, wishlist, orders, admin), `services/`
  (razorpay, bootstrapAdmin), `seeds/` (demo `index.js`, `seedInventory.js`),
  `utils/` (cart, inventory, pricing, serialize, categoryDescendants), Zod
  schemas in `src/schemas.js` (not `utils/`). Tests in `backend/test/` (not under
  `src/`). Plain JS, ESM, `.js` import extensions.

## Security posture (from `docs/backend-principles.md`)

- Zod allow-list validation on every write; server-side sessions in HttpOnly
  `SameSite=Lax` cookies (no JWT/localStorage); bcrypt cost 12; `requireAdmin`
  deny-by-default.
- BOLA: order lookups are owner/guest-scoped and return 404; customer order URLs
  use UUID references.
- Razorpay: backend creates the order; the webhook is authoritative
  (HMAC-verified, idempotent, mounted with `express.raw` before `express.json` in
  `app.js`), and `/confirm` re-verifies server-side. Never trust a frontend
  payment callback alone.
- Overselling is prevented by an atomic conditional decrement (`findOneAndUpdate`
  on `ACTIVE` + `inventory:{$gte:qty}` in `utils/inventory.js`), released on
  cancel/failure. The two-buyers-one-unique-stone test is
  `backend/test/concurrency.test.js`.
- Known deviation: `mongoose.set('sanitizeFilter', true)` is deliberately NOT
  used — it breaks casting of operator range queries on embedded numeric paths
  (price/carat filters).
- `backend/.env.example` currently ships working Razorpay **test-mode**
  credentials (including the webhook secret). Dev-only; rotate/replace before
  production and never commit real secrets.

## Design system (frontend)

- Tokens in `src/index.css`: navy `--primary` `#050040`, gold `#C9A24B`, Poppins;
  `@theme inline` maps shadcn vars; `.bg-grid` utility.
- `docs/ui-registry.md` holds verified patterns (page-shell/section-stack,
  premium-card/panel, `focus-ring`, status chips,
  `₹{n.toLocaleString('en-IN')}` money). `frontend/design.md` is the extracted
  design mandate. Check both before building new UI.
- Nav mega-menus are curated in `frontend/src/lib/nav.ts` and keyed to seeded
  category slugs — don't add slugs the seed doesn't create.

## API (backend is authoritative)

- `GET /api/categories` (tree) · `GET /api/categories/:slug`
- `GET /api/products` — filters `category`, `notCategory`,
  `origin/color/shape/treatment/cut/gemstoneType`, `min/maxPrice`,
  `min/maxCarat`; sort `default|price_asc|price_desc|newest`; `page`/`limit`.
  ACTIVE only; `CONTACT_FOR_PRICE` products omit price · `GET /api/products/:id`
- `GET /api/search?q=&category=` (descendants + Hindi aliases) ·
  `GET /api/search/suggest?q=&limit=` · `GET /api/reviews` ·
  `POST /api/reviews` (auth; name comes from the session user)
- `POST /api/auth/register|login|logout` · `GET /api/auth/me`
- `GET /api/labs` (checkout lab-report options) · `POST /api/contact`
  (public, Zod + honeypot + rate limit; contact form on `/contact`)
- `GET/POST /api/cart` · `PATCH|DELETE /api/cart/:productId` (guest + logged-in;
  server-computed totals)
- `GET/POST /api/wishlist` · `DELETE /api/wishlist/:productId` (auth)
- `POST /api/orders` (guest or auth; `items` optional = Buy Now; optional
  `labReport: { lab }` selection, all labs free, snapshot + admin status)
  · `GET /api/orders` (auth) · `GET /api/orders/:reference` (owner/guest) ·
  `POST /api/orders/:reference/confirm|cancel` · `POST /api/orders/webhook`
  (raw body)
- `/api/admin/*` (admin): categories/products CRUD · `GET /admin/orders` ·
  `GET /admin/orders/:reference` · `PATCH /admin/orders/:reference/status` ·
  `PATCH /admin/orders/:reference/lab-report` ·
  `GET /admin/contact-messages` · `PATCH /admin/contact-messages/:id/status`

## Config / env

- `backend/src/config/index.js` has safe local defaults, so no `.env` is needed
  for catalog dev. `MONGODB_URI` defaults to
  `mongodb://127.0.0.1:27017/gemstone_store` — MongoDB must be running locally;
  tests always target `gemstone_store_test`.
- For payments/admin, copy `backend/.env.example` → `backend/.env` (gitignored)
  and set `SESSION_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
  `RAZORPAY_WEBHOOK_SECRET`, optionally `ADMIN_EMAIL`/`ADMIN_PASSWORD` (creates
  the first admin at startup). Without Razorpay keys checkout returns 503 and
  reserved inventory is released.

## Working conventions (from plan.txt)

- Never invent routes, UI, business rules, or real business data — ask when a
  product decision is unknown or no design prompt exists. plan.txt §3 lists
  features that must not be built (astrology/AI/referrals/marketplace/etc.).
- Backend is authoritative for price/inventory/totals/status; never trust
  frontend-submitted business values. Catalog is database-driven — never hardcode
  products/categories into React.
- Demo/test data must stay clearly marked (`DEMO-*` where possible / "DEMO DATA"
  descriptions); never reuse a `DEMO-*` SKU for real stock.
- Small logical `feat:` commits. Don't commit unless explicitly asked.
