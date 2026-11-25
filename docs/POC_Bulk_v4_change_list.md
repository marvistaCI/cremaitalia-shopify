# POC_Bulk_v4 change list - the product-only gallery, the repack story told once, and a plainer hero

**Status: see CLAUDE.md §10 for deployment state; this file is the ledger, not the state.**

Built 2026-11-24 on branch `poc-bulk`, the same day as v3. Bulk-model work, so it does not land on
`main`.

## 1. What the product gallery shows under repack (Steve's question)

Steve's first idea was a three-frame sequence on every product: the roaster's original bag, the
label we affix, our bag. The build answers it differently, on his go ("product-only gallery").

**The gallery shows the thing the buyer receives.** A product gallery's first frame answers "what do
I get?", and the customer gets our bag with the roaster's label on it, never the 2.5 to 20 kg bulk
sack. Leading with the bulk bag would have invited the confusion v3 spent a batch removing from the
copy. The three slides per coffee are now:

1. Our bag, front (the existing first slide, its caption unchanged).
2. Label close-up: the roaster's name, the coffee, the roast date, the imported-and-repacked line.
   It is the "What is on the bag?" FAQ made visible.
3. Loose beans: roast colour is the one thing a photo tells a buyer that the words cannot, and it
   was the original product-shot brief.

"Back of bag" was dropped. Under repack the back is ours and says nothing the label close-up does
not.

**The repack story is told once**, on the Promise page under the freshness window: a three-frame
strip headed "From their roastery to your bag" - the roaster's bulk bag, the label we affix, your
bag. One place for the process and the provenance; fifteen galleries each retelling it would be the
e-commerce habit of saying everything on every page. The bulk bag belongs there as evidence of the
chain of custody behind "Roasted in Italy", not as a product frame.

**One caution recorded with the briefs, because it is a trap.** A legible roast date or lot number
in a photograph is a time-varying fact baked into an image, one click from the real date the lot
record renders. That is the POC26 card-versus-detail contradiction in picture form. So the bulk-bag
frame is per roaster, not per lot, with the roaster's marking present but not readable, and the label
close-up is framed so its date field is present but its digits are not. Briefs for all six shots are
in `docs/photography-todo.md`, sections 2 and 2b.

