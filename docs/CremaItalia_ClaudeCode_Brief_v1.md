# Crema Italia — Claude Code Project Brief
**Version 1.0 · June 2026**
**Prepared for:** Claude Code (Shopify Liquid theme build)
**Reference files:** `CremaItalia_POC_v2.html` · `CremaItalia_ShopifyMagic_Prompt_v1.md`

---

## What you are building

A Shopify e-commerce store for **Crema Italia LLC** — a Florida-based importer and curator of Italian artisan coffee roasters. The store launches with five roasters from Toscana (Tuscany) and is architected for regional expansion from day one.

You are building a **custom Shopify Liquid theme** — not a modified Dawn or other starter theme. The POC HTML is the design and interaction reference. The Shopify Magic prompt is the business logic reference. This brief tells you how to use both and what to build in what order.

---

## The two reference documents

### `CremaItalia_POC_v2.html`
A fully clickable single-file HTML prototype. Open it in a browser to understand:
- Every page that needs to exist and what it contains
- Navigation structure: **Shop · Trovare · La Bottega · About** + Sign In + "Start Your Tour" CTA
- The regional × shelf × taste profile three-axis filter on the Shop page
- The taste quiz modal (fires on first visit, 3 questions)
- Account sign-in modal and signed-in state
- All four shelf pages with their mechanics displayed
- The Trovare region-picker page with editorial region cards
- Roaster profile pages with curator notes
- Product pages with size selector, cadence selector, and Roccia subscription toggle
- La Bottega (accessories + affiliate links)
- The Crema Italia Promise page, About/Founder, FAQ

The POC CSS uses brand tokens directly. Extract and formalize these as Shopify theme settings. The embedded base64 logo should be replaced with a proper Shopify asset.

### `CremaItalia_ShopifyMagic_Prompt_v1.md`
The canonical business logic document. Read this in full before writing any Liquid. It specifies:
- The four-shelf model and rules for each shelf (Roccia / Sorpresa / Selezione / Offerta)
- Pricing formula: CI cost = Italian retail × 0.60 × 1.165 (EUR/USD). Markups: 100g = 3.5×, 250g = 2.8×, 1kg = 2.2×
- Subscriber privilege: any active Roccia subscription = 10% off sitewide
- Discount architecture and stacking rules
- Shipping rules (free on Roccia, free on one-time $48+, $6.95 flat under $48)
- Conversion funnel and email sequence logic
- The Crema Italia Promise (three lines, exact order)
- All page requirements

---

## Brand standards

### Colors (use as CSS custom properties / Shopify theme settings)
```
--ci-cream:       #FBF8F1   /* page background */
--ci-ivory:       #FFFFFF   /* cards, tables */
--ci-coffee:      #3B1F12   /* body text, H1 */
--ci-espresso:    #6B4A38   /* secondary text, captions */
--ci-crema:       #C46A1F   /* H2, links, accents, buttons */
--ci-crema-hover: #A85715   /* button hover */
--ci-crema-light: #E8A86A   /* hover states, light fills */
--ci-green:       #0E7A3A   /* flag rule left, thin rules only */
--ci-red:         #C8342B   /* flag rule right, thin rules only */
--ci-hairline:    #D9D2C2   /* borders, dividers */
--ci-mute:        #8C7E6A   /* footer text, captions */
--ci-ink-soft:    #5A4A3F   /* long-form body */
```

### Typography
- **Display / headings:** Cormorant Garamond (500/600, italic variants) — Google Fonts
- **Body / UI:** Inter (400/500/600) — Google Fonts
- Flag rule: 3px bar, green left / red right, appears at very top of every page above the header
- Flag strip: 4px tricolore bar (green / cream / red) at the very bottom of every page

### Logo
Replace the POC's embedded base64 with `assets/crema-italia-logo.jpg` as a Shopify asset. Minimum height 44px in header. Clear space = height of the "C" on every side.

---

## Shopify stack decisions (locked)

| Concern | Decision |
|---|---|
| Theme | Custom Liquid — no starter theme |
| Subscriptions | **Recharge** (preferred) or **Skio** — evaluate API at build start |
| Taste profile storage | Shopify customer metafields (`crema_italia.taste_profile` as JSON) |
| Metafield: roast | `product.metafields.crema_italia.roast_level` — values: `light`, `medium`, `dark` |
| Metafield: flavor | `product.metafields.crema_italia.flavor_profile` — values: `fruit`, `sweet`, `terroir` |
| Metafield: caffeine | `product.metafields.crema_italia.caffeine` — values: `full`, `decaf` |
| Metafield: shelf | `product.metafields.crema_italia.shelf` — values: `roccia`, `sorpresa`, `selezione`, `offerta` |
| Metafield: region | `product.metafields.crema_italia.region` — values: `toscana` (others added later) |
| Metafield: roaster | `product.metafields.crema_italia.roaster_handle` — links to roaster page |
| Freshness window | `product.metafields.crema_italia.best_by_date` (date) + `roast_date` (date) |
| Affiliate links | La Bottega page — standard HTML links with `rel="noopener"`, not Shopify products |
| Carried accessories | Standard Shopify products tagged `bottega` |
| Payments | Shopify Payments — Shop Pay, Apple Pay, Google Pay, cards. No BNPL at launch |
| Currency | USD only |
| Shipping | Shopify Shipping — USPS Ground Advantage under 1 lb, UPS Ground 1 lb+ |
| Tax | Shopify Tax — Florida auto, other states on nexus threshold |
| Email | Klaviyo (5-email welcome series, abandoned cart, win-back — see Shopify Magic prompt) |

