# POC16 change list

Built 2026-08-19, on top of deployed POC15. Working ledger; `CLAUDE.md` §9 carries the durable
summary and **§10 carries the authoritative deployment state** — no state claims here.

**Origin.** Two sources. Items 1–3 come from the POC15 re-score, which scored the deployed theme
5.4 → 6.9 against the original audit's ten dimensions. Items 4–9 came out of Steve reviewing the
result live and finding things the re-score had not looked for — several of them structural.

---

## 1. Five sign-in inputs had no accessible name

The labels were never missing; they were never **associated**. `<label>Email</label><input>` with
no `for`/`id` and no nesting means the browser reports no accessible name and a screen reader
announces an unlabelled edit field.

Added `for`/`id` pairs plus `autocomplete` tokens. `.form-field label` is `display:block`, so
wrapping the input inside the label would have changed the layout; `for`/`id` is the non-visual fix.

**Verified: 0 of 13 inputs unlabelled (was 5), no duplicate ids.**

---

## 2. The hero H1 set three lines on a phone with a two-word stub

Two causes, and the first hid the second.

**(a) `text-wrap:pretty` was inert.** Added 2026-08-18 to stop `balance` stranding "Exactly".
Measured now, `pretty` / `balance` / `wrap` produce **byte-identical** output, because Chrome does
not balance across a forced `<br>`. The declaration did nothing and its stated reason no longer
held. Removed rather than left as decoration.

**(b) The real cause is type size, not wrap strategy.** The markup forces a break at the sentence
boundary, so line 2 is always *"Exactly as the roaster sealed it."* **Measured, not estimated:**
that string sets **13.838×** its own font-size in Marcellus, against a measure of exactly
`viewport − 48px`. It holds one line while

```
font-size <= (viewport - 48) / 13.838
```

giving 19.7px at 320, 22.5 at 360, 23.6 at 375, 24.7 at 390, 26.4 at 414, 27.5 at 428. A **fixed**
value satisfies that at exactly one width — which is how this broke, POC11 having verified "one
line at every width" on desktop alone. Now `clamp(18px, calc(7vw - 3.4px), 1.625rem)`.

**The floor mattered more than it looked.** It was briefly 20px, which at 320px **overrode** the
calc's 19.0, pushed past the 19.7 ceiling and wrapped to three lines with `"it."` alone on the last
— a two-character orphan far worse than the defect being fixed. A clamp floor is a silent override;
check it against the narrowest viewport, not just the expression.

**Verified 2 lines at 320 / 360 / 375 / 390 / 428; desktop unchanged at 40px / 2 lines.**

---

## 3. No commerce signal above the fold on mobile

The 62px mobile bar carried a logo and a hamburger with **153px of measured empty space** between
them, while Shop and the cart sat two taps deep in the panel. A visitor arriving cold on a phone had
no signal that this is a shop at all, and a customer with a full cart had no visible way back to it.

This was the half of the first audit's central finding that POC14 left open — the hero was rewritten
to answer rather than ask, but re-running the identical above-fold test still returned no "Shop", no
cart, no price.

Shop and cart now sit in that gap. **Shop routes straight to the all-shelves page** rather than
opening a submenu: a second menu system running beside the hamburger panel is the real risk here,
not the two extra elements. Below 360px the word drops and the cart stays.

Measured rather than calculated: the pair renders 105px wide against a 138px gap at 360 and 98px at
320. The base rule sits **before** the mobile media block on purpose — media queries add no
specificity, which is exactly how the account dropdown broke in POC13.

`updateCartCount()` now queries `.cart-count` by **class**, since the badge exists twice;
duplicating `id="cart-count"` would be invalid and would have updated only the first.

**The audit's above-fold test now passes at 375: contains "Shop" yes (was no), cart visible yes
(was no).**

---

## 4. Mixed-paren enumeration (Steve)

*"Bag sizes 250 g (8.82 oz), 500 g, and 1 kg."* — Steve: *"if we're going to paren size this item,
we should paren all sizes indicated in this statement."* Correct, and it marks the boundary of the
anchor principle POC15 introduced:

- **Within one statement that enumerates sizes:** convert all, or convert none. Half reads as an
  oversight, not restraint.
- **Across separate statements on a page:** the anchor principle still holds.
- **The card size list converts nothing** (`250 g · 500 g · 1 kg`), satisfying the rule by its
  "none" branch, since the price denominator beside it carries the conversion.

Swept: this was the only mixed-paren enumeration on the site. **Decided and closed:** the card
footer stays as it is — it stacks `From $38.00 /250 g (8.82 oz)` above the size list, so `250 g`
appears twice one line apart. Steve looked and left it; the two lines do different jobs.

---

## 5. A fixture SKU hard-coded into customer copy (Steve)

