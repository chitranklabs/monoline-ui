# Deploying Monoline Docs

Monoline builds static files. Hosts run the build and publish its output; they do
not run the local preview server. The recipes use one build contract so changes
to hosting do not require changes to the content or renderer.

These are opt-in recipes, not active deployments. Local build and package tests
cover their configuration contracts. Vercel, Netlify, Cloudflare Pages and GitHub Pages still need
real deployment verification before we claim end-to-end platform support.

## Consumer project

Install `@chitrank2050/monoline-docs` from npm in your consumer project.
Commit the consumer's package manifest and lockfile. Use a locally built tarball
only when verifying unpublished package changes.

Use Node 24.14 or newer and pnpm 11.18.0 for the supplied recipes. Configure these
consumer package fields alongside the installed Docs dependency:

```json
{
	"private": true,
	"type": "module",
	"packageManager": "pnpm@11.18.0",
	"engines": { "node": ">=24.14.0" },
	"scripts": {
		"build": "monoline-docs build",
		"dev": "monoline-docs dev"
	}
}
```

Hosted builds must be able to obtain the dependency. Before publication, keep the
tarball in the consumer repository and reference its relative path. A dependency
pointing to a file on your computer will not work remotely.

Create `monoline-docs.yml`:

```yaml
title: Team handbook
description: How our team builds and operates its services.
site: https://docs.example.com
base: /
defaultMode: system
```

Replace the example origin with your production origin. Add `content/index.md`
with a frontmatter title. `pnpm build` writes to `dist`; configure the host's
publish directory accordingly if you change `outDirectory`.

The optional `.yaml` spelling and `monoline-docs.config.mjs` use the same settings.
If multiple supported files exist, select one with `--config`. Legacy module names
remain usable through that flag. YAML supports data only: no executable tags,
merge keys, or environment-substitution syntax. Syntax errors and duplicate keys
fail the build. Configuration paths resolve from the selected file's directory.

## Production and preview builds

Use `pnpm build --indexing false` for hosted previews. It still excludes drafts;
only local `pnpm dev` includes them. Preview HTML is noindex/nofollow and does not
generate a sitemap or robots file. Its canonical links retain the configured
production origin. Noindex is not access control: never put secrets in published
documentation or publicly accessible preview deployments.

Overrides are explicit and validated:

```sh
pnpm build --site https://example.com --base /handbook/ --indexing true
```

The precedence is defaults, config file, then CLI overrides. Invalid config values
are not hidden by overrides. The package does not infer a canonical domain from a
temporary host URL. Configure the production origin once in YAML; override it when
the deployment's domain is intentionally different.

The generated files contain their configured base path. Rebuild when moving from
`/` to `/handbook/`; do not copy the same output to a different mount point.

## Vercel

Copy [the Vercel template](../packages/docs/templates/vercel.json) to the consumer
project root as `vercel.json`. Import that repository, select the **Other** preset,
and select Node 24.x in the project's build settings. Verify the supplied Node
version meets the package's 24.14 minimum in the first build log.

The template installs from the lockfile, builds to `dist`, and uses trailing-slash
URLs. Production builds use the config's indexing setting. Every other Vercel
environment builds with indexing disabled. No catch-all rewrite is installed:
missing routes must remain 404 responses rather than return the homepage.

Keep `base: /` for normal Vercel domains. A subpath deployment requires an actual
host/proxy mount at that subpath; changing links alone does not create a mount.

