# POC15 change list

Built 2026-08-18, on top of deployed POC14. Working ledger; `CLAUDE.md` §9 carries the
durable summary and §10 carries the authoritative deployment state.

**Origin.** The POC13 close-scrutiny audit scored the site 5.4/10 and left a prioritised
open list. POC14 closed six of its findings. This batch takes the next four Steve picked,
plus one systemic brand breach found by looking at the result.

Deliberately **not** re-scoring POC14 first: each of its fixes was verified individually and
specifically, and a fresh scoring pass would have re-derived a backlog already written down
at the foot of `POC14_change_list.md`. Score once, at the end, on the same rubric.

---

## 1. Brand voice drift — the Standard's own anti-pattern, inverted

`templates/index.liquid` read *"We have carefully hand-selected a small number of roasters
whose work represents Italian roasting at its finest."*

Brand Standards §9 prints *"We hand-pick the world's most exclusive coffee artisans"* as the
example **not** to write, and CLAUDE.md §6 bans "hand-picked" and "world-class" outright.
The live sentence was that anti-pattern with the words rearranged.

Replaced with the Standard's approved construction, near-verbatim:

> We choose a small number of roasters whose work represents the craft of Italian roasting
> at its best.

Swept the rest of the customer surface: **zero** remaining instances of the banned register.

**Two found and deliberately left**, both Steve's own wording and neither the banned pattern:

- Roasters page: *"We are the **premier** consumer channel for each of these roasters."* A
  factual claim about distribution position, not a superlative about the coffee. Closest
  thing left to the register; flagged, not changed.
- *"Curated with love, never aggregated / carefully chosen, not collected."* The contrast
  does the work. Not puffery.

---

## 2. US customary weights — a Standards breach and a conversion problem

Brand Standards §9: *"Always include both metric (250 g, 1 kg) and U.S. customary (8.82 oz,
2.20 lb) on weight references."* The theme had **zero** occurrences of `oz` anywhere.

**Scope check, because it decided whether this was a breach or a nit.** That bullet carries
no scope qualifier, and the bullets either side of it *do* scope themselves — bilingual
parity is roaster-facing, the em-dash ban is customer-facing. So the units rule binds the
storefront. Genuine breach.

### Where the conversion goes — Steve's call, and it is the better read of the rule

First implementation put the dual form on the size **pills** and left the price denominator
short. Steve asked why it was not the other way round. He was right, and the reasoning
matters more than the change:

- The **price denominator** is where the value math happens — *"$38 for how much?"*
- It is **live**: `selectSize()` rewrites it, so whichever size the buyer actually picks is
  the one they see converted (`$120.00 /1 kg (2.20 lb)`).
- Pills go back to **one row** on a phone instead of wrapping to two.

The correction underneath it: the conversion's job is to give an American a **sense of
scale**, not to decorate every weight token. Once a reader is anchored at 250 g = 8.82 oz
they know what 500 g and 1 kg mean. The first version spent three conversions per card to
deliver one fact.

| Surface | Renders as |
|---|---|
| Card price | `From $38.00 /250 g (8.82 oz)` |
| Card size list | `250 g · 500 g · 1 kg` |
| Product pills | `250 g` · `500 g` · `1 kg` (one row) |
| Product price, after selecting 1 kg | `$120.00 /1 kg (2.20 lb)` |
| Sorpresa Tour | `/3×100 g (3.53 oz)` |
| Cart line | `1 kg (2.20 lb) · One-time` |

Same anchor principle applied to static copy: one conversion per page for the Tour's 100 g,
not three.

**Amended by Steve, 2026-08-19 - all or none inside one statement.** The anchor principle was
applied *within* a sentence too, producing *"Bag sizes 250 g (8.82 oz), 500 g, and 1 kg."* Steve:
*"if we're going to paren size this item, we should paren all sizes indicated in this statement."*
He is right, and the distinction is worth stating because it is the boundary of the principle:

