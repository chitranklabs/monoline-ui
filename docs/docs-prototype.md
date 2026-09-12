# Monoline Docs prototype

The private `@monoline/docs` package now connects content discovery and navigation
to a runnable static Markdown site. This validates the authoring and deployment
flow before committing to MDX execution or a framework integration.

## Run

Use Node 24.14 or newer and the repository's pinned pnpm version.

```sh
pnpm install --frozen-lockfile
pnpm --filter @monoline/docs-demo build
python3 -m http.server 4321 --directory apps/docs-demo/dist
```

Open `http://localhost:4321`. The demo sources live in `apps/docs-demo/content`;
its build configuration lives in `apps/docs-demo/build.mjs`. Re-run the build
after editing content.

## Package boundary

The existing package entry exposes discovery, metadata, navigation, and lookup.
The separate `@monoline/docs/build` entry exposes `buildDocs`. It takes a title,
content directory, output directory, optional description, optional navigation,
and an optional base directory such as `/project/`.

The builder uses Markdown-it with raw HTML disabled. Titles and navigation labels
are escaped. It validates internal page and heading links before writing files.
The site requires a published `index.md` homepage. Only published Markdown pages
enter the generated site. File names must use
letters, numbers, hyphens, or underscores.

The responsive shell follows the existing Monoline website's sidebar/content/TOC
layout and uses semantic HTML without client JavaScript. Its colors follow the
system theme. React components are not hydrated by this prototype.

## Output ownership

Use a dedicated output directory. The builder records generated files, removes
obsolete recorded files on subsequent builds, and refuses nonempty unmanaged
directories. Content and output directories must not overlap. Build completion
must precede deployment; output replacement is not atomic.

## Remaining work before release

- Choose and integrate an MDX compiler and its component contract.
- Support local assets, search, syntax highlighting, and development reload.
- Add a user-selectable theme and verify shared token packaging.
- Add canonical URLs, sitemap generation, and configurable language metadata.
- Verify package installation outside this workspace and static-host deployments.

This is a private prototype, not a publishable documentation framework. It needs
no library Changeset and does not change the UI package's release contract.
