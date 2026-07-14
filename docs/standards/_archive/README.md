# `_archive/` — superseded Standard renders (HISTORICAL, do NOT use as current)

Everything in this folder is a **frozen, superseded render** of a Standard — kept as a historical
artifact, **not** authoritative. If you want the current rule, go **one level up** to
`docs/standards/` (the live Markdown source) or its current PDF render. Never quote, build to, or
hand out a file from this folder as if it were current.

## Why these are safe to commit (when the live renders aren't)

The live renders in `docs/standards/*.pdf` are **git-ignored** — they regenerate on every source edit,
so committing them would churn the repo with binary noise (see `/docs/standards/*.pdf` in `.gitignore`).
Files in **this subfolder are different**: a superseded version never changes again, so it is written
once and frozen. Committing frozen archives gives us a durable, backed-up, browseable record of what a
Standard said at each version, without reintroducing churn. The `.gitignore` rule is folder-anchored
(`*` doesn't cross `/`), so `_archive/*.pdf` is tracked while the live renders stay ignored.

> The **real** version history is always the versioned Markdown source in git (`git log` on the `.md`).
> Any old render here can be reproduced from the source at that commit — these PDFs are a convenience
> archive, not the source of truth.

## The convention (follow this every time a Standard is superseded)

When a Standard is bumped to a new version:
1. Render the new current PDF one level up (`py docs/standards/render.py <standard>.md "<Name>_vX.Y.pdf"`).
2. **Move the previous render here** and add the `_ARCHIVED` suffix, e.g.
   `Store_Operating_Standards_v1.1.pdf` → `_archive/Store_Operating_Standards_v1.1_ARCHIVED.pdf`.
3. Add a line to the **Archived renders** log below (what was superseded, by what, when, why).
4. Commit the archived PDF + this README update. The live render stays git-ignored.

## Archived renders

| Archived file | Superseded by | Date | Why |
|---|---|---|---|
| `Store_Operating_Standards_v1.1_ARCHIVED.pdf` | Store Operating Standards **v1.2** | 2026-07-13 | v1.2 replaced additive discount stacking with the no-stacking, highest-wins (`MAX`) model, split the delivery mechanism, marked Referral TBD, and retired the Sorpresa 250g/O250g matrix cells. v1.1's discount section is now wrong. See `CLAUDE.md` §9 (2026-07-13) and Store Operating Standards §3. |
| `Crema_Italia_Brand_Standards_v2.0_ARCHIVED.pdf` | Brand Standards **v2.1** | 2026-07-14 | v2.1 added the no-em-dash customer-facing voice rule (copy-only minor bump; color/type/logo unchanged). See `CLAUDE.md` §9 (2026-07-14) and Brand Standards §9 (Voice). |
| `Collaboration_Standard_v1.0_ARCHIVED.pdf` | Collaboration Standard **v1.1** | 2026-07-14 | v1.1 added §9 (Render distribution & the trust certificate) — the `Standards\` render folder, Code-produces-and-delivers rule, and the `RENDER_TRUST.md` badge. §1–§8 unchanged. See `CLAUDE.md` §9 (2026-07-14) and Collaboration Standard §9. |
