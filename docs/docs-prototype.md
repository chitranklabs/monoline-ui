# Monoline Docs prototype

The private `@monoline/docs` package now connects content discovery and navigation
to a runnable static Markdown site. This validates the authoring and deployment
flow before integrating the approved Astro engine and MDX support. The current
implementation remains the Markdown builder; see the
[integration design](./superpowers/specs/2026-09-14-docs-astro-engine-design.md)
for the proposed migration boundaries and acceptance gates.

## Internal Astro foundation

The staged engine now shares the existing renderer's heading IDs, page-link
resolution, and local-asset rules. Markdown and MDX preserve Unicode and duplicate
heading anchors, reserve `content` for the shell, and resolve source-file links
under the configured base path. Local assets are copied only into staging.
Rendered component links and fragment validation, TOC/search extraction, the
themed shell, and final-output promotion remain part of the next parity work.

The package now contains an internal, staged Astro renderer for Markdown and
MDX. It is not selected by the public CLI or build API yet: the current commands
still use the existing renderer until link, search, theme, and output-promotion
parity is verified.

```sh
pnpm --filter @monoline/docs test:engine
pnpm --filter @monoline/docs test:consumer
```

The engine check renders Markdown and MDX with a local static component, verifies
that ordinary pages have no scripts, ignores consumer Astro configuration/pages,
checks draft filtering and compilation failures, and removes its owned temporary
output. The consumer check also exercises this renderer from the packed package
using its existing isolated installation. No extra CI job or second installation
is needed.

The engine uses Astro's native Markdown processor to preserve escaped HTML and
the existing single-H1 policy. Only validated Monoline page metadata participates
in rendering; unknown Markdown `layout` fields do not select executable layouts.
Runtime `.astro` files ship with the compiled package. The renderer is internal,
not an additional supported package export or public engine-selection setting.

## Run

Use Node 24.14 or newer and the repository's pinned pnpm version.

```sh
pnpm install --frozen-lockfile
pnpm --filter @monoline/docs-demo dev
```

Open the printed preview URL. The server binds to `127.0.0.1:4321` and watches
content and assets. Successful rebuilds reload the browser. Invalid content
shows an error banner while retaining the previous generated pages. Fixing the
content rebuilds and reloads the page. Drafts are visible in the local preview.

The demo sources live in `apps/docs-demo/content`, with assets in
`apps/docs-demo/assets`. Both commands use `apps/docs-demo/config.mjs`. Restart
the preview after changing configuration or package source; those files are not
hot-reloaded. Stop the server with Ctrl+C.

For production, run `pnpm --filter @monoline/docs-demo build`. This excludes
drafts, removes obsolete generated files, and writes the static site to
`apps/docs-demo/dist`. Run it again after previewing and before deployment.

## Configuration and standalone commands

`defineConfig` is the shared contract for the CLI, build API, and preview API.
It validates configuration at runtime, including unknown keys, URL protocols,
navigation shape, language tags, and logo dimensions. Defaults apply without
changing the supplied object. Only the title is required.

The package remains private. Build it with `pnpm --filter @monoline/docs build`
before using its compiled exports. The demo commands do this automatically.
`pnpm --filter @monoline/docs test:consumer` packs it and installs the artifact
into a temporary project outside the workspace, then checks its CLI, declarations,
static output, and preview. Installation requires registry access; lifecycle
scripts are disabled. No publishing occurs.

The recommended configuration file is `monoline-docs.yml`. `.yaml` is also
supported. `loadConfig()` discovers exactly one supported file and passes it
through `defineConfig`; it never silently merges multiple files. YAML rejects
duplicate keys, multiple documents, and executable tags.

```yaml
title: Team handbook
site: https://docs.example.com
defaultMode: system
assetsDirectory: ./assets
stylesheet: /assets/custom.css
```

For executable configuration, use `monoline-docs.config.mjs` instead:

```js
import { defineConfig } from "@monoline/docs"

export default defineConfig({
	title: "Team handbook",
	description: "How our team builds and operates its services.",
	site: "https://docs.example.com",
	base: "/",
	lang: "en",
	contentDirectory: "./content",
	outDirectory: "./dist",
	assetsDirectory: "./assets",
	stylesheet: "/assets/custom.css",
	defaultMode: "system",
	headerLinks: [
		{ label: "Source", href: "https://github.com/example/handbook" },
	],
})
```

Create `content/index.md`, your assets folder, and the referenced stylesheet.
Run `monoline-docs dev` or `monoline-docs build` through your package manager or
package scripts. `--config path/to/config.mjs` selects a different config file;
`dev --port 4322` changes the preview port. CLI paths resolve relative to the
configuration file, even when invoked from another directory. Programmatic API
paths remain relative to the caller's working directory.

Module configuration is trusted executable JavaScript, not a sandbox for untrusted
authors. YAML configuration is data-only, without environment interpolation.
Changes to configuration require restarting preview. The CLI always builds for
production and previews for development. `--site`, `--base`, and `--indexing
true|false` override deployment settings without editing YAML. Hosted preview builds
use `--indexing false`, not development mode, so drafts stay excluded.

The demo reads `monoline-docs.yml` through its `config.mjs` bridge. That bridge
supports `DOCS_SITE`, `DOCS_BASE`, and `DOCS_INDEXING` for its monorepo build scripts.
See [deployment recipes](./docs-deployment.md) for standalone and monorepo setup.

Optional `logo` takes `src`, `alt`, `width`, and `height`. Its source must be an
existing local `/assets/` image. Dimensions reserve space before loading.
`headerLinks` accepts labeled absolute HTTP(S) URLs, not HTML or icon markup.
`navigation` retains the existing route/group structure.

