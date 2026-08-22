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

> We're building the real production storefront now, replacing the POC. The canonical rules live
> in the three Standards under `docs/standards/` — read `docs/standards/README.md` for the current
> versions, read all three, and treat them as authoritative over the POC. Then read
> `docs/POC_drift_from_standards.md` (every place the POC knowingly diverges from the Standards —
> do not carry that drift into production), and `CLAUDE.md` top to bottom, especially §10 CURRENT
> STATE, which names the newest POC and its change list. **Verify §10 against live output
> (`shopify theme list`) before trusting it.** Then read `docs/production_build_spec.md` end to
> end. Then propose a phased build plan and wait for my OK before writing code.
>
> **What carries over from the POC, and what must not.** Carry the **CSS** (it is the design
> system), the **copy**, the **component markup shapes**, and the **business logic**. Do **NOT**
> carry `assets/ci-storefront.js`: it is a single-document SPA renderer that paints `innerHTML`
> strings and exposes ~64 `window.*` handlers, and the SPA shape is explicitly not the production
> architecture (§0). Production is server-rendered Liquid with real URLs per product and
> collection. Treat the POC's JS as an executable specification of *behaviour*, never as code to
> port. Where the code contradicts a Standard, the Standard wins (see the drift ledger).

Everything below is what that prompt pulls in.

> **This prompt deliberately names no version numbers and no POC number.** It used to say
> "Store Operating v1.3" and to point at `docs/POC5_change_list.md`; by 2026-08-20 the Standard was
> at v1.10 and the change list thirteen batches out of date. It is read **once, by someone with no
> context**, which is exactly the document where staleness compounds instead of being caught. Point
> at `docs/standards/README.md` and `CLAUDE.md` §10 — the places that are kept current — and never
> re-introduce a literal version here. Review B finding B1.

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

### 5.1 What customer-account UI extensions can actually do (platform spike, 2026-08-21)

Closes the §10 spike item *"SCOPE what customer-account UI extensions can actually do"*, which had been
the largest open consequence for the production build since the 2026-07-25 finding that `/account` is
Shopify-hosted and the POC's account page is not buildable in Liquid. **Researched against current
Shopify documentation, not recalled.** One sub-question remains and needs two minutes on the dev store.

**The de-risk: they are available on ALL plans, not Plus.** Plus is required for *checkout*
extensibility, not for customer accounts. So the account experience is buildable on Grow, and nothing
here pushes the plan decision.

| Capability | Verdict |
|---|---|
| Plan requirement | **All plans.** Not a Plus feature |
| A whole custom page in the account | **Yes** - full-page extensions, and the merchant can add a link to it in the account header navigation |
| Blocks on existing pages | Yes - Profile page (`PAGE_TITLE`, `PROFILE1`, `PROFILE2`) and Order Status (`ORDER_STATUS1-3`), plus static targets per line item, delivery status, payment status and returns |
| Read customer metafields | **Yes**, via the Customer Account API |
| **Write** customer metafields | **Yes** - `metafieldsSet` on Customer, Order, Company, CompanyLocation |
| Call our own backend | Yes - `network_access = true`, requested in the Partner Dashboard. The server must send `Access-Control-Allow-Origin: *`, because extensions run in a Web Worker with a null origin |
| Custom CSS / arbitrary HTML / custom fonts inside the extension | **No** |

**The metafield write capability matters more than it looks.** §6.1 records that storing the taste
profile as a **customer metafield** is cheap now and expensive to retrofit, and that it is the join key
for palate-matched feedback. This confirms the extension surface can both read and write it — so the
account page can show a taste profile *and* let the customer change it, which is exactly what the POC
models.

#### The constraint, and it is a brand constraint

> *"You can't override the CSS for UI components. The customer account UI will always render the
> merchant's own branding."*

Extensions are confined to Shopify's component library — actions, feedback, forms, layout, media,
overlays, typography. **No arbitrary HTML, no custom CSS, no custom fonts inside the extension.**

What we *do* control is the **shared branding configuration** (Settings → Checkout → Configurations),
which carries across checkout, customer accounts and sign-in: **logo**, **colours** (any value, plus a
reusable palette of up to 20), and **typography**. Colours can be overridden per surface.

**So the account page will be Shopify's components wearing Crema Italia's palette and logo — not the
storefront's typography, spacing and composition.** For a brand whose differentiator is editorial
restraint, that is a real loss, and it should be accepted deliberately rather than discovered during
the build.

**What survives from the POC's account design:** the information architecture (which tiles exist and
what each says), the copy, and the data behind it. **What does not:** the visual composition. The
Membership tile's hairline box and gold accent, the Marcellus headings, the tricolore rule — none of
it carries. The POC's account page remains, as §0 says, a model of a surface we do not own; this
section records *how much* of it is recoverable, which is more than feared on function and less on form.

**The business rules are untouched** — durable Founding Member status, the numbered honorific, and the
60-day benefit grace live in Store Operating Standards §3.1/§4 and are unaffected by any of this.

#### Still open, and it is a two-minute check on the dev store

**Which fonts the branding editor actually offers, and whether Marcellus is among them.** Typography
is customisable, but whether a specific Google font can be selected — or a custom font uploaded, and on
which plan — is not something to assert from documentation. Open **Settings → Checkout →
Configurations → Edit** on `crema-italia-development` and look. If Marcellus is unavailable, the
account surface diverges from the storefront on type as well as layout, which is worth knowing before
anyone designs against it.

### 5.2 Loop x Shopify Functions — the entitlement model does not survive contact (platform spike, 2026-08-21)

Standard §12.8 called this *"the highest-risk integration in the design"* and *"the one place `MAX`
could be violated without us doing anything wrong."* Researched before building anything. **It is
violated, and the reason is worse than stacking.** Two findings, and the second one breaks the
entitlement architecture as specified.

#### Finding 1 — a selling-plan discount is not a discount, so MAX does not see it

A selling plan applies a **price adjustment**: a $60 variant on a 10% plan simply costs $54. It is not
a discount competing in a combination — it has already changed the line price before any discount is
evaluated. Everything else then applies **on top of the reduced price**:

> "Any discount configured in Shopify that applies to subscriptions will stack on top of the existing
> discount applied on the selling plan… a 10% selling plan discount plus a 10% code gives **$81**, not
> $90 or $90." And explicitly: **"Shopify Functions discounts will stack on top of subscription
> discounts."**

So `MAX` holds *among* Function and code discounts — Shopify already applies only the largest product
discount per line on non-Plus plans, which gives us §3's rule for free — but a selling-plan adjustment
sits outside that contest entirely and compounds with the winner.

**Consequence: the subscriber discount must live in exactly one of the two places, never both.**

#### Finding 2 — Functions do not run on recurring orders

This is the one that matters. From Shopify's developer forum, answered by Shopify staff:

> **"Discount functions are not re-run when recurring orders are created."**
> "The mental model is that a buyer agrees to the terms of the contract based on what they see in the
> first order, so whatever discounts they got on that first order which are marked as
> `appliesOnSubscription` should carry forward up to the `recurringCycleLimit`."
> "When a discount code is applied to a subscription, a **snapshot** of the discount is saved to the
> subscription contract, and this snapshot is **independent of the original discount**."

**Standard §11 specifies that a Shopify Function owns the entitlement — reading customer tags to
decide the applied rate. That can only ever govern the first order.** Orders 2..n are billed from the
contract, and the contract holds a snapshot taken at signup.

**What this breaks, concretely:**

- **The durable Founding Member model (§4).** A customer who subscribes as an ordinary subscriber at
  10% and later becomes a founder would keep 10% on every recurring order, because the contract
  snapshot never re-evaluates. Reinstating "at tier" on resume cannot be done by a Function.
- **Any change to the subscriber rate** would not reach existing subscribers.
- **The 60-day benefit grace (§4)** cannot be enforced by a Function on recurring orders either.

**So entitlement cannot be Function-owned end to end.** Something must write the correct rate onto the
**contract** — either the selling plan the customer is on, or `subscriptionContractUpdate` after each
cycle. In practice that is **Loop's job**, because Loop owns the contract; every subscription app faces
this and Loop documents subscription discounts as a feature it manages.

#### The shape this forces

```
first order      Function computes MAX(founder, subscriber, first-order) - and MUST NOT
                 double-apply on top of a selling-plan adjustment
orders 2..n      the CONTRACT carries the rate; Loop maintains it
tier changes     Loop updates the contract; a Function cannot reach these orders
```

Which means the subscriber/founder rate belongs on the **contract**, and the Function's role shrinks
to campaign discounts on **one-time** purchases. That is a materially different architecture from
Standard §11 as written.

#### Confidence, and what still needs proving

**Finding 1 is well documented.** Finding 2 rests on a **Shopify staff answer in the developer forum**
plus Help Centre wording — strong, but forum rather than formal documentation, and this project's own
rule is that live output beats a document. Neither has been observed on a store.

**Ask Loop support directly** (cheaper and more definitive than a build):

1. Do your selling plans carry the subscriber discount, or do you expect the merchant to apply it
   another way?
