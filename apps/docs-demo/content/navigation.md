---
title: Navigation
description: Choose page order or organize the sidebar into named groups.
order: 2
---

## Generated navigation

Without a `navigation` setting, every included page appears in the sidebar.
Pages sort by frontmatter `order`, with lower numbers first. Pages without an
order come last; ties sort by route. Labels come from page titles.

Previous and next links follow the same sequence as the sidebar.

## Explicit links and groups

Set `navigation` when you want group labels, different link labels, or a smaller
sidebar. This example uses pages present in this site:

```yaml
navigation:
  - label: Introduction
    href: /
  - label: Authoring
    items:
      - label: Writing pages
        href: /writing
      - label: Appearance
        href: /appearance
  - label: Deployment
    href: /deployment
```

Each entry has a `label` and exactly one of `href` or `items`. Groups may contain
other groups. Use documentation routes without trailing slashes, except for
the home route `/`. Do not put Markdown filenames, deployment prefixes,
fragments, or external URLs in sidebar `href` values.

The builder verifies that every linked page exists and that no route appears
twice. The order of explicit entries replaces frontmatter ordering.

## Pages outside the sidebar

A page omitted from explicit navigation is still built, linkable, and searchable.
It does not receive previous or next links. Hiding a page from the sidebar is
not access control.

> [!WARNING]
> Production builds exclude drafts. Remove draft routes from explicit navigation
> and links in published pages before building, or link validation will fail.

## On this page

The right-hand table of contents comes from rendered article headings through
H3. It is separate from sidebar configuration. See the
[heading rules](writing.md#headings) for linkable section titles.
