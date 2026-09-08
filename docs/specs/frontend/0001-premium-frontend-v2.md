# 0001. Premium Frontend Version 2

**Date**: 2026-08-30
**Status**: Implemented

## Summary

This decision upgrades the existing public frontend into a more polished premium commerce experience. The build keeps the current React, Vite, TypeScript, Tailwind, shadcn style, current routes, and current backend API. The work improves trust, discovery, accessibility, responsive layout, and perceived quality without adding cart, checkout, auth, admin, real images, or fake business claims.

## Context

The current frontend is a working catalog, but it reads like a first complete pass. It has the right screens and API flow, yet many surfaces use repeated card patterns, sparse placeholder copy, loose spacing, limited skeleton states, and inconsistent commerce cues. A premium gemstone and Rudraksha brand needs the interface to feel calm, credible, and easy to scan.

The master plan allows frontend polish but forbids silent product invention. The build must not add new routes, new business rules, real product data, fake reviews, fake company claims, real gemstone photography, paid services, or external search tools. The frontend must remain database driven and must continue to respect backend price and inventory authority.

This is an enhancement to an existing public web frontend. No database migration is needed. The safest path is to improve the existing components in place while preserving the current route and API contracts.

## Requirements

**User stories**:

1. As a shopper, I want the site to feel premium and trustworthy so that I feel confident browsing gemstones.
2. As a shopper, I want product discovery to be clear on mobile and desktop so that I can find categories and products quickly.
3. As a shopper, I want product cards and product pages to surface key facts clearly so that I can compare stones without friction.
4. As the owner, I want the frontend to stay inside approved Phase 1 scope so that polish does not create unsupported business promises.

**Acceptance criteria**:

1. **AC-1**: Home, gemstones, rudraksha, category, product, search, about, contact, gem suggestions, and not found pages use one coherent premium visual system.
2. **AC-2**: Header, mobile menu, dropdowns, search, footer, product grids, product cards, filters, gallery, reviews, and forms have consistent spacing, typography, states, and focus treatment.
3. **AC-3**: Search keeps debounced suggestions, product previews, category suggestions, keyboard navigation, loading state, empty state, and recent searches without duplicate search flows.
4. **AC-4**: Category and collection browsing remain powered by existing API calls and URL params, with no hardcoded product catalog in React.
5. **AC-5**: Product pages show price state, availability, WhatsApp enquiry, specifications, certificates, gallery, reviews, and related products with improved hierarchy and mobile layout.
6. **AC-6**: Public pages handle loading, empty, and error states with visible feedback and no unexplained blank areas.
7. **AC-7**: The frontend has no horizontal overflow or clipped content at mobile, tablet, laptop, desktop, and large desktop widths.
8. **AC-8**: Interactive elements are keyboard reachable, visibly focusable, labelled, and semantically appropriate.
9. **AC-9**: Performance improves through component cleanup, route level lazy loading where useful, stable image placeholders, and fewer avoidable re renders.
10. **AC-10**: The build does not add cart, checkout, auth, admin, wishlist behavior, real images, fake reviews, fake stats, fake policies, or unapproved routes.

## Options considered

### Option 1: Fix in place

Improve the existing component system, route components, and styles while keeping current architecture and contracts.

**Pros**:

1. Lowest risk because it preserves working routes and API calls.
2. Fits the master plan because it does not invent new product behavior.
3. Lets every improvement ship in one frontend pass with straightforward rollback.

**Cons**:

1. Existing component boundaries may still constrain some design ideas.
2. Requires care to avoid creating more one off Tailwind styling.

### Option 2: Replace with a parallel frontend shell

Create new Version 2 page shells beside existing pages, move screens over one at a time, and retire old components after parity.

**Pros**:

1. Useful for a live production site where gradual rollout is required.
2. Allows larger visual changes with less concern for old component assumptions.

**Cons**:

1. More code duplication in a small repo.
2. Adds migration work without enough production risk to justify it.

