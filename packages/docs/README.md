# Monoline Docs

Build static documentation from Markdown and MDX with Monoline's accessible,
minimal interface. The generated site includes navigation, local search,
light and dark modes, heading links, code highlighting, and an optional React
island integration.

## Installation

```sh
pnpm add @chitrank2050/monoline-docs
pnpm exec monoline-docs init
pnpm dev
```

The package is not published yet. Until its first release, install a locally
packed tarball instead of the registry name. `init` creates `monoline-docs.yml`,
`content/index.md` and build/dev scripts; it preserves existing package metadata
and dependencies and refuses conflicts. It does not install dependencies.

Set your publishing origin in the generated `monoline-docs.yml`:

```yaml
title: Team handbook
site: https://docs.example.com
```

The generated package commands are:

```json
{
	"scripts": {
		"build": "monoline-docs build",
		"dev": "monoline-docs dev"
	}
}
```

Run `pnpm dev` while writing. Run `pnpm build` to create the static `dist`
directory for Vercel, Netlify, GitHub Pages, Cloudflare Pages or another static host.
Optional root/subpath recipes ship in `templates`. A URL `base` does not move files
into a subdirectory; use the recipe's output layout or a host-provided mount.

## Shell configuration

```yaml
assetsDirectory: ./assets
branding:
  favicon: /assets/favicon.svg
appearance:
  density: comfortable # or compact
  radius: 0.375 # rem, from 0 to 1
  accent:
    light: "#753c22"
    dark: "#e9b894"
  fonts:
    body:
      family: Georgia # installed font; falls back to system-ui
    code:
      family: Local Code
      src: /assets/code.woff2
header:
  primaryAction:
    label: Get started
    href: /guide
  announcement:
    text: SDK 1.0 is available.
    href: https://example.com/releases
sidebar:
  enabled: true
content:
  showLastUpdated: true
  copyPageLink: true
```

Density defaults to `comfortable`; sidebar, last-updated dates and copy-link
controls default to enabled. Page `sidebar: false` still hides its sidebar.
Dates require `updatedAt` frontmatter. Copying the page link uses the current
URL, including its fragment. Copy Markdown reads the generated export.

Header links accept documentation routes or absolute HTTP(S) URLs. Favicon
files accept SVG, PNG or ICO. Fonts accept local WOFF2, WOFF, TTF or OTF assets;
font family names use letters, numbers, spaces or hyphens. Local fonts use
`font-display: optional` to avoid late font swaps; a slow first visit may use
the fallback. Fonts are never fetched remotely by configuration. Custom CSS
loads after generated tokens, so existing stylesheet overrides still work.

## Discovery and integrations

Search loads its local index when opened. Readers can scope results to guides or
API references; recent queries stay in local browser storage when available.
`search: false` in page frontmatter removes that page from search, while
`noindex: true` removes it from search, the sitemap, Markdown export and AI indexes.
Production drafts are absent from all generated output. Published pages include
a Markdown copy action, and the build emits `llms.txt` and `llms-full.txt`.
The AI indexes are omitted when site indexing is disabled or in development.
Markdown pages export their authored body; MDX pages export readable rendered
text, without interactive island content or code block formatting.

Set `site` to emit canonical URLs and a sitemap. Optional metadata and scripts
are explicit:

```yaml
site: https://docs.example.com
seo:
  titleTemplate: "%s | Team handbook"
  socialImage: /assets/social.png
integrations:
  scripts:
    - /assets/analytics.js
```

The social image must be a local PNG, JPEG or WebP asset; without `site`, no
absolute social image URL is emitted. Integration scripts must be local
`/assets/*.js` files or HTTPS URLs. They load only when configured. Script
content and external providers are trusted author choices.

## Requirements

- Node.js 24.14 or newer.
- React 19 and React DOM 19 only when using hydrated React examples.
- A published `content/index.md` or `content/index.mdx` homepage.

The CLI uses directory URLs by default. Set `cleanUrls: true` when a host serves
extensionless routes from flat `.html` files.

## Package entry points

- `@chitrank2050/monoline-docs` for configuration and content utilities.
- `@chitrank2050/monoline-docs/build` for programmatic production builds.
- `@chitrank2050/monoline-docs/dev` for the local preview server.
- `@chitrank2050/monoline-docs/components/*.astro` for authoring components.

See the [prototype documentation](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-prototype.md)
and [deployment recipes](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-deployment.md)
until the standalone documentation site is published.

Licensed under MIT.
