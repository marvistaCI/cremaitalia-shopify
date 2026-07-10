# POC5 — Change List (working ledger)

Running to-do ledger for the next POC batch (POC5), created 2026-07-09 during a POC4
review session with Steve. Same role as `docs/POC_v4_change_list.md` was for POC4: the
detailed record; the durable summary lives in `CLAUDE.md` §9 (2026-07-09 entry).

Architecture is unchanged from POC3/POC4 — the custom-Liquid SPA (`templates/index.liquid`
+ `layout/theme.liquid`, `assets/ci-storefront.css|js`, baked-in `assets/ci-catalog.json`).

**Three items were already applied this session** (committed 2026-07-09), the rest are the
POC5 backlog.

---

## ▶ NEXT SESSION — START HERE (updated 2026-07-10)

**Landing page: LOCKED & BUILT (2026-07-10, Steve's sign-off).** The home-page rework
(item 6) was built as a live model in the POC and blessed by Steve — item 6 now holds the
final landing spec. **Remaining POC5 backlog = items 1–5:** account page (notification
stub, Membership identity/status, Subscriptions + cancellation mock, Recent Orders
redesign) and the detail-page-only photo gallery. Those are the next things to build.
Production-dependent findings (real trust signals, photography) remain in
`docs/production_build_spec.md` §6.

Resume order: this file → `docs/production_build_spec.md` → `CLAUDE.md` §9/§10.

---

## DONE this session (2026-07-09)

- **Toast sliver fix.** `.toast` in `assets/ci-storefront.css` now uses
  `opacity:0;visibility:hidden` at rest (and `opacity:1;visibility:visible` on `.show`).
  Previously the empty notification pill's hide transform (`translateY(120%)`) didn't
  clear its `bottom:1.5rem` offset, so a ~15px brown sliver peeked at the bottom-center
  of every page. Now fully hidden at rest, still slides + fades in on a real message.
- **About page — team/partner roles.** Added a `.person-role` line under each Team and
  Partners card (picture · name · role). Real roles: Lucia Calo' — Italian Operations
  Manager; Asia Chirdo — Italian Board Advisor; Lauren Roberts — US Operations Manager;
  Partner 1 (placeholder name) — Italian Freight Forwarder. New `.person-card .person-role`
  CSS rule. Names/roles are real; photos + the partner name remain placeholders.
- **Home "See the Tour" now goes straight to the tour detail.** The home Featured Tour
  button (`templates/index.liquid`) pointed at `showPage('sorpresa')`, landing the user on
  the Sorpresa shelf where a second "View Tour" button was needed — a redundant step. Now
  `openProduct('tour-ditalia-1')`, going directly to the Tour d'Italia 1 detail page.

---

## POC5 BACKLOG (account page unless noted)

All account-page items are in `renderAccount()` in `assets/ci-storefront.js`.

### 1. Notification-preferences stub lines — BUILT 2026-07-10 (Option 1, instruct not model)
**BUILT:** added to the account "Profile & addresses" card — "Email & SMS marketing
preferences are managed here too." (+ PROD comment: native Shopify + email platform;
transactional order emails are store-level, not a customer toggle) — and to the Loop slot
copy — "…plus your subscription reminders and delivery notifications…". No functional
preferences UI, per plan.

Original spec — No functional preferences UI. Notification prefs are owned by Loop (subscription
lifecycle) + native Shopify/ESP (marketing consent); transactional order emails are
store-level and not customer-configurable. Add:
- one line to the existing "Profile & addresses" card — email & SMS marketing
  preferences managed there on the live store (native Shopify + email platform);
- one line to the Loop portal slot copy — it covers subscription reminders + delivery
  notifications.
Use the existing `PROD:` / `LOOP:` comment seams. Verify Loop's exact customer-facing
notification toggles against current Loop docs before naming specific controls.

