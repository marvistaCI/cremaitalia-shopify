# POC20 Re-score — fifth pass, same rubric

**Theme:** "Crema Italia POC20 Preview" · `152028446889`
**Verified:** `Shopify.theme.id` read from the live page, not assumed
**Date:** 2026-08-22
**Baseline:** POC17 · 7.9

---

> ⚠️ **POC21 shipped AFTER this pass, and the 7.9 does not cover it.** The hero was rewritten later the
> same day (commit `69e6296`, theme `152029167785`): three declarative lines replacing a two-line H1
> and a sub-line that had a dangling modifier and an unverifiable claim. **Steve's call was to hold the
> score rather than re-score** — re-scoring every batch turns a comparison instrument into noise, and
> the top end is gated on real photography either way. The next pass should run when photography lands.
>
> **For whoever scores next:** the dimension most likely to move on POC21 is **Value proposition
> clarity**, currently 8.0 — the hero is that dimension's primary surface, and it went from a sentence
> with no grammatical subject making a claim the 90-day window does not support, to a precise enforced
> one plus a differentiator (the donation pledge) that nobody else on the shelf can make. Copy &
> editorial voice is already at 9.5 and held down by a live card-vs-detail freshness inconsistency, so
> it is the less likely mover of the two.
>
> **One live dependency to check before scoring that hero:** it names **Feeding Tampa Bay** in the
> third sentence a visitor reads. Steve wrote to them on 2026-08-22 to confirm they can accept the
> beans. If the answer is no, the copy is false in the most visible place on the site — see the
> Decisions sheet of the Systems Inventory.

---

## Verdict: 7.9 → 7.9

**The score did not move, and it should not have.**

That is the finding, not a failure to find one. POC18, POC19 and POC20 were **correctness work**, not
customer-facing improvement: a wrong number removed from two homes, a display replaced because it
could lie, and badly authored fixture data corrected. The rubric measures what a visitor experiences.
Integrity fixes of this kind are invisible to it by design, and a rubric that rewarded them would be
measuring the wrong thing.

One dimension moved. **Copy & editorial voice 9.0 → 9.5**, because the batch removed a real and
repeated defect: every one of 13 fixture coffees told the customer to grind fresh **twice**, three
overlapping freshness statements were consolidated to one, and "Best by" was retired as a second
statement of a fact already shown. Redundancy is a voice failure on a brand whose stated principle is
*fewer elements, more whitespace* — so removing it is a copy gain, not housekeeping.

Dimensions sum to **79.0**, so the overall is **7.90** — the same figure as POC17 to one decimal.

---

## Five passes, one rubric

Equal weights, unchanged across all five passes, so every number is directly comparable.

| Dimension | P13 | P15 | P16 | P17 | **P20** | Δ |
|---|---|---|---|---|---|---|
| Brand identity & visual craft | 8.5 | 9.0 | 9.0 | 9.0 | **9.0** | — |
| Copy & editorial voice | 7.5 | 8.5 | 9.0 | 9.0 | **9.5** | +0.5 |
| Product detail quality | 8.0 | 8.5 | 8.5 | 9.0 | **9.0** | — |
| Value proposition clarity | 4.0 | 6.5 | 8.0 | 8.0 | **8.0** | — |
| Mobile experience | 7.0 | 7.0 | 8.0 | 8.0 | **8.0** | — |
| Technical SEO & performance | 4.0 | 7.0 | 7.5 | 8.0 | **8.0** | — |
| Accessibility | 2.0 | 7.0 | 7.5 | 7.5 | **7.5** | — |
| Conversion mechanics | 3.5 | 5.5 | 6.5 | 7.0 | **7.0** | — |
| Navigation & information architecture | 6.0 | 6.0 | 6.5 | 6.5 | **6.5** | — |
| Trust & social proof | 3.5 | 3.5 | 3.5 | 6.5 | **6.5** | — |
| **Overall** | **5.4** | **6.9** | **7.4** | **7.9** | **7.9** | — |

