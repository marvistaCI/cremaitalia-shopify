# POC25 — the skip link, and a class collision that would have broken the quiz

**Deployment state is NOT recorded here.** `CLAUDE.md` §10 CURRENT STATE is authoritative.

Closes **F1** from the POC24 re-score: **WCAG 2.4.1 Bypass Blocks, Level A**, the only Level A
criterion the storefront was known to fail and the sole reason Accessibility was capped at 8.0
against an otherwise clean measured surface.

---

## What shipped

A visually-hidden `Skip to content` anchor, **first focusable element in the document**, sliding into
view on focus and targeting a permanent `#ci-content` wrapper.

**Why a wrapper rather than a `<main>`.** This is a single-document SPA with one `<main>` per `.page`,
so at any moment **19 of the 20 are `display:none`** and cannot receive focus. A link pointing at any
single one would be dead on every other page. `#ci-content` always exists and always contains
whichever page is active; `tabindex="-1"` lets it take programmatic focus without joining the tab
order itself.

**`position: fixed`, not `absolute`.** An absolutely positioned skip link scrolls away with the
document, so a user who tabs to it after scrolling gets a control that is focused and visually
nowhere. This was changed mid-build after measuring the link at two scroll positions.

---

## The collision — the reason this entry is worth reading

The link was first written as `class="skip-link"`. **That class was already taken.**

`.skip-link` belongs to the taste quiz's *"Not sure yet... skip this one"*, *"Skip - browse
everything"* and three *"Back"* buttons. Because the new rules sit later in the stylesheet, they won
on the cascade and gave **five quiz controls** `position:absolute; top:-4rem; z-index:200` —
moving the navigation of the hero CTA's own flow off screen.

**It would have shipped.** `theme check` passed at the documented baseline, the JS was syntactically
clean, and the skip link itself worked perfectly. It was caught by enumerating `.skip-link` in the
live DOM and finding **six** elements where one was expected.

Renamed to `.skip-to-content`, with the incident recorded in comments at both the markup and style
sites so nobody renames it back. Verified after: all five quiz controls are `position: static`,
`top: auto`, and the quiz opens and renders normally.

**The general lesson: in a stylesheet with 900+ lines and no naming convention, a new class name is
an assertion that needs checking.** One `querySelectorAll` before writing the rule would have cost
five seconds.

---

## Verification

| Check | Result |
|---|---|
| First focusable element in the document | **yes** (`skip-to-content` precedes `ci-logo`) |
| Hidden at rest | yes, fully off-screen |
| Moves into view when focused | yes, to `top: 12px` |
| Target exists and accepts focus | yes |
| Target contains the active page after SPA navigation | yes |
| Tap target | 142x47, above the 44px convention |
| Contrast | **10.56** |
| Quiz controls no longer absolutely positioned | 5 of 5 `static` |
| `theme check` | 15 offenses / 0 errors / **0 new** |

### Four measurement artifacts, all mine, none of them defects

This build produced more false alarms than any single item in the project, and every one was a
property of how it was being tested rather than of the code:

1. **`:focus` did not match.** `document.hasFocus()` was `false`; `:focus` cannot match in an
   unfocused document even though `document.activeElement` was correct.
2. **`.75rem` looked rejected by the CSSOM.** It was not — the setter accepted it.
3. **A rect read `-129` instead of `-64`.** The page was scrolled and
   `getBoundingClientRect()` is viewport-relative. This one was useful: chasing it is what exposed
   the `absolute` vs `fixed` weakness.
4. **The element would not move even with `!important`.** The page was `document.hidden`, and **a
   hidden page does not advance CSS transitions**, so the animated `top` was frozen at its start
   value. Removing the `transition` moved it to `12px` instantly, proving the CSS correct.

Number 4 is the same root cause as the long-misdiagnosed screenshot timeout: a non-compositing page.
The visible symptom is different every time, which is what makes it costly.

**Not verified:** the focus state has not been seen by a human, because the Browser pane was not
displayed. Everything above is computed. Worth one Tab press on the deployed preview.
