# Mahalaxmi Gems Frontend Design

source: extracted-from-code

## Character

Mahalaxmi Gems should feel calm, premium, trustworthy, and practical. The visual language uses deep navy for authority, warm gold for emphasis, clean white surfaces, soft slate borders, and measured spacing. The site is a commerce tool first, so product discovery, specifications, and contact actions must stay easy to scan.

## Build Mandate

Build every public screen as a complete catalog experience, not as a placeholder page. Keep the current public routes and backend API. Do not add fake claims, fake statistics, real gemstone photography, cart, checkout, auth, admin, wishlist behavior, or unapproved routes. When real business information is missing, use restrained placeholder copy that makes the missing state clear.

## Token Source

Token values live in `frontend/src/index.css`. Use the CSS variables and Tailwind theme mappings there for colors, radius, typography, shadows, focus treatment, and reusable surfaces.

## Composition Patterns

1. Public pages use a constrained `max-w-7xl` content area with responsive padding.
2. Page headers use a small gold eyebrow only when it helps orientation, then a clear navy heading and short supporting copy.
3. Repeated catalog items use compact cards with stable image ratios, visible facts, and a clear route into product detail.
4. Product detail pages place the gallery and buying confidence information before secondary content.
5. Informational placeholder pages should still feel intentional, with a useful action and context.

## Component And Usage Rules

1. Use `Link` for navigation and `button` for actions.
2. Icon only controls need accessible labels.
3. Preserve meaningful image alt text and the local placeholder image strategy.
4. Loading, empty, and error states must be visible and styled.
5. Avoid fake social proof, fake policies, fake locations, and fake certificate claims.
6. Keep mobile controls at a comfortable touch size.
7. Prefer shared utility classes from `index.css` before inventing new raw values.

## Responsive Behavior

Start mobile first. Product grids use two columns on small screens, three on tablets, and four on desktop. Complex controls such as filters and navigation collapse into clear mobile panels. No page should create horizontal overflow at common phone widths.
