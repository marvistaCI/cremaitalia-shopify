# Crema Italia — Store Operating Standards

**Version 1.0 · 2026-07-13**
**Source of truth:** this file (`docs/standards/store-operating-standards.md`) in the theme repo.
**Companion standards:** Brand Standards v2.0 (look & voice) · Collaboration Standard v1.0 (how we work).

> **What this document is.** The canonical, human-and-machine-readable statement of **how the
> Crema Italia store buys, prices, sells, and fulfils** — the commerce mechanics. Brand Standards
> owns how the store *looks and speaks*; this owns how it *does business*. It is a **Standard**
> (what is true *now*), not a log (what changed, when) — history lives in `CLAUDE.md` §9 and
> `Coordination/DECISIONS_LOG.md`.
>
> **How to use it.** When a commerce rule changes, update THIS file in the same pass and bump the
> version, then log the event. Other documents (the POC, code comments, `CLAUDE.md`) should
> *point at* this file, never restate its rules — restating is what causes drift. The POC is an
> ephemeral mock we build *from*; this document is what we build *to*, and what future alterations
> are measured against.
>
> **Provenance.** v1.0 consolidates the rules previously locked across the (now-retired) Shopify
> Magic Build Prompt v3 FINAL, the `01_Metafield_Reference` doc, and the locked decisions in
> `CLAUDE.md` §9 (esp. 2026-06-29, 2026-07-04, 2026-07-10). Where those sources conflicted, the
> conflict is called out in **§12 Open Decisions** rather than silently resolved.

---

## 1. The shelves — canonical definitions

Every product lives on exactly one shelf. The four **coffee** shelves drive navigation, collections,
and taxonomy; **Bottega** is a separate non-coffee retail section, not a fifth coffee shelf.

| Shelf | English meaning | Commercial role | Key rules |
|---|---|---|---|
| **Roccia** | "Rock / staple" | The subscription backbone — everyday coffees sold one-time **and** as Roccia subscriptions | Bag sizes 250g / 500g / 1kg (**no 100g**). The only shelf with subscriptions. |
| **Sorpresa** | "Surprise" | Discovery **Tour** bundles (composite BOM SKUs) | Sorpresa 100g bags exist **only inside Tour bundles**, never sold alone. One-time only. |
| **Selezione** | "Selection" | Premium / seasonal / limited micro-lots | One-time purchase only, never a subscription. Honest scarcity ("low inventory" under 12 units, hard cap). Active Roccia subscribers see new SKUs 48h early (Locksmith, tag `active-roccia`). |
| **Offerta** | "Offer / deal" | Aged lots moved to an honest markdown as they approach their freshness limit | Not stocked directly — items *transition* here by age (see §6). Uses the `O[size]` markup factors. Guarantee is "as-is, defects only" (see §5). |
| **Bottega** | "Shop / workshop" | Non-coffee retail: equipment, accessories, Crema Italia merch | Independent ordering experience. No roaster affiliation, no freshness/expiry logic. Never appears on roaster profiles. Never discounted for subscribers/Founding. |

---

## 2. Pricing model

### 2.1 The formula (LOCKED)

```
Retail price = SKU_LAST_COST × Markup[Shelf, Size]
```

- **SKU_LAST_COST** = the US-dollar **landed cost of the most recent lot** purchased for that SKU
  (EUR purchase price + freight + tariff + handling), **locked at receipt** on the lot's variant
  (`landed_cost_usd`).
- **Markup** comes from the fixed matrix below, keyed by shelf and bag size.
- The retired `EUR × 0.60 × markup × 1.165` formula is **superseded — do not use.**

### 2.2 Markup matrix (LOCKED; the *table* is admin-configurable)

`O[size]` columns = the Offerta (aged-lot) variant of that size.

| Shelf | 100g | 250g | 500g | 1kg | O100g | O250g | O500g | O1kg |
|---|---|---|---|---|---|---|---|---|
| **Roccia** | — | 2.8× | 2.5× | 2.2× | — | 2.3× | 1.7× | 1.5× |
| **Sorpresa** | 3.7× | 3.0× | — | — | 3.2× | 2.5× | — | — |
| **Selezione** | 3.7× | 3.0× | 2.7× | 2.4× | 3.2× | 2.5× | 2.2× | 1.9× |
| **Offerta** | *uses the `O[size]` factor of the item's originating shelf* | | | | | | | |
| **Bottega** | 2.0× flat (1.5× if clearing) | | | | | | | |

