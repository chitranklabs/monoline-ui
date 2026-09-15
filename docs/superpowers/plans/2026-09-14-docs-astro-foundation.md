# Astro engine foundation implementation plan

> Execute inline with the executing-plans skill. Keep the current branch and
> leave commits user-controlled.

**Goal:** Add an internally callable, packaged Astro renderer for Markdown and
MDX, without changing the public builder before parity is established.

**Architecture:** Existing configuration/content discovery supplies validated
routes to one internal Astro integration. Render into an owned temporary
directory and return its location with an explicit cleanup function. No final
output writes or public engine flag in this batch.

**Tech stack:** Node 24.14+, TypeScript, Astro 7.3.2, MDX integration 8.0.1,
native Markdown processor 0.4.1,
existing pnpm, Node assertions, and Vitest checks.

**Spec:** [Approved integration design](../specs/2026-09-14-docs-astro-engine-design.md).

## Constraints

- Stay on `feat/docs-astro-engine`; no publish, deploy, or PR creation.
- Preserve the CLI, public build/dev exports, and existing Markdown behavior.
- Use public Astro exports; ignore consumer Astro config and filesystem pages.
- Keep staging/cache/source directories owned and disposable; never clear the
  configured final output or generate files in consumer source/node_modules.
- React, final HTML indexing, output promotion, and CLI switching are later batches.

## Task 1: Internal renderer and integration checks

**Files:** `packages/docs/src/astro-engine.ts`,
`packages/docs/src/astro-page.astro`, `packages/docs/test-engine.mjs`,
`packages/docs/package.json`, `packages/docs/build.mjs`, `pnpm-lock.yaml`.

**Interface:** `buildAstroSite(config: MonolineDocsConfig)` returns
`Promise<{ directory: string; pages: DocumentationPage[]; dispose(): Promise<void> }>`.
It is internal, with no package export added. On failure it cleans its temporary
workspace; on success the caller disposes it after inspection/promotion.

- [x] Add a runnable failing integration check importing the missing compiled
      engine. Fixtures include static MDX, a local Astro table component, Markdown,
      an unrelated throwing Astro config, and an unrelated `src/pages` route.
- [x] Confirm failure with `node packages/docs/test-engine.mjs`.
- [x] Add pinned dependencies and implement an integration that injects one
      prerendered catch-all route, backed by explicit imports from discovered pages.
- [x] Package the runtime `.astro` route alongside compiled JS/declarations.
- [x] Verify generated MDX/table HTML, no page scripts, nested routes, escaped
      Markdown HTML, draft exclusion, and source-context errors.
- [x] Verify duplicate routes/missing home fail, configured output is untouched,
      cleanup is idempotent, and source/config/node_modules gain no generated files.

## Task 2: Packed consumer and regression coverage

**Files:** `packages/docs/test-consumer.mjs`, `packages/docs/test-engine.mjs`,
`docs/docs-prototype.md`.

The existing packed consumer installs dependencies outside the workspace. Reuse
that installation for engine verification so CI does not add another install.

- [x] Export `verifyEngine(packageDirectory, fixtureParent)` from the test harness;
      direct execution verifies the local built package, while the consumer harness
      points it at the installed package and consumer root.
- [x] Run it from the packed consumer, keeping internal imports diagnostic-only.
- [x] Confirm `pnpm --filter @monoline/docs test:consumer` passes old CLI checks
      and the new staged-engine checks.
- [x] Run `pnpm exec vitest run packages/docs`, package typecheck, focused ESLint,
      formatting/Markdown checks, and `git diff --check`.
- [x] Document that Astro is installed and tested internally but the public CLI
      remains on the current renderer until the next parity batch.

## Completion

- [x] Review the diff for regressions and fix actionable findings.
- [x] Record verified results and provide commit/PR materials without creating
      a commit or PR.

Suggested commit: `feat(docs): add staged Astro MDX engine foundation`.

Completed September 15, 2026. Verified 77 existing Docs tests, direct and
installed-tarball engine checks, package typecheck, ESLint, formatting/Markdown,
and the eight-page demo build. The read-only review's cleanup/isolation assertions
were added and passed. No CLI engine switch, commit, PR, or deployment occurred.
