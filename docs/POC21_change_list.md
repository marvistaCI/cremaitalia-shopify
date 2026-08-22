# POC21 — the hero rewrite

**One change: the hero headline and sub-line.** No other surface moved. `CLAUDE.md` §10 carries the
authoritative deployment state — no state claims here.

---

## What shipped

```
A small, named group of roasters.
Whole bean, roasted in Italy.
Exactly as the roaster sealed it.

We fly it in. Most bags sell within 14 to {{ freshness_window_days }} days of roasting,
and none after {{ offerta_fresh_days }}. What doesn't sell goes to Feeding Tampa Bay.
For people who love to grind their own beans.
```

Replacing a two-line H1 and a single 180-character sub-line that had a **dangling modifier** — *"From
a small, named group of artisan Italian roasters, air-freighted whole-bean so it reaches you…"* never
supplied a subject for *air-freighted*, so the sentence had no grammatical spine.

---

## 1. The claim moved from unverifiable to enforced

The old sub-line promised *"it reaches you weeks from the roast date, not months."* **That is not
reliably true.** A bag can be listed at two weeks and bought at day eighty, reaching that customer
about twelve weeks from roast — three months — and the 90-day window permits it. The warm phrasing
was the one overclaiming.

What replaced it is the gate we actually enforce: **most bags sell within 14 to 90 days, none after
150.** Both numbers are settings, not literals, so the copy follows the rule rather than restating it
(`production_build_spec.md` §11). Change `freshness_window_days` and the hero changes with it.

**14, not 7.** Roast-to-pickup is ≤7 days under the Roaster Guide, and then comes air freight, customs
and 3PL receiving. A bag cannot be on sale 7 days from roast — it is still in Italy or in the air. 14
is also consistent with the Roaster Guide v8 goal statement's *"two (2) to thirteen (13) weeks."*

## 2. The donation pledge is now the differentiator, in the hero

*"What doesn't sell goes to Feeding Tampa Bay."* Named, not *"a worthy cause"* — specificity is what
makes effort felt, and the Promise page already commits to it: *"We do not discount our way out of
waste; we give it away."* Discounting old stock forever is the industry default; giving it away is a
real cost, voluntarily taken, and nobody else on the shelf can say it.

**Rejected on the way:** an earlier draft said *"no bag more than `{{ freshness_window_days }}` days
past roasting."* That would have been **false**, contradicted by an entire shelf of our own store —
Offerta sells 91 to 150 days. The token is what exposed it: writing the setting name forced the
question *which number is this promise about?*

## 3. Ops vocabulary kept out, twice

Two drafts were reverted for register, on the POC11 rule *say the customer-visible consequence, not
the mechanism*:

- *"into our inventory"* — puts a warehouse between the roaster and the reader, lengthening the
  journey the sentence is trying to make feel short.
- *"available for purchase"* — describes a state in **our** system. *Reaches you* is the phrase doing
  the emotional work.

Also rejected: *"most bags are **consumed** within…"*. We do not control consumption, and **POC19
retired `peak_flavor_days` on exactly that distinction** — *"the other windows are gates we enforce,
that one was advice about behaviour we do not control."* A consumption claim in the hero would have
walked that back in the most visible place on the site.

And *"a select group"* was declined: §6 bans *hand-picked*, *world-class*, *exclusive* "and other
e-commerce-loud language," and POC15 removed *"carefully hand-selected… at its finest"* for being that
anti-pattern rearranged. *Small* is a countable fact and *named* is a promise kept on the Roasters
page; *select* is an adjective about our own taste.

## 4. Why line 2 says "roasted in Italy" and not "Italian roasters"

Steve's distinction, and it is a real commercial one: **US companies produce "Italian roasts" without
being roasters in Italy.** *Italian* as an adjective on *roasters* can be read as a style. *Roasted in
Italy* is a location and cannot be borrowed.

**That single choice is also what made the layout work** — see below.

---

## 5. The sizing, and the measurement that decided it

Three H1 lines at the old size wrapped to four at 375. The mobile rule carried arithmetic tuned to the
previous two-line headline, whose worst string measured **13.838×** its own font-size.

| Headline variant | Binding line | Multiplier | Max font @375 | Ratio vs 17.6px sub |
|---|---|---|---|---|
| Three-line, with *Italian* in line 1 | *A small, named group of Italian roasters.* | 18.159× | 18.0px | 1.02 : 1 |
| Steve's verbatim draft | *From a small, named group of Roasters,* | 17.806× | 18.4px | 1.05 : 1 |
| **Shipped — *Italian* dropped** | *Exactly as the roaster sealed it.* | **15.126×** | **21.3px** | **1.21 : 1** |

**Because line 2 carries Italy as a place, line 1 no longer needs the word** — and removing it took
the binding line from 18.159× to 15.126×, buying 18.4px → 21.3px. That is the entire difference
between a headline and a second paragraph. At 18px against a 17.6px sub-line the two blocks read as
two paragraphs in different colours, which is the defect the CSS comment has warned about since POC5:
*"the ORIGINAL hero's defect was a subhead with ~4x the visual mass of the headline."*

New rule, with the arithmetic and the reasoning recorded in place:

```css
.hero h1{font-size:clamp(14px, calc(6.55vw - 3.3px), 1.625rem)}
```

**Verified one line each at 320 / 360 / 375 / 390 / 428**, with 4–5px margin at every width.

**A correction worth keeping.** Mid-session I claimed that shortening a headline line would not buy
font size, because *"Exactly as the roaster sealed it."* was always the binding line. True of the
**two-line** variants measured at the time, and wrong as a general claim — in the three-line version
line 1 *was* binding, and deleting one word from it changed the whole layout. Over-generalised from
the case in front of me.

---

## Verified

| | 375 | 1280 |
|---|---|---|
| H1 | 21.3px, 3 lines | 40px, 3 lines |
| Sub-line | 17.6px, 5 lines | 22.4px, 3 lines |
| Ratio | 1.21 : 1 | 1.79 : 1 |
| CTA above fold | yes | yes (786 of 900) |
| Horizontal overflow | none | none |
| Tokens resolved | `14 to 90` / `none after 150` | same |

Both widths were **looked at**, not only measured — which is how the same-size-as-the-paragraph defect
was caught at 375, since every geometry assertion passed while the hierarchy was gone.