> **Scope note (see §12 #1):** these factors are configurable **by shelf/size** — editing the table
> changes every SKU of that shelf/size. A **per-SKU markup override** (giving one coffee a different
> margin than its shelf/size peers) is **not** in the recorded data model today. This is an open
> decision, because Steve's stated intent was per-SKU editability.

### 2.3 Tour / bundle pricing

- `Tour cost = Σ (component SKU_LAST_COSTs) + packaging_cost`
- `Tour retail = Tour cost × Sorpresa/100g factor (3.7×)`; an aged Tour uses `3.2×`.
- Component cost changes flow into Tour cost automatically; the customer-facing Tour price updates
  **only on admin approval** (same governance as any SKU).
- *Worked example:* (6.00 + 5.50 + 7.00 components) + 2.50 packaging = 21.00 → ×3.7 = **$77.70**.

### 2.4 Price-update governance (LOCKED — no automatic passthrough)

A new lot never silently changes the shelf price. Instead:
1. New lot arrives → update `landed_cost_usd` → system computes the *proposed* new retail.
2. Admin is alerted ("current retail $X; new cost would yield $Y if approved").
3. Admin **approves / holds (retain margin) / defers**.
4. Price changes only on explicit approval.

Rationale: avoid psychological pricing churn, protect margin on fast movers, keep pricing a
deliberate decision.

---

## 3. Discounts & the subscriber privilege

**Delivery mechanism (LOCKED):** discounts apply via **URL parameter or personalized email link only.
There is NO visible promo-code field at checkout.**

| Discount | Amount | Applies to | Stacking |
|---|---|---|---|
| **Active subscriber** | 10% | Roccia, Sorpresa, Selezione (never Offerta/Bottega) | Final — replaces volume (customer gets the better) |
| **Founding Member** | 12% | Roccia, Sorpresa, Selezione | Final (see §4 for the full mechanic) |
| **First-time buyer** | +5% | All shelves except Bottega | **Stacks** on subscriber → new Roccia subscriber's first order = **15%**. One-time, detected server-side (zero prior orders). |
| **Volume** | 2 bags 5% / 3+ bags 10% | Coffee shelves except Offerta/Bottega | Does **not** stack for subscribers (better-of applied automatically) |
| **BFCM bonus** | +5% | All shelves incl. Offerta/Bottega | Additive on top of subscriber/volume. Manual admin toggle, site banner. |
| **Abandoned cart** | 5% | All shelves | Email #3 link only; once per customer per 90 days |
| **Win-back** | 15% | All shelves | 30 days post-Roccia-cancel; one link; replaces subscriber |
| **Referral** | free 100g bag | Any shelf except Bottega (free shipping) | One bag per 5 completed referrals |

**"Active" subscriber definition:** at least one **$45-or-greater Roccia shipment delivered per
calendar month**; auto-tagged `active-roccia` by Shopify Flow.

**No sitewide percentage-off promotional sales** — the subscriber privilege is the standing benefit,
not a recurring sale. **No Italian-holiday discounting** — holidays are Journal editorial only.

---

## 4. Founding Member mechanic (LOCKED 2026-07-10)

- **"Founding Member · No. NNN"** is a **permanent honorific** — the first 222 Roccia subscribers at
  launch, numbered, with a certificate. Kept **forever**, even after forfeiture (shown muted).
- The **12% is an *Active Subscriber Discount*** tied to *holding* a subscription — not an
  unconditional lifetime rate.
- **Exactly two customer-facing states — Active and Forfeited. No grace/at-risk state.**
  - **Active Founder → 12%.** **Forfeited → 10%.**
- **Pause preserves the rate** (indefinitely). **Loop dunning** (failed-card retries) also preserves it.
- The **only** way to forfeit is a **deliberate full cancel** (after being offered Pause first).
  Forfeiture is **permanent** — a returning founder comes back at 10%, never 12% again.
- **Entitlement rule (server-side, authoritative):** a one-way `founding_rate_forfeited` customer tag,
  set ONLY on a deliberate full cancel (never by pause or dunning):
  - `founding && !forfeited && (active | paused | in-dunning)` → **12%**
  - any other active/paused subscriber → **10%**
  - else → **0%**
- Both the cart discount and the account Membership tile read this tag via Shopify Functions.
- *Rationale:* the 12-vs-10 delta is ~$10/yr — a pride good, not an economic one. Pause +
  always-welcome-back + up-front disclosure are what keep the mechanic from angering a founder into
  permanent exit.

---

## 5. Freshness & the Offerta transition

- **Freshness statement (always paired with the actual roast date):** "Best within 60 days of roast
  date. For peak flavor, brew within 30 days." Never "best by" alone.
- **`days_to_offerta`** default **45**, admin-editable per master SKU (override per lot if needed).
- **`offerta_transition_date`** = `roast_date + days_to_offerta`.
- **Nightly** the system flags lots at/over their transition date. Admin sees a daily digest and
  approves (may auto-approve). On transition: `current_shelf` → Offerta (Shopify Flow), price
  recalculates to the `O[size]` factor, 3PL gets a priority-ship (FIFO) flag.
- **Offerta listing shows:** original price (struck through) + Offerta price + savings + the *actual*
  remaining freshness window (e.g. "best within 23 days").
- **Donation threshold:** coffee remaining after **60 days from roast** is removed from sale and
  donated to **Feeding Tampa Bay** (the no-waste pledge).
- **Offerta guarantee is modified:** "as-is, defects only" — the standard first-bag satisfaction
  guarantee (§9) does not apply to already-discounted aged lots.

---

## 6. Roccia subscriptions (Loop)

- Engine = **Loop** (native `selling_plan_groups` + Shopify Checkout + Loop-hosted portal).
- **Cadences 4 / 6 / 8 weeks.** Customer selects roaster + SKU + size (**250g / 500g / 1kg only**) +
  cadence.
- Every Roccia shipment: **10% off + free shipping** (no minimum).
- **Self-service:** pause, skip, swap roaster/SKU/size (up to 48h before order lock), cancel — no fee,
  no minimum commitment.
- **Pallet-timing gap policy:** when a subscriber's SKU is between pallets and can't fill the next
  cadence, notify 7+ days ahead with two options: (a) wait for restock (no charge until ship), or
  (b) substitute a similar bag **from the same roaster**. **Never** substitute from Sorpresa/
  Selezione/Offerta into a Roccia shipment.

---

## 7. Tours / bundles — the BOM model

A Tour (and any future bundle) is a **Bill-of-Materials SKU**: box + N component coffee SKUs +
printed tasting card.

- **Browse facets are DERIVED from components, never hand-entered.** A Tour's Region / Roast / Flavor /
  Caffeine values are the **union** of its components (Option A: positive to a filter when **any**
  component matches, per axis; AND across axes). Modelled in the POC via `component_handles` +
  `productFacets()`.
- **Availability is gated by components:** offered only while **all** components are in stock and
  within freshness; auto-pauses and returns automatically as stock rotates.
- **On-demand 3PL fulfilment:** on order, 3PL pulls components FIFO, assembles box + bags + card,
  QC's all roast dates within the 60-day window, ships in 1–2 business days.
- **Substitution matrix** (admin-defined per Tour): if a component is within 7 days of its transition
  date or out of stock after order, 3PL may substitute a defined alternate from the same roaster;
  customer is told ("Same quality, same roaster, new terroir").
- **REQUIRED production capability:** an **admin-managed BOM builder** — create a Tour by naming it
  and selecting component SKUs, facets/availability auto-derive, and each order emits a per-order
  pick-pack BOM to the 3PL. No developer, no code deploy. (See §11 tooling.)

---

## 8. Fulfilment & shipping

- **US-only at launch.** No international.
- **Free** on every Roccia shipment; **free** on one-time orders **$55+**; **flat $8.50** USPS Ground
  Advantage under $55. Free-shipping progress bar in cart, **$55** threshold.
- **Carriers:** USPS Ground Advantage under 1 lb; UPS Ground 1 lb+.
- **Transit:** East/Southeast 2–3 business days · Midwest/Mountain 3–4 · West Coast 4–5.

---

## 9. The Crema Italia Promise

Three lines, in this exact order, on a single editorial page linked from the footer:
1. Curated with love, never aggregated.
2. Love your first bag, or we send a different one - free.
3. Cancel your subscription anytime in a couple of clicks.

Below: first-bag satisfaction guarantee (standard shelves; Offerta is "as-is, defects only" per §5),
damage replacement, the freshness window, and the no-waste pledge (Feeding Tampa Bay donations).

> The **exact customer-facing wording lives in the POC/theme** (the source of truth for *copy*);
> reproduce it from there and honor the no-em-dash rule (§10).

---

## 10. Strict exclusions (never appears on the site)

- **No grind options** anywhere — whole bean only (roasters seal valve bags at origin).
- **No claim** that we roast, blend, or process — we import and curate; the roasters roast.
- **No roast-day shipping-cadence claims** — pallets travel on a 6–10-week cadence.
- **No countdown timers, fake stock counts, or manufactured urgency** — real low-inventory and real
  freshness windows only.
- **No visible promo-code field** at checkout.
- **No sitewide percentage-off promotional sales.**
- **No emoji. No exclamation marks. No "amazing/best/you'll love it" copy.**
- **No em-dashes in customer-facing copy** (2026-07-13) — see Brand Standards / `CLAUDE.md` §6 for the
  replacement rule.

---

## 11. Data model & tooling (production)

**Metafields (`crema_italia.*`):** `roast_date` (Date), `lot_id` (Text), `eur_usd_rate` (Decimal),
`landed_cost_usd` (Currency, locked at receipt), `days_to_offerta` (Int), `offerta_transition_date`
(Date), `current_shelf` (SingleSelect: Roccia|Sorpresa|Selezione|Offerta), `Referral_Gift_Allowed`
(Boolean), plus taxonomy: `roast_level`, `flavor_profile`, `caffeine`, `shelf`, `region`,
`roaster_handle`, `best_by_date`. Extend with a structured component-SKU BOM field on bundles (§7).

**Customer tags:** `active-roccia`, `founding-member-N`, `founding_rate_forfeited`, `paused-roccia`,
`cancelled-roccia`, `sorpresa-subscriber`. Auto-managed by Shopify Flow / Loop webhooks.

**Automation:** Shopify Flow moves `current_shelf` → Offerta on `offerta_transition_date` and tags
`active-roccia` on the $45+/month rule.

**Account architecture split (LOCKED 2026-07-04):**
- **Loop** owns the active subscription's ship-to + payment + lifecycle notifications + the retention
  ("are you sure") prompt in its cancel flow.
- **Native Shopify accounts** own the general address book + profile (name/email/password) + order
  history + buy-again + marketing consent.
- **Shopify Functions + a customer tag/metafield** own the **entitlement** (who gets 12/10/0),
  driven by Loop webhooks — the authoritative, server-side downgrade path (a customer can cancel via
  an email link and never touch theme UI).

**REQUIRED tool — the SKU price-maintenance engine:** landed-cost × markup with the approval
governance (§2.4) is **not a native Shopify feature** (Shopify gives cost-per-item + manual price +
Flow, but not a governed markup-matrix pricing workflow). Building it is a real deliverable — see
§12 #2 for the mechanism decision.

---

## 12. Open decisions (must close before / at production build)

1. **Per-SKU markup override.** The matrix is per shelf/size; no per-SKU markup field exists in the
   recorded model. Steve's stated intent was per-SKU editability. **Decide:** add a per-SKU markup
   override (e.g. a `markup_override` metafield that wins over the table) or keep shelf/size + per-lot
   landed cost only?
2. **The SKU price-maintenance tool mechanism.** Options: (a) Shopify Flow + metafields + a manual
   admin approval step; (b) a lightweight custom app; (c) spreadsheet-assisted at launch, tool later.
   **Decide** the launch approach.
3. **Pricing numbers never validated.** The multipliers were specified, never run against real landed
   costs (the POC cart is mocked). **Pre-launch:** sanity-check several real SKUs through the matrix
   against `Crema_Italia_Landed_Cost_Model_v1.xlsx` before charging real money.
4. **Pause-semantics reconciliation.** The Founding-rate lock (§4, 2026-07-10) says pause preserves
   the rate **indefinitely**; the older subscription spec said a general subscriber's "active" status
   pauses for **60 days then suspends**. The 2026-07-10 lock governs the Founding rate. **Decide**
   whether *general* (non-founding) subscriber status is also indefinite-on-pause or 60-day.
5. **Deferred perks.** The month-12 "complimentary Selezione bag" annual perk was deferred to
   post-launch — confirmed deferred, tracked here so it isn't lost.

---

*Store Operating Standards v1.0 · 2026-07-13 · Source of truth: `docs/standards/store-operating-standards.md`.*
*Renders (PDF for humans / Cowork) are read-only snapshots stamped with this version — edit the source, not the render.*
