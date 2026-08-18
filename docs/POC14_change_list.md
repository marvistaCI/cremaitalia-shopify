# POC14 — change list

Working ledger for the POC14 batch. Durable summary goes in `CLAUDE.md` §9;
**deployment state lives ONLY in `CLAUDE.md` §10** — do not restate it here (stale
banners in these files caused the 2026-07-24 duplicate theme).

Started 2026-08-18, out of a close-scrutiny review of the deployed POC13.

---

## §0 — How this batch differs from POC11–POC13

Those batches were built and verified by **DOM measurement**, because six sessions
recorded the browser screenshot tool as "wedged." That was a misdiagnosis (see
`CLAUDE.md` §9, 2026-08-18). **POC14 is the first batch verified by actually looking
at the page**, and the first visual pass immediately found brand-critical defects in
four categories that six DOM-only passes had missed.

Both methods matter and neither substitutes for the other:

| Method | Authoritative for | Blind to |
|---|---|---|
| DOM geometry (`javascript_tool`) | position, size, line counts, keyboard reachability, computed styles, text content | crop, colour, composition, **synthesised type**, whether a break reads badly |
| Screenshot | everything above as *perceived* | exact measurements; easy to eyeball wrong |

The type finding below was invisible to measurement (the computed style says
`italic`, and it *renders* italic) and obvious on sight. The bad hero line break
was the reverse: geometry said "2 lines," which was correct and useless.

---

## Scope note

Steve scoped item 2 to the hero. It was widened to the whole site **deliberately and
with that flagged at the time**, because the hero was 2 of 216 instances of one root
cause and the fix was the same three lines either way. Items 3 and 6 were explained
rather than built, at Steve's instruction.

---

## 1. Keyboard access — DONE

**The defect.** The taste quiz became the hero CTA in POC11. A keyboard or
screen-reader user could press *Take our tasting quiz*, the modal would open, and
then they could not answer a single question. Every quiz option is a
`<div onclick>`. So is every product card.

Measured on the deployed theme before the fix:

```
shop product cards      13 total,  0 keyboard-reachable
quiz options            10 total,  0 keyboard-reachable
home shelf cards        div,  tabIndex -1
shop filter pills       span, tabIndex -1
roaster rows            div,  tabIndex -1
non-semantic clickables 75 of 152  (49% of all interactive elements)
```

POC12 fixed this pattern for the two About people cards. It was never carried to
the commerce surfaces, which are the ones that convert.

**The fix.** One delegated handler in `ci-storefront.js` rather than editing every
render function — `markKeyboardActivable()` stamps `tabindex="0"` + `role="button"`
on any non-native element carrying `onclick`, and a single `keydown` listener turns
Enter and Space into a click (with `preventDefault` so Space does not scroll). It
re-runs after the catalog render and after every `showPage()`, so it covers markup
built later from `ci-catalog.json`.

Deliberately excluded: `.pill.disabled` — the greyed "as we grow" region markers are
decorative and should not be in the tab order.

Added a visible `:focus-visible` ring in gold. Without one, keyboard access is
technically present and practically unusable. Gold reads on both cream and the dark
hero, so one rule covers both grounds.

**Verified functionally, not structurally** — focused a real product card and fired
Enter (product detail opened), focused a real quiet option and fired Enter (option
selected):

```
shop cards tabbable   13 / 13     quiz options tabbable  10 / 10
Enter opens product   yes         Enter answers quiz     yes
disabled pills correctly skipped  yes
```

**PROD:** the real storefront should use genuine `<button>`/`<a>` elements. This is
the correct minimum for a POC whose CSS is built around divs.

---

## 2. Synthesised type — DONE (216 → 0)

**The defect.** Not one real italic face was loaded on the entire site, and two
weights in use did not exist.

```
Faces actually loaded:  Marcellus normal 400
                        Inter normal 400 / 500 / 600
Faces being rendered:   Marcellus italic      -> synthesised oblique
                        Marcellus 600         -> synthesised faux-bold
                        Inter italic          -> synthesised oblique
                        Inter 700 (<strong>)  -> synthesised faux-bold
```

216 usages. Both hero lines. Every Marcellus heading on the site. And all 61 `.ita`
spans — **the brand's one sanctioned italic**, the Italian-language cue.

The Brand Standards already recorded the constraint at the v2.0 rebuild:
*"Marcellus is roman-only, so the EN/IT cue is now the eyebrow label, not italic
display type"* and *"a single 400 weight — headings rely on size, not bold."* The
hero was doing both of the two things the Standard says the typeface cannot do.

**Why it survived.** `document.fonts.check('italic 22px Marcellus')` returns
**`true`**. It reports "can render", *including by synthesis* — never "has a real
face." Verify with `[...document.fonts]` and look for an entry whose `style` is
actually `italic`.

