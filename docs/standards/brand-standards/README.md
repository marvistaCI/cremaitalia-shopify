# Brand Standards (v2.1) — source of truth

As of **2026-07-13 (Option A)**, this repo folder is the **canonical source** of the Brand Standards.

- **Editable source:** `Crema_Italia_Brand_Standards_v2.1.html` (+ `Crema Italia Brand CSS.css`,
  `fonts.css`, and current fonts in `assets/fonts/` — Marcellus display + Inter body; retired Lora is
  intentionally not carried).
- **Render:** `Crema_Italia_Brand_Standards_v2.1.pdf` is a read-only render of the HTML. Regenerate it
  with a headless Edge/Chrome print of the HTML in place (`--headless=new --no-pdf-header-footer
  --print-to-pdf`), or the `crema-italia-pdf-builder` skill's WeasyPrint path if it's installed. The
  cover logo is **carried locally** at `assets/ci-cover-logo.png` (a copy of `CI Main Logo -
  Transparent.png` from OneDrive `Logo Assets/PNG/`), and the fonts are carried the same way in
  `assets/fonts/`, so the render is fully offline — **no OneDrive staging.** Do **not** hand-edit the
  PDF. The superseded v2.0 render lives in `../_archive/`.
- The copies in OneDrive `Brand and Marketing/` are now **renders for Cowork reference**, not the
  source. Changes happen here, in the repo, through git (see the Collaboration Standard).

Palette/type summary (full detail in the HTML): Espresso `#55331B`, Crema Gold `#B88348`, Cream
`#FBF8F1`, tricolore green/red as thin rules only; display = Marcellus, body = Inter, wordmark art =
Montecatini (logo only). ™ never ®.

> **Follow-up:** the PDF here is the 2026-07-14 render (v2.1); re-render from the HTML if the source changes.
