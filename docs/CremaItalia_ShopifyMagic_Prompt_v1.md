# Crema Italia — Shopify Magic Store Generation Prompt
**Version 1.0 · June 2026**

---

## HOW TO USE THIS PROMPT

Paste the full contents of this document into Shopify Magic's store generation input. Every section is structured to give Magic the decisions it needs in the order it needs them: brand identity first, then catalog structure, then mechanics, then conversion, then operations. Do not abbreviate.

Where you see **[PLACEHOLDER]**, substitute your actual content before pasting.

---

## PART 1 — BRAND IDENTITY

**Store name:** Crema Italia

**Tagline:** *Italian artisan coffee, roasted at origin, curated for America.*

**What we are:** Crema Italia is a Florida-based importer and curator of small, independent Italian artisan coffee roasters. We bring their coffee to American consumers exactly as it leaves the roastery — in the original sealed bag, with U.S.-compliant labeling applied at origin. We do not roast. We do not grind. We do not repackage. Every product on this site is a named roaster's work; Crema Italia is the curator and the trusted channel.

**What we are not:** We are not an aggregator. We are not a subscription box that swaps roasters month to month for variety. We are not a domestic US roaster with Italian-inspired branding. We source from real, named Italian roasters — primarily small, family-owned operations — and we tell their stories honestly.

**Brand voice:** Warm, knowledgeable, unhurried. The voice of someone who has spent time in Italy and returned with something worth sharing. Never breathless. Never discount-driven. Roasters are the named protagonists; Crema Italia is the trusted curator who found them.

**Origin story:** The brand began in Val d'Orcia, Tuscany, when founder Steve Roberts was gifted a bag of locally roasted decaffeinated coffee by his friend Lucia. He brewed it in Florida and was stopped in his tracks — an espresso so extraordinary it upended everything he thought he knew about decaf. That cup became a question: why can't American coffee lovers have access to this? Crema Italia is the answer.

**Founder:** Steve Roberts, Tampa, Florida. He is present on the brand — there is an About page featuring a founder bio and team page. Steve is the curator voice; the roasters are the craft voice.