2. Can the rate differ **per customer** — 12% for Founding Members, 10% otherwise — on the same
   cadence? Two selling plans, a contract-level override, or not at all?
3. When a customer's tier changes, can you update an **existing** contract's rate, and is it manual or
   API-driven?
4. If we also run a Shopify discount Function, will it **compound** with your selling-plan adjustment
   on the first order, and how do you advise avoiding that?

**Then confirm on the dev store** with a real subscription: place a first order and inspect the applied
discounts, then inspect the resulting subscription contract to see what was snapshotted onto it.

**Do not write the entitlement Function until questions 1-4 are answered.** Standard §11 and §12.8
should be revisited on the answers — this is a decision for Steve, not a correction Code should make
unilaterally, because it changes which system owns a commercial rule.

#### 5.2.1 Loop's tiers, VERIFIED in the app on a free dev store (2026-08-21)

Loop was locked as the subscription engine on 2026-06-29 and **its cost was never recorded**. Priced
here - and then **verified by installing it**, which is why this section supersedes anything read off
a pricing page. Everything below was read from Loop's own admin on
`crema-italia-development`, not from marketing copy.

**First: the dev-store question is settled empirically. Loop installs and runs on a free Partner
development store.** The "paid apps cannot be installed on development stores" restriction never
applied, because Loop has a genuinely free tier. Billing page, verbatim: *"You currently have **FREE**
plan activated on your store. 50 Subscriptions + Basic features included. $0 / month, 0% transaction
fee."*

| Tier | Cost | Transaction fee |
|---|---|---|
| **Free** | $0 | **0%** |
| **Starter** | $99/mo | **1.0%** |
| **Pro** | $399/mo | **0.75%** |

Note the fee is **not monotonic**: Pro's rate is *lower* than Starter's. Starter to Pro is $300/mo for
0.25pp, so it breaks even at `0.0025 x R = 300`, i.e. **$120k/month**. Same order of magnitude as the
Shopify Advanced break-even, and the same verdict: not before seven figures.

##### The free tier does expose selling-plan discounts - so the §5.2 test costs nothing

This was the open question. **Answered yes.** A selling plan named *Founder Subscriptions* exists on
the free tier carrying **12.00% discount** across two frequencies (deliver every 4 weeks, deliver every
8 weeks), available to Storefront, Customer portal and Admin portal.

##### The structural finding: the discount is a property of the SELLING PLAN, not the customer

The discount is configured **per selling plan, per delivery frequency**. There is no per-customer rate
field anywhere in the plan configuration. **This is the strongest available support for Finding 2
above**, and it is observed rather than read:

- **Founder 12% and subscriber 10% must be two different selling plans.**
- A customer's rate is decided by **which plan they subscribed to**, fixed at signup.
- Promoting someone to Founding Member mid-subscription is **migrating their contract to a different
  selling plan** - not re-evaluating a rule, and certainly not re-running a Function.

That is Standard §4's durable Founding Member model expressed in Loop's data model, and it confirms
the architecture consequence: **entitlement is contract state, not computed state.**

##### What is gated, read off the billing page

**Starter ($99/mo + 1%)** - unlimited subscriptions · fixed and build-your-own bundles · one-click
checkout links · widget templates · **branded customer portal with upsell** · **smart dunning
management** · **personalized & interactive cancellation flows** · custom delivery scheduling (Zapier)
· **subscription-specific shipping rates** · auto price and shipping updates · inventory control and
customer alerts · global email branding · Klaviyo/Yotpo & 30+ integrations.

**Pro ($399/mo + 0.75%)** - everything in Starter, plus gamified journeys · personalized upsell
profiles · portal themes · **prepaid and gift subscriptions** · **workflow automations & bulk actions**
· user permissions · partial billing · branded email domain · multilingual · **Admin/Storefront APIs
and webhooks** · dedicated CSM.

**Four named commitments in our own record sit above Free:**

1. **Dunning management** (Starter). CLAUDE.md 2026-07-10 makes this load-bearing in the durable
   Founding Member model - *"Loop dunning protects failed cards"* is the reason a declined card cannot
   cost someone their rate. Without it a decline becomes a silent cancellation, the exact failure mode
   Standard §4 exists to prevent.
2. **Cancellation flows** (Starter). The pause-first cancel, Standard §4, mocked in the POC.
3. **Branded customer portal** (Starter). The Loop slot on the account page.
4. **Subscription-specific shipping rates** (Starter). Standard §3/§4 make shipping offsets a
   subscriber benefit. Easy to miss, because it does not look like a subscription feature.

##### The API wall, and the decision it forces

**Verified directly, not inferred:** Settings → API tokens shows *"Generate and manage Loop API tokens
to read and update your subscriptions with REST API calls"* with the generate button disabled and
*"This feature requires you to upgrade to **PRO** plan in order to use."*

Combine that with the structural finding above and a real fork appears. If entitlement is contract
state, then **promoting a customer to Founding Member means changing their contract**, and there are
only two ways to do it:

| | Cost | Viability |
|---|---|---|
| **Manually**, in the Loop admin | Starter, $99/mo | Plausible - Founding Membership is **capped at 222** by Standard §4, and it is a one-way, once-per-customer event. Note **bulk actions are also Pro**, so manual means one at a time |
| **Programmatically**, via Loop's REST API | **Pro, $399/mo** | $300/mo for automation of an event that happens at most 222 times, ever |

**Recommendation: Starter, and migrate founders by hand.** 222 manual operations spread across the
life of the business is not a workload; $3,600/yr is real money. Revisit only if the founder cap is
ever lifted or a second contract-mutating rule appears.

##### The monthly platform cost, stated in one place

```
Shopify Grow      $79/mo (annual)  + 2.7% + 30c card
Loop Starter      $99/mo           + 1.0% per transaction
                  -------
                  $178/mo before card fees, 3.7% all-in on subscription orders
```

**Loop is the larger of the two platform costs.** This bears on Standard §12.3, the pricing-matrix
validation that has never been checked against real landed costs - and certainly never against a 3.7%
all-in rate on the shelf the entire subscriber model is built on.

**A quiet vindication of Steve's call on §12.9:** prepaid and **gift subscriptions are Pro, $399/mo**.
Standard v1.5 opened an item asking who would hold the Founding Member slot on a gifted subscription;
v1.6 removed it as speculative scope for a product we had declined to build. Had it stayed, we would
have been designing entitlement rules for a capability costing $300/mo more than the plan we need.

##### Still to run on the dev store, now that the tooling is proven free

Create a test subscription against *Founder Subscriptions* and **inspect the resulting subscription
contract** to see what was snapshotted onto it. That is the last piece of Finding 2 that rests on a
forum answer rather than something we watched happen.


#### 5.2.2 The test subscription, RUN — Finding 1 confirmed, Finding 2 confirmed, and the API wall turns out not to bind (2026-08-21)

Everything above rested on documentation and a Shopify staff forum answer. This ran it. Order **#1001**
and subscription contract **#15285027040** on `crema-italia-development`, through the Test payment
gateway (no real money can move on a development store).

**Setup:** selling plan *Founder Subscriptions*, **12.00%**, deliver every 4 weeks, mapped to
*Selling Plans Ski Wax* at a base price of **$24.95**.

##### Finding 1 CONFIRMED, and it has a consequence nobody had drawn

Order #1001 billed the line at **$21.96**. That is `24.95 x 0.88` to the cent. And the order shows:

```
Subtotal    1 item                          $21.96
Shipping    Standard                         $8.00
Total                                       $29.96
```

**There is no discount line anywhere on the order.** Not a zeroed one - none. The 12% did not appear
as a discount, it appeared as a *lower price*, exactly as a price adjustment does.

**The consequence, which is a design decision we now have to make:** the subscriber benefit is
**invisible on the Shopify order**. The customer's order confirmation email will not say "Founding
Member 12%" - it will simply show $21.96 and look like the price. The POC cart renders an explicit
"Founding Member 12%" line; on a subscription line in production **that line will not exist in
Shopify's record**, so if we want the customer to see the benefit we must render it ourselves in the
cart and theme, from `compare_at`/base price against the selling-plan price.

Two further effects worth knowing: **Shopify's discount analytics will report zero discounts on
subscription orders**, because none were given as far as the platform is concerned; and the same is
true of any report or export keyed on discount lines.

##### Finding 2 CONFIRMED structurally: the rate is contract state

The contract stores the rate explicitly, as its own fields:

```
Base price:             $24.95
Subscription discount:  12.00%
Plan:                   Founder Subscriptions
Discounted price:       $21.96
```

And it has already **pre-scheduled five future orders** - 18 Sep, 16 Oct, 13 Nov, 11 Dec, 8 Jan 2027 -
which will bill from that stored state. This does not prove a Function is skipped (that needs a
Function deployed to observe), but it confirms the half that matters for the architecture: **the rate
lives on the contract as data, not as a rule evaluated per order.**

##### The finding that changes the cost basis: contract rates are editable on the FREE tier

