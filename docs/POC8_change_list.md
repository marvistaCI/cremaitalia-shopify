# POC8 change list — make the POC's discounts honest to Store Operating Standards v1.2

**What POC8 is.** A narrow batch that closes the POC-vs-Standard drift created when the Store Operating
Standards went to **v1.2** (no-stacking, highest-wins `MAX` discount model). It is *not* a feature batch:
it fixes exactly the three logged divergences (D1–D3 in `docs/POC_drift_from_standards.md`) plus one watch
item, then deploys a new POC8 preview theme.

**Status:** spec below is being executed by a separate Claude Code session (started 2026-07-13). **That
session owns the code changes** (`assets/ci-storefront.js`, `templates/index.liquid`) and the drift-ledger
strike. This file is the batch spec + a ledger for what actually landed — fill in "What landed" at the end
when the run completes.

> **Coordination note.** This file was authored by a *different* session than the one running the fix, and
> was left uncommitted on purpose to avoid a `.git/index.lock` collision while the fix session runs git.
> Commit it once the fix session has finished and the tree is quiet. Do not run broad git commands
> (`git add -A`, `git reset`) while two sessions share this checkout — see `CLAUDE.md` "Two Code sessions,
> one repo."

---

## The prompt (as pasted)

> **POC8 — make the POC's discounts honest to Store Operating Standards v1.2 (no-stacking MAX).**
>
> **Before touching any file:** confirm no other Claude Code session is editing this checkout right now
> (the "two Code sessions, one repo" rule in `CLAUDE.md`). If unsure, run the `reconnect-check` skill and
> check `git status`. Work only if the tree is clean and you're the sole writer.
>
> **Read first:** `docs/standards/store-operating-standards.md` §3 + §3.1 (the discount rules),
> `docs/POC_drift_from_standards.md` (rows D1–D3 + the "watch" item are your work list), and `CLAUDE.md`
> §9's latest entries for context. The Standard wins over any POC code that contradicts it.
>
> **The rule to implement:** a customer never receives two discounts at once — the applied rate is the
> **single highest they qualify for** (`MAX`), never a sum. Compute it **per line item**, because
> different shelves qualify for different discounts:
> - Founder/subscriber rate — `0.12` (founder) or `0.10` (regular) — applies to a line only when the
>   customer is **signed in + has an active subscription** *and* the line's shelf ∈ {roccia, sorpresa,
>   selezione}.
> - First-time `0.05` — applies to a line when the customer is **signed in + is a first-time buyer**
>   *and* the shelf ≠ bottega. (Note: this must work for a signed-in first-time **non-subscriber** too —
>   today's code only enters the discount branch for subscribers, which is a latent miss.)
> - `line_rate = MAX(applicable candidates, else 0)`; `discount = Σ (line_total × line_rate)`.
>
> **Fixes (all in the POC — this is mock code, keep the design system):**
> 1. **D1** — `assets/ci-storefront.js` `renderCart()` discount math: replace the "subscriber rate THEN
>    add 5%" summing with the per-line `MAX` above. Present the summary line honestly (no
>    "12% + first-order 5%" concatenation) — e.g. a single "Your discount (best applicable per item)"
>    line, or the founder/subscriber label when that's what applied.
> 2. **D2** — the guest `cart-banner` copy: reword so 5% and 10/12% read as *alternatives* (you get the
>    higher), not additive. Remove "plus."
> 3. **D3** — `templates/index.liquid` FAQ "How do subscriber discounts work?": rewrite the answer —
>    remove "stacks" and "15%"; state that the customer receives the single highest applicable discount
>    (a first-time founder still gets 12%, not 17%).
> 4. **Watch item** — review `ci-storefront.js:~436` ("plus subscriber benefits across the site");
>    reword if it implies stacking.
> - Honor the brand rules on all new copy: **no em-dashes** (§6 replacement rule), no exclamation marks,
>   editorial voice.
>
> **Then:** remove the now-resolved `// DRIFT:` markers, and in `docs/POC_drift_from_standards.md` move
> D1/D2/D3 to the **Resolved** section (strike, don't delete) noting the commit.
>
> **Verify:** `shopify theme check` (expect 0 errors), and drive the cart in `shopify theme dev` — confirm
> a founding subscriber with a first-time flag shows **12%**, an Offerta line shows **5%** (first-time
> only), and a non-subscriber first-timer shows **5%**. Commit + push.
>
> **Deploy (render the new POC):** push to a **new unpublished** theme named **"Crema Italia POC8
> Preview"** (`shopify theme push --unpublished --theme "Crema Italia POC8 Preview" --json`), per the
> draft-theme-naming rule. Leave POC7 (`151449862313`) and the live coming-soon theme (`150557294761`)
> untouched. Record the new theme id + preview/editor URLs in a `CLAUDE.md` §9 entry, update §10's
> current-state block to POC8, and add a one-line cross-surface note to `Coordination/DECISIONS_LOG.md`.

---

## Scope guardrails

- **In scope:** D1 (cart MAX math), D2 (cart banner copy), D3 (FAQ copy), the `:436` watch item, the
  drift-ledger strike, and the POC8 deploy.
- **Out of scope (nothing to do):**
  - **Sorpresa 250g matrix change** — the POC's prices are baked/mocked, so there's no live pricing math
    to correct.
  - **Referral → TBD** — never modeled in the POC.
  - **Storefront password** — stays OFF (friend-testing continues).
- **One decision:** the prompt assumes a **new POC8 theme**. To update POC7 in place instead, deploy with
  `--theme 151449862313`.

## Expected MAX behavior (acceptance checks)

| Customer state | Roccia/Sorpresa/Selezione line | Offerta line | Bottega line |
|---|---|---|---|
| Founding subscriber, first-time | **12%** (not 17%) | **5%** (first-time only) | 0% |
| Regular subscriber, returning | 10% | 0% | 0% |
| Signed-in first-time non-subscriber | 5% | 5% | 0% |
| Guest | 0% | 0% | 0% |

## What landed (2026-07-13)

- **Commit:** `6b0a8ed` — "POC8: no-stacking MAX discounts, honest to Store Operating Standards v1.2"
  (`assets/ci-storefront.js`, `templates/index.liquid`, `docs/POC_drift_from_standards.md`). Pushed to
  GitHub (`origin/main`). Docs follow-up committed separately (CLAUDE.md §9/§10, this file, ledger hash).
- **POC8 Preview theme:** id **`151454122153`**, name "Crema Italia POC8 Preview", role unpublished.
  Preview `https://crema-italia.myshopify.com?preview_theme_id=151454122153` ·
  Editor `https://crema-italia.myshopify.com/admin/themes/151454122153/editor`. POC7 (`151449862313`)
  and live coming-soon (`150557294761`) untouched (confirmed via `shopify theme list`).
- **D1 (cart MAX math):** DONE — `renderCart()` now computes a per-line `MAX` (founder/subscriber
  12/10% on Roccia/Sorpresa/Selezione, first-time 5% on all shelves but Bottega), `discount = Σ(line ×
  rate)`. Latent miss fixed: signed-in first-time non-subscribers now get 5%. Honest single summary label.
- **D2 (guest banner):** DONE — reworded to "a one-time 5% first-purchase offer, or 10% off … with a
  subscription. You receive the higher of the two, never both." No "plus."
- **D3 (FAQ):** DONE — removed "stacks"/"15%"; states the single highest applicable discount (first-time
  founder still 12%, not 17%).
- **Watch `:436`:** DONE — reworded to "10% off every shipment and free shipping, your standing
  subscriber benefit on Roccia, Sorpresa, and Selezione."
- **Drift ledger D1/D2/D3 + watch → Resolved:** DONE (struck, not deleted; `// DRIFT` markers removed).
- **Acceptance (verified live in `shopify theme dev`):** founding subscriber + first-time → 12% eligible
  / 5% Offerta (a $38 Roccia + $21 Offerta + $34 Bottega bag → −$5.61, not 17%); non-subscriber
  first-timer → 5% non-Bottega (−$2.95); guest → 0%. Regular-subscriber 10% confirmed by a node harness
  of the exact algorithm. `shopify theme check`: 0 new offenses (2 pre-existing `img`-attribute errors
  only). No em-dashes / exclamations in the new copy.
- **Theme choice:** used the prompt's default (a NEW POC8 theme), not an in-place POC7 update.

---

*Created 2026-07-13. Companion to `docs/POC_drift_from_standards.md` (the drift ledger) and
`docs/standards/store-operating-standards.md` §3 (the rule being honored).*
