# Crema Italia — Standards

This folder holds the **canonical source of truth** for how Crema Italia is built and run. Adopted
2026-07-13 (Option A — see the Collaboration Standard). The theme/POC is an ephemeral mock we build
*from*; these Standards are what we build *to*, and what future changes are measured against.

## The three Standards

| Standard | Owns | Source |
|---|---|---|
| **Brand Standards** (v2.1) | how the store **looks & speaks** — color, type, voice, logo | [`brand-standards/`](brand-standards/) |
| **Store Operating Standards** (v1.2) | how the store **buys & sells** — pricing, shelves, discounts, fulfilment | [`store-operating-standards.md`](store-operating-standards.md) |
| **Collaboration Standard** (v1.1) | how **we work** — lanes, source-of-truth model, editing protocol, render-trust | [`collaboration-standard.md`](collaboration-standard.md) |

## The rules that keep these honest

- **Source vs render.** Each Standard has exactly **one editable source**, versioned, here in the
  repo (git is the gate). Every human/Cowork/PDF copy is a **generated, read-only render** stamped
  with the version it came from. You edit the source; renders are regenerated. See the Collaboration
  Standard §3.
- **Standard vs log.** A Standard says *what is true now*; a **log** (`CLAUDE.md` §9,
  `Coordination/DECISIONS_LOG.md`) says *what changed, when, why*. On any decision: update the
  Standard **and** add one dated line to the log.
- **Point, don't restate.** Other docs reference these Standards; they don't re-copy the rules
  (restating is what drifts).
- **Cowork proposes, Code applies.** Cowork reads rendered copies and may draft changes, but the
  canonical write always happens in Code's lane, through git.

## Rendering the PDFs

The Markdown Standards render to branded, version-stamped PDFs with:

```
py docs/standards/render.py store-operating-standards.md "Store_Operating_Standards_v1.2.pdf"
py docs/standards/render.py collaboration-standard.md   "Collaboration_Standard_v1.1.pdf"
```

`render.py` converts the Markdown source to on-brand HTML (Marcellus/Inter, brand palette) and prints
it to PDF via headless Edge/Chrome — no native dependencies. The intermediate HTML is a throwaway
build artifact; the `.md` is the source. **These PDFs are generated on demand and are git-ignored**
(they'd churn on every edit) — re-run the command after editing a source. Brand Standards renders via
the `crema-italia-pdf-builder` skill (its HTML *is* its source; its PDF is committed alongside it).

**Superseding a version → archive the old render.** When a Standard is bumped, move the previous PDF
into [`_archive/`](_archive/) with an `_ARCHIVED` suffix and log it in that folder's README. Archived
renders are *frozen* (a superseded version never changes), so they are committed as durable historical
artifacts — unlike the live renders above, which stay git-ignored. Full convention: `_archive/README.md`.
Anything in `_archive/` is historical, never current.
