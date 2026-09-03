# Workspace migration safeguards

## Intent

Separate the existing React library and Next.js website without changing their
public behavior. This preparation batch leaves the flat layout and release
workflows intact. It does not introduce Astro, Changesets, or new packages.

## Baseline

The baseline is main commit `7035ceb`, with UI version `0.4.0`.
`scripts/migration-contract.test.mjs` independently fixes the existing npm export
map, JSR component entries, peer compatibility, stylesheet side effects, and
62 public routes. Do not regenerate this baseline from the export generator.
Intentional public API changes must review and update these expectations.

Existing package tests continue to check built exports and client boundaries.
The production documentation suite remains responsible for redirects, SEO,
and browser behavior. True tarball-install tests are a subsequent batch;
the existing symlink-based consumers are not a substitute for those tests.

## Path ownership

`scripts/lib/project-paths.mjs` separates repository, library, and website roots.
All still resolve to the repository root today. Root selection is explicit and
independent of the invoking shell's current directory. Tests also exercise a
split layout with spaces in its path.

- Library ownership: source, build output, npm manifest, and JSR manifest.
- Website ownership: its TypeScript configuration and temporary source aliases.
- Repository ownership: build tools, shared policy documents, and current assets.

The build and export scripts consume this mapping. The later migration must also
move the bundler configuration, update package manifests, remove website source
aliases in favor of package exports, and assign package README/assets ownership.
This helper is preparation, not a claim that the complete build already supports
workspaces. `package.json.lib` remains unchanged until that migration.

## Review boundaries

1. Capture migration contracts and prepare path ownership.
2. Move UI and website with the necessary build, CI, hook, and deployment wiring.
3. Validate real tarball consumers outside the workspace.
4. Introduce Changesets and replace the old release owner in a separate PR.

Preserve historical release data and tags. No release or version bump is part of
the structural move. Blocks, registry, and changelog page redesign remain parked.

## Verification

Run `pnpm test:ci`, `pnpm sync-exports:check`, `pnpm check:package`,
`pnpm typecheck`, `pnpm test`, and `pnpm test:docs` before accepting the migration.
The migration and path contracts run through the existing CI test command; they
do not add a separate GitHub Actions job.
