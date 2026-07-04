# POC v4 Change List

Running list of defects/changes Steve is flagging against the live POC3 preview
(theme id `151277174953`). Items accumulate here as to-do while POC3 stays untouched;
when Steve says he's ready, this list gets batched into a POC4 implementation pass and
each item gets checked off / moved to the `CLAUDE.md` §9 decision log.

Status values: `open` (reported, not yet implemented) · `done` (implemented, pending
Steve's visual confirm) · `verified` (Steve confirmed in preview) · `needs decision`
(architecture/scope question for Steve, not a straightforward code fix).

---

## Open items

### 1. Gap between the Offerta shelf card and the Featured Tour block
- **Status:** done
- **Where:** `assets/ci-storefront.css` `.tour-hero`.
- **Symptom:** Visible gap/inconsistent spacing between the last shelf card (Offerta)
  and the dark Featured Tour panel that follows it — see Steve's screenshot
  (2026-07-03). Root cause: `.tour-hero` had `margin-bottom:2.5rem` but no
  `margin-top`, so the space above it was accidental (whatever margin collapse
  happened to produce) rather than deliberate.
- **Implemented:** added `margin-top:2.5rem` to `.tour-hero`, matching its own
  `margin-bottom` for a symmetric, intentional gap instead of a collapse-dependent one.
- **Not verified in browser** — same caveat as the rest of this batch.

### 2. Shop dropdown doesn't close after selecting a shelf
- **Status:** done
- **Where:** `snippets/ci-header.liquid` (`.shop-menu` and `.account-menu` links);
  `assets/ci-storefront.css` (`.nav-item.menu-force-closed`,
  `.account-wrap.menu-force-closed`); `assets/ci-storefront.js`
  (`forceCloseDropdown()`, `closeShopMenu()`, `closeAccountMenu()`).
- **Symptom:** The Shop dropdown is shown/hidden purely by CSS `:hover`/`:focus-within`
  — clicking a shelf link left it open until the cursor moved away.
- **Implemented:** a blur-only fix wouldn't have been enough — `:hover` stays true
  as long as the cursor sits on the link you just clicked, independent of focus. Added
  a `menu-force-closed` class that `!important`-hides the menu on selection, then
  re-arms itself on the container's `mouseleave` so normal hover behavior resumes next
  time. Applied the identical fix to the **Account dropdown** too, once I noticed it
  has the exact same `:hover`/`:focus-within` mechanism and would have had the same
  bug (not explicitly reported, but same root cause — flagging in case that's more
  than you asked for).
- **Not verified in browser** — same caveat as the rest of this batch.

### 3. Account page is missing addresses, payment method, and profile settings — Loop vs. native Shopify split
- **Status:** done — **decision locked 2026-07-04:** Loop's hosted portal owns the
  ship-to address and payment method for the active subscription; native Shopify
  customer accounts own the general address book and profile settings (name, email,
  password) for one-time orders. Accepted per Steve's "your recommendation."
- **Where:** `assets/ci-storefront.js` `renderAccount()`.
- **Symptom (as reported):** the mocked "Your Account" page only had Membership,
  Taste profile, and Recent orders cards, plus a placeholder box for the Loop
  subscription portal. No address book, no ship-to, no payment management, no
  profile settings anywhere — not stubbed, entirely absent.
- **Implemented:** added a fourth account card, **"Profile & addresses"**, stubbed as
  native-Shopify territory ("Managed via native Shopify customer accounts on the live
  store — not built in this POC"). Expanded the existing Loop-portal-slot copy to
  explicitly mention it also covers "this subscription's ship-to address and payment
  method," so the split is visible on the page itself, not just in this doc.
- **Not verified in browser** — same caveat as the rest of this batch.

### 4. Roasters page — hero copy edits + add an Italian roasting regions filter
- **Status:** done (copy edits, points 1-3) · filter (point 4) postponed to POC5
- **Where:** `templates/index.liquid` (`#page-roasters` dark-hero, ~line 200-210);
  region-filter UI/logic pattern to reuse already exists for the Shop page
  (`activeRegion`, `filterRegion()`, region pills) in `assets/ci-storefront.js`
  (~line 20, 279, 349) — needs the equivalent wired onto `#roaster-list` rendering.
- **Changes requested:**
  1. Eyebrow: `"A small group"` → `"GRUPPO D'ECCELLENZA"` (**revised** — supersedes
     the earlier "Our small, carefully chosen group" wording from the same batch).
  2. Intro line: `"We hold the U.S. consumer channel for each of these roasters, and
     we present their coffee unchanged."` → `"We are the premier consumer channel
     for each of these roasters, and we offer their coffee just as they offer it in
     Italy."`
  3. Remove the sentence `"Tuscany first; the rest of Italy as we grow."` from this
     page (Steve: true, but a better story for the Journal instead).
  4. Add an **Italian roasting regions** filter to the Roasters page (mirrors the
     Shop page's region-pill filter pattern already in the codebase). **Postponed to
     POC5 2026-07-04** per Steve — do not build for POC4.
- **Implemented:** points 1-3 landed in `templates/index.liquid`'s `#page-roasters`
  hero exactly as specified above. Point 4 (the filter) is untouched, deferred to
  POC5.
- **Not verified in browser** — same caveat as the rest of this batch.

### 5. Confirm: square tile next to each roaster row is for the roaster's brand logo
- **Status:** confirmed — no code change, logged for the record
- **Where:** `.roaster-portrait` tile in `roasterRow()`,
  `assets/ci-storefront.js` ~line 117-121 (currently renders a placeholder label,
  e.g. "Gardelli", inside a 160px/4:3 tile — `.roaster-portrait` CSS at
  `assets/ci-storefront.css` ~line 246).
- **Confirmed intent:** yes — this square tile is designed to hold each roaster's
  brand logo (currently a text-placeholder standing in for the real logo asset).
  When roaster logo files are available, swap the placeholder label for an `<img>`.

---

## Roaster profile page (clicking into a specific roaster)

### 6. Back-button label: "All roasters" → "Meet our roaster"
- **Status:** done — **revised 2026-07-04:** on review, Steve hadn't clocked this was
  a back-link (fair — "Meet our roaster" reads like a forward action). Final text:
  `"Show all roasters"`, which is unambiguous about what clicking it does.
- **Where:** `templates/index.liquid` ~line 215, `#page-roaster` dark-hero back
  button.
- **Change:** button text `"All roasters"` → `"Show all roasters"`. Still functions
  as the back-link to the Roasters index — only the label text changed.
- **Not verified in browser** — same caveat as the rest of this batch.

### 7. Question: why do hero font sizes differ between the Roasters index and a Roaster profile page?
- **Status:** answered — no code defect found; flagging for Steve's visual re-check
- **Where:** both `#page-roasters` and `#page-roaster` heroes share the exact same
  markup pattern (`.dark-hero > .dark-hero-inner > p.eyebrow + h1 + p`) and the exact
  same CSS rules (`assets/ci-storefront.css` ~line 208-212: `.dark-hero h1{font-size:
  clamp(2rem,5vw,3rem)...}`) — there is no page-specific override in the stylesheet,
  so by code both hero titles/eyebrows render at the identical size.
- **Likely explanation:** perceived difference is probably due to text length/wrap —
  "Our Roasters" vs. a specific (sometimes longer) roaster name, and the eyebrow
  text length ("GRUPPO D'ECCELLENZA" vs. "{region} · founded {year}") — not an actual
  font-size difference. Flagging so Steve can re-check side-by-side in the live
  preview once item #6 and the logo-tile items below ship; if a real difference is
  still visible then, we'll dig further.

### 8. Add the roaster brand-logo square to the Roaster profile hero too
- **Status:** done
- **Where:** `templates/index.liquid` `#page-roaster` dark-hero (new
  `.roaster-hero-row` wrapper + `#roaster-logo`); `assets/ci-storefront.css`
  (`.roaster-hero-row`); `assets/ci-storefront.js` (`openRoaster()`).
- **Implemented:** added a `.roaster-portrait` tile (same component as item #5,
  scaled to 110px for the hero) next to the eyebrow/name text, populated from the
  same `portrait_cls`/`portrait_style`/`label` fields already used on the Roasters
  index. Still a text placeholder standing in for real logo art, per item #5.
- **Not verified in browser** — same caveat as the rest of this batch.

### 9. Coffee-offering tiles hold bag photos — slide-changeable (multi-image) support
- **Status:** done (mechanism built; real photography still pending)
- **Where:** `assets/ci-storefront.js` (`cardImgSlidesHtml()`, `cycleCardImg()`,
  `productCard()`); `assets/ci-storefront.css` (`.card-img-slide`, `.card-img-dots`,
  `.card-img-dot`).
- **Scope note:** `productCard()` is shared by every product tile site-wide (Shop
  grid, shelf pages, home, and the roaster profile's coffee-offering grid this item
  named) — the carousel applies everywhere a coffee product tile appears, not just
  on roaster pages, since they're all the same component. Flag if you wanted it
  scoped narrower.
- **Implemented:** each tile now renders 3 slides (the product's existing image
  label, then placeholder "Back of bag" / "Label close-up" text) with small dot
  controls at the bottom of the tile; clicking a dot swaps the visible slide and
  `event.stopPropagation()`s so it doesn't also trigger the card's "open product"
  click. **Still needed before this is real:** actual product photography per SKU
  (front/back/label) — the three slides are placeholder text until then, same as
  every other image tile in POC3.
- **Not verified in browser** — same caveat as the rest of this batch.

### 10. "Visit them" section — full address/website/phone, and clickable map link
- **Status:** done
- **Where:** `assets/ci-catalog.json` (new `address`/`phone`/`website` fields on all
  5 roasters); `assets/ci-storefront.js` (`openRoaster()`); `assets/ci-storefront.css`
  (`.prose a`).
- **Implemented:** added structured `address`, `phone`, and `website` fields to each
  roaster (website was already embedded in the free-text `find` field — pulled out
  as its own field; `find` itself left untouched/unused). The "Visit them" section
  now renders the street address as a link to
  `https://www.google.com/maps/search/?api=1&query=...` (opens in a new tab via
  `target="_blank" rel="noopener"`), followed by the website and phone number.
  **The addresses/phones are invented test data**, consistent with the rest of
  `ci-catalog.json`'s "POC3 baked-in test dataset" (per its own `_meta.note`) — real
  roaster contact details need to replace these before any real launch.
- **Not verified in browser** — same caveat as the rest of this batch.

### 11. Replace the "Roaster profiles show Roccia and Sorpresa..." disclaimer line
- **Status:** done
- **Where:** `templates/index.liquid` `#page-roaster`, `.afd` line.
- **Implemented:** replaced the old text with the exact new copy: `"This represents
  the entire offering currently available for this roaster. In Sorpresa offerings,
  this roaster is represented, but may not be the exclusive roaster in the product
  offering."` — now accurate now that item #12 shows all four shelves.
- **Not verified in browser** — same caveat as the rest of this batch.

### 12. Fix: roaster profile page must show that roaster's coffee from ALL FOUR shelves, including when it's only inside a Sorpresa Tour
- **Status:** done — Steve accepted the recommendation 2026-07-04.
- **Where:** `window.openRoaster()` in `assets/ci-storefront.js`;
  `assets/ci-catalog.json` (`tour-ditalia-1`).
- **Symptom / rationale (Steve):** if someone loves a particular roaster, the
  roaster's own page should be the best place to find everything Crema Italia
  carries from them — on all four shelves (Roccia, Sorpresa, Selezione, Offerta) —
  not just Roccia/Sorpresa.
- **Data-model gap found while investigating:** Sorpresa Tour bundle products (e.g.
  `tour-ditalia-1`) had **`"roaster": null`** at the top level — the three roasters
  inside a Tour were only named in a free-text `components` array, not linked by
  roaster handle, so a Tour couldn't surface on e.g. Gardelli's page.
- **Implemented:** (a) `openRoaster()`'s filter no longer restricts by shelf at all —
  it matches any product where `p.roaster === handle`, which naturally covers all
  four coffee shelves (Bottega has no `roaster` field, so it stays excluded without
  a shelf allowlist); (b) added a new structured `"roasters": ["gardelli", "lasosta",
  "fusari"]` array to `tour-ditalia-1` in `ci-catalog.json`, and `openRoaster()` now
  also matches any product whose `roasters` array includes the handle — so the Tour
  now correctly appears on all three of its component roasters' pages. The original
  `roaster: null` and free-text `components` field were left untouched.
- **Not verified in browser** — same caveat as the rest of this batch.

---

## Taste quiz

### 13. Q1 ("How do you like your roast?") — copy + labels finalized and implemented
- **Status:** done (implemented in code; `CLAUDE.md`/decision-log write-up held until
  Steve says the batch is ready)
- **Where:** `snippets/ci-quiz-modal.liquid` (subtitle + `#qstep-1`);
  `assets/ci-storefront.css` (new `.quiz-q-note` rule); `assets/ci-storefront.js`
  (`tasteTagsHtml()` roast-label map and the roast-label map inside
  `showQuizResult()` — the latter was a second, previously-missed copy of the same
  labels that also needed the rename).
- **Changes made:**
  1. Subtitle: `"Three questions. We will point you to the right roaster."` →
     `"Three questions. We'll point you to the right roasts."`
  2. Added a one-time disclaimer above the Q1 cards: `"Roasting is a matter of
     temperature and time. All Crema Italia coffee is roasted, never flavored —
     these notes come from the bean and the roast alone."`
  3. Card titles: `"Light & bright" / "Balanced & smooth" / "Rich & bold"` →
     `"Light roast" / "Medium roast" / "Dark roast"`.
  4. Card descriptions → `"Tasting hints at floral, fruity, or tea-like."` /
     `"Tasting hints at caramel, nutty, or brown sugar."` / `"Tasting hints at dark
     chocolate, toasted grain, or baking spice."`
  5. **Related filters updated to match:** the roast-label maps used for the
     taste-profile pill tags (account page, profile banner, quiz result screen) were
     still saying "Light & Bright / Balanced / Rich & Bold" — renamed to "Light
     Roast / Medium Roast / Dark Roast" in both places so the whole site stays
     consistent with the new card titles.
- **Not verified in browser** — no dev-server preview was spun up for this change
  (Steve pushed back on that mid-session); code was reviewed by reading, not run.

### 14. Q2 ("Which tasting notes appeal to you most?") — copy, framing sentence, and skip option finalized and implemented
- **Status:** done (implemented in code; `CLAUDE.md`/decision-log write-up held until
  Steve says the batch is ready)
- **Where:** `snippets/ci-quiz-modal.liquid` (`#qstep-2`); `assets/ci-storefront.js`
  (new `window.skipTasteQuestion()` function).
- **Changes made:**
  1. Headline: `"What draws you to a coffee?"` → `"Which tasting notes appeal to you
     most?"`
  2. Added framing sentence below the headline: `"Roast level, bean origin, and
     blend ratio all shape these characteristics."`
  3. The three cards (Fruit & flowers / Sweet & chocolatey / Bold & spiced) and their
     descriptor text are **unchanged**.
  4. Added a fourth option, `"Not sure yet — skip this one"`, rendered as a
     low-emphasis text link below the three cards (reused the existing `.skip-link`
     style used elsewhere in the quiz) — deliberately **not** a fourth bordered card
     of equal visual weight, so it isn't the path of least resistance.
  5. Data behavior: `skipTasteQuestion()` clears any card selection and sets
     `quizAnswers.flavor = null`, then advances to Q3. Confirmed downstream that null
     already means "no restriction on this axis" — `applyProfileAndClose()` only sets
     `activeTaste.flavor` `if (quizAnswers.flavor)`, so a skipped Q2 correctly falls
     back to roast-level (Q1) alone with no hidden default profile.
  6. No skip option added to Q1 — confirmed intentional per Steve (roast
     self-identification is familiar territory; flavor self-assessment is not).
- **Not verified in browser** — same as item #13.

### 15. Open item to revisit — is Q2 carrying its weight, or should it be replaced?
- **Status:** needs decision (deferred — not blocking POC4)
- **Detail (Steve's analysis this session):** roast level and taste profile are
  correlated, not orthogonal — roasting chemistry makes Fruit & Flowers near-
  impossible at Dark roast and Bold & Spiced near-impossible at Light roast (the
  delicate acids/esters behind fruit/floral character degrade with heat and time;
  the Maillard/pyrolysis products behind spice/roasty character only build up later
  in the roast). The real independent signal comes mainly from processing method
  (washed vs. natural) in the light-to-medium band — which the framing sentence's
  "bean origin" language serves as an accessible proxy for, without asking customers
  a processing-method question directly.
- **Why we're launching with both questions anyway:** whether Q2 adds meaningful
  incremental signal over Q1 for Crema Italia's actual catalog (traditional Italian
  roasters, likely skewed medium-to-dark) is unknown until roasters are onboarded and
  SKUs are tagged with both `roast_level` and `taste_profile`.
- **Follow-up action:** once real SKU data exists, run a `roast_level` ×
  `taste_profile` crosstab to confirm whether Q2 is carrying its weight or should be
  replaced with a genuinely orthogonal question (candidates raised: acidity
  tolerance, brew method, origin region).

### 16. Quiz results screen — persona lookup matrix, sparse-cell handling, buttons, and back link finalized and implemented
- **Status:** done (implemented in code; `CLAUDE.md`/decision-log write-up held until
  Steve says the batch is ready)
- **Where:** `assets/ci-storefront.js` (new `PERSONA_MATRIX`, `SUBHEAD_*` constants,
  `isSparseCombo()`, `getQuizResult()`, rewritten `showQuizResult()` and
  `applyProfileAndClose()`, new `captureQuizProfile()` / `showEverythingFromQuiz()` /
  `chooseQuizMatches()` / `chooseQuizEverything()`, updated `closeSignin()` /
  `simulateSignIn()`); `snippets/ci-quiz-modal.liquid` (`#qstep-result` markup).
- **Changes made:**
  1. **Persona matrix** — replaced the old ad hoc if/else title logic with a lookup
     table keyed on the tuple (Q1 roast: light/medium/dark) × (Q2 flavor: fruit/
     sweet/terroir/**skip**), so a future Q3 can fold in as a third key without
     restructuring. Full matrix as specified:
     - Roast-only (Q2 skipped): Light → **The Minimalist**, Medium → **The Steady
       Hand**, Dark → **The Traditionalist** (preserved as-is). All three use the
       subhead *"You know your roast; we'll help you find your flavor."*
     - Light + Fruit & Flowers → **The Purist**; Light + Sweet & Chocolatey → **The
       Gentle Sweet**; Light + Bold & Spiced → **The Maverick** (sparse).
     - Medium + Fruit & Flowers → **The Romantic**; Medium + Sweet & Chocolatey →
       **The Classicist**; Medium + Bold & Spiced → **The Old Soul**.
     - Dark + Fruit & Flowers → **The Contrarian** (sparse); Dark + Sweet &
       Chocolatey → **The Indulgent**; Dark + Bold & Spiced → **The Devotee**.
  2. **Sparse-cell handling** (Light+Bold & Spiced, Dark+Fruit & Flowers): persona
     name still shown, but (a) subhead swaps to *"This is a rarer combination — here
     are the closest matches in our current catalog."* and (b) `applyProfileAndClose()`
     no longer sets `activeTaste.flavor` for these two combos — it relaxes to
     roast-level-only matching so the Shop grid doesn't return a thin/empty set.
     **Caveat:** true `taste_profile_secondary` fallback (as described in Steve's
     spec) doesn't exist in POC3's data model — there is no secondary-flavor field
     anywhere in the catalog or quiz. Implemented the roast-only relaxation instead,
     which achieves the same practical goal (avoid a thin/empty result) without that
     infrastructure. Flagging so this isn't mistaken for the literal secondary-tag
     mechanism once the real data model is built.
  3. **"Surprise me" fixed 2026-07-04 — folded into the matrix as a real fourth
     roast key (`any`) instead of a special-cased branch.** Steve's feedback: "Surprise
     me," as implemented, is simply a declaration of no roast preference — same shape
     as skipping Q2 — so it shouldn't be an exception to the lookup, it should complete
     it. `PERSONA_MATRIX` now has a fourth row, `any`, with its own four cells (mirrors
     the skip/fruit/sweet/terroir columns of every other row): `any+skip` → **The Open
     Palate**, `any+fruit` → **The Perfumer**, `any+sweet` → **The Sweet Tooth**,
     `any+terroir` → **The Wanderer**. These four names weren't part of Steve's original
     spec (which only covered Light/Medium/Dark) — I picked them to echo each flavor
     card's own descriptor copy (Fruit & Flowers' "coffee as a perfume"; Bold &
     Spiced's "a sense of where it came from") so they read as one family. **Flag if
     you want these four renamed.** `getQuizResult()` no longer has a special early-return
     for "any" — it's one lookup path for every combination now, which was the actual
     ask ("suggest a better fix... that will eliminate the matrix problem too"). A new
     `SUBHEAD_NONE` copy ("You're open to anything — we'll show you the full range,
     curator's choice first.") covers the `any+skip` case, where literally nothing is
     filtered.
  4. **Decaf Discoverer — restored 2026-07-04, and made unconditional.** Steve: "keep
     the Decaf Discoverer, I like it." Re-added as a persona-name override: whenever
     `quizAnswers.caffeine === 'decaf'`, the persona name is forced to **"The Decaf
     Discoverer"** regardless of roast/flavor — applied *after* the matrix lookup, so
     it overrides only the displayed name, not the underlying roast/flavor matching or
     subhead logic. This is actually a behavior improvement over the original: the old
     `elseif` chain only showed "The Decaf Discoverer" in the gaps left by the
     roast/flavor branches above it (never for Dark roast or Light+Fruit, since those
     conditions matched first); the new version shows it for every decaf answer,
     consistently.
  5. **Stale chip label fix**: confirmed the roast chip on the results screen no
     longer reads "Rich & Bold" — this was already corrected in item #13's
     `showQuizResult()` label map (now "Light/Medium/Dark Roast"); re-verified here
     since it lives in the same function this item rewrote.
  6. **Buttons**: replaced "Show my matches" / "Save this profile to my account"
     with the two requested buttons, **Show my matches** and **Show me everything**.
     Both now route through the sign-in/create-account modal first (`chooseQuizMatches()`
     / `chooseQuizEverything()` set a `pendingQuizAction` flag, close the quiz, and
     open sign-in) so we attempt to capture the taste profile into the account either
     way, per "capture the user in a profile, if at all possible":
     - On successful sign-in: the taste profile is always saved (`applyProfileAndClose()`
       for Matches; `captureQuizProfile()` for Everything, which saves the profile
       *without* applying it as the live Shop filter).
     - If the customer closes the sign-in modal without signing in (✕ button, **or now
       the overlay-click — fixed 2026-07-04**, see below), the chosen browsing action
       still runs as a guest — no profile is captured, but they aren't stranded on an
       empty screen.
     - **Overlay-click gap — fixed 2026-07-04.** Previously, clicking the dark overlay
       outside a modal closed it via a generic handler in `boot()` that just toggled
       the `active` class directly, bypassing `closeSignin()`/`closeQuiz()` entirely —
       so dismissing the sign-in modal that way skipped the guest-fallback. The
       handler now checks which modal it is and calls the modal's own close function
       (`closeSignin()` for `#signin-modal`, `closeQuiz()` for `#quiz-modal`), so every
       dismissal path behaves consistently.
  7. **Back link**: added a "Back" text link (styled with the existing `.skip-link`
     class) below the two buttons on the results screen, wired to `nextStep(3)` so
     the customer can regress to Q3 and change an answer. Quiz answers persist
     across steps already (`closeQuiz()` never resets `quizAnswers`), so no data is
     lost.
  8. **"In bocca al lupo"** kept as the fixed greeting line above the persona name
     across all outcomes — no change needed, this was already the case; confirming
     per Steve's explicit instruction to keep it fixed rather than per-persona.
- **Not verified in browser** — same as items #13-14; JS was checked with `node -c`
  for syntax only.

### 17. Open item to log — persona matrix covers only Q1 × Q2; Q3 will require expanding to a three-key lookup
- **Status:** needs decision (deferred — flagged per Steve's explicit request)
- **Detail:** `PERSONA_MATRIX` in `assets/ci-storefront.js` is a two-key lookup
  (roast × flavor-or-skip) by design, specifically so a future Q3 can be added as a
  third key without restructuring — but Q3's content is still undefined on Steve's
  end as of this session. When Q3 is defined, the matrix needs to expand to a
  three-key lookup (and the sparse-cell/skip logic re-examined for how it interacts
  with the new axis), not be retrofitted with more ad hoc branches.

---

## About page

### 18. About page restructure — Company/Founder split, team section, partners section
- **Status:** done (implemented in code; `CLAUDE.md`/decision-log write-up held until
  Steve says the batch is ready) — **copy is provisional**, awaiting Steve's language
- **Where:** `templates/index.liquid` `#page-about` (~line 269-306);
  `assets/ci-storefront.css` (new `.people-grid` / `.person-photo` / `.person-card`
  rules, ~line 240-244).
- **Changes made:**
  1. Hero line: `"A Florida importer and curator of specialty Italian coffee. Not a
     roaster."` → `"A Florida based importer and curator..."`.
  2. Split the single "Steve — Founder" tile into two separate tiles, each with its
     own photo placeholder, under a `.section-head` (eyebrow + h2) matching the
     site's existing section-divider convention:
     - **"Our company"** (eyebrow `"Chi siamo"`) — kept the existing company/model
       copy ("Crema Italia, LLC imports...", "Curated, never aggregated", "The first
       sale is an introduction") here since it's company-level content, not
       founder-specific.
     - **"Our founder"** (eyebrow `"Il nostro fondatore"`) — kept the "Steve /
       Founder" photo placeholder; body copy is a `<em>Founder bio — copy
       pending.</em>` placeholder since Steve is writing new language for both tiles.
  3. Added a **team section**: `.section-head` with eyebrow `"La nostra squadra
     eccellente"` and h2 `"Our excellent team members"`, followed by a
     `.people-grid` of three photo+name cards: Lucia Calo', Asia Chirdo, Lauren
     Roberts. No role/title/bio text was supplied, so cards currently show name
     only — a placeholder photo tile stands in for a real headshot.
  4. Added a **partners section**: `.section-head` with eyebrow `"I nostri
     partner"` and h2 `"Our partners"`, followed by one `.people-grid` card,
     "Partner 1", as the holding block.
  5. **No separate "divider" element was added** — the existing `.section-head`
     component (used everywhere else on the site to break up sections) already
     renders a hairline top-border + margin, which serves as the divider. Used that
     instead of introducing a new divider component, to stay consistent with the
     rest of the site.
  6. **Design call on the Italian/English heading pairing** (flagging for
     confirmation): you described this as "a section La nostra squadra eccellente,
     with a sub-heading Our excellent team members" — Italian first, English
     second. I implemented it as the existing `eyebrow` (small, uppercase-tracked)
     + `h2` (large) pattern already used elsewhere on the site — Italian in the
     eyebrow, English in the larger h2 — rather than making the Italian phrase the
     large/prominent text. Two reasons: (a) it matches the precedent you set
     earlier this session on the Roasters page (Italian eyebrow "GRUPPO
     D'ECCELLENZA" above the English h1), and (b) `CLAUDE.md` §3.3 notes Marcellus
     (the current display font) is roman-only — no real italic face — so the brand
     standard moved *away* from italicizing Italian display headings and uses the
     eyebrow label as the EN/IT cue instead. **Confirmed 2026-07-04 — Steve: "keep
     per recommendation."** No code change; eyebrow-Italian/h2-English stands as
     implemented.
  7. Both new sections (team, partners) are marked with a `PROD:` comment noting
     they're static placeholder lists that should become an admin-managed
     collection/metafield once real team/partner data exists — matching how the
     rest of POC3 flags its production seams.
- **Not verified in browser** — same as items #13-14, #16.

---

## Done (pending Steve's confirm)

_(none yet)_

---

## Verified (confirmed by Steve in preview)

_(none yet)_