- **Within one statement that enumerates sizes: convert all, or convert none.** Half-converting
  reads as an oversight, not as restraint. Now: *"Bag sizes 250 g (8.82 oz), 500 g (1.10 lb), and
  1 kg (2.20 lb)."*
- **Across separate statements on a page: the anchor principle still holds** - the Sorpresa hero
  converts its 100 g, and the Tour card and footnote below it do not repeat the conversion.
- **The card size list converts nothing at all** (`250 g · 500 g · 1 kg`), which satisfies the same
  rule by the "none" branch; the price denominator beside it carries the conversion.

Swept for the shape: this sentence was the only mixed-paren enumeration on the site.

### The 16 oz rule (Steve, added after the first deploy)

500 g was rendering as **17.64 oz**. Steve's call: past a pound, an American thinks in pounds,
and `17.64 oz` is a number nobody holds in their head without dividing first. So once a converted
weight reaches **16 oz, state it in pounds**.

| Size | Before | After |
|---|---|---|
| 100 g | 3.53 oz | 3.53 oz |
| 250 g | 8.82 oz | 8.82 oz |
| 500 g | **17.64 oz** | **1.10 lb** |
| 1 kg | 2.20 lb | 2.20 lb |

This is the point of carrying a customary unit at all: if the reader still has to do arithmetic,
the conversion has failed. It is a good catch against the letter of Brand Standards §9, whose
worked examples (`8.82 oz`, `2.20 lb`) happen to skip the range where the two units meet.

Implemented on the **converted** value rather than the metric one, so the threshold means exactly
what it says and holds for any future bag size; inputs are normalised to grams first so one branch
covers both `g` and `kg`. The boundary is clean: 453 g gives `15.98 oz`, 454 g gives `1.00 lb`.

Precision stays at two decimals, matching the Standard's own examples and the oz values beside it.
Steve wrote both "x.x" and "1.xx" describing the shape, so this is the reading that keeps the site
internally consistent - say so if one decimal is wanted instead.

### Implementation

One helper (`convertWeight` / `sizeShort` / `sizeDual`) at the **render layer**. The catalog
keeps raw `"250g"` strings because they are **identifiers**, not copy — `addToCart` matches
cart lines on `size`, and in production they become Shopify variant titles. Change the one
function and every weight on the site moves with it.

Precision matches the Standard's own worked examples exactly (250 g → 8.82 oz, 1 kg →
2.20 lb) so the site and the document cannot be read as disagreeing.

### The one documented exception

*"I ground exactly 17g"* in the founder story stays metric-only. A brew dose is expressed in
grams even in America — every US espresso recipe reads *"18 g in, 36 g out"* — so
"17 g (0.60 oz)" would read as **less** fluent to exactly the reader the hero names, *"people
who love to grind their own beans"*. It is also a sentence in a story, not a spec. Same shape
as the documented em-dash exception on the regions map, and commented in the file so a future
sweep does not "fix" it.

---

## 3. Grinder expectation — closed at the decision point

The hero names an audience that grinds its own beans. Nothing on the buy path confirmed the
coffee arrives unground.

Every coffee product **already** said "whole bean only" in its `brewing` copy — but that
copy renders in the *About this coffee* block **below** the buy column, so a buyer could add
to cart having never read it. A returns problem, not a copy nicety.

Landed:

- A note directly under **Add to cart**: *"**Whole bean only.** You will need a grinder. If
  you do not have one, there is a burr grinder in the Bottega"* — linked to
  `bottega-burr-grinder`, which we actually stock.
- Home model paragraph: *"fresh and ready to **consume**"* → *"ready to **grind**"*. The old
  verb was quietly untrue of a whole bean. Followed by *"We sell whole bean only, never
  pre-ground."*
- FAQ *"Do you sell ground coffee?"* now points at the grinder rather than leaving the reader
  to solve it.

---

