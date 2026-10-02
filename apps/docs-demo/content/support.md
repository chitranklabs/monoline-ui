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

Markdown exports preserve authored Markdown bodies. MDX exports provide readable
rendered text, not interactive island content or original code-block formatting.
Inspect exported links and images before treating exports as a portable source.

## Scale and hosting

Build output promotion restores the previous generated files and manifest after
caught filesystem errors when rollback is possible. Overlapping promotions are
rejected. Interrupted processes or failed rollback retain an owned
`.monoline-promotion` directory for manual recovery; do not deploy failed output
or remove a lock while another build is running. A cleanup warning after manifest
commit means the new site built successfully, but its remaining promotion
directory needs inspection before another build. Promotion is not an atomic
deployment or a power-loss durability guarantee. See the repository's
`docs/docs-release.md` recovery guide for the procedure.

The local benchmark covers synthetic 100- and 1,000-page sites. Full generated
navigation repeats on every page; use curated navigation for larger sites and
measure your own corpus, index downloads and slower devices.

Root and subpath output are verified with local production browsers. Deployment
recipes are provided for static hosts, but real-host deployment remains a
separate release gate. URL `base` does not relocate files on disk.

Automated accessibility checks cover keyboard interaction, no-JavaScript reading,
reduced motion and axe rules. They do not replace manual screen-reader review.
