> **SUPERSEDED 2026-08-20 - this brief has been consumed. Do not act on it.**
> It was a one-shot prompt to *start* the trust work, and its central instruction ("do not start
> building until the mechanism is chosen") is no longer true: the mechanism was chosen and the eight
> decisions were made on 2026-08-20. **What is true now lives in Store Operating Standards §13**
> (policy) and `docs/production_build_spec.md` §6.1 and §9.2 (build technique); what changed and when
> is in `CLAUDE.md` §9. Kept only as a record of how the work was framed.
> Its scorecard line (5.4 -> 6.9 -> 7.4) remains accurate as of 2026-08-19.

# Task brief — Trust & social proof

**This is a task brief, not a state document.** It deliberately names **no theme id and no
deployment claim**, so it cannot go stale: `CLAUDE.md` §10 CURRENT STATE is the only authoritative
statement of what is deployed, and it must be re-verified live before acting. (`docs/POC7_kickoff.md`
was a one-shot prompt that hardcoded a theme id and a present-tense state block, rotted silently,
and was deleted 2026-08-18. Same shape, same trap.)

Written 2026-08-19, at Steve's request, to hand this off to a fresh session.

---

## Paste this to start

```
Crema Italia — pick up TRUST & SOCIAL PROOF.

This is the last big item on the storefront scorecard, and it is a DECISION first,
a build second. Do not start building until the mechanism is chosen.

WHERE THINGS STAND
- Read CLAUDE.md §10 CURRENT STATE for what is deployed, then verify it live with
  `shopify theme list` and `git log origin/main..HEAD` before making any claim about it.
  Live output beats every document, including §10 and including this brief.
- The storefront has been scored three times against one rubric: 5.4 → 6.9 → 7.4 out of 10
  (as of 2026-08-19; re-score if more batches have shipped since).
- Trust & social proof has scored 3.5 in ALL THREE passes. It is the only dimension that has
  never moved, and it sits four points below the next-lowest. Closing it to ~7 adds about
  0.35 overall on its own, and it also unblocks finding F9 (structured data), because
  aggregateRating is the same markup that would take that from partial to closed.
- Measured on the deployed theme: zero occurrences of reviews, ratings, stars, testimonials,
  reorder, or verified. The founder story is carrying the entire trust load alone.

READ FIRST, IN THIS ORDER
1. CLAUDE.md §10 CURRENT STATE, then §6 (the "Never" list), then the 2026-08-19 §9 entry.
2. docs/POC16_change_list.md — the most recent build record.
3. The three audit artifacts, newest first:
   https://claude.ai/code/artifact/85a32987-ce20-472c-96ba-fcefcad0608f  (pass 3, POC16)
   https://claude.ai/code/artifact/caca5141-68ba-4006-9b59-a5f4a3f49ecf  (pass 2, POC15)
   https://claude.ai/code/artifact/630bffc2-d816-4fc2-a32b-d89a6aec61aa  (pass 1, POC13 — has
   a full section on ratings, including its recommendation and its Shopify research)

THE ACTUAL TENSION — do not paper over this
The first audit argued for palate-matched feedback ("of customers whose profile is Light &
Fruit and Flowers, 84% reordered this") and REORDER RATE, instead of a global five-star
average. Its reasoning: a five-star average measures "did this match my palate", not "is this
good", so every coffee lands on 4.6 and nobody reads them. Steve's own instinct was the same —
one person's best coffee is another's meh.

That argument still holds. BUT: schema.org aggregateRating models exactly the global average
being rejected, and it is the only shape Google renders as stars in search results. So choosing
the better on-site signal means deliberately giving up the rich result. That trade needs making
on purpose, with Steve, not defaulting either way.

WHAT TO VERIFY RATHER THAN RECALL
- What Shopify supports natively for reviews TODAY. This has changed more than once and the
  first audit's research is a year old. Check current sources; do not answer from memory.
- Whether it works on the plan Crema Italia would actually launch on. There is a Partners dev
  store simulating Basic: crema-italia-development.myshopify.com. Use it.
- Whether the theme can render whatever mechanism is chosen, or whether it needs an app.

TRAPS THAT WILL COST YOU TIME
- There are no real customers and no real reviews. Everything in assets/ci-catalog.json is
  invented fixture data (see the agent memory "POC catalog is fixture data"). Do NOT mock up
  fake reviews, star counts, or reorder percentages in the POC — fabricated social proof is
  both dishonest and exactly the failure mode this project keeps catching. If a mechanism needs
  demonstrating, label it unmistakably as a mechanism with no data behind it.
- The brand rejects manufactured urgency. A "172 of 222 founding members" line was REMOVED in
  POC11 for asserting something untrue. Anything resembling social proof must be true on day
  one or not shipped.
- Reorder rate is the one signal that can be shown from month one with no reviews at all, and
  virtually nobody in the category displays it. Worth weighing seriously.
- production_build_spec.md §0 (POC scope) and §9 (structured data, incl. the aggregateRating
  note) both bear on this. §11 says commercial rules must never ship as string literals.

DELIVERABLE
Bring Steve a recommendation with the trade stated plainly, what it costs in search visibility,
what it needs operationally (review collection, email, moderation), and what — if anything —
is honestly buildable in the POC today. Then build only what he approves.
```

---

## Notes for whoever picks this up

**Two mechanical things this project's sessions most often get wrong**, both documented but both
worth saying out loud at the start:

- Run `shopify theme list` **and** `git log origin/main..HEAD` before claiming anything about
  deployment state. A stale "not yet deployed" line in a change list produced a duplicate Shopify
  theme on 2026-07-24, and the contradicting live output had already been on screen that same
  session.
- Screenshots need the two-call recipe at the top of `CLAUDE.md`: `tabs_create` → `navigate` →
  `screenshot`. Never `preview_start`'s seed tab. Six sessions recorded the tool as "wedged"
  before this was found.

**Why this one is harder than the items before it.** The first two scoring passes moved the number
by fixing things that were contained, verifiable and needed no decisions — keyboard access, meta
tags, image weight, an email field. Trust is not like that. It needs a decision from Steve, an
operational commitment (collection, moderation, email), and in most shapes it needs real customers
before it can show anything at all. Expect the useful output of the first session to be a
recommendation, not a commit.

**Related open items** that may interact, from `CLAUDE.md` §10:

- **Real photography.** Three `ci-temp-*` stand-ins remain. Photo reviews (Loox-style) would
  compound with this decision.
- **Email platform not chosen.** Review-request emails need one, as do the win-back and
  abandoned-cart campaigns already assumed by Store Operating Standards.
- **F9 structured data is partial.** `Product` and `AggregateRating` are deliberately not emitted
  on the POC because a one-URL SPA has no per-product address. Whatever is decided here determines
  whether that stays partial into production.
