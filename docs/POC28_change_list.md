# POC28 — the shipping repricing reaches the cart

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is authoritative.

This file is the build record. It was written while the batch was staged, on Steve's call to
fold the repricing into a batch rather than deploy a two-constant change on its own. The
"Verification when this deploys" section below is retained as the checklist that was actually
run, not as a pending item.

---

## Why this exists

Store Operating Standards **v1.16** (2026-08-24) repriced outbound shipping: free at **$69+**, flat
**$12.50** under, free tier **contiguous U.S. only**, threshold measured **after discounts**. The
decision itself was Steve's and had been locked on 2026-08-23; v1.16 is where it finally reached the
Standard.

The POC cart was still computing the retired pair, so a preview link and the Standard disagreed on a
commercial rule. Under the provisional-values rule added the same day, both numbers are modelling
placeholders — but that rule explicitly **does not license leaving contradictions in place**, since
we reason against these numbers now. Hence: fix it, queue the deploy.

## What changed (commit `c91ee87`)

**`assets/ci-storefront.js`**

```js
var FREE_SHIP_THRESHOLD = 69;
var FLAT_SHIP_RATE = 12.5;
```

Two things happened here, and the second matters more than the repricing.

`FREE_SHIP_THRESHOLD` moved 55 → 69. But the flat rate had never been a constant at all — it was a
**bare `8.5` sitting inline** in the cart summary math:

```js
var shipping = (allSub || subtotal >= FREE_SHIP_THRESHOLD) ? 0 : 8.5;
```

That is a commercial rule shipped as a literal, which `production_build_spec.md` §11 prohibits, and
it is exactly the shape that drifts silently: the threshold was findable by name and the flat rate
was not, so a sweep for one would never surface the other. It is now `FLAT_SHIP_RATE`, with a
comment naming the Standard section that owns both values and a `PROD:` note that in production they
come from Shopify shipping profiles rather than from the theme.

**`templates/index.liquid`** — a `PROD:` comment described the "$55 free-shipping threshold" as
spec-locked. It now names **neither** number. A comment restating a commercial rule is a second home
for that rule, and second homes drift; it points at the constants instead.

## What rides along

The batch will also carry commit **`2b80122`** (the coming-soon footer policy links), because it
touches `snippets/ci-footer.liquid` and `assets/crema-italia.css`, which sit in the repo root and go
out with any theme push. **That is harmless on a POC preview** — the POC storefront renders
`ci-store-footer.liquid`, while `ci-footer.liquid` serves `password.liquid` and `404.liquid`. Worth
knowing so the diff is not read as a surprise.

Its real destination is the **live** theme (`150557294761`), which is a separate scoped push and is
still outstanding — the classifier blocked it on 2026-08-24 and it needs Steve's hands. Deploying
POC28 does **not** discharge that.

## Verification when this deploys

- Cart with a sub-$69 one-time subtotal shows **$12.50** estimated shipping, and the progress bar
  reads *"Add $X for free shipping"* against **69**.
- Cart at $69+ one-time shows **Free**.
- Any all-subscription cart shows **Free** regardless of subtotal.
- `grep -c '8\.5\b'` in `ci-storefront.js` returns nothing outside `FLAT_SHIP_RATE`.

## Not in scope, deliberately

The contiguous-U.S. carve-out and the after-discount threshold basis are **not modelled in the POC**
and should not be. Both are Shopify shipping-profile and checkout behaviour, which the POC does not
own (`production_build_spec.md` §0). The POC's one unified shipping estimate is a testing aid, not a
model of the rate engine.
