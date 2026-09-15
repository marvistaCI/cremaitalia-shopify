# Photography — deferred, tracked here

**Status: ALL photography is deferred (Steve, 2026-08-20).** Nothing in this file blocks the
current POC work. It exists so that deferring is a decision with a ledger rather than a thing we
quietly forget. **Every item here is launch-gating** — the storefront cannot go live with the
assets it currently carries, and two of them cannot ship for legal/brand reasons, not merely
aesthetic ones.

This is the single list. When a shot is delivered, tick it here and delete the corresponding
`PROD:` comment in the code, so the code and this file cannot drift apart.

---

## 0. The hero video — TEMPORARY STAND-IN, must not ship (POC30, 2026-09-12)

The home hero is image-first as of POC30: a muted, looping, six-second video of an espresso pull
landing on crema, with one line over it. See `docs/POC30_change_list.md` item 1 for why.

| Slot | Assets | Ratio / size | Brief |
|---|---|---|---|
| 0 — hero video | `ci-temp-hero.mp4` + `ci-temp-hero-poster.jpg` | 16:9 landscape source, 1440x810 now; shown 16:9 on desktop and cropped to 4:5 on phones via `object-fit: cover` | See below |

**What the stand-in is.** Cut from Steve's own footage (`MOV_3863`, shot 2026-09-01): a high-angle
on a ceramic cup filling on the drip tray, warm natural light, seconds 47-53 where the stream
lands on the crema and the flecks bloom from the impact point. The cup is from a ceramiche in
**Pienza** and stays in the reshoot. It is `ci-temp-*` because it is a working crop of a
hand-held take, not because the subject is wrong.

**The reshoot brief:** the same shot. Same light (soft daylight, no overhead lamps on the chrome),
same roughly 45-degree angle - better than a true top-down because the stream stays visible - the
same Pienza cup, **on a saucer so the drip-tray grate is out of frame**, and **hold for eight
seconds after the stream stops** so the settle can be looped as well as the pour. Landscape, 4K if
the camera has it, so a native 1920-wide crop is possible. Nothing branded anywhere in frame. Two
takes, cup off-centre left and off-centre right, so the headline can sit on either side.

**Two things the stand-in taught that the reshoot must keep:** the headline needs a dark zone
(the blurred machine body at upper-left does it now; a saucer shadow would do it), and the crema
must still be **moving** when the camera is on it - `MOV_3865`, a top-down taken after the pull,
had flat, uniform crema with a ceiling-light hot-spot and nothing to loop.

**First reshoot, 2026-09-15 (`MOV_3881`, `MOV_3882`) - reviewed, cut, compared on the page,
and NOT adopted (Steve: reshoot again).** `MOV_3881` got the setup right and the pull wrong:
tripod-steady, sharp, on a saucer, 45 degrees, a 14-second hold after the stream, nothing branded.
But the stream was a single thin thread over a 31-second pour and the crema it left was flat tan
with coarse rim bubbles - no flecking, no bloom at the impact point. A six-second loop was cut
(35.5-41.5s, dissolve seam, white balance half-corrected) and put beside the current hero at
desktop and phone width: a nicer cup holding a weaker coffee, and on a phone the coffee became a
strip under the header with the headline over the saucer pattern. `MOV_3882` (true top-down, spoon
stir) confirmed the MOV_3865 lesson a second time: a stirred or settled cup is a still, not a
loop. Two things from that attempt change the brief below:

- **The pull is the shot.** Everything else in the brief is now proven achievable; the one thing
  that failed is the coffee. Use a full-bodied stream (double spout or bottomless basket) so the
  crema flecks, and let the stream run long enough to cut ten steady seconds from.
- **Straight down is impossible on this machine, and was proposed here before that was checked
  (Steve, 2026-09-15).** The group head hangs from the machine's own "porch ceiling" over the
  drip tray, so no camera or mirror gets a vertical line of sight onto a cup while it is being
  filled. `MOV_3882` was top-down only because the cup had been moved out onto the open counter
  after the pull, which is exactly why it had no stream. The angle is therefore fixed at roughly
  45 degrees by the hardware, and the two levers that remain are the ones below: the cup's
  proportion and the stream.
- **The cup's shape matters more than its pattern (Steve, 2026-09-15, after `MOV_3883`).** The
  blue-and-white cup is tall and narrow, so from 45 degrees the coffee surface is a thin ellipse
  and the stream runs down the inner wall; three takes in it never showed crema the way the wide,
  shallow Pienza cup did in one. Next cup: a wide, low bowl, the classic tazzina proportion. The
  camera is not the limit - 1080p at 21 Mb/s is sharp and the crop is native; 4K buys nothing
  here. The blue-and-white cup reads Italian at a glance where the Pienza cup did not; Steve to
  say where it is from before it is leaned on. Daylight, not the overhead lamp: 3881 carried a tungsten
  cast on the glaze and a lamp hot-spot on the inner rim, both named in the brief above and both
  present anyway.

**Production note:** in the real store the hero is a video section with the media on Shopify
**Files** (`video_tag`), not a theme asset. The theme-asset route is the POC mock.

## 1. The three landing-page slots — TEMPORARY STAND-INS, must not ship

Built in POC13. All three are Steve's own phone photos, re-encoded q82 progressive and stripped of
metadata, named `ci-temp-*` **so one grep finds everything that must go**:

```bash
grep -rn "ci-temp-" --include=*.liquid --include=*.css --include=*.js .
```

Each slot keeps its full brief in a `PROD:` comment beside the `<img>` in
[templates/index.liquid](templates/index.liquid). Summarised:

