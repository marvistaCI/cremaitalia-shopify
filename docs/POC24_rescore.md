# Storefront re-score — POC24 · 8.3 · 22 Aug 2026

**Theme:** "Crema Italia POC24 Preview" · `152030183593`
**Artifact (render):** https://claude.ai/code/artifact/25207561-daea-4408-aa79-f39960d65446
**Asserted from the page itself:** `Shopify.theme.id === 152030183593`, role `unpublished`, and the
Shopify preview bar reads *"Crema Italia POC24 Preview · Draft"*. Every figure below was read from
that live theme, never from the repo or a change list.

---

## BIAS DECLARATION — read this before the numbers

**I built POC21, POC22, POC23 and POC24 in the same session as this pass.** Five of the ten
dimensions moved on work I did hours earlier. Per the rubric's step 7 I have held contested
dimensions down rather than up, and the two most inconvenient grounds are named prominently:

- **Accessibility is capped at 8.0 despite a perfect measured surface**, because one **Level A**
  criterion is unmet (see F1). A dimension that fails Level A conformance cannot honestly score in
  the nines, however good the AA numbers are.
- **The single largest gain, Trust & social proof, is not my work.** Steve published the four legal
  policies. My contribution was linking them.

**And a correction that belongs at the top:** earlier in this session I told Steve two carried
findings were closed. **Only one was.** He caught it by asking what they meant, not by auditing me.
That is exactly the failure mode a re-score inherits, which is why step 6 exists.

---

## Six passes

| Dimension | P13 | P15 | P16 | P17 | P20 | **P24** | Δ |
|---|---|---|---|---|---|---|---|
| Brand identity & visual craft | 8.5 | 9.0 | 9.0 | 9.0 | 9.0 | **9.0** | — |
| Copy & editorial voice | 7.5 | 8.5 | 9.0 | 9.0 | 9.5 | **9.5** | — |
| Product detail quality | 8.0 | 8.5 | 8.5 | 9.0 | 9.0 | **9.0** | — |
| Value proposition clarity | 4.0 | 6.5 | 8.0 | 8.0 | 8.0 | **8.5** | +0.5 |
| Mobile experience | 7.0 | 7.0 | 8.0 | 8.0 | 8.0 | **8.5** | +0.5 |
| Technical SEO & performance | 4.0 | 7.0 | 7.5 | 8.0 | 8.0 | **8.0** | — |
| Accessibility | 2.0 | 7.0 | 7.5 | 7.5 | 7.5 | **8.0** | +0.5 |
| Conversion mechanics | 3.5 | 5.5 | 6.5 | 7.0 | 7.0 | **7.5** | +0.5 |
| Navigation & information architecture | 6.0 | 6.0 | 6.5 | 6.5 | 6.5 | **7.0** | +0.5 |
| Trust & social proof | 3.5 | 3.5 | 3.5 | 6.5 | 6.5 | **7.5** | +1.0 |
| **Overall** | **5.4** | **6.9** | **7.4** | **7.9** | **7.9** | **8.3** | **+0.4** |

Sum 82.5, mean **8.25**, reported to one decimal as **8.3**. Stated because it is a borderline round
rather than a comfortable one.

---

## Measured evidence, from the deployed theme

```
theme asserted                152030183593  "Crema Italia POC24 Preview"  unpublished
                              + Shopify preview bar reads POC24 / Draft

contrast failures             0        (16 pages + product detail + 2 modals; was 127 instances)
tap targets below 24x24       0        (after WCAG 2.5.8 inline exemptions; was 4 classes)
subscription control          292x44 effective, 2 labels, named + described
keyboard activable            76 of 76 non-semantic clickables carry role + tabindex
form controls unnamed         0
synthesised type faces        0        (enumerated the font set, not fonts.check)
real italic axis loaded       yes      (Inter 400/500/600 italic)
heading order skips           0        (1 h1 per page)
exposed main landmarks        1        (19 of 20 removed by display:none)
skip link                     NONE  <-- Level A gap, see F1

em-dashes in customer text    0
banned brand register         0        (1 string match checked and cleared, see below)
ops vocabulary leaks          0
italic on English             0

og / twitter tags             13       og:image resolves
JSON-LD                       graph: Organization, WebSite    canonical: yes   lang: en
meta description              theme-owned, hero-derived

mobile 375                    header 62px, Shop + cart + hamburger visible without opening menu
                              first CTA at 0.73 screens, above the fold
                              horizontal overflow: none (document scrollWidth == 375)
hero contrast on brown        h1 10.56 · sub-line 5.61 · CTA text on fill 4.56 · all pass

policies linked from footer   4 of 4, all resolving
```

---

## Findings carried forward from P20 — every one stated

| | P20 finding | Status |
|---|---|---|
| N4 | Rating count link 65x24 against the project's 44px standard | **FIXED** (POC24) |
| N5 | `#pd-sub` has no accessible name | **FIXED** (POC23) |
| — | The legal pages do not exist | **FIXED** — four published, verified live, linked from the footer |
| — | Real photography gates brand identity and product detail above 9 | **UNCHANGED** |
| — | Real reviews wait on customers | **UNCHANGED** |
| — | The shelf / IA question | **WITHDRAWN** — tested and false |
| — | 76 div onclick elements announce poorly | **WITHDRAWN** — 76 of 76 carry role + tabindex |

**Two carried findings were withdrawn this session after being tested for the first time**, and both
had survived four or five passes by being inherited rather than re-derived. The IA claim's sharpest
line — *"a shelf you can stand on two of at once is not a shelf"* — is empirically false: `shelf` is
never a list in the catalogue, and subscription maps exactly onto Roccia, 9 of 9. The
announce-poorly claim predates the POC14 batch that fixed it.

