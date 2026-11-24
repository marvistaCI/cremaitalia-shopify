# POC_Bulk_v3 change list - the storefront stops claiming we ship the bag the roaster filled

**Status: see CLAUDE.md §10 for deployment state; this file is the ledger, not the state.**

Built 2026-11-24 on branch `poc-bulk` - the first bulk-model copy batch, and the first batch on the
branch that does not land on `main`. Plan: `docs/POC_Bulk_plan.md`, section A.

## Why now rather than after Standard v1.24

Section A was gated on Store Operating Standards v1.24 so the storefront and the Standard could not
disagree on day one. Steve opened the `POC_Bulk_v2` preview and found the hero still reading "Exactly
as the roaster sealed it", on a theme named Bulk. Accurate to what had been built, and an odd thing to
hand anyone. The way out: the one decision the hero and the core claim depend on was already taken,
in the coming-soon paragraph Steve wrote on 2026-11-17 and pushed live - the roast is untouched, the
beans fly to Florida, we seal them into fresh bags shortly after they land, and every bag names the
roaster, the coffee and the roast date. Every sentence below derives from that paragraph. The
decisions still open in v1.24 (100 g, where the freshness clock starts, cadence, whole bean as our
choice) touch other plan items, not these. v1.24's "how repacked is said" rule now records the
sentences the storefront uses, which is the order the live page followed.

## The hero

**"Exactly as roasted in Italy."** Two candidates were offered: *Exactly as the roaster roasted it...
in Italy* (the minimal edit, keeping the cadence settled over six candidates in POC30) and *Roasted
in Italy. Flown here fresh, the roast untouched.* Steve asked whether "the roaster roasted" was a
redundancy. It is, and it was already in the coming-soon paragraph ("just as the roaster roasted
them"), where a long sentence hid it; a six-word headline does not. *Exactly as roasted in Italy* is
the factual claim stated as fact, keeps "in Italy" as a place rather than a style (the POC21 line),
and gives up only the person, who is restored by the first beat directly under the video. The
alternative that keeps the person without the echo, *Exactly as the roaster intended... in Italy*,
was offered and declined: "intended" is a claim about a mind where "roasted" is a claim about a
process, and the process is the thing we can prove.

Measured: two lines at desktop (47.1px) and two at 375 (31.5px), no overflow. The scrim contrast
was measured in POC32 against the longer line; the new one sits inside the same zone and was not
re-measured - recorded in the template comment.

## The other nine sites

| Site | Was | Now |
|---|---|---|
| Meta description | "sold exactly as the roaster sealed it" | "flown to Florida, and sealed into fresh bags shortly after landing, the roast untouched" |
| Share description | no sealed claim | unchanged |
| Three beats | "roaster seals" in the comment only | copy unchanged; comment says roasts, airfreight and repack, grind |
| Our model | "masters of roasting and packaging... unchanged" | "masters of roasting... the roast untouched", then the Florida sentence with roaster, coffee and roast date on every bag |
| About, Our company | "ships it... unchanged"; "exactly as they roast and seal it - nothing re-roasted, re-ground, or re-bagged" | "the roast untouched"; "exactly as they roasted it - never re-roasted, blended, or ground. We seal the beans into fresh bags shortly after they land in Florida." |
| Promise, freshness window | "in the roaster's own sealed bags" | "seal it into fresh bags shortly after it lands" |
| FAQ, Do you roast | "We never roast, blend, or repackage." | "We never roast, blend, or grind. We do pack: ..." |
| FAQ, new entry | - | "What is on the bag?" - roaster's name, the coffee, the roast date, on the roaster's own label, with the imported-and-repacked line (the FDA wording from the invitation letter) |
| Journal teaser, Brewing | "because that is what our roasters seal at origin" | "because the coffee keeps better that way, and because the grind should match your brew, not ours" |
| Photography brief (comment) | "one of OUR roasters' sealed bags" | "one of our own bags carrying a roaster's label" |

"Unchanged" was replaced with "the roast untouched" wherever it appeared next to a shipping verb,
because under repack "unchanged" reads as a claim about the bag.

## Deliberately not changed

- Product descriptors with sealed-model wording (Gardelli Ethiopia's "valve-sealed bag", the
  Geisha's "pallet"): invented demo data, written by the roaster in production (Steve, 2026-11-24).
- The 2026-08-18 and 2026-09-12 hero comment narratives, which describe lines that no longer exist:
  history, left as written, with the 2026-11-24 change recorded above them.
- The Regions map sub-labels' em-dashes: the documented POC9 exception, surfaced by the copy sweep
  and correctly left.

## Verified

- Driven live: the hero, meta description, Our model, About, Promise, both FAQ entries and the
  Journal teaser read as drafted; zero occurrences in the rendered DOM of "sealed it", "own sealed
  bags", "re-bagged", "or repackage.", "roasters seal" or "and packaging".
- Copy rules checked on the new sentences: no em-dashes, no exclamation marks, none of the banned
  register.
- `theme check` at the documented baseline (9 / 0 / 0 new).
- Looked at: the hero at desktop and 375.
