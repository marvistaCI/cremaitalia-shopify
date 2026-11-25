# Ready to paste into Shopify — Settings → Policies

> **SUPERSEDED FOR FOUR OF THE FIVE POLICIES (2026-11-25).** The contact, shipping, refund and
> terms text is no longer pasted. Its source is one HTML file per policy in `docs/legal/policies/`,
> applied to the live store by `docs/legal/apply_policies.py` and verified by fetching the public
> page. **Why:** the pasted plain text was hard-wrapped at ~85 characters, Shopify's editor kept
> every wrapped line as a forced break and set the headings as body copy, and all three pasted
> policies went live that way. Edit the HTML, run the script, never paste. The privacy section
> below is still a paste candidate and still unapplied (see README).

**Purpose: get the mechanism working now, settle the content before launch.** Four fields populated,
the checkout footer links live, the plumbing proven. Content is provisional and tracked as such
**internally**.

**Source:** Cowork's `Legal\Crema_Italia_Shopify_Legal_Pages_Setup_v1.docx`, with every CONFIRM
placeholder resolved below. **Not legal advice.**

---

## One recommendation before you paste

**Do not put "pending legal review" on the public pages.** Track it in the tracker and in this repo
instead.

A visible *"these policies are unreviewed"* banner on a public page is worse than no banner for
exactly the audience it reaches: it tells a customer not to rely on the thing they are reading, and it
tells a payment processor you know the pages are incomplete. Nothing is being concealed by leaving it
off — every clause below describes what the business actually does, which is the real standard. "Drafted
by counsel" is not a claim anyone makes on a policy page, so omitting the caveat asserts nothing false.

**The caveat belongs where it changes behaviour:** the Decisions sheet, so nobody forgets, and the
interim choices flagged in §5 below.

---

## Interim decisions baked into the text

| | Choice | Why interim |
|---|---|---|
| **Address** | `17716 Royal Eagle Ln, Lutz, FL 33549` | Steve, 2026-08-22, "my address for now." Note this is likely already public — Florida publishes the registered agent's address on Sunbiz, and if Steve is his own agent it is already there. Revisit when an agent is selected |
| **Support email** | `support@cremaitalia.com` | Live as of 2026-08-22. **Decide alias vs Google Group before traffic arrives** |
| **Satisfaction window** | **30 days from delivery** | Nothing in the record sets one. 30 days is conventional and defensible; an open-ended guarantee is a liability with no end date |
| **Billed-but-unshipped cycle** | **Refunded in full** | Nothing in the record decides it. Most generous, simplest to administer, and avoids a chargeback that costs more than the refund |
| **Venue** | Hillsborough County, FL | Matches the promissory note template |
| **Arbitration clause** | **Omitted** | Adding one later is a deliberate change; omitting now asserts nothing. Route through counsel |
| **Analytics** | Stated as "none currently" | True today. Must be updated the day any pixel is added |

---

# 1 · CONTACT INFORMATION

> Shopify marks this **Required**. Paste into Settings → Policies → Contact information.

> **Source moved (2026-11-25):** `docs/legal/policies/contact-information.html`, applied by
> `docs/legal/apply_policies.py`. The text that was here is the same content, unwrapped and
> with real headings; it was removed so the policy has one home.

---

# 2 · SHIPPING POLICY

> **Source moved (2026-11-25):** `docs/legal/policies/shipping-policy.html`, applied by
> `docs/legal/apply_policies.py`. The text that was here is the same content, unwrapped and
> with real headings; it was removed so the policy has one home.

---

# 3 · RETURN AND REFUND POLICY

> **Source moved (2026-11-25):** `docs/legal/policies/refund-policy.html`, applied by
> `docs/legal/apply_policies.py`. The text that was here is the same content, unwrapped and
> with real headings; it was removed so the policy has one home.

---

# 4 · TERMS OF SERVICE

> **The subscription section below is the part that matters legally.** See §5.