The POC15 grinder note read *"there is a burr grinder in the Bottega"* and linked
`openProduct('bottega-burr-grinder')`. Steve: *"The Bottega is currently holding imagined skews, not
real skus… we may carry more than one."*

Both instances — the product-detail note and the FAQ — now read *"search for a burr grinder in our
Bottega"* and **open the shelf**.

A Bottega category filter was considered first and **rejected**: the only taxonomy that exists is
Equipment/Merch, which does not isolate grinders, so building one would have meant inventing a
second layer of fixture data to prop up the first — the same mistake one level down.

This produced a standing rule, now in agent memory: **never hard-code a handle from a fixture array
into UI logic or customer copy.** Test any sentence by asking whether it survives that row being
renamed, sold out, or never existing.

---

## 6. One description per shelf, and Sorpresa renders from the catalog (Steve)

**Descriptions.** The Shop page's shelf gloss was a parallel table (`SHELF_NOTE`) that had drifted
from **all four** shelf pages — Sorpresa's page said "Our curated collection of roasted delights."
while the gloss said "Our surprising coffee tour collections", so the same shelf introduced itself
differently depending on how you arrived. Steve's call: the native shelf page's wording wins.
`shelfNote()` now **reads the matching page's own `.sub`** at selection time, so there is one
description per shelf and nothing to keep in sync. `textContent`, not `innerText` — shelf pages are
`display:none` and `innerText` returns empty. The Shop dropdown already used the shelf-page wording
and needed no change. Sorpresa pluralised to **"collections"** in all three places.

**Sorpresa.** It was the only shelf **without a product grid** — a hard-coded `.tour-hero`
spotlighting one fixture SKU with its handle, title, price and component list all in the template,
and a *View Tour* button opening that one product. Steve: *"let the user read about whatever tours
are currently offered and choose one of their liking."* Now a standard card grid like the other
three. Added to `applyProfileToShelves` too — the POC5 BOM facet-union work exists precisely so a
collection filters by its components, and it was excluded only because there was no grid to filter.
Six dead `.tour-hero` / `.tour-bag` rules swept.

---

## 7. "Tour" is a SKU name, not a site term (Steve) — vocabulary cured

Steve: *"Tour is simply an SKU name (description) and is NOT a website term… I want to cure this
drift once and for all."* The archetype is a **collection**. Only some collections are tours of
anywhere — `Decaf Collection 1` and `Roaster's Favorites 2` are the same thing as `Tour d'Italia 1`
— so using the narrower word as the category quietly shrank the shelf to one kind of product.

**Swept:** storefront copy (Sorpresa intro rewritten to Steve's wording, home shelf card, home CTA,
callout, footnote, FAQ, empty-cart suggestion), the eyebrow *"Published now"* → **"Assembled
fresh"** (we do not publish, we assemble), the heading *"Sorpresa Tours"* → **"Sorpresa
Collections"**, the code comments using it as the category term, `production_build_spec.md` §7, and
the Store Operating Standard.

**Deliberately not swept:** product names — `Tour d'Italia 1` is correct and stays, and the four
remaining occurrences in rendered text are all that SKU name. Nor historical narrative: §9 entries,
`docs/POC*_change_list.md`, the archived POC v2/v3 HTML, and code comments describing what *used* to
exist. Judge by tense, per `crema-poc-deploy` Step 6.4.

Recorded as a **"Never" in `CLAUDE.md` §6** — that file loads every session, so it is what actually
prevents recurrence.

---

## 8. Gifting (Steve)

**Order-level, not per line.** A Shopify order carries exactly one shipping address, so a per-item
gift flag would let a customer mark one line as a gift and then meet a single address field at
checkout — promising a split the platform cannot execute. Two recipients means two orders.

**In the cart, because that is the only place it can live:** the cart is ours, checkout takes no
custom fields below Plus (verified on the dev store 2026-07-25).

**Blocked on any subscription line** — `.some()`, deliberately, not the `.every()` used for free
shipping a few lines below. One subscription line is enough, for two independent reasons: the
cadence bills the giver's card indefinitely, and the order still has one address. Shown as an
explanatory line rather than a vanishing control.

**The stale-state guard is the part that would have bitten.** The cart re-renders on every change,
so a gift ticked and *then* joined by a subscription would otherwise have ridden to checkout
invisibly. Verified by driving the full sequence: empty → one-time → ticked → typed → subscription
added (reverts and clears) → subscription removed (does not auto-restore) → re-ticked (message
empty).

FAQ entry added covering how gifting works, that nothing inside any package shows a price, that a
gift ships to one address, and that subscriptions cannot be gifted.

---

## 9. A stranded separator in the cart line — found by looking

