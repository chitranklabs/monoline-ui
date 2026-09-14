---
title: Deployment
description: Build static files for your chosen host.
order: 3
---

## Build the demo

While writing, run `pnpm --filter @monoline/docs-demo dev`. The local preview
includes drafts, rebuilds on content and asset changes, and reloads open pages.
Configuration changes require restarting the preview.

From the repository root:

```sh
pnpm --filter @monoline/docs-demo build
```

The output is in `apps/docs-demo/dist`. Upload that directory to a static host
that serves directory indexes. The generated `404.html` can be used as its error
page.

## Repository subpaths

For a site mounted at `/monoline/`, build with:

```sh
DOCS_BASE=/monoline/ pnpm --filter @monoline/docs-demo build
```

The base applies to navigation, article links, pager links, scripts, assets, and
stylesheets. The same `DOCS_BASE` setting works with the development command.

## Publishing metadata

This demo reads `monoline-docs.yml`. YAML and the optional module configuration
use the same validator and settings. In a standalone installed project, run
`monoline-docs build` through your package manager. `--config` selects a file;
`--site`, `--base`, and `--indexing true|false` override deployment settings.

Set `site` in your configuration to the deployment origin, such as
`https://docs.example.com`. Use `base` separately for a repository subpath.
With a site configured, production builds generate canonical links and a sitemap.
Root deployments also receive a robots file; an origin's owner manages that file
when the docs live under a subpath. No site URL is assumed by the demo.

Serve missing pages with an HTTP 404 response, using the generated `404.html`.
Do not configure an SPA fallback that returns the homepage for every missing URL.

## Hosted previews

For hosted previews, run a production build with indexing disabled. This emits
noindex metadata but still excludes draft content. The demo command is:

```sh
DOCS_INDEXING=false pnpm --filter @monoline/docs-demo build
```

The package includes optional Vercel, Netlify, and GitHub Pages templates. They
publish static output, not the local preview server. Configure the build command
and publish directory for your project; the monorepo demo publishes
`apps/docs-demo/dist`, while a standalone project defaults to `dist`.

## Rebuilding

The builder records generated files in `.monoline-generated.json`. A later build
removes stale files listed there, including pages changed to drafts. It refuses
an existing nonempty directory that it does not manage.

Use a dedicated output directory. Run the production build after previewing to
remove draft pages. Deploy only after it succeeds; builds write files directly
and are not an atomic deployment mechanism.
