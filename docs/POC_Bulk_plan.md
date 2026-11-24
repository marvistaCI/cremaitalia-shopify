# The bulk line - what gets built into the POC, in order

Rewritten 2026-11-24 after Steve's review: **theme work only.** Standards decisions, roaster
communications, the Italian descriptor list, label printing, 3PL questions and the wholesale document
are operations and live elsewhere (the Decisions sheet, the Standards, build spec §15). This file is
the build backlog for branch `poc-bulk`; state (what is deployed) stays in `CLAUDE.md` §10. Strike
items as they ship, naming the batch.

**One dependency, stated once rather than per item:** the replacement wording for every sentence in
section A comes from Store Operating Standards v1.24 (the supply-chain section and its decisions on
100 g, how "repacked" is said, freshness under repack, whole bean as our choice, and cadence). Those
are Steve's decisions, not build items, and A is not written until they are published. The
coming-soon page already carries his wording for the core claim and is the seed.

Every line below was found by grep on 2026-11-24, not remembered. Line numbers are as of commit
`de00823` and will drift; the quoted text is the anchor.

## A. Next copy batch - every place the storefront claims we ship the bag the roaster filled

1. **Hero H1** - "Exactly as the roaster sealed it... in Italy." (`templates/index.liquid`), plus
   the comment block above it recording how the line was settled, which must not keep describing a
   line that no longer exists.
2. **Meta description and the share description** - "sold exactly as the roaster sealed it" in
   `ci_meta_desc`, and the separate `ci_og_desc` that the Open Graph and Twitter tags carry
   (`layout/theme.liquid`); two strings, both to be checked.
3. **The three beats under the hero** - review all three against the new model. "Slow boats age
   the beans" survives; "We fly it in" may need the repack step; the "how it works" comment
   (roaster seals, we fly, you grind) is rewritten with them.
4. **Our model** - "They are the masters of roasting and packaging - we are the means of getting
   their coffee to you, unchanged." We package now.
5. **Founder story** - "bring their coffee here, unchanged. Just Italy, roasted into a bean."
   Review only: "unchanged" is still true of the roast, which is what the sentence is about.
6. **About, Our company** - "We import; we never interfere. Each roaster's coffee reaches you
   exactly as they roast and seal it - nothing re-roasted, re-ground, or re-bagged."
7. **Promise page, shipping** - "in the roaster's own sealed bags".
8. **FAQ** - "No. We import and curate; the roasters roast. We never roast, blend, or repackage."
   Rewrite, and add the question the new model raises: who packs the bag, and what is on it (roaster,
   coffee, roast date, lot, "Imported and repacked by Crema Italia").
9. **FAQ, freshness** - "Every bag carries its roast date, and every coffee on our shelves shows the
   roast date of the oldest bag we hold". Still true; verify the wording survives the v1.24 decision
   on where the clock starts, and change nothing if it does.
10. **Journal teaser, Brewing** - "We sell whole bean because that is what our roasters seal".
    Whole bean becomes our choice and the sentence has to give our reason.
11. ~~**Five roaster blurbs** in `ci-catalog.json`~~ **Shipped as `POC_Bulk_v2` (2026-11-24).** Was: - "Whole bean, valve-sealed, unchanged." and
    Gardelli's "nothing repackaged." **Scoped to a deletion, not a rewrite (Steve, 2026-11-24):**
    the sentence is a claim about OUR process sitting in a field the ROASTER fills in production, so
    no model can carry it there. Remove the sentence; nothing replaces it. No v1.24 dependency.
12. ~~Two product `long` passages (Gardelli Ethiopia's valve-sealed bag; the Geisha's pallet).~~
    **Dropped (Steve, 2026-11-24): product descriptors are invented demo data and are written by
    the roaster in production. Not a build item.**
13. **The photography brief** in the template comment for the product-shot slot, which asks for
    "one of OUR roasters' sealed bags" - it becomes our bag carrying their label.

## B. Size model batch

14. **100 g as a consumer size** on every coffee: a fourth entry in each `sizes` array with a price,
    the product page's "Bag size" pills (four pills must still hold one row at 375, the POC15
    constraint), and the price denominator. The pricing figure is a v1.24 placeholder like every
    other number before launch.
15. **Roccia subscription sizes** - the page says "Bag sizes 250 g, 500 g, and 1 kg" and the
    subscription toggle offers the same; both follow whatever v1.24 decides about 100 g on
    subscription.
16. **Sorpresa and the home shelf card** - "three 100 g bags" remains true for a collection; what
    changes is any implication that 100 g exists only inside one. Review the Sorpresa page, the
    shelf card and the collection's blurb and `long`; change only what implies the old rule.
17. **Freshness display under repack** - the "Roasted on or after" floor and the Offerta band keep
    their mechanism, since the roast date still comes from the roaster's marking. Verify by driving
    after A ships; expected result is no change.

## C. Model-neutral builds - land on `main` first, merged forward

18. ~~The taste quiz aligned to the SCA Flavor Wheel.~~ Shipped as `POC_Bulk_v1` (`de70f61`).
19. ~~**The taste-profile match line.**~~ **Shipped as `POC_Bulk_v2` (2026-11-24).** Was: On every card and product page: the gold state dot and
    "Matches your taste profile." on its own line directly under the freshness strip (and under the
    product-page title), shown whenever a profile exists and the coffee matches it, filter on or off;
    nothing on a coffee that does not match, never a negative. One matching function shared with the
    filter, sparse-combo relaxation included; binary, not graded. Decided 2026-11-24, not built.

## Not build items, recorded so they are not re-asked

- The lot record as a bulk bag and the label model: not storefront surfaces (build spec §0 - the POC
  models only what we write production code for). The POC's per-product `roast_date` is adequate.
- The SKU standard's label-flag semantics, the Italian descriptor list, who repacks, the 3PL
  questionnaire, wholesale: Standards and operations, tracked in the Decisions sheet.
