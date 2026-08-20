# POC18 change list — Review A, and what it corrected in itself

**Build record only.** For what is deployed, read `CLAUDE.md` §10 CURRENT STATE and verify it live
(`shopify theme list`) before acting. Nothing here states deployment state, by design.

Commits `81f00c4`, `27e8ebd`, `986b0ce`. Review A closed 2026-08-20.

---

## What Review A was, and what it was not

**Remit:** duplicate render paths, diverged shared components, dead code, state coherence. Triggered
by the POC17 bug where a `productDetail()` shelf branch meant an edit reached only the coffee path
and the rating mark was silently absent on every Bottega item — *the diff looked correct; the DOM did
not.*

**Method: run checks, not read code.** A skim would have missed that bug too. Every finding below came
from enumerating call sites, extracting class tokens, or asserting on rendered output.

**Scope correction (Steve, 2026-08-20).** Three findings turned out not to be architecture at all.
A6 is *content*; N4 and N5 are *UI and accessibility*. They got in because the method defined the
scope rather than the remit filtering the checks — a "repeated sentences" check was easy to script,
so it ran, and its output was then treated as an architecture finding because it came from the same
analysis. Backwards. They are re-filed below rather than fixed here.

## Fixed

### A2 + A3 — one home per commercial value (`81f00c4`)

`_meta.founding_member_cap` (222), `_meta.freshness_window_days` (60) and `_meta.currency` sat in the
catalogue and were **never read**, while 222 was hardcoded twice and the window seven times. Worse
than not having the data: the catalogue looked authoritative, so changing `_meta` would move nothing.

And **"60 days" meant two unrelated rules** — the freshness window (Standard §5, 4 places) and the
benefit grace period (Standard §4, 3 places). Coincidental shared value, so the obvious edit — find
and replace — silently corrupts whichever rule you were not thinking about.

Fixed with theme settings, which is what build spec §11 already prescribes for values with no natural
Shopify object behind them. Liquid reads `settings.*`; `layout/theme.liquid` publishes the JS-side
ones as `window.CI_RULES`. The unread `_meta` keys are gone, so each value has exactly one home.

Also answers Steve's requirement that system settings change without a rebuild: values live in
`config/settings_data.json`, editable in the theme editor with no deploy. His willingness to accept
stale browser reads turned out to be unnecessary — these render server-side, so there is no cached
JSON to go stale.

*Verified by the only condition that matters: nothing rendered changed. Independence then proved
directly by setting `benefit_grace_days` to 45 — `CI_RULES` published 45 while freshness held at 60 —
then reverted.*

### A1 — ask "is this coffee", not "is this not-Bottega" (`27e8ebd`)

The roaster page filtered by roaster with **no taxonomy test**. Bottega stayed out only because no
Bottega item happened to carry a `roaster`, and the code comment said so: *"naturally excluded."*

**Steve's redirect made this a better change than the one proposed.** I had suggested adding a shelf
condition; he asked why we were testing the roaster field at all, given we never filter Bottega by
roaster and a roaster-branded tote is simply its own SKU. The predicate was *wrong*, not merely
missing. `isCoffee(p)` now states the question once, which also fixed two latent instances of the
same bug — the Shop grid and `reorderEligible` were both on the proxy, and both would break silently
the moment a second non-coffee shelf existed.

**Derived, not stored.** Steve floated a coffee/not-coffee flag on the SKU; right instinct, but
storing it gives one fact two homes that can disagree, which is what A3 just removed. PROD home is
Shopify's native `product.type`. Recorded as `production_build_spec.md` §12.

**One trap avoided.** The first-order discount exclusion also read `!== 'bottega'`, but that is
Standard §3 *"Bottega is never discounted"* — a commercial rule sharing a predicate with a taxonomy
question **by coincidence**, exactly like the two 60s. Collapsing them would have looked like tidying
while welding a discount rule to a taxonomy rule. It has its own named predicate.

Four now-permanently-unreachable `bottega` branches deleted from the shared cell helpers.

*Proved end to end: gave `bottega-tote` a roaster, reloaded, and the roaster page held at 4 bags with
no leak. Then reverted. Full regression after — all six grid counts identical, Bottega card footer
still `$34.00 Equipment`, which is itself the proof the deleted branches were unreachable.*

### A5 — dead CSS (`986b0ce`), and a correction to A5 itself

15 rules across 9 classes. CSS 927 → 912 lines.

**The review's own count was wrong in both directions**, and that matters more than the deletions.
Two false positives: `.flag-bottom` is used, and `.fonts` was never a class — it came from
`document.fonts.check` inside a comment. Three false negatives, the worse error: the
`.profile-banner` block is four rules and only `.profile-banner-inner` was flagged, because
`ci-profile-banner.liquid` mentions its own filename in a comment and a substring match read that as
usage. The ribbon was rebuilt in POC6 around `.taste-ribbon`/`.tr-*`; the block has been dead since.

Same shape as the other method traps logged this session. Everything deleted was re-verified by
extracting real class tokens first.

## Clean bills

`0` orphaned JS functions · `0` dead `window` handlers · all 8 snippets rendered · state model
coherent, no orphan variables, no write-without-read.

## Re-filed, not fixed

| | Item | Belongs with |
|---|---|---|
| **A6** | The Offerta guarantee sentence is byte-identical in two places (shelf page and Promise page), wrapped in different and correct framing. The **policy sentence** is the duplication, not the framing. Proposed fix: extract to a snippet, keep both framings. **Not a theme setting** — settings are for numbers that must change without a deploy; this is copy, which belongs in the repo where the voice and em-dash rules apply. | The legal/policy drafting work |
| **N4** | The rating count link is a 24px tap target at 375px, against the 44px standard this project set in POC7. Fix is the POC13 ribbon pattern: pad the hit area, cancel the layout cost with an equal negative margin. | UI defect list |
| **N5** | `#pd-sub` has no accessible name. Pre-existing, not a POC17 regression — it only exists once a product detail is rendered, so earlier passes measuring inputs with no product open recorded a clean `0 of 14`. | UI defect list |
| **A4** | Commercial rules hardcoded across the storefront: 12% × 16, 10% × 10, 5% × 5, cadences × 7. Verified correct today, but *by care rather than construction*. | Review B — the answer is "derive from selling plans and metafields", which do not exist yet |

**Also corrected during Review A:** the promise list appears on both the home page and the Promise
page, and that is **correct** — item 2 already differs deliberately, the home version linking to the
Promise page and the Promise version not, because you are already there. An earlier instruction to
"delete the verbatim twins" rested on a mischaracterisation and would have removed something that
belongs. It was written up rather than executed.

## Open after Review A

- **Review B** — is the POC a good specification for production. Not a new artifact:
  `production_build_spec.md` already is that document, but it grew reactively, section by section as
  decisions forced them, and nobody has walked the POC systematically against it.
- **The seam audit.** 26 `PROD:`/`LOOP:` markers, never checked for *completeness*. An unmarked mock
  is invisible at production time because it simply looks like working code.
- **Three structural questions** deferred to B as its proper remit: a single 1,658-line IIFE holding
  the whole storefront with 64 `window.*` handlers as its public surface; `innerHTML` string rendering
  as the universal pattern; and the SPA shape itself, which §0 already flags as not carrying over.
