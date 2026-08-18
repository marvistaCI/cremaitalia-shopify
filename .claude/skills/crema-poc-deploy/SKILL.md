---
name: crema-poc-deploy
description: >-
  Deploy a Crema Italia POC batch to a Shopify preview theme the reliable way —
  verify live state FIRST, validate, push, prove the push by pull-and-diff, then
  update the one authoritative state block and log it. Use this whenever Steve says
  "deploy POC<N>", "push the POC to a preview theme", "deploy the batch", "refresh
  the preview", or when a POC batch is finished and ready for device testing. Also
  use it before ANY Shopify push when you are unsure what is currently deployed.
  Code-only. It exists because on 2026-07-24 a stale "not yet deployed" line in a
  change list was trusted over a live check, creating a duplicate Shopify theme.
---

# Crema Italia — POC deploy ritual

## Why this exists

On **2026-07-24** a POC9 deploy was ordered on the strength of a change-list line reading
"NOT yet deployed... and not yet pushed to GitHub," written a week earlier. POC9 had in fact
already been deployed and pushed. The result was two identically-named Shopify themes.

The root cause was not missing information. `git log origin/main..HEAD` had already been run
that same session and returned empty — proving half the document false — and the contradiction
went unread. `shopify theme list` was run **after** the push instead of before.

**The rule this encodes: live output beats every document, including `CLAUDE.md` and including
this file. Verify, then act.**

---

## Step 0 — Verify live state (NEVER SKIP, NEVER REORDER)

Run **both**, before anything else:

```bash
shopify theme list
```

```bash
git log origin/main..HEAD --oneline
```

Then answer these in writing before proceeding:

1. **Does a theme for this POC number already exist?** If yes → **STOP.** Do not push. Report to
   Steve: the theme exists, its id, and whether its content matches the repo (verify with a pull
   and diff — see Step 4). Ask whether he wants to refresh it in place (`--theme <id>`) or whether
   the deploy was already done. Creating a second theme with the same name is the exact failure
   this skill prevents.
2. **Are there unpushed commits?** Note them. They must be pushed to GitHub (Step 6.5) — but their
   presence or absence says nothing about deployment state, and vice versa. Never infer one from
   the other.
3. **Does `CLAUDE.md` §10 CURRENT STATE agree with what you just saw?** If not, the document is
   stale. **Correct it in this same pass** — do not deploy on top of a lie and leave it.

> Any document claiming what is deployed — a `docs/POC*_change_list.md` banner, a §9 entry, a
> "NEXT: deploy…" line — is **historical narrative**. Its claims expired the moment someone acted.
> The scheduled coordinator cannot help here: the Shopify CLI is unavailable in its sandbox
> (confirmed 2026-07-25), so its deployment reporting is permanently UNVERIFIED.

## Step 1 — Confirm the batch is committed

`git status --short` must be clean, or the only uncommitted files must be ones you are about to
commit as part of this batch. Never deploy uncommitted work — the repo is the record of what a
theme contains, and a push you cannot reproduce from a commit is unreproducible.

## Step 2 — Validate

```bash
node --check assets/ci-storefront.js
```

```bash
node -e "JSON.parse(require('fs').readFileSync('assets/ci-catalog.json','utf8')); console.log('catalog OK')"
```

```bash
shopify theme check
```

**Baseline:** `theme check` currently reports **15 offenses / 0 errors / 15 warnings**. **0 new
offenses** is the pass condition — not "0 errors." If the baseline has legitimately moved, update
this number here in the same pass.

*Baseline history, because the number moving is normally a red flag and this time was not:* it was
**17 offenses / 2 errors** from POC10 through POC14. The 2 errors were `ImgWidthAndHeight` on the
hero logo and the founder signature. POC15 (2026-08-18) added the missing `width`/`height`
attributes to both while cutting image weight, which cleared them legitimately. Anything that moves
this number should be explainable in one sentence like that one; if it is not, treat it as a
regression rather than a new baseline.

## Step 3 — Push

**New POC number** (the normal case — Step 0 confirmed no collision):

```bash
shopify theme push --unpublished --theme "Crema Italia POC<N> Preview" --json
```

**Refreshing an existing preview:**

```bash
shopify theme push --theme <existing-id>
```

Name the theme to match the POC version it actually holds, per the draft-theme naming rule in
`CLAUDE.md`. A theme whose name lags its contents is what made POC4 look missing in 2026-07-05.

> **Live theme (`150557294761`) is NOT this skill's job.** A live push needs `--allow-live`, is
> outward-facing, and has been blocked by the auto-mode permission classifier (2026-07-24) — hand
> those commands to Steve to run himself. Note the classifier did **not** block a theme *delete*
> (2026-07-25), so do not treat it as a safety net.

## Step 4 — Prove it (do not trust the push output)

Pull the theme you just wrote and diff every file against the repo:

```bash
shopify theme pull --theme <new-id> --path <scratchpad>/verify
```

