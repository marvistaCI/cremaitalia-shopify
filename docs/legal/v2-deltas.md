# What must change in Legal Pages Setup v2

Everything below is a delta against `Legal\Crema_Italia_Shopify_Legal_Pages_Setup_v1.docx`
(Cowork, 2026-08-20). Ready to become a Cowork prompt once Steve settles the two starred items.

---

## A. Three of the nine CONFIRM items are now answerable

**A1 · Public-facing support email — RESOLVED.** v1 flagged this on all four pages, noting only
`usagent@` (FDA) and `steve@` (notices) existed. As of 2026-08-22 the Google Workspace account carries
**`info@`, `support@` and `contact@`**, all delivering to `steve.roberts@cremaitalia.com` as aliases.

Use **`support@cremaitalia.com`** on all four policies.

> **One thing to settle first, and it is not cosmetic.** All three are *aliases* into one inbox. A
> support address printed on a legal page is a promise to answer, and an alias that reaches exactly
> one person does not survive that person being on a plane. A **Google Group** is free, needs no
> licence, and can include external addresses — so Lauren could work it without a Workspace seat.
> Decide alias vs Group *before* the address is published, not after it is busy.

**A2 · Naming vendors in the privacy policy — the facts now exist.** v1 recommended generic phrasing
because no vendor list existed. One does now, from the systems inventory:

| Processor | What it handles |
|---|---|
| **Shopify** (incl. Shopify Payments) | Storefront, orders, customers, payment processing |
| **Loop Subscriptions** | Subscription contracts, cadence, payment tokens for recurring orders |
| **Judge.me** | Reviews and moderation — note the review `author` is a **customer reference** |
| **Google Workspace** | Company email, and therefore any customer correspondence |
| **Shopify Email** (Klaviyo later) | Marketing and lifecycle email |

**I would name them, contrary to v1's recommendation, and the reason is specific rather than
general.** The plan is to store the **taste profile as a customer metafield** and to join it to
reviews through that `author` reference. That is behavioural preference data about an identified
person, used to shape what they are shown. Generic phrasing is defensible for a plain shop; it reads
thin next to a documented profiling join. Naming processors costs an edit when a vendor changes, which
is a small price and is exactly what a version-controlled source is for.

**A3 · Physical returns — RESOLVED, and v1 already had it right.** Steve confirmed no physical returns
on 2026-08-22. v1's §3.3 already contains the *"Why we don't ask for bags back"* section and reasons
to the same conclusion independently. **No change needed** — record it as confirmed rather than open.

---

## B. Missing from v1, and the most important item here

**B1 · The Terms of Service has no automatic-renewal disclosure.**

v1's *Accounts and subscriptions* paragraph describes the cadence and the cancellation mechanics
accurately, and never states the thing the law is actually concerned with: that the subscription
**renews automatically, at a stated price and frequency, until the customer cancels.**

US federal **ROSCA** and a growing set of state **automatic-renewal laws** require clear and
conspicuous pre-purchase disclosure of the renewal terms, affirmative consent to them, and a simple
cancellation mechanism. The FTC has been active in this area. **Loop supplies the mechanism — the
portal, pause, skip, cancel. The disclosure is the merchant's.**

The substance is already locked in Store Operating Standards §6, so this is drafting rather than
deciding: cadences of 4, 6 or 8 weeks; 10% off and free shipping on every shipment; skip, swap, pause
and cancel with no fee and no minimum commitment; cancellation stops shipping immediately.

**Two placements, not one.** The terms page, and a short line **beside the subscription checkbox on
the product page**, where consent is actually given. The product page currently says *"10% off every
shipment and free shipping… Cancel anytime. Default is a one-time purchase."* — good, and not a
renewal disclosure.

> **This is the one page I would route through counsel before launch rather than after.** Everything
> else here is grounded in documented practice; this one has statutory shape.

**B2 · The shipping policy should carry Standard §8.1.** v1's §3.4 covers packaging but not this:

> Every package includes a packing slip. **No document inside any package shows a price.** Your
> receipt is the order confirmation we email you.

Worth stating publicly rather than leaving as an internal rule — it is the sentence that makes every
order giftable without a flag, and it explains an absence a customer would otherwise find odd.

**B3 · The live Shopify status was not what v1 assumed.** v1 §1 states there is no Privacy Policy,
Terms, Refund or Shipping policy anywhere. Read from the admin on 2026-08-22: **privacy is
Automated**, contact information is **Required and unset**, and **return and cancellation rules** are
unset — a structured config v1 does not mention at all, separate from the written refund policy.

Update §1 and add a step for the return rules and the contact information field.

**B4 · The storefront links no policies.** Shopify handles the checkout footer automatically; the
custom theme's footer carries Promise, Shipping, About, FAQ, Journal and Contact and no policy links.
v1's §2 flags this correctly as a manual step. **It is Code's work, not Cowork's** — recorded here so
it is not lost between lanes.

---

## C. New open decisions

**C1 · ★ No registered agent has been selected.** Steve decided on 2026-08-22 to publish the
registered agent's address rather than the Lutz home address. Sound instinct, and it needs care:

- **A registered agent accepts service of process, not customer mail.** Many commercial RA services
  explicitly prohibit using their address as a general business or mailing address, and will refuse or
  discard ordinary post. Publishing an RA address as a customer contact can therefore fail quietly.
- **What is usually wanted is a business address service** — most commercial RAs sell one alongside
  registered-agent service, or a commercial mail-receiving agency provides it separately.
- **Check who the current agent already is.** A Florida LLC must designate one at formation, and for
  a single-member LLC it is very often the member at the member's own address. If that is the case
  here, "use the registered agent address" resolves back to the Lutz address and achieves nothing. The
  answer is in `Legal\Sunbiz for Crema Italia, LLC (Orginal Filing).pdf`, which no text document in
  the project names.
- **The FDA filing is separate.** That address is on file with a regulator and does not have to match
  the website.

**C2 · ★ The two CONFIRM items v1 raised that remain genuinely open**, both sharp and neither
addressed anywhere in the project record:

- **A reporting window for the satisfaction guarantee.** *Love your first bag, or we send a different
  one, free* has no time limit. The brief sets a 7-day window for wholesale pallet damage only. An
  open-ended consumer guarantee is a liability with no end date.
- **An already-billed, not-yet-shipped subscription cycle, cancelled immediately.** Refunded,
  credited, or non-refundable? Not addressed. Worth noting Loop bills ahead of shipping, so this will
  happen.

**C3 · Governing venue and arbitration.** v1 suggests Hillsborough County, FL to match the promissory
note template, and recommends routing the arbitration and class-action-waiver question through
counsel. Still open, and it belongs in the same counsel pass as B1.

**C4 · Analytics and ad pixels.** v1 needs the list for the cookies section. Still undecided — this is
the same gap the systems inventory tracks as *"Analytics stack."*
