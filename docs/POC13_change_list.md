# POC13 — change list

**This file is the BUILD RECORD for the POC13 batch** — what changed and why, opened 2026-08-06
directly out of Steve's review of the deployed POC12.

> **It deliberately makes NO claim about what is deployed.** Deployment state lives in exactly one
> place: **`CLAUDE.md` §10 CURRENT STATE**. A stale "not yet deployed" banner in a file like this
> one is what produced a duplicate Shopify theme on 2026-07-24. Check §10, and verify §10 itself
> against `shopify theme list` before acting on it.

Scope boundary from POC11 §0 still applies: roaster names, product names, prices, tasting notes
and photography are **Code-invented fixtures**, not the business. Nothing here critiques them.

---

## 1. Taste ribbon — shorter status line, and the selections stop looking like buttons

**Steve's ask, carried over as the one open question from POC12:** the ribbon stood **262px on a
375px phone**, and the filter selections (`Medium Roast`, etc.) read as a row of buttons.

**What was built** (commit `129d19e`):

1. **Status copy shortened.** "Your taste profile is active - shelves are filtered to your
   preferences." → **"Your taste profile is active - shelves are filtered."**
   (`assets/ci-storefront.js` `renderRibbon()`). The inactive-state string is unchanged.
2. **Selections de-buttoned.** On the ribbon they are a statement of *what is filtering*, not
   something to press, so the filled chip is stripped to plain text: transparent background, no
   padding, one step down in size (`.75rem` → `.72rem`), with the row gap widened `.4rem` →
   `.75rem` to replace the chip padding as the separator. Weight 600 + `.06em` tracking are kept
   so they stay legible beside the status line.

   **Scoped to `.tr-tags .profile-tag`, deliberately.** The same `.profile-tag` class renders the
   account page's taste card, where the filled chip is still right. Verified unchanged there
   (espresso fill, 12px, padded).

### Measured — signed-out worst case, all three tags showing

| Viewport | Before | After | Where the saving comes from |
|---|---|---|---|
| 375px | 262 | **224** | all 38px from the chips |
| 430px | 231 | **184** | 40px copy, 7px chips |
| 1440px | 79 | **52** | both |

**The copy shortening does nothing at 375px, and that is worth recording.** Both the long and
short strings wrap to exactly two lines in the 287px column a 375px viewport gives `.tr-status`
(42px = 2 × 21.08px line-height, measured on both). Probing line counts across column widths
200–600px, the shortening drops a line only in the **320–420px** band (and again below ~230px).
So it pays on larger phones and small tablets, not on the 375px phone that prompted it. Kept
regardless — it is a genuine saving where it lands, and shorter is better copy.

### It moved the wrap/nowrap crossover — 860 → 790

The CSS comment on `.taste-ribbon-inner` (written in POC12) says in as many words: *"Re-measure
this number if the status copy or the control set changes."* The status copy changed, so it was
re-measured at **both** settings across seven widths:

| Viewport | wrapped | nowrap |
|---|---|---|
| 1440 | 52 | 52 |
| 870 | 100 | **72** |
| 830 | 100 | **72** |
| 800 | 100 | **90** |
| 790 | 100 | **90** |
| 780 | 100 | 112 |
| 760 | 100 | 112 |

Crossover now sits between **780 and 790** (POC12 measured it between 830 and 870 with the longer
copy). Both `@media(min-width:860px)` rules — on `.taste-ribbon-inner` and `.tr-actions` — moved
to **790px**, recovering 10px across the 790–859 band. The comment carries the new table and notes
*why* the number moved, so the next person does not read it as an arbitrary edit.

### Verification

Driven live in `shopify theme dev` at 375 / 430 / 760 / 780 / 790 / 800 / 830 / 870 / 1440:
both ribbon states (active and not active), signed in and signed out, account-card chips
unchanged, no horizontal overflow, no overlap in the phone stack. `node --check` clean.
`shopify theme check` at the documented baseline — **17 offenses / 2 errors / 0 new**.

The browser screenshot tool was wedged again (as in POC6/7/9/12), so verification was DOM
geometry throughout.

### Open, not built

- On a phone the remaining bulk is the **signed-out action stack**: "Save to my account",
  "Edit profile" and the toggle wrap to two rows, 96px of the 224. That is the POC12
  three-control layout, not part of this ask. Flagged to Steve, not touched.
- The `.tr-dot` sits on its own row above the status on phones (status is a full-width flex
  item, so it wraps below the dot). Pre-existing, unaffected by this change.

---

## Housekeeping done alongside (not POC content)

Split out here because it changed no storefront behaviour.

- **`dev.cmd` was broken and nobody noticed** (commit `8190210`). It pinned
  `--theme 151277174953` (POC4 Preview), deleted 2026-08-06. Rewritten with **no theme id at
  all** — plain `shopify theme dev` reuses the throwaway Development theme. An id-free launcher
  cannot go stale.
- **The same deletion had broken two more things.** The `reconnect-check` skill listed POC4
  Preview among the themes it expects *and* told the agent to flag any difference as "a real
  change, not a connectivity artifact" — a guaranteed false alarm on every reconnect since
  2026-08-06. The ⚠️ storefront-password callout atop `CLAUDE.md` named POC4's preview link as
  the thing the password protects. Both now defer to §10.
- **`dev.cmd.example` added** (commit `7e2370e`), tracked, so a fresh clone has a launcher —
  `dev.cmd` itself is gitignored. Both now `cd /d "%~dp0"` instead of a hardcoded path.
- **POC previews now prune to the three newest** (commit `b22fc11`), as `crema-poc-deploy`
  Step 5. Ordering matters: after the push is proven, before the stale-id sweep — pruning is
  what *creates* the stale ids that sweep catches. Selection requires name
  `^Crema Italia POC(\d+) Preview$` **and** role `unpublished`, so the live theme, `Horizon`,
  the Development theme and any hand-named backup are protected by construction. Duplicate
  names halt the prune; deletes need Steve's explicit go. Nothing pruned yet — POC10/11/12 are
  exactly at the cap.

---

## 2. (next item)

Awaiting Steve's next review finding.
