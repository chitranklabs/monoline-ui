---
title: Support and limitations
description: Supported environments and boundaries of the first Docs release.
---

## Environments

Monoline Docs requires Node.js 24.14 or newer. Packed npm and pnpm consumers are
verified locally; React 19 and React DOM 19 are optional and needed only for
explicit hydrated islands. The default site is static HTML, not a production SSR
server. Basic reading and navigation work without JavaScript; search and theme
controls require it.

The first release targets npm. JSR cannot currently parse the package's public
Astro component exports. A local dry-run probe rejects an `.astro` export; no JSR
compatibility is promised.

## Content and trust

Markdown, MDX and local JavaScript configuration are trusted author input. MDX
and configuration can execute code during builds; do not build untrusted uploads.
OpenAPI generation consumes supported structures from local OpenAPI 3.0/3.1
documents, not every extension or arbitrary external reference.

Drafts are excluded from production output. Search exclusions and `noindex` are
discovery controls, not authentication: published HTML remains publicly readable.
Do not place secrets or access-controlled content in a public static build.

Markdown exports preserve authored Markdown bodies. MDX exports preserve static
rendered headings, code fences, links, lists and tables, while omitting interface
controls and interactive islands. They do not reproduce the original MDX source.
Inspect exported links and images before treating exports as a portable source.

## Hosting and larger sites

Deploy the complete static output to a host supporting the configured routes. The local preview is not a production server. Follow [Deployment](/deployment) for root and subpath hosting.

Use curated navigation for larger sites and measure your own content and search-index size. If a build fails, retain the last successful output and follow the error message before deploying.

## Get help

Start with [Troubleshooting](/troubleshooting). For reproducible package issues, include your configuration, error message and a small content example in a [GitHub issue](https://github.com/chitranklabs/monoline-ui/issues).
