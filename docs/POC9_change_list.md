# POC9 change list — Regions page refresh + responsive map

> ✅ **BUILT 2026-07-17** (all 9 items) — committed, verified end-to-end in `shopify theme
> dev`. **NOT yet deployed** to a preview theme (awaiting Steve's go-ahead) and **not yet
> pushed to GitHub** at time of writing. Locked decisions (Steve): A dots+legend map on
> mobile · B English-first names (single name for identical regions; keep Puglia/Lazio) ·
> C remove header search · D one region filter object, per-surface selection (resets between
> Shop/Roasters) · E contact radios, default Other, Name/Email/Message required · F shelf
> card tightened too · em-dash exception kept on the map. Below is the original spec + the
> build notes per item.
>
> _(Original planning banner, for context:)_ Captured 2026-07-15; the ask, analysis, and
> open questions were preserved here before the build.

## The ask (Steve, 2026-07-15)
Three things, all on the storefront **"Roasting Regions of Italy"** page (`#page-regions`):

1. **Sync the inlined SVG map to the new source.** Cowork delivered a refreshed canonical
   map — `Region_Map_v2.svg` (see the handoff below). Redraw the theme's inlined map from
   it so the theme copy and the OneDrive source stay in sync. **The map stays in Italian**
   — Steve likes it that way ("The map, shown in Italian is great").
2. **Make the SVG map responsive for mobile.** The map must be readable on phones, not just
   desktop. (Design decision pending — see Open Question 1.)
3. **Reformat the lower region list to English-first.** In the "The regions" list beneath
   the map, show the **Americanized (English) name first**, then the **Italian name in
   italics and parentheses**, e.g. **Tuscany (*Toscana*)**. Rationale (Steve's words): the
   map is Italian and great, but a reader who's confused can scroll down and "immediately
   feel at home in English with clear referential meaning for titles, and for the map."

## Source of truth
- **Handoff:** `<OneDrive>\CremaItalia LLC\Coordination\region-v2-handoff-2026-07-15.md`
- **New map source:** `<OneDrive>\CremaItalia LLC\Operations\In USA\shopify\Region_Map_v2.svg`
  (supersedes `Region_Map_v1.svg`, formerly `07_Region_Map.svg`).
- **Reference doc:** `Region_Reference_v2.docx` (same folder).
- Locked Italian region vocabulary (matches live POC filters): **Piemonte, Lombardia,
  Trieste, Toscana, Lazio, Campania, Puglia, Calabria, Sicilia** (+ Emilia-Romagna and an
  "Other" bucket in the *filter* only; the nine-culture map omits Emilia-Romagna).

## What changed v1 → v2 in the map (from the handoff)
- Nine titles set to the locked Italian vocabulary.
- Leader lines re-anchored to each label block's edge/corner so none crosses text.
- Five descriptions rebalanced to even two-line blocks; label columns arranged as a `( )`
  frame; Lombardia lifted clear of the NW coast; **Sardinia removed**; legend centered on
  x=320.

## Files in scope
- `templates/index.liquid` — `#page-regions` block (lines ~266–357): the inlined `<svg
  id="region-map-svg">` and the `.region-list` markup below it.
- `assets/ci-storefront.css` — `.region-map` (line ~514), `.region-list` / `.region-row`
  / `.region-meta` / `.region-desc` / `.region-here` (lines ~514–520), and the mobile
  media queries. (Map responsiveness lives here.)

## Implementation notes / gotchas
- **Em-dash rule (§6) — DELIBERATE EXCEPTION for the map (Steve, 2026-07-15).**
  `Region_Map_v2.svg` uses em-dashes (`—`) in the sub-labels (e.g. "Lightest of all —
  clean,"). Steve authorized keeping them **as an exception to the §6 no-em-dash rule** —
  "It's a map with descriptions, so in this case I think it stylistically works." So we
  inline the v2 SVG sub-labels **verbatim, em-dashes and all** (no ` - ` conversion).
  **Scope of the exception:** the SVG map sub-labels only. The `.region-list` region
  descriptions below the map and the hero paragraph are ordinary body prose and stay on
  the §6 spaced-hyphen convention. (If Steve later says the list should match, extend it.)
  This is a localized build decision; the §6 rule and Brand Standards v2.1 are unchanged —
  revisit only if Steve wants a general carve-out.
- **Map stays Italian** — only the list below goes English-first. Don't touch the SVG
  `<text>` labels' language.
- The current `.region-map` CSS is `width:100%;max-width:640px;height:auto` — it scales
  proportionally, but at a 640×460 viewBox the 14px/11px label text renders ~8px/~6px on a
  375px phone: legible geometry, illegible text. That's the responsiveness problem to solve.
- The `#region-map-svg` styles are inlined in a scoped `<style>` inside the SVG; mobile
  overrides can be added there or in `ci-storefront.css` under the existing phone media
  query.

## Proposed English exonym mapping (for Open Question 2)
| Italian (map + filter) | Proposed English (list) | Notes |
|---|---|---|
| Lombardia | Lombardy | distinct |
| Piemonte | Piedmont | distinct |
| Trieste | Trieste | city name — no English variant |
| Toscana | Tuscany | distinct (Steve's example; note his ask typo'd it "Tuscana" — correct Italian is **Toscana**) |
| Lazio | Lazio | English commonly "Lazio" (archaic "Latium") |
| Campania | Campania | same in English |
| Puglia | Apulia? / Puglia? | formal English is "Apulia"; many Americans know it as "Puglia" — needs Steve's call |
| Calabria | Calabria | same in English |
| Sicilia | Sicily | distinct |

## OPEN QUESTIONS (answer before building)
1. **Mobile map treatment.** Nine two-line labels in left/right columns can't fit legibly
   on a phone no matter the font size. Which approach?
   - (a) *Simplified map on mobile* — keep the Italy outline + colored dots + centered
     legend, drop the crowded side-labels on phones; the English list right below carries
     every region's name + detail. Full labelled map on desktop. **(Recommended — cleanest,
     on-brand, no redundancy.)**
   - (b) *Enlarge labels on mobile* — bump the SVG text sizes; map grows taller. (Risk:
     labels overlap; likely still cramped.)
   - (c) *Horizontal scroll* — keep the full map at a min width and let it scroll sideways
     on phones.
2. **English name format for same-word regions.** For Trieste / Lazio / Campania / Calabria
   the English and Italian are identical. Show a single name (no redundant "Calabria
   (*Calabria*)")? And the two judgment calls: **Puglia vs Apulia**, and **Lazio vs Latium**
   — which does Steve want?
3. **Deploy?** Same pattern as prior POCs — build → verify → commit/push → deploy to a new
   "Crema Italia POC9 Preview" theme (needs Steve's go-ahead). Storefront password is still
   OFF, so a preview link works cross-device for the mobile check.

## DESIGN DIRECTION — home "Our roasters" section scale (Steve, 2026-07-17)
**Problem Steve raised:** the home page "Our roasters" grid (`#home-roasters`, populated in
`assets/ci-storefront.js` `renderAll()` → `roasterHomeCard` over **every** roaster in
`CATALOG.roasters`) grows 1:1 with the roster. Fine at 5 roasters (Tuscany only); becomes a
runaway scroll as regions expand. Also a brand tension: a wall of roaster cards reads as
*aggregation*, contradicting "a small group, each with a big story / curated, never aggregated."

**Options considered (Steve's 1–4 + my rec):**
1. Remove the section from home entirely.
2. Recreate it with a By-Region filter, one region enabled at a time.
3. Remove the grid; link to the Roasters page from the "Our model" section.
4. *Featured teaser + link* (my earlier rec): a fixed ≈3 `featured` roasters + a link. **Rejected
   by Steve** — a curated few "could be seen as playing favorites to those three" among partners
   presented as equals. Valid brand-relationship concern.

**DIRECTION CHOSEN (Steve leans to "just a link", i.e. option 3, done cleanly):**
- (a) **Remove** the `#home-roasters` grid from the home page.
- (b) **Rewrite** the "Our model" closing line — currently *"Scroll down to meet our roasters."*
  (`templates/index.liquid` line ~51) — to a contextual link, e.g. *"Meet our roasters →"* →
  `showPage('roasters')`. Keep the adjacent "Do you have a roaster you'd like us to consider?
  Email me here." line.
- (c) **Drop** the now-orphaned **"Roasters" home-jump chip** (`templates/index.liquid` line ~32,
  `jumpHome('sec-roasters')`) — that sticky bar is for jumping *within* the home page, and there's
  no roasters section left to jump to. Home-jump bar becomes **Our story · Shelves · Promise ·
  Tasting Quiz**. Also drop/relocate the `id="sec-roasters"` anchor.
- **Keep** the top-nav "Roasters" item (global nav — not redundant with the inline link).
- Region browsing (option 2's mechanic) is NOT on home; it belongs on the **Roasters page** as a
  future follow-on when the roster spans multiple regions.

**Status: DIRECTION ONLY — not a build order.** Pick up and complete in detail when building POC9.
Files it will touch: `templates/index.liquid` (grid removal, "Our model" link, jump-chip + anchor),
`assets/ci-storefront.js` (`renderAll` no longer needs the `home-roasters` render; `roasterHomeCard`
may become dead code — check before deleting). No `ci-catalog.json` change needed for this option.

## OPEN ITEM — main-toolbar Search control is misleading (Steve, 2026-07-17)
**Problem:** the header's magnifying-glass button (`snippets/ci-header.liquid` line ~33,
`class="icon-btn" ... onclick="showPage('shop')"`, with a `.btn-label` "Search" that also shows
in the mobile hamburger panel) performs **no search** — it just navigates to the Shop → All
Shelves page. A magnifying-glass icon promises a search field, so the behavior reads as broken/
confusing. It's the only search control in the theme (verified — single occurrence).

**Two ways to resolve (needs Steve's call):**
1. **Remove the control** — drop the icon button (desktop icon + mobile-panel row). Cleanest for
   now; with a small catalog, the Shop page + the 3-axis filters + the Shop dropdown already cover
   findability, and it removes a UI element that lies about its function (on-brand: fewer elements).
   Real search returns at production via **Shopify native predictive search + a search results
   page**, when the catalog size justifies it.
2. **Build a true site-wide search** — a real search field/overlay. In the POC SPA this means
   building client-side search over `ci-catalog.json` (products + roasters + maybe pages); in
   production it's Shopify's native search. More work; arguably premature for a small pre-launch
   catalog.

**My lean:** option 1 for POC9 (remove the misleading icon now), and note option 2 as the
production plan (native Shopify search) in `docs/production_build_spec.md` when we build POC9.

**Status: UNDECIDED — needs a solution before launch.** Touches: `snippets/ci-header.liquid`
(the icon button + mobile row); if removed, check `ci-storefront.css` for now-unused `.icon-btn`/
search styles and the mobile-panel layout. No JS logic beyond the inline `onclick`.

## COPY — Promise page eyebrow (Steve, 2026-07-17)
On the **Promise page** (`#page-promise`, the footer "Our Promise" link target;
`templates/index.liquid` line ~473), replace the eyebrow **"What we mean"** with
**"Our commitment to you"** — consistent with the home page's committal framing of the same
section (home eyebrow "The Crema Italia Promise" / headline "We deliver on these promises.",
line ~73). Notes: use the standard spelling **commitment** (single middle *t*); write it in
normal case — eyebrow labels are auto-uppercased by CSS, so it renders in caps like the others.
Single-line change; no other Promise-page copy affected. **Direction recorded, not a build order.**

## TODO — Roasters page: "Filter By Region" toggle reusing the ONE region filter object (Steve, 2026-07-17)
**Ask:** add a **"Filter By Region"** hyperlink to the **Roasters page hero** (`#page-roasters`,
`templates/index.liquid` ~line 205–213). Behavior:
- Click **"Filter By Region"** → opens the region filter object in/under the hero.
- While open, selecting a region filters the visible **roaster list** (`#roaster-list`) to that region.
- The same link **renames to "All Regions"** while the filter is open; clicking **"All Regions"**
  **clears the filter (show all roasters) AND closes** the filter object. (One link, toggles
  Filter By Region ⇄ All Regions.)

**CORE REQUIREMENT (Steve, emphasized): ONE region filter object — no branches/copies.** The region
filter must be a **single reusable object** used everywhere it appears (Shop hero + Roasters hero,
and anywhere later), so the region list, labels, and enabled/greyed ("as we grow") states are
defined **once** and can't drift. Today they're duplicated: hardcoded pill markup in the Shop hero
(`templates/index.liquid` 99–115) + a partial `REGION_LABEL` map in `assets/ci-storefront.js`
(~line 166, only 4 entries) + hardcoded disabled pills. The build should extract this into a single
canonical component (e.g. a `snippets/ci-region-filter.liquid` partial and/or a single JS-rendered
control driven by one `REGIONS` config) and have both pages consume that one object.

**Current mechanics to reuse:** `filterRegion(el,val)` sets `activeRegion` + calls `applyFilters()`
(`ci-storefront.js` ~497, ~621) — but that path filters the **product grid** (`data-region` on
product cards). The Roasters use needs the same selector to also filter **roaster rows** — verify
each roaster record carries a filterable region **key** (not just `region_label`) so roasters can be
matched the same way products are; add one if missing. Keep the locked Italian vocabulary + the Tour
BOM region-union behavior already built.

**OPEN SUB-DECISIONS (resolve at build, don't guess):**
1. **Shared live selection vs shared definition only.** Because it's the *same object* sharing
   `activeRegion`, does a region picked on Roasters also pre-filter the Shop grid (one shared
   selection), or does each page share the *component* but keep its own current selection? Steve to
   confirm — his "same object, no branches" clearly mandates a single *definition*; whether the live
   selection is shared is the open part.
2. **Shop presentation.** On Shop the filter is currently always-open inline; on Roasters it's
   open-on-demand via the link. The one object needs an open/closed capability (Shop renders it
   pinned-open, Roasters toggles it). Confirm Shop keeps its always-open inline treatment.

**Status: TODO recorded, not a build order.** Touches: `templates/index.liquid` (Roasters hero link
+ Shop hero refactor to the shared object), `assets/ci-storefront.js` (`filterRegion`/`applyFilters`
to also filter roasters; single `REGIONS` config; open/close state), likely a new
`snippets/ci-region-filter.liquid`, and `assets/ci-storefront.css` (toggle/open-close styles). Also
relates to the "home roasters → just a link" direction and the future Roasters-page region browsing
noted there — this IS that region-browsing mechanic.

## POLISH — About "Our company": align "The Three P's" to the top of the second image (Steve, 2026-07-17)
On the **About page** "Our company" section (`#page-about`, `templates/index.liquid` ~lines 383–404),
the two-column `founder-grid` has, in the **left** column, two stacked images — the **Tuscany** square
(`ci-company.jpg`) on top, then the larger **caffè-door** photo (`ci-company-door.jpg`, "Sarteano")
below — and, in the **right** column, the prose. Steve wants the **"The Three P's" block** (the
`<h3>The Three P's</h3>` + the `.beats` Place/Product/People bold paragraphs) shifted down so its **top
aligns with the top edge of the second image** (the caffè-door photo). Cosmetic polish only; no copy
change. Steve likes the two-different-images treatment as-is.

**Build notes / caveats:**
- Applies only at the **two-column (desktop) width**. On phones the `founder-grid` stacks to a single
  column, so there's no second image beside the text — scope the alignment to the desktop media width
  and don't disturb the mobile stack.
- Cross-column vertical alignment is inherently fragile (depends on prose reflow at a given width).
  Prefer a robust approach at build (e.g. a measured `margin-top` on the Three P's block at the
  desktop breakpoint, or a small layout restructure) over a brittle magic-number that breaks if the
  intro copy length changes. Verify visually at the real breakpoint.
- Touches: `assets/ci-storefront.css` (likely) and possibly a wrapper/class in
  `templates/index.liquid`. **Direction recorded, not a build order.**

## COPY FIX — Shipping page wrongly implies one-time Roccia ships free (Steve, 2026-07-17)
**Bug:** the **Shipping page** (`#page-shipping`, `templates/index.liquid` line ~504) reads:
*"**Free** on every Roccia shipment, and free on one-time orders of $55 or more. A flat **$8.50**
applies to one-time orders under $55."* The phrase **"every Roccia shipment"** sweeps in **one-time
Roccia purchases**, which are **not** automatically free. Free shipping is a **subscription** benefit
(tied to an active subscription — Store Operating Standard shipping-offset rule); a one-time Roccia
order follows the normal one-time rule ($55 threshold, else $8.50 flat).

**Proposed correction (confirm at build):** bind "free" to the subscription —
*"**Free** on every Roccia **subscription** shipment, and free on one-time orders of $55 or more. A
flat **$8.50** applies to one-time orders under $55."*

**Related consistency spot (Steve to decide if in-scope):** the home **shelf card** for Roccia
(`templates/index.liquid` line ~58) — *"Subscription (and one-time ordering) - free shipping and a
10% discount."* — has the same latent conflation (reads as if one-time Roccia gets free shipping +
10%). The Roccia page (line ~135, *"**Subscribers** receive... free U.S. shipping"*) is already
correct. Consider tightening the shelf card in the same pass.

**Also verify against the Store Operating Standard** that the corrected wording matches the actual
shipping-benefit rule (subscriber free shipping scope: subscription shipments vs all orders while
holding an active sub) so we don't trade one inconsistency for another. **Direction recorded, not a
build order.**

## TODO — Contact Us footer link + contact form with routing (Steve, 2026-07-17)
**Ask:** add a **Contact** link to the storefront footer (`snippets/ci-store-footer.liquid` — currently
Promise · Shipping · About · FAQ · Journal) opening a new **Contact page** (`#page-contact`, styled like
the Shipping/FAQ prose pages, reachable via `showPage('contact')`). The page holds a **contact form**:
- Fields: **Name**, **Email**, **Phone**, **Message**.
- A category selector routing the message to a destination inbox:
  - **"More info"** → **info@cremaitalia.com**
  - **"I need help"** → **support@cremaitalia.com**
  - **"Other"** → **contact@cremaitalia.com** (also the default/base address Steve confirmed)
- On **Send**, deliver Name/Email/Phone/Message to the routed recipient.

**POC vs PRODUCTION reality (important):**
- **POC:** the send is **MOCKED** — the SPA has no backend. Build the full form UI + validation and a
  "message sent" toast (like cart/checkout), with a `<!-- PROD -->` seam. Do NOT imply a real email
  goes out in the POC.
- **PRODUCTION:** Shopify's native `{% form 'contact' %}` posts to Shopify and emails a **single** store
  address — it does **not** natively route to different inboxes by a checkbox. So multi-inbox routing
  needs one of: (a) a form/contact app that supports conditional routing, or (b) route everything to
  **contact@** and carry the chosen category in the subject/body so a server-side mail filter fans it
  out to info@/support@. Decide at build. Native contact form has built-in spam protection; if using a
  custom/app path, add spam protection that does NOT rely on the user solving a CAPTCHA on our behalf.

**PREREQUISITE (Steve's side, not code):** the mailboxes **contact@ / info@ / support@ @cremaitalia.com**
must exist for routing to land. contact@ confirmed; info@ + support@ to be set up.

**OPEN BUILD DECISIONS:**
1. **Selector control:** Steve said "little tickboxes," but each routes to ONE destination — **radio
   buttons (pick one)** are cleaner than checkboxes (ambiguous if two are ticked). If checkboxes are
   kept, define behavior for none/multiple selected (default to contact@?). Confirm.
2. **Required vs optional fields** (e.g. phone optional; email required) and validation messages.
3. Copy honors brand voice — no em-dashes (§6), no exclamation marks, editorial tone.

**Status: TODO recorded, not a build order.** Touches: `snippets/ci-store-footer.liquid` (link), a new
`#page-contact` block in `templates/index.liquid`, `assets/ci-storefront.js` (mock submit + validation),
`assets/ci-storefront.css` (form styles). Relates to `production_build_spec.md` footer-relationship
pages (Contact was already anticipated there) — update that spec with the routing approach at build.

## Not in scope (unless Steve says otherwise)
- The region **filter** on the Shop page (stays Italian-only, per locked vocabulary).
- The Regions page **hero** copy (already English; "We are in Tuscany now …").
- Emilia-Romagna / "Other" — filter-only, not on this nine-culture map.
