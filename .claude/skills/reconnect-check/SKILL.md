---
name: reconnect-check
description: >-
  Verify (and if needed, walk through restoring) the GitHub and Shopify CLI
  connections for the cremaitalia-shopify theme repo, then re-orient on
  current project state. Use this whenever Steve reboots his PC, starts a
  fresh Claude Code session, or says things like "reconnect", "restore the
  connection", "check GitHub/Shopify", or "I rebooted, get set back up" for
  the Crema Italia Shopify build. Read-only diagnostic — never pushes,
  pulls, or deploys anything.
---

# Crema Italia Shopify — reconnect & resume check

## Why this exists

Steve occasionally reboots his PC or opens a new Claude Code session and isn't sure
whether the GitHub and Shopify CLI connections this repo depends on are still live.
This is a recurring, on-demand check — not a scheduled job, since a reboot isn't
predictable — so it's a skill Steve (or Claude Code) invokes by asking, not a cron task.

This is separate from the OneDrive `crema-daily-coordinator` Cowork task (see
`Coordination\coordinator_routine_prompt.md`), which checks doc drift on a daily
schedule. This skill only checks **connectivity**, and only for **this repo**.

## Steps

### 1. Check GitHub connectivity
```bash
git -C ~/code/cremaitalia-shopify remote -v      # confirm origin is the expected repo
git -C ~/code/cremaitalia-shopify status          # working tree state, not a connectivity issue but good context
git -C ~/code/cremaitalia-shopify ls-remote origin HEAD   # actually round-trips to GitHub
```
- **Success** = `ls-remote` returns a commit SHA immediately, no prompt.
- **Failure** = it hangs, times out, or errors with an auth message. Fix: run any
  real git command that talks to the remote (`git fetch`, `git push`) — Windows Git
  Credential Manager will pop a browser login. Complete it there, then re-run
  `ls-remote` to confirm.
- Note: there is no `gh` CLI installed/used in this workflow — auth is plain HTTPS +
  Git Credential Manager. Don't suggest `gh auth login`; it doesn't apply here.

### 2. Check Shopify CLI connectivity
```bash
shopify version
cd ~/code/cremaitalia-shopify && shopify theme list
```
- **Success** = `theme list` returns without prompting, showing (at minimum) these
  three known themes on `crema-italia.myshopify.com`:
  - `crema-italia-coming-soon-theme` — `#150557294761` — **[live]**
  - `Horizon` — `#150473375913` — [unpublished]
  - `Crema Italia POC4 Preview` — `#151277174953` — [unpublished] (renamed from
    "POC3 Preview" 2026-07-05 — same theme id, holds whichever POC batch is
    current; rename it again alongside the next POC batch, see `CLAUDE.md` §9)
  If the theme names/ids/roles differ from this list, flag it — that's a real change,
  not a connectivity artifact.
- **Failure** = it prompts for login or errors. Fix: `shopify auth login` (browser
  flow), then re-run `shopify theme list`.
- If `shopify version` shows a newer release available, mention it but don't
  auto-upgrade — that's Steve's call.

### 3. Report plainly
One short summary: what's connected, what needed re-auth (if anything), what's still
broken. If everything was already fine, say so — don't manufacture a fix for a
non-problem.

### 4. Re-orient on project state
Once connections are confirmed, read in this order (per `CLAUDE.md` §10's resume
block):
1. `CLAUDE.md` §10 (current POC state, open questions)
2. `Coordination\DECISIONS_LOG.md` (cross-surface decisions since last session) —
   `C:\Users\marvi\OneDrive\Pre-Vault\CremaItalia LLC\Coordination\DECISIONS_LOG.md`
3. The most recent `Coordination\sync-report-<date>.md`, if any findings are still
   unresolved — these are drift issues already flagged, not new work to duplicate

## Do not

- Don't `git push`, `git pull`, `shopify theme push`, or `shopify theme pull` as part
  of this check — it's read-only diagnostic.
- Don't edit OneDrive docs or `DECISIONS_LOG.md` — that's the daily coordinator's job
  and Cowork's lane.
- Don't treat uncommitted local changes (`git status` showing modified files) as a
  connectivity problem — that's just normal WIP.
