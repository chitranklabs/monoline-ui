# Monoline Docs demo

This consumer powers the [Monoline Docs documentation](https://monolinedocs.chitrankagnihotri.com)
with packaged styles, Markdown/MDX content and configuration.

## Run locally

Use Node.js 24.14.0 or newer and the pnpm version declared in the repository's
`packageManager` field. From the repository root:

```sh
pnpm install
pnpm --filter @monoline/docs-demo dev
```

Open the address printed by the preview server. Edit files in
`apps/docs-demo/content`; the preview rebuilds and reloads when content or assets
change. Restart it after changing `apps/docs-demo/monoline-docs.yml`.

To produce static output:

```sh
pnpm --filter @monoline/docs-demo build
```

The demo scripts build the package first. Generated files go to
`apps/docs-demo/dist`; the preview server is not a production server.

Start with [Getting started](content/getting-started.mdx) to create a separate
site, or [Configuration](content/configuration.md) to explore this demo. The
[documentation index](../../docs/README.md) links both products and repository
guides. Repository recovery and release verification belong in
[the release guide](../../docs/docs-release.md).

## Production hosting

The separate `monoline-docs` Vercel project deploys `main` only; previews are
disabled. Its root is `apps/docs-demo`, with access to workspace sources outside
that directory. [Deployment settings](vercel.json) build the Docs package first
and publish `dist`. See [deployment guidance](../../docs/docs-deployment.md#this-monorepos-demo)
for the production environment and hosting checks.

## Site analytics

The production build adds Cloudflare Web Analytics when `VERCEL_ENV=production`
and `CLOUDFLARE_WEB_ANALYTICS_TOKEN` contains this site's public beacon token.
Create the site for `monolinedocs.chitrankagnihotri.com` in Cloudflare Web Analytics
and set that token in the `monoline-docs` Vercel project's **Production** environment.
Use the token from the tracking snippet, not a private Cloudflare API token.

Local builds and previews omit the beacon. The integration is specific to this
site; the published Docs package contains no tracking for our account.
