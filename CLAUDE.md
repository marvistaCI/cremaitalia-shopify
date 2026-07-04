# Crema Italia — Shopify Theme

This repository contains the Shopify theme for **cremaitalia.com**, the storefront for
Crema Italia, LLC — a small selective importer of artisan Italian roasted coffee beans.
Owner: Steve. Operating entity: Crema Italia, LLC, Lutz, Florida, USA.

This `CLAUDE.md` is loaded into every Claude Code session in this directory. It is the
agent's persistent project memory. Update it whenever a meaningful decision is made;
treat it as the source of truth for "how we do things here."

> **Agent coordination — Code owns this repo (Steve, 2026-07-02).** Claude **Code**
> (this CLI, in `~/code/cremaitalia-shopify`) is the authority for the Shopify theme.
> Claude **Cowork** (the OneDrive/desktop agent) must **check with Code before editing
> or committing anything in this repo, and Code takes precedence** in any conflict. This
> exists because parallel mid-write edits by Cowork produced truncated commits (a cut-off
> `index.liquid`, then a cut-off `ci-storefront.css`). Cowork's lane is the OneDrive
> `CremaItalia LLC` ops/brand folder; Code's lane is this theme repo. Brand assets flow
> Cowork → Code (Code copies finalized assets in), not the other way. The **cross-surface
> decision log** + daily coordinator live in OneDrive `CremaItalia LLC\Coordination\`
> (`DECISIONS_LOG.md`, `coordinator_routine_prompt.md`, dated `sync-report-*.md`) — the
> shared ledger of decisions across chat, Cowork, and Code; read it when resuming.

> **Connectivity check — use the `reconnect-check` skill first (Steve, 2026-07-04).**
> If a session opens after a reboot, or GitHub/Shopify CLI access to this repo seems
> off, run the `reconnect-check` skill (`.claude/skills/reconnect-check/`) before doing
> any manual git/Shopify troubleshooting. It verifies `git ls-remote` and
> `shopify theme list` connectivity and gives the exact fix if either is actually down.
> This is Code's skill to run directly. Cowork does not run git or the Shopify CLI (see
> the lane rule above) — if Cowork suspects a connectivity problem in this repo, it
> should flag it to Steve/Code rather than attempt its own fix. See `DECISIONS_LOG.md`
> 2026-07-04.

---

## 1. Stage & posture

The store is **pre-launch**. A coming-soon landing page is currently live, designed to
capture email signups for a pre-opening newsletter. There is no product catalog yet and
no commerce flow active. The current priorities are:

1. Polish the coming-soon page (logo, founder story, brand voice)
2. Build out the foundational theme structure for the future full storefront
3. Keep the codebase clean and version-controlled so future changes are reversible

The owner is **not a modern programmer**. Communicate code changes in plain English
before showing diffs, and explain *why* a change is being made, not just *what*. When
making more than ~3 file edits in a single response, summarize the changes at the top
in plain language before listing the diffs.

---

## 2. Tech stack

- **Platform:** Shopify (storefront), domain pointed to `cremaitalia.com`
- **Theme:** Currently a coming-soon theme (zip in
  `<OneDrive>/CremaItalia LLC/Operations/In USA/shopify/Initial Site Build Out/`).
  The plan is to pull the live theme via `shopify theme pull` into this repo.
- **Language:** Liquid (Shopify's templating language), JSON (for theme settings &
  section schemas), CSS, vanilla JavaScript
- **Tooling on Steve's machine:** Node.js, npm, Shopify CLI (authenticated), Git
- **Editor:** Visual Studio Code recommended (lightweight, has Shopify Liquid extension).
  Note: Steve currently has Visual Studio (heavy IDE) installed; suggest installing
  VS Code separately if visual file browsing is wanted.
- **Version control:** Git (local repo), private GitHub remote for off-machine backup

---

## 3. Brand standards — condensed reference

The canonical brand standards live in `<OneDrive>/CremaItalia LLC/Brand and Marketing/`:
- `Crema_Italia_Brand_Standards.pdf` — the full spec (read this for any contested call)
- `Crema Italia Brand CSS.css` — the canonical brand stylesheet (drop-in for any HTML)
- `Logo Assets/` — all production logo variants (transparent, knockout, cup-only,
  hi-res, OG image, favicons)

### 3.1 Voice
Editorial. Considered. Like a fine-press book — NOT e-commerce loud. Plain, direct,
deferential. "We choose a small number of roasters whose work represents the craft of
Italian roasting at its best." NOT: "We hand-pick the world's most exclusive coffee
artisans." When in doubt: fewer elements, more whitespace, smaller logo, larger margins.

### 3.2 Color palette (use the role, not the hex name)
| Role             | Hex      | Where it lives                                |
|------------------|----------|-----------------------------------------------|
| Background — Cream    | `#FBF8F1` | Page background, hero sections, document body |
| Surface — Ivory       | `#FFFFFF` | Tables, callouts, web cards on cream          |
| Espresso — Brown      | `#55331B` | Body text, H1, wordmark (artist palette 2026-07-01) |
| Espresso — Soft Brown | `#6B4A38` | Muted/secondary body, captions (interim; re-derive) |
| Crema — Gold          | `#B88348` | H2, accents, links, key numbers, button fills (artist palette 2026-07-01) |
| Crema Light           | `#E8A86A` | Hover states, light fills, chart shades (interim; re-derive from Crema Gold) |
| Tricolore Green       | `#0E7A3A` | Thin rules only (top-left page rule, etc.)    |
| Tricolore Red         | `#C8342B` | Thin rules only (top-right page rule, etc.)   |
| Hairline (neutral)    | `#D9D2C2` | Dividers, table borders                       |
| Mute (neutral)        | `#8C7E6A` | Footer text, page numbers, eyebrow labels     |
| Ink soft (neutral)    | `#5A4A3F` | Long-form body text where coffee is too heavy |

