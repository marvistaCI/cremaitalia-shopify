# POC30 change list — the B2C expert review of POC28, worked in priority order

**Deployment state is NOT recorded here.** See `CLAUDE.md` §10 CURRENT STATE, which is the only
authoritative statement of what is deployed. This file is the build record.

**Source of the batch:** the external B2C storefront / UX review of POC28 (Steve's copy:
`Downloads\B2C_Expert_Review_of_POC_28.html`, captured Sep 2026). Its verdict was *move forward,
with conditions*; its "Missing (add), priority order" list is being worked top-down, one item at
a time, on Steve's instruction. Nothing is pushed to a numbered preview theme until Steve says
the batch is complete.

**Ground rule carried from the review:** all roasters, products, prices and ratings in the POC are
fixture data. No item here may draw a conclusion about catalog credibility. The brand look is a
declared standard and is assessed as such.

---

## 1. A sensory image in the first viewport — the hero is now image-first

**The finding (review, Missing #1 and "The Hero"):** the hero was all copy and sold the operating
model (curated / sealed / flown in / donated) before creating any desire for the cup. *"Hero
seduces, second screen justifies."* First-viewport visitors decide in seconds, on visual
impression, scanning not reading, and on a shopping visit they came to see the product.

**Steve's direction, and how it changed on the way to the build.** His first idea was a montage:
a roaster in action behind a hand caressing a cappuccino, an unbranded bag open on the table.
Two things were argued off it and one was argued back on. The latte art went (an Italian bar
cappuccino has a plain cap; the rosetta is an Australian / US third-wave signature, and on a
site whose claim is *unchanged from Italy* it is a small tell that the cup is American). The
spilling beans went (Brand Standards §3.5 already bans decorative beans; it is the single most
overused coffee stock trope). Then Steve pointed at drinktrade.com, whose hero is a muted
looping **video** of a top-down cup, and asked *what if this were the last seconds of a great
pull, crema and all?* That replaced the montage: it is the brand's name in a picture, it needs
no roaster, no bag and no trademark, and he could shoot it himself.

**What is in the file, and why loop A.** Three clips were reviewed frame by frame:

| Clip | What it is | Verdict |
|---|---|---|
| `MOV_3860` | Bottomless portafilter pouring into a clear glass on a red machine, shot with the camera held sideways | Cut a loop to prove the pipeline; **not the hero** - side-on, no crema surface, enthusiast gear, saturated red, portrait source |
| `MOV_3863` | High-angle on a ceramic cup filling on the drip tray, warm natural light, 65s | **The keeper.** Seconds 47-53: the stream landing on the crema and the flecks blooming from the impact point |
| `MOV_3865` | Top-down of the finished cup on a cream counter, 7s | The right framing, wrong moment: crema already flat, a ceiling-light hot-spot on it, cream ground with no dark zone for text, almost no motion |

**The cup is from a ceramiche in Pienza.** Code called it "American craft pottery" and was
wrong; Steve corrected it. It stays, and it is a better story than a plain white demitasse
would have been - the cup is itself Italian and nameable.

**What shipped in the theme:**

- `assets/ci-temp-hero.mp4` - 1440x810, 5.97s, 30fps, H.264 yuv420p, ~710 KB, no audio track,
  all metadata stripped. Cut from `MOV_3863` seconds 47-53 with a one-second crossfade seam so
  the loop closes without a jump (the stream is steady across the seam; first and last frames
  are near-identical). A 1440x810 crop at native resolution, not upscaled.
- `assets/ci-temp-hero-poster.jpg` - the same crop at 50s, q82 progressive, metadata stripped,
  ~107 KB. The first paint, the slow-connection fallback, and the reduced-motion fallback.
- `templates/index.liquid` - a new `.hero-media` block ahead of the copy hero: `<video autoplay
  muted loop playsinline preload="metadata" poster=...>` (muted + playsinline are what let it
  autoplay on iOS), an Espresso scrim, and the page's single `<h1>`: **"Exactly as the roaster
  sealed it."** - the line the review called the best on the site, which had been competing
  with an operations paragraph. The copy hero keeps its other two beats, demoted from `<h1>`
  to `<p class="hero-claim">` styled identically, so the page has one H1. **The 300px knockout
  logo lockup came out of the hero**: a cup lockup on a photograph of a cup is redundant, the
  header carries the logo, and "smaller logo, larger margins" is the brand's own tie-breaker.
- `assets/ci-storefront.css` - `.hero-media` is full-bleed 16:9 capped at 78vh on desktop (so the
  copy band still peeks above the fold on a short laptop) and **4:5 on phones**, so the cup
  fills the viewport rather than a letterbox slit (the same reasoning as `.photo-band`'s 21:9
  to 16:9 swap). `object-position: 42% 45%` keeps the cup, which sits left of centre in the
  crop, inside the phone frame. Hero band top padding trimmed now the logo is gone.
- `assets/ci-storefront.js` - `initHeroVideo()`: under `prefers-reduced-motion: reduce` the
  video is paused with `autoplay` removed so the poster frame stays and nothing decodes; and
  `play()`'s rejection is caught for the one combination where autoplay is refused (iOS Low
  Power Mode) so the poster stays and nothing throws.
