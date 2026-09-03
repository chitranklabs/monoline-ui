# Workspace migration safeguards

## Intent

Separate the React library and Next.js website without changing public imports,
routes, versions, or visual design. pnpm manages two workspaces; no additional
task runner, Astro app, or Changesets configuration is introduced in this batch.

## Ownership

| Location        | Responsibility                                                          |
| --------------- | ----------------------------------------------------------------------- |
| `packages/ui`   | Component source, tokens, package manifest, JSR, tsup, build output     |
| `apps/website`  | Existing Next.js app, public assets, proxy, framework configuration     |
| Repository root | Shared tooling, lockfile, CI, hooks, integration tests, release history |

The website depends on `@chitrank2050/monoline-ui` through `workspace:*`.
Its TypeScript configuration contains no aliases into library source. The
website catalog is generated from library metadata by `pnpm sync-exports` and
checked for drift; it is not an additional public library export.

`packages/ui/package.json` replaces `package.json.lib` as the single authored
library manifest. Workspace exports point to `dist`; the build generates a
manifest rooted inside `dist` for publishing. Existing npm export targets and
JSR component subpaths remain unchanged. Package documentation and licensing
are included for both registries. Historical release data and tags are retained.

## Local workflow

Run commands from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm dev             # Build UI, then start the website
pnpm build:lib       # Rebuild UI after changing library source or CSS
pnpm build           # Build UI, then the production website
pnpm check:all       # Static, package, production SEO, and browser checks
```

Next.js fast refresh still handles website edits. Library edits require a fresh
`pnpm build:lib`; the website no longer bypasses the package through source aliases.
`pnpm typecheck` also builds UI declarations before checking all three TypeScript
configurations. Build outputs, Next.js types, and caches remain ignored by Git.

The checked-in lockfile retains the previous package resolutions and snapshots.
Shared development tools remain at the root. Runtime dependencies belong to
their workspace; React also remains a root development dependency for tests.

## Deployment handoff

Before deploying this branch, set the existing Vercel project's Root Directory
to `apps/website` and enable access to files outside that root. Keep the Next.js
preset and default `.next` output directory. The checked-in `vercel.json` installs
from the workspace root and builds UI before the website. Do not run an additional
dashboard build command that bypasses it.

These are project settings, not changes this migration applies remotely. Follow
[Vercel's monorepo setup](https://vercel.com/docs/monorepos) and verify a preview
deployment before merging. Keep the existing domain and environment variables.

## Release and CI

Git-cliff and the existing release workflows remain the release owners for now.
They read the library version in `packages/ui/package.json`, write website release
data in its new location, publish npm from `packages/ui/dist`, and publish JSR
from `packages/ui`. No version bump is part of this migration.

CI path selection follows both workspaces, including nested manifests, proxy,
build configuration, and deployment configuration. Existing required checks,
main-branch exclusions, and security scanners remain. Markdown-only changes
still avoid code and browser jobs; website changes require a local UI build but
do not select the separate package-contract job unless dependencies change.

## Verification and next boundaries

The baseline is main commit `7035ceb`, with UI version `0.4.0`.
Independent migration expectations preserve 47 components, npm export targets,
JSR entries, peer compatibility, stylesheet side effects, and 62 public routes.
Production tests check SEO, redirects, keyboard behavior, and accessibility.

1. Preparation contracts and explicit path ownership: committed separately.
2. Workspace moves and the necessary wiring: this batch.
3. Real tarball consumer installations outside the workspace: next batch.
4. Changesets and replacement release automation: separate PR.

Existing symlink-based consumer tests are not equivalent to step 3. Blocks,
registry work, and changelog-page redesign remain parked.
