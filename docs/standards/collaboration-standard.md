# Crema Italia — Collaboration Standard

**Version 1.1 · 2026-07-14**
**Source of truth:** this file (`docs/standards/collaboration-standard.md`) in the theme repo.
**Companion standards:** Brand Standards v2.1 (look & voice) · Store Operating Standards v1.2 (commerce).

> **v1.1 (2026-07-14)** added **§9 Render distribution & the trust certificate** — where the read-only
> renders live (OneDrive `Standards\`), that **Code** produces and delivers them on every source
> change, and how the coordinator's `RENDER_TRUST.md` badge lets Cowork trust an OneDrive copy without
> round-tripping through Code. No change to §1–§8.

> **What this document is.** The canonical statement of **how we work** — how truth is recorded,
> who may edit what, and how the human (Steve) and the AI agents (Claude **Code** in this repo,
> Claude **Cowork** on the OneDrive desktop) stay in sync without drifting. It is the third of three
> Standards. Brand Standards owns look & voice; Store Operating Standards owns commerce; this owns
> the *operating protocol between us*. Governance decisions go here so they stop living scattered in
> `CLAUDE.md` callouts and in the log.

---

## 1. The two kinds of durable writing — don't confuse them

- A **Standard** tells you **what is true now**. Always current; old versions are replaced. Read it
  to know how things work. → Brand Standards, Store Operating Standards, this Collaboration Standard.
- A **Log** tells you **what changed, when, and why**. Only grows; never overwritten. Read it to
  reconstruct history. → `CLAUDE.md` §9 (Code's local ledger) and `Coordination/DECISIONS_LOG.md`
  (the cross-surface ledger).

**The rule for every decision:** (1) update the relevant **Standard** to reflect the new truth, and
(2) add one dated line to the **Log** recording that it happened. (This generalizes the older brand
"current-on-edit" rule to all three Standards.)

## 2. Three Standards, by kind of truth

| Kind of truth | Standard | Answers |
|---|---|---|
| How the store **looks & speaks** | Brand Standards | color, type, voice, logo |
| How the store **buys & sells** | Store Operating Standards | pricing, shelves, discounts, fulfilment |
| How **we work** | Collaboration Standard (this) | lanes, source-of-truth model, editing protocol, sessions |

## 3. Source vs render — the anti-drift principle (LOCKED, Option A, 2026-07-13)

The failure we are engineering out: a document that is both a machine's build authority **and** a
human's reference tends to exist in two editable copies, which drift (this happened — a retired
build Prompt and `CLAUDE.md` disagreed, and the wrong one was trusted).

**The principle:**
> **Separate the *source* from the *render*. There is exactly one editable source of truth per
> Standard. Every other copy — the human PDF, a Cowork reference in OneDrive — is a *generated,
> version-stamped, read-only render* of that source.**

- **Sources** are canonical, versioned Markdown, and live **in the repo** (`docs/standards/`).
  **git is the concurrency gate** and the tamper-evident audit trail.
- **Renders** are distributions (PDF for humans; a copy dropped in OneDrive for Cowork). Each is
  stamped *"Rendered from <Standard> vN — do not edit; source of truth is `docs/standards/…`."*
  A copy in OneDrive is a **render, not a peer.**
- **You only ever edit the source. Renders get regenerated.** Drift becomes structurally impossible.
- This is the same pattern Brand Standards already used internally (HTML source → PDF render); Option
  A (2026-07-13) elevates it to the governing rule and applies it to **all three** Standards and to
  the Cowork copies.

## 4. Lanes & the editing protocol

- **Claude Code owns this repo.** Code is the authority for the theme and for all three Standard
  *sources*. In any conflict, **Code takes precedence.**
- **Claude Cowork's lane** is the OneDrive `CremaItalia LLC` ops/brand folder (brand asset authoring,
  operations docs, research). Cowork **reads** Standards as rendered copies; it does **not** edit
  Standard sources.
- **Editing protocol (LOCKED 2026-07-13):** **any edit Steve asks Cowork to make to a repo-owned
  artifact must be converted into a prompt for Code to apply to the repository.** Cowork *proposes*;
  Code *applies*. This is the valve that keeps the repo the single source of truth — Cowork can draft
  or suggest, but the canonical write always happens in Code's lane, through git.
- **Brand assets** still flow **Cowork → Code** (Code copies finalized assets in), not the reverse.

## 5. Two Code sessions, one repo

The "Code owns the repo" rule covers Code vs. Cowork; it does **not** make two concurrent **Code**
sessions on the same checkout safe. If two Code sessions may be active at once, each should either
(a) work in its own `git worktree`, or (b) if sharing one checkout, commit its own changes promptly
at a natural stopping point and never leave work uncommitted while another session may also be
writing, and never run broad commands (`git add -A`, `git checkout .`, `git reset --hard`) that could
touch the other session's files. To redirect a running session, let it finish its current edit,
review `git status`/`git diff`, commit only its own files, then pause — never stop it mid-write.

## 6. Working-tree integrity is Code's lane

Uncommitted changes, truncation, and `.git/index.lock` are **Code's** concern, not the coordinator's.
A stale `index.lock` plus `autocrlf` line-ending warnings can *look* like truncation but usually
aren't — verify with `git status --short` (empty = clean) and by checking file tails before sounding
any alarm. The scheduled coordinator uses only lock-free, read-only git and does not police the
working tree.

## 7. Connectivity

After a reboot, or if GitHub / Shopify CLI access seems off, run the **`reconnect-check`** skill
before any manual git/Shopify troubleshooting. It is read-only and is **Code's** skill to run. Cowork
does not run git or the Shopify CLI; if it suspects a connectivity problem, it flags it to Steve/Code.

## 8. How this stays honest (enforcement)

1. **One named home per kind of truth** (the three Standards) — no more "is it in the Prompt, §9, or
   memory?"
2. **Update-the-Standard-on-change** (§1), with a **version stamp** on every render so drift is
   visible at a glance.
3. **A short pointer block in `CLAUDE.md`** — the first thing every Code session reads — naming the
   three Standards and what belongs in each, so `CLAUDE.md` *points* instead of duplicating (keeping
   it from growing overweight).
4. **git history** = the audit trail of who changed which rule when.

## 9. Render distribution & the trust certificate

Sources live in the repo (§3); humans and Cowork read **renders**. This section fixes where renders
live and how Cowork knows a render is safe to trust without round-tripping through Code.

- **Where renders live.** The human/Cowork-facing render of every Standard lives, read-only, in
  OneDrive `CremaItalia LLC\Standards\`, one PDF per Standard, each stamped *"render — do not edit;
  source of truth is `docs/standards/…`."* This folder is the single certifiable home for all three
  renders.
- **Who produces & delivers them.** **Code** renders each Standard from its repo source at every
  version bump (the render command is fixed per Standard) and delivers the copy into `Standards\`.
  Cowork never edits or moves a render. The repeatable ritual is the **`crema-std-publish`** skill.
- **The trust certificate.** The daily coordinator compares each OneDrive render's stamped version
  against the repo source and overwrites `Coordination\RENDER_TRUST.md` — a standing latest-state
  badge: per-Standard MATCH / STALE / MISSING plus one overall verdict line stamped with the commit
  it checked against.
- **How Cowork uses it.** Before validating any brief / Playbook / ops content against a Standard,
  Cowork reads `RENDER_TRUST.md`:
  - **MATCH (green):** the OneDrive render equals source — Cowork validates against the render directly
    and does **not** involve Code or Steve.
  - **STALE / MISSING (red):** Cowork does **not** trust that render — it routes the specific need to
    Code (re-render / produce the copy) and never silently proceeds on a stale or absent copy.
- **Invalidation & mid-cycle refresh.** The certificate is point-in-time — only as current as the last
  coordinator run. A commit that changes a Standard source invalidates the prior green for that
  Standard until the next run re-certifies. **If a Standard is changed mid-cycle and Cowork needs to
  rely on it before the next scheduled run, Steve triggers an out-of-cycle coordinator run to
  re-certify.** Until re-certified, that Standard is treated as red (anchor against Code, not the
  copy). Because downstream docs *point at* Standards rather than restate them (§3), a briefly-stale
  pointer is low-risk — but a red badge is always a real finding, not noise.

---

*Collaboration Standard v1.1 · 2026-07-14 · Source of truth: `docs/standards/collaboration-standard.md`.*