- `.claude/launch.json` - a `theme-dev` entry for the browser pane's preview launcher. Tooling,
  not theme.

**Contrast, measured rather than asserted.** Cream on bare crema is roughly 2:1. The H1 sits
over a scrim of **Espresso `#55331B` at partial alpha - the palette's own hero tone, not a new
colour** - fading across the frame. The first gradient (.72 at 0%, .45 at 38%, 0 at 68%) was
checked by drawing the live video frame to a canvas, sampling every pixel under the H1's box,
compositing the scrim, and computing contrast against cream: **average 5.9:1, but the worst
pixels 2.5:1**, at the headline's right edge (~49% across, where the crema is brightest) - under
the 3:1 large-text floor. The dense zone now runs to the headline's edge (.78 at 0%, .66 at
50%, 0 at 80%). Re-measured: **desktop worst 5.2:1 / average 7.8:1 at 54px; phone worst 3.6:1 /
average 8.1:1 at 31.5px** (both large text, floor 3:1; body floor 4.5:1 also met on average),
measured at two different moments of the loop with the same result. The phone scrim was then
deepened a step further (.85 at the foot, darkening from 40%) and re-measured at two moments of the loop: **worst 4.1-4.3:1, average 8.5:1**. **The lesson is the
review's own caution applied to a moving image: measure the worst case, not the average, and
measure the actual frame, not the palette.**

**Verified by looking and by DOM:** video `readyState 4`, playing, 1440x810; exactly one `h1`
on the home page; no `.hero-logo` in the hero; H1 two lines in the scrimmed left third at 1024
and 1350 wide; on a 375px phone the hero is 4:5 with the stream and crema filling the frame and
the H1 two lines at the foot; no horizontal overflow at either width. `node --check` clean.
`shopify theme check` at the documented baseline (**15 offenses / 0 errors / 0 new**). The mp4
uploads to a theme as an asset without complaint (proven on the Development theme via
`shopify theme dev`).

**Reshoot brief - recorded in `docs/photography-todo.md` as slot 0.** Same shot as `MOV_3863`:
same light, same 45-degree angle (better than a true top-down because the stream stays visible),
**the same Pienza cup**, on a saucer so the drip-tray grate is out of frame, and hold for eight
seconds after the stream stops so the settle can be looped as well as the pour. Landscape,
4K if the camera has it. Nothing branded in frame.

**Deliberately not done in this item:**

- The copy hero's text is unchanged. The review's other hero notes (move the freshness
  paragraph and donation below the fold, trim the founder bio, re-pitch away from
  freshness-as-headline) are separate items in its list and are taken in order, not folded in.
- The 21:9 café band (`ci-temp-lp1.jpg`, photography slot 1) directly under the copy hero was
  left in place for Steve's eye on the preview. **He dropped it the same day - see 1b.**
- No separate portrait cut of the video. One landscape file serves both crops via
  `object-fit: cover`; Trade ships two cuts, and that is the production shape if a phone crop
  ever needs a different composition.
- In production the hero is a theme section with the media on **Shopify Files** (`video_tag`),
  not a theme asset; the theme-asset route is the POC's mock. Not written into
  `production_build_spec.md` yet - that belongs with the batch's spec pass when the hero's final
  shape is known.

## 1a. The hero line, settled

Steve, reviewing the item 1 preview, asked whether Italy belonged in the hero line - it had
gone missing from the first screen, with the logo tagline the only Italy above the fold. Six
candidates were weighed in one sitting, in this order:

