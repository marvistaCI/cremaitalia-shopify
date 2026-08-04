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
| **Brand Standards** | `docs/standards/brand-standards/Crema_Italia_Brand_Standards_vX.Y.html` (HTML *is* the source) | `crema-italia-pdf-builder` skill's `render_pdf.py` (WeasyPrint) — renders the HTML as authored incl. `@page` running headers + page numbers; on Windows it auto-adds the MSYS2 GTK/Pango DLL dir. Cover logo (`assets/ci-cover-logo.png`) + fonts carried locally, **no OneDrive staging**. Headless Edge `--print-to-pdf` is a fallback but drops the running headers. PDF committed alongside the source; see `brand-standards/README.md`. |
| **Store Operating Standards** | `docs/standards/store-operating-standards.md` | `py docs/standards/render.py store-operating-standards.md "Store_Operating_Standards_vX.Y.pdf"` |
| **Collaboration Standard** | `docs/standards/collaboration-standard.md` | `py docs/standards/render.py collaboration-standard.md "Collaboration_Standard_vX.Y.pdf"` |

- `render.py` reads the version from the source's `**Version X.Y · DATE**` line and stamps
  the footer "render — do not edit". Markdown renders are git-ignored (they churn); the
  committed durable copies live only under `_archive/` once superseded.

> **Both renderers gate themselves (since 2026-08-03) — a non-zero exit STOPS the publish.**
> Never deliver a render whose command exited non-zero, and never work around it with
> `--allow-fallback` / `--skip-tail-check` without saying so to Steve. The failures these
> catch are silent: the renderer returns 0 and hands you a clean-looking, wrong PDF.
>
> | Exit | Meaning |
> |---|---|
> | 3 | source truncated, or a linked stylesheet/font/image did not resolve |
> | 4 | Marcellus/Inter not embedded, or a fallback face appeared — the render is off-brand |
> | 5 | the PDF does not contain the end of the source |
> | 6 | the render never produced a complete PDF |
>
> This closes a hole `RENDER_TRUST.md` structurally cannot see: md5-comparing the repo
> render against the OneDrive copy reads **MATCH** when both are copies of the same bad
> render. Trust has to be established at render time, here — the badge only proves the two
> copies are identical, never that either one is right.
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
   - the other two Standards' **`**Companion standards:**`** header lines — **note which
     sources you touched here; steps 4 and 6 apply to every one of them, not just the
     Standard being published** (see the callout under step 6)
   - `docs/standards/README.md` — the three-Standards table
   - `CLAUDE.md` — the top **pointer block** (the `- **X Standard** (vN)` bullets) and the
     `§6.1` / `§11` "today:" / "current" version values where they name this Standard
   - Do **not** edit `CLAUDE.md` §9 log entries or `DECISIONS_LOG.md` history — those are
     immutable records of what was true *then*.
4. **Re-render the PDF — for every source step 3 touched**, with the command from the table
   above, each named `..._v<its own current version>.pdf`. A companion Standard keeps its
   own version number (its rules did not change) but its **content did**, so its render is
   now stale and must be regenerated too.
   **Confirm each exited 0 and every gate printed "pass".** A non-zero exit is a stop, not a
   warning: fix the cause and re-render before going near step 5. Report the gate lines.
5. **Archive the superseded render.** Move the previous PDF into `docs/standards/_archive/`
   with an `_ARCHIVED` suffix and add a line to `_archive/README.md`. Archived renders are
   committed (frozen history); live renders stay git-ignored. (Brand's committed PDF is the
   exception — its render sits beside its HTML source and the old one archives the same way.)
6. **Deliver every fresh render to OneDrive** `...\CremaItalia LLC\Standards\`, replacing the
   prior copy for each Standard re-rendered in step 4. Keep exactly one current PDF per
   Standard in that folder.

> **A companion Standard's render goes stale without its version number changing — and no
> version-stamp check will ever see it.** This happened for real: commit `f9ffcb1`
> (2026-07-25) bumped Store Operating Standards to v1.3 and correctly fixed the Collaboration
> Standard's companion-pointer line, but only the Store Operating render was regenerated and
> delivered. The OneDrive Collaboration render sat 10 days saying "Store Operating Standards
> **v1.2**" while its own source said v1.3 — and every coordinator run certified it MATCH,
> because "Version 1.1" equals "Version 1.1." Caught 2026-08-04 only when the coordinator
> started diffing **extracted PDF text** instead of version headers. **The rule: every source
> you edit in step 3 gets re-rendered in step 4 and redelivered in step 6, version bump or
> not.** Same-version content edits are the blind spot; treat "touched" as the trigger, never
> "bumped."
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
3. Confirm each OneDrive copy matches its repo render **by content, not by version stamp** —
   `md5sum` the pair, and where they differ, `pdftotext` both and diff the text (headless
   Edge stamps a `CreationDate`, so its renders are not byte-reproducible; WeasyPrint's are).
   A matching version number proves nothing — see the callout under step 6.
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
