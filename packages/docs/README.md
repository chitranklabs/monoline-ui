# Monoline Docs

Build static documentation from Markdown and MDX with Monoline's accessible,
minimal interface. The generated site includes navigation, local search,
light and dark modes, heading links, code highlighting, and an optional React
island integration.

## Installation

```sh
pnpm add @chitrank2050/monoline-docs
```

Create `monoline-docs.yml`:

```yaml
title: Team handbook
site: https://docs.example.com
```

Add `content/index.md`, then define the package commands:

```json
{
	"scripts": {
		"build": "monoline-docs build",
		"dev": "monoline-docs dev"
	}
}
```

Run `pnpm dev` while writing. Run `pnpm build` to create the static `dist`
directory for Vercel, Netlify, GitHub Pages, or another static host.

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
Dates require `updatedAt` frontmatter. Copying means the current page URL,
including its fragment; Markdown export is separate work.

Header links accept documentation routes or absolute HTTP(S) URLs. Favicon
files accept SVG, PNG or ICO. Fonts accept local WOFF2, WOFF, TTF or OTF assets;
font family names use letters, numbers, spaces or hyphens. Local fonts use
`font-display: optional` to avoid late font swaps; a slow first visit may use
the fallback. Fonts are never fetched remotely by configuration. Custom CSS
loads after generated tokens, so existing stylesheet overrides still work.

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
