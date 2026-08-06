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

### Open, not built — BOTH RESOLVED, see item 3

Left open at the time of writing, then closed the same day. Recorded rather than deleted so
the sequence stays legible:

- ~~On a phone the remaining bulk is the **signed-out action stack**: "Save to my account",
  "Edit profile" and the toggle wrap to two rows, 96px of the 224.~~ Steve came back on it;
  fixed in item 3 by removing a control rather than shrinking one.
- ~~The `.tr-dot` sits on its own row above the status on phones.~~ Fixed in item 3.

---

## 2. Account dropdown — a 5.6px gap, and a whole mobile treatment silently discarded

Steve, on Windows: *"Unless you hard click the signed in name again, it is hard to get into
the dropdown menu. You have to move at a perfect speed otherwise it closes."* Then: *"I have
no idea what happens on a touch device."* Both instincts were right, and the touch one was
worse. Commit `19548c0`.

**Desktop.** The menu opens on `.account-wrap:hover`, and `:hover` covers the wrap plus its
descendants — but **not the margin between them**. `.account-menu` carried
`margin-top:.35rem`, leaving a **5.6px strip** in which the element under the cursor is
`.header-inner`, outside the wrap. Probing `elementFromPoint` every 1px down the travel path
showed exactly where it broke:

| Probe point | Element under cursor | Inside `.account-wrap`? |
|---|---|---|
| Inside trigger | `BUTTON.sign-in-btn` | yes |
| **Gap midpoint** | **`DIV.header-inner`** | **no** |
| Inside menu | `DIV.account-menu` | yes |

So any `mousemove` sampled inside the strip dropped the hover and closed the menu; crossing
fast enough that no sample landed there was the only way in. That is precisely the "perfect
speed" symptom, and it is a mechanism, not a feel.

**`.shop-menu` never had it** — it sits flush (`top:100%`, no margin). That asymmetry is the
tell, and it recurs below: the account dropdown was added later than Shop and never got the
same treatment.

Fixed with a transparent `::before` bridging the gap. Hover chain contiguous, visual gap
unchanged. Probed along three x positions from trigger to menu: **0 breaks, was 30.**

The force-close/re-arm logic (POC6) was checked first and is **not** implicated — it re-arms
on the first outside `pointermove`.

**Touch — the worse half.** The mobile overrides for `.account-wrap`/`.account-menu` were
being discarded **wholesale**. The account dropdown's base rules sit near the END of the
stylesheet, AFTER the mobile header block, and media queries add no specificity, so at equal
specificity the later desktop rules won. Measured at 375px with the panel open and signed in:

| Property | Mobile intends | Actually computed |
|---|---|---|
| `.account-wrap` position | `static` | `relative` |
| `.account-menu` position | `static` | `absolute` |
| `min-width` | `0` | `170px` |
| `margin-top` | `0` | `5.6px` |
| border / shadow | none | desktop border + shadow |

Net effect: the submenu rendered as a **170px absolutely-positioned box hanging ~155px below
the open panel**, wearing its full desktop chrome. `.shop-menu` was fine because its base
rules sit *above* the block.

Fixed by scoping the two rules to `.ci-header` (0,0,2,0), so source order stops mattering —
with a comment saying not to "simplify" them back. Now full-width, inline, inside the panel's
scroll flow, 48px rows; confirmed the panel scrolls to reveal it.

## 3. Ribbon to one row — Steve's structural fix beat the one I was measuring

**The good bit is the reasoning, not the CSS.** Asked to shorten the signed-out stack, I
measured every label that could fit and reported that only "Save" (30.3px) or "Save it"
(41.4px) actually did — true, and the wrong problem. Steve: *"bury the edit profile into
'Your taste profile is active' by hyperlinking profile into the edit. Then you only have the
one button on the right."* **Removing a control beats compressing one.** Commits `19548c0`,
`13c4315`.

Two structural changes:

1. **The dot stopped taking a whole row.** `.tr-status` is a full-width flex item, so it
   wrapped *below* the dot, costing 9px + 9.6px gap. The dot now hangs in a padding gutter,
   optically centred on the first line (centre 22.8 vs line centre 22.7). Plus gap trimming.
   Scoped to `max-width:789px`, matching where the ribbon wraps.
2. **"Edit profile" moved into the sentence** as a link on the word *profile*, so
   `.tr-actions` carries two controls signed-out and one signed-in. Toggle shortened to
   **"Show all"** per Steve; the other state stays "Apply profile".

**Why "Show all" alone would not have worked, and why it still earns its place.** The toggle
has *two* labels. "Show all" (79.7px) fits; its partner "Apply profile" (106.6px) does not —
so shortening one state would have left the other wrapping and the band would have **jumped
height on every toggle**. With the edit removed, both fit at 375 *and* 360 at the original
16px gap. "Show all" is then the only label that survives a 320px screen ("Apply profile"
over by 11.9, "Show everything" by 36.4).

### Height, signed-out worst case (three tags)

| Viewport | POC12 | item 1 | dot fix | item 3 |
|---|---|---|---|---|
| 375px | 262 | 224 | 187.3 | **139.3** |
| 360px | — | — | 217.2 | **169.2** |
| 1280px | 79 | 52 | 51.6 | **51.6** |