§5.2.1 framed a $99-vs-$399 fork, on the reasoning that mutating a contract might require Loop's REST
API, which is Pro. **It does not.** Opening the contract's product line gives an *Edit product* dialog
containing:

| Control | Value |
|---|---|
| Base price | $24.95, editable |
| Subscription price | radio: **Edit discount amount** / Edit subscription price directly |
| Selling plan | Founder Subscriptions |
| Discount type / value / final price | **Percentage / 12.00% / $21.96**, all editable |
| Change discount offer after specific payments | checkbox |

**So promoting a subscriber from 10% to 12% when they become a Founding Member is: open their
subscription, change the discount value, save.** On the free tier. No API, no Pro plan.

**This confirms the Starter recommendation and removes the last argument for Pro.** Pro's API buys
automation of an event capped at 222 occurrences that is a thirty-second admin edit. The recommendation
stands at **Starter, $99/mo, migrate founders by hand**.

Also noted for later: **"Change discount offer after specific payments"** is native, so a rate that
changes after N cycles needs no custom work. We do not use an intro offer today; worth knowing before
anyone designs one.

##### Three of the four Loop questions are now answered without asking

1. *Do selling plans carry the subscriber discount?* - **Yes**, observed.
2. *Can the rate differ per customer on the same cadence?* - **Not on the plan** (no per-customer
   field), **but yes per contract** via the edit dialog. So: separate plans for new signups, contract
   edits for changes.
3. *Can you update an existing contract's rate, manually or by API?* - **Manually, on the free tier.**
   API is Pro and is not needed.
4. *Will a Shopify discount Function compound with the selling-plan adjustment on the first order?* -
   **STILL OPEN.** This is the only one left, and it cannot be answered by inspection - it needs a
   discount Function deployed against this store and a second test order. Given Finding 1, the
   expectation is that it **will** compound, because the Function sees $21.96 as the line price and
   discounts from there.

**Until question 4 is answered, do not put the subscriber benefit in both places.** The design must
choose: the rate lives on the selling plan **or** in a Function, never both, or a founder gets 12% off
a price that is already 12% off.

#### 5.2.3 A1 RUN — they compound, and `combinesWith: false` does not stop it (2026-08-22)

§5.2.2 left exactly one question open and called it the only thing still blocking: *does a Shopify
discount Function compound with Loop's selling-plan price adjustment on the first order?* It could not
be answered by inspection. It needed a Function deployed and a second order. **Both were done. The
answer is yes, and the run produced five further findings the question did not ask for.**

**The instrument.** A throwaway app (`crema-validation`, outside the theme repo, its own git repo) with
one Discount Function extension, `founder-entitlement`, on the unified Discount API (`api_version
2026-07`, target `cart.lines.discounts.generate.run`). It takes a flat 10% off every cart line
unconditionally, and it **encodes what it was handed into the discount message**, so the cart and the
checkout report the function's own inputs back to us instead of us inferring them. Registered as an
automatic app discount with `discountClasses: [PRODUCT]`, `appliesOnSubscription: true`, and —
deliberately — `combinesWith` **all three set to false**.

That last choice is what makes the experiment sharp rather than merely suggestive. "Combines with
nothing" is the most restrictive setting Shopify offers. If the two still compound under it, the cause
cannot be a combination rule we mis-set.

##### The result

The same variant, $24.95, twice: once on Loop's *Founder Subscription* selling plan (12%,
`gid://shopify/SellingPlan/11348607200`), once as a plain one-time purchase as a control.

| Line | Base | Selling plan | Price the Function was handed | Function 10% | Final | Effective |
|---|---|---|---|---|---|---|
| **Subscription** | $24.95 | −12% | **$21.96** | −$2.19 | **$19.77** | **20.76%** |
| One-time (control) | $24.95 | — | $24.95 | −$2.49 | $22.46 | 10.00% |

The function's own report on the subscription line, read off the checkout:

```
PROBE SP=Y PLANPX=21.96 UNIT=21.96 CMP=24.95 SUB=21.96
      CID=9796364042464 ORDERS=0 ANYTAG=Y
      TAGS[FOUNDING-MEMBER:Y,ACTIVE-SUBSCRIBER:Y] MF=FOUNDER
```

and on the control line: `PROBE SP=N unit=24.95 cmp=? sub=24.95 cust=NONE`.

Checkout totals: `Subtotal $19.77 · TOTAL SAVINGS $2.19 · Recurring subtotal $21.96 every 4 weeks`.

**So a founder would receive 12% off a price that is already 12% off** — and `combinesWith: false` does
not prevent it, because a selling-plan adjustment is not a discount and therefore never enters the
combination contest at all. §5.2's Finding 1 is now observed rather than read.

##### The fix exists, and there are two of them

The Function is **not blind to the subscription**. `cartLine.sellingPlanAllocation` came back non-null,
carrying the plan and its price adjustments (`SP=Y PLANPX=21.96`). So the function knows perfectly well
that it is looking at a subscription line and can decline to touch it. Two mechanisms:

1. **Declarative, no code:** set `appliesOnSubscription: false` on the discount. Shopify models this
   explicitly on `DiscountAutomaticAppInput`, alongside `appliesOnOneTimePurchase` and
   `recurringCycleLimit`.
2. **In code:** skip any line whose `sellingPlanAllocation` is non-null.

Prefer the declarative one where it suffices — it cannot be defeated by a later code change — and keep
the in-code check as belt and braces, because the function is the thing that would be wrong.

##### The finding that reconciles §3 with the platform

Excluding subscription lines outright would quietly break Standard §3. `MAX` says a subscriber who
qualifies for the 15% win-back should receive **15%**, not their standing 12%. If the 12% lives on the
selling plan and the Function is barred from subscription lines, no campaign can ever out-rank it, and
`MAX` silently becomes `standing rate` on every subscription line.

**It does not have to.** The Function is handed *both* prices:

- `cost.amountPerQuantity` = **$21.96**, the plan-adjusted price;
- `cost.compareAtAmountPerQuantity` = **$24.95**, the base price.

That second field is the one that matters, and note the asymmetry: on the **one-time control it was
null** (`cmp=?`), and on the **subscription line it carried the pre-plan base price**. On exactly the
lines where the plan has moved the price, Shopify hands us the number it moved from.

So the Function can compute a **top-up to `MAX`** instead of an all-or-nothing exclusion:

```
target  = base x (1 - MAX(all qualifying rates))    e.g. 24.95 x 0.85 = 21.21   (win-back 15%)
current = amountPerQuantity                                          = 21.96    (plan already applied)
top-up  = (current - target) / current                               = 3.42%
```

Apply nothing when `target >= current` — the plan already delivers at least `MAX`, which is the normal
case for a founder at 12%. This preserves §3's rule exactly, on subscription and one-time lines alike,
with the plan owning the floor and the Function owning only the difference. **It is a recommendation,
not a decision:** it bears directly on §11/§12.8, which is Steve's call (Round 2 item A2).

##### Four more findings the question did not ask for

**(a) Standard §12.7 is answered: YES — a discount Function can read customer tags AND
custom-namespace customer metafields.** Open since 2026-07-25, and the whole §11 engine assumes it.
`customer.hasAnyTag`, `customer.hasTags`, `customer.numberOfOrders` and
`customer.metafield(namespace: "crema_italia", key: "tier")` all returned live values at checkout —
`ANYTAG=Y`, both tags `Y`, `MF=FOUNDER`. The metafield needed **no metafield definition and no special
access grant**. Note the customer object is null in the *cart* (`cust=NONE`) and populated at
**checkout**, which is where it matters.

**(b) But tags propagate late, and metafields do not.** Both were written in the same Admin API
mutation. On the next checkout load the metafield already read `FOUNDER` while both tags still read
`N`; they flipped to `Y` a couple of minutes later. This is an operational hazard for §11, which uses
tags for the benefit gate and for time-boxed campaign eligibility driven by Loop webhooks and Flow:
**a tag written moments before checkout may not be visible to the Function.** Anything that must take
effect immediately — a resume that restores benefits, a win-back window opening — should be a
**customer metafield**, not a tag. (This was very nearly written up as "tags never reach Functions". It
was a propagation lag. Re-read before concluding.)

**(c) The discount message is customer-visible.** Our debug string rendered verbatim on the checkout,
under the line item, in the order summary. In production the `message` is **customer copy** and falls
under Brand Standards — and under §3's no-codes policy it is also the only place a server-side discount
gets to explain itself.

**(d) Loop ships its own discount Functions.** The store's discount picker lists `referral Discount`,
`Gift program discounts` and `bundle-discount` under Loop Subscriptions. Loop is not only adjusting
selling-plan prices; it registers Function discounts in the same class ours competes in. §5.2 assumed
the selling-plan adjustment was Loop's only discount surface. It is not.

##### What is still not observed

