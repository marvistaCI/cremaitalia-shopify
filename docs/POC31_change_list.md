# POC31 change list — the reviewer's second look at POC30, plus Steve's own list

**Deployment state is NOT recorded here.** See `CLAUDE.md` §10 CURRENT STATE, which is the only
authoritative statement of what is deployed. This file is the build record.

**Source of the batch:** the same external B2C reviewer that assessed POC28 re-inspected the
deployed POC30 at frame level and sent a correction plus a revised open list (2026-09-13), and Steve
added copy items of his own the same morning. Built interactively, one item at a time, each
discussed before it was touched, on Steve's instruction. Nothing is pushed to a numbered preview
until Steve says the batch is complete.

**Ground rule carried from POC30:** all roasters, products, prices and ratings in the POC are fixture
data. No item here draws a conclusion about catalog credibility.

---

## 0. The reviewer's correction, logged as a strength

The reviewer had listed add-to-cart feedback as the number-one open interaction gap on POC30. On
frame-level inspection they withdrew it: on click, three signals fire at once - the button state
change, the animated bean flying a C from the button to the cart icon, and the toast - and the badge
increments to the correct count on arrival. Their earlier finding came from a post-animation
screenshot plus static `innerText`, which cannot capture a second of motion. **Removed from the open
list; recorded as a strength** (three feedback signals against the typical one; the bean is a
distinctive brand touch). Logged in `docs/scoring-history.md` as well, so the next scoring pass does
not re-inherit the withdrawn finding - the durable lesson of that series being that the claims which
survived untouched were the ones nobody had measured.

**Their revised open list, and where each item went:**

| # | Finding | Disposition |
|---|---|---|
| 1 | 90-day freshness copy on cards and PDP - a decision | **Item 5**, decided and built, Standard v1.22 |
| 2 | Placeholder ratings - a real-proof plan before launch | **Deferred** (item 7, Steve 2026-09-14): a written plan in the trust brief, no storefront change |
| 3 | Gold-on-cream contrast, "Save to my account" at 1.88:1 | **Item 4** - a checker artifact, with a smaller real failure underneath it, fixed |
| 4 | Roaster story content - gated on a signed roaster | **Not a POC item**; cannot be shown until a roaster signs |

---

## 1. Copy: "A confession." and "uniquely their own" (Steve)

Home story heading "A full confession." becomes **"A confession."** The mission line reads *"to find
Italian roasters whose craft is **uniquely** their own"* (was *entirely*). The build comment beside the
founder story that quoted the old phrase is annotated rather than silently rewritten.

## 2. About: the warehouse line (Steve)

*"stores it in our Florida warehouse"* becomes *"stores it in our **temperature-controlled**
warehouse"*, hyphenated as a compound adjective.

## 3. About: the FDA U.S. Agent sentence moves to the FAQ (Steve: strike plus FAQ)

The consumer does not care that we are the U.S. Agent for FDA food-facility registration; it is a
regulatory fact that matters to roasters and regulators, and the jargon diluted the *"we import; we
never interfere"* paragraph. Struck from About. It lives on as one FAQ entry, **"Is imported coffee
regulated?"** - *Yes. Every foreign food facility shipping to the U.S. must register with the FDA and
name a U.S. Agent. We serve as that agent for our roaster partners.*

## 3b. "Slow boats age the beans." (Steve, via his daughter)

The second beat under the hero read *"We fly it in. / An ocean crossing ages coffee."* Steve's daughter
pointed out that a plane crosses the ocean too, so the line never said why flying matters. Only a ship
owns the weeks. Steve proposed *"Slow boats cost less but age the beans"*; the cost clause was argued
off (it pulls the reader toward our price, and POC30 chose this line as a transit fact rather than a
jab). Now **"Slow boats age the beans."** The build comment records why the old line went so a later
session does not restore it.

## 4. The taste ribbon's ground, and a contrast finding that was mostly a tool artifact

