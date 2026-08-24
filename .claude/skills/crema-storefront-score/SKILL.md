---
name: crema-storefront-score
description: >-
  Score the deployed Crema Italia storefront against the standing ten-dimension
  rubric - the one instrument this project has run six times, with equal weights
  never altered, because comparability across passes is the whole value. Use this
  whenever Steve says "score the site", "re-score", "run another pass", "how are we
  doing", "measure the storefront", "where are we against the rubric", or when a POC
  batch has shipped and he wants to know whether it moved the number. It carries the
  measurement traps this project has actually hit, and a report contract: every pass
  must publish the fully resolved prompt that drove it. Code-only. It exists because
  six passes were published without the prompt that produced them, a rubric pointer
  went stale inside a single pass, and a measurement trap lived in exactly one
  document for two days.
---

# Crema Italia - storefront scoring pass

## Why this exists

Six passes ran between **2026-08-18 and 2026-08-22** - POC13 5.4, POC15 6.9, POC16 7.4,
POC17 7.9, POC20 7.9, POC24 8.3 - on one rubric, and the instrument worked. What did not work
was how the instrument itself was stored.

**Three failures, all the same shape.**

1. **Six reports were published without the prompt that drove them.** A reader could see the
   scores and not the method, so no pass was auditable and none reproducible without hunting for
   the rubric in a different document.
2. **A pointer went stale inside one pass.** `docs/POC20_rescore.md` closed by telling the next
   scorer to paste its own block; `docs/scoring-history.md` pointed at that file for the rubric;
   `CLAUDE.md` §10 still reported a score one full pass behind. Three homes, three states.
3. **A trap lived in exactly one document.** The **CAPTURE CROP** trap was earned at P24 and
   written only into `docs/POC24_rescore.md`, whose rubric section said "unchanged from the P20
   pass - see `docs/POC20_rescore.md`." The canonical block was therefore short a trap, and a
   scorer resolving the rubric the documented way would never have seen it. Merged back on
   **2026-08-24**, the day this skill was created and the reason for the report contract below.

**The rule this encodes: the rubric has one home, and every report carries the prompt it ran.**
A delta that lives only in a report is the defect this skill exists to kill.

> Same source/render discipline as the three Standards (`crema-std-publish`), same
> live-output-beats-the-document rule as `crema-poc-deploy`. **This skill is now the SOURCE.**
> `docs/POC20_rescore.md` keeps its copy of the block as a frozen historical record - do not
> paste from it, do not edit it again.

---

## What is immutable

Three things do not change between passes. Changing any of them silently destroys the series,
because every published number becomes incomparable to every other.

**The ten dimensions**, in this order:

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

**Equal weights.** The overall is the plain mean of the ten, to one decimal. There is no
weighting scheme and there has never been one.

**Score the mechanism, not the proof.** Steve's standing direction: score on whether the
mechanism is right and shipped, not on what a visitor can see today. The store is pre-launch, the
catalogue is fixture data and the photography is temporary, so the mechanism is what can actually
be built. Do not mark a dimension down for the absence of real customers, real photography or a
real cart - record those as ceilings instead.

## The ceiling

**8.5**, stated since the P16 pass and unchanged. As of P24 the score is **8.3**, and what holds
it there is not code:

| Ceiling | Dimension | Waiting on |
|---|---|---|
| **9.0** | Brand identity, Product detail | Real photography - three `ci-temp-*` stand-ins remain, two of which cannot ship for recorded reasons |
| **7.5** | Conversion mechanics | A real cart. Cart and checkout are mocked by design; the entitlement architecture is decided (Store Operating Standards §11) and unbuilt |
| **7.5** | Trust & social proof | Real customers. Ratings are fixture data under a `poc_` namespace; `reviews.product_reviews` is UNPROVEN, not refuted |

If a pass finds a new ceiling, add a row here in the same commit that publishes the report.

---

## The report contract

**Every scoring report ends with a section titled "The prompt that drove this measurement".**
No exceptions, including for a pass that moves nothing.

It contains:

- **The fully resolved prompt, VERBATIM AND COMPLETE.** Not a pointer. Not a delta. Not
  "unchanged from the previous pass." If a reader has the report, they have everything needed to
  reproduce or audit the pass without opening another file.
- **The skill commit SHA the prompt was resolved from, and the date.**
- **Any trap or refinement this pass earned, stated inline AND merged back into this skill in the
  same commit.** Same commit is the whole point - a trap merged "later" is a trap living in one
  document, which is failure 3 above.

This applies to **both renders of a pass**: the `docs/POC<N>_rescore.md` report and its published
artifact. The prompt must be byte-identical in the skill, the report and the artifact. **Verify
by diffing, never by eye.** In HTML the block needs `&amp;` entity escaping for the `&` in four
dimension names, so decode before diffing.

**No scorecard artifact is published without its source committed.** Write the artifact's HTML to
`docs/POC<N>_scorecard.html` beside the report and commit it in the same pass. A render with no
editable source is exactly what `crema-italia-pdf-builder` exists to prevent - and the first six
scorecard artifacts were every one of them published that way.

---

## The rubric, as a resolvable prompt

**This block is the source.** Resolve it from here - copy it verbatim, run it, and publish it back
in the report per the contract above.

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

---

## Where the record lives

| Artifact | Role |
|---|---|
| `.claude/skills/crema-storefront-score/SKILL.md` | **The rubric. The only source.** |
| `docs/scoring-history.md` | The series - every pass, one table, the durable record |
| `docs/POC<N>_rescore.md` | One pass in full, ending with the prompt that drove it |
| `docs/POC<N>_scorecard.html` | The artifact's committed source |
| `CLAUDE.md` §10 | The headline score only. Correct it in the same pass or it goes stale - it has twice |

**After a pass, update all of them in one commit.** P20 is the cautionary case: it published a 7.9
and left §10 reading 7.4 with "a re-score is the next task" for a re-score that had already run.

## Changelog

- **2026-08-24** - Skill created; the rubric moves here from `docs/POC20_rescore.md`. Merged the
  seventh trap (**CAPTURE CROP**, earned at P24) into STEP 5, which the canonical block had been
  missing. STEP 8 gained the report contract and lost a stale "five-pass table" phrase - the only
  two edits ever made to the block. Added the immutable dimensions, the ceiling table, the report
  contract and the artifact-source rule.
