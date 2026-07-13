# Crema Italia — Production Build Spec (design prompts)

Durable home for decisions about the **real production storefront** (as opposed to the
POC). Created 2026-07-09. These are agreements that should shape the production rebuild
but are NOT POC changes — the POC is a mock and can only document them.

Read alongside: `CLAUDE.md` (§9 log, §10 "NEXT (production build)"), `00_PROJECT_BRIEF.md`
(OneDrive, single source of truth), `docs/POC5_change_list.md` (POC backlog).

---

## READY-TO-USE BUILD PROMPT

When Steve is ready to have Claude Code build the real storefront, paste this:

> We're building the real production storefront now, replacing the POC. Read `CLAUDE.md`
> top to bottom — especially §10's "To resume, read in this order" and the "NEXT
> (production build)" block — plus `docs/production_build_spec.md` and
> `docs/POC5_change_list.md`, and `00_PROJECT_BRIEF.md` in OneDrive. Then propose a
> phased build plan and wait for my OK before writing code. Reuse the POC3/POC4/POC5
> CSS/JS/markup as the design system.

Everything below is what that prompt pulls in.

---

## 1. Data-driven content — the umbrella rule

All content that **grows over time** comes from a Shopify data source and is
merchant-editable with **no developer and no build**. Only rarely-changing content
(founder bio, company story) stays static/hardcoded.

| Content | Production source |
|---|---|
| Products / SKUs | Native Products + variants + `crema_italia.*` metafields (POC's `ci-catalog.json` is the mock stand-in) |
| Roasters | Structured records (metaobject or collection + metafields); POC already models `address`/`phone`/`website` + a `roasters[]` array on bundles |
| Journal | Native Shopify **Blog + Articles** — see §3 |
| Team, Partners | Sections + blocks, or metaobjects — see §2 |
| Featured items | Merchant-selectable |

## 2. About page content architecture (to-do #7)

- **Founder bio** and **"About the company"** → keep **static** (plain section or
  hardcoded). Change rarely.
- **Team** and **Partners** → **merchant-editable** so Steve adds/edits/removes/reorders
  entries himself as the company grows.
- **Recommended mechanism: Shopify sections + blocks.** Build (once) a "Team" section
  whose repeatable block has fields **photo / name / role / bio**, and a "Partners"
  section (**logo / name / type / blurb** — a partner's "role" is a type/category like
  "Italian Freight Forwarder," not a job title). Steve then manages entries in the theme
  editor via "Add block" — drag to reorder, delete, live preview. Matches his mental
  model and is friendliest for a non-technical owner.
- **Decision left open (Steve to lock):** sections+blocks vs **metaobjects**. Prefer
  metaobjects only if Team/Partners grow large or an entry is reused across pages (e.g. a
  team member also authors Journal posts — see §3). Metaobjects live in the store (survive
  theme changes), more database-like, more clinical admin. Roasters are already structured
  this way, so metaobjects are a natural upgrade path. **Recommendation:** start with
  sections+blocks; migrate to metaobjects only if reuse/scale demands it.
- POC state (2026-07-09): Team/Partners cards now show photo · name · role (names/roles
  real, photos + partner name placeholder). Founder/company copy still placeholder pending
  Steve's real language.

## 3. Journal = native Blog + Articles (to-do #8)

- Journal posts are Shopify **Articles** inside a "Journal" blog, authored in admin
  (Online Store → Blog posts). Free: title, author, publish date, featured image, tags,
  rich-text body, SEO, RSS, optional comments.
- Do **not** use metaobjects for the blog — Articles is the purpose-built object.
- **Author linkage:** if team members author Journal posts, that byline reuse is the case
  that tips the Team section (§2) from sections+blocks toward **metaobjects** — a Team
  metaobject entry could be referenced as an Article's author.

## 4. Footer relationship pages — Affiliates / Wholesale / etc. (to-do #9)

- Keep the main nav shopper-focused (Shop · Bottega · Roasters · Journal · About). Inbound
  "how do I work with you" requests go in the **footer**, grouped in a "Company"/"More"
  column, added as they become real: **Affiliates, Wholesale, Careers, Press, Contact**,
  and possibly **Roaster inquiries** (Italian roasters pitching to be carried). Each = a
  simple landing page + application/inquiry form.
- **Naming trap:** distinct from **About → Partners** (operational partners we already
  work with, e.g. the freight forwarder). Footer Affiliates/Wholesale = an inbound program
  for outsiders to JOIN.
- **When:** post-launch growth lever, not launch-critical. Cheap early moves: reserve the
  footer slot + a stub/application page (looks complete, captures interest); know a real
  affiliate program needs **tooling, not theme code** — commission tracking, referral
  links, payouts run through a Shopify app (Refersion / UpPromote / GoAffPro). Theme owns
  only the landing page + application entry point.

## 5. Account architecture — Loop vs native Shopify vs Functions (locked 2026-07-04, extended here)

- **Loop's hosted portal** owns the active subscription's ship-to address + payment method,
  and subscription lifecycle notifications/reminders. Its cancellation flow can host the
  retention "are you sure / offer to stay" prompt.
- **Native Shopify customer accounts** own the general address book + profile settings
  (name/email/password) for one-time orders, order history, order detail, "buy again," and
  marketing-consent (surfaced with the email platform).
- **Shopify Functions + a customer tag/metafield** own the **entitlement** — who currently
  gets the 12% (Founding) / 10% (subscriber) / 0% rate — driven by Loop's subscription
  webhooks. Both the cart discount and the account Membership tile read that tag. This is
  the authoritative downgrade path (a customer can cancel via an email link, never seeing
  any theme UI), so it must be server-side, not session-scoped.
  - **Founding-rate + benefit rule — SEE THE STANDARD (canonical).** The full, current rule lives in
    **Store Operating Standards §3.1 + §4** (`docs/standards/store-operating-standards.md`). Summary:
    Founding Member status is **durable and account-level** (lost only by closing the entire account,
    which releases the numbered slot); the **12% is the founder tier** of the subscriber benefit;
    benefits (discount + shipping offsets) are bound to **≥1 actively-shipping subscription**, with a
    **60-day win-back grace** after pausing-all or cancelling-all, reinstated on resume/re-subscribe.
    **This supersedes the 2026-07-10 "Active/Forfeited" permanent-forfeiture model and the
    `founding_rate_forfeited` tag — do not build those.**
- Carry the POC's data-model precedents into the real `crema_italia.*` schema: roaster
  contact fields, and a structured roaster-linkage field on bundle/composite products (not
  just the single `roaster` reference on standalone SKUs).

## 6. Trust signals + photography (from the 2026-07-09 consumer review)

The 2026-07-09 consumer-centric site review (full findings in `docs/POC5_change_list.md`
item 6) surfaced two items that are **asset-dependent, not POC copy/layout** — they belong
in the production build, not the mock:

- **Tasteful trust signals.** A new brand asking for a subscription benefits from one or two
  quiet credibility markers — a real customer voice, a roaster's pedigree (e.g. Gardelli's
  world-championship palates), press. Must stay on-brand (editorial, NOT star-rating clutter
  or "as seen in" loudness). Add when real proof exists.