## 4. Structured data (JSON-LD)

The theme had none, so the site could not appear as anything but a plain blue link.

**Emitted server-side in `layout/theme.liquid`:** `Organization` + `WebSite` in an `@graph`.
Verified by parsing the rendered page (valid JSON, correct shape, absolute URLs) **and by
fetching both image URLs** — HTTP 200, correct content type. That second check is the POC14
lesson: a tag pointing at a 404 renders the same bare link as no tag at all.

**Deliberately absent, and the absences are the point:**

| Omitted | Why |
|---|---|
| `potentialAction` / `SearchAction` | The site has no search — the header icon was removed in POC9. Declaring an endpoint we do not have is a false claim to a crawler. |
| `sameAs` | No social profiles exist. An invented one is worse than none. |
| `contactPoint` | `info@` / `support@` are not created yet (§10). We do not publish a channel nobody reads. |
| `Product` / `AggregateRating` | Single-document SPA: one URL, no per-product address. A `Product` node would either name URLs that 404 or describe a product a crawler never renders — and there are no reviews to aggregate. |

`Product` and `AggregateRating` are specified instead in `production_build_spec.md` §9,
which also records a real design tension: **`aggregateRating` only models a global average**,
which is precisely what the audit argued against in favour of reorder rate and palate-matched
feedback. Choosing palate-matched feedback means forgoing star rich-results. That is a
decision to take deliberately, not by default.

Address is town/state/country only. No street address is published, so none was invented.

---

## 5. Image weight

| | Before | After |
|---|---|---|
| First-paint image weight | ~1,257 KB | **361 KB** |
| Theme asset payload | — | **−954 KB** |
| `theme check` | 17 offenses / 2 errors | **15 / 0** |

- **`ci-cup.png` deleted** — 724 KB, referenced by nothing but the change list that flagged it.
- **`ci-signature.png`** 1201×505 → 368×156 (94 → 26 KB). It was 6.5× oversampled against its
  184px display width; 368 is an exact 2×, so `height="78"` is exact and nothing stretches.
- **`ci-company-door.jpg`** 640×901 → 440×619, re-encoded q82 progressive (267 → 104 KB).
- **The structural win:** About-page images sit inside `display:none` divs, but an eager
  `<img>` loads regardless of display — so every About photograph was being fetched during the
  home page's first paint. All below-fold and hidden-page images are now `loading="lazy"` +
  `decoding="async"`.
- **Both `ImgWidthAndHeight` errors cleared** by adding intrinsic `width`/`height` to the hero
  logo and the signature. This also removes two real layout-shift sources.

The `crema-poc-deploy` baseline was updated **and annotated with why it moved**, so a future
session does not read a changed number as a regression.

---

## 6. Italic was doing two contradictory jobs (found by looking, not by measuring)

The new grinder note inherited `.afd`, which is `font-style:italic`. That prompted a
site-wide audit.

Brand Standards §3.3: *"**Italics carry meaning** — don't italicize for emphasis."*
CLAUDE.md §6 lists it as a Never.

| | Before | After |
|---|---|---|
| `.ita` — sanctioned Italian cue | 11 | 11 |
| **Italic on English** | **31** | **0** |

Breakdown of the 31: `.pill.disabled` ×16, `.afd` ×7, `.cn` ×3, `.tour-bag` ×3, one `<em>`,
one inline style.

**The sharpest case, and the reason this is not pedantry:** on the Shop page, `Piemonte` was
italic because it is **disabled**, while `un caffè` two sections away is italic because it is
**Italian**. One device, two meanings, one screen — exactly the collision the rule exists to
prevent.

Fixed by dropping `font-style:italic` from `.afd`, `.cn`, `.tour-bag`, `.pill.disabled`,
`.flavor-desc`, `.taste-console-modal .flavor-desc` and `.cart-line-img`; converting the one
`<em>` to `<strong>` (§6: bold for emphasis); and removing one inline style. Every one of
those already carries its secondary role through size, colour or opacity, so nothing lost
legibility — the disabled region pills arguably read **better**, since the italic had made
them look like a different category rather than a dimmed version of the same one.

