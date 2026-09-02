# Business summary - a living document

`Crema_Italia_Business_Summary_v1.0.html` is the **source**. The `.pdf` beside it is a
**render**. Edit the HTML and re-render; never edit the PDF, and never rebuild the PDF
from scratch (see the `crema-italia-pdf-builder` skill for why that rule exists).

```bash
python .claude/skills/crema-italia-pdf-builder/scripts/render_pdf.py \
  docs/overview/Crema_Italia_Business_Summary_v1.0.html
```

Written 02-SEP-2026 for a meeting with a former business partner. Steve's framing:
**share progress and current state.** It is not a pitch, it does not ask the reader for
anything, and an earlier draft's "where I would value your view" section was cut for
exactly that reason - do not reintroduce a section that puts questions in Steve's mouth.

## The thing most likely to go wrong on an update

**Every screenshot is of a prototype carrying fixture data, and the captions are what
make that honest.** The roaster index names Gardelli, La Sosta and Fusari; *Gardelli
Specialty Coffee is a real company* and no roaster has signed with Crema Italia. Its
caption says so outright. If you swap a screenshot, re-check its caption before
rendering - an uncaptioned catalogue shot asserts a relationship and a price list we do
not have. The fixture-data rule is `CLAUDE.md` §6 and `POC11_change_list.md` §0.

The café is deliberately out of scope (Steve, 02-SEP-2026), and so is wholesale, whose
written rationale is entangled with it.

## Re-taking the screenshots

The storefront is a single-document SPA with **no url routing**, so
`msedge --screenshot <url>` can only ever capture the home page. The four shots were
driven over the DevTools Protocol - navigate, call `showPage(...)`, remove Shopify's
draft-preview bar (`#PBarNextFrameWrapper`, *not* anything matching `[id*=preview-bar]`),
then capture. That driver was scratch scaffolding and is not in the repo; rewrite it, or
take the shots by hand from the current preview theme named in `CLAUDE.md` §10.

Captured at 1440x900, `deviceScaleFactor: 2`. `01-home.png` is cropped to the hero
because the full viewport catches a sliver of the next section, which reads as a
rendering artifact.

## Layout notes worth keeping

- Screenshots are laid out two-up with `display:inline-block`, **not flex**. WeasyPrint's
  flex handling is what silently collapses the tricolore rule to nothing, so a layout
  that must not fail quietly does not use it.
- The tricolore rule is painted with a hard-stop gradient for the same reason.
- Page 4 runs about a third full. That is accepted, not an oversight: as items move from
  §5 (not built) to §4 (built), the pagination shifts anyway.

## Verifying a re-render

Render gates 1-3 are automatic and the script exits non-zero on failure. **Gate 4 is
looking at every page**, and it is not optional - a gate proves the render matches its
source, never that the page is right. `pdftoppm` *is* available on this machine at
`C:\msys64\mingw64\bin\pdftoppm.exe` (MSYS2 brought poppler in with WeasyPrint), despite
older notes in the skill and `CLAUDE.md` §9 saying it is not installed:

```bash
pdftoppm -png -r 100 docs/overview/Crema_Italia_Business_Summary_v1.0.pdf /tmp/pg
```

Bump the version in the filename, the `@page` footer string and the footer `<span>`
together, and archive the superseded render rather than overwriting it.
