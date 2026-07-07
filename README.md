# cremaitalia-shopify

Shopify theme source for [cremaitalia.com](https://www.cremaitalia.com).
Crema Italia, LLC. Lutz, Florida, USA.

## What this repo is

This is the local source of truth for the Crema Italia Shopify theme.
The brand is a small selective importer of artisan Italian roasted coffee beans.
The store is currently in pre-launch with a coming-soon landing page live.

## Quick start

```bash
# Make sure you have the prerequisites
node --version       # should print something
npm --version        # should print something
git --version        # should print something
shopify version      # should print Shopify CLI version

# Pull the current live theme into this directory
shopify theme pull

# Run the local dev server (opens a localhost URL with live reload)
shopify theme dev

# After editing, commit the working state
git add -A
git commit -m "Describe what changed"

# Push to GitHub backup
git push

# Deploy to the live store
shopify theme push
```

## Working with Claude Code

This repo is set up to be used with [Claude Code](https://docs.claude.com/en/docs/claude-code).
Run `claude` in this directory to start a session. The agent will automatically
load `CLAUDE.md` as project memory — that file contains brand standards,
conventions, "never do this" rules, and the architectural decisions log.

When you make a meaningful decision (a feature choice, a naming convention,
an architectural pattern), ask Claude to log it in the `Architectural decisions log`
section of `CLAUDE.md`, or do it yourself. Future sessions will then know.

## Brand reference

The canonical brand standards live outside this repo, in the OneDrive operations folder:
- `C:\Users\marvi\OneDrive\Pre-Vault\CremaItalia LLC\Brand and Marketing\Crema_Italia_Brand_Standards.pdf`
- `C:\Users\marvi\OneDrive\Pre-Vault\CremaItalia LLC\Brand and Marketing\Logo Assets\`

## Repo structure

After running `shopify theme pull`, the Shopify-standard structure appears:

```
.
├── assets/         # Images, CSS, JS used by the theme
├── config/         # Theme settings (settings_schema.json, settings_data.json)
├── layout/         # Top-level page templates (theme.liquid)
├── locales/        # Translation files (en.default.json, etc.)
├── sections/       # Reusable page sections (hero, footer, etc.)
├── snippets/       # Smaller reusable bits of Liquid
├── templates/      # Page templates (index.json, product.json, page.coming-soon.json)
├── live-theme/     # Source for the LIVE theme's own homepage/layout (separate from
│                   #   templates/index.liquid + layout/theme.liquid above, which are
│                   #   the POC's SPA files — see CLAUDE.md §9, 2026-07-07 entry)
├── CLAUDE.md       # Project memory — read by Claude Code on every session
├── README.md       # This file
└── .gitignore
```

## License

Proprietary. © Crema Italia, LLC. All rights reserved.