The checkout reports `Recurring subtotal $21.96 every 4 weeks` — i.e. **the Function's 10% is not in
the renewal price** — and that held after setting `recurringCycleLimit: 12` on the discount. That is
consistent with §5.2's Finding 2 and with the contract fields observed in §5.2.2, and it is the first
time we have seen Shopify itself quote a renewal price with a Function discount live on the store.
**It is still not proof of what orders 2..n bill**, because it is a projection shown at checkout, not a
contract. Closing it needs a completed order and an inspection of the resulting contract; checkout
could not be completed here because card entry sits in a cross-origin iframe. Treat Finding 2 as
strongly corroborated and not yet closed.

##### Dev-store state left behind (know this before the next test)

- The app **crema-validation** is installed, and the automatic discount **"A1 PROBE - flat 10 percent
  product discount"** (`gid://shopify/DiscountAutomaticNode/1569551253728`) is **ACTIVE**. It takes 10%
  off every line of every order. **Deactivate or delete it before running B2, C1 or C3**, or their
  numbers will be wrong for a reason that is easy to miss.
- Customer `9796364042464` (an empty guest-checkout record) now carries the tags `founding-member` and
  `active-subscriber` and the metafield `crema_italia.tier = founder`.
- The store also carries seeded test discounts from before this work, one of which — *"Buy one, get the
  second 10 percent off"* — is **active and automatic**. Every measurement above used quantity 1, which
  it cannot fire on.

## 6. Trust signals, reviews + photography (2026-07-09 review; reviews decided 2026-08-20)

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

### 6.1 Reviews & social proof — how it gets built (decided 2026-08-20)

**The policy lives in Store Operating Standards §13** (who may review, moderation, anonymity, no
photographs, the minimum-n floors). This section is only the build technique. The reasoning, the
rejected alternatives and the measurements are in the trust decision brief.

**Note the reconciliation with the bullet above.** The 2026-07-09 review said trust signals must not
be "star-rating clutter". That still holds and is not contradicted here: the objection was to
clutter, and §13.5 answers it with a discreet control of our own design linking to detail, not a
star bar stamped across every card. Collecting a rating and shouting one are different things.

**Mechanism: Judge.me free tier as a collection and moderation backend only.**

- Free tier covers unlimited reviews, unlimited review-request emails, moderation queue and
  importer. **Custom Questions ($15/mo) is NOT needed** — see the join note below.
- It writes to Shopify's **standard review data**, so the vendor is swappable: any
  syndication-compliant app writes the same shape, and changing vendor changes the back office
  rather than the storefront.
- Not plan-gated. Verified on a Basic-equivalent store, so this adds no pressure to the plan
  decision.
- Configure it for **§13.1**: disable the public storefront review form so the emailed per-order
  link is the only route in. Configure for **§13.4**: photo/video upload off.

**VERIFIED LIVE 2026-08-20** (dev store, Judge.me free, one hand-entered review, before-and-after
baseline). Read by our own Liquid, server-side, no JavaScript:

```liquid
product.metafields.reviews.rating        {"scale_min":"1.0","scale_max":"5.0","value":"2.0"}
product.metafields.reviews.rating_count  1
```

That is the whole input for the §13.5 control and for `aggregateRating`. **The discreet
product-level control therefore rests on measured data, not on an assumption.**

**UNPROVEN, and tracked** — `product.metafields.reviews.product_reviews`, the list of individual
review records, returned nil, and the standard `product_review` metaobject definition does not
appear on the dev store at all. Probable cause is benign: Judge.me syndicates review *metaobjects*
through the **Shop channel**, for stores eligible for Shop, and a Partners development store is not.
That fits the evidence — the aggregate metafields, which the app writes directly, populated; the
metaobject records, which travel the Shop pathway, did not.

- **Do not record this as refuted.** A dev store is not a perfect mirror of production (same caveat
  as the July spike). Open question for Judge.me support: *does metaobject syndication require Shop
  eligibility, and will `reviews.product_reviews` populate for a Basic-plan store?*
- **Ask in the same message:** *does the syndicated review populate `author` with the customer
  reference?* That answer decides whether the palate-match join is free or needs building.
- **The blast radius is small, by design.** Only the **review-detail view** (§13.5) needs individual
  records. If the metaobject route does not hold, the fallback is the vendor widget **on that one
  page**, while our own control still governs every product page. This is a consequence of Steve's
  decision to put detail behind a link rather than inline, and it is worth preserving for that
  reason.

**Required, and cheap now / expensive later: store the taste profile as a customer metafield.**
The taste profile is the only axis the site persists, and the review schema's `author` field is a
customer reference — so palate-matched feedback (§13.6) is a **join we already own**, not a second
data-collection exercise. That is why Custom Questions is not needed. It costs nothing to write the
profile to a customer metafield during the production build and requires going back to customers for
data they already gave us if it is retrofitted.

**Do NOT build a "rate your purchases" page in Liquid.** Two collisions: the account surface is
Shopify-hosted (§0), and the Liquid `customer` object is reported unreliable under new customer
accounts — returning null while the customer is logged in, and details expiring after roughly 24
hours despite an active session. That is developer-forum reporting rather than official
documentation, so verify before relying on it either way; but it is exactly the failure that works
in testing and breaks a day later. **The emailed per-order link is the dedicated rating call**, and
it needs neither the account surface nor the customer object.

**Reorder rate and palate-matched feedback** cannot be derived in Liquid. Both need a scheduled
computation writing a product metafield, and both must honour the §13.6 floor with silence below it.
Specify the floor as a named constant, never a literal in a template (§11).

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

### 7.1 Bundle app evaluation against these requirements (platform spike, 2026-08-21)

**Recommendation: Shopify's own Bundles app. Do not buy a third-party bundle app.**

Measured against the four requirements above:

| Requirement | Covered by an app? |
|---|---|
| Admin-managed: define a collection and its component SKUs without a developer | **Yes** - native Bundles |
| Component-derived **facets** (region/roast/flavour/caffeine as the union of components) | **No app does this.** Ours regardless |
| Availability gated on component **stock** | **Yes** - native Bundles keeps component inventory in sync |
| Availability gated on component **freshness** (§5) | **No app does this.** Ours regardless |
| Per-order BOM to the 3PL | Not an app question - see Standard §12.9 and the 3PL questionnaire |

**Why native rather than paid.** Third-party bundle apps earn their fee on **mix-and-match,
build-your-own, volume discounts and BOGO** - none of which we need. A Sorpresa collection is a
**fixed** set of components chosen by us. And the two requirements no app satisfies are ours to build
either way, so a paid app buys nothing we lack.

**Native limits are not close to binding:** 100 variants and 30 products per bundle, 3 option
dimensions. Our collections hold a handful of components.

**One ambiguity to settle on the dev store before relying on it.** Sources conflict on whether native
bundles decrement component inventory: one describes bundles as standalone products whose components
*"aren't deducted automatically"*, another describes real-time component sync that is *"more reliable
than what third-party apps can typically achieve"*. The likeliest reading is that these describe
different things - a hand-built product that merely represents a bundle, versus a genuine
componentised product created through the Bundles app. **Worth ten minutes on the dev store:** create a
bundle from two components, place a test order, and watch whether component inventory moves. If it does
not, the recommendation changes.

**Freshness gating remains ours whatever the answer**, and it is the harder half: a collection must
become unavailable when *any* component leaves the freshness window (§5), which is a rule no bundle app
knows about.

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

**RESOLVED 2026-08-20 — emit it.** The tension recorded here (the audit argued for reorder
rate and palate-matched feedback over a global five-star average; `aggregateRating` models
exactly the average being rejected, and is the only shape Google renders as stars) turned out
to be smaller than it looked, and is dissolved rather than traded away:

- They are **different surfaces.** `aggregateRating` is markup for a crawler; palate-matched
  feedback is what a human reads. Google requires the marked-up rating be *visible* on the
  page, not that it lead — so a discreet control (Standard §13.5) satisfies the crawler while
  the average does none of the persuading.
- A rating is **mandatory in the data model anyway** — the standard review schema makes it a
  required field — so "collect no stars" was never actually available.
- The inputs are **measured**: `reviews.rating` and `reviews.rating_count` read from live
  Liquid on 2026-08-20. See §6.1.

Emit it **only when at least one real review exists**, never for zero (Standard §13.5, §13.7).

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
| "Best within 90 days of roast date. For peak flavor, brew within 30 days." | Standard §5 | **DONE 2026-08-21** - both numbers now come from theme settings (`freshness_window_days`, `peak_flavor_days`) via `window.CI_RULES`. |
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
## 12. Coffee vs not-coffee: the taxonomy predicate (Steve, 2026-08-20)

**The rule.** A **Bottega item never carries a roaster**, even when it is roaster-branded. A
roaster-branded tote is simply its own SKU; the branding is part of the product, not a relationship
the data model needs to express. We do not filter Bottega by roaster and have no plan to.

**Why it is enforced in code rather than left to data entry.** Shopify cannot express *"this
metafield may not be set for products in this collection"*, so there is no data-entry filter to
configure - the only thing standing between the rule and a mistake is whoever creates the product,
who in production may be Lucia or Lauren rather than Steve. Presented with an empty `roaster` field
on a roaster-branded tote, filling it in is the obvious thing to do. That is `CLAUDE.md`'s
*correct by care, not by construction*, and the care is not repeatable.

