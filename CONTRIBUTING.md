# Contributing to monoline-ui

This guide covers Monoline UI, Monoline Docs and their demonstration sites.
Use the workspace that owns the behavior you are changing; shared tooling and
CI configuration live at the repository root. See the
[documentation index](./docs/README.md) to find consumer guides and
[architecture](./docs/architecture.md) for package and build boundaries.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- **Node.js**: `>=24.14.0`
- **pnpm**: the version declared in the root `packageManager` field
- **Gitleaks**: required by the pre-commit secret scan
- **OSV-Scanner** and **zizmor**: recommended for the local pre-push and workflow checks; CI always enforces them

### Local Setup

1. **Clone the repo**:

   ```bash
   git clone https://github.com/chitranklabs/monoline-ui.git
   cd monoline-ui
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

   Dependency installation also installs the repository's Lefthook-managed Git hooks. Do not add Husky alongside Lefthook.

3. **Start the relevant consumer site**:

   ```bash
   pnpm dev                              # UI website
   pnpm --filter @monoline/docs-demo dev  # Docs demo
   ```

   Both commands build their package before starting the site. The Docs preview
   watches content and assets; restart it after configuration changes.

4. **Build the relevant package or site**:

   ```bash
   pnpm build:lib                         # UI package
   pnpm --filter @chitrank2050/monoline-docs build # Docs package
   pnpm build:docs                        # Docs package and demo
   pnpm build:all                         # Both packages and sites
   ```

## Development Workflow

### Repository Structure

This pnpm workspace contains two packages and their demonstration sites:

- `packages/ui/src/components/` - React UI component source
- `packages/ui/src/foundations/` - CSS token layer and design foundations
- `apps/website/app/` - Next.js UI documentation and playground
- `packages/docs/` - Static documentation builder and its package verification
- `apps/docs-demo/` - Documentation site built with Monoline Docs

Docs package and demo work follows [packages/docs/AGENTS.md](./packages/docs/AGENTS.md).
Its [README](./packages/docs/README.md) describes the public workflow, and its
[roadmap](./packages/docs/ROADMAP.md) tracks package-specific priorities. Keep
reusable Docs styling and behavior in the package so installed consumers receive
the same functionality as the demo.

### Branch Naming

Branches are validated in CI by [git-hygiene](https://github.com/chitranklabs/git-hygiene). Use the format `type/description`:

```text
feat/add-breadcrumb-component
fix/footer-link-polymorphism
docs/contributing-guide
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`, `maintenance`.

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org). Format:

```text
type(scope): description

