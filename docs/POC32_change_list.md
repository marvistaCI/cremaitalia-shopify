# POC32 change list - the hero video replaced (2026-09-15)

**Status:** see `CLAUDE.md` section 10 for deployment state. This file is the ledger of what
changed and why; it does not carry a deployment claim, because such claims go stale the moment
someone acts (the 2026-07-24 lesson).

One item. The home hero's stand-in loop is replaced with a take from Steve's 2026-09-15 reshoot,
and the scrim is re-tuned for it on both desktop and phone. Nothing else in the theme moved.

## The day, in order

Four clips were reviewed frame by frame (contact sheets at 2s intervals, a per-second motion
profile, and full-resolution crops of the cup at the moments that mattered), because the POC30
hero was chosen on exactly one thing - seconds 47-53 of `MOV_3863`, where a full stream lands on
crema and the flecks bloom - and any replacement had to be judged on the same thing.

| Clip | What it is | Verdict |
|---|---|---|
| `MOV_3881` | 45 degrees, tripod, blue-and-white cup on its saucer, 31s pour | Setup right, pull wrong: a single thread of a stream and a flat surface. Cut to a loop and compared on the page beside the current hero; **a nicer cup holding a weaker coffee.** Not adopted. |
| `MOV_3882` | True top-down on the counter, cup already full, a spoon stirs | A stirred or settled cup is a still, not a loop (the `MOV_3865` lesson again). Only top-down because the cup had been moved out from under the group head, which is why it has no stream. |
| `MOV_3883` | 45 degrees, lower and darker, 47s pour | Coffee streaks down the inner wall for the whole pour; same thread, same flat surface. Not cut. |
| `MOV_3891` | 45 degrees, tripod, **cup propped at the rear**, a full stream | **The keeper.** The prop drops the front rim so the surface shows; the stream is real; the surface moves with an eddy at the impact point. |

**What the day settled about the shot, recorded in `docs/photography-todo.md` slot 0:**

- **Straight down is impossible on this machine.** The group head hangs from the machine's own
  "porch ceiling" over the drip tray, so no camera or mirror gets a vertical line of sight on a
  cup being filled. The angle is fixed at roughly 45 degrees by the hardware. This was proposed
  before it was checked and is withdrawn.
- **The cup's shape matters more than its pattern.** The blue-and-white cup is tall and narrow;
  from 45 degrees its front wall hides its own surface. Three takes in it never showed crema the
  way the wide, shallow Pienza cup did in one. Next cup: a wide, low bowl.
- **The camera is not the limit.** 1080p at 21 Mb/s is sharp and the crop is native. 4K buys
  nothing here.
- **The prop works for a precise reason.** Tilting the cup does not change how foreshortened the
  surface is (the liquid stays level with gravity whatever the cup does); it lowers the front
  rim relative to the liquid, so less of the surface is occluded. That is exactly the tall cup's
  problem, so the trick is aimed at the right thing. Its cost is two ellipses that disagree - the
  rim opens toward the camera, the coffee sits level inside it - and a saucer that visibly slopes.
  Under ten degrees the eye does not compute it. It is a workaround for the wrong vessel and
  retires when the wide cup arrives.

## What shipped

- `assets/ci-temp-hero.mp4` - 1440x810, 6.00s, 30fps, H.264 yuv420p, ~411 KB (was ~710 KB), no
  audio, metadata stripped. Cut from `MOV_3891` seconds 37.5-43.5 with a 1.5s dissolve into the
  1.5s preceding the start, so the rising coffee level settles back across the seam rather than
  jumping. A partial white-balance correction (`colorchannelmixer gg=1.03 bb=1.08`) takes the
  tungsten cast off the glaze while leaving the coffee warm. The camera file is flagged variable
  frame rate, which `xfade` refuses; both segments are rendered to constant 30fps intermediates
  first, then dissolved.
- **The crop starts 340px in from the left edge of the 1920 source, and that is not a
  composition choice.** The machine's pressure gauge sits at the left edge and its dial reads
  **"LA MARZOCCO"** legibly at full resolution - a third-party trademark in the hero, the same
  class of problem as the Lavazza bag in slot 3. The crop excludes it entirely. Worth knowing
  because it fixes where the cup can sit in frame: it cannot be pushed further left.