**Visual direction:** 
- Palette: Deep espresso brown (#1C1008) as primary, warm cream (#F5F0E8) as background, terracotta/brick (#C4622D) as accent, muted sage (#7A8C6E) as secondary accent
- Typography: A characterful Italian-influenced serif for display (Playfair Display or similar); clean humanist sans-serif for body and UI (Inter or Lato)
- Photography: Roastery interiors, Tuscan landscape, close-up bean and bag photography. No stock-photo coffee imagery.
- Tone: Editorial, not promotional. Product pages read like a wine importer's tasting notes, not an Amazon listing.

---

## PART 2 — CATALOG ARCHITECTURE

### The Four-Shelf Model

Every product on the site lives on exactly one of four shelves. The shelf determines the rules. Navigation, filtering, and Shopify collections must respect this structure precisely.

**The four shelves are:**

1. **Roccia** — The recurring subscription shelf. The foundation of the business.
2. **Sorpresa** — Curated discovery. One-time purchase or subscription.
3. **Selezione** — Premium and seasonal. One-time purchase only.
4. **Offerta** — Buying opportunity (time-sensitive stock). One-time purchase only. Never "clearance."

### The Regional Framework (Core Architecture — Build This From Day One)

Crema Italia launches with roasters from **Toscana (Tuscany)** only, but the site is architected for regional expansion from the first day. Additional Italian regions will be added as roaster relationships are established.

**Browse structure — two-axis filter:**

- **X-axis (Region):** "All Regions" is the default. "Toscana" is the only selectable region at launch. Future regions (Piemonte, Lazio, Campania, Sicilia, etc.) will be added as named filter options without requiring a site rebuild.
- **Y-axis (Shelf):** "All" · "Roccia" · "Sorpresa" · "Selezione" · "Offerta"

This filter appears on the main Shop page and on each Region page. A customer browsing Toscana can then filter by shelf level. A customer browsing Roccia sees all Roccia products across all available regions.

**Region pages:** Each region has a dedicated editorial page structured as:
1. A short essay on the coffee culture of that region (2–3 paragraphs, written in brand voice)
2. The roasters from that region, each with a roaster story card (name, location within region, founding story, what makes their coffee distinctive)
3. All products from that region's roasters, filterable by shelf

At launch, the Toscana region page features all 5 launch roasters with their stories. The regional page template must accommodate future regions without redesign.

**Roaster profile pages:** Each roaster has a dedicated page:
- Roaster name, location (town/province, Toscana)
- Founding story (2–3 paragraphs)
- What they source, how they roast, what makes them distinctive
- All their products currently available (Roccia SKUs, plus any Selezione or Sorpresa featuring their coffee)
- Roast date and freshness window displayed on every product

**Secondary navigation — Supplies & Equipment:** A separate top-level navigation item ("Supplies" or "Equipaggiamento") houses coffee equipment, accessories, and supplies. This is a distinct catalog from the four-shelf coffee catalog. At launch this may be empty or minimal; build the navigation placeholder and collection structure.

---

## PART 3 — SHELF MECHANICS

### Roccia — The Subscription Foundation

**What it is:** Customer-selected recurring subscriptions to specific roaster SKUs. This is the anchor of the business; pallet stock is sized primarily for Roccia.

**Eligible bag sizes:** 250g · 500g · 1kg only. **100g bags are never sold on Roccia.**

**Cadences offered:** Every 4 weeks · Every 6 weeks · Every 8 weeks. Default for new subscribers: every 4 weeks.

**Subscriber discount:** 10% off every Roccia shipment, every time.

**Shipping:** Free U.S. ground shipping on every Roccia shipment, no minimum.

**Self-service controls:** Subscribers can pause, skip next shipment, or swap roaster/SKU/bag size up to 48 hours before order locks. Cancel anytime, no minimum commitment, no cancel fee. All self-service from the customer portal — no email required.

**Pallet-gap policy:** When a subscriber's chosen SKU is between pallets, the default behavior is: hold the shipment; notify subscriber at least 7 days before missed cadence; offer three choices: (a) wait for restock (no charge until ship), (b) substitute a similar bag from the same roaster, (c) substitute from Sorpresa as a one-time replacement.

**Founding Members:** First 100 Roccia subscribers receive lifetime 12% discount (instead of 10%) and a numbered "Founding Member" designation. This offer is used in launch-month marketing only and closes automatically at 100 subscribers.

**Annual perk:** One complimentary Selezione bag per year for any Roccia subscriber active at month 12. Curator's choice from current Selezione inventory; ships with next Roccia shipment.

---

### Sorpresa — Curated Discovery

**What it is:** Crema Italia-curated selections of smaller-format bags. The curation is always ours — never described as "roaster's choice." Language: "Crema Italia curated selection" or "our choice."

**Eligible bag sizes:** 100g and 250g only. Never 500g or 1kg.

**One-time purchase — Tour d'Italia:** Three 100g bags from three different Tuscan roasters (curator's choice). Ships with a printed tasting card naming the roasters and tasting notes. Positioned as the recommended first purchase for new visitors. At launch this is an intra-Tuscan tour; as regions are added, multi-region tours become available. The Tour d'Italia name is designed to grow with the regional expansion.

**Subscription option — Sorpresa Mensile:** Every 4 weeks, three 100g bags, Crema Italia curator's choice, never the same combination twice in a row. When a Sorpresa subscriber is also a Roccia subscriber, the curation engine excludes any SKU they currently receive via Roccia.

**Subscriber privilege:** Sorpresa subscribers who are also active Roccia subscribers receive the everywhere-10% on their Sorpresa orders. A Sorpresa-only subscriber receives 10% off their own Sorpresa shipments only.

---

### Selezione — Premium and Seasonal

**What it is:** Premium roaster offerings — micro-lots, single-origin limited imports — plus seasonal pairings tied to Italian holidays.

**Subscription eligibility:** Never. One-time purchase only.

