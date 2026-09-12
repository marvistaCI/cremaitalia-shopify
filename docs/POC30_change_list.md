# POC30 change list — the B2C expert review of POC28, worked in priority order

**Deployment state is NOT recorded here.** See `CLAUDE.md` §10 CURRENT STATE, which is the only
authoritative statement of what is deployed. This file is the build record.

**Source of the batch:** the external B2C storefront / UX review of POC28 (Steve's copy:
`Downloads\B2C_Expert_Review_of_POC_28.html`, captured Sep 2026). Its verdict was *move forward,
with conditions*; its "Missing (add), priority order" list is being worked top-down, one item at
a time, on Steve's instruction. Nothing is pushed to a numbered preview theme until Steve says
the batch is complete.

**Ground rule carried from the review:** all roasters, products, prices and ratings in the POC are
fixture data. No item here may draw a conclusion about catalog credibility. The brand look is a
declared standard and is assessed as such.

---

## 1. A sensory image in the first viewport — the hero is now image-first

**The finding (review, Missing #1 and "The Hero"):** the hero was all copy and sold the operating
model (curated / sealed / flown in / donated) before creating any desire for the cup. *"Hero
seduces, second screen justifies."* First-viewport visitors decide in seconds, on visual
impression, scanning not reading, and on a shopping visit they came to see the product.

**Steve's direction, and how it changed on the way to the build.** His first idea was a montage:
a roaster in action behind a hand caressing a cappuccino, an unbranded bag open on the table.
Two things were argued off it and one was argued back on. The latte art went (an Italian bar
cappuccino has a plain cap; the rosetta is an Australian / US third-wave signature, and on a
site whose claim is *unchanged from Italy* it is a small tell that the cup is American). The
spilling beans went (Brand Standards §3.5 already bans decorative beans; it is the single most
overused coffee stock trope). Then Steve pointed at drinktrade.com, whose hero is a muted
looping **video** of a top-down cup, and asked *what if this were the last seconds of a great
pull, crema and all?* That replaced the montage: it is the brand's name in a picture, it needs
no roaster, no bag and no trademark, and he could shoot it himself.

**What is in the file, and why loop A.** Three clips were reviewed frame by frame:

| Clip | What it is | Verdict |
|---|---|---|
| `MOV_3860` | Bottomless portafilter pouring into a clear glass on a red machine, shot with the camera held sideways | Cut a loop to prove the pipeline; **not the hero** - side-on, no crema surface, enthusiast gear, saturated red, portrait source |
| `MOV_3863` | High-angle on a ceramic cup filling on the drip tray, warm natural light, 65s | **The keeper.** Seconds 47-53: the stream landing on the crema and the flecks blooming from the impact point |
| `MOV_3865` | Top-down of the finished cup on a cream counter, 7s | The right framing, wrong moment: crema already flat, a ceiling-light hot-spot on it, cream ground with no dark zone for text, almost no motion |

**The cup is from a ceramiche in Pienza.** Code called it "American craft pottery" and was
wrong; Steve corrected it. It stays, and it is a better story than a plain white demitasse
would have been - the cup is itself Italian and nameable.

**What shipped in the theme:**

- `assets/ci-temp-hero.mp4` - 1440x810, 5.97s, 30fps, H.264 yuv420p, ~710 KB, no audio track,
  all metadata stripped. Cut from `MOV_3863` seconds 47-53 with a one-second crossfade seam so
  the loop closes without a jump (the stream is steady across the seam; first and last frames
  are near-identical). A 1440x810 crop at native resolution, not upscaled.
- `assets/ci-temp-hero-poster.jpg` - the same crop at 50s, q82 progressive, metadata stripped,
  ~107 KB. The first paint, the slow-connection fallback, and the reduced-motion fallback.
- `templates/index.liquid` - a new `.hero-media` block ahead of the copy hero: `<video autoplay
  muted loop playsinline preload="metadata" poster=...>` (muted + playsinline are what let it
  autoplay on iOS), an Espresso scrim, and the page's single `<h1>`: **"Exactly as the roaster
  sealed it."** - the line the review called the best on the site, which had been competing
  with an operations paragraph. The copy hero keeps its other two beats, demoted from `<h1>`
  to `<p class="hero-claim">` styled identically, so the page has one H1. **The 300px knockout
  logo lockup came out of the hero**: a cup lockup on a photograph of a cup is redundant, the
  header carries the logo, and "smaller logo, larger margins" is the brand's own tie-breaker.
- `assets/ci-storefront.css` - `.hero-media` is full-bleed 16:9 capped at 78vh on desktop (so the
  copy band still peeks above the fold on a short laptop) and **4:5 on phones**, so the cup
  fills the viewport rather than a letterbox slit (the same reasoning as `.photo-band`'s 21:9
  to 16:9 swap). `object-position: 42% 45%` keeps the cup, which sits left of centre in the
  crop, inside the phone frame. Hero band top padding trimmed now the logo is gone.
- `assets/ci-storefront.js` - `initHeroVideo()`: under `prefers-reduced-motion: reduce` the
  video is paused with `autoplay` removed so the poster frame stays and nothing decodes; and
  `play()`'s rejection is caught for the one combination where autoplay is refused (iOS Low
  Power Mode) so the poster stays and nothing throws.