| Candidate | Verdict |
|---|---|
| *Italian perfection, just as the roaster sealed it.* | Declined. "Perfection" is a superlative about our own taste, the register Brand Standards §3.1 and CLAUDE.md §6 ban, and a claim with no proof beside it yet (the review's trust gap). "Just as" was already rejected 2026-08-18 for reading temporally. |
| *Italian heritage / tradition* | Declined. Inherited qualities that belong to the roaster, not to a Florida importer, and the exact words Lavazza and Illy sell on - style words, which POC21 established can be borrowed where a place cannot. |
| *Italian provenance* | Defensible (the review's own word for the primary buyer) but cold, and "provenance... sealed" nearly says one thing twice. |
| *Italian craft* / *Italian coffee craft* | Defensible - the Standard's own approved construction - but a noun stack, and it pushed the line to three lines. |
| *From Italy, exactly as the roaster sealed it.* | Code's proposal. Place plus fact. |
| **Exactly as the roaster sealed it... in Italy.** | **Steve's, and chosen.** The proven line intact, Italy as a place, and the ellipsis used exactly as the no-em-dash rule prescribes - a sentence trailing into a sequenced next thought. The reveal is the point. |

**Measured after the change:** two lines at 1350 (54px, breaking "Exactly as the roaster / sealed
it... in Italy.") and two lines at 375 (31.5px, same break); the H1 box reaches the same 49%
across the frame as before, so the scrim measurement stands - **desktop worst 5.2:1, phone worst
4.3:1**, re-run rather than assumed. `in&nbsp;Italy` is glued so the closing beat can never orphan.
The reasoning is also in a comment at the markup site, so the next person to "improve" the line
sees what was already tried.

## 1b. The café band retired

Steve, on the item 1 preview: *"drop the cafe band."* With a video hero above it the page ran
video, copy band, photo; the band was the weakest of the three, and its stand-in (a US specialty
café with an English chalkboard) had been recorded since POC13 as one that could never ship.
Removed: the markup and its `PROD:` comment in `templates/index.liquid`, the asset
`assets/ci-temp-lp1.jpg` (nothing else referenced it), and the three `.photo-band` rules in
`assets/ci-storefront.css` that had exactly one user. `docs/photography-todo.md` marks slot 1
retired rather than deleting the row, so a later reader sees that the Italian bar-counter shot
was a brief once and now has no slot. `production_build_spec.md`'s temp-asset row updated.
Slots 2 and 3 (founder portrait, product shot) are untouched. Theme file count for the deploy
skill's baseline: 39 at POC29, +2 hero assets, -1 café band = **40**.

## 2. A one-visual "how it works" - built as three beats, shape under review

**The finding (review, Missing #2):** a one-visual how-it-works, *roaster seals -> we airfreight ->
you grind*.

**Steve's copy, and the refinements agreed in one sitting.** His draft: *"Our roasters are
selected for their artisan quality - hard to beat, hard to find. We fly it in - shipping by
ocean ages the beans. For people who love to grind their own beans."* Three edits, all taken:
the first sentence went **active** ("We choose", the Standard's own approved verb; "are
selected" hid the one fact that matters); **"beans" landed twice in a row**, and the second one
is load-bearing (Steve's 2026-08-18 rule: "grind their own beans", because it is the only
whole-bean signal up here), so the airfreight line became *"an ocean crossing ages coffee"*;
and *"hard to beat"* stays as the one hedged near-superlative, because it is the scarcity lever
the review said should do more work. Earlier drafts' *"peak flavor"* (retired as a claim in
POC19) and *"robs you of freshness"* (the one combative phrase on a deferential page) were
already gone from Steve's version.

**Built as three beats** in the copy band under the video hero, replacing the old claim +
subhead (which said the same three things in prose, plus the freshness arithmetic and the
donation line the review wanted out of the first screen - both still live where they belong,
on the product pages and the Promise page; "roasted in Italy" is carried by the hero line
above). Each beat is a Marcellus lead plus an Inter supporting line:

| Lead | Support |
|---|---|
| Chosen for their artisan quality. | Hard to beat, hard to find. |
| We fly it in. | An ocean crossing ages coffee. |
| Whole beans, always. | For people who love to grind their own. |

**No numerals, no icons.** A first cut carried 1 / 2 / 3 in gold and Steve rejected it on sight
("I hate the 1, 2, 3"). Icons would be vector illustration, which Brand Standards §3.5 rules
out. The beats are divided by cream hairlines at 22% - a rule, not a fill - vertical on desktop
(three 347px columns in a 1040px measure, wider than the band's usual 760px so they breathe)
and horizontal on phones (stacked, centred, 327px wide at 375). Reading order carries the
sequence, as the About page's Three P's already do. Benvenuto and the quiz button stay beneath.

**Measured:** three equal columns at 1350 wide, no horizontal overflow at 1350 or 375, lead at
23.2px desktop, `.hero-claim` and `.hero .subhead` gone from the DOM. Dead CSS swept with it:
the `.hero h1` rule and its two blocks of phone-sizing arithmetic (they measured headline
strings that no longer exist), `.hero .subhead`, and an orphaned comment about the retired
`<br class="h1-break">`. `theme check` at the documented baseline (15 / 0 / 0 new).

**Shape is Steve's open call.** He asked to see the beats but suspects *"a simple three point
paragraph may work better"*. If the paragraph wins, the `<ol>` collapses to one `.subhead`
paragraph with the same words joined by spaced dashes and the `.hiw` rules go. Either way the
words are settled.

**"Our model" trimmed the same day - see 2b.** The production shape of this section is recorded as a proposal, not built: **one
photograph of a single sealed roaster bag with three short captions anchored to what is on it**
(the roaster's name on the label, the roast-date stamp, the one-way valve and whole beans) -
literally a how-it-works in one image, merging this item with photography slot 3. Needs a real
bag, so it waits on a signed roaster.

## 2b. "Our model" trimmed, and the roaster story told for the first time

Steve kept the beats ("the segmentation works") and then rewrote "Our model" himself. The
trim's purpose was to say the model once; his draft added the one thing the page had never
said - **how a roaster gets found** - and then restated the three beats in its tail. The
refinement kept all of the new and cut the repeat: ~190 words to ~120.

**Kept, and it is the best new copy in the batch:** sitting in cafés and drinking espresso; when
a coffee is delicious, asking about the roaster; the same name coming up again; the visit; and
*"Sì, we do this together."* The review put the entire trust load on roaster storytelling and
called the roasters the thinnest part of the site; this is the first place the site says how
the relationship starts. *"Our roasters are not vendors - they are partners"* kept verbatim but
for the splice. **The roast date on every bag** survived from the old tail: it is the one fact
the beats do not carry, and the review's "cheap table-stakes trust".

**Cut:** *"We don't alter the roasters' packaging... air-freight them directly into our US
fulfillment facility, exactly as roasted, bagged and sealed... arrives fresh and ready to
grind... whole bean only, never pre-ground"* - all of it is the hero line and the three beats
again. Also the tasting-notes parenthetical (interrupts the story; the notes are on every
product card), and *"a quality pattern is detected"* (passive, lab register) became *"the same
name keeps coming up"*. Two comma splices became spaced dashes per the semicolon rule.
Hyphenation drift in the draft (whole-beans, roast-date, air-freight/airfreight) went with the
tail.

**Kept from before, unchanged:** the Standard's approved opening sentence (the VOICE comment at
the site still guards it), the Roasters-page link, the suggest-a-roaster email, and photography
slot 3 beneath. *"Sì"* carries its accent and an `.ita` span.

## 3. The founder story, revised (Steve's copy, refined together)

Not a review item by number - the review's only note on this section was "over-long founder
bio (keep the charm, halve it)" - but Steve reworked it while the hero was fresh. His draft added
three things and grew the section from 115 to ~140 words; the refinement kept all three and
paid for most of it: **115 -> 133 words**, measured from the rendered page, not estimated.

**Kept from Steve's draft:** the cupboard contrast - *The "Italian espresso" in my cupboard
didn't come close* - which is the style-versus-place thesis as a personal beat, no argument
needed (his "My 'Italian Espresso' stock didn't compare" re-phrased: "stock" read as inventory,
the scare quotes read as sarcasm); *roasters whose craft is entirely their own* (his "who with
individual creativity define quality", the same idea in speakable order); and *Just Italy,
roasted into a bean.*, the best new line, verbatim but for a comma.

**Declined, with reasons:** *"No American hype."* - the primary buyer is an American Italophile
and the company is in Florida; it is the one sentence on the page that pushes the reader away,
and "no hype" is itself a claim. The **decaf** was restored - it had been dropped, and it is the
best specific in the story (even the decaf was that good; the 2026-07-10 note calls this the
founder/decaf origin story). The **34g yield** and *un caffè double* went - the 17g dose is the
fluent enthusiast wink POC15 kept metric on purpose, and adding the yield turns a wink into a
recipe (and the word would be *doppio*). *"I hope you find your coffee beans here"* reverted to
*"I hope you find it here"*, which carries two meanings, the coffee and the memory. Two
mechanical fixes: "On trip home from Tuscany" was missing a word, and a parting gift is given on
leaving, so *As I left Tuscany, a friend handed me a parting gift.*

**Copy rules checked:** no em-dashes, no exclamation marks, none of the banned register; the
quotation marks are `&ldquo;`/`&rdquo;` entities to match the file's `&rsquo;` convention, and
*un caffè* keeps its `.ita` span.

## 4. Offerta hidden - three public shelves, one invitation-only channel

**Steve's decision (2026-09-12):** *"All research indicates that providing a page like this may
encourage consumers to wait for the discount."* Offerta stays as a channel - coffee leaving the
freshness window is offered by **email** - but it leaves public view entirely. Sold as *"an
opportunity to get great quality while diminishing supply is the enemy"*, never as the last-ditch
effort it also is. The same mechanism a wholesale page will use, only presented to high-volume
customers. The review's Q&A had already recorded Steve's intent to drop the gated lifecycle and
Offerta from public view; this is that, built.

**The mechanism.** The page block stays; every entry point goes. The only way in is a URL carrying
`?offer=<anything>` (`initOfferEntry()` in `ci-storefront.js`), which opens the page on load and
stores nothing - leave by any navigation and it is gone; reload without the parameter and it is
gone. **Back from an Offerta product returns to the page** (Steve accepted the distinction: leaving
by navigation drops it, Back within the visit keeps it; otherwise the offer could not be browsed).
While the page is open a `robots: noindex, nofollow` meta is added - a gesture on a one-URL SPA; the
production mechanism is an **unlisted collection with `seo.hidden` on the collection and each
product**, written into `production_build_spec.md` under the Offerta section. **Test route:** any
preview URL plus `?offer=test`, e.g. `http://127.0.0.1:9292/?offer=test`. The parameter's value is
not validated; a signed, expiring link is a later option and the reasons are at the markup site.

**Removed from public view:** the Shop dropdown item, the Shop shelf pill, the home shelf card (the
home grid goes from a 2x2 to a row of three; stacks under 900px), the Promise page's "Offerta is
different - sold as-is" block (the guarantee is now stated once, on the invitation page - a public
Promise page must not describe a shelf the public cannot see), and every mention in the FAQ,
the Shop callout and the account copy. **"Four coffee shelves" became three** in the home section
head and its intro, the Shop-hero comment and the Bottega product note.

**Excluded from every public render by construction:** a new `isPublic()` predicate beside
`isCoffee()`, applied to the Shop grid (which the quiz's "Show my matches" filters) and the roaster
page - which makes the Offerta page's own claim, *"an Offerta coffee never appears on its
roaster's own page"*, true by code rather than by the fixture happening to have no roaster match.
Shelf pages render by shelf and never included it. `showPage('offerta')` no longer lights the Shop
nav item.

**The page's copy, reframed in Steve's terms.** Eyebrow *By invitation*; sub *Great coffee, while
it lasts.*; body: *This is the coffee we sell on our shelves, from the same roasters, bought the
same way. It is nearer the end of our freshness window than we usually sell it, and it is priced
for the time it has left. The quality is the roaster's. The supply is what is running out. You see
the roast-date band before you buy.* The markdown vocabulary went: "Limited Time and Inventory",
"last-chance", "priced down honestly", "on sale while inventory lasts". A callout says plainly that
the page is not in navigation and the email link brings you back. The struck-through original
price and the roast-date band stay - they are the honest facts. The card badge reads *Offerta · By
invitation*. Subscriber and Founding discounts are stated as not applying here, which is Standard
§3 unchanged.

**Upstream:** Store Operating Standards §1, §5 and §10 were published as **v1.20** together with
item 5 (the session that built item 4 ended before the publish ran; see item 5). It belongs in
`DECISIONS_LOG.md` (Cowork's lane - flagged to Steve). The Promise page's no-waste pledge
sentence, *"We do not discount our way out of waste; we give it away"*, sits oddly beside a
discounted channel and always did; it is untouched here and is part of the review's freshness-
lifecycle item, not this one.

## 5. Shelf labels English-first - Subscriptions, Surprise Samplers, Limited and Seasonal

**The finding (review, Resolved discussion points):** the Italian-language "authenticity credit" is
valid; the defect was four invented names doing navigation work plus a teaching section on the
landing page. Fix: English-primary in navigation and function labels (lead with function, not a
translated metaphor like "The Rock"), Italian secondary; Italian kept freely in editorial copy.

**Steve's drafts, and where they landed.** He proposed *Subscriptions (and one-time ordering)*,
*Surprise me* and *Select Roasts*, each with a description that taught the Italian name in its first
sentence. Refined together: the parenthetical moved into the description, since a nav item wants one
word; **"Surprise me" collides with the quiz**, which already uses those words for *no roast
preference*, so the same two words would mean two different things on one site - his own description
supplied "sampler", and the compromise is **Surprise Samplers**; **"Select Roasts"** was declined
because *select* as an adjective is the self-praising register POC21 declined ("a select group") and
in a nav it reads as a verb, so the shelf's existing gloss became the label, **Limited and Seasonal**.
The Roccia description went through three drafts on one phrase - "like a rock" sinks like one
(Steve) - and settled on *your coffee, your size, on a rock-solid cadence*, with the free-shipping
and 10% hook his draft had dropped restored.

**The rule applied, not just the cards.** The label changed everywhere a shelf is named as a
function, or the customer learns the Italian mapping anyway: the nav dropdown (`.lbl` English, the
Italian inline in the gloss with an `.ita` span), the Shop pills, the three shelf pages (eyebrow /
H1 / sub), the product-card badges (`Subscription · Roccia`, `Sampler · Sorpresa`, `Limited ·
Selezione`, `By invitation · Offerta` - English first, kept short for scanning), the home CTA and
callout, the roaster-page note, the subscription toggle, the cart line tail, the toast, the empty-cart
suggestion, the account page eyebrow and empty state. **The Italian is taught once per surface** - as
the `.ss2` eyebrow under each home card, the eyebrow over each shelf-page H1, and inline in the nav
gloss - and never repeated in the description beneath. The **shelf-name tutorial paragraph** above the
home cards is gone (the review's Superfluous list, item 1); the cards do that job now. Italian in
editorial copy (a Journal card, a fixture blurb) is untouched, as the review intended.

**The bonus the hide unlocked:** with Offerta invitation-only, the subscriber discount covers every
public coffee, so *"10% off Roccia, Sorpresa, and Selezione"* in six places (Roccia page callout, FAQ,
toggle blurb, cart banner, account copy, sign-in note) became **"10% off every coffee"**, and the
guarantee's *"On Roccia, Sorpresa, and Selezione"* became *"every coffee on our three shelves"*. The
shelf names drop out of the commercial copy entirely, which is what English-first is for. "Roccia" as
vocabulary went with it: *Make this a subscription*, *Subscription · every 4 weeks*, *Free shipping on
every subscription shipment*, *Active subscribers see new Limited and Seasonal coffees 48 hours
early*.

**Not written into the Sampler card:** a count of bags. A collection is a BOM with N coffees
(Standard §7); the fixture happens to have three. The Sorpresa page's own body copy still says
"three" in three places - Steve's reviewed copy, left as it was (POC26 flagged the same and he kept
it) - so the card does not add a fourth.

**Measured after the rename:** every public page has zero occurrences of "Roccia, Sorpresa, and
Selezione" and four of "every coffee"; the nav gloss renders its Italian italic; on a 375px phone the
Shop pills now take **two rows** (All / Subscriptions / Surprise Samplers on the first, Limited and
Seasonal on the second) with no horizontal overflow - the old four one-word pills fit one row, and
this is the cost of function labels over names. Acceptable; noted for Steve's eye on device.

**CSS:** the `.shop-menu .ita` display-face rule that styled the Italian *as the label* is deleted,
its mobile size rule narrowed to `.lbl`, and `.shop-menu .ita` removed from the `font-style:normal`
exclusion list so the inline Italian in the gloss is italic like everywhere else. `.ita` in the
uppercase `.ss2` eyebrow is italic on purpose - it marks the word as Italian, which is the point.

**Standard published as v1.20** via `crema-std-publish`, covering item 4 and item 5 together (the
session that built item 4 ended before its publish ran, and both change §1): §1 gains a *Storefront
label* column, the English-first rule, and Offerta's hidden status; §5's approved FAQ copy matches
the theme ("comes off our shelves") and its listing bullet says invitation-only; §10 gains "No public
route to Offerta". Cross-references swept (standards README, Collaboration companion header, CLAUDE.md
pointer), both touched sources re-rendered, v1.19 archived, both renders delivered to OneDrive.
`production_build_spec.md`'s §11 literals row updated to the new toggle string.

## 6. Bottega becomes "Accessories" and leaves the top nav

**The finding (review, Resolved discussion points):** Bottega's separate buying section is justified
(own cart and shipping logic, no subscriber discount, ships separately), and "fold under Shop" was
withdrawn - but *"don't give it co-equal top-nav billing until it's stocked"*. Steve's answer: move
it into the Shop dropdown and the home shelves grid, and take it off the top bar. **Four cards
again, three of them coffee**, and the heading says so: *Three coffee shelves, plus accessories.*

**The label.** "Merchandise" (Steve's first draft) reads as t-shirts and mugs, and every product page
sends a grinder-seeker here; "Equipment and Merchandise" (Code's counter) *"reads tiresomely"*
(Steve). **Accessories** - the review's own word for the section - with a gloss that names the
grinders so that reader opens it. Steve's copy: *Grinders, espresso machines, moka pots, and more
espresso tools, plus our own merchandise.* Two edits flagged rather than silent: his draft's "and
more espresso tools and merchandise" carried a double "and", and his eyebrow *"Bottega - the
accessory shop"* took the shape the other three use, *Bottega · The Accessory Shop*. His first
gloss, *"Italian heritage coffee-related merchandize"*, was declined before he rewrote it: heritage
is the borrowed style word declined for the shelf labels, and it can be plainly false of a grinder.

**What moved:** the top-nav button is gone and a dropdown item sits below a second separator (it is
not a coffee shelf); the Bottega page is headed *Accessories* with the Italian eyebrow; the home grid
is a 2x2 again (POC14's fix for four cards); the product-card badge reads *Accessory · Bottega*; the
grinder pointers under Add to cart and in the FAQ say *Accessories*; "Bottega is never discounted"
became "Accessories are never discounted" in the three places it is stated; and `showPage('bottega')`
now lights the Shop nav item. **Unchanged on purpose:** the Shop "All shelves" grid stays coffee-only
(`isCoffee`), because Bottega has its own card type and cart logic, and the review's other note -
surface accessories at the point of need - was already met by the grinder note under Add to cart.

**Standard v1.21:** §1's Bottega row takes the label and the placement; the changelog says nothing
else moved. Cross-references swept, both renders regenerated with gates at exit 0, v1.20 archived,
delivered to OneDrive and md5-verified.

## 7. Three interaction fixes from the review's Missing list - and one it got half wrong

Steve asked for the four interaction findings to be surfaced in sequence with a verdict on each.
**Each was driven on the live page before the verdict**, because this project has caught the
reviewer overstating before (POC11: three findings inflated). Three confirmed and built here; the
fourth (add-to-cart feedback) is item 8.

**Exact price on the product page (review Missing #7) - confirmed, one line.** The page opened
reading *From $38.00 /250 g* with the 250 g pill already selected, and `selectSize()` had always
dropped the "From" on the first click, which is how the open state and the clicked state came to
disagree. The detail page never says "From" now; cards keep it, since no size is chosen there.

**Live subscription price (review Missing #5) - confirmed.** Ticking *Make this a subscription*
revealed the cadence pills and left the price at $38.00 while the copy beside the box promised 10%
off every shipment. The price line now renders from one function, `renderPdPrice()`, from the
selected size and the toggle together: the base price struck through (the `.po` style Offerta
already uses), the subscription price beside it, *with your subscription* after. The rate is the
standing subscriber rate, or the founder rate for a signed-in Founding Member, because that is what
the cart will apply. **Why the theme must do this at all:** platform test A3 proved the selling
plan's adjustment leaves no discount line on the Shopify order, so if the storefront does not show
the benefit the customer never sees it anywhere. **Fixed in the same pass:** the 10% and 12% were
bare literals in the cart math - the same build-spec §11 breach as the $8.50 flat rate was in
POC28 - and are now theme settings (`subscriber_rate_pct`, `founder_rate_pct`), published through
`CI_RULES`, read by the cart and the product page from named constants. The many "10% off" strings
in copy are copy, and are not templated here.

**Quiz exit clarity (review Missing #8) - confirmed, and worse than stated.** After the quiz the
Shop page showed **4 of 12** coffees under the heading *Shop all our Coffee*, the eyebrow *All
shelves*, and the note *Every coffee we carry.* - three statements saying everything above a grid
showing a third of it. The only counter-signal was a 12px ribbon sentence and a *Show all* button
measuring **79x28**, which also failed this project's own 44px target rule (POC7, POC24). Now the
ribbon states the count from the grid actually on screen - *Showing 4 of 12 coffees that match your
taste profile.* - and *all 12 coffees are shown* when the filter is off; the Shop note under the
pills reads *Your best matches, across every shelf.* while the filter is on; and the toggle (and the
*Save to my account* button beside it) grew to 44px by the POC24 mechanism, min-height plus an equal
negative margin, so the ribbon does not grow with them.

**Verified by driving:** product page opens at *$38.00 /250 g (8.82 oz)*; toggling subscription
renders *~~$38.00~~ $34.20 /250 g (8.82 oz) with your subscription*, off again restores it, and
changing size keeps whichever state is set; after a light-and-fruit quiz the ribbon reads the count
and the Shop note acknowledges the filter; the toggle measures 44px tall with the ribbon height
unchanged. `node --check` clean; `theme check` at the documented baseline.

## Files

| File | Change |
|---|---|
| `assets/ci-temp-hero.mp4` | new - the stand-in loop |
| `assets/ci-temp-hero-poster.jpg` | new - the stand-in poster |
| `templates/index.liquid` | `.hero-media` block added ahead of the copy hero; logo removed; `<h1>` moved onto the video; band heading demoted to `.hero-claim` |
| `assets/ci-storefront.css` | `.hero-media` rules; `.hero h1` rules shared with `.hero-claim`; hero padding |
| `assets/ci-storefront.js` | `initHeroVideo()` reduced-motion and autoplay guard |
| `docs/photography-todo.md` | slot 0 (hero) added with the reshoot brief |
| `.claude/launch.json` | new - preview launcher entry |
| `assets/ci-temp-lp1.jpg` | **deleted** (1b) |
| `templates/index.liquid` | (2) `.hiw` three-beat band replaces the claim + subhead |
| `assets/ci-storefront.css` | (2) `.hiw` rules; dead `.hero h1` / `.subhead` / `h1-break` rules and comments swept |
| `templates/index.liquid` | (2b) "Our model" trimmed and rewritten |
| `templates/index.liquid` | (3) founder story, two paragraphs |
| `templates/index.liquid` | (4) Offerta hidden and reframed; three shelves; Promise/FAQ/callout edits |
| `snippets/ci-header.liquid` | (4) Offerta dropdown item removed |
| `assets/ci-storefront.js` | (4) `isPublic()`, `initOfferEntry()`, grid/roaster exclusions, copy |
| `assets/ci-storefront.css` | (4) home shelf grid 2x2 -> row of three |
| `docs/production_build_spec.md` | (4) Offerta invitation-only mechanism |
| `templates/index.liquid` | (5) English-first labels: cards, pills, shelf pages, callouts, promise, FAQ; tutorial paragraph removed |
| `snippets/ci-header.liquid` | (5) dropdown labels English, Italian inline in the gloss |
| `snippets/ci-signin-modal.liquid` | (5) "every coffee" |
| `assets/ci-storefront.js` | (5) badges, toggle, toast, cart, account copy |
| `assets/ci-storefront.css` | (5) `.shop-menu .ita` label rules retired |
| `docs/standards/store-operating-standards.md` | (4+5) **v1.20** |
| `docs/standards/README.md`, `collaboration-standard.md`, `CLAUDE.md` | (4+5) v1.20 pointers |
| `docs/standards/_archive/README.md` | (4+5) v1.19 archive row |
| `docs/production_build_spec.md` | (5) §11 literals row |
| `snippets/ci-header.liquid` | (6) Bottega out of the top nav, into the dropdown |
| `templates/index.liquid` | (6) Accessories card, heading, Bottega page, copy |
| `assets/ci-storefront.js` | (6) badge, grinder link, account copy, navKey |
| `assets/ci-storefront.css` | (6) home grid back to 2x2 |
| Standard + cross-refs + archive README | (6) **v1.21** |
| `config/settings_schema.json` | (7) `subscriber_rate_pct`, `founder_rate_pct` |
| `layout/theme.liquid` | (7) the two rates published in `CI_RULES` |
| `assets/ci-storefront.js` | (7) `renderPdPrice()`, no "From" on detail, rate constants, ribbon count, `gridCounts()` |
| `assets/ci-storefront.css` | (7) `.pd-sub-note`; ribbon controls to 44px |
| `docs/production_build_spec.md` | temp-asset row updated (1b) |
