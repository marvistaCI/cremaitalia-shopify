# Crema Italia — Shopify Theme

This repository contains the Shopify theme for **cremaitalia.com**, the storefront for
Crema Italia, LLC — a small selective importer of artisan Italian roasted coffee beans.
Owner: Steve. Operating entity: Crema Italia, LLC, Lutz, Florida, USA.

This `CLAUDE.md` is loaded into every Claude Code session in this directory. It is the
agent's persistent project memory. Update it whenever a meaningful decision is made;
treat it as the source of truth for "how we do things here."

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
| Coffee — Deep Brown   | `#3B1F12` | Body text, H1, wordmark                       |
| Espresso — Soft Brown | `#6B4A38` | Muted/secondary body, captions                |
| Crema — Terracotta    | `#C46A1F` | H2, accents, links, key numbers, button fills |
| Crema Light           | `#E8A86A` | Hover states, light fills, chart shades       |
| Tricolore Green       | `#0E7A3A` | Thin rules only (top-left page rule, etc.)    |
| Tricolore Red         | `#C8342B` | Thin rules only (top-right page rule, etc.)   |
| Hairline (neutral)    | `#D9D2C2` | Dividers, table borders                       |
| Mute (neutral)        | `#8C7E6A` | Footer text, page numbers, eyebrow labels     |
| Ink soft (neutral)    | `#5A4A3F` | Long-form body text where coffee is too heavy |

**Tricolore colors are decorative rules, NEVER large fills.** Think: a pencil-thick
rule across the top of the page, a 6mm strip at the foot of the cover. Never block
colors. Crema Terracotta is for headings >= 14pt/18px and short bold-weight runs only —
never run paragraph body copy in terracotta.

Do not introduce new colors. If a chart or feature seems to need a new hue, derive it
from Crema Light, Espresso, or a desaturated Tricolore Green.

### 3.3 Typography
| Role                | Family                  | Weights         | Use                              |
|---------------------|-------------------------|-----------------|----------------------------------|
| Display & Headings  | Cormorant Garamond      | 500/600 + italic 500/600 | Cover title, H1, H2 (Italian), wordmark |
| Body & UI           | Inter                   | 400/500/600     | All body, tables, captions, UI, buttons |

Load from Google Fonts. Web sizes: Hero 72px, H1 40px, H2 18px, H3 16px, Body 17px,
Small/caption 14px, Eyebrow 12px (tracked +0.12em, uppercase).

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
superscript at cap-height. The `Logo Assets/` folder has all variants with TM already
applied. **NEVER use the (R) symbol** until/unless USPTO registration issues.

**Logo rules** (from brand standards):
- Clear space: at least the height of the wordmark "C" on every side
- Minimum size: 25mm print, 120px screen (favicon-only crop OK below 120px)
- On dark backgrounds: use the knockout variant (`primary_knockout.png`)
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

---

## 10. Open questions / TODO

(Steve will populate this in Claude Code with the specific features he wants to add.)

- [ ] (placeholder for missing features Steve wants to add)
- [ ] (placeholder)
- [ ] (placeholder)

---

## 11. Reference index — where things live

- **Brand standards PDF:** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Crema_Italia_Brand_Standards.pdf`
- **Brand CSS:** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Crema Italia Brand CSS.css`
- **Logo files (production):** `<OneDrive>/CremaItalia LLC/Brand and Marketing/Logo Assets/`
- **TM placement reference:** `<OneDrive>/CremaItalia LLC/Brand and Marketing/TM Placement Options/`
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
