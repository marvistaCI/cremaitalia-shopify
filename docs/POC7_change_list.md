# POC7 - Change List (working ledger)

Detailed record for the POC7 batch (2026-07-13), built interactively with Steve on top of
the deployed POC6. Same role as the earlier change lists: this is the granular record; the
durable summary lives in `CLAUDE.md` §9 (2026-07-13 entries).

Architecture unchanged from POC3-POC6 - the custom-Liquid SPA (`templates/index.liquid` +
`layout/theme.liquid`, `assets/ci-storefront.css|js`, baked-in `assets/ci-catalog.json`,
`snippets/ci-*`). This pass is the **responsive/mobile-ready** work plus minor visual/copy
fixes. Verified via DOM geometry across phone/tablet/desktop (the browser-pane screenshot
tool was wedged again this session).

---

## 1. PRIMARY - fully responsive mobile & tablet (the mock rehearsal for spec §8)

### 1a. Mobile/tablet hamburger header (keystone)
The header was desktop-only: at narrow widths it wrapped to ~3 rows (~146px tall) and the
Shop/Account dropdowns were hover-only (unreachable on touch). Rebuilt:
- **Below 1024px OR on any touch device** (`@media (max-width:1024px), (hover:none) and
  (pointer:coarse)`) the header collapses to a clean **62px** single-row bar: logo left,
  hamburger right. This catches phones and tablets in portrait AND landscape (large iPads in
  landscape are >1024 but coarse-pointer, so they still get the tap-first menu).
- Tapping the hamburger opens a full-width **tap-first panel**: Shop with all five shelves
  listed inline, Bottega/Roasters/Journal/About, then Search, Cart, and Sign-In (or
  Account/Subscriptions/Sign-out when signed in). Selecting anything closes the panel and
  navigates. New JS: `toggleMobileMenu()` / `closeMobileMenu()` wired into `showPage()` and
  `openSignin()`. New markup: a `.hamburger` button + mobile row labels in `ci-header.liquid`.
- **Desktop (>1024px with a mouse) is completely unchanged** - verified (inline nav, hover
  dropdowns, desktop pill sizes all intact).

### 1b. Sticky home-jump chip bar
Was pinned at `top:52px` while the header was 146px, so it was buried 94px behind the header
when scrolled. Now clears the 62px mobile header (`top:61px`) and collapses to one compact,
horizontally-scrollable, tappable row instead of a 292px wall.

### 1c. Touch targets (aim >=44px)
Sized up across phone/tablet: nav rows 48px, Shop-hero shelf/region filter pills 44px, product
gallery arrows 44px, cart quantity steppers 40px, modal close 44px. (Quiz options were already
~105px.) Placed after the component base rules so the overrides win the cascade; the
home-jump-<nav> chip sizing is scoped so it does not leak into the header nav.

### 1d. Verified
- Header: 146px -> 62px on phone; home-jump visible (not buried) when scrolled.
- No horizontal overflow on any of the 12 pages at 375px, phone landscape (812x375), tablet
  portrait (768) and landscape (1024x768).
- Signed-in account links render inline in the panel; hamburger opens/closes on real click;
  nav selection closes the panel + navigates.

## 2. SECONDARY visual fixes

### 2a. Header tricolore - single clean line (Steve)
Dropped the 1px `#333` underline beneath the header's 1px tricolore strip. The strip's middle
third is cream (invisible on the cream page), so this reads as an airy tricolore line rather
than a doubled dark rule. The **footer** strip keeps its hairline for now (Steve scoped the
change to the header).

### 2b. Dead-CSS sweep
Removed the orphaned taste-UI rules unused since the POC6 ribbon/console redesign:
`.taste-console` + `.tc-head/.tc-label/.tc-note/.tc-foot`, `.save-profile`, `.filter-bar`,
`.filter-row`, `.filter-divider`, `.pf-hint`. All verified to have zero markup references; the
live `.taste-console-modal`, `.tc-groups`, and `.filter-group/.filter-label/.filter-pills`
classes were kept.

### 2c. Home copy fix (Steve)
Home hero subhead: "Italian Bar (Café)" -> "Italian Bar (Caffè)" (`Caf&eacute;` ->
`Caff&egrave;`, matching the site's `caff&egrave;` convention).

## 3. Brand rule + em-dash sweep

New brand rule (Steve, 2026-07-13): **no em-dashes in customer-facing copy** - they read as
AI-generated. Recorded in `CLAUDE.md` §6 (never-do list) and §9. Replacement rule: where a
semicolon would work, a spaced regular dash (` - `); where a sentence trails into a sequenced
next thought, an ellipsis (`...`); ambiguous cases asked.

Swept every customer-facing file, both the literal `—` character AND the `&mdash;` HTML entity
(the entity is what the first pass missed - the hero, About, Regions, and the page `<title>`):
- `templates/index.liquid`, `assets/ci-catalog.json`: all dashes.
- `assets/ci-storefront.js`: 22 rendered strings converted; code/`<!--` comments preserved.
- `snippets/ci-header`, `snippets/ci-quiz-modal`: dashes + one ellipsis
  ("Not sure yet... skip this one").
- Coming-soon files (`live-theme/`, `templates/password.liquid`, `layout/password.liquid`,
  `layout/theme.liquid`): `&mdash;` in titles/hero/og:title/twitter:title -> dashes.

Verified in the **rendered DOM**: zero em-dashes across all 12 pages, quiz modal, product
detail, and the `<title>` tag. Every remaining `—` in the codebase is an internal comment.

**Three judgment calls flagged for Steve** (made dash/ellipsis, easily changed):
- Quiz "Not sure yet... skip this one" (ellipsis)
- About "Stay tuned - I've a few lives remaining" (dash)
- Coming-soon form error "That does not look like a valid email - try again?" (dash)

## Follow-ups / notes

- **Ribbon height on phone** (~150px, status+tags+actions wrapping) and **About team/partner
  cards stacking one per row** - both functional, flagged for Steve's eye, easy to tighten.
- **Footer tricolore hairline** left in place (item 2a) - drop for symmetry on Steve's word.
- **Coming-soon copy** (`live-theme/`, `password.liquid`) is the currently-live site's source;
  the em-dash cleanup there is staged but a push to the LIVE theme (150557294761) is a separate,
  deliberate deploy Steve must approve.
- **Coordination (Cowork lane):** the canonical OneDrive Brand Standards (v2.0 PDF + HTML §3.1
  Voice) and `Coordination/DECISIONS_LOG.md` should carry the no-em-dash rule so the source of
  truth does not drift.
- **Windows CLI note:** `shopify theme dev` hot-reload of `templates/*.liquid` still hits the
  temp-file bug ("Must have a .liquid file extension"); a dev-server restart (full upload)
  clears it. Asset/CSS/JS hot-reload is unaffected.

## Deployment

Deployed to a NEW unpublished theme **"Crema Italia POC7 Preview" (id `151449862313`)** via
`shopify theme push --unpublished --theme "Crema Italia POC7 Preview" --json`. POC6 Preview
(`151440130217`) and the live coming-soon theme (`150557294761`) untouched. Storefront password
still OFF (friend-testing), so the link works cross-device with no gate.
- Preview: `https://crema-italia.myshopify.com?preview_theme_id=151449862313`
- Editor: `https://crema-italia.myshopify.com/admin/themes/151449862313/editor`
- To refresh after edits: `shopify theme push --theme 151449862313`
