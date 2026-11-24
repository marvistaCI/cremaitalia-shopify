# POC_Bulk_v1 change list - the taste quiz aligned to the SCA Flavor Wheel

**Status: see CLAUDE.md §10 for deployment state; this file is the ledger, not the state.**

Built 2026-11-24 on `main` (the sealed line) and merged forward into `poc-bulk` the same day, because
nothing in it depends on the sealed-versus-bulk model and Steve wants it on both lines. Deployed once,
as the first theme on the bulk line, since the files are identical on both. The sealed line's theme
stays at the POC33 Sealed Reference; `main` carries the commit for whenever that line is next deployed.
Plain-English companion for Lucia and the roasters: `docs/taste-quiz-sca-alignment.md`.

## Why

Steve asked whether the quiz's taste words agreed with the SCA tasting vocabulary. They mostly did
(about 14 of 18 descriptors were Flavor Wheel terms) and the structure was sound, but three things were
not: the "Bold & spiced" bucket straddled four wheel categories and led with an intensity word; Q1's
roast hints were flavor words that duplicated Q2; and four descriptors (bergamot, dried fig, walnut,
milk chocolate) were not on the wheel at all. Underneath that, the data model had the defect that
matters for production: a product's filter bucket (`flavor`) and its tasting-note pills (`notes`) were
two unrelated hand-typed fields, so nothing stopped them disagreeing, and nothing tied either to what
a roaster could actually be asked for.

## What changed

**1. One taste field per coffee: `descriptors[]`, SCA Flavor Wheel terms.** `flavor`, `notes` and
`roast_level` are gone from the fixture. A coffee carries up to five wheel terms, as a roaster would
tick them on the Product Onboarding form (build spec §15.2). The collection carries `includes[]` (its
composition) and no descriptors of its own.

**2. One lookup table, `FLAVOR_BUCKETS`, in `ci-storefront.js`.** Three buckets, each an ordered list
of wheel terms. Everything derives from it: a product's buckets (`productFlavors`, possibly more than
one per coffee), the note pills on the product page (`productDescriptors`), the hint line under every
quiz card and the taste-console pill (`flavorHint`, the bucket's first five terms), and the bucket
labels. A collection's buckets and pills are the union of its components'. Unknown terms are ignored
rather than guessed: a term outside the table is a data defect to fix at the source.

**3. Key and labels.** `terroir` became `spiced` in the catalog, the quiz, the console and the persona
matrix. One label set, the quiz's sentence case, everywhere: Fruit & flowers / Sweet & chocolatey /
Dark & spiced. The two drifted label tables in the JS (one said "Fruit & Floral" and "Sweet &
Chocolate") collapsed into `FLAVOR_LABEL`, derived from the bucket table. The Regions page's nine
editorial rows use the same labels.

**4. Q1 describes roast through acidity and body, never flavor.** Light: "Brighter and lighter in
body, with a lively acidity." Medium: "Balanced, rounded, the classic bar espresso." Dark: "Fuller
body, low acidity, the roast leads." Surprise me: "No preference. Show me what is best right now."
Steve's call on acidity: it appears as a benefit on the Dark card ("low acidity") and as "brighter"
and "lively" on Light, never as "more acidic", which reads as a warning to a US buyer. Each Q1 card
carries `data-roast`, and `renderTasteCopy()` hides a roast card no public coffee can satisfy - the
regions' "as we grow" gating applied to roast. Invisible on this fixture (all three roasts exist).

**5. Roast display derives from the facet.** `roastLabel()` replaces the stored `roast_level`
string, "Mixed" for a collection. Closes a row in build spec §13's stored-twice table.

**6. Fixture prose realigned.** Blurbs restate their notes by convention (POC26), so nine blurbs and
six `long` passages moved with the descriptors; the Val d'Orcia roaster blurb too. Non-wheel words are
gone from every tasting statement. "Tastes like panettone on the table" stays, because it is a story,
not a note.

**7. Build spec.** §13.2: the `flavor` and `notes` rows collapse into one `descriptors` row with a
closed value set; the `roast` row records that the roaster states it or gives an Agtron reading we
band ourselves. §15.2 step 1: the taste payload is three closed fields (roast degree or Agtron,
up to five wheel descriptors, caffeine), the roaster never sees our buckets, and the Italian list is
issued against the SCA's own translated wheel once that edition is confirmed.

## Deliberately not changed

- The persona matrix (4 x 4 plus the decaf override) and its names. Only the key moved.
- The persisted profile shape (`roast` / `flavor` / `caffeine`). Nothing is stored in the browser
  except the quiz-seen flag, so there was nothing to migrate.
- The filter mechanics. `productFacets()` already returned arrays and `inFacet()` already matched on
  a comma-joined list, so a coffee in two buckets costs no filter code.
- The historical Standards and `docs/POC*` ledgers that name the old buckets; narrative is left
  as written.

## Verified

- `node --check` and `JSON.parse` clean; `theme check` at the documented baseline (9 offenses /
  0 errors / 0 new).
- Driven live in `shopify theme dev`: all 16 matrix cells return the expected persona and subhead
  through the real handlers; the decaf override fires; the ribbon count tracks the grid; the Q2 hints
  and the console hint render from the table; the Guatemala card reads "Fruit & flowers / Sweet &
  chocolatey" and carries `data-flavor="fruit,sweet"`; the collection card carries the union
  `fruit,sweet` and its page reads "Mixed roast." with its composition pills; India's page shows
  "Dark chocolate / Pipe tobacco / Clove". Zero occurrences in the rendered DOM of the old labels,
  the old key, or any retired non-wheel word.
- Looked at: Q2 at desktop, Q1 and a two-bucket card at 375.

## Two things the drive surfaced that are fixture shape, not defects

- **Medium + Dark & spiced + full caffeine returns zero coffees** ("The Old Soul"). The only
  medium spiced fixture is the decaf. It returned zero before this change too (the decaf was the
  only medium `terroir`), and it will resolve itself with real SKUs.
- **Driving the matrix in one page session carries state forward**: the "Surprise me" row inherited
  the previous iteration's roast because `applyProfileAndClose` leaves `activeTaste.roast` alone on
  `any`. That is pre-existing behaviour and only visible when the quiz is retaken without reloading;
  the same contamination trap POC16's gift test recorded.
