# POC33 — change list

> **Deployment state is NOT recorded here.** The one authoritative statement of what is deployed
> is `CLAUDE.md` §10 CURRENT STATE. This file is the build record only.

Built 2026-10-20, two commits. Two real photographs replace two `ci-temp-*` stand-ins on the
landing page. No template logic, CSS or JS changed; the two `<img>` tags and their provenance
comments are the only markup edits.

## 1. Slot 2 — the founder portrait (`2da58fb`)

| | |
|---|---|
| Was | `ci-temp-lp2.jpg` — a street café reading French, beer in the foreground, wine in hand, a branded umbrella. Flagged "must not ship" since POC13 and, on re-reading, simply the wrong picture under copy about pulling a shot of espresso. |
| Now | `ci-founder-caffe.jpg` — Steve at an Italian bar counter, cup in hand, machine and barista behind him, candid, not looking at the lens. The brief the slot carried since POC13, met. |
| Source | `Operations\People\Steve Roberts\Standing in caffe.jpeg`, 1600x1200. Not the phone original (it came through a messaging app, which resizes on send); enough for a slot that renders at 300–320 CSS px. |
| Cut | 4:5 from the right edge; exposure +8%, no saturation change. Cut from the unedited file rather than Steve's colour grade: 30% more pixels across the band, and the grade pushed skin toward pink. |
| Retouch | Steve levelled it by about a degree and removed the sunglasses hanging from his collar with an AI fill (`Standing in caffe_sunglasses_removed.jpg`, 900x1131, trimmed to an exact 900x1125). **Face softening was discussed and declined** — at ~100 px across on the page it buys nothing visible and risks the processed look Brand Standards §3.5 rules out. |
| Cap | Carries a car maker's badge. Flagged as a trademark problem, and Steve was right that it is not: incidental use of a cap he bought and wore implies no sponsorship. The Lavazza bag it was compared to was a brand-fit problem, not a legal one. Left as shot. |
| Output | 900x1125, q82 progressive, metadata stripped, 148 KB. |

## 2. Slot 3 — the roaster visit (`cb679e0`)

| | |
|---|---|
| Was | `ci-temp-lp3.jpg` — a Lavazza bag and a US roaster's bag. Could never ship: third-party trademarks, and Lavazza is mass-market under artisan-sourcing copy. |
| Now | `ci-roaster-visit.jpg` — Steve in a roasting room with the roaster and a fellow visitor, tasting cup and sheet in hand, hopper and ducting overhead. Under the Our model copy it illustrates *"when the same name keeps coming up, we go and visit"* directly. |
| Source | `Operations\People\Steve Roberts\Visiting a Roaster.jpeg`, 1200x1600 (also messaging-app size; this is the one photo on the site worth having at full resolution — it renders up to ~770 px wide). |
| Cut | The 3:2 band from row 340 down, full width, 1200x800. **It ends above the roaster's branded bag**, so the blur Steve asked for was not needed: nothing in frame names the roastery. The hopper label is a generic sticker, illegible at 2x. |
| The visitor | Not Lucia, as first assumed — a private individual. A visitor-out crop (from x=200, 999x666) was cut and compared side by side: in it the roaster looks out of frame at nobody, because the person she is answering has been removed. The full band shipped; the cropped cut is the fallback if the visitor declines, held beside the session scripts and not in the theme. |
| **Consent gate** | **May not go public until (a) the roaster has signed and agreed to appear and (b) the visitor has agreed.** Steve holds both contacts. Recorded in the template comment, `docs/photography-todo.md` and the build spec asset table. Not a `ci-temp-*` stand-in: it is the right picture, waiting on permission rather than a reshoot. |
| Output | 1200x800, q82 progressive, metadata stripped, 154 KB. |

## Still owed

The **product shot** slot 3 was briefed for — one of OUR roasters' sealed valve bags, label
readable, loose beans alongside, 3:2 — is gated on a roaster signing and remains so. When it
exists it wants a slot of its own near the shelves rather than displacing the visit photo. The
first audit's "no product visible anywhere on the landing page" stays open until then.

The **hero video** is now the only `ci-temp-*` asset on the site (`docs/photography-todo.md` slot 0).

## Verification

`node --check` and `JSON.parse` clean. `theme check` 9 offenses / 0 errors — the baseline moved
from 15 because the Shopify CLI self-upgraded 4.8.0 → 4.9.4 on 2026-10-20; the untouched POC32
commit reports the same 9 under it, so **0 new**. Both slots looked at on the dev server at 1174
and 375 px: slot 2 at 300x375 and 320x400, slot 3 at 772x515 and 343x229, no overflow, the
sunglasses fill and the softening invisible at page size.
