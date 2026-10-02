---
title: Deployment
description: Build static files for your chosen host.
order: 3
---

## Build the demo

While writing, run `pnpm --filter @monoline/docs-demo dev`. The local preview
includes drafts, rebuilds on content and asset changes, and reloads open pages.
Configuration changes require restarting the preview.

From the repository root:

```sh
pnpm --filter @monoline/docs-demo build
```

The output is in `apps/docs-demo/dist`. Upload that directory to a static host
that serves directory indexes. The generated `404.html` can be used as its error
page.

## Repository subpaths

For a site mounted at `/monoline/`, build with:

```sh
DOCS_BASE=/monoline/ pnpm --filter @monoline/docs-demo build
```

The base applies to navigation, article links, pager links, scripts, assets, and
stylesheets. The same `DOCS_BASE` setting works with the development command.

`base` changes URLs, not the filesystem layout. GitHub project Pages mounts
the uploaded artifact at its project path. Other hosts serving an artifact at
the domain root need files beneath that path or an explicit proxy mount.

For a standalone `/handbook/` deployment on a root-mounted static host:

```yaml
site: https://docs.example.com
base: /handbook/
outDirectory: ./public/handbook
```

Publish `public`, not `public/handbook`. After a successful build, copy
`public/handbook/404.html` to `public/404.html` for hosts that use a root error page.
Keep directory URLs (`cleanUrls: false`) with the supplied recipes.

## Publishing metadata

This demo reads `monoline-docs.yml`. YAML and the optional module configuration
use the same validator and settings. In a standalone installed project, run
`monoline-docs build` through your package manager. `--config` selects a file;
`--site`, `--base`, and `--indexing true|false` override deployment settings.

Set `site` in your configuration to the deployment origin, such as
`https://docs.example.com`. Use `base` separately for a repository subpath.
With a site configured, production builds generate canonical links and a sitemap.
Root deployments also receive a robots file; an origin's owner manages that file
when the docs live under a subpath. No site URL is assumed by the demo.

Serve missing pages with an HTTP 404 response, using the generated `404.html`.
Do not configure an SPA fallback that returns the homepage for every missing URL.

## Hosted previews

For hosted previews, run a production build with indexing disabled. This emits
noindex metadata but still excludes draft content. The demo command is:

```sh
DOCS_INDEXING=false pnpm --filter @monoline/docs-demo build
```

The package includes optional Vercel, Netlify, GitHub Pages and Cloudflare Pages recipes. They
publish static output, not the local preview server. Configure the build command
and publish directory for your project; the monorepo demo publishes
`apps/docs-demo/dist`, while a standalone project defaults to `dist`.

## Host recipes

Templates ship in the installed package's `templates` directory. Copy the selected
configuration into your consumer repository and commit a package-manager lockfile.

| Host             | Root deployment                                                      | Subpath deployment                                                                      |
| ---------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Vercel           | Copy `vercel.json`; publish `dist`.                                  | Copy `vercel-subpath.json` as `vercel.json`; use the YAML above and publish `public`.   |
| Netlify          | Copy `netlify.toml`; publish `dist`.                                 | Copy `netlify-subpath.toml` as `netlify.toml`; use the YAML above and publish `public`. |
| GitHub Pages     | Copy `github-pages.yml` to `.github/workflows/docs.yml`.             | The same workflow obtains the project base from Pages and uploads `dist`.               |
| Cloudflare Pages | Follow `cloudflare-pages.md`; build `pnpm build` and publish `dist`. | Build the YAML above, copy the root error page and publish `public`.                    |

Vercel and Netlify recipes disable indexing for previews. Configure Cloudflare's
preview build command as `pnpm build --indexing false`. Select a supported Node
version meeting the package's Node.js 24.14 minimum; an unsupported build image
is a deployment blocker. The recipes do not deploy from this repository and
have not been verified in real host accounts.

See [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json),
[Netlify routing](https://docs.netlify.com/manage/routing/redirects/overview/),
and [Cloudflare build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/).

## Rebuilding

The builder records generated files in `.monoline-generated.json`. A later build
removes stale files listed there, including pages changed to drafts. It refuses
an existing nonempty directory that it does not manage.

Use a dedicated output directory. Run the production build after previewing to
remove draft pages. Builds render into owned temporary staging, validate links
and then promote managed output. A failed render preserves last-good output and
unrelated files. Deploy only after the build succeeds; host-level atomic rollout
and rollback are separate from building static files.
