# Crema Italia — Shopify Theme

This repository contains the Shopify theme for **cremaitalia.com**, the storefront for
Crema Italia, LLC — a small selective importer of artisan Italian roasted coffee beans.
Owner: Steve. Operating entity: Crema Italia, LLC, Lutz, Florida, USA.

This `CLAUDE.md` is loaded into every Claude Code session in this directory. It is the
agent's persistent project memory and **change log** (§9). It is **not** where the rules
live — those live in the three **Standards** below. Keep `CLAUDE.md` lean: log decisions
here, but record the *rules themselves* in the Standard they belong to, and point here.

> **The three Standards — canonical source of truth (adopted 2026-07-13, Option A).**
> Sources live in `docs/standards/` (git is the gate); OneDrive/PDF copies are read-only
> **renders**. A Standard says *what is true now*; this file's §9 + `DECISIONS_LOG.md` say
> *what changed, when*. On any decision: update the Standard **and** log it. See
> `docs/standards/README.md`.
> - **Brand Standards** (v2.1) — look & voice: `docs/standards/brand-standards/`
> - **Store Operating Standards** (v1.6) — pricing/shelves/discounts/fulfilment: `docs/standards/store-operating-standards.md`
> - **Collaboration Standard** (v1.1) — lanes, source/render model, editing protocol, render-trust: `docs/standards/collaboration-standard.md`
>
> **Editing protocol:** Code owns the repo and all Standard sources; **Cowork proposes,
> Code applies** — any edit Steve asks Cowork to make to a repo artifact is converted into
> a prompt for Code. The coordination callouts below are being consolidated into the
> Collaboration Standard; treat that Standard as canonical where they overlap.

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

> **Two Code sessions, one repo (Steve, 2026-07-04).** The "Code owns this repo" rule
> above covers Code vs. Cowork — it does NOT cover two **Claude Code** threads running
> concurrently in this same checkout (e.g. Steve running a storefront/POC session and a
> coming-soon-page session at once). This happened on 2026-07-04: one thread built the
> POC4 batch while another independently edited the coming-soon page
> (`assets/crema-italia.css`, `layout/password.liquid`, `templates/password.liquid`).
> It worked out because the file sets happened not to overlap, but that's luck, not a
> guarantee — the same failure mode that produced the truncated Cowork commits (above)
> can happen between two Code sessions just as easily. **Rule:** if two Code sessions
> will be active on this repo at the same time, each should either (a) work in its own
> `git worktree` for true isolation, or (b) if sharing one checkout, commit its own
> changes promptly at a natural stopping point — never leave work uncommitted while
> another session might also be writing — and never run broad commands (`git add -A`,
> `git checkout .`, `git reset --hard`) that could touch files the other session owns.
> If you (Steve) need to redirect a running session for this reason, don't tell it to
> stop mid-edit — ask it to finish its current edit, review `git status`/`git diff`,
> commit just its own files, and then pause, so nothing is left half-written.

