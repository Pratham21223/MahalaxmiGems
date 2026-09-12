# Phase 1 Implementation Phases

Derived from `plan.txt`. Order is incremental; each phase depends on the prior.

**Scope decision (from product owner):** build the customer-facing website
first. **Admin functionality is deferred** to Phase 4. Until then, products are
loaded via a clearly-marked demo seed script (plan.txt §46) — never hardcoded
into React.

## Status

- ✅ Phase 0 — done (TS + shadcn, Mongoose models, demo seed)
- ✅ Phase 1 — done (public catalog: home/category/product/search pages, two-tier navbar, search with category dropdown)
- ✅ Phase 2 — done (customer auth, guest + logged-in cart, wishlist, WhatsApp enquiry)
- ✅ Phase 3 — done (checkout, Razorpay test mode + verified webhook, order snapshots + state machine, atomic inventory reservation)
- ✅ Phase 4 — done (admin login + `/admin/*` categories/products/orders, security hardening, backend test suite incl. the unique-stone concurrency test)

**The §54 Phase 1 success gate is now code-complete.** The remaining live
dependency is real Razorpay test-mode keys + `ADMIN_EMAIL`/`ADMIN_PASSWORD` in
`backend/.env` (see `backend/.env.example`), after which the end-to-end flow can
be exercised against the running app.

## Phase 0 — Foundation, data layer & seed data
Sources: plan.txt §7, §11, §12, §13, §14, §15, §16

- Resolve stack gaps: TypeScript adoption decision, install `mongoose` +
  `jsonwebtoken`, wire `react-router`, set up shadcn/ui
- Backend bootstrap: env loading (dotenv), logging (pino), CORS, health route
- MongoDB connection
- Mongoose models: categories, products (+ certificates subdocument; carts,
  orders, payments, users added in later phases)
- Product status enum (DRAFT/ACTIVE/ON_HOLD/SOLD/ARCHIVED), unique-gemstone
  (`isUnique`) semantics
- Demo seed script: populate categories + products from the reference list
  (`docs/gemstone-reference.md`), clearly marked as demo data

## Phase 1 — Public catalog (customer-facing, no admin)
Sources: §14, §15, §19, §20, §21, §22, §23

- Public: home, category page (grid, filters, sorting, pagination,
  loading/empty/error), product page (gallery, specs, cert info, price or
  "contact for price"), MongoDB-backed search with aliases

## Phase 2 — Customer & cart
Sources: §17, §18, §24, §25, §26, §31

- Auth: register/login/logout/current-user; guest browsing
- Pricing model (FIXED / PER-CARAT); price state (PUBLIC_PRICE / CONTACT_FOR_PRICE)
- Cart (guest + logged-in): add/remove/quantity, backend-validated subtotal
- WhatsApp enquiry for CONTACT_FOR_PRICE products

## Phase 3 — Checkout, payments, orders
Sources: §17, §27, §28, §29, §30, §48

- Checkout with address fields + backend revalidation (status, inventory, price, total)
- Razorpay test mode + webhook verification (never trust frontend callback)
- Order snapshot (product identity, SKU, purchased price, address, cert ref)
- Order state machine (PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED;
  CANCELLED/REFUNDED)

## Phase 4 — Admin (deferred) & hardening
Sources: §32, §33, §34, §35, §36, §47, §48, §49

- Admin auth + protected `/admin/*` routes: category/product CRUD, image
  placeholder gallery, certificate metadata, publish/hold/sell/archive; order
  view/process/ship/deliver
- Approved static/trust pages only
- SEO foundation; mobile + accessibility pass; loading/empty/error states
- Security (password hashing, authorization, rate limiting, upload validation);
  tests; final §54 Phase 1 success flow

## Gate

Phase 1 is NOT complete until the full §54 flow passes end-to-end:
admin create → publish → customer browse → cart/WhatsApp → checkout →
Razorpay test payment → confirmation → admin verify/process/ship/deliver.
