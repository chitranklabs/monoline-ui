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

## Reference

| Option             | Default      | Meaning                                                                             |
| ------------------ | ------------ | ----------------------------------------------------------------------------------- |
| `title`            | Required     | Nonempty site name; appears in the header and browser title.                        |
| `description`      | Unset        | Fallback description for pages without their own.                                   |
| `contentDirectory` | `./content`  | Folder containing Markdown pages.                                                   |
| `outDirectory`     | `./dist`     | Dedicated folder for generated files.                                               |
| `assetsDirectory`  | Unset        | Folder copied into the site's `/assets/` path.                                      |
| `stylesheet`       | Unset        | Local `/assets/*.css` file loaded after default styles.                             |
| `base`             | `/`          | Deployment path beginning and ending with `/`, such as `/handbook/`.                |
| `cleanUrls`        | `false`      | Emit flat `.html` files with extensionless internal links.                          |
| `site`             | Unset        | HTTP(S) origin, such as `https://docs.example.com`; no subpath, query, or fragment. |
| `indexing`         | `true`       | Whether production output permits indexing and emits a sitemap when `site` is set.  |
| `lang`             | `en`         | Valid BCP 47 language tag for the HTML document.                                    |
| `defaultMode`      | `system`     | `light`, `dark`, or `system`; visitors can override it.                             |
| `navigation`       | Generated    | [Sidebar links and groups](navigation.md).                                          |
| `logo`             | Unset        | Local image with `src`, nonempty `alt`, and positive integer `width` and `height`.  |
| `headerLinks`      | Unset        | Header links with `label` and a docs route or absolute HTTP(S) `href`.              |
| `footer`           | Unset        | Optional `text` and labeled links shown below every page.                           |
| `editLink`         | Unset        | HTTP(S) edit URL containing `{path}`; supports an optional `label`.                 |
| `react`            | `false`      | Enable React 19 components and explicit client directives in MDX.                   |
| `environment`      | `production` | Build environment; the CLI build forces production and preview uses development.    |

Use [appearance](appearance.md) for logo and stylesheet examples and
[deployment](deployment.md) for `site`, `base`, and indexing behavior.

Internal header and footer routes automatically include `base`. The edit URL
receives the content-relative Markdown or MDX path:

```yaml
headerLinks:
  - label: Writing
    href: /writing
footer:
  text: Released under the MIT License.
  links:
    - label: GitHub
      href: https://github.com/example/docs
editLink:
  href: https://github.com/example/docs/edit/main/content/{path}
  label: Improve this page
```

## Invoke the local CLI

The package is not publicly released. After building it in this checkout, invoke
the compiled CLI directly from the repository root:

```sh
pnpm --filter @monoline/docs build
node packages/docs/dist/cli.js build --config apps/docs-demo/monoline-docs.yml
```

The commands are `build` and `dev`. Both accept `--config`, `--site`, `--base`,
and `--indexing true|false`; these deployment flags override the file. Only `dev`
accepts `--port`, which defaults to `4321` and must be an integer from 1 to 65535.

```sh
node packages/docs/dist/cli.js dev --config apps/docs-demo/monoline-docs.yml --port 4322
```

## Use the workspace API

In a workspace project that already depends on `@monoline/docs`:

```javascript
import { loadConfig } from "@monoline/docs"
import { buildDocs } from "@monoline/docs/build"

const config = await loadConfig({ config: "./monoline-docs.yml" })
const result = await buildDocs(config)
console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
```

`defineConfig` validates an object but does not resolve directory paths. Calling
`buildDocs` with an object directly resolves paths from the working directory;
use `loadConfig` when you want config-relative paths.

> [!CAUTION]
> Keep output separate from content and assets. Builds reject overlapping paths
> and refuse nonempty output folders they do not manage.
