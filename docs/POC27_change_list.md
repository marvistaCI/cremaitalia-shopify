# POC27 — the Sorpresa box gets its own unit of measure

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is authoritative.

Follows POC26. Chasing one fixture sentence turned up a second Offerta-adjacent problem on the
Sorpresa collection, and **Steve's fix was structural where mine was verbal** — which is why this is
its own batch rather than a wording tweak.

---

## The defect

The collection's price line read:

```
$77.70 /3 × 100 g (3.53 oz)
```

`sizeDual()` converts each weight **token** it finds, so it converted the `100 g` — one bag — while
the box holds **300 g**. A code comment even advertised this as a feature: *"works on any string
containing a weight token, so it also handles composite units like a collection's /3x100g."* It
handled it, and converted the wrong quantity.

At a glance the line reads **$77.70 for 3.53 oz**, which would be an extraordinary price. It is the
only SKU where a quantity multiplier sits between the denominator and its conversion; every other
product is a single bag, so the two agree by construction.

## The fix, and why Steve's beat the one proposed

The proposal on the table was to reword the conversion — *"(10.58 oz total)"* — and separately to
delete the note chip *"Three 100 g bags"* as a duplicate of the size selector.

**Steve reframed it instead:** the box's unit of measure is what the **box weighs**, 300 g, and the
composition — three 100 g bags — is a **note about what is inside**.

That is better in three ways, and the third is the one that matters:

1. The denominator becomes `/300 g (10.58 oz)`, **the same shape as every other product** (`/250 g
   (8.82 oz)`), instead of a special case with a special explanation.
2. It matches the production shape. A native Shopify bundle variant has a weight, and that weight is
   300 g — B2 proved the bundle variant is a real variant priced as the sum of its components.
3. **The duplication dissolves rather than being deleted.** The note chip was only a duplicate
   because the size selector said the same thing. Once the size says `300 g`, the note says something
   nothing else on the page says. Deleting it — the proposal — would have removed a fact to fix a
   collision that the right model does not create.

The ambiguity is now **structurally impossible** rather than corrected by wording: with no composite
unit anywhere, there is no token for the converter to pick the wrong one of.

## `price_unit` went with it

`price_unit` was a per-product override of the denominator, present on **exactly one product of
seventeen** — invented solely to express `/3×100g`. With no composite unit left, nothing needs it, and
it is removed from the data. The one-line `||` fallback stays in `priceCell()`, with a note that
**nothing sets it today, so a bug in that branch would be silent.**

---

## What shipped

| Field | Before | After |
|---|---|---|
| `sizes[0].size` | `3 × 100g` | **`300g`** |
| `price_unit` | `/3×100g` | **removed** |
| `notes` | `["Our choice","Three 100 g bags","Printed tasting card"]` | **unchanged** |

No template, CSS or snippet changed.

## Verification

| | Before | After |
|---|---|---|
| Price line | `$77.70 /3 × 100 g (3.53 oz)` | **`$77.70 /300 g (10.58 oz)`** |
| Size pill | `3 × 100 g` | `300 g` |
| Cart line | — | `300 g (10.58 oz)` — **matching intact** on the new identifier |
| Products carrying `price_unit` | 1 | **0** |

Four weight mentions remain on the detail page, and that is correct — they now state **two distinct
facts** rather than one fact twice: the box weighs 300 g (size pill + denominator, a load-bearing
pair) and it contains three 100 g bags (note chip + narrative prose).

`node --check` clean, `JSON.parse` clean, `theme check` at the documented baseline with 0 new.

**The size string is a cart-matching identifier** (`it.size === s.size`) and becomes a Shopify variant
title in production, so changing it was verified by adding the product to the cart and confirming the
line renders — not assumed from the catalogue.

## A note on the character that cost two attempts

The edit failed twice before landing. The multiplication sign is **U+00D7**, which the terminal
renders as a replacement character, so the first diagnosis — "wrong character" — was wrong; the
codepoints were correct all along. The actual cause was assuming `"size"` and `"price"` sat on one
line in the JSON. **Two wrong theories about an encoding problem that was really a whitespace
assumption** — worth remembering next time a match fails on a string containing a non-ASCII glyph.