**The fix, in two parts.**

1. **Load Inter's real italic** — the font URL requested roman only. Now
   `Inter:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600`. This alone makes ~25
   italics genuine (`.afd`, `.cn`, `.pill.disabled`, `em`, `.flavor-desc`, …).
   Marcellus has no italic on Google Fonts, so it cannot be fixed this way.
2. **Correct the display face at source** — every rule setting
   `var(--ci-font-display)` had `font-weight:600` → `400` and `font-style:italic`
   removed. 22 faux-bold and 12 faux-italic across **31 selectors**. Plus
   `strong, b { font-weight: 600 }` because Inter has no 700.

Done **at source rather than via an override block**, so the defect cannot be
reintroduced by someone editing an original rule and not noticing an override
further down the file.

**Method worth reusing.** The first attempt was an enumerated override list and it
only got 216 → 38, because enumeration by inspection misses cases. Re-running the
audit against the deployed theme and *requiring zero* is what caught the rest. The
final straggler (`.region-here`) took a third pass: it **inherited** Marcellus from
its parent `h3` rather than declaring it, so a source transform keyed on
`var(--ci-font-display)` could not see it. Fixed by giving it the body font, which
is what the Standard specifies for labels anyway.

Final audit against the deployed theme: **0 synthesised usages, 25 real italics in
use.**

---

## 3. Home shelf grid rendered 3 + 1 — DONE

Measured at 1280: `grid-template-columns: 344px 344px 344px` with four shelf cards,
so Offerta sits alone on its own row with two empty columns beside it — directly
under a heading reading *"The four coffee shelves."* It visually demotes Offerta and
makes a designed set look accidental.

**Where the fix goes.** *Not* on `.card-grid` — that class is shared by Shop, the
four shelf pages and Bottega, and a 13-product grid genuinely wants 3 columns. It
needs a **scoped override on the home shelves grid only**, sitting beside the
existing `#page-home` rules: `#page-home .card-grid{grid-template-columns:repeat(2,1fr)}`
with a single column below the existing 640px breakpoint. Four peers read better as
a 2×2 than as 4-across (cramped at 250px each) or 3+1.

**Built as described.** Measured after: `526px 526px`, two rows of two at desktop;
single column at 375 (343px cards, no overflow). Home has exactly one `.card-grid`,
so the scope cannot catch anything else today, but the `#page-home` prefix stays in
case that changes.

---

## 4. The hero asked a question and never answered it — DONE

**The defect.** Measured above the fold on the deployed theme:

```
                            desktop 1280   mobile 375
word "Shop" visible              yes (nav)      NO
cart icon visible                yes            NO  (hamburger)
any price visible                no             no
```

The hero literally posed a question — *"Do you love Espresso, Italy, and the Italian
Bar (Caffè) culture? Or are you simply looking for delicious, fresh coffee beans?"* —
and answered it with a greeting. Three problems: it named **two** audiences, the
second being everyone who drinks coffee; the actual claim was the **214th word** on
the page; and on a phone the question wrapped to **four lines** against a one-line
payoff, so the question carried ~4× the visual mass of the answer.

**Final copy** (four drafts, Steve driving):

> ## Freshly roasted in Italy. Exactly as the roaster sealed it.
> From a small, named group of artisan Italian roasters, air-freighted whole-bean so
> it reaches you weeks from the roast date, not months. For people who love to grind
> their own beans.
>
> *Benvenuto - welcome in.*

**The reasoning, because it is not obvious from the diff.**

