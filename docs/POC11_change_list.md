# POC11 — working outline

**Status: OUTLINE / NOT STARTED.** Nothing in here is built. This is the working document for
the POC11 batch, drafted 2026-08-06 from the POC10 site review + Steve's responses to it.

**Read the scope boundary first (below) before treating any item as a defect.**

---

## 0. Scope boundary — what the POC10 review could and could not judge

The 2026-08-06 review walked deployed POC10 end to end. Several of its findings turned out to
be reviewing **Code-invented fixture data**, not the business. Recording the boundary so the
same mistake isn't repeated in POC11 review passes:

| Layer | Real? | Reviewable now? |
|---|---|---|
| Voice, copy, IA, flow, CTA hierarchy, page structure | **Real** — Code-authored against the Standards | **Yes** |
| Discount / freshness / shelf / founding rules | **Real** — from Store Operating Standards | **Yes** |
| Founder story, Three P's, company positioning | **Real** — Steve's own words | **Yes** |
| Roaster names, cities, founding years, bios | **Invented fixtures** — roasters still being wooed | **No** |
| Product names, tasting notes, prices, roast dates | **Invented fixtures** | **No** |
| Photography (products, roasters) | **Does not exist yet** — gated on signed roasters | **No** |
| Team/partner photos beyond Lucia + Asia | Placeholder | **No** |

**Consequence:** no POC review may draw a conclusion about catalog credibility, price ladder,
roaster prominence, or visual appeal until real roasters are signed and photographed. Steve
will walk the site again at that point (his call, stated 2026-08-06).

**Also void, not deferred:** "Journal teasers are dead ends." Journal is native Shopify
**Blog + Articles** per `production_build_spec.md` §3 — deliberately not modelled in the POC.
Not a defect. Do not wire them up.

---

## 1. Track A — Corrections (agreed, buildable now, no dependencies)

### A1. Promo-code language — factually wrong, highest priority
**DONE 2026-08-06** (uncommitted, not deployed). Steve chose **Option 2, pre-empt the field.**
Final copy is recorded at the end of this item.

Two customer-facing claims contradict Store Operating Standards **v1.3** and the 2026-07-25
dev-store verification (the checkout discount field **cannot** be hidden below Shopify Plus):

| Where | Current text | Problem |
|---|---|---|
| FAQ, "Is there a promo code box at checkout?" | "No." | False — the field is visible on every plan below Plus |
| Cart footer | "No promo code field - earned discounts apply automatically when signed in or via a personal link." | False on both counts — field exists, and "personal link" was **retired in v1.3** as a code leak |

**What v1.3 actually says** (the honest position, and a better one): we issue **no discount
codes at all**, so the field is inert — there is nothing valid to type into it.

**To do:** rewrite both, plus sweep for any third occurrence (check the product-page
subscription blurb and the cart sign-in banner). New copy must (a) not promise the field is
absent, (b) drop "personal link" entirely, (c) hold the no-em-dash rule and the editorial voice.

**Decision: Option 2, pre-empt** (Steve, 2026-08-06). A customer who finds an unexplained empty
box trusts us less than one we warned.

**Copy as shipped:**

