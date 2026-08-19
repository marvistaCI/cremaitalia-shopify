# Crema Italia — Production Build Spec (design prompts)

Durable home for decisions about the **real production storefront** (as opposed to the
POC). Created 2026-07-09. These are agreements that should shape the production rebuild
but are NOT POC changes — the POC is a mock and can only document them.

Read alongside: the three **Standards** (`docs/standards/` — Brand, Store Operating **v1.3**,
Collaboration — the canonical rules), `docs/POC_drift_from_standards.md` (where the POC knowingly lags
the Standards — must not be missed), `CLAUDE.md` (§9 log, §10 "NEXT (production build)"),
`00_PROJECT_BRIEF.md` (OneDrive, single source of truth), `docs/POC5_change_list.md` (POC backlog).

---

## READY-TO-USE BUILD PROMPT

When Steve is ready to have Claude Code build the real storefront, paste this:

> We're building the real production storefront now, replacing the POC. The canonical rules
> live in the three Standards under `docs/standards/` (Brand, Store Operating v1.3,
> Collaboration) — read those first and treat them as authoritative over the POC. Then read
> `docs/POC_drift_from_standards.md` (every place the POC knowingly diverges from the
> Standards — do not carry that drift into production), and `CLAUDE.md` top to bottom —
> especially §10's "To resume, read in this order" and the "NEXT (production build)" block —
> plus `docs/production_build_spec.md` and `docs/POC5_change_list.md`, and
> `00_PROJECT_BRIEF.md` in OneDrive. Then propose a phased build plan and wait for my OK
> before writing code. Reuse the POC3/POC4/POC5 CSS/JS/markup as the design system, but where
> the code contradicts a Standard, the Standard wins (see the drift ledger).

Everything below is what that prompt pulls in.

---

## 0. POC scope — model only what we will render (LOCKED — Steve, 2026-07-25)

**The rule.** The POC models **only the surfaces we will write code for** in production. Anything
Shopify supplies and we have no code control over is **not** modelled — building a mock of someone
else's control teaches us nothing and costs real time. **The single exception:** model it if its
absence *blocks testing the POC itself*, and then only as a testing aid, labelled as such in a code
comment so nobody mistakes it for a production design.

**The boundary that actually trips people up — cart vs checkout:**

| Surface | Who renders it | In POC scope? |
|---|---|---|
| **Cart** (`/cart`, cart drawer) | **Ours.** `templates/cart.liquid` / a cart section we write. Shopify supplies only the *data* (Cart AJAX API, `cart` Liquid object) — zero presentation. | **YES.** Layout, thumbnails, qty stepper, Remove, free-ship progress bar are all hand-built, and the POC CSS carries forward as the design system. |
| **Checkout** | **Shopify's.** Not themeable below Plus. We render none of it. | **NO.** Never model it — including the promo-code field (see §10 of the Store Operating Standard and the pending amendment). |
| **Sign-in / account pages** | **SHOPIFY'S — settled by the platform, verified 2026-07-25.** A store created today runs **new customer accounts only** (no classic option exists); `/account` redirects off-domain to `shopify.com/<store-id>/account`. Extensible only via customer-account UI extensions. | **NO — stop modelling it.** The POC's account page (Membership tile, founder number, taste-profile card, Loop portal slot, Recent Orders) is not buildable in Liquid and has been modelling a surface we do not own. Do not extend it further. **The business rules are unaffected** — durable founder status, the honorific, and the 60-day grace live in Store Operating Standards §3.1/§4. What changes is the rendering surface and technique; scope UI extensions before rebuilding any of it (CLAUDE.md §10). |