Reference: [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

## Netlify

Copy [the Netlify template](../packages/docs/templates/netlify.toml) to the consumer
project root as `netlify.toml`, then import the repository. The template declares
the build command, publish directory, Node/pnpm versions, and frozen installation.
Deploy previews and branch deployments disable indexing while using production
content filtering.

Do not add a `/* /index.html 200` rewrite. The generated `404.html` is the error
page, not an SPA fallback. Keep `base: /` unless a real subpath mount is configured.

Reference: [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## GitHub Actions and GitHub Pages

Copy [the Pages workflow](../packages/docs/templates/github-pages.yml) to the
consumer's `.github/workflows/docs-pages.yml`. In repository settings, select
**Pages → Build and deployment → GitHub Actions**. Configure any custom domain in
Pages settings before building. Protect the `github-pages` environment for the
production branch; change the template's `main` references if yours differs.

The configure-pages action supplies the origin and base path, covering both
`owner.github.io/repository/` and root/custom-domain deployments. The build receives
these as quoted environment values rather than interpolated shell source. Upload
and deployment only run after a successful build. Actions are SHA-pinned, build
permissions are read-only, and only the deployment job receives Pages/OIDC writes.
Deployment requires neither a personal access token nor a commit to a `gh-pages`
branch. Pages must already be enabled; the workflow does not enable it for you.

GitHub Actions performs the build/deployment. GitHub Pages hosts the files. GitHub
Pages is not a general per-PR preview service; the recipe deploys the production
branch only.

Reference: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## This monorepo's demo

The templates above target a standalone consumer, not `apps/website`. Do not copy
them over the existing website's deployment configuration. The demo still builds
the Docs workspace first and uses `apps/docs-demo/monoline-docs.yml`.
The demo configuration defaults to its public production origin and sharing
image. Its small `config.mjs` bridge exposes explicit deployment overrides:

```sh
DOCS_SITE=https://docs.example.com DOCS_BASE=/ DOCS_INDEXING=true pnpm --filter @monoline/docs-demo build
```

The public documentation uses a separate Vercel project, `monoline-docs`, at
<https://monolinedocs.chitrankagnihotri.com>. Its root directory is
`apps/docs-demo`, with sources outside the root enabled and Node.js 24.x.
[The committed configuration](../apps/docs-demo/vercel.json) selects the Other
preset, installs from the repository root, builds the Docs workspace first and
publishes `dist`. Git deployments target `main` only; preview deployments are
also disabled in project settings. The UI website remains a separate project.

The build command also forces `DOCS_INDEXING=false` outside Vercel's production
environment, including manually requested previews. Requests on `*.vercel.app`
receive `X-Robots-Tag: noindex`, including production aliases and export files;
the custom production domain retains the generated indexing policy. Canonicals
continue to use `DOCS_SITE`. Other staging domains require a separate build with
indexing disabled or a host-level noindex header.

Verify the actual project aliases and custom domain after an approved deployment.
The committed configuration cannot prove which domains are assigned in project
settings. Check that production HTML has no noindex response header, that every
Vercel alias has one, and that canonicals remain on the custom production origin.
See [Vercel conditional response headers](https://vercel.com/docs/project-configuration/vercel-json#headers)
and [Vercel's generated noindex headers](https://vercel.com/docs/headers/response-headers#x-robots-tag).

Set these environment variables for production:

```sh
DOCS_SITE=https://monolinedocs.chitrankagnihotri.com
DOCS_BASE=/
DOCS_INDEXING=true
```

The shared ignore command checks Docs/demo files, build tooling, root dependency
files and the shared theme tokens. Unrelated UI changes skip the Docs build;
unavailable deployment history allows a build. Vercel's Git integration handles
deployment, so no second deployment workflow is needed.

For Netlify, likewise use the repository root, publish `apps/docs-demo/dist`, and
replace the production command with `pnpm --filter @monoline/docs-demo build`.
Replace both preview commands with
`DOCS_INDEXING=false pnpm --filter @monoline/docs-demo build`. Keep the template's
Node/pnpm settings and set `DOCS_SITE` for the production origin.

For Pages, retain the template jobs but replace the build command with:

```sh
DOCS_SITE="$DOCS_ORIGIN" DOCS_BASE="${DOCS_BASE_PATH%/}/" DOCS_INDEXING=true pnpm --filter @monoline/docs-demo build
```

Change its artifact path to `apps/docs-demo/dist`. Choose the desired Pages site
before enabling this workflow; a repository has one Pages site, not one per app.

## Other static hosts and acceptance checklist

Publish the successful build output, preserve its directory structure, and configure
directory index serving. Map missing paths to `404.html` with status 404. Never run
the loopback development server as the production web server. Builds stage and
validate output before promotion; deploy immutable artifacts only after a successful exit, not a live folder
while it is being rebuilt.

Before calling a host supported, verify:

- Home and nested pages load directly and survive refresh.
- Slash redirects preserve query strings, without redirect loops.
- Missing URLs return 404, not homepage HTML with status 200.
- Scripts, styles, images, fonts, search, and heading links work at the actual base.
- Canonicals and sitemap locations match the production address.
- Query variants retain the page's canonical without query parameters.
- Alternate production hosts redirect to the canonical host or send a noindex
  response header; inspect actual domain settings and HTTP responses.
- Hosted previews are noindex and contain no draft pages or draft search entries.
- Export URLs remain fetchable at their exact paths without HTML fallback or
  unwanted slash redirects; preview and alternate-host headers also cover them.
- A deliberately invalid page fails the build and leaves the previous deployment active.

Keep host credentials and actual deployment approval outside package tests. The
templates are included in the packed Docs artifact under `templates/` for reuse.
