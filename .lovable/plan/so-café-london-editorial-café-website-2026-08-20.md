# SO Café London — Editorial Café Website

A single-page, art-directed homepage plus a full menu route, built to push one action: come to the café at Maida Vale Station.

## Design system

- Palette (oklch tokens in `src/styles.css`): deep espresso `#231a15`-range as primary/ink, warm parchment cream background, terracotta accent for CTAs, muted olive as a secondary accent for the healthier-options moments. Neutral interface so photography dominates.
- Type: expressive editorial serif for display headings + clean sans for body, loaded via `<link>` in `__root.tsx`. Strong scale jumps between hero, section titles, labels, and prices.
- Detail language: thin rules, small uppercase tracked labels, mixed full-bleed and contained sections, varied image ratios, asymmetry. No uniform rounded-card grid, no gradients, no glassmorphism.
- Motion: one reusable scroll-reveal hook (fade/rise), gentle image scale on hover, smooth anchor scroll. Nothing looping or parallax.

## Page structure (`src/routes/index.tsx`)

1. Sticky-light nav — wordmark, Home / Menu / About / Reviews / Visit anchors, `GET DIRECTIONS` CTA. Mobile: brand + sheet menu, plus fixed bottom bar `MENU | DIRECTIONS | VISIT`.
2. Hero — asymmetric editorial split: "Great Coffee. Fresh Doughnuts. London Energy." with supporting line, `VISIT SO CAFÉ` + `VIEW MENU`, location microcopy, 4.9★/582 trust line; large food photo with one smaller overlapping detail crop. Mobile reorders so the food image stays dominant.
3. Trust strip — 4.9★ · 582 reviews · £1–10 per person · Maida Vale, as an editorial row with hairline separators, not stat cards.
4. Signature showcase — "Coffee Worth Stopping For. Treats Worth Coming Back For." One large feature block + smaller supporting items covering coffee, doughnuts, brioche, brownies, cheesecake, baked goods. Only verified item names (Bombolone, Custard Cream, Chocolate Hazelnut Donut, Brioche, Tiramisu, Bread).
5. Story — "A Little More Than Your Morning Coffee." Experience-led copy only; no invented history.
6. Menu highlights — categories Coffee / Doughnuts / Baked Goods / Desserts / Healthy Options, items listed with `[MENU DESCRIPTION]` and `[MENU PRICE]` where unverified. CTA `VIEW FULL MENU` → `/menu`.
7. Why people love SO Café — 4 pillars: Exceptional Coffee, Freshly Baked Treats, Something for Every Mood, Warm Friendly Energy. Qualitative only.
8. Reviews — 4.9★ from 582 reviews headline, editorial stacked/carousel layout. No fabricated quotes or names: review cards ship as clearly marked `[REVIEW QUOTE]` / `[REVIEWER NAME]` placeholders ready to fill with real Google review text, plus `SEE MORE REVIEWS` with an unset destination.
9. Coffee + doughnut brand moment — full-bleed image, "Make It a Coffee & Doughnut Kind of Day.", Maida Vale line, `GET DIRECTIONS`.
10. Atmosphere gallery — varied grid (one large, two small, one tall portrait, one detail crop), all marked as replaceable until real café photos are supplied.
11. Opening hours — editorial list of the supplied hours with a live `OPEN NOW` / `CLOSED — OPENS AT …` badge computed in London time from those hours only.
12. Location — two-column: full supplied address + Plus Code `GRH7+WM` on the left, embedded map focused on Maida Vale Station on the right, large `GET DIRECTIONS`.
13. Final CTA — "Next Time You're In Maida Vale, Stop By." with `GET DIRECTIONS` + `VIEW MENU`.
14. Footer — name, address, Dine-in / Drive-through / No-contact delivery, hours summary, nav links. No phone, email, or socials.

## Menu route (`/menu`)

Same design system, full category listing with the verified items and `[MENU PRICE]` placeholders, back-to-home nav, own head metadata.

## Imagery

Generated food and interior photography in a consistent warm-natural-light, shallow-depth-of-field editorial style: hero coffee-and-doughnut composition, doughnut/bombolone detail, brioche and baked goods, brownie/cheesecake dessert, coffee pour, counter display, interior seating, station-forecourt exterior. All stored in `src/assets`, imported directly, lazy-loaded below the fold, descriptive alt text. Structured so real photos can drop in later.

## Content accuracy

Nothing invented: no phone, email, founder story, awards, prices, delivery platforms, parking, Wi-Fi, dietary certifications, or social accounts. Unknowns render as visible `[PLACEHOLDER]` text.

## Technical notes

- Components under `src/components/site/`: `SiteNav`, `MobileActionBar`, `SectionLabel`, `CtaButton`, `FoodFeature`, `MenuList`, `ReviewCard`, `OpeningHours`, `LocationBlock`, `Gallery`, `SiteFooter`, plus a `useReveal` hook.
- Semantic landmarks, single `h1`, keyboard-reachable nav with visible focus rings, ≥16px body text, no horizontal overflow.
- SEO: route-level `head()` with local title/description/og tags, `LocalBusiness`/`CafeOrCoffeeShop` JSON-LD carrying address, hours, price range, and aggregate rating (4.9 / 582), canonical per route.
- No backend, accounts, ordering, or booking.
