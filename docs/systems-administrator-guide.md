# Crema Italia — Systems Administrator Guide

**Purpose.** If Steve Roberts is unavailable, this document lets a competent professional keep Crema
Italia running, fix what breaks, and meet the deadlines that would otherwise end the business quietly.

**Status: SKELETON, 2026-08-22.** Sections are structured and filled where facts exist. Where a
decision has not been made, it says so with the date it was raised, so staleness is greppable:

```bash
grep -n "DECISION PENDING" docs/systems-administrator-guide.md
```

> ## This document contains no passwords, keys, or account numbers, and never will.
>
> It must stay safe to hand to a lawyer, leave in a safe deposit box, or email under pressure. It
> names **which** accounts exist and **where** access is held. It never holds a secret. Anyone
> extending it must preserve that property.

---

## 1. First hour

**If you are reading this because Steve is unavailable, start here.**

1. **Can you get in?** See §2. Without access nothing below is actionable, and §2 currently has no
   answer. Solve that first.
2. **Is the store up?** `https://cremaitalia.com` should return the storefront. If it does not, the
   cause is most likely DNS (§3.1) rather than Shopify.
3. **Is email flowing?** Company mail runs on Google Workspace and depends on the **same DNS zone as
   the storefront**. If the site is down, assume email is too.
4. **Are subscribers still being billed?** Loop bills recurring orders on a schedule with no human
   involved. It keeps going. That is usually good and occasionally not — if fulfilment has stopped,
   billing must be paused deliberately (§5).
5. **What is due soon?** Check §6. Two of those deadlines are business-ending if missed.

**The single most fragile point in the business:** the `cremaitalia.com` DNS zone at Namecheap. It
carries both the storefront records and the MX records for all company email. One lapse takes down
revenue and communications together, including the address on file with the FDA.

---

## 2. Access

**DECISION PENDING · raised 2026-08-22 — there is no documented credential store, and no emergency
access mechanism of any kind.** This is the highest-priority gap in the entire document: every other
section assumes someone can log in, and today nobody but Steve can.

**Recommended mechanism, for the decision:** a password manager with a built-in emergency-access or
legacy feature (1Password, Bitwarden and others offer one) — a named trusted person, a waiting period,
and no secret written in any document. That keeps this guide safe to circulate while making access
recoverable.

**DECISION PENDING · raised 2026-08-22 — who is the named emergency contact?** Candidates from the
existing team appear in §7. This is a trust decision, not a technical one.

**Accounts that will need access,** with the full register in the Systems Inventory (§10):

| System | What it controls | Losing access means |
|---|---|---|
| **Namecheap** | Domain + DNS for cremaitalia.com | Storefront and all email, together |
| **Shopify** | Store, orders, customers, payments | The business |
| **Google Workspace** | All company email and documents | Communications, and the FDA contact address |
| **Mercury** | Bank | Paying roasters and staff |
| **Loop** | Subscription contracts and billing | Recurring revenue, and the ability to stop it |
| **GitHub** | Theme source and all Standards | Rebuilding or fixing the storefront |
| **Dialpad** | Published phone numbers | Possibly the number the FDA holds — see §8 |
| **Judge.me** | Reviews | Minor |

---

## 3. Critical path

### 3.1 Domain and DNS — Namecheap

Registrar **and** DNS host. Nameservers point at PremiumDNS (`pdns1` / `pdns2.registrar-servers.com`)
as of 2026-08-22. Domain and the PremiumDNS add-on are paid through **29-APR-2027**.

The zone carries the storefront records (A `23.227.38.65`, `www` CNAME to `shops.myshopify.com`), the
MX records pointing at Google Workspace, and the SPF, DKIM and DMARC records. **Treat any change here
as high-risk** — during propagation resolvers may use either nameserver set, so a partial change
breaks mail for a subset of senders, intermittently, which is miserable to diagnose.