### Option 3: Direct full rewrite

Replace the frontend structure with a new component and page system in one pass.

**Pros**:

1. Cleanest theoretical design system outcome.
2. Removes legacy patterns quickly.

**Cons**:

1. Highest regression risk.
2. Easy to drift into unapproved routes, content, and business behavior.
3. Wasteful for a frontend that already has the correct core catalog flows.

## Decision

**Chosen option**: Option 1: Fix in place

Upgrade the existing public frontend in place, using shared tokens and reusable components, while preserving the current route map, API contracts, and Phase 1 product rules.

## Rationale

The app already has the correct public catalog architecture. The weakness is product quality, not the route model or backend contract. A direct rewrite would spend energy recreating working behavior and would increase the chance of silently inventing product decisions. A parallel shell is more ceremony than this repo needs because there is no initialized Git history, no production rollout machinery, and no live traffic requirement recorded.

Fixing in place lets the build focus on visible quality. The upgrade should turn scattered styling into a small design language, improve layout hierarchy, make search and discovery feel deliberate, and strengthen trust without adding unsupported claims.

## Feature design

**Data model sketch**:

No schema changes.

1. `Category` remains the API source for navigation, category pages, and home category cards.
2. `Product` remains the API source for product grids, cards, gallery, price state, inventory, specifications, certificates, and related products.
3. `Review` remains the API source for the existing review section.
4. Recent searches remain client only in `localStorage`.

**State transitions**:

No business state machine changes. UI state remains local to components for dropdown open state, mobile sheet state, gallery index, filters, sorting, pagination, review submission, and search suggestions.

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `/api/categories` | GET | none | category tree | public | network error |
| `/api/categories/:slug` | GET | `slug` | category and ancestors | public | 404 |
| `/api/products` | GET | `category`, `notCategory`, filters, `sort`, `page`, `limit` | paged product list | public | network error |
| `/api/products/:id` | GET | `id` | product detail | public | 404 |
| `/api/search` | GET | `q`, `category` | search results | public | network error |
| `/api/search/suggest` | GET | `q`, `limit` | product and category suggestions | public | network error |
| `/api/reviews` | GET | `product` | review summary | public | network error |
| `/api/reviews` | POST | product id, name, rating, title, comment | review summary | public | 400, 404 |

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Render navigation | gemstone and rudraksha labels | `src/lib/nav.ts`, restricted to seeded slugs |
| Render page routes | route map | `src/App.tsx`, existing approved public routes |
| Render product card | name, image alt, origin, price state, public price | `Product` API response |
| Render product card fallback image | placeholder label and variant | product image alt text, product gemstone type, local placeholder component |
| Render category browsing | category title, ancestors, filters, products, totals | category API, products API, URL search params |
| Render search suggestions | product preview, category suggestion, contact price text | suggest API response and `formatPrice` |
| Render product page | gallery, specs, certificates, related products, WhatsApp message | product API response, products API response, current browser URL |
| Render trust copy | generic certification and WhatsApp cues | existing placeholder copy only, no invented stats |
| Render review summary | average, count, list, pending form state | reviews API response and local form state |
| Render loading and error states | skeletons, empty text, retry actions | local fetch state from `useFetch` and `useSearchSuggest` |

**Key invariants**:

1. `CONTACT_FOR_PRICE` products never show a numeric amount when the API returns `price: null`.
2. Cart, wishlist, account, checkout, payment, and admin remain inert or absent until their phases are approved.
3. Product catalog data is never hardcoded into React.
4. Real gemstone images are not downloaded, generated, or sourced from the web.
5. Placeholder trust copy must be clearly generic and must not claim real history, counts, shipping guarantees, or policies.
6. Existing API paths and existing page routes remain stable.

**Security model**:

All current public frontend routes remain public. No new protected UI is added. Review submission keeps the existing backend validation. No secrets, keys, or paid external services are introduced.

**Configuration required**:

None.

