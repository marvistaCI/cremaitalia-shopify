# POC12 — change list

**This file is the BUILD RECORD for the POC12 batch** — what changed and why, built 2026-08-06
directly out of the POC11 review.

> **It deliberately makes NO claim about what is deployed.** Deployment state lives in exactly one
> place: **`CLAUDE.md` §10 CURRENT STATE**. A stale "not yet deployed" banner in a file like this
> one is what produced a duplicate Shopify theme on 2026-07-24. Check §10, and verify §10 itself
> against `shopify theme list` before acting on it.

Scope boundary from POC11 §0 still applies: roaster names, product names, prices, tasting notes
and photography are **Code-invented fixtures**, not the business. Nothing here critiques them.

---

## 1. Quiz pays off before it asks — AMENDS the POC4 lock

**The headline change, and the one with real conversion consequence.**

**What was wrong.** POC11 promoted the taste quiz to the hero CTA, moving the first call to action
from 3.9 screens down to 0.6 and making it free. But the result buttons still routed through
sign-in. So a stranger's *first action* on the site ended at a login form headed "Your Account"
(they have none), which never explained why it appeared, whose only stated benefit was a
**subscriber discount they cannot use yet**, and which offered **no visible guest option** —
dismissal was via the `×` only.

It was dismissible, so a speed bump rather than a wall. But it sat at the exact moment of reward,
for the exact audience the promotion was built to capture.

**Why the old lock was right and then stopped being right.** POC4 locked *"both result buttons
route through sign-in first to capture the taste profile."* That was written when the quiz was a
quiet inline link taken by someone already deep in the page and demonstrably interested. Promoting
it to the hero changed **who arrives there**: a stranger, roughly 90 seconds in, who has not yet
seen a product. The lock was not wrong; its preconditions changed.

**What was built.** `chooseQuizMatches()` and `chooseQuizEverything()` now act immediately for
everyone — filtered Shop (or everything), honest ribbon, no modal. `pendingQuizAction` and its two
dead branches were retired: the `closeSignin()` guest fallback and the `simulateSignIn()` replay.

**The capture attempt is not abandoned, it moves.** A quiet gold **"Save to my account"** link now
sits in the ribbon, shown to signed-out visitors only, asked **after** the result has proven
useful. Declining costs nothing — the profile already works for the session. Signed-in visitors
are unaffected (POC10 already fixed that path).

**Verified by driving every path:**

| Path | Result |
|---|---|
| Guest → "Show my matches" | No sign-in; filtered Shop 6/13; ribbon honest; save offer shown |
| Guest → "Save to my account" | Sign-in opens → commits on success → save offer hides |
| Signed-in → quiz | No gate, no save offer |
| Guest → "Show me everything" | No gate; all 13 shown; ribbon reads "not active"; save offer shown |

## 2. Ribbon layout — the cost of a third control, and the fix

Adding the save link widened `.tr-actions` from ~228px to 349px. Alongside `.tr-main` at 823px
that exceeded the 1120px inner width, so the actions dropped to a second row: ribbon **51 → 92px**
at 1440.

Steve's call: let `.tr-main` shrink so the actions stay inline. **Two things were needed and the
first alone did nothing:**

1. `min-width:0` on `.tr-main` — a flex item defaults to `min-width:auto`, flooring it at
   min-content, so the status block would not give way.
2. **`flex-wrap:nowrap` on `.taste-ribbon-inner`** — the one that actually mattered. A wrapping
   flex container **wraps before it shrinks**, so `.tr-main` was dropping to its own line and then
   *growing* to fill it (measured 1080px wide). The shrink never engaged.

**The breakpoint is measured at both settings, not guessed.** Ribbon height, wrapped vs nowrap:

| Viewport | Wrapped | Nowrap | Better |
|---|---|---|---|
| 1440 | 92 | **79** | nowrap |
| 900 | 135 | **119** | nowrap |
| 870 | 135 | **119** | nowrap |
| 830 | **135** | 150 | wrap |
| 760 | **135** | 150 | wrap |

Crossover sits between 830 and 870, so nowrap applies at **860px and up**. Below it the status
wraps to three lines and forcing the controls inline costs *more* than letting them wrap. An
earlier attempt set this at 1100px on a guess, with a CSS comment carrying numbers that compared
two different viewports; both corrected. The real table is in the CSS so it can be re-derived if
the copy or control set changes.

**Open:** the phone ribbon is **262px**, 32% of an 812px screen. It is `static`, so it scrolls
away rather than sticking. Three controls cannot sit beside the status at 375px and nowrap there
would overflow. The status sentence is the bulk of the height — shortening it is a **copy**
decision, not a layout one.

## 3. Shop nav dropdown glosses — the surface A4 missed

POC11's A4 standardised the home cards and shelf-page eyebrows but never touched the **Shop
dropdown**, which is where a first-timer actually meets these words. It carried its own
inconsistent set: Roccia had "The Rock", Sorpresa said **"Surprises"** against the headers' "The
Surprise", and **Selezione and Offerta had no English gloss at all**.

Combined with A5's pill gloss, that left **Sorpresa described five different ways**.

**Decision: do NOT apply the header format here.** The eyebrow form (`The Surprise · Curated
Discovery`) is a taxonomy label; a dropdown is a menu you choose from, so it keeps sentences. The
gloss is added consistently instead — making the dropdown the place the vocabulary is *taught*,
which suits it, while the headers remain where it is *stated*:

