# Legal pages — status, decisions, and the deltas for v2

**The draft policy text already exists and is not in this repo.** It is
`Legal\Crema_Italia_Shopify_Legal_Pages_Setup_v1.docx` in OneDrive, written by Cowork on 2026-08-20:
an admin walkthrough plus full drafts of all four policies, each line traced to a Project Brief
section, with nine CONFIRM flags marking real open decisions.

**This folder does not duplicate it.** Cowork's document is the draft text and lives in Cowork's lane;
this folder is the **decision and status record** and lives in Code's. Two sets of drafts would be the
two-homes defect this project keeps removing. `v2-deltas.md` carries everything that must change in a
v2, ready to become a Cowork prompt.

> **Process note, recorded because it is the lesson.** Two drafts of the shipping policy and contact
> information were written here on 2026-08-22 before anyone looked in the Legal folder — one `ls`
> away. Checking what already exists is the discipline applied all session and it was skipped on this
> task. The duplicates were deleted rather than reconciled; the genuinely new material survives in
> `v2-deltas.md`. Encouragingly, both drafts reached the **same** conclusion on physical returns
> independently, which is some evidence the reasoning is sound rather than merely fluent.

---

## Live status — four policies PUBLISHED and verified 2026-08-22

Steve pasted four policies from `ready-to-paste.md`. **Verified by fetching the public URLs, not by
reading the admin** — every one returns HTTP 200 and carries its expected text.

| Policy | Status | URL |
|---|---|---|
| Contact information | **Published** (Shopify marked it Required) | `/policies/contact-information` |
| Shipping policy | **Published** | `/policies/shipping-policy` |
| Return and refund policy | **Published** | `/policies/refund-policy` |
| Terms of service | **Published**, incl. the automatic-renewal disclosure | `/policies/terms-of-service` |
| Privacy policy | **Still Shopify's automated one** (`Last updated: May 11, 2026`) | `/policies/privacy-policy` |
| Legal notice | Not set — **and should stay that way**, see below | 404 |
| Return and cancellation **rules** | Still unset — the structured returns config | — |

**Privacy was not replaced, and that is a live choice rather than an oversight.** `ready-to-paste.md`
§5 framed it as a real decision: the automated policy updates itself as Shopify's practices change and
ours would not, but it cannot know about Loop, Judge.me, or the taste profile. The moment the taste
profile becomes a customer metafield joined to reviews, the automated policy is describing a different
business than the one we run. **Decide before that ships, not after.**

### Legal notice — leave it unset, deliberately

Shopify offers the field because several jurisdictions require an *imprint*: Germany's Impressum
(§5 DDG, formerly TMG), and equivalents in Austria and Switzerland. It is a statutory disclosure of
who operates the site — legal name, address, contact, register entry, VAT ID, managing director — and
in Germany its absence is directly actionable.

**No US federal or Florida law imposes an equivalent.** The merchant-identity need that a US regulator
or a payment processor actually looks for is met by the **Contact information** page, which is why
Shopify marks that one Required and this one optional. We ship to US addresses only (stated in the
shipping policy), so no EU obligation attaches.

**Revisit only if we ever sell into the EU or DACH.** Not on the roadmap; Canada is the market
mentioned as a possible second. If that changes, this is a legal requirement rather than a nicety.

### The storefront still links almost nothing

The live coming-soon footer (`snippets/ci-footer.liquid`) links **Privacy Policy only** — so the one
policy link on the public site points at the automated policy we did not write, and the four we did
write are reachable only by typing the URL. The POC theme's footer links **none** of them.

Shopify links all policies from the **checkout** footer automatically, so nothing is broken at the
point of sale. But a customer deciding whether to trust the store never reaches checkout. **This is
Code's work and belongs in the next POC batch** (and a scoped push for the live theme's footer).

---

## Decisions taken

**No physical returns of coffee.** Confirmed by Steve, 2026-08-22. Roasted coffee is perishable; once
a bag leaves the facility it cannot be resold, so a return costs the postage *and* destroys the goods.
The remedies already in the record are better and cheaper: *love your first bag, or we send a
different one, free*, plus same-day replacement on damage or loss with the customer keeping the
original. **This also removes what looked like a 3PL dependency** — no returns address is needed, so
the refund policy is not blocked on selecting a fulfilment partner. **Bottega equipment is the
exception** and needs its own clause; a grinder is durable and returnable.

**Address: the Lutz address is what shipped, as an interim.** Steve first chose the registered
agent's address (2026-08-22) — then, with no agent selected and the pages otherwise ready, chose to
publish `17716 Royal Eagle Ln, Lutz, FL 33549` rather than let one unmade decision hold four finished
policies. **So the earlier decision is deferred, not reversed**, and it is item 5 below. Two things
make the interim defensible: Florida publishes the registered agent's address on Sunbiz, so if Steve
is his own agent the Lutz address is already public; and see the caution in `v2-deltas.md` C1 — a
registered agent accepts service of process, not customer mail, and many will refuse or discard
ordinary post, so the eventual swap needs a **business address service**, not just an RA.

---

## What is left

1. **Link the policies from the storefront footer** — POC theme, plus a scoped live-theme push to
   widen the coming-soon footer beyond Privacy Policy. Code's work.
2. **Set the return and cancellation rules** — the structured config that powers self-serve returns,
   still unset. Should mirror the published refund policy.
3. **Decide the privacy policy**, before the taste-profile metafield join ships.
4. **Counsel pass before launch** — the automatic-renewal section, arbitration (omitted for now), and
   the interim choices in `ready-to-paste.md`: the 30-day satisfaction window, the billed-but-unshipped
   refund, and the Lutz address pending a registered agent.
5. **Swap the address** once a registered agent is selected. Note the caution in `v2-deltas.md` C1: an
   RA accepts service of process, not customer mail, and many refuse ordinary post.

**The caveat lives here and in the tracker, not on the public pages.** A visible "unreviewed" banner
tells a customer not to rely on what they are reading and tells a payment processor we know the pages
are incomplete. Every clause published describes what the business actually does, which is the real
standard.

**None of this is legal advice.** Every draft is grounded in a documented Crema Italia practice rather
than boilerplate, which is the right way to write a policy and not a substitute for review.