**Critical test scenarios**:

1. Happy path: home to gemstones to category to product to WhatsApp enquiry, verifies **AC-1**, **AC-4**, **AC-5**, **AC-10**.
2. Search path: type a query, navigate suggestions by keyboard, open a product, verifies **AC-2**, **AC-3**, **AC-8**.
3. Browsing path: apply filters, change sort, paginate, refresh, verifies **AC-4**, **AC-6**, **AC-7**.
4. Product fallback path: product with empty image URLs still shows gallery placeholders and alt labels, verifies **AC-5**, **AC-8**, **AC-10**.
5. Responsive path: check mobile, tablet, desktop, and wide desktop for overflow and clipped text, verifies **AC-7**.
6. Failure path: backend unavailable shows error states on major pages, verifies **AC-6**.

## Build plan

1. Tighten global tokens, typography, layout rhythm, focus styles, surfaces, buttons, badges, and skeleton primitives, satisfies **AC-1**, **AC-2**, **AC-6**, **AC-8**.
2. Refactor shared UI helpers for section headers, status states, product placeholders, price display, and action styling, satisfies **AC-1**, **AC-2**, **AC-6**, **AC-9**.
3. Upgrade header, desktop dropdowns, mobile sheet, active affordances, and footer information architecture within existing routes, satisfies **AC-1**, **AC-2**, **AC-7**, **AC-8**, **AC-10**.
4. Upgrade search UI around the existing suggestion API, including cleaner previews, keyboard focus, loading, empty, and recent search states, satisfies **AC-2**, **AC-3**, **AC-8**, **AC-9**.
5. Redesign home sections to reduce repetition and guide discovery with current catalog data, existing placeholders, and no fake claims, satisfies **AC-1**, **AC-4**, **AC-6**, **AC-10**.
6. Upgrade collection, category, filter, sort, pagination, product grid, and product card surfaces for scan speed and responsive behavior, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-6**, **AC-7**.
7. Upgrade product page hierarchy, gallery, certificate display, specifications, WhatsApp CTA, related products, and review section, satisfies **AC-1**, **AC-5**, **AC-6**, **AC-7**, **AC-8**.
8. Upgrade placeholder informational pages and not found page without adding new routes or claims, satisfies **AC-1**, **AC-6**, **AC-10**.
9. Add route level lazy loading and memoization only where it reduces obvious rendering or bundle cost without complexity, satisfies **AC-9**.
10. Run typecheck, lint, and production build where possible, then smoke test key responsive flows, satisfies **AC-6**, **AC-7**, **AC-8**, **AC-9**.

## Consequences

**Positive**:

1. The public catalog should feel more premium and more trustworthy without waiting for cart or admin phases.
2. The design system becomes easier to extend in later customer and checkout work.
3. The frontend remains compatible with current backend data and demo seed rules.

**Negative / tradeoffs**:

1. The work improves perception but does not complete commerce because cart, checkout, auth, and admin are still out of scope.
2. Some copy remains placeholder because real business details were not supplied.
3. In place upgrades require discipline to avoid leaving old styling patterns beside new ones.

**Neutral**:

1. No database migration is needed.
2. No new environment variables are needed.
3. No new paid service is needed.

## Follow-up

1. [ ] Add real owner approved business copy for about, contact, policies, shipping, returns, and trust surfaces before production.
2. [ ] Replace demo placeholder images with real product images supplied by the owner.
3. [ ] Create a separate approved spec before adding cart, checkout, auth, admin, policies, fake review prevention, or real order flows.
4. [ ] Add a browser based visual verification pass once the frontend build is complete.

## Migration plan

**Strategy**: no migration needed

**Phases**:

1. Improve shared tokens and components.
2. Upgrade route surfaces in place.
3. Verify existing flows still work.

**Rollback**: revert the frontend edits from this pass.

**Risks**: visual regressions, accidental unsupported claims, accidental changes to route behavior, and mobile overflow.
