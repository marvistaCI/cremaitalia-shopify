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

### D1 — Cart discounts stack instead of taking the MAX
- **Standard:** Store Operating Standards **v1.2 §3** — no stacking; `applied rate = MAX(all qualifying
  discounts)`. A first-time founder/subscriber gets 12/10%, never 12%+5% = 17%.
- **POC does:** `assets/ci-storefront.js`, `renderCart()` discount math — applies the subscriber/founder
  rate (10/12%) and then **adds** first-time 5% on top (up to 17%). Marked `// DRIFT` at the
  `// discount math` block.
- **Correct behavior:** compute a single `MAX` over every candidate rate the customer qualifies for
  (standing subscriber/founder benefit + any applicable campaign discount) and apply only that.
- **Production fix:** the entitlement/discount logic (Shopify Functions per Standard §11) returns
  `MAX(standing, qualifying campaign)`. Replace the summing block entirely.
- **Status:** OPEN — POC fix deferred by Steve 2026-07-13 ("the POC will be wrong"); resolved in the
  production build at the latest.

### D2 — Cart guest banner copy implies additive stacking
- **Standard:** Store Operating Standards **v1.2 §3** — discounts never stack.
- **POC does:** `assets/ci-storefront.js`, `renderCart()` guest sign-in banner — "unlock your one-time
  5% first-purchase discount **plus** subscriber benefits of 10% …", framing 5% and 10% as additive.
  Marked `// DRIFT` above the `cart-banner` html.
- **Correct behavior:** copy should present the discounts as alternatives (the customer receives the
  higher of the two), not a sum.
- **Production fix:** reword the nudge; no "plus". Tie to the D1 logic fix.
- **Status:** OPEN — same deferral as D1.

---

## Resolved (kept for provenance; strike, don't delete)

*(none yet)*

---

*Created 2026-07-13 alongside Store Operating Standards v1.2. Companion to `CLAUDE.md` §9 and
`docs/production_build_spec.md`. Grep for `DRIFT` in the theme assets to find the code side.*