**Bag sizes:** 250g · 500g · 1kg (where available per SKU).

**Scarcity messaging:** Honest only. Show "X bags remaining" when stock falls below 12. Show "this pallet only — may or may not return" on every listing. No countdown timers. No artificial urgency.

**Italian holiday calendar — three Selezione moments per year:**
- La Festa della Repubblica (June 2)
- Ferragosto (August 15)
- Natale (December 1–24)

**Roccia subscriber early access:** New Selezione SKUs are visible to Roccia subscribers 48 hours before public listing. Surfaced via email and customer portal.

**Subscriber privilege:** Active Roccia subscribers receive 10% off Selezione when signed in.

---

### Offerta — The Buying Opportunity

**What it is:** SKUs approaching their freshness window, priced to move. This is a buying opportunity, not a clearance bin. Coffee in Offerta is still good coffee. Never call it "clearance."

**Entry criteria:** A SKU enters Offerta when (a) remaining freshness window falls to 30 days or fewer AND (b) inventory remains above a threshold indicating slower-than-planned movement. Both conditions must be true.

**Subscription eligibility:** Never. One-time purchase only.

**Discount tiers:**
- Standard Offerta: 25% off list price
- Deep window (≤14 days remaining): 35% off list price
- Active Roccia subscribers stack their 10% on top of Offerta pricing (the only stacking exception in the discount system)

**Display rules:**
- Offerta has its own catalog page under the main Shop navigation
- Every Offerta listing shows: remaining freshness window in days, original price struck-through, Offerta price
- Roaster profile pages do NOT display Offerta items inline (protects roaster brand)
- Roccia subscribers receive an email notification when 3+ new SKUs enter Offerta in any 7-day window
- Coffee that exits its freshness window is removed from sale — not discounted further

---

## PART 4 — PRICING ARCHITECTURE

CI pays 60% of Italian retail (40% wholesale discount). US retail is calculated by multiplying CI cost by a size-dependent markup factor, then converting at EUR/USD 1.165.

**Markup by bag size:**
- 100g: **3.5× CI cost** (size penalty — discovery/sampler format)
- 250g: **2.8× CI cost** (core format — the recommended purchase)
- 1kg: **2.2× CI cost** (bulk reward — prosumer/home barista format)

**Formula:** US Retail (USD) = Italian Retail (EUR) × 0.60 × [markup factor] × 1.165

**Resulting US retail ranges:**
- 100g: approximately $17–$31 depending on tier
- 250g: approximately $28–$55 depending on tier
- 1kg: approximately $83–$146 depending on tier

**Price anchoring:** Feature the 250g core SKU as the "recommended" choice on product pages. The 100g is the accessible entry point. The 1kg rewards committed buyers.

**No grinding.** Whole bean only, always. This is a brand-integrity absolute.

---

## PART 5 — SUBSCRIBER PRIVILEGE

**Active subscriber definition:** Any customer with at least one active Roccia subscription, regardless of monthly spend. There is no minimum order value threshold.

**The everywhere-10%:** Active Roccia subscribers receive 10% off every order on the site when signed in — recurring Roccia shipments, Sorpresa one-time purchases, Selezione, and Offerta (where the 10% stacks on top of the already-reduced Offerta price).

**Sorpresa-only subscribers:** Receive 10% off their own Sorpresa shipments only. They do not receive the everywhere-10%. This is a clear, gentle incentive to add a Roccia subscription.

**Sign-in mechanic:** Cart and checkout show a sign-in prompt: "Sign in for your subscriber discount." Cart displays estimated price both signed-in and signed-out so non-subscribers see what the privilege would save them.

---

## PART 6 — DISCOUNT ARCHITECTURE

**One rule above all:** Subscribers are the privileged class. We never run sitewide promotional sales that erode the everywhere-10%.

