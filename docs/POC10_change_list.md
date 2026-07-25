# POC10 change list — mobile review fixes

Built 2026-07-25 from Steve's mobile review of POC9 on a real device. Five findings were
raised; **three were built, two were deliberately excluded** under the new POC-scope rule
(`docs/production_build_spec.md` §0 — model only what we will render).

> **Deployment state is NOT recorded here.** See `CLAUDE.md` §10 CURRENT STATE — the single
> authoritative block. This file is a build record only.

---

## Built

### 1. Quiz forced a sign-in even when already signed in (the real bug)
**Symptom (Steve):** "If I log in, but have not yet created a profile, when I do create the
profile it ends with me having to sign-in/create-account, instead of saving my profile to my
already logged in account."

**Cause:** `assets/ci-storefront.js` — `chooseQuizMatches()` and `chooseQuizEverything()` called
`openSignin()` **unconditionally**. The sibling `saveProfileChanges()` twenty lines earlier
already guarded on `session.signedIn`; the guard was never propagated to the quiz path.

**Fix:** both functions now check `session.signedIn` first and, when signed in, run the same
actions the post-sign-in handler would have run (`applyProfileAndClose()` / `showEverythingFromQuiz()`
plus `renderAccount()`), returning before any sign-in call. Signed-out behaviour is unchanged —
`pendingQuizAction` is still set and replayed by both `simulateSignIn()` and the
dismissed-modal guest fallback in `closeSignin()`.

**Verified in `theme dev`:** signed in → no sign-in modal, quiz closes, lands on Shop, and the
account Taste-profile card shows the answers ("Light Roast / Fruit & Floral ... Stored to your
account"). Signed out → sign-in modal still opens. Both quiz buttons tested.

### 2. "Tasting Quiz" chip clipped on phones
**Cause:** four chips totalled ~400px against a 375px viewport; the sticky bar is a horizontal
scroller, so the quiz chip — a primary CTA — rendered visibly cut off.

**Fix:** `templates/index.liquid` wraps the word in `<span class="hj-word">Tasting </span>Quiz`;
`assets/ci-storefront.css` hides `.hj-word` inside the existing `max-width:640px` query. Desktop
label unchanged. No JS.

**Verified:** phone renders "Quiz" (chip 61px, all four chips fit, last right edge 355 < 375, bar
no longer overflows). Desktop 1280px still renders "Tasting Quiz".

### 3. Cart line: thumbnail crushed and misaligned on phones
**Symptom (Steve):** "the thumbnail and the description, size and quantity control are smashed up
against the thumbnail, and the thumbnail seems to be lower than it should vs. being aligned with
the description."

**Three distinct causes, all fixed:**
- **Overlap ("smashed"):** the mobile grid column is `48px` but `.cart-line-img` kept its desktop
  `width:64px`, so the thumbnail overflowed its column and overlapped the title by 2px. Thumbnail
  now sized to `48px` at the mobile breakpoint. *(Pre-existing, not introduced by this batch.)*
- **Crushed price/Remove block:** the line has three children but the mobile rule declared only two
  columns, so the third wrapped **into the 48px thumbnail column**. It now spans its own full-width
  row (`grid-column:1 / -1`) as a flex row with a hairline top border.
- **Thumbnail sitting low:** inherited `align-items:center` centred the 48px thumbnail against a
  much taller info block. Mobile now uses `align-items:start`.

**Verified:** thumb 48x48, 13px gap, no overlap, `thumbTop - titleTop = 0`, meta row full-width and
not overflowing. Desktop unchanged (3 columns `64px / 1fr / auto`, 64px thumb, meta right-aligned).

### 4. Pull-to-refresh wiping the session mid-review (testing aid only)
One line: `html,body{overscroll-behavior-y:contain}`, commented in-file as a **testing aid, not a
production model**. Stops an accidental downward swipe at the top of the page from reloading and
destroying the in-memory session/cart. Android Chrome and iOS Safari 16+.

---

## Deliberately NOT built (POC-scope rule)

### Persisting the mocked session to `localStorage` — DECLINED
It would emulate a Shopify customer-session cookie we get for free in production. Modelling
someone else's plumbing. The `overscroll-behavior` line above addresses the testing friction
without pretending to model anything.

### A mock of the checkout promo-code field — DECLINED
Checkout is entirely Shopify's and is not themeable below Plus; we will never render a line of it,
so there is nothing to prototype. **Note the boundary:** the **cart** is 100% ours (theme-rendered,
Shopify supplies only data) and therefore squarely in scope — which is why finding 3 above *was*
built. See `production_build_spec.md` §0.

Steve's related question — hide the field by colour-matching and making it read-only — was advised
against on three grounds: not buildable below Plus (no checkout CSS injection, no readonly hook);
a dark pattern inconsistent with the brand posture that already rejected the quiz auto-launch; and
an accessibility failure (screen readers announce it, keyboard users tab into it). Recommended
instead: amend Store Operating Standards §10, which remains an **open decision for Steve**, ideally
after looking at the real checkout and the Checkout Editor on the live store.

---

## Verification summary
- `node --check assets/ci-storefront.js` — clean; `JSON.parse` of the catalog — clean.
- `shopify theme check` — 17 offenses / 2 errors, **identical to the documented baseline**
  (the two pre-existing `ImgWidthAndHeight` on the hero logo and founder signature). 0 new.
- Driven live in `shopify theme dev` at 375x812 and 1280x900 via DOM geometry (the screenshot
  tool has been unreliable across recent sessions), covering both quiz buttons signed-in and
  signed-out, and a worst-case cart line (qty 2, so the meta row carries three children).