- **Real photography.** The entire emotional verdict on the site is partly gated on real
  imagery (Tuscan light, roasting drums, espresso) replacing today's gradient placeholders.
  Per brand standards §3.5: natural light, low saturation, narrow depth of field; never
  generic barista stock. This is the single biggest lever on "is it compelling" and it can't
  be judged or delivered from the mock.

The POC-actionable half of that review (hero rewrite, home resequence, surface founder
story, quiz prominence, early value, nav order) is POC5 work — see POC5 change list item 6.

## 7. Bundles / Tours — administrable BOM builder (REQUIRED — Steve, 2026-07-10)

Tours (and any future bundle) are **Bill-of-Materials SKUs**: a Tour = the box + N component
coffee SKUs + the printed tasting card. The production storefront MUST include an
**admin-managed** way to build these — no developer, no code deploy — so Steve can create a
new Tour by naming it and selecting its component SKUs, and the warehouse can assemble it.

Requirements:
- **Author a Tour by defining its BOM.** Admin picks the component product SKUs (e.g. Gardelli
  Ethiopia + La Sosta Guatemala + Fusari Colombia), the box, and the tasting card. The BOM is
  the single source of truth for the Tour.
- **Browse facets are DERIVED from the components, never hand-entered.** A Tour's Region /
  Roast / Flavor / Caffeine filter values are the **union** of its component SKUs' facets, so
  the Tour is "positive" to a filter when ANY component matches (per-axis; AND across axes —
  the Option A rule modelled in the POC via `component_handles` + `productFacets()`). This keeps
  filtering correct automatically as components rotate — nobody has to remember to re-tag a Tour.
- **Availability is gated by the components.** A Tour is offered only while ALL its components
  are in stock and within their freshness window (the existing Sorpresa freshness-gated rule);
  if a component runs low or ages out, the Tour auto-pauses and returns when stock refreshes.
  This falls out of the BOM automatically.
- **The BOM drives 3PL fulfilment.** Each Tour order must generate an assembly / pick-pack
  instruction for the 3PL: box + each component coffee (by SKU) + tasting card. The component
  SKUs feed BOTH the storefront (facets, availability) AND the warehouse (what to physically
  assemble), and component inventory decrements per Tour sold.
- **Shopify implementation:** model via native Shopify Bundles / a bundle app that supports
  component SKUs + component-inventory tracking, so each component's stock gates the bundle and
  the 3PL receives a per-order BOM packing slip. Bundle facets map to `crema_italia.*`
  metafields derived from the components (or computed in Liquid at render).

Generalises beyond Sorpresa Tours to any composite product. Ties to the POC4 precedent already
logged (a structured roaster-linkage field on bundle/composite products) — extend it to a full
component-SKU BOM.

## 8. Fully responsive — mobile & tablet (REQUIRED — Steve, 2026-07-12)

The production storefront MUST be **fully responsive across phone, tablet, and desktop** —
not desktop-first with mobile as an afterthought. This is a launch requirement, not a
polish item.

- **All three form factors are first-class.** Phone (portrait), tablet (portrait AND
  landscape), and desktop must each be laid out and tested deliberately. Tablet is called
  out explicitly because it is the easy one to miss: it usually inherits the *desktop*
  layout (it sits above common phone breakpoints) while being a *touch* device — the worst
  of both worlds if untested.
- **No hover-only interactions.** Anything that today reveals on `:hover` / `:focus-within`
  (the Shop and Account dropdowns are the live example) must have a **tap-first** path on
  touch — a tap-to-toggle menu or a hamburger nav — because hover doesn't exist on touch.
  The POC6 dead-menu bug (a hover dropdown that stuck closed after a selection, fixed in the
  POC via device-agnostic pointer re-arming) is a symptom of this deeper issue; production
  must not carry a hover-gated menu onto touch at all.
- **Touch targets ≥ ~44px**, no reliance on a cursor, and test on real devices (or true
  device emulation), not just a narrowed desktop window.
- This supersedes nothing above; it is a global constraint on the whole production build.
  The POC remains a desktop-oriented mock and only *documents* this — the responsive build
  happens in production. The existing **full-site mobile review** (CLAUDE.md §10 to-do) is
  the POC-side pass that will surface the specific breakpoints/components needing work
  (known: the header does not collapse to a hamburger on phones; hover dropdowns on touch).
