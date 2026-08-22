# Legal pages — drafts, status, and what blocks each

**These are drafts for Steve to review and a lawyer to check. They are not legal advice.** Every
sentence is grounded in a documented Crema Italia practice — the Standards, the brief, or a live
setting — rather than in boilerplate, because a policy that does not match what the business actually
does is worse than none: it creates commitments nobody keeps.

**Where they live in production.** Shopify's own **Settings → Policies**, not theme pages. Shopify
links policies from the **checkout footer automatically**, which is where they legally matter most.
The theme should link them too (see the gap below), but the policy text belongs in Shopify.

**This folder is the source; the Shopify admin field is the render.** Same model as the Standards.
Draft here, review here, paste into Shopify, and never edit only in the admin — an admin-only edit is
invisible to diff and is exactly how the meta description drifted for months (POC16).

---

## Live status, read from the admin 2026-08-22

| Policy | Shopify status | Draft here |
|---|---|---|
| Privacy policy | **Automated** — Shopify generates and auto-updates | Review needed, not a draft |
| Return and refund policy | No policy set | One decision open |
| Terms of service | No policy set | Subscription terms are the careful part |
| Shipping policy | No policy set | **Ready** — `shipping-policy.md` |
| Contact information | **Required** (Shopify flags it) | **Ready** — `contact-information.md` |
| Legal notice | No policy set | Optional; not required for US-only DTC |
| Return and cancellation **rules** | No rules set | Structured config, separate from the written policy |

**Correction to the audit record.** Every scoring pass since POC13 recorded *"no privacy policy."*
One exists, automated. What is true is that **the storefront links none of them** — the POC footer
carries Promise, Shipping, About, FAQ, Journal and Contact, and no policy links at all. Shopify covers
checkout; the storefront does not cover itself.

---

## Order of work, and why

1. **Contact information** — Shopify marks it Required, it is five minutes, and it is the one gap the
   platform itself is complaining about.
2. **Shipping policy** — fully determined by Standard §8. No decisions needed. Drafted.
3. **Return and refund policy** — one decision (below), then drafted.
4. **Terms of service** — the subscription auto-renewal disclosure is the legally significant part and
   deserves care, not speed.
5. **Privacy policy** — the automated one exists; the job is checking it against the processors we
   actually use, which it cannot know about.
6. **Link them from the storefront footer** — a theme change, not a policy one.

---

## The decisions each one needs

**Refund policy — do you accept physical returns of coffee at all?**
My recommendation is **no**, and it dissolves what looked like a 3PL dependency. Returned food cannot
be resold, so a physical return costs the postage and destroys the goods. The Promise already commits
to the better remedy — *love your first bag, or we send a different one, free* — and Standard §8 already
promises same-day replacement on damage or loss with the customer keeping the original. A policy of
**"we replace, we refund, we do not ask for the coffee back"** is more generous, cheaper to run, and
removes the need for a returns address before the 3PL is chosen. **Bottega is different** — a grinder
is durable and returnable, so equipment needs its own clause.

**Terms of service — the auto-renewal disclosure is a real compliance area, not boilerplate.**
US federal law (ROSCA) and a growing number of state automatic-renewal laws require clear
pre-purchase disclosure of renewal terms, affirmative consent, and simple cancellation. Loop supplies
the *mechanism* — the portal, pause, skip, cancel — but the **disclosure is the merchant's**, and it
belongs in the terms and beside the subscription checkbox. **This is the one place I would want a
lawyer's eyes before launch rather than after.** Standard §6 already specifies the substance
(cadences, skip, swap, pause, cancel, no fee, no minimum), which is most of the drafting done.

**Privacy policy — the automated one cannot know our processors.**
Shopify's generated policy covers Shopify. It does not know about **Loop** (subscription contracts and
payment tokens), **Judge.me** (reviews, and the `author` customer reference), **Google Workspace**
(company email), the **taste profile** we plan to store as a customer metafield, or whichever email
platform is chosen. Those are real data flows to real third parties, and the taste profile is
behavioural data about an identified customer. The automated policy is a reasonable base and a poor
finish.

**Still genuinely blocked on the 3PL:** nothing, if returns are handled as above. That is the point of
the recommendation.
