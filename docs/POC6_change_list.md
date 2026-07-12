# POC6 — Change List (working ledger)

Detailed record for the POC6 batch (2026-07-12), built interactively with Steve on top of
the deployed POC5. Same role as the earlier `POC_v4_change_list.md` / `POC5_change_list.md`:
this is the granular record; the durable summary lives in `CLAUDE.md` §9 (2026-07-12 entry).

Architecture unchanged from POC3–POC5 — the custom-Liquid SPA (`templates/index.liquid`
+ `layout/theme.liquid`, `assets/ci-storefront.css|js`, baked-in `assets/ci-catalog.json`,
`snippets/ci-*`).

All items below were built as live models in the running `shopify theme dev` preview,
verified via DOM inspection (the browser-pane screenshot tool was wedged again this
session), and blessed by Steve before committing.

---

## 1. BUG — Shop / Account dropdown went permanently dead after a selection

**Symptom (Steve):** open the Shop menu, pick a shelf → it navigates and the menu closes
itself (good), but afterwards the Shop menu would no longer open at all.

**Root cause:** `forceCloseDropdown()` (`ci-storefront.js`) hid the menu with a
`menu-force-closed` class and only removed it on a `mouseleave` of the nav item. If the
pointer never left that area (common — the page jumps to top and the trigger sits at the
top of the same column) or on touch (no moving cursor), the class never cleared and the
menu stayed hard-hidden.

**Fix:** re-arm on the FIRST of `mouseleave` **or** `pointermove` off the container **or**
`pointerdown` anywhere outside (a tap elsewhere). Pointer events cover mouse, pen, and
touch, so the menu recovers on PC **and** tablet. One shared helper, so Shop and Account
dropdowns are both fixed. The deeper "hover menus aren't ideal on touch" redesign stays
with the queued mobile review — see `production_build_spec.md` §8.

## 2. WORDING — home Promise heading

`templates/index.liquid`, `#page-home` Promise section: **"Three things we mean."** →
**"We deliver on these promises."** (a reviewer flagged the old line as a sentence
fragment). The separate Promise *page* heading is untouched.

## 3. FILTER REDESIGN — one ribbon + console-on-demand

The biggest item. Replaced the two-object taste UI (a global "profile active" banner +
an always-open "taste console" in the Shop hero) with a single ribbon and an on-demand
editor. **State model:** `savedTaste` (the persisted profile; `null` = no profile),
`activeTaste` (the values the ribbon/console currently represent), `filterOn` (whether the
taste axis is applied to the grids).

- **The ribbon is the single control.** Global (`snippets/ci-profile-banner.liquid`),
  shown ONLY on the Shop + four shelf pages, and ONLY when a profile exists
  (`updateRibbon()`/`renderRibbon()` in `ci-storefront.js`; `showPage()` drives visibility).
  - **No profile → no ribbon** (Steve's call): a first-time roamer sees a clean Shop with
    no taste UI. A profile is created only via the Tasting Quiz or the account page.
  - **Two honest states:** off = "Your profile is not active — all items are shown." + an
    **Apply profile** button (tags shown greyed); on = "Your taste profile is active —
    shelves are filtered to your preferences." + a **Show everything** button. Gold state
    **dot** (filled + halo when active, hollow ring when off), a fine **tricolore** accent,
    and an **Edit profile** link.
- **The console is a modal** (`snippets/ci-taste-console.liquid`), opened from the ribbon's
  **Edit profile** — works identically from Shop or any shelf page. Roast/Flavor/Caffeine
  pills stage changes into `activeTaste`; **the footer appears only once a change is made**,
  offering **Apply** (ephemeral — applied now, NOT saved to the profile) and **Save my
  changes** (persist to the profile AND apply). The old "Clear" link is gone (that job is
  the ribbon's Show-everything toggle). Signed-out customers can **Apply**; **Save** routes
  through sign-in first (as saving always did).
- **BUG fixed in passing:** the quiz's **"Show me everything"** used to flip the profile to
  "active" while showing the whole catalog — the ribbon claimed a filter that wasn't
  applied. Now it captures the quiz answers as the profile but leaves `filterOn` off, so the
  ribbon shows the honest off-state with a one-tap Apply.
- **Shop hero restructured (Steve #4):** the always-open taste console is gone; **Shelf +
  Region filters moved back into the brown hero** (dark-styled pills). Region + Shelf remain
  ephemeral navigation, unchanged in behaviour.
- **Alignment:** the ribbon's status text is vertically centered (fixed the old "upper
  third" wrap issue).

Verified end-to-end via DOM: no-profile→no-ribbon; quiz "everything"→honest off-state (13/13
shown); Apply-profile→filtered + dot fills; Edit→console with synced pills + footer-on-change;
Apply=ephemeral (ribbon shows edit, account still shows old saved profile); Save=persist
(account updates); ribbon present on all four shelf pages and hidden everywhere else.

## 4. BACK-LINKS — always return to where you came from

The SPA already had a history stack (`navStack` + `goBack()`), and almost every back button
used it. Two hardcoded a fixed parent instead: the **roaster profile** ("Show all roasters"
→ always the roasters index) and the **team/partner person** page ("Back to About"). Coffee
→ roaster → back dumped you at the roasters list instead of your coffee. Both now call
`goBack()` and are relabelled **"← Back"** for consistency (accurate whatever the origin).
Verified: coffee→roaster→Back = the coffee; list→roaster→Back = the list; about→person→Back
= about. The cart's "Continue shopping" → Shop is a deliberate forward CTA, left as-is.

## 5. TRICOLORE — fine line, not a chunky block (Steve)

The `.flag-strip` (shared by the header top strip, footer strip, and the new ribbon accent)
went from a 4px colour block to a fine **1px** line, matching the hairline under the main
nav. Global change, so header / footer / ribbon are consistent.
**OPEN:** the header's tricolore still has a 1px `#333` hairline tucked just beneath it (a
POC5 sticky-edge fix); with the tricolore now 1px it doubles up slightly. Recommended to
drop it for a single clean line — awaiting Steve's nod.

## 6. RIBBON SPARKLE — tricolore accent + gold state dot (Steve approved)

Rather than a decorative image (ruled out by brand standards §3.5/§6), the ribbon's "sparkle"
is a fine tricolore accent line + a Crema-gold state dot that fills (with a soft halo) when
the profile is active and reads as a hollow ring when off. Both earn their place by meaning
something.

---

## Production decision recorded (not a POC change)

`production_build_spec.md` **§8 — Fully responsive (mobile & tablet), REQUIRED** (Steve,
2026-07-12): the real store must be first-class on phone, tablet (portrait + landscape),
and desktop, with **no hover-only interactions** on touch, ≥44px targets, tested on real
devices. Tablet flagged as the easy-to-miss case. The POC6 dropdown bug is the symptom.

## Follow-ups / notes

- **Dead CSS** left from the old taste UI (`.taste-console` + `.tc-head/.tc-label/.tc-note/
  .tc-foot`, `.save-profile`, `.filter-bar`, `.filter-divider`, `.pf-hint`) is now unused —
  safe to sweep in a small follow-up.
- **Header `#333` hairline** under the tricolore — see item 5, pending Steve.
- **NEXT (Steve, 2026-07-12):** discuss the mobile-ready POC — folds into the queued
  full-site mobile review (`CLAUDE.md` §10; `production_build_spec.md` §8).

## Deployment note

Committed to git + local `shopify theme dev` only. **NOT yet deployed** to a Shopify preview
theme — when Steve says so, follow the draft-theme naming rule (push + rename to
"Crema Italia POC6 Preview").
