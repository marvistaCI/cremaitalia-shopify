# POC17 change list — trust & social proof

**Build record only.** For what is deployed, read `CLAUDE.md` §10 CURRENT STATE and verify it live
(`shopify theme list`) before acting. Nothing in this file states deployment state, by design — a
stale banner in a file like this one caused the duplicate-theme incident of 2026-07-24.

Commits `318ea7e`..`5e71413`. Decisions live in **Store Operating Standards §13**; build technique in
`docs/production_build_spec.md` §6.1 and §9.2; narrative in `CLAUDE.md` §9 (2026-08-20).

---

## What this batch is

The last open dimension on the storefront scorecard. Trust & social proof had scored **3.5 in all
three passes**, never moved, and sat four points below the next-lowest. It was a decision before it
was a build, and the decision turned on something neither earlier pass had costed.

## The decision, in one line each

| | Decision |
|---|---|
| D1 | Collect ratings, rendered through a **bespoke discreet control** of our own design |
| D2 | That control **links to a dedicated review-detail view** |
| D3 | **Emit `aggregateRating`** in production |
| D4 | Reorder rate: **logic built now**, switched on when data supports it |
| D5 | **No photograph reviews** |
| D6 | **Publish all but abusive**, with *abusive* defined |
| D7 | **Purchase-gated only**, via emailed per-order links; public form disabled |
| D8 | Folded into D7 as redundant |

Later, on review: the mark is **stars plus a numeral** (Steve), placement is guarded to
**purchasable product detail views only**, and **Bottega is its own rating context**.

## The tension, and why it mostly dissolved

The first audit argued for palate-matched feedback and reorder rate over a global five-star average,
and `aggregateRating` models exactly the average being rejected — so the better on-site signal looked
like it cost the star rich-result. Three things collapsed that:

1. **Different surfaces.** Google requires a marked-up rating be *visible*, not that it lead. A
   discreet control satisfies the crawler while the average does none of the persuading.
2. **No product URLs.** On a one-URL SPA there is nothing to attach a rich result to, so the cost of
   deferring was zero and is not yet live.
3. **A rating is a required field** in Shopify's standard review schema. "Collect no stars" was never
   on the menu.

What the audit got right was the destination. What it never costed was **volume**: palate-matching
works by segmenting, and segmenting divides the sample — roughly 15 coffees x 9 taste cells x ~20
responses is ~2,700 reviews, against maybe 300 a year at realistic volume. Reorder rate is worse,
being undefined until two turns of the 60-day freshness cycle. Hence the minimum-*n* floors and a
ladder rather than a choice.

## The dev-store test

Probe theme served through `shopify theme dev`, baseline captured **before** installing anything so
absence could be told from failure. Judge.me free installed, one review entered by hand.

```
PROVEN    product.metafields.reviews.rating        {"scale_min":"1.0","scale_max":"5.0","value":"2.0"}
          product.metafields.reviews.rating_count  1
          read by our own Liquid, server-side, no JavaScript

UNPROVEN  product.metafields.reviews.product_reviews   nil
          standard product_review metaobject definition   absent from the store
```

Probable cause is benign: Judge.me syndicates review *metaobjects* through the **Shop channel**, for
Shop-eligible stores, and a Partners dev store is not one. That fits the evidence exactly — the
aggregate metafields, written directly, populated; the metaobject records, travelling the Shop
pathway, did not. **Recorded as unproven, not refuted.**

**Open with Judge.me support, two parts:** does metaobject syndication require Shop eligibility, and
does a syndicated review populate `author` with the customer reference. The second decides whether
the palate-match join is free.

## What was built

| Item | Where |
|---|---|
| Rating mark — stars + numeral, whole-star rounding, hairline empties | `ci-storefront.js` `ratingMark()`, `ci-storefront.css` |
| Empty state with Steve's copy, revealed on click | same, `toggleRatingHint()` |
| Review detail view, fields shaped to the metaobject | `reviewsPage()`, `#page-reviews` in `index.liquid` |
| Reorder line, floor as a named constant | `reorderLine()`, `POC_REORDER_FLOOR` |
| Fixture data | `poc_rating` in `ci-catalog.json` |

**Placement guards, all verified live:** 0 marks on roaster profiles, 0 on person pages, 0 in any
grid. The test for "purchasable" is `sizes`, not which page is showing.

**The asymmetry that matters:** the detail view renders the control **even when empty**; a grid never
renders a null at all. One null is the only thing on the page telling a purchaser a route to rate
exists; thirteen down a shelf page is a wall advertising an empty store.

## Two things worth keeping

**The bug, and how it surfaced.** Bottega renders through a **separate branch of
`productDetail()`**, so the first insertion reached only the coffee path and the mark was silently
absent on every Bottega item. **The diff looked entirely correct; the DOM did not.** Caught by
asserting on rendered output, not by reading. There are **17 shelf-conditional branch points** in
`ci-storefront.js` and one had already diverged — the evidence behind the queued architecture review.

**Fixture naming.** Ratings live under `poc_rating`, deliberately **not** the production `reviews.`
namespace, so a grep for the real namespace never hits fixture data and one grep for `poc_` finds
everything that must go — the same convention `ci-temp-*` uses for the placeholder photography.
Standard §13.7: no fabricated rating may ever appear on the live store.

## Verification

`node --check` and `JSON.parse` clean. `theme check` at the documented baseline — **15 offenses /
0 errors / 0 new**. Driven live via `shopify theme dev` with DOM assertions on every guard, and
**looked at**: three screenshots (populated detail, empty state with the reveal, review view).

## Open after POC17

- **Judge.me support**, the two syndication questions above.
- **Re-score** against POC17 — expected to be the last before real photography.
- **Architecture review, as two reviews.** (A) Is the POC internally sound — duplicate render paths,
  diverged shared components, dead code, starting with those 17 shelf branches. (B) Is the POC a good
  specification for production — which parts are decisions worth carrying, which are mock scaffolding
  that must never be carried. B is not a new artifact: `production_build_spec.md` already is that
  document, but it grew reactively and nobody has walked the POC systematically against it.
- **Seam audit.** The 26 `PROD:`/`LOOP:` markers have never been checked for *completeness*. An
  unmarked mock is invisible at production time, because it simply looks like working code.
- **Bottega card-level ratings**, if the coverage floor is ever revisited — §13.5.2 leaves that door
  open on its own terms, since the comparison objection does not apply to equipment.
