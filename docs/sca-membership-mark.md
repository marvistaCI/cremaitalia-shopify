# SCA Membership Mark - how it applies to the website

**Status: NOTE ONLY, nothing built (Steve, 2026-11-17).** Steve added the Specialty Coffee
Association membership kit to OneDrive at
`Brand and Marketing\Memberships and Associations\` - the 2026 usage guidelines (PDF) and the
mark itself (`SCA-Member2026.png`, 736 x 1000, indexed-colour PNG). This file records what the
guidelines permit, how that squares with our own Brand Standards, and where the mark should go on
each of the two theme worlds. The to-do to actually incorporate it lives where every live open item
lives: the **Decisions sheet** of the Systems Inventory workbook (source:
`docs/systems-inventory/build_inventory.py`). Do not read state from this file.

## 1. What the mark is, in our terms

- **It is a collective membership mark, not a certification mark.** The SCA says so in as many
  words. It tells a visitor that Crema Italia is a member of the association. It says **nothing
  about the coffee** - not that it is specialty grade, not that it is SCA-scored, not that any
  roaster is SCA-anything. Copy near the mark must never imply otherwise: no *SCA-certified*,
  *SCA-approved*, *specialty grade* or *scored 85+*. The honest caption is at most
  "Member, Specialty Coffee Association".
- **It is year-stamped.** The artwork reads MEMBER 2026, and the guidelines require the most
  up-to-date version. So this is not a one-time placement; it is an **annual swap**, and a 2026
  mark still showing in February 2027 is a misuse, not a cosmetic lag. The asset therefore wants
  **one home in the theme** so one file replacement updates every surface, exactly as the
  `ci-temp-*` and `poc_` conventions make a class of thing findable with one grep.
- **It is conditional.** Only members in good standing may display it. If the membership lapses,
  the mark comes down everywhere the same day. Same reason for one home.
- **It may be rescaled and nothing else.** No recolouring, no extracting the SCA logo from the
  triangle, no adding words, no cropping away the "Specialty Coffee Association" wordmark under
  the triangle - the guidelines say to use the entire mark, with its design and colours as
  provided. That rules out a cream-and-espresso version to match our palette.
- **Permitted surfaces that concern us:** member web pages (both the coming-soon page and the
  storefront qualify), email signatures, letterhead and other stationery, business cards.
- **Prohibited, in the SCA's own list:** coffee packaging, bags, cups, napkins, any food product,
  and promotional items we *sell*. For us that means: never on a product image, a bag label, a
  product card or product page, the Bottega tote or any merchandise, and - conservatively -
  nothing that travels inside the box. A packing slip or the Sorpresa tasting card is arguably
  "stationery", but it ships with the coffee; if Steve ever wants it there, ask
  marketing@sca.coffee first rather than reason it through ourselves.
- **File formats:** members receive a PNG; other formats are by request only. For the web an SVG
  would scale cleanly at any density. Worth one email to the SCA before we build, not blocking.

## 2. The brand tension, and how to resolve it

The mark is SCA grey and SCA yellow. Brand Standards 3.5 says do not introduce new colours, and
the SCA says do not change theirs. Both rules are right; the resolution is **scope, not
compromise** - the same move that sanctioned Bottega's slate scheme in v2.3: a third-party mark
displayed under its owner's rules is **exempt from the palette, confined to a quiet location, and
small**. The Brand Standards currently carry **no rule at all for third-party marks**; when this is
built, Brand Standards section 2 (Logo) should gain a short line saying so (a copy-only minor bump
to v2.4, per section 10 of the Standard). Not now - note only.

Consequences for placement:

- **Cream ground only.** Never on the Espresso hero band, never over the video or a photograph.
  The yellow against brown would be the loudest thing on the page, and section 2's own rule
  against placing a logo on photographs without a solid backing applies to it by analogy.
- **Clear space** equal to the triangle's own padding on every side; nothing butted against it.
- **Small, but legible.** The SCA sets no minimum. "MEMBER 2026" is the smallest text in the
  artwork; below roughly 80 px wide it stops being readable, and the mark then reads as a
  decorative badge, which is the one thing the brand voice would not do. Working range 80-110 px
  wide on desktop, served at 2x.
- **One instance per page**, in the footer. It is a credential, not a decoration.
- **Alt text without the year** ("Specialty Coffee Association member") so the annual swap is a
  file replacement, not a markup edit. The year is in the image and that is where it belongs.
- **Optional link** to sca.coffee in a new tab. The guidelines neither require nor forbid it.

## 3. Where it goes, by theme world

### 3.1 The coming-soon landing page (what the public sees today)

Both coming-soon surfaces render **one shared footer**, `snippets/ci-footer.liquid` -
`templates/password.liquid` (the password page), `live-theme/templates/index.liquid` (the public
homepage while protection is off) and `templates/404.liquid`. **One edit there covers the live
site.** The footer is centred on cream and already has the shape for it: tricolore rule, company
line, two link rows. The mark sits between the tricolore rule and the company line, or beside the
company line on desktop and above it on a phone. The page is otherwise a single column of text
with one email field; a small grey-and-yellow credential at the foot would be the only third-party
trust signal the page carries, and it is collecting email addresses from strangers, which is
precisely when a credential earns its place.

Deploying it is a **live push** scoped to the footer snippet and the new asset with
`--allow-live`, the pattern of the 2026-07-24 and 2026-10-20 pushes. The classifier may deny once;
retry before escalating (deploy skill, 2026-08-24). Verify on the public page with a cookie-less
fetch of the image URL returning HTTP 200 - a tag pointing at a 404 is the same as no tag (POC14).

### 3.2 The storefront (POC today, production later)

- **Footer**, `snippets/ci-store-footer.liquid`, in the `.footer-id` block beside the company
  line. Same asset, same alt text, lazy-loaded with explicit width and height (the
  `ImgWidthAndHeight` check).
- **About page, "Our company"** is the one other defensible home - a credential belongs where the
  company describes itself - and it is the quiet "roaster's pedigree / press" slot that build
  spec section 6 already reserves for trust signals. One or the other in addition to the footer,
  not both.
- **Not** on the Promise page (that page is our promises, not an association's), not in the hero,
  not on any shelf, card, product page, cart line or the Open Graph image, and not in JSON-LD
  (`memberOf` on the Organization node is tempting and harmless, but it is a claim about the
  entity, so add it only alongside the visible mark, never instead of it).
- **Production:** the asset is a theme asset, not a product image, and the year swap is a theme
  push. If the mark ever moves to a theme *setting* (image picker), the yearly swap becomes a
  no-deploy admin action, which is the same argument that put freshness windows in settings.
  Decide at build time; either is fine for one image.

### 3.3 Beyond the website (same asset, other lanes)

Explicitly permitted and already in OneDrive: the three **email signatures**
(`Brand and Marketing\Email Signature\*.html`), the **letterhead template v1.0**, and business
cards. These are Cowork's lane, not Code's; flagged here so the mark is applied consistently
rather than at three different sizes in three places. Whoever does it should carry section 2's
rules (whole mark, no recolour, year-stamped, clear space) with them.

## 4. Questions for Steve before anything is built

1. **Whose membership is it?** The SCA issues the mark to an individual *or* a business. If the
   membership is in Steve's name rather than Crema Italia, LLC's, displaying it as the company's
   credential on cremaitalia.com is at least arguable. Confirm the class before it goes on the
   company footer.
2. **Renewal date and dues.** Neither is recorded anywhere; the Systems Inventory now carries the
   membership with blank cost cells (a blank is a question, never zero-by-assumption). The
   renewal date is also the date the 2027 artwork has to be swapped in.
3. **Coming-soon page now, or storefront only at launch?** Recommendation: now, footer, small -
   the argument in 3.1. It is cheap, reversible, and the page has no other credential.
4. **Request the SVG** from the SCA, or ship the PNG at 2x? Either works; SVG is cleaner.

## 5. Asset handling when it is built

- Master stays in OneDrive (`SCA-Member2026.png`). Theme copy goes to
  `assets/ci-sca-member.png` - **stable filename, no year** - resized to display size x2 (about
  220 px wide), metadata stripped, with a comment at the render site naming the master, the year
  in the artwork, and the swap rule. One grep for `ci-sca-` finds everything.
- Never crop. The wordmark under the triangle is part of the mark.
- Record the placement decision in Brand Standards section 2 (third-party marks) in the same
  batch, per CLAUDE.md 6.1 brand-current-on-edit, and log it in CLAUDE.md section 9.
