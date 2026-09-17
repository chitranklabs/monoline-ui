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
> `@monoline/docs` is a private, unreleased workspace package. These instructions
> use this repository; there is no public npm or JSR installation to follow yet.

## Run the documentation locally

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

- YAML frontmatter with a required title and optional description, order, and draft.
- Generated navigation or explicit groups with previous and next links.
- Tables, code fences, links, and a heading-based table of contents.
- Note, tip, warning, and caution callouts.
- Local images, downloads, fonts, and optional custom CSS.
- Persisted light, dark, and system themes.
- Highlighted code blocks with keyboard-accessible copy buttons.
- Local preview that watches content, assets, and imported local components.
- Static MDX components, with opt-in React 19 islands for interactive examples.
- Static builds for a root domain or a repository subpath.
- [Local search](search.md) across published page titles, headings, and text.

## Current boundaries

Use Markdown for ordinary pages and MDX when a page imports a component. React
hydration is opt-in; interactive tabs and a component catalog are not built in.
Raw HTML in `.md` files is displayed as text. There is one built-in design with
CSS customization, not a theme marketplace.

If a build stops, use [troubleshooting](troubleshooting.md) to check the reported
file, route, or configuration setting.