**The finding:** *"Save to my account", gold on cream, 1.88:1, the one isolated AA failure.*

**Measured on the live ribbon before anything was touched.** The link sits on the taste ribbon, which
paints a dark gradient as a background *image* with no background *color*. Every element behind the
link reports a transparent color, so a computed-style checker falls through to the cream page - and
gold on cream is exactly 1.88:1. The real ground is brown. **But there was a smaller, real failure
underneath the artifact:** the gradient ran from a near-black brown to the soft-brown token, lightest
at bottom-right, and at desktop width the link sits at that end.

| Gold "Save to my account" on the actual ground | Before | After |
|---|---|---|
| Lightest possible point of the gradient | 3.95 | 5.61 |
| Under the link at 1280, worst corner | 4.35 | 5.89 |
| Phone (link at the dark end) | 5.8 and up | 6.3 and up |

Against the 4.5:1 AA bar for 12.8px text. Marginal, and it failed in the corner. Desktop was already
the worst case, since the ribbon caps at the page max width.

**The fix, one rule in `ci-storefront.css`:** the gradient now ends at **Espresso** (`--ci-coffee`),
the flat ground of the `.dark-hero` band directly beneath the ribbon, so the ribbon matches its
neighbour instead of reading lighter at the edge; and a **solid dark `background-color`** sits under
the gradient as a fallback, with no visual effect where the gradient paints, so checkers and any
gradient-less renderer read the real ground. Both endpoints on-palette. The cream "Apply profile"
toggle stays above 9:1. Verified by measurement at 375 and 1280 **and by looking** - the Browser pane
was on top, and the gold link reads clearly on the darker ribbon.

## 5. One freshness statement per surface, and it varies per coffee (Steve) - Standard v1.22

**The finding, as the reviewer restated it in reply:** their original objection had never been to
showing freshness; it was to freshness *headlining* the hero and the price story, where it is the
weakest lever and invites a comparison we cannot dominate. Both of those left the hero in POC30. On the
card badge specifically they conceded the point - a concrete window against 12-to-24-month competitors
is a real, defensible differentiator - with one catch: *a differentiator only differentiates if the
customer can see the comparison.* A bare "90 days" on a card can read as a use-by pressure. Their
prescription: keep it, reframe it from deadline to virtue, state the comparison once where the buyer
sees it, keep it out of the hero and the price story, and confirm operations can honour the window.

**Steve's reframing beat the prescription.** *"We state the same thing on all coffee cards. I'm not
sure that actually helps. It's more of an FAQ statement."* A badge that reads identically on every card
is a rule, and rules belong in the FAQ; a date that differs card to card is evidence that we know how
old our coffee is - which is the honesty proof the reviewer wanted the badge to carry. His proposal:
put *"Roasted on or after [oldest roast date]"* into the green strip itself, drop the window sentence,
and write a new FAQ entry. He also floated an *"available through [date + 90]"* second half and it was
argued off: it is the retired best-by date (POC19 - roast date plus a constant states one fact twice),
it is a clock again, and it bounds neither sell-out nor availability.

**What shipped (`assets/ci-storefront.js`):**

- The `.freshness` strip on the **card** and on the **product page** reads **"Roasted on or after
  DD-MMM-YYYY"**, the oldest roast date still on the shelf for that coffee. Under FIFO the bag the
  buyer receives is never older. Nine Roccia and Selezione fixtures now show nine different dates.
- The product page's plain policy-floor line and its *"These beans are within our best-freshness
  window of 90 days"* strip are **both gone** - they read identically on every coffee. One statement
  per surface.
- **A collection** (Sorpresa) holds no stock and is boxed on order, so its product-page floor is the
  **oldest of its components'** - the same union-over-components rule its filters use. Its card keeps
  *"Boxed for you when you order"*. This was caught by driving the collection's page after the first
  cut, which had fallen back to the policy floor.
- **The policy floor is the fallback**, never the display: a product with no lot date shows today
  minus the window, computed in Liquid, still true by construction. A missing lot record widens the
  claim rather than falsifying it.
