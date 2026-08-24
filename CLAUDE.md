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
> - **Brand Standards** (v2.3) — look & voice: `docs/standards/brand-standards/`
> - **Store Operating Standards** (v1.16) — pricing/shelves/discounts/fulfilment: `docs/standards/store-operating-standards.md`
> - **Collaboration Standard** (v1.1) — lanes, source/render model, editing protocol, render-trust: `docs/standards/collaboration-standard.md`
>
> ⚠ **EVERY VALUE IN THE STANDARDS IS PROVISIONAL UNTIL THE SITE GOES PUBLIC (Steve,
> 2026-08-24).** While we are in the POC process and before launch, treat every number as a
> **modelling placeholder, not a settled decision** - prices, costs, markups, discounts,
> thresholds, minimums, maximums, windows, cadences. They are good enough to build and reason
> against; they are **not** good enough to charge money against, and none of them acquires
> authority merely by having been written down, versioned and rendered to a PDF. **One deliberate
> analysis pass happens after the live site is built and before it is made public** - earlier is
> impossible, later is too late. **After that we live with our wins and our losses; before it,
> changing a number costs only the edit.** This does NOT license leaving contradictions in place
> (a value disagreeing with another value is a defect at any stage, because we reason against
> these numbers now), and it DOES mean "we already decided that" is never an argument against
> re-examining a number before launch. **Corollary, and it saves real effort: do not preserve
> superseded pre-launch values as history** - nobody transacted under them, so they are drafts,
> not facts. What becomes worth keeping is the first value we actually go live with and what it
> then does in the market. Full rule: Store Operating Standards top callout + §12.13, the one §12
> item that cannot close at the production build.

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
> **Browser pane: what is actually true (rewritten 2026-08-22 after getting it wrong twice in one
> day).** Read this before theorising. Earlier versions of this callout asserted a "seed tab never
> composites" rule and a "tabs_create + displayed pane" rule. **Both were wrong**, and each one cost
> Steve a round trip. What follows is only what has been directly observed.
>
> **1. Screenshots require the pane to be the surface actually on top on Steve's screen.** Not merely
> open - on top. If he switches to Cowork, another app, or another tab, the page goes
> `document.hidden === true`, stops compositing, and `computer{action:"screenshot"}` times out with
> *"the Browser pane is not displayed"*. **The message is accurate; it is the agent that keeps
> misreading it as a bug.** Coordinate clicks need a recent screenshot, so they fail with it.
>
> **2. Everything else works whether the pane is visible or not.** `javascript_tool`, `read_page`,
> ref-based clicks, `get_page_text`, and `fetch()` from page context all work on a hidden tab. **A
> hidden tab is a fully authenticated HTTP client** - on 2026-08-22 the whole A1 cart-and-checkout
> measurement was driven through `fetch()` this way. Prefer this; ask for eyes only when you must
> genuinely *look* (crop, colour, composition, type).
>
> **3. A freshly-started `preview_start` pane composites on its `seed` tab.** Verified directly. Do
> not create extra tabs by reflex. If several tabs exist, only the fronted one composites, so
> `tabs_select` the one you want first.
>
> **4. The tool's state can diverge from what Steve sees.** `tabs_context` returned *"No preview is
> open"* while the pane was up in front of him. If that happens, call `preview_start` again - do not
> tell him the pane is closed.
>
> **5. Cross-origin iframes cannot be clicked, ever.** Checkout card fields return *"the press could
> not be attributed to a frame"* while ordinary clicks on the same page succeed. So **completing a
> test order always needs Steve's hands**, no matter how healthy the pane is. Stage everything else
> first, then ask once.
>
> **How to behave.** Batch the work that needs looking, tell Steve you need the pane on top, and do
> everything else headlessly so he is free to work elsewhere. **If Steve says the pane is up, believe
> him** - he has been right every time and the agent wrong every time. Probe `{visibilityState,
> hidden, hasFocus}` to tell "not on top" (`hidden:true`) from a genuine tool fault, and if it is
> neither, say so plainly instead of inventing a new rule for this file.
>
> **Why this matters, and it is not about screenshots.** DOM geometry is authoritative for position,
> size and keyboard reachability but **cannot** judge crop, colour, composition, or synthesised type.
> Six POC batches measured instead of looking and the first real visual pass (2026-08-18) found
> brand-critical defects in all four categories. **Look at the page; do not only measure it.** The §9
> entries that call the tool "wedged" are left as written (historical narrative, per
> `crema-poc-deploy` Step 6.4); this callout is the present-tense truth.

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
version when handed to an Italian roaster. Honor formal Italian address — use the
**`voi` form, lowercase** (`vostro`, `vostra`, `vi`). Numbers and units: always include
both metric (250 g) and US customary (8.82 oz).

> **Corrected 2026-08-22 — this rule used to say "Voi/Vi/Vostro, capitalized" and the
> document of record disagreed with it.** The Roaster Guide Italian edition, reviewed
> line by line by Lucia Calò (Operations Manager - Italy, native speaker), carries
> **36 lowercase `vostro`/`vostra` and zero capitalized**. Lowercase is standard modern
> Italian commercial register; the capitalized form reads archaic, and capitalized
> `Suo`/`Vostro` belongs to the deferential *Lei* form we do not use. The native
> speaker who owns the relationship wrote the document, so her practice is the rule and
> this line was the bug. Found while analysing her register to draft the v8 goal
> statement in it.
>
> **The rest of her register, measured from the same text, and worth matching in any
> new Italian copy:** median sentence **13 words**; first-person plural (`noi`)
> dominant at 59 occurrences; **zero** impersonal `si deve`/`si richiede`; obligation
> stated plainly with **`deve`/`devono`**, never softened into subjunctive
> circumlocution; **`torrefazione`** for the roastery, never `tosteria`; numbers
> written **words-then-digits** in contractual passages (*sette (7) giorni*,
> *quarantacinque (45) giorni*); courtesy forms (`preghiamo`, `vi chiediamo`) used
> sparingly rather than as padding.

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
   (today: **v2.3**).
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
`Built to Brand Standards v2.3`. On the next edit, compare that stamp to the current
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
  from the POC13 audit's 5.4/10 open list. **Deliberately did NOT re-score POC14 first**: each of
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

- 2026-08-19 — **POC16 built and deployed — the re-score's fixes, plus a run of corrections Steve
  found by reviewing the result.** Ledger: `docs/POC16_change_list.md`. Two sources: items from the
  POC15 re-score (which moved the deployed theme **5.4 → 6.9** on the original audit's ten
  dimensions — note the audit's headline was **5.4**, not the 5.7 it was remembered as), and a
  longer run of things Steve raised while walking the result, several of them structural rather
  than cosmetic.
  **From the re-score.** Five sign-in inputs had **no accessible name** — the labels existed but
  were never *associated*, so a screen reader announced unlabelled edit fields; `for`/`id` fixed it
  (0 of 13 unlabelled, was 5). The **hero H1** set three lines on a phone with a two-word stub, and
  the cause was two-deep: `text-wrap:pretty`, added the day before to fix it, turned out to be
  **inert** (measured: `pretty`/`balance`/`wrap` produce byte-identical output, because Chrome does
  not balance across a forced `<br>`), and the real cause was type size. Line 2 measures **13.838×**
  its own font-size against a measure of exactly `viewport − 48px`, so a **fixed** value satisfies
  it at one width only — which is how POC11 broke it, having verified "one line at every width" on
  desktop alone. Now fluid. The clamp **floor** mattered more than the expression: at 20px it
  silently overrode the calc at 320px and produced `"it."` alone on a line, a worse orphan than the
  original defect. And **Shop + cart now sit above the fold on mobile**, closing the half of the
  first audit's central finding POC14 left open — the 62px bar had **153px of measured empty space**
  between logo and hamburger while both controls sat two taps deep.
  **What Steve found by reviewing.** (1) A **fixture SKU hard-coded into customer copy** — the
  grinder note linked `openProduct('bottega-burr-grinder')`, asserting we stock one specific grinder
  from a shelf of entirely imagined SKUs. Now opens the shelf. A Bottega category filter was
  considered and rejected: the only taxonomy is Equipment/Merch, so building one would have meant
  inventing a second layer of fixture data to prop up the first. This produced a standing rule, now
  in agent memory: never hard-code a handle from a fixture array into logic or copy. (2) The Shop
  page's **shelf gloss was a parallel table** that had drifted from **all four** shelf pages; it now
  reads each page's own description at selection time, so there is one description per shelf and
  nothing to sync. (3) **Sorpresa was the only shelf without a product grid** — a hard-coded block
  naming one fixture SKU, its price and components; now catalog-driven like the other three.
  **The vocabulary cure.** Steve: *"Tour is simply an SKU name (description) and is NOT a website
  term... I want to cure this drift once and for all."* The archetype is a **collection**; only some
  collections are tours of anywhere, and using the narrower word as the category had quietly shrunk
  the shelf to one kind of product. Swept across storefront copy, code comments, the build spec and
  the Standard. **Not** swept: product names (`Tour d'Italia 1` is correct and stays — the four
  remaining occurrences in rendered text are all that SKU name), and historical narrative. Recorded
  as a **"Never" in §6**, which is what actually prevents recurrence.
  **Gifting**, and the policy that reshaped it. Order-level rather than per line, because **a
  Shopify order carries exactly one shipping address** — a per-item flag would promise a split the
  platform cannot execute. In the cart because that is the only place it can live. Blocked on any
  subscription line. But the durable decision was Steve's reframing: rather than "hide prices on
  gift orders", **nothing inside any package shows a price, gift or not**, with the receipt as an
  email entitlement — blanket rather than conditional, because a conditional rule must be executed
  correctly by whoever is packing that day and **fails silently**. That made the feature smaller and
  every order giftable by default. Two of his questions were answered by **relocating** them: "hide
  prices" is neither a 3PL feature nor Loop's job but the Shopify packing-slip template, which we
  control; what *is* a 3PL question became Standard §12.9, and its insert requirement is not new
  scope because Sorpresa collections already ship a printed card.
  **The meta description moved out of the Shopify admin into the theme.** It read "curated
  *italian* roasted coffee only found here" — lowercase on the word the proposition rests on, 62 of
  an available ~155 characters, claiming exclusivity when the differentiator is *unchanged*. It had
  drifted for months unnoticed because the coming-soon theme **hardcodes its own** description and
  masked it; only the POC surfaced it. Nothing reviews an admin field; code gets diffed. Ported
  `live-theme`'s fallback chain so per-record descriptions still win in production.
  **Standards: v1.3 → v1.6 across three publishes.** v1.4 vocabulary; v1.5 the packaging policy
  (§8.1) and gifting (§8.2); v1.6 **removed** a §12.9 that v1.5 had opened on gift-subscription
  entitlement — Steve: *"we've already said there is no gift subscription capability... then why do
  you ask about Founding Member slot?"* He was right, and it is worth recording as a pattern rather
  than a one-off: **writing a Standard invites inventing open questions in order to look thorough**,
  and an open-decisions list is where that does the most damage, because speculative entries bury
  the real ones. Also `production_build_spec.md` **§10** (weights: grams on the variant, conversion
  at render, and the boundary where our rendering stops — checkout, confirmation emails and the
  hosted account print the raw option value) and **§11** (commercial rules must never ship as string
  literals; six on the product page, none currently drifted, all correct *by care rather than by
  construction*).
  **Two method lessons.** A defect in the cart line — a separator stranded at the end of a row after
  POC15's dual units lengthened it — was found **only by looking at a screenshot**. Every geometry
  assertion passed, because nothing overflowed or overlapped; and the Range-based text measurement
  reached for next is equally blind, since it concatenates characters and cannot see a CSS margin.
  Separately, a gift-control test reported two failures that were **contamination from state left by
  the previous test run**, not code defects — re-run from an emptied cart it was correct throughout.
  **DEPLOYED** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC16
  Preview" (id `151983030441`)**: `theme list` + `git log origin/main..HEAD` run **first** (no
  collision), validation at the documented baseline (15 offenses / 0 errors / 0 new), then
  **pull-and-diff proved** the push — both sides **38** files, zero content mismatches, nothing on
  only one side, exactly one theme of that name. **POC12 (`151798841513`) pruned** on Steve's
  explicit go under the three-newest cap, its id re-verified against live immediately before the
  delete; its batch is commit `1f0d7c1` on GitHub and redeployable. POC14, POC15 and the live theme
  untouched.

- 2026-08-20 — **Trust & social proof decided and recorded: Store Operating Standards v1.7 → v1.8
  (new §13), plus the first platform fact in this area that was measured rather than read.** The
  last open dimension on the storefront scorecard — 3.5 in all three passes, four points below the
  next-lowest — was a decision before it was a build, and the decision turned on something neither
  earlier pass had costed. Reasoning artifact: the trust decision brief (published, linked from
  §6.1). **Eight calls (Steve):** collect ratings but render them through a **bespoke discreet
  control** of our own design, never a vendor widget; that control **links to a review-detail view**;
  **emit `aggregateRating`** in production; **reorder rate** logic built now, switched on when data
  supports it; **no photograph reviews**; **publish all but abusive**; **purchase-gated only** via
  emailed per-order links, public review form disabled; and the separate "rate your purchases" page
  folded into that as redundant.
  **The tension the brief was written to resolve mostly dissolved.** The first audit argued for
  palate-matched feedback and reorder rate over a global five-star average, and `aggregateRating`
  models exactly the average being rejected — so choosing the better on-site signal looked like
  deliberately forgoing the star rich-result. Three things collapsed it: they are **different
  surfaces** (Google requires the marked-up rating be *visible*, not that it lead, so a discreet
  control satisfies the crawler while the average does none of the persuading); there are **no
  product URLs** on a one-URL SPA, so the search cost of deferring was zero and is not yet live; and
  a rating is a **required field** in Shopify's standard review schema, so "collect no stars" was
  never on the menu. What the audit got right was the destination; what it never costed was the
  **volume**. Palate-matching works by segmenting, and segmenting divides the sample — roughly 15
  coffees × 9 taste cells × ~20 responses is ~2,700 reviews against maybe 300/yr at realistic volume.
  Reorder rate is worse: undefined until two turns of the 60-day freshness cycle have run. Hence
  §13.6's **minimum-n floors with silence below them**, and a three-rung ladder rather than a choice.
  **Rung 1 is not social proof at all** and is the largest gap: the **legal pages still do not exist**
  (privacy, terms, refund, shipping), and a store asking for a card while showing no returns policy
  fails a trust check no star rating repairs.
  **The dev-store test — half settled, half not, and the half that settled is the one with the
  irreversible decision attached.** Built a four-file probe theme served through `shopify theme dev`,
  captured a baseline **before** installing anything so absence could be told from failure, then
  Steve installed Judge.me free and hand-entered one review. **Proven:**
  `product.metafields.reviews.rating` returned `{"scale_min":"1.0","scale_max":"5.0","value":"2.0"}`
  and `reviews.rating_count` returned `1`, read by **our own Liquid, server-side, no JavaScript** —
  which is the entire input for both the §13.5 control and `aggregateRating`, so **D3 is measured,
  not assumed**. **Unproven:** `reviews.product_reviews` returned nil and the standard
  `product_review` metaobject definition does not appear on the store at all. Probable cause is
  benign — Judge.me syndicates review *metaobjects* through the **Shop channel**, for Shop-eligible
  stores, and a Partners dev store is not one; that fits the evidence exactly (aggregate metafields,
  written directly, populated; metaobject records, travelling the Shop pathway, did not).
  **Recorded as unproven, NOT refuted** — concluding otherwise from a store structurally unable to
  exercise the feature would repeat the two errors already in this log (the stale deployment claim,
  the screenshot tool that was never broken), and the July spike's caveat that a dev store is not a
  perfect mirror stands. Open question for Judge.me support, two parts: does metaobject syndication
  require Shop eligibility, and does the syndicated review populate `author` with the customer
  reference (that second answer decides whether the palate-match join is free).
  **Two findings worth more than the test itself.** (1) **The palate join is already owned.** The
  review schema's `author` is a *customer reference* and the taste profile is the one axis the site
  persists — so palate-matched feedback is a **join**, not a second data-collection exercise. That
  retires the case for Judge.me's paid Custom Questions ($15/mo) and creates one cheap-now,
  expensive-later requirement: **store the taste profile as a customer metafield** in production.
  (2) **A method trap that nearly produced the opposite conclusion.** The obvious existence check,
  `{% if shop.metaobjects.product_review %}`, returned **true** on a store with no review app
  installed at all — Liquid hands back a truthy empty drop, so the honest test is the **count**,
  never the truthiness. Asked the obvious way, the probe would have reported the definition present
  on an empty store.
  **Also decided:** Steve's **discreet-control-links-to-detail** design quietly contains the unproven
  risk — only the *detail view* needs individual review records, so a failure means the vendor widget
  on one page rather than widget furniture on every product card. And **"rate your purchases" is not
  buildable in Liquid**: the account surface is Shopify-hosted (`production_build_spec.md` §0) *and*
  the Liquid `customer` object is reported unreliable under new customer accounts (null while logged
  in; details expiring after ~24h) — forum reporting, not documentation, so flagged rather than
  asserted, but it is the failure mode that passes a test and breaks the next day. The emailed
  per-order link **is** the dedicated rating call.
  **Recorded where it belongs, not in one place:** policy → Standard **§13** (numbered 13
  deliberately — renumbering §10-§12 would falsify citations inside immutable §9 entries); build
  technique → `production_build_spec.md` **§6.1**, which also reconciles the 2026-07-09 review's
  "NOT star-rating clutter" line rather than silently overriding it; **§9.2**'s deferred
  `aggregateRating` question closed; and `docs/trust-and-social-proof-brief.md` **marked SUPERSEDED**
  — a consumed task brief still saying "do not start building" is the same rot class as
  `POC7_kickoff.md`. Both touched renders regenerated (Store Operating v1.8 **and** Collaboration
  v1.1, whose companion header moved without its own version — the `f9ffcb1` blind spot), gates at
  exit 0, v1.7 archived, delivered to OneDrive and md5-verified. **No theme code written yet** — the
  POC build follows. **Steve's standing rule on fixture data, restated:** the POC may carry invented
  ratings because its entire catalogue is invented, but they must be named so they cannot ship, the
  way `ci-temp-*` marks the placeholder photography; **the real build never fakes data and never
  ships a placeholder photo** (now Standard §13.7).

