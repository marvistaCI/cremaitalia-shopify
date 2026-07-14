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
> - **Store Operating Standards** (v1.2) — pricing/shelves/discounts/fulfilment: `docs/standards/store-operating-standards.md`
> - **Collaboration Standard** (v1.0) — lanes, source/render model, editing protocol: `docs/standards/collaboration-standard.md`
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
> so friends can open the POC4 preview link without hitting the storefront password
> gate first (see the 2026-07-06 entry in §9 for the full why). While it's off, anyone
> who visits cremaitalia.com directly now sees the **current, on-brand coming-soon
> homepage** (`live-theme/templates/index.liquid` + `live-theme/layout/theme.liquid`,
> pushed 2026-07-07 — see that day's §9 entry) rather than the old stale placeholder,
> so this is lower-stakes than it was — but it should still go back ON once
> friend-testing wraps up, because the password is the only thing standing between a
> stray click on the POC4 preview link
> (`https://crema-italia.myshopify.com/?preview_theme_id=151277174953`) and the mocked
> storefront (fake checkout, invented roaster contact info, simulated sign-in) being
> casually discoverable by the public. Check this box first if you're picking this
> project back up and aren't sure of current state.
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
- **Never** use em-dashes in customer-facing copy (product text, page copy, forms,
  emails, coming-soon page) - they read as AI-generated (Steve, 2026-07-13). Replace per
  this rule: where a semicolon would work, use a spaced regular dash (` - `); where a
  sentence trails into a sequenced next thought, use an ellipsis (`...`); if unsure, ask
  Steve. This applies to customer-facing copy only - internal docs (this file, the change
  lists, code comments) may still use them.
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

## 10. Open questions / TODO

**▶ CURRENT STATE — POC8 (as of 2026-07-13) — read this first when resuming.** Latest deployed
preview is **"Crema Italia POC8 Preview" (id `151454122153`)**, pushed 2026-07-13 (commit `6b0a8ed`).
POC8 is a **narrow drift-fix batch**, not a feature batch: it made the POC's mocked cart discounts
honest to **Store Operating Standards v1.2** (no-stacking, per-line `MAX` — the customer receives only
the single highest rate they qualify for, never a sum; a founding subscriber who is also first-time
gets 12%, not 17%), and reworded the guest banner / FAQ / Roccia-toggle copy to match (see §9
2026-07-13 POC8 + `docs/POC8_change_list.md` + `docs/POC_drift_from_standards.md`, now all-Resolved).
Everything below still describes the POC accurately — POC5→POC8 are the same custom-Liquid SPA with
successive batches on top; the architecture, brand system, and production seams are unchanged. Preview:
`https://crema-italia.myshopify.com?preview_theme_id=151454122153`. To refresh: `shopify theme push
--theme 151454122153`. POC7 (`151449862313`) and the live coming-soon theme (`150557294761`) are
untouched. Storefront password still OFF (friend-testing — the one open action from 2026-07-05/06).

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
- [ ] **Turn storefront password protection back ON** (Online Store > Preferences)
  once Steve's friend-testing round is done — see the ⚠️ callout at the top of this
  file. This is the one open item from the whole 2026-07-05/06 investigation.
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