- Offerta keeps its computed band and *"Sold as-is"*; Selezione's low-stock note keeps precedence on
  the card. The unread JS mirror of the window constant is removed; Liquid still reads the setting.
- **Production seam** at `roastFloorLabel()`: the fixture `roast_date` stands in for the oldest ACTIVE
  lot's `roast_date` on the product (`crema_italia.lots`, build spec §13.9), which the 3PL receiving
  report populates. **The date is exactly as true as that record and the pick discipline behind it** -
  a lot recorded as empty while bags remain in the bin would show a younger date than the bag that
  ships. The reconciliation control in the SKU standard is what keeps it honest, not the theme. This
  is the reviewer's *"confirm operations can honour 90 days"* made concrete: it is now a customer-facing
  dependency on the 3PL, and it is on the 3PL question list.

**Store Operating Standards v1.21 -> v1.22** published via `crema-std-publish` **before the push**,
because this reverses the v1.12 rule (computed policy floor on the main shelves, with three recorded
reasons it beat an actual date) - the POC19 precedent, amend first. §5 *What the customer sees* now
states the oldest-on-shelf date, the component rule, the fallback, and the trade accepted knowingly.
The build spec's display section was rewritten to match. Both touched renders regenerated at exit 0,
v1.21 archived, both delivered to OneDrive and md5-verified.

**Verified on the dev server:** 12 shop strips, 9 distinct dates plus the collection note and two
low-stock notes; detail views for a Roccia coffee, a Selezione coffee, the collection and the Offerta
lot each show exactly one freshness statement; zero occurrences sitewide of *"best-freshness window"*,
*"Best within"*, or an ISO date. Looked at in the pane: the strips read cleanly under the tasting notes.

**Not built, post-launch:** the reviewer's A/B test (bare badge vs badge-plus-comparison) needs real
traffic and is recorded here so it is not forgotten.

## 6. The FAQ, one entry at a time - Standard v1.23

**The merge.** The FAQ asked *"How fresh is the coffee?"* twice: a three-paragraph FIFO answer near the
top and a two-line *"Best within 90 days of the roast date, which we always show"* at the bottom, the
second no longer true after item 5. Merged into one entry carrying the roast date on every bag, the
oldest-bag date on every shelf, the market's 12-to-24-month **"Best by"** framing (Steve's addition),
the window as a token, and the no-waste pledge. **FIFO dropped on Steve's call**; the *"roast date
range"* sentence went with the range it described.

**Then every entry was reviewed together, one at a time.** Two changed; Steve was content with the
rest, and *"curate"* in *Do you roast the coffee?* stays after checking the word's use sitewide - it
describes an activity we actually perform on six other surfaces (assembling the Sorpresa box, choosing
a roaster), so dropping it in one answer would make the FAQ the odd one out.

- **FAQ 1, ground coffee** - Steve's rewrite, whole beans as the customer's benefit rather than the
  roaster's packaging, with five copy-rule tweaks: *coarse*; *longer-lasting*; *You will* (the site
  never contracts); *the coffee's taste and aroma* for *coffee essentials (taste and aroma)*; and
  *look for a burr grinder in Accessories* for *search for 'burr grinder'*, since there is no search
  box (removed in POC9).
- **FAQ 2, freshness** - *"Most coffee is sold"* could read as *our* coffee; now *"Most of the coffee
  on the market is sold"*, avoiding *competitors* because it names an opponent. Steve's second half:
  the rule, the reason, the admission that older coffee is still drinkable, and *"we will find a
  deserving home for the older coffee"*.

**Three consequences the review surfaced, all fixed in the same pass:**

- **No charity is named anywhere on the storefront.** *Feeding Tampa Bay* only holds if the 3PL is in
  Tampa, which is undecided; donations get a Journal post when they are made. Removed from the FAQ,
  the Promise page and the Offerta note. (Only a build comment still carries the name.)