> ⚠️ **Storefront password protection is currently OFF (Steve, 2026-07-05/06) — turn
> it back ON when friend-testing is done.** Online Store > Preferences >
> "Restrict access to visitors with the password" is unchecked right now, on purpose,
> so friends can open the current POC preview link without hitting the storefront
> password gate first (see the 2026-07-06 entry in §9 for the full why). While it's off, anyone
> who visits cremaitalia.com directly now sees the **current, on-brand coming-soon
> homepage** (`live-theme/templates/index.liquid` + `live-theme/layout/theme.liquid`,
> pushed 2026-07-07 — see that day's §9 entry) rather than the old stale placeholder,
> so this is lower-stakes than it was — but it should still go back ON once
> friend-testing wraps up, because the password is the only thing standing between a
> stray click on a POC preview link (the current one is named in §10 CURRENT STATE —
> deliberately not repeated here, since preview themes are created and deleted every
> batch and this callout used to name POC4's `151277174953`, deleted 2026-08-06) and
> the mocked storefront (fake checkout, invented roaster contact info, simulated
> sign-in) being casually discoverable by the public. Check this box first if you're
> picking this project back up and aren't sure of current state.
>
> **Draft-theme naming — version the Shopify draft to match what it holds (Steve,
> 2026-07-05).** Whenever a new POC batch is pushed into an existing (or new)
> unpublished/draft theme on Shopify, rename that theme in Shopify so its name
> matches the POC version actually deployed there — e.g. when the POC4 batch was
> pushed in-place into the theme still named "Crema Italia POC3 Preview"
> (id `151277174953`), it should have been renamed to "Crema Italia POC4 Preview"
> at that time. `shopify theme rename --theme <id> --name "Crema Italia POCx
> Preview"` does this without touching any files. Do this at the same time the
> batch is pushed, not later — a stale name is what made Steve think POC4 was
> missing entirely (see 2026-07-05 entry in §9). Same id, new name each time the
> POC version it holds changes.
>
> **Keep at most THREE POC preview themes (Steve, 2026-08-06).** Pruning is a step in the
> `crema-poc-deploy` skill (Step 5), run right after a deploy is proven and before the
> stale-id sweep. Candidates are only themes named exactly `Crema Italia POC<N> Preview`
> **and** with role `unpublished` — that pair of tests protects the live theme, `Horizon`,
> the throwaway `Development (...)` theme, and any hand-named backup by construction rather
> than by blocklist. Keep the three highest POC numbers, delete the rest **on Steve's
> explicit go, listed by name and id**: deletion is irreversible and the auto-mode
> permission classifier does *not* block theme deletes (2026-07-25). Duplicate names halt
> the prune rather than being absorbed. Nothing is lost by pruning — each POC batch is a
> commit and can be redeployed from git.
>
> **Connectivity check — use the `reconnect-check` skill first (Steve, 2026-07-04).**
> If a session opens after a reboot, or GitHub/Shopify CLI access to this repo seems
> off, run the `reconnect-check` skill (`.claude/skills/reconnect-check/`) before doing
> any manual git/Shopify troubleshooting. It verifies `git ls-remote` and
> `shopify theme list` connectivity and gives the exact fix if either is actually down.
> This is Code's skill to run directly. Cowork does not run git or the Shopify CLI (see
> the lane rule above) — if Cowork suspects a connectivity problem in this repo, it
> should flag it to Steve/Code rather than attempt its own fix. See `DECISIONS_LOG.md`
> 2026-07-04.
>
> **The browser screenshot tool is NOT broken — don't screenshot the `preview_start` tab
> (solved 2026-08-18).** Six §9 entries below (POC5, POC6, POC7, POC9, POC12, POC13) record the
> screenshot tool as "wedged" and fall back to expensive DOM measurement. **It was never wedged.**
> **THE FIX — two calls:**
> ```
> mcp__Claude_Browser__tabs_create              -> returns e.g. tab-1
> mcp__Claude_Browser__navigate  {tabId:"tab-1", url:"<preview url>"}
> mcp__Claude_Browser__computer  {tabId:"tab-1", action:"screenshot"}   # works
> ```
> **BOTH conditions are required** (corrected twice on 2026-08-18 before landing here):
> 1. **A `tabs_create` tab.** The tab `preview_start` makes (`tabId: "seed"`) **never** composites,
>    whatever the pane is doing — proven by querying both at the same instant under identical pane
>    state: seed reported `hidden`, the `tabs_create` tab reported `visible`.
> 2. **A displayed Browser pane.** A `tabs_create` tab goes back to `hidden` the moment the pane is
>    hidden, and screenshots start failing again mid-session. Ask Steve to show the pane.
>
> So it is neither purely user-side (first wrong guess) nor purely agent-side (second wrong guess).
> **Probe `{visibilityState, hidden, hasFocus}` before concluding anything** — `hidden:true` on a
> `tabs_create` tab means ask for the pane; `hidden:true` on `seed` means make a real tab. Also pass
> an explicit `{tabId}` to `resize_window`, or the new tab keeps its own default size.
> **Two things that made this durable.** (1) The error text — "the Browser pane is not displayed" —
> reads as a user-side problem and sent at least one session (this one, initially) down the wrong
> path of asking Steve to open a panel; that does not fix it. (2) JS execution is never gated on
> visibility, only throttled, so `javascript_tool` kept returning correct DOM geometry on the dead
> `seed` tab, which made the measurement workaround look like a sound answer rather than a symptom.
> **Cost of the error:** POC13 re-rendered `object-fit:cover` crops offline in Pillow to judge
> photography it could simply have looked at. DOM geometry is authoritative for position, size and
> keyboard reachability but **cannot** judge crop, colour, composition, or synthesised type — and
> the first visual pass (2026-08-18) found brand-critical defects in all four categories that six
> DOM-only passes had missed. **Look at the page; do not only measure it.** The §9 entries are left
> as written (historical narrative, per `crema-poc-deploy` Step 6.4); this callout is the
> present-tense truth.

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
- **Never** push or deploy to Shopify — any theme, live or preview — without FIRST running
  `shopify theme list` and `git log origin/main..HEAD`, and never state what is deployed from
  a document. **Live output beats every document, including this file**; when they disagree the
  document is stale and gets corrected in the same pass. (2026-07-24: a week-old "not yet
  deployed" line in a change list was trusted over a live check — which had already contradicted
  it that same session — and created a duplicate Shopify theme.) For a full POC batch deploy use
  the **`crema-poc-deploy`** skill, which makes this its first step; this rule still binds for
  one-off, scoped, and live pushes that the skill does not cover.
- **Never** delete or rename anything under `<OneDrive>/CremaItalia LLC/` without
  asking — that's the operations folder, not the code folder
- **Never** use emoji in copy or commit messages (Steve hasn't asked for emoji)
- **Never** use "hand-picked," "world-class," "exclusive," or other e-commerce-loud
  language in brand copy
- **Never** use em-dashes in customer-facing copy (product text, page copy, forms,
  emails, coming-soon page) - they read as AI-generated (Steve, 2026-07-13). Replace per
  this rule: where a semicolon would work, use a spaced regular dash (` - `); where a
  sentence trails into a sequenced next thought, use an ellipsis (`...`); if unsure, ask
  Steve. This applies to customer-facing copy only - internal docs (this file, the change
  lists, code comments) may still use them.
- **Never** use "Tour" as a site or category term (Steve, 2026-08-19). *Tour* is a SKU
  **name** - `Tour d'Italia 1`, `Tour Tuscany` - not vocabulary. The archetype is a
  **collection**, and a collection need not be a tour at all: `Decaf Collection 1` and
  `Roaster's Favorites 2` are the same thing. The word had crept into the storefront, the
  Store Operating Standard and the build spec as the category name; it was swept out in
  POC16. Name a product whatever it should be called; describe the archetype as a collection.
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
   (today: **v2.1**).
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
`Built to Brand Standards v2.1`. On the next edit, compare that stamp to the current
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
  (locked business rules — **NOTE: the Magic Build Prompt was RETIRED as a build artifact
  2026-07-03, see that entry below; it is archived, NOT authoritative. The business rules it
  captured, incl. the pricing markup matrix, are now carried by the repo/POCs + this §9 log,
  not by the archived Prompt. Do not read the Prompt as governing.**), `00_PROJECT_BRIEF.md`
  (single source of truth),
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
- 2026-07-03 — **Magic Build Prompt RETIRED as a build artifact; the theme repo (POCs +
  this §9 log + `DECISIONS_LOG.md`) + brand standards are the source of truth going
  forward (Steve).** Now that the POC is live and working in this repo, the Magic Build
  Prompt's job — getting Shopify Magic to the *initial* build — is done. It is **archived,
  not authoritative**: `Shopify_Magic_Build_Prompt_v3_FINAL.txt` (nav line corrected first)
  now lives in `Operations/In USA/shopify/Initial Site Build Out/Archive/` alongside v1/v2.
  **We do NOT need a Magic Prompt to convert the POC into the live build.** The locked
  business rules it once held remain in force — most importantly the **pricing markup
  matrix + SKU_LAST_COST model** (see the 2026-06-29 entry above, and the fuller writeup
  in this repo) — but their canonical home is now the repo/decisions, not the Prompt. Do
  not resurrect, diff against, or "read the current Magic Prompt" for this project; if a
  business rule needs restating, it goes in this §9 log / `DECISIONS_LOG.md`, not back into
  a Prompt. Full decision: `Coordination/DECISIONS_LOG.md` 2026-07-03 (status: locked).
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
    entry is the durable summary. **Committed** (commit `3256143`) — **not yet pushed**
    to GitHub or to the preview theme; both still need Steve's go-ahead.
- 2026-07-04 — **Two-Code-sessions coordination rule added.** While the POC4 batch was
  being built in one Code session, Steve had a second Code session independently
  editing the coming-soon page (`assets/crema-italia.css`, `layout/password.liquid`,
  `templates/password.liquid`) in the same checkout, believing the POC was fully
  independent from the coming-soon page. It worked out only because the two sessions'
  file sets happened not to overlap — the existing "Code owns this repo" coordination
  rule (top of this file) only covered Code vs. Cowork, not two Code threads sharing
  one working tree, which is the same failure mode that produced the earlier Cowork
  truncated-commit incident. Added an explicit callout (top of file) covering this:
  use `git worktree` for true isolation, or commit-and-pause at natural stopping
  points if sharing one checkout; never leave work uncommitted while another session
  might also be writing. The POC4 commit (`3256143`) was scoped to only the files that
  session actually touched, deliberately excluding the coming-soon-page changes so
  they could be reviewed and committed independently.
- 2026-07-05 — Refreshed `config/settings_data.json` per §6.1 brand-current-on-edit:
  `color_text` `#3B1F12`→`#55331B` (Espresso), `color_accent` `#C46A1F`→`#B88348`
  (Crema Gold), `font_heading` `cormorant_garamond_n6`→`marcellus_n4`.
  `color_background` (`#FBF8F1`, Cream) was already current. Confirmed via grep for
  `settings.color_` / `settings.font_heading` across all Liquid/CSS that none of these
  keys are referenced anywhere — `settings_schema.json` doesn't even declare them as
  theme settings (only `theme_info` exists there). This is dead config left over from
  Shopify's default theme-editor scaffold; Marcellus/Inter and the Espresso/Gold
  palette are loaded independently via `@font-face`/`<link>` tags in `layout/theme.liquid`
  and hand-authored CSS custom properties in `assets/*.css`. Cosmetic-only cleanup, no
  rendering change, so no flag to Steve was needed.

---

- 2026-07-05 — **Diagnosed Steve's "POC dropped me into the landing page" report — false
  alarm caused by the storefront password gate, not code corruption.** Steve completed
  the taste quiz + simulated sign-in on POC4 and landed on the coming-soon marketing copy
  (with the POC header/nav and taste-profile banner on top of it) instead of the Shop
  page; nav clicks did nothing. Pulled the deployed preview theme (`151277174953`) and
  byte-diffed every relevant file against the repo — `layout/theme.liquid`,
  `layout/password.liquid`, `templates/index.liquid`, `templates/password.liquid`,
  `ci-header`, `ci-profile-banner` — all identical, nothing corrupted. Root cause: the
  store's separate storefront-password gate (confirmed via `shopify theme dev` itself
  refusing to start non-interactively and asking for the store password) got triggered
  after a cache clear wiped the browser's unlock cookie; the draft-theme preview link
  still showed the theme's own chrome (header/quiz auto-launch) but rendered
  `templates/password.liquid`'s content into it instead of the real SPA, so `showPage()`
  calls silently failed (no matching `#page-*` div in that markup). Confirmed the actual
  POC storefront and nav routing work correctly once the password gate isn't interfering
  — reproduced the full quiz → sign-in → Shop-page-with-taste-profile flow via a local
  `shopify theme dev` session and it worked end-to-end.
  **Separately found while investigating "View Store" showing an old, plain coming-soon
  page:** that was also a false alarm — a true logged-out fetch (`curl`, no cookies)
  confirmed the actual public page at cremaitalia.com is already current (new logo,
  "Italian coffee, brought over whole.", Founding Members copy). Steve's admin session
  was bypassing the password gate on the **live** theme and hitting its dormant, never-
  finished `templates/index.liquid`/`layout/theme.liquid` placeholder instead — a page
  real visitors can't reach (password protection redirects every route, confirmed even
  for a 404, to `/password`). **Important repo hazard identified:** the local repo's
  `templates/index.liquid` and `layout/theme.liquid` are now the POC4 SPA files (POC3
  overwrote what used to be the live theme's own placeholder) — they no longer represent
  what should ever be pushed to the live theme id (`150557294761`). A blanket
  `shopify theme push --theme 150557294761` (no `--only`) would replace the dormant
  coming-soon placeholder with the entire mocked POC storefront. **Fix applied:** pushed
  only the one file that was genuinely stale on the live theme's safe-to-touch set —
  `templates/404.liquid` (brand/copy refresh, still coming-soon-family, not POC) — via
  `--only templates/404.liquid --allow-live`. Nothing else was pushed live.
  **Also renamed** the draft theme `151277174953` from "Crema Italia POC3 Preview" to
  "**Crema Italia POC4 Preview**" (see the new draft-naming callout at the top of this
  file) and set up a local dev-server path for testing (`dev.cmd`, gitignored, carries
  the storefront password) so future QA passes use `shopify theme dev` instead of the
  raw `preview_theme_id` link, sidestepping this whole class of password-gate fragility.
  **Follow-ups:** none blocking — POC4 is confirmed working end-to-end. Whenever the
  real production storefront is eventually built, the live theme's `templates/index.liquid`
  will need to be authored fresh (not copied from this repo's current `index.liquid`,
  which is the POC SPA).

- 2026-07-06 — **Found the real friend-testing link, then found a real-browser flaw in
  it, then fixed it properly.** Follow-on to the 2026-07-05 diagnosis above. Gave Steve
  the raw `?preview_theme_id=151277174953` link + the storefront password ("Doppio") as
  the friend-testing recipe, and verified the recipe with `curl` — which falsely looked
  fine. Steve tried it in an actual incognito window and still got the coming-soon page.
  Root cause of the gap: `curl`'s cookie handling isn't a faithful stand-in for a real
  browser's cross-domain cookie behavior, so the `curl`-based verification wasn't real
  proof. Steve's screenshot confirmed the same hybrid password/POC-chrome page as the
  original bug, this time genuinely in incognito, with a barely-visible "Enter using
  password" link at the bottom — technically usable, but not a reasonable ask for a
  "send this to friends" link. **Actual fix:** the friction is inherent to
  "Password protect your storefront" being a store-wide gate independent of theme
  preview — no link can skip it while that setting is on. Turned it OFF instead
  (Online Store > Preferences), which is safe right now because the live theme's own
  homepage (what's exposed while the gate is off) is just the old harmless placeholder,
  not the POC and not final copy. Confirmed working: Steve reopened a fresh incognito
  window and the plain preview link now loads the POC with zero friction. **This is a
  live, currently-active state change** — see the new ⚠️ callout at the top of this file;
  turn the password back on once friend-testing is done.
  **Separately diagnosed:** the taste quiz not auto-launching on a later visit. Not a
  bug — `ci_quiz_seen` in `localStorage` gets set the moment the quiz modal is closed
  for any reason (×, outside click, or Escape — see `assets/ci-storefront.js` `closeQuiz()`
  and the global Escape handler), and it had been set earlier in the same incognito
  session while poking at the broken hybrid page (which still loads the real quiz modal
  underneath). Incognito only wipes storage when **every** incognito window from that
  session is closed — reloading, or opening new tabs in the same session, does not
  reset it, which is a common misconception worth remembering for future testing/QA
  instructions. Confirmed fixed by fully closing all incognito windows and reopening a
  fresh one.
  **Follow-ups:** turn storefront password protection back on when Steve's friend round
  is finished (see the top-of-file callout — this is the one open action item from the
  whole investigation).
- 2026-07-07 — **Updated the live theme's own homepage to match the current coming-soon
  design, resolving the repo hazard flagged in the 2026-07-05 entry.** Steve asked (after
  weighing the tradeoff — see that conversation) to fix the live theme's homepage
  properly rather than rely on the password gate to always be on. Problem: the main
  repo's `templates/index.liquid` / `layout/theme.liquid` are the POC4 SPA files, so
  they can never be pushed to the live theme (`150557294761`) — doing so would replace
  the coming-soon page with the entire mocked storefront. Solution: added a new
  **`live-theme/`** folder (`live-theme/templates/index.liquid`,
  `live-theme/layout/theme.liquid`) as the dedicated, version-controlled source for the
  live theme's own homepage + general layout — deliberately kept separate from the main
  `templates/`/`layout/` folders so the two theme deployments' files can never collide.
  Content mirrors `templates/password.liquid` (logo, "Italian coffee, brought over
  whole.", Founding Members offer, Open Graph/Twitter social-share tags) minus the
  password-entry box, which doesn't apply once you're already viewing the unprotected
  page; `layout/theme.liquid` also keeps its pre-existing generic title logic (needed
  for policy pages, 404, etc.) rather than copying `layout/password.liquid` verbatim.
  Deployed with `shopify theme push --theme 150557294761 --path live-theme --only
  layout/theme.liquid --only templates/index.liquid --allow-live` (a scoped push,
  same pattern as the earlier `templates/404.liquid` fix). Verified with a clean,
  cookie-less `curl` fetch of the real homepage and the 404 page post-push — correct
  copy, working Open Graph tags, no Liquid errors on either template.
  **Practical effect:** the "which fallback is worse" tradeoff from the password-gate
  discussion is gone — the live homepage is now the current design either way, so the
  password toggle only matters for keeping the POC4 preview link from being casually
  discoverable, not for copy quality. See the revised ⚠️ callout at the top of this file.
  **Follow-ups:** none for this change. When the real storefront eventually replaces the
  coming-soon page at launch, replace `live-theme/templates/index.liquid`'s content
  entirely (it says so in its own header comment) rather than reusing it.
- 2026-07-09 — **POC4 review session with Steve → two small POC edits applied + a POC5
  backlog and a production build spec captured.** Steve walked the POC4 preview
  (via `dev.cmd` → `shopify theme dev`) and flagged a batch of account-page, About-page,
  photo, and information-architecture items. **Applied this session (committed):**
  (a) **toast sliver fix** — `.toast` in `assets/ci-storefront.css` now uses
  `opacity:0;visibility:hidden` at rest so the empty notification pill no longer peeks a
  ~15px brown sliver at the bottom-center of every page (its `translateY(120%)` hide
  didn't clear the `bottom:1.5rem` offset); still slides + fades in on a real message.
  (b) **About team/partner roles** — added a `.person-role` line (photo · name · role) to
  each Team/Partners card: Lucia Calo' = Italian Operations Manager, Asia Chirdo = Italian
  Board Advisor, Lauren Roberts = US Operations Manager, Partner 1 (placeholder name) =
  Italian Freight Forwarder. **Captured as backlog (NOT yet built):** a **POC5 backlog** in
  `docs/POC5_change_list.md` — notification-preferences stub (Option 1, instruct-not-model);
  Membership tile identity-vs-Active/Lapsed split (decide "Founding Member"+status chip vs
  "Founding Subscriber"); a Subscriptions tile + cancellation/entitlement flow with a POC
  mock; Recent Orders tile redesign + instruct-not-model reorder/subscribe/discount-nudge;
  and finger-first multi-photo across all shelves incl. Bottega + a real detail-page gallery
  (tap-band + swipe, dots as indicator, Option B navigation). **Production design prompts**
  in `docs/production_build_spec.md` — the data-driven-content umbrella rule; About content
  architecture (static Founder/Company, sections+blocks for Team/Partners, metaobjects if it
  grows); Journal = native Blog/Articles; footer relationship pages (Affiliates/Wholesale/
  Careers/Press/Contact, post-launch, needs an affiliate app, distinct from About→Partners);
  and the Loop-vs-native-vs-Functions account/entitlement split. **Also:** hit a Shopify CLI
  hot-reload bug on Windows (temp files rejected — "Must have a .liquid file extension") that
  broke `shopify theme dev`'s live-reload of `.liquid` files (assets/CSS unaffected); the
  POC4 preview theme `151277174953` was untouched (dev syncs to a throwaway Development
  theme). Updated the Shopify CLI to 4.4.0 (`npm install -g @shopify/cli@latest`) to fix it.
  **Later in the same session:** also applied + committed a **home "See the Tour" fix**
  (`templates/index.liquid` — the Featured Tour button now `openProduct('tour-ditalia-1')`
  straight to the tour detail instead of dead-ending on the Sorpresa shelf); **revised the
  POC5 photo plan** (Steve) — multi-photo is now **detail-page-only**, tiles go single-photo
  on ALL shelves incl. Bottega (removes the tile carousel/dots entirely, builds one gallery
  on the PDP); and ran a **consumer-centric site review** whose findings are logged as POC5
  change-list item 6 (POC-actionable: hero rewrite, home resequence, surface founder story,
  quiz prominence, early value, nav order) and production_build_spec.md §6 (trust signals,
  photography). **Steve paused for the evening 2026-07-09; NEXT SESSION priority (2026-07-10)
  is the home-page compelling/resequence work — draft the new hero copy WITH Steve first.**
  See the "▶ NEXT SESSION — START HERE" banner atop `docs/POC5_change_list.md`.

- 2026-07-10 — **POC5 landing page designed, modeled live, and LOCKED with Steve.** Worked
  the home page interactively in the running `shopify theme dev` preview (build-model → Steve
  reacts → iterate → sign-off), then locked it. Final `#page-home` (`templates/index.liquid`
  + `assets/ci-storefront.css` + `jumpHome()` in `assets/ci-storefront.js` + new asset
  `assets/ci-signature.png`): **hero** = Steve's two questions as lead → payoff H1
  **"Benvenuto — welcome in."**, no hero button, logo enlarged (~264px/176px) with trimmed
  top gap and balanced spacing; **sticky jump-chips** (Our story · Roasters · Shelves ·
  Promise · Tasting Quiz); **story-first sequence** — confession (Steve's first-person
  founder/decaf origin story) with his **espresso-recolored handwritten signature** +
  "Steve Roberts, Founder" → model + "Email me here" → four shelves → single **Begin with a
  Sorpresa Tour** button → **"Still unsure?"** inline **three-question quiz** link → roasters
  → promise. **Featured Tour removed from home.** **Locked brand/UX decisions:** (1) the
  first-visit **quiz auto-launch was removed** as a mild gimmick inconsistent with the
  anti-dark-pattern brand — quiz is now invitation-only; (2) **CTA hierarchy** — Sorpresa is
  the one primary button, quiz is a quiet inline link, **Roccia gets no home CTA** (second
  sale, earned later). Signature processed from a phone photo (Pillow: paper knocked out,
  recolored to Espresso `#55331B`, tight-cropped transparent PNG) and kept as the ONLY
  handwritten element on the site. Copy edits applied (Selezione spelling, *un caffè* italic,
  grammar). Full spec in `docs/POC5_change_list.md` item 6. Committed + pushed. **Remaining
  POC5 backlog = account-page items + detail-page photo gallery** (change-list items 1–5).

- 2026-07-10 — **Founding Member mechanic LOCKED + account tile states mocked.** Decided the
  Founding-rate model with Steve: "Founding Member" is a permanent honorific (No. 087); the
  12% is an *Active Subscriber Discount* tied to holding a subscription. **Two states, no grace
  period:** Active Founder (12%) / Forfeited (10%). **Pause preserves the rate** (indefinitely)
  and **Loop dunning protects failed cards** — the only way to forfeit is a deliberate full
  cancel after being offered Pause; forfeiture is permanent (return at 10%, never 12%), and the
  No. 087 honorific is kept forever (muted). Rationale: the 12-vs-10 delta is tiny (~$10/yr) so
  it's a pride good; Pause + tiny stakes + always-welcome-back + disclosure prevent the "angry
  founder exits forever" failure mode Steve worried about. An earlier grace-period idea was
  dropped (Pause does it better). **Mocked in the POC** (`assets/ci-storefront.js` + `.css`):
  Membership tile renders Active vs Forfeited; the "Manage your subscription" area has a
  pause-first cancel flow (Pause and keep 12% / Cancel anyway → forfeit) + Resubscribe; the cart
  discount honors forfeiture (12%→10%). Delivered quietly per brand (hairline box, gold accent,
  no alarm colour). Production entitlement rule in `docs/production_build_spec.md` §5; detail in
  `docs/POC5_change_list.md` items 2–3. Committed + pushed. **POC5 backlog remaining: notification
  stub, Recent Orders redesign, detail-page photo gallery** (change-list items 1, 4, 5).

- 2026-07-10 — **Detail-page photo gallery built — POC5 build backlog COMPLETE.** Per the
  2026-07-09 decision: removed the tile photo carousel (all shelves now single-image like
  Bottega; clicking a tile just opens the product), and built the multi-photo gallery in ONE
  place — the product detail page — for every shelf: main image with prev/next arrows, tap the
  left/right half, swipe on touch, and a thumbnail strip (active thumb gold-outlined), all
  looping. Slides remain placeholders (front / back / label close-up) pending real SKU
  photography. Detail in `docs/POC5_change_list.md` item 5. **All six POC5 build items are now
  done** (landing page; Founding Member mechanic + account tile states; notification stub;
  Recent Orders redesign; detail-page gallery). **NEXT: deploy the POC5 batch to a renamed
  "Crema Italia POC5 Preview" theme** (needs Steve's go-ahead) per the draft-theme naming rule
  — it is committed to git + viewable on the local `shopify theme dev` but not yet pushed to a
  Shopify preview theme. Remaining open items are production design prompts (About/Journal/
  footer IA), not POC builds.

- 2026-07-10 — **Tour/bundle BOM filtering built (Option A) + administrable-BOM production
  requirement documented.** Steve's model: a Tour is a Bill-of-Materials SKU (box + component
  coffees + card), and it should be "positive" to a filter if ANY of its component coffees
  matches. Built it: added `component_handles` to the Sorpresa Tour (`ci-catalog.json`) and
  `productFacets()` (`ci-storefront.js`) so a bundle's Region/Roast/Flavor/Caffeine facets are
  the UNION of its components; filtering uses membership (`inFacet`) on comma-joined
  data-attributes (dropped the old `any` wildcard). **Option A** (per-axis union; AND across
  axes) chosen over requiring one component to satisfy all filters. Card shows an "Includes …"
  cue. Verified live: Tour now shows under Emilia-Romagna (has a Gardelli) and is hidden under
  Decaf (no decaf component) — more honest than the old always-show. **Documented a REQUIRED
  production feature** (`docs/production_build_spec.md` §7): an admin-managed BOM builder — add
  a Tour, define its component SKUs, facets auto-derive, availability auto-gates on component
  stock/freshness, and the BOM drives 3PL assembly (box + coffees + card) with per-order
  packing slips. Committed + pushed.

- 2026-07-10 — **Roasting-regions: §8 decisions settled with Steve + editorial Regions page
  built.** Cowork researched Italy's roasting regions (OneDrive `Operations/In USA/shopify/
  06_Region_Reference.docx` + `07_Region_Map.svg`, logged *proposed* in DECISIONS_LOG). Steve's
  calls on the doc's §8 open questions: (1) region tagging is **roaster-level** (SKUs inherit;
  composes with the Tour BOM region-union already built); (2) **no region quiz question**, and
  Region is **not saved to the taste profile** — it's an ephemeral navigation/provenance filter
  only (**Taste is the only saved profile axis**); (3) **decouple the two surfaces** — the
  catalog Region *filter* grows one region at a time (Tuscany first; empty regions shown as a
  quiet "as we grow", never dead ends) while the editorial *map page* always shows all nine;
  (4) the map **is** customer-facing. Built the **Roasting Regions of Italy** page
  (`#page-regions`): brown hero + Cowork's map **inlined** (scoped `#region-map-svg` styles,
  Inter labels) + all nine traditions north→south with Tuscany carrying a "Where we are now"
  badge; source map kept at `assets/ci-region-map.svg`. Note: the nine-culture map deliberately
  omits **Emilia-Romagna** (Gardelli's region — not a classic espresso culture); the filter will
  name it separately + "Other" for outliers (map ≠ filter list, by design). **NEXT: Shop
  restructure** — move Taste (roast/flavor/caffeine) into a brown hero "taste console" with
  save-to-profile; keep Shelf + Region as ephemeral body filters; Region on its own line (active
  regions + "as we grow" + Other + "Learn more about regions" → this page). The DECISIONS_LOG
  region entry can move *proposed → locked* once the Shop restructure lands (Cowork's lane).
- 2026-07-10 — **Shop restructure built + region vocabulary standardized.** Reworked the Shop
  page on the identity-vs-navigation split Steve diagnosed: **Taste (roast/flavor/caffeine)
  moved into a brown hero "taste console"** styled for the dark band, with save-to-profile —
  it's the ONLY axis saved to the profile; **Shelf + Region are ephemeral body filters**.
  "Shop the Catalog" framing + the four shelves named (fixes the "invisible catalog").
  **Region on its own line**: active (Toscana, Emilia-Romagna) + the rest greyed "as we grow"
  + an "Other" note + a "Learn about the regions →" link to the Regions page (the page is
  reachable ONLY from here — Steve wants it as a discovery surprise, not in nav/footer).
  Filters verified working post-move (taste console drives the grid; region membership +
  Tour BOM union intact). **Vocabulary standardized on Italian region names** — Piemonte,
  Lombardia, Trieste, Toscana, Emilia-Romagna, Lazio, Campania, Puglia, Calabria, Sicilia —
  across the filter, the inlined map, and the Regions page list (hub cities Milan/Turin/Rome/
  Naples/Friuli kept as locators in the page meta lines). **Cowork follow-up:** update the
  OneDrive source `07_Region_Map.svg` + `06_Region_Reference.docx` to the same Italian labels
  so the source and the theme's inlined copy don't drift.

- 2026-07-10 — **POC5 deployed to a new preview theme.** Pushed the accumulated POC5 batch
  (commit `6bbd906`) to a NEW unpublished theme **"Crema Italia POC5 Preview" (id `151420207273`)**
  via `shopify theme push --unpublished --theme "Crema Italia POC5 Preview" --json`. **POC4
  Preview (`151277174953`) and the live coming-soon theme (`150557294761`) were untouched** —
  new theme, not an in-place overwrite. Verified rendering on the real store via the preview
  link (storefront password still OFF from friend-testing). Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151420207273` · Editor:
  `https://crema-italia.myshopify.com/admin/themes/151420207273/editor`. To refresh after
  further edits: `shopify theme push --theme 151420207273`. Still open: turn storefront
  password back ON when friend-testing wraps; align Cowork's OneDrive region source to the
  Italian vocabulary.
- 2026-07-11 — **POC5 polish batch built, baked, and re-deployed.** Interactive
  build-model-show-Steve session on top of the deployed POC5. Landed: (a) **tricolore flag
  strips** — the top strip moved INTO the sticky header as green/white/red thirds (4px) with
  a 1px `#333` hairline so it now sticks instead of scrolling away; bottom strip got a
  matching hairline; the sticky `.home-jump` desktop offset bumped 58→68px to clear the
  ~10px-taller header (mobile `top:52px` left as-is, logged for the mobile review). (b)
  **Offerta home copy** — "one for value" → "one for last-chance lots at an honest markdown".
  (c) **Team/Partner detail pages** — clickable About tiles open a single reusable
  `#page-person` container populated by `openPerson(id)` from a new `people[]` array in
  `ci-catalog.json` (mirrors the roaster-profile pattern; the production seam per
  `production_build_spec.md` §2). Lucia & Asia are live with real bios + real headshots;
  Lauren & Partner 1 are inert until content arrives. Added a `window.CI_ASSETS` map in
  `theme.liquid` to resolve catalog photo filenames → asset URLs for the JS-rendered page.
  (d) **About photos** (all Steve's own photos — no rights issues; processed with Pillow:
  crop, tame warm flush, low-sat): new founder espresso headshot (`ci-founder.jpg` replaced),
  a stacked "Campiglia café dog-person test" tile (`ci-founder-dog.jpg`) under it, a stacked
  Sarteano *caffè* door tile (`ci-company-door.jpg`) under the company Tuscany photo, and
  real headshots `ci-lucia.jpg` / `ci-asia.jpg`. (e) **Team role labels** restructured to
  "Role - Location": Operations Manager - Italy (Lucia), Board Advisor - Italy (Asia),
  Operations Manager - US (Lauren), Freight Forwarder - Italy (Partner 1). (f) **Shop
  dropdown** — added an "All Shelves" item (roman label + explainer) above a divider and the
  four shelves; FIXED the auto-close (the "Shop" button itself never called `closeShopMenu()`
  — now it does, matching the shelves); renamed the Shop hero eyebrow THE CATALOG → ALL
  SHELVES and H1 "Shop the Catalog" → "Shop all our Coffee" so nav / dropdown / page align.
  Committed + pushed to GitHub + re-deployed to the **POC5 Preview theme (151420207273)**.
  **NEXT: full-site mobile review** (Steve, fresh task) — see the §10 to-do. Note: the
  browser-pane screenshot tool was wedged for much of this session, so changes were verified
  via live DOM/geometry inspection rather than screenshots.
- 2026-07-12 — **POC6 batch built, verified, committed + pushed.** Interactive
  build-model-show-Steve session on top of the deployed POC5. Detailed ledger in
  `docs/POC6_change_list.md`; durable summary here. Landed: **(1) Dropdown dead-menu bug** —
  the Shop/Account hover dropdowns went permanently dead after a selection because
  `forceCloseDropdown()` only re-armed on `mouseleave`, which never fires if the pointer
  stays in the nav column (or on touch). Now re-arms on the first of `mouseleave` /
  `pointermove`-off / `pointerdown`-outside → recovers on PC **and** tablet (one shared
  helper, so Shop + Account both fixed). **(2) Wording** — home Promise heading "Three
  things we mean." → **"We deliver on these promises."** **(3) Filter redesign** — replaced
  the two-object taste UI (global "profile active" banner + always-open hero "taste console")
  with **one ribbon + a console-on-demand modal**. New state model: `savedTaste` (persisted
  profile; null = none), `activeTaste` (current values), `filterOn` (applied or not). Ribbon
  is global (`ci-profile-banner.liquid`) but shows ONLY on Shop + the four shelf pages and
  ONLY when a profile exists (**no profile → no ribbon**, Steve's call — profiles are made
  via the quiz or the account page). Two honest states (off "not active — all items shown" +
  **Apply profile**; on "active — shelves filtered" + **Show everything**) with a gold state
  dot + **Edit profile** link. **Edit profile** opens the taste console **modal**
  (`ci-taste-console.liquid`) — pills stage into `activeTaste`, and a footer appears **only
  on change** offering **Apply** (ephemeral, not saved) vs **Save my changes** (persist +
  apply; signed-out routes through sign-in). **Fixed the "Show me everything" bug** (it used
  to report the profile active while showing everything — now captures the profile but leaves
  `filterOn` off, honest ribbon). **Shelf + Region moved back into the brown hero** (Steve
  #4); taste pills left the hero entirely. Ribbon text vertically centered. **(4) Back-links**
  — the roaster-profile and person-page back buttons hardcoded a fixed parent; both now use
  the existing `goBack()` history stack and read **"← Back"** (coffee→roaster→Back returns to
  the coffee, etc.). **(5) Tricolore** — the shared `.flag-strip` (header/footer/ribbon) went
  from a 4px block to a fine **1px** line. **(6) Ribbon sparkle** — a fine tricolore accent +
  a Crema-gold state dot (no decorative image, per brand). Also recorded **production
  requirement §8 in `production_build_spec.md`: the real store MUST be fully responsive for
  mobile + tablet** (no hover-only interactions on touch; the dropdown bug is the symptom).
  Verified end-to-end via DOM (screenshot tool wedged again). Committed + pushed to GitHub
  (commit `2d8c423`). **Deployed** (Steve's go, for multi-device testing) to a NEW unpublished
  theme **"Crema Italia POC6 Preview" (id `151440130217`)** via `shopify theme push
  --unpublished --theme "Crema Italia POC6 Preview" --json`. POC5 Preview (`151420207273`) and
  the live coming-soon theme (`150557294761`) untouched. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151440130217` · Editor:
  `.../admin/themes/151440130217/editor`. Storefront password still OFF (friend-testing), so
  the link works cross-device with no gate. To refresh: `shopify theme push --theme 151440130217`. **Open:** drop the header's `#333` hairline under the now-
  1px tricolore (pending Steve); sweep the dead CSS from the old taste UI. **NEXT (Steve):
  the mobile-ready POC** — folds into the queued full-site mobile review.

- 2026-07-13 — **Coordinator "truncated files" alarm was a FALSE ALARM — root cause was a
  stale `.git/index.lock`, not truncation.** The scheduled coordinator (Cowork) reported the
  theme repo had "uncommitted, apparently truncated changes across 7 files" (the exact POC6
  file set) plus a fresh `.git/index.lock`, flagging it as the known truncated-write failure
  mode. Code investigated directly: `git status` was **clean**, `git diff` showed **no content
  changes**, both POC6 commits (`2d8c423`, `bf95448`) were present + pushed, and the tail of
  every flagged file was intact (`})();`, `</html>`, proper closing tags — nothing cut off).
  The only real artifact was a **0-byte `.git/index.lock` from 07:11**, left by an interrupted
  git operation (timing matches the coordinator's own scheduled `git status` run — `git status`
  can briefly take an index.lock to refresh the stat cache, and if interrupted leaves a stale
  one). With that lock present, a `git status` can misreport clean files as "modified" (this
  repo has LF→CRLF autocrlf churn, so every text file shows a line-ending warning), which is
  almost certainly what the coordinator misread as truncation. **Fix:** removed the stale lock
  (`rm -f .git/index.lock`, no git process running, per the brief's sanction) — git healthy
  and up to date with origin. **Lesson for future sessions/coordinator:** a stale `index.lock`
  + autocrlf warnings ≠ truncation; verify with `git status --short` (empty = clean) and the
  file tails before sounding the alarm. Also fixed the one legit repo finding the coordinator
  raised (a stale nav-order comment in `ci-header.liquid`, `Roasters·About·Journal·Bottega` →
  the actual `Bottega·Roasters·Journal·About`, commit `e53817d`). The other two coordinator
  findings (OneDrive region docs still English; Commerce Playbook pricing table stale) are
  **Cowork/OneDrive lane, not Code's repo** — routed to Steve/Cowork. **Coordinator routine
  hardened same day** (Steve updated the scheduled prompt): it now uses only lock-free,
  read-only git (`git --no-optional-locks log/show`) and never `git status`/`git diff`, and
  **working-tree integrity — uncommitted changes, truncation, `.git/index.lock` — is
  explicitly out of its scope** (Code's lane). That removes both the mechanism that created
  the stale lock and the invented "truncation" check, so this false alarm shouldn't recur.

- 2026-07-13 — **Brand voice rule added: no em-dashes in customer-facing copy** (Steve).
  Em-dashes read as AI-generated, so they're out of all customer-facing text (storefront
  product/page copy, forms, and the live coming-soon page). Replacement rule Steve gave:
  where a **semicolon** would work (two related independent clauses), use a **spaced regular
  dash** (` - `); where a sentence **trails into a sequenced next thought**, use an
  **ellipsis** (`...`); if genuinely ambiguous, **ask**. Recorded in §6 "Things to NEVER do."
  Internal docs (this file, `docs/*` change lists, code comments) are exempt. Kicked off a
  sweep of the ~178 existing occurrences across `templates/index.liquid`, `assets/ci-catalog.json`,
  `assets/ci-storefront.js`, the `snippets/ci-*`, and the coming-soon files
  (`live-theme/`, `templates/password.liquid`, `templates/404.liquid`). **Coordination
  follow-up (Cowork lane):** the canonical OneDrive Brand Standards (v2.0 PDF + HTML source,
  §3.1 Voice) and `Coordination/DECISIONS_LOG.md` should carry the same rule so the source of
  truth doesn't drift - flagged to Steve/Cowork rather than edited from Code.

- 2026-07-13 — **POC7 batch built, verified, committed + pushed + deployed - the mobile-ready
  pass.** Detailed ledger in `docs/POC7_change_list.md`; durable summary here. **(1) Responsive
  mobile/tablet header (keystone):** the header wrapped to ~146px/3 rows on phones and the
  Shop/Account dropdowns were hover-only (dead on touch). Rebuilt as a **62px single-row bar
  with a hamburger** below 1024px OR on any touch device (`@media (max-width:1024px),
  (hover:none) and (pointer:coarse)` - catches iPads in landscape too); the hamburger opens a
  full-width tap-first panel (Shop shelves inline, nav, Search/Cart/Sign-In or account links).
  New JS `toggleMobileMenu()`/`closeMobileMenu()` wired into `showPage()`/`openSignin()`; new
  `.hamburger` markup + mobile row labels in `ci-header.liquid`. **Desktop (>1024, mouse) is
  unchanged** (verified). **(2)** Sticky home-jump chip bar now clears the 62px header
  (`top:61px`, was buried at `top:52px`) and is a one-row horizontal-scroll strip on mobile.
  **(3)** Touch targets sized up (nav 48px, filter pills 44px, gallery arrows 44px, steppers
  40px, modal close 44px). **(4)** Dropped the header tricolore's `#333` underline (single clean
  line; footer strip's hairline kept, Steve scoped it to the header). **(5)** Dead-CSS sweep
  (`.taste-console`+`.tc-*`, `.save-profile`, `.filter-bar/.filter-row/.filter-divider`,
  `.pf-hint` - all verified unreferenced; live `.taste-console-modal`/`.tc-groups`/`.filter-*`
  kept). **(6)** Home hero copy: "Italian Bar (Café)" → "(Caffè)". **(7)** Applied the new
  no-em-dash rule across all customer-facing copy (literal `—` AND `&mdash;` entities incl. the
  page `<title>`, hero, About, Regions, coming-soon titles/og); verified zero em-dashes in the
  rendered DOM across all pages. Verified responsive geometry via DOM at phone portrait/landscape,
  tablet portrait/landscape, desktop (screenshot tool wedged again). Committed + pushed to GitHub.
  **Deployed** to a NEW unpublished theme **"Crema Italia POC7 Preview" (id `151449862313`)** via
  `shopify theme push --unpublished --theme "Crema Italia POC7 Preview" --json`. POC6 Preview
  (`151440130217`) and the live coming-soon theme (`150557294761`) untouched; storefront password
  still OFF so the link works cross-device with no gate. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151449862313` · Editor:
  `.../admin/themes/151449862313/editor`. To refresh: `shopify theme push --theme 151449862313`.
  **Open (for Steve's eye on device):** phone ribbon ~150px tall; About team/partner cards stack
  1-per-row; footer tricolore hairline (drop for symmetry?); three borderline dash-vs-ellipsis
  copy calls (see change list). **Windows CLI note:** `theme dev` hot-reload of `templates/*.liquid`
  still trips the temp-file bug; a dev-server restart (full upload) clears it.

- 2026-07-13 — **Source-of-truth architecture adopted: three versioned Standards, repo-canonical
  (Option A), + the source/render model (Steve).** Prep work before generating the real storefront.
  Triggered by a readiness-gate finding: the retired Magic Build Prompt (see 2026-07-03) still
  contained the only complete copy of locked commerce rules (the pricing markup matrix), i.e. a live
  rule whose only home was an archived, non-authoritative doc — the same drift class as Item-1's
  stale §9/`storefront-plan.md` cross-references. Fix, abstracted with Steve: **separate *source*
  from *render* — one editable source of truth per Standard, versioned, in the repo (git = the gate);
  every human/Cowork/PDF copy is a read-only, version-stamped render.** Named **three Standards** by
  kind of truth: **Brand Standards** v2.0 (look & voice), **Store Operating Standards** v1.0
  (pricing/shelves/discounts/subscriptions/Tours/fulfilment), **Collaboration Standard** v1.0 (lanes,
  source/render model, editing protocol). Sources now live in `docs/standards/` (`README.md` +
  `store-operating-standards.md` + `collaboration-standard.md` + `brand-standards/` with the HTML
  source, CSS, current fonts, and the PDF render). **Two governance decisions locked this session:**
  (a) **Option A** — repo is canonical for *all* Standards (Brand Standards re-homed from OneDrive
  into the repo; OneDrive keeps read-only renders); (b) **Cowork proposes, Code applies** — any edit
  Steve asks Cowork to make to a repo artifact is converted into a prompt for Code. Also: distinguished
  **Standard (what's true now)** from **log (what changed, when)** — §9 + `DECISIONS_LOG.md` stay
  logs; rules move into Standards; `CLAUDE.md` gets a slim pointer block (top) so it stops carrying
  rule-text and doesn't grow overweight (the coordination callouts are being consolidated into the
  Collaboration Standard). The Operating Standard transcribes the locked rules faithfully and parks
  **5 open decisions** in its §12 — most important: **per-SKU markup override** (Steve's remembered
  intent that never made it into the recorded data model — the matrix is per shelf/size only), and
  **the SKU price-maintenance tool** (landed-cost × markup + approval governance is NOT native
  Shopify; must be built). No theme code written. Committed. **NEXT:** walk the §12 open decisions
  with Steve; render the Standards to stamped PDFs for his shelf; then resume the production build
  readiness gate. Full model: `docs/standards/collaboration-standard.md`.

- 2026-07-13 — **Store Operating Standards v1.0 → v1.1: three open decisions closed + Founding-member
  model materially revised (Steve).** Walked the §12 open decisions with Steve. (1) **Per-SKU markup
  override** — matrix stays the default; added an optional `markup_override` per SKU (blank = inherit
  shelf/size), a deliberate exception that routes through the same admin approval as any price change.
  (2) **SKU price-maintenance tool** — phased: spreadsheet-assisted at launch (small catalog, 6–10-wk
  lot cadence) + Shopify Flow for Offerta aging; build a lightweight custom approve/hold/defer app
  only when volume justifies (back-office; doesn't touch the theme build). (3) **Subscriber-benefit /
  pause-cancel model** — REPLACED the 2026-07-10 "Active/Forfeited permanent-forfeiture" model.
  New model: benefits (discount **and** shipping offsets) bound to **≥1 actively-shipping
  subscription**; pausing-all OR cancelling-all triggers a **60-day win-back grace**, then benefits
  lapse; reinstated at tier on any resume/re-subscribe. **Founding Member status is now DURABLE and
  account-level** — survives cancelling any/all subscriptions; a returning founder comes back at 12%;
  lost ONLY by closing the entire account (releases the numbered slot, e.g. death → family closes
  account). The `founding_rate_forfeited` one-way tag and Active/Forfeited states are RETIRED (do not
  build). Self-service controls specified: pause a sub / pause all with bounded windows ([next cycle]
  / [next two cycles], longer → cancel), cancel a sub / cancel all (immediate ship stop, benefits keep
  the 60-day grace). Rules in Store Operating Standards §2.2/§3.1/§4/§6/§11; §12 decisions 1/2/4 marked
  RESOLVED. Also updated `docs/production_build_spec.md` §5 to point at the Standard (was carrying the
  stale 2026-07-10 forfeiture rule — drift fixed). Standard re-rendered to
  `Store_Operating_Standards_v1.1.pdf`. **FOUND: the POC account/subscription flow
  (`assets/ci-storefront.js`) still implements the retired Active/Forfeited model** (`foundingForfeited`
  state, "return at 10%" copy, permanent-forfeit cancel flow) — out of sync with v1.1; flagged to Steve
  to decide fix-now vs defer-to-production (no theme code changed this session — gate still open).
  **[Correction, appended 2026-07-13:] this "still implements the retired Active/Forfeited model"
  finding is RESOLVED — commit `284c43b` ("POC: correct account flow to durable-founder model") updated
  `assets/ci-storefront.js` to the durable model (no `foundingForfeited`, cancel never forfeits, 60-day
  grace copy). The above sentence reflects the state at the moment it was written; the POC account/
  subscription flow now matches Standard §3.1/§4. (Note this is distinct from the separate discount-
  stacking drift tracked in `docs/POC_drift_from_standards.md`, which is still open.)**

- 2026-07-13 — **Readiness gate CLOSED — Team/Partners mechanism locked = sections + blocks
  (Steve); production build unblocked on decisions.** Last open production decision from the gate:
  Team/Partners content managed via **Shopify sections + blocks** (theme-editor "Add block", friendly
  for a non-technical owner), NOT metaobjects — metaobjects deferred as an upgrade path only if an
  entry is reused across pages (e.g. a team member also authoring Journal posts) or the lists grow
  large. Recorded in `docs/production_build_spec.md` §2. **Gate status:** all substantive
  decisions are now locked (pricing matrix + per-SKU override + governance; discounts; durable
  Founding model + 60-day benefit grace; subscriptions/Loop; Tours/BOM; account split; price-tool
  phased approach; Team/Partners). What remains is **not decisions** — pre-launch validation (sanity-
  check real SKUs through the pricing matrix vs the landed-cost model) and asset-gated content (real
  photography, trust signals, no-waste Promise copy, the invented "Surprise me" persona names). Ready
  to start the production build when Steve is (see the ready-to-use prompt in `production_build_spec.md`).

- 2026-07-13 — **Store Operating Standards v1.1 → v1.2: discount model changed to no-stacking
  highest-wins (`MAX`), plus three cold-read contradiction fixes (Steve).** A fresh cold-read
  readiness gate on the three Standards surfaced real internal contradictions in the discount section
  and matrix; Steve's calls closed them. **(1) Discount stacking replaced with `MAX`.** No discount
  ever stacks — the applied rate is `MAX(every discount the customer qualifies for)`; all others are
  obviated. Steve's rule verbatim: "non-stacking period, highest discount wins … MAX(d1,d2,d3)."
  Consequences now in the Standard §3: a founder who is also a first-time buyer gets **12% (not 17%)**;
  a first-time buyer who earns the 3-bag volume tier gets **10% (not 15%)**; the `MAX` rule *is* the
  cap (no separate ceiling). Rationale: tight per-bag margins — additive stacks "could eat our lunch."
  **BFCM** is no longer "+5% additive" (illegal under `MAX`) — it's a flat 5% candidate that competes
  in the `MAX`. **(2) Delivery mechanism split** (fixes the §3-vs-§11 contradiction): the standing
  subscriber/founder benefit applies **automatically server-side** when signed in (Shopify Functions +
  entitlement tag); campaign discounts (first-time, volume, abandoned-cart, win-back, BFCM) apply via
  URL/email link — but only the single highest rate lands either way. §11 entitlement note updated:
  `applied = MAX(standing, qualifying campaign)`, never a sum. **(3) Referral → TBD** (§3 + new §12.6):
  the old "free 100g bag" reward is void because 100g exists only inside Tours (§1) — no standalone
  100g SKU to gift; reward form + capture tooling are open, decide before enabling any referral
  discount. **(4) Sorpresa 250g / O250g matrix cells retired** (§2.2) — Sorpresa ships only as Tours
  priced off the 100g factor; nothing sells a standalone Sorpresa 250g, so those cells are now blank
  with a footnote. Standard bumped **v1.1 → v1.2** (header changelog + footer stamp + §12.6). **KNOWN
  DRIFT (tracked, not yet fixed):** the POC discount code (`assets/ci-storefront.js` cart math) still
  *stacks* founder 12% + first-time 5% = 17% and is now knowingly behind v1.2 — Steve acknowledged
  "the POC will be wrong"; a POC/production discount-logic fix is deferred. **NEXT (Track B of the
  cold-read plan):** sweep the stale `v1.0` pointers to the Store Operating Standard (CLAUDE.md top
  pointer block, `docs/standards/README.md` table + `render.py` filename, `collaboration-standard.md`
  companion header) up to **v1.2**; append a correction to the earlier 2026-07-13 §9 note that wrongly
  says the POC "still implements the retired Active/Forfeited model" (commit `284c43b` already fixed
  that); re-render the Standard PDF. Cross-surface: the `Coordination/DECISIONS_LOG.md` should carry
  the `MAX` discount rule too (Cowork lane — flag to Steve/Cowork, not edited from Code).

- 2026-07-13 — **POC8: POC discount code made honest to Store Operating Standards v1.2 (no-stacking
  MAX) — built, verified, committed, pushed, deployed.** Closes the POC drift the v1.2 entry above had
  knowingly deferred (D1/D2/D3 + the `:436` watch item in `docs/POC_drift_from_standards.md`); detailed
  ledger in `docs/POC8_change_list.md`. **The fix (`assets/ci-storefront.js` `renderCart()`):** replaced
  the "subscriber/founder rate THEN add first-time 5%" **summing** block (up to 17%) with a **per-line
  `MAX`** — each line takes the single highest rate it qualifies for: founder/subscriber **12/10%** on
  Roccia · Sorpresa · Selezione (signed in + active subscription), **first-time 5%** on every shelf
  except Bottega (signed in + first-time buyer); `discount = Σ(line_total × line_rate)`. Also fixed a
  **latent miss** — the old branch only ran for subscribers, so a signed-in first-time **non-subscriber**
  got nothing; now they correctly get 5%. Summary line is honest (single label — "Founding Member 12%"
  / "Subscriber 10%" / "First-order 5%", or "Your discount (best applicable per item)" when shelves take
  different best rates — never "12% + 5%"). **Copy (D2/D3/watch):** guest cart banner reworded so 5% and
  10/12% read as **alternatives** ("you receive the higher of the two, never both" — no "plus"); FAQ
  "How do subscriber discounts work?" rewritten (removed "stacks"/"15%", states the single highest
  applicable discount, a first-time founder still gets 12% not 17%); the Roccia-toggle blurb (`:436`)
  reworded off "plus subscriber benefits across the site." All new copy honors the no-em-dash rule (§6),
  no exclamation marks, editorial voice. Removed the two resolved `// DRIFT` markers; moved D1/D2/D3 +
  watch to **Resolved** in the drift ledger (struck, not deleted, noting commit `6b0a8ed`). **Verified**
  end-to-end in `shopify theme dev` (drove the real cart via the app globals): founding subscriber +
  first-time → **12%** on eligible lines and **5%** on an Offerta line (a $38 Roccia + $21 Offerta + $34
  Bottega bag → −$5.61, i.e. 38×.12 + 21×.05, not 17%); non-subscriber first-timer → **5%** on non-Bottega
  (−$2.95); guest → 0%. `shopify theme check` = the same 2 pre-existing `ImgWidthAndHeight` errors as the
  baseline (hero-logo + founder-signature `img` tags, untouched by this batch), **0 new offenses**.
  Committed (`6b0a8ed`) + pushed to GitHub. **Deployed** to a NEW unpublished theme **"Crema Italia POC8
  Preview" (id `151454122153`)** via `shopify theme push --unpublished --theme "Crema Italia POC8
  Preview" --json`. POC7 Preview (`151449862313`) and the live coming-soon theme (`150557294761`) were
  untouched (confirmed via `shopify theme list`). Storefront password still OFF (friend-testing), so the
  link works cross-device with no gate. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151454122153` · Editor:
  `.../admin/themes/151454122153/editor`. To refresh: `shopify theme push --theme 151454122153`. Added a
  one-line cross-surface note to `Coordination/DECISIONS_LOG.md` (Steve asked for it directly this batch).
  **Coordination note:** a `docs/POC8_change_list.md` companion spec (acceptance-check table) was authored
  by a separate Code session mid-batch; git evidence (no `index.lock`, no rival commits, my edits intact)
  confirmed it was not concurrently writing code, so this session proceeded and committed it with the
  batch. **Open (production, not POC):** the real store still needs the entitlement/discount `MAX` in
  Shopify Functions (Standard §11) — the POC math now mirrors it.

- 2026-07-14 — **Brand Standards v2.0 → v2.1: no-em-dash voice rule propagated into the canonical
  repo source (Cowork-flagged; repo is Code's lane).** The no-em-dash-in-customer-facing-copy rule was
  added to `CLAUDE.md` §6 on 2026-07-13, but never landed in the actual **Brand Standards source** — so
  the Standard (what's true now) didn't carry a rule the change list said was in force. Cowork spotted
  the gap and, since it can't write the repo, routed it to Code. Fix: added the rule as a bullet in the
  Brand Standards **Voice & tone** section (§9 of the HTML source) — storefront/marketing copy never
  uses the em-dash; semicolon → spaced hyphen (` - `), trailing thought → ellipsis (`...`), ambiguous →
  ask; customer-facing only, internal docs exempt. Since color/type/logo/layout are unchanged, this is a
  **copy-only minor bump** per the Standard's own §10 (2.0 → 2.1). Actions: edited + renamed the source
  `Crema_Italia_Brand_Standards_v2.0.html` → `_v2.1.html` (git mv, history preserved), bumped every
  in-doc version stamp (title/cover/sub/footer) and added a "What changed in v2.1" changelog callout;
  **re-rendered the PDF** to `Crema_Italia_Brand_Standards_v2.1.pdf` via headless Edge (same mechanism as
  `render.py`; the cover logo was staged from OneDrive `Logo Assets/` for the render, then removed so the
  repo still doesn't carry logo binaries) — verified 12 pages, "Version 2.1" + the em-dash rule present,
  no leftover "Version 2.0"; **archived** the old render to `docs/standards/_archive/
  Crema_Italia_Brand_Standards_v2.0_ARCHIVED.pdf` per the archive convention. Swept the version pointers
  so nothing drifts: both standards READMEs, the two companion-standard header lines
  (collaboration/store-operating), this file's top pointer block + §6.1 "today:" + §10 brand note + §11
  reference index (also re-pointed §11 at the repo as canonical per Option A, noting the OneDrive copy is
  a now-stale render), and the `crema-italia-pdf-builder` skill's stamp (`template.html`, `brand.md`,
  `SKILL.md`) so future built docs stamp v2.1. **Cross-surface follow-ups (Cowork/OneDrive lane — flagged
  to Steve, not editable from Code):** (1) regenerate the OneDrive Brand Standards render to v2.1; (2) add
  the no-em-dash rule + this bump to `Coordination/DECISIONS_LOG.md` and the OneDrive Brand Standards
  render's own Voice section so the source-of-truth doesn't drift.

- 2026-07-14 — **Render-trust protocol established: Collaboration Standard v1.1 (§9) + the
  `crema-std-publish` skill + a single OneDrive `Standards\` render folder.** Closes the recurring
  friction where Cowork couldn't verify brief/Playbook section anchors against the repo Standards (it
  reads OneDrive, can't open the repo) and had to route "please confirm" through Steve/Code. New model,
  three parts: **(a) one certifiable render home** — all three Standards' read-only PDF renders now live
  in `CremaItalia LLC\Standards\` (Brand v2.1, Store-Ops v1.2, Collab v1.1) + a `README.txt` explaining
  they're renders; the stray old `Brand and Marketing\Crema_Italia_Brand_Standards_v2.0.pdf` was retired
  to `Brand and Marketing\_Archive\` (this also resolves the prior entry's Cowork follow-up #1 to
  regenerate the OneDrive Brand render to v2.1). **(b) Code owns producing + delivering renders** on
  every source change — the human decides truth, Code is its custodian — encoded as the new
  `.claude/skills/crema-std-publish` skill (edit source → bump version → re-render → deliver to
  `Standards\` → update cross-refs → commit → remind to log + re-certify; plus an `all`/`repair` resync
  path that regenerates every render, the fix if trust ever goes red). **(c) the daily coordinator
  certifies** each OneDrive render against its repo source and writes a standing
  `Coordination\RENDER_TRUST.md` badge (per-Standard MATCH/STALE/MISSING); Cowork trusts a green copy
  without involving Code and escalates on red. The rule itself is now Collaboration Standard §9 (bumped
  v1.0 → v1.1; companion headers, standards README, and the CLAUDE.md pointer block bumped to match;
  the v1.0 render archived). The badge is point-in-time, so a mid-cycle Standard change needs an
  out-of-cycle coordinator run before Cowork relies on it. Committed (`63bf09c`). **Steve's remaining
  steps (not Code's lane):** paste the coordinator `OUTPUT 3 — RENDER TRUST CERTIFICATE` block + two
  render-reference line-edits into `Coordination\coordinator_routine_prompt.md`; have Cowork add one
  dated line to `Coordination\DECISIONS_LOG.md` recording this protocol (Cowork's lane, direct write).

- 2026-07-14 — **Brand Standards render path made canonical + self-contained: WeasyPrint now works on
  this Windows box, and the cover logo is carried in-repo.** Two commits, done across two coordinated
  Code sessions. **(1) Logo carried (`982a749`):** the Brand HTML's one cover `<img>` used to load from
  OneDrive `Logo Assets/` and be staged beside the HTML per render — a non-self-contained render and a
  silent trap in `crema-std-publish`. Fixed by carrying the cover PNG in-repo at
  `docs/standards/brand-standards/assets/ci-cover-logo.png` (a copy of `CI Main Logo - Transparent.png`),
  exactly as the brand fonts are already carried, and repointing the `<img>` at it. A deliberate, narrow
  exception to "repo carries no logo binaries" — justified like the fonts (an offline render asset), and
  it removes the OneDrive dependency. **(2) WeasyPrint adopted as the canonical Brand renderer
  (`619dfae`):** WeasyPrint had never worked on this machine (missing native GTK/Pango libs), so Brand had
  been rendered via **headless Edge**, which silently drops the HTML's `@page` running headers/footers +
  page numbers. A parallel Code session installed the libs (**MSYS2**: `winget install MSYS2.MSYS2` →
  `pacman -S mingw-w64-x86_64-pango`, DLLs in `C:\msys64\mingw64\bin`) and wrote a `render_pdf.py` fix
  (`_ensure_native_libs()` auto-adds that DLL dir on Windows, `WEASYPRINT_DLL_DIRECTORIES` override, and
  a broadened `(ImportError, OSError)` guard — missing DLLs raise `OSError`, not `ImportError`). This
  session **adopted** that fix, re-rendered v2.1 via WeasyPrint (**448 KB, 12 pp, running footers + page
  numbers + cover logo intact**, vs the ~690 KB header-less Edge render), refreshed the committed PDF +
  the OneDrive `Standards\` copy, and flipped `brand-standards/README.md` + the `crema-std-publish` Brand
  row to **WeasyPrint = canonical (renders as authored), Edge = fallback (drops running headers).** Net:
  Brand renders fully offline end-to-end (HTML → WeasyPrint → committed PDF → OneDrive), no staging. The
  two Markdown Standards continue to render via `docs/standards/render.py` (headless Edge is fine for
  them — no running-header CSS). Coordination note: this was two concurrent Code sessions on one checkout;
  the install/`render_pdf.py` work was handed off cleanly (its edit adopted + committed here, not left
  uncommitted). **Open (Cowork lane, flagged):** nothing blocking — the OneDrive `Standards\` Brand copy
  is current (v2.1 WeasyPrint); the old `Brand and Marketing\` v2.0 was already retired to `_Archive\`.

- 2026-07-17 — **POC9 batch built + verified end-to-end (9 items); committed, NOT yet deployed
  or pushed.** Interactive plan-then-build session; Steve reviewed each ask, made the calls, then
  authorized the build ("go with these"). Detailed ledger + locked decisions in
  `docs/POC9_change_list.md`; durable summary here. **(1) Regions map synced to OneDrive
  `Region_Map_v2.svg`** (nine Italian titles, re-anchored leaders, centred legend, **Sardinia
  removed** → 2 country paths) and made **responsive**: on phones (≤640px) the side-labels/leaders/
  SVG-legend hide, the viewBox JS-crops to Italy (`setRegionMapViewBox`, `176 16 288 322`), and an
  HTML `.region-legend` carries the colour key; desktop keeps the full labelled 640×460 canvas. Map
  labels stay **Italian by design**; the sub-label **em-dashes are a deliberate exception to the §6
  no-em-dash rule** (Steve's call — documented in an in-file comment so no sweep "fixes" them). **(2)
  Regions list → English-first**: `Tuscany (Toscana)` etc. for the four with distinct English names
  (Lombardy/Piedmont/Tuscany/Sicily), single name for the identical ones (Trieste/Lazio/Campania/
  Puglia/Calabria — Puglia+Lazio kept, not Apulia/Latium). **(3) Home "Our roasters" grid removed**
  (it grew 1:1 with the roster → runaway scroll + off-brand "aggregation"); replaced by a "Roasters
  page" link in Our Model; the orphaned "Roasters" home-jump chip + `sec-roasters` anchor + dead
  `roasterHomeCard` removed. **(4) Header search icon removed** (it promised a search field but only
  routed to Shop); native Shopify predictive search noted for production. **(5) Promise page eyebrow**
  "What we mean" → **"Our commitment to you"**. **(6) ONE shared region filter object**
  (`snippets/ci-region-filter.liquid`) now rendered on both the Shop hero (always open) and the new
  Roasters hero **"Filter By Region"** toggle (opens the panel / label swaps to "All Regions" which
  clears + closes); `filterRegion` applies to the on-screen surface (products vs `#roaster-list`, via
  `navCurrent` + new `applyRoasterFilter`); **selection is per-surface** — `resetRegionFilterState`
  clears region on entering Shop or Roasters so a pick on one never filters the other (decision D,
  verified). Roaster rows gained `data-region`. **(7) About "Our company"**: the "Three P's" block is
  JS-aligned to the top of the second (caffè-door) image at the 2-col width (measured, self-correcting
  for margin-collapse — lands at delta ≈0; cleared on the mobile stack). **(8) Shipping** reworded so
  free shipping is a **Roccia _subscription_** benefit (one-time Roccia is not auto-free); the home
  Roccia shelf card tightened to match. **(9) Contact**: new footer **Contact** link → `#page-contact`
  with a **mocked** form (Name/Email/Phone/Message + radio reason routing **More info→info@ / I need
  help→support@ / Other→contact@**, default Other; Name/Email/Message required, phone optional); PROD
  seam documented (real send via a routing form-app or native `form 'contact'` to contact@ with the
  reason in subject/body; mailboxes info@/support@ still to be created). **Verification:** `node
  --check` + `JSON.parse` clean; `shopify theme check` = same 2 pre-existing `ImgWidthAndHeight`
  baseline errors, **0 new offenses**; then driven live in `shopify theme dev` (DOM/geometry — the
  screenshot tool was wedged again, as in prior sessions) confirming every item, including the region
  filter counts (1 Emilia / 4 Toscana), no cross-contamination, contact validation + routing console
  line, and the mobile/desktop map + alignment states. **Two real bugs caught by driving it** (not by
  theme-check): a literal `{% form 'contact' %}` inside an HTML comment parsed as an unclosed Liquid
  tag (neutralised), and the mobile HTML legend hidden by a later equal-specificity rule (fixed with
  `.ci-main .region-legend`); also fixed the alignment margin-collapse + a resize-handler viewBox
  refresh. **NEXT:** push to GitHub + deploy to a new **"Crema Italia POC9 Preview"** theme (needs
  Steve's go-ahead), per the draft-theme naming rule. Storefront password still OFF (friend-testing).

- 2026-07-24 — **POC9 readiness review (skeptic pass) + live-theme copy fix deployed + two platform
  corrections.** Steve asked for a hard-nosed "are we ready to build the real store?" review before
  committing to the production build. **Verdict: the decision layer is genuinely closed — no
  substantive business decision is open — but four *platform-reality* assumptions were never verified
  against Shopify, and those are the ones that would force revisions mid-build.** Recommended a
  one-session platform-validation spike before writing production code.
  **Two of the four were resolved on the spot this session:**
  (a) **Shopify Functions are available on ALL plans** (Basic included) — they replaced the old
  Plus-only Scripts. The entitlement/`MAX`-discount engine (Standard §11) is therefore **not**
  plan-gated. This corrects an earlier concern raised in the same review; no license wall exists.
  (b) **Store Operating Standards §10's "No visible promo-code field at checkout" is NOT achievable
  below Shopify Plus.** Hiding that field requires Checkout UI extensions, which are Plus-only. Plan
  costs verified from shopify.com/pricing: Basic $29/39, Grow $79/105, Advanced $299/399, **Plus from
  $2,300/mo** — roughly **$24k/yr over Advanced** purely to hide one field. **Recommendation (NOT yet
  decided by Steve): amend §10** rather than buy Plus — the rule's intent (never train customers to
  hunt for codes) survives because standing subscriber/founder benefits already auto-apply server-side;
  residual risk is campaign codes leaking, mitigated by unique single-use codes. **This is an open
  Standard amendment awaiting Steve's call — see §10 TODO.** Also noted: Basic allows **0** extra staff
  accounts, so **Grow** is the practical floor given the Lucia/Asia/Lauren team; Advanced only pays for
  itself on card-rate savings around $70–80k/yr revenue.
  **The remaining two unverified risks** (carried to §10 TODO): the **Loop × Shopify Functions discount
  interplay** is untested — Loop's selling-plan subscription discount and our Function-applied benefit
  could collide or double-apply, the highest-risk integration in the design; and **new vs legacy Shopify
  customer accounts** has never been chosen — the POC's rich account page (Membership tile, founder
  number, Loop portal slot) is buildable in Liquid on *legacy* accounts but only via UI extensions on
  *new* hosted accounts, and Loop's portal integration differs between them. Also flagged: no bundle app
  has been evaluated against Standard §7's BOM requirements.
  **Live-theme copy fix DEPLOYED (the one code change this session).** A full 13-file diff of the live
  theme (`150557294761`) against the repo found it **stale in exactly 4 files** — `templates/index.liquid`,
  `layout/theme.liquid`, `templates/password.liquid`, `layout/password.liquid` — all containing
  **em-dashes predating the 2026-07-13 §6 sweep**, including the page `<title>` and the Open Graph /
  Twitter share titles. Everything else (CSS, JS, footer snippet, 404, locales, config, both PNGs) was
  already byte-identical. Deployed via two scoped pushes (`--path live-theme --only …` for the homepage
  pair, plain `--only …` for the password pair, both `--allow-live`). **Verified:** all 4 files now
  byte-match the repo, the theme still holds all 13 files (nothing deleted), and a **cookie-less
  `curl` of cremaitalia.com returns HTTP 200 with ZERO customer-visible em-dashes**; `og:title` and
  `twitter:title` now read "Crema Italia - Italian coffee, brought over whole." The 8 em-dashes still on
  the theme are all inside **HTML comments** (§6-exempt, correctly untouched). Net: the live store is
  fully current with the repo, and **the password toggle is now purely a friend-testing decision** — copy
  quality is correct in both states.
  **Permissions note (new failure mode, worth remembering).** The live push was **denied by Claude Code's
  auto-mode classifier**, despite the user-level allowlist carrying a blanket `Bash(shopify theme *)` rule
  that had silently permitted every prior live push (2026-07-05, 2026-07-07). The classifier is a *second*
  layer that judges a command's semantics rather than matching a glob, and it stops `--allow-live` writes
  to the published storefront. Code did **not** reroute around it; Steve ran both commands himself in
  PowerShell. **Expect this again on every future live push** (POC9 deploy, launch). Also observed: that
  allowlist has grown to ~150 entries, mostly dead one-off scratchpad paths with stale session UUIDs, and
  carries unqualified `Bash(git push *)` / `Bash(git add *)` / `Bash(shopify theme *)` — worth a deliberate
  prune; the recommendation is to **narrow, not widen**, and keep live-store writes human-initiated.
  **Note:** the Shopify CLI warns "doesn't seem like you're running in a theme directory" on the
  `--path live-theme` push — that is **expected and safe** (`live-theme/` deliberately holds only 2 files);
  answer yes. Confirmed non-destructive both by the 2026-07-07 precedent and by this session's post-push
  13-file count.

- 2026-07-25 — **Duplicate POC9 theme created by trusting a stale doc over live state; root-caused and
  the process hardened.** Steve asked Code to "deploy POC9 to a new preview theme." Code ran the usual
  pre-deploy validation (JS syntax, catalog JSON, `theme check` — clean, baseline 2 errors only) and
  pushed to a new unpublished theme, then ran `shopify theme list` **afterwards** and found a
  **"Crema Italia POC9 Preview" already existed** (`151523131561`). POC9 had already been deployed and
  pushed to GitHub — by Steve or another Code session, **unlogged**. Result: two identically-named
  themes, byte-identical to each other and to the repo (`151615373481` is the redundant one).
  **Root cause — not a knowledge gap.** `docs/POC9_change_list.md` states "NOT yet deployed... and not
  yet pushed to GitHub" (written 2026-07-17). In its FIRST tool call of the 2026-07-24 session Code ran
  `git log origin/main..HEAD` and got **empty output** — proving the "not yet pushed" half false. Code
  then **repeated the doc's claim as fact** in the readiness review ("committed but not pushed... not
  deployed"), which is partly why Steve ordered the deploy. The contradiction was on screen and unread;
  `shopify theme list` was run at the wrong end of the operation. **A live command had already
  disproven the document and the document was believed anyway.**
  **Structural cause:** deployment state was claimed in three places (§10 CURRENT STATE, §9 entries,
  each change list), all present-tense, none owned, none expiring. Nobody logged the earlier deploy, so
  all three lied confidently. The 2026-07-04 two-sessions rule anticipated concurrent *file edits*, not
  drifting *deployment state*.
  **Fixes applied this session:** (1) §10 CURRENT STATE rewritten as the **single authoritative
  deployment-state block**, refreshed to POC9, carrying a mandatory verify-before-acting rule
  (`shopify theme list` + `git log origin/main..HEAD` at session start, live output beats every
  document *including that block*) and demoting §9/change-list state claims to historical narrative.
  (2) The scheduled **coordinator prompt** gained a fifth drift check (contradicted state claims), a
  factual deployment block, and a capture-never-diagnose guardrail.
  **Coordinator finding (2026-07-25) — it cannot close this gap.** The revised prompt was run and
  **reproduced the same failure**: with the Shopify CLI unavailable in its sandbox it **backfilled the
  deployment block from `CLAUDE.md`** and reported "newest preview = POC8; POC9 not yet deployed" as
  fact, disclosing the sourcing only in a separate "Could not verify" line below. So: **Cowork/the
  coordinator structurally cannot verify Shopify deployment state** (CLI absent in scheduled runs) —
  its deployment reporting is permanently UNVERIFIED and the prompt now says so and forbids
  substituting a document for a failed live query. **Verifying deployment state is Code's job at
  session start; the coordinator is a briefing, never a verification.** Its rules-drift half works
  well (it correctly flagged the §10 promo-code contradiction, the missing DECISIONS_LOG entry, and a
  stale `00_PROJECT_BRIEF.md` header).
  **RESOLVED same day:** the duplicate theme `151615373481` was deleted
  (`shopify theme delete --theme 151615373481 --force`) after re-verifying the target against a live
  `shopify theme list`; the surviving `151523131561` was then pulled and confirmed byte-identical to
  the repo across all 37 files, with the live theme and POC4–POC8 previews untouched. §10 CURRENT
  STATE updated to match. **Permissions note:** unlike the 2026-07-24 live push, this destructive
  delete was **NOT** blocked by the auto-mode classifier — so the classifier's line is evidently
  drawn at writes to the **published** storefront, not at destructive store actions generally. Do
  not assume a delete will be gated.

- 2026-07-25 — **POC10 built + deployed: mobile-review fixes, and the POC-scope rule LOCKED.**
  Steve ran the long-queued full-site mobile pass on POC9 on a real device and raised five findings.
  **The durable outcome is a scoping decision, not the fixes:** **the POC models only the surfaces we
  will write production code for; anything Shopify supplies and we have no code control over is not
  modelled — the sole exception being when its absence blocks testing the POC itself, and then only
  as a labelled testing aid** (Steve, "not to model portions that we're absolutely sure we have no
  code-control of, unless it blocks testing the POC"). Recorded as `docs/production_build_spec.md`
  **§0**, which also fixes the boundary that caused the confusion: **the cart is OURS**
  (`templates/cart.liquid` / a cart section we write — Shopify supplies only the Cart AJAX data,
  zero presentation), **checkout is SHOPIFY'S** (not themeable below Plus, never modelled), and the
  **sign-in/account surface is UNDECIDED** pending the open new-vs-legacy customer-accounts spike —
  which this rule promotes in priority, since on *new* hosted accounts much of the POC's account page
  is modelling someone else's control.
  **Built (3 of 5, all code we own):** (1) the real bug — `chooseQuizMatches()`/`chooseQuizEverything()`
  called `openSignin()` **unconditionally**, so an already-signed-in customer finishing the quiz hit a
  sign-in wall instead of saving to their account; the `session.signedIn` guard that
  `saveProfileChanges()` already had had never been propagated to the quiz path. Both now act directly
  when signed in and leave the signed-out `pendingQuizAction` flow untouched. (2) the clipped
  "Tasting Quiz" home chip (four chips ≈400px against a 375px viewport) now renders **"Quiz"** on
  phones via a `.hj-word` span hidden under the existing 640px query; desktop unchanged. (3) the cart
  line on phones — **three separate causes**: `.cart-line-img` kept its desktop `64px` inside a `48px`
  grid column and overlapped the title by 2px (the "smashed", pre-existing); the third child
  (price + Remove) wrapped **into that 48px column** because the mobile rule declared only two columns,
  so it now spans its own full-width row; and inherited `align-items:center` floated the thumbnail
  below the title, now `align-items:start`. Plus a one-line `overscroll-behavior-y:contain` testing
  aid (commented as such) so an accidental pull-to-refresh stops wiping the in-memory session.
  **Declined under the new rule:** persisting the mocked session to `localStorage` (emulates a Shopify
  session cookie we get free) and any mock of the checkout promo-code field (pure checkout).
  **Also advised (Steve's question):** hiding the promo field by colour-matching + read-only is not
  buildable below Plus (no checkout CSS injection, no readonly hook), is a dark pattern inconsistent
  with the posture that already rejected the quiz auto-launch, and fails accessibility — recommended
  amending Standard §10 instead, **still an open decision**, ideally after Steve looks at his own
  real checkout and the Checkout Editor.
  **Verified** end-to-end in `shopify theme dev` via DOM geometry at 375×812 and 1280×900 (screenshot
  tool still unreliable): both quiz buttons signed-in and signed-out; a worst-case cart line (qty 2,
  three children in the meta row) measuring `thumbTop − titleTop = 0`, 13px gap, no overlap, meta row
  full-width and not overflowing; desktop confirmed unchanged. `node --check` + `JSON.parse` clean;
  `shopify theme check` = the same 2 baseline `ImgWidthAndHeight` errors, **0 new offenses**.
  Committed (`dd0cbf1`) + pushed. **Deployed** to a NEW unpublished theme **"Crema Italia POC10
  Preview" (id `151624024233`)** — and this time `shopify theme list` was run **before** the push,
  confirming no name collision, per the rule added after the 2026-07-24 duplicate. Verified by
  pull-and-diff (all 37 files match) and by re-listing (exactly one POC10 theme). POC4–POC9 previews
  and the live theme untouched. Detail: `docs/POC10_change_list.md`.

- 2026-07-25 — **Platform-validation dev store created; first three findings, one of which reverses a
  design assumption.** Steve created a free Partners development store,
  **`crema-italia-development.myshopify.com`** (simulating **Basic** deliberately — validate against the
  lowest plan we would launch on, so nothing passes on a feature Basic lacks; **Plus was explicitly not
  chosen**, since on Plus the checkout is customizable and the promo-field test would have returned a
  false pass). Test data enabled — it seeds customers **with order history**, which the first-time-buyer
  5% test needs. Existing Shopify CLI auth already covers the store (`shopify theme list` works).
  **Finding 1 — customer accounts are no longer a choice.** §10's "CHOOSE new vs legacy" was the wrong
  question: a store created today runs **new customer accounts only.** Settings → Customer accounts
  offers Configurations / Authentication / self-serve returns / store credit / URL and **no classic
  option anywhere** (Authentication is only Shop / Google / Facebook sign-in). `/account` and
  `/account/login` **302 off-domain** to `shopify.com/82039013600/account`. **Consequence:** the POC's
  account page — Membership tile, founder number, taste-profile card, Loop portal slot, Recent Orders —
  **is not buildable in Liquid**; that surface is Shopify-hosted and extensible only via customer-account
  UI extensions. Under the POC-scope rule locked earlier the same day
  (`production_build_spec.md` §0), the POC has therefore been **modelling a surface we do not own** —
  §0's table updated from CONDITIONAL to SHOPIFY'S. **The business rules are untouched** (durable founder
  status, the honorific, the 60-day grace — Standard §3.1/§4); only the rendering surface changes. The
  replacement open item is **scoping what UI extensions can actually render**, now the largest open
  consequence for the production build.
  **Finding 2 — v1.3's promo-code amendment is CONFIRMED, not merely assumed.** Published hours earlier
  on "fairly confident," now empirical: on Basic, Checkout settings exposes field-level control for
  **only** full name / company / address line 2 / shipping phone; there is no discount-field control on
  that page or under Advanced preferences. The **Checkout Editor** does list
  `Order summary → Discounts → Discount or gift card` in its structure tree — which briefly looked like
  a contradiction and was flagged as one before being checked — but the tree is **advisory and
  non-interactive** for native elements: no visibility toggle, no removal. The field cannot be hidden
  below Plus. Steve's call to proceed on reasonable confidence rather than block was right, and the
  confirmation cost one click.
  **Finding 3 — checkout/cart rules come from apps.** "Checkout rules: there are no apps installed with
  rules for checkout or cart." Same extension surface a bundle app would use — relevant to the §7 BOM
  evaluation (spike item 4).
  **Still unverified:** Standard §12.7 (can a discount Function read customer tags/metafields) and
  §12.8 (Loop × our Function) — neither is touched by today's findings. **Next:** scaffold a minimal
  discount-function app for §12.7, then Loop for §12.8. Per the spike principle the app is throwaway and
  belongs **outside this repo** (`~/code/crema-validation`, its own git repo, deleted after); what
  survives is the written findings. **Caveat carried forward:** a dev store is not a perfect mirror of
  production — anything surprising in the Loop test should be confirmed with Loop support before being
  treated as fact.

- 2026-08-03 — **Both PDF renderers now gate their own output; a latent async-write bug in the
  Standards renderer found and fixed; and a rule locked for taking Cowork's code (commit
  `6aa894f`).** Cowork proposed a hardened `render_pdf.py` after finding that the render path had
  no font gate: a missing `@font-face` file does not error, the renderer falls back to a generic
  serif, and you get a clean-looking, off-brand PDF at exit 0. Its diagnosis was correct and is
  now closed — but **the file it offered was not installed**, for a reason that matters more than
  the fix. **(1) Port, never copy — the rule.** Cowork keeps its own fork of this repo's skills at
  OneDrive `CremaItalia LLC\.claude\skills\`; its `crema-italia-pdf-builder` copy was built on a
  **pre-2026-07-14 baseline** (its `render_pdf_v1_ORIGINAL.py.bak` is 2,007 bytes with zero
  `_ensure_native_libs` / `OSError` occurrences), so it had already lost the MSYS2 Windows DLL fix
  from commit `619dfae` and would have broken WeasyPrint on this machine; its `SKILL.md` also still
  stamped Brand Standards v2.0 against the repo's v2.1. Cowork cannot read the repo, so it has no
  way to notice it is working from a stale base. **Steve's call: repo is canonical, Cowork's copy
  is a render** — and any code Cowork proposes is taken as a **specification, ported onto the repo's
  current file and diffed first**, never copied in. **(2) The gates.** New
  `.claude/skills/crema-italia-pdf-builder/scripts/pdf_gates.py` is the single home for the gate
  logic, imported by **both** renderers so the two cannot drift: `render_pdf.py` (Brand Standards,
  WeasyPrint) and `docs/standards/render.py` (Store Operating + Collaboration, headless Edge) —
  Cowork's module covered only the first, which is one of three Standards. Gates: **0** output is a
  complete PDF (`%%EOF`), not caught mid-write (exit 6); **1a** source ends `</html>` with tags
  closed, blocking a truncated write (3); **1b** every linked CSS/`.ttf`/image resolves, *including
  assets referenced from inside a stylesheet* (3); **2** Marcellus + Inter actually embedded, no
  fallback face (4); **3** the PDF contains the end of the source (5). Consolas is exempt from
  fallback detection (code spans are monospace on purpose). Gate 1a must run on the **source** —
  a truncated source renders faithfully, so no comparison of the finished PDF against that same
  source can ever see the loss (Cowork's insight, and its own first draft got this wrong). Gate 4,
  looking at every page, is not automatable; `--preview` emits page images but needs `pdftoppm`,
  which is not installed. **(3) The bug nobody was looking for.** Porting surfaced a real
  pre-existing defect in `render.py`: **headless Edge writes the PDF *after* `subprocess.run`
  returns, and exits 0 either way.** The script trusted that exit code, so it stat'd a file that was
  absent or half-flushed — mid-session it produced two *different* Standards at an identical
  **59,677 bytes with only `SegoeUI` embedded**. Confirmed pre-existing by running the original
  script from git (fails the same way) and by watching the ordering directly: our check reports
  "NO FILE", then Edge writes. `render.py` now deletes the stale output first and waits for a
  complete, size-stable file; renders are deterministic again (209,025 bytes every run). This is the
  same silent-artifact class Cowork was hardening against, sitting in Code's lane the whole time,
  and it would have read as "the fonts are broken" and sent someone hunting the wrong bug.
  **(4) Trust closed at the right layer.** `crema-std-publish` step 4 now treats a non-zero exit as
  a **stop**, before delivery to OneDrive. This closes a hole `RENDER_TRUST.md` structurally cannot
  see: md5-comparing the repo render against the OneDrive copy reads **MATCH** when both are copies
  of the same bad render — the badge proves the two copies are *identical*, never that either is
  *correct*. **Verified:** 3 positive controls; 7 negative controls (missing stylesheet, `.ttf`
  missing inside the CSS, source truncated to 60%, required family absent, a genuine silent
  Marcellus→Times fallback, the same on the Markdown path, and `--allow-fallback` downgrading
  correctly) — all returning the intended exit codes. **Audited clean:** all three OneDrive
  delivered renders and the committed Brand PDF are complete with correct fonts, so the bug was
  **latent, not realised**; re-rendering Brand produced a byte-identical PDF (WeasyPrint is
  deterministic). **Open (Cowork/Steve lane, flagged not done):** retire or repoint Cowork's forked
  skill; remove OneDrive `_to_delete\`; add a `DECISIONS_LOG.md` line for this protocol and a line
  in the coordinator prompt recording that the trust badge proves identity, not correctness.

- 2026-08-04 — **A companion Standard's render can go stale without its version number moving,
  and the version-stamp check can never see it — found, fixed, and closed in `crema-std-publish`.**
  The coordinator's 2026-08-04 run started diffing **extracted PDF text** instead of version
  headers and caught a real 10-day staleness: OneDrive's `Collaboration_Standard_v1.1.pdf` read
  "Store Operating Standards **v1.2**" while its repo source read v1.3. Cause: commit `f9ffcb1`
  (2026-07-25) published Store Operating v1.3 and correctly updated the Collaboration Standard's
  companion-pointer line — but only the Standard *being published* was re-rendered and delivered.
  Collaboration's own version stayed 1.1, correctly (§1–§8 unchanged), so **every prior coordinator
  run certified it MATCH by comparing "Version 1.1" to "Version 1.1."** This is the same shape as
  the 2026-08-03 finding one level up: that entry established the badge proves two copies are
  *identical*, never *correct*; this one shows a version stamp proves two documents share a
  *number*, never the same *content*. **Fixed** (verified pass, exit 0 on both): re-rendered
  Collaboration and Store Operating via `render.py`, delivered both to OneDrive `Standards\`, and
  confirmed all three Standards now md5-match repo↔OneDrive with the delivered Collaboration copy
  reading v1.3. **Root cause closed in the skill** — `crema-std-publish` steps 3/4/6 now say every
  source touched in step 3 gets re-rendered *and* redelivered, "touched" being the trigger rather
  than "bumped," with the `f9ffcb1` incident recorded inline so the reasoning survives; the
  `all`/`repair` path's verification was upgraded from a version-stamp comparison to md5 plus a
  `pdftotext` diff (headless Edge stamps a `CreationDate`, so Edge renders are **not**
  byte-reproducible run to run — WeasyPrint's are, so a Brand render still round-trips identical).
  **Non-finding, checked:** the coordinator also flagged the two Markdown Standards' PDFs as
  regenerated with no matching commit — they are `.gitignore`d by design (`/docs/standards/*.pdf`,
  regenerable from source; only `_archive/` renders and Brand's are committed), and the working
  tree is clean. Also backfilled the `DECISIONS_LOG.md` entry the same run flagged as missing for
  commit `11a3946` (the §6 verify-before-deploy prohibition + `crema-poc-deploy` skill).

- 2026-08-06 — **POC11 in progress: a GTM/brand review of deployed POC10, then a copy-and-CTA
  batch off the back of it. Two locked decisions were AMENDED, deliberately.** Steve asked for a
  brutally honest go-to-market review of POC10 in a real browser. Working ledger:
  `docs/POC11_change_list.md`; durable summary here. **The most important thing the review
  produced was a scope rule, not a finding:** several of its conclusions turned out to be
  critiques of **Code-invented fixture data** (roaster names, prices, tasting notes, roast dates)
  rather than of the business — the roasters are still being wooed and no photography exists.
  `POC11_change_list.md` §0 now carries a real-vs-fixture table, and no review may draw
  conclusions about catalog credibility, price ladder, or roaster prominence until real roasters
  sign. One review finding was **void outright**: "the Journal teasers are dead ends" — Journal is
  native Shopify Blog + Articles per `production_build_spec.md` §3 and is deliberately not
  modelled. Do not wire them up.
  **Shipped (commits `2ea5427`, `4a840f4`, `6a606d1`, `f18aba8`, `b72a26e`, + this one):**
  (a) **Promo-code copy was factually wrong** and is fixed — the FAQ answered "Is there a promo
  code box at checkout?" with "No" and the cart promised "no promo code field ... or via a
  personal link", both contradicting Store Operating Standards **v1.3** and the 2026-07-25
  dev-store verification (the field cannot be hidden below Plus; personal links were retired as a
  code leak). Steve chose to **pre-empt** the field rather than stay silent. (b) **"Only 172 of
  222 founding slots remain" removed** — it asserted 50 subscribers existed pre-launch, which is
  untrue and is precisely the manufactured urgency the brand disavows. Now states the cap
  ("limited to 222 and does not reopen"), true on day one. The 172 was Code fixture data, not
  Steve's. (c) **Ops vocabulary stripped from customer copy** (pallet-bound, hard cap /
  overselling, markup tier, Offerta threshold, 3PL, freshness-gated, components, SKUs) on the
  rule *say the customer-visible consequence, not the mechanism*, keeping every passage's
  honesty. (d) **Discount rules de-duplicated** — the Roccia page stated 10% three times in three
  consecutive blocks. (e) **All four shelf headers standardised** on Roccia's shape — `The
  <English name> · <what is on the shelf>`: The Rock / The Surprise / The Selection / The Offer
  (Offerta's gloss moved off "The Opportunity"). This is Steve's answer to the review's "five
  Italian shelf names are a comprehension tax" finding and is better than what the review
  proposed, because it teaches the vocabulary in place instead of restructuring the IA. Applied
  to home cards + shelf-page eyebrows but **deliberately NOT to the product-card badges**, which
  identify a tile's shelf while scanning and must stay short. (f) **Shop hero** lost the static
  "Organized into four shelves" line in favour of a **gloss beside the shelf pills that changes
  with the selection**. (g) **Founder story turned outward** — the old closer gave "the US
  market" access; it now reads "...bring their coffee here, unchanged" followed by two "perhaps /
  maybe" sentences that welcome without characterising the reader. "A full confession." is kept
  as the heading; it sets the first-person register.
  **AMENDMENT 1 — the hero headline is an H1, not a Hero.** "Benvenuto - welcome in." rendered at
  **68.8px**, effectively the brand *Hero* size (72px), when §3.3 sets **H1 at 40px**. It had sat
  one full step up the scale since POC5. Now `clamp(1.625rem,4vw,2.5rem)` and **one line at every
  width** — it had been missing one line by only 11px at 1440, the worst kind of wrap. The string
  measures a constant **11.2x its font-size** in Marcellus; that arithmetic is in a CSS comment so
  a later size bump cannot silently reintroduce the wrap. Banner height fell 616 → 513px at 1440
  with no spacing work.
  **AMENDMENT 2 — the quiz is now the hero CTA, reversing the 2026-07-10 lock (Steve authorized
  explicitly).** 2026-07-10 locked "no hero button", "Sorpresa is the one primary button", and
  "quiz is a quiet inline link". All three are amended: the quiz gets a **primary gold button in
  the hero**, above the fold on both phone and desktop. **Why Steve authorized it: to increase
  first-time-visitor capture.** Supporting evidence: the quiz chip's gold fill was
  **byte-identical** to `.pill.active` (`background/color/border-color`, same tokens), so on a
  site whose Shop filters teach gold = *currently selected*, the home page used that exact signal
  to mean *special* — it read as selected rather than selectable; and it was the only chip in a
  row of scroll-links that opened a modal, making it the odd one out functionally as well as
  visually. Removing it leaves the jump nav internally consistent (three chips, all scroll).
  The mid-page link moved from **after** the Sorpresa CTA to **before** the shelves and was
  reworded "Still unsure?" → **"Find a roast to love."** — after the CTA it read as a fallback for
  people who had declined to buy; before the catalog it reads as help arriving as four shelves
  appear. Net funnel change: the first call to action moved from **3.9 screens down to 0.58**, and
  it is **free**. **The quiz stays invitation-only** — the first-visit auto-launch removed on
  2026-07-10 stays removed; Steve: "at least we don't PUSH the quiz as a start-up device, which
  can be irritating." Dead `.hj-quiz`/`.hj-word` CSS swept (this also retires POC10's mobile
  chip-truncation fix, now moot).
  **Also landed later the same day:** **B1** turned out to be three sentences, not a sweep —
  pronoun balance was measured per surface first, and **Roccia was already twice as much "you" as
  "we"** (0.50), so the review's premise was mostly wrong; the real gap was **Offerta**, which had
  **zero** second person in 187 words. Fixing it surfaced that the Offerta guarantee is written in
  **two** places (shelf page + Promise page), so policy copy here needs a grep for its twin.
  **E1** was solved structurally rather than by re-stamping: the catalog keeps **absolute** dates
  (production's shape) and a POC-only `rebaseCatalogDates()` shifts the set **on load** so the
  freshest coffee is always 10 days old, preserving each product's spacing — the flagship went
  from *46 days past roast with 14 left* to *11 days old with 49 left*, and the Offerta lot from
  expired to 27 days remaining. Marked `PROD:` for deletion. The **founder dog photo** was removed
  (and its asset deleted) so the founder tile carries one photo like each team card.
  **Deployed** to a NEW unpublished theme **"Crema Italia POC11 Preview" (id `151797727401`)** via
  `shopify theme push --unpublished --theme "Crema Italia POC11 Preview" --json`, following the
  `crema-poc-deploy` skill: `theme list` + `git log origin/main..HEAD` run **first** (no
  collision), validation at the documented baseline (17 offenses / 2 errors / 0 new), then
  **pull-and-diff proved** the push — both sides 36 files, zero content mismatches, nothing on
  only one side. File count moved 37 → 36 with the deleted photo; the skill's baseline was updated
  in the same pass. POC4–POC10 previews and the live theme untouched. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151797727401`
  **Three POC10-review findings proved inflated once measured** and the corrections are recorded:
  the "buried" 17g sentence (42 words in, ~0.8 screens — the reorder was drafted and **rejected**,
  since it is a punchline that depends on its setup), "the page buries the category" (it does not),
  and "the commercial surfaces are we-heavy" (Roccia was not). Direction useful, magnitude
  overstated — trust the measurements over the adjectives.
  **Still open after POC11:** **B3** team/partner bios — **re-filed** on Steve's correction as an
  *administrative* feature (sections + blocks, `production_build_spec.md` §2) so he can add people
  without republishing, waiting on a signed partner agreement and Lauren engaging; **C2** the entry
  price rung — **parked**, because the ~$117/lb-vs-$69/lb ratio that raised it comes from invented
  prices and is not evidence until real landed costs exist. **Decided, no change:** product-card
  shelf badges keep their own short vocabulary (`Offerta · Opportunity`) independent of the new
  shelf headers. **Deferred as unanswerable until photography exists:** whether a price or product
  should appear above the fold.

- 2026-08-06 — **POC12 built and deployed the same day as POC11, straight out of POC11's review.
  One locked decision AMENDED, with Steve's explicit authorization.** Ledger:
  `docs/POC12_change_list.md`. **The headline: the quiz now pays off before it asks.** POC11 made
  the quiz the hero CTA (first action 3.9 screens → 0.6, and free), but its result buttons still
  routed through sign-in — so a stranger's *first* action ended at a login form headed "Your
  Account", which never explained itself, offered **no visible guest option** (dismissal was the
  `×` only), and whose sole stated benefit was a **subscriber discount they cannot use yet**.
  Dismissible, so a speed bump rather than a wall, but sitting at the exact moment of reward for
  the exact audience the promotion was built to capture. **AMENDS the POC4 lock** ("both result
  buttons route through sign-in first to capture the taste profile"): that lock was right when the
  quiz was a quiet inline link taken by someone already deep in the page; promoting it to the hero
  changed *who arrives there*. Both buttons now act immediately; `pendingQuizAction` and its two
  dead branches retired. **The capture attempt is not abandoned, it moves** — a quiet gold "Save to
  my account" link in the ribbon, shown to signed-out visitors only, asked *after* the result has
  proven useful. Verified by driving all four paths (guest matches / guest save→sign-in→commit /
  signed-in / "show me everything").
  **Also landed:** the **Shop nav dropdown** got the glosses A4 missed — Selezione and Offerta had
  **no English gloss at all** and Sorpresa said "Surprises" against the headers' "The Surprise",
  which combined with A5's pill gloss had left **Sorpresa described five different ways**. Decision:
  the dropdown keeps **sentences** rather than adopting the eyebrow format, making it the place the
  vocabulary is *taught* while the headers are where it is *stated*. The **FAQ** stopped promising
  "volume discounts", which appeared exactly once site-wide and contradicted the answer directly
  above it. An ops leak the A3 sweep missed (**"swap roaster / SKU / bag-size"** on the account
  page) was fixed. The About people cards gained a visible **"Bio"** tell — a real `<button>`, not
  styled text, because the cards are `div`s with `onclick` and **could not be tabbed to at all**;
  sized 36×40px for touch (it was 20×16px as bare text); Lauren and Partner 1 got "Bio under
  construction." placeholders rather than special-case logic (Steve: no team member or partner
  ships without full data).
  **Ribbon layout, and a lesson in flexbox:** the third control pushed the ribbon 51 → 92px at
  1440. Steve chose to let `.tr-main` shrink. `min-width:0` alone **did nothing** — the fix that
  mattered was `flex-wrap:nowrap`, because **a wrapping flex container wraps before it shrinks**,
  so `.tr-main` was dropping to its own line and then *growing* to fill it. The 860px breakpoint is
  **measured at both settings** (1440 92/79, 900 135/119, 870 135/119, 830 135/150, 760 135/150);
  below the crossover, forcing the controls inline costs *more* than wrapping. An earlier attempt
  guessed 1100px and carried a CSS comment comparing two different viewports; both corrected, with
  the real table left in the CSS.
  **Housekeeping:** POC4–POC9 preview themes **deleted** on Steve's explicit go after verifying the
  six ids against a live `theme list --json` — the store went from 11 themes to 5.
  **Deployed** to **"Crema Italia POC12 Preview" (`151798841513`)** via the `crema-poc-deploy`
  ritual: `theme list` + `git log origin/main..HEAD` **first** (no collision), validation at the
  documented baseline (17 offenses / 2 errors / 0 new), then **pull-and-diff proved** the push —
  both sides 36 files, zero mismatches. POC10, POC11 and the live theme untouched.
  **Verification-method lessons worth keeping** (three checks reported wrong while the code was
  fine): hidden `.page` elements return empty `innerText`, so a sweep must keep pages active while
  reading; `text-transform:uppercase` defeats case-sensitive matching; and leaf-only scanning misses
  text nodes sitting beside child elements — use a `TreeWalker`. Also, a few px of difference
  between a bordered button and a plain link is **vertical centring, not a wrap**. On this codebase
  the method needs as much scrutiny as the finding.

- 2026-08-06 — **POC13 built and deployed the same day as POC11/POC12 — a mobile/interaction batch,
  the first photography on the landing page, and three process fixes born of a broken launcher.**
  Ledger: `docs/POC13_change_list.md`. **(1) The account dropdown was nearly unusable with a mouse,
  and worse on touch.** Steve: *"unless you hard click the signed in name again, it is hard to get
  into the dropdown menu. You have to move at a perfect speed otherwise it closes."* Cause:
  `.account-menu` carried `margin-top:.35rem`, and `:hover` covers an element plus its descendants
  but **not the margin between them** — probing `elementFromPoint` every 1px showed the element under
  the cursor in that 5.6px strip is `.header-inner`, outside `.account-wrap`, so any `mousemove`
  sampled there closed the menu. `.shop-menu` never had it (flush, no margin) — that asymmetry
  recurs below and is the tell that the account dropdown was added later and never got Shop's
  treatment. Fixed with a transparent `::before` bridging the gap: 0 breaks along three probe paths,
  was 30, visual gap unchanged. The POC6 force-close/re-arm logic was checked first and is **not**
  implicated. **On touch it was worse:** the mobile overrides for `.account-wrap`/`.account-menu`
  were being **discarded wholesale**, because the dropdown's base rules sit near the END of the
  stylesheet, AFTER the mobile header block, and **media queries add no specificity** — so at equal
  specificity the later desktop rules won. Measured at 375px: position `absolute` not `static`,
  `min-width` 170px not 0, desktop border/shadow/margin all intact, and the submenu rendering as a
  170px absolutely-positioned box **hanging ~155px below the open panel**. Fixed by scoping the two
  rules to `.ci-header`, with a comment not to "simplify" them back. **(2) Taste ribbon 262 → 139px**
  at 375 (signed-out worst case), across three steps: de-buttoned the filter tags (chips → plain
  text, scoped to `.tr-tags` so the account card keeps its filled chips); lifted the state dot out of
  its own row into a padding gutter (it was costing 18.6px because `.tr-status` is a full-width flex
  item and wrapped below it); and **Steve's structural fix — bury "Edit profile" as a link on the
  word "profile"** in the status sentence, removing a control instead of compressing one. Toggle
  shortened to **"Show all"**. Worth recording *why* Steve's beat mine: I had measured every label
  and correctly reported that only "Save"/"Save it" fit one row — true, and the wrong problem. Also
  note the toggle has **two** labels, so shortening one state alone would have left "Apply profile"
  wrapping and the band jumping height on every toggle. Signed-out now equals signed-in at every
  width. Two traps recorded: a `<button>` is `inline-block` and **Chrome forces that even under
  `display:inline`**, so padding meant to grow the tap target inflated the line box (cancelled with
  an equal negative margin — hit area 42x30, zero layout cost); and the shortened status copy moved
  the wrap/nowrap crossover the CSS comment warns about, **860 → 790**, re-measured at both settings
  across seven widths. **(3) About "Place"** stopped asserting Italy's coffee primacy as settled
  fact — a claim contested in exactly the specialty-coffee circles most likely to become advocates.
  Steve's replacement: *"Espresso was born in Italy, and coffee lovers worldwide recognize Italian
  roasts as balanced, refined, and delicious."* **(4) First photography on the landing page** — the
  page ran 533 words and five screens with nothing to look at, the loudest GTM-review finding and
  the one real barrier to a younger visitor (the editorial voice is the differentiator and stays).
  Three slots, not five, and deliberately **not** on the four shelf cards (four thumbnails in a row
  is the e-commerce grid the brand avoids): a 21:9 band under the hero (16:9 on phones, where 21:9
  is a letterbox slit), a 4:5 founder portrait beside the confession, and a 3:2 **product** shot in
  "Our model" — the one the review said was missing anywhere on the page. Now filled with Steve's
  **temporary** stand-ins, named `ci-temp-*` so one grep finds everything that must go before
  launch; each slot keeps its brief for the real shot in a `PROD:` comment. One file per slot serves
  both desktop and phone crops via `object-fit:cover` with per-slot `object-position`. Images
  re-encoded q82 progressive and **stripped of all metadata** (no GPS was present, but phone photos
  entering a git repo and a public theme get stripped regardless). **Two recorded reasons these
  cannot ship:** the band is a US specialty café (English chalkboard, dollar prices, matcha), and
  the product shot shows **third-party trademarks** (Lavazza, a US roaster) — Lavazza being
  mass-market, the opposite of the artisan sourcing the surrounding copy claims. **(5) Process, all
  triggered by one broken file:** `dev.cmd` had pinned `--theme 151277174953` (POC4 Preview) since
  2026-07-05 and broke silently when POC4–POC9 were deleted. Rewritten with **no theme id at all**
  (plain `shopify theme dev` reuses the throwaway Development theme) — an id-free launcher cannot go
  stale — plus a tracked `dev.cmd.example` since `dev.cmd` is gitignored, both now `cd /d "%~dp0"`.
  The same deletion had also broken the **`reconnect-check` skill**, which listed POC4 Preview among
  the themes it expects *and* told the agent to flag any difference as "a real change, not a
  connectivity artifact" — a guaranteed false alarm on every reconnect; and the ⚠️ password callout
  atop this file, which named POC4's preview link. Both now defer to §10. Encoded as
  `crema-poc-deploy` **Step 6.4**: after any theme **deletion**, grep the repo for theme ids and
  judge each hit **by tense, not by age** — historical narrative (§9, change lists) is *supposed* to
  name dead ids and is left alone; executable files and present-tense claims get fixed, preferring
  to delete the id over updating it. Steve also locked **keep at most three POC previews**, now
  `crema-poc-deploy` Step 5, selecting candidates by name pattern **and** `role:unpublished` so the
  live theme, `Horizon`, the Development theme and any hand-named backup are protected *by
  construction*; duplicate names halt the prune (the 2026-07-24 signature), and deletes need Steve's
  explicit go by name+id. **Verified** at 360/375/700/1280 via DOM geometry — the browser screenshot
  tool was wedged the entire session, so the photo crops were checked by rendering the exact
  `object-fit:cover` results offline with Pillow and viewing those. `theme check` at the documented
  baseline (17 offenses / 2 errors / **0 new**). **Deployed** via the `crema-poc-deploy` skill to a
  NEW unpublished theme **"Crema Italia POC13 Preview" (id `151800610985`)**: `theme list` +
  `git log origin/main..HEAD` run **first** (no collision), then **pull-and-diff proved** the push —
  both sides **39** files (36 → 39 with the three temp photos), zero mismatches, nothing on only one
  side. **POC10 (`151624024233`) pruned** on Steve's explicit go under the new cap, its id
  re-verified against live immediately before the delete; its batch is commit `dd0cbf1` on GitHub
  and redeployable. POC11, POC12 and the live theme untouched. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151800610985`

- 2026-08-18 — **"The screenshot tool is wedged" was a six-session misdiagnosis; corrected.**
  Steve asked the obvious question nobody had asked — *is it wedged, or am I failing to open
  something?* — and he was right. The tool is fine. The Browser pane was not displayed, so the page
  sat in `document.visibilityState === "hidden"`, and a hidden page does not composite frames, so
  the screenshot waited 5s for a frame that never came. Proven live: a `javascript_tool` call
  returned `{alive:true, visibilityState:"hidden", hidden:true, hasFocus:false}` against POC13 while
  the screenshot timed out in the same session. **The error message had said so all along** — "the
  Browser pane is not displayed, so the page is not compositing frames, display the pane and retry"
  — and six sessions read past it (POC5, POC6, POC7, POC9, POC12, POC13). **Why it was so
  convincing:** JS execution is never gated on visibility, only throttled, so the DOM-measurement
  fallback kept returning correct geometry and looked like the right answer rather than a symptom.
  **What it cost:** POC13 re-rendered `object-fit:cover` crops offline in Pillow to judge photography
  it could have simply looked at; DOM geometry is authoritative for position, size and keyboard
  reachability but cannot judge crop, colour, or composition — precisely the remaining work.
  **Same failure shape as the two incidents already logged here** (the "truncated files" alarm that
  was a stale `.git/index.lock`, and the stale "not yet deployed" line that produced a duplicate
  theme): an early wrong diagnosis was written down and inherited instead of re-reading live output.
  The repo's own rule — live output beats the document — evidently applies to tooling too, not just
  deployment state. **Fixed:** a present-tense callout at the top of this file. The six
  §9 entries were **left as written** — historical narrative recording what each session believed,
  per `crema-poc-deploy` Step 6.4's judge-by-tense rule.
  **[Corrected later the same day — the remedy above was wrong.]** Displaying the pane does NOT fix
  it; the first fix written into this file told Steve to open a panel and it changed nothing. The
  actual cause is narrower: the tab `preview_start` creates (`tabId: "seed"`) never composites at
  all. Creating a tab with `tabs_create` + `navigate` and passing that `tabId` to the screenshot
  call works immediately. **Steve never needed to do anything — it was agent-side the whole time.**
  See the corrected callout at the top of this file for the two-call recipe. Logged this way rather
  than silently rewritten because the wrong intermediate diagnosis is itself the lesson: the error
  string blames the display, and believing it cost another round trip.
  **Also found while fixing this (separate issue, Steve spotted it):** `docs/POC7_kickoff.md` was
  edited in the same pass on the assumption it was a reusable kickoff template. It is not — it is a
  **one-shot prompt written 2026-07-13 to start the POC7 session**, with a single commit
  (`8fa0e25`), never updated, never repeated for POC8-POC13, and referenced by nothing. The edit was
  reverted. Worse, it carries a present-tense `CURRENT STATE:` block asserting POC6 is the live
  deployment and naming theme **`151440130217` twice - a theme deleted 2026-08-06**. That is exactly
  the drift class §10 exists to prevent. **Steve's call: the file was deleted** (git keeps it at
  `8fa0e25`; nothing referenced it). **Why `crema-poc-deploy` Step 6.4 missed it — and it is NOT
  what I first wrote here.** My first diagnosis said the sweep's grep did not cover `docs/`. That
  was wrong, and re-running the grep exactly as the skill writes it disproved it: all three hits in
  that file were surfaced. **The grep was never the problem.** The failure was judgment. Step 6.4's
  "leave it" example was written as a *file-path pattern* (`docs/POC*_change_list.md`), and
  `docs/POC7_kickoff.md` sits in `docs/` with a POC number in its name, so it pattern-matched into
  the leave-it bucket without anyone reading the tense of the sentence beside the id. **Fixed in the
  skill:** Step 6.4 now says judge the sentence, not the filename, and spells out that a `docs/`
  file with a POC number is not automatically narrative. Worth noting the shape: a checklist that
  lists *examples* invites matching the example instead of applying the rule.

---

- 2026-08-18 — **POC14 batch (items 1/2/4/5) built and verified BY LOOKING — the first batch in the
  project's history to be visually reviewed.** Ledger: `docs/POC14_change_list.md`. Grew out of a
  close-scrutiny review of deployed POC13 (artifact published to Steve), whose central finding was
  that the site **asked** why the consumer was there and never **answered**. **(1) Keyboard access:**
  0 of 13 product cards and 0 of 10 quiz options were reachable, so the hero CTA could be opened by a
  keyboard user and never completed — 49% of all interactive elements were `div onclick`. One
  delegated handler (`markKeyboardActivable` + a keydown listener) now stamps tabindex/role and turns
  Enter/Space into a click, re-running after catalog renders; disabled region pills deliberately
  excluded; visible gold focus ring added. Verified by firing real Enter keys: 13/13 and 10/10, both
  act. **(2) Synthesised type — 216 usages → 0.** No real italic face was loaded ANYWHERE, and
  Marcellus 600 / Inter 700 do not exist, so both hero lines, every Marcellus heading, and all 61
  `.ita` spans (the brand's one sanctioned italic) were browser-drawn fakes. Fixed by loading Inter's
  real italic axis and correcting all 31 display-font rules **at source** (22 faux-bold, 12
  faux-italic) rather than via overrides. **The trap that hid it for six weeks:**
  `document.fonts.check()` returns `true` for faces that do not exist, because it reports "can
  render", including by synthesis — use `[...document.fonts]`. **The method that caught it:** re-run
  the audit against the deployed theme and require zero; enumeration alone got only 216 → 38, and the
  last straggler inherited Marcellus from a parent so a source transform could not see it. **(3) Hero
  now answers** — Steve's catch that "Italian coffee" is a roasting STYLE, not a date, so freshness
  leads: *"Freshly roasted in Italy. Exactly as the roaster sealed it."* Four copy drafts; the
  audience line filters for **passion, not capability** ("who love to grind their own beans") because
  discernment is an exclusive claim and affection is not. Two line-break fixes that only looking could
  catch. **(4) Email capture** added to the footer, where the storefront had none at all while the
  coming-soon page it replaces has one. **Items 3 and 6 landed later the same day.**
  (3) The four home shelf cards rendered **3 + 1** at desktop - `.card-grid` is
  `auto-fill minmax(265px,1fr)`, which resolves to three columns at 1280, so Offerta sat alone with
  two empty columns beside it directly under a heading reading "The four coffee shelves." Now a 2x2,
  scoped to `#page-home` because the class is shared with Shop and the shelf pages, where a
  13-product grid genuinely does want three columns. (6) **Open Graph**: the theme had **zero** tags
  while the coming-soon page it replaces has nine, so every share of the real storefront rendered as
  a bare grey link while the placeholder rendered a proper card - and `ci-og-image.png` was already
  sitting unreferenced in `assets/` at a textbook 1200x630. Now 13 tags, copy aligned to the new
  hero. Two things worth keeping: `asset_url` returns a **protocol-relative** `//host/...` path that
  some scrapers will not follow, so the URL is forced absolute behind a conditional; and it was
  verified by **fetching the image (HTTP 200)**, not just by reading the tag back, because a tag
  pointing at a 404 renders the same bare link as no tag at all.
  `theme check` at the documented baseline, 0 new. Commits `ef0cf74`, `78e8fdc`, `49a0ceb`,
  `1c27c88`.
  **DEPLOYED** via the `crema-poc-deploy` skill: `theme list` + `git log origin/main..HEAD` run
  **first** (POC14 theme already existed — refreshed in place with a FULL push rather than creating
  a second theme, which is the failure that skill exists to prevent), validation at the documented
  baseline, then **pull-and-diff proved** the push — both sides **39** files, zero content
  mismatches, nothing present on only one side, exactly one theme of that name, no duplicates.
  **No prune needed** — three POC previews (11/12/14) against a cap of three, so nothing was
  deleted and no theme ids went stale. POC11, POC12 and the live theme untouched. Preview:
  `https://crema-italia.myshopify.com?preview_theme_id=151800610985`
  **Cowork follow-up raised the same day:** the OneDrive source `Region_Map_v2.svg` still sets its
  map labels to `font-weight:700`, which Inter does not have, so that copy still fabricates a bold
  where the theme's inlined copy no longer does. Written up in `Coordination  region-map-fontweight-handoff-2026-08-18.md` with a dated `DECISIONS_LOG.md` entry (status:
  open). Two characters; no redraw.
  **Process failure worth keeping:** POC14 files were pushed piecemeal onto the theme named "Crema
  Italia POC13 Preview" as a live verification target, which **violated the draft-theme naming rule**
  at the top of this file. Steve caught it. Remedied by renaming the theme to "Crema Italia POC14
  Preview" — the remedy that rule prescribes — and §10 was corrected to state plainly that the theme
  is a working preview, NOT a pull-and-diff-proved deploy. The lesson is narrow and worth stating: a
  verification push is still a push, and the naming rule binds it exactly as it binds a deploy.

- 2026-08-18 — **POC15 built, verified BY LOOKING, and deployed — four audit items closed plus a
  systemic brand breach the looking uncovered.** Ledger: `docs/POC15_change_list.md`. Picked up
  from the POC13 audit's 5.7/10 open list. **Deliberately did NOT re-score POC14 first**: each of
  its fixes was verified individually, so a fresh scoring pass would have re-derived a backlog
  already written at the foot of `POC14_change_list.md`. Score once, at the end, on the same rubric.
  **(1) Voice.** `templates/index.liquid` read "We have carefully hand-selected a small number of
  roasters whose work represents Italian roasting at its finest" — Brand Standards §9 prints "We
  hand-pick the world's most exclusive coffee artisans" as the example NOT to write, so the live
  copy was that anti-pattern with the words rearranged. Replaced with the Standard's approved
  construction. Swept clean; two near-misses left deliberately as Steve's own wording (the Roasters
  page's "premier consumer channel", a distribution claim not a superlative; and "carefully chosen,
  not collected", where the contrast does the work).
  **(2) U.S. customary weights.** The theme had **zero** occurrences of `oz`. Whether that was a
  breach turned on scope, so it was checked rather than assumed: the §9 units bullet carries **no
  scope qualifier** while the bullets either side of it explicitly scope themselves (bilingual
  parity = roaster-facing, em-dash ban = customer-facing). It binds the storefront. **Steve's call
  on placement, and it is the better read of the rule:** the dual form goes on the **price
  denominator**, not the size pills — that is where the value math happens, `selectSize()` rewrites
  it live so the buyer sees the size they actually picked converted (`$120.00 /1 kg (2.20 lb)`),
  and it keeps the pills to **one row** on a phone instead of two. The correction underneath it is
  the durable part: **the conversion's job is to give an American a sense of SCALE, not to decorate
  every weight token** — once anchored at 250 g = 8.82 oz a reader knows what 500 g and 1 kg mean,
  so lists stay short. The first implementation spent three conversions per card to deliver one
  fact. Conversion lives at the **render layer only**; the catalog keeps raw `"250g"` strings
  because they are cart-matching **identifiers** (and become Shopify variant titles in production).
  Precision matches the Standard's own worked examples exactly, so site and document cannot be read
  as disagreeing. **One documented exception:** the founder story's "I ground exactly 17g" stays
  metric-only — a brew dose is written in grams even in America ("18 g in, 36 g out"), so converting
  it would read as LESS fluent to precisely the reader the hero names. Commented in place, same
  shape as the regions map's em-dash exception.
  **(3) Grinder.** Every coffee already said "whole bean only" in its `brewing` copy — but that
  renders in the "About this coffee" block BELOW the buy column, so a buyer could add to cart having
  never read it. That is a returns problem. Now stated directly under **Add to cart** and pointed at
  the burr grinder we actually stock. Home copy said "fresh and ready to consume", which is not
  true of a whole bean; now "ready to grind".
  **(4) JSON-LD.** `Organization` + `WebSite` server-side, validated by parsing the rendered page
  **and by fetching both image URLs (HTTP 200)** — the POC14 lesson that a tag pointing at a 404
  renders the same bare link as no tag. `Product`/`AggregateRating` **deliberately not emitted** and
  specified in `production_build_spec.md` §9 instead: a one-URL SPA has no per-product address, so a
  Product node would either name URLs that 404 or describe a product no crawler renders, and there
  are no reviews to aggregate. `SearchAction`, `sameAs` and `contactPoint` omitted because we have
  no search (removed POC9), no social profiles, and no staffed mailboxes. The spec also records a
  real tension: **`aggregateRating` only models a global average**, which is exactly what the audit
  argued against in favour of reorder rate — choosing palate-matched feedback means deliberately
  forgoing star rich-results.
  **(5) Image weight.** First-paint image weight **1,257 KB → 361 KB**; theme payload **−954 KB**.
  Deleted the orphaned 724 KB `ci-cup.png`; the signature was 6.5× oversampled (94→26 KB); the door
  re-encoded (267→104 KB). **The structural win:** About-page images sit inside `display:none` divs,
  but an eager `<img>` loads regardless of display — so every About photograph was being fetched
  during the home page's first paint. All below-fold and hidden-page images are now lazy. Adding the
  missing intrinsic `width`/`height` cleared **both** long-standing `ImgWidthAndHeight` errors, so
  `theme check` moved **17 offenses / 2 errors → 15 / 0**; the `crema-poc-deploy` baseline was
  updated **and annotated with why it moved**, so a future session does not read the change as a
  regression.
  **(6) Italic was doing two contradictory jobs — found by LOOKING, not measuring.** The new grinder
  note inherited `.afd`, which is `font-style:italic`. A sitewide audit then found **31
  italic-on-English elements** against 11 legitimate `.ita` ones, against Brand Standards §3.3
  ("italics carry meaning - don't italicize for emphasis") and §6's "Never". **The sharpest case:**
  the Shop page rendered `Piemonte` italic to mean **disabled** while `un caffè` two sections away is
  italic to mean **Italian** — one device, two meanings, one screen. Dropped from `.afd`,
  `.pill.disabled`, `.cn`, `.tour-bag`, `.flavor-desc` and `.cart-line-img`; one `<em>` became
  `<strong>`. Each already carried its secondary role through size, colour or opacity, so nothing
  lost legibility — the disabled region pills read **better**, the italic having made them look like
  a different category rather than a dimmed version of the same one. Also removed an unused
  `.hero h1 em{font-style:italic}`: `.hero h1` is Marcellus, which has **no italic face**, so that
  rule was a latent faux-italic landmine of exactly the kind POC14 spent a session eliminating. The
  POC14 font block's now-false claim that "italic is still used freely on Inter" was corrected in
  the same pass — a present-tense claim in a live file gets fixed, not left as narrative.
  **Verification.** `node --check` + `JSON.parse` clean; `theme check` **15/0, 0 new**; banned
  register 0; italic-on-English **31 → 0**; keyboard **13/13 cards, 10/10 quiz options** and
  Marcellus faux usages **0** (POC14 regression checks, both intact); card footers at 1280 with no
  overflow and no horizontal page scroll. **Screenshots worked first try** via the two-call recipe
  at the top of this file. Two tooling notes learned this session: the pane composites at roughly
  **a third scale at 1280px** and `zoom` with a region is **not supported** (it returns the full
  screenshot), so do fine typography judgement at **375px**, where the render is ~1.5× and fully
  readable, and use DOM geometry for desktop; and `resize_window` needs an explicit `{tabId}`.
  **DEPLOYED** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC15
  Preview" (id `151970840745`)**: `theme list` + `git log origin/main..HEAD` run **first** (no
  collision), validation at the documented baseline, then **pull-and-diff proved** the push — both
  sides **38** files (39 → 38 with `ci-cup.png` deleted), zero content mismatches, nothing on only
  one side, exactly one theme of that name. **POC11 (`151797727401`) pruned** on Steve's explicit go
  under the three-newest cap, its id re-verified against live immediately before the delete; its
  batch is commit `2a833d7` on GitHub and redeployable. POC12, POC14 and the live theme untouched.
  **Concurrency note:** Steve edited `snippets/ci-store-footer.liquid` (footer newsletter copy) in a
  separate session during this batch. It was left uncommitted rather than absorbed into a POC15
  commit, per the two-sessions rule; Steve's own session then committed it as `995b11c` before this
  one could. Nothing was lost and the two never wrote the same file — the rule worked as intended.

- 2026-08-19 — **"Tour" is a SKU name, not a site term — vocabulary cured across the storefront,
  the Standard and the build spec (Steve).** Steve: *"The term tour crept into our vocabulary
  because I mentioned that a collection might be a tour of a region such as Tour Tuscany, or an
  Italian Tour as in Tour d'Italia 1. It could also be a Decaf Collection 1. Roaster's favorites 1,
  Roaster's favorites 2, etc. Tour is simply an SKU name (description) and is NOT a website term...
  I want to cure this drift once and for all."* The archetype is a **collection**; only some
  collections are tours of anywhere, and using the narrower word as the category quietly shrank the
  Sorpresa shelf to one kind of product. **Swept:** storefront copy (Sorpresa page, home shelf card,
  home CTA, callout, footnote, FAQ, empty-cart suggestion), the code comments that used it as the
  category term, `docs/production_build_spec.md` §7, and the Store Operating Standard.
  **Deliberately NOT swept:** product names (`Tour d'Italia 1` is correct and stays — four
  occurrences remain in rendered text, all of them the SKU name), and historical narrative — §9
  entries, `docs/POC*_change_list.md`, the archived POC v2/v3 HTML, and code comments describing
  what *used* to exist. Judge by tense, per `crema-poc-deploy` Step 6.4.
  **Store Operating Standards v1.3 → v1.4 → v1.5** published via `crema-std-publish`: vocabulary only, no
  rule change — pricing factors, matrices and every other rule are untouched. New **§1.1** states
  the rule so the Standard now carries it rather than just complying with it. Both renders that the
  edit touched were regenerated (Store Operating v1.4 **and** Collaboration v1.1, whose companion
  header changed without its own version moving — the blind spot recorded in that skill after
  `f9ffcb1`), all gates passed at exit 0, v1.3 archived, both delivered to OneDrive `Standards\`
  and md5-verified against the repo copies. The rule is also a **"Never" in §6**, which is what
  actually prevents recurrence since this file loads every session.
  **Also fixed in the same pass, same root cause:** the Sorpresa page was the only shelf without a
  product grid — a hard-coded `.tour-hero` naming one fixture SKU, its price and its components.
  Now a catalog-driven grid like the other three. And the Shop page's shelf gloss was a parallel
  `SHELF_NOTE` table that had drifted from all four shelf pages; it now reads each shelf page's own
  description at selection time, so there is one description per shelf and nothing to keep in sync.

- 2026-08-19 — **Gifting built, and the packaging policy it depends on locked into the Standard
  (Store Operating Standards v1.4 → v1.5).** Steve asked whether gifting belongs in the cart as a
  checkbox. It does, and for a harder reason than convenience: **a Shopify order carries exactly one
  shipping address**, so a per-item gift flag would let a customer mark one line as a gift and then
  meet a single address field at checkout — promising a split the platform cannot execute. Two
  recipients means two orders. The control also has only one possible home: the cart is ours,
  checkout takes no custom fields below Plus. **Subscriptions block it** — any one subscription line,
  because the cadence bills the giver's card indefinitely *and* the single-address problem remains.
  Shown as an explanatory line rather than a vanishing control.
  **The durable decision is Steve's, and it made the feature smaller:** rather than "hide prices on
  gift orders", **nothing inside any package shows a price, gift or not** — the receipt is an email
  entitlement. Blanket rather than conditional because a conditional rule must be executed correctly
  by whoever is packing that day and **fails silently**; the customer discovers it only when a
  present arrives with a price on it. Every order is now giftable by default and no flag has to reach
  the warehouse. Locked as **§8.1**, with **§8.2** covering gifting itself — including that gifting is
  **never inferred** from a shipping address that differs from billing (a vacation home is not a gift,
  and inferring it puts a gift card in a box someone bought for themselves).
  **Two questions this answered by relocating them.** "Hide prices" is not a 3PL feature and not
  Loop's job — it is the **Shopify packing-slip template**, which we control. What *is* a 3PL question
  became **§12.10**, and both parts are qualifying rather than preferences: do you print our slip or
  insert your own paperwork, and can you insert a card varied per order. The second is not new scope —
  Sorpresa collections already ship a printed tasting card, so a 3PL that cannot do it cannot fulfil
  Sorpresa at all. **Affiliates** are referrers, not fulfilers, so no gift policy applies to them.
  **A §12.9 was opened here and then removed the same day (v1.5 → v1.6).** It asked who would hold
  the Founding Member slot if a gift subscription were sold. Steve: *"we've already said there is no
  gift subscription capability... then why do you ask about Founding Member slot?"* He was right.
  §8.2 says subscriptions cannot be gifted, and that **is** the decision — parking entitlement rules
  for a product we have declined to build put speculative scope into a list whose purpose is holding
  items that must close **before the production build**, and nothing depends on it. Worth recording
  as a pattern to watch: writing a Standard invites inventing open questions to look thorough, and an
  open-decisions list is exactly where that does the most damage, because it buries the items that
  are real. §8.2 now states the rule without deferring anything; the 3PL item renumbered to §12.9.
  Both renders regenerated and delivered, gates at exit 0, v1.4 archived, md5-verified.

---

## 10. Open questions / TODO

**▶ CURRENT STATE — POC15 (deployed + pull-and-diff proved 2026-08-18) — read this first
when resuming.**

> **THIS BLOCK IS THE ONLY AUTHORITATIVE STATEMENT OF DEPLOYMENT STATE IN THIS REPO.** §9 entries,
> `docs/POC*_change_list.md` banners, and any "NEXT: deploy…" line are **historical narrative** —
> they describe a past moment and their "not yet deployed / not yet pushed" claims **expire the
> instant someone acts**. Never infer current state from them.
>
> **MANDATORY — verify before acting, do not trust this block either.** It is accurate as of the
> date stamped above and can be stale the moment anyone deploys. At the start of any session that
> will push, deploy, or make a claim about what is deployed, run BOTH:
> `shopify theme list` and `git log origin/main..HEAD --oneline`.
> Live output wins over every document, including this one; correct the document in the same pass.
> This is also §6's ninth "Never", and for a full POC batch deploy the **`crema-poc-deploy`** skill
> encodes the whole ritual with this as step 0.
> The scheduled coordinator **cannot** do this for you — the Shopify CLI is unavailable in its
> sandbox (confirmed 2026-07-25), so its deployment reporting is always UNVERIFIED.
> **This rule exists because it was violated on 2026-07-24** (see §9): a stale "not yet deployed"
> line in `docs/POC9_change_list.md` was trusted over a live check, producing a duplicate Shopify
> theme. `git log origin/main..HEAD` had already come back empty that same session — the
> contradiction was visible and went unread.

| What | Theme | Id |
|---|---|---|
| **Live (published)** | `crema-italia-coming-soon-theme` | `150557294761` |
| **Newest POC preview** | "Crema Italia POC15 Preview" | `151970840745` |
| Prior preview | "Crema Italia POC14 Preview" | `151800610985` |
| Prior preview | "Crema Italia POC12 Preview" | `151798841513` |

**POC15 is deployed** and is the only POC15 theme (all **38** files byte-match the repo — verified
by pull-and-diff 2026-08-18, both sides 38 files, zero content mismatches, nothing present on only
one side; `theme list` was run **before** the push per the rule above). The file count moved
**39 → 38**: POC15 deleted the orphaned `assets/ci-cup.png` and added no files.

POC12 and POC14 previews and the live theme are untouched. Preview:
`https://crema-italia.myshopify.com?preview_theme_id=151970840745`
(open in a real browser — a `curl` of a `preview_theme_id` link is NOT a valid check, see §9
2026-07-06). To refresh: `shopify theme push --theme 151970840745`.

**Only POC12, POC14 and POC15 previews now exist** — at the three-newest cap Steve set on
2026-08-06, now enforced as `crema-poc-deploy` Step 5. **POC11 (`151797727401`) was deleted
2026-08-18** on Steve's explicit go, after re-verifying the id against a live `theme list --json`
immediately before the delete; its batch is commit `2a833d7` on GitHub and can be redeployed from
git if ever wanted. **POC10 (`151624024233`) was deleted 2026-08-06** the same way (batch `dd0cbf1`),
and POC4–POC9 (`151277174953`, `151420207273`, `151440130217`, `151449862313`, `151454122153`,
`151523131561`) were deleted earlier that day. The erroneous POC9 duplicate `151615373481` was
deleted 2026-07-25. **POC13's batch is on no theme** — commit `baff5e9`, redeployable; Steve
confirmed he is not concerned about the previews skipping numbers.

A `Development (...)` theme may also appear in `theme list` — that is the throwaway created by
`shopify theme dev`, not a deploy. Ignore it. **Its id is deliberately not recorded here**: the CLI
creates a fresh one per machine/session, so any id written down goes stale (this block named
`151795564713` until 2026-08-18, by which point it no longer existed).

**The live theme is current with the repo** as of the 2026-07-24 push (all 13 files byte-match;
zero customer-visible em-dashes verified by cookie-less fetch). **Storefront password still OFF**
(friend-testing) — now purely a friend-testing decision, not a copy-quality one.

**What POC15 is:** POC14 plus four items from the POC13 audit backlog, and one systemic brand
breach found by looking at the result (4 commits, `fce62f4`..`995b11c`). Closed both outstanding
**Brand Standards** breaches: the home page's *"carefully hand-selected... at its finest"*, which
was §9's own named anti-pattern with the words rearranged, and the total absence of **U.S.
customary weights** on a site selling to Americans against a 12 oz default bag. On the units,
Steve's call put the dual form on the **price denominator** rather than the size pills — that is
where the value math happens, `selectSize()` rewrites it live so the buyer sees the size they
actually picked converted, and it keeps the pills to one row on a phone. The principle underneath
it is worth keeping: the conversion exists to give an American a **sense of scale**, so once a
reader is anchored at 250 g = 8.82 oz, lists stay short. Also: the **grinder expectation** is now
stated under Add to cart and pointed at the burr grinder we stock (every coffee already said
"whole bean only", but below the buy column, where a buyer could miss it); **JSON-LD** landed
(`Organization` + `WebSite` server-side — `Product`/`AggregateRating` deliberately omitted and
specified in `production_build_spec.md` §9, since a one-URL SPA has no per-product address); and
first-paint **image weight fell 1,257 KB → 361 KB**, which cleared both long-standing
`ImgWidthAndHeight` errors and moved the `theme check` baseline to **15 offenses / 0 errors**.
Sixth item: **italic now means Italian and nothing else** — 31 italic-on-English usages removed,
the sharpest being the Shop page rendering `Piemonte` italic to mean *disabled* while `un caffè`
two sections away is italic to mean *Italian*. Detail: `docs/POC15_change_list.md`.

**What POC13 is:** POC12 plus a mobile/interaction batch and the first photography (6 commits,
`19548c0`..`baff5e9`). Headlines: the **account dropdown was nearly unusable** — a 5.6px dead strip
between trigger and panel (`margin-top:.35rem`) broke the `:hover` chain, so you could only enter by
moving fast enough that no `mousemove` sampled the gap; and on touch the whole mobile treatment for
that dropdown was being **discarded by the cascade** (its base rules sit after the mobile block), so
the submenu rendered as a 170px floating box hanging below the open panel. The **taste ribbon went
262 → 139px** at 375: de-buttoned tags, the state dot lifted out of its own row, and — Steve's
call — **"Edit profile" buried as a link on the word "profile"** in the status sentence, removing a
control rather than compressing one, with the toggle shortened to "Show all". About's "Place" beat
stopped asserting Italy's coffee primacy as settled fact. And the landing page got **three
photography slots** (band / founder portrait / product) now filled with **temporary** stand-ins —
every `ci-temp-*` asset must be replaced before launch, and two of them carry recorded reasons they
cannot ship (a US café; third-party trademarks). Detail: `docs/POC13_change_list.md`.

**What POC12 was:** POC11 plus the fixes its review produced (4 commits, `3551e40`..`1f0d7c1`).
Headline: **the quiz now pays off before it asks.** POC11 made the quiz the hero CTA but its result
buttons still routed through sign-in, so a stranger's first action ended at a login form headed
"Your Account" with no guest option and a subscriber-discount benefit they could not use. Both
result buttons now act immediately; the account ask moved to a quiet **"Save to my account"** link
in the ribbon, asked after the result has proven useful. **This AMENDS the POC4 lock** ("both
result buttons route through sign-in first"). Also: the **Shop nav dropdown** got the English
glosses A4 missed (Selezione and Offerta had none; Sorpresa said "Surprises" against the headers'
"The Surprise"); the FAQ stopped promising a **volume discount** that appeared nowhere else on the
site; an ops-vocabulary leak (**"swap roaster / SKU / bag-size"**) the A3 sweep had missed was
fixed; and the About people cards gained a visible **"Bio"** button — a real `<button>`, because
the cards are `div`s with `onclick` and were unreachable by keyboard, with placeholders for Lauren
and Partner 1. Detail: `docs/POC12_change_list.md`.

**What POC11 was:** POC10 plus a copy-and-CTA batch built off a GTM/brand review of POC10 (11
commits, `2ea5427`..`2a833d7`). Headlines: the **promo-code copy was factually wrong** and now
pre-empts the checkout field honestly; **"172 of 222 founding slots"** removed as an untrue social
proof claim; **ops vocabulary stripped** from customer copy; **all four shelf headers standardised**
on `The <English name> · <what is on the shelf>`; the **Shop hero** gained a shelf gloss that tracks
the selected pill; the **founder story turned outward**; the hero headline dropped from the Hero
scale to the brand **H1 scale** and now holds one line at every width; and the **taste quiz became
the hero CTA**, moving the first call to action from 3.9 screens down to 0.58 and making it free.
That last one **amends the 2026-07-10 CTA lock** with Steve's explicit authorization — see the §9
entry. Fixture dates now **rebase on load** so the demo stops aging out. Detail:
`docs/POC11_change_list.md`.

**What POC10 was:** POC9 plus the 2026-07-25 mobile-review fixes (quiz no longer forces a sign-in on
an already-signed-in customer; the clipped "Tasting Quiz" chip renders as "Quiz" on phones — that
chip no longer exists as of POC11; the cart line's thumbnail, spacing, and alignment fixed on
phones; one `overscroll-behavior` testing aid). Two findings were **deliberately not built** under
the POC-scope rule — see `docs/POC10_change_list.md` and `docs/production_build_spec.md` §0.

**What POC9 was:** the same custom-Liquid SPA as POC5–POC8 with a 9-item batch on top (regions map
sync + mobile treatment, English-first region list, one shared region-filter object across Shop and
Roasters, home roasters grid removed, header search removed, Promise eyebrow, About Three-P's
alignment, shipping copy corrected to subscription-only free shipping, and a mocked contact form
with reason-based routing). Architecture, brand system, and production seams are unchanged from
POC5. See §9 2026-07-17 + `docs/POC9_change_list.md`. **Still not done: the full-site mobile pass
on a real device** — POC9's responsive regions map has only ever been verified via DOM inspection.

**POC4 — the batch that set the current architecture (as of 2026-07-05).**

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

**Deployment status — DEPLOYED to the preview theme, renamed, and QA'd working
(2026-07-05).** The POC4 batch is committed to git (`3256143` + follow-on commits) and
pushed to GitHub. It is live on the draft theme, now named **"Crema Italia POC4
Preview"** (same id, `151277174953` — renamed from "POC3 Preview" 2026-07-05; see the
draft-naming callout near the top of this file and the §9 2026-07-05 entry).
- Editor: `https://crema-italia.myshopify.com/admin/themes/151277174953/editor`
- Storefront password protection is ON store-wide, and it is a **separate gate from
  Shopify staff/admin login** — being signed into the admin does not by itself bypass
  it. The raw `?preview_theme_id=151277174953` link is fragile against this (a cache
  clear or lost cookie makes it render the password page's content inside the theme's
  own chrome — see the §9 2026-07-05 entry for the full diagnosis). **Preferred way to
  test now:** `dev.cmd` in the repo root (gitignored — it embeds the storefront
  password via `--store-password`) runs `shopify theme dev --theme 151277174953`, which
  sidesteps the gate entirely.
- To push any further local edits to this draft: `shopify theme push --theme 151277174953`

**QA'd working end-to-end (2026-07-05).** Drove the full quiz → sign-in → Shop flow via
`shopify theme dev` and confirmed it lands correctly: taste-profile banner active with
the right tags, Shop page filtered to matches, nav fully clickable. The batch is vetted.

**Brand (current — Brand Standards v2.1; artist rebrand 2026-07-01 palette/type, no-em-dash
voice rule 2026-07-14).** Palette:
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

**▶ PRE-PRODUCTION PLATFORM SPIKE (added 2026-07-24 — do these BEFORE the production build).**
These are not decisions; they are unverified assumptions about how Shopify actually behaves.
Each one, if wrong, forces a spec revision mid-build — which is exactly the outcome Steve
asked to avoid. Full context in the §9 2026-07-24 entry.
- [x] ~~**DECIDE: amend Store Operating Standards §10 ("no visible promo-code field").**~~
  **DONE 2026-07-25 — Standard v1.2 → v1.3, and since VERIFIED on the dev store.** Steve declined
  Plus; §10 now states the achievable rule (**we issue no discount codes at all**, so the visible
  field is inert because nothing valid exists to type), and v1.2's "campaign discounts via URL
  parameter or personalized email link" was retired as a leak Steve identified — a `/discount/CODE`
  link carries a real, readable code. **Empirical confirmation:** on a Basic-plan dev store, the
  Checkout settings page exposes field-level control only for name / company / address line 2 /
  phone, and the Checkout Editor lists `Order summary → Discounts → Discount or gift card` as
  **advisory, non-interactive structure** — no visibility toggle, no removal. The field genuinely
  cannot be hidden below Plus.
- [ ] **TEST: Loop × Shopify Functions discount interplay.** Highest-risk integration in the
  whole design. Loop's selling-plan subscription discount vs our Function-applied founder/
  subscriber benefit — verify they don't collide or double-apply. Best done on a dev store.
- [x] ~~**CHOOSE: new vs legacy Shopify customer accounts.**~~ **NOT A CHOICE — settled by the
  platform, verified 2026-07-25.** A store created today runs **new customer accounts only**;
  Settings → Customer accounts offers Configurations / Authentication / returns / store credit /
  URL, and **no classic option anywhere** (Authentication is just Shop / Google / Facebook sign-in).
  `/account` and `/account/login` **redirect off-domain** to `shopify.com/<store-id>/account`, so
  **the theme renders none of the account experience.**
- [ ] **NEW, replaces the above: SCOPE what customer-account UI extensions can actually do.** The
  POC's account page (Membership tile + founder number, taste-profile card, Loop portal slot,
  Recent Orders) is **not buildable in Liquid** — that surface is Shopify-hosted and extensible only
  via customer-account UI extensions. Establish what an extension can render and where, then decide
  how much of the POC's account design survives. **This is the largest open consequence for the
  production build**, and under the POC-scope rule (`production_build_spec.md` §0) it also means the
  POC's account page has been modelling a surface we do not own. The *business rules* are unaffected
  — durable founder status, the numbered honorific, and the 60-day benefit grace live in Store
  Operating Standards §3.1/§4 and are unchanged; only the rendering surface and technique change.
- [ ] **EVALUATE: a bundle app against Standard §7's BOM requirements** (component-derived
  facets, component-gated availability incl. the freshness window, per-order pick-pack BOM to
  the 3PL). Native Shopify Bundles covers component inventory but not freshness or facet
  derivation. If nothing fits, the fallback (what's automated vs manual) changes the build.
- [ ] **CHOOSE a Shopify plan.** Basic allows **0** extra staff accounts, so **Grow** ($79/mo
  annual) is the practical floor for the Lucia/Asia/Lauren team. Advanced only pays for itself
  on card-rate savings around $70–80k/yr revenue. **Plus is not justifiable** — see §9.
- [ ] Also still open and launch-gating, though not build-blocking: pricing numbers never
  validated against real landed costs (Standard §12.3); real catalog data + photography;
  3PL not selected (blocks the no-waste Promise copy, and the transit/$8.50 claims); email
  platform not chosen (win-back, abandoned-cart, 60-day-grace campaigns all assume one);
  info@ / support@ mailboxes not created (POC9's contact routing needs them); and the legal
  pages checkout requires (privacy, terms, refund, shipping) do not exist anywhere in the repo.

- [ ] **Turn storefront password protection back ON** (Online Store > Preferences)
  once Steve's friend-testing round is done — see the ⚠️ callout at the top of this
  file. This is the one open item from the whole 2026-07-05/06 investigation.
  **Note (2026-07-24):** this is now purely a friend-testing decision — the live theme's
  copy is correct in BOTH states after the 2026-07-24 push, so it is no longer a
  copy-quality tradeoff.
- [x] ~~Steve to visually QA the POC4 batch in an actual browser.~~ Done 2026-07-05 —
  quiz → sign-in → Shop flow confirmed working via `shopify theme dev` (see Deployment
  status above).
- [x] ~~Approve committing this batch to git and re-pushing the preview theme
  (`151277174953`).~~ Done — committed, pushed to GitHub, and confirmed live on the
  preview theme as of 2026-07-05.
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
- [x] ~~"Our founder" About tile~~ DONE 2026-07-10 — Steve's founder bio (the "nine lives"
  story, in tight gold-marked beats), his real photo (`assets/ci-founder.jpg`, cropped to a
  square headshot + highlights tamed), titled "Steve Roberts / Founder" like the team tiles.
- [x] ~~"Our company" About tile~~ DONE 2026-07-10 — Steve's copy (imports/unchanged intro +
  "The Three P's": Place/Product/People as gold beats), a real Tuscany photo
  (`assets/ci-company.jpg`), de-duped against the home "Our model" section. About page now has
  no placeholder copy left (only the company/founder photos are real; team/partner photos are
  still placeholders).
- [ ] Team/partner section photos and roaster/product-tile photos are all text
  placeholders pending real photography and logo assets.
- [ ] Deferred: no-waste copy rewrite on the Promise page (pending 3PL-city research).
- [ ] Optional: `git tag poc3` to mark the POC3 milestone (still not done — consider
  before this POC4 batch is committed on top).
- [ ] **Full-site MOBILE review — deferred until the POC is finalized (Steve, 2026-07-11).**
  Once POC content/layout is locked, do a dedicated phone pass across every page. Known
  issue found this session while fixing the flag strips: on mobile the header does NOT
  collapse to a hamburger — it wraps to 3 rows (~148px tall) and the sticky `.home-jump`
  chip bar (`top:52px` in the `max-width:640px` media query) is fully hidden behind it
  when scrolled (pre-existing, not caused by the flag change). Likely wants a compact/
  hamburger mobile header. Desktop was handled this session: the in-header flag strip grew
  the header to ~68px, so `.home-jump` desktop offset was bumped `top:58px`→`68px`; the
  mobile `top:52px` was left as-is pending this whole-site mobile pass.

**NEXT (production build, after POC4 is vetted):** real product/collection/metafield
data model (`crema_italia.*`) — note the POC4 batch already added a precedent for this
(`roasters` array on bundle products, structured roaster contact fields) that the real
metafield schema should account for; per-shelf product templates; native
`selling_plan_groups` (Loop) on Roccia; Shopify Functions for discounts; real Shopify
cart + Checkout; native Shopify customer accounts for the address-book/profile split
locked 2026-07-04. Reuse POC3/POC4's CSS/JS/markup as the design system. **The
production design prompts and a ready-to-use build prompt live in
`docs/production_build_spec.md`** (data-driven content rule, About/Journal architecture,
footer relationship pages, Loop/native/Functions account split) — read it first when the
production build starts.

**To resume, read in this order:** this block → `docs/POC6_change_list.md` (latest batch —
dropdown bug, Promise wording, taste-filter ribbon redesign, back-links, tricolore) →
`docs/POC5_change_list.md` (prior POC backlog) → `docs/production_build_spec.md` (production
design prompts + ready build prompt — now incl. §8 full-responsive requirement) →
`docs/POC_v4_change_list.md` (POC4's detailed working ledger) → `docs/CremaItalia_POC_v3.html` (design source — now stale relative to POC4/POC5
live copy in several places; treat the repo as source of truth over this frozen doc) →
`00_PROJECT_BRIEF.md` (single source of truth) → `Coordination\DECISIONS_LOG.md`.

---

## 11. Reference index — where things live

- **Brand Standards (current, v2.1) — canonical source is the repo (Option A, 2026-07-13):** `docs/standards/brand-standards/Crema_Italia_Brand_Standards_v2.1.html` (editable source) + its committed render `Crema_Italia_Brand_Standards_v2.1.pdf` (+ `Crema Italia Brand CSS.css`, `fonts.css`, local fonts). Built on the new palette/type. The OneDrive copy under `Brand and Marketing/` is now a **read-only render for Cowork** (currently still the v2.0 render — Cowork to regenerate to v2.1). Superseded repo renders live in `docs/standards/_archive/`; v1.0 archived in OneDrive `_Archive/Pre-Artist_2026-07/`.
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
