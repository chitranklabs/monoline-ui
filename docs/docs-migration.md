# Moving an existing site to Monoline Docs

A migration should preserve published URLs and verify the generated site before
replacing the existing deployment. Monoline Docs does not currently provide an
importer or generate redirect rules; convert content and configure host redirects
explicitly rather than assuming parity with another documentation framework.

## Preserve routes

Inventory the current public pages and important heading links. Copy ordinary
Markdown first; replace framework-specific shortcodes, components and configuration
with supported Monoline Docs features. MDX is trusted executable author content.

Set frontmatter `slug` when the desired route differs from the source filename:

```yaml
---
title: Install
slug: guides/install
---
```

A source file can then move without changing `/guides/install/`. Preserve heading
text or update incoming fragment links deliberately. Choose `cleanUrls` and `base`
to match your host's URL layout; `base` changes links, not the hosting mount.
Do not assume old `.html` paths will redirect to directory URLs automatically.

## Redirect changed URLs

Maintain an old-to-new URL map and configure permanent redirects on the static
host or proxy before cutover. Use its supported redirect syntax and verify the
actual HTTP status and destination. Avoid loops and chains; test query strings
and heading fragments. Remove links to old destinations from the new content.
Monoline Docs does not accept a `redirects` configuration option.

## Verify and switch

1. Run `monoline-docs build` successfully. Resolve missing routes and asset errors.
2. Serve the output at the intended root or subpath. Open nested pages directly
   and refresh them; test assets, search, navigation and heading links.
3. Check canonicals and sitemap URLs match the production origin. Keep staging
   noindex with `indexing: false`; enable indexing for the production build.
4. Check redirects and make sure genuinely missing pages return HTTP 404.
5. Retain the old deployment, switch the host to the successful static artifact,
   and repeat the critical URL checks. Roll back at the host if acceptance fails.

See [deployment](docs-deployment.md) for serving requirements and
[release and recovery](docs-release.md) for output recovery limits.
