# Crema Italia — Store Operating Standards

**Version 1.2 · 2026-07-13**
**Source of truth:** this file (`docs/standards/store-operating-standards.md`) in the theme repo.
**Companion standards:** Brand Standards v2.0 (look & voice) · Collaboration Standard v1.0 (how we work).

> **v1.2 (2026-07-13)** replaced additive discount stacking with a **no-stacking, highest-wins (`MAX`)**
> rule (§3): a customer receives only the single highest discount they qualify for — a founder who is also
> a first-time buyer gets **12%** (not 17%); a first-time buyer who earns the 3-bag volume tier gets **10%**
> (not 15%). The `MAX` rule *is* the cap, so there is no separate discount ceiling. Split the delivery
> mechanism (standing benefit auto-applied server-side vs campaign discounts via link). **BFCM** is no
> longer additive — it is a flat candidate in the `MAX`. Marked the **Referral** reward + capture **TBD**
> (§3, §12.6) since the former "free 100g bag" has no standalone SKU. Annotated the vestigial
> **Sorpresa 250g / O250g** matrix cells as retired (§2.2). **Note:** the POC discount code still stacks
> and is now knowingly behind this Standard — a POC/production fix, tracked separately.

> **v1.1 (2026-07-13)** closed the three open decisions from v1.0 §12: per-SKU markup override added
> (§2.2), price-maintenance tool approach set (§11), and the subscriber-benefit / pause-cancel model
> settled (§3.1) — including making **Founding Member status durable** (account-level, lost only on
> account closure), which supersedes the 2026-07-10 Active/Forfeited model (§4).

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
| **Sorpresa** | 3.7× | — | — | — | 3.2× | — | — | — |
| **Selezione** | 3.7× | 3.0× | 2.7× | 2.4× | 3.2× | 2.5× | 2.2× | 1.9× |
| **Offerta** | *uses the `O[size]` factor of the item's originating shelf* | | | | | | | |
| **Bottega** | 2.0× flat (1.5× if clearing) | | | | | | | |

> **Sorpresa 250g / O250g are intentionally blank (retired 2026-07-13).** Sorpresa ships **only as Tours**
> (§2.3), priced off the 100g factor (3.7× fresh / 3.2× aged); there is no standalone Sorpresa 250g
> product, so those cells carry no live factor. If a standalone Sorpresa bag is ever introduced, restore
> the cells and log it.

> **Per-SKU override (LOCKED 2026-07-13).** The matrix is the **default** that governs every SKU by
> shelf/size — editing the table moves every SKU of that shelf/size together. In addition, a SKU may
> carry an optional **`markup_override`**: leave it blank (the normal case) and the SKU inherits the
> matrix; set it and it wins **for that SKU only**. This mirrors how `days_to_offerta` works (a
> default plus a per-SKU override). An override is a **deliberate exception, not the norm**, and it
> **routes through the same admin approval** as any price change (§2.4).

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

**No stacking — highest applicable discount wins (LOCKED 2026-07-13).** A customer never receives two
discounts at once. The applied rate is the **`MAX` of every discount they currently qualify for**; all
others are obviated. This deliberately protects margin on thin per-bag markups: a founder who is also a
first-time buyer gets **12%** (not 17%); a first-time buyer who earns the 3-bag volume tier gets **10%**
(not 15%). There is **no additive stacking and no separate combined cap — the `MAX` rule is the cap.**

**Delivery mechanism (LOCKED):** there is **NO visible promo-code field at checkout.** Discounts reach the
customer by kind: the **standing subscriber / founder benefit applies automatically, server-side**, whenever
the customer is signed in and benefits are on (Shopify Functions reading the entitlement tag, §11);
**campaign discounts** (first-time, volume, abandoned-cart, win-back, BFCM) apply via **URL parameter or
personalized email link**. Whichever mechanism fires, the customer still receives only the single highest
applicable rate (the `MAX` rule above).

