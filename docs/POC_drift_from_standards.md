# POC drift from the Standards — the "knowingly behind" ledger

**What this is.** A living list of every place the POC (`templates/`, `snippets/`, `assets/ci-*`)
**knowingly diverges from the current Standards** (`docs/standards/`). Until 2026-07-13 the POC was
always kept current with the Standards, so "read the POC" was safe. That is no longer guaranteed: some
decisions now live in the Standards ahead of the mock, on purpose. This file is where we record that gap
so the production build cannot miss it.

**How it's tracked (two halves, keep them in sync):**
1. **This ledger** — the human-readable index, read before the production build.
2. **`// DRIFT:` code markers** at each divergent spot. Find them all with:
   `grep -rn "DRIFT" assets/ templates/ snippets/`
   Every code marker points back here; every row here names its code location.

**The rule going forward:** when a Standard changes in a way the POC no longer matches, either fix the
POC in the same pass *or* add a row here **and** a `// DRIFT:` marker. When a divergence is later fixed
(in the POC or in the production build), strike its row and delete its marker.

> This is a **log-style companion**, not a Standard. The Standards say what is true; this says where the
> mock lags. Authority is always the Standard (`docs/standards/`), never the POC.

---

## Open divergences

*(none — D1/D2/D3 and the `:436` watch item were all resolved in the POC8 batch 2026-07-13; see Resolved.)*

---

## Resolved (kept for provenance; strike, don't delete)

**All fixed in the POC8 batch (2026-07-13, commit `POC8_HASH`).** The POC cart now computes a per-line
`MAX` (single highest applicable rate, never a sum), and all customer-facing copy presents the discounts
as alternatives. `// DRIFT` markers removed. Verified in `shopify theme dev`: founding subscriber +
first-time shows 12% on Roccia/Sorpresa/Selezione lines and 5% on an Offerta line; a non-subscriber
first-timer shows 5%. See `CLAUDE.md` §9 2026-07-13 (POC8) + `docs/POC8_change_list.md`.

### ~~D1 — Cart discounts stack instead of taking the MAX~~ RESOLVED (POC8)
- **Standard:** Store Operating Standards **v1.2 §3** — no stacking; `applied rate = MAX(all qualifying
  discounts)`. A first-time founder/subscriber gets 12/10%, never 12%+5% = 17%.
- **Was:** `assets/ci-storefront.js`, `renderCart()` discount math — applied the subscriber/founder
  rate (10/12%) and then **added** first-time 5% on top (up to 17%).
- **Fix:** replaced the summing block with a per-line `MAX` over every candidate the line qualifies for
  (founder/subscriber standing benefit on Roccia/Sorpresa/Selezione + first-time 5% on all shelves except
  Bottega); `discount = Σ (line_total × line_rate)`. Also corrected the latent miss where the discount
  branch only ran for subscribers — a signed-in first-time **non-subscriber** now correctly gets 5%.
  Summary line honest (no "12% + 5%" concatenation).

### ~~D2 — Cart guest banner copy implies additive stacking~~ RESOLVED (POC8)
- **Standard:** Store Operating Standards **v1.2 §3** — discounts never stack.
- **Was:** the guest sign-in banner framed 5% and 10% as additive ("… discount **plus** subscriber
  benefits of 10% …").
- **Fix:** reworded to present the two as alternatives — "a one-time 5% first-purchase offer, or 10% off
  Roccia, Sorpresa, and Selezione with a subscription. You receive the higher of the two, never both."
  No "plus."

### ~~D3 — FAQ states first-time 5% "stacks" to 15%~~ RESOLVED (POC8)
- **Standard:** Store Operating Standards **v1.2 §3** — no stacking; highest single discount wins.
- **Was:** `templates/index.liquid`, the "How do subscriber discounts work?" FAQ — *"a one-time
  first-purchase 5% **stacks** on top - so a new subscriber's first order is **15%** off eligible shelves."*
- **Fix:** rewrote the answer — removed "stacks" and "15%"; states discounts never stack and the customer
  receives the single highest applicable rate (a first-time founder still gets 12%, not 17%).

### ~~Watch — `ci-storefront.js:~436` implied stacking~~ RESOLVED (POC8)
- **Was:** the Roccia subscription-toggle blurb read "10% off every shipment, free shipping, **plus
  subscriber benefits across the site**" — muddled, since the 10% *is* the subscriber benefit.
- **Fix:** reworded to "10% off every shipment and free shipping, your standing subscriber benefit on
  Roccia, Sorpresa, and Selezione." (`templates/index.liquid:~135` "10% discount plus free shipping"
  was left as-is — shipping is a separate benefit, not a stacked percentage.)

---

*Created 2026-07-13 alongside Store Operating Standards v1.2. Companion to `CLAUDE.md` §9 and
`docs/production_build_spec.md`. Grep for `DRIFT` in the theme assets to find the code side.*
