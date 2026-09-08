# Phase 1.2 — UI Restyle (Navratan-inspired)

> Status: **PLAN** (verified against all context sources — implementation not started).
> Scope: customer-facing UI only. No new business logic, no cart/checkout/auth/admin.

## 1. Goal

Restyle the entire customer-facing site into a premium, Navratan-inspired design,
using the `HeroSection` in `docs/uidesign.txt` as the visual baseline, adapted to
"Mahalaxmi Gems". High visual fidelity to that component, while mirroring
Navratan's navigation & homepage structure.

## 2. Context sources (all checked)

| Source | What it contributes |
| --- | --- |
| `docs/uidesign.txt` | The reference component (HeroSection): Poppins, navy `#050040`, grid bg, navbar + dropdown + mobile menu, announcement pill, hero heading, CTAs. Plus generic integration notes. |
| `docs/uiprompt.txt` | Hard integration rules: adapt (don't copy branding), preserve layout/colors/interactions, reuse existing components, use existing API, placeholders only, ask when unknown. |
| `plan.txt` | Mandated stack (TS + shadcn), product model, price state (PUBLIC/CONTACT), 3–4 image gallery, no fake data, backend authoritative. |
| `docs/deep-research-report.md` + live navratan.com | Navigation mega-menu, homepage sections, category/product page anatomy. |
| `docs/gemstone-reference.md` | Category names/varieties used in the mega-menu columns. |
| Current repo | JS-only frontend, existing pages/components/API (all reused, not replaced). |

### Conflicts resolved
- **uidesign.txt says "use Unsplash stock images"** vs **uiprompt.txt §11 says no real
  photos, use placeholders** → **placeholder wins** (project-specific rule).
- **uidesign.txt logo is "PrebuiltUI"** → replaced with "Mahalaxmi Gems" wordmark
  (placeholder; real logo supplied by owner later).
- **uidesign.txt nav ("Products/Stories/Pricing")** → replaced by Navratan-style
  nav (Gemstones/Jewellery/…), per owner's instruction.
- **uiprompt.txt §9 claims project is "TS + shadcn"** → actually JS/no-shadcn; the
  owner approved converting to TypeScript + shadcn (Section 4).

## 3. Fidelity requirements (from `uidesign.txt` — must preserve)

- **Font:** Poppins (400–700), applied globally.
- **Hero section:** full-width grid background (local asset, not hotlinked),
  `bg-no-repeat bg-cover bg-center`, bottom padding.
- **Navbar:** horizontal bar, logo left, links center, "Contact Us" button right;
  padding scales `md:px-16 lg:px-24 xl:px-32 md:py-6`.
- **Dropdown (hover):** absolute white panel, rounded, `opacity-0 -translate-y`
  → visible on hover with `transition-all duration-300`; items `hover:translate-x-1
  hover:text-slate-500`.
- **Mobile menu:** full overlay (`backdrop-blur`), width 0→full transition,
  vertical centered links; **ESC closes**, **click-outside closes**,
  **body scroll locked** while open; `aria-hidden` toggling.
- **Announcement pill:** rounded-full bordered pill, centered, "Read more" + arrow.
- **Hero heading:** large centered (`text-4xl md:text-7xl font-medium`), then a
  centered subtitle, then two rounded-full CTAs (filled + outline).
- **Colors:** navy `#050040` for text/icons/strokes; gray-800/black buttons;
  slate borders; hover/darken transitions preserved.
- Keep `<h5>`→semantic `<h1>` (accessibility; uiprompt §18).

## 4. Component mapping (uidesign → our project)

| uidesign.txt part | Our project |
| --- | --- |
| `<style>` Poppins `@import` | Move to `index.html` `<link>` (avoid runtime style tag) |
| Navbar + menu + hamburger + close | `Header` → `TopBar` + `MegaMenu` + mobile `Sheet` |
| "Products" dropdown | `MegaMenu` for **Gemstones** and **Jewellery** (Section 5) |
| Hero section + heading + CTAs | `Home` → new `Hero` component |
| Announcement pill | `Home` → announcement pill (placeholder text) |
| `demo.tsx` (`@/components/ui/hero-section`) | Split into real components under `@/components/` |

## 5. Stack change: TypeScript + shadcn/ui (frontend only)

- Add dev deps: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`.
- Add `tsconfig.json` (Vite React, `strict`, `jsx: react-jsx`, `@/*` alias).
- Rename `frontend/src/**/*.{js,jsx}` → `.tsx`/`.ts`; add `Product`/`Category` types.
- Update ESLint for TypeScript (`typescript-eslint`).
- Initialize shadcn/ui (`components.json`, `@/components/ui`) on Tailwind v4.
- shadcn primitives + icons: `button`, `card`, `navigation-menu`, `sheet`,
  `carousel`, `badge`, `input`, `dropdown-menu`, `lucide-react` (icons per uidesign).
- Backend stays JavaScript this phase (plan.txt §7 backend-TS deferred).

## 6. Design tokens

- Font: **Poppins** (400/500/600/700).
- CSS variables in `index.css`: `--primary: #050040`, `--accent: #C9A24B`,
  slate neutrals, success/danger for stock.
- Radius/shadow/spacing consistent with the reference.

## 7. Navigation (mega-menu) — Navratan structure

Top bar: placeholder phone/currency, working Search, Account/Wishlist/Cart icons (later phases).

Top-level: **Home · Gemstones ▾ · Jewellery ▾ · Gem Suggestions · Contact Us**.

- **Gemstones** (5 columns → `/categories/:slug`):
  - Navratna: Blue Sapphire (Neelam), Yellow Sapphire (Pukhraj), Ruby (Manik),
    Emerald (Panna), Diamond (Heera), Pearl (Moti), Cat's Eye (Lehsunia),
    Hessonite (Gomed), Coral (Moonga)
  - Exclusive Gemstones: Alexandrite, Basra Pearl, Burma Ruby, Colombian Emerald,
    Cornflower Blue Sapphire, Kashmir Blue Sapphire, No-Oil Emerald, Padparadscha,
    Panjshir Emerald, Swat Emerald, Pigeon Blood Ruby, Royal Blue Sapphire
  - Sapphire: Blue, Yellow, Pink, White, Peach, Padparadscha, Color Change,
    Bi-Colour (Pitambari), Green, Purple (Khooni Neelam)
  - More Vedic Ratna (Upratan): Amethyst, Aquamarine, Blue Topaz, Citrine (Sunela),
    Tourmaline, Opal, Tanzanite, Iolite (Neeli), Jasper (Mahe Mariyam), Lapis
  - Specific Collections: Gemstone Pairs, Gemstone Sets, GRS/Gubelin/GIA/ICA/IGI Certified
- **Jewellery**: Rings · Pendant · Earrings · Astrological Rings (placeholder links —
  no jewellery data yet).
- **Gem Suggestions** → placeholder page (owner writes content next phase).
- **Contact Us** → placeholder page (no invented address/phone).
- Mobile: hamburger → `Sheet` (ESC / click-outside / scroll-lock preserved).

## 8. Pages

- **Home**: announcement pill → hero (H1 + tagline + CTAs, placeholder copy) →
  category cards → best-seller grid → collection carousel → jewellery section → footer.
- **Category** `/categories/:slug`: breadcrumbs, title/description, filter sidebar,
  sort, grid, pagination.
- **Product** `/products/:id`: gallery (3–4 images, thumbnails, prev/next, fallback,
  loading), name/SKU, price-or-contact, specs, certificate, WhatsApp, related.
- **Search** `/search`: results grid + empty/error.
- **Contact** & **Gem Suggestions**: placeholder structure only.

## 9. Data / API reuse (no new endpoints)

Existing endpoints (built in Phase 1) cover all UI needs — reuse them verbatim:

- `GET /api/categories` (tree) → mega-menu columns, home category tiles.
- `GET /api/categories/:slug` → category header + breadcrumbs.
- `GET /api/products` with existing params → category grid / home / related:
  - filters: `origin`, `color`, `shape`, `treatment`, `cut`, `gemstoneType`,
    `minPrice`/`maxPrice`, `minCarat`/`maxCarat`, `category`
  - sort: `default`/`price_asc`/`price_desc`/`newest`; `page`/`limit`
- `GET /api/products/:id` → product page.
- `GET /api/search?q=` → search page.

**Filter sidebar maps 1:1 to existing `GET /api/products` params** — no backend work.

## 10. Components

- New: `TopBar`, `MegaMenu`, `Hero`, `CategoryCard`, `CollectionCarousel`,
  `FooterColumns`, `FilterSidebar`.
- Rework to TS + tokens: `Header`, `ProductCard`, `ProductGrid`, `ProductGallery`,
  `PriceDisplay`, `Breadcrumbs`, `Status`.
- Reuse shadcn primitives where fitting.

## 11. Assets & placeholders

- Grid background: local CSS/SVG pattern (never the hotlinked `raw.githubusercontent` URL).
- Product images: existing placeholder fallback (no Unsplash, no real photos).
- Alt text on every image (uiprompt §12).

## 12. Responsive & accessibility

- Mobile/tablet/desktop for nav, mega-menu, gallery, cards, filters.
- Semantic HTML, focus states, alt text, aria labels; preserve ESC/click-outside/
  scroll-lock from the reference.

## 13. Implementation order

1. TS + shadcn scaffold (tsconfig, deps, rename to `.tsx`, `components.json`, tokens).
2. Poppins + design tokens.
3. `TopBar` + `MegaMenu` navigation (+ mobile `Sheet`).
4. Footer.
5. Home page (announcement pill + `Hero` + category tiles + best sellers + carousel).
6. Category page + `FilterSidebar`.
7. Product page (gallery rework).
8. Search page.
9. Contact + Gem Suggestions placeholders.
10. Responsive & accessibility pass.
11. Lint + build + smoke test.

## 14. Verification

- `npm run lint` and `vite build` pass.
- Manual check of Home / Category / Product / Search on mobile + desktop.
- No invented business data; placeholders clearly marked.

## 15. Out of scope

Cart, checkout, payments, auth, admin, wishlist, real images, real business
data/copy, backend changes, astrology/recommendation logic.