---

## Catalog architecture

### Collections required
| Collection | Handle | Contents |
|---|---|---|
| All Coffee | `all-coffee` | Every coffee product |
| Roccia | `roccia` | Shelf = roccia |
| Sorpresa | `sorpresa` | Shelf = sorpresa |
| Selezione | `selezione` | Shelf = selezione |
| Offerta | `offerta` | Shelf = offerta |
| Toscana | `toscana` | Region = toscana |
| La Bottega | `bottega` | Tag = bottega |

### Product types
- `coffee-roccia` — subscription-eligible, 250g/500g/1kg only
- `coffee-sorpresa` — 100g/250g, one-time or subscription
- `coffee-selezione` — one-time only, 250g/500g/1kg
- `coffee-offerta` — one-time only, any size, requires freshness window metafields
- `accessory` — La Bottega carried SKUs

### Roaster pages
Build as Shopify **pages** with a custom `page.roaster` template. Each roaster page includes:
- Roaster name, location, founding story
- Curator's note (Steve's voice — "Why Crema Italia chose this roaster")
- All products from this roaster (filtered by `roaster_handle` metafield)

### Region pages
Build as Shopify **pages** with a custom `page.region` template. Each region page includes:
- Coffee culture essay (editorial, 2–3 paragraphs)
- Roaster cards grid (all roasters in that region)
- All products from that region (filtered by `region` metafield)

---

## Navigation structure

```
Header (sticky):
  [Logo] [Shop] [Trovare] [La Bottega] [About] [Start Your Tour CTA] [Sign In]

Shop mega-menu or page:
  Four shelf cards (Roccia / Sorpresa / Selezione / Offerta) + full product grid with filters

Trovare page:
  Region cards — Toscana (live) + coming-soon regions (Piemonte, Campania, Sicilia, Lazio, Emilia-Romagna)

Footer links:
  Our Promise · About · FAQ · cremaitalia.com
```

---

## The taste quiz

Fires as a modal on first visit (localStorage flag `ci_quiz_seen`). Three steps:

**Step 1 — Roast:** Light & bright / Balanced & smooth / Rich & bold / Surprise me
**Step 2 — Flavor:** Fruit & flowers / Sweet & chocolatey / Earthy & complex
**Step 3 — Caffeine:** Full caffeine / Decaf / Both

On completion:
- Named profile assigned (The Naturalist / The Classicist / The Traditionalist / The Decaf Discoverer / fallbacks)
- Profile stored in `localStorage` for anonymous visitors
- If signed in: written to customer metafield `crema_italia.taste_profile` as JSON
- Shop page filters pre-populated from profile on every visit
- Profile banner shown above header with active tags + "Clear profile" button

Skip link always visible. Quiz re-triggerable from FAQ and account portal.

---

## Account portal (customer `account.liquid`)

The signed-in account experience — accessible by clicking the customer's name in the header.

### Required sections:
1. **Taste Profile** — display current profile tags (roast / flavor / caffeine), edit button re-opens quiz modal, changes saved to metafield immediately
2. **My Roccia Subscriptions** — list active subscriptions via Recharge API: roaster, bag size, cadence, next ship date. Controls: pause / skip next / swap roaster or size / cancel (2-click confirm)
3. **Order History** — standard Shopify order list
4. **Payment Methods** — Shopify's native payment method management
5. **Shipping Address** — standard
6. **Founding Member status** — display badge if tagged `founding-member` on customer record

### Subscriber privilege display:
When signed in with active Roccia subscription, show a persistent "10% active" indicator in the header next to the customer name. Cart should show pre-discounted prices with the discount source labeled.

---

## Discount implementation

| Discount | Mechanism |
|---|---|
| Roccia subscriber 10% | Automatic discount via Recharge + Shopify Scripts or Functions |
| Founding Member 12% | Customer tag `founding-member` → Shopify Function override |
| Offerta pricing | Set compare-at price = original, sale price = discounted on product |
| Subscriber stack on Offerta | Shopify Function: if tagged subscriber + offerta product, apply additional 10% |
| First-time buyer 10% | Klaviyo email → unique discount code, single-use |
| Volume bundle | Shopify automatic discount: 2 items = 5%, 3+ = 10% |
| Win-back 15% | Klaviyo triggered flow → unique code, applies to next 2 Roccia orders |
| BFCM | Manual discount code, date-gated, excludes Roccia and founding members via Shopify Function |