**So the code asks the right question instead.** Every surface that means "is this coffee" tests a
single predicate rather than the roaster field, which makes a stray roaster value **harmless rather
than dangerous**. In the POC that is `isCoffee(p)` in `assets/ci-storefront.js`, currently derived
from shelf.

**PROD: the home for this is Shopify's native `product.type`** - `Coffee` / `Equipment` / `Merch`.
It is indexable, filterable, and needs no custom metafield. Do not invent a
`crema_italia.is_coffee` metafield; and do not store the flag redundantly alongside collection
membership, because one fact in two homes is the drift this project keeps removing (see §11 and
Review A findings A2/A3).

**Two rules that share this predicate today and must NOT be merged:**

| Question | Predicate | Owner |
|---|---|---|
| Is this coffee? (roaster page, reorder rate, Shop grid) | `isCoffee()` | taxonomy |
| Is this discountable? (first-order 5%, subscriber rate) | `eligibleForFirstOrderDiscount()` / `eligibleForSubscriberDiscount()` | Store Operating Standards §3 |

Both read "not Bottega" today, **by coincidence** - exactly as the freshness window and the benefit
grace period both happened to be 60 days. If Bottega ever became discountable, or a non-coffee shelf
were discountable, welding them together would be wrong. Keep them separate.

---
## 13. The production data model, derived from the POC catalogue (Review B, 2026-08-20)

`assets/ci-catalog.json` has been the de facto data model for eighteen batches. §1 above names the
**sources** ("native Products + variants + `crema_italia.*` metafields"); this section is the
**schema** — transcribed from what the POC actually uses, so it is not reconstructed from memory
during the build. Every field below was checked against its read-sites in `assets/ci-storefront.js`.

**Read §12 first.** It claims Shopify's native `product.type` for the coffee/not-coffee distinction,
which constrains what `shelf` can map to (§13.2, open).

### 13.1 Products — native Shopify fields

These are not metafields. Do not invent `crema_italia.*` keys for them.

| POC key | Production home | Note |
|---|---|---|
| `handle` | `product.handle` | |
| `title` | `product.title` | The coffee's own name, e.g. *Ethiopia Bombe* — **not** prefixed with the roaster (see §13.5) |
| `blurb` | `product.description` (short) or a metafield | The one-line card copy |
| `img` | `product.images` | POC object `{cls,label,style}` is a CSS placeholder and carries nothing |
| `sizes[]` | **variants** | See §13.3 |
| `category` (Bottega only) | `product.type` | *Equipment* / *Merch* — and see §12 |

### 13.2 Products — `crema_italia.*` metafields

| POC key | Metafield | Type | Coverage | Note |
|---|---|---|---|---|
| `roast` | `crema_italia.roast` | single-line, defined value set | 12/17 | The **facet**: `light` / `medium` / `dark` |
| `flavor` | `crema_italia.flavor` | single-line, defined value set | 12/17 | `fruit` / `sweet` / `bold` |
| `caffeine` | `crema_italia.caffeine` | single-line, defined value set | 12/17 | `full` / `decaf` |
| `region` | `crema_italia.region` | single-line, defined value set | 12/17 | Italian roasting region; roaster-level in the Standard, inherited by SKUs |
| `origin` | `crema_italia.origin` | single-line | 13/17 | Growing origin, e.g. *Ethiopia, Yirgacheffe* |
| `process` | `crema_italia.process` | single-line | 13/17 | *Natural* / *Washed* |
| `notes` | `crema_italia.tasting_notes` | list.single_line | 13/17 | Drives the note pills |
| `roast_date` | on the **lot** metaobject, not the product | date | 12/17 | **Per lot — see §13.9.** The POC stores it per product because it never models two lots of one coffee. Drives freshness, the displayed roast range, and the Offerta transition |
| `long` | `crema_italia.description_long` | multi-line | 13/17 | The "About this coffee" prose |
| `brewing` | `crema_italia.brewing` | multi-line | 13/17 | **A per-coffee brewing hint only** - "Reserve it for pour-over, where the florals carry". **Never store policy.** The roaster supplies this (Roaster Guide, "SKU back-story"), and a roaster has no reason to write our whole-bean rule. See the note below. |
| `component_handles` | `crema_italia.components` | list.product_reference | 1/17 | The BOM — see §7 |
| `low_inventory` | `crema_italia.low_inventory` | integer | 2/17 | Selezione scarcity cue |
| `scarcity` | `crema_italia.scarcity_note` | single-line | 2/17 | Selezione, e.g. *This shipment only* |
| `freshness_note` | `crema_italia.freshness_note` | single-line | 1/17 | Sorpresa, e.g. *Boxed for you when you order* |
| `price_unit` | `crema_italia.price_unit` | single-line | 1/17 | Overrides the per-unit denominator on bundles |

**A correction worth recording, because it shows how this section can go wrong (2026-08-21).** This
row previously read *"Brewing note; also where 'whole bean only' lives"* - which transcribed a
**fixture-data defect into the production schema as though it were the design.** All 13 fixture
coffees had our store-wide whole-bean policy pasted onto the end of a genuinely per-coffee brewing
hint, so the customer read the same instruction twice on every product page. Steve's diagnosis:
*"Our test data is wrong, not the feature."* The fixture data was corrected and this row now states
what the field is for.

**The general lesson:** transcribing the POC into a specification inherits the POC's mistakes as well
as its decisions, and a repeated boilerplate string is exactly the kind that looks like a convention.
Two such errors were caught on 2026-08-21 alone - this one, and the assumption that `shelf` is a
property of a coffee (§13.9). When a fixture value looks like a pattern, ask whether it is a decision
or an accident before writing it down as a rule.

**`shelf` — RESOLVED 2026-08-20, see §13.9.** It is a **tag on the product**, with an automated
collection derived from it for the shelf page URL. It cannot be `product.type`, which §12 claims for
coffee/not-coffee. More importantly, working it through showed that **shelf is a property of a lot,
not of a coffee** — the POC never models that because no fixture coffee appears on two shelves. Read
§13.9 before building anything that touches shelf, price or freshness.

**`subscription` is not a field.** In the POC it is a boolean; in production it is the **presence of a
selling plan group** on the product. Do not create a metafield mirroring it — that is build spec §11's
rule, and the object that enforces the rule is the selling plan itself.

**`best_by` is not a field either.** It is `roast_date + settings.freshness_window_days`. Storing it
would give one fact two homes that can disagree — see §13.5.

### 13.3 Variants

| POC key | Production home | Note |
|---|---|---|
| `sizes[].size` | variant option value | `250g` / `500g` / `1kg`. **A cart-matching identifier**, kept metric and raw; the dual US display is a render-layer concern (§10) |
| `sizes[].price` | `variant.price` | |
| `sizes[].original` | `variant.compare_at_price` | Offerta markdown only, 1/32 |

### 13.4 Roasters

The POC models roasters as records with 15 fields, all populated 5/5. §1 says "metaobject or
collection + metafields"; the field list argues for a **metaobject** — it has its own identity,
its own page, and is referenced by products.

`handle` · `name` · `town` · `region` (facet) · `founded` · `blurb` · `bio` (list of paragraphs) ·
`address` · `phone` · `website` · `find`

Products reference the roaster by handle (`roaster`), and bundles reference several
(`roasters[]` — a list, because a collection names more than one). **`portrait_cls` and
`portrait_style` do not carry** — they are CSS placeholder styling standing in for a logo (§13.6).

**Photography lives in Shopify too, not in the theme.** The logo is a `file_reference` field on the
metaobject; place or process shots are a `list.file_reference`. Both point at entries in **Shopify
Files**, served from Shopify's CDN with the usual `image_url` resizing filters. This is the same
POC-versus-production shift as the data itself: today `assets/ci-lucia.jpg` ships inside the theme and
roaster logos are CSS gradients, and in production **adding a roaster photograph requires no deploy**.
20 MB per file; constrain the field with file-type validations.

#### 13.4.1 Two capabilities to enable on the definition

- **`publishable`** — gives every entry a **DRAFT / ACTIVE** status. This is the visible/invisible
  flag: build a roaster up while you are still courting them, and flip to ACTIVE when their first
  pallet lands. It is enforced by the platform, not by our template logic. Verified behaviour: *"a
  metaobject can only be accessed if its status is active. If its status is draft, then the return
  value is nil"*, and storefront loops **skip** draft entries entirely.
- **`onlineStore`** — assigns a theme template and a URL so the metaobject renders as a real page.
  **The roaster profile page can be native**, rather than a route we build. Worth taking; the POC
  hand-rolls this because a mock has no alternative.

Also available and worth knowing: `renderable` (SEO metadata on the entry) and `translatable`, which
matters if roaster copy is ever published bilingually.

#### 13.4.2 The trap inside the publishable capability

**Draft resolves to `nil`, and `nil` renders as nothing.** A *live* product whose roaster or coffee
metaobject is still DRAFT silently loses its roaster name - no error, no warning, just a blank where
"by Gardelli Specialty Coffee" belongs. It looks correct in the admin and wrong only on the storefront.

