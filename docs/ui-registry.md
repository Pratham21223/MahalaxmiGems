## Baseline - Established 2026-08-30

Note: This baseline captures the Premium Frontend V2 patterns applied across the public catalog pages.

| Property | Correct class |
| --- | --- |
| Page shell | `page-shell` |
| Section spacing | `section-stack` |
| Card background | `bg-white` |
| Card border | `border border-slate-100` |
| Card radius | `rounded-xl` for product/category cards, `rounded-2xl` or `rounded-3xl` for page panels |
| Card shadow | `shadow-card` or `shadow-sm` |
| Panel background | `bg-white` or `bg-surface-soft` |
| Text primary | `text-primary` |
| Text secondary | `text-foreground` |
| Text muted | `text-muted-foreground` |
| Accent text | `text-gold` |
| Eyebrow text | `text-xs font-semibold uppercase tracking-[0.18em] text-gold` |
| Heading text | `font-semibold text-primary` |
| Body text | `text-sm leading-6 text-muted-foreground` |
| Button primary | `rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground` |
| Button contact | `rounded-full bg-[#25D366] px-6 py-3 font-medium text-white` |
| Button secondary | `rounded-full border border-slate-200 bg-white px-4 py-2 text-primary` |
| Focus state | `focus-ring` |
| Input background | `bg-white` |
| Input border | `border border-slate-200` |
| Input focus | `focus:border-gold focus:ring-2 focus:ring-gold/15` |

### Premium Card

File: `frontend/src/index.css`, `frontend/src/components/ProductCard.tsx`, `frontend/src/components/CategoryCard.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | `bg-white` |
| Border | `border border-slate-100` |
| Border radius | `rounded-xl` |
| Text - primary | `text-primary` |
| Text - secondary | `text-foreground`, `text-muted-foreground` |
| Spacing | `p-4`, `p-5`, `gap-3` |
| Hover state | `hover:-translate-y-0.5 hover:border-gold hover:shadow-card` |
| Shadow | `shadow-sm`, `shadow-card` |
| Accent usage | `text-gold`, `bg-gold/10`, `border-gold` |

**Pattern notes:**
Use `premium-card` for repeated catalog items and review cards. Product cards should surface SKU/category context, price state, and compact fact chips without adding unsupported commerce behavior. Product card galleries loop through available images on hover and keyboard focus, while keeping manual arrows and dots available.

### Premium Panel

File: `frontend/src/index.css`, `frontend/src/components/FilterSidebar.tsx`, `frontend/src/pages/ProductPage.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | `bg-white` |
| Border | `border border-slate-100` |
| Border radius | `rounded-2xl` |
| Text - primary | `text-primary` |
| Text - secondary | `text-muted-foreground` |
| Spacing | `p-5`, `p-6`, `p-8` |
| Hover state | none unless interactive |
| Shadow | `shadow-sm` |
| Accent usage | `text-gold`, `bg-surface-soft` |

**Pattern notes:**
Use `premium-panel` for framed functional areas such as filters, review forms, contact placeholders, and summary states. Avoid nesting panels inside cards.

### Section Header

File: `frontend/src/components/SectionHeading.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | none |
| Border | none |
| Border radius | none |
| Text - primary | `text-primary` |
| Text - secondary | `text-gold` |
| Spacing | `mb-6`, `gap-4` |
| Hover state | action link uses `hover:border-gold hover:text-gold` |
| Shadow | none |
| Accent usage | `tracking-[0.18em] text-gold` |

**Pattern notes:**
Eyebrows use uppercase gold microcopy. Section headings should stay concise and use `text-balance` when wrapping is likely.

### Search And Controls

File: `frontend/src/components/SearchControl.tsx`, `frontend/src/components/ProductBrowse.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | `bg-white` |
| Border | `border border-slate-200` |
| Border radius | `rounded-full`, `rounded-md`, `rounded-xl` |
| Text - primary | `text-primary`, `text-foreground` |
| Text - secondary | `text-muted-foreground` |
| Spacing | `px-3`, `px-4`, `py-2`, `gap-1.5`, `gap-2`, `gap-3` |
| Hover state | `hover:bg-slate-100`, `hover:border-gold`, `hover:text-primary` |
| Shadow | `shadow-sm`, dropdown shadow `shadow-[0_24px_70px_rgba(15,23,42,0.14)]` |
| Accent usage | `focus:border-gold`, `focus:ring-gold/15`, `text-gold` |

**Pattern notes:**
Inputs and search controls should share gold focus treatment and visible keyboard focus via `focus-ring`. Navbar search stays compact at `h-11` with an inner `h-9` submit button, so it does not increase navbar height. Suggestions remain compact, product-first, and keyboard navigable.

### Product Scroller

