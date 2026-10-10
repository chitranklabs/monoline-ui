---
title: Search
description: Find pages and sections without an external search service.
order: 5
---

## Search the site

Use Search in the header, then type words from a page title, section heading,
or article. Results link directly to the relevant page or heading. Press Escape
or choose Close to return to the page.

Search runs in your browser using `search-index.json`, generated with the site.
No search account, API key, or separate server is needed. The index loads when
you open search, so normal page reading does not fetch it.

## What matches

Matching is case-insensitive and supports partial words. Every query word must
occur somewhere in an entry's page title, heading, or section text. Title matches
rank above heading matches, which rank above body-only matches.

The index is rebuilt with the content. Production builds exclude drafts;
development preview includes them. Pages omitted from explicit sidebar navigation
remain searchable.

Choose guide or API scope to narrow results. Matching words are highlighted;
recent searches remain in local browser storage and can be cleared in the dialog.
Use `search: false` in frontmatter to exclude a published page from the index.
`noindex: true` also excludes it from the sitemap, Markdown exports and AI indexes.
Set `search.enabled: false` in configuration to omit the search control and index.

> [!CAUTION]
> Search data is a public static file. Neither hiding a navigation link nor
> disabling search in your browser protects published content.

Read [Markdown and AI exports](/exports) for Copy Page and downloadable reading formats.

## Limits and failures

Search requires JavaScript and browser support for the modal dialog. Without
those, the pages and navigation remain readable, but Search is not shown.

This is a small-site search, not typo correction, stemming, or a hosted indexing
service. There is no configuration for replacing the search provider.

If the index cannot load, check that `search-index.json` was deployed alongside
the HTML and that the configured [base path](deployment.md#deployment-subpaths)
matches the published URL. Serve the output over HTTP(S), not by opening an HTML
file directly from disk.
