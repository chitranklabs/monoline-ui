# Monoline Docs — Engineering Guidelines

These rules apply to the Docs package and related demo, consumer, build and publishing work. [../../PLAN.md](../../PLAN.md) is the release tracker.

## Product and architecture

- Build for library/SDK authors and SaaS/API teams. Keep the Monoline design; Astro is the compilation engine, not the product configuration users must learn.
- `monoline-docs.yml` is primary; optional JavaScript configuration uses the same validation and normalized contract.
- Keep one production renderer and one route manifest. Rendering, navigation, links, search, sitemap and exports consume that manifest.
- Static HTML is the default. React is optional and hydrates only explicit islands. Basic reading and navigation must work without JavaScript.
- Reuse semantic Monoline tokens in both light and dark modes. Do not import React UI components into the static shell or copy an entire framework theme.
- Prefer native HTML/CSS and installed dependencies. Introduce separate packages/plugins only for demonstrated ownership or dependency needs.

## Configuration and content safety

- Validate public input before building. Reject misspelled options, invalid values, route collisions and unsafe paths with useful source-specific errors.
- Wire every accepted option into behavior. Do not ship silent no-op configuration or change deprecated-alias precedence accidentally.
- Keep `title`, `navTitle` and `seoTitle` separate. Slugs define public URLs independently of source filenames.
- Astro-reserved frontmatter such as `layout` must not escape Monoline's metadata boundary into unintended imports.
- Filter production drafts and search/index exclusions consistently. Exported Markdown and AI indexes must not leak unpublished content.
- MDX and JavaScript configuration are trusted executable author input. Never claim sandboxing of untrusted content.
- Credentials must not enter generated output. Validate link protocols and asset paths; remote fetching/integration behavior must be explicit.

## Output and deployment

- Build in owned temporary staging, validate, then promote managed files. Preserve last-good output on failure and unrelated files in output directories.
- Never write generated source into installed packages, `node_modules` or consumer source trees. Clean up only directories/files owned by the operation.
- Preserve consumer configuration isolation, root/subpath support and clean/directory URL semantics.
- Serve portable static output. Hosting-provider configuration must not become a runtime requirement.
- Keep npm and JSR promises separate; verify compatibility before claiming support. Publishing requires explicit user approval.

## Accessibility and design

- Use semantic landmarks, one page H1, visible focus and meaningful names for controls.
- Drawers/dialogs require keyboard operation, focus management, background interaction exclusion and Escape handling.
- Honor `hidden`, reduced motion and print behavior. Reserve image dimensions and avoid horizontal viewport overflow.
- Verify changed shell behavior on desktop/mobile and both themes. Do not call visual work complete without actual visual inspection.
- Keep copy factual and useful. Do not invent metrics, testimonials, compatibility or future-ready guarantees.

## Verification and time budget

- Follow the plan's functionality-first order. Keep essential boundary checks during implementation; defer broad documentation/test expansion and benchmarks to the release gate.
- Extend existing fixtures instead of creating parallel test infrastructure. Add a regression check for meaningful changed behavior, not tests that merely mirror implementation.
- Use targeted formatting/lint, the package build and the smallest relevant test. Browser work uses the existing production-output fixture.
- A public import, dependency or packaging change requires the existing packed-consumer check. An output-safety change requires failure/preservation coverage.
- Report blocked or unrun checks honestly. Prior runs are historical evidence, not proof of the current tree.

Useful existing checks from the repository root:

```sh
pnpm exec prettier --check <changed-files>
pnpm exec eslint <changed-source-files>
pnpm --filter @chitrank2050/monoline-docs build
pnpm --filter @chitrank2050/monoline-docs typecheck
pnpm exec vitest run packages/docs/src/<affected>.test.ts
pnpm --filter @chitrank2050/monoline-docs test:engine
pnpm --filter @chitrank2050/monoline-docs test:consumer
node packages/docs/test-browser.mjs
pnpm --filter @monoline/docs-demo build
git diff --check
```

Prefix verbose commands with `rtk` when it supports the command. Use `DOCS_BROWSER_CHANNEL=chrome` only when installed Chrome is the intended local browser. Do not run every command for every edit.