Signed-out now equals signed-in at every width — the band no longer changes height when you
sign in or toggle.

### The tap-target trap, worth remembering

Vertical padding to grow the in-text link's tap target **inflated the line box** and pushed
the status 42 → 51px. Cause: a `<button>` is `inline-block`, and **Chrome forces that even
under `display:inline`** — so the usual "padding on an inline extends hit area only" trick
does not apply to a button. Cancelled with an equal negative margin: padding still counts as
hit area (**42x30** vs ~42x16 bare), zero layout cost.

Kept as a real `<button>`, not styled text — same reason as POC12's About "Bio" tell:
keyboard reachable, announced as a control. `aria-label="Edit your taste profile"`, since
"profile" alone does not say what it does. Steve on the treatment: *"The underline is fine."*

Dead `.tr-edit` rules swept (base + touch override); no references left.

## 4. About "Place" — stop asserting Italy's coffee primacy as settled fact

Carried over from the GTM review, which flagged it as the one objection still standing.
Commit `d1a197e`.

The beat read *"Italy is the home of espresso and of great coffee - a fact recognized
worldwide."* The second half states as settled a claim that is actively contested in
specialty-coffee circles — exactly the audience most likely to become advocates. Asserting it
invites the argument.

Steve's replacement, applied verbatim: **"Espresso was born in Italy, and coffee lovers
worldwide recognize Italian roasts as balanced, refined, and delicious."**

Espresso's Italian origin is uncontested, and the second clause now describes how the roasts
are *received* rather than ranking them. Nothing left to argue with.

## 5. Three photography placeholders on the landing page

The landing page runs 533 words and five screens with **nothing to look at**. Commit
`4f734af`. Steve asked for placeholders he could shop his own photo library against; these
are sourcing briefs, sized to their final crop.

| # | Where | Ratio | Brief |
|---|---|---|---|
| 1 | Under the hero, above the jump chips | 21:9, **16:9 on phones** | Italian bar counter mid-morning service; cups, steam, hands at work |
| 2 | In "Our story", beside the confession | 4:5 | Steve at a caffè table, candid, not looking at the lens |
| 3 | In "Our model" | 3:2 | A roaster's own sealed valve bag, label readable |

**Three, not five** — more and the page reads as a catalogue rather than a story. **Not on
the four shelf cards:** four thumbnails in a row is the e-commerce grid look the brand avoids,
and it would compete with Shop.

Slot 3 is the priority. It is the **product shot** the review said was missing anywhere on the
page, and it illustrates the exact sentence it sits under ("we import; we never interfere").

The band drops to 16:9 on phones because at 375px a 21:9 box is a 327x140 letterbox slit that
nothing reads in. Briefs live in the markup beside their section, so whoever sources the photo
reads them in context; each inherits Brand Standards 3.5 (natural light, low saturation,
narrow depth of field; no posed baristas). Styled as obvious placeholders — dashed hairline,
no photo-like fill — so an empty slot is never mistaken for finished design in a review.

Sizes to shoot/crop: ~2200x950, ~1000x1250, ~1500x1000. Replacing a slot means swapping the
`div` for an `<img>` with width/height attributes (theme check's `ImgWidthAndHeight`).

## 6. Review findings confirmed STALE — do not re-fix

Two items in the carried-over GTM review no longer exist. Verified against current code, not
assumed:

- **"The sign-in interruption is the primary funnel's failure point."** Removed in POC12.
  Re-drove all four quiz paths this session: guest → "Show my matches" lands on a filtered
  Shop with no gate.
- **"Two of four shelves explain themselves and two don't."** All four now carry glosses, plus
  "All Shelves" — Roccia/Sorpresa/Selezione/Offerta each read *"The X: ..."* in
  `snippets/ci-header.liquid`. Fixed by POC12's A4. The review predates it.

**On the 30–50 segment** (Steve asked whether to chase it): the barrier is not the editorial
voice, it is that five screens pass with nothing to look at — which item 5 addresses without
spending brand equity. Recommended *against* loosening the voice, adding urgency, or putting a
product grid above the fold: that trades the 50–70 core, who are the ones actually paying $38
for 250g, for a segment that may not convert anyway. The quiz-as-hero-CTA (POC11) and the
sign-in removal (POC12) were already the right moves for that segment; mobile quality is the
third. The **entry price rung stays parked** — the current ladder is invented fixture data, so
no affordability conclusion is evidence yet (POC11 §0).

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

## Still open in POC13

- **Real photography** for the three slots in item 5 (Steve to source from his own library).
  Until then the landing page still has nothing to look at, which is the one substantive
  barrier identified for a younger visitor.
- **Full-site mobile pass on a real device** — long-deferred. POC9's responsive regions map
  has only ever been verified via DOM inspection, never actually seen. Note this batch is
  heavily mobile: everything above was measured, not viewed, because the browser screenshot
  tool was wedged throughout.
- Carried from POC11: **B3** team/partner bios (administrative feature, waiting on a signed
  partner agreement and Lauren engaging) and **C2** the entry price rung (parked pending real
  landed costs).

Deployment state for this batch lives in `CLAUDE.md` §10 CURRENT STATE, not here.