- `.claude/launch.json` - a `theme-dev` entry for the browser pane's preview launcher. Tooling,
  not theme.

**Contrast, measured rather than asserted.** Cream on bare crema is roughly 2:1. The H1 sits
over a scrim of **Espresso `#55331B` at partial alpha - the palette's own hero tone, not a new
colour** - fading across the frame. The first gradient (.72 at 0%, .45 at 38%, 0 at 68%) was
checked by drawing the live video frame to a canvas, sampling every pixel under the H1's box,
compositing the scrim, and computing contrast against cream: **average 5.9:1, but the worst
pixels 2.5:1**, at the headline's right edge (~49% across, where the crema is brightest) - under
the 3:1 large-text floor. The dense zone now runs to the headline's edge (.78 at 0%, .66 at
50%, 0 at 80%). Re-measured: **desktop worst 5.2:1 / average 7.8:1 at 54px; phone worst 3.6:1 /
average 8.1:1 at 31.5px** (both large text, floor 3:1; body floor 4.5:1 also met on average),
measured at two different moments of the loop with the same result. The phone scrim was then
deepened a step further (.85 at the foot, darkening from 40%) and re-measured at two moments of the loop: **worst 4.1-4.3:1, average 8.5:1**. **The lesson is the
review's own caution applied to a moving image: measure the worst case, not the average, and
measure the actual frame, not the palette.**

**Verified by looking and by DOM:** video `readyState 4`, playing, 1440x810; exactly one `h1`
on the home page; no `.hero-logo` in the hero; H1 two lines in the scrimmed left third at 1024
and 1350 wide; on a 375px phone the hero is 4:5 with the stream and crema filling the frame and
the H1 two lines at the foot; no horizontal overflow at either width. `node --check` clean.
`shopify theme check` at the documented baseline (**15 offenses / 0 errors / 0 new**). The mp4
uploads to a theme as an asset without complaint (proven on the Development theme via
`shopify theme dev`).

**Reshoot brief - recorded in `docs/photography-todo.md` as slot 0.** Same shot as `MOV_3863`:
same light, same 45-degree angle (better than a true top-down because the stream stays visible),
**the same Pienza cup**, on a saucer so the drip-tray grate is out of frame, and hold for eight
seconds after the stream stops so the settle can be looped as well as the pour. Landscape,
4K if the camera has it. Nothing branded in frame.

**Deliberately not done in this item:**

- The copy hero's text is unchanged. The review's other hero notes (move the freshness
  paragraph and donation below the fold, trim the founder bio, re-pitch away from
  freshness-as-headline) are separate items in its list and are taken in order, not folded in.
- The 21:9 café band (`ci-temp-lp1.jpg`, photography slot 1) directly under the copy hero was
  left in place for Steve's eye on the preview. **He dropped it the same day - see 1b.**
