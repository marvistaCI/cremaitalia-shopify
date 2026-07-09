# POC5 — Change List (working ledger)

Running to-do ledger for the next POC batch (POC5), created 2026-07-09 during a POC4
review session with Steve. Same role as `docs/POC_v4_change_list.md` was for POC4: the
detailed record; the durable summary lives in `CLAUDE.md` §9 (2026-07-09 entry).

Architecture is unchanged from POC3/POC4 — the custom-Liquid SPA (`templates/index.liquid`
+ `layout/theme.liquid`, `assets/ci-storefront.css|js`, baked-in `assets/ci-catalog.json`).

**Two items were already applied this session** (committed 2026-07-09), the rest are the
POC5 backlog.

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

### 1. Notification-preferences stub lines (Option 1 — minimal, instruct not model)
No functional preferences UI. Notification prefs are owned by Loop (subscription
lifecycle) + native Shopify/ESP (marketing consent); transactional order emails are
store-level and not customer-configurable. Add:
- one line to the existing "Profile & addresses" card — email & SMS marketing
  preferences managed there on the live store (native Shopify + email platform);
- one line to the Loop portal slot copy — it covers subscription reminders + delivery
  notifications.
Use the existing `PROD:` / `LOOP:` comment seams. Verify Loop's exact customer-facing
notification toggles against current Loop docs before naming specific controls.

### 2. Membership tile — separate identity from status
Current code conflates two independent things and has no lapsed state:
`(session.foundingMember ? 'Founding Member · No. 087' : 'Active subscriber')`.
- **Founding cohort membership** = permanent honorific (No. 087 of 222), never lost.
- **Subscription status** = Active / Lapsed — this is what gates the discount.
Recommended: keep "Founding Member · No. 087" as the permanent badge AND add an
Active/Lapsed status chip, with conditional copy — Active: "Your Founding rate of 12%
applies across Roccia · Sorpresa · Selezione."; Lapsed: "Resubscribe to restore your
Founding 12%." (badge muted). **Decision pending (Steve):** keep "Founding Member" +
status chip (recommended) vs rename to "Founding Subscriber." The real entitlement
(who currently gets 12/10/0%) is server-side — see item 3.

### 3. Subscriptions tile + cancellation / entitlement flow (WITH POC mock)
No Subscriptions tile today; sign-in hardcodes `subscriber=true; foundingMember=true`;
Loop slot is static.
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

### 4. Recent Orders tile — redesign + instruct (not model) reorder/subscribe
Current rows are prose that wrap badly. Steve's directive: DO NOT build interactive
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

### 5. Multi-photo across all shelves incl. Bottega + detail-page gallery (finger-first)
Agreed: ALL shelf photos, INCLUDING Bottega, support multi-photo. Supersedes the earlier
informal "move the carousel onto the detail page" note.
- Current: roast-shelf tiles (`productCard` → `cardImgSlidesHtml`) have 3 placeholder
  slides + ••• dots, whole tile navigates (`openProduct`), dots carve out via
  `event.stopPropagation()`. This navigation model (Option B) is correct. Bottega tiles
  (`bottegaCard`) and the detail page (`productDetail`, `pd-img`) are SINGLE image — need
  parity.
- **Key UX problem:** the ••• dots are far too small/precise to tap — unhittable with a
  thumb on mobile, which is why Steve never realized photos could change. "Too refined."
- **Interaction to build — TILES:** enlarge the photo-changer into a big forgiving tap
  target — a full-width band (~40px+ tall) across the bottom of the image; tap anywhere in
  the band → advance to NEXT photo, LOOPING first→…→last→first. Keep dots as a position
  indicator (mouse users can still click a specific dot to jump). Band + dots both
  `stopPropagation` (don't navigate). Add SWIPE left/right on the image (touch). Everywhere
  else on the image/tile still navigates to detail. Do NOT make a plain image tap advance
  the photo on tiles (conflicts with navigate-to-detail).
- **Interaction to build — DETAIL PAGE gallery** (richer, no navigate conflict): larger
  main image with swipe + tap left/right halves for prev/next + dots and/or thumbnail
  strip + arrows. This is where deep visual exploration happens.
- Mind ~44px min touch targets; no hover on mobile. Slides are still placeholders
  (front / "Back of bag" / "Label close-up") pending real per-SKU photography.

---

## Deployment note
POC5 is not yet built beyond the two DONE items. When the POC5 batch is ready to deploy,
follow the draft-theme naming rule (CLAUDE.md top callout): push to the preview theme
and rename it to "Crema Italia POC5 Preview" at the same time.
