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
