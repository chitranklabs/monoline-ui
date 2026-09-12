---
title: Deployment
description: Build static files for your chosen host.
order: 2
---

## Build the demo

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

The base applies to navigation, article links, pager links, and stylesheets.

## Rebuilding

The builder records generated files in `.monoline-generated.json`. A later build
removes stale files listed there, including pages changed to drafts. It refuses
an existing nonempty directory that it does not manage.

Use a dedicated output directory. Deploy only after the build succeeds; builds
write files directly and are not an atomic deployment mechanism.
