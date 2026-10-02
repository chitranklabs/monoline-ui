# Cloudflare Pages

Use Git integration with a standalone consumer and a committed pnpm lockfile.
Select no framework preset, build with `pnpm build`, and publish `dist`.
Set `NODE_VERSION=24.14.0` and `PNPM_VERSION=11.18.0` in the build environment.
For preview branches, use `pnpm build --indexing false`.

Set `site` to the deployment origin. Directory URLs (`cleanUrls: false`) work
with Pages' directory-index routing. Keep the generated root `404.html` to
prevent Pages from treating this as a single-page application.

For `/handbook/`, set `base: /handbook/` and `outDirectory: ./public/handbook`,
then publish `public`. Put a copy of `public/handbook/404.html` at
`public/404.html` after a successful build. The host serves files beneath the
base; setting `base` alone does not move output into a subdirectory.

Do not add a catch-all rewrite to the homepage. Host-level deployment and custom
domain behavior need verification in your account before production adoption.

See [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
and [routing behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).
