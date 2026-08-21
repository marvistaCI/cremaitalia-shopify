# POC19 — staged, NOT BUILT

**Nothing in this file has been built.** These are items Steve staged on 2026-08-21 while reviewing
POC18. For what is deployed, read `CLAUDE.md` §10 CURRENT STATE and verify it live.

Each item below carries a **consequence** section, because two of the three orphan a setting or a
field that POC18 only just introduced, and one of them contradicts a Standard published hours earlier.
Those need settling as part of the build, not discovered during it.

---

## 1 · Main shelves — replace the freshness sentence

**Today (POC18):**

> Best within 90 days of roast date. For peak flavor, brew within 30 days.

**Staged:**

> These beans are within our best-freshness window of `{freshness_window_days}` days.

**Why:** Steve removed the peak-flavour clause because *"it is unclear what the 30 days is counting
from"* — a fair reading. Placed after a roast-date sentence, "brew within 30 days" is ambiguous
between 30 days from roast and 30 days from delivery.

### RESOLVED — `peak_flavor_days` is retired, and the advice merges into the whole-bean sentence

Standard **v1.14** settled this. The setting is **removed entirely**, not rehomed: the freshness
windows are gates we enforce, and this was advice about behaviour we do not control, so it is brand
copy rather than tunable policy.

**Also replace the whole-bean sentence** (approved copy, Steve, 2026-08-21). Today it reads:

> **Whole bean only.** You will need a grinder. If you do not have one, *search for a burr grinder in
> our Bottega*.

It becomes:

> **Whole beans only.** We recommend using your beans within 30 days of receiving them, and grinding
> them just before each brew. Need a grinder? *Search for one in our Bottega.*

One statement doing three jobs instead of two sitting a few lines apart and half-overlapping. The 30
days counts **from receiving**, which is what removed the ambiguity in the first place. The Bottega
link stays a shelf link, never a fixture SKU handle.

**Build consequence:** remove `peak_flavor_days` from `settings_schema.json`, `settings_data.json`,
`window.CI_RULES` and the `PEAK_DAYS` constant. Leaving any of them behind recreates the
setting-nothing-reads defect this change exists to remove.

---

## 2 · Offerta — replace the roast date with a computed range

**Today (POC18):**

> Roasted: 20-JUL-2026

**Staged:**

> Roasted between `{sysdate − offerta_fresh_days}` and `{sysdate − (freshness_window_days + 1)}`

With `sysdate = 21-AUG-2026`, `offerta_fresh_days = 150`, `freshness_window_days = 90`:

> Roasted between 24-MAR-2026 and 22-MAY-2026

The band is exactly the Offerta definition made visible: **oldest** is the age at which we withdraw
and donate; **youngest** is one day older than the main-shelf floor, so the two shelves cannot claim
overlapping freshness.

*(Steve's worked example gave the youngest date as 19-JUL-2026. Arithmetic check: 21-AUG-2026 minus 91
days is 22-MAY-2026; 19-JUL is 33 days back. The formula is right, the example slipped, and the
formula is what is staged.)*

**Why:** an Offerta product can hold **more than one lot** on a slow-moving SKU. §13.9 assumed one
split-off lot per Offerta product and therefore an actual date. Steve: *"quoting the range keeps the
website always honest, instead of mostly honest."*

This is the same reasoning as the main-shelf floor, one shelf over: state the **guaranteed band**
derived from policy, rather than a specific fact that may not hold for every bag in the bin.

### DONE — the Standard was amended first

This item reversed v1.12's rule that *"Offerta is the exception and shows its actual roast date"*.
**Standard v1.13 (2026-08-21) made that change before any code was written**, so the storefront and
the Standard will not disagree when it is built.

The original rationale survives and is better served: the two shelves must not *look* identically
fresh, and a band does that more plainly than an actual date, because it makes the age gap explicit
rather than leaving the reader to compare two dates and work it out.

### Consequence — Offerta no longer needs a roast date for display

`roast_date` is still required on an Offerta product for the **withdrawal trigger** at 150 days and
for operations. It just stops driving anything the customer sees.

---

## 3 · Offerta — replace the freshness line

**Today (POC18):**

> Best within 27 days · sold as-is

**Staged:**

> Best if used soon after purchase - sold as-is

**Why:** with the range above stating the age band, a computed remaining-days figure is a third number
on the same subject. This says the useful thing plainly.

### Consequence — `freshness_remaining` loses its consumer

That fixture field on the Offerta product exists only to render this line. After the change nothing
reads it, so it should be removed from the catalogue rather than left as another field that looks
meaningful and is not.

---

## Notes for whoever builds this

- **All three dates are computed server-side**, in Liquid, from the store's timezone — never from the
  browser clock (Standard §5.4, and the comment in `layout/theme.liquid` explains why).
- **`DD-MMM-YYYY` throughout** (Standard §5.4).
- The main-shelf floor already publishes as `CI_RULES.freshFloorLabel`. The Offerta band needs two
  more computed labels alongside it, by the same mechanism.
- **The Standards are already amended** - v1.13 for the Offerta band, v1.14 for retiring
  `peak_flavor_days` and merging its message into the whole-bean sentence. Build against them; do
  not re-litigate. Item 2 was a reversal rather than an addition, which is why it went to the
  Standard first.
