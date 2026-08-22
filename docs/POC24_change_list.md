# POC24 — tap targets, and a correction to what I told Steve

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is the only authoritative
statement of what is deployed.

Steve asked me to check two carried scorecard findings he did not understand: *"the star rating size
not meeting a standard, and the subscription checkbox not being meta-tagged."*

**I had told him both were closed. Only one was.** POC23 fixed the accessible name; I never touched
the tap target and said otherwise. He caught it by asking.

---

## What the two findings actually meant

**"Meta-tagged"** = the checkbox is an `<input>` with no visible text of its own, so a screen reader
had nothing to announce. `aria-labelledby` and `aria-describedby` point it at the heading and at the
renewal disclosure. **Fixed in POC23, verified again here.**

**"Size not meeting a standard"** = **WCAG 2.2 AA SC 2.5.8** requires a clickable target be at least
**24x24 CSS px**. The rating-count link was **65x24** — scraping past on height with nothing spare,
and failing this project's own **44px** convention set in POC7. **Not fixed until now.**

---

## Measuring it properly took three attempts, and two intermediate answers were wrong

**Attempt 1 measured the `<input>`, not the target.** It reported the contact radios as **13x13** and
called them "the worst on the site." They are wrapped in a `<label>`, so the real clickable region is
**326x20** — the label text is part of the target. Measuring the input alone overstated the problem
by an order of magnitude, and a fix built on that reading would have solved nothing that was broken.

**Attempt 2 mis-classified an inline link.** WCAG 2.2 exempts a target **inside a sentence**, because
its size is set by the surrounding text. My heuristic only recognised `P`/`LI`/`SPAN` parents, so
*"three-question quiz"* — which sits mid-sentence in a `div.callout` — was reported as a failure. It
is exempt and was correctly left alone.

**Attempt 3** computed the effective target as the union of the control and its `<label>`s, and
classified inline exceptions by reading the surrounding sentence. That is the number below.

---

## What was actually fixed

| Control | Before | After | Where |
|---|---|---|---|
| `#pd-sub` subscription checkbox | **18x18**, zero labels | **44x44** hit area, 292x44 effective | product |
| `.cf-radio` contact radios | 326x**20** | 326x**44** | contact |
| `.back-btn` (x8 site-wide) | 49x**17** | 49x**45** | most pages |
| `.region-learn` | 147x**15** | 147x**45** | shop |

**Remaining below AA across 13 pages plus product detail: zero.**

### The checkbox got two labels, deliberately, and the disclosure got none

The input now sits inside a `<label class="sub-toggle-hit">` whose **padding plus an equal negative
margin** buys a 44x44 target at **zero layout cost** — the POC13 ribbon trick. The heading is a
second `<label for="pd-sub">`, so clicking the title toggles the box the way people expect.

**The renewal paragraph is deliberately NOT inside a label.** Wrapping the whole block would have
made the largest target on the page, and would also mean that reading or selecting the legal
disclosure toggles a purchase option. A disclosure should be readable without being a switch.

### Zero layout cost, proven rather than asserted

The padding/negative-margin pairs were verified by toggling each rule back to its pre-POC24 values in
the live page and comparing positions: **the visible text and the following content sit at exactly
the same pixel**, 0 movement on both. The contact radios were checked the same way — they were
**already stacked** one per line at both widths, so the min-height made each taller and changed no
layout.

---

## Verification

- `node --check` clean; `shopify theme check` at the documented baseline, 0 new.
- Effective-target sweep: 13 pages + product detail, **0 controls below 24x24** after inline
  exemptions.
- POC23 regression checks intact: accessible name, accessible description, checkbox alignment
  (2px delta, unchanged).
- No horizontal overflow at 375 or 1280; **looked at**, not only measured.