- `assets/ci-temp-hero-poster.jpg` - the same crop at 2s into the loop, q4, metadata stripped.
- `assets/ci-storefront.css` - the desktop scrim **mirrored**: dense on the right (`270deg`, .78
  at 0%, .66 at 50%, 0 at 80%), tapering left over the cup, because this footage's dark zone is
  the black counter on the right where POC30's was the blurred machine body on the left. The
  headline moves with it: `justify-content:flex-end`, `text-align:right`, and the comment on its
  `max-width` now says "scrimmed right half". `object-position` 42% -> 40%. **The phone scrim is
  the real change** - see below.
- `templates/index.liquid` - the provenance comment names the new take and the three reasons it
  is still `ci-temp-*`. No markup change.
- `assets/ci-storefront.js` - unchanged in the end. A `?hero=b` comparison switch lived here for
  the afternoon and was removed once Steve chose.
- `docs/photography-todo.md` slot 0 - rewritten for the new stand-in, with the previous one's
  better crema texture recorded so the trade is visible: *"the crema doesn't bother me... I've
  seen a lot of shots exactly like this."*

## The phone scrim, measured

POC30's phone scrim (`180deg`, .1 to 40%, .85 at 100%) was tuned for footage whose foot was the
dark drip tray. With the new footage the foot of the 4:5 phone crop is white saucer, and the two
line-starts of the headline landed on it. Steve: *"in phone mode I can't read E of Exactly, and s
of sealed."*

Measured by the POC30 method - draw the live video frame to a canvas at the rendered crop, sample
every pixel under the H1's box, composite the scrim, compute contrast against cream, report the
**worst** pixel and not the average - four alpha profiles were scored against the same frame at
375px, H1 at 31.5px:

| Profile | Stops (alpha at % of hero height) | Worst | Average |
|---|---|---|---|
| POC30 (as shipped) | .1 @0, .1 @40, .85 @100 | **3.32:1** | 5.69:1 |
| p1 (**adopted**) | .1 @0, .1 @35, .85 @70, .9 @100 | **7.10:1** | 8.20:1 |
| p2 | .1 @0, .1 @30, .9 @65, .93 @100 | 8.16:1 | 8.92:1 |
| p3 | .1 @0, .12 @30, .92 @60, .95 @100 | 8.72:1 | 9.33:1 |

Two things worth keeping from the table. **3.32:1 passes the large-text floor (3:1) and Steve
could not read it** - the floor is a floor, and a headline that is the only text in the first
viewport wants a margin above it, not a pass. And p1 was chosen over p2/p3 not because 7.1 is
enough (all three are) but because it darkens the least of the coffee, which sits in the top
third of the phone frame and stays entirely outside the dense zone. Re-measured with the CSS
actually applied: **worst 7.1:1, average 8.2:1**, matching the model.

Desktop, same method, at 1188 wide and 54px: **worst 3.95:1, average 8.1:1**, the worst pixels at
the headline's left edge where "Exactly" crosses the cup body. Large text, floor 3:1, passes with
less margin than the phone; the desktop headline sits over the counter for most of its width and
only its first letters reach the cup.

## Verified

- Video `readyState 4`, playing, `ci-temp-hero.mp4`, 1440x810, at both widths; no comparison
  attribute left on the element; the new phone gradient is the computed style.
- Exactly one `h1` inside `#page-home`; the hero H1 text unchanged.
- No horizontal overflow at 375 or 1188.
- Looked at, not only measured: desktop and phone screenshots of the final state, and the phone
  headline is readable at the line-starts.
- `node --check` clean; `shopify theme check` at the documented baseline (see the commit).

## Not done, on purpose

- The tilt, the bubble ring, the tungsten light and the trademark crop are all recorded as
  reasons this stays `ci-temp-*`. None is fixable in the edit; all are fixable in the next take,
  and slot 0's brief now says how.
- The old take's crema texture was better. Steve chose with that in front of him.
