# Contributing to monoline-ui

Thank you for considering contributing to Monoline UI. Every improvement - whether it's a bug fix, a new component, or a documentation clarification - makes the library better for everyone.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- **Node.js**: `>=22.14.0`
- **pnpm**: `11.8.0` or higher

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

This is a flat single-package repository - no monorepo, no workspace sync:

- `src/components/` - UI component source (what you'll work in most)
- `src/foundations/` - CSS token layer and design foundations
- `app/` - Next.js playground for manual testing

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
pnpm lint        # ESLint + Markdownlint
pnpm typecheck   # TypeScript (no emit)
pnpm test        # Vitest test suite
pnpm build:lib   # Published-package build and consumer contract checks
pnpm format      # Prettier
```

## Adding a New Component

1. Create `src/components/<name>/` with an `index.ts` and component file(s).
2. Follow the RSC-first pattern - server component by default, `"use client"` only for interactive subcomponents.
3. Export from the component's `index.ts` using the dot-notation pattern (`Component.Sub`).
4. Run `pnpm run sync-exports` to update the root `exports` map.
5. Add a usage example in `app/` so it's visible in the playground.
6. Add at minimum a smoke test under `src/components/<name>/`.

## Pull Request Process

1. **Open an issue first** for any non-trivial change so we can align on the design.
2. **Keep PRs focused** - one component or one fix per PR.
3. **CI must pass** - branch name, PR title, commit history, lint, types, and tests are all validated automatically.
4. A maintainer will review once CI is green.

## Release Process

Releases are fully automated:

1. **Prepare** - run the `Release 1 - Prepare PR` workflow. It bumps the version and updates `CHANGELOG.md`.
2. **Finalize** - merge the PR. `Release 2 - Finalize Tag` publishes to npm automatically.

## Need Help?

Open a [GitHub Discussion](https://github.com/chitranklabs/monoline-ui/discussions) or file an issue with the `question` label.

Happy building. ✨