- FAQ heading changed from "Is there a promo code box at checkout?" to **"What goes in the
  discount code field at checkout?"** — the question a real customer asks once they see it.
  Answer (**Steve's wording, 2026-08-06** — Code's first draft was cut for length; "promo" then
  broadened to "promo/discount" and the verb forms corrected, both at Steve's direction):
  *"Nothing. We do not issue promo/discount codes, to anyone, ever. No launch codes, no
  newsletter codes, no influencer codes. Subscription and/or volume discounts are calculated
  for you when you log in and check out."*
- Cart footer: *"We do not issue discount codes. Any benefit you have earned is already in the
  prices above when you are signed in, so the code field at checkout stays empty."*

**Terminology:** settled by naming both — the FAQ answer says "promo/discount codes", which
bridges what Shopify labels the field ("Discount code") and what customers call it ("promo
code"). The heading ("discount code field") and cart footer ("discount codes") match the
platform's own label and are left as is.

**Style note for future copy:** `login` / `checkout` are nouns; the verbs are `log in` /
`check out`. Corrected here 2026-08-06. Worth watching in new copy.

**Verified 2026-08-06** on `shopify theme dev`: both strings render; a full-body sweep returns
zero instances of "172 of 222", "promo code", or "personal link"; zero em-dashes. `node --check`
clean; `shopify theme check` = the same 2 baseline `ImgWidthAndHeight` errors, 0 new offenses.

### A2. Founding-slots counter — state the cap, not the consumption
**DONE 2026-08-06** (uncommitted, not deployed). Steve: drop the x-of-y. He also noted the
"172 of 222" was **Code's invention, not his** — it arrived with the fixture data, which is
consistent with §0's boundary.

- The number **222 is fine and needs no explanation.** Specific numbers read as real
  constraints; round ones read as marketing. Its origin (a french horn serial number) should
  stay private — explaining it converts a firm limit into a whim.
- The problem is **"Only 172 of 222 founding slots remain"**, which asserts 50 people have
  already subscribed. Pre-launch that is untrue, and it is exactly the manufactured urgency the
  brand bans elsewhere (no countdown timers, "honest scarcity only").

**Shipped:** the Roccia founding banner now reads *"Founding Members - the first 222 subscribers
receive 12% instead of 10%. Founding Membership is limited to 222 and does not reopen."* The
scarcity is now a statement about **our policy**, which is true on day one and verifiable, rather
than about **other customers**, which was not.

**Scope check:** the only x-of-y instance in the repo was `templates/index.liquid:122`. The
coming-soon page (`live-theme/templates/index.liquid` and `templates/password.liquid`) already
stated the cap only ("The offer closes at 222") with no consumption claim, so it needed no
change — worth knowing, since that copy **is currently live** on cremaitalia.com.

**Not changed, deliberately:** `ci-catalog.json`'s `founding_member_cap: 222` (a cap, correct as
is) and the FAQ's "the first 222 subscribers at launch" (cap language, not consumption).

### A3. Operations vocabulary sweep
**DONE 2026-08-06.** Rule applied: **say the customer-visible consequence, not the mechanism.**
Every passage kept its honesty; only the vocabulary changed.

Internal supply-chain language leaking onto customer-facing pages. Confirmed instances:

| Page | Offender |
|---|---|
| Selezione | "Supply is pallet-bound", "a hard cap that prevents overselling" |
| Offerta | "reached its Offerta threshold", "prices are set by markup tier, not by a percentage-off blast" |
| Sorpresa / Shop | "Freshness-gated · assembled to order", "components", "Tours are never mixed-size" |
| Bottega | "the rest go through our 3PL" |
| Roccia | "We order freshly roasted beans by the pallet" |

**Representative rewrites:**

| Was | Now |
|---|---|
| "a hard cap that prevents overselling" | "we will not sell you something we cannot ship" |
| "Supply is pallet-bound ... depending on the next pallet" | "may or may not come back, depending on what our roasters send next" |
| "**Freshness-gated availability.** ... all three components ... " | "**Why a Tour sometimes disappears.** ... all three of its coffees ..." |
| "reached their Offerta threshold" | "getting on in age but still well inside its freshness window" |
| "set by markup tier, not by a percentage-off blast" | "set one coffee at a time, not by a blanket percentage off" |
| "the rest go through our 3PL" | "may arrive separately from your coffee" |
| "We order freshly roasted beans by the pallet" | "Fresh coffee arrives from Italy about every six weeks" |
| "new Selezione SKUs 48 hours before the public listing" | "new Selezione coffees 48 hours before anyone else" |

**Four leaks were missed by the first pass** and caught only by sweeping the rendered DOM with
every page force-activated: `Selezione SKUs`, and two card badges living in `ci-catalog.json`
(`"Freshness-gated · assembled to order"` → "Boxed for you when you order"; `"This pallet only"`
→ "This shipment only"). **Lesson:** the first sweep read `document.body.innerText` *after*
re-hiding each page, so hidden text returned empty and the sweep falsely reported clean. Any
future copy sweep on this SPA must activate all `.page` elements and keep them active while
reading.

**Deliberately kept:** "sold as-is" (8 instances) — brand language for the Offerta guarantee,
not ops jargon.

---

## 2. Track B — Voice and structure (buildable now, needs content from Steve)

### B1. "We/I" → "you" rebalance
Home page is 507 words centred on the founder's experience. The customer appears as a recipient
of enthusiasm rather than the subject. The strongest line on the site — "We would rather help
you find your coffee than win an argument" — is the one that faces outward.

**Not** a rewrite of the founder story (which is an asset and stays first-person). This is about
the **commercial** surfaces: shelf cards, Roccia/Sorpresa intros, cart, product pages.

### B2. Consolidate the discount explanation
**DONE 2026-08-06.**

The worst of it was the Roccia page stating "10%" three times in three consecutive blocks. Split
so each block has one job and they no longer overlap:

- **Intro** now says what Roccia *is* (any roast, any roaster, 4/6/8-week cadence, three bag
  sizes) and ends on free shipping. The 10% was removed from here.
- **Callout** now carries the benefit in full and only here: *"Your subscriber benefit is 10% off
  Roccia, Sorpresa, and Selezione - on your subscription shipments, and on anything else you
  order from those three shelves. Offerta and Bottega are priced as-is and are never
  discounted."* This replaces the vaguer "In addition, active Roccia subscribers unlock 10%
  savings ... even one-off purchases."
- **Founding banner** unchanged (distinct fact).

**Deliberately left alone** — each remaining mention now has a distinct job rather than being a
restatement: the home shelf card (one-line teaser), the FAQ (the only place the `MAX` no-stacking
rule is actually explained, which is what an FAQ is for), and the short contextual references on
the product page, cart banner, sign-in modal, and account tile.

Net: five site-wide mentions of "10%", none redundant.

### B3. Team micro-bios — **needs 2 sentences each from Steve**
About gives the founder ~400 words and two photos; Lucia, Asia, Lauren, and Partner 1 get a name
and a job title. Given coffee's buying demographic, and given the team pages already exist as a
built pattern (`openPerson()`), two sentences each is a cheap, high-return fill.

Lucia and Asia already have real bios and headshots — this is Lauren + Partner 1, plus a check
that the four read consistently.

---

## 3. Track C — Working sessions (design together first, no build)

### C1. Landing page + CTA hierarchy
**Steve 2026-08-06: "let's spend more time on the CTA and landing page. No action yet."**

Bring to the session (measured on POC10, 375×812 phone — these are structural, not data-dependent):

| | |
|---|---|
| Home total height | 4,057px — 5 full screens |
| First shoppable concept (shelf cards) | 1,768px — 2.2 screens down |
| The one primary CTA | 3,069px — 3.8 screens down |
| Prices visible on home | 0 |

Questions to settle together:
- Is "story before product" the deliberate posture? (It is defensible for the target demo — but
  it should be chosen, not inherited from how the page grew.)
- The taste quiz is introduced as **"Still unsure?"** — framing the site's best zero-cost
  onboarding asset as a consolation prize for the indecisive. Invert?
- Does the home page need a price or a product visible above the fold, or is that off-brand?

### C2. Entry price rung — business decision, not a build
The designated first purchase (Sorpresa Tour, $77.70 / 3×100g) works out to **~$117/lb**, versus
~$69/lb for a 250g Roccia bag and ~$47/lb at the low end. Discovery is currently the most
expensive coffee per pound on the site, and the primary CTA asks a stranger for $77.70.

**Caveat:** those prices are invented fixtures. The *ratio* is what matters and it comes from the
100g-only-inside-Tours rule (Standard §1), which is real — the same constraint that broke the
referral reward in v1.2 (§12.6). Re-open as a Standard question, not a POC change.

---

## 4. Track D — Parked until roasters are signed + photography exists

Do not action. Listed so they are not lost.

- **D1.** Photography integration — product tiles (currently zero images site-wide; every tile
  is a coloured div with a text label), PDP gallery (built, placeholder slides), roaster
  portraits, About.
- **D2.** Lead-roaster prominence — the Roasters page gives all five equal weight. Once the real
  roster exists, the best-known name is a credibility lever and should probably not be an equal
  tile. Structural decision, data-gated.
- **D3.** Founder-story product anchor — the story resolves to a specific decaf cup; that roaster
  is unsigned. **Dependency worth tracking:** if they never sign, the founder narrative needs a
  different landing.
- **D4.** Trust/social proof — zero reviews, testimonials, press, or third-party validation
  anywhere. Cannot be faked; the *slots* can be designed now if we want them in the POC.
- **D5.** Catalog copy review — tasting notes, roaster bios, cities, dates. All fixture data.

---

## 5. Track E — Housekeeping

- **E1.** Refresh fixture dates so nothing reads as expired (flagship coffee currently shows
  46 days past roast with 14 days left; account shows a subscription that shipped 16 days ago).
  **Steve: "stale dates really don't matter, but if you want to refresh the data, I'll give you
  permission in a later prompt."** — awaiting go, low priority, cosmetic only.
- **E2.** Fusari is the only roaster listed without a city. Fixture data; fix only if E1 runs.
- **E3.** *(Observation, Steve's call, previously locked)* "In bocca al lupo" as the quiz result
  headline is the Italian idiom for luck facing an **ordeal** (exam, audition, surgery; reply
  "crepi il lupo"). Mildly odd after a coffee-preference quiz, and the people most likely to
  notice are the core Italophile demo. Locked per Steve 2026-07-04 — logged, not proposed.

---

## 6. Proposed sequencing

1. **A1** (promo-code) — factual error, live, cheap. Needs only the Option 1/2 call.
2. **A2** (founding counter) — one decision, one string.
3. **A3 + B2** together — same pages, same voice pass, avoids touching strings twice.
4. **C1** — working session on landing/CTA before any further home-page code.
5. **B1** — falls out of C1 naturally; do after, not before.
6. **B3** — whenever Steve has the bios.
7. **E1** — on Steve's go.

---

## 7. Open decisions for Steve

| # | Decision | Status |
|---|---|---|
| 1 | A1: mention the checkout code field, or stay silent? | **RESOLVED 2026-08-06 — pre-empt it.** Built. |
| 2 | A2: drop "172 of 222" for "limited to 222"? | **RESOLVED 2026-08-06 — dropped.** Built. |
| 3 | C2: is a sub-$25 entry SKU worth re-opening Standard §1's 100g rule? | **OPEN** — a Standard change, not a POC change |
| 4 | B3: two sentences each for Lauren and Partner 1 | **OPEN** — needs Steve's words |
| 5 | A1 follow-on: does Store Operating Standards §10 need the pre-empt language too? | **OPEN** — see below |

**New, raised by A1:** §10 currently records *what we do* (issue no codes). The storefront now
also makes a customer-facing *promise about the field itself*. If that promise is to be durable
it probably belongs in the Standard rather than only in theme copy, so a future edit does not
quietly contradict it. Small, but it is exactly the drift class that produced A1 in the first
place. Route through `crema-std-publish` if Steve agrees.