| Discount | Who | Where | Stacks? |
|---|---|---|---|
| Subscriber 10% | Active Roccia subscribers | Everything, sitewide | Only with Offerta |
| Founding Member 12% | First 100 Roccia subscribers | Everything, sitewide | Only with Offerta |
| Sorpresa subscriber 10% | Sorpresa-only subscribers | Own Sorpresa shipments only | No |
| Offerta 25% / 35% | Everyone | Offerta shelf | Yes — with subscriber 10% |
| Volume bundle | Non-subscribers on one-time | 2 bags = 5% off; 3 bags = 10% off | No |
| First-time buyer 10% | Email signup, first order | One-time orders only, excludes Roccia | No |
| Win-back offer 15% | Cancelled Roccia subscribers | Next 2 Roccia shipments | No |
| BFCM 10% | Everyone | 4 days only, excludes Roccia and Founding Members | No |
| Referral $10/$15 credit | All customers ($15 for active Roccia) | Applied as store credit | N/A |

**Promo codes:** Never visible on the site. Email only. The promo code field should not be prominently displayed on the cart or checkout page.

---

## PART 7 — CONVERSION FUNNEL

**Recommended first purchase:** Tour d'Italia (Sorpresa one-time, three 100g bags). This is the primary homepage CTA for new visitors. It is positioned as the discovery onramp to Roccia.

**First-time buyer email capture:** 10% off first one-time order with email signup. Pop-up triggers at 20-second dwell or 40% scroll, whichever comes first. Excludes Roccia. Code delivered by email only, single-use.

**Cart upsell to Roccia:** On the cart page, every Roccia-eligible bag (250g, 500g, 1kg) shows a toggle: "Make this a Roccia subscription — 10% off every shipment, free shipping, 10% off everything else on the site, cancel anytime." Default state: unchecked. Never auto-opt-in.

**Post-purchase upsell:** Thank-you page shows: "Loved it? Make this a Roccia subscription — your roaster ships you the same bag at the cadence you choose. 10% off everywhere on the site as long as you're subscribed."

**Free shipping nudge (one-time orders):** Free U.S. ground shipping on one-time orders $48+. Cart progress bar: "Add $X for free shipping."

**Abandoned cart sequence (3 emails):**
1. 1 hour: "Forget something?"
2. 24 hours: "[Roaster Name] story" — editorial, not discount
3. 72 hours: 10% off, code CIWELCOME10, single-use, email 3 only. Excludes Roccia.

**Welcome series (after first purchase, 5 emails over 21 days):**
1. Order confirmation
2. Roaster origin story
3. Coffee storage and tasting note guide (no grind content — whole bean only)
4. "Make it Roccia" pitch (day 14)
5. Review request (day 21)

**Win-back (cancelled Roccia subscribers, triggered 30 days after cancel):** "Bring back your Roccia — 15% off your next 2 shipments, no commitment after." One offer only.

---

## PART 8 — SHIPPING

**Domestic U.S. only at launch.** Canada reconsideration at 90 days. EU at 180+ days.

| Order type | Shipping cost |
|---|---|
| Roccia subscription | Free, always |
| One-time orders $48+ | Free |
| One-time orders under $48 | $6.95 flat (USPS Ground Advantage) |

**Carriers:** USPS Ground Advantage for orders under 1 lb. UPS Ground for orders 1 lb+ and bundles of 3+ bags.

**Transit time estimates (display on product page, cart, and order confirmation):**
- East/Southeast: 2–3 business days
- Midwest/Mountain: 3–4 business days
- West Coast: 4–5 business days

**Freshness promise:** Every bag ships with at least 30 days of remaining freshness. Roast date and best-by date displayed on every product page when stock arrives, and printed on every order confirmation and shipping notification.

**What we never promise:** "Roasted within X days." "Same week as roasted." We do not control roast dates; we control US fulfillment.

**Packaging:** Bags ship as received from the roaster — no repackaging, ever. Outer packaging: recyclable Kraft mailer with Crema Italia branded sticker seal. Every order includes a printed roaster card with origin notes, tasting notes, and roast/best-by dates. Optional gift wrap (+$4) available; Italian holiday gift tag during December 1–24.

**Damage/lost in transit:** Replacement shipped same-day, no questions, no return required.

