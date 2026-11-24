# POC_Bulk_v2 change list - the taste-profile match line, and a sentence that no model could carry

**Status: see CLAUDE.md §10 for deployment state; this file is the ledger, not the state.**

Built 2026-11-24 on `main` and merged forward into `poc-bulk`, because neither item depends on the
sealed-versus-bulk model (`docs/POC_Bulk_plan.md` items 19 and 11, section C and section A). Deployed
once, on the bulk line. The plan's section headings no longer pre-assign theme numbers: a theme is
numbered by what ships, and this batch took `v2` ahead of the copy-and-promise work that is waiting on
Store Operating Standards v1.24.

## 1. The taste-profile match line

**The gap.** After the quiz, a customer who chose "Show me everything" kept their profile and was shown
the whole shelf with no indication of which coffees matched it. The only signal was the ribbon's
"not active - all 12 coffees are shown". The customer who distrusts a filter is exactly the one a
quiet marker helps.

**What it is.** On every coffee card and on the product page, directly under the freshness strip: the
ribbon's gold state dot and one sentence, "Matches your taste profile." Steve's design decisions,
in order of how much they changed the build:

- **Shown whenever a profile exists and the coffee matches it, filter on or off.** I had proposed
  filter-off only, since with the filter on every visible card matches. Steve: a marker that comes and
  goes is harder to learn than one that is always in the same place; redundancy that teaches where to
  look is cheap, and the hidden cards cost nothing.
- **A sentence, not a glyph.** Steve's first idea was a small bean with a hover tooltip. The bean was
  argued off (on a coffee site every tile is coffee, so a bean says "coffee" before it says "you"; and
  Brand Standards §3.5 forbids illustrated bean motifs), but his instinct to put it in words won over
  my tooltip: visible text needs no hover, which does not exist on touch (build spec §8), and reads to
  a screen reader as text.
- **Its own line under the strip, not inside it.** Steve suggested appending the sentence to the green
  "Roasted on or after" strip. Kept the stack he described but as two containers, because the strip's
  green means fresh and is the same for everyone, while a match is personal; and the strip is not
  uniform (Sorpresa says "Assembled to order", Offerta "Sold as-is", accessories have none).
- **Never a negative.** A coffee that does not match shows nothing. A storefront should not label its
  own coffee as wrong for someone; the missing line beside a present one already says it.
- **Binary.** A coffee that matches roast but not flavor is not a match. A "close match" tier is a
  second definition of the word and is not built.

**One predicate.** `tasteMatches(f, t)` is now the single taste test, and both filter loops
(`applyFilters` for the Shop grid, `applyTasteToGrid` for the shelf pages) call it, as does
`matchesProfile(p)`. Before this batch the three-line roast/flavor/caffeine test was inlined twice;
a third copy for the marker would have been the two-homes defect this project keeps finding. The
marker tests against the **saved** profile, not an ephemeral console edit, because the sentence says
"profile". A profile with no constraint on any axis (Surprise me, skipped flavor, both caffeines)
marks nothing rather than everything, since it says nothing about taste. Lines are re-evaluated from
`updateRibbon()`, which already runs on every page change and every profile change, so a line cannot
lag the profile that produced it.

**Rendering.** Cards and the product page render the line always, with the `hidden` attribute when it
does not apply, so a profile change flips an attribute rather than re-rendering grids. The CSS carries
`.match-line[hidden]{display:none}` explicitly, because `display:flex` on the element would otherwise
defeat the attribute. Text is `--ci-crema-text`, the AA sibling of gold from POC23.

## 2. Our process sentence deleted from five roaster bios

"Whole bean, valve-sealed, unchanged." (and Gardelli's "nothing repackaged") sat in the second
paragraph of each roaster's `bio` - a field the **roaster** fills in production, carrying a claim
about **our** fulfilment. No model can carry that sentence there, so the fix is a deletion rather
than a rewrite, and it needs no wording from v1.24. Nothing replaces it. Product descriptors with
sealed-model wording (Gardelli Ethiopia's `long`, the Geisha's pallet) are invented demo data and are
out of scope by Steve's call; they are written by the roaster in production.

## Verified

- `node --check` and `JSON.parse` clean; `theme check` at the documented baseline.
- Driven live: no profile, 0 of 12 lines visible; medium + sweet + full with "Show me everything",
  12 cards visible and 6 lines, on exactly the six coffees the filter would keep; the same profile
  with the filter on, 6 cards visible and all 6 carry the line; toggled back off through the ribbon's
  real button, 12 visible and the same 6 lines; the no-constraint profile, 0 lines; the product page
  shows the line on a matching coffee, renders it hidden on a non-matching one, shows it on the
  collection (through its components), and does not render it at all on an accessory.
- Looked at: a matched card and an unmatched neighbour at desktop, the product page, and a matched
  card at 375 (no overflow, line height 19px).
- Zero inlined copies of the taste predicate remain in the JS.
