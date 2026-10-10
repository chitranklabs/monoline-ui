# Monoline Docs

Build static documentation from Markdown and MDX with Monoline's accessible,
minimal interface. The generated site includes navigation, local search,
light and dark modes, heading links, code highlighting, and an optional React
island integration.

## Installation

> [!IMPORTANT]
> The package is not published yet. Use a locally built tarball while evaluating
> it; installing the registry name is available after the first release.

From a Monoline repository checkout, install dependencies, build Docs and pack it:

```sh
pnpm install
pnpm --filter @chitrank2050/monoline-docs build
npm pack ./packages/docs --ignore-scripts
```

`npm pack` writes a `.tgz` file into the repository root and prints its filename.
Use that actual filename in the next command; it includes the package version
and changes with releases. Create or open a separate project directory outside
this repository, then install using the absolute path to that file:

```sh
npm install /absolute/path/to/the-generated-package.tgz
npx monoline-docs init
npm run dev
```

For pnpm, use `pnpm add /absolute/path/to/the-generated-package.tgz`,
`pnpm exec monoline-docs init` and `pnpm dev`. Open the address printed by the
preview server and edit `content/index.md` to see your first content change.

`init` creates `monoline-docs.yml`, `content/index.md` and build/dev scripts. It
preserves existing package metadata and dependencies and refuses conflicts. It
does not install dependencies. To explore the existing consumer instead, follow
[the Docs demo setup](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/README.md).

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

## Using with AI agents

The package includes an [authoring skill](skills/monoline-docs/SKILL.md) at
`skills/monoline-docs/SKILL.md`. Ask your agent to read the installed file, or copy
the skill folder into its supported skills directory. Package installation does
not automatically enable it. Keep copied skills aligned with the installed
package version.

Supply the relevant page Markdown exports or discover them through `llms.txt`;
`llms-full.txt` combines the reference when a task needs it. The skill describes
the authoring workflow, while exports provide reference material. Both should be
used alongside the project's actual source and package scripts.

## Configuration editor support

`monoline-docs init` adds a YAML language-server hint pointing to the schema
shipped with your installed package. Existing root-level configurations can add:

```yaml
# yaml-language-server: $schema=./node_modules/@chitrank2050/monoline-docs/schema.json
title: Documentation
```

Use a YAML editor with JSON Schema support; adjust the relative path for nested
configuration files. The schema provides completion and structural diagnostics.
Runtime validation remains authoritative for paths, URLs, aliases and content.
The schema is also exported as `@chitrank2050/monoline-docs/schema.json`.

See [migration guidance](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-migration.md) before replacing an existing
site, especially when public URLs change.

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
Markdown pages export their authored body. MDX pages export static rendered content
as Markdown, preserving headings, code fences, links, lists and tables. Preview
source is included once; interface controls and interactive islands are omitted.
Exports are reading formats, not a round-trip replacement for authored MDX.

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

## Component examples

`Preview` ships the rendered example and expandable source presentation. No
consumer stylesheet or JavaScript is required for source disclosure.

```mdx
import Preview from "@chitrank2050/monoline-docs/components/Preview.astro"

<Preview
	title="Example"
	source={"<p>Hello</p>"}
	language="astro"
	showCaption={false}
>
	<p>Hello</p>
</Preview>
```

`Table` is available from `components/Table.astro`. Supply `caption`, `columns`
(with `key`, `label` and optional `format: "code"`) and record-based `rows`.
Use `variant="compact"` for reduced cell padding or `variant="reference"` for
technical reference tables. Props use a Default column; type fields use a
Required column, with the same reference presentation. `Table` is the single
public table component.

`Button` is also available from `components/Button.astro`, with `variant="primary"`
(the default), `variant="outline"` and `variant="ghost"`. Use `size="icon"` with an
`aria-label` for icon controls, and `href` for links. Native button attributes,
including `type`, pass through. Use `leadingIcon` and
`trailingIcon` slots for decorative icons in any variant. The shell uses Button
for Copy Page and previous/next navigation.

The caption is visible by default. When hidden, `title` supplies the frame's
accessible name. Use either `source` or the existing `code` slot. Source of up to four lines appears in full without a fade or View code control.
Longer source expands and scrolls within the frame; copy is available when JavaScript is enabled.

## Requirements

See [support and limitations](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/support.md)
and the [release/recovery guide](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-release.md)
for the verified release boundaries.

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

See the [getting started guide](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/getting-started.mdx)
and [deployment recipes](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-deployment.md)
until the standalone documentation site is published.

Package priorities and remaining release gates are tracked in the [Docs roadmap](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/ROADMAP.md).

Licensed under MIT.