**That is now the most reliable finding in this document: the claims that survived untouched across
passes were the ones nobody had ever measured.**

---

## New findings

**F1 · No skip link — WCAG 2.4.1 Bypass Blocks, Level A.** *(new this pass)*
A keyboard user must tab through the header on every page before reaching content. This is the only
Level A criterion known to be unmet, and it is the reason Accessibility is capped at 8.0 rather than
scored on its measured surface. Cheap to fix: one visually-hidden anchor to the active `main`.

**F2 · No human screen-reader pass has ever been run.** Everything above is computed from the
accessibility tree. That is necessary and not sufficient — it cannot tell you whether the reading
*order* of the product page makes sense, or whether the renewal disclosure lands before or after the
control it describes in actual speech.

**F3 · 76 controls are simulated buttons, not real ones.** They announce correctly and activate on
Enter and Space, so this is not a defect a user meets. It is a durability risk: every new card or
option has to remember to route through `markKeyboardActivable`, and the production build should use
real `button` elements instead.

**F4 · Privacy is still Shopify's automated policy.** It cannot name Loop, Judge.me, or the taste
profile. **The trigger is specific rather than aspirational:** the moment the taste profile becomes a
customer metafield joined to reviews, the automated policy is describing a different business than
the one being run.

---

## Not a finding — checked and cleared

A register audit matched **"Curated with love, never aggregated."** on the home and Promise pages
against the banned-superlative pattern. **It is not the anti-pattern.** Brand Standards §9's named
example is *"We hand-pick the world's most exclusive coffee artisans"* — a superlative about our own
taste with nothing to anchor it. Here *"never aggregated"* is a concrete, falsifiable contrast doing
the actual work, the same construction POC15 deliberately kept in *"carefully chosen, not
collected."* The rubric's own guard applies: **match on meaning, not on a string that correlates
with it.**

---

## Three measurement artifacts, caught before they became findings

Recorded because the rubric exists mainly to prevent them, and this pass produced three in one
sitting.

1. **A screenshot showed the mobile hero clipped at the right edge.** Measured with Range client
   rects, the widest rendered text ends at **359px inside a 375px viewport**, and
   `documentElement.scrollWidth === 375`. A capture crop, not an overflow.
2. **A JSON-LD type read back as null.** The block uses `@graph`; the check was the wrong shape.
   `Organization` and `WebSite` are both present and valid.
3. **20 main elements.** 19 sit inside `display:none` pages and are therefore absent from the
   accessibility tree. Exactly one landmark is exposed.

---

## What stands between 8.3 and higher

**Photography is the binding constraint on two dimensions**, exactly as the last three passes said.
Brand identity and product detail cannot exceed 9 while three `ci-temp-*` stand-ins remain, two of
which cannot ship for recorded reasons — one is a US café with English chalkboards and dollar prices,
the other shows third-party trademarks.

**Conversion mechanics cannot exceed about 7.5 until the cart is real.** Cart and checkout are mocked
by design; the entitlement architecture is decided (Standard §11, v1.15) and unbuilt.

**Trust cannot exceed about 7.5 until real customers exist.** Ratings are fixture data under a
`poc_` namespace, and `reviews.product_reviews` remains **UNPROVEN, not refuted**, pending two
questions to Judge.me support.

**F1 is the only item on this list that is cheap, unblocked, and mine to fix.** Everything else waits
on a signed roaster, a photographer, or a customer.

---

---

## The prompt that drove this measurement

Published in full per the report contract, which this pass is the reason for. A pointer is not a
prompt: the previous body of this section said only "unchanged from the P20 pass - see
`docs/POC20_rescore.md`" plus the one trap below, which is how that trap came to live in exactly
one document.

**Resolved from:** `.claude/skills/crema-storefront-score/SKILL.md` at commit **`fde129a`**
(`fde129ad78e20aa32b1a125f9eed353a0792c47b`), 2026-08-24.

> **Two things below postdate this pass, and are marked so this is not read as a false record.**
> P24 ran with **six** traps in STEP 5, not seven - the **CAPTURE CROP** trap is the one *this
> pass earned*, from a screenshot that appeared to show the mobile hero clipped and did not (the
> widest rendered text ends at 359px inside a 375px viewport). And **STEP 8's report contract did
> not exist**; it was written on 2026-08-24 as the remedy. Everything else is the rubric exactly
> as run. The text is published merged rather than frozen because the contract's purpose is that a
> reader holds the current, complete instrument - and knows precisely which parts of it this pass
> did not have.

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
  - A screenshot that appears to show clipping or overflow may be a CAPTURE CROP. Before
    reporting it, measure the widest rendered text with Range client rects and compare
    documentElement.scrollWidth to window.innerWidth.
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
Give the full pass table (every pass to date), the measured evidence block, findings
carried forward, new findings, and what remains between the current score and the
stated 8.5 ceiling. Say plainly if the score did not move and why that is the correct
outcome.

Then end the report with a section titled "The prompt that drove this measurement"
carrying this entire prompt verbatim and complete, the skill commit SHA it was resolved
from, and the date. If this pass earned a new trap or refinement, state it inline AND
merge it back into the skill in the same commit. A delta that lives only in a report is
the defect this contract exists to kill.
```

### The trap this pass earned

Merged into STEP 5 of the skill in commit `fde129a`, and reproduced here because a delta that
lives only in a report is the defect the contract exists to kill:

```
  - A screenshot that appears to show clipping or overflow may be a CAPTURE CROP. Before
    reporting it, measure the widest rendered text with Range client rects and compare
    documentElement.scrollWidth to window.innerWidth.
```
