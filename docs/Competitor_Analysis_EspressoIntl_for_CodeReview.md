# Prompt for Code Project — Competitor Review: Espresso International (.us)

**Paste everything below into the Crema Italia Shopify Code session.** It contains a task
prompt followed by the competitive analysis it refers to.

---

## TASK

You are the agent building the Crema Italia Shopify storefront. I've had a competitor
scoured — **espresso-international.us**, a 20-year-old Shopify-based Italian-coffee
importer. The full analysis is attached below.

Read the analysis, then tell me what — if anything — we should change in our build. Do
**not** edit any files yet. This is a review-and-recommend pass only.

Ground rules for your recommendations:

1. **Our authority order is unchanged.** POC v3 + `Shopify_Magic_Build_Prompt_v3_FINAL`
   win, then `00_PROJECT_BRIEF.md`, then `CLAUDE.md`, then brand standards. If a
   competitor idea conflicts with a locked decision (custom Liquid theme, Loop
   subscriptions, the discount matrix, the Shop ▾ · Roasters · About · Journal · Bottega
   nav, brand voice/palette/type), **flag the conflict — do not silently adopt it.**
2. **We are a curator, not a marketplace.** They win on breadth, price, and logistics
   (55+ roasters, thousands of SKUs, capsules/sweets/machines). We win on a tightly
   curated few roasters and editorial restraint. Reject anything that pushes us toward
   their sprawling, high-density, discount-loud model. Our rule stands: *fewer elements,
   more whitespace, smaller logo, larger margins.*
3. **Stay within brand.** No new colors, no "hand-picked / world-class / exclusive"
   language, tricolore as thin rules only, italics reserved for Italian.

## WHAT I WANT BACK

A prioritized, skimmable memo — no code — with these sections:

1. **Adopt** — concrete, on-brand ideas worth pulling into our build. For each: what it
   is, why it fits us, where it lands in our structure (which template / metafield /
   section / phase from the brief), and rough effort (S/M/L).
2. **Adapt** — competitor ideas that are good *in principle* but need reshaping to fit a
   curator brand. Say how you'd reshape them.
3. **Reject** — things that suit a marketplace but not us, with a one-line why.
4. **Conflicts to escalate to Steve** — anywhere a tempting idea collides with a locked
   spec, or where you need a decision before acting.
5. **Data-model / metafield implications** — especially around their rich product-attribute
   template (blend ratio, roast, intensity, aromas, region, machine type, roast date /
   best-before, INEI cert, EAN). Map each to our `crema_italia.*` metafields: which we
   already have, which are new, which we should skip.

Keep it tight and decision-oriented. Assume I'll act on it.

---

## ATTACHED ANALYSIS — Espresso International (espresso-international.us)

### What it is
A 20+ year-old German coffee importer (Hamburg — German phone, Ekomi/Trustpilot DE
reviews, B2B "tax-free" page) running a multi-country Shopify storefront network
(.de/.com/.co.uk/.se/.it/.es/.fr/.at/.us). The `.us` is the US-facing arm. **Built on
Shopify — same platform as us.** Positioning: *"Your Online Shop for Italian Espresso &
Premium Coffee… over 40 roasteries."* Tagline: "Discover freshly roasted coffee from the
best growing regions."

### Strategic posture (the opposite of ours)
A broad **marketplace/aggregator**, not a curator. ~55 roaster brands (Lavazza, Illy,
Kimbo, Borbone, Hausbrandt, Passalacqua, Diemme, plus many micro-roasters), thousands of
SKUs across beans, ground, ESE pods, Nespresso-compatible capsules, machines/accessories
(Bialetti, Rocket, ECM, Sage, Motta, Comandante), and Italian sweets (panettone,
licorice, chocolate, torrone). Their edge is **selection + price + logistics**, explicitly
"fair prices through direct relationships with roasteries."

### Catalog architecture — their faceted navigation is the standout
They slice one catalog many ways (useful reference for our 3-axis filter):

- **Brew method:** Espresso machine, Moka, French press, Filter, Capsule, ESE pod, Fully automatic
- **Bean type:** 100% Arabica / 100% Robusta / blends / single origin
- **Intensity:** Mild / Strong / Balanced
- **Attributes:** Organic, Fair Trade, Direct Trade, Low-acid, Decaf, Dark roast, Aromas, Caffeine content
- **Region** + "Roasters by Region"
- **Merchandising collections:** Bestseller, New, Great Value, Bundles, Award-Winning,
  Exclusive / "Only With Us", Specialty, Jamaica Blue Mountain

### Product page — data-rich (their strongest asset)
The La Genovese Oro page shows the template depth:

- Structured attributes: blend ratio (80% Arabica / 20% Robusta), roast degree (Medium),
  intensity (Balanced), aroma notes (Chocolaty, Nutty), recommended machine (Portafilter /
  Fully automatic), region (Northern Italy)
- Full tasting copy
- **Roasting date + best-before shown on the listing** ("Roasting date: 06.2026 / Best
  before: 06.2028")
- INEI "Italian Espresso" certification badge
- Manufacturer name + full address + EAN barcode
- Price-per-kg alongside pack price
- **15 dated customer reviews, 4.88/5** shown inline

Strong trust + SEO signals throughout.

### Commerce mechanics
- **Pricing:** mid-market. 1kg whole bean ≈ $30 (≈$29.94/kg); premium Jamaica Blue
  Mountain duo $76 (≈$38/kg). Heavy strike-through discounts (8–10%) and per-kg framing.
- **Discounting:** newsletter = 5% off first order; bundle pricing; a "Your Coffee Pack"
  build-your-own sampler (code TRY at checkout); warehouse sale; wholesale "from 60kg" +
  B2B tax-free.
- **Subscriptions:** body copy mentions "start your espresso subscription," but there is
  **no visible subscribe-and-save** on the product page. (Relevant to our Loop plan — an
  opportunity to do subscriptions better than they do.)
- **Shipping:** DHL Express worldwide, 1–3 day dispatch, **$50 minimum order**,
  customs/duties pushed to the buyer. 30-day returns, freshness guarantee.
- **Payments:** PayPal, Klarna, Visa/MC/Amex, Apple/Google Pay, SEPA, invoice.
- **Trust stack:** Ekomi + Trustpilot + Google Maps rating, INEI cert, payment/carrier
  badges, founder / team / philosophy pages, active blog ("Coffee Insights").

### Visible weaknesses (our openings)
- Untranslated German leaks into the US site ("inkl. MwSt. zzgl. Versand," "Bewerte uns,"
  "Sind Sie hier richtig?").
- No real US presence — German phone number and CET support hours on a `.us` store.
- Customs/duty friction and a **$50 order minimum** for US buyers.
- Generic, high-density Shopify look — sprawling, discount-loud, no editorial soul.
- Subscriptions underdeveloped despite being a natural fit for coffee.

### One-line takeaway for the build
They prove the *category mechanics* (rich attribute templates, per-kg pricing, freshness
dating, deep faceting, review density, samplers) that we should match or beat — while we
deliberately reject their breadth, density, and discount-loudness in favor of curation and
editorial calm.

---

*Source: competitive scour of espresso-international.us — homepage, shipping policy, and a
representative product page (La Genovese Oro), captured 2026-07-01.*
