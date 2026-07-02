---
name: crema-italia-pdf-builder
description: >-
  Build any Crema Italia PDF — Roaster Guides, Brand Standards, vendor / intro
  sheets, one-pagers, price lists, letters — the durable way: author an editable
  HTML/CSS source FIRST, then render the PDF from it with WeasyPrint using
  locally-embedded brand fonts, saving BOTH files with matching names. Use this
  whenever the user wants to create, regenerate, update, restyle, or "just change
  the font/layout" of any Crema Italia PDF or branded document, or whenever a PDF
  may need editing later. Critically, use it even when the user only asks for "a
  PDF" — they almost always want it editable again. Never hand over a Crema Italia
  PDF without leaving its editable source behind.
---

# Crema Italia PDF Builder

## Why this skill exists

A PDF is an *output*, not a *source*. In June 2026 a request to swap one font in
the Roaster Guides and Brand Standards could not be done cleanly because only the
final PDFs had been saved — no HTML, no .docx, nothing editable. The attempted
fix "regenerated" the PDFs from scratch and destroyed the layout, turning 13- and
10-page documents into degraded 3-page stubs.

The lesson is the whole point of this skill: **you can edit a source and
re-render a PDF, but you cannot edit a PDF.** So every Crema Italia PDF must ship
with the editable source that produced it, sitting right next to it.

## The core rule (do not skip)

1. **Source first.** Author or locate an editable HTML/CSS (preferred) or .docx
   source. The PDF is rendered *from* it — never typed in directly.
2. **Two files, matching names.** Save both in the project folder, e.g.
   `Crema_Italia_Vendor_Sheet_v1.html` -> `Crema_Italia_Vendor_Sheet_v1.pdf`.
3. **Local fonts.** Embed the brand fonts from `.ttf` files in the project, not
   from a live Google Fonts URL. Network fetches at build time are exactly what
   silently degraded the v4 build.
4. **Re-render, never recreate.** When the user wants a change, edit the source
   and run the render script again. Recreating from the PDF is forbidden.

5. **Brand-current on edit.** Bring every document you touch up to the *current*
   brand standards in the same pass (palette, fonts, logo, ™). "Current" = the greatest-
   version `Crema_Italia_Brand_Standards_vX.Y.pdf` + `Crema Italia Brand CSS.css`. See the
   **brand-current check** in the workflow below, and `references/brand.md` for the values.

If you ever find a Crema Italia PDF with no source, your first job is to
reconstruct a faithful source (see "Rescuing a source-less PDF"), not to
regenerate the PDF blind.

## Workflow

**Step 1 — Locate or create the source.**
Search the project for an existing `.html`/`.docx` source matching the document
and obey the project rule "always use the greatest version-number variant"
(`_v3` > `_v2`). If a source exists, edit that. If only a PDF exists, go to
"Rescuing a source-less PDF". If it is a brand-new document, create the HTML.

**Step 2 — Author the HTML + CSS.**
Use `assets/template.html` as the starting point. It links two stylesheets:
  - the project brand stylesheet, `Brand and Marketing/Crema Italia Brand CSS.css`
    (the single source of truth for palette, type scale, and components — link it,
    do not copy it), and
  - `fonts.css` from this skill, which `@font-face`s the brand fonts from local
    `.ttf` files.
Write semantic HTML and lean on the brand classes (`.ci-hero`, `.eyebrow`,
`.callout`, `.ci-table`, `.flag-strip`, etc.). See `references/brand.md` for the
palette, type rules, and the bilingual/paired conventions.

**Step 3 — Make the fonts local and reproducible.**
The brand display font is **Marcellus** (single 400 weight, roman — no italic); body
is **Inter** (400/500/600 + italic 400). Retired: Lora / Cormorant (do not use). Put the `.ttf` files in the project's
`Brand and Marketing/assets/fonts/` (or alongside the HTML) using the exact
filenames in `assets/fonts/README.md`, and point `fonts.css` at them. If the files
are missing, fetch them once from the Google Fonts GitHub repo, save them into the
project, and from then on every render is offline and identical.

**Step 3.5 — Brand-current check (mandatory gate).**
Before rendering, verify the document is on the CURRENT brand. Read the doc's brand-
version stamp (footer/metadata, e.g. `Built to Brand Standards v2.0`) and compare it to the
current version named in the repo `CLAUDE.md` §11 reference index and `references/brand.md`.
If the stamp is behind — or missing — refresh first: palette hexes (Espresso `#55331B`,
Crema Gold `#B88348`; never `#3B1F12`/`#C46A1F`), fonts (Marcellus display / Inter body /
Montecatini logo-art-only; never Cormorant/Lora), current logo lockup, ™ not ®, gold used
large-only. Then set/refresh the stamp to the current version. If a full refresh is truly
out of scope, flag the drift to Steve rather than shipping stale.

**Step 4 — Render.**
```bash
pip install weasyprint --break-system-packages   # once, if not present
python scripts/render_pdf.py <source.html>        # writes <source>.pdf next to it
```
The script resolves relative paths (CSS, fonts, images) from the HTML's own
folder, so keep the source in the project tree near its assets.

**Step 5 — Save both, verify, report.**
Confirm the PDF opened to the expected page count and that headings render in Marcellus
(not a serif fallback). Hand the user the PDF, and tell them the source filename
so they know it is editable.

**Step 6 — Version and pair correctly.**
Follow the project versioning rules: minor bump for typography/copy tweaks, major
bump for layout/design changes. For the Roaster Guides specifically, the two
single-language editions (`_us` / `_it`) are a **paired set**: any change to one
language requires the same change to the other, and both re-issue together under
one new version number. Italian is the controlling edition. Move superseded
versions to the relevant `archive/` folder (ask before reorganizing folders).

## Rescuing a source-less PDF

When the only artifact is a PDF and the user wants it changed:
1. Extract text and structure (`pdftotext -layout`, `pdfplumber`) and note page
   count, section order, tables, and images (`pdfimages`).
2. Rebuild a faithful HTML source that reproduces the layout using the brand CSS —
   this is real work; scope it per document and confirm fidelity with the user.
3. Save that HTML as the new editable master, then render from it.
4. From now on the document has a source; never let it lose one again.
Be honest that step 2 is a reconstruction, not a byte-perfect recovery, and get
the user to eyeball it before treating it as the master.

## Files in this skill

- `scripts/render_pdf.py` — HTML->PDF via WeasyPrint; output name mirrors source.
- `assets/template.html` — starter document wired to brand CSS + local fonts.
- `assets/fonts.css` — `@font-face` declarations for Marcellus + Inter (local `.ttf`, bundled).
- `assets/fonts/README.md` — exact filenames and where to get the `.ttf` files.
- `references/brand.md` — palette, type rules, bilingual + paired-doc conventions.
