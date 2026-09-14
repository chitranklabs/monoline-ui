---
title: Writing pages
description: Keep titles and navigation metadata beside your content.
order: 1
---

## Frontmatter

Each file starts with YAML metadata. The title becomes the page heading; the
remaining Markdown forms the article.

```yaml
---
title: Installation
description: Set up your documentation project.
order: 1
draft: false
---
```

## Links and routes

Use Markdown file links such as `[Introduction](index.md)`, or root-relative
documentation routes such as `[Introduction](/)`. The builder checks page and
heading targets, then adds the configured deployment base.

| File              | Route       |
| ----------------- | ----------- |
| `index.md`        | `/`         |
| `writing.md`      | `/writing/` |
| `guides/index.md` | `/guides/`  |

## Headings

The frontmatter title is the only H1. Start article sections at H2. A source H1
is rendered as H2; other levels are preserved. Repeated headings receive distinct
IDs, and headings inside code fences never enter the table of contents.

Raw HTML is displayed as text. Use normal Markdown for prose, lists, code, and
tables.

## Drafts

Set `draft: true` to exclude a page from production builds. Remove references to
that draft from configured navigation and published pages before building.

## Callouts

Use a blockquote with an uppercase marker on its first line. Supported markers are `NOTE`, `TIP`, `WARNING`, and `CAUTION`.

```markdown
> [!NOTE]
> Keep configuration files in version control.
```

> [!TIP]
> Link to the section that answers the reader's question, not just the page.

Callouts support Markdown paragraphs, links, and lists. Other markers remain ordinary blockquotes. Their labels do not appear in the table of contents.

## Heading permalinks

Each section heading has a keyboard-accessible `#` link to its section. Heading IDs are generated from the heading text; duplicate headings receive distinct IDs. Renaming a heading changes its link, so update references when editing it.