| All Shelves | Every coffee we carry, in one place. |
|---|---|
| Roccia | **The Rock:** our rock-solid subscription plan. |
| Sorpresa | **The Surprise:** our curated collection of roasted delights. |
| Selezione | **The Selection:** roasters' premium and seasonal offerings. |
| Offerta | **The Offer:** limited-time offers, on sale while inventory lasts. |

"Everything we carry, in one place" was aligned to "**Every** coffee we carry, in one place" to
match the Shop pill gloss, which was a near-duplicate in different words.

## 4. FAQ promised a discount that did not exist

The promo-code answer ended *"Subscription and/or **volume** discounts are calculated for you..."*
"Volume" appeared **exactly once on the entire site**, and the question directly above it lists
only subscriber 10/12% and first-purchase 5%. Two adjacent answers disagreed. Now reads "**Any
discount you have earned** is calculated for you when you log in and check out."

A volume tier exists as a *candidate* in Store Operating Standards §3, but nothing customer-facing
describes it, so naming it was a promise with no backing.

## 5. Ops-vocabulary leak the A3 sweep missed

The account page's Loop portal copy read *"swap roaster / **SKU** / bag-size"*. POC11's A3 sweep
missed it because that sweep scanned **leaf elements only**, and this text node sits alongside
child elements. Re-verified with a `TreeWalker` over every text node — ops leaks now genuinely
zero. Now reads "swap roaster, coffee, or bag size".

## 6. "Bio" affordance on the About people cards

**Steve's diagnosis:** the whole card is clickable, but that is only discoverable by hovering,
which a touch or keyboard user never does. A visible "Bio" line under name and title is the better
tell.

**All four cards get it, with no conditional logic** (Steve's call). Lauren Roberts and Partner 1
now have `people[]` entries reading **"Bio under construction."** rather than being inert — this is
a POC, no team member or partner ships without full data, so a placeholder is honest and a
special-case branch would be waste.

Two things added beyond the literal ask, both flagged:
- **It is a real `<button>`, not styled text.** The card is a `div` with an `onclick` and **cannot
  be tabbed to at all**, so the bios were unreachable by keyboard. The button is focusable, fires
  on Enter, carries a `:focus-visible` ring, and stops propagation so the card handler does not
  fire twice.
- **Sized for touch.** As bare text it measured **20×16px**, far under the 44px floor POC7 set.
  Now 36×40px on phones.

The name appearing twice on a placeholder bio is the `.person-photo` fallback rendering the name —
the same convention the About card already uses, not a duplicate.

---

## 7. Decisions confirmed in this batch

| # | Decision | Status |
|---|---|---|
| 1 | Quiz result buttons no longer route through sign-in | **LOCKED** — amends POC4. Logged in `CLAUDE.md` §9 |
| 2 | The account ask moves to the ribbon, after the payoff | **LOCKED** |
| 3 | Quiz stays **invitation-only** — no first-visit auto-launch | **UNCHANGED** from 2026-07-10 |
| 4 | Dropdown keeps sentences; header format not applied there | **LOCKED** |
| 5 | Bio placeholders for Lauren / Partner 1, no special-case logic | **LOCKED** (Steve) |
| 6 | Ribbon nowrap at ≥860px, wrap below | **LOCKED**, measured |
| 7 | Product-card shelf badges keep their own short vocabulary | **UNCHANGED** — decided in POC11 |
| 8 | POC12 is its own batch, not a POC11 refresh | **LOCKED** — POC11 was already deployed and reviewed; changing it in place would break what the number means |

## 8. Still open after POC12

- **Phone ribbon height (262px)** — needs a copy decision on the status sentence, see §2.
- **B3 team/partner bios** — deferred and re-filed as an **administrative** feature (sections +
  blocks, `production_build_spec.md` §2) so Steve can add people without republishing. Waits on a
  signed partner agreement and Lauren engaging. The placeholders above are POC scaffolding, not
  the deliverable.
- **C2 entry price rung** — parked; the ratio that raised it comes from invented prices.
- **Track D** (photography, lead-roaster prominence, founder-story product anchor, trust signals)
  — gated on signed roasters.
- **"In bocca al lupo"** as the quiz result headline — observation only, locked by Steve in POC4.
- **About: "Italy is the home of espresso and of great coffee - a fact recognized worldwide"** —
  Steve's facts are right and the review overstated the objection. The narrow residue is that
  "a fact recognized worldwide" certifies a judgment as well as a fact. Four words, low priority.

## 9. Verification-method lessons from this session

Three separate times a check reported clean or wrong while the code was fine. On this codebase the
**method needs as much scrutiny as the finding**:

1. **Hidden pages return empty text.** A sweep that re-hides each `.page` before reading
   `innerText` finds nothing. Activate all pages and keep them active while reading.
2. **`text-transform` defeats case-sensitive matching.** `.ss2` is uppercased in CSS, so
   `innerText` returns "SURPRISE DISCOVERY" against a mixed-case test string.
3. **Leaf-only scanning misses text nodes beside child elements.** Use a `TreeWalker` over
   `SHOW_TEXT`, not `querySelectorAll` filtered to childless elements.

Also: `getBoundingClientRect().top` differing by a few px between a bordered button and a plain
link is **vertical centring, not a wrap** — twice this session that produced a false "it wrapped"
reading.