All six remain placeholders. The gallery mechanism is unchanged; only the captions moved. The strip
is three dashed `.photo-slot` boxes in the existing placeholder style, three-up at every width
because the sequence is the content; below 480px the square ratio gives way to a text-tall box,
after the first cut overflowed 375 by about 70px (grid items default to their content's minimum
width, the same class of layout trap as POC12's wrapping flex container).

## 2. The hero, again

"Exactly as roasted in Italy." -> **"Roasted in Italy."** Steve, reviewing v3: the longer line tried
too hard. The "nothing altered" claim that "Exactly as" carried is now stated directly beneath it
("Freshness matters; slow boats age the beans") and in Our model, so the headline no longer has to
do that work. One line at both widths. The template comment records the day's sequence of three
hero lines so the reasoning survives.

## Verified

- Driven live: the gallery thumbs read our bag / Label close-up / Loose beans and slide 3 reaches
  "Loose beans"; the Promise strip renders three slots under its eyebrow; the hero reads "Roasted in
  Italy." on one line at desktop and at 375.
- The strip at 375 after the fix: three columns, no horizontal overflow, no clipped text.
- `theme check` at the documented baseline (9 / 0 / 0 new); `node --check` clean.
- Looked at: the strip at desktop and 375, the hero at 375.

## Addendum, 2026-11-25: the founder story rewritten (Steve)

Steve rewrote the three-paragraph story in his own words; Code fixed three typos and one
preposition and changed nothing else. New: a fuel-stop beat (a good espresso at an Autogrill is the
thing only someone who has been there says), "Back in Florida" as a real place where "Home again"
was not, and a closing line, "I hope you'll find a roast to fall in love with here", that bookends
the opener and echoes the hero CTA. "Unchanged" is gone, which the bulk model needed. 154 words,
up from 133.

**The decaf is out, on Steve's call and against Code's advice.** Code argued it was the story's
best specific (even the decaf beat the cupboard; the store sells a decaf and the quiz has a caffeine
axis; it is first person and it happened) and offered "a bag of decaf beans, of all things" as the
one-phrase alternative. Steve's concern was that coffee snobs dismiss decaf and the word would stop
them reading. The bag is now "a bag of beans". Both sides are recorded in the template comment.

Model-neutral, so it landed on `main` (`25eb305`) and was merged forward (`aa22358`); v4 refreshed
in place and re-proved by pull-and-diff (40 files, zero mismatches, the new story asserted on the
pulled file). Looked at on the dev server at desktop (three paragraphs beside the portrait, the
signature below) and at 375. `theme check` 9 / 0 / 0 new.

## Addendum, 2026-11-25: one word in Our model (Steve)

"the roast date on every one" -> "the roast date on every bag" in the Our model paragraph on the
home page. Bulk-model copy, branch only. v4 refreshed in place and re-proved by pull-and-diff (40
files, zero mismatches, the sentence asserted on the pulled file). The same sentence sits on the
coming-soon page (`templates/password.liquid`, `live-theme/templates/index.liquid`), live on
cremaitalia.com, and was NOT changed: that is a live push and waits for Steve's go.

## Addendum, 2026-11-25: the About page, in Steve's words

Two blocks on the About page rewritten from Steve's draft. **Our company**, the two paragraphs
above the Three P's: a Florida based company; import, store, ship; "authentic Italian roasted
coffee ... just as if you were there, in Italy"; and the repack sentence ("we repack and seal them
into fresh, conveniently sized, vented, re-sealable bags"). Bulk-model copy, so it is on the branch
only (`d74d7ea`). The Three P's were not in his draft and are unchanged. **Our founder**, the six
lives: shorter per life, "phased out of music", "(Travelling, I discovered espresso in Italy.)",
"Beyond retirement - Crema Italia is formed." Model-neutral, so it landed on `main` (`32b7185`) and
was merged forward. Code changed only punctuation: his en dashes became spaced hyphens under the
no-em-dash rule, and the Life six clause gained a dash. v4 refreshed in place and re-proved by
pull-and-diff (40 files, zero mismatches, both blocks asserted on the pulled file). Looked at on the
dev server at desktop. `theme check` 9 / 0 / 0 new.

## Addendum, 2026-11-25: header and footer links die on a policy page (Steve)

Steve opened the Returns policy from the POC footer and found that Shipping and Returns worked
from there but every other footer link was dead. Cause: a policy page is a separate document that
Shopify renders inside the POC's `layout/theme.liquid`, so the header and footer are present but
none of the SPA's `.page` sections are, and `showPage()` had nothing to show. The policy links
work because they are real hrefs. It never showed before POC22 put policy links in the footer,
since until then there was no way to leave the home document inside the POC's chrome. Fix, in
`assets/ci-storefront.js`: when the document holds zero `.page` elements, `showPage()` sends the
browser to `/` with the page named in the hash (`/#page=about`; `home` goes to `/` alone), and a new
`initHashEntry()`, run after the catalog loads beside `initOfferEntry()`, opens that page and drops
the hash so a reload or a copied URL does not re-open it. The zero-`.page` test keeps a mistyped
name on the SPA itself from bouncing the visitor home (checked: it still does nothing, as before).
Not carried to production, where every page has its own URL and these are ordinary links.
Model-neutral: `main` (`cef0a14`), merged forward; the branch's own copy of the file differs and
the merge was clean. Verified by driving the dev server from three policy pages: footer About,
header Roasters (grid rendered on arrival), the logo to home; and on the real v4 preview after the
push. v4 refreshed in place and re-proved by pull-and-diff (40 files, zero mismatches,
`initHashEntry` and the guard asserted on the pulled file). `theme check` 9 / 0 / 0 new.