> **Source moved (2026-11-25):** `docs/legal/policies/terms-of-service.html`, applied by
> `docs/legal/apply_policies.py`. The text that was here is the same content, unwrapped and
> with real headings; it was removed so the policy has one home.

---

# 5 · PRIVACY POLICY

> Shopify's automated privacy policy is currently in place. **Replacing it is a real decision:** the
> automated one updates itself as Shopify's own practices change, and this one does not. The reason to
> replace it is that it cannot know about Loop, Judge.me, or the taste profile — which are ours, not
> Shopify's.

```
Who we are

Crema Italia, LLC, 17716 Royal Eagle Ln, Lutz, FL 33549, USA, operates cremaitalia.com.
This policy explains what personal information we collect, how we use it, and your
choices.

What we collect

Contact and order information you give us: name, email, shipping and billing address,
optional phone number, and order history.

Preference data: your answers to our taste-profile quiz, used to suggest coffees you
are likely to enjoy. This is preference data, not sensitive personal information.

Reviews you choose to write, which are linked to your customer account so that we can
confirm you bought the coffee and, in time, show feedback from people with a similar
taste profile.

Browsing and device data collected automatically through cookies and similar
technology, for site functionality.

Payment information is collected and processed by Shopify Payments. We never receive
or store your full card number.

What we do not collect

We do not ask for or store birthdates, government identification numbers, or other
sensitive personal information. Nothing on this Site is directed at children and we do
not knowingly collect information from them.

How we use it

To fulfil and ship your order. To manage your Roccia subscription, including billing
and delivery scheduling. To suggest coffees that match your taste profile. To send
order confirmations and shipping updates, and marketing email only if you opt in. To
improve the Site.

Who we share it with

We do not sell your personal information. We share it only with the services that
operate the store:

  - Shopify and Shopify Payments, for the storefront and payment processing.
  - Loop, for subscription billing and management.
  - Judge.me, for collecting and displaying reviews.
  - Google Workspace, which carries our company email and therefore any correspondence
    with you.
  - USPS and UPS, to deliver your order.
  - Our fulfilment partner, who packs and ships your order.
  - Our email provider, for order and marketing email.

We keep this list current as our providers change.

Cookies and analytics

We use cookies necessary for the Site to work, including keeping items in your cart
and keeping you signed in. We do not currently run third-party advertising or tracking
pixels. If that changes, this policy will be updated first.

Your choices

You can unsubscribe from marketing email at any time using the link in any marketing
message. You can ask us to access, correct, or delete your personal information by
emailing support@cremaitalia.com.

Data retention and security

We keep order and account information as long as needed to fulfil orders, meet tax and
accounting obligations, and support your account. We use commercially reasonable
safeguards, and no method of transmission over the internet is completely secure.

Where we sell

We sell to US addresses only. This policy is written for US privacy law.

Changes

We may update this policy. The date below shows the most recent revision.

Contact

support@cremaitalia.com
```

---

## After pasting — three checks

1. **Confirm the URLs resolve**: `cremaitalia.com/policies/shipping-policy`, `/refund-policy`,
   `/terms-of-service`, `/privacy-policy`.
2. **Set the return and cancellation rules** — a separate structured setting on the same page, still
   unset, that powers self-serve returns. Worth setting to match §3 above.
3. **Add the four links to the storefront footer.** Shopify does the checkout footer automatically;
   the custom theme does not. **That is Code's work** and belongs in the next POC batch — the POC
   footer currently carries Promise, Shipping, About, FAQ, Journal and Contact and no policy links.

## Still needs counsel before launch

- **The automatic-renewal section of the Terms**, and whether a matching disclosure should sit beside
  the subscription checkbox at the point of consent. Federal ROSCA and state automatic-renewal laws
  govern this; Loop supplies the mechanism, the disclosure is ours.
- **Arbitration and class-action waiver** — omitted for now.
- **The interim choices in the table above**, particularly the 30-day window and the billed-cycle
  refund, which were selected as defensible defaults rather than decided.
