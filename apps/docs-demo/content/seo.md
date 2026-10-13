---
title: SEO and social sharing
navTitle: SEO and sharing
seoTitle: Documentation SEO and social sharing guide
description: Configure Monoline Docs titles, descriptions, canonical URLs, social images and indexing. Verify production output and submit your sitemap to Google Search Console.
---

Give each page a useful title and description, then configure the public origin
before publishing. Monoline generates metadata from these settings; search engines
decide whether and how to display your pages.

## Configure the publishing URL

In `monoline-docs.yml`:

```yaml
title: Team handbook
description: Guides and API reference for the Example SDK.
site: https://docs.example.com
base: /
indexing: true
assetsDirectory: ./assets
seo:
  titleTemplate: "%s | Team handbook"
  socialImage: /assets/social.png
  socialImageAlt: Example SDK documentation
  author:
    type: Person
    name: Alex Example
    url: https://example.com/about
  publisher:
    type: Organization
    name: Example SDK
    url: https://example.com
```

`site` is an HTTP(S) origin without a path, query or fragment. For documentation
at `https://example.com/handbook/`, use `site: https://example.com` and
`base: /handbook/`. The base applies to canonical URLs, sitemap entries and local
social image URLs. See [Deployment](deployment.md) for the corresponding host layout.

`titleTemplate` must contain `%s`, replaced with the page's `seoTitle` or `title`.
Its default is `%s |` followed by the configured site title. Keep the result
descriptive and avoid repeating the site name in `seoTitle`.

`socialImage` requires `site` and a local PNG, JPEG or WebP file under
`assetsDirectory`. The example uses `assets/social.png`. Monoline emits an
absolute image URL for Open Graph and Twitter sharing metadata. `socialImageAlt`
provides a meaningful image description; it defaults to the site title.

`author` and `publisher` are optional identity objects with `type` (`Person` or
`Organization`), `name`, and optional HTTP(S) `url` and `sameAs` profile URLs.
Use the actual content author and publishing identity. Publisher information is
attached to the website and pages; author information is attached to pages.
Do not use product websites as alternate personal identities.

## Write page metadata

```yaml
---
title: Install the SDK
navTitle: Installation
seoTitle: Install the Example SDK
description: Install the Example SDK, configure your API key and send your first request.
updatedAt: 2026-10-01
---
```

| Field         | Use                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `title`       | Required visible page heading; also the fallback SEO title.                                                |
| `navTitle`    | Short navigation label, independent of the heading and SEO title.                                          |
| `seoTitle`    | Page title inserted into `seo.titleTemplate`.                                                              |
| `description` | Page-specific HTML and sharing description; falls back to the site description.                            |
| `updatedAt`   | Real calendar date in `YYYY-MM-DD` format; supplies structured data's `dateModified`.                      |
| `noindex`     | Emit `noindex, nofollow` and exclude the page from local search, sitemap, Markdown exports and AI indexes. |

Use descriptions that explain what readers can accomplish on that particular
page. Update `updatedAt` when the content changes; it is not automatically derived
from Git. See [Frontmatter](frontmatter.md) for the full reference.

## Control previews and unpublished content

Build a hosted staging site with:

```sh
npx monoline-docs build --indexing false
```

This production build excludes drafts and adds `noindex, nofollow` to pages. It
omits the sitemap, generated robots file and structured data. Set `indexing: false`
in configuration when that is the default for your environment.

Use `draft: true` for unfinished pages: production builds omit them entirely.
The local development preview includes drafts and marks pages as noindex. Keep
draft routes out of production navigation and links.

Use `noindex: true` for a published page that should be excluded from discovery.
Its HTML remains accessible. These settings are not access controls; protect
private material at the host. Google must be able to crawl a page to read its
[noindex directive](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).

## Check generated output

Run `npm run build` and inspect the configured output directory before deploying:

- Page HTML contains the expected title, description, canonical URL and sharing metadata.
- Indexable pages with `site` configured contain `WebSite` JSON-LD. The homepage
  uses `WebPage`; other pages use `Article`, or `TechArticle` with `layout: reference`.
  Non-home pages also contain `BreadcrumbList` data from navigation.
- `sitemap.xml` contains production routes with the configured origin and base,
  excluding drafts and noindex pages. Authored `updatedAt` supplies `lastmod`;
  pages without that date omit it. Do not substitute the build date.
- With `base: /`, `robots.txt` allows crawling and points to the sitemap.
  With a subpath, Monoline omits this file: the origin owner manages `/robots.txt`
  and can add `Sitemap: https://example.com/handbook/sitemap.xml` there.
- The generated `404.html` is noindex. Configure the host to serve it with an HTTP
  404 status for missing pages.

Without `site`, Monoline emits no canonical URLs, sitemap, robots file or
site/page/breadcrumb JSON-LD. Titles and descriptions still render. No production
origin is inferred. With indexing disabled, canonical URLs still use `site` when set.

## Troubleshoot metadata

| Symptom                       | Check                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Missing sitemap               | Set `site`, enable `indexing` and run a production build. Draft and noindex pages are excluded.                 |
| Missing robots file           | Only root deployments generate `robots.txt`; the origin owner manages it for subpath sites.                     |
| Wrong canonical URL           | Keep the origin in `site` and the deployment path in `base`. Check CLI overrides, then rebuild.                 |
| Missing sharing image         | Set `site`; confirm the PNG, JPEG or WebP exists under `assetsDirectory` and its deployed `/assets/` URL loads. |
| Stale search title or snippet | Check deployed HTML and URL Inspection. Google may need to recrawl and may choose different display text.       |

## Connect Google Search Console

After deploying your production build:

1. [Add and verify a Search Console property](https://support.google.com/webmasters/answer/34592).
   Use a Domain property when you control DNS, or a URL-prefix property matching
   the published docs URL, including its subpath.
2. Submit the deployed `sitemap.xml` URL in the Sitemaps report. For the subpath
   example, submit `https://example.com/handbook/sitemap.xml`.
3. Inspect the homepage and a representative guide with URL Inspection. Check
   crawl access, indexing status and the canonical selected by Google.
4. Review the Page indexing report for unexpected exclusions and the Performance
   report for search queries and pages after data becomes available.

A [submitted sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
helps discovery; it does not guarantee indexing or rankings. Structured data
describes the content and does not guarantee a rich result.