POC15's dual units lengthened the cart line from `250g` to `250 g (8.82 oz)`, pushing the
subscription pill onto a second row and leaving a bare `·` dangling at the end of the first.

The separator is now dropped entirely before the pill — a bordered capsule already reads as a
separate object, and a first attempt that merely glued the `·` to the pill just moved the problem,
starting the wrapped line with what looked like a bullet. Kept only for the plain "One-time" text.

**Why both instruments missed it.** Nothing overflowed and nothing overlapped, so every geometry
assertion passed. And the Range-based text measurement reached for next is equally blind: it
concatenates characters, so it reports a dangling separator and a correct one identically, and it
cannot see a CSS margin at all. Two clean instruments, one real defect in the middle of the buy path.

---

## 10. The meta description moved out of the Shopify admin (Steve)

It read **"Crema Italia - curated *italian* roasted coffee only found here."** — lowercase on the
one word the whole proposition rests on, 62 characters of an available ~155, and claiming
exclusivity when the differentiator is that the coffee is **unchanged**.

Now authored in `layout/theme.liquid`, 156 characters, leading with freshness and matching the hero.

**Why it drifted unnoticed is the part worth keeping.** The coming-soon theme *hardcodes its own*
description (`live-theme/layout/theme.liquid:36`), so the live site read correctly while the wrong
admin value sat behind it — and only the POC theme, which uses `page_description` unconditionally,
ever surfaced it. Nothing reviews an admin field; code gets diffed.

The fallback chain is `live-theme`'s, ported: `index` uses the theme-authored line, anything with
its own `page_description` uses that (products, pages and articles own theirs and **must not** be
hardcoded), and the theme line is the final fallback rather than emitting no tag.

---

## Standards and spec published alongside

| Document | Change |
|---|---|
| Store Operating **v1.4** | "Tour" → "collection" throughout; new **§1.1** states the rule |
| Store Operating **v1.5** | **§8.1** nothing inside a package shows a price, gift or not, receipt as an email entitlement; **§8.2** gifting |
| Store Operating **v1.6** | Removed the §12.9 v1.5 had opened on gift-subscription entitlement — §8.2 already says subscriptions cannot be gifted, and that **is** the decision |
| `production_build_spec.md` **§10** | Weights: grams on the variant, conversion at render, and the boundary where our rendering stops |
| `production_build_spec.md` **§11** | Commercial rules must never ship as string literals |

**§8.1 is the durable one**, and it made the gift feature smaller rather than bigger. Blanket rather
than a gift-order exception because a conditional rule has to be executed correctly by whoever is
packing that day and **fails silently** — the customer discovers it only when a present arrives with
a price on it. Every order is giftable by default and no flag has to reach the warehouse.

**§12.9 is a lesson as much as a section.** v1.5 opened a question about who would hold the Founding
Member slot under a gift subscription; Steve pointed out we had already decided not to offer one.
Writing a Standard invites inventing open questions in order to look thorough, and an open-decisions
list is where that does the most damage, because speculative entries bury the real ones.

---

## Verification

| Check | Result |
|---|---|
| `node --check`, `JSON.parse` | clean |
| `shopify theme check` | **15 offenses / 0 errors** — documented baseline, 0 new |
| Unlabelled inputs | **0 of 13** (was 5) |
| Hero H1 | **2 lines** at 320 / 360 / 375 / 390 / 428; desktop unchanged |
| Above fold @375 | contains "Shop" **yes**, cart visible **yes** (both were no) |
| Shelf gloss vs shelf page | **all four match exactly** |
| "Tour" in rendered text | 4, **all** the SKU name `Tour d'Italia 1` |
| Gift state machine | full sequence driven, including the stale-state guard |
| Meta description | 156 chars, one tag, "Italian" capitalised |
| Standards renders | 3 gates each at exit 0; OneDrive md5-matched |

Verified **by looking**, not only by measuring — item 9 exists only because of a screenshot.

---

## Still open

- **Social proof.** The biggest single scoring item from the re-score and a decision rather than a
  build. Needs a check of what Shopify supports natively today, and it collides with the fact that
  `aggregateRating` only models a global average — the shape the audit argued against.
- **Real photography.** Three `ci-temp-*` stand-ins. The product shot is the one to replace first:
  it sits directly under *"we do not roast, grind, blend, or alter the roasters' packaging"* and the
  largest legible object in it is a **Lavazza** bag.
- **Product-detail dates render ISO** (`2026-08-07`), which reads technical to a US consumer.
- **`tour-ditalia-1` is still hard-coded** nowhere in the template — but four `openPerson()` handles
  remain on the About page. Known: `production_build_spec.md` §2 makes Team/Partners sections+blocks.
- **3PL vendor questions** — handed to Cowork by Steve, 2026-08-19. Standard §12.9 stays open until
  a 3PL is selected.
