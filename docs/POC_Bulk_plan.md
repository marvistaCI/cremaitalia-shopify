# The bulk line - planned changes, in order

Consolidated 2026-11-24 from the §10 "order of work" paragraph and the 2026-11-17 log entry, which
between them held the whole plan but in two places. **This is the review list for the bulk line.**
State (what is deployed) stays in `CLAUDE.md` §10; this file is the backlog and is kept current by
striking items as they ship, naming the batch that shipped them.

Two kinds of item live here and land in two places. **Bulk-model work** happens on branch `poc-bulk`
and ships as `POC_Bulk_v<N>`. **Model-neutral work** (wanted whether the sealed or the bulk model
wins) lands on `main` first and is merged forward, per the amended freeze rule in §10. Each item says
which it is.

## A. Standards before copy - Store Operating Standards v1.24 (bulk model)

Nothing in B or C is built until these are decided and published, because every one of them changes
what the storefront may promise. The 2026-11-17 finding was that the sealed model had no section of
its own in the Standard - it lived in §10's exclusions, the Roaster Guide and storefront copy - which
is why its reversal shows up as scattered contradictions rather than one edit.

1. **A supply-chain and packaging section.** Roasters ship sealed valved bulk bags of 2.5 to 20 kg,
   marked with lot and roast date; a forwarder collects within days of roasting; the coffee flies;
   Crema Italia opens and repacks it in Florida into its own valved bags of 100 g, 250 g, 500 g and
   1 kg, printing the roaster's label from their artwork under a label licence, carrying the roast
   date and lot from the bulk bag, with an FDA block reading "Imported and repacked by Crema Italia".
2. **100 g as an ordinary consumer size.** Today §1 says 100 g exists only inside collections, the
   §2.2 matrix prices it only as a collection component, and §12.6 voids the old referral reward for
   lack of a standalone 100 g SKU. All three move.
3. **How "repacked" is said to the customer.** The coming-soon page already carries Steve's wording
   (unaltered roast; repacked shortly after landing; the bag names roaster, coffee and roast date).
   The Standard should carry the rule those sentences follow so the storefront copy in B has one
   source.
4. **The freshness window under repack.** Whether the 90 / 150-day clock runs from the roaster's
   roast date (it should - the bag carries it) and what the §5.4 "Roasted on or after" floor means
   when we, not the roaster, record the date.
5. **Whole bean as our choice.** §10's whole-bean rationale rested on "the roaster's sealed bag".
   Under repack it is a decision we make and must say so.
6. **Cadence.** Orders become small and frequent rather than a 6-to-10-week pallet; §10's "no
   roast-day shipping-cadence claims" and §12.2's price-tool cadence both assume pallets.
7. **Who repacks, and the food-facility consequence.** Our own premises or the 3PL; either way a
   registered food facility, which bears on the 3PL questionnaire (§12.9) and on the FDA posture.
8. **The SKU standard's label semantics.** Labels are now printed by us from the roaster's artwork,
   so "SKUs are handed to a roaster for label printing" and the per-size `Label <size>` flag need
   rewriting; the argument that a SKU carries no shelf segment is unchanged and still right.
9. **A lot is a bulk bag.** §13.9's lot model gains the fact that the roast date is recorded by us at
   repack from the bulk bag's marking, and that one bulk bag yields several retail sizes.

Bulk-model, on the branch. Published through `crema-std-publish` as v1.24, both touched renders
regenerated and delivered.

## B. POC_Bulk_v2 - the copy and promise surfaces

Every sentence below is true under the sealed model and false under the bulk one. Rewritten only
after A is published, so the storefront and the Standard cannot disagree on day one. Enumerated by
grep on 2026-11-24, so the list is the theme's, not memory's.

10. **The hero line** - "Exactly as the roaster sealed it... in Italy." (`templates/index.liquid`,
    and the long comment block above it that records how it was settled).
11. **The meta description** in `layout/theme.liquid` - "sold exactly as the roaster sealed it".
12. **The three beats under the hero** - check all three; "Slow boats age the beans." survives,
    the "we fly it in" beat may need the repack step.
13. **About, Our model** - "We import; we never interfere... nothing re-roasted, re-ground, or
    re-bagged."
14. **The Promise page** - "in the roaster's own sealed bags".
15. **The FAQ** - "We never roast, blend, or repackage." and the freshness entry's "Every bag
    carries its roast date" (still true, but the bag is now ours).
16. **The grind guide's rationale** wherever it leans on the sealed bag.
17. **Five roaster blurbs** in `ci-catalog.json` - "Whole bean, valve-sealed, unchanged." and
    Gardelli's "nothing repackaged".
18. **Two product `long` passages** - Gardelli Ethiopia "Imported whole bean in Gardelli's
    valve-sealed bag" and the Geisha's "when this pallet is gone".
19. **The photography brief** for the product-shot slot, which asks for "one of OUR roasters'
    sealed bags" - it becomes our bag carrying their label.
20. **The home shelf cards and Sorpresa copy** - anything stating 100 g exists only in collections.

Bulk-model, on the branch. Ships as `POC_Bulk_v2`.

## C. POC_Bulk_v3 - the size, lot and label model

21. **100 g in the size arrays and the price matrix** for every coffee, with the Roccia subscription
    size rule (today 250 / 500 / 1 kg only) decided rather than inherited.
22. **The lot record** as a bulk bag: roast date, lot, kilos received, sizes repacked from it.
23. **The label model**: roaster artwork under licence, our FDA block, roast date and lot carried,
    the SKU printed - what the pro-forma label audit in build spec §15.2 actually checks.
24. **Wholesale** becomes trivial under bulk (a size, not a channel); the decision document in
    `docs/wholesale/` should be re-read against the new model before anything is built.

Bulk-model, on the branch.

## D. Model-neutral - lands on `main`, merged forward

25. ~~**The taste quiz aligned to the SCA Flavor Wheel.**~~ Shipped as `POC_Bulk_v1`
    (`de70f61`, 2026-11-24).
26. **The taste-profile match line.** On every card and product page: the gold state dot and
    "Matches your taste profile." on its own line directly under the freshness strip, shown whenever
    a profile exists and the coffee matches it, filter on or off (Steve: redundancy that teaches where
    to look is cheap); nothing shown on a coffee that does not match, never a negative. One matching
    function shared with the filter, sparse-combo relaxation included; binary, not graded. Decided
    2026-11-24, not built.
27. **The Italian descriptor list** for the Product Onboarding form, drawn from the SCA's own Italian
    edition of the wheel (confirmed to exist, 2026-11-24) and checked by Lucia. A document, not a
    theme change; gated on obtaining that edition.

## Already done

- The live coming-soon page no longer claims "never repackaged by us" - Steve's replacement
  wording pushed to the live theme 2026-11-17 (`881327a`).
- `main` frozen at tag `poc33-sealed`, branch opened, POC33 theme renamed to the Sealed Reference,
  deploy skill taught two lines (2026-11-23).
- POC31 and POC32 pruned on Steve's go (2026-11-24); the sealed line is the Sealed Reference alone.