- No separate portrait cut of the video. One landscape file serves both crops via
  `object-fit: cover`; Trade ships two cuts, and that is the production shape if a phone crop
  ever needs a different composition.
- In production the hero is a theme section with the media on **Shopify Files** (`video_tag`),
  not a theme asset; the theme-asset route is the POC's mock. Not written into
  `production_build_spec.md` yet - that belongs with the batch's spec pass when the hero's final
  shape is known.

## 1a. The hero line, settled

Steve, reviewing the item 1 preview, asked whether Italy belonged in the hero line - it had
gone missing from the first screen, with the logo tagline the only Italy above the fold. Six
candidates were weighed in one sitting, in this order:

| Candidate | Verdict |
|---|---|
| *Italian perfection, just as the roaster sealed it.* | Declined. "Perfection" is a superlative about our own taste, the register Brand Standards §3.1 and CLAUDE.md §6 ban, and a claim with no proof beside it yet (the review's trust gap). "Just as" was already rejected 2026-08-18 for reading temporally. |
| *Italian heritage / tradition* | Declined. Inherited qualities that belong to the roaster, not to a Florida importer, and the exact words Lavazza and Illy sell on - style words, which POC21 established can be borrowed where a place cannot. |
| *Italian provenance* | Defensible (the review's own word for the primary buyer) but cold, and "provenance... sealed" nearly says one thing twice. |
| *Italian craft* / *Italian coffee craft* | Defensible - the Standard's own approved construction - but a noun stack, and it pushed the line to three lines. |
| *From Italy, exactly as the roaster sealed it.* | Code's proposal. Place plus fact. |
| **Exactly as the roaster sealed it... in Italy.** | **Steve's, and chosen.** The proven line intact, Italy as a place, and the ellipsis used exactly as the no-em-dash rule prescribes - a sentence trailing into a sequenced next thought. The reveal is the point. |

**Measured after the change:** two lines at 1350 (54px, breaking "Exactly as the roaster / sealed
it... in Italy.") and two lines at 375 (31.5px, same break); the H1 box reaches the same 49%
across the frame as before, so the scrim measurement stands - **desktop worst 5.2:1, phone worst
4.3:1**, re-run rather than assumed. `in&nbsp;Italy` is glued so the closing beat can never orphan.
The reasoning is also in a comment at the markup site, so the next person to "improve" the line
sees what was already tried.

## 1b. The café band retired

Steve, on the item 1 preview: *"drop the cafe band."* With a video hero above it the page ran
video, copy band, photo; the band was the weakest of the three, and its stand-in (a US specialty
café with an English chalkboard) had been recorded since POC13 as one that could never ship.
Removed: the markup and its `PROD:` comment in `templates/index.liquid`, the asset
`assets/ci-temp-lp1.jpg` (nothing else referenced it), and the three `.photo-band` rules in
`assets/ci-storefront.css` that had exactly one user. `docs/photography-todo.md` marks slot 1
retired rather than deleting the row, so a later reader sees that the Italian bar-counter shot
was a brief once and now has no slot. `production_build_spec.md`'s temp-asset row updated.
Slots 2 and 3 (founder portrait, product shot) are untouched. Theme file count for the deploy
skill's baseline: 39 at POC29, +2 hero assets, -1 café band = **40**.

## Files

| File | Change |
|---|---|
| `assets/ci-temp-hero.mp4` | new - the stand-in loop |
| `assets/ci-temp-hero-poster.jpg` | new - the stand-in poster |
| `templates/index.liquid` | `.hero-media` block added ahead of the copy hero; logo removed; `<h1>` moved onto the video; band heading demoted to `.hero-claim` |
| `assets/ci-storefront.css` | `.hero-media` rules; `.hero h1` rules shared with `.hero-claim`; hero padding |
| `assets/ci-storefront.js` | `initHeroVideo()` reduced-motion and autoplay guard |
| `docs/photography-todo.md` | slot 0 (hero) added with the reshoot brief |
| `.claude/launch.json` | new - preview launcher entry |
| `assets/ci-temp-lp1.jpg` | **deleted** (1b) |
| `docs/production_build_spec.md` | temp-asset row updated (1b) |
