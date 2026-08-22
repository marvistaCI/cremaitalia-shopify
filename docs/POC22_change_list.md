# POC22 — policy links in the footer, and the disclosure at the point of consent

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is the only authoritative
statement of what is deployed. This file is the build record.

Two items, both consequences of the four Shopify policies going live on 2026-08-22. The first is
housekeeping. The second is the one with statutory shape, and it is the one that would have been
missed: Steve asked *"do we need something added for a POC?"* about the footer, and the answer turned
out to be larger than the footer.

---

## 1 · Footer policy links, and one duplication removed

**The problem.** Four policies were published and **nothing on the storefront linked them.** Shopify
links all policies from the **checkout** footer automatically, so nothing was broken at the point of
sale — but a customer deciding whether to trust the store never reaches checkout.

**"Legal notices" as a single link was considered and rejected**, for three reasons worth not
re-litigating:

1. **There is no destination.** `/policies`, `/policies/` and `/pages/policies` all return 404 —
   Shopify has no policy index route. A single link needs a page we build and maintain, which is a
   third home for content that already has two.
2. **The label collides with a field we deliberately left unset.** "Legal notice" is the Shopify
   policy slot for an EU-style *Impressum* (Germany §5 DDG, and equivalents in Austria and
   Switzerland). It is not required for a US-only DTC seller, and we left it empty on purpose. A
   footer link by that name pointing somewhere else is how a future session ends up hunting for it.
3. **Shipping and Returns are purchase content, not legal content.** A shopper wants the
   free-shipping threshold and *love your first bag, or we send a different one, free* **before**
   deciding to buy. "Legal" signals fine print nobody clicks, so that label would bury the two best
   pre-purchase reassurances on the site.

**Shape shipped.** `Shipping` and `Returns` joined the main footer list. `Terms` and `Privacy` sit in
a quiet 12px line directly beneath the company line, which is where fine print belongs and keeps the
main list short.

**And it removed a duplication rather than adding one.** `#page-shipping` was a **417-character
condensed paraphrase of the published shipping policy** — same free-shipping threshold, same $8.50
flat, same two carriers, all three transit bands. Two homes for one set of facts, which would drift
the moment either was edited. **Deleted** (851 characters of markup), and `Shipping` now points at
`/policies/shipping-policy`. Only two references existed site-wide, so removal was clean.

Leaving the SPA is the **production-correct** behaviour rather than a compromise: in the real theme
these are ordinary pages.

**One CSS note.** The footer now mixes `<button>` (SPA routes) with `<a>` (policy pages). Both are
styled to render **identically** — verified computed-identical at 12.8px, `rgb(140,126,106)`,
underline, Inter. A policy link that looked different would read as a different *kind* of thing,
which it is not from the reader's side.

---

## 2 · The automatic-renewal disclosure, beside the subscription toggle

**This is the item with statutory shape, and only half of it had shipped.** `docs/legal/v2-deltas.md`
B1 specified **two placements** — the Terms of Service page, and a short line at the point where
consent is actually given. Terms shipped on 2026-08-22. The product page did not.

**What was there** was good merchandising and **not a renewal disclosure**:

> 10% off every shipment and free shipping, your standing subscriber benefit on Roccia, Sorpresa, and
> Selezione. Cancel anytime. Default is a one-time purchase.

It never says the card is charged **again, automatically**, at what **frequency**, or at what
**amount**. Federal **ROSCA** and a growing set of state automatic-renewal laws want exactly that,
clearly and conspicuously, **before** the customer consents.

**Worse, and only visible by driving it:** `#pd-cadence` computes `display:none` until the box is
ticked. So the cadence pills — the only place the frequency appeared — were **absent from the screen
at the moment of the affirmative act.** The new line closes that with *"at the cadence you choose"*
rather than by revealing the pills early, which would have cluttered the default one-time path.

**What shipped:**

> Subscribing charges your card automatically at the cadence you choose, at the price shown, until
> you cancel. No minimum and no cancellation fee, and cancelling stops the next shipment immediately.

*"Cancel anytime"* was **moved out** of the line above rather than left to sit twice, so cancellation
is stated once, here, beside the renewal terms it qualifies.

### The design decision that matters more than the wording

**It is set at the same size as the benefit line, and must stay that way.** Verified computed-equal:
both paragraphs 13.12px, `rgb(107,74,56)`, weight 400, opacity 1.

The instinct to shrink and grey legal text is **precisely what "clear and conspicuous" exists to
defeat** — small print under a subscribe toggle is the pattern regulators look for. This is one of the
few places where this brand's quiet-and-small reflex is the wrong call, and it is commented as such at
**both** the render site (`ci-storefront.js`) and the style site (`ci-storefront.css`), with the size
and colour restated in the CSS rather than inherited so that a later edit to the benefit line cannot
silently shrink this one.

---

## Verification

- `node --check` clean; `JSON.parse` on the catalog clean.
- `shopify theme check` — **15 offenses / 0 errors / 15 warnings**, the documented baseline, **0 new**.
- Driven live in `shopify theme dev`, and **looked at** at 375 and 1280, not only measured.
- Footer: seven links plus the legal pair, all four `href`s correct, buttons and anchors
  computed-identical, no horizontal overflow at either width, single row at 1280.
- All four policy URLs return **HTTP 200 through the theme**, not merely as tags in the markup.
- `#page-shipping` gone from the rendered DOM; zero dangling references.
- Subscription block: both paragraphs computed-equal in size, colour, weight and opacity.
