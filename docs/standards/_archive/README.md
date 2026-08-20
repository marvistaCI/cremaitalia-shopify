# `_archive/` — superseded Standard renders (HISTORICAL, do NOT use as current)

Everything in this folder is a **frozen, superseded render** of a Standard — kept as a historical
artifact, **not** authoritative. If you want the current rule, go **one level up** to
`docs/standards/` (the live Markdown source) or its current PDF render. Never quote, build to, or
hand out a file from this folder as if it were current.

## Why these are safe to commit (when the live renders aren't)

The live renders in `docs/standards/*.pdf` are **git-ignored** — they regenerate on every source edit,
so committing them would churn the repo with binary noise (see `/docs/standards/*.pdf` in `.gitignore`).
Files in **this subfolder are different**: a superseded version never changes again, so it is written
once and frozen. Committing frozen archives gives us a durable, backed-up, browseable record of what a
Standard said at each version, without reintroducing churn. The `.gitignore` rule is folder-anchored
(`*` doesn't cross `/`), so `_archive/*.pdf` is tracked while the live renders stay ignored.

> The **real** version history is always the versioned Markdown source in git (`git log` on the `.md`).
> Any old render here can be reproduced from the source at that commit — these PDFs are a convenience
> archive, not the source of truth.

## The convention (follow this every time a Standard is superseded)

When a Standard is bumped to a new version:
1. Render the new current PDF one level up (`py docs/standards/render.py <standard>.md "<Name>_vX.Y.pdf"`).
2. **Move the previous render here** and add the `_ARCHIVED` suffix, e.g.
   `Store_Operating_Standards_v1.1.pdf` → `_archive/Store_Operating_Standards_v1.1_ARCHIVED.pdf`.
3. Add a line to the **Archived renders** log below (what was superseded, by what, when, why).
4. Commit the archived PDF + this README update. The live render stays git-ignored.

## Archived renders

| Archived file | Superseded by | Date | Why |
|---|---|---|---|
| `Store_Operating_Standards_v1.1_ARCHIVED.pdf` | Store Operating Standards **v1.2** | 2026-07-13 | v1.2 replaced additive discount stacking with the no-stacking, highest-wins (`MAX`) model, split the delivery mechanism, marked Referral TBD, and retired the Sorpresa 250g/O250g matrix cells. v1.1's discount section is now wrong. See `CLAUDE.md` §9 (2026-07-13) and Store Operating Standards §3. |
| `Crema_Italia_Brand_Standards_v2.0_ARCHIVED.pdf` | Brand Standards **v2.1** | 2026-07-14 | v2.1 added the no-em-dash customer-facing voice rule (copy-only minor bump; color/type/logo unchanged). See `CLAUDE.md` §9 (2026-07-14) and Brand Standards §9 (Voice). |
| `Collaboration_Standard_v1.0_ARCHIVED.pdf` | Collaboration Standard **v1.1** | 2026-07-14 | v1.1 added §9 (Render distribution & the trust certificate) — the `Standards\` render folder, Code-produces-and-delivers rule, and the `RENDER_TRUST.md` badge. §1–§8 unchanged. See `CLAUDE.md` §9 (2026-07-14) and Collaboration Standard §9. |
| `Store_Operating_Standards_v1.2_ARCHIVED.pdf` | Store Operating Standards **v1.3** | 2026-07-25 | v1.3 retired §10's unachievable "No visible promo-code field at checkout" (the field cannot be hidden below Shopify Plus; Plus declined at ~$24k/yr for one field) and replaced it with the no-discount-codes policy — every discount computed server-side, nothing to type, nothing to leak. This also **supersedes v1.2 §3's "campaign discounts apply via URL parameter or personalized email link,"** which would have issued real, leakable Shopify codes. v1.2's §3 delivery mechanism and §10 exclusion are now wrong. See `CLAUDE.md` §9 (2026-07-25) and Store Operating Standards §3, §10, §11, §12.7–12.8. |
| `Store_Operating_Standards_v1.3_ARCHIVED.pdf` | Store Operating Standards **v1.4** | 2026-08-19 | v1.4 is a vocabulary correction with no rule change: "Tour" was being used as the name of the archetype ("Tour / bundle pricing", "Tours / bundles — the BOM model", "Sorpresa ships only as Tours") when it is a **SKU name**. The archetype is a **collection** — `Decaf Collection 1` and `Roaster's Favorites 2` are the same thing as `Tour d'Italia 1`. New §1.1 states the rule. Pricing factors, matrices and every other rule are unchanged, so v1.3 is wrong only in its vocabulary. See `CLAUDE.md` §9 (2026-08-19) and Store Operating Standards §1.1, §2.3, §7. |
| `Store_Operating_Standards_v1.4_ARCHIVED.pdf` | Store Operating Standards **v1.5** | 2026-08-19 | v1.5 adds **§8.1 — nothing inside a package shows a price**, gift or not, with the receipt as an email entitlement; **§8.2 Gifting** (order-level only, never inferred from a differing shipping address, subscriptions excluded); and open decisions **§12.9** (who holds the Founding Member slot if a gift subscription is ever sold) and **§12.10** (the two qualifying 3PL questions). Nothing is repriced, so v1.4 is incomplete rather than wrong. See `CLAUDE.md` §9 (2026-08-19). |
| `Store_Operating_Standards_v1.5_ARCHIVED.pdf` | Store Operating Standards **v1.6** | 2026-08-19 | v1.6 removes the §12.9 that v1.5 had opened hours earlier, asking who would hold the Founding Member slot if a gift subscription were sold. Steve pointed out §8.2 already says subscriptions cannot be gifted — that **is** the decision, and parking entitlement rules for a product we declined to build put speculative scope into a list meant for items that must close before the production build. §8.2 now states the rule without deferring anything; the 3PL item renumbers to §12.9. Nothing else changed, so v1.5 is over-scoped rather than wrong. |
| `Store_Operating_Standards_v1.6_ARCHIVED.pdf` | Store Operating Standards **v1.7** | 2026-08-20 | v1.7 is an editorial repair with no rule change and no renumbering: §12.9 (the 3PL packing-slip and insert question) had been appended *after* the document's own closing citation block, so the render showed an "end of Standard" stamp followed by more Standard. It is now item 9 of the §12 numbered list, matching items 1-8, and the citation closes the file. The item's text is unchanged, so v1.6 is misordered rather than wrong. Bumped rather than silently re-rendered because a same-version content edit is the one drift no version-stamp check can see (the `f9ffcb1` incident, 2026-08-04). Raised by the coordinator. |