**Rule: a product may not be published until every metaobject it references is ACTIVE.** This belongs
in Product Onboarding (§15.2) as a publish-time check, not as something to remember.

#### 13.4.3 Records are writable by API, which is what makes an application form possible

```
metaobjectCreate / metaobjectUpdate / metaobjectDelete        Admin GraphQL
stagedUploadsCreate -> upload to the returned URL -> file GID -> metaobjectCreate/Update
```

Images are that two-step: stage, upload, then pass the returned GID into the `file_reference` field.
`httpMethod: "POST"` is required for IMAGE resources - a documented gotcha.

**This is the whole reason an external onboarding form works.** Shopify has no supplier portal, and
its B2B features serve wholesale *buyers*, not vendors - so a roaster cannot log in to Shopify. But a
form outside Shopify can write a metaobject entry directly into the admin as **Draft**, photographs
included, for review. See §15.1 and §15.2.

**People** (`docs` §2) use the same shape at smaller scale: `id`, `name`, `role`, `group`,
`photo`, `bio[]`. §2 already prescribes sections + blocks rather than metaobjects for these.

### 13.5 Derive, never store — the pattern the POC repeats six times

The POC stores a display string **alongside** the machine value it is derived from, because a mock
has no cheap way to derive. Production must derive, or it inherits six opportunities for the two to
disagree — the same defect Review A found in `_meta` and the two 60s.

| Stored in the POC | Derived in production from |
|---|---|
| `display_title` — *"Gardelli - Ethiopia Bombe"* | `roaster.label` + `product.title`. **Not `roaster.name`** — that is *"Gardelli Specialty Coffee"*, which is why `label` exists and is the one display string worth storing |
| `roast_level` — *"Light"* | `crema_italia.roast` (`light`) |
| `components` — *"Gardelli Ethiopia, La Sosta…"* | the `component_handles` product references |
| `roaster.region_label` — *"Forlì · Emilia-Romagna"* | `roaster.town` + the display name for `roaster.region` (the facet is `emilia`, so a region needs its own label lookup — one place, not per roaster) |
| `roaster.find` — *"Forlì, Emilia-Romagna · gardellicoffee.com"* | `town` + `region` + `website` |
| `best_by` | `roast_date` + `settings.freshness_window_days`. **Verified against the catalogue:** 2026-06-20 + 60 = 2026-08-19, exactly as stored |

**`roaster.label` is the one to keep**, despite looking like the same pattern: it is the short form
used where `name` will not fit, and shortening a proper noun is an editorial judgement, not a
derivation.

### 13.6 Fixture-only — must never reach production

| POC key / asset | Why |
|---|---|
| `poc_rating` | Fixture ratings. Production reads the standard `reviews.*` data (§6.1). Standard §13.7 forbids fabricated ratings on the live store |
| `img.cls` / `img.label` / `img.style` | CSS gradient placeholders standing in for photography |
| `roaster.portrait_cls` / `portrait_style` | The same, for roaster logos |
| `ci-temp-lp1..3.jpg` | Temporary landing-page photography; two cannot ship for recorded reasons (`docs/photography-todo.md`) |
| `rebaseCatalogDates()` | Shifts fixture dates on load so the demo never ages out. Real dates come from the metafields |
| `_meta.*` | Mock-dataset provenance notes |

**One grep finds the review fixtures (`poc_rating`) and one finds the photography (`ci-temp-`).**
Preserve that property for anything fixture-shaped added later.

### 13.7 Drop these — carried in the catalogue and read by nothing

`seasonal` (2/17) and `as_is` (1/17) are never read by any code. They are leftovers from an earlier
merchandising idea. Do not transcribe them into the production schema; if the intent behind either
is still wanted, it needs re-deciding rather than resurrecting.

### 13.8 What this section is not

It is a transcription of what the POC **does**, not an endorsement of all of it. Where it disagrees
with a Standard, the Standard wins. `shelf` in particular is recorded as open rather than answered.

### 13.9 SKU, lot and shelf — the model, and how it maps to Shopify (Steve, 2026-08-20)

**Supersedes the `shelf` OPEN note in §13.2.** Worked out with Steve after he identified that the POC
never models the case that happens in month one: a new lot arrives while the previous one is still
sellable. Across all 17 fixture products, **no coffee appears on two shelves** — so shelf looked like
a property of a coffee, and it is not.

**Shelf, roast date, cost and freshness are properties of a LOT.** Roaster, origin, process, roast
level, tasting notes and brewing are properties of the COFFEE. Steve's notation:

```
SKU              the coffee - permanent identity
SKU.size         the SELLING PRICE (the master price)
SKU.shelf        which markup produces that price
SKU.lot          roast date, and the cost of that lot
SKU.lot.size     the cost at that size - stable unless the roaster changes terms
```

**Cost flows up from the lot; price is set at SKU x size and never varies by lot.** Two lots of the
same coffee sell at the same price even when they cost different amounts — you do not reprice the
shelf because a shipment cost more. This is exactly what the **"LAST"** in Standard §2's
`SKU_LAST_COST x Markup[shelf, size]` has always meant: the newest lot's cost sets the price for all
stock of that SKU.

#### The Shopify mapping

```
Product = SKU                                    subscriptions bind HERE, never to a lot
├─ crema_italia.coffee  metaobject_reference     roaster, origin, process, notes, brewing
├─ tag                  shelf                    drives which markup applies
├─ product.type         Coffee / Equipment / Merch   (§12 - NOT shelf)
├─ variants = sizes
│    ├─ price            = last_cost x Markup[shelf, size]   derived, never typed (§11)
│    ├─ compare_at_price = the pre-markdown price            Offerta only
│    └─ unitCost         = SKU_LAST_COST for that size       native "Cost per item"
└─ crema_italia.lots    list.metaobject_reference
     └─ lot: roast_date · roaster_lot_code · received_on · qty and cost per size
```

**Two native facts verified 2026-08-20, both load-bearing:**

- **`Cost per item` is native** (`InventoryItem.unitCost`), one value per variant, i.e. per size —
  which is precisely where `SKU_LAST_COST` belongs. **It is readable in GraphQL but NOT writable
  there**; updates go through the REST `inventory_item` endpoint's `cost` property. It is also gated
  behind the "View product costs" staff permission, which matters when Lucia or Lauren need access.
- **Shopify has NO native lot or batch tracking.** Inventory is one pooled number per variant per
  location. It cannot hold "3 bags from 13 June, 20 from 18 July."

#### Which lots are in stock is DERIVED, not tracked

No batch app and no fake locations are needed. **FIFO + recorded receipt quantities + current
on-hand is sufficient:**

```
L1 received 10 (roast 13 Jun)      total received 30
L2 received 20 (roast 18 Jul)      Shopify on-hand  8
                                   -> 22 sold; FIFO consumes L1 entirely
                                   -> remaining stock is L2 only
                                   -> the displayed roast range collapses to "Roasted 18 July"
```

Same principle as everywhere else in this spec: derive, do not store. **It breaks if stock is lost
off-book** — shrinkage, damage, or a pick out of FIFO order desynchronises the arithmetic, so
write-offs must be recorded as such rather than silently adjusted.

#### Display: a computed floor (SUPERSEDES the range, Steve 2026-08-21)

**This section previously specified a roast-date RANGE across lots in stock. That is superseded.**
Standard §5.4 v1.12 is authoritative; the rule is now:

> Roasted on or after 23-MAY-2026

**today minus `settings.freshness_window_days`, computed server-side.** It is a guarantee derived from
policy - *nothing we ship you is older than this* - not a report of what is in the bin.

**Why it replaced the range, and this matters for the build:**

- **It has no dependency on lot data.** A range needed the FIFO derivation to be correct AND the lot
  records to have been entered on time. This needs neither. A missed receipt cannot make it lie.
- **The range's fresh end was unreachable anyway.** Under FIFO a single-bag buyer always gets the
  oldest lot, so the upper bound was systematically optimistic.

**Compute it in Liquid, never in the browser.** A client clock can be wrong, and the store's timezone
is the correct one. CDN caching can only serve a floor a day or two old, which states a *wider* window
than we guarantee - true, and erring in the customer's favour.

**Offerta is the exception and shows its ACTUAL roast date**, because an Offerta product is one
split-off lot and knows its own date, and because showing the same floor on both shelves would make
them look identically fresh - hiding the very thing that justifies the markdown.

**`DD-MMM-YYYY` wherever a date is shown to anyone** (Standard §5.4). `03/07/2026` is 3 July to an
Italian roaster and 7 March to a U.S. warehouse.

**Drop `best_by` as a displayed field.** It is `roast_date + freshness_window_days` - showing both
displays one fact twice and aims the reader at a deadline rather than at freshness.

**FIFO is explained in the FAQ, not on the product page.** With a computed floor there is nothing on
the product page that needs explaining.

**The FIFO derivation is still needed** - just not for display. It drives the Offerta transition
(§14.2) and tells operations which lot is oldest.

