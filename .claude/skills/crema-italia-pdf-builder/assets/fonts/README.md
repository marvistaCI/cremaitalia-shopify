# Brand font files (.ttf)

`fonts.css` expects these files in this folder (bundled with the skill so every
render is offline and reproducible). Rebrand 2026-07-01: display font is now
**Marcellus** (not Lora); wordmark art uses Montecatini Pro (logo files only).

**Marcellus** (display / headings — single 400 weight, roman only)
- `Marcellus-Regular.ttf`

**Inter** (body / UI)
- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`
- `Inter-Italic.ttf`

## Where they came from
Both are open-source (SIL Open Font License). Bundled here from the project's
`Brand and Marketing/assets/fonts/`. Marcellus has one weight — heading hierarchy
is by size, not weight; there is no Marcellus italic (use Inter Italic for italics).

## Why local, not a Google Fonts URL
WeasyPrint must read the font at render time. A live URL makes the render depend on
the network; a failed fetch silently falls back to a generic serif and produces a
degraded document. Local files remove that failure mode entirely.