feat(button): add loading state variant
fix(footer): resolve asChild hydration mismatch
```

git-hygiene validates every commit message locally via Lefthook.

### Quality Checks

Before opening a PR, run:

```bash
pnpm check:static  # Generated files, formatting, lint, types, and unit tests
pnpm check:package # UI tarball: React 18/19, types, Next.js RSC, and CSS
pnpm check:website # Production UI website, SEO, browser, and accessibility checks
pnpm check:docs    # Docs engine, packed consumers, browser checks, and demo build
```

Run `pnpm check:all` for all local package and website checks. CI additionally
runs its secret, dependency and workflow security scanners. `pnpm build:all`
builds both packages and both sites. `pnpm build:docs` builds only Docs and its
demo; `pnpm build` builds UI and its website.

`pnpm clean-build` removes generated artifacts and installed dependencies,
then reinstalls from the preserved lockfile and builds all workspaces.

UI package contracts pack `packages/ui/dist` once and install it into independent
temporary projects. They do not use workspace aliases or symlink the library.
Downloads use pnpm's cache; uncached dependencies require registry access.
Lifecycle scripts are disabled, installs/builds have timeouts, and temporary
projects are removed on success or failure. `pnpm test:react18` runs only the
React 18 consumer against an already-built library for focused diagnosis.

Docs checks build the engine, install the Docs tarball into independent npm and
strict pnpm consumers, exercise production browser fixtures, and build the demo.
Run `pnpm test:browser:install` before either site's browser checks when Chromium
is not installed. Run focused checks during development and `pnpm check:all`
before release.

### CI selection and maintenance

`pnpm typecheck` prepares library declarations and the package export map,
then checks workspace typecheck scripts and root tooling. It does not build runnable
JavaScript or CSS; build the relevant package before running consumers directly.
Package contracts and production site checks exercise the full build.
UI website-only edits build the UI dependency and run website checks without
running the separate UI unit or package-contract checks. UI package and shared
dependency changes exercise both UI consumers and the website. Docs package or
demo changes exercise Docs unit tests, the demo build, standalone consumers and
production browser fixtures. Shared dependency changes exercise both products.

CI reports required checks for every PR, including skipped work. Repository-guide
and formatting-only edits receive formatting, Markdown lint, CI selection tests
and secret scanning without unrelated application builds. Package and site
content stays subject to the checks selected by its owning workspace.

The path filters live in `.github/workflows/ci.yml`. Run `pnpm test:ci` after
editing them; the tests parse the workflow itself and cover mixed changes,
deleted paths, required checks, and maintenance triggers. `pnpm check:static`
also includes these tests. The YAML parser and glob matcher are development
dependencies, not library runtime dependencies.

Main-branch push exclusions are retained, and code changes still receive
post-merge verification. Zizmor runs when workflows or composite actions change.
Production browser checks install only Chromium's headless shell; keep that
installation command aligned if a browser project later adds a `channel`.

Scorecard runs weekly, on branch-protection events, and on relevant security or
build-configuration pushes. Ordinary component changes can take until the next
weekly scan to appear in its results. Label assignment still runs on PR updates;
label colors and descriptions are synchronized only when label configuration
merges into `main`, or through the Labeler workflow's manual run on `main`.

## Adding a New Component

For a React UI component:

1. Create `packages/ui/src/components/<name>/` with an `index.ts` and component file(s).
2. Follow the RSC-first pattern - server component by default, `"use client"` only for interactive subcomponents.
3. Export from the component's `index.ts` using the dot-notation pattern (`Component.Sub`).
4. Run `pnpm run sync-exports` to update the library export map and website catalog.
5. Add a usage example in `apps/website/app/` so it's visible in the playground.
6. Add at minimum a smoke test under `packages/ui/src/components/<name>/`.

For a Docs authoring component, follow [the Docs guidelines](./packages/docs/AGENTS.md),
keep its implementation and styles under `packages/docs/src/`, and add a realistic
authoring example to `apps/docs-demo/content/`. Extend the existing package
fixtures for public import or runtime behavior changes. Preserve static HTML
behavior and make React hydration explicit when needed.

## Pull Request Process

1. **Open an issue first** for any non-trivial change so we can align on the design.
2. **Keep PRs focused** - one component or one fix per PR.
3. **CI must pass** - branch name, PR title, commit history, lint, types, and tests are all validated automatically.
4. A maintainer will review once CI is green.

## Release Process

Package releases require explicit intent; changes to either site alone do not
bump a package version.

1. **Describe** - run `pnpm changeset` for a user-visible package change. Select
   `@chitrank2050/monoline-ui` or `@chitrank2050/monoline-docs` and the appropriate
   bump. Use separate changeset files when both packages change.
2. **Prepare** - run `Release 1 - Prepare PR` for UI or `Docs Release 1 - Prepare PR`
   for Docs on `main`. Each workflow consumes only its package's changesets.
3. **Finalize** - merge the prepared release PR. The corresponding finalize
   workflow verifies the artifacts and creates the package tag and GitHub release.
   UI publishes to npm and JSR; Docs publishes to npm.

Read the [shared release guide](./docs/releases.md) and, for Docs,
[the Docs release guide](./docs/docs-release.md) before preparing or retrying a
release. Git-hygiene validates commits and branches; it does not choose versions.

## Need Help?

Open a [GitHub Discussion](https://github.com/chitranklabs/monoline-ui/discussions) or file an issue with the `question` label.

Happy building. ✨