## Package boundary

The existing package entry exposes discovery, metadata, navigation, and lookup.
The separate `@monoline/docs/build` entry exposes `buildDocs`. It takes a title,
content directory, output directory, optional description, optional navigation,
and an optional base directory such as `/project/`. The `@monoline/docs/dev`
entry exposes `startDevServer(options, port)`, using the same build options.

The builder uses Markdown-it with raw HTML disabled. Titles and navigation labels
are escaped. It validates internal page and heading links before writing files.
The site requires a published `index.md` homepage. Only published Markdown pages
enter the generated site. File names must use
letters, numbers, hyphens, or underscores.

The responsive shell follows the existing Monoline website's sidebar/content/TOC
layout. Reading and navigation work without JavaScript. Small client scripts add
theme selection and copy buttons. React components are not hydrated.

## Assets and fonts

Set `assetsDirectory` to a dedicated folder. Its files are copied beneath
`assets/`, preserving subdirectories and binary contents. Use `/assets/logo.svg`
in Markdown image references and `/assets/guide.pdf` for downloads. The builder
checks those references and adds the deployment base. Hidden files are ignored;
unsupported file types and child symlinks are rejected.

For fonts or custom styles, put a CSS file in that folder and set `stylesheet`
to its URL, for example `/assets/site.css`. Use relative CSS URLs such as
`url("fonts/body.woff2")` so font loading also works under a subpath. CSS is
copied unchanged: references inside CSS are the author's responsibility, rather
than checked by the Markdown link validator.

## Supported customization

Monoline supplies one design with light, dark, and system modes. Additional
presets are deferred. User CSS loads after defaults, including on the 404 page.
Use these supported custom properties rather than internal HTML selectors:

| Area       | Variables                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------- |
| Colors     | `--background`, `--foreground`, `--muted-foreground`, `--border`, `--surface`, `--accent` |
| Typography | `--font-body`, `--font-code`, `--line-height`                                             |
| Shape      | `--radius`                                                                                |
| Layout     | `--content-width`, `--page-width`, `--sidebar-width`, `--content-padding`                 |

For separate light and dark colors, use `light-dark()` in a root override. It
respects the selected mode and system preference without duplicate selectors:

```css
:root {
	--background: light-dark(#fff, #171717);
	--foreground: light-dark(#202020, #f5f5f5);
	--accent: light-dark(#185abd, #9ac5ff);
	--font-body: "Docs Body", system-ui, sans-serif;
	--radius: 0.375rem;
	--content-width: 70ch;
}
```

Custom styles are trusted author input. Authors must verify contrast, font
licensing, and responsive layout after overrides. The shell uses modern CSS
including `light-dark()` and native dialogs; legacy browser support is not
promised. This is not a component replacement or plugin API.

## Theme and code controls

`defaultMode` selects the initial mode, including without JavaScript. The header
offers light, dark, and system modes. Explicit choices persist in
local storage; the stored choice is applied before styles load. With storage
disabled, selection still works for the current page. System mode follows the
browser's color-scheme preference. Semantic colors match Monoline UI's tokens;
extracting a shared token package remains separate work.

Prism highlights code at build time, with no highlighter shipped to the browser.
Supported grammars include HTML, CSS, JavaScript, TypeScript, TSX, Bash, JSON,
YAML, and SQL. Unknown languages remain escaped plain text. Copy buttons copy
the original code text and announce success or clipboard errors. They remain
hidden if the Clipboard API is unavailable.

## Output ownership

Use a dedicated output directory. The builder records generated files, removes
obsolete recorded files on subsequent builds, and refuses nonempty unmanaged
directories. The output directory must be separate from both content and assets.
Build completion
must precede deployment; output replacement is not atomic.

## Static search

Search loads a local JSON index only when opened. It searches page titles,
headings, descriptions, and prose, with title and heading matches ranked first.
All query terms must match; matching ignores case and normalizes Unicode.
Code fences are excluded to avoid noisy results. Results link to the generated
heading IDs and respect the deployment base path.

The native dialog supports Escape, Tab, and arrow-key result navigation, with
focus restored to the search button when closed. Loading, empty, and failure
states are announced. Reopen after a loading failure to retry. Navigation remains
available without JavaScript.

Production drafts never enter the index; preview rebuilds refresh it alongside
the pages. Search runs locally with no hosted service or analytics. This initial
implementation scans the index and displays up to 20 results. It does not offer
typo tolerance or language-specific stemming; measure larger documentation sets
before replacing it with a dedicated search engine.

## Deployment metadata

Set `site` to your absolute HTTP(S) origin. Paths belong in `base`, not `site`.
Production builds then emit canonical URLs and a sitemap containing published
pages only. Root deployments also receive `robots.txt`; for subpath deployments,
the origin owner manages its root robots file. Without `site`, neither canonical
URLs nor sitemap/robots files are generated. No placeholder hostname is invented.
404 pages are noindex; development pages and builds with `indexing: false` are
noindex/nofollow and have no sitemap. Indexing does not control draft filtering.
`lang` sets the HTML language tag; built-in controls remain English. It is not
full interface localization.

## Remaining work before release

- Choose and integrate an MDX compiler and its component contract.
- Verify shared token packaging.
- Verify a real static-host deployment and compatibility across target browsers.
- Measure larger sites and finish authoring features before optional MDX.

This is a private prototype, not a publishable documentation framework. It needs
no library Changeset and does not change the UI package's release contract.