*Worked examples from the 2026-07-25 mobile review:* the broken mobile cart-line grid **was** fixed
(ours, and the CSS ships to production); persisting the mocked sign-in session to `localStorage`
was **declined** (it emulates a Shopify session cookie we get free); a mock of the checkout
promo-code field was **declined** (pure checkout). The one testing-aid exception taken was a single
`overscroll-behavior-y:contain` CSS line, to stop an accidental pull-to-refresh wiping a tester's
in-memory session mid-review.

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
- **LOCKED (Steve, 2026-07-13): sections + blocks.** Team/Partners are managed in the
  theme editor via "Add block" (photo/name/role/bio for Team; logo/name/type/blurb for
  Partners) — friendliest for a non-technical owner. **Metaobjects are the deferred upgrade
  path**, taken only if a later need forces it — the trigger being an entry reused across
  pages (e.g. a team member who also authors Journal/blog posts, so one shared record links
  both) or the lists growing large. Not a launch concern; migrating later is a contained job.
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

## 7. Bundles / collections — administrable BOM builder (REQUIRED — Steve, 2026-07-10)

> **Vocabulary (Steve, 2026-08-19).** The site term is **collection**. *Tour* is a SKU
> **name**, like *Tour d'Italia 1* or *Tour Tuscany* - and a collection need not be a tour at
> all: *Decaf Collection 1* and *Roaster's Favorites 2* are the same archetype. "Tour" had
> crept in as the category term across the storefront, the Standard, and this spec; it is not
> one. Name a product whatever it should be called, and describe the archetype as a collection.

Collections (and any future bundle) are **Bill-of-Materials SKUs**: a collection = the box + N component
coffee SKUs + the printed tasting card. The production storefront MUST include an
**admin-managed** way to build these — no developer, no code deploy — so Steve can create a
new collection by naming it and selecting its component SKUs, and the warehouse can assemble it.

Requirements:
- **Author a collection by defining its BOM.** Admin picks the component product SKUs (e.g. Gardelli
  Ethiopia + La Sosta Guatemala + Fusari Colombia), the box, and the tasting card. The BOM is
  the single source of truth for the collection.
- **Browse facets are DERIVED from the components, never hand-entered.** A collection's Region /
  Roast / Flavor / Caffeine filter values are the **union** of its component SKUs' facets, so
  the collection is "positive" to a filter when ANY component matches (per-axis; AND across axes —
  the Option A rule modelled in the POC via `component_handles` + `productFacets()`). This keeps
  filtering correct automatically as components rotate — nobody has to remember to re-tag a collection.
- **Availability is gated by the components.** A collection is offered only while ALL its components
  are in stock and within their freshness window (the existing Sorpresa freshness-gated rule);
  if a component runs low or ages out, the collection auto-pauses and returns when stock refreshes.
  This falls out of the BOM automatically.
- **The BOM drives 3PL fulfilment.** Each collection order must generate an assembly / pick-pack
  instruction for the 3PL: box + each component coffee (by SKU) + tasting card. The component
  SKUs feed BOTH the storefront (facets, availability) AND the warehouse (what to physically
  assemble), and component inventory decrements per collection sold.
- **Shopify implementation:** model via native Shopify Bundles / a bundle app that supports
  component SKUs + component-inventory tracking, so each component's stock gates the bundle and
  the 3PL receives a per-order BOM packing slip. Bundle facets map to `crema_italia.*`
  metafields derived from the components (or computed in Liquid at render).

Generalises beyond Sorpresa collections to any composite product. Ties to the POC4 precedent already
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

---

## 9. Structured data (JSON-LD) — REQUIRED at launch (added 2026-08-18, POC15)

**Where the POC got to.** `layout/theme.liquid` now emits an `Organization` + `WebSite`
`@graph` server-side. That part is real and shippable as-is: it is what earns a logo and a
knowledge panel beside a search result instead of a bare blue link.

**What the POC deliberately does NOT emit, and why.** `Product` and `AggregateRating`.
The POC is a single-document SPA — every page is a `div` toggled by `showPage()`, so there
is exactly one URL. A `Product` node there would either name per-product URLs that 404 or
describe a product a crawler never renders, and there are no reviews to aggregate. Fake or
unreachable structured data is worse than none; it is the category of thing Google issues
manual actions for. So it is specified here rather than mocked.