**Tricolore colors are decorative rules, NEVER large fills.** Think: a pencil-thick
rule across the top of the page, a 6mm strip at the foot of the cover. Never block
colors. Crema Gold is for headings >= 14pt/18px and short bold-weight runs only —
never run paragraph body copy in gold.

Do not introduce new colors. If a chart or feature seems to need a new hue, derive it
from Crema Light, Espresso, or a desaturated Tricolore Green.

> **Palette revised 2026-07-01 (artist rebrand).** The finalized logo's spec sheet
> (`Logo Assets/Art Files/CI Artwork Details.pdf`) sets Espresso Brown `#55331B` and
> Crema Gold `#B88348` as the two hero tones (replacing the old `#3B1F12` / `#C46A1F`).
> Green, Red, Cream unchanged. The muted `#6B4A38`, light `#E8A86A`, and hover `#9C6E3C`
> tokens are interim harmonizations — re-derive from the new hero tones when the Brand
> Standards PDF is rebuilt.

### 3.3 Typography
| Role                | Family                  | Weights         | Use                              |
|---------------------|-------------------------|-----------------|----------------------------------|
| Logo wordmark       | Montecatini Pro (Normale Semi-Bold) | — | Logo artwork ONLY — outlined in the files; commercial font, license unconfirmed |
| Display & Headings  | Marcellus               | 400 (Regular)   | Cover title, H1, H2, web/doc headings (Google Font stand-in for Montecatini) |
| Body & UI           | Inter                   | 400/500/600     | All body, tables, captions, UI, buttons, tagline |

Load from Google Fonts. Web sizes: Hero 72px, H1 40px, H2 18px, H3 16px, Body 17px,
Small/caption 14px, Eyebrow 12px (tracked +0.12em, uppercase).

