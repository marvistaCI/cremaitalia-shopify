# Photography — deferred, tracked here

**Status: ALL photography is deferred (Steve, 2026-08-20).** Nothing in this file blocks the
current POC work. It exists so that deferring is a decision with a ledger rather than a thing we
quietly forget. **Every item here is launch-gating** — the storefront cannot go live with the
assets it currently carries, and two of them cannot ship for legal/brand reasons, not merely
aesthetic ones.

This is the single list. When a shot is delivered, tick it here and delete the corresponding
`PROD:` comment in the code, so the code and this file cannot drift apart.

---

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
| 1 — band under the hero | `ci-temp-lp1.jpg` | 21:9, ~2200x950 (16:9 crop on phones) | An Italian bar counter mid-morning service. Cups on saucers, steam, hands at work. Nobody posing. |
| 2 — founder portrait | `ci-temp-lp2.jpg` | 4:5, ~1000x1250 | Steve at a caffè table in Campiglia or Sarteano. Candid, mid-conversation, not looking at the lens. The story is first-person; a face is what earns that register. |
| 3 — product | `ci-temp-lp3.jpg` | 3:2, ~1500x1000 | One of OUR roasters' own valve bags, sealed, label facing, close enough to read the roaster's name. Loose beans alongside. |

**Two of the three carry recorded reasons they cannot ship** — these are the blocking ones:

- **Slot 1** is a **US specialty café**: English chalkboard menu, dollar prices, matcha on the
  board. It reads American, which is the opposite of the story that section tells.
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

## 4. Team and partner headshots — two of four missing

| Person | Role | Photo |
|---|---|---|
| Lucia Calò | Operations Manager - Italy | ✅ `ci-lucia.jpg` |
| Asia Chirdo | Board Advisor - Italy | ✅ `ci-asia.jpg` |
| Lauren Roberts | Operations Manager - US | ❌ none — card is inert, bio reads "Bio under construction." |
| Partner 1 | Freight Forwarder - Italy | ❌ none — placeholder name too, pending a signed partner agreement |

Blocked on Lauren engaging and on the partner agreement being signed — not on us. Steve's rule
stands: **no team member or partner ships without full data** (name, role, photo, bio).

## 5. Already real, no action

For completeness, so nobody "fixes" these: `ci-founder.jpg` (About founder tile),
`ci-company.jpg` + `ci-company-door.jpg` (About company tiles), `ci-signature.png` (Steve's
handwritten signature, the only handwritten element on the site), the logo set, and
`ci-og-image.png`. All Steve's own, all current.

---

## When this comes off the shelf

Order of value if photography arrives piecemeal:

1. **Slot 3 (product)** — the landing page currently shows no product anywhere, and this is the
   one shot that illustrates the claim it sits beneath.
2. **Slot 1 (band)** — highest-visibility, and the current stand-in actively misrepresents us.
3. **Slot 2 (founder)** — the current stand-in is at least genuinely Steve; least wrong of the three.
4. **Product + roaster assets** — largest volume, but gated on signatures, so it will arrive on the
   roasters' schedule rather than ours.

Note that item 5 of the POC13 entry in `CLAUDE.md` §9 and the "Team/partner section photos and
roaster/product-tile photos are all text placeholders" line in §10 both point here. This file is
the detail; those are pointers.