### 9.1 Product — on the real `templates/product.liquid`

One `Product` node per real product URL. Required fields, all from the live product object,
none hand-written:

- `name`, `description`, `image` (the real photography, absolute URLs), `sku`, `brand`
  → the **roaster**, as an `Organization`, not Crema Italia. We import; they roast. Getting
  this backwards misattributes every product on the site.
- `offers` → `Offer` per variant (the bag sizes), with `price`, `priceCurrency: "USD"`,
  `availability`, `url` (the variant URL), and `priceValidUntil`.
- `additionalProperty` → the `crema_italia.*` metafields worth exposing: roast level,
  origin, process, region.
- `weight` → `QuantitativeValue`. Emit metric; Brand Standards §9's dual-unit rule governs
  *displayed copy*, not machine-readable markup, and schema.org expects one unit value.

### 9.2 AggregateRating — the route to stars, gated on real reviews

`aggregateRating` attaches to the `Product` node and is what puts stars in search results.
It must **never** be emitted before real reviews exist, and must never be emitted for a
product with zero reviews. Whatever review mechanism is chosen (see the open social-proof
decision) has to expose `ratingValue`, `reviewCount`, `bestRating`, `worstRating`.

Note the design tension already recorded against the audit's recommendation: the audit
argued for **reorder rate and palate-matched feedback** over a global five-star average,
on the grounds that one person's best coffee is another's "meh". A global average is what
schema.org's `aggregateRating` models, and it is the only shape Google renders as stars.
If we go with palate-matched feedback as the *on-site* trust asset, that is a deliberate
decision to forgo star rich-results, not an oversight — record it either way.

### 9.3 Also worth emitting in production

- `BreadcrumbList` on product and collection pages — meaningless in the SPA (no URLs),
  genuinely useful once shelves are real collection URLs.
- `FAQPage` on the FAQ page. The content already exists and is already in Q/A shape.
- `ItemList` on shelf/collection pages.
- Revisit `Organization.sameAs` (once social profiles exist), `contactPoint` (once info@
  and support@ are created), and `WebSite.potentialAction` (only if real search ships).
  All three are omitted today because claiming them would be false; the omission comments
  are in `layout/theme.liquid`.

---

## 10. Weights: where the number lives, and where the conversion happens (Steve, 2026-08-18)

Steve's question during POC15: *"the SKU will be set up in grams, but the presentation layer will
handle the conversion based on the size selection - am I correct?"* Yes. Recording the shape so the
production build does not reinvent it.

### The two weights Shopify holds, which are easy to conflate

| | What it is | What it drives |
|---|---|---|
| **Variant weight** | a real number + unit (`250`, `g`) | shipping rate calculation |
| **Option value** | a string the merchant types (`"250 g"`) | the pill label, and Shopify's own printed surfaces |

**Store the mass in grams on the variant weight field.** In Liquid, `variant.weight` returns grams
regardless of the unit the merchant chose in the admin, with `variant.weight_unit` and
`variant.weight_in_unit` alongside it for the merchant's preferred display. *Confirm this against
the dev store during the platform spike rather than taking it on recall.*

### The conversion is a render concern, and production gets better input than the POC

`convertWeight()` in `assets/ci-storefront.js` is already written to be the single source of truth,
and its comment says so. In production it takes `variant.weight` — a genuine number — instead of
regexing the identifier string the POC's fixture catalog forces on it. That is strictly better: it
cannot be broken by a merchant typing `250gr` or `250 grams` into the admin.

Carry forward unchanged:

- The **16 oz rule** — once a converted weight reaches 16 oz, state pounds, not ounces.
- The dual form goes on the **price denominator**, live-updating with the size selection; pills and
  size lists stay short metric. See `docs/POC15_change_list.md` §2 for why.

