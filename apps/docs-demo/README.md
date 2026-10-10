# Monoline Docs demo

This consumer demonstrates the Docs package with packaged styles, Markdown/MDX content and configuration.

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
