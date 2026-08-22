# Systems Inventory — source lives here, the workbook lives in OneDrive

**`build_inventory.py` is the source of truth. The `.xlsx` is a render.**

```
docs/systems-inventory/build_inventory.py          <- edit this, version-controlled
        |  python build_inventory.py
        v
OneDrive\...\Operations\In USA\shopify\Systems\Systems Inventory.xlsx   <- Steve opens this
```

Same source/render model the three Standards already use: an editable source in the repo behind git,
a delivered copy where the human actually opens it. **Never edit the workbook by hand in Excel** — the
next generator run overwrites it, and a hand-edit is invisible to diff. Edit the script, re-run,
re-deliver.

## Why this split, rather than moving the workbook into the repo

The workbook was *offered* a move to git. It should stay where it is:

- **Steve opens it.** It lives beside every other business document in OneDrive, syncs to his other
  devices, and its purpose is operational — counting subscriptions, logins and data relationships he
  has to maintain. A path under `~/code/` serves that worse.
- **A binary `.xlsx` diffs uselessly.** `git log` on it would show "file changed" and nothing more.
  The script diffs *perfectly* — every prose change in every Notes cell shows up as a readable line.

So git gets the thing git is good at, and OneDrive gets the thing OneDrive is good at.

## Why this file was created in a hurry

**The generator spent its first day in `C:\Users\marvi\AppData\Local\Temp\...\scratchpad\`** —
session-scoped, and Temp gets cleaned. Had that happened, the workbook would have survived and become
**un-regenerable**: 39 systems, 56 decisions and 25 data flows, with all their reasoning, editable only
by hand in Excel from that point on. That is the two-homes failure this project keeps removing, and it
was one cleanup away from happening. Building a durable artifact from a temp-directory script was a
mistake; this is the fix.

## Running it

```bash
python docs/systems-inventory/build_inventory.py
```

No arguments. It writes the workbook to the OneDrive path hard-coded at the top of the script
(`OUT`), rebuilding all five sheets every run: **Systems Inventory**, **Cost Summary**, **Decisions**,
**Legend & Sources**, **Data Flows**.

Requires `openpyxl`.

## Structure

| Sheet | What it holds |
|---|---|
| Systems Inventory | One row per system. 39 rows, 16 columns. |
| Cost Summary | Formula-driven roll-up. Pulls from the inventory sheet, so costs have one home. |
| Decisions | **The live tracker.** Filter State for `OPEN`, `GAP`, `CHANGING`, `SCHEDULED`. Every live row carries Owner, Next action, By when. |
| Legend & Sources | What each status means, cost conventions, and where every claim came from. |
| Data Flows | 25 flows across the inbound (supply) and outbound (demand) clusters. |

**`CLAUDE.md` §10 points at the Decisions sheet as the single home for live open-item state** and must
not restate it. That pointer was added 2026-08-22 after open items were found living in three places
at once.
