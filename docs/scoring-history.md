# Storefront scoring history

**The version-controlled record of every audit pass.** Five passes, one rubric, ten dimensions, equal
weights, unchanged throughout — which is the entire reason the numbers are comparable.

**Why this file exists.** The first four passes were published only as artifacts on claude.ai. They
were not in the repo, not backed up to GitHub, and not diffable — a scoring history living on a web
service. This file is the durable record. The artifacts remain the *rendered* versions and are linked
per pass; nothing here depends on them being reachable.

> **The rubric itself, as a reusable prompt, lives in `docs/POC20_rescore.md`** — including the six
> measurement traps this project has actually hit. Do not re-derive it; paste it.

---

## The table

| Dimension | P13 | P15 | P16 | P17 | P20 |
|---|---|---|---|---|---|
| Brand identity & visual craft | 8.5 | 9.0 | 9.0 | 9.0 | 9.0 |
| Copy & editorial voice | 7.5 | 8.5 | 9.0 | 9.0 | **9.5** |
| Product detail quality | 8.0 | 8.5 | 8.5 | 9.0 | 9.0 |
| Value proposition clarity | 4.0 | 6.5 | 8.0 | 8.0 | 8.0 |
| Mobile experience | 7.0 | 7.0 | 8.0 | 8.0 | 8.0 |
| Technical SEO & performance | 4.0 | 7.0 | 7.5 | 8.0 | 8.0 |
| Accessibility | 2.0 | 7.0 | 7.5 | 7.5 | 7.5 |
| Conversion mechanics | 3.5 | 5.5 | 6.5 | 7.0 | 7.0 |
| Navigation & information architecture | 6.0 | 6.0 | 6.5 | 6.5 | 6.5 |
| Trust & social proof | 3.5 | 3.5 | 3.5 | **6.5** | 6.5 |
| **Overall** | **5.4** | **6.9** | **7.4** | **7.9** | **7.9** |

**Stated ceiling: 8.5.** Roughly 0.6 remains, and all of it now needs a photographer, a lawyer, a
design decision, or a customer.

