---
title: Introduction
description: Build a static documentation site from Markdown and one configuration file.
order: 0
---

## Start here

Monoline Docs turns a folder of Markdown and MDX into a static website. Navigation,
headings, and page links come from the same content, so updating a page does not
require editing the website layout.

> [!NOTE]
> `@chitrank2050/monoline-docs` is prepared but not published yet. These
> instructions use the workspace package until the first npm release.

## Initialize a standalone site

Install the package from a locally packed tarball while it is unpublished:

```sh
npm install /path/to/monoline-docs.tgz
npx monoline-docs init
npm run dev
```

With pnpm, use `pnpm add /path/to/monoline-docs.tgz`, `pnpm exec monoline-docs init`
and `pnpm dev`. The initializer adds `monoline-docs.yml`, `content/index.md` and
`build`/`dev` scripts. It preserves existing package metadata and dependencies,
and refuses conflicting scripts, configuration files or homepages. It never
installs packages or fetches content itself.

For an empty directory, run the installed CLI's `init` command from that directory,
then install the package before using the generated scripts. Until publication,
replace its registry dependency with the local tarball.

## Run this documentation locally

Use Node.js 24.14.0 or newer and the pnpm version declared in the repository's
`packageManager` field. From the repository root:

```sh
pnpm install
pnpm --filter @monoline/docs-demo dev
```

Open the address printed by the preview server. Edit files in
`apps/docs-demo/content`; the preview rebuilds and reloads when content or assets
change. Restart it after changing `apps/docs-demo/monoline-docs.yml`.

To produce static output:

```sh
pnpm --filter @monoline/docs-demo build
```

The demo scripts build the package first. Generated files go to
`apps/docs-demo/dist`; the preview server is not a production server.

## Make it yours

1. Set the site title and paths in the [configuration](configuration.md).
2. Add Markdown pages using the [writing guide](writing.md).
3. Arrange the sidebar with [navigation](navigation.md).
4. Adjust [appearance and assets](appearance.md), then [deploy](deployment.md).

The hosted documentation uses the demo's content directory. Repository maintainer
documents are not automatically included in your site.

## What works today

- YAML frontmatter with titles, stable slugs, drafts and per-page visibility controls.
- Generated navigation, nested groups or sections with previous and next links.
- Tables, code fences, links, and a heading-based table of contents.
- Note, tip, warning, and caution callouts.
- Local images, downloads, fonts, and optional custom CSS.
- Persisted light, dark, and system themes.
- Highlighted code blocks with keyboard-accessible copy buttons.
- Local preview that watches content, assets, and imported local components.
- Static MDX components, with opt-in React 19 islands for interactive examples.
- Static builds for a root domain or a repository subpath.
- [Local search](search.md) across published page titles, headings, and text.
- [Authoring components](components.mdx), synchronized package commands and library references.
- [Local OpenAPI references](configuration.md#local-openapi-reference).
- Canonical/social metadata, structured data, Markdown exports and AI indexes.

## Current boundaries

Use Markdown for ordinary pages and MDX when a page imports a component. React
hydration is opt-in. Tabs and package-manager groups enhance static content.
Raw HTML in `.md` files is displayed as text. There is one built-in design with
CSS customization, not a theme marketplace.

If a build stops, use [troubleshooting](troubleshooting.md) to check the reported
file, route, or configuration setting.