- **Freshness leads (Steve's catch).** "Italian coffee" is a roasting *style*, not a
  provenance or a date — Illy and Lavazza are "Italian coffee" and sit on a shelf for
  a year. Freshness is the strongest persuasive fact this brand has and it appeared
  **nowhere above the fold**. The Promise page already says *"airfreight coffee
  freshly roasted in Italy"* verbatim, so this promotes existing copy rather than
  inventing a claim. Measured first: **identical line count** to the old headline
  (2 desktop / 3 mobile), so the gain is free.
- **Two sentences, not a comma.** *"just as the roaster sealed it"* can read
  temporally, as though roasting happened at the moment of sealing. *"Exactly as"*
  cannot. Two declaratives also give each beat full weight. Note the discarded
  comma version echoed the live coming-soon H1, *"Italian coffee, brought over
  whole."* — that construction is established brand rhythm and is worth keeping in
  mind for other headlines.
- **Subhead reworked.** It used to read *"change nothing... no re-roasting, no
  re-grinding, no re-bagging"*, which now merely repeats the headline. It carries
  the **mechanism** that substantiates the claim instead.
- **Audience: passion, not capability.** Three drafts. *"…and can taste the
  difference"* was cut because discernment is an **exclusive** claim — it implies
  others cannot taste it. *"…who grind their own beans"* was merely a hardware test.
  Steve's *"who **love to** grind their own beans"* filters for passion, and
  affection is inclusive where discernment is not. It echoes the About page's own
  Three P's: *"a group passionate about coffee."*
- **"People", not "those".** *"For those who…"* is the house construction of
  aspirational luxury copy and sits next to the exclusive/world-class register §6
  bans. The Standard's voice is *plain, direct, deferential*.
- **Rejected: "always grind their own."** Better *writing* (behaviour over declared
  emotion) but it is a purity test — it excludes the person who bought a grinder last
  month, whom the founder story explicitly welcomes (*"Maybe you simply want
  high-quality beans to grind and savor"*). Invitation over test is the established
  posture, the same one that removed the quiz auto-launch and the fake "172 of 222."

**Two line-break fixes that only looking could catch.** `text-wrap: balance` split
*"Exactly / as the roaster sealed it"*, stranding a word and leaving a full stop
mid-line — so the break is now forced at the sentence boundary. On a phone the second
sentence then broke after *"the"*, so a non-breaking space binds *"the roaster"* and
it breaks after *"Exactly as"* instead. Geometry reported "2 lines" for every one of
these variants, which was correct and useless.

**Watch the subhead's line count.** An intermediate draft pushed it to **6 rendered
lines against a 3-line H1** — recreating the exact mass-inversion this item exists to
fix. **5 lines at 375 is the cap.**

**Governance note.** *"Freshly roasted"* is now the most prominent claim on the site.
If transit or the six-week arrival cadence slips, this headline is the first thing
that becomes untrue. It is an operations commitment now, not a marketing line.

---

## 5. No email capture anywhere on the storefront — DONE

**The defect.** Zero capture surfaces in the POC storefront. The only occurrence of
the word "newsletter" was the FAQ explaining that we do not issue newsletter *codes*.

```
templates/index.liquid        0 signup forms
snippets/ci-store-footer      0 signup forms
templates/password.liquid     1  <-- the page this replaces
live-theme/templates/index    1  <-- and this one
```

Same shape as the Open Graph gap (item 6): **the placeholder is better than the store
replacing it.** Launching as-was would have retired the only acquisition surface on
the same day paid traffic begins — and the win-back, abandoned-cart and 60-day-grace
campaigns in the Store Operating Standards all assume a list that nothing was
building.

**The fix.** A quiet footer field: one sentence, one input, no modal, no popup, **no
discount incentive** — a discount bribe would also contradict the "we issue no codes,
to anyone, ever" rule in Standard v1.3. Copy: *"We write rarely... a note when a new
roaster joins, and when a coffee we like is about to run out."*

Verified functionally: rejects a malformed address with a correction message and
keeps the form up; accepts a valid one, confirms, and hides the form.

One layout bug found by looking: `.ci-footer` is `display:flex` with
`justify-content:space-between`, so the new block became a **flex sibling** of the
company line and squeezed to the left half. Fixed with `flex:0 0 100%; order:-1` and
a bottom hairline.

**PROD:** replace with Shopify's native `{% form 'customer' %}` newsletter form, or
the ESP's embed. **Email platform is still an open launch-gating decision**
(`CLAUDE.md` §10) — this send is mocked.

---

## 6. Open Graph / Twitter tags absent — DONE

When a link is pasted into iMessage, WhatsApp, Slack, Facebook or LinkedIn, that app
fetches the page and reads hidden `<meta>` tags — the **Open Graph** tags — to decide
what card to draw: title, one-line description, image. No tags means no card: the
link renders as bare text or a grey box with a truncated URL.

```
layout/theme.liquid            (POC)   0  og/twitter tags
live-theme/layout/theme.liquid (live)  9  og/twitter tags
layout/password.liquid                 5  og tags
assets/ci-og-image.png                 present, 66 KB, referenced by nothing
```

**Built.** 13 tags (the live theme's nine, plus `og:site_name`, `og:image:width`,
`og:image:height`, `og:image:alt`). Copy aligned to the new hero rather than copied
from the coming-soon page, which still says "Opening late Summer/Fall 2026". The image
was already in `assets/` at a textbook 1200x630.

**One trap worth knowing:** `asset_url` returns a **protocol-relative** `//host/...`
path, and some scrapers will not follow that, so the URL is forced absolute. The guard
is written as a conditional rather than a string trick so it stays correct if Shopify
ever returns an absolute URL.

**Verified by fetching the image, not just by reading the tag** - `og:image` returns
HTTP 200. A present tag pointing at a 404 renders exactly the same bare grey link the
missing tags did.

**PROD:** this is a single-document SPA, so one static card covers every route. On the
real storefront these become per-template - a product page wants its own title, its own
photograph, `og:type=product`, price and availability - alongside the Product and
Organization JSON-LD this theme still lacks.

---

## Verification pass — 2026-08-18

Ran after items 1/2/4/5, fence agreed with Steve: **verify today's changes, do not
fresh-audit.** All 20 pages swept with each one activated (hidden `.page` elements
report empty text — the POC12 trap), dynamic pages populated first.

| Check | Result |
|---|---|
| Synthesised type, all 20 pages | **0** |
| Keyboard reachability, all 20 pages | **0 gaps** |
| Horizontal overflow | none |
| Collapsed or overflowing headings | none |
| `theme check` | 17 offenses / 2 errors — baseline, **0 new** |

**Two things the sweep caught that the first pass missed.**

1. **The regions map was still faking bold.** Its inline SVG `<style>` sets
   `.region-label` and `.legend-title` to `font-weight:700`, which the site-wide CSS
   transform could not reach, and Inter loads only 400/500/600 — so all 10 map labels
   were synthesised. Now 600. **COWORK FOLLOW-UP:** the OneDrive source
   `Region_Map_v2.svg` still says 700 and should be brought to 600 so the source and
   this inlined copy do not drift.
2. **`.ita` styled nothing.** 19 spans carry `class="ita"` and there was never a bare
   `.ita` rule — only `.shop-menu .ita`. So the brand's one sanctioned italic
   ("italics are reserved for Italian-language", §6) was not rendered anywhere in body
   copy. Not a regression from this batch; a pre-existing gap that today's font-load
   fix makes fixable, because before it the same rule would have produced a
   synthesised oblique. Implemented with headings excluded, per Brand Standards v2.0:
   *"Marcellus is roman-only, so the EN/IT cue is now the eyebrow label, not italic
   display type."* Verified: `bicerin` in prose is real Inter italic; `(Lombardia)` in
   an `h3` stays roman.

**Visual walkthrough** (product detail, quiz modal, About team, regions map). The
material risk was that headings went 600 → 400, i.e. lighter. **No legibility
regression found.** Marcellus 400 reads better than the faux-bold did — more refined,
appropriate presence at every size including the 1rem person-card names, which were
the highest-risk case. The quiz subtitle losing its fake italic is a clear improvement.

**One taste call for Steve, not a defect:** the quiz option marks (the L / M / D / ?
circles) lost both italic and weight and are now noticeably more delicate. Legible,
and arguably more on-brand for a house style that prefers fewer heavy elements, but it
is a visible change and worth a look.

**New findings, deliberately NOT chased** (outside the verification fence, logged for
the next audit): product-detail dates render ISO (`2026-08-07`), which reads technical
to a US consumer where `Aug 7` would not; and the team row mixes two real headshots
with a brown placeholder tile, which is the known photography gap made visible.

---

## Still open from the POC13 audit (not in this batch)

- **No structured data** anywhere — no `Organization`, `Product` or `BreadcrumbList`
  JSON-LD, so no rich results, and no route to star ratings later.
- **No social proof of any kind.** The founder story is the only trust asset. See the
  audit's recommendation: palate-matched feedback and **reorder rate** rather than a
  global five-star average.
- **No US customary weights.** Standards §9 requires both; the site is metric-only.
  A US buyer has no instinct for 250 g, and 8.8 oz against the US-default 12 oz bag
  runs against us.
- **Brand voice drift** at `templates/index.liquid` — *"carefully hand-selected… at
  its finest"* collides with the Standard's own named anti-pattern.
- **Nothing warns the buyer they need a grinder.** *"love to grind their own beans"*
  in the hero starts this but does not close it.
- **Gifting** is named as a Sorpresa use case with zero supporting functionality.
- **`ci-cup.png` is 722 KB and orphaned**; no `srcset`; one `loading="lazy"` in nine
  images; several images oversampled ~4×.
- **The founder portrait (`ci-temp-lp2.jpg`) is unshippable and was never logged as
  such.** `lp1` and `lp3` carry recorded reasons; this one does not. The two most
  prominent objects are a glass of red wine and a beer in the foreground, on the
  founder story of a coffee company, and he is looking at the lens where the brief
  says candid.

---

## Verification summary

- `node --check` clean; `JSON.parse` on the catalog clean.
- `shopify theme check`: **17 offenses / 2 errors — the documented baseline, 0 new.**
- Type audit against the deployed theme: **216 → 0.**
- Keyboard audit against the deployed theme: **13/13 cards, 10/10 quiz options**,
  Enter confirmed to act on both.
- Hero and footer confirmed **visually** at 1280×800 and 375×812.