---

## Measured on the deployed theme

Every figure below was read from `152028446889` live, not from the repo or a change list.

```
theme id asserted             152028446889  "Crema Italia POC20 Preview"

POC20 batch content
  double-grind sentence       0 occurrences   (was on all 13 fixture coffees)
  brewing line                "Excellent as filter or in a moka pot."   clean

POC18 / POC19 freshness work
  computed floor              "Roasted on or after 24-MAY-2026"
  window statement            "These beans are within our best-freshness window of 90 days."
  "Best by"                   absent
  "peak flavour"              absent

Typography (POC14/15 regressions)
  loaded faces                Inter 400/500/600 normal + italic, Marcellus 400
  synthesised faces           0
  italic-on-English           0

SEO
  JSON-LD                     @graph: Organization, WebSite
  Product / aggregateRating   absent — correct, deliberate (no product URLs, no real reviews)
  OG + Twitter tags           13
  images without dimensions   0 of 9
  eager-loaded images         3 (above-fold only)

Mobile @375
  hero H1                     2 lines at 22.9px
  above fold                  Shop yes · cart yes
  horizontal overflow         none (scrollWidth 375)

Accessibility
  non-semantic clickables     76, of which unreachable 0
  inputs unlabelled           1 of 14  (#pd-sub, product open)

Trust
  rating mark                 "4.2 · 38 ratings", 4 gold stars + 1 hairline
  reorder rate                "62% of people who bought this bought it again."
  privacy policy link         absent
  terms link                  absent
```

---

## Both POC17 findings are still open

Neither was addressed by POC18–20, and neither is a regression — they are carried forward unchanged.

**N4 · The rating count link is a 24px tap target.** Measured again at 375px: `38 ratings` is
**65 × 24**, against the 44px standard this project set for itself in POC7 and applied to nav, filter
pills, gallery arrows, steppers and modal closes. The fix is the pattern already used on the taste
ribbon in POC13 — pad the hit area, cancel the layout cost with an equal negative margin. Fifteen of
105 controls sit under 44px at 375; this is the one built after the standard existed.

**N5 · `#pd-sub` has no accessible name.** The Roccia subscription checkbox — the one control that
changes what the customer is buying — is still announced as an unlabelled checkbox. Its label is a
neighbouring `div`, never associated. Confirmed with a product open, which is the only state in which
this control exists in the DOM.

---

## One new observation, found by looking rather than measuring

**The freshness callout is a green fill, and the palette scopes green to thin rules.**

```
.freshness   background rgba(14,122,58,.08)   color #0E7A3A   343 x 45 px
```

`CLAUDE.md` §3.2 states: *"Tricolore colors are decorative rules, NEVER large fills... Never block
colors."* This is an 8% tint rather than a block, and the text is set in green at full strength on a
palette that lists green as "thin rules only".

**Two honest caveats.** It is a *tint*, not a block colour, and the rule as written does not carve out
tints — so this may be a gap in the rule rather than in the design. And it is **not new**: `.freshness`
has carried this styling since `bafd9f0`, the original POC3 build, and survived POC15's brand sweep.
Either the usage should change or §3.2 should say what it means about tints. It is Steve's call, and
it is small.

---

## What is left between here and 8.5

Unchanged from POC17, and worth restating because nothing on it got cheaper:

- **The legal pages.** Still absent — verified again this pass, no privacy or terms link anywhere on
  the storefront. Launch-gating since July. The largest single trust item on the board and the
  cheapest thing nobody has started.
- **Real photography.** Gates brand identity and product detail above 9. Three `ci-temp-*` stand-ins
  remain, two of which cannot ship for recorded reasons.
- **The IA question.** Whether the four shelves are commercial programmes wearing the costume of a
  navigation axis. Five passes, still unresolved. A design debate, not a fix.
- **Semantic markup and a formal accessibility pass.** 76 `div onclick` elements are reachable but
  announce poorly; no contrast or screen-reader pass has been run end to end.