File: `frontend/src/components/ProductScroller.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | none |
| Border | none |
| Border radius | arrow buttons use `rounded-full` |
| Text - primary | `text-primary` |
| Text - secondary | none |
| Spacing | `gap-4`, `pb-4` |
| Hover state | `hover:bg-muted` |
| Shadow | arrow buttons use `shadow` |
| Accent usage | `focus-ring` |

**Pattern notes:**
Horizontal product scrollers auto-scroll right on a timeout and loop back to the start near the end. Auto-scroll pauses on hover and focus so shoppers can inspect cards without the row moving under them.

### Category Showcase

File: `frontend/src/components/CategoryShowcase.tsx`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | `premium-panel`, `bg-white` |
| Border | `border border-slate-100`, hover `hover:border-gold/70` |
| Border radius | `rounded-2xl` for the panel, `rounded-xl` for hero tiles |
| Text - primary | `text-primary`, `text-foreground` |
| Text - secondary | `text-muted-foreground` |
| Spacing | `p-4`, `gap-3`, `py-8`, `gap-6` |
| Hover state | `hover:-translate-y-0.5`, `hover:border-gold/70`, `hover:shadow-card` |
| Shadow | `shadow-card` on hover only |
| Accent usage | `text-gold`, `bg-gold`, `bg-primary/5` |

**Pattern notes:**
Keep homepage collection discovery as the original four tile grid, with quiet timed rotation only. Category page headers should stay simple: text content on the left, one product image or local placeholder on the right. Avoid large active carousel panels, progress controls, and extra UI chrome here.

### Navbar Dropdowns

File: `frontend/src/components/Header.tsx`, `frontend/src/lib/nav.ts`
Last updated: 2026-08-30

| Property | Class |
| --- | --- |
| Background | `bg-white` |
| Border | `border border-slate-100` |
| Border radius | `rounded-xl` for the panel, `rounded-md` for items |
| Text - primary | `text-primary` |
| Text - secondary | `text-muted-foreground` |
| Spacing | `p-5`, `gap-5`, `gap-8`, `space-y-0.5` |
| Hover state | `hover:bg-slate-50`, `hover:text-primary` |
| Shadow | `shadow-[0_18px_50px_rgba(15,23,42,0.12)]` |
| Accent usage | `text-gold`, `bg-gold`, `border-gold` |

**Pattern notes:**
Dropdown collection links should point to real collection routes, not generic search pages. Menus close on route navigation, outside click, Escape, mouse leave, and focus leaving the dropdown group. Keep dropdowns lightweight, white, and retail oriented. Avoid nested tinted panels or decorative dots. Compact numbered labels such as Rudraksha Mukhi items must use `whitespace-nowrap`.

---

## Transactional & admin pages - Established 2026-09-08

Auth, cart, checkout, order confirmation, and admin pages follow the same
baseline tokens with these conventions (see `frontend/src/pages/`).

| Surface | Conventions |
| --- | --- |
| Auth/account panels | `premium-panel` form cards (`mx-auto max-w-md p-8`), full-width `rounded-full bg-primary` submit button, `text-xs font-semibold uppercase tracking-[0.18em] text-gold` eyebrow |
| Cart/order line items | `rounded-2xl border border-slate-100 bg-white p-4 shadow-sm`, product thumb `size-20 rounded-xl bg-slate-50`, qty stepper as `rounded-full border` with p-2 icon buttons, right-aligned `font-semibold text-primary` totals |
| Order summary aside | `h-fit rounded-2xl border ... p-6 shadow-sm lg:sticky lg:top-24`, `flex justify-between` rows, total row `border-t pt-3 font-semibold text-primary` |
| Status chips | `rounded-full px-3 py-1 text-xs font-medium` tinted: emerald (paid/delivered), sky (processing/shipped), amber (pending), rose (cancelled/refunded) — see `lib/orderStatus.ts` |
| Account tabs | pill buttons `rounded-full border px-4 py-2 text-sm`, active = `border-gold bg-gold/10 text-primary` |
| Admin dashboard | tab bar `rounded-full` segmented (active = `bg-primary text-primary-foreground`), management grids `lg:grid-cols-[340px_1fr]` (form panel + list), row `rounded-xl border ... px-4 py-3 text-sm` with `Edit`/`Delete` pill actions |
| Buy Now / Add to Cart | `rounded-full px-6 py-3 font-medium`; primary = `bg-primary text-primary-foreground`, secondary = `border border-slate-200 bg-white text-primary`; WhatsApp = `bg-[#25D366]` |

**Rules:** every action button uses `focus-ring`; money is always `₹{n.toLocaleString('en-IN')}`; forms never trust client totals (server revalidates); guest checkout works without an account; `CONTACT_FOR_PRICE` products never show cart/Buy Now — only WhatsApp.
