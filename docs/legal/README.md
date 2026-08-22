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

## Live status, read from the Shopify admin 2026-08-22

| Policy | Shopify status |
|---|---|
| Privacy policy | **Automated** — Shopify generates and auto-updates one |
| Return and refund policy | No policy set |
| Terms of service | No policy set |
| Shipping policy | No policy set |
| Legal notice | No policy set |
| **Contact information** | **Required** — flagged by Shopify, unset |
| Return and cancellation **rules** | No rules set — the structured returns config, separate from the written policy |

**Two corrections to the project record, both from reading rather than assuming.**

**A privacy policy exists.** Every scoring pass since POC13 recorded *"no privacy policy"* and the
CLAUDE.md §10 open item says the legal pages *"do not exist anywhere in the repo."* Shopify has an
automated one. What is true is narrower and still worth fixing: **the storefront links none of them.**
The POC footer carries Promise, Shipping, About, FAQ, Journal and Contact, and no policy links.
Shopify links policies from the **checkout** footer automatically; the theme covers nothing.

**Checkout is not hard-gated on them.** Cowork checked this on 2026-08-20 and it corrects a framing
this repo has repeated: Shopify's documentation describes no technical gate blocking checkout until
the four pages exist. They matter for Shopify Payments review, consumer-protection expectations and
trust — which is reason enough — but "checkout requires them" overstates it.

---

## Decisions taken

**No physical returns of coffee.** Confirmed by Steve, 2026-08-22. Roasted coffee is perishable; once
a bag leaves the facility it cannot be resold, so a return costs the postage *and* destroys the goods.
The remedies already in the record are better and cheaper: *love your first bag, or we send a
different one, free*, plus same-day replacement on damage or loss with the customer keeping the
original. **This also removes what looked like a 3PL dependency** — no returns address is needed, so
the refund policy is not blocked on selecting a fulfilment partner. **Bottega equipment is the
exception** and needs its own clause; a grinder is durable and returnable.

**Publish the registered agent's address, not the Lutz home address.** Steve, 2026-08-22 — **and no
registered agent has been selected yet**, so this is now a blocking dependency for the contact
information page. See `v2-deltas.md` for the caution that comes with it.

---

## Order of work

1. **Contact information** — Shopify marks it Required. Blocked only on the registered agent.
2. **Shipping policy** — Cowork's 3.4 is ready; apply the deltas.
3. **Return and refund policy** — Cowork's 3.3 is ready; two CONFIRM items remain.
4. **Terms of service** — the auto-renewal disclosure is missing and is the one part I would route
   through counsel rather than ship on confidence.
5. **Privacy policy** — the automated one is a reasonable base and a poor finish; it cannot know our
   processors.
6. **Link all of them from the storefront footer** — a theme change, not a policy one, and the only
   item on this list that is Code's work rather than Steve's or a lawyer's.

**None of this is legal advice.** Every draft is grounded in a documented Crema Italia practice rather
than boilerplate, which is the right way to write a policy and not a substitute for review.