#### Recall traceability — build it, do not over-build it (Steve, 2026-08-20)

**The bag carries the lot, so the customer identifies it, not us.** A recall of roasted beans is
rare, and when one happens it is date-bound and names lots. The customer reads the lot off the bag in
their kitchen to know whether they qualify. That is the source of truth, and it is better than
anything we could reconstruct.

**So our job is notification scope, not per-customer certainty.** Which lots were in stock during
which ship-date window is derivable from the lot records and FIFO (above). Notify everyone who
ordered that SKU in the window, slightly over-notifying, and let the bag settle each case. Proportionate
to the risk.

**What that changes:** asking a 3PL to record the lot picked per order is **worth asking for and must
not be a disqualifier**. An earlier draft of this section made it a third qualifying question
alongside Standard §12.9's two, which was over-scoped — it could rule out an otherwise good 3PL over
a rare event the packaging already handles. Ask; take it if offered; do not weight it heavily.

**Build, cheaply:**

- `roaster_lot_code` on the lot metaobject. **This is the one genuinely load-bearing field** — a
  recall notice names *the roaster's* lot, not our roast date, and without it somebody is
  reverse-engineering the mapping during the recall itself.
- The FIFO-derived lot stamped on the order line at fulfilment, **marked as derived rather than
  observed** so it is never mistaken for ground truth.
- Nothing else. No batch app, no per-lot inventory.

**One dependency, and it is on the roasters, not on us.** We never repackage — *"we do not roast,
grind, blend, or alter the roasters' packaging"* — so we cannot add a lot label ourselves. The whole
model above assumes the roaster prints a roast date or lot code on the bag. **Confirm this per roaster
at onboarding**, alongside the other roaster-facing questions. If one does not print it, that is worth
knowing before the first container, not during a recall.

#### Offerta stops being a markdown you type

Moving a SKU's aged stock to Offerta changes which markup applies, and the price falls out of
`last_cost x Markup[offerta, size]` with `compare_at_price` carrying the pre-markdown figure. No
typed number, no special case — §11 satisfied by construction.

**Two prices still require two products.** A 250 g variant cannot be $38 and $21 at once, and
collections contain products, not variants — so when aged units are split off while fresh stock
remains, the Offerta listing is a **separate short-lived product referencing the same coffee
metaobject**. No specification is duplicated; it is referenced. And **FIFO is therefore per shelf**:
Roccia ships the oldest fresh lot, Offerta the oldest aged lot. Archive these products rather than
deleting them, so order history and the recall record survive.

#### 13.9.1 The SKU format (Steve, 2026-08-21)

**`TRRRPPPPSS`** - ten characters, each `A-Z0-9`.

| Segment | Len | Meaning | Values |
|---|---|---|---|
| `T` | 1 | Type | `C` coffee, `B` Bottega |
| `RRR` | 3 | Roaster | links to the roaster metaobject |
| `PPPP` | 4 | Product | links to the coffee metaobject |
| `SS` | 2 | Size | `10` 100g, `25` 250g, `50` 500g, `1K` 1kg, `EA` each (Bottega) |

Capacity is not a constraint: 46,656 roasters and 1.6 million products per segment.

**It maps onto Shopify's grain correctly.** Shopify puts SKU on the **variant**, and the size segment
is exactly what makes this variant-level. The four sizes match the Roaster Guide's standard sizes.

**But understand what it is: a label, not a key.** Shopify does **not** parse SKUs - the field is
plain text, never decomposed, never used to resolve a relationship. Coffee links to roaster, and
roaster to region, through **metaobject references** (§13.4), not through the SKU string.

So the SKU encodes the same facts a second time, which is the two-homes problem this spec keeps
removing. **Resolution: the SKU is GENERATED from the metaobject references and never typed by
hand.** Then it cannot disagree with them. It earns its place for the thing metafields cannot do:

> **It travels.** The roaster, the freight forwarder, the 3PL, a packing slip, a scanner, a bag label -
> all of them see the SKU. None of them can see a metafield.

**There is deliberately NO shelf segment**, and that is load-bearing. Shelf changes when a lot ages
into Offerta; type, roaster, product and size do not. A SKU that encoded shelf would have to be
**physically relabelled** on every bag when stock moved shelves. It does not, so the printed label
stays true for the life of the bag. Do not "improve" this by adding a shelf character.

**OPEN:** is `PPPP` scoped **per roaster** or **globally unique**? Per-roaster is the natural reading -
each roaster numbers their own coffees, and `RRR+PPPP` still identifies the coffee uniquely - but it
decides who assigns product codes, so it needs settling.

#### 13.9.2 The consequence nobody has solved: one SKU, two products, one bin

Because the SKU carries no shelf, and because an Offerta split creates a **second Shopify product**
for the aged units (§13.9), production reaches this state:

> **One physical SKU. Two Shopify products. One warehouse bin.**

An Offerta order and a Roccia order resolve to the same SKU, on the same shelf, in the same
warehouse - and FIFO says *pick the oldest*. So **a full-price Roccia buyer is handed the aged bag**,
which is precisely the coffee that was moved to Offerta to avoid selling at full price. FIFO and a
split inventory are in direct conflict unless the aged units are physically segregated.

**Three candidate resolutions, OPEN (Steve, 2026-08-21) - decide before choosing a 3PL, because it is
a qualifying question larger than the two already in Standard §12.9:**

- **A · Segregate with a distinct identifier.** The Offerta product takes a suffixed SKU; the 3PL
  applies a sticker or moves units to a marked bin on instruction. Costs a physical touch per
  transfer, and briefly makes the bag's printed SKU incomplete.
- **B · Segregate by location only.** Same SKU, different bin, two locations tracked in the 3PL's
  WMS. Depends entirely on their system - a genuine qualifying question.
- **C · Never overlap.** Move a SKU to Offerta only when *all* remaining stock is aged. One pool, no
  segregation, no conflict.

**The 2026-08-21 window change may have made C achievable.** With replenishment on a 6-to-10-week
cadence, new stock arrives when the previous lot is roughly 42-70 days old. Against the old 60-day
window that lot was already at the edge and overlap was routine; against 90 days it has another 20-48
days to sell through before it is Offerta-eligible at all. The hardest case got rarer without anyone
designing for it.

#### Onboarding order in Shopify

Dependencies run downward; doing this out of order means rework.

1. **Metaobject definitions** — `roaster`, then `coffee` (references roaster), then `lot`.
   **Enable Storefront access on each**: definitions are private by default and Liquid cannot read
   them otherwise. This is the setting the Judge.me test turned on (§6.1) and it is the one most
   easily forgotten, because the failure looks like the data not existing.
2. **Product metafield definitions** — `crema_italia.coffee` (metaobject_reference),
   `crema_italia.lots` (list.metaobject_reference), plus the §13.2 facets. Turn on the
   **smart-collections capability** for any definition a collection will filter on (max 128
   definitions).
3. **Records before the things that reference them** — roasters, then coffees.
4. **Products** — one per SKU. Set `product.type`, the shelf tag, variants per size.
5. **Costs** — `unitCost` per variant, via **REST**, remembering the staff permission.
6. **Prices** — computed by the price tool from cost x markup (Standard §12.2), never typed.
7. **Lot records** — created per receipt, and referenced from the product. Products before lots: the
   reference runs product -> lots, one direction only.
8. **Automated collections** — condition `tag equals <shelf>`. These give the shelf pages their URLs.
9. **Selling plans** (Loop) on subscribable products. **`subscription` is not a field** — it is the
   presence of a selling plan group (§13.2).
10. **Flow** — daily scheduled trigger. Use the **Run code** action for the date arithmetic:
    date comparison inside Flow's Liquid conditions is unreliable and reported to fail silently.
    Two jobs, and only the second should be fully automatic: **flag** a SKU approaching the Offerta
    threshold for a human to decide how much stock to split, and **unpublish** at the end of the
    freshness window. The second is the hard stop the no-waste pledge depends on, and it is the one
    a person forgets and an automation gets right.
11. **Order-line lot stamp** at fulfilment.

**One product template, branching on shelf — not per-shelf templates.** Shopify assigns alternate
templates per product via `template_suffix`, so per-shelf templates would put the shelf fact in a
second home that has to be kept in step with the tag. One template that branches keeps a single home,
and it is what the POC already does. This deliberately overrides an older note in `CLAUDE.md` §10
that assumed per-shelf templates, written before any of this was understood.

## 14. Two surfaces the spec had never covered (Review B, 2026-08-20)

Every POC surface was checked against this document. Eighteen of twenty were covered somewhere.
These two were not.

### 14.1 The Roasting Regions page

An editorial page carrying an inlined SVG map of nine Italian roasting traditions, plus a list.
Reachable **only** from the Shop page's region filter — deliberately, as a discovery surprise rather
than a nav item (Steve, 2026-07-10). Not in nav, not in the footer.

- **Content:** rarely-changing editorial, so **static** under §1's umbrella rule. It does not need a
  merchant-editable data source; a page or a section is enough.