### 2. Membership tile — BUILT & LOCKED 2026-07-10 (two states: Active / Forfeited)
**LOCKED — the Founding Member mechanic (Steve, 2026-07-10):** "Founding Member" is the
PERMANENT honorific (No. 087, never lost). The 12% is the *Active Subscriber Discount* —
active only while subscribed. **Two states, no grace period:** Active Founder (12%) /
Forfeited (10%). **Pause preserves the rate** (indefinitely, no charge) and **Loop dunning
protects failed cards** — so the ONLY way to forfeit is a deliberate full cancel after being
offered Pause. Forfeiture is **permanent** (return at 10%, never 12% again); the No. 087
honorific is kept forever, muted, as the quiet pride/regret cue. Why it won't anger founders
into permanent exit (Steve's worry): the 12-vs-10 delta is tiny (~$10/yr) so it's a *pride*
good, and Pause + tiny stakes + always-welcome-back + up-front disclosure remove every
"surprise / punished-for-nothing" failure mode. The earlier grace-period/at-risk idea was
**dropped** — Pause does that job better and simpler. Naming: kept **"Founding Member" +
status chip** (NOT "Founding Subscriber").
**BUILT (POC mock):** Membership tile renders both states, driven by `session.foundingForfeited`;
cart entitlement honors it (`foundingRate = foundingMember && !foundingForfeited` → 12% else 10%).

Original rationale — current code conflated two independent things and had no lapsed state:
`(session.foundingMember ? 'Founding Member · No. 087' : 'Active subscriber')`.
- **Founding cohort membership** = permanent honorific (No. 087 of 222), never lost.
- **Subscription status** = Active / Lapsed — this is what gates the discount.
Recommended: keep "Founding Member · No. 087" as the permanent badge AND add an
Active/Lapsed status chip, with conditional copy — Active: "Your Founding rate of 12%
applies across Roccia · Sorpresa · Selezione."; Lapsed: "Resubscribe to restore your
Founding 12%." (badge muted). **Decision pending (Steve):** keep "Founding Member" +
status chip (recommended) vs rename to "Founding Subscriber." The real entitlement
(who currently gets 12/10/0%) is server-side — see item 3.

### 3. Subscriptions tile + cancellation / entitlement flow — BUILT & LOCKED 2026-07-10
**BUILT (POC mock):** the account "Manage your subscription" area renders a subscription
summary (Gardelli — Ethiopia Bombe · 250g · every 4 weeks · next ships 2026-07-20) with
**Pause** / **Cancel subscription**. Cancel opens the **pause-first warning** ("As a Founding
Member, your 12% is active only while you subscribe. Pause instead and keep it… Cancel and
return at 10%") offering **Pause and keep my 12%** / **Cancel anyway**. Pause → paused state,
rate preserved (12%). Cancel anyway → `confirmForfeit()` sets `foundingForfeited`, Membership
tile flips to Forfeited (10%), cart discount follows. No active sub → **Resubscribe** (returns
at 10% while forfeited). Delivered quietly per brand (hairline box, gold accent, no alarm
colour). `PROD`/`LOOP` seams note that in production this whole area is Loop's hosted portal
and the entitlement is a Shopify Function reading a one-way customer tag flipped by Loop
webhooks — see `docs/production_build_spec.md` §5 for the locked entitlement rule.

Original spec — no Subscriptions tile existed; sign-in hardcoded `subscriber=true; foundingMember=true`;
Loop slot was static.
- **Subscriptions tile** (native theme): summary of active subscriptions (e.g. "1 active
  — Gardelli Ethiopia, every 4 weeks, next ships 2026-07-20") + a "Manage" button into
  the Loop portal slot. Tile is native; the subscription DATA is Loop-sourced.
- **Cancellation guard:** cancelling the LAST active subscription warns "Are you sure?
  You'll lose your Founding 12% (or 10%)." Cancel-then-resubscribe = active-count never
  hit zero = no downgrade.
- **Ownership split (important):** the cancel action + retention "are you sure/offer to
  stay" prompt can live in LOOP's cancellation flow. But the entitlement consequence
  (status → Lapsed, discount revoked, Membership tile updates) is NOT Loop — it's a
  Crema rule enforced server-side by Shopify Functions + a customer tag/metafield
  (e.g. `active_subscriber` / `founding_rate`), driven by Loop's subscription webhooks
  (cancelled/created → flip tag). The cart discount AND the Membership tile read that
  tag. Entitlement is state-scoped (do you currently have ≥1 active sub), not
  browser-session-scoped. Also: "cancelled" in Loop often means "won't renew" — customer
  stays Active until the paid period ends, so Lapsed may lag the cancel click.
- **POC mock (build it, per Steve):** a "Cancel subscription" button in the Subscriptions
  tile fires the "Are you sure? You'll lose your 12%" confirm; on confirm, flip the
  session to lapsed (`subscriber=false`) and re-render the Membership tile to its
  muted/Lapsed state — to demonstrate the intended production Loop+Functions behavior
  without a real Loop portal. Label clearly with `PROD:` / `LOOP:` seams.

### 4. Recent Orders tile — BUILT 2026-07-10 (redesign + instruct, not model)
**BUILT:** replaced the wrapping prose lines with clean rows via `orderRow()` — "Order #1042"
(left) · "$77.70" (right, non-wrapping) · "Tour d'Italia 1 · 2026-06-12" muted subtitle ·
per-row "Order again" link · a "Show all orders" footer link. Row-click / Order again / Show
all orders fire instructional preview toasts (instruct-not-model); a PROD comment in the card
documents the real native-Shopify flow (order detail, reorder, Roccia→selling_plan/Loop nudge,
order history) and the not-1:1 reorder caveat. Uses "Order #", not "invoice".

Original spec — current rows are prose that wrap badly. Steve's directive: DO NOT build interactive
mocks — INSTRUCT (descriptive stub copy + `PROD:`/`LOOP:` seams), like the Loop slot.
- **BUILD (visual):** clean non-wrapping rows — `Order #1042 · 2026-06-12 · $48.00`,
  order number left, amount right-aligned, item/roaster a compact subtitle; each row a
  tappable link. Add a "Show all orders" link at the bottom.
- **INSTRUCT / DOCUMENT (no working interactions):**
  - row click → native Shopify ORDER DETAIL page on the live store (an order may hold
    multiple line items). Do NOT build a fake invoice page. Use "Order #" (Shopify order
    number), NOT "invoice" (a different Shopify/draft-order concept).
  - "Order again" per row → production re-adds that order's line items to cart (native
    cart; Shopify also has native "Buy again").
  - "Make this a subscription" → Roccia-shelf items only; production re-adds with a
    `selling_plan` → Loop hand-off.
  - discount nudge → explicit copy that ordering one-time leaves 10% (12% Founding) +
    free shipping behind (the conversion lever; the messaging is ours).
  - "Show all orders" → native Shopify order-history page.
- Keep order sample data minimal in `ci-catalog.json` (2–3 rows); don't invent a rich
  orders schema. Order history / detail / order-again are native Shopify customer-accounts
  territory (same bucket as the "Profile & addresses" split, 2026-07-04).
- **Production flag (note in spec, skip in POC):** reorder isn't always 1:1 — a coffee may
  have rotated out, sold out, or changed price; production "Order again" needs a graceful
  "no longer available — here's a similar one" path.

### 5. Multi-photo ONLY on the detail page — BUILT & LOCKED 2026-07-10 (tiles single-photo)
**BUILT 2026-07-10:** removed the tile carousel entirely (`cardImgSlidesHtml` + `cycleCardImg`
+ the `.card-img-slide/-dots/-dot` CSS) so `productCard()` renders a single image on every
shelf like `bottegaCard()` — clicking a tile just opens the product (Option B). Built the
detail-page gallery (`pdGalleryHtml`/`pdGallery`/`pdGalleryTo`/`pdGalleryTap`/`initPdGallery`,
replacing `productDetail`'s single `pd-img`): a main image with prev/next **arrows**, **tap the
left/right half** to change, **swipe** on touch, and a **thumbnail strip** (active thumb
gold-outlined), all looping. Same gallery for ALL shelves incl. Bottega. Slides are still
placeholders (front / "Back of bag" / "Label close-up") pending real per-SKU photography.

**Revised decision (Steve, 2026-07-09):** multi-photo browsing lives ONLY on the product
detail page. Top-level tiles — EVERY shelf, roast shelves AND Bottega — show a single,
clean photo with NO dots and NO carousel. The detail-page gallery is the same for every
product regardless of which shelf/surface led there (Shop, shelf page, roaster page,
Bottega). This supersedes the earlier plan of a finger-first carousel ON the tiles — the
••• dots were too small to hit, and even enlarged they add ambiguity (change photo vs open
product) on a browsing surface. Tiles are teasers; deep visual exploration happens in one
consistent place, the PDP.
- **REMOVE from tiles:** the existing tile carousel — `cardImgSlidesHtml()` and its dots
  (`.card-img-slide` / `.card-img-dots` / `.card-img-dot`, `window.cycleCardImg`) — so
  `productCard()` renders a single image like `bottegaCard()` already does. Whole tile still
  navigates to detail (Option B). No photo-changer of any kind on tiles.
- **BUILD on the detail page only** (`productDetail`, replacing the single `pd-img`): a real
  gallery for ALL shelves — larger main image with SWIPE + tap left/right halves for
  prev/next + dots and/or a thumbnail strip + arrows. Finger-first targets (~44px min), no
  hover dependency (mobile). This is the one place multi-photo exists.
- Photos are still placeholders (front / "Back of bag" / "Label close-up") pending real
  per-SKU photography.

### 6. Home page / landing — LOCKED & BUILT 2026-07-10 (from consumer review 2026-07-09)

**BUILT & LOCKED (2026-07-10, Steve's sign-off) — this is the POC5 landing spec.** New
`#page-home` in `templates/index.liquid` (+ styles in `assets/ci-storefront.css`,
`jumpHome()` in `assets/ci-storefront.js`, new asset `assets/ci-signature.png`):
- **Hero:** Steve's two questions ("Do you love Espresso, Italy, and the Italian Bar
  (Café) culture? Or are you simply looking for delicious, fresh coffee beans?") as the
  lead, then the payoff H1 **"Benvenuto — welcome in."** No CTA button in the hero. Logo
  enlarged (~264px desktop / 176px mobile), top gap trimmed, words given air, balanced
  top-to-bottom.
- **Sticky jump-chips** under the header: Our story · Roasters · Shelves · Promise ·
  **Tasting Quiz** (smooth-scroll; the quiz chip opens the quiz modal).
- **Story-first sequence:** hero → **"A full confession"** (Steve's first-person founder/
  decaf origin story) with his **espresso-recolored signature** + "Steve Roberts,
  Founder" → **"Curated, never aggregated"** model + "Email me here" (mailto
  `roasters@cremaitalia.com`) → **"The four coffee shelves"** (intro sentence + cards) →
  "Your first purchase is our introduction" callout → single **Begin with a Sorpresa
  Tour** button → **"Still unsure?"** with an inline **three-question quiz** text link →
  **Roasters** → **Promise**.
- **Featured Tour block removed** from home.
- **QUIZ AUTO-LAUNCH REMOVED (brand decision, locked):** the first-visit auto-popping quiz
  modal was judged a mild gimmick inconsistent with the anti-dark-pattern brand. The quiz
  is now invitation-only (sticky "Tasting Quiz" chip + the "Still unsure?" inline link);
  the `ci_quiz_seen` auto-launch in `boot()` was removed.
- **CTA hierarchy (locked):** primary path = Sorpresa (one gold button); quiz = quiet
  inline link. **Roccia gets NO home CTA** — it is the second sale, earned on roaster/shelf
  pages.
- Copy edits applied: **Selezione** spelling, *un caffè* italicised (Italian), gift-sentence
  grammar, "Italian roasting at its finest," em-dashes. Signature is the ONLY handwritten
  element on the site (kept scarce for impact); it's a soft phone-photo — a flat scan could
  sharpen it later if wanted.

Rationale — the consumer review that drove it — below.

From a first-time-visitor site comb. **Overall:** the brand voice + business model are the
site's biggest asset (honesty / anti-dark-pattern stance, the Tour→subscription journey,
Italian authenticity, characterful roaster bios, freshness rigor — PRESERVE these). The gap
is the **first screen** and **home-page sequence**: it front-loads the four-shelf taxonomy
before the emotional "why," and the hero leads with brand jargon over visitor benefit.
Note: a full "is it compelling" verdict is partly gated on real photography (all images are
gradient placeholders today).

POC5-actionable copy/layout fixes (ranked):
1. **Rewrite the hero to lead with benefit + plain language.** Today: H1 "Meet our curated
   group of Italian Roasters and their roasts" (about us, not about the visitor); CTAs
   "Begin with a Sorpresa Tour" / "Build a Roccia Subscription" (invented jargon before
   it's defined). Lead instead with the real hook — e.g. "The coffee Italians actually
   drink — imported whole-bean from a handful of Italy's best small roasters, exactly as
   they seal it." Keep one primary CTA plain ("Find your coffee" / "Take the 3-question
   quiz"); let branded shelf names appear once explained. **Draft the new hero copy WITH
   Steve first — it's his voice; this is the linchpin.**
2. **Reorder the home page: story before taxonomy.** Current: Hero → Four Shelves → Tour →
   Roasters → Model → Promise → Quiz. Suggested: Hero → the model/why (curated, unchanged,
   the Italians-drink-it hook) → meet the roasters → how it works (shelves + Tour→
   subscription path) → Promise → Quiz.
3. **Surface the founder / origin story.** "The decaf that started Crema Italia" (Val
   d'Orcia) is a strong origin hook currently buried in a roaster blurb; the founder tile is
   literally "copy pending." Write an honest, specific founder/origin story as the emotional
   anchor. (Depends on Steve's real founder copy — already tracked as an open item.)
4. **Make the quiz reachable for returning visitors.** Auto-launches once for first-timers
   (good), but the on-page entry is buried at the very bottom and anyone who dismissed it
   has no easy way back. Pull the entry point up; it doubles as the plain-language hero CTA
   in #1.
5. **Early value/pricing reassurance.** The strong value story (subscriber 10% + free
   shipping, 15% on a first order, no minimum, cancel anytime) is only discovered deep in.
   A light touch belongs near the top.
6. **Nav priority:** nav is Shop · Bottega · Roasters · Journal · About — merch sits ahead
   of the roasters who are the brand's soul. Consider Shop · Roasters · Journal · About ·
   Bottega.

Deferred to production (not POC copy/layout): tasteful trust signals (real customer voices,
credibility markers) and real photography — see `docs/production_build_spec.md` §6.

---

### 7. Tour / bundle BOM filtering — BUILT 2026-07-10 (Option A: union of components)
**BUILT:** a Tour is a Bill-of-Materials SKU (box + component coffees + card). Added
`component_handles` to the Sorpresa Tour in `ci-catalog.json` and `productFacets()` in
`assets/ci-storefront.js`: a bundle's Region / Roast / Flavor / Caffeine facets are the UNION
of its component coffees' facets, so the Tour is "positive" to a filter if ANY component
matches (per-axis; AND across axes — **Option A**, Steve 2026-07-10). Filter logic now uses
membership (`inFacet`) on comma-joined multi-value data-attributes; the old `any` wildcard
tags were dropped. The Tour card shows an "Includes Emilia-Romagna · Toscana" cue. Verified
live: the Tour appears under **Emilia-Romagna** (contains a Gardelli) and is correctly hidden
under **Decaf** (no decaf component). **Production requirement:** an administrable BOM builder
— see `docs/production_build_spec.md` §7.

## Deployment note
**All POC5 build items are complete (2026-07-10).** When ready to deploy, follow the
draft-theme naming rule (CLAUDE.md top callout): push to a draft theme and rename it
"Crema Italia POC5 Preview" at the same time. Currently committed to git + local dev only;
not yet pushed to a Shopify preview theme.