### The boundary, which is the part worth deciding

**The conversion reaches exactly as far as our own rendering.** Cards, product page and cart are
ours (§0). Checkout, order confirmation emails, packing slips and the Shopify-hosted customer
account are not — they print the **raw option value**. So with an option value of `250 g`, a US
buyer sees metric-only at the moment they pay and again in their receipt, and there is no hook to
inject into those surfaces below Plus.

Two options, **not yet decided**:

1. **Option value stays `250 g`.** Clean pills, conversion in our UI only, metric-only on Shopify's
   surfaces. *Recommended:* the buyer has already seen the conversion on the product page before
   reaching checkout, and option 2 re-breaks the one-row pill layout POC15 deliberately achieved.
2. **Option value carries both**, `250 g (8.82 oz)`. Survives into every Shopify surface, at the
   cost of a longer pill and the conversion rendering twice in our own layout.

Note this interacts with Brand Standards §9 (both units on every weight reference): under option 1
the receipt is metric-only, which is a surface we do not control rather than a breach we chose.
Worth stating that explicitly wherever the Standard is next revised.

---

## 11. Commercial rules must never ship as string literals (REQUIRED — Steve, 2026-08-19)

Steve, reviewing the product detail page: *"All of the card details are coming from an Item
Master and/or shelf master table; right? There should be very little hardcoded information on
this page."* Almost — but the audit found a third category between "product data" and "UI
chrome", and it is the one that rots.

**Three categories, and only the third is a problem:**

1. **Product facts** — title, roaster, origin, process, roast level, roast/best-by dates,
   components, sizes, prices, `subscription` boolean, notes, brewing. All data-driven already.
2. **UI chrome** — "Bag size", "Delivery cadence", "Add to cart", "About this coffee". Labels,
   not data. Correctly literal; leave them alone.
3. **Commercial rules quoted as customer copy.** Store Operating Standard rules typed into the
   theme as text, with no link back to the Standard that owns them.

### The category-3 inventory on the product page

| String in the theme | Owned by | Where it must come from in production |
|---|---|---|
| "Best within 60 days of roast date. For peak flavor, brew within 30 days." | Standard §5 | Theme setting (no natural Shopify home). §5 prescribes this sentence verbatim. |
| "10% off every shipment and free shipping… on Roccia, Sorpresa, and Selezione" | Standard §3, §6 | **`selling_plan.price_adjustments`** — the same object that actually applies the discount |
| "Every 4 weeks / 6 weeks / 8 weeks" | Standard §6 | **`selling_plan_group.selling_plans`** — render the pills from the plans themselves |
| "Printed tasting card included." | Standard §7 | Theme setting, or a per-collection metafield |
| "Bottega items are never subscriber-discounted…" | Standard §1, §3 | Theme setting |
| Gallery fixed at 3 slides, labels "Back of bag" / "Label close-up" | — | **`product.images`** — a variable-length array; some SKUs will have two photos, some six |

**Verified 2026-08-19: none of these had drifted.** Every value matched the Standard at the time
of writing. That is the point — they are correct **by care, not by construction**, and the care
is not repeatable. Change the subscriber rate in the Standard and in the Shopify Function, and
the product page still says 10% with nothing to catch it.

### The rule

**A number or rule that the Store Operating Standard owns may not be typed into a template.**
Derive it from the object that enforces it where one exists (selling plans, metafields), and from
a theme setting where one does not. The two subscription rows above are the important ones: the
cadences and the discount are *already* data on the real store, so hardcoding them would be
choosing a literal over a value that is sitting right there.

Same failure shape as the shelf-description drift found the same day, where the Shop page kept a
parallel `SHELF_NOTE` table that had silently diverged from all four shelf pages. Two copies, no
link, and only one of them gets updated. See `CLAUDE.md` §9 (2026-08-19).
