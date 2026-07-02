# Crema Italia brand reference (for PDF documents)

The authoritative source is `Brand and Marketing/Crema Italia Brand CSS.css` (v1.2) and
the current Brand Standards PDF (`Crema_Italia_Brand_Standards_v2.0.pdf`). **Link the
stylesheet; don't duplicate it.** This file is a quick-reference so you can author
correctly without reopening everything. Values below reflect the 2026-07-01 artist rebrand.

## Fonts
- **Display / headings:** Marcellus (serif, weight **400 only**, roman — no italic).
  Heading hierarchy is by size, not weight.
- **Body:** Inter (sans). Weights 400 / 500 / 600, plus italic 400.
- **Wordmark:** Montecatini Pro — **logo artwork only** (already outlined in the logo
  files; commercial font, licensing unconfirmed). Never set live text in it.
- **Fallback chain (display):** Marcellus -> Georgia -> serif.
- H2 sub-heads are an exception: Inter, 600, in Crema Gold (`--ci-crema`).
- EN/IT cue: because Marcellus has no italic, the English/Italian distinction is carried
  by the ENGLISH/ITALIANO eyebrow label + column position, NOT italic display type.

## Palette (CSS variables in the brand stylesheet)
| Token             | Hex      | Use                                          |
|-------------------|----------|----------------------------------------------|
| `--ci-cream`      | #FBF8F1  | Page background                              |
| `--ci-ivory`      | #FFFFFF  | Cards, print paper                          |
| `--ci-coffee`     | #55331B  | Primary text / dark headings (Espresso Brown)|
| `--ci-espresso`   | #6B4A38  | Secondary text (interim)                     |
| `--ci-crema`      | #B88348  | Crema Gold — large headings, links, numerals |
| `--ci-crema-hover`| #9C6E3C  | Accent hover                                 |
| `--ci-green`      | #0E7A3A  | Italian flag rule (rules only)               |
| `--ci-red`        | #C8342B  | Italian flag rule (rules only)               |
| `--ci-hairline`   | #D9D2C2  | Borders / dividers                           |
| `--ci-mute`       | #8C7E6A  | Muted / captions                            |

Retired (do NOT use): Coffee `#3B1F12`, Terracotta `#C46A1F`, and the Cormorant/Lora fonts.

**Contrast:** Crema Gold `#B88348` is only **3.1:1 on cream — large text only**
(headings >= 18px / bold >= 14pt, links, key numerals). Never body or small text; use
Espresso Brown instead. Tricolore green/red are for rules and strips only — never fills.

## Useful brand classes
`.ci-page` (container), `.ci-header` / `.ci-footer` (chrome), `.ci-hero` /
`.ci-hero-subtitle` (cover type), `.eyebrow` (uppercase overline label), `.callout`
(left-bordered note), `.ci-table` (branded table), `.card` / `.card-grid`, `.flag-rule`
(thin green/red top rule), `.flag-strip` (tricolore footer strip), `.muted`, `.italian`.

## Logo
Finalized artist mark in `Brand and Marketing/Logo Assets/` — vector master in `Art Files/`
(.ai), plus `EPS/`, `PDF/`, `SVG/`, `PNG/`, `Web/`. Lockups: main / horizontal / favicon,
each light + dark. Use the dark-background lockup on dark grounds; ™ (never ®). See
`Logo Assets/README.md`.

## Bilingual & paired-document conventions
- For two-language layouts use the `.bilingual` grid (English left, Italian right,
  hairline divider); it collapses to one column on narrow widths.
- The **Roaster Guides** are two paired single-language editions: `_us` + `_it`. A change
  to one language requires the same change to the other; both re-issue together under one
  new version number. Italian is the controlling edition.

## Versioning (project rule)
- Always use the greatest version-number variant of a file (`_v3` > `_v2`).
- Minor bump = typography / copy tweak; major bump = layout / design change.
- Move superseded files to the relevant `archive/` folder — but ask before reorganizing.
