# POC26 — one fixture sentence, and the contradiction it was hiding

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is authoritative.

Steve spotted an ISO date on the Offerta card in a POC24 screenshot and asked whether it was just an
inline comment out of sync. **It was fixture text, and the mechanism around it was working exactly as
built** — but it was concealing a real contradiction between two views of the same product.

---

## What was on screen

`assets/ci-catalog.json`, `products[12].blurb`:

```
"Chocolate, walnut, dried fig. Roasted 2026-05-30."
```

The screenshot showed `2026-07-21` rather than `2026-05-30` because `rebaseCatalogDates()` shifted the
field and then **string-replaced the prose to match**, with a comment saying so. Nothing was stale;
nothing was out of sync. The question was answered — and it was the wrong thing to be reassured by.

## Three things wrong, only the first of them visible

**1 · Wrong format.** Store Operating Standards **§5.4**: *"`DD-MMM-YYYY` is required wherever a date
is shown to anyone."* The card printed ISO.

**2 · It showed a roast date at all.** **v1.13** retired the actual roast date for Offerta in favour
of a **computed band**, precisely because a slow-moving Offerta SKU can hold more than one lot. The
Standard states that `roast_date` on an Offerta product *"stops driving anything the customer sees."*

**3 · The two views contradicted each other, and could never have agreed.** Same product, same
moment, one click apart:

| | |
|---|---|
| Card | `Roasted 2026-07-21.` |
| Detail | `Roasted between 25-MAR-2026 and 23-MAY-2026` |

**2026-07-21 was 32 days old — inside the 90-day fresh window**, so the card claimed an Offerta coffee
was fresher than the Offerta shelf permits, and outside the band its own detail page stated.

**The root cause is structural, not a typo.** The band is derived from **policy** (today minus
`offerta_fresh_days` and `freshness_window_days`); `roast_date` is derived from the **rebase**, which
shifts every product so the freshest is 10 days old and therefore necessarily drags the Offerta lot
into the fresh window. Two numbers computed from different sources cannot agree by construction.
**POC19 half-migrated Offerta:** the detail view moved to the band, the card kept quoting the field.

---

## The finding that reframed the fix

A first sweep called this "duplication" — the blurb restating the `notes` array. Checking every
product killed that reading: **12 of 17 blurbs restate their own notes.** That is the *convention*,
not a defect:

> tasting notes as a sentence, plus **at most one distinguishing fact**
> — *"Natural process."* · *"Washed."* · *"Panama micro-lot."* · *"A signature blend."*

So this blurb was correctly **shaped**. It chose the wrong **kind** of fact. Every other extra fact
holds still; this one varies with time, and a time-varying fact is the only kind that can go stale or
contradict a policy that moves independently of it.

**And four products carry no extra fact at all**, so the fix needed no invented copy — just deletion.

---

## What shipped

1. `products[12].blurb` → **`"Chocolate, walnut, dried fig."`**
2. The blurb-rewrite inside `rebaseCatalogDates()` **retired**, since nothing embeds a date in prose
   any more. All three reasons above are recorded at the site so it is not recreated, along with the
   rule the convention implies: **a blurb may carry a distinguishing fact, never a time-varying one.
   Time-varying facts belong in fields, where the render layer formats them to the Standard.**

No template, CSS or snippet changed. `rebaseCatalogDates()` still shifts `roast_date` and `best_by`,
which is what keeps the fixture catalogue from ageing out.

## Verification

| | Before | After |
|---|---|---|
| Cards quoting a date (30 scanned, 6 shelves) | 2 | **0** |
| ISO dates visible anywhere on the site (11 pages) | 1 | **0** |
| Offerta card | `Roasted 2026-07-21.` | notes only |
| Offerta detail | band, mandated format | **unchanged** |

`node --check` clean, `JSON.parse` clean, `theme check` at the documented baseline with 0 new.
**Exactly one surface now states an Offerta coffee's age**, it is derived from policy, and it is in
`DD-MMM-YYYY`.

## Flagged, not changed — Steve's call

`tour-ditalia-1` states **"Three 100 g bags"** in its blurb *and* in `notes` *and* in `sizes`
(`"3 × 100g"`). Three homes for one fact — but unlike the date it is **stable**, so it cannot drift
into contradiction. There is a separate open question against Brand Standards §9: it carries no U.S.
customary equivalent, where POC15 put the dual form on the price denominator to give an American a
sense of scale. Both are judgement calls on wording rather than defects.