**Local pickup (Lutz, FL):** Free, by appointment. Surface this option on cart only when ZIP matches 33558, 33548, or 33549.

---

## PART 9 — PAYMENTS & CHECKOUT

**Payment methods:** Shop Pay, Apple Pay, Google Pay, Visa, Mastercard, Amex, Discover, PayPal. All standard Shopify Payments defaults on.

**No BNPL at launch.** (Reconsider if AOV exceeds $80.)

**Guest checkout:** Allowed. Never require account creation. Offer one-tap "Save my info for next time" on order confirmation step.

**Address autocomplete:** On (Shopify default).

**Order notes field:** Show on cart page only (not checkout). Label: "A note for the roaster."

**Tax:** Florida sales tax automatic via Shopify Tax. Other US states: register only when economic nexus thresholds are crossed.

**Multi-currency:** USD only at launch.

---

## PART 10 — RETURNS & THE CREMA ITALIA PROMISE

Coffee is non-returnable once shipped. The Promise replaces a returns policy.

**First-bag satisfaction guarantee:** "Love your first bag, or we send you a different one — free." Customer keeps the original. Replacement is their choice from the same or different roaster. Once per customer.

**Damage / wrong item:** Replacement shipped same-day. Customer keeps original. No return shipping required.

**Roccia cancel-and-refund:** Full refund if cancelled within 24 hours of an unshipped order. After ship: no refund, but the subscriber keeps the bag and the subscription is cancelled.

**Stale on arrival:** Replacement bag, no questions.

**Public-facing "The Crema Italia Promise" — footer-linked page, three lines in this exact order:**
1. "Curated, never aggregated."
2. "Love your first bag, or we send a different one — free."
3. "Cancel your Roccia subscription anytime, in two clicks."

---

## PART 11 — PAGES TO GENERATE

**Required pages at launch:**

| Page | Notes |
|---|---|
| Home | Hero: Tour d'Italia CTA for new visitors. Roccia subscription pitch below fold. Featured roasters. Regional editorial teaser. |
| Shop | Full catalog with regional × shelf two-axis filter |
| Toscana (Region page) | Coffee culture essay + 5 roaster story cards + all Toscana products |
| Roccia | Shelf page: subscription mechanics explained, all Roccia SKUs |
| Sorpresa | Shelf page: Tour d'Italia featured, Sorpresa Mensile subscription, discovery positioning |
| Selezione | Shelf page: current premium/seasonal SKUs, early-access messaging for Roccia subscribers |
| Offerta | Shelf page: buying opportunity framing, freshness windows displayed, honest scarcity |
| About / Our Story | Brand origin (Val d'Orcia, Lucia, the decaf espresso), curator philosophy |
| Founder & Team | Steve Roberts bio (~190 words), team page |
| Roaster pages | One page per roaster (5 at launch): story, location, products |
| The Crema Italia Promise | Three-line promise page, footer-linked |
| Supplies & Equipment | Placeholder collection — navigation live, content added post-launch |
| FAQ | Subscription management, freshness/shipping, sourcing questions |

---

## PART 12 — LANGUAGE AND NAMING CONVENTIONS

- The four shelves are always capitalized: **Roccia, Sorpresa, Selezione, Offerta**
- "Curator" and "curated" are preferred over "selected" or "chosen"
- "Artisan roasters" not "specialty roasters" (specialty has a specific industry meaning we do not invoke)
- Roasters are always referred to by name — never "our supplier" or "the producer"
- "Whole bean" is stated explicitly on every product; never imply grinding is available
- Italian words used sparingly and correctly: Mensile (monthly), Tour d'Italia, Roccia (rock/foundation), Sorpresa (surprise), Selezione (selection), Offerta (offer/opportunity)
- Region names use the Italian form: Toscana (not Tuscany) in navigation and labels; "Tuscany" acceptable in editorial prose for American readers

---

*Crema Italia LLC · Lutz, Florida · cremaitalia.com*
*Prompt version 1.0 · June 2026 · Confidential*