- **Real reviews.** Not a build task. The mechanism waits on customers.

---

## A note on the record

`CLAUDE.md` §10 still says *"Scorecard: 7.4/10 as of 2026-08-19"* and *"a re-score against POC17 is
the next task."* That re-score was **done on 2026-08-20** and scored **7.9**. §10 is stale by one
pass — the same drift class §10 exists to prevent, and worth correcting in the same pass as this
report rather than left.

---

## The rubric, as a reusable prompt

Paste this to run the next pass. It is deliberately explicit about method, because three of the five
passes were distorted by measurement error rather than by judgement.

```
Re-score the deployed Crema Italia storefront against the standing rubric.

STEP 1 — MEASURE THE RIGHT THING.
Open the deployed preview theme in a real browser and assert the theme id from the page
itself (`Shopify.theme.id`) before recording any figure. A `curl` of a preview_theme_id
link silently returns the live coming-soon page. Every figure in the report must come
from the live theme, never from the repo or a change list.

STEP 2 — LOOK, DO NOT ONLY MEASURE.
Take screenshots and read them. DOM geometry is authoritative for position, size and
keyboard reachability, and blind to crop, colour, composition and synthesised type. Six
consecutive passes on this project measured without looking and missed brand-critical
defects in all four of those categories.

STEP 3 — SCORE THESE TEN DIMENSIONS, 0-10, EQUAL WEIGHTS.
  1. Brand identity & visual craft
  2. Copy & editorial voice
  3. Product detail quality
  4. Value proposition clarity
  5. Mobile experience
  6. Technical SEO & performance
  7. Accessibility
  8. Conversion mechanics
  9. Navigation & information architecture
 10. Trust & social proof
Overall = the mean, to one decimal. Never change the weights or the dimension list; the
comparability across passes is the whole value.

STEP 4 — SCORE THE MECHANISM, NOT THE PROOF.
Steve's standing direction: score on whether the mechanism is right and shipped, not on
what a visitor can see today. The store is pre-launch, the catalogue is fixture data and
the photography is temporary, so the mechanism is what can actually be built.

STEP 5 — GUARD AGAINST THE KNOWN MEASUREMENT TRAPS.
  - Measure form inputs WITH A PRODUCT OPEN. Controls inside the product detail do not
    exist in the DOM otherwise; POC16 recorded a clean "0 of 14" by measuring with no
    product open and missed an unlabelled checkbox.
  - `document.fonts.check()` returns true for faces that do not exist, because it reports
    "can render", including by synthesis. Enumerate `[...document.fonts]` instead.
  - Hidden `.page` elements return empty `innerText`. Keep pages active while reading.
  - `text-transform:uppercase` defeats case-sensitive matching.
  - Match on meaning, not on a string that correlates with it. A grep for "DKIM1" once
    matched a hostname and reported healthy records as dead.
  - An absence is the weakest evidence there is. Before concluding something is missing,
    run a control query that you know should succeed.

STEP 6 — CARRY FORWARD, DO NOT RE-DERIVE.
Read the previous pass's open findings and state explicitly, for each, whether it is
fixed, unchanged, or a regression. A finding that silently disappears between passes is
a measurement failure, not a fix.

STEP 7 — DECLARE BIAS.
If you are scoring work you built in the same session, say so, and hold contested
dimensions down rather than up. Name the grounds that are inconvenient for the work.

STEP 8 — REPORT.
Give the five-pass table, the measured evidence block, findings carried forward, new
findings, and what remains between the current score and the stated 8.5 ceiling. Say
plainly if the score did not move and why that is the correct outcome.
```

---

*Scored against the deployed POC20 preview theme, `152028446889`, confirmed by `Shopify.theme.id`
read from the page. Same ten dimensions and equal weighting as the first four passes. All ratings and
review text on the theme are fixture data under a `poc_rating` key and describe no real customer;
Store Operating Standards §13.7 forbids fabricated ratings on the live store.*
