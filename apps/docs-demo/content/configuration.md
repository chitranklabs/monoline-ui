---
title: Configuration
description: Set paths, publishing metadata, and site options in one file.
order: 1
---

## Choose a configuration file

The CLI discovers `monoline-docs.yml`, `monoline-docs.yaml`, or
`monoline-docs.config.mjs` in its working directory. Keep one discovery candidate,
or select a file with `--config`. YAML is enough for ordinary sites; an `.mjs`
file can export a configuration object as its default export.

This minimal YAML configuration expects a `content/index.md` beside it:

```yaml
title: Team handbook
contentDirectory: ./content
outDirectory: ./dist
```

Directory paths loaded through the CLI or `loadConfig` are relative to the
configuration file, not the terminal's working directory. Unknown configuration
keys fail validation, so a misspelled option does not silently do nothing.

## Editor completion

The package ships `schema.json` for YAML editors that support JSON Schema, such
as the Red Hat YAML extension for VS Code. `monoline-docs init` adds this comment
at the top of the starter configuration:

```yaml
# yaml-language-server: $schema=./node_modules/@chitrank2050/monoline-docs/schema.json
title: Team handbook
```

Add the comment to an existing configuration to get option completion and checks
for unknown keys, types and nested navigation. The path is relative to the YAML
file; adjust it when your configuration is in a subdirectory. Install the package
first. The local schema follows your installed package version and works offline.

The CLI remains authoritative: build validation also checks safe paths, URLs,
language tags, conflicting aliases, route existence and assets. An editor check
does not replace a successful production build.

## Reference

| Option                   | Default      | Meaning                                                                             |
| ------------------------ | ------------ | ----------------------------------------------------------------------------------- |
| `title`                  | Required     | Nonempty site name; appears in the header and browser title.                        |
| `description`            | Unset        | Fallback description for pages without their own.                                   |
| `contentDirectory`       | `./content`  | Folder containing Markdown pages.                                                   |
| `outDirectory`           | `./dist`     | Dedicated folder for generated files.                                               |
| `assetsDirectory`        | Unset        | Folder copied into the site's `/assets/` path.                                      |
| `stylesheet`             | Unset        | Local `/assets/*.css` file loaded after default styles.                             |
| `base`                   | `/`          | Deployment path beginning and ending with `/`, such as `/handbook/`.                |
| `cleanUrls`              | `false`      | Emit flat `.html` files with extensionless internal links.                          |
| `site`                   | Unset        | HTTP(S) origin, such as `https://docs.example.com`; no subpath, query, or fragment. |
| `indexing`               | `true`       | Whether production output permits indexing and emits a sitemap when `site` is set.  |
| `lang`                   | `en`         | Valid BCP 47 language tag for the HTML document.                                    |
| `appearance.defaultMode` | `system`     | `light`, `dark`, or `system`; visitors can override it.                             |
| `navigation`             | Generated    | [Sidebar links and groups](navigation.md).                                          |
| `branding.logo`          | Unset        | Local image with `src`, nonempty `alt`, and positive integer `width` and `height`.  |
| `header.links`           | Unset        | Header links with `label` and a docs route or absolute HTTP(S) `href`.              |
| `footer`                 | Unset        | Optional `text` and labeled links shown below every page.                           |
| `content.editLink`       | Unset        | HTTP(S) edit URL containing `{path}`; supports an optional `label`.                 |
| `react`                  | `false`      | Enable React 19 components and explicit client directives in MDX.                   |
| `environment`            | `production` | Build environment; the CLI build forces production and preview uses development.    |

Use [appearance](appearance.md) for logo and stylesheet examples and
[deployment](deployment.md) for `site`, `base`, and indexing behavior.

Internal header and footer routes automatically include `base`. The edit URL
receives the content-relative Markdown or MDX path:

```yaml
header:
  links:
    - label: Writing
      href: /writing
footer:
  text: Released under the MIT License.
  links:
    - label: GitHub
      href: https://github.com/example/docs
content:
  editLink:
    href: https://github.com/example/docs/edit/main/content/{path}
    label: Improve this page
```

## Shell controls

```yaml
header:
  primaryAction:
    label: Get started
    href: /writing
  announcement:
    text: Documentation preview is available.
    href: /writing
sidebar:
  enabled: true
content:
  showLastUpdated: true
  copyPageLink: true
```

The primary action uses the same safe links as header links. An announcement
can omit `href` to show plain text. Sidebar, last-updated and copy-link controls
default to enabled. A page's `sidebar: false` still hides its sidebar.
Last-updated dates require `updatedAt: YYYY-MM-DD` frontmatter. Copy page link
copies the current URL, including its fragment; it does not export Markdown.

## Appearance and branding

Use `appearance` for `defaultMode`, `density`, `radius`, `accent` and local font declarations. `branding` contains `logo` and `favicon`. See [Appearance](appearance.md) for working examples.

## Search, exports and integrations

`search.enabled` controls the search feature. `seo` accepts optional `titleTemplate` and `socialImage`. `integrations.scripts` adds explicitly authored local asset or HTTPS script URLs.

`footer.showBranding` defaults to true; footer text and links can be configured independently. See [exports](exports.md), [OpenAPI](openapi.md), [CLI](cli.md) and the [programmatic API](programmatic-api.md) for their respective workflows.

### Social images and scripts

Set `site` before configuring `seo.socialImage`: it supplies the origin for the
absolute social image URL. Images must be local `/assets/` PNG, JPEG or WebP
files, resolved from `assetsDirectory`.

```yaml
site: https://docs.example.com
seo:
  titleTemplate: "%s | Team handbook"
  socialImage: /assets/social.png
integrations:
  scripts:
    - /assets/analytics.js
```

Integration scripts must use local `/assets/*.js` files or HTTPS URLs. They load
only when configured. Script code and external providers are trusted author
choices; review them before adding them to your documentation site.

## Legacy aliases

Top-level `defaultMode`, `logo`, `headerLinks` and `editLink` remain compatibility aliases. New sites should use `appearance.defaultMode`, `branding.logo`, `header.links` and `content.editLink`. Do not configure both forms of the same option.
