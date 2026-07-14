---
name: crema-std-publish
description: >-
  Publish a Crema Italia Standard after a truth decision — the reliable, repeatable
  ritual that keeps the source, the committed render, the OneDrive read-only copy, and
  every cross-reference in lock-step. Use this whenever Steve makes (or confirms) a
  decision that changes one of the three Standards (Brand, Store Operating, or
  Collaboration), whenever he says "publish the standard", "re-render the standards",
  "resync the standards", or when the coordinator's render-trust badge goes red /
  RENDER_TRUST.md reports STALE or MISSING. Invoke with a single Standard to publish one
  change, or "all" / "repair" to regenerate and redeliver every render (the sync-repair
  path). Code-only: it edits repo sources, renders PDFs, and delivers read-only copies
  into OneDrive. It records the human's decision; it does not decide truth.
---

# Crema Italia — Standards publish & render-trust

## Why this exists

The human (Steve) decides what is true; **Code is the custodian of that truth.** On any
change to a Standard, several artifacts must move together or they drift: the **source**
(repo), the **committed render**, the **OneDrive read-only copy** humans and Cowork read,
and the **cross-references** (companion headers, `CLAUDE.md` pointers, the standards
`README`). Done by hand this is a 6-step ritual that fails the first time a step is
skipped. This skill collapses it into one command, done the same way every time — and
run as `all`/`repair`, it is also the **fix** when render-trust ever goes red.

See the source/render/trust protocol in the **Collaboration Standard §3 and §9**.

## The three Standards and how each renders

| Standard | Source (repo) | Render command |
|---|---|---|
| **Brand Standards** | `docs/standards/brand-standards/Crema_Italia_Brand_Standards_vX.Y.html` (HTML *is* the source) | Headless Edge/Chrome `--headless=new --no-pdf-header-footer --print-to-pdf` on the HTML in place — cover logo (`assets/ci-cover-logo.png`) + fonts are carried locally, so **no OneDrive staging**. (Or the `crema-italia-pdf-builder` WeasyPrint path if installed.) PDF committed alongside the source; see `brand-standards/README.md`. |
| **Store Operating Standards** | `docs/standards/store-operating-standards.md` | `py docs/standards/render.py store-operating-standards.md "Store_Operating_Standards_vX.Y.pdf"` |
| **Collaboration Standard** | `docs/standards/collaboration-standard.md` | `py docs/standards/render.py collaboration-standard.md "Collaboration_Standard_vX.Y.pdf"` |

- `render.py` reads the version from the source's `**Version X.Y · DATE**` line and stamps
  the footer "render — do not edit". Markdown renders are git-ignored (they churn); the
  committed durable copies live only under `_archive/` once superseded.
- OneDrive read-only copies live in **`C:\Users\marvi\OneDrive\Pre-Vault\CremaItalia LLC\Standards\`**
  (one PDF per Standard, current version only) plus a `README.txt` explaining they are renders.

## Steps — publishing one Standard change

1. **Confirm the decision and the bump.** Restate to Steve, in one line, the rule that
   changed and the new version (major for a rule change, minor for additive/clarifying).
   Do not invent a decision; this skill records Steve's, not its own.
2. **Edit the source** in the repo to reflect the new truth. Add a dated changelog callout
   at the top of the source and update its in-doc version line + footer stamp to the new
   version. Customer-facing wording follows the no-em-dash rule (`CLAUDE.md` §6); internal
   Standard prose is exempt but keep the voice clean.
3. **Update every cross-reference to that Standard's version — "what's true now" only, never a dated log entry:**
   - the other two Standards' **`**Companion standards:**`** header lines
   - `docs/standards/README.md` — the three-Standards table
   - `CLAUDE.md` — the top **pointer block** (the `- **X Standard** (vN)` bullets) and the
     `§6.1` / `§11` "today:" / "current" version values where they name this Standard
   - Do **not** edit `CLAUDE.md` §9 log entries or `DECISIONS_LOG.md` history — those are
     immutable records of what was true *then*.
4. **Re-render the PDF** with the command from the table above, named `..._vX.Y.pdf`.
5. **Archive the superseded render.** Move the previous PDF into `docs/standards/_archive/`
   with an `_ARCHIVED` suffix and add a line to `_archive/README.md`. Archived renders are
   committed (frozen history); live renders stay git-ignored. (Brand's committed PDF is the
   exception — its render sits beside its HTML source and the old one archives the same way.)
6. **Deliver the fresh render to OneDrive** `...\CremaItalia LLC\Standards\`, replacing the
   prior copy for that Standard. Keep exactly one current PDF per Standard in that folder.
7. **Commit** the repo changes (source + cross-refs + archived render + this run's notes).
   Do not push unless Steve asks. OneDrive deliveries are not in the repo.
8. **Remind Steve of the two things this skill does NOT do:**
   - **Log it:** have Cowork add one dated line to `Coordination\DECISIONS_LOG.md`
     (Cowork's lane, direct write — not a Code hand-off).
   - **Re-certify if needed:** the coordinator's `RENDER_TRUST.md` badge is now stale for
     this Standard until the next scheduled run. If Cowork needs to rely on the change
     before then, Steve triggers an **out-of-cycle coordinator run** to re-certify.

## Steps — `all` / `repair` (sync-repair path)

Use when RENDER_TRUST.md reports STALE/MISSING, or renders are otherwise suspect:

1. For each of the three Standards, re-render from the **current** source (no version bump —
   this is a regeneration, not a decision) to its `..._v<current>.pdf`.
2. Deliver all three fresh renders into `...\CremaItalia LLC\Standards\`, overwriting.
3. Confirm each OneDrive copy's version stamp equals its repo source version.
4. Report the before/after per Standard. Remind Steve he may re-run the coordinator to flip
   the badge green. No source edit, no version bump, no new DECISIONS_LOG entry needed
   (nothing changed but the copies) — unless the repair *revealed* a real drift, which is a
   finding for Steve, not a silent fix.

## Guardrails

- **Code-only.** This skill writes repo sources and delivers OneDrive render copies. Cowork
  never runs it; Cowork reads the renders and the trust badge.
- **Records, does not decide.** If you are unsure a decision was actually made, ask Steve —
  do not bump a Standard on a guess.
- **One current copy per Standard** in `Standards\`; supersede-then-archive, never leave two
  live versions of the same Standard side by side (that is the drift this prevents).
- **Point, don't restate.** When updating cross-references, keep them pointers to the
  Standard, not restatements of its rules.
