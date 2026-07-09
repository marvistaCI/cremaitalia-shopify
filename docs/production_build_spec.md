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