| Slot | Asset | Ratio / size | Brief |
|---|---|---|---|
| ~~1 — band under the hero~~ | ~~`ci-temp-lp1.jpg`~~ | — | **RETIRED in POC30 (2026-09-12, Steve).** With a video hero above it the page ran video, copy, photo; the band was the weakest of the three and its stand-in (a US café) could never ship. Markup and asset deleted. If an Italian bar-counter shot ever exists, it has no slot on the home page now and would need one made. |
| 2 — founder portrait | `ci-temp-lp2.jpg` | 4:5, ~1000x1250 | Steve at a caffè table in Campiglia or Sarteano. Candid, mid-conversation, not looking at the lens. The story is first-person; a face is what earns that register. |
| 3 — product | `ci-temp-lp3.jpg` | 3:2, ~1500x1000 | One of OUR roasters' own valve bags, sealed, label facing, close enough to read the roaster's name. Loose beans alongside. |

**Slot 3 carries a recorded reason it cannot ship** (slot 1's US-café reason went with the slot):

- **Slot 3** shows **third-party trademarks** (Lavazza, plus a US roaster). It puts other
  companies' marks on our landing page, and Lavazza is mass-market — the precise opposite of the
  artisan sourcing the surrounding copy claims.

All three must satisfy Brand Standards §3.5: natural light, low saturation, narrow depth of field.
Never generic barista stock, vector illustration, or decorative coffee-bean borders.

One file per slot serves both desktop and phone via `object-fit:cover` with a per-slot
`object-position`, so a delivered shot needs headroom at the stated ratio's crop edges.

## 2. Product photography — none exists

Every product tile and every product-detail-page slide is a **CSS-tinted placeholder** carrying a
text label (`{"cls":"p","label":"Gardelli · Ethiopia"}` in `assets/ci-catalog.json`), not an image.
The PDP gallery mechanism is built and working (arrows, tap-halves, swipe, thumbnail strip,
looping) — it is waiting on content, not code.

Per SKU, the gallery expects three slides: **front / back / label close-up**.

This is the largest single volume of work in this file and it is gated on something outside our
control: **the roasters have not signed yet**, so there are no real SKUs to photograph. See
[POC11_change_list.md](docs/POC11_change_list.md) §0 — the catalog is fixture data, and no review
may draw conclusions about it.

## 3. Roaster portraits and brand logos — none exists

Each roaster's hero tile and index row uses the same `.roaster-portrait` CSS placeholder with the
roaster's name as text (`portrait_cls` + `label` in the catalog). Real assets needed per roaster:

- The roaster's own **brand logo**, supplied by them (not recreated by us).
- Optionally a **place or process shot** — roasting drum, hands at work — consistent with §3.5.

Also gated on the roasters signing.

## 4. Team and partner headshots — one of four missing

| Person | Role | Photo |
|---|---|---|
| Lucia Calò | Operations Manager - Italy | ✅ `ci-lucia.jpg` |
| Asia Chirdo | Board Advisor - Italy | ✅ `ci-asia.jpg` |
| Lauren Roberts | Operations Manager - US | ✅ `ci-lauren.jpg` (POC29, 2026-09-03) — **a retouch, see below** |
| Partner 1 | Freight Forwarder - Italy | ❌ none — placeholder name too, pending a signed partner agreement |

Only **Partner 1** is outstanding now, blocked on a signed partner agreement — not on us. Steve's
rule stands: **no team member or partner ships without full data** (name, role, photo, bio).

> **`ci-lauren.jpg` is a RETOUCHED photograph and the only one on the site that is.** Steve's source
> has her holding a **matcha**, which on the About page of an Italian coffee importer reads wrong, so
> at his direction the drink was recoloured to a cappuccino. Only **hue** moved — saturation and
> brightness are untouched, so the rosetta, the surface sheen and the rim shadow are the original
> photograph's, and the change is confined to `(206,389)-(313,423)`, the liquid and the residue on
> the front lip. Recorded here rather than only in the §9 log because **this is the list someone
> reads when replacing photography**, and a later reader comparing the asset against the original in
> `Operations\People\Lauren Roberts\` would otherwise find a difference with no explanation. The
> retouched full-resolution master is saved beside it as `Lauren Headshot - Cappuccino.jpg`. This is
> **not** a `ci-temp-*` stand-in: it is Steve's own photograph of his own team member, cleared to
> ship, and nothing here needs replacing before launch.

## 5. Already real, no action

For completeness, so nobody "fixes" these: `ci-founder.jpg` (About founder tile),
`ci-company.jpg` + `ci-company-door.jpg` (About company tiles), `ci-signature.png` (Steve's
handwritten signature, the only handwritten element on the site), the logo set, and
`ci-og-image.png`. All Steve's own, all current.

---

## When this comes off the shelf

Order of value if photography arrives piecemeal:

0. **Slot 0 (hero video)** — the first thing every visitor sees; the stand-in is honest in subject
   and only rough in execution, so it is also the cheapest to replace (one reshoot, no roaster
   needed).
1. **Slot 3 (product)** — the landing page currently shows no product anywhere, and this is the
   one shot that illustrates the claim it sits beneath.
2. **Slot 2 (founder)** — the current stand-in is at least genuinely Steve; least wrong of the three.
4. **Product + roaster assets** — largest volume, but gated on signatures, so it will arrive on the
   roasters' schedule rather than ours.

Note that item 5 of the POC13 entry in `CLAUDE.md` §9 and the "Team/partner section photos and
roaster/product-tile photos are all text placeholders" line in §10 both point here. This file is
the detail; those are pointers.