Then compare all files under `assets config layout locales snippets templates`. Expect **all 39 to
match** (37 → 36 when `assets/ci-founder-dog.jpg` was deleted 2026-08-06, then 36 → 39 with POC13's
three temporary landing-page photos `ci-temp-lp1..3.jpg` — update this number here whenever the
theme's file set legitimately changes). Also re-run `shopify theme list` and confirm there is now
**exactly one** theme with that name.

Note `--path` must point at a directory that **already exists**; the CLI errors out rather than
creating it.

**A `curl` of a `?preview_theme_id=` link is NOT a valid check** — its cookie handling is not a
faithful stand-in for a browser and it will silently return the live coming-soon page instead
(diagnosed 2026-07-06, hit again 2026-07-24). Pull-and-diff is the reliable proof; a real browser
is the only valid visual check.

## Step 5 — Prune old preview themes (keep 3)

**Policy (Steve, POC13): keep at most the three newest POC previews.** Older ones are dead
weight — the store reached 11 themes before the 2026-08-06 cleanup, and Shopify caps a store at
20. A pruned POC is not lost work: every batch is a commit, so it can be redeployed from git if
it is ever wanted back. That is only true if the batch is actually on GitHub, which Step 0
already confirmed (`git log origin/main..HEAD` empty).

Run this **after** Step 4 has proven the new push, so the theme you just deployed is one of the
three you keep. Run it **before** Step 6, because pruning is what creates the stale theme ids
that Step 6.4 sweeps for.

**Selection rule — by construction, not by blocklist.** A theme is a prune candidate only if
**both** hold:
- its name matches exactly `^Crema Italia POC(\d+) Preview$`, and
- its `role` is `unpublished`.

Everything else is protected without needing to be named: the live theme, `Horizon`, the
throwaway `Development (...)` theme, and any hand-named theme like a backup. The `role` test is
what protects against the catastrophic case — a *published* theme that happens to match the
naming pattern is never a candidate. Sort the candidates by POC number descending, keep the
first three, prune the rest.

```bash
shopify theme list --json
```

Compute the KEEP/PRUNE split from that JSON (parse it — do not eyeball the ids).

**Two hard stops:**
1. **Duplicate names halt the prune.** If two themes share a POC name, stop and tell Steve.
   A duplicate is the signature of the 2026-07-24 incident, and silently absorbing it lets the
   duplicate eat two keep-slots and push a real POC out of the window. Resolve the duplicate
   first, then prune.
2. **Get Steve's explicit go before deleting**, listing each theme by **name and id**. Deletion
   is irreversible, and the auto-mode permission classifier does **not** block theme deletes
   (confirmed 2026-07-25) — so nothing else is standing between a selection bug and a real
   theme. This was how the 2026-08-06 cleanup was done and it is the standard here.

```bash
shopify theme delete --theme <id> --force
```

Then re-run `shopify theme list` and confirm the survivors are exactly the three expected.

## Step 6 — Record it, in the one authoritative place

1. **`CLAUDE.md` §10 CURRENT STATE** — the *only* authoritative statement of deployment state.
   Update the table (POC number, theme name, id), the "verified live <date>" stamp, and the
   "What POC<N> is" paragraph. Remove any row that no longer exists.
2. **`CLAUDE.md` §9** — a dated entry: what shipped, what was verified and how, the commit, the
   theme id. This is narrative; state lives in §10.
3. **`docs/POC<N>_change_list.md`** — the build record. **Do not write deployment-state claims
   here.** Point at §10 instead. Stale banners in these files caused the 2026-07-24 duplicate.
4. **Sweep the repo for theme ids that just went stale.** Creating a theme is safe; **deleting
   one silently breaks anything still pointing at it** — so this is where Step 5's prune gets
   paid for. Run:

   ```bash
   grep -rn "15[0-9]\{10\}" --include="*.md" --include="*.cmd" --include="*.json" --include="*.liquid" --include="*.js" . | grep -v node_modules
   ```

   Judge each hit by tense, not by age — and **judge the sentence, not the filename**:
   - **Historical narrative** (`CLAUDE.md` §9 entries, `docs/POC*_change_list.md`) — leave it.
     It describes a past moment and is *supposed* to name a now-dead id.
   - **A file living in `docs/` with a POC number in its name is NOT automatically narrative.**
     Open it and read the sentence around the id. If it says *"POC6 **is** deployed to…"* it is a
     present-tense claim and it rots, whatever the file is called. (2026-08-18: this grep correctly
     surfaced `docs/POC7_kickoff.md` during the POC13 prune — three hits, including deleted theme
     `151440130217` — and it was waved through because the path *looked* like the change-list
     pattern above. The sweep was never the problem; the shortcut was. That file was a spent
     one-shot session prompt and has since been deleted.)
   - **Present-tense claims and anything executable** — fix it. These are the ones that rot:
     `dev.cmd`, the `reconnect-check` skill's expected-theme list, the ⚠️ callouts at the top
     of `CLAUDE.md`, any script or doc that says "the current preview is `<id>`".

   Prefer deleting the id over updating it. A file that names no theme id cannot go stale —
   point at §10 CURRENT STATE instead. That is why `dev.cmd` no longer passes `--theme`.

   *(Added POC13. `dev.cmd` had pinned `--theme 151277174953` since 2026-07-05; POC4–POC9 were
   deleted 2026-08-06 and the launcher broke silently. The `reconnect-check` skill had the same
   id in its expected-theme list, where it would have fired a false "real change" alarm on
   every reconnect.)*
5. `git push` so GitHub matches.

## Step 7 — Hand off

Give Steve the preview URL, tell him to open it in a **real browser** (not curl), and name the
specific things worth checking on-device for this batch.

---

## Done means

- [ ] `theme list` + `git log origin/main..HEAD` run **before** the push, and no name collision
- [ ] Batch committed; validation clean against the documented baseline
- [ ] Pushed; **pull-and-diff proves** all files match; exactly one theme of that name
- [ ] Pruned to the three newest POC previews, on Steve's explicit go, by name+id
- [ ] §10 CURRENT STATE updated and accurate; §9 logged; change list carries no state claims
- [ ] Repo swept for theme ids broken by any theme **deletion** this round (executable files and
      present-tense claims fixed; historical narrative left alone)
- [ ] Pushed to GitHub; preview URL handed over with what to check
