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
twice. Explicit entries replace frontmatter ordering. Optional numeric `order` values
sort siblings with lower values first; unspecified values come last, and ties
retain their configured order.

## Pages outside the sidebar

A page omitted from explicit navigation is still built, linkable, and searchable.
It does not receive previous or next links. Hiding a page from the sidebar is
not access control.

> [!WARNING]
> Production builds exclude drafts. Remove draft routes from explicit navigation
> and links in published pages before building, or link validation will fail.

## Plain groups

For a group heading with an always-visible list, set `style: plain`:

```yaml
navigation:
  - label: Components
    style: plain
    items:
      - label: Accordion
        href: /components/accordion
```

Plain groups have no disclosure control or chevron. Omit `expanded` on these
groups. Other groups keep the default `collapsible` style and native disclosures.

## On this page

The right-hand table of contents comes from rendered article headings through
H3. It is separate from sidebar configuration. See the
[heading rules](writing.md#headings) for linkable section titles.

Set `sidebar: false` or `toc: false` in a page's frontmatter when that page needs
more horizontal space. These options hide shell regions only; they do not change
the navigation sequence, previous/next links, search, or access to the page.

By default, named sidebar groups use native disclosure controls. The group containing the
current page always opens initially and remains usable without JavaScript.
Set `expanded: true` on other groups to open them initially. `expanded: false`
keeps inactive groups closed. Links cannot accept `expanded`.

## Sections

Use sections for separate documentation areas. Header links navigate to each
section's landing page; its sidebar and previous/next links follow only that
section's entries. These ordinary links work without JavaScript.

```yaml
navigation:
  sections:
    - label: Guides
      href: /
      order: 1
      items:
        - label: Getting started
          expanded: true
          items:
            - label: Introduction
              href: /
            - label: Configuration
              href: /configuration
    - label: Authoring
      href: /writing
      order: 2
      items:
        - label: Writing pages
          href: /writing
          icon: "◇"
          badge: MDX
```

Each landing `href` must appear in its own section's items. A route can belong
to only one section. Groups, links and sections accept `order`, an optional
short text `icon` (up to eight Unicode characters) and a nonempty `badge`.
Icons are decorative; badges remain readable text. The array form above is
still supported. Section ordering and membership come from this configuration,
not URL prefixes or source folders. Pages omitted from sections retain header
links but have no section sidebar or previous/next links.

Sidebar scroll positions are remembered for each site base and section in the
current browser tab. If browser storage is unavailable, navigation still works.
TOC tracking follows the last heading above the sticky header, including long
sections between headings. Heading links clear the header on direct arrival.

Use explicit `slug` frontmatter to keep a public route stable when moving a
source file. Update relative Markdown links to its new source location; route
links and navigation entries keep their existing public `href`.

## Moving an existing site

Keep published routes stable when moving source files: set frontmatter `slug` to
the old route, independently of the new filename. See [writing pages](writing.md).
Set `base` to the actual hosting mount and check both direct page visits and links.

When a public URL must change, configure permanent redirects on your static host
or proxy. Monoline Docs does not currently generate redirects. Keep an explicit
old-to-new URL map, include heading fragments in your checks, and avoid redirect
chains. Verify missing URLs return HTTP 404 rather than a successful home page.

Before switching the production address, run the production build and check
navigation, internal links, assets, search, canonicals and the sitemap at the
actual deployment base. Preserve the previous deployment so you can roll back.
