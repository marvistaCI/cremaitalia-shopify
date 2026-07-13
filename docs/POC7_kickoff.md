# POC7 — Kickoff prompt (next Code session)

Paste the block below to start the POC7 Code session. Focus: responsive / mobile + tablet
readiness, plus minor visual fixes. Written in Steve's voice. Add any specific visual nits to
the bracketed slot before pasting.

---

POC 7 — responsive / mobile-ready pass (+ minor visual fixes). I'm continuing work on the
Crema Italia Shopify theme (a storefront POC) in C:\Users\marvi\code\cremaitalia-shopify.
I'm Steve, the founder.

FIRST: read CLAUDE.md — start with §9's dated log (the 2026-07-13 coordinator note and the
2026-07-12 "POC6 batch" entry are the most recent state) and §10's "to resume, read in this
order." Then read docs/POC6_change_list.md (the latest batch in detail) and
docs/production_build_spec.md — especially §8, "Fully responsive — mobile & tablet
(REQUIRED)," which is the locked production requirement this POC7 pass is a mock rehearsal
for. Skim the mobile-review to-do at the bottom of §10.

Work the way the log describes: build changes as live "models" in the running preview, show
me, and commit only once I bless them; after committing, always push to GitHub (my standing
preference — don't ask first). When a batch is baked and I say so, deploy to a POC preview
theme. You have my trust on the BUILD-POC steps: use auto-accept edits and move through the
build without stopping for per-step approval — but still show me each batch (and let me test
it on my own devices) before you commit, since this pass is visual.

One-breath context: single-page-app storefront mock — templates/index.liquid (every page is a
.page block toggled by showPage()) + layout/theme.liquid (chrome), styled by
assets/ci-storefront.css, behavior in assets/ci-storefront.js, driven by the baked-in test
catalog in assets/ci-catalog.json. Chrome/header/footer/modals are in snippets/ci-*.
Cart/checkout/sign-in/Loop are mocked (search "PROD"/"LOOP" for seams).

CURRENT STATE: POC6 is committed (HEAD 3453e92), pushed to GitHub, and deployed to the
unpublished "Crema Italia POC6 Preview" theme (id 151440130217). The live published site is
still the coming-soon theme (150557294761) — untouched. Working tree is clean. The POC6
preview loads cross-device with no password gate (storefront password still OFF from
friend-testing): https://crema-italia.myshopify.com?preview_theme_id=151440130217

THE POC7 WORK:
  PRIMARY — make the POC genuinely responsive and usable on PHONE and TABLET (portrait AND
  landscape), not just desktop. Do a deliberate full-site pass. Known issues already logged
  (CLAUDE.md §10 mobile to-do + production_build_spec.md §8):
    - On mobile the header does NOT collapse — it wraps to ~3 rows (~148px tall). It likely
      wants a compact/hamburger mobile header.
    - The sticky home-jump chip bar (.home-jump, top:52px in the max-width:640px query) is
      hidden behind that tall wrapped header when scrolled.
    - The Shop and Account menus are hover-only (:hover/:focus-within) — awkward on touch
      even though the POC6 fix stopped them dying. They need a tap-first path (tap-to-toggle
      or fold into the hamburger). This is the deeper "no hover-only interactions on touch"
      requirement from spec §8.
    - Lay out and verify the POC6 additions on narrow screens: the new taste-profile ribbon
      (snippets/ci-profile-banner.liquid), the taste-console modal (snippets/ci-taste-console),
      and the Shop hero's Shelf+Region filters.
    - Touch targets >= ~44px; no reliance on hover; test portrait and landscape.
    Design each of phone / tablet / desktop deliberately — tablet (~768px+) is the easy one
    to miss because it inherits the desktop layout while being a touch device.

  SECONDARY — minor visual fixes:
    - Header tricolore: drop the 1px #333 hairline tucked under the now-1px tricolore strip
      so the header shows a single clean fine line (I was leaning yes on this in POC6).
    - Sweep the dead CSS left from the old taste UI (.taste-console + .tc-head/.tc-label/
      .tc-note/.tc-foot, .save-profile, .filter-bar, .filter-divider, .pf-hint) — unused
      since the POC6 ribbon/console redesign.
    - [Add any other specific nits here.]

ENVIRONMENT / WORKFLOW:
  - If I just rebooted or connectivity seems off, run the reconnect-check skill first.
  - Start the preview: run dev.cmd (launches `shopify theme dev` at http://127.0.0.1:9292).
    A "not a theme directory" warning is benign on Windows. .liquid/.css/.js hot-reload.
  - Verify via the browser pane (mcp__Claude_Browser__* tools). The screenshot tool has been
    unreliable this project — if it wedges, verify via the DOM with javascript_tool (read
    computed styles / geometry / text). For this pass especially, use resize_window to test
    the mobile (375x812) and tablet (768x1024) presets, and read layout geometry at each.
    I'll also test the deployed preview link on my real phone/tablet.
  - To deploy after a bake: push to a new unpublished theme and rename it to "Crema Italia
    POC7 Preview" at the same time (draft-theme naming rule in CLAUDE.md) —
    `shopify theme push --unpublished --theme "Crema Italia POC7 Preview" --json`.
  - If you hit a stale .git/index.lock, it's safe to `rm -f` it when no git process is running.

OPEN, non-urgent (not part of this batch):
  - Turn the storefront password back ON when friend-testing wraps.
  - Cowork's OneDrive region-source alignment is a Cowork follow-up, not Code's job.
  - The daily coordinator's routine was hardened 2026-07-13 (lock-free git, working-tree
    checks out of scope) — context only, nothing to do.

Start by getting the preview up and giving me a quick read on the current mobile/tablet state
(what breaks first), then we'll prioritize the fixes together.