**Scored on the mechanism, not the proof** (Steve's standing direction): whether the mechanism is
right and shipped, rather than what a visitor can see today. The store is pre-launch, the catalogue is
fixture data and the photography is temporary, so the mechanism is what can actually be built.

---

## Pass 1 — POC13 audit · 5.4 · 18 Aug 2026

Theme `151800610985`. Artifact: `claude.ai/code/artifact/630bffc2-d816-4fc2-a32b-d89a6aec61aa`

**Verdict.** As brand and editorial craft, an 8. As a machine for selling coffee to a stranger, a 5.4
— and the gap between those two numbers was the whole review. **The central finding: the site asks
why the consumer is there and never answers.** The hero posed a question and replied with a greeting;
the sentence that *is* the business — *"We do not roast, grind, blend, or alter the roasters'
packaging"* — was the 214th word on the page.

**Findings F1–F10:**

| | Severity | Finding |
|---|---|---|
| F1 | Critical | The hero CTA cannot be completed with a keyboard — 0 of 13 product cards and 0 quiz options reachable; 75 of 152 interactive elements non-semantic |
| F2 | Critical | No email capture anywhere — the coming-soon page it replaces has one |
| F3 | Critical | No Open Graph or Twitter tags; every share renders as a bare grey link |
| F4 | High | Brand voice drift — the copy used the Standard's own named anti-pattern |
| F5 | High | No US customary weights anywhere, against a 12 oz US default bag |
| F6 | High | The founder story is the only trust asset on the entire site |
| F7 | High | Nothing warns the buyer they need a grinder |
| F8 | Medium | Gifting named as a use case with no supporting functionality |
| F9 | Medium | No structured data, oversized images, 722 KB orphaned file |
| F10 | Medium | The meta description lowercased a proper noun |

Also argued: **the four shelves are commercial programmes wearing the costume of one navigation
axis** — a category system partitions on a single axis, and Roccia (purchase mode), Sorpresa (format),
Selezione (scarcity) and Offerta (price state) partition on four. *"A shelf you can stand on two of at
once is not a shelf."*

> **WITHDRAWN 2026-08-22, and it should never have been carried this far.** Tested against the
> catalogue for the first time on Steve's challenge: `shelf` is never a list, and subscription maps
> exactly onto Roccia (9 of 9, 0 elsewhere) — **nothing stands on two shelves**, so the quoted line is
> simply false. The error was applying taxonomy rules to merchandising; the shelf metaphor is what
> licenses mixed axes, every wine shop stocks *New Arrivals / Under $20 / Natural / Large Format*, and
> the four here do share an axis the critique missed: **what are you here for.** The site also already
> carries a single-axis taxonomy in the Shop facets, so it has shelves for intent *and* facets for
> attributes. The grain of truth (Offerta is a lifecycle stage; Sorpresa is a bundle) landed in the
> **data model** — §13.9.2 and the BOM design — and both are tracked. **It survived five passes because
> it was inherited rather than re-derived**, the fourth logged instance of that failure in this repo.

---

## Pass 2 — POC15 re-score · 6.9 · 18 Aug 2026

Theme `151970840745`. Artifact: `claude.ai/code/artifact/caca5141-68ba-4006-9b59-a5f4a3f49ecf`

**Verdict.** Two batches closed **six of ten findings and all three criticals**. The gain landed
exactly where the first pass predicted — unglamorous, cheap, mostly invisible: keyboard access, meta
tags, structured data, an email field, image weight.

**Ledger:** F1, F2, F3 closed in POC14; F4, F5, F7 closed in POC15; F9 **partial**; F6, F8, F10 open.

F9 stayed partial deliberately: `Organization` and `WebSite` ship and validate, but `Product` and
`aggregateRating` are correctly *not* emitted — a one-URL SPA has no per-product address, so the
markup would name URLs that 404. Right call, no rich result, no full credit.

**Two corrections this pass made to its own record**, both worth keeping as pattern:

- **The baseline was 5.4, not 5.7**, as it had been recalled in conversation. The gain was +1.5.
- **Image weight was 797 KB → 517 KB (−35%)**, not the 1,257 → 361 reported mid-session. That earlier
  figure compared uncompressed files on disk against a local dev server with fewer lazy images in
  range. Still a substantial win, and a third smaller than claimed.

**New findings:** N1 five unlabelled sign-in inputs · N2 the hero headline broke to three lines with a
two-word orphan at 375 · N3 the temporary product shot sits under the "we alter nothing" paragraph
with a Lavazza bag as its most legible object.

---

## Pass 3 — POC16 re-score · 7.4 · 19 Aug 2026

Artifact: `claude.ai/code/artifact/85a32987-ce20-472c-96ba-fcefcad0608f`

**What moved:** value proposition clarity 6.5 → 8.0, mobile 7.0 → 8.0, copy 8.5 → 9.0, conversion 5.5
→ 6.5, accessibility 7.0 → 7.5, SEO 7.0 → 7.5, navigation 6.0 → 6.5.

POC16 closed **N1** (five inputs given `for`/`id`, 0 of 13 unlabelled), **N2** (hero H1 set to fluid
sizing, two lines at every phone width — the earlier fix had been verified on desktop only), and the
half of the first audit's central finding that POC14 left open: **Shop and cart now sit above the fold
on mobile**, where 153px of measured empty space had sat between logo and hamburger while both
controls were two taps deep.

Build record: `docs/POC16_change_list.md`.

---

## Pass 4 — POC17 re-score · 7.9 · 20 Aug 2026

Theme `152003018921`. Artifact: `claude.ai/code/artifact/cb9f7eb6-e57d-4e05-95b3-7a80032d3fe3`

**Trust & social proof 3.5 → 6.5** — the largest single-dimension move in the project, on a dimension
that had scored 3.5 three passes running. Product detail 8.5 → 9.0, SEO 7.5 → 8.0, conversion 6.5 →
7.0.

**Why 6.5 and not 8, and neither reason is about reviews:** the **legal pages still do not exist**
(the largest remaining hole on the board, and not a social-proof problem at all), and the
**individual-review data path is unproven** — the aggregate metafields are measured and work, but
`reviews.product_reviews` returned nil on a Partners dev store, probably because Judge.me syndicates
review records through the Shop channel.

**New findings:** N4 the rating count link is a 65 × 24 tap target against this project's own 44px
standard · N5 `#pd-sub` has no accessible name — **not a regression**, but invisible to three earlier
passes that measured inputs without opening a product.

This pass carried an explicit **bias caveat**: it scored work built hours earlier in the same session,
so the dimension was held at 6.5 on grounds inconvenient to that work.

---

## Pass 5 — POC20 re-score · 7.9 · 22 Aug 2026

Theme `152028446889`. Full report: **`docs/POC20_rescore.md`**.
Artifact: `claude.ai/code/artifact/958fda18-5b12-4aaf-b4a5-87fdf2006285`

**The score did not move, and that is the finding.** POC18–20 were correctness work — a wrong number
removed from two homes, a display replaced because it could lie, badly authored fixture data corrected.
The rubric measures what a visitor experiences; integrity fixes are invisible to it by design.

Only **copy & editorial voice 9.0 → 9.5**: all 13 fixture coffees had been telling the customer to
grind fresh twice.

**N4 and N5 both still open** — carried forward, neither fixed, neither a regression. **New: N6**, the
freshness callout is a green fill against a palette that scopes green to thin rules — pre-existing
since POC3, and arguably a gap in the rule rather than the design.

> **POC21 shipped after this pass** (hero rewrite, theme `152029167785`). Steve's call was to hold the
> score until real photography. The dimension most likely to move is **value proposition clarity**,
> and one dependency must settle first: the new hero names **Feeding Tampa Bay**, and Steve has written
> to confirm they can accept the donation.

---

## Pass 6 — POC24 re-score · 8.3 · 22 Aug 2026

Theme `152030183593`. Full report: **`docs/POC24_rescore.md`**.

**Verdict.** 7.9 -> **8.3**, the first movement in two passes. Five dimensions moved; the largest
single gain is **Trust & social proof 6.5 -> 7.5**, and it is **not code** — Steve published four
legal policies, closing the rung the very first audit called the largest trust item on the board.
Accessibility, Value proposition, Mobile and Conversion each moved +0.5, and Navigation +0.5 for the
footer policy links and one duplication removed.

**Bias declared:** POC21 through POC24 were built in the same session as this pass, so contested
dimensions were held down. **Accessibility is capped at 8.0 despite a clean measured surface** —
0 contrast failures across 16 pages, 0 tap targets below the standard, 76 of 76 controls keyboard
activable, 0 unnamed form controls — because **one Level A criterion is unmet**: there is no skip
link (WCAG 2.4.1). A dimension failing Level A cannot honestly score in the nines.

**Two carried findings were WITHDRAWN** after being tested for the first time. The shelf/IA claim is
empirically false (`shelf` is never a list; subscription maps exactly onto Roccia, 9 of 9). The
"76 div onclick announce poorly" claim predates the POC14 batch that fixed it — 76 of 76 carry
`role` and `tabindex`.

**The durable lesson, now the most reliable finding in the series: the claims that survived untouched
across passes were the ones nobody had ever measured.** Three further measurement artifacts were
caught and discarded during this pass alone, including a screenshot that appeared to show mobile
overflow and did not.


---

## Open findings across all passes

| | From | Status |
|---|---|---|
| F6 | P13 | Open — the founder story is still the main trust asset; partly addressed by the POC17 rating mechanism, fully blocked on real customers |
| F8 | P13 | Closed in POC16 — gifting shipped as an order-level cart option |
| F9 | P13 | **Partial** — `Product`/`aggregateRating` deliberately absent until per-product URLs exist |
| F10 | P13 | Closed in POC16 — the meta description moved out of the Shopify admin into the theme |
| N3 | P15 | Open — the temporary product shot; tracked in `docs/photography-todo.md` |
| N4 | P17 | **Open** — 65 × 24 tap target against a 44px standard |
| N5 | P17 | **Open** — `#pd-sub` has no accessible name |
| N6 | P20 | **Open** — green used as a fill and as body colour |

**And the one that predates all of them:** the **legal pages** — privacy, terms, refund, shipping —
have been launch-gating since July and are named in every pass since. The cheapest item on the board
and the only one nobody had started.

---

## What is left between 7.9 and 8.5

- **Real photography** — gates brand identity and product detail above 9
- **The legal pages** — the largest single trust item
- **The IA question** — five passes, unresolved; a design debate rather than a fix
- **Semantic markup and a formal accessibility pass** — 76 `div onclick` elements reachable but
  announcing poorly; no contrast or screen-reader pass run end to end
- **Real reviews** — not a build task; the mechanism waits on customers

*Nothing cheap and contained remains.*