TLS is handled by Shopify automatically (Let's Encrypt, auto-renewed). A separate Namecheap SSL
certificate exists, is attached to nothing, and is deliberately not being renewed (§6).

### 3.2 Storefront — Shopify

`crema-italia.myshopify.com`, custom Liquid theme. The **live published theme is
`crema-italia-coming-soon-theme`, id `150557294761`** — the storefront is still pre-launch. The
authoritative statement of what is deployed is **`CLAUDE.md` §10** in the repo, which carries a
standing instruction to verify against `shopify theme list` rather than trust the document.

**Do not push to the live theme casually.** The repo's working files are the full storefront build,
not the coming-soon page; a blanket push would replace the live page with an unfinished store.

### 3.3 Subscriptions — Loop

Free tier today, Starter (`$99/mo + 1.0%`) at launch. **Loop bills unattended.** The discount rate is
snapshotted onto each subscription contract at signup and does not re-evaluate, so changing or
deleting a discount has no effect on existing subscribers — every remedy is per-contract, by hand in
the Loop admin.

### 3.4 Money — Mercury

US business bank. Shopify Payments settles here. Roaster payments go out by EUR/SWIFT wire, initiated
manually. Mercury publishes an API; it is not used.

---

## 4. What runs unattended

Things that keep happening with nobody watching. **If the business is paused, these must be paused
deliberately.**

- **Loop** — bills and creates recurring orders on each subscriber's cadence.
- **Shopify Flow** — *(not yet built)* customer tagging and the Offerta shelf transition.
- **Weekly resource-list task** — rebuilds `Crema_Italia_Resource_List.xlsx` every Monday 09:00 ET.
- **Daily coordinator task** — writes sync reports into OneDrive `Coordination\`.

**DECISION PENDING · raised 2026-08-22 — who or what stops subscriber billing if fulfilment halts?**
Nothing in the record covers a pause of operations. Loop will continue charging customers for coffee
nobody is shipping.

---

## 5. If you have to stop the business temporarily

Ordered by customer harm, worst first.

1. **Pause Loop billing.** Charging for unshipped coffee is the fastest way to turn a pause into
   chargebacks and complaints.
2. **Unpublish the storefront** or restore the coming-soon page, so no new orders arrive.
3. **Set an auto-reply** on `info@` and `support@`.
4. **Do not let the domain lapse.** Everything else is recoverable; a lost domain may not be.

---

## 6. Deadlines that fail silently

**The section most likely to save the business.** These have no owner and no calendar entry.

| Due | What | Consequence of missing it |
|---|---|---|
| **1 May, annually** | **Florida LLC annual report (Sunbiz)** | Substantial late fee, and administrative dissolution of the LLC if left unfiled. **DECISION PENDING · raised 2026-08-22 — verify the date and fee with the CPA or counsel; no project document mentions this obligation at all.** |
| **12-NOV-2026** | Namecheap SSL expiry | None. Deliberately not renewed — it protects nothing and Shopify supplies TLS free. |
| **29-APR-2027** | Domain + PremiumDNS renewal | Storefront and all company email go down together. Confirm auto-renew is ON. |
| **Biennial, per roaster** | FDA Foreign Food Facility re-registration | Import blocked. **DECISION PENDING · raised 2026-08-22 — no owner assigned.** Fails ~2 years after a roaster signs, when nobody is thinking about it. |
| Monthly / annual | Shopify, Loop, Google Workspace, Claude, Dialpad billing | Service interruption. All on cards that expire. |

**DECISION PENDING · raised 2026-08-22 — where does the deadline calendar actually live?** A table in
a document nobody opens is not a reminder.

---

## 7. People

| | Role | Notes |
|---|---|---|
| **Steve Roberts** | Managing Member | Sole signatory and, today, sole holder of all access |
| **Lucia Calò** | Operations Manager, Italy | Roaster relationships and purchasing; based in Sarteano. The Roaster Guide's Italian edition is the document of record and she reviews it line by line |
| **Asia Chirdo** | Board Advisor, Italy | |
| **Lauren Roberts** | Operations Manager, US | |
| **CPA** | Accounting | Relationship exists — see `Legal\Letter_to_CPA_Corporate_Structure_v1.md`. **DECISION PENDING · raised 2026-08-22 — name and contact details not recorded in any project document** |
| **Registered agent** | Service of process | **DECISION PENDING · raised 2026-08-22 — not selected.** The current agent of record is in `Legal\Sunbiz for Crema Italia, LLC (Orginal Filing).pdf` and is named nowhere in text |

**Not yet selected, and each is launch-blocking:** Tampa 3PL, Italian freight forwarder, US customs
broker.

---

## 8. Compliance

**FDA.** Crema Italia acts as US Agent for each partner roaster's Foreign Food Facility registration.
The agent of record is **Steve Roberts, `usagent@cremaitalia.com`, +1-813-376-4821**, with a physical
address on file. **Prior Notice** must be filed before every shipment.

**DECISION PENDING · raised 2026-08-22 — who files Prior Notice?** The project brief contradicts
itself: §4 says Crema Italia, §8 and §9 say the customs broker. A filing each party assumes the other
made is a shipment held at the border.

**DECISION PENDING · raised 2026-08-22 — is `+1-813-376-4821` a Dialpad line or a personal mobile?**
If Dialpad, the subscription lapsing breaks a regulatory contact of record, and the remedy runs through
the FDA rather than a billing page.

**If Steve becomes unavailable, the US Agent designation itself needs attention** — it names a person,
not the company.

---

## 9. Documentation map

| Where | What |
|---|---|
| `github.com/marvistaCI/cremaitalia-shopify` | Theme source, the three **Standards**, all build specs, and `CLAUDE.md` — the project's memory and decision log |
| OneDrive `CremaItalia LLC\` | Operations, brand, legal, coordination. `00_PROJECT_BRIEF.md` at the root is the business single source of truth |
| OneDrive `...\Systems\Systems Inventory.xlsx` | Every system, cost, role and open decision. Generated from `docs/systems-inventory/build_inventory.py` in the repo — **edit the script, never the workbook** |
| OneDrive `Standards\` | Read-only PDF renders of the three Standards |

**Two AI agents are part of the working method**, and an inheritor will find their traces everywhere:
**Claude Code** owns the repo; **Claude Cowork** owns the OneDrive documents. The rules are in
`docs/standards/collaboration-standard.md`. Neither is required to operate the business.

---

## 10. Open decisions index

Every `DECISION PENDING` above, oldest first. Kept as a list so age is obvious at a glance.

| Raised | Decision | §ref |
|---|---|---|
| 2026-08-22 | Credential store and emergency access mechanism | §2 |
| 2026-08-22 | Named emergency contact | §2 |
| 2026-08-22 | Who stops subscriber billing if fulfilment halts | §4 |
| 2026-08-22 | Verify the Florida annual report date and fee | §6 |
| 2026-08-22 | Where the deadline calendar lives | §6 |
| 2026-08-22 | Owner of FDA biennial re-registration | §6 |
| 2026-08-22 | CPA name and contact | §7 |
| 2026-08-22 | Registered agent selection | §7 |
| 2026-08-22 | Who files FDA Prior Notice | §8 |
| 2026-08-22 | Whether the FDA number is a Dialpad line | §8 |

---

*Skeleton drafted 2026-08-22. Not legal, tax, or financial advice. Every fact is drawn from a project
document or a live system read on that date; nothing here is inferred. Where a fact was unavailable,
the gap is marked rather than filled.*