- **The Promise page's no-waste pledge** said *"We do not discount our way out of waste; we give it
  away"*, which Offerta contradicts, hidden or not. Steve's rewrite: a higher standard than most;
  older coffee is still good coffee; under the pledge it goes to other good uses, including charitable
  donations. *"Other good uses"* leaves room for Offerta without announcing a markdown.
- **The Promise page's freshness window** said *"we recommend that you consume the coffee within 90
  days"* - the selling gate dressed as consumption advice, which POC19 retired. It now states the gate:
  no bag sells from our shelves once its roast date is older than the window. *"Superior quality,
  sealed packages"* became *"the roaster's own sealed bags"*.
- **The Offerta sold-as-is note** now says why the coffee is there and where it goes (Steve's draft,
  tightened): *by invitation* rather than *members only* (the site has no members), *recently* dropped
  (a slow mover can sit for sixty days), no Journal link (the Journal is native blog, not modelled), and
  the actual guarantee sentence kept.

**Store Operating Standards v1.22 -> v1.23**, same ritual, same day: the FAQ entry is written; no
charity is named in the Standard either; FIFO is no longer explained to the customer, and the approved
2026-08-20 FAQ copy is withdrawn and **removed rather than kept as history**, since nobody transacted
under it (the provisional-values rule).

## 7. Placeholder ratings - DEFERRED

The reviewer's second open item, a real-proof plan before launch. No storefront change is possible;
the deliverable is a short written plan (review app, a post-delivery review email around day ten,
seeding from Founding Members). **Deferred by Steve, 2026-09-14.**

## Follow-ons recorded here so they are not lost

- **A last-chance alert (Steve, 2026-09-14).** At sign-up, ask which alerts a customer wants, and offer
  *"Just before a coffee is donated to charity, would you be interested in a last-chance offer?"* This
  answers a question the Offerta invitation mechanism (build spec §14) leaves open - who gets the
  email - with consent: the invitation list becomes people who asked, and it never teaches the public
  to wait for a markdown because only those who chose the alert ever see it. Sits beside the two alerts
  the footer already promises (a new roaster, a coffee about to run out). An email-platform item; the
  POC's account notification stub could show the option if Steve wants it visible.
- **Journal posts as donations are made**, naming the recipient - the storefront now points there.
- **Substantiation on file for the 12-to-24-month market claim** (Standard §5) - it is now in the FAQ,
  the Promise page and the Offerta note.
- **The 3PL lot-record dependency** behind item 5 - on the 3PL question list; the theme cannot make the
  date honest on its own.
- **The A/B test** from item 5, post-launch.

## Files

| File | Change |
|---|---|
| `templates/index.liquid` | (1) story heading, mission line, comment; (2) warehouse line; (3) FDA sentence out of About, FAQ entry in; (3b) second beat; (6) FAQ merge, FAQ 1 and 2 rewrites, Promise freshness window and no-waste pledge, Offerta sold-as-is note |
| `assets/ci-storefront.css` | (4) `.taste-ribbon` ground: gradient ends at Espresso, solid fallback color, reasoning at the site |
| `assets/ci-storefront.js` | (5) `roastFloorLabel()` with the component rule and the fallback; `freshnessCell()` and the detail view read it; window constant removed |
| `docs/standards/store-operating-standards.md` | (5) **v1.22** display rule; (6) **v1.23** FAQ written, charity unnamed, FIFO withdrawn |
| `docs/standards/collaboration-standard.md`, `docs/standards/README.md`, `CLAUDE.md` pointer block | v1.22, v1.23 cross-references |
| `docs/standards/_archive/` | v1.21 and v1.22 renders archived with table rows |
| `docs/production_build_spec.md` | (5) §13.9 display section rewritten; §13.10 floor marked as fallback; (6) FIFO/charity notes |
| `docs/scoring-history.md` | (0) the add-to-cart correction logged as a strength |
| `docs/POC31_change_list.md` | this file |