| Discount | Rate | Applies to | Notes (every row competes in the `MAX`; none stack) |
|---|---|---|---|
| **Founding Member** | 12% | Roccia, Sorpresa, Selezione | Auto when benefits on. Founder tier of the subscriber benefit — see §4. |
| **Active subscriber** | 10% | Roccia, Sorpresa, Selezione | Auto when benefits on (regular tier). |
| **Win-back** | 15% | All shelves | 30 days post-Roccia-cancel; one email link. Wins over the standing benefit by design. |
| **Volume** | 2 bags 5% / 3+ bags 10% | Coffee shelves except Offerta/Bottega | Competes in the `MAX`; for a subscriber the 10/12% already wins. |
| **First-time buyer** | 5% | All shelves except Bottega | One-time, detected server-side (zero prior orders). A first-time founder/subscriber still gets 12/10% (higher). |
| **BFCM** | 5% | All shelves incl. Offerta/Bottega | Manual admin toggle, site banner. A **flat** candidate in the `MAX` (no longer additive) — mainly benefits customers who hold no higher discount. |
| **Abandoned cart** | 5% | All shelves | Email #3 link only; once per customer per 90 days. |
| **Referral** | **TBD** | **TBD** | Referral capture is **not built yet**; reward + mechanism are open (§12.6). The former "free 100g bag" is void — 100g exists only inside Tours (§1), so there is no standalone 100g SKU to gift. |

### 3.1 Subscriber benefits & how long they last (LOCKED 2026-07-13)

**"Subscriber benefits" = the discount (12% founder / 10% regular) *and* the shipping offsets**
(free/reduced shipping). They are bound to being a subscriber, with a deliberate win-back grace:

- **ON** while the account has **≥1 actively-shipping subscription.** A customer may hold several; any
  one shipping keeps benefits on. Pausing or cancelling *some* changes nothing while another ships.
- **60-day grace.** When the account reaches **no actively-shipping subscription** — whether by
  **pausing all** or **cancelling all** — benefits **continue for 60 days** from that date, then
  lapse. The grace is intentional: it is our window to re-contact the customer and win them back on
  the benefits they are about to lose (FOMO), and it means no one is punished the instant they pause
  or cancel.
- **Reinstatement.** Resuming or re-subscribing at **any** later date restores benefits at the
  account's tier — **12% if still a Founding Member, 10% if regular** (§4).
- Benefits never apply to **Offerta or Bottega** (§3 table), regardless of tier.

> **Supersedes** both the older "$45+ shipment delivered per calendar month" active-definition and the
> interim "cancel = immediate benefit loss" rule: **cancel-all now carries the same 60-day grace as
> pause-all.** The only thing that ends benefits *without* a grace is closing the entire account (§4).

**No sitewide percentage-off promotional sales** — the subscriber benefit is the standing perk,
not a recurring sale. **No Italian-holiday discounting** — holidays are Journal editorial only.

---

## 4. Founding Member mechanic (LOCKED 2026-07-13 — supersedes 2026-07-10)

- **"Founding Member · No. NNN"** is a **durable, account-level status** — one of **222** numbered
  slots, granted at launch signup, with a numbered certificate. It is tied to the **account**, not to
  any subscription.
- **It survives cancelling any or all subscriptions.** A founder who cancels everything and
  re-subscribes months or years later returns a **Founding Member at 12%.** Founder status is not
  something a subscription action can take away.
- **The 12% is the *founder tier* of the subscriber benefit** (§3.1): a founder receives **12%**
  whenever subscriber benefits are ON (an actively-shipping subscription, or within the 60-day grace);
  a regular subscriber receives **10%** under the same conditions; benefits OFF → 0%.
- **Founding status is lost ONLY by closing the entire account** — *"Cancel the entire account,"* a
  distinct action from cancelling a subscription (e.g. a founder dies and a family member closes the
  account). On account closure the numbered founding **slot is released/retired.**
- **Retired (do not build):** the 2026-07-10 "Active/Forfeited" two-state model, the permanent
  12%→10% forfeiture on a subscription cancel, and the one-way `founding_rate_forfeited` tag. **There
  is no permanent forfeiture** — the only terminal event for a founder is account closure.
