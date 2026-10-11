---
title: Frontmatter
description: Reference for page metadata, routes and visibility.
---

Each Markdown or MDX file begins with YAML frontmatter. `title` is required.

```yaml
---
title: Installation
description: Set up your project.
order: 1
slug: guides/install
---
```

| Field         | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| `title`       | Visible page heading.                                  |
| `description` | Page description.                                      |
| `navTitle`    | Navigation label.                                      |
| `seoTitle`    | Search-engine title.                                   |
| `slug`        | Stable public route, without a leading slash.          |
| `order`       | Numeric order for generated navigation.                |
| `draft`       | Exclude from production builds.                        |
| `sidebar`     | Set false to hide the page sidebar.                    |
| `toc`         | Set false to hide its table of contents.               |
| `search`      | Set false to exclude from local search.                |
| `noindex`     | Exclude from search, sitemap, Markdown and AI indexes. |
| `updatedAt`   | Real date in YYYY-MM-DD format.                        |
| `tags`        | Page tags.                                             |
| `badge`       | Short page badge.                                      |
| `layout`      | Use reference for wider content.                       |

Discovery settings do not restrict access to built HTML. Keep draft routes out of production navigation and links. Read [Writing pages](writing.md) for practical examples.
