# AGENTS.md

## Overview

Gemstone e-commerce platform (MERN) for a family gemstone business. Monorepo via
npm workspaces: `frontend` (React + Vite + TypeScript + shadcn/ui) and `backend`
(Express + Mongoose, plain JavaScript).

`plan.txt` is the source of truth — read it before any feature work. It defines
the Phase 1 scope, the mandated stack, and hard behavioral rules. It wins over
this file on any conflict.

## Status — Phase 1 (catalog) complete

Customer-facing catalog is built and verified:
- Public pages: Home, Category `/categories/:slug`, Product `/products/:id`,
  Search `/search`, plus placeholder `/contact` and `/gem-suggestions`, and 404.
- Two-tier navbar: top bar (logo · search · account/wishlist/cart icons ·
  "Contact Us") + bottom discovery nav (Home · Gemstones▾ · Jewellery▾ ·
  Gem Suggestions). Mobile uses a single row + drawer (`Sheet`).
- Search has a 20/80 "All ▾" category dropdown and filters via `?category=`.

Still DEFERRED (not built): admin, auth, cart, wishlist, checkout, payments,
orders. Account/Wishlist/Cart icons are inert placeholders (no counts). Products
load via a clearly-marked demo seed — never hardcode the catalog into React.

## Commands (run from repo root)

- `npm run dev` — frontend (Vite :5173) + backend (node --watch :4000)
- `npm run dev:client` / `npm run dev:server` — one side only
- `npm run seed` — (backend) wipe + re-seed 21 demo categories / 60 demo products
- `npm run typecheck` — (frontend) `tsc --noEmit`
- `npm run lint` — frontend `eslint .` + backend `node --check src/server.js`
- `npm run build` — frontend `vite build`; backend has no `build` script, so the
  root build currently fails at the backend step

No test framework configured. No git repo initialized.

## Stack

- Frontend: React 19, Vite, **TypeScript**, Tailwind v4 via `@tailwindcss/vite`
  (no `tailwind.config.js`; styles via `@import "tailwindcss"` in `src/index.css`),
  **shadcn/ui** (`components.json`, `@/` path alias, `src/components/ui/*`). ESLint
  uses `typescript-eslint` (eslint 10). shadcn components import the consolidated
  `radix-ui` package and `lucide-react`.
- Backend: Express 4, **Mongoose** 9, `dotenv` + `pino`. Plain JS (`*.js`,
  `"type": "module"`). Layered structure under `src/`: entry `src/server.js`;
  `config/` (env, logger, db), `controllers/`, `middlewares/`, `models/`,
  `routes/` (categories, products, search, reviews), `seeds/` (demo seed),
  `utils/` (serializers, helpers). "Lint" is `node --check` only (just the entry
  file) — no ESLint on the backend.

## Design system (frontend)

- Tokens in `src/index.css`: `--primary` navy `#050040`, `--color-gold` `#C9A24B`,
  Poppins font (Google Fonts link in `index.html`). `@theme inline` maps shadcn vars.
- Custom utility `.bg-grid` (hero grid background).

## API (public, backend authoritative)

- `GET /api/categories` (tree) · `GET /api/categories/:slug`
- `GET /api/products` — filters `origin/color/shape/treatment/cut/gemstoneType`,
  `minPrice/maxPrice`, `minCarat/maxCarat`, `category`; sort
  `default|price_asc|price_desc|newest`; `page`/`limit`. ACTIVE only;
  `CONTACT_FOR_PRICE` products omit price.
- `GET /api/products/:id`
- `GET /api/search?q=&category=` — `category` slug resolves descendants; Hindi
  aliases: pukhraj/panna/manik/neelam/gomed/lehsunia.

## Config / env

- Backend `.env` (copy `backend/.env.example`): `PORT=4000`,
  `CORS_ORIGIN=http://localhost:5173`,
  `MONGODB_URI=mongodb://127.0.0.1:27017/gemstone_store`. `.env` is gitignored —
  never commit secrets. MongoDB must be running locally.

## Working conventions (from plan.txt)

- Never invent routes, UI layout, business rules, or business data. Ask before
  adding a route/page without an approved design prompt.
- Catalog is database-driven; never hardcode categories/products into React.
  The nav mega-menu uses a curated static config in `src/lib/nav.ts` keyed to
  seeded slugs — don't add slugs that aren't in the seed.
- Backend is authoritative for price/inventory/totals/status; never trust
  frontend-submitted values for business-critical data.
- Demo/test data must be clearly marked (`DEMO-*` SKUs). Small logical `feat:` commits.
