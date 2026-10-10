# Docs verification and performance

Run these checks from the repository root after installing workspace dependencies:

```sh
pnpm --filter @chitrank2050/monoline-docs build
pnpm exec vitest run packages/docs
node packages/docs/test-browser.mjs
node packages/docs/benchmark.mjs
```

Browser verification uses the installed Playwright Chromium headless shell. For an
installed local Chrome, set `DOCS_BROWSER_CHANNEL=chrome`. It tests production
output at `/` and `/handbook/`, including navigation, section links, search,
keyboard behavior, persisted themes, mobile overflow, accessibility, missing
pages, excluded drafts, and navigation without JavaScript.

The existing browser CI job runs this check for Docs package, demo, shared color
token, and dependency changes. Docs-only changes do not build the Next.js website.
Benchmarks are manual so they do not add time to every pull request.

## Performance budgets

The manual benchmark enforces these regression ceilings:

| Check                              | Ceiling         |
| ---------------------------------- | --------------- |
| 100-page output / search index     | 2.4 MB / 300 KB |
| 1,000-page output / search index   | 80 MB / 3 MB    |
| Static shell JavaScript            | 6 KB gzip       |
| Optional counter island JavaScript | 90 KB gzip      |
| In-process search p95              | 20 ms           |

Run benchmarks without concurrent workloads. These are local regression checks,
not browser latency or hosting guarantees. The generated corpus repeats prose;
measure representative content before promising larger-site performance.
Search timings exclude network transfer, index parsing and DOM updates.
The script prints current measurements; saved reports are not required.

## Shared colors

Docs ships a generated subset of Monoline UI's light/dark semantic colors. The
package build checks the tracked stylesheet against the UI source and fails on
drift. After intentionally changing UI colors, regenerate it:

```sh
node packages/docs/sync-tokens.mjs
node packages/docs/sync-tokens.mjs --check
```

The site builder combines token and layout CSS into one output stylesheet. Built
consumers do not need the UI source tree, React, or another CSS request.
