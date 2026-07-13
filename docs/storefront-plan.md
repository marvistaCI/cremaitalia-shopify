# Crema Italia — Storefront Build: Reading Order & Reconciliation

> ⚠️ **HISTORICAL / SUPERSEDED (as of 2026-07-03).** This file is a snapshot from
> 2026-06-27, back when the ClaudeCode Brief and the Shopify Magic Build Prompt were
> the "authoritative" specs. **They no longer are.** The Magic Build Prompt was
> **retired as a build artifact on 2026-07-03** (archived, not authoritative — see
> `CLAUDE.md` §9 2026-07-03 and `Coordination/DECISIONS_LOG.md`), and the brief/POC
> versions named below (v1/v2) are old. **We do NOT need a Magic Prompt to convert the
> POC into the live build.** Current source of truth = the **theme repo (POCs + the
> `CLAUDE.md` §9 log + `docs/*` change lists), `DECISIONS_LOG.md`, and the brand
> standards.** Everything below is kept only for historical reference — do not treat any
> doc named "Authoritative" in this file as governing today.

**~~As of 2026-06-27, the canonical specs are the two documents below. Read them
in this order before writing any Liquid. This file is just the index +
reconciliation of open questions; the brief and prompt govern.~~** *(superseded — see
banner above)*

1. **`CremaItalia_ClaudeCode_Brief_v1.md`** — HOW to build (stack, file
   structure, metafields, templates, 10-phase build sequence). Authoritative.
2. **`CremaItalia_ShopifyMagic_Prompt_v1.md`** — the business logic (shelf
   rules, pricing formula, discounts, shipping, the Promise). Authoritative.
3. **`CremaItalia_POC_v2.html`** — the clickable design + interaction reference.
   Open in a browser. Source of truth for layout and UX.

(The earlier v1 architecture I drafted is superseded by the above. Key
upgrades captured below.)

---

## What changed from the v1 plan

- **Custom Liquid theme — no starter theme** (locked). Build from scratch; still
  use sections/blocks where editable content makes sense.
- **Navigation is now: Shop · Trovare · La Bottega · About** + Sign In +
  "Start Your Tour". (`Trovare` = region picker; `La Bottega` = accessories +
  affiliate links. NOTE naming conflict — see open questions.)
- **Filter is now THREE axes: Region × Shelf × Taste Profile** (was two).
- **Taste quiz** (NEW) — first-visit modal, 3 questions (roast / flavor /
  caffeine), assigns a named profile, stored in `localStorage` + customer
  metafield `crema_italia.taste_profile`, pre-populates Shop filters.
- **Custom account portal** (NEW) — `customers/account.liquid`: taste profile
  edit, Roccia subscription management (via subscription app API), order history,
  Founding Member badge, persistent "10% active" subscriber indicator.
- **Per-shelf product templates** — `product.roccia/sorpresa/selezione/offerta`.
- **Pricing formula (locked):** US = Italian retail EUR × 0.60 × markup × 1.165.
  Markups: 100g 3.5× · 250g 2.8× · 1kg 2.2×.
- **Full discount architecture** — Subscriber 10%, Founding Member 12% (first
  100), Sorpresa-only 10%, Offerta 25/35% (subs stack +10% — only stacking
  exception), volume bundle, first-time 10%, win-back 15%, BFCM, referral.
  Mechanisms: Shopify Functions + subscription app + Klaviyo codes.
- **Metafield namespace `crema_italia.*`:** `roast_level` (light/medium/dark),
  `flavor_profile` (fruit/sweet/terroir), `caffeine` (full/decaf), `shelf`,
  `region`, `roaster_handle`, `roast_date`, `best_by_date`.
- **Collections:** all-coffee, roccia, sorpresa, selezione, offerta, toscana,
  bottega. **Product types:** coffee-roccia/sorpresa/selezione/offerta, accessory.
- **La Bottega** — carried accessories (Shopify products tagged `bottega`) +
  affiliate links (static HTML, `rel="noopener"`, with disclosure).
- **Email = Klaviyo** (welcome series, abandoned cart, win-back) — outside theme
  code but referenced by funnel logic.
- **Build sequence = the brief's 10 phases** (Shell → Homepage → Shop+filters →
  Trovare+region → Product → Roaster → La Bottega → Account → Quiz → Checkout).

## v2 prototype pages (confirmed present)
home · shop · trovare · roccia · sorpresa · selezione · offerta · toscana ·
roaster-gardelli · roaster-lasosta · product-gardelli · product-lasosta ·
product-decaf · about · promise · faq · bottega (+ taste-quiz modal, sign-in
modal, signed-in state, profile banner).

---

## OPEN QUESTIONS — need Steve's decision before/at Phase 1

1. **Subscription engine — CONFLICT.** The brief locks **Recharge (preferred)
   or Skio**. On 2026-06-24 Steve chose **Shopify Subscriptions (free)**. These
   are incompatible directions: the brief's custom account portal + Recharge API
   subscription management + discount stacking assume Recharge/Skio. Resolve
   before building Phase 2/8. (Recharge = paid + API + richer portal; Shopify
   Subscriptions = free + simpler but limited portal/automation.)
2. **La Bottega vs Supplies/Equipaggiamento.** Brief nav says **La Bottega**;
   the Magic prompt calls the same section **Supplies & Equipment
   (Equipaggiamento)**. Pick one label for the top nav.
3. **Quiz + account portal in launch scope?** Brief includes both (Phases 8–9).
   Confirm they're in the launch build, not fast-follow.
4. **Discount logic (Shopify Functions) timing.** Subscriber-privilege +
   stacking + Founding Member overrides need Shopify Functions. Confirm building
   in the launch window (brief Phase 10) vs deferring.
