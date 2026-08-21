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

### Consequence — `peak_flavor_days` loses its only consumer

That sentence is the **only** place `peak_flavor_days` renders. Removing it leaves a theme setting
that nothing reads, which is exactly the defect Review A finding A3 removed from the catalogue: data
that *looks* authoritative while nothing consumes it.

The need behind it has not gone away. Steve's stated reason for the 30 days on 2026-08-21 was so that
**a customer who keeps a bag for a year cannot later judge it against our freshness promise.** That is
a real protection and it still needs a home. Three options, none chosen:

- Move it to the **brewing note** on the product page, where "from roast" is unambiguous in context.
- Move it to the **FAQ**, alongside the FIFO explanation.
- Drop the setting entirely and accept the loss of that protection.

**Do not simply delete the sentence and leave the setting.**

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

### Consequence — this contradicts Standard §5.4 as published

v1.12 states, explicitly, that **"Offerta is the exception and shows its actual roast date"**. This
staged item reverses that. **Building it requires a v1.13 amendment**, and the Standard must change
first or the storefront and the Standard disagree on day one.

The rationale for the original rule still partly holds and should be preserved in the amendment: the
two shelves must not *look* identically fresh. The computed band does that better than an actual date,
because it makes the age gap explicit rather than leaving the reader to compare two dates.

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
- Sequence: **amend the Standard to v1.13 first**, then build. Item 2 is a reversal, not an addition.