> **Type revised 2026-07-01 (artist rebrand).** The wordmark is set in **Montecatini Pro
> (Normale Semi-Bold)** — a *commercial* font, already converted to outlines in the logo
> files, so the artwork needs no font install. This supersedes the old Cormorant-Garamond
> and the interim Lora display choice entirely. For live web/document headings use
> **Marcellus** (free Google Font, the artist's recommended stand-in). Body stays Inter.
> **TODO:** confirm Montecatini Pro licensing before using it for any live text beyond
> the outlined logo. Marcellus has a single 400 weight — headings rely on size, not bold.

Italic on display = Italian-language headings (English left, Italian right convention).
**Italics carry meaning** — don't italicize for emphasis. Use bold for emphasis.

### 3.4 Layout
- Max content width: 72ch for long-form, 1120px for landing pages
- Bilingual columns: English left, Italian right, italic for Italian H1s
- Header: thin tricolore rule across the top, logo on left at ~56px height
- Footer: hairline rule, then `Crema Italia, LLC - Lutz, Florida, USA - cremaitalia.com`

### 3.5 Imagery
Natural light, low saturation, narrow depth of field. Espresso cups, roasting drums,
hands at work, Tuscan landscape. NEVER: generic barista stock photos, vector
illustrations, emoji, decorative coffee-bean borders.

### 3.6 Bilingual posture
Roaster-facing artifacts ship in English AND Italian. Italian is the controlling
version when handed to an Italian roaster. Honor formal Italian address — use Voi/Vi/
Vostro, capitalized. Numbers and units: always include both metric (250 g) and US
customary (8.82 oz).

---

## 4. Logo & trademark

The mark is `Crema Italia(TM)`. We applied the TM mark today (June 2026) — Steve has not
yet filed with USPTO but intends to. TM goes after the final "A" in "ITALIA" as a small
superscript at cap-height. The `Logo Assets/` folder (restructured 2026-07-01) holds the
finalized artist mark with TM applied: master `.ai` in `Art Files/`, plus `EPS/`, `PDF/`,
`SVG/`, `PNG/`, and generated `Web/` derivatives — in main / horizontal / favicon lockups,
each in light and dark-background versions. **NEVER use the (R) symbol** until/unless
USPTO registration issues.

**Logo rules** (from brand standards):
- Clear space: at least the height of the wordmark "C" on every side
- Minimum size: 25mm print, 120px screen (favicon-only crop OK below 120px)
- On dark backgrounds: use the **dark-background lockup** (e.g. `PNG/CI Logo for Dark
  Background - Transparent.png`), not the light mark recolored
- Never stretch, rotate, drop-shadow, recolor the cup, or re-typeset the wordmark

---

## 5. File-naming conventions

Per brand standards: `Crema_Italia_<Topic>_v<MAJOR>.<MINOR>.{docx|pdf}`
Logo files: `Crema_Italia_Logo_<variant>.{svg|png|jpg}`
Recommended variant naming for full asset library:
`<composition>_<colortreatment>` — e.g., `primary_color`, `primary_knockout`,
`wordmark_mono`, `cup_color`.

In code (Liquid sections, CSS classes, JS): kebab-case for file names (`hero-section.liquid`),
lowercase-with-hyphens for CSS classes (`.hero-section__title`), camelCase for JS.

---

## 6. Things to NEVER do

- **Never** introduce new brand colors beyond the palette above
- **Never** use tricolore green or red as large fills (only thin rules)
- **Never** recolor the espresso cup inside the logo
- **Never** re-typeset the wordmark; always use the supplied logo files
- **Never** apply the (R) symbol to the logo — Crema Italia is not federally registered yet
- **Never** push directly to the live store without committing to git first
- **Never** delete or rename anything under `<OneDrive>/CremaItalia LLC/` without
  asking — that's the operations folder, not the code folder
- **Never** use emoji in copy or commit messages (Steve hasn't asked for emoji)
- **Never** use "hand-picked," "world-class," "exclusive," or other e-commerce-loud
  language in brand copy
- **Never** italicize for emphasis (use bold); italics are reserved for Italian-language
- **Never** ship an edited Crema Italia document still on an old brand version (see §6.1)

---

## 6.1 Brand-current-on-edit (mandatory best practice)

**Rule:** any time we materially edit a Crema Italia artifact — brand doc, vendor
sheet, roaster guide, deck, PDF, letterhead, web page, email template — we bring it
fully up to the **current** brand standards *in the same pass*, before saving. Never
leave a document you just touched on a superseded palette, font, or logo.

"Current" is defined by exactly two files, named in the §11 reference index:
1. **Brand Standards** — the greatest-version `Crema_Italia_Brand_Standards_vX.Y.pdf`
   (today: **v2.0**).
2. **Brand CSS** — `Crema Italia Brand CSS.css` (today: **v1.2**).

**The refresh checklist (run on every edited doc):**
- Palette hexes match current (today Espresso `#55331B`, Crema Gold `#B88348`; green/
  red/cream unchanged). No retired hexes (`#3B1F12`, `#C46A1F`).
- Fonts: display = Marcellus, body = Inter; wordmark art = Montecatini (logo only).
  No Cormorant/Lora.
- Logo: current lockup from `Logo Assets/` (right light/dark version), ™ not ®.
- Footer line + contrast rules (gold large-only) honored.

**How we keep it honest — the brand-version stamp.** Every generated doc carries, in
its footer or metadata, the brand version it was built against, e.g.
`Built to Brand Standards v2.0`. On the next edit, compare that stamp to the current
version in §11: if it's behind, refresh before doing anything else. The stamp turns
"did anyone remember?" into a one-line check anyone (or any agent) can verify.

**If a full refresh is genuinely out of scope** for a given edit, do NOT silently
leave it stale — call out the drift to Steve and log it as a follow-up.

> When the Brand Standards or Brand CSS version changes, bump the "today:" values in
> this section and the §11 reference index so "current" always points somewhere real.

---

## 7. Common commands

```bash
# Start local theme dev server (live preview with hot reload)
shopify theme dev

# Pull the current live theme down to local
shopify theme pull

# Push local changes to the live theme (be careful)
shopify theme push

# List themes on the store
shopify theme list

# Push to a NEW unpublished theme (safer for experiments)
shopify theme push --unpublished --json

# Git: see what changed
git status
git diff

# Git: commit a working state
git add -A
git commit -m "Concise message in present tense"

# Git: undo uncommitted changes
git checkout .

# Git: undo the last commit (keep changes)
git reset --soft HEAD~1

# Git: undo the last commit (discard changes)
git reset --hard HEAD~1

# Git: push to GitHub
git push
```

---

## 8. Working workflow (the loop)

1. Make sure you're in a clean state: `git status` should be empty
2. Pull anything new from the live store: `shopify theme pull` (only if other people
   are editing in the Shopify admin; otherwise local is the source of truth)
3. Start the dev server: `shopify theme dev` — opens a localhost URL with live reload
4. Edit files (or have Claude edit them)
5. Review the change in the browser preview
6. If good: `git add -A && git commit -m "..."` to snapshot
7. When ready to deploy: `shopify theme push`
8. Push the git history to GitHub: `git push`

If something goes wrong: `git reset --hard HEAD~1` rolls back the last commit. Then
`shopify theme push` again to restore the store.

---

## 9. Architectural decisions log

Add a one-line note here whenever a meaningful decision is made. Format:
`YYYY-MM-DD — Decision in plain English. (Why)`

- 2026-06-23 — Initial scaffold. Tech stack: Shopify + Liquid + Git + Claude Code.
- 2026-06-23 — Brand standards from `Crema_Italia_Brand_Standards.pdf` v1.0 (May 2026)
  adopted as canonical.
- 2026-06-23 — Logo Option A (small superscript TM after wordmark) selected as the TM
  treatment.
- 2026-06-23 — Decided to defer SVG vector logo work; using raster (PNG) for all logo
  placements until a true vector exists. Reasoning: hand-coded SVG recreation didn't
  match the original closely enough; raster works for Shopify, OG, favicons, print at
  reasonable sizes.
- 2026-06-23 — Pulled live theme from Shopify into local repo as baseline commit.
  Theme name: `crema-italia-coming-soon-theme` (id #150557294761). Live at cremaitalia.com.
- 2026-06-23 — Local git initialized and pushed to GitHub remote at
  https://github.com/marvistaCI/cremaitalia-shopify (private). Use `git push` to back up
  changes after any meaningful edit.
- 2026-06-23 — Confirmed theme is intentionally minimal: 9 files, ~974 lines total.
  Active layout is `layout/password.liquid` (renders when password protection is on,
  which it currently is). `layout/theme.liquid` will activate after launch. No
  `sections/` or `snippets/` folders exist yet — to be added when building out the full
  storefront post-launch.
- 2026-06-23 — `Horizon` theme (id #150473375913) sits unpublished on the store.
  This is Shopify's 2025 reference theme; useful pattern source when building cart
  drawers, product cards, and other commerce components post-launch. Do not modify it
  in-place — pull patterns out, don't edit Horizon itself.
- 2026-06-24 — Reconciled the coming-soon POC (it was half-wired from the Cowork
  session). Created the missing `templates/password.liquid` (the page Shopify actually
  serves while password protection is ON) holding the hero + email signup card. The
  signup form had been sitting in `templates/index.liquid`, which only renders AFTER
  launch — so visitors couldn't see it. Aligned markup with the existing CSS/JS
  (`.signup-form`, `.form-error`, `.form-success`) so the validation/double-submit/
  screen-reader script is now live instead of dead. Added `snippets/ci-footer.liquid`
  as the single source of truth for the footer (fixes the missing `cremaitalia.com`
  line and the dead `#` links on the 404). Trimmed ~150 lines of CSS that styled
  sections which don't exist yet. Added a discreet collapsible password-entry box so
  password-holders can preview. Filled in the empty `settings_schema.json` theme_info.
  `index.liquid` remains a clean placeholder for the future full storefront mockup.
- 2026-06-27 — Canonical full-storefront specs received and committed to `docs/`:
  `CremaItalia_ClaudeCode_Brief_v1.md` (HOW: stack, metafields, templates, 10-phase
  build order), `CremaItalia_ShopifyMagic_Prompt_v1.md` (business logic: shelves,
  pricing formula, discounts, shipping, the Promise), and `CremaItalia_POC_v2.html`
  (design/UX source of truth). These SUPERSEDE the earlier v1 draft. Build a CUSTOM
  Liquid theme (no starter). New since v1: nav = Shop · Trovare · La Bottega · About;
  3-axis filter (Region × Shelf × Taste Profile); first-visit taste quiz; custom
  account portal; per-shelf product templates; `crema_italia.*` metafields; pricing
  formula (EUR×0.60×markup×1.165). See `docs/storefront-plan.md` for the reconciliation
  and OPEN QUESTIONS (esp. subscription engine: brief says Recharge/Skio, which
  conflicts with the 2026-06-24 "Shopify Subscriptions free" choice — unresolved).
- 2026-06-29 — **v3 specs supersede everything above.** New authoritative sources:
  `docs/CremaItalia_POC_v3.html` (design/UX source of truth — nav is now
  **Shop ▾ · Roasters · About · Journal · Bottega**, NOT the v2 Trovare/La Bottega nav),
  `Operations/In USA/shopify/Initial Site Build Out/Shopify_Magic_Build_Prompt_v3_FINAL.txt`
  (locked business rules), `00_PROJECT_BRIEF.md` (single source of truth),
  `Operations/In USA/shopify/Crema_Italia_Commerce_Playbook_v3.docx`. Conflict rule from
  Steve: **POC v3 + Magic Build Prompt v3 FINAL win.** Resolved by that rule:
  (a) **custom Liquid theme** (Steve's direct instruction + this file) over the
  Magic-Prompt/brief "use Dawn" line; (b) **Lora** display font (POC v3's `:root` still
  names Cormorant Garamond — stale token — but Magic Prompt + brand.css lock Lora);
  (c) **pricing = `SKU_LAST_COST × Markup[shelf/size]`** with the Magic-Prompt matrix
  (Commerce Playbook's `EUR×0.60×markup×1.165` + its different matrix and Sorpresa
  subscription are SUPERSEDED); Sorpresa is one-time-only, 100g-in-Tours-only.
- 2026-06-29 — **Subscription engine LOCKED: Loop.** Steve is going live with Loop.
  Loop is Shopify-native (selling plans + Shopify Checkout), so theme-level subscription
  code = native `selling_plan_groups` (no rewrite risk vs. "engine-agnostic"). What Loop
  changes: Roccia cadences modelled as 4/6/8-week selling plans; the account
  subscription-management page is a **Loop-hosted portal slot** (theme app block /
  passwordless login), NOT a hand-built pause/skip/swap engine. Subscriber 10% /
  Founding 12% remain Shopify Functions regardless. Recharge/Skip from the brief are off.
- 2026-06-29 — **Built POC3: the custom Liquid storefront.** Approach = a single-document
  SPA (`templates/index.liquid`, client-side `showPage`) rendered by `layout/theme.liquid`,
  with the test catalog **baked into `assets/ci-catalog.json`** (5 roasters, 9 Roccia
  SKUs, 1 Sorpresa Tour, 2 Selezione, 1 Offerta example, 4 Bottega) and rendered by
  `assets/ci-storefront.js`. Cart/checkout are **mocked** (no real Shopify cart yet);
  sign-in/account/Loop portal are **stubs** with `<!-- PROD -->` / `<!-- LOOP -->` seams.
  New files: `assets/ci-storefront.css|js`, `assets/ci-catalog.json`, `assets/ci-logo*`/
  favicons, `snippets/ci-header|ci-store-footer|ci-profile-banner|ci-quiz-modal|ci-signin-modal`.
  Coming-soon page (`layout/password.liquid` + `crema-italia.css|js`) left UNTOUCHED so the
  pre-launch gate still works. `shopify theme check`: 0 errors (11 warnings: Google-Fonts
  RemoteAsset + benign orphaned-snippet flags). Committed; NOT pushed to Shopify.
- 2026-06-29 — **POC3 pushed to an UNPUBLISHED preview theme** (Steve approved a
  login-gated preview). Theme: **"Crema Italia POC3 Preview"** id **151277174953** on
  `crema-italia.myshopify.com`. Live `crema-italia-coming-soon-theme` (#150557294761)
  is untouched and still the published theme. Preview is gated behind the store
  password (storefront protection ON) and/or the Shopify admin login.
  Preview URL: `https://crema-italia.myshopify.com?preview_theme_id=151277174953`
  Editor: `https://crema-italia.myshopify.com/admin/themes/151277174953/editor`
  To refresh the preview after edits: `shopify theme push --theme 151277174953`.
- 2026-07-01 — **Artist rebrand: finalized logo + revised palette/type adopted.** A human
  graphic artist delivered the finished mark (`Crema Italia Logo Files.zip`) — the durable
  vector master (`.ai`) + matched EPS/PDF/SVG/PNG in main/horizontal/favicon lockups,
  light + dark, ready for the USPTO TM filing. Actions: (a) archived the prior artwork to
  `Brand and Marketing/_Archive/Pre-Artist_2026-07/` (provenance MANIFEST); (b) restructured
  `Brand and Marketing/Logo Assets/` to the artist's layout (Art Files/EPS/PDF/SVG/PNG/Web)
  with a canonical README — new set fully supersedes old; removed old flat logos, TM
  Placement Options, Standard Company Logo (all archived). **Palette revised:** Espresso
  Brown `#3B1F12`→`#55331B`, Crema Gold `#C46A1F`→`#B88348` (Green/Red/Cream unchanged).
  **Type revised:** wordmark = Montecatini Pro (commercial, outlined in art); web/doc
  display = **Marcellus** (Google) — supersedes the Cormorant→Lora saga entirely; body =
  Inter. Propagated tokens through both theme worlds: `assets/ci-storefront.css`,
  `assets/crema-italia.css` (live coming-soon), `assets/ci-catalog.json`, and the Google
  Fonts loads in `layout/theme.liquid` + `layout/password.liquid`; swapped theme logo
  images (`ci-logo.png`=horizontal, `ci-logo-knockout.png`=dark main, favicons, apple-touch,
  `ci-og-image.png`, orphaned `ci-logo.svg`=new horizontal vector). Updated canonical
  `Brand and Marketing/Crema Italia Brand CSS.css` (v1.1→v1.2). **NOT pushed to Shopify**
  (live coming-soon page tokens changed but not deployed — needs Steve's push approval).
  **Follow-ups:** (1) verify Montecatini Pro licensing; (2) rebuild Brand Standards PDF on
  the new palette/type; (3) re-derive interim tints `#6B4A38`/`#E8A86A`/hover `#9C6E3C`.
- 2026-07-01 — **Brand Standards rebuilt → v2.0** (follow-up #2 above, DONE). Rebuilt the
  Brand & Document Standards from the v1.0 PDF (which had no editable source) as an editable
  HTML/CSS master + WeasyPrint PDF, per the crema-italia-pdf-builder skill. New palette
  (#55331B/#B88348), Marcellus display (Montecatini for wordmark art only), corrected
  contrast guidance (**Crema Gold is 3.1:1 on cream — large-display/accent only**, stricter
  than the old terracotta), and the note that **Marcellus is roman-only** so the EN/IT cue is
  now the eyebrow label, not italic display type. Files in `Brand and Marketing/`:
  `Crema_Italia_Brand_Standards_v2.0.pdf` + `.html` source + `fonts.css` + local Marcellus/
  Inter `.ttf` in `assets/fonts/`. v1.0 archived. Font licensing verdict: Montecatini Pro is
  a Tipofili/Louise Fili commercial face — logo art is outlined so no license needed; only a
  desktop+webfont license (Adobe Fonts/CC easiest) is required to set live Montecatini text,
  which we avoid by using Marcellus. **Still open:** re-derive interim tints; refresh the
  Vendor Intro Sheets + Roaster Guides onto the new brand.
- 2026-07-02 — **Feedback-batch #1 executed on POC3 and reconciled with the 2026-07-01
  brand refresh.** Applied Steve's agreed change list: nav reorder (Shop · Bottega ·
  Roasters · Journal · About); hero logo (new knockout art) + new headline; home section
  reorder (four shelves → Featured Tour); shelf/Model/Promise copy; flavor "Earthy &
  Complex" → "Bold & Spiced" + on-select italic descriptors; Save-to-profile link; taste
  profile persists onto shelf pages; account taste-profile card (Apply/Change) + account
  dropdown (Account/Subscriptions/Sign out); Roccia "(and one-time ordering)", benefits
  restate, reverse-color Founding-Member banner ("172 of 222"); Promise freshness text +
  "help you find"; cart guest first-purchase-5% nudge; quiz first-visit auto-launch w/
  localStorage guard. Kept (per Steve): no exclamation marks, Sorpresa 100g wording,
  subscription toggle default-unchecked. Deferred: no-waste rewrite (3PL-city research).
  All classes/copy inherit the new Espresso/Gold palette + Marcellus; theme-check 0 errors.
  NOTE: Cowork's commit `3a21d11` captured a partial (truncated) `index.liquid` + partial
  JS; this state completes them. Preview theme (151277174953) NOT yet re-pushed — awaiting
  Steve's OK.
- 2026-07-04 — **POC4 change batch built on the POC3 baseline.** Working process this
  round: Steve flagged defects/changes incrementally in `docs/POC_v4_change_list.md`
  (the running to-do ledger — kept as the detailed record; this entry is the durable
  summary), then reviewed a compiled list of all 18 items plus 8 open decisions before
  authorizing the build. Landed:
  - **Home:** fixed the Offerta-shelf-card-to-Featured-Tour gap (`.tour-hero` now has
    a deliberate, symmetric `margin-top`, not an accidental collapse value).
  - **Nav:** Shop and Account dropdowns now close on selection. They're pure-CSS
    `:hover`/`:focus-within` menus, so a blur-only fix wasn't enough — `:hover` stays
    true while the cursor sits on the just-clicked link. Added a `menu-force-closed`
    class toggled by JS that re-arms itself on `mouseleave`.
  - **Roasters index:** eyebrow → **"GRUPPO D'ECCELLENZA"**; intro line rewritten to
    "We are the premier consumer channel for each of these roasters, and we offer
    their coffee just as they offer it in Italy."; dropped "Tuscany first; the rest
    of Italy as we grow." (better suited to the Journal). An **Italian roasting
    regions filter** was requested but is **deferred to POC5** pending Steve's filter
    spec.
  - **Roaster profile page:** back-link now reads "Show all roasters" (was briefly
    going to be "Meet our roaster" before Steve caught that it's a back-link, not a
    forward action); added the roaster brand-logo tile to the hero (same
    `.roaster-portrait` component used on the index); **the roaster page now shows a
    roaster's coffee from all four shelves**, including Sorpresa Tour bundles — this
    required a data-model fix, since bundle products (e.g. `tour-ditalia-1`) only
    named their component roasters in free text, not by handle. Added a structured
    `roasters: [...]` array to bundle products for this. The stale
    "Roccia-and-Sorpresa-only" disclaimer was replaced with copy reflecting the new
    all-shelves reality. Product tiles (`productCard()`, used site-wide, not just
    here) gained a 3-slide placeholder photo carousel (front/back/label-closeup) with
    dot controls — mechanism only; real per-SKU photography still needed. Added
    structured `address`/`phone`/`website` fields per roaster (**invented test data**,
    consistent with the rest of `ci-catalog.json`) and the "Visit them" address now
    links out to Google Maps in a new tab.
  - **Account page:** locked the Loop-vs-native split — **Loop's hosted portal owns
    the active subscription's ship-to address and payment method; native Shopify
    customer accounts own the general address book and profile settings** (name,
    email, password) for one-time orders. Added a "Profile & addresses" stub card
    reflecting this and expanded the Loop-slot copy to name what it covers.
  - **Taste quiz — Q1:** subtitle → "Three questions. We'll point you to the right
    roasts."; added a one-time no-flavoring disclaimer above the roast cards; card
    titles simplified to "Light/Medium/Dark roast" with "Tasting hints at ___"
    descriptions (all industry-standard roasting-science terms, chosen to match the
    §11A flavor-lexicon already in use).
  - **Taste quiz — Q2:** headline → "Which tasting notes appeal to you most?"; added
    a framing sentence disclosing that roast, origin, and blend ratio jointly produce
    these flavor buckets (they're correlated with Q1's roast axis, not independent —
    see the open item logged below); added a low-emphasis "Not sure yet — skip this
    one" link (deliberately not a fourth equal-weight card, to avoid it becoming the
    path of least resistance for undecided users); a skipped Q2 correctly falls back
    to roast-only matching with no hidden default flavor.
  - **Taste quiz — results screen:** replaced ad hoc if/else title logic with a single
    persona lookup matrix keyed on (Q1 roast, Q2 flavor-or-skip), built so a future Q3
    can fold in as a third key without restructuring. Full Light/Medium/Dark × Fruit
    & Flowers/Sweet & Chocolatey/Bold & Spiced/skip grid per Steve's spec; two
    "sparse" cells (Light+Bold & Spiced, Dark+Fruit & Flowers — chemically rare
    combinations) still show a named persona but relax matching to roast-only and
    swap in a "rarer combination" subhead. "Surprise me" (Q1 skipped) was originally
    special-cased outside the matrix, but Steve correctly identified that as an
    unnecessary exception — it's simply "no roast preference," the same shape as
    skipping Q2 — so it's now a full fourth matrix row (`any`) with its own four
    personas (The Open Palate/Perfumer/Sweet Tooth/Wanderer — names are mine, not
    Steve's spec, flagged for his review). "The Decaf Discoverer" persona was kept
    per Steve's explicit request, now firing consistently on every decaf answer
    (an improvement — the old version only showed in gaps left by an `elseif` chain).
    Buttons became **"Show my matches"** / **"Show me everything"**, both routing
    through sign-in first to try to capture the taste profile into the account either
    way; a dismissed sign-in (✕ **or the overlay-click, which was found to bypass the
    same guest-fallback and was fixed**) still lets the customer browse as a guest.
    Added a "Back" link to regress to Q3. "In bocca al lupo" stays fixed across every
    outcome, per Steve.
  - **About page:** hero line → "A Florida based importer..."; split the single
    "Steve — Founder" tile into **"Our company"** (kept the existing company copy)
    and **"Our founder"** (new photo tile, copy pending — Steve is writing new
    language for both); added a **team section** ("La nostra squadra eccellente" /
    "Our excellent team members" — Italian-as-eyebrow, English-as-h2, matching the
    Roasters-page pattern and confirmed by Steve) with three placeholder cards
    (Lucia Calo', Asia Chirdo, Lauren Roberts); added a **partners section** ("I
    nostri partner" / "Our partners") with one holding card, "Partner 1". Both new
    sections are marked as future admin-managed collections.
  - **Deferred to a later batch, logged as open items:** the Italian regions filter
    (POC5, see above), the roast-level-vs-taste-profile correlation question (revisit
    once real SKUs are tagged with both axes), and expanding the persona matrix to a
    third key once Q3's content is defined.
  - Full per-item detail, code locations, and exact copy for every change above live
    in `docs/POC_v4_change_list.md` — that file remains the working ledger; this
    entry is the durable summary. **Not committed to git and not pushed to any
    Shopify theme yet** — working tree only, awaiting Steve's review.

---

## 10. Open questions / TODO

**POC4 — CURRENT STATE (as of 2026-07-04) — read this first when resuming.**

**What POC4 is.** The same custom-Liquid SPA architecture as POC3 — no structural
change — with a batch of copy, layout, and behavior fixes applied on top (see §9's
2026-07-04 entry for the full list; `docs/POC_v4_change_list.md` has per-item detail).
`templates/index.liquid` (every page is a `.page` block toggled by `showPage()`) +
`layout/theme.liquid` (chrome), styled by `assets/ci-storefront.css`, behavior in
`assets/ci-storefront.js`, driven by the **baked-in test catalog** in
`assets/ci-catalog.json` (now with per-roaster `address`/`phone`/`website` fields and
a structured `roasters` array on the Sorpresa Tour bundle — both new this batch).
Chrome/header/footer/modals are in `snippets/ci-*`. The coming-soon gate
(`layout/password.liquid` + `assets/crema-italia.css|js`) is **untouched** and still
what the public sees.

**Deployment status — NOT yet pushed anywhere.** This batch exists only in the local
working tree: **not committed to git, not pushed to GitHub, not pushed to the preview
theme.** The last committed/pushed state is still POC3 as of commit `36ce378`. The
preview theme **"Crema Italia POC3 Preview" id `151277174953`** on
`crema-italia.myshopify.com` still serves that POC3 state. **Ask Steve before
committing, pushing to GitHub, or pushing to the preview theme.**
- Preview (still POC3 until re-pushed): `https://crema-italia.myshopify.com?preview_theme_id=151277174953`
- Editor: `https://crema-italia.myshopify.com/admin/themes/151277174953/editor`
- Refresh after a push is approved: `shopify theme push --theme 151277174953`

**Not verified in a browser.** None of this batch's changes have been run through
`shopify theme dev` or checked in a live preview — Steve asked mid-session not to spin
up a dev server unprompted, so every item was implemented by reading/writing code and
checked with `node -c` / `JSON.parse` for syntax only. **Visual/functional QA in an
actual preview is still outstanding** before this ships anywhere.

**Brand (current — Brand Standards v2.0, artist rebrand 2026-07-01).** Palette:
Espresso `#55331B`, Crema Gold `#B88348`, hover `#9C6E3C`, green/red/cream unchanged.
Display font **Marcellus** (Google Font stand-in for the outlined Montecatini wordmark);
body **Inter**. Finalized artist logo in `assets/ci-logo*.png|svg` (hero uses the
knockout). No retired `#3B1F12`/`#C46A1F` or Cormorant/Lora tokens anywhere. This
batch's new copy/markup was checked against this palette/type — no deviations
introduced.

**What's REAL vs MOCKED (the production seams).**
- REAL: full page set, brand system, 3-axis Shop filter, taste quiz (first-visit
  auto-launch, now with the persona matrix), roaster profiles (now all-four-shelves +
  address/phone/website + Google Maps link), product detail, all copy, responsive
  layout.
- MOCKED: cart is client-side (merges identical lines, −/qty/+ stepper, discount +
  free-ship math for display only); checkout is a toast; sign-in is simulated
  (assumes a Founding-Member subscriber); account "Manage subscription" is a **Loop
  portal stub** (now explicitly scoped to ship-to + payment for the subscription,
  with a separate "Profile & addresses" stub card for native-Shopify territory).
  Roaster `address`/`phone`/`website` fields are **invented test data**. Product-tile
  photo carousel (item 9) cycles placeholder labels, not real photography. Search
  `<!-- PROD -->` / `<!-- LOOP -->` and `PROD:` / `LOOP:` in the code for every
  swap-point.

**Done so far:** POC3 build → feedback-batch #1 → cart/hero polish (see prior §9
entries) → **POC4 batch** (2026-07-04): home/nav fixes, Roasters index copy, roaster
profile enhancements + all-four-shelves fix, account Loop/native split, full taste-quiz
rework (Q1/Q2/results persona matrix), About page restructure. `node -c` / `JSON.parse`
clean; `shopify theme check` not yet re-run against this batch.

**RESOLVED decisions (locked):** subscription engine = **Loop**; theme = **custom
Liquid** (no starter); display font = **Marcellus**; pricing = Magic-Prompt markup
matrix; nav = **Shop ▾ · Bottega · Roasters · Journal · About**; quiz + taste profile =
in scope; kept per Steve: no exclamation marks, Sorpresa 100g wording, subscription
toggle default-unchecked; **account split** = Loop owns subscription ship-to/payment,
native Shopify owns address book/profile settings (2026-07-04); **persona matrix** =
single lookup table keyed on roast × flavor-or-skip, four full rows including "any"
(2026-07-04).

**Coordination.** Code owns this repo; Cowork must check with Code and Code takes
precedence (see the callout near the top of this file). The **cross-surface decision
log** lives in OneDrive `CremaItalia LLC\Coordination\DECISIONS_LOG.md` — read it when
resuming; the POC4 batch's cross-surface-relevant decisions (account data-model split,
catalog schema additions) should be logged there too.

**OPEN / TO VET:**
- [ ] Steve to visually QA the POC4 batch in an actual browser/preview — nothing in
  it has been run yet.
- [ ] Approve committing this batch to git and re-pushing the preview theme
  (`151277174953`).
- [ ] Postponed to POC5: Italian roasting-regions filter on the Roasters page (spec
  still pending from Steve).
- [ ] Deferred: whether Q2 (taste-profile) is carrying real analytical weight over Q1
  (roast) — revisit once real SKUs are tagged with both `roast_level` and
  `taste_profile` (see `docs/POC_v4_change_list.md` item 15).
- [ ] Deferred: expand the quiz persona matrix to a three-key lookup once Q3's content
  is defined (item 17).
- [ ] Four new "Surprise me" persona names (The Open Palate/Perfumer/Sweet
  Tooth/Wanderer) were invented this session, not specified by Steve — flagged for
  his review/rename.
- [ ] "Our company" and "Our founder" About-page tile copy is placeholder — Steve is
  writing the real language.
- [ ] Team/partner section photos and roaster/product-tile photos are all text
  placeholders pending real photography and logo assets.
- [ ] Deferred: no-waste copy rewrite on the Promise page (pending 3PL-city research).
- [ ] Optional: `git tag poc3` to mark the POC3 milestone (still not done — consider
  before this POC4 batch is committed on top).

**NEXT (production build, after POC4 is vetted):** real product/collection/metafield
data model (`crema_italia.*`) — note the POC4 batch already added a precedent for this
(`roasters` array on bundle products, structured roaster contact fields) that the real
metafield schema should account for; per-shelf product templates; native
`selling_plan_groups` (Loop) on Roccia; Shopify Functions for discounts; real Shopify
cart + Checkout; native Shopify customer accounts for the address-book/profile split
locked 2026-07-04. Reuse POC3/POC4's CSS/JS/markup as the design system.

**To resume, read in this order:** this block → `docs/POC_v4_change_list.md` (POC4's
detailed working ledger) → `docs/CremaItalia_POC_v3.html` (design source — now stale
relative to POC4's live copy in several places; treat the repo as source of truth over
this frozen doc) → `00_PROJECT_BRIEF.md` (single source of truth) →
`Coordination\DECISIONS_LOG.md`.

---

## 11. Reference index — where things live

- **Brand standards PDF (current, v2.0):** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Crema_Italia_Brand_Standards_v2.0.pdf` — editable source alongside it: `Crema_Italia_Brand_Standards_v2.0.html` (+ `fonts.css`). Built on the new palette/type. (v1.0 archived in `_Archive/Pre-Artist_2026-07/`.)
- **Brand CSS:** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Crema Italia Brand CSS.css`
- **Logo files (production, finalized artist mark 2026-07-01):** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Logo Assets/` — master `.ai` in `Art Files/`; EPS/PDF/SVG/PNG/Web lockups; see `Logo Assets/README.md`.
- **Prior artwork (archived provenance):** `<OneDrive>/CremaItalia LLC/Brand and Marketing/_Archive/Pre-Artist_2026-07/` (includes the old TM Placement Options).
- **Original coming-soon theme zip + spec:** `<OneDrive>/CremaItalia LLC/Operations/In USA/shopify/Initial Site Build Out/`
- **Operations docs (FDA, banking, roaster prospects):** `<OneDrive>/CremaItalia LLC/Operations/`
- **Legal (LLC formation):** `<OneDrive>/CremaItalia LLC/Legal/`

`<OneDrive>` on Steve's machine is `C:\Users\marvi\OneDrive\Pre-Vault\`.

---

## 12. When unsure

If a design decision isn't covered above, the order of authority is:
1. The brand standards PDF (canonical)
2. The brand CSS file (canonical for code-level values)
3. The voice & tone section of this file
4. The principle: "fewer elements, more whitespace, smaller logo, larger margins"

When unsure on a meaningful code change, ask Steve first. He'll likely have a strong
view, and he prefers being asked over being surprised.