- *Rationale:* the 12-vs-10 delta is tiny (~$10/yr) — a pride good. Making founder status durable and
  always-reinstatable removes any reason a founder would fear pausing or cancelling, and keeps the
  win-back door open.

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
- **Self-service controls (no fee, no minimum commitment):**
  - **Skip** one shipment; **swap** roaster/SKU/size up to 48h before order lock.
  - **Pause** — a single subscription **or** all subscriptions — offered as a bounded window:
    **[next delivery cycle]** or **[next two delivery cycles]**, then auto-resumes. Pause is a short
    skip, **not** a long hold: anything longer than two cycles, the customer should **cancel** instead.
  - **Cancel** — a single subscription **or** all subscriptions — stops shipping immediately.
  - Reaching **no actively-shipping subscription** (by pause-all or cancel-all) starts the **60-day
    benefits grace** (§3.1); benefits reinstate on any resume/re-subscribe. Founder status is
    unaffected either way (§4).
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
`landed_cost_usd` (Currency, locked at receipt), `markup_override` (Decimal, **optional** — blank =
inherit the shelf/size matrix), `days_to_offerta` (Int), `offerta_transition_date`
(Date), `current_shelf` (SingleSelect: Roccia|Sorpresa|Selezione|Offerta), `Referral_Gift_Allowed`
(Boolean), plus taxonomy: `roast_level`, `flavor_profile`, `caffeine`, `shelf`, `region`,
`roaster_handle`, `best_by_date`. Extend with a structured component-SKU BOM field on bundles (§7).

**Customer tags:** `founding-member-NNN` (durable; set at signup, removed only on account closure —
NO `founding_rate_forfeited`, retired per §4), plus subscription-state tags derived from Loop
(actively-shipping / in-60-day-grace / lapsed) driving the benefit gate. Auto-managed by Shopify Flow
/ Loop webhooks. **Entitlement logic:** `benefits_on = (≥1 actively-shipping sub) OR (within 60-day
grace)`; the *standing* rate `standing = founder ? 12% : 10%` when `benefits_on`, else 0%. The **applied**
discount is `MAX(standing, any qualifying campaign discount)` per the no-stacking rule (§3) — never a sum.

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

**The SKU price-maintenance engine (approach LOCKED 2026-07-13 — phased).** Landed-cost × markup with
the approval governance (§2.4) is **not a native Shopify feature**. Chosen path:
- **At launch:** **spreadsheet-assisted** (compute in `Crema_Italia_Landed_Cost_Model_v1.xlsx`, enter
  prices manually in Shopify). Adequate for the small launch catalog on a 6–10-week lot cadence;
  governance = admin review at entry time. Zero build.
- **Automation:** use **Shopify Flow** for what it does well — the Offerta **aging** transition
  (date-triggered shelf move + price recalc to `O[size]` + admin alert). Native, free.
- **Later:** build a **lightweight custom app** (a proposed-price approve/hold/defer queue) **when
  volume justifies it** — trigger = SKU count / lot velocity high enough that manual pricing becomes
  a chore or error-prone. Back-office only; does **not** block or shape the storefront theme build.

---

## 12. Open decisions (must close before / at production build)

1. ~~**Per-SKU markup override.**~~ **RESOLVED 2026-07-13** — matrix + optional per-SKU
   `markup_override` (blank = inherit); override is a deliberate exception and routes through admin
   approval. Rule now in §2.2; field in §11.
2. ~~**The SKU price-maintenance tool mechanism.**~~ **RESOLVED 2026-07-13** — phased: spreadsheet
   + Shopify Flow (aging) at launch; lightweight custom app when volume justifies. Detail in §11.
3. **Pricing numbers never validated.** The multipliers were specified, never run against real landed
   costs (the POC cart is mocked). **Pre-launch:** sanity-check several real SKUs through the matrix
   against `Crema_Italia_Landed_Cost_Model_v1.xlsx` before charging real money.
4. ~~**Pause-semantics reconciliation.**~~ **RESOLVED 2026-07-13** — benefits bound to ≥1
   actively-shipping subscription; pause-all **and** cancel-all trigger a 60-day win-back grace, then
   lapse; reinstated on resume/re-subscribe. Founder status made **durable** (account-level, lost only
   on account closure), superseding the 2026-07-10 permanent-forfeiture model. Rules in §3.1 and §4.
5. **Deferred perks.** The month-12 "complimentary Selezione bag" annual perk was deferred to
   post-launch — confirmed deferred, tracked here so it isn't lost.
6. **Referral program — reward + capture TBD (2026-07-13).** No referral-capture mechanism has been
   built, and the former "free 100g bag" reward is void (no standalone 100g SKU — 100g exists only inside
   Tours, §1). Both the reward form (e.g. a 250g bag, account credit) and the capture/tracking tooling are
   open; decide before any referral discount is enabled. The §3 table carries Referral as **TBD** until then.

---

*Store Operating Standards v1.2 · 2026-07-13 · Source of truth: `docs/standards/store-operating-standards.md`.*
*Renders (PDF for humans / Cowork) are read-only snapshots stamped with this version — edit the source, not the render.*