**Rule:** Never show a promo code field prominently. Discount codes apply silently; the field exists but is collapsed by default.

---

## Build sequence

Build in this order. Do not skip ahead.

### Phase 1 — Shell
- Theme file structure (`layout/theme.liquid`, `config/settings_schema.json`)
- Brand CSS as theme stylesheet with all custom properties
- Google Fonts loading (Cormorant Garamond + Inter)
- Logo asset upload
- Flag rule (header top) and flag strip (page bottom)
- Sticky header with nav links and sign-in button
- Footer with promise/about/FAQ links
- Empty page templates: `index`, `collection`, `product`, `page`, `customers/account`

### Phase 2 — Homepage
- Hero section (dark background, display headline, two CTAs)
- Four-shelf explainer cards (Roccia / Sorpresa / Selezione / Offerta with Italian name + English subtitle)
- Tour d'Italia feature block
- Region teaser grid (Toscana live, others coming soon)
- Subscriber privilege callout
- Quiz re-entry link

### Phase 3 — Shop + filters
- Three-axis filter bar (Region × Shelf × Taste Profile)
- Filter state management via URL params (enables shareable filtered URLs)
- Product card component (shelf badge, roaster name, tasting notes, freshness indicator, price)
- "No results" empty state
- Profile filter hint bar (shows when taste profile active)

### Phase 4 — Trovare + region pages
- `page-trovare.liquid` — region picker with editorial cards
- `page.region` template — coffee culture essay + roaster cards + products
- Toscana page content

### Phase 5 — Product pages
- `product.roccia` template — size selector, cadence selector, Roccia subscription toggle, freshness display, roaster link
- `product.sorpresa` template — one-time + subscription options
- `product.selezione` template — one-time only, scarcity messaging
- `product.offerta` template — freshness countdown, struck-through original price, Offerta badge

### Phase 6 — Roaster pages
- `page.roaster` template
- Curator note section (Steve's voice)
- Products filtered by roaster handle

### Phase 7 — La Bottega
- `page.bottega` template
- Carried SKUs (standard Shopify products)
- Referred products (static HTML blocks with affiliate disclosure)

### Phase 8 — Account portal
- Taste profile display + edit
- Recharge subscription management integration
- Founding Member badge
- Subscriber privilege indicator in header

### Phase 9 — Taste quiz
- Modal component (fires on first visit, skippable)
- localStorage for anonymous visitors
- Metafield write on sign-in / account creation
- Profile banner component
- Filter pre-population from saved profile

### Phase 10 — Checkout + post-purchase
- Cart upsell to Roccia subscription toggle
- Free shipping progress bar ($48 threshold for one-time orders)
- Discount code field collapsed by default
- Thank-you page post-purchase Roccia upsell block

---

## What is locked vs. open

### Locked — do not deviate
- Four shelf names: Roccia, Sorpresa, Selezione, Offerta (always capitalized)
- Nav: Shop · Trovare · La Bottega · About
- Pricing formula and markup tiers (100g 3.5×, 250g 2.8×, 1kg 2.2×)
- Active subscriber = any Roccia subscription, no spend threshold
- Whole bean only — never imply grinding is available anywhere
- "Curated, never aggregated" — brand is importer/curator, never roaster
- The Crema Italia Promise — three lines, exact order (see Shopify Magic prompt)
- Cancel in two clicks — must be achievable from account portal without email

### Open — use judgment
- Shopify theme file organization beyond what's specified here
- Recharge vs. Skio — evaluate at build start, recommend based on current API
- Specific Liquid template split decisions
- Animation and transition details (keep within brand standard: 200ms max, purposeful only)
- Mobile breakpoint specifics beyond what the POC demonstrates

---

## Tone and copy rules

- Roasters are always referred to by name — never "our supplier" or "the producer"
- "Artisan roasters" not "specialty roasters"
- Italian words used sparingly and correctly: always italicized on first use in a section
- Shelf names always capitalized, never in quotes
- "Whole bean" stated explicitly on every product — never imply grinding
- Promo codes never displayed on-site — email only
- Offerta is never called "clearance"
- Scarcity messaging: honest only — "X bags remaining" when stock < 12, no countdown timers

---

## Launch checklist (reference only — not your immediate scope)

- [ ] 5 Toscana roasters onboarded with full product metafields
- [ ] Taste quiz tested on iOS Safari (iPad + iPhone)
- [ ] Recharge subscription flows QA'd end-to-end
- [ ] Klaviyo welcome series and abandoned cart connected
- [ ] Florida sales tax configured
- [ ] Shipping zones and carrier rates configured
- [ ] Founding Member tag automation (first 100 Roccia subscribers)
- [ ] The Crema Italia Promise page live and footer-linked
- [ ] Local pickup option (ZIP 33558, 33548, 33549) tested

---

*Crema Italia LLC · Lutz, Florida, USA · cremaitalia.com*
*Brief v1.0 · June 2026 · Confidential*
*Companion files: `CremaItalia_POC_v2.html` · `CremaItalia_ShopifyMagic_Prompt_v1.md`*
