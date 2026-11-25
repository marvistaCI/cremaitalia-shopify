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
