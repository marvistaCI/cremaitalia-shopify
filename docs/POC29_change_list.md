# POC29 change list — Lauren Roberts' About photo and bio

**Deployment state is NOT recorded here.** See `CLAUDE.md` §10 CURRENT STATE, which is the only
authoritative statement of what is deployed. This file is the build record.

Commit: `f354f5e`.

---

## What this batch is

One team member's About record, filled in. Lauren Roberts has carried
`"Bio under construction."` and a lettered placeholder tile since POC12 — which is the batch that
set the rule that no team member or partner ships without full data. She was the last team member
still in that state; Partner 1 remains, correctly, because no partner agreement is signed.

Bio written by Cowork into `Operations\People\Lauren Roberts\BIO.md`, and **approved by Lauren**
before anything was committed.

## Steve's question, answered before the work started

> *Does this require a new POC, or just an update to the underlying dataset?*

**A dataset update.** In the POC a person is one record in the `people[]` array in
`assets/ci-catalog.json` — photo filename plus bio paragraphs — so changing her is editing that
record and adding one image. No new components, no logic, nothing structural.

Two template edits ride along **only because the POC is a mock**, and both are worth naming because
neither exists in production:

| Edit | Why it is needed | Production equivalent |
|---|---|---|
| `templates/index.liquid` About tile | The tiles are hand-written markup, one per person | A repeatable section block |
| `layout/theme.liquid` `CI_ASSETS` | JS-rendered photos resolve filenames through a static map | `img_url` on the block's image field |

In production this whole edit is Steve adding a block in the theme editor, with **no deploy at
all** — sections + blocks, locked 2026-07-13, `production_build_spec.md` §2. (Metaobjects, which
are what "Shopify tables" describes, are the deferred upgrade path there, taken only if a person
gets reused across pages or the lists grow large.)

Seeing it still needs a push, and the draft-theme naming rule makes that a POC29. So it is "a new
POC" in the bookkeeping sense only. Precedent is POC20, a single data-only commit that still got
its own preview theme.

## 1. The bio

Three paragraphs, 186 words, against Lucia's 160 — same register and length. Checked against the
copy rules rather than assumed:

- **zero em-dashes** (§6), zero en-dashes
- **zero exclamation marks** (Steve's standing preference)
- **none of the banned register** — no "hand-picked", "exclusive", "finest", "curated", "premium"
- pure ASCII, so nothing to normalise; her quoted sentence keeps straight quotes, matching the
  rest of the catalogue

**The role stays `Operations Manager - US`.** `BIO.md` heads it with a comma ("Operations Manager,
US"), but the site convention since POC11 is `Role - Location`, and the site is what renders.

**One thing flagged rather than silently shipped:** the third paragraph names her two stepchildren,
the new baby and her husband. Lauren approving her own bio covers her own information; it does not
by itself settle naming three children on a public storefront that will be indexed. Raised with
Steve as a deliberate choice, not a copy defect, and he confirmed her approval with the names in.

## 2. The photograph, which is a retouch

**Steve's source photo has her holding a matcha.** On the About page of an Italian coffee importer
that reads wrong — the same note already recorded against the temporary landing-page band photo,
which is a US café with a matcha on the chalkboard. Steve's call was to keep the cup and recolour
the drink.

**Method, and it is why the result holds up.** Only **hue** moved. Saturation and brightness are
untouched, so the rosetta swirl, the sheen on the liquid surface and the shadow under the rim are
all the original photograph's — nothing was painted in. The separation was free because the colours
do not overlap:

| Region | Hue | Saturation |
|---|---|---|
| The matcha | 54–59° | 0.12–0.70 |
| Her skin and hair | 19–30° | — |
| The ceramic cup | — | 0.04 |

So a mask keyed on **hue band plus a saturation floor** isolates the drink from her hand and the cup
with no hand-drawn selection. Greens map to **30°** (crema brown) with a feathered edge, weighted so
there is no hard boundary.

**Verified confined, not trusted.** Diffing the result against the source shows changes only inside
`(206,389)-(313,423)` — the liquid and the residue on the front lip. Nothing else in the frame moved:
not the background greenery, not the plant by the window. **Recolouring the rim residue is what
sells it**; left green, it would have given the retouch away.

## 3. Crop and sharpness

Steve's note after the first crop: keep the top of her head in frame, and not blurred. Two things
were working against the crown and only one of them was framing.

- **Framing:** the crop now takes a **450px** source region against the earlier 420px, roughly
  doubling the headroom above her hair.
- **Resampling:** 450 → 440 is a **downscale**. The earlier crop stretched 420 up into 440, which
  can only soften. Plus a light unsharp mask (radius 1.2, 60%, threshold 3) to recover what any
  resample costs.

Individual strands resolve at the crown now. **Some softness at the wispy hair edge is in the
original photograph** and no crop or filter honestly removes it.

Output: **440×440, 42 KB, metadata stripped**, in line with `ci-lucia.jpg` and `ci-asia.jpg`. Both
containers are `aspect-ratio:1` (the About tile and the person-page hero), so the square asset is
shown whole and CSS cannot clip the top of her head again.

**The retouched full-resolution master** is saved beside the original as
`Lauren Headshot - Cappuccino.jpg` in her People folder. It was checked for existence first;
nothing in that folder was overwritten.

## Files

| File | Change |
|---|---|
| `assets/ci-lauren.jpg` | new — 440×440, 42 KB, no EXIF |
| `assets/ci-catalog.json` | `photo` set; bio's three paragraphs |
| `layout/theme.liquid` | `ci-lauren.jpg` added to `CI_ASSETS` |
| `templates/index.liquid` | tile renders the photo; lettered placeholder gone |

Four lines of real change; the rest is the image.

## Verification

- `node --check` clean; `JSON.parse` clean
- `shopify theme check` at the documented baseline: **15 offenses / 0 errors / 0 new**
- The crop and the recolour were judged **by looking** — the cup at 3× and the crown at 3× — not by
  measurement alone. A hue histogram cannot tell you whether a drink reads as coffee.
- Batch content asserted **on the deployed theme** rather than the repo: `photo` reads
  `ci-lauren.jpg`, the bio is three paragraphs with no "Bio under construction", `CI_ASSETS` carries
  the filename, the tile has no placeholder div, and Partner 1's placeholder is the only one left.

## Not done, deliberately

- **Partner 1** keeps `"Bio under construction."` No partner agreement is signed.
- **`ci-temp-*` landing-page photography** is untouched and still cannot ship. Tracked in
  `docs/photography-todo.md`.
