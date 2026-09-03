# Contributing to monoline-ui

Thank you for considering contributing to Monoline UI. Every improvement - whether it's a bug fix, a new component, or a documentation clarification - makes the library better for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- **Node.js**: `>=24.14.0`
- **pnpm**: `11.18.0` or higher
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

3. **Start the playground**:

   ```bash
   pnpm dev
   ```

4. **Build the library**:

   ```bash
   pnpm build:lib
   ```

## Development Workflow

### Repository Structure

This is a pnpm workspace with one library and one website:

- `packages/ui/src/components/` - UI component source (what you'll work in most)
- `packages/ui/src/foundations/` - CSS token layer and design foundations
- `apps/website/app/` - Next.js playground for manual testing

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
pnpm check:static   # Generated files, formatting, lint, types, and unit tests
pnpm check:package  # Published package and React 18 consumer contracts
pnpm test:docs      # Production docs, SEO, browser, and accessibility checks
```

Run `pnpm check:all` when you need the complete local equivalent of CI.

### CI selection and maintenance

CI runs for every PR so required checks are always reported. Markdown-only edits
outside `apps/website/app/` and `packages/ui/src/`, and formatting-configuration PRs, run formatting,
Markdown lint, CI selection tests, and secret scanning without unrelated
TypeScript, unit, or browser checks.
Changes to the library, shared TypeScript configuration, or build-validation
workflows run package contracts and production documentation checks as well.
Playground-only changes build the local UI dependency but do not run the separate
package-contract CI job.

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

1. Create `packages/ui/src/components/<name>/` with an `index.ts` and component file(s).
2. Follow the RSC-first pattern - server component by default, `"use client"` only for interactive subcomponents.
3. Export from the component's `index.ts` using the dot-notation pattern (`Component.Sub`).
4. Run `pnpm run sync-exports` to update the library export map and website catalog.
5. Add a usage example in `apps/website/app/` so it's visible in the playground.
6. Add at minimum a smoke test under `packages/ui/src/components/<name>/`.

## Pull Request Process

1. **Open an issue first** for any non-trivial change so we can align on the design.
2. **Keep PRs focused** - one component or one fix per PR.
3. **CI must pass** - branch name, PR title, commit history, lint, types, and tests are all validated automatically.
4. A maintainer will review once CI is green.

## Release Process

Releases are fully automated:

1. **Prepare** - run the `Release 1 - Prepare PR` workflow. It bumps the version and updates `CHANGELOG.md`.
2. **Finalize** - merge the PR. `Release 2 - Finalize Tag` verifies the artifacts, publishes to npm and JSR, and then creates the GitHub release.

## Need Help?

Open a [GitHub Discussion](https://github.com/chitranklabs/monoline-ui/discussions) or file an issue with the `question` label.

Happy building. ✨
