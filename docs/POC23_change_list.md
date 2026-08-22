# POC23 — contrast tokens, a sanctioned Bottega accent, and two accessibility fixes

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is the only authoritative
statement of what is deployed. This file is the build record.

Grew out of Steve challenging a standing scorecard item: *"semantic markup where it claims that
elements announce poorly, and we have not run an end-to-end screen-reader."* Testing it rather than
repeating it split the claim in half — **the semantic-markup half was largely false; the contrast
half was true and had never been measured.**

---

## 0 · The claim that was false

*"76 `div onclick` elements are reachable but announce poorly."*

Measured: **83 of 83 carry `role="button"` and `tabindex`**, and 82 of 83 have an accessible name.
POC14's `markKeyboardActivable` stamps every one, so a screen reader announces them as buttons with
their text as the name. The finding predates POC14 and was **inherited four passes running without
being re-tested** — the same failure as the shelf-IA finding withdrawn the same day.

One of my own flags in this audit was also a false positive: I reported the logo as unnamed, then
found `alt="Crema Italia"`. My check never looked at `alt`.

---

## 1 · The subscription checkbox had no accessible name

`#pd-sub` had **zero `<label>` elements, no `aria-label`, no accessible name at all** — the only
unnamed control on the page, and the one where it matters most, because POC22 had just placed a
legally-required automatic-renewal disclosure beside it. A screen reader said *"checkbox, not
checked"* and nothing more.

Fixed with `aria-labelledby` (names it from the heading) and **`aria-describedby` pointing at the
renewal paragraph**, so the disclosure is announced *with* the control rather than sitting near it.
That is better than sighted parity. Verified: name *"Make this a Roccia subscription"*, description
the full renewal terms, **zero unnamed controls remaining**.

---

## 2 · Contrast: 127 failing instances to zero

Never audited before. Method: alpha-composited ancestor backgrounds, gradient-backed elements
excluded as uncomputable from colour alone, POC photo placeholders excluded.

**Before: 17 distinct failing combinations across 127 rendered instances** on 13 pages.
**After: 0, across 16 pages plus product detail plus two modals.**

Two colours accounted for all of it, and **Brand Standards v2.0 had already predicted one of them**:
it records that Crema Gold is 3.1:1 on cream and therefore *"large-display/accent only"* — and the
site then used it for 12px eyebrows and inline links anyway.

### Darkened siblings, not replacements

| Token | Value | On cream | Replaces, for small text only |
|---|---|---|---|
| `--ci-crema-text` | `#94693A` | **4.56** | `--ci-crema` `#B88348` (3.10) |
| `--ci-mute-text` | `#7D705E` | **4.55** | `--ci-mute` `#8C7E6A` (3.73) |
| `--ci-crema-fill` | `#96683A` | **4.56** with cream text on it | gold as a button/badge fill |
| `--ci-mute-fill` | `#7D705E` | **4.55** with cream text on it | mute as a badge fill |

`--ci-crema` and `--ci-mute` are **unchanged** and remain correct for headings, rules and decoration,
where the requirement is 3:1 and they already pass. The swap was applied by regex to `color:` only,
with a negative lookbehind protecting `border-color:` and `background-color:` — 61 text declarations
moved, and 12 `border-color` plus 8 `background` uses of `--ci-crema` were preserved untouched.

Also: `--ci-crema-light` `#E8A86A` → `#E9AB6E`. It is only ever used on dark grounds and was **0.05
short** of AA on the lightest of them (`.cn`, `#61412B`): 4.45 → 4.57. Nudged rather than adding a
fifth token for a two-point move.

### The trap, which this batch fell into and then climbed out of

**A darker token raises contrast on cream and LOWERS it on brown.** The first pass darkened
`.inline-link` globally and drove *"See the map"* on the Espresso hero from **3.40 to 2.31** — a
regression caused by the fix, and caught only because the audit was re-run rather than assumed. On
dark grounds the correction runs the other way, so `.dark-hero` and `.taste-ribbon` links now take
`--ci-crema-light`. This is commented in the CSS.

### One deliberate exemption

The **empty rating star** stays at the hairline value, below AA, on purpose. POC17 chose it so an
unrated product reads as a **null rather than a zero-out-of-five verdict**; darkening it would make
an unrated coffee look badly reviewed, which is the opposite of accessible. It is now genuinely
decorative: `.rm-stars` is `aria-hidden`, and the mark carries `role="group"` with
`aria-label="Rated 4.2 out of 5 from 38 ratings"` (or *"Not yet rated"*).

**A comment nearly shipped a false claim here.** The exemption note said the glyphs "are
aria-hidden". They were not. Checking rather than asserting turned a false comment into a real fix.

---

## 3 · Bottega's accent, sanctioned rather than drifting

Steve approved keeping Bottega's cool slate scheme as *"the shop apart"*, so it becomes a decision
rather than drift. **The colours were fine; the way they were stored was not.**

The hero carried an **inline `style="background:linear-gradient(...)"`** on `templates/index.liquid`
— which is precisely how a colour outside the palette went unnoticed, because an inline style
bypasses the token system and never appears in a stylesheet audit. The shelf badge hardcoded
`#2a2a3a` separately, and the placeholder tile hardcoded the gradient a third time: **one idea, three
homes, no token.**

Now four tokens (`--ci-bottega-dark/-mid/-badge/-tint`), a real `.bottega-hero` class, and **zero
hardcoded navy anywhere outside the token line.** Brand Standards amended so §6's "never introduce
new colours" no longer reads as forbidding something Steve chose.

---

## Verification

- `node --check` clean; `shopify theme check` **15 offenses / 0 errors / 0 new** (documented baseline).
- Contrast re-audited after every change: **127 → 44 → 8 → 0**.
- Regression checks all pass: 83 keyboard-activable elements intact, `#pd-sub` named, rating group
  labelled, stars hidden.
- **Looked at**, not only measured, at 375 and 1280.
- One false alarm worth recording: a screenshot made the home hero look broken. `.hero` proved
  **byte-identical to git HEAD** — the dark hero is the design, and the apparent breakage was a
  capture artifact. Checked before reporting.