- **The map is the asset that matters.** `assets/ci-region-map.svg` is the source of truth for the
  artwork; the theme carries an **inlined copy** so it can be styled and responsively cropped. Those
  two can drift, and have: the OneDrive source still sets `font-weight:700` on its labels, which Inter
  does not have, so that copy fabricates a bold the theme's copy no longer does (open Cowork item,
  2026-08-18).
- **Region names are Italian by design** (Toscana, not Tuscany) in the map, while the page's list is
  English-first with the Italian in parentheses where the names differ. Deliberate; do not "fix".
- **The map deliberately omits Emilia-Romagna**, which is Gardelli's region — the map shows the nine
  classic espresso cultures, and the *filter* is a different list that names Emilia-Romagna and
  "Other" separately. **Map ≠ filter list**, by design (2026-07-10).
- The sub-label **em-dashes are a documented exception** to the no-em-dash rule (§6 of `CLAUDE.md`).

### 14.2 Offerta — how a product gets there

Standard §5 owns the *rule*: coffee approaching the edge of its freshness window moves to Offerta at
an honest markdown, and coffee that passes the window comes off sale entirely and is donated. The
build spec has never covered the **mechanism**.

- **The transition must be automated**, not a person remembering. `roast_date` plus
  `settings.freshness_window_days` determines it, and the intended tool is **Shopify Flow** (recorded
  2026-07-13 as the launch-phase answer, alongside spreadsheet-assisted pricing).
- **Two distinct transitions**, and only the first is a discount: *into* Offerta at the markdown, and
  *off sale* at the end of the window. The second is a hard stop, not a deeper discount — Standard §5
  and the no-waste pledge both depend on it, and it is the one a Flow is most likely to get wrong.
- **Offerta pricing is a markdown against the shelf matrix**, so the variant's `compare_at_price`
  carries the pre-markdown figure (§13.3). It is the only shelf that uses it.
- **Offerta carries a narrower guarantee** — defective replaced, "wish it were fresher" not. That
  sentence is stated in two places today and should be extracted to a snippet so the policy has one
  home (Review A finding A6, re-filed to the policy work).
- **Offerta is never subscriber-discounted** and never stacks (Standard §3).

## 15. Roaster Onboarding and Product Onboarding — two distinct processes (Steve, 2026-08-21)

**These are two things, not one, and conflating them is why the roast-date format looked like a gap
in the Roaster Guide.** It is not. The guide is a **pre-boarding** document, aimed at a roaster we are
still courting. A date format is a **per-SKU artifact** detail that only becomes real after a roaster
signs. Both processes need designing; **the design is a separate thread** and this section only
records what each one is, what already exists, and what is open.

### 15.1 Roaster Onboarding — courting to signed

**Ends when:** a roaster has agreed terms and exists as a `roaster` metaobject (§13.4).

**Already exists**, in OneDrive `Operations/In Italy/`:

- `Crema_Italia_Roaster_Guide_v*_it` / `_us` — eligibility, disqualifying conditions, FDA
  registration, bag sizes, packaging standard, roast-to-ship discipline, U.S. retail labeling,
  palletization, logistics, commercial terms, pricing process. **Italian is the document of record;
  English is for Steve's convenience.**
- `Crema_Italia_Roaster_Intro_Letter_v*` and the Vendor Intro Sheet — the approach.

**Owner:** Lucia Calò, Operations Manager - Italy, who is the purchasing contact named in the guide
and who reviews the Italian line by line.

**The roaster application itself can feed Shopify directly** - same mechanism as Product Onboarding,
described once in §13.4.3 rather than twice. A tokenised form writes a `roaster` metaobject as Draft,
photographs included; it becomes visible when it is set ACTIVE.

**Open:**

- **v7 Italian shipped 2026-08-21**, adding one line to the U.S. label's mandatory elements: *"Codice
  SKU Crema Italia, da noi assegnato e fornito insieme al modello di etichetta."* Cowork also fixed an
  orphaned bullet (a print-CSS `break-inside` rule), dropped *"(bozza in revisione)"*, and corrected an
  internal Brand Standards reference from v2.0 to v2.1 - all three authorised by Steve. English v7
  follows; **Italian remains the document of record.**
- **The 45-day arrival clause needs revisiting, and this is the coupling to watch.** The guide requires
  every bag to arrive with *"a minimum freshness window of at least forty-five (45) days following the
  labeled roast date"* - a figure expressed **relative to our window**. Against 60 days it meant
  arriving within 15 days of roast. Against the 90-day window set on 2026-08-21 it means arriving
  within **45** days, a far laxer requirement, loosened silently by a number changed in a different
  document. Steve's view is that the real controls are the bag specification, the roast-to-pickup
  limit and airfreight, and that 45 days may have been overstated as a requirement in the first place.
  **A separate thread, likely Cowork's.**
- **Note for the next pass:** the orphan fix scopes `break-inside: avoid` to *every* `h3 + ul` in the
  document, so page breaks may have moved throughout. No text changed, but the page numbers cited in
  `..._ELENCO_MODIFICHE.md` may no longer point at what they describe.
- The v6 file is still named `..._v6_pending_it`. If it is approved, the name says otherwise.
- Two known ambiguities deferred rather than bundled into v7, because bundling is how a
  painstakingly reviewed translation gets silently broken:
  - the packaging section says "compatible with U.S.-applied retail labeling" while the labeling
    section says *"Non rietichettiamo negli Stati Uniti"* - applied at origin. Ambiguous at best.
  - the packing list is our template and is the natural feed for lot data (§13.9), but does not
    explicitly require roast date and lot code as columns.

### 15.2 Product Onboarding — per SKU, after signing

**Ends when:** a sellable Shopify product exists, with a `coffee` metaobject, variants per size,
costs, a computed price, and an approved label.

**This is the process that populates §13's data model**, which is why it is recorded here rather than
purely as an operations matter. It does not exist as a defined process today; its inputs are
scattered across the Roaster Guide.

**The steps, as currently understood:**

1. **Roaster proposes a SKU.** The guide already specifies the payload under *"SKU back-story
   (mandatory)"*: name and tagline, origin, varietal, process, roast level, 3-6 tasting notes,
   back-story, brewing methods, and two or three high-resolution photographs.
2. **Crema Italia reviews and accepts.** No criteria are written down. Flavored coffee is already
   excluded; decaf is permitted with the method declared.
3. **Crema Italia assigns the SKU code** - `TRRRPPPPSS` (§13.9). The roaster never invents it.
4. **Cost is agreed per size**, which becomes `SKU_LAST_COST` and feeds the price via
   `cost x Markup[shelf, size]` (Standard §2). Cost is per lot; price is per SKU and size (§13.9).
5. **A pro-forma label is generated** and audited before the first production run - the guide already
   commits to "we audit a sample before the first production run". This is where the
   **roast date format** belongs, and it must be unambiguous: `03/07/2026` is 3 July to an Italian
   roaster and 7 March to a U.S. warehouse, which would break FIFO picking (Standard §5.4) and
   mislead the customer. Prefer `03 JUL 2026` or ISO `2026-07-03`.
6. **Records are created:** the `coffee` metaobject, the Shopify product, its variants, its
   metafields, and the label artwork.

**The technical pipeline exists and is not the hard part.** Metaobject records and their images are
writable through the Admin GraphQL API (§13.4.3), so a form outside Shopify can deposit a proposed
coffee - story, tasting notes, photographs and all - straight into the admin as a **Draft** metaobject
for review. Nothing needs to be retyped, and nothing becomes visible until someone approves it.

**For a handful of roasters, avoid accounts entirely.** Send a **tokenised link per roaster** rather
than building logins: no passwords, no resets, no support burden, and no Shopify customer account
being used for something it was not designed for. This is the same choice already made for review
collection - an emailed per-order link rather than an account gate - and for the same reason.

**Publish-time check, not a habit:** a product may not go live until every metaobject it references is
ACTIVE, or the live page silently renders a blank where the roaster name belongs (§13.4.2).

**Open, and the reason this needs its own thread:**

- **Manual forms or a simple online system?** For a handful of roasters and roughly 15 SKUs, a
  structured form is likely enough at launch - the same posture already taken on pricing, which is
  spreadsheet-assisted until volume justifies a tool (Standard §12.2). The form has to be started by
  Crema Italia, completed by the roaster, and reviewed by Crema Italia, which is a three-party
  workflow rather than a document.
- **Acceptance criteria** for a proposed SKU are undefined.
- **Who owns it** - Lucia is closest to the roaster, but SKU assignment, costing and label approval
  are Crema Italia decisions.
- **Where the artifacts live**, and how the accepted data reaches Shopify without being retyped.

### 15.3 Why they are separated

Roaster Onboarding happens **once per roaster** and is a relationship. Product Onboarding happens
**every time a SKU is added**, for the life of the relationship, and is a data pipeline. They have
different owners, different cadences, different outputs, and different failure modes - a badly
onboarded roaster costs a partnership, a badly onboarded product costs a wrong label or a wrong
price. Designing them as one process would optimise for neither.