- 2026-08-20 — **Trust & social proof BUILT in the POC: the rating control, the review detail view,
  and the reorder surface — plus Standards v1.8 → v1.10 recording the rules behind them.** Follows
  the decision entry above; that one settled *what*, this one is *what shipped into the theme*. The
  POC is now explicitly a **build reference for the real store** (Steve), so every shape here was
  chosen to make production a data-source swap rather than a rewrite. **Deployed the same day** to a NEW
  unpublished theme **"Crema Italia POC17 Preview" (id `152003018921`)** via the `crema-poc-deploy`
  ritual: `theme list` + `git log origin/main..HEAD` run **first** (no collision), validation at the
  documented baseline, then **pull-and-diff proved** the push — both sides 38 files, zero content
  mismatches, nothing on only one side, exactly one theme of that name. **POC14 (`151800610985`)
  pruned** on Steve's explicit go under the three-newest cap, its id, name and role re-verified
  against live immediately before the delete; its batch is `ef0cf74`..`1c27c88` on GitHub and is
  redeployable. POC15, POC16 and the live theme untouched. Also corrected a stale number in the
  deploy skill itself — it had said to expect **39** files since POC15 deleted the orphaned
  `ci-cup.png`, and that wrong figure survived two deploys because the check passes either way when
  nobody reads it; now 38, with the reason recorded so the next session does not read the change as
  a regression.
  **The mark: stars plus numeral (Steve's call, and he was right).** I had recommended a bespoke
  gauge on brand-purity grounds and he pushed back on two points, both correct. First, my claim that
  empty stars "read as a bad score" was overstated: it holds when stars sit alone or beside a count —
  which is why `0 stars / 38 ratings` would be awful — but with **"Not yet rated"** adjacent, nobody
  computes zero-out-of-five, they read the words. It is a null, not a negative. Second, and the
  bigger one, **stars are universally recognised and my gauge was not**: a hairline filled to 84% is
  not an established rating idiom and would be read by some as a progress bar or a stock level. I was
  trading instant comprehension for brand purity on a page where a stranger gives you seconds. What
  survived from my side were two craft details that make his choice work: the glyphs **round to whole
  stars** because the numeral carries precision, so nothing is fractionally painted and no clipped
  glyph can read as a rendering artifact at 14px; and the empty stars sit at the **hairline value**
  (`#D9D2C2`), not a mid grey, because at that weight they read as an unfilled frame rather than a
  verdict. That colour choice is what makes "it is a null" true *on screen* rather than only in
  argument, and it is commented so nobody darkens it later.
  **Placement is guarded, not assumed (Standard §13.5.1).** The mark renders **only on the detail
  view of a purchasable product** — the test is `sizes`, which is what makes a catalog entry
  purchasable, rather than checking which page we happen to be on. Steve raised the guard himself
  ("so we're not turning on roaster ratings by accident"). Verified live: **0 marks on roaster
  profiles, 0 on person pages, 0 in any grid.** The detail view deliberately renders the control
  **even when empty**, which is the opposite of the grid rule and the point of the asymmetry: one
  null is the only thing on the page telling a purchaser a route to rate exists; thirteen down a
  shelf page is a wall advertising an empty store. Steve read this backwards at one point and it was
  worth catching — hiding it on detail too would have silently deleted his own empty-state copy.
  **The bug, and how it was found.** Bottega renders through a **separate branch of
  `productDetail()`**, so the first insertion reached only the coffee path and the mark was silently
  absent on every Bottega item. **The diff looked entirely correct; the DOM did not.** It was caught
  by asserting on rendered output after the change, not by reading. This matters beyond the fix:
  there are **17 shelf-conditional branch points** in `ci-storefront.js` and one of them had already
  diverged, which is the evidence behind the architecture review queued below.
  **Bottega is its own rating context (§13.5.2, closing v1.9's open item).** Steve asked whether to
  exclude it or "force the palette to be Bottega so it is its own taste". Segment, not exclude: the
  comparison objection is an argument about **coffee**, where the palate is the variable, and does
  not apply to equipment — a grinder either holds its setting or it does not, for everyone. It is
  also not special-casing, because Bottega is already an exception the customer is *told* about
  ("never subscriber-discounted and not part of the four coffee shelves"). Two binding consequences:
  it **never shows a reorder rate** — nobody rebuys a grinder, so the figure would sit near zero,
  mean nothing and read as damning, and it is excluded **by shelf** rather than left for the sample
  floor to eventually pass — and it **never gets the palate-matched layer**. It is also the one shelf
  where a card-level rating could later be defended on its own terms.
  **Fixture convention, and why it is not the POC11 failure.** Steve's rule, restated: the POC may
  carry invented ratings because its entire catalogue is invented; the **real build never fakes data
  and never ships a placeholder photo** (now Standard §13.7). My initial caution was over-applying
  the POC11 lesson — that was a claim reading as true on a page a stranger would believe, which is a
  different thing. The safeguard is the convention this project already uses for photography: fixture
  data lives under **`poc_rating`**, deliberately NOT the production `reviews.` namespace, so a grep
  for the real namespace never hits fixture data and **one grep for `poc_` finds everything that must
  go** — exactly what `ci-temp-*` does for the placeholder images. Five of seventeen products are
  rated so the other twelve exercise the empty state.
  **Reorder rate** carries `POC_REORDER_FLOOR` as a **named constant, never a literal** (build spec
  §11) and shows nothing below it. Verified on `fusari-india`: 9 buyers against a floor of 25,
  correctly silent. Both floors are the same idea applied at two levels — §13.6 keeps a per-product
  signal quiet below its *sample* floor, §13.5.1 keeps the card-level mark off below a *coverage*
  floor.
  **The review detail view is a separate page, and that containment was Steve's design, not mine.**
  Only that view needs individual review records — the one part of the production data path **not yet
  proven** readable in Liquid. So if `reviews.product_reviews` does not populate in production, the
  fallback is a vendor widget on **one page**, while our own mark still governs every product page.
  Putting detail behind a link rather than inline is what made the unproven dependency cheap.
  **Verification:** `node --check` and `JSON.parse` clean; `theme check` at the documented baseline
  (**15 offenses / 0 errors / 0 new**); driven live via `shopify theme dev` with DOM assertions on
  every guard, and **looked at** — three screenshots (populated detail, empty state with the reveal,
  review view) rather than measured only. Commits `f73791f` (build) and `96c1348` (v1.10).
  **Standards moved v1.7 → v1.10 across three publishes**, all rendered with gates at exit 0,
  archived, delivered to OneDrive and md5-verified: **v1.8** added §13 (the eight decisions),
  **v1.9** added §13.5.1 (placement), **v1.10** added §13.5.2 (Bottega). Build technique lives in
  `production_build_spec.md` **§6.1**, which also reconciles the 2026-07-09 review's "NOT star-rating
  clutter" line rather than silently overriding it, and **§9.2**'s deferred `aggregateRating`
  question is closed.
  **NEXT, agreed with Steve: an architecture review, as TWO reviews rather than one.** (A) *Is the
  POC internally sound* — duplicate render paths, diverged shared components, dead code, state
  coherence, starting with those 17 shelf branches; do this **before more POC building**, since it
  protects the work still to come. (B) *Is the POC a good specification for production* — which parts
  are decisions worth carrying, which are mock scaffolding that must never be carried, which model
  surfaces we do not own. **B is not a new artifact**: `production_build_spec.md` already is that
  document, but it grew reactively, section by section as decisions forced them, and nobody has ever
  walked the POC systematically and asked what each part implies. Two notes recorded so B does not
  rot: **you will not know the last POC is the last one until it is behind you**, so B should be a
  per-batch habit rather than a terminal event; and the **26 `PROD:`/`LOOP:` seam markers have never
  been audited for completeness** — an unmarked mock is invisible at production time because it
  simply looks like working code, and every batch adds more mocked surface.

- 2026-08-20 — **Review A run and CLOSED; POC18 in progress (three fixes committed, not deployed).**
  An architecture-efficiency pass over the POC, triggered by the POC17 bug where a shelf branch in
  `productDetail()` meant an edit reached only the coffee path and the rating mark was silently
  absent on every Bottega item — *the diff looked correct; the DOM did not.* **Method: run checks,
  not read code**, since a skim would have missed that bug too. Full record:
  `docs/POC18_change_list.md`.
  **Fixed (`81f00c4`, `27e8ebd`, `986b0ce`).** **A2/A3 — one home per commercial value:** three
  `_meta` keys sat in the catalogue **never read** while their values were hardcoded in markup, which
  is worse than not having the data because the catalogue *looked* authoritative; and **"60 days"
  meant two unrelated rules** (freshness window §5, benefit grace §4) that share a value by
  coincidence, so the obvious find-and-replace would silently corrupt whichever one you were not
  thinking about. Both closed with **theme settings**, which build spec §11 already prescribed for
  values with no natural Shopify object — Liquid reads `settings.*`, `layout/theme.liquid` publishes
  `window.CI_RULES`. This also answers **Steve's requirement that system settings change without a
  rebuild**; his stated willingness to accept stale browser reads turned out to be unnecessary,
  because these render server-side and there is no cached JSON to go stale. **A1 — ask "is this
  coffee", not "is this not-Bottega":** the roaster page filtered by roaster with no taxonomy test,
  and Bottega stayed out only because no Bottega item happened to carry a `roaster`. **Steve's
  redirect made this a better change than the one proposed** — he asked why we were testing the
  roaster field at all, given a roaster-branded tote is simply its own SKU; the predicate was
  *wrong*, not merely missing. `isCoffee()` fixed two latent instances I had not flagged (the Shop
  grid and `reorderEligible`, both on the same proxy, both silently broken by any second non-coffee
  shelf). Derived, never stored — a stored flag would give one fact two homes, the very thing A3
  removed; PROD home is Shopify's native `product.type`, recorded as `production_build_spec.md`
  **§12**. One trap avoided: the first-order discount exclusion reads the same predicate **by
  coincidence** and is a Standard §3 commercial rule, so collapsing it into `isCoffee()` would have
  looked like tidying while welding a discount rule to a taxonomy rule. **A5 — 15 dead CSS rules
  removed** (927 → 912 lines).
  **The review corrected itself twice, which is the durable part.** A5 said 11 unused classes and was
  wrong in **both** directions: two false positives (`.flag-bottom` is used; `.fonts` came from
  `document.fonts.check` inside a *comment*) and three false negatives (the whole `.profile-banner`
  block is dead since POC6's ribbon rebuild, but looked used because the snippet names its own file
  in a comment). Same shape as the other method traps now logged here — the truthy empty Liquid drop,
  hidden pages returning empty text, inputs measured with no product open. **A check that matches
  text rather than meaning can report the exact opposite of the truth**, so every deletion was
  re-verified by extracting real class tokens first, and every fix was proved by asserting on
  rendered output: nothing rendered changed across all three commits, and A1 was proved by
  temporarily giving `bottega-tote` a roaster and confirming the roaster page did not leak.
  **Scope correction (Steve).** Steve stopped the review with *"I thought this was an architecture
  efficiency review?"* and he was right. **A6 is content; N4 and N5 are UI/accessibility.** They got
  in because **the method defined the scope rather than the remit filtering the checks** — a
  "repeated sentences" check was easy to script, so it ran, and its output was treated as an
  architecture finding because it came out of the same analysis. All three are re-filed rather than
  fixed. Worth keeping as a pattern: an analysis that can measure something will produce findings
  about it, whether or not they belong.
  **A6 also produced an instruction that was NOT executed.** I characterised it as "three duplicated
  sentences" and Steve approved deleting the verbatim twins. Investigating showed the promise list
  appears on both the home page and the Promise page **correctly** — item 2 already differs
  deliberately, the home version linking onward and the Promise version not — so the deletion would
  have removed something that belongs. The real duplication is the **Offerta guarantee sentence**,
  byte-identical in two places inside framing that is different and right for each. Written up
  instead of executed, and re-filed with the policy work.
  **Clean bills:** 0 orphaned JS functions, 0 dead `window` handlers, all 8 snippets rendered, state
  model coherent. **Review B followed and is now closed — see the 2026-08-21 entry below.**
  (This line read "NEXT: Review B" until 2026-08-21, after B had finished: a present-tense claim
  pointing forward at completed work, which is the same drift class as the stale deployment line that
  caused the duplicate theme. Steve noticed the thread had frayed and asked; nothing had been lost
  except the record, plus three structural questions B never got to.)

- 2026-08-21 — **Roaster Guide v7 (Italian) shipped, and a verification pattern worth reusing: Code
  holds a pre-edit baseline and diffs Cowork's work.** Steve needed one sentence added to a document
  Lucia Calò had just reviewed line by line, and his concern was precise: *"I dare not break it by
  adding a little change and then having cowork run-off and try to improve something else."* So the
  edit was fenced and then **verified**, rather than trusted. Code snapshotted and md5'd the approved
  v6 Italian **before** Cowork was given the prompt — without that baseline, drift is unprovable
  afterwards — and the prompt named the exact insertion point, quoted the exact sentence, and listed
  what was explicitly out of scope including the English version. **Result: in bounds.** 251 → 252
  text blocks; three changed lines and one print-CSS rule, every one of them authorised; 249 of 251
  blocks byte-identical. The added line is `Codice SKU Crema Italia, da noi assegnato e fornito
  insieme al modello di etichetta.`, sitting exactly where specified. **Two caveats reported rather
  than glossed:** the orphan fix scopes `break-inside: avoid` to *every* `h3 + ul`, so pagination may
  have shifted document-wide and the page numbers cited in the v6 change list may no longer point at
  what they describe; and the PDF's rendered content could not be verified here (compressed text
  streams, no PDF tooling on this machine) — matching timestamps show it was regenerated with the
  HTML, which is evidence rather than proof. **The pattern generalises** and should be reused for v8,
  which already has two deferred items: baseline first, fence the prompt, diff after. It is the
  render-trust idea (Collaboration Standard §9) applied to a document Cowork owns rather than one
  Code renders. Baseline destroyed on Steve's word once the diff was reported; the diff result is
  recorded here instead. **Italian is the document of record; English is for Steve's convenience.**

- 2026-08-21 — **Freshness reset to 90/150, the roast-date display replaced by a computed floor, and
  the SKU format finally written down. Store Operating Standards v1.11 → v1.12.** A long, decision-rich
  stretch; the recording matters as much as the decisions, and an audit at the end found three
  contradictions that would otherwise have shipped.
  **The windows (Steve).** Main shelves **60 → 90 days**; **Offerta 91-150**; past 150 the coffee comes
  off sale and is donated. Boundaries exclusive, because 90 cannot live in two bands. `peak_flavor_days`
  stays **30** and is now labelled for what it is: **a brewing message to the customer**, so a bag kept
  for a year is not later judged against our promise. Steve's reasoning is competitive: we are up
  against sellers claiming two years of sealed freshness, so 90 is still an enormous gap, and 90/150
  leaves room to clear stock before giving it away. New governance rule: **windows may be shortened,
  never extended** - lengthening walks back a promise customers bought under. The 60→90 move is a
  **one-time pre-launch recalibration**, honest only because nobody has ever purchased under the
  60-day promise; from here we tighten as real consumption data arrives.
  **Yesterday's Review A fix paid off within a day.** Freshness and the benefit grace period were both
  **60**, and A2 separated them precisely because a find-and-replace would move them together. Moving
  freshness to 90 would otherwise have silently made the subscriber benefit grace 90 as well.
  **The display: a computed floor, not a date.** Steve's proposal, and better than both of mine.
  Main shelves now show *"Roasted on or after 23-MAY-2026"* — **today minus the window, computed
  server-side**. It is a **guarantee derived from policy** (*nothing we ship you is older than this*),
  true by construction because §5 takes past-window coffee off sale. Three reasons it beat the range I
  had specified: it has **no dependency on lot data**, so a late receipt cannot make it lie; a range's
  fresh end is **unreachable** under FIFO, since a single-bag buyer always gets the oldest lot; and it
  asks the reader no arithmetic. Computed in Liquid rather than JS deliberately — a client clock can be
  wrong, and CDN caching can only ever serve a *wider* window than we guarantee, which errs in the
  customer's favour. **Offerta keeps its actual roast date**, because an Offerta product is one
  split-off lot and knows its own date, and because the same floor on both shelves would make them look
  identically fresh, hiding what justifies the markdown. **`best_by` is no longer displayed anywhere**
  — it is the roast date plus a constant, so showing both stated one fact twice. **`DD-MMM-YYYY`
  everywhere a date is shown to anyone**: `03/07/2026` is 3 July to an Italian roaster and 7 March to a
  U.S. warehouse. Verified live: floor renders `23-MAY-2026` (21 Aug minus 90, correct), Offerta reads
  `Roasted: 20-JUL-2026`, and "Best by" appears nowhere on the site.
  **The SKU format was a pointer to nothing.** `TRRRPPPPSS` — type, roaster, product, size — had been
  discussed at length and appeared **once in the whole repo**, as a cross-reference to a section that
  did not define it. Now `production_build_spec.md` **§13.9.1**, with the point that matters: **Shopify
  does not parse SKUs.** The field is plain text, so the SKU is a *label that travels* — to the roaster,
  the forwarder, the 3PL, a packing slip, a scanner — not the mechanism that links coffee to roaster.
  That is metaobject references. So the SKU is **generated from them and never typed**, or it becomes
  another two-homes problem. And it deliberately carries **no shelf segment**, so stock moving to
  Offerta needs no physical relabelling.
  **Which creates a problem nobody has solved (§13.9.2): one physical SKU, two Shopify products, one
  warehouse bin.** An Offerta split makes a second product drawing on the same SKU in the same bin, and
  FIFO says pick the oldest — so **a full-price buyer is handed the aged bag**. Three candidate
  resolutions are recorded and OPEN, and it is now a **third qualifying question for the 3PL** (Standard
  §12.9), larger than the two already there. Note the 90-day window may have made the "never overlap"
  option achievable without anyone designing for it: against 60 days the previous lot was already at
  the edge when replenishment arrived; against 90 it has another 20-48 days to sell through.
  **Three contradictions found by auditing rather than by remembering**, all of which would have
  shipped: `production_build_spec.md` still specified the **roast-date range** the Standard had just
  superseded; §11's literals table still quoted the 60-day sentence; and — the real one — **Standard §5
  itself carried `days_to_offerta`, default 45.** That is the *same fact* as the freshness window stated
  a second time, and by today the two had diverged 45 against 90. **Retired**: coffee moves to Offerta
  when it leaves the freshness window, so `freshness_window_days` is the only home for that boundary.
  **Also recorded:** the Roaster Guide's **45-day arrival clause** is expressed *relative to our window*,
  so 60→90 silently loosened what roasters must deliver from "within 15 days of roast" to "within 45" —
  a v8 item, and Steve's view is it may have been overstated as a requirement in the first place.
  **Also caught, and worth keeping as a process note:** the v1.12 publish script aborted on a bad anchor
  *after* the cross-references had been updated and a PDF rendered — producing a file named v1.12
  containing v1.11 content. The render gates did not catch it, and could not: the render was internally
  faithful to its source, and only the *filename* was wrong. Deleted and redone. **A gate proves a
  render matches its source, never that the source is the one you meant.**
  **DEPLOYED the same day** via the `crema-poc-deploy` ritual to a NEW unpublished theme **"Crema
  Italia POC18 Preview" (id `152016912553`)**: `theme list` + `git log origin/main..HEAD` run **first**
  (no collision), validation at the documented baseline (15 offenses / 0 errors / 0 new), then
  **pull-and-diff proved** the push — both sides 38 files, zero content mismatches, nothing on only one
  side, exactly one theme of that name. **POC15 (`151970840745`) pruned** on Steve's explicit go under
  the three-newest cap, its id, name and role re-verified against live immediately before the delete;
  its batch is `fce62f4`..`995b11c` on GitHub and is redeployable. POC16, POC17 and the live theme
  untouched. Worth noting for the review: **three of POC18's four changes are deliberately invisible**,
  their success condition being that nothing rendered changed, so the reviewable surface is only the
  freshness display and the new FAQ entry.
  **Staged immediately after, NOT built: `docs/POC19_change_list.md`** — three display changes from
  Steve while reviewing POC18. Two of them **orphan a setting or a field POC18 had just introduced**
  (`peak_flavor_days` loses its only consumer if the peak-flavour clause is dropped;
  `freshness_remaining` loses its consumer if the Offerta line changes), and the third **reverses**
  Standard §5.4's rule that Offerta shows an actual roast date — replacing it with a computed band,
  because a slow-moving SKU can hold more than one Offerta lot and *"quoting the range keeps the
  website always honest, instead of mostly honest."* That one needs a **v1.13 amendment before it is
  built**, not after. Also caught while staging: Steve's worked example gave the band's younger date as
  19-JUL-2026 where his own formula gives 22-MAY-2026 — the formula is right and is what was staged.
  **All three POC19 items then BUILT and DEPLOYED the same day** (commit `502b885`, theme **"Crema
  Italia POC19 Preview" id `152017764521`**), with the Standards amended **first** — v1.13 for the
  Offerta band, v1.14 for retiring `peak_flavor_days` — precisely because item 2 was a *reversal* of a
  published rule rather than an addition, and building first would have put the storefront and the
  Standard in conflict on day one. Verified by asserting on rendered output: the band renders
  *"Roasted between 24-MAR-2026 and 22-MAY-2026"* with arithmetic exact to the day, the main shelves
  read *"These beans are within our best-freshness window of 90 days."*, and **zero** occurrences of
  "peak flavor" or "Best by" remain anywhere on the site. `peak_flavor_days` was removed from **all
  four** places it lived — schema, data, `CI_RULES`, and the JS constant — because leaving any one
  behind recreates the setting-nothing-reads defect the change existed to remove.
  **Steve's merge of the whole-bean sentence was the better fix and worth recording as a pattern.** I
  had proposed keeping his new freshness advice *separate* from the existing grinder line, and flagged
  only that they would half-overlap. He merged them instead, so one statement carries the purchase
  expectation, the freshness advice and the route to a grinder — and the advice counts **from
  receiving** rather than from roast, which is what removed the ambiguity at its root rather than
  working around it. The original confusion was never the number: *"brew within 30 days"* sat inches
  from Offerta's *"Best within 27 days"* and the two measured from different things.
  **POC16 (`151983030441`) pruned** on Steve's explicit go under the three-newest cap, id/name/role
  re-verified against live immediately before the delete; batch `5812884`..`203b23c` is on GitHub.
  POC17, POC18 and the live theme untouched. **Two copy questions left open on purpose**, both found by
  reading the rendered result rather than the diff: the coffee *card* still says "Best within 90 days
  of roast" while the detail page uses the new wording, and the catalogue's per-product brewing note
  still carries a third overlapping grind sentence. Neither is a defect; both are Steve's copy.
  **One process repeat worth noting:** the §10 update script aborted on an em-dash encoding mismatch
  in a search string, exactly as the v1.12 publish script had aborted on a bad anchor earlier the same
  day. Both times nothing partial was written, because the file write sits at the end of the script —
  which is the property that makes an aborted run safe rather than corrupting.

- 2026-08-21 — **Review B run and CLOSED.** *Is the POC a good specification for production?* Not a
  new artifact — `production_build_spec.md` already was that document, but it had grown reactively,
  section by section as decisions forced them, and nobody had ever walked the POC systematically
  against it. Five findings, all fixed.
  **B1 — the document that bootstraps the production build was stale four ways, and it is the one
  document where staleness compounds**, because it is read once, by someone with no context, at the
  start. It told the future builder to *"reuse the POC3/POC4/POC5 CSS/**JS**/markup as the design
  system"* — the JS being the one thing that must not be carried, and §0 of the same file saying so
  four sections later. It named **Store Operating v1.3** when the Standard was at v1.10, pointed at a
  change list thirteen batches old, and sent readers to a §10 "To resume" list that still called
  `POC6_change_list.md` "latest batch". Now it names **no version numbers and no POC number at all**,
  pointing instead at the places that are kept current, with a note never to reintroduce a literal.
  **B2 — the POC catalogue was a specification nobody had read as one.** 78 keys refined across
  eighteen batches, and nothing anywhere transcribed the schema; §1 named the *sources* but not the
  fields. Now `production_build_spec.md` §13. Every field was checked against its read-sites, and the
  derivation claims were verified against real values rather than asserted — which caught an error in
  my own table (`display_title` derives from `roaster.label`, not `roaster.name`, which is precisely
  why `label` exists). **The finding worth keeping is a pattern:** the POC stores a display string
  alongside the machine value it derives from **six times**, because a mock has no cheap way to
  derive. Production derives, or it inherits six standing opportunities for the two to disagree.
  **B3 — how a shelf becomes a Shopify object** turned into the largest piece of work in the session
  once Steve pointed out that the POC never models the event that happens in month one: a new lot
  arriving while the previous one is still sellable. See the SKU/lot entries above.
  **B4 — the seam convention was not single-greppable.** `PROD:` ×29, `LOOP:` ×3, `POC:` ×1, plus a
  prose "Production note". The file header instructs the reader to grep for two markers, which missed
  three sites — and a marker convention whose own declared grep is incomplete defeats the only purpose
  a marker has. Normalised to exactly two; verified 36 found, 0 outside.
  **B5 — two of twenty POC surfaces had no spec section anywhere**: the Regions page and Offerta's
  transition mechanism. Both added as §14, including the three things about the Regions page that look
  like bugs and are not, and the point that Offerta has **two** transitions where only the first is a
  discount — the second is a hard stop the no-waste pledge depends on, and the one an automation is
  most likely to get wrong.
  **A correction of my own, twice over.** Transcribing the POC into a specification inherits its
  mistakes as well as its decisions. §13.2 described `crema_italia.brewing` as *"also where 'whole bean
  only' lives"* — a fixture-data defect written into the production schema as though it were the
  design, when in production a roaster supplies that field and has no reason to write our store
  policy. And §13.9 originally assumed `shelf` is a property of a coffee, which the fixture data made
  look true because no fixture coffee appears on two shelves. **When a fixture value looks like a
  pattern, ask whether it is a decision or an accident before writing it down as a rule.**
  **The three structural questions deferred from Review A were nearly lost** — B ran B1-B5 without
  touching them, and this log said "NEXT: Review B" after B had finished. **Resolved with no action,
  and the reasons recorded** in `docs/POC18_change_list.md`: none of the three carries to production,
  B1 made that explicit in the build prompt, and Review A's evidence says the POC is monolithic but
  not rotting. **The one structural risk that is real is none of the three** — the 17
  shelf-conditional branch points, one of which had already silently diverged, which is what produced
  the POC17 Bottega bug. Count them at the start of any future architecture pass.
  **NEXT is the PRE-PRODUCTION PLATFORM SPIKE in §10**, which is a different question from either
  review: not *is our design coherent* but *does Shopify actually behave the way the design assumes*.
  Four items open, none touched this session — the Loop × Functions discount interplay, scoping what
  customer-account UI extensions can render, evaluating a bundle app against Standard §7, and the
  plan choice.

- 2026-08-21 — **The pre-production platform spike RUN and CLOSED — three de-risks and one
  architectural break.** Opened 2026-07-24 as four unverified assumptions about how Shopify actually
  behaves; two more were settled by the platform on 2026-07-25. All now answered. Written up in
  `docs/production_build_spec.md` **§5.1** (account extensions), **§5.2** (Loop × Functions) and
  **§7.1** (bundle apps); the §10 checklist carries the short forms.
  **The break, and it is the reason the spike was worth running: discount Functions are not re-run
  when recurring orders are created.** Shopify staff, on the developer forum: the rate is
  **snapshotted onto the subscription contract** at signup and orders 2..n bill from that snapshot,
  independent of the original discount. **Standard §11 specifies a Function owns the entitlement,
  reading customer tags to decide the applied rate — that can only ever govern the first order.** It
  breaks the durable Founding Member model directly: someone who subscribes at 10% and later becomes
  a founder would keep 10% forever, because nothing re-evaluates; the 60-day benefit grace cannot be
  enforced on recurring orders either. So the rate must live on the **contract**, which makes it
  **Loop's** job, and shrinks the Function to campaign discounts on one-time purchases. That is a
  materially different architecture from §11 as written. **Second finding, smaller but related:** a
  selling-plan discount is a **price adjustment, not a discount** — it changes the line price before
  any discount is evaluated, so Functions and codes compound *on top of it*. `MAX` holds among
  Function and code discounts (Shopify already applies only the largest product discount per line off
  Plus, which hands us §3's rule for free), but a selling plan sits outside that contest entirely.
  **Deliberately did NOT amend Standard §11/§12.8.** Finding 2 rests on a staff forum answer plus
  Help Centre wording — strong, but forum rather than formal documentation, and unobserved on a
  store. This project's own rule is that live output beats a document, and the same rule cuts both
  ways: a document is not refuted by another document. Four questions for Loop support are in §5.2,
  then confirm on the dev store by inspecting a real contract. **Which system owns a commercial rule
  is Steve's decision, not a correction Code should make unilaterally.**
  **De-risk 1 — customer-account UI extensions run on ALL plans, not Plus.** This had been the
  largest open consequence for the production build since 2026-07-25 established that `/account` is
  Shopify-hosted and the POC's account page is not buildable in Liquid. Full-page extensions exist and
  can be linked from the account header, so the page has a home; extensions can **read and write
  customer metafields**, which confirms the taste-profile-as-customer-metafield requirement (§6.1) is
  the natural mechanism rather than a workaround; and they can call our own backend. **The cost is
  brand, not function:** no custom CSS, no arbitrary HTML, no custom fonts — only Shopify's component
  library, which *"will always render the merchant's own branding"*. We control logo, colours and
  typography through the shared branding configuration, so the page wears our palette and logo but not
  the storefront's typography, spacing or composition. **The POC's account information architecture
  and copy survive; its visual design does not**, and that should be accepted deliberately rather than
  discovered mid-build. Business rules untouched (Standard §3.1/§4).
  **De-risk 2 — use Shopify's own Bundles app; do not buy a third-party one.** Third-party bundle
  apps earn their fee on mix-and-match, build-your-own, volume discounts and BOGO, none of which we
  need: a Sorpresa collection is a **fixed** set of components we choose. Native covers admin
  management and component stock, and its limits (100 variants, 30 products, 3 options) are nowhere
  near binding. **The two §7 requirements no app satisfies are ours either way** — component-derived
  facets, and availability gated on component **freshness** — so a paid app buys nothing we lack.
  **De-risk 3 — Grow is the plan**, billed annually at $79/mo, Steve to confirm. **Basic is
  disqualified rather than merely tight: it includes ZERO staff accounts**, and the team is Steve plus
  Lucia, Asia and Lauren; Grow allows 5. Nothing in the design needs more — Functions run on all
  plans, account extensions run on all plans, and checkout extensibility was the only Plus-gated thing
  we wanted, declined in Standard v1.3 at ~$24k/yr for one hidden field.
  **A correction to this log, and it is an order of magnitude.** The 2026-07-24 entry said Advanced
  pays for itself *"around $70–80k/yr revenue"*. The arithmetic does not support it: Advanced costs
  **$220/mo more** than Grow and saves **0.2pp** on card rate, so break-even is `0.002 × R = 220`,
  i.e. **~$110k per month, about $1.3M a year.** Revisit Advanced at seven figures, not before. Worth
  noting *how* it survived a month: it was written as a confident aside in an entry about something
  else, and nobody re-derives an aside.
  **Two small live checks left for Steve on the dev store**, both minutes rather than hours: whether
  the branding editor offers **Marcellus** (Settings → Checkout → Configurations → Edit), which decides
  whether the account surface diverges from the storefront on type as well as layout; and whether
  native bundles actually decrement **component inventory** — sources conflict, most likely because
  they describe a hand-built product versus a genuine componentised one, and the recommendation above
  changes if they do not.

- 2026-08-21 — **Loop was locked as the subscription engine eight weeks ago and its cost was never
  recorded. Priced now: it is the LARGER of our two platform costs.** Surfaced by Steve asking a
  narrow question — *"so we can't install Loop in a free test?"* — after I had cautioned that dev
  stores block paid apps. **The caution was misplaced:** Loop has a **Free Forever** tier (50 active
  subscriptions), so it installs free and the dev-store restriction never applies. But checking that
  surfaced something larger. Recorded as `docs/production_build_spec.md` **§5.2.1**.
  **Three named commitments in our own record sit behind the paywall**, in Starter at **$99/mo +
  1.0% per transaction**: **dunning management** — which CLAUDE.md 2026-07-10 makes load-bearing in
  the durable Founding Member model (*"Loop dunning protects failed cards"*, the reason a declined
  card cannot cost someone their rate); **cancellation flows** — the pause-first cancel locked in
  Standard §4 and mocked in the POC; and the **branded portal** — the Loop slot on the account page.
  So the free tier is enough to **test** the design and not enough to **run** it, which is a useful
  split rather than a problem: the §5.2 contract-snapshot question can be answered for $0.
  **The monthly floor, stated in one place for the first time: $178/mo before card fees** (Grow $79 +
  Loop Starter $99), **and 3.7% all-in on every subscription order** (Shopify 2.7% + Loop 1.0%).
  **This bears on Standard §12.3**, the pricing-matrix validation that has never been checked against
  real landed costs — and has certainly never been checked against a 3.7% rate on subscription orders,
  which is the shelf the whole subscriber model is built on.
  **Same failure class as the Advanced break-even error corrected earlier the same day**, and worth
  naming as a pattern: **a decision can be locked, logged, and cited for eight weeks without anyone
  ever pricing it.** The spike priced Shopify carefully — Basic vs Grow vs Advanced, break-even
  arithmetic — and priced the subscription engine not at all, because Loop was already "decided" and
  a decided thing stops being examined. Two of these in one day suggests **a cost line should be a
  required field on any platform decision**, not something derived later if someone happens to ask.
  **A quiet vindication of Steve's call on §12.9:** gift subscriptions are **Pro tier, $399/mo**.
  Standard v1.5 opened an item asking who would hold the Founding Member slot on a gifted
  subscription; v1.6 removed it as speculative scope for a product we had declined to build. Had it
  stayed, we would have been designing entitlement rules for a capability costing $300/mo more than
  the plan we need.
  **[VERIFIED the same day by installing it — see the entry below. The table above was read off a
  pricing page; the entry below was read out of Loop's own admin, and it corrects and extends this.]**

- 2026-08-21 — **Loop installed on the free dev store, and the tier finding VERIFIED in the app rather
  than off a pricing page — which changed two things and settled the §5.2.1 open question.** Steve put
  the admin in the shared browser. **The dev-store question is answered empirically: Loop installs and
  runs on a free Partner development store**, because it has a genuinely free tier, so the "paid apps
  cannot be installed on development stores" restriction never applied. Billing page, verbatim:
  *"You currently have **FREE** plan activated on your store. 50 Subscriptions + Basic features
  included. $0 / month, **0% transaction fee**."*
  **The open question is closed: the free tier DOES expose selling-plan discount configuration**, so
  the §5.2 contract-snapshot test costs nothing and needs no trial clock. A selling plan named
  *Founder Subscriptions* already exists carrying **12.00%** across two frequencies (4-weekly,
  8-weekly).
  **The structural finding, and it is observed rather than argued: the discount is a property of the
  SELLING PLAN, not of the customer.** It is configured per plan per delivery frequency, and there is
  no per-customer rate field anywhere in the plan. **So founder-12% and subscriber-10% must be two
  different selling plans**, a customer's rate is decided by which plan they subscribed to, and
  promoting someone to Founding Member mid-subscription means **migrating their contract to a
  different plan** — not re-evaluating a rule and certainly not re-running a Function. That is the
  strongest available support for the morning's Finding 2, and it is Standard §4's durable model
  expressed in Loop's own data model: **entitlement is contract state, not computed state.**
  **A fourth gated dependency the pricing page did not surface: subscription-specific shipping rates
  are Starter.** Standard §3/§4 make shipping offsets a subscriber benefit, and it is easy to miss
  because it does not read as a subscription feature. Joins dunning, cancellation flows and the
  branded portal.
  **The API wall, verified directly rather than inferred.** Settings → API tokens shows the generate
  button disabled behind *"This feature requires you to upgrade to **PRO** plan"*. Combined with the
  structural finding, that forces a real fork: promoting a founder means mutating a contract, and the
  only two routes are **manually in the Loop admin (Starter, $99/mo)** or **programmatically via
  Loop's REST API (Pro, $399/mo)**. **Recommendation: Starter, migrate founders by hand.** Founding
  Membership is capped at **222** by Standard §4 and is a one-way, once-per-customer event, so 222
  manual operations across the life of the business is not a workload, while $3,600/yr is real money.
  Note **bulk actions are also Pro**, so manual means one at a time. Revisit only if the cap is lifted
  or a second contract-mutating rule appears.
  **Also worth keeping: Loop's transaction fee is not monotonic** — Free 0%, Starter 1.0%, Pro 0.75%.
  Starter→Pro breaks even at `0.0025 × R = 300`, i.e. **$120k/month**, the same order as the Shopify
  Advanced break-even and the same verdict: not before seven figures.
  **Method note.** The morning's §5.2.1 was written off Loop's public pricing page and was mostly
  right; installing the app took twenty minutes and produced one correction, one new gated dependency,
  one settled open question, and the structural fact the whole entitlement architecture turns on.
  Loop marks gated features inline with **STARTER/PRO badges in the UI**, so the app is a better
  specification of its own tiers than its marketing is. Consistent with this repo's standing rule that
  live output beats a document — which evidently applies to vendor pricing too, not just our own state.
  **Still to run, now that the tooling is proven free:** create a test subscription against *Founder
  Subscriptions* and inspect the resulting contract to see what was snapshotted onto it. That is the
  last piece of Finding 2 still resting on a forum answer rather than something we watched happen.

- 2026-08-21 — **The Loop test subscription RUN — the morning's two findings confirmed on a real
  order, and the $99-vs-$399 fork dissolved in our favour.** Everything in §5.2 had rested on
  documentation and a Shopify staff forum answer. This ran it: order **#1001** and contract
  **#15285027040** on the dev store through the Test payment gateway, against a *Founder Subscriptions*
  selling plan at **12.00%** mapped to a **$24.95** product. Written up as
  `docs/production_build_spec.md` **§5.2.2**.
  **Finding 1 CONFIRMED, and it carries a consequence nobody had drawn.** The order billed **$21.96**
  — `24.95 x 0.88` to the cent — and shows **no discount line anywhere**. Not a zeroed one; none. The
  12% appeared as a *lower price*, which is what a price adjustment is. **So the subscriber benefit is
  invisible on the Shopify order:** the customer's confirmation email will just show $21.96 and look
  like the price, Shopify's discount analytics will report **zero** discounts on subscription orders,
  and any report keyed on discount lines will agree. The POC cart renders an explicit "Founding Member
  12%" line; in production, on a subscription line, **that line will not exist in Shopify's record**,
  so the theme has to render it from base-vs-plan price or the customer never learns they got it.
  **Finding 2 confirmed structurally.** The contract stores `Base price $24.95 / Subscription discount
  12.00% / Plan: Founder Subscriptions` as its own fields and had already **pre-scheduled five future
  orders** (18 Sep, 16 Oct, 13 Nov, 11 Dec, 8 Jan 2027) to bill from that stored state. That does not
  by itself prove a Function is skipped — that needs a Function deployed to observe — but it confirms
  the half the architecture turns on: **the rate is contract state, not a rule evaluated per order.**
  **The finding that changed the cost basis, and it corrects my own recommendation from four hours
  earlier.** §5.2.1 framed a $99-vs-$399 fork on the reasoning that mutating a contract might need
  Loop's REST API, which is Pro. **It does not.** The contract's product line opens an *Edit product*
  dialog with discount type, discount value and final price all editable, on the **FREE** tier. So
  promoting a subscriber to 12% when they become a Founding Member is: open the subscription, change
  the value, save. **Pro buys automation of an event capped at 222 occurrences that is a thirty-second
  admin edit.** Starter stands. Also native, and worth knowing before anyone designs an intro offer:
  **"Change discount offer after specific payments"**.
  **Three of the four Loop-support questions are now answered without asking**: selling plans do carry
  the discount; the rate cannot vary per customer *on the plan* but can *per contract*; and contract
  rates are editable manually on the free tier. **The fourth is the only thing still blocking** — does
  a discount Function **compound** with the selling-plan adjustment on the first order? It cannot be
  answered by inspection; it needs a Function deployed and a second test order. Given Finding 1 the
  expectation is yes, since the Function sees $21.96 as the line price. **Until then the subscriber
  rate lives in the selling plan OR in a Function, never both**, or a founder gets 12% off a price
  that is already 12% off.
  **Method note, consistent with the day's other one.** The morning's §5.2 was researched from docs and
  a forum post and was right on both counts; running one $29.96 test order confirmed both, produced a
  customer-facing consequence (the invisible benefit) that no amount of reading would have surfaced,
  and **reversed a cost recommendation I had made the same day**. Three checks in one day where live
  output beat a document — the Advanced break-even, Loop's tiers, and now this.
  **Also cleared up, and worth recording because it will recur:** Loop splits *Acquire → Selling plans*
  (the offer) from *Subscriptions* (customer contracts), and an empty Subscriptions list next to a
  perfectly intact selling plan reads as lost work. It is not — and the distinction is precisely the
  one the entitlement architecture turns on: **the plan is the template, the contract is the instance,
  and the rate is copied onto the instance at signup.** Loop's own information architecture is telling
  us the same thing the forum answer did.

- 2026-08-22 — **Platform Validation Round 2 opened with A1, and A1 is ANSWERED: a discount Function
  compounds with Loop's selling-plan price adjustment. Standard §12.7 fell out of the same run.**
  Detail: `docs/production_build_spec.md` **§5.2.3**. Round 1 had closed on documentation and a staff
  forum post; this is the first time the interaction has been watched on a store. **Live check first,
  per §6 and §10:** `shopify theme list` and `git log origin/main..HEAD` both matched §10 exactly —
  POC17/18/19 previews, live theme untouched, nothing unpushed. **No document correction needed**,
  which is worth recording precisely because the rule exists for the times it is.
  **The instrument mattered as much as the result.** A throwaway app (`~/code/crema-validation`, its
  own git repo, outside the theme repo) with one Discount Function that takes a flat 10% off every
  line and **encodes what it was handed into the discount message**. The cart and checkout then report
  the function's own inputs back verbatim, so nothing had to be inferred from arithmetic. Registered
  with `combinesWith` **false on all three classes** — the most restrictive setting Shopify offers —
  so that a compounding result could not be blamed on a combination rule we mis-set.
  **The result.** Same $24.95 variant twice. On Loop's 12% *Founder Subscription* plan the Function's
  10% came off the **already-reduced $21.96**, billing **$19.77** — an effective **20.76%**. The
  one-time control billed **$22.46**, a clean 10%. `combinesWith: false` made no difference, because a
  selling-plan adjustment is **not a discount** and never enters the combination contest at all. So a
  founder would receive 12% off a price that is already 12% off.
  **The fix, and it is better than the binary the spec assumed.** §5.2 had framed this as "the rate
  lives in the selling plan OR in a Function, never both". It does not have to be either/or. The
  Function is **not blind to the subscription** — `sellingPlanAllocation` came back non-null with the
  plan and its adjustments — so it can decline the line, declaratively via `appliesOnSubscription:
  false` or in code. But more usefully, on a subscription line Shopify also hands over
  `compareAtAmountPerQuantity` = the **pre-plan base price** ($24.95), and it is **null on a one-time
  line**. On exactly the lines where the plan moved the price, we are given the number it moved from.
  So the Function can compute a **top-up to `MAX`** — discount only the gap between the plan's price
  and the best rate the customer qualifies for — which preserves Standard §3 exactly, with the plan
  owning the floor and the Function owning the difference. Without it, barring the Function from
  subscription lines would silently turn `MAX` into `standing rate` on every subscription line, so a
  subscriber could never receive the 15% win-back. **Recommendation only; §11/§12.8 is Steve's call
  (item A2).**
  **Standard §12.7 answered as a by-product: YES, a Function can read customer tags AND
  custom-namespace customer metafields.** Open since 2026-07-25 and load-bearing for the entire §11
  engine. `hasAnyTag`, `hasTags`, `numberOfOrders` and `crema_italia.tier` all returned live values at
  checkout, the metafield needing **no definition and no access grant**. Two caveats worth more than
  the answer: the customer object is **null in the cart** and populated only at **checkout**; and
  **tags propagate late while metafields are immediate** — written in one mutation, the metafield read
  back on the next page load while both tags still read `N`, flipping to `Y` about two minutes later.
  So anything that must bite immediately (a resume restoring benefits, a win-back window opening)
  should be a **metafield, not a tag** — which is a real correction to §11's tag-first design.
  **That near-miss is the methodological lesson of the session.** The first reading was one keystroke
  from being written up as "tags never reach Functions", which would have been a false architectural
  finding of exactly the class this log keeps recording (the stale `index.lock`, the "not yet
  deployed" line, the "wedged" screenshot tool). It was a propagation lag. **Re-read before
  concluding.**
  **Two smaller findings.** The discount `message` renders **verbatim to the customer** on the
  checkout, so in production it is customer copy under Brand Standards — and under §3's no-codes
  policy it is the only place a server-side discount explains itself. And **Loop registers its own
  discount Functions** (`referral Discount`, `Gift program discounts`, `bundle-discount` all appear in
  the store's discount picker), so Loop's discount surface is larger than §5.2 assumed.
  **Not closed:** the checkout quotes `Recurring subtotal $21.96 every 4 weeks` — the Function's 10%
  is **not** in the renewal price, and that held even with `recurringCycleLimit: 12`. That corroborates
  §5.2's Finding 2 more strongly than anything before it, but it is a checkout **projection**, not a
  contract. Closing it needs one completed order; card entry sits in a cross-origin iframe and cannot
  be scripted. Logged as **A1-residual**.
  **Dev-store state deliberately left behind and flagged in §5.2.3:** the probe discount is **still
  ACTIVE** and takes 10% off every line, so it must be deactivated before B2, C1 or C3 are run;
  customer `9796364042464` now carries test tags and a metafield.
  **Tooling: the "screenshot tool is wedged" callout was wrong AGAIN, and Steve is the one who caught
  it — again.** The callout listed two conditions (a `tabs_create` tab, a displayed pane) and told the
  agent to ask Steve to show the pane. Following it, this session did exactly that. Steve: *"the
  claude pane is visible, and has been from the start."* He was right, and chasing it properly found a
  **third** condition the callout never named: **only the FRONTED tab composites.** Creating a second
  tab steals the front and screenshots then fail on **both** — including the tab that worked seconds
  earlier — while `document.visibilityState` still reports `visible`, which is the one signal the
  callout told you to trust. `tabs_select` fixes it. The callout is rewritten with all three
  conditions and with how to read the probe to tell condition 2 from condition 3. **This error string
  has now misled three sessions.** Also recorded there: a hidden tab is still a fully authenticated
  HTTP client, and that is not merely a consolation — the entire A1 cart-and-checkout test was driven
  through `fetch()` on a hidden tab; and the Shopify admin's `s-internal-*` web components return
  **zero-size bounding rects** when the pane is not compositing, so clicks silently miss while
  `innerText` reads fine.
  **Also learned, and reusable:** `shopify store auth` + `shopify store execute` / `shopify app
  execute` give a fully headless Admin GraphQL channel, which is far more reliable than fighting the
  admin UI, and `app execute` runs **as the app** (the only way to see the app's own
  `shopifyFunctions`). The auth flow opens the authorize page in the **default** browser (Comet here),
  which is not drivable; the URL was recovered from the launched process's command line and completed
  in the Claude pane instead.

- 2026-08-22 — **The business's non-Shopify systems inventoried for the first time, and the
  infrastructure they run on was found, fixed and verified in the same session.** Steve asked for
  a complete register of every system Crema Italia subscribes to. The artifact is
  `Operations\In USA\shopify\Systems\Systems Inventory.xlsx` (OneDrive, Cowork's lane to read,
  Code's to maintain): 39 systems, 43 decisions, a cost roll-up and a sources sheet. Sources were the
  three Standards, `production_build_spec.md`, the OneDrive brief and operations tree, and a sweep of
  48 MB of Code session transcripts for vendor names discussed but never written down. **The reason it
  was worth doing is what it found: four systems the business depends on were recorded NOWHERE.**
  **Registrar and DNS: Namecheap, for both.** Never named in any document. Renewals paid through
  29-APR-2027. **PremiumDNS was subscribed and switched off** — the nameservers pointed at BasicDNS,
  so a paid service was answering no queries. Steve flipped it to `pdns1/pdns2.registrar-servers.com`
  the same session. Verified by querying the new nameservers **directly** rather than reading the
  admin screen: every record carried over, both nameservers agreeing, public resolvers updated within
  minutes, site HTTP 200. Done pre-launch, which was the cheapest possible moment. **A Namecheap SSL
  certificate is also subscribed and can NEVER be used** — the storefront serves a Let's Encrypt
  certificate that Shopify provisions and renews at its load balancer, and Shopify accepts no
  third-party certificate on any plan. Same paid-for-and-unused shape as PremiumDNS, except this one
  cannot be switched on.
  **Email: Google Workspace**, also unnamed anywhere. Primary user `steve.roberts@cremaitalia.com`,
  with aliases `info@`, `sroberts@`, `steve@`, `usagent@`, `roasters@` — and `support@` + `contact@`
  added this session, closing POC9's contact routing. **§10 said `info@` did not exist; it did, and had
  since June.** `usagent@` being confirmed live matters independently — it is the address on file with
  the FDA as US Agent contact for every roaster registration.
  **There was no SPF record at all.** Not a soft failure: zero `v=spf1` at the apex, so DKIM alone was
  authenticating every message. Confirmed by Google's own DMARC aggregate report, which Steve supplied
  — `dkim: pass`, `spf: none`, evaluated as fail. Fixed the same session with
  `v=spf1 include:_spf.google.com ~all`, verified at the authoritative nameservers and at public
  resolvers, as exactly one SPF record. Lookup cost is 1 of the permitted 10, because `_spf.google.com`
  currently returns a flat ip4/ip6 record with no nested includes.
  **Telephony: Dialpad**, unnamed anywhere, and compliance-relevant in a way that is easy to miss for a
  phone system — the brief puts `+1-813-376-4821` on file with the FDA, so if that is the Dialpad line,
  the subscription lapsing breaks a regulatory contact of record rather than merely losing calls.
  Unconfirmed. In the other direction, **the storefront publishes no phone number at all** — no `tel:`
  link exists in the theme — so a capability is being paid for that the site does not use.
  **Costs, stated in one place for the first time:** $139/mo committed today (Shopify Basic $39 +
  Claude Max $100), $290/mo across the decided stack at launch. Nine systems are **not costed at all**,
  several of them launch-blocking: 3PL, freight forwarder, customs broker, accounting, customer service,
  referral tooling.
  **Three method lessons, all the same shape as ones already in this log.** (1) **An absence is the
  weakest evidence there is.** I twice built a confident conclusion on a DNS query returning nothing —
  once on a record name I had mistyped, once on a host name I had guessed. Both times the record was
  fine and the query was wrong. (2) **A check that matches text rather than meaning can report the exact
  opposite of the truth.** A grep for the literal `DKIM1` matched the *hostname* `dkim1...` and missed
  `dkim3`/`dkim4`, reporting two perfectly healthy Shopify DKIM chains as dead. Had Steve acted on that
  report he would have deleted four working records and broken Shopify's mail signing. The check that
  worked matched `p=MII`, the actual key material. Same family as `document.fonts.check` returning true
  for synthesised faces, the truthy empty Liquid drop, and case-sensitive matching defeated by
  `text-transform`. (3) **Live output beats a document, and it beats a vendor's marketing page and a
  settings screen too** — DNSSEC turned out not to be the PremiumDNS differentiator, and `info@` existed
  despite this file saying otherwise.
  **Open after this session:** which of two healthy Shopify sender identities (SendGrid `p662` vs
  Mailgun `p581`) actually signs — do not delete either until a real message's `DKIM-Signature`
  selector proves it, because both plausibly serve the same live store; whether the Namecheap SSL
  serves anything else before it is cancelled; alias vs Google Group for `support@`, since a Group is
  free, needs no licence, and can include external addresses so Lauren could work it without a seat;
  and the Workspace tier and seat count.

- 2026-08-22 — **Round 2 continued: B2 answered, B1 part-answered, and a second near-miss of the same
  shape as the morning's.** Detail: `docs/production_build_spec.md` **§5.1.1** (B1) and **§7.1.1** (B2).
  **B2 — native bundles do better than decrement component inventory: the bundle holds no stock at
  all.** Built headlessly with `productBundleCreate`, the same native API the Bundles app drives, so
  this tests the platform rather than one app's UI. A bundle of **1 x A + 2 x B** with both components
  at 100 reported sellable **50**; dropping component B to 10 moved it to **5**. That is
  `min(floor(stock / qty))` across components, honouring per-component quantity — exactly what Standard
  §7 asks for, delivered natively, so the §7.1 recommendation to skip a paid bundle app **stands**.
  Three details worth carrying: recomputation is **asynchronous** (still stale at ~6s, settled by ~20s),
  so there is a brief oversell window; the bundle variant is priced as the **sum of its components** and
  created **DRAFT**, which makes Standard §2.3's collection pricing an override of a default rather than
  a blank field; and `inventoryQuantity` and `sellableOnlineQuantity` agree, so the derived figure is
  the one the storefront gates on.
  **The finding nobody was looking for: the Admin API refuses to sell a bundle.** `orderCreate` returns
  *"Line items variant cannot be a variant with components"*. So **a Sorpresa collection cannot be put
  on a manually created or API-created order** — replacements, goodwill re-sends, wholesale, imports and
  migration scripts all hit it, and the workaround of ordering the component coffees individually means
  the replacement will not read as a Sorpresa in reporting. Whether the admin's own "Create order" UI
  and `draftOrderCreate` are refused the same way is unchecked and should be, before anyone designs a
  customer-service flow.
  **B1 — the small question is still open; the two things found on the way to it are larger.** (1)
  **Checkout and customer accounts are now ONE configuration, and it is present on a Basic-plan store.**
  On 2026-07-25 the Checkout settings page offered only field-level toggles; it now carries a
  "Configurations · Customize checkout and customer accounts" card opening a Checkout Editor, and the
  Admin API has replaced `checkoutProfiles` with `checkoutAndAccountsConfiguration(s)`. The store
  reports `shopifyPlus: false`, so the surface is **not Plus-only** — an independent second
  corroboration of §5.1's central de-risk. (2) **Custom uploaded fonts are in the data model**: a font
  group is either a Shopify font handle or a `customFontGroup` carrying an uploaded font file. If
  branding is writable on our plan then the Marcellus question is **moot** — we would upload Marcellus
  (open licence, TTF already in the repo) and the hosted account surface would match the storefront on
  typography, which is **better than §5.1 assumed** and means that caveat should be revisited.
  **Still unresolved:** reading the `branding` sub-field returns `ACCESS_DENIED` to an app holding both
  `read_` and `write_checkout_branding_settings`. Either a third scope is required or `branding` is
  Plus-gated, and those have opposite consequences.
  **The near-miss, and it is the second in one day.** The first `ACCESS_DENIED` arrived on a store
  reporting `shopifyPlus: false`, with both branding scopes granted — which reads exactly like plan
  gating and was one sentence from being written up as "the branding API is Plus-only". It was a
  **scope name**: the parent field needed `read_checkout_and_accounts_configurations`, discovered only
  by guessing it into the app config and redeploying. Paired with the morning's tag-propagation lag
  (§5.2.3), the pattern is now explicit enough to state as a rule: **on this platform an access error
  and a plan limit are indistinguishable from one sample, and a stale read and a missing capability are
  indistinguishable from one read. Vary one thing and look again before writing either down.**
  **Tooling note that made the day's work possible:** `shopify store auth` / `store execute` and
  `shopify app execute` give a fully headless Admin GraphQL channel; `app execute` runs **as the app**,
  which is the only way to see the app's own `shopifyFunctions` and the only way to exercise
  app-granted scopes. Almost everything in A1, B1 and B2 was done through it rather than through the
  admin UI, which cannot be clicked while the Browser pane is not compositing.

- 2026-08-22 — **A1-residual run on a real order, and it REVERSES a claim published the same morning:
  a Function discount IS snapshotted onto the subscription contract and does reach renewals.** Steve
  paid the staged checkout (card entry is a cross-origin iframe and can never be scripted, so this
  always needs a person), producing order **#1002** and Loop contract **#15302394080**. Detail:
  `docs/production_build_spec.md` §5.2.3.
  **What was published this morning and is now corrected.** §5.2.3 said *"the Function's 10% is not in
  the renewal price"*, inferred from the checkout's `Recurring subtotal $21.96 every 4 weeks` — which
  held even at `recurringCycleLimit: 12` and looked like solid corroboration of Finding 2. **It is a
  projection that excludes contract-level discounts.** The contract carries `Subscription discount
  12.00%` (the plan) **and** our Function as a contract-level discount reading *"10% off on the
  specified lines, Usage count: 1, Usage limit: 12"* — the limit being exactly the `recurringCycleLimit`
  that was set. Renewals bill **$19.77**, not $21.96. **Trust the contract, not the checkout summary.**
  **`recurringCycleLimit` turns out to be the precise control the whole question needed:** `1` = first
  order only and **is the default when the field is omitted**, `N` = the first N cycles, **`0` =
  indefinitely** (from the schema's own description). That last value is the dangerous one — left
  applying to subscription lines at `0`, the 20.76% compounding measured this morning is **permanent on
  every renewal**, not a first-order slip. `appliesOnSubscription: false` is the guard.
  **What it does NOT change, and this matters for A2:** the discount is still a **snapshot taken at
  signup**. A customer promoted to Founding Member afterwards is never re-evaluated, and a change to the
  standing rate never reaches an existing contract. **Entitlement is contract state, not computed
  state** — Finding 2's architectural conclusion survives intact. What changed is that a Function
  *can* put state onto the contract, which it was not credited with before.
  **It also improves the hybrid option**: a campaign top-up on a subscription signup should be
  one-time, and `recurringCycleLimit: 1` delivers exactly that, declaratively, with no code.
  **A3 is now proven from both sides**, on two orders differing in exactly one way. #1001 (plan only):
  the line's *original* price is already the reduced $21.96, `totalDiscounts` **$0.00**,
  `discountApplications` **empty**. #1002 (plan + Function): same $21.96 original, discounted to
  **$19.77**, `totalDiscounts` **$2.19**, and a proper `AutomaticDiscountApplication` carrying the
  percentage and message. **The selling-plan 12% leaves no trace whatsoever** — the order cannot even be
  used to reconstruct it, because the line's own "original" price is post-adjustment. So if the rate
  lives on the plan, **Shopify's discount analytics report zero discounts for the entire subscriber
  programme**, and the theme must render the benefit itself from base-vs-plan price.
  **Two access facts worth carrying to the production build:** reading `orders` failed for our own app
  with *"This app is not approved to access the Order object"* — **protected customer data approval** is
  a launch requirement for any app of ours that reads orders — while the Shopify CLI connector app could;
  and `subscriptionContracts` was denied to both, so the contract had to be read from **Loop's admin**.
  **Method note, and it is the third of the day.** Three claims in one session were one step from being
  published wrong: tags "never reach Functions" (propagation lag), the branding API "is Plus-only" (a
  scope name), and now "Functions do not reach renewals" (a checkout projection standing in for a
  contract). Two were caught; **this one was published and had to be retracted.** The common shape is
  taking a *derived display* for the *underlying record*. The rule this project already has — live
  output beats a document — needs a sharper edge: **a summary screen is not live output about the thing
  it summarises. Read the record.**

- 2026-08-22 — **Round 2 items C1-C5 run, and A2 DECIDED: Store Operating Standards v1.14 → v1.15.**
  Two things in one stretch — the data model in §13 was stood up on a real store for the first time,
  and Steve took the entitlement decision the morning's measurements had teed up. Detail:
  `docs/production_build_spec.md` **§16** (C items) and Standard **§11** (the decision).
  **A2 — Steve's call: Option 1, designed for Option 3.** The **Loop selling plan owns subscription
  lines** (founder 12% and subscriber 10% as two plans, promotion = migrating a contract by hand on
  Loop's free tier, bounded by §4's 222 cap); a **Function owns one-time lines**, computing `MAX` from
  customer tags and metafields; and **`appliesOnSubscription: false` is the guard**, because a
  selling-plan adjustment is a price change rather than a discount and a Function discount compounds on
  top of it. Published as v1.15 through `crema-std-publish`: source edited, **§12.7 closed
  verified-yes** and **§12.8 closed answered**, cross-references swept, **both touched sources
  re-rendered** (Store Operating v1.15 *and* Collaboration v1.1, whose companion header moved without
  its own version — the `f9ffcb1` blind spot), all gates pass at exit 0, v1.14 archived with a table
  row, both delivered to OneDrive and **md5-verified MATCH**.
  **One gap is accepted knowingly rather than overlooked.** With the rate on the plan, no campaign can
  out-rank it on a subscription line. Checked against the whole §3 table, exactly **one** ever could —
  the **win-back 15%** at re-subscribe; every other campaign rate is at or below the 10% standing rate.
  The remedy is designed and deliberately unbuilt: the Function is handed
  `compareAtAmountPerQuantity` (the pre-plan base price, present on subscription lines and **null** on
  one-time lines), so it can discount only the *gap* up to `MAX`, with `recurringCycleLimit: 1` making
  it genuinely one-time. Build it if win-back re-subscribes turn out to matter.
  **C2 — the roaster metaobject works exactly as §13.4 designed**, on a Basic-plan store, with all four
  capabilities (`publishable`, `onlineStore`, `renderable`, `translatable`). **The §13.4.2 draft trap is
  real and worse than described:** a DRAFT entry does not merely resolve to `nil` — the collection
  reports **size zero** and the loop body never runs, so a "for each roaster" page renders empty with no
  error anywhere. ACTIVE flipped it to 1 immediately. `onlineStore` gave a genuine native URL
  (`/pages/roasters/gardelli-probe`), so the roaster page need not be a route we build. And the staged
  image upload chain ran end to end — `stagedUploadsCreate` → multipart POST (**HTTP 201**) →
  `fileCreate` → `metaobjectUpdate` → `image_url` in Liquid — which is the mechanism an external roaster
  application form depends on. **Caution recorded:** `image_url` returns a **protocol-relative** URL,
  the same trap POC14 hit with `asset_url` in Open Graph tags.
  **C3 — lots model cleanly, and §13.9.2 turns out to be a bigger problem than it was written as.** Two
  lot records referenced from a product through `crema_italia.lots` (`list.metaobject_reference`) read
  through Liquid with every field resolved. But the headline is the SKU finding: **Shopify permits
  duplicate SKUs across products and gives each variant its own `InventoryItem`**, so two products
  sharing one physical SKU have **completely independent stock pools** — built it, adjusted one to 30,
  and the other stayed at 40. Shopify believed in 70 units where 40 bags exist. §13.9.2 framed the risk
  as FIFO handing a full-price buyer the aged bag; underneath that sits **overselling**, and candidate
  **B (segregate by location only) does not address it at all**, because locations are tracked per
  inventory item. Candidate **C (never overlap)** gains ground on effort as well as correctness, since
  any split means a manual transfer between two pools every time.
  **Two corrections to §13.9's onboarding order, both live traps.** (1) Step 1 says to enable Storefront
  access or *"Liquid cannot read them"* — **Liquid read ours with `storefront: NONE`.** That setting
  governs the **Storefront GraphQL API**, not `shop.metaobjects`; keep the step for headless surfaces
  but do not blame it when a Liquid template renders nothing, because that will be the draft trap
  instead. (2) A product created through the Admin API with `status: ACTIVE` is **not published to the
  Online Store** — `publishedAt: null`, invisible to Liquid until `publishablePublish` runs. **"Active"
  and "published" are different things and the admin shows the reassuring one.**
  **C1 — the full-page account target exists and deploys on this plan**, confirming §5.1 from the build
  side rather than from documentation. **One constraint, learned from a deploy failure:**
  *"`customer-account.page.render` cannot be combined with any other targets"* — a full-page extension
  is **exclusive**, so the POC's account page is one extension and anything added to Shopify's native
  order or profile pages must be separate ones. Rendering it still needs a person (new customer accounts
  sign in by emailed code). The taste-profile write is de-risked regardless: Admin `metafieldsSet` on a
  customer works without a definition or access grant (proven earlier the same day), so
  **extension → `network_access` → our backend → Admin API** is a certain path.
  **C4 — unchanged, and now stated cleanly.** Aggregates populate (`reviews.rating`,
  `reviews.rating_count`); `reviews.product_reviews` is **null**; and listing every metaobject
  definition on the store returns **three**, none of them `product_review` — a firmer statement than
  Round 1 could make, since a truthy empty drop makes the obvious existence check useless. Status stays
  **UNPROVEN, not refuted**; the two questions for Judge.me support still stand. Nothing here disturbs
  §13.5.1, which needs only the aggregate.
  **C5 — not testable in a sitting, and worth saying why.** Flow is not installed, installing it is a UI
  action, and the job that matters is a **daily scheduled trigger**, so a real test costs a day per
  iteration. The design guidance stands; when it is tested, **test the failure mode**, because the
  reported problem is that date comparison in Flow conditions fails **silently** — which on our shelves
  means coffee quietly never leaving the freshness window.
  **Still open after this:** A3's decision (whether the theme renders the invisible subscriber benefit
  itself), B1's one UI look at the font picker, and C1/C4/C5's remainders above.

- 2026-08-22 — **POC20 deployed: the smallest batch yet, and the reason it is worth recording is the
  scoping decision rather than the change.** One data-only commit, `ee1fa66`: all 13 fixture coffees
  had the store-wide whole-bean policy pasted onto the end of a genuinely per-coffee brewing hint, so
  every product page told the customer to grind fresh twice. Trimmed to the part that actually varies.
  **No template, JS, CSS or snippet moved** — `assets/ci-catalog.json` alone, 13 lines. Steve's framing
  is the durable half: *our test data was wrong, not the feature.* It had been treated as a copy
  question to settle; it was neither a copy convention nor a feature defect but badly authored fixture
  data, and the build spec row that had transcribed the defect into the production schema was corrected
  in the same commit.
  **Deployed** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC20
  Preview" (id `152028446889`)**: `theme list` + `git log origin/main..HEAD` run **first** (no POC20
  existed, no duplicate names, zero unpushed commits), validation at the documented baseline (**15
  offenses / 0 errors / 0 new**), then **pull-and-diff proved** the push — both sides **38** files, zero
  content mismatches, nothing present on only one side, exactly one theme of that name. The diff also
  asserted the batch content specifically, confirming the double-grind sentence is absent from the
  deployed catalogue rather than merely absent from the repo.
  **POC17 (`152003018921`) pruned** on Steve's explicit go under the three-newest cap. Two details worth
  keeping: the keep/prune split was **computed from live `theme list --json`** rather than eyeballed,
  and the delete ran **after** the POC20 push was proven, per the skill — never remove a preview until
  its replacement exists. The Step 6.4 stale-id sweep found exactly two references to the dead id and
  they were judged by tense, not by file: the §9 entry naming it (historical narrative, left alone) and
  the §10 CURRENT STATE row (a present-tense claim, corrected). POC18, POC19 and the live theme
  untouched.
  **Also retired in this pass:** the ⚠️ drift warning that had stood in §10 since 2026-08-21 saying the
  repo had moved ahead of POC19. It had, and this batch is exactly the change it named, so the warning
  went out with the deploy that resolved it rather than being left to rot.

- 2026-08-22 — **POC21: the hero rewritten, and the freshness claim moved from unverifiable to
  enforced.** Worked interactively with Steve across a dozen drafts; the durable part is the reasoning,
  not the wording. Detail: `docs/POC21_change_list.md`. **The old sub-line was broken two ways.** It had
  a **dangling modifier** - *"From a small, named group of artisan Italian roasters, air-freighted
  whole-bean so it reaches you..."* never supplied a subject for *air-freighted*, so the sentence had no
  spine. And its promise, *"weeks from the roast date, not months"*, was **not reliably true**: a bag can
  be listed at two weeks and bought at day eighty, reaching that customer at roughly twelve weeks, and
  the 90-day window permits it. The warm phrasing was the one overclaiming.
  **What replaced it states the gate we actually enforce, in settings rather than literals** (build spec
  §11): *most bags sell within 14 to `{{ freshness_window_days }}` days of roasting, and none after
  `{{ offerta_fresh_days }}`*. **14, not 7** - roast-to-pickup is 7 days and then come air freight,
  customs and 3PL receiving, so a bag cannot be on sale at 7 days; 14 also matches the Roaster Guide v8
  goal statement's two-to-thirteen weeks. The **donation pledge moved into the hero** and names Feeding
  Tampa Bay, because specificity is what makes effort felt and nobody else can say it.
  **An earlier draft would have shipped a false claim, and the token is what caught it.** *"No bag more
  than `{{ freshness_window_days }}` days past roasting"* is contradicted by an entire shelf of our own
  store - Offerta sells 91 to 150 days. Writing the setting name forced the question *which number is
  this promise about?*, which the literal 90 would never have prompted.
  **Three drafts were reverted for register**, all on the POC11 rule *say the customer-visible
  consequence, not the mechanism*: *"into our inventory"* and *"available for purchase"* both describe
  our systems rather than the customer's experience, and *"most bags are **consumed** within..."* claims
  behaviour we do not control - which is exactly the distinction **POC19 settled when it retired
  `peak_flavor_days`**, so a consumption claim in the hero would have walked that back in the most
  visible place on the site. *"A select group"* was declined under §6 and Brand Standards §3.1: *small*
  is a countable fact and *named* is a promise kept on the Roasters page, while *select* is an adjective
  about our own taste - the anti-pattern POC15 removed from this same page.
  **The commercial distinction that decided line 2 is Steve's, and it is worth keeping.** US companies
  sell *"Italian roasts"* without being roasters **in Italy**: *Italian* on *roasters* can be read as a
  style, while *roasted in Italy* is a location and cannot be borrowed. **That choice then solved the
  layout**, which nobody expected - because line 2 carries Italy as a place, line 1 no longer needed the
  word, and deleting it took the binding line from **18.159x to 15.126x**, buying **18.4px -> 21.3px at
  375**. At 18px against a 17.6px sub-line the two blocks read as two paragraphs in different colours;
  at 21.3px the headline is a headline again (1.21:1, and 1.79:1 at 1280). The CSS carries the new
  arithmetic and a warning not to copy the old 13.838x back, since that number belonged to a two-line
  hero and is now a trap.
  **Method note worth keeping:** the same-size-as-the-paragraph defect was caught **by looking**. Every
  geometry assertion passed - three lines, no overflow, CTA above the fold - while the hierarchy was
  gone. Also a correction: mid-session I claimed shortening a headline line would not buy font size,
  which was true of the two-line variants measured at the time and wrong as a general claim.
  **Deployed** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC21
  Preview" (id `152029167785`)**: `theme list` + `git log origin/main..HEAD` run **first** (no POC21,
  no duplicates, zero unpushed), validation at the documented baseline (**15 offenses / 0 errors / 0
  new**), then **pull-and-diff proved** the push - both sides **38** files, zero mismatches, and the
  batch content asserted specifically (new hero present, old sub-line absent, both tokens intact).

- 2026-08-22 - **A BUILD GATE state added to the Decisions sheet, separating build-blocking from
  launch-blocking (Steve).** Steve asked when to stop tweaking the POC and start the real store, and
  what he needed in place first. **The answer turned on a distinction the open-items list did not
  make.** Of the ~25 live open items, most are **launch-blocking** - freight forwarder, customs
  broker, accounting, referral, affiliates, Klaviyo, legal pages, photography - and none of them
  changes a line of Liquid. Waiting on them costs weeks and buys nothing. **Build-blocking means: if
  this is wrong, we rewrite rather than edit.** Twelve items meet that test and now sit in a
  contiguous **BUILD GATE** block at the top of the Decisions sheet, filterable like every other
  state and documented in the workbook's own Legend.
  **Seven were MOVED, not copied**, which is the point - the sheet exists because open items had been
  living in three places, so a gate that restates an existing row would have recreated the disease it
  cures. Five are new: the roaster/SKU gate, the pricing-matrix validation, the Grow upgrade, the Loop
  selling plans, and the POC freeze. Verified against a backup before delivery: no original row lost,
  the 50 untouched rows byte-identical, the 7 promotions altered in **only** the State, Next action and
  By when columns, state fills below the block intact, and the autofilter re-ranged to the new last row.
  **The schedule driver is not the 3PL question.** Steve named that as the one giant gap and it is
  real, but what it blocks is narrow - it picks between the three sec13.9.2 candidates, which is a data
  shape, not a page. **The gate that actually sets the start date is one signed roaster and 2-3 real
  SKUs**, because the whole sec13 data model was reverse-engineered from invented data and Review B
  already caught two places where a fixture *accident* had been transcribed into the production schema
  as though it were design. Fixture data cannot find the rest: by construction it agrees with whatever
  we assumed.
  **And the POC's own scorecard says when.** It ran **7.9 across POC17 to POC20** - POC18/19/20 moved
  it zero, correctly, because they were correctness work - and the two dimensions still short of 9 are
  gated on **photography and real SKUs, not on code**. The POC stopped earning its keep around POC18.
  Hence the twelfth gate: POC21 becomes the frozen reference at build start, and a POC change after
  that happens only if it is a decision that needs modelling, never polish.
  **And the gate rows went into the wrong artifact, which is the sharper lesson.** The workbook was
  hand-edited in place - carefully, verified against a backup, delivered - and **it is a render.** A
  **concurrent Code session created `docs/systems-inventory/` at 17:08 the same afternoon**, making
  `build_inventory.py` the source and the `.xlsx` a generated copy, with a README that says in as many
  words never to edit the workbook by hand because the next generator run overwrites it. That directory
  **did not exist when this session listed `docs/` an hour earlier**, so the edit was made against a
  true reading of a repo that had since changed underneath it. The tell was not the README, which was
  never opened: it was `git status` reporting a **modified file this session never touched**. The
  delivered workbook is correct **and fragile** - it holds 12 rows that exist nowhere in the source, and
  it is missing the other session's Roaster Guide archive row, which exists only in the source. One
  generator run resolves it in whichever direction happens to run first.
  **Fixed properly rather than papered over:** `docs/systems-inventory/port_build_gate.py` carries the
  same change into the generator - 20 asserted single-anchor patches, plus a stable sort so BUILD GATE
  floats to the top and every other row keeps its order. **Tested end to end on an isolated copy with
  the output path redirected**, producing 62 decision rows, 12 gate rows contiguous, correct fill,
  subtitle and legend. It was held back at first, because the other session had
  `build_inventory.py` modified and uncommitted and writing to a file another session is mid-edit on is
  the exact failure this repo has been burned by twice. **Steve then said that session was on hold, and
  the port was applied.** Sequence, and the order is the point: its uncommitted change was **committed
  on its own first** (`bf7a468`) so it could not be swept into an unrelated commit, then the port ran,
  then the generator, then the workbook was verified against **two** baselines - the pre-today original
  and the hand edit. Result: 62 decision rows, 12 gate rows contiguous, the other session's archive row
  intact, the other four sheets byte-identical to the pre-today baseline.
  **The verification earned its keep on a small thing.** Comparing render against render caught **one**
  real difference across all twelve rows: three phrases had lost their quotation marks, because the text
  moved from a hand-typed cell into a double-quoted Python literal where `"specified, never validated"`
  could not survive unescaped. Cosmetic, entirely mine, and invisible to any check that only counted rows
  or matched on state. Fixed with escapes and regenerated rather than accepted. **A port is a
  transcription, and transcriptions lose things that a row count cannot see.**
  **Also worth knowing about that concurrent session:** it committed its own work at 17:26 (`fdc27e7`,
  the legal pages, paste-ready with every placeholder resolved) before pausing - which is exactly what
  the two-sessions rule prescribes, and it means the legal-pages gap named as launch-blocking earlier
  the same afternoon is being closed in parallel.
  **Worth stating plainly for next time:** this project keeps learning that live output beats a
  document. The same rule applies to the *shape* of the repo, not only its contents - **a directory
  listing is live output too, and it expires.** A second session can turn a hand-editable artifact into
  a generated one between one tool call and the next.

- 2026-08-22 — **The four legal policies went live, and POC22 shipped the two consequences. One of
  them was found only because Steve asked a question I had not thought to ask.** Steve pasted four
  policies into Settings -> Policies from `docs/legal/ready-to-paste.md`; they were **verified by
  fetching the public URLs rather than reading the admin**, all returning HTTP 200 with the expected
  text. **Two of my three verification failures were my own measurement, again** — an auto-renewal
  needle that spanned a line wrap, and a placeholder regex `\[.*\]` matching theme JavaScript on
  every page (the tell was an identical count of 19 across all five). Same family as the `DKIM1`
  grep matching a hostname and `document.fonts.check` returning true for synthesised faces. The one
  real finding: **privacy is still Shopify's automated policy**, which is a live choice rather than
  an oversight, and the trigger to replace it is the taste-profile customer metafield, since the
  automated policy cannot know about Loop, Judge.me or a profiling join.
  **A claim this repo repeated for months was wrong and is corrected.** §10 said *"the legal pages
  checkout requires (privacy, terms, refund, shipping)"*. **Shopify gates checkout on none of them
  and marks only Contact information Required.** Cowork established this on 2026-08-20 and I wrote
  the correction into `docs/legal/README.md` and then left the wrong sentence standing in the open
  items. What actually drives each page is different in each case: Contact information is Shopify's
  requirement, a privacy policy is CalOPPA's, the automatic-renewal clause is ROSCA's, and shipping
  and refund are underwriting and chargeback defence rather than law. **The refund policy is the one
  that pays for itself, and not for legal reasons** — in a dispute the card network asks what terms
  the cardholder agreed to, and without a published policy the question is decided on their account
  of what they expected, which for a seller of perishable food that cannot be taken back means
  losing the goods and the money.
  **Legal notice stays unset, deliberately.** It is the EU *Impressum* field (Germany §5 DDG,
  Austria, Switzerland) and has no US equivalent; the merchant-identity need is met by Contact
  information, which is why Shopify marks that one Required and this one optional. Revisit only if
  the EU or DACH ever becomes a market.
  **POC22, and the second item is the one that matters.** Steve asked *"do we need something added
  for a POC?"* about the footer links — and the answer turned out to be larger than the footer.
  **(1) The footer now links the policies.** Nothing on the storefront did. A single **"Legal
  notices"** link was considered and rejected for three reasons: `/policies`, `/policies/` and
  `/pages/policies` all **404**, so Shopify has no policy index route and one link would need a page
  we build and maintain; the label collides with the Shopify slot we had just decided to leave empty;
  and **Shipping and Returns are purchase content, not legal content** — a shopper wants the
  free-shipping threshold and the replacement promise *before* buying, and "Legal" signals fine print
  nobody clicks. `Shipping` and `Returns` joined the main list, `Terms` and `Privacy` sit quietly
  beneath the company line. **It removed a duplication rather than adding one:** `#page-shipping` was
  a **417-character condensed paraphrase** of the published shipping policy — same threshold, same
  $8.50, same carriers, same transit bands — and is deleted, with `Shipping` pointing at the policy.
  Leaving the SPA is the production-correct behaviour, not a compromise.
  **(2) The automatic-renewal disclosure now sits where consent is given.** `v2-deltas.md` B1
  specified **two placements** and only the Terms page had shipped. The toggle copy was good
  merchandising and not a disclosure: it never said the card is charged **again, automatically**, at
  what **frequency**, or at what **amount**. **And driving it surfaced something reading could not:**
  `#pd-cadence` computes `display:none` until the box is ticked, so the cadence pills — the only place
  the frequency appeared — were **absent from the screen at the moment of the affirmative act.** The
  new line closes that with *"at the cadence you choose"* rather than by revealing the pills early.
  *"Cancel anytime"* was moved out of the line above so cancellation is stated once, beside the
  renewal terms it qualifies.
  **The design decision matters more than the wording, and it inverts a brand reflex.** The
  disclosure is set at the **same size as the benefit line** (verified computed-equal: both 13.12px,
  `rgb(107,74,56)`, weight 400, opacity 1) and must stay that way. The instinct to shrink and grey
  legal text is **precisely what "clear and conspicuous" exists to defeat**, and small print under a
  subscribe toggle is the pattern regulators look for — so this is one of the few places where this
  brand's quiet-and-small reflex is the wrong call. Commented at **both** the render site
  (`ci-storefront.js`) and the style site (`ci-storefront.css`), with size and colour **restated**
  rather than inherited so a later edit to the benefit line cannot silently shrink this one.
  **Verified** at 375 and 1280 by DOM geometry **and by looking**: footer buttons and anchors render
  computed-identical (a policy link that looked different would read as a different kind of thing),
  no horizontal overflow at either width, single row at 1280, all four policy URLs returning **HTTP
  200 through the theme** rather than merely appearing as `href`s. `theme check` at the documented
  baseline (**15 offenses / 0 errors / 0 new**).
  **DEPLOYED** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC22
  Preview" (id `152029757609`)**: `theme list` + `git log origin/main..HEAD` run **first** (no POC22
  existed, no duplicate names), then **pull-and-diff proved** the push — both sides **38** files, zero
  content mismatches, nothing on only one side, exactly one theme of that name. The diff also asserted
  the batch content **on the deployed theme**: four policy links, the `sub-renewal` disclosure, and
  zero `page-shipping`. POC20, POC21 and the live theme untouched. Detail:
  `docs/POC22_change_list.md`.

- 2026-08-22 — **POC23: a standing scorecard finding was challenged, tested, and turned out to be half
  false and half never-measured. Brand Standards v2.2 -> v2.3.** Steve asked about the carried item
  *"semantic markup... elements announce poorly, and we have not run an end-to-end screen-reader."*
  **The semantic-markup half is largely FALSE.** 83 of 83 non-semantic clickables carry
  `role="button"` **and** `tabindex`, and 82 of 83 have an accessible name — POC14's
  `markKeyboardActivable` stamps every one. The finding predates POC14 and was **inherited four
  passes without re-testing**, the second such finding withdrawn in a single day (the shelf-IA one
  went the same morning). One of my own audit flags was also a false positive: I reported the logo as
  unnamed, then found `alt="Crema Italia"` — my check never looked at `alt`.
  **The contrast half was TRUE and had never been run.** 16 pages plus product detail plus two
  modals: **17 failing combinations across 127 rendered instances**, now **zero**. Two colours
  explained all of it. **The Standard had already predicted one and actively sanctioned the other** —
  it recorded Crema Gold as 3.1:1 and *"large-display/accent only"* while the site used it for 12px
  eyebrows and inline links, and it listed Mute at 3.7:1 as fit for *"captions / fine print only"*,
  which are precisely the small sizes where 3.7:1 fails. The storefront followed the Standard
  faithfully into a failure. Fixed with **darkened siblings rather than replacements** —
  `--ci-crema-text` `#94693A` (4.56), `--ci-mute-text` `#7D705E` (4.55), plus `-fill` variants for
  cream-on-gold — leaving `--ci-crema` and `--ci-mute` untouched for headings, rules and decoration
  where the bar is 3:1 and they already pass. Applied by regex to `color:` only, with a negative
  lookbehind protecting `border-color:`/`background-color:`; 61 text declarations moved, 12
  `border-color` and 8 `background` uses preserved.
  **The trap, and this batch fell into it before climbing out.** A darker token raises contrast on
  cream and **lowers it on brown**. Darkening `.inline-link` globally drove *"See the map"* on the
  Espresso hero from 3.40 to **2.31** — a regression *caused by the fix*, caught only because the
  audit was re-run rather than assumed. Dark grounds now correct the other way, toward
  `--ci-crema-light` (itself nudged `#E8A86A` -> `#E9AB6E`, having been 0.05 short of AA on the
  lightest brown in use).
  **Two accessibility fixes.** `#pd-sub` had **no accessible name at all** — zero labels, no
  `aria-label` — the only unnamed control on the site, and the one where it mattered most, because
  POC22 had placed a legally-required renewal disclosure beside it hours earlier. It now takes
  `aria-labelledby` **and `aria-describedby` pointing at the renewal paragraph**, so the disclosure is
  announced *with* the control rather than sitting near it — better than sighted parity. And the
  rating stars became genuinely decorative (`aria-hidden` plus a labelled `role="group"`), which is
  what licenses their deliberate sub-AA contrast: POC17 set the empty star at the hairline value so an
  unrated coffee reads as a **null, not a zero-out-of-five verdict**, and darkening it would make an
  unrated coffee look badly reviewed. **A code comment nearly shipped a false claim** asserting the
  stars were already `aria-hidden`; they were not, and checking turned a false comment into a real fix.
  **Bottega's slate scheme is sanctioned rather than drifting (Steve).** The colours were fine; the
  storage was not. The hero carried an **inline `style="background:linear-gradient(...)"`**, the shelf
  badge hardcoded `#2a2a3a`, and the placeholder tile hardcoded the gradient a third time — **one
  idea, three homes, no token**, which is exactly how a non-palette colour survives a stylesheet
  audit, because an inline style never appears in one. Now four tokens, a real `.bottega-hero` class,
  and zero hardcoded navy outside the token line.
  **Brand Standards v2.2 -> v2.3** via `crema-std-publish`: the two text tokens and the fill variant
  added to §3.4, the Mute row **corrected** with the error named explicitly, the dark-ground reversal
  written down, and §3.5 amended so *"never introduce new colours"* records Bottega as a scoped
  exception rather than reading as a prohibition on something Steve chose. All gates pass at exit 0;
  v2.2 archived; **both companion Standards re-rendered** because their companion headers moved
  without their own versions bumping (the `f9ffcb1` blind spot); all three delivered to OneDrive and
  **md5-verified MATCH**.
  **A false alarm worth recording.** A screenshot made the home hero look broken. `.hero` proved
  **byte-identical to git HEAD** — the dark hero is the design, and the apparent breakage was a
  capture artifact. Checked before reporting, unlike the four inherited findings above.
  **DEPLOYED** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC23
  Preview" (id `152030052521`)**: `theme list` + `git log origin/main..HEAD` run **first** (no POC23,
  no duplicates, zero unpushed), validation at the documented baseline (15 offenses / 0 errors / 0
  new), then **pull-and-diff proved** the push — both sides 38 files, zero content mismatches, and the
  batch content asserted on the deployed theme. POC21, POC22 and the live theme untouched.

- 2026-08-22 — **POC24: tap targets — and the entry worth reading here is the correction, not the
  fix.** Steve asked what two carried scorecard findings meant: *"the star rating size not meeting a
  standard, and the subscription checkbox not being meta-tagged."* **I had told him both were closed.
  Only one was.** POC23 gave the checkbox an accessible name; the tap target was never touched and I
  said otherwise. He caught it by asking a question, not by checking my work — which is the wrong way
  round.
  **What the findings meant, plainly:** *"meta-tagged"* = an `<input>` has no visible text of its
  own, so a screen reader had nothing to announce; *"size"* = **WCAG 2.2 AA SC 2.5.8** requires a
  clickable target to be at least **24x24 CSS px**, and the rating link was **65x24**, scraping past
  on height with nothing spare and failing this project's own **44px** convention from POC7.
  **Measuring it took three attempts and two intermediate answers were wrong, both caught before
  anything was built on them.** (1) The first pass measured the **`<input>` rather than the target**
  and reported the contact radios as **13x13**, calling them the worst on the site; they are wrapped
  in a `<label>`, so the real region is **326x20** and the failure was 4px of height, not 11. A fix
  built on that reading would have solved nothing that was broken. (2) The second **mis-classified an
  inline link**: 2.5.8 exempts a target **inside a sentence**, and *"three-question quiz"* sits
  mid-sentence in a `div.callout`, which my `P`/`LI`/`SPAN` heuristic did not recognise. It is exempt
  and was correctly left alone. The third pass computed the effective target as the **union of the
  control and its labels** and read the surrounding sentence to classify exemptions.
  **Fixed:** `#pd-sub` **18x18 with zero labels -> 44x44** hit area and 292x44 effective; contact
  radios **20 -> 44** tall; `.back-btn` **17 -> 45** across 8 instances; `.region-learn` **15 -> 45**.
  Zero remaining below AA across 13 pages plus product detail. Mechanism is **padding plus an equal
  negative margin** (the POC13 ribbon trick), so the hit area grows at **zero layout cost** — proven
  rather than asserted, by toggling each rule back to its pre-POC24 values in the live page and
  confirming the visible text and the following content sit at the **same pixel**, 0 movement both.
  The contact radios were checked the same way and were **already stacked** one per line at both
  widths, so the min-height changed no layout.
  **One deliberate omission.** The renewal disclosure is **not** inside a label, though wrapping the
  whole block would have made the largest target on the page. Reading or selecting a legal disclosure
  should not toggle a purchase option.
  **DEPLOYED** to **"Crema Italia POC24 Preview" (id `152030183593`)**: `theme list` +
  `git log origin/main..HEAD` first, baseline validation, **pull-and-diff proved** — 38 files both
  sides, zero mismatches, batch content asserted on the deployed theme. **The store is one theme over
  the three-preview cap**: POC21's prune needs Steve's explicit go by name and id, which the deploy
  instruction did not carry.

- 2026-08-24 — **Store Operating Standards v1.15 → v1.16: two decisions that were locked on
  2026-08-23 and then never applied here. The interesting part is the shape of the failure, not
  either decision.** Raised by the coordinator, verified against live output before anything was
  touched. Both had been **agreed, written up, and logged in `DECISIONS_LOG.md`** — and neither had
  reached the Standard, so v1.15 disagreed with the project brief on shipping and **with itself** on
  freshness. A decision being *recorded* is evidently not the same as a decision being *landed*, and
  the log is not the thing that makes it true; the Standard is.
  **(1) Outbound shipping repriced (§8): free at $69+, flat $12.50 under, free tier contiguous U.S.
  only, threshold measured after discounts.** Roccia subscription shipping unchanged — free, no
  minimum. The old $55/$8.50 pair was set from USPS commercial-base cost in April 2026, i.e. as
  **cost recovery rather than as a lever**, and a 21-seller benchmark put us at the **20th percentile
  on threshold and below the median flat rate** — conceding both levers at once, which almost no
  competitor does. The Standard now says in as many words that **$12.50 is an incentive spread, not a
  pass-through**, specifically so a future reader does not "correct" it back toward carrier cost;
  that sentence exists because the number looks wrong until you know why it is not. The
  contiguous-U.S. carve-out fixes a real loss: §8 had promised the same rates across all fifty states
  and the territories, which guaranteed a loss on every 1 kg order outside the lower 48.
  **(2) Freshness values become dated declarations, and no live rule states a freshness number in
  prose — it names the token (new §5.5).** §5.4 had been applying that pattern correctly to **one**
  claim and not the others, and the others drifted: **§5's donation threshold read 60 days while
  §5.4's own table read past 150** — a ninety-day contradiction inside one document, in the section a
  reader reaches first, which survived two version bumps. Six sites corrected;
  `days_to_offerta` (retired v1.12) is now gone from every live surface, including §2.2 where it was
  still the **worked example for per-SKU overrides** — a retired field cited as the model for the
  pattern it was retired for duplicating.
  **The durable half is the classification rule, and it is mostly about what NOT to touch.** Tunable
  gates become tokens; **historical narrative, brand copy, external facts and contractual terms keep
  their literals**. Templating the history would mean the record of what changed changes whenever
  policy changes, and the roaster's 12-month sealed-bag warranty is a number a counterparty signed —
  tokenising it would be a category error. §5.5 also carries the warning in bold: **do not
  bulk-replace "60 days"**, because §3's subscriber-benefit grace is an unrelated 60 that shares the
  value by coincidence. That is the same separation Review A's A2 fix made in the theme on
  2026-08-20, now stated in the Standard rather than only in the code.
  **One thing deliberately NOT asserted.** The handoff specifies storage moving from theme settings
  to a `freshness_policy` metaobject, because `settings_data.json` does not survive a theme swap and
  this store spins up and discards preview themes routinely. **That migration is not built, so §5.4
  says the theme setting remains the operative store of record and marks the change as decided but
  pending.** Writing "held as a metaobject" would have made the Standard false on the day it
  published — the precise failure this project keeps logging. The build is §12.12 and is build-gating.
  **Three defects found while doing it that nobody had flagged.** The **footer stamp still read
  v1.14**, never bumped at v1.15, so the document's own closing line had been a version behind for two
  days. §5.4 said **"the three windows"** above a table of two, left over from `peak_flavor_days`
  being retired in v1.14. And §7's bundle-QC clause still required roast dates **"within the 60-day
  window"** — a stale pre-90 literal in a clause a 3PL would actually be held to, and the one site the
  handoff's own edit list missed. Found by grepping the vocabulary rather than the numbers, which is
  the method §5.5's lint now encodes.
  **Published via `crema-std-publish`:** source edited, §12.11 and §12.12 opened so the new
  cross-references resolve rather than dangle, three present-tense cross-refs swept (companion header,
  standards README, CLAUDE.md pointer) while the `_archive` record and §9 log entries were left
  alone as history. **Both touched sources re-rendered** — Store Operating v1.16 **and Collaboration
  v1.1**, whose companion header moved without its own version bumping, which is the `f9ffcb1` blind
  spot no version-stamp check can see. All gates pass at exit 0; v1.15 archived with a table row;
  both delivered to OneDrive `Standards\` and **md5-verified MATCH**, with the Collaboration render
  confirmed by extracted text to carry "Store Operating Standards v1.16".
  **NOT done, and the larger of the two remaining:** the **published shipping policy on
  cremaitalia.com still states $55 / $8.50** (verified by fetching the live URL, not by reading the
  admin). That is a customer-facing commitment contradicting a locked decision, and it outranks the
  document drift the coordinator actually flagged. Its source is `docs/legal/ready-to-paste.md`, which
  Steve pastes into Settings → Policies. Also still open: `docs/legal/README.md` carries the old
  figures, and the POC cart holds `FREE_SHIP_THRESHOLD = 55` plus a **bare `8.5` literal** — itself a
  build-spec §11 violation, a commercial rule shipped as a number in code.
  **[Both closed the same day.** `docs/legal/README.md` turned out **not** to need fixing on reading
  it - line 112 describes what the *now-deleted* POC shipping page contained, which is narrative, not
  a statement of policy. The POC cart was fixed in `c91ee87` and deployed as POC28, below. The
  published policy page is still outstanding and is Steve's paste.**]

- 2026-08-24 — **Steve's provisional-values rule, and it retired work I had just done - which is the
  evidence it is right.** While recording the v1.16 changes I annotated six freshness sites with
  *"Until v1.16 this read X"*, wrote *"was $55 / $8.50"* into the §8 rule statement, and framed the
  benchmark as *"we were at the 20th percentile"*. Steve stopped it: *"We're not live... why do we
  care that it was once $55? Making the change to $69 won't result in testable outcomes. Instead, if
  we indeed go live at $69 - then we'll have a data point worth retaining should we change it in the
  future."*
  **He is right, and the principle generalises past shipping: history is worth keeping when someone
  ACTED on it.** A price a customer paid is a fact you may have to answer for. A superseded draft
  nobody transacted under is just a draft. Nobody ever shipped under $55/$8.50 and no coffee was ever
  donated at 60 days, so annotating every site turned the Standard into a **narration of its own
  bugs** - and the version changelog and the archive row already carry what moved, read once, in one
  place. All of it stripped from the body; the freshness failure is now stated **once**, in §5.5, as
  the reason the rule exists rather than at every site it touches.
  **Recorded as a standing rule in three places**, weighted so it cannot be missed: a callout at the
  **top of the Store Operating Standards**, before the changelog, because it qualifies every number
  below it; **§12.13**, which is the one §12 item that **cannot close at the production build** -
  it closes in the window between build-complete and go-public; and the **CLAUDE.md pointer block**,
  which loads every session. *While we are in the POC process and before launch, every number is a
  modelling placeholder. Good enough to build and reason against; not good enough to charge money
  against. Nothing acquires authority by having been written down, versioned and rendered to a PDF.*
  **Two guardrails so it cannot be misread in either direction.** It does **not** license leaving
  contradictions in place - a value disagreeing with another value is a defect at any stage, because
  we reason against these numbers now. It **does** mean *"we already decided that"* is never an
  argument against re-examining a number before launch: the decision log records what we chose, it
  does not make the choice correct.
  **The gap this exposed is §8.3**, which did not exist. §8 stated shipping rates as if permanent,
  with **no review rule at all**, while §5.4 has explicit governance for freshness. §8.3 now sets the
  review triggers (annual carrier GRI, mid-year surcharges, 3PL change), names the **threshold** as
  the lever that moves first rather than the flat rate (threshold moves lift AOV and read as normal
  merchant variation; flat-rate moves are the visible price of shipping and cost conversion on
  exactly the small first orders we want), and records that **the exposure is weight and zone, not
  dollars** - the worst cell being a cart that *just clears* the threshold while heavy and going far.
  **And the finding underneath it, folded into §12.3:** `SKU_LAST_COST` is **inbound** landed cost -
  EUR price plus freight, tariff and handling to the warehouse. **Outbound shipping to the customer
  appears nowhere in the pricing formula**, yet we absorb it on every subscription shipment and every
  order above the threshold. The matrix does not overstate margin by a rounding error; it omits a
  cost line that scales with volume.

- 2026-08-24 — **POC28 deployed: the shipping repricing reaches the cart, and a literal that should
  never have been one.** Ledger: `docs/POC28_change_list.md`. `FREE_SHIP_THRESHOLD` moved 55 -> 69 to
  match Standard v1.16 - but **the flat rate had never been a constant at all.** It was a bare `8.5`
  sitting inline in the cart summary math, which build spec §11 prohibits. **The asymmetry is the
  lesson:** the threshold was findable by name and the flat rate was not, so a sweep for one could
  never surface the other, and the two would drift apart silently. Both are now named constants
  pointing at the Standard section that owns them, with a `PROD:` note that in production they come
  from Shopify shipping profiles rather than the theme. A `templates/index.liquid` comment naming the
  old threshold as spec-locked now names **neither** number - a comment restating a commercial rule
  is a second home for that rule.
  **Deliberately not modelled:** the contiguous-U.S. carve-out and the after-discount threshold
  basis. Both are Shopify shipping-profile and checkout behaviour the POC does not own
  (`production_build_spec.md` §0), and the POC's single unified shipping estimate is a testing aid,
  not a model of the rate engine.
  **DEPLOYED** via the `crema-poc-deploy` skill to a NEW unpublished theme **"Crema Italia POC28
  Preview" (id `152051744937`)**: `theme list` + `git log origin/main..HEAD` run **first** (no POC28
  existed, no duplicate names, zero unpushed), validation at the documented baseline (**15 offenses /
  0 errors / 0 new**), then **pull-and-diff proved** the push - both sides **38** files, zero content
  mismatches, nothing on only one side, exactly one theme of that name. The diff also asserted the
  batch content **on the deployed theme** rather than the repo: `FREE_SHIP_THRESHOLD = 69`,
  `FLAT_SHIP_RATE = 12.5`, zero occurrences of the old 55 threshold, zero bare `8.5` literals, zero
  stale `$55` comments, five policy links in `ci-footer.liquid`. Commit `c91ee87`.
  **Commit `2b80122` rode along** because `snippets/ci-footer.liquid` and `assets/crema-italia.css`
  sit in the repo root and go out with any theme push. Harmless on a preview - the POC storefront
  renders `ci-store-footer.liquid` while `ci-footer.liquid` serves `password.liquid` and
  `404.liquid`. **Its real destination is the LIVE theme and that push has NOT happened**; the
  classifier denied it this session. Deploying POC28 does not discharge it, and §10 says so.
  **Two stale state claims corrected in the same pass**, both found by doing the ritual rather than
  by looking for them: §10's own header still read **"CURRENT STATE - POC25"** three deploys later,
  and `docs/POC28_change_list.md` carried a **"Status: NOT deployed"** banner that the deploy made
  false - precisely the class of stale banner that produced the 2026-07-24 duplicate theme.
  **Coordination incident worth recording.** A concurrent Code session ran a broad `git add` at
  10:58:50 and swept this session's uncommitted Standard edits into **its** commit, `c80d3fe`, whose
  message is about the deploy skill. Nothing was lost - content intact, working tree matched HEAD,
  the render was newer than the source and still md5-matched OneDrive - but 103 lines of Store
  Operating Standards changes now sit under a commit message about something else. Already pushed and
  another session was live, so it was **not** rewritten. This is the exact hazard the 2026-07-04
  two-sessions rule names: never run broad `git add` commands that can touch files another session
  owns.

---

## 10. Open questions / TODO

**▶ CURRENT STATE — POC28 (deployed + pull-and-diff proved 2026-08-24) — read this first
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
| **Newest POC preview** | "Crema Italia POC28 Preview" | `152051744937` |
| Prior preview | "Crema Italia POC27 Preview" | `152030412969` |
| Prior preview | "Crema Italia POC26 Preview" | `152030347433` |

> **The live theme is still one scoped push behind (2026-08-24).** Commit **`2b80122`** links the
> five policies from the **coming-soon** footer, and it rode out to POC28 because
> `snippets/ci-footer.liquid` sits in the repo root - but its real destination is the **live** theme
> (`150557294761`), and that push has **not** happened. The classifier denied it on 2026-08-24 and
> it needs Steve's hands:
> `shopify theme push --theme 150557294761 --only snippets/ci-footer.liquid --only assets/crema-italia.css --allow-live`.
> Until it runs, cremaitalia.com's footer links **only** Privacy, and the other four policies are
> reachable on the real domain by typing the URL and by no other route. **Deploying a POC does not
> discharge this.**

**Scorecard: 8.3/10 as of 2026-08-22 (POC24)** — the deployed storefront has been scored six times
against one rubric: 5.4 (POC13 audit) → 6.9 (POC15) → 7.4 (POC16) → 7.9 (POC17) → 7.9 (POC20) →
**8.3 (POC24)**. Full pass: `docs/POC24_rescore.md`; series: `docs/scoring-history.md`; artifact:
https://claude.ai/code/artifact/25207561-daea-4408-aa79-f39960d65446
**The largest gain is not code** — Trust & social proof 6.5 → 7.5 because Steve published the four
legal policies, closing the item the first audit called the largest trust gap on the board.
**Two carried findings were WITHDRAWN** after being tested for the first time: the shelf/IA claim
(false — `shelf` is never a list, subscription maps exactly onto Roccia 9 of 9) and "76 div onclick
announce poorly" (false — 76 of 76 carry role + tabindex, fixed back in POC14). **The durable lesson:
the claims that survived untouched across passes were the ones nobody had ever measured.**
**Accessibility was held at 8.0 despite a clean measured surface** because one **Level A** criterion
was unmet — no skip link. **POC25 closed it.** The three remaining ceilings are photography,
a real cart, and real customers; none is code.

> **Corrected 2026-08-22.** This block said *"7.4 as of 2026-08-19"* and *"a re-score against POC17
> is the next task"* — but that re-score ran on 2026-08-20 and scored **7.9**, so the authoritative
> state block was a full pass behind, which is the exact drift class it exists to prevent. Both
> figures are now current. **Two findings are open and carried across three passes**: N4, the rating
> count link is a 65x24 tap target against this project's own 44px standard, and N5, `#pd-sub` has no
> accessible name. Neither is a regression; neither has been fixed. **Real photography is still the
> gate** on brand identity and product detail rising above 9.

**POC28 is deployed** and is the only POC28 theme - **38 files byte-match the repo**, proved by
pull-and-diff (zero content mismatches, nothing on only one side; `theme list` and
`git log origin/main..HEAD` run **first**, no collision). Validation at the documented baseline
(**15 offenses / 0 errors / 0 new**). Batch content asserted **on the deployed theme**:
`FREE_SHIP_THRESHOLD = 69`, `FLAT_SHIP_RATE = 12.5`, zero occurrences of the old 55 threshold, zero
bare `8.5` literals, zero stale `$55` comments, and five policy links in `ci-footer.liquid`.

**What POC28 is:** the v1.16 shipping repricing reaching the cart, and a literal that should never
have been one. `FREE_SHIP_THRESHOLD` moved 55 -> 69 - but the flat rate had **never been a constant
at all**, it was a bare `8.5` inline in the summary math, which is a commercial rule shipped as a
literal (build spec §11 prohibits exactly this). That asymmetry is the interesting part: the
threshold was findable by name and the flat rate was not, so a sweep for one could never surface the
other. Both are now named constants pointing at the Standard section that owns them, and a `PROD:`
note records that in production they come from Shopify shipping profiles rather than the theme. A
`templates/index.liquid` comment that named the old threshold as spec-locked now names **neither**
number - a comment restating a commercial rule is a second home for it. **Deliberately not modelled:**
the contiguous-U.S. carve-out and the after-discount threshold basis, both of which are Shopify
shipping-profile and checkout behaviour the POC does not own (`production_build_spec.md` §0). Commit
`c91ee87`; ledger `docs/POC28_change_list.md`. Commit **`2b80122`** rode along because it touches
repo-root files - harmless on a preview, since the POC storefront renders `ci-store-footer.liquid`
while `ci-footer.liquid` serves `password.liquid` and `404.liquid`.

**What POC27 was:** it is the only POC27 theme - 38 files byte-match the repo, proved by
pull-and-diff (zero content mismatches, nothing on only one side; `theme list` and
`git log origin/main..HEAD` run **first**). Batch content asserted on the deployed theme: the Sorpresa
size reads `300g`, `price_unit` is gone from all 17 products, no blurb carries a date, POC25's skip
link intact.

**What POC27 is:** the Sorpresa box gets its own unit of measure - **Steve's reframing, and it beat
the fix that was on the table**. The collection's price line read `$77.70 /3 × 100 g (3.53 oz)`:
`sizeDual()` converts each weight **token**, so it converted one bag while the box holds 300 g, and a
code comment advertised this as a feature (*"handles composite units like a collection's /3x100g"*).
At a glance it reads **$77.70 for 3.53 oz**. The proposal was to reword the conversion and delete the
note chip *"Three 100 g bags"* as a duplicate of the size selector. **Steve instead made the box's
unit of measure what the box weighs - 300 g - with the composition becoming a note about what is
inside.** Better three ways: the denominator becomes `/300 g (10.58 oz)`, **the same shape as every
other product**, not a special case; it matches the production shape, since a native bundle variant
has a weight and B2 proved that variant is real; and **the duplication dissolves rather than being
deleted** - the note was only a duplicate because the size said the same thing, so deleting it would
have removed a fact to fix a collision the right model never creates. The ambiguity is now
**structurally impossible**: with no composite unit, there is no token to pick the wrong one of.
`price_unit` went with it - a per-product denominator override present on **exactly one product of
17**, invented solely to express `/3×100g`; the `||` fallback stays in `priceCell()` with a note that
nothing sets it today, so a bug there would be silent. **The size string is a cart-matching identifier
and becomes a Shopify variant title in production**, so the change was verified by adding to cart and
confirming the line renders, not assumed. Detail: `docs/POC27_change_list.md`.

**What POC26 was:** it is the only POC26 theme - 38 files byte-match the repo, proved by
pull-and-diff (zero content mismatches, nothing on only one side; `theme list` and
`git log origin/main..HEAD` run **first**). Batch content asserted on the deployed theme: zero dates
left in any blurb, the rebase hack gone, POC25's skip link intact.

**What POC26 was:** one fixture sentence, and the contradiction it was hiding. Steve saw an ISO date on
the Offerta card in a POC24 screenshot and asked whether it was a stale inline comment. It was not -
`rebaseCatalogDates()` was deliberately string-replacing the date inside `products[12].blurb` to keep
the prose in step with the field, working exactly as built. **Three things were wrong underneath it.**
It printed **ISO**, against Standard §5.4's *"DD-MMM-YYYY wherever a date is shown to anyone"*. It
printed a roast date **at all** on an Offerta product, which **v1.13** retired in favour of a computed
band. And **the card and the detail view contradicted each other one click apart** - card *"Roasted
2026-07-21."*, detail *"Roasted between 25-MAR-2026 and 23-MAY-2026"* - the card's date being **32 days
old, inside the 90-day fresh window**, claiming an Offerta coffee was fresher than its own shelf
permits. **They could never have agreed by construction:** the band derives from **policy**,
`roast_date` from the **rebase** (freshest = 10 days old), which necessarily drags the Offerta lot into
the fresh window. **POC19 half-migrated Offerta** - the detail moved to the band, the card kept quoting
the field. **The sweep reframed the fix:** a first pass called it duplication, but **12 of 17 blurbs
restate their own notes**, so that is the *convention* - tasting notes as a sentence plus **at most one
distinguishing fact**. The blurb was correctly **shaped** and chose the wrong **kind** of fact; every
other one holds still. Four products carry no extra fact at all, so the fix needed no invented copy.
**0 of 30 cards quote a date (was 2); 0 ISO dates visible anywhere (was 1).** Detail:
`docs/POC26_change_list.md`.

**What POC25 is:** the **skip link** - WCAG 2.4.1 Bypass Blocks, **Level A**, the only Level A
criterion the storefront was known to fail and the reason Accessibility was capped at 8.0 in the POC24
re-score. A visually-hidden `Skip to content` anchor, first focusable element, targeting a permanent
`#ci-content` wrapper **rather than a `<main>`** - 19 of the 20 `<main>` elements are `display:none` at
any moment, so a link to any one of them would be dead on every other page. `position:fixed`, not
absolute, so it does not scroll away from a user who tabs to it late.
**It also caught a bug that would have shipped.** The link was first written as `class="skip-link"` -
**a class already owned by the taste quiz's skip and Back buttons.** Being later in the stylesheet, the
new rules won and gave **five quiz controls** `position:absolute; top:-4rem`, moving the hero CTA's own
navigation off screen. `theme check` passed, the JS was clean, and the skip link itself worked
perfectly; it was caught only by enumerating `.skip-link` in the live DOM and finding **six** elements
where one was expected. Renamed `.skip-to-content`, recorded at both sites. **In a 900-line stylesheet
with no naming convention, a new class name is an assertion that needs checking.** Detail:
`docs/POC25_change_list.md`.

**What POC24 was:** it is the only POC24 theme — all **38** files byte-match the repo, proved by
pull-and-diff on 2026-08-22 (both sides 38 files, zero content mismatches, nothing on only one side;
`theme list` **and** `git log origin/main..HEAD` run **before** the push). Batch content asserted on
the deployed theme.

**What POC24 was:** tap targets (commit `53afe0a`), built after Steve asked what two carried scorecard
findings actually meant — **and after I told him both were closed when only one was.** POC23 fixed
the checkbox's accessible name; the tap target was never touched. **Every interactive control now
meets this project's 44px convention**, against WCAG 2.2 AA's 24x24 floor: `#pd-sub` **18x18 -> 44x44**
(and it had **zero labels**), contact radios **20 -> 44** tall, `.back-btn` **17 -> 45** across 8
instances, `.region-learn` **15 -> 45**. Zero remaining below AA across 13 pages plus product detail.
**Measuring it correctly took three attempts and two intermediate answers were wrong** — the first
measured the `<input>` rather than the target and reported the contact radios as 13x13 when their
wrapping `<label>` makes them **326x20**; the second mis-classified *"three-question quiz"*, which
sits mid-sentence and is **exempt** under 2.5.8's inline exception, as a failure. Both were caught
before anything was built on them. The fixes use **padding plus an equal negative margin** (the POC13
ribbon trick) so the hit area grows at **zero layout cost**, proven by toggling each rule back to its
pre-POC24 values in the live page and confirming the visible text and following content sit at the
**same pixel**, 0 movement. **The renewal disclosure is deliberately NOT inside a label** — wrapping
the whole block would make reading or selecting the legal text toggle a purchase option. Detail:
`docs/POC24_change_list.md`.

**What POC23 was:** it is the only POC23 theme — all **38** files byte-match the repo, proved by
pull-and-diff on 2026-08-22 (both sides 38 files, zero content mismatches, nothing on only one side;
`theme list` **and** `git log origin/main..HEAD` were run **before** the push). The diff asserted the
batch content on the deployed theme: 34 `--ci-crema-text` uses, 4 `--ci-bottega-*` uses,
`aria-describedby`/`aria-hidden` present, and **zero hardcoded navy** left in the Liquid.

**What POC23 was:** the answer to a standing scorecard item Steve challenged — *"semantic markup where
it claims that elements announce poorly, and we have not run an end-to-end screen-reader"* (commit
`2c08080`). Testing it split the claim in half. **The semantic-markup half was largely false:** 83 of
83 non-semantic clickables already carry `role="button"` and `tabindex` and 82 of 83 have an
accessible name, because POC14 fixed it — the finding predates POC14 and had been inherited four
passes without re-testing. **The contrast half was true and had never been measured.** A 16-page
audit found **17 failing combinations across 127 rendered instances**, now **zero**. Two colours
explained all of it, and **Brand Standards had already predicted one and sanctioned the other** — it
recorded Crema Gold as large-display-only and the site used it for 12px eyebrows anyway, while
listing Mute at 3.7:1 as fit for *"captions / fine print"*, which are exactly the sizes it fails at.
Fixed with **darkened siblings** (`--ci-crema-text` `#94693A`, `--ci-mute-text` `#7D705E`, plus fill
variants), leaving `--ci-crema` and `--ci-mute` untouched wherever they already pass at 3:1.
**The trap, which this batch fell into and climbed out of:** a darker token raises contrast on cream
and *lowers* it on brown — darkening `.inline-link` globally drove "See the map" on the Espresso hero
from 3.40 to **2.31**, a regression caused by the fix and caught only because the audit was re-run
rather than assumed. Dark grounds now correct the other way, toward `--ci-crema-light`.
Two accessibility fixes: **`#pd-sub` had no accessible name at all** — the only unnamed control on
the site, and the one where it mattered most, since POC22 had just placed a legally-required renewal
disclosure beside it; it now takes `aria-labelledby` **and `aria-describedby` pointing at the renewal
terms**, so the disclosure is announced *with* the control. And the rating stars are now genuinely
decorative (`aria-hidden` + a labelled `role="group"`), which is what licenses their deliberate
sub-AA contrast — the empty star stays at the hairline value so an unrated coffee reads as a **null,
not a zero-out-of-five verdict**. **A code comment nearly shipped a false claim** that the stars were
already `aria-hidden`; checking turned it into a real fix. **Bottega's slate scheme is now sanctioned
rather than drifting** (Steve): it lived as an *inline style* plus two hardcoded values — one idea,
three homes, no token, which is exactly how a non-palette colour escapes a stylesheet audit — and is
now four tokens, a real `.bottega-hero` class, and **Brand Standards v2.3**. Detail:
`docs/POC23_change_list.md`.

**What POC22 was:** it is the only POC22 theme — all **38** files byte-match the repo, proved by
pull-and-diff on 2026-08-22 (both sides 38 files, zero content mismatches, nothing present on only
one side; `theme list` **and** `git log origin/main..HEAD` were run **before** the push, confirming no
name collision). The diff also asserted the batch content **on the deployed theme rather than the
repo**: four policy links in the footer, the `sub-renewal` disclosure present in the JS, and zero
occurrences of the removed `page-shipping`. The repo is fully pushed to GitHub, so nothing is
local-only, and **the repo and this theme are in step**.

**What POC22 was:** the two consequences of the four Shopify policies going live the same day
(commit `e63d9c4`). **(1) The footer links them.** Nothing on the storefront did — Shopify links
policies from the **checkout** footer automatically, but a customer deciding whether to trust the
store never reaches checkout. `Shipping` and `Returns` joined the main list; `Terms` and `Privacy`
sit quietly beneath the company line. A single **"Legal notices"** link was considered and rejected:
`/policies` and its variants all **404**, so there is no destination without building a third home
for the content; the label would collide with the Shopify *Legal notice* slot we deliberately left
unset (the EU Impressum field); and Shipping and Returns are **purchase content**, so filing them
under "Legal" would bury the two best pre-purchase reassurances on the site. The change also
**removed a duplication rather than adding one** — `#page-shipping` was a 417-character condensed
paraphrase of the published shipping policy and is deleted. **(2) The automatic-renewal disclosure
now sits where consent is given.** `v2-deltas.md` B1 specified two placements and only the Terms page
had shipped; the toggle copy was merchandising that never said the card is charged **again,
automatically**, at what frequency, or at what amount — and `#pd-cadence` computes `display:none`
until the box is ticked, so the frequency was **absent from the screen at the moment of the
affirmative act**. It is set at the **same size as the benefit line and must stay that way**: small
print under a subscribe toggle is exactly what "clear and conspicuous" exists to defeat, which makes
this one of the few places where the brand's quiet-and-small reflex is wrong. Commented at both the
render site and the style site. Detail: `docs/POC22_change_list.md`.

**What POC21 was:** the hero rewrite (commit `69e6296`). Three declarative lines replacing a two-line
H1 and a 180-character sub-line that had a **dangling modifier** - *"From a small, named group of
artisan Italian roasters, air-freighted whole-bean so it reaches you..."* never supplied a subject for
*air-freighted*. The old promise, *"weeks from the roast date, not months"*, was also **not reliably
true**: a bag listed at two weeks and bought at day eighty reaches that customer at twelve weeks, which
the 90-day window permits. It now states the gate we enforce, in **settings rather than literals** -
*most bags sell within 14 to `{{ freshness_window_days }}` days of roasting, and none after
`{{ offerta_fresh_days }}`* - and puts the donation pledge in the hero, naming Feeding Tampa Bay.
**Line 2 says "roasted in Italy", not "Italian roasters"**, because US companies sell Italian roasts
without being roasters in Italy: a place cannot be borrowed, a style can. That choice also freed line 1
from the word *Italian*, which took the binding line from 18.159x to 15.126x and bought **18.4px ->
21.3px at 375** - the difference between a headline and a second paragraph. Detail:
`docs/POC21_change_list.md`.

**What POC20 is:** POC19 plus one data-only commit, `ee1fa66` — the fixture brewing notes. All 13
fixture coffees had the store-wide whole-bean policy pasted onto the end of a genuinely per-coffee
brewing hint, so every product page told the customer to grind fresh twice. Trimmed to the part that
actually varies ("Reserve it for pour-over, where the florals carry"). **No template, JS, CSS or
snippet changed**, so the reviewable surface is product-page copy only. Steve's framing is the
durable part: *our test data was wrong, not the feature* — it was neither a copy convention nor a
feature defect, but badly authored fixture data, and the build spec row that had transcribed the
defect into the production schema was corrected in the same commit.

**Preview link and refresh command: take the id from the table at the top of this block, never from
here.** This paragraph used to hardcode them, and it went stale the moment the theme it named was
pruned — twice. Open the preview in a **real browser**; a `curl` of a `preview_theme_id` link is NOT
a valid check (see §9 2026-07-06). Refresh with `shopify theme push --theme <id from the table>`.

**Only POC25, POC26 and POC27 previews now exist** - at the three-newest cap, enforced as
`crema-poc-deploy` Step 5. **POC24 (`152030183593`) and POC23 (`152030052521`) were deleted
2026-08-22** on Steve's explicit go, both ids/names/roles re-verified against a live
`theme list --json` in the same breath as the delete; their batches are commits `53afe0a` and
`2c08080` and both are redeployable. **POC24 is the theme the 8.3 score was measured against**, and
`docs/POC24_rescore.md` still names its id - that is provenance, not a live claim: a scoring report
has to say what it scored, so the sweep correctly left it. Earlier: **POC22, POC23 and POC24 existed** - at the three-newest cap, enforced as
`crema-poc-deploy` Step 5. **POC22 (`152029757609`) was deleted 2026-08-22** on Steve's explicit go,
id/name/role re-verified against a live `theme list --json` in the same breath as the delete; its batch
is commit `e63d9c4` and it is redeployable. The Step 6.4 sweep found one surviving reference, a §9 line
in past tense describing the day it shipped - narrative, left alone.
Earlier: **POC21 was deleted** - at the three-newest cap Steve set on
2026-08-06, enforced as `crema-poc-deploy` Step 5. **POC21 (`152029167785`) was deleted 2026-08-22**
on Steve's explicit go, id/name/role re-verified against a live `theme list --json` in the same
breath as the delete; its batch is commit `69e6296` and it is redeployable. **POC20 (`152028446889`)
was deleted 2026-08-22** on Steve's
explicit go, id/name/role re-verified against a live `theme list --json` in the same breath as the
delete and after the POC23 push was proven; its batch is commit `ee1fa66` and it is redeployable.
Earlier the same day: **POC19 (`152017764521`) was deleted** on Steve's
explicit go, id/name/role re-verified against a live `theme list --json` in the same breath as the
delete and the delete run **after** the POC22 push was proven by pull-and-diff; its batch is commit
`502b885` on `origin/main` and redeployable. The Step 6.4 sweep found exactly one surviving reference
to the dead id, a §9 line in past tense describing the day it was deployed — narrative, which is
*supposed* to name a dead id, so it was left alone. Earlier the same day: **POC18 (`152016912553`)
was deleted**, id/name/role re-verified the same way; and **POC17
(`152003018921`)**, after computing the keep/prune split from a live `theme list --json` rather than by eye
and re-verifying its id, name and role immediately before the delete; its batch is commits
`318ea7e`..`5e71413`, on `origin/main`, so it is redeployable. The delete ran **after** the POC20 push
was proven by pull-and-diff, per the skill — never remove a preview until its replacement exists.
Earlier deletions: POC16 (`151983030441`) on 2026-08-21; POC15 (`151970840745`) on 2026-08-21; POC14 (`151800610985`) on 2026-08-20; POC12
(`151798841513`) on 2026-08-19; POC11 (`151797727401`) and POC13 on 2026-08-18; POC10 (`151624024233`)
and POC4–POC9 on 2026-08-06; the erroneous POC9 duplicate `151615373481` on 2026-07-25.

**What POC19 was:** the freshness copy pass (commit `502b885`), built against Standards **v1.13 and
v1.14**, which were amended *first* so the build could not contradict them. Offerta shows a **computed
band** — *"Roasted between 24-MAR-2026 and 22-MAY-2026"* — rather than a roast date, because an Offerta
product can hold more than one lot on a slow mover and a single date is only mostly honest. Main
shelves read *"These beans are within our best-freshness window of 90 days."* **`peak_flavor_days` is
retired** from all four places it lived: the other windows are gates we enforce, that one was advice
about behaviour we do not control. Its message merged into the whole-bean sentence, counting **from
receiving** rather than from roast. `freshness_remaining` retired with its consumers; Offerta cards now
say only *"Sold as-is"*. Detail: `docs/POC19_change_list.md`.

**Two copy questions left open deliberately**, both surfaced by looking at the rendered result: the
coffee **card** still says *"Best within 90 days of roast"* while the detail page uses the new wording,
and the catalogue's per-product **brewing note** still says *"We sell whole bean only - grind fresh
just before you brew"*, a third overlapping grind statement one layer down from the one just merged.
Neither is a defect; both are Steve's copy to decide.

**Staged but NOT built: `docs/POC19_change_list.md`** — three display changes Steve staged while
reviewing POC18. Two of them orphan a setting or a field that POC18 introduced, and one **reverses**
Standard §5.4's rule that Offerta shows an actual date, so it needs a **v1.13 amendment first**.

**What POC17 is:** POC16 plus the trust & social-proof work — the decision, the platform test that
grounded it, and the build (5 commits, `318ea7e`..`5e71413`). It closes the last open dimension on
the scorecard, which had scored **3.5 in all three passes** and never moved. Eight decisions from
Steve are recorded as **Store Operating Standards §13** (published across v1.8/v1.9/v1.10): reviews
are **purchase-gated only** via emailed per-order links with the public form disabled; the rating is
a **bespoke control of our own design** — stars plus a numeral, rounding to whole stars because the
numeral carries the precision — that renders on the **detail view of a purchasable product only**
and **never in a grid**; empty stars sit at the hairline value so a null reads as a null rather than
a zero; everything but abusive content is published, with *abusive* defined; **no photograph
reviews**; `aggregateRating` in production, now **measured rather than assumed**; and reorder rate
built with its floor as a named constant and **silence below it**. **Bottega is its own rating
context** (§13.5.2) — rated, because a grinder is good or bad for everyone, but never given a
reorder rate, because nobody rebuys a grinder. Fixture ratings live under a **`poc_rating`** key,
deliberately not the production `reviews.` namespace, so one grep finds everything that must go.
Build technique is in `docs/production_build_spec.md` §6.1; §9.2's deferred `aggregateRating`
question is closed. Detail: §9 2026-08-20.

**What POC16 is:** POC15 plus the fixes its re-score produced, and a run of vocabulary and
data-model corrections Steve raised while reviewing (12 commits, `5812884`..`203b23c`). Headlines:
**"Tour" is a SKU name, not a site term** — the word had spread across the storefront, the Standard
and the build spec as though it were the category, quietly narrowing the Sorpresa shelf to one kind
of product; the archetype is a **collection**, and it is now a "Never" in §6. **Sorpresa renders
from the catalog** like every other shelf, replacing a hard-coded block that named one fixture SKU,
its price and its components. **One description per shelf** — the Shop gloss was a parallel table
that had drifted from all four shelf pages, and now reads each page's own description. **Gifting**
arrived as an order-level cart option, blocked on any subscription line. The hero H1 holds **two
lines at every phone width** via fluid sizing rather than a value tuned at one width, and **Shop +
cart now sit above the fold on mobile**, closing the half of the first audit's central finding that
POC14 left open. Also: five unlabelled sign-in inputs fixed, the Bottega link points at the shelf
rather than a fixture SKU, and the **meta description moved out of the Shopify admin into the
theme** after it was found reading "curated *italian* roasted coffee only found here" behind the
coming-soon page's hardcoded override. Standards moved **v1.3 → v1.6** across three publishes.
Detail: `docs/POC16_change_list.md`.

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

**Brand (current — Brand Standards v2.3; artist rebrand 2026-07-01 palette/type, no-em-dash
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

> **▶ THE LIVE OPEN-ITEMS LIST IS NOT HERE (Steve, 2026-08-22).** It is the **Decisions**
> sheet of `Operations\In USA\shopify\Systems\Systems Inventory.xlsx` (OneDrive) — filter
> **State** for `OPEN`, `GAP`, `CHANGING` or `SCHEDULED`. That sheet carries **Owner**,
> **Next action** and **By when** for every live item; this file carries none of those and
> never will.
>
> **Everything below this line is retained as CONTEXT AND HISTORY — the reasoning, the
> measurements, and why each item exists.** It is genuinely useful and it is why the items
> are understandable at all. But **do not read an item's STATE from here.** A checkbox in
> this file records what was true when someone typed it; the sheet records what is true now.
>
> **This exists because open items had three homes** — this section, the Decisions sheet,
> and the follow-ups inside `Coordination\DECISIONS_LOG.md` entries — and state drifted
> between them. Proven the same day: the `info@` / `support@` mailbox item sat OPEN and
> launch-blocking in this very section while both mailboxes already existed, one of them
> since June. Same repair already made twice at document level (the brief's §12 on
> 2026-07-14, its §10 today), now applied to the list of open items itself.
>
> **When you close something, close it in the sheet.** If you also want the narrative here
> corrected, correct it — but the sheet is what another person reads.

**▶ PRE-PRODUCTION PLATFORM SPIKE — RUN AND CLOSED 2026-08-21 (added 2026-07-24).**
These were never decisions; they were unverified assumptions about how Shopify actually behaves,
and each one, if wrong, forces a spec revision mid-build. **All six items are now answered.** Two
were settled by the platform itself on 2026-07-25; the remaining four were researched on 2026-08-21
and written up in `docs/production_build_spec.md` §5.1, §5.2 and §7.1. **Three de-risks and one
architectural break:** customer-account UI extensions run on all plans, Functions are not
plan-gated, and native Bundles covers what a paid bundle app would - but **discount Functions do not
re-run on recurring orders**, so entitlement cannot be Function-owned as Standard §11 specifies.
That last one is the only item still carrying an action, and it needs Loop's answers before Steve
decides. Full context in the §9 2026-07-24 and 2026-08-21 entries.
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
- [~] **Loop × Shopify Functions discount interplay — RESEARCHED 2026-08-21, see
  `docs/production_build_spec.md` §5.2. It is worse than stacking and it changes the architecture.**
  Two findings. (1) A **selling-plan discount is a price adjustment, not a discount** — it changes the
  line price before any discount is evaluated, so Functions and codes compound *on top of it*. `MAX`
  holds among Function/code discounts (Shopify already applies only the largest product discount per
  line off Plus, which gives §3's rule for free) but a selling plan sits outside that contest.
  (2) **Discount Functions are not re-run on recurring orders** — the rate is snapshotted onto the
  subscription contract at signup and orders 2..n bill from it. **So a Function cannot own entitlement,
  which is what Standard §11 specifies.** It breaks the durable Founding Member model (§4): someone who
  subscribes at 10% and later becomes a founder would keep 10% forever, because nothing re-evaluates.
  The rate must live on the **contract**, which makes it **Loop's** job, and shrinks the Function to
  campaign discounts on one-time purchases.
  **TESTED 2026-08-21 on a real order — see §5.2.2. Finding 1 CONFIRMED, Finding 2 confirmed
  structurally, and three of the four Loop questions answered without asking.** Order #1001 billed a
  $24.95 base at **$21.96** with **no discount line anywhere on the order**, and the contract stores
  `Base price / Subscription discount 12.00% / Plan` as its own fields with five future orders
  pre-scheduled. **The rate is contract state, not a rule evaluated per order.**
  **Two consequences.** (1) **The subscriber benefit is invisible on the Shopify order** — the
  confirmation email will just show a lower price, Shopify's discount analytics will report zero
  discounts on subscriptions, and if we want the customer to see the benefit the theme must render it
  itself. (2) **The $99-vs-$399 fork dissolves:** contract discount rates are editable **in the Loop
  admin on the FREE tier**, so promoting a founder is a thirty-second admin edit, not an API call.
  Pro is not needed and **Starter stands**.
  **[SUPERSEDED 2026-08-22 - see the correction directly below.]** ONE question left: does a Shopify discount Function
  **compound** with the selling-plan adjustment on the first order? Cannot be answered by inspection —
  needs a Function deployed and a second test order. Given Finding 1 the expectation is yes, because
  the Function sees $21.96 as the line price. **Until it is answered, the subscriber rate must live in
  the selling plan OR in a Function, never both**, or a founder gets 12% off a price already 12% off.
  Standard §11/§12.8 still need Steve's decision on which system owns the rule.
  **THAT LAST QUESTION IS NOW ANSWERED — 2026-08-22, see `docs/production_build_spec.md` §5.2.3 and
  Round 2 item A1 below. They DO compound**, observed on the dev store: a Function's 10% came off
  Loop's already-reduced $21.96 and billed $19.77, an effective 20.76%, and setting `combinesWith` to
  false on all three classes did not prevent it. **The either/or framing above is superseded**, and in
  the customer's favour: the Function can see the subscription line (`sellingPlanAllocation`) and is
  handed the pre-plan base price (`compareAtAmountPerQuantity`), so it can apply a **top-up to `MAX`**
  rather than being excluded from subscription lines outright. Standard §11/§12.8 still need Steve's
  decision on which system owns the rule (item A2).

- [x] ~~**CHOOSE: new vs legacy Shopify customer accounts.**~~ **NOT A CHOICE — settled by the
  platform, verified 2026-07-25.** A store created today runs **new customer accounts only**;
  Settings → Customer accounts offers Configurations / Authentication / returns / store credit /
  URL, and **no classic option anywhere** (Authentication is just Shop / Google / Facebook sign-in).
  `/account` and `/account/login` **redirect off-domain** to `shopify.com/<store-id>/account`, so
  **the theme renders none of the account experience.**
- [x] ~~**SCOPE what customer-account UI extensions can actually do.**~~ **DONE 2026-08-21 — see
  `docs/production_build_spec.md` §5.1.** The headline is a de-risk: **they work on all plans, not
  just Plus**, so the account experience is buildable on Grow and this does not push the plan
  decision. Full-page extensions exist and the merchant can link to one from the account header, so
  the POC's account page has a home. Extensions can **read and write customer metafields**, which
  confirms the taste-profile-as-customer-metafield requirement in §6.1 is the natural mechanism, not
  a workaround. They can call our own backend with `network_access`.
  **The cost is brand, not function.** No custom CSS, no arbitrary HTML, no custom fonts inside an
  extension - only Shopify's component library, which "will always render the merchant's own
  branding". We control logo, colours and typography through the shared checkout/accounts branding
  configuration, so the page wears our palette and logo but not the storefront's typography, spacing
  or composition. The POC's account *information architecture* and copy survive; its visual design
  does not. Business rules are untouched (Standard §3.1/§4).
  **One two-minute check left for Steve:** whether the branding editor offers Marcellus. Settings →
  Checkout → Configurations → Edit on the dev store.

- [x] ~~**EVALUATE: a bundle app against Standard §7's BOM requirements.**~~ **DONE 2026-08-21 —
  `docs/production_build_spec.md` §7.1. Use Shopify's own Bundles app; do not buy a third-party one.**
  Third-party bundle apps earn their fee on mix-and-match, build-your-own, volume discounts and BOGO,
  none of which we need — a Sorpresa collection is a **fixed** set of components we choose. Native
  covers admin management and component stock; its limits (100 variants, 30 products, 3 options) are
  nowhere near binding on a handful of components. **The two requirements no app satisfies are ours
  either way** — component-derived facets, and availability gated on component **freshness** — so a
  paid app buys nothing we lack. **One ten-minute dev-store check before relying on it:** sources
  conflict on whether native bundles decrement component inventory, so build a two-component bundle,
  place a test order, and watch whether component stock moves.

- [x] ~~**CHOOSE a Shopify plan.**~~ **RESEARCHED 2026-08-21 — recommendation: Grow, billed
  annually ($79/mo; $105 monthly). Steve's call to confirm.** 2026 pricing: Basic $29/39, Grow
  $79/105, Advanced $299/399, Plus from $2,300. (The "Shopify" plan was renamed **Grow** in 2026 —
  same plan.)
  **Basic is disqualified, not merely tight: it includes ZERO staff accounts** — the owner is the only
  login — and the team is Steve plus Lucia, Asia and Lauren. Grow allows 5.
  **Nothing in the design needs more than Grow.** Shopify Functions run on all plans; customer-account
  UI extensions run on all plans (§5.1); checkout extensibility is the only Plus-gated thing we wanted
  and was already declined in Standard v1.3 at ~$24k/yr for one hidden field.
  **Loop is the larger platform cost and had never been priced** — see `production_build_spec.md`
  §5.2.1. Loop **Starter is $99/mo + 1.0% per transaction**, so the real monthly floor is **$178/mo
  before card fees, and 3.7% all-in on every subscription order**. Loop's **Free Forever** tier (50
  active subscriptions) is enough to *test* the design but not to *run* it: **dunning management,
  cancellation flows and the branded portal are all Starter**, and all three are named commitments in
  Standard §4. Bears on the §12.3 pricing-matrix validation, which has never been checked against a
  3.7% rate.
  **CORRECTION to the 2026-07-24 §9 entry**, which said Advanced pays for itself "around $70–80k/yr
  revenue". The arithmetic does not support that. Advanced costs **$220/mo more** than Grow and saves
  **0.2pp** on card rate (2.5% vs 2.7%), so break-even is `0.002 × R = 220`, i.e. **~$110k per month —
  about $1.3M a year.** The old figure was out by more than an order of magnitude. Revisit Advanced at
  seven figures, not before.

**▶ PLATFORM VALIDATION ROUND 2 — assumptions we have WRITTEN DOWN but never OBSERVED
(opened 2026-08-22).** Round 1 (above) is closed. What remains is a different category: places where
the spec asserts how Shopify, Loop or an app behaves, and nobody has watched it happen on a store.
Round 1's value was that **three of its six items changed on contact with a live store**, so treat
every line here as unproven until a screenshot says otherwise. The dev store
`crema-italia-development` is the lab and is free; see the 2026-08-21 entries in §9.

*Ordered. **A1, A1-residual, A2, B2, C2 and C3 are DONE (2026-08-22)**; **A3 is measured** and **C1/C4 part-answered**; **B1** needs one UI look and **C5** cannot be closed in a sitting. A2 was decided by Steve and published as Store Operating Standards **v1.15**. NOTE: the A1 probe discount was set to EXPIRED on 2026-08-22 before B2 ran, so the dev store is clean; re-enable it (`discountAutomaticAppUpdate`, clear `endsAt`) only for the A1-residual order test.*

- [x] ~~**A1 — Does a discount Function COMPOUND with the selling-plan price adjustment?**~~ **RUN AND
  ANSWERED 2026-08-22 — YES, they compound. See `docs/production_build_spec.md` §5.2.3.** A Discount
  Function was built, deployed to the dev store and driven through a real storefront cart and checkout.
  Same $24.95 variant, twice: on Loop's 12% *Founder Subscription* plan the Function's 10% came off the
  **already-reduced $21.96**, billing **$19.77** — an effective **20.76%**; the one-time control billed
  $22.46, a clean 10%. **`combinesWith` was set to false on all three classes and it made no
  difference**, because a selling-plan adjustment is not a discount and never enters the combination
  contest. So a founder would get 12% off a price that is already 12% off.
  **The fix exists and is cheap:** the Function *can* see the subscription (`sellingPlanAllocation` is
  non-null), so it can decline the line — either declaratively via `appliesOnSubscription: false`, or in
  code. **And it need not be all-or-nothing:** on a subscription line Shopify also hands over
  `compareAtAmountPerQuantity` = the **pre-plan base price** ($24.95; it is null on a one-time line), so
  the Function can compute a **top-up to `MAX`** — discount only the gap between the plan's price and
  the best rate the customer qualifies for. That preserves §3 exactly, with the plan owning the floor
  and the Function owning the difference. Recommendation only; the decision is A2.
- [x] ~~**Standard §12.7 — can a discount Function read customer tags/metafields?**~~ **ANSWERED
  2026-08-22: YES, both.** Settled as a by-product of A1 (it is not a Round 2 line item, but the whole
  §11 engine assumes it and it had been open since 2026-07-25). At checkout the Function read
  `hasAnyTag`, `hasTags`, `numberOfOrders` and a **custom-namespace** customer metafield
  (`crema_italia.tier`) — the metafield needing **no definition and no access grant**. Two caveats worth
  more than the answer: the customer object is **null in the cart** and populated only at **checkout**;
  and **tags propagate late while metafields are immediate** — written in one mutation, the metafield
  was readable on the next page load and the tags took a couple of minutes. Anything that must bite
  immediately (a resume restoring benefits, a win-back window opening) should be a **metafield, not a
  tag**. **Standard §12.7 not yet amended — Steve's call, per the publish ritual.**
- [x] ~~**A1-residual — inspect a real contract with a Function discount live.**~~ **DONE 2026-08-22,
  and it CORRECTED an earlier claim in this same block. See `docs/production_build_spec.md` §5.2.3.**
  Steve completed the checkout (card entry is a cross-origin iframe and cannot be scripted), producing
  order **#1002** and Loop contract **#15302394080**. **The Function's discount IS snapshotted onto the
  subscription contract** and does reach recurring orders — the contract carries `Subscription discount
  12.00%` (the plan) *and* our Function as a contract-level discount with `Usage count: 1, Usage limit:
  12`, the limit being exactly the `recurringCycleLimit: 12` that was set.
  **The claim it corrects:** the checkout's `Recurring subtotal $21.96 every 4 weeks` was read this
  morning as "the Function's 10% is not in the renewal price". It is a **projection that excludes
  contract-level discounts**, and the contract says renewals bill **$19.77**. Trust the contract.
  **`recurringCycleLimit` is the control:** `1` = first order only (**the default when omitted**), `N`
  = the first N cycles, **`0` = indefinitely**.
  **What it does not change:** the discount is still a **snapshot taken at signup**, so a customer
  promoted to founder later is never re-evaluated and a standing-rate change never reaches an existing
  contract. **Entitlement is contract state, not computed state** — Finding 2's conclusion stands.
  **What it does change is the danger:** left applying to subscription lines with `recurringCycleLimit:
  0`, the 20.76% compounding is **permanent on every renewal**, not a first-order slip.
  **And it hands §3 a clean mechanism:** a campaign top-up on a subscription signup should be one-time,
  and `recurringCycleLimit: 1` is exactly that, declaratively, with no code.
- [x] ~~**A2 — Then amend Standard §11/§12.8.**~~ **DECIDED BY STEVE 2026-08-22 and PUBLISHED as Store
  Operating Standards v1.15.** Option 1, designed for Option 3: the **Loop selling plan owns
  subscription lines** (founder 12% / subscriber 10% as two plans; promotion = migrating a contract by
  hand on Loop's free tier, bounded by §4's 222 cap), a **Function owns one-time lines**, and
  **`appliesOnSubscription: false`** is the guard. **§12.7 closed verified-yes; §12.8 closed answered.**
  One gap accepted knowingly: the **win-back 15%** is the only campaign that could out-rank the standing
  rate on a subscription line, and under this model it cannot. The remedy is designed and unbuilt - the
  Function is handed `compareAtAmountPerQuantity` (pre-plan base price, null on one-time lines) so it can
  discount only the gap up to `MAX`, with `recurringCycleLimit: 1` making it one-time. Build it if
  win-back re-subscribes matter commercially.
- [~] **A3 — The subscriber benefit is INVISIBLE on a Shopify order. PROVEN FROM BOTH SIDES 2026-08-22**
  on two orders differing in exactly one way. #1001 (plan only): the line's "original" price is already
  the reduced $21.96, `totalDiscounts` **$0.00**, `discountApplications` **empty**. #1002 (plan +
  Function): same $21.96 original, discounted to **$19.77**, `totalDiscounts` **$2.19**, and a proper
  `AutomaticDiscountApplication` carrying the percentage and message. **The plan's 12% leaves no trace
  at all** - the order cannot even be used to reconstruct it, because the line's own original price is
  already post-adjustment. **Still Steve's decision:** whether the theme renders "Founding Member 12%"
  itself from base-vs-plan price. The reporting consequence is now confirmed rather than predicted - if
  the rate lives on the plan, **Shopify's discount analytics report zero discounts for the entire
  subscriber programme**.
- [~] **B1 — Does the accounts/checkout branding editor offer Marcellus? PART-ANSWERED 2026-08-22, see
  `docs/production_build_spec.md` §5.1.1.** Two findings bigger than the question. (1) **Checkout and
  customer accounts are now ONE configuration and it exists on a Basic-plan store** — the settings page
  carries a "Configurations · Customize checkout and customer accounts" card opening a Checkout Editor
  (`/settings/checkout/editor/profiles/5265129696`), and the Admin API has replaced `checkoutProfiles`
  with `checkoutAndAccountsConfiguration(s)`. The dev store reports `shopifyPlus: false`, so this
  surface is **not Plus-only** — a second, independent corroboration of §5.1's de-risk. (2) **Custom
  uploaded fonts are in the data model**: a font group is either a Shopify font handle *or* a
  `customFontGroup` carrying an uploaded font file (`genericFileId`). If branding is writable on our
  plan then **Marcellus is moot — we would upload it** (open licence, TTF already in the repo), and the
  account surface would match the storefront on type, which is **better than §5.1 assumed**.
  **Unresolved:** reading the `branding` sub-field returns `ACCESS_DENIED` to an app holding both
  `read_/write_checkout_branding_settings`. Either a third scope is needed (the parent field needed
  `read_checkout_and_accounts_configurations`, a name found only by trying it) or `branding` is
  Plus-gated. **Near-miss worth noting: this was one sentence from being written up as "Plus-only" when
  the first denial was actually a scope name.** Closing it is still the original two minutes **with the
  Browser pane displayed** — the editor renders as a canvas and cannot be read from the DOM.
- [x] ~~**B2 — Do native Bundles decrement COMPONENT inventory?**~~ **ANSWERED 2026-08-22 — better than
  decrement. See `docs/production_build_spec.md` §7.1.1. The §7.1 recommendation stands.** Built
  headlessly via `productBundleCreate` (the native API the Bundles app drives), so this tests the
  platform, not one app's UI. A bundle of **1 x A + 2 x B**, components at 100 each, reported sellable
  **50**; dropping component B to 10 moved it to **5**. That is `min(floor(stock / qty))` across
  components, honouring per-component quantity — exactly Standard §7's "availability auto-gates on
  component stock", delivered natively. **The bundle holds no stock of its own.** Three details:
  recomputation is **asynchronous** (~6s still stale, settled by ~20s), so a brief oversell window
  exists; the bundle variant is priced as the **sum of its components** and created **DRAFT**, so §2.3
  collection pricing is an override of a default rather than a blank field; and `inventoryQuantity` and
  `sellableOnlineQuantity` agree.
  **Unlooked-for finding: the Admin API refuses to sell a bundle.** `orderCreate` fails with *"Line
  items variant cannot be a variant with components"*. So **a Sorpresa collection cannot go on a
  manually created or API-created order** — replacements, goodwill re-sends, wholesale, imports and
  migration scripts all hit this, and the workaround (ordering components individually) means the
  replacement will not read as a Sorpresa in reporting. **Check whether the admin's own "Create order"
  UI and `draftOrderCreate` are refused the same way** before designing a customer-service flow.
  **Not observed:** that a completed storefront order decrements component stock — near-certain, since
  the bundle has no stock to decrement, but `orderCreate` is refused and a storefront checkout needs
  card entry in a cross-origin iframe. Same blocker as A1-residual; closable in the same sitting.
- [~] **C1 — Build one customer-account UI extension and look at it. BUILT AND DEPLOYED 2026-08-22;
  the looking still needs a person.** See `docs/production_build_spec.md` §16.3.
  **`customer-account.page.render` is a real target and deploys on this plan**, confirming §5.1 from the
  build side. **Constraint found via a deploy failure:** it *"cannot be combined with any other
  targets"* - a full-page extension is **exclusive**, so the POC account page is one extension and
  anything on Shopify's native order/profile pages must be separate ones. **Not seen:** the rendered
  component library in our palette (new customer accounts sign in by emailed code, so it cannot be
  scripted). **De-risked anyway:** Admin `metafieldsSet` writes customer metafields with no definition
  and no access grant, so **extension -> `network_access` -> our backend -> Admin API** is a certain
  path for the §6.1 taste profile.
- [x] ~~**C2 — Stand up the roaster metaobject definition (§13.4) on the dev store.**~~ **DONE
  2026-08-22, end to end. See §16.1.** All four capabilities enabled on a Basic-plan store
  (`publishable`, `onlineStore`, `renderable`, `translatable`). **The §13.4.2 draft trap is real and
  worse than described:** a DRAFT entry does not merely resolve to `nil` - the collection reports
  **size zero** and the loop body never runs, so a "for each roaster" page renders empty with no error.
  ACTIVE flipped it to 1. `onlineStore` gave a genuine native URL (`/pages/roasters/gardelli-probe`).
  The staged image chain ran end to end - `stagedUploadsCreate` -> POST (**HTTP 201**) -> `fileCreate`
  -> `metaobjectUpdate` -> `image_url` - which is what makes an external roaster application form
  possible. **Caution:** `image_url` returns a **protocol-relative** URL, the POC14 `asset_url` trap.
- [x] ~~**C3 — Model one SKU with two lots (§13.9) in Shopify.**~~ **DONE 2026-08-22, and §13.9.2 is
  a bigger problem than it was written as. See §16.2.** Lots model cleanly - two records referenced via
  `crema_italia.lots` (`list.metaobject_reference`) read through Liquid with every field resolved.
  **The headline: Shopify permits duplicate SKUs across products and gives each variant its own
  `InventoryItem`, so two products sharing one physical SKU have completely independent stock pools.**
  Built it, adjusted one to 30, and the other stayed at 40 - Shopify believing in 70 units where 40 bags
  exist. So the risk is not only mis-picking under FIFO, it is **overselling**, and candidate **B
  (segregate by location only) does not address it**, because locations are per inventory item.
  **Candidate C (never overlap) gains ground.** §13.9.2 stays OPEN as Steve's decision and a 3PL
  qualifying question (Standard §12.9).
  **Two corrections to §13.9's onboarding order, both live traps:** Liquid read our metaobjects with
  `storefront: NONE` (that setting governs the **Storefront GraphQL API**, not `shop.metaobjects`); and
  a product created via Admin API with `status: ACTIVE` is **not published** (`publishedAt: null`,
  invisible to Liquid until `publishablePublish`). **"Active" and "published" are different things.**
- [~] **C4 — Judge.me metaobject syndication: RE-CHECKED 2026-08-22, unchanged, and now stated
  cleanly. See §16.4.** Aggregates populate (`reviews.rating` = 2.0, `reviews.rating_count` = 1);
  **`reviews.product_reviews` is null**; and listing every metaobject definition on the store returns
  **three**, none of them `product_review` - a firmer statement than Round 1 could make, since a truthy
  empty drop makes the obvious existence check useless. **Status stays UNPROVEN, not refuted.** The two
  questions for Judge.me support still stand. Nothing here disturbs §13.5.1, which needs only the
  aggregate.
- [ ] **C5 — Shopify Flow for Offerta aging: NOT TESTABLE in a sitting, and worth knowing why.
  See §16.5.** Flow is **not installed** on the dev store, installing it is a UI action, and the job that
  matters is a **daily scheduled trigger**, so a real test costs a day per iteration. Design guidance
  unchanged (Run code for the date arithmetic; two jobs; only the unpublish-at-window-end one fully
  automatic). **When it is tested, test the failure mode** - the reported problem is that date comparison
  in Flow conditions fails **silently**, which on our shelves means coffee quietly never leaving the
  freshness window.
- [ ] Also still open and launch-gating, though not build-blocking: pricing numbers never
  validated against real landed costs (Standard §12.3); real catalog data + photography;
  3PL not selected (blocks the no-waste Promise copy, and the transit/$8.50 claims); email
  platform not chosen (win-back, abandoned-cart, 60-day-grace campaigns all assume one);
  **The legal pages are CLOSED (2026-08-22)** — this line used to say "the legal pages
  checkout requires (privacy, terms, refund, shipping) do not exist anywhere in the repo",
  which was wrong twice. They exist and are published: contact information, shipping, refund
  and terms are live and URL-verified, privacy is Shopify's automated one. And **"checkout
  requires" was an overstatement this repo repeated for months** — Shopify gates checkout on
  none of them and marks only **Contact information** Required. What actually drives the rest
  is law and underwriting, not the platform. See `docs/legal/README.md`. **The mailboxes are
  CLOSED (2026-08-22)** — this line used to say
  "info@ / support@ mailboxes not created", which was wrong about info@ and is now wrong
  about all three: company email is Google Workspace, and `info@`, `support@` and `contact@`
  all exist as aliases on `steve.roberts@cremaitalia.com`. POC9's contact routing is
  unblocked. See the 2026-08-22 §9 entry.

- [ ] **DESIGN: Roaster Onboarding and Product Onboarding as two distinct processes** (Steve,
  2026-08-21) — see `docs/production_build_spec.md` §15. **Roaster Onboarding** (courting to signed,
  once per roaster, Lucia's lane) largely exists as the Roaster Guide + intro letter; open items are
  the v7 SKU line, the `_v6_pending_it` filename, and two deferred ambiguities. **Product
  Onboarding** (per SKU, every time, a data pipeline) does **not** exist as a defined process — its
  inputs are scattered across the guide. It is the process that populates §13's data model: roaster
  proposes, Crema Italia reviews, **we assign the SKU**, cost is agreed, and a **pro-forma label is
  generated and audited** — which is where the unambiguous **roast date format** belongs, not in the
  pre-boarding guide. Steve's call: **work this in a separate thread**; manual forms or a simple
  online system is itself an open question.
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
- [ ] **ALL photography is DEFERRED (Steve, 2026-08-20) — tracked in
  `docs/photography-todo.md`, which is now the single list.** Team/partner headshots (Lauren,
  Partner 1), roaster portraits + brand logos, and every product tile / PDP gallery slide are
  still text or CSS placeholders. The three landing-page slots DO carry images, but they are
  `ci-temp-*` stand-ins and **two of them cannot ship** for recorded reasons (a US café;
  third-party trademarks). Most of the rest is gated on the roasters signing, not on us.
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

**To resume, read in this order:** this block → **the newest `docs/POC<N>_change_list.md`**, whose
number is named in this block rather than written here (it was left saying "POC6 — latest batch"
until 2026-08-20, by which point twelve batches had shipped past it — Review B finding B1) →
`docs/production_build_spec.md` (production design prompts + the ready-to-use build prompt) →
`docs/standards/README.md` for the current Standard versions, then the Standards themselves →
`docs/POC_drift_from_standards.md` → `00_PROJECT_BRIEF.md` (OneDrive) →
`Coordination\DECISIONS_LOG.md`. `docs/CremaItalia_POC_v3.html` is a **frozen 2026-06 design
source**, stale in many places against the live POC; read it for original intent only, never as
current truth.

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
