# Monoline Docs prototype

The private `@monoline/docs` package now connects content discovery and navigation
to a runnable static Markdown site. This validates the authoring and deployment
flow before committing to MDX execution or a framework integration.

## Run

Use Node 24.14 or newer and the repository's pinned pnpm version.

```sh
pnpm install --frozen-lockfile
pnpm --filter @monoline/docs-demo dev
```

Open the printed preview URL. The server binds to `127.0.0.1:4321` and watches
content and assets. Successful rebuilds reload the browser. Invalid content
shows an error banner while retaining the previous generated pages. Fixing the
content rebuilds and reloads the page. Drafts are visible in the local preview.

The demo sources live in `apps/docs-demo/content`, with assets in
`apps/docs-demo/assets`. Both commands use `apps/docs-demo/config.mjs`. Restart
the preview after changing configuration or package source; those files are not
hot-reloaded. Stop the server with Ctrl+C.

For production, run `pnpm --filter @monoline/docs-demo build`. This excludes
drafts, removes obsolete generated files, and writes the static site to
`apps/docs-demo/dist`. Run it again after previewing and before deployment.

## Package boundary

The existing package entry exposes discovery, metadata, navigation, and lookup.
The separate `@monoline/docs/build` entry exposes `buildDocs`. It takes a title,
content directory, output directory, optional description, optional navigation,
and an optional base directory such as `/project/`. The `@monoline/docs/dev`
entry exposes `startDevServer(options, port)`, using the same build options.

The builder uses Markdown-it with raw HTML disabled. Titles and navigation labels
are escaped. It validates internal page and heading links before writing files.
The site requires a published `index.md` homepage. Only published Markdown pages
enter the generated site. File names must use
letters, numbers, hyphens, or underscores.

The responsive shell follows the existing Monoline website's sidebar/content/TOC
layout. Reading and navigation work without JavaScript. Small client scripts add
theme selection and copy buttons. React components are not hydrated.

## Assets and fonts

Set `assetsDirectory` to a dedicated folder. Its files are copied beneath
`assets/`, preserving subdirectories and binary contents. Use `/assets/logo.svg`
in Markdown image references and `/assets/guide.pdf` for downloads. The builder
checks those references and adds the deployment base. Hidden files are ignored;
unsupported file types and child symlinks are rejected.

For fonts or custom styles, put a CSS file in that folder and set `stylesheet`
to its URL, for example `/assets/site.css`. Use relative CSS URLs such as
`url("fonts/body.woff2")` so font loading also works under a subpath. CSS is
copied unchanged: references inside CSS are the author's responsibility, rather
than checked by the Markdown link validator.

## Theme and code controls

The header offers light, dark, and system modes. Explicit choices persist in
local storage; the stored choice is applied before styles load. With storage
disabled, selection still works for the current page. System mode follows the
browser's color-scheme preference. Semantic colors match Monoline UI's tokens;
extracting a shared token package remains separate work.

Prism highlights code at build time, with no highlighter shipped to the browser.
Supported grammars include HTML, CSS, JavaScript, TypeScript, TSX, Bash, JSON,
YAML, and SQL. Unknown languages remain escaped plain text. Copy buttons copy
the original code text and announce success or clipboard errors. They remain
hidden if the Clipboard API is unavailable.

## Output ownership

Use a dedicated output directory. The builder records generated files, removes
obsolete recorded files on subsequent builds, and refuses nonempty unmanaged
directories. The output directory must be separate from both content and assets.
Build completion
must precede deployment; output replacement is not atomic.

## Remaining work before release

- Choose and integrate an MDX compiler and its component contract.
- Add search and verify shared token packaging.
- Add canonical URLs, sitemap generation, and configurable language metadata.
- Verify package installation outside this workspace and static-host deployments.

This is a private prototype, not a publishable documentation framework. It needs
no library Changeset and does not change the UI package's release contract.