Also removed `.hero h1 em{font-style:italic}` — unused, and `.hero h1` is Marcellus, which
has **no italic face**, so that rule was a latent faux-italic landmine of exactly the kind
POC14 spent a session eliminating.

**Corrected a stale comment in the same pass.** The POC14 font block asserted *"Italic is
still used freely on Inter (.afd, .cn, .pill.disabled, em, …)"* — true when written, false
the moment this sweep landed. Present-tense claim in a live file, so it was updated rather
than left as narrative.

---

## Verification

Verified **by looking**, at 375×812 and 1280×900, plus DOM measurement.

| Check | Result |
|---|---|
| `node --check`, `JSON.parse` | clean |
| `shopify theme check` | **15 offenses / 0 errors** — new baseline, 0 new offenses |
| Banned-register sweep | 0 |
| Metric-only weights remaining | only the documented 17 g dose |
| Italic on English | **0** (was 31); 11 `.ita` intact |
| JSON-LD | valid JSON; both image URLs HTTP 200 |
| First-paint images | 3 files / 361 KB; all others deferred (`complete:false`) |
| Card footers @1280 | no overflow, no horizontal page scroll, heights consistent per shelf |
| Product pills @375 | one row |
| Price denominator follows size selection | yes — `$120.00 /1 kg (2.20 lb)` |
| **POC14 regression check** — keyboard | 13/13 cards, 10/10 quiz options still reachable |
| **POC14 regression check** — faux type | 0 Marcellus faux usages; real Inter italic loaded |

### A note on the tooling

Screenshots worked first try using the two-call recipe at the top of `CLAUDE.md`
(`tabs_create` → `navigate` → `screenshot`, never `preview_start`'s seed tab). Two things
worth adding for the next session:

- The pane composites at roughly **a third scale at 1280px**, so desktop screenshots are
  legible only for gross layout. `zoom` with a region **is not supported** — it returns the
  full screenshot. At 375px the render is ~1.5× and fully readable, so do fine typography
  judgement at phone width and use DOM geometry for desktop.
- `resize_window` needs an explicit `{tabId}`, and the pane must be **displayed** — a
  `tabs_create` tab reports `hidden:true` and screenshots time out when it is not.
  `tabs_select` does **not** un-hide it; only the user showing the pane does.

---

## Still open from the POC13 audit (not in this batch)

- **No social proof of any kind.** The biggest single scoring item, and a decision rather
  than a build. Needs a fact check first: verify what Shopify offers natively for reviews on
  a Basic plan today versus what needs an app. See §9.2 of `production_build_spec.md` for the
  star-rating tension.
- **Gifting** named as a Sorpresa use case with zero supporting functionality.
- **Real photography.** All three `ci-temp-*` slots must be replaced.
  **New this session, from looking at it in place:** the product shot (`ci-temp-lp3.jpg`)
  sits **directly under** the paragraph reading *"We choose a small number of roasters… we do
  not roast, grind, blend, or alter the roasters' packaging"*, and the largest, most legible
  object in the frame is a **Lavazza** bag. In that position it reads as though Lavazza is
  one of our roasters. Its existing `PROD:` note says it cannot ship; it does not say this is
  the worst slot on the site for it. **Replace this one first.**
  The founder portrait (`ci-temp-lp2.jpg`) remains unshippable per POC14.
- **Product-detail dates render ISO** (`2026-08-07`), which reads technical to a US consumer
  where `Aug 7` would not. Carried from POC14.
- **No `srcset`.** Deliberately not built: theme assets cannot generate responsive variants
  the way Shopify-hosted product images can via `image_url` with `width:`. This is production
  work against real CDN-hosted photography, not POC work against temporary stand-ins.
