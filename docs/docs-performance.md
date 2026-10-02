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

## Local baseline

Measured October 2, 2026, on macOS ARM64 with Node 24.14.0. Build figures are
the median of three sequential builds; search figures are the median of 100
in-process queries. The generated corpus has two sections and a short code fence
per page, with repeated prose. It does not represent a varied real-world corpus.

| Pages | Build median | Total output     | Search index    | Search computation median |
| ----- | ------------ | ---------------- | --------------- | ------------------------- |
| 100   | 301 ms       | 1,936,786 bytes  | 244,035 bytes   | 0.15 ms                   |
| 1,000 | 4,245 ms     | 64,914,284 bytes | 2,446,335 bytes | 1.55 ms                   |

Index parsing p95 was 0.14 ms and 1.33 ms respectively; search computation p95
was 0.20 ms and 1.99 ms. The static shell is 5,628 gzip bytes. A separate hydrated
React counter fixture adds 69,177 gzip bytes across three JavaScript assets.
These figures exclude custom integrations and consumer island code.

The manual benchmark enforces output/index ceilings of 2.4 MB/300 KB for 100
pages and 80 MB/3 MB for 1,000 pages, a 6 KB gzip shell ceiling, a 90 KB gzip
counter-island ceiling and a 20 ms in-process search p95 ceiling. Run it without
concurrent workloads; timing budgets are local regression checks, not service
level promises. Index gzip sizes were 2,953 and 27,905 bytes; repeated fixture
prose compresses unusually well and is not a realistic transfer-size forecast.

These are warm local filesystem measurements, not CI budgets or browser latency
guarantees. Search figures exclude downloading and parsing the index, DOM updates,
and slower client hardware. Each page repeats the full generated navigation, so
output grows faster than page count in this fixture. Before supporting much larger
sites, measure a real corpus and consider curated navigation and a smaller search
index. Do not add a search service based on these synthetic timings alone.

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
