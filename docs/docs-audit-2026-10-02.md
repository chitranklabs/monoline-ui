# Monoline Docs replacement-readiness audit

**Decision: hold the release.** Monoline has a useful static documentation foundation, but the current completion checklist does not establish that it can replace an established documentation platform. Fix the confirmed output-preservation defect before any release; close the replacement gates in [PLAN.md](../PLAN.md) before marketing broad replacement readiness.

**Follow-up — R0 completed October 2, 2026:** A1's caught-promotion failure path is corrected and verified; the initial findings below remain the historical audit record. See [R0 evidence](../PLAN.md#r0--recover-safely-from-failed-output-promotion) and the [recovery procedure](docs-release.md#local-output-promotion-and-recovery). Other replacement gates and the release hold remain open.

**Audit date:** October 2, 2026. **Baseline:** `e003664` on `feat/docs-astro-engine`, initially clean. This audit changes documentation only. It does not authorize implementation, publication or deployment.

**Confirmed comparison targets:** MkDocs (including Material for MkDocs) and Astro Starlight, clarified by the user after the initial audit. Competitor statements below describe official documentation retrieved for this review, not an exhaustive inventory of all October 2026 releases or community plugins.

## What is already worth keeping

- Astro produces static HTML; the shell does not require React hydration. React islands are explicit. Basic reading and navigation have a no-JavaScript path.
- YAML and JavaScript configuration share validation. A common route manifest connects navigation, links, generated reference pages, search and exports.
- Production drafts are filtered. Broken rendered links and fragments fail builds. Output ownership and symlink checks protect unrelated files.
- Native dialogs, visible focus, skip navigation, reduced-motion and print styles, semantic components, scoped search and local assets are already present.
- Packed npm and strict pnpm adoption fixtures, a real library migration rehearsal, and independent release workflows exist. Their previous results remain historical evidence; this audit did not rerun every consumer or release workflow.

The recommendation is to develop this foundation, not replace the renderer or adopt a new theme framework. A new dependency should resolve a measured limitation or a specific migration requirement.

## Method and fresh evidence

Used ui-ux-pro-max queries for keyboard focus, web touch targets and Astro hydration; Web Interface Guidelines; core, documentation, testing and SEO posture; systematic debugging for reproduced defects; and brainstorming/writing-plans for the revised roadmap. Codebase-memory discovery preceded scoped source review and Kedvio outlines.

| Check run on this tree                                            | Result                                                        | Limit                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `pnpm exec vitest run packages/docs/src`                          | 209 tests across 14 files passed                              | Includes prototype-renderer tests; not all assertions exercise Astro       |
| `pnpm --filter @monoline/docs-demo build`                         | Package and ten-page demo built                               | Local macOS environment                                                    |
| Package typecheck                                                 | Passed                                                        | No expanded OS/runtime matrix                                              |
| `DOCS_BROWSER_CHANNEL=chrome node packages/docs/test-browser.mjs` | Passed `/`, `/handbook/`, clean `/ask-widget/` fixture routes | Chromium, not Safari/Firefox or manual assistive technology                |
| Actual demo audit, light/dark at 320/375/768/1440px               | No axe violations or viewport overflow on the homepage        | Eight homepage states, not a site-wide WCAG certification                  |
| Mobile search and forced-colors screenshots                       | Captured and visually inspected                               | Desktop emulation does not exercise a real phone keyboard or screen reader |
| `node packages/docs/benchmark.mjs`                                | All existing budgets passed                                   | Synthetic repetitive content, warm local builds and in-process search      |
| Output-promotion failure probe                                    | Confirmed partial overwrite after failure                     | Disposable output directory; no consumer output touched                    |
| Unicode search-highlight probe                                    | Confirmed incorrect highlighted substring                     | Real search module with a DOM fixture                                      |

The first browser run inside the sandbox failed during server startup/cleanup. The rerun with local server/Chrome permission passed. The extra demo probe initially used the wrong accessible name for the search trigger; correcting the probe to `Search` completed it. Neither failure is counted as a product UI failure.

Fresh screenshot and probe output directory: `/private/tmp/monoline-oct-audit`. Representative files inspected: `demo-light-1440.png`, `demo-dark-375.png`, `demo-light-320.png`, `cards-root-light-375.png`, `components-root-dark-1440.png`, `search-guides.png`, `search-mobile.png`, and `forced-colors.png`. The extra probe is `/private/tmp/monoline-oct-ui-probe.mjs`; measurements are in `ui-probe.json`. These temporary artifacts are not durable CI evidence; capture the accepted matrix in CI when implementing the gates.

## Confirmed defects and release risks

Severity describes impact on the intended replacement, not just visual polish. **P1** blocks release or a central replacement claim. **P2** requires a planned correction or an explicit, tested support boundary. **P3** is polish. A capability gap is not mislabeled as a regression.

### A1 — P1: final output promotion does not preserve last-good files on write failure

**Confirmed defect.** `packages/docs/src/output.ts:128` writes final files one at a time; stale files are removed before the manifest is replaced at line 141. Preflight checks ownership/symlinks but does not make the promotion transactional. Staging and validation protect against compilation failures, not a failure while changing final output.

Reproduction using the built `publishFiles` module in a disposable directory:

1. Publish tracked `a.html = old-a` and `b.html = old-b`.
2. Replace the tracked `b.html` file with a directory to create a deterministic write failure.
3. Publish `a.html = new-a` and `b.html = new-b`.
4. The second write throws `EISDIR`; reading `a.html` returns `new-a`.

The fixture deliberately introduces an abnormal destination; it proves the write-failure path lacks rollback. Disk-full, permission and interrupted-write recovery were not separately fault-injected. The existing last-good-output promise must cover the promotion boundary, or clearly narrow its guarantee. Closure: failure-injection tests for write, delete and manifest replacement, preserving all prior bytes and unrelated files; define crash and concurrent-build behavior separately.

### A2 — P1 for replacement: language configuration is not localization

**Confirmed capability gap.** `packages/docs/src/config.ts:70` exposes one `lang`; `astro-page.astro:103` applies it to HTML. Shell labels remain English (`astro-page.astro:163`, `:266`, `:393`, `:422`; `search.js:103`), and the document has no direction contract. The public configuration has no locale routing, translation mapping, fallback, language switcher or version model.

Setting `lang: ar` therefore does not deliver an Arabic interface or RTL navigation. Scope must include localized shell strings, correct content language, logical layout direction, route identity and search behavior. Versioning needs independently addressable versions, equivalent-page switching, missing-page fallback and canonical/indexing policy. Do not simulate either feature using header links alone.

### A3 — P1 for migration: no tested MkDocs/Starlight conversion contract

**Confirmed gap in supported surface and evidence.** `content.ts:48` requires frontmatter and `:86` requires an explicit title; unknown metadata fails. These are valid native rules, but existing Markdown trees and foreign frontmatter need conversion. `config.ts:70` has no redirect/alias contract. The Ask Widget rehearsal is useful but does not prove MkDocs extension syntax, Starlight components, old heading anchors, locale/version URLs or custom metadata survive conversion.

Closure requires a source inventory, deterministic conversion or actionable unsupported-feature diagnostics, an old-to-new URL/fragment manifest and packed-consumer rehearsals from both platforms. Preserve source trees. A migrated site must either preserve an old URL or record an intentional redirect/removal; silent content loss fails the gate.

### A4 — P2: Unicode search highlighting uses incompatible offsets

**Confirmed defect.** `search.js:68` normalizes text with NFKC, then applies normalized offsets to the original string at `:89`. Normalization can change string length. With title/body `ﬃ setup` and query `setup`, the actual search DOM highlights `tup`, not `setup`.

Search matching works for this example; highlighting is wrong. Closure: offset-safe highlighting with compatibility characters, combining marks and non-Latin fixtures, preserving the authored text and safe text-node construction.

### A5 — P1 evidence gap: scale budgets do not establish browser responsiveness

**Measured architectural cost plus missing evidence.** Every generated page repeats its navigation. The benchmark grows from 1.94MB at 100 pages to 64.91MB at 1,000 pages, about 33.5 times output for ten times the page count. `search.js:8` scans, normalizes and sorts the entire in-memory index on each input; `:157` loads the entire JSON index on first search. The first 20 results are rendered, but limiting rendering does not limit scanning or transfer.

This is not proof that present search is slow: current local computation is fast. It is proof that local query timings alone do not establish cold-search latency, input responsiveness or large-site scalability. Measure representative prose/API/code content, transfer, parsing, heap, DOM work and navigation size under a fixed mobile CPU/network profile. Compare the current design with partitioning/pre-normalization and Pagefind before choosing a replacement. Preserve no-JS navigation.

### A6 — P2: mobile header and controls need a reading-oriented layout

**Measured UX finding.** Actual demo `.site-header` is 261.30px high at 320px and 375px widths, 192.19px at 768px, and 153.23px at 1440px. At the probe's 900px height, mobile chrome consumes 29% of the viewport. The announcement, brand row, actions, links and section tabs compound this cost (`docs.css:294`, `:344`, `:851`). A real phone keyboard was not tested.

The navigation toggle is 36×36px; mobile search is 36×32.38px; page-copy buttons are about 23.09px high (`docs.css:93`, `:671`). These miss a proposed 44px primary-touch target, but are not automatically WCAG failures: WCAG 2.2 AA uses 24 CSS pixels with exceptions, including spacing. Audit target spacing and exceptions before claiming a violation. Close with a compact mobile reading header, usable action priorities, 44px primary controls, 320px reflow, zoom/text-spacing checks and keyboard-safe search.

### A7 — P2: test evidence includes an inactive Markdown renderer

**Confirmed test-scope risk.** `markdown-features.test.ts:4`, plus some build/authoring tests, import `renderMarkdown` from the static prototype. Production uses Astro's Markdown processor in `astro-engine.ts:492`. Production engine/browser fixtures do exercise some overlapping features, so coverage is not absent. However, passing prototype tests cannot prove all production Markdown edge cases.

Map each required authoring behavior to a production-engine assertion. Retire or explicitly label prototype-only tests after checking consumers. Avoid adding features to both implementations merely to satisfy duplicated tests.

### A8 — P2: Markdown and AI exports have a declared fidelity ceiling

**Confirmed implementation limit.** `astro-engine.ts:45` rewrites export links with line/regular-expression processing; `:632` derives MDX exports from rendered section text. Existing support documentation correctly warns about link/image fidelity and lost MDX code formatting. This is insufficient for a general portable-export promise.

Close with parser-based Markdown link/image rewriting and a defined MDX-to-readable-Markdown contract, including code fences, tables, relative assets, nested link syntax and subpaths. Audit draft/noindex exclusions again after route-model changes. `llms.txt` is an export surface, not evidence of complete AI retrieval quality.

### A9 — P2: customization has no stable extension boundary

**Public-surface gap.** Configuration permits custom CSS and script URLs but no documented shell slots, Markdown transform hooks or typed lifecycle extension API. That can be acceptable for a constrained theme; it makes established custom workflows costly to migrate. Expose only migration-backed extension points, with ordering, errors, route/visibility invariants and packed-consumer coverage. Do not create a theme marketplace as a substitute for a small supported API.

### A10 — P2: authoring and media parity must be demonstrated through output

**Support gap, not a claim that every syntax is absent.** The configuration does not expose a Markdown extension contract; no first-class math/Mermaid support was found in the reviewed production surface. `Figure.astro:23` always lazy-loads images, with no above-the-fold priority option. It reserves dimensions, which is good, but critical media needs a different loading policy. Native Markdown and MDX image optimization were not comprehensively measured.

Build a production authoring corpus for footnotes, task lists, admonitions, tabs, filenames/highlights/annotations, diagrams, math, tables, assets and raw HTML policy. Classify each as supported, convertible, opt-in or rejected with diagnostics. Raw HTML is escaped in ordinary Markdown (`astro-engine.ts:510`); document migration implications instead of assuming HTML-heavy Markdown will render unchanged.

## UI and accessibility assessment

The desktop shell has coherent reading/sidebar/TOC hierarchy, restrained tokens and recognizable active navigation. Light and dark screenshots are consistent. Mobile cards stack properly, code overflow stays inside content, the search dialog has labeled controls and visible focus, and forced-colors output remains readable. No visual redesign is justified solely by competitor styling.

The highest-value improvements are mobile reading space, touch sizing, long-page orientation and clearer code-block composition. In the inspected component screenshot, filename, copy action and code body appear as separated blocks; consolidating their visual hierarchy is a P3 improvement, subject to keyboard and no-JS preservation. Search also renders “1 results”; pluralization belongs with the localization work.

| Area                         | Evidence now                                                            | Acceptance still required                                                                       |
| ---------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Keyboard, landmarks, dialogs | Current production Chrome assertions pass                               | Real screen-reader task completion, including search result announcements and tab groups        |
| Contrast                     | Default-theme automated axe passes in tested states                     | Consumer accent/font variants, focus contrast and forced-colors selected-state differentiation  |
| Responsive layout            | Homepage 320–1440px and production mobile fixtures pass overflow checks | 200% text, 400% zoom, WCAG text spacing, landscape and real mobile keyboard/safe areas          |
| Motion and print             | Existing production checks pass                                         | Representative long tables, code groups and diagrams after authoring expansion                  |
| Browsers                     | Chrome current-tree run                                                 | Firefox and WebKit automated journeys; real Safari/iOS and Android smoke tests                  |
| Navigation                   | Static links, active sidebar, TOC and deep-link checks                  | Mobile on-page navigation decision; focus through long sticky headers; locale/version switching |

Manual VoiceOver/NVDA review remains unperformed. An axe pass must not be presented as WCAG 2.2 AA conformance. Use the [W3C target-size criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) for conformance, and the larger touch target as a product usability target.

## Performance and optimization assessment

Fresh benchmark: macOS ARM64, Node 24.14.0, three sequential builds per size. Rounded values below; raw bytes retained for comparison with the prior baseline.

| Pages | Build median | Total bytes | Raw index bytes | Search p95 | JSON parse p95 |
| ----- | ------------ | ----------- | --------------- | ---------- | -------------- |
| 100   | 329ms        | 1,936,786   | 244,035         | 0.207ms    | 0.141ms        |
| 1,000 | 4,536ms      | 64,914,284  | 2,446,335       | 2.058ms    | 1.543ms        |

Shell JavaScript remains **5,628 gzip bytes**. The optional counter island adds **69,177 gzip bytes** in three assets. The 1,000-page index compresses to 27,905 bytes only because this corpus repeats heavily; that compression ratio is unsuitable as a real-site forecast. Fresh initial CLS was approximately 0.00103–0.00105 desktop and 0.00309–0.00369 mobile in the production fixture. These are lab observations, not field percentiles.

Retain the 6KB gzip shell ceiling while adding separate budgets for cold search, HTML/navigation bytes, media, install footprint, peak build memory and rebuild latency. Keep large authoring runtimes off ordinary pages. Do not optimize the small shell while ignoring repeated HTML or full-index transfer.

Use LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at the 75th percentile as eventual field goals, consistent with [Web Vitals](https://web.dev/articles/vitals). Before field data exists, report controlled lab results with hardware, network, CPU, corpus and run counts; do not relabel lab timings as field INP. Keep the stricter existing fixture CLS regression threshold separately.

## Replacement capability matrix

“Ready” here means locally evidenced within the stated scope, not certified production readiness. “Partial” requires additional work or a clearly narrower promise.

| Capability                              | Monoline today                                                | Required replacement outcome                                                                            |
| --------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Static docs, MD/MDX, no-JS reading      | Ready within existing fixtures                                | Preserve during every new subsystem                                                                     |
| YAML-first setup and standalone package | Implemented; historical packed checks                         | Reverify isolated consumers after contract changes; config schema/editor help and migration diagnostics |
| Navigation, TOC, sections and slugs     | Implemented                                                   | Large-tree budgets, stable aliases/redirects and equivalent-page identity                               |
| Local search                            | Partial: scopes, snippets, recent queries, linear index       | Unicode correctness, relevance corpus, localized/version filtering and cold-device budgets              |
| Localized sites and RTL                 | Gap beyond single `lang`                                      | Translated chrome, locale routes, fallback and direction-aware interaction                              |
| Documentation versions                  | Gap                                                           | Version manifests, selectors, support/deprecation notices, scoped search and SEO policy                 |
| MkDocs/Material migration               | Not rehearsed                                                 | Markdown/extensions/config mapping and URL/anchor accounting                                            |
| Starlight migration                     | Not rehearsed                                                 | Frontmatter/components/sidebars/assets mapping and extension inventory                                  |
| Code, cards, tabs, tables               | Broad component base                                          | Output-tested compatibility corpus and consistent keyboard/print/export behavior                        |
| Diagrams, math and richer Markdown      | No first-class contract found                                 | Explicit optional support or conversion, with dependency/per-page cost measured                         |
| Library API references                  | Static components and checked-in snapshot rehearsal           | Repeatable docgen integration and drift detection for supported ecosystems                              |
| OpenAPI                                 | Static local 3.0/3.1 subset; local refs                       | Published support matrix and realistic specification corpus; unsupported constructs diagnosed           |
| Interactive API console                 | Parked                                                        | Separate product decision; no credential-bearing execution added by default                             |
| SEO and discovery                       | Canonical, sitemap, noindex, social image and structured data | Redirects, locale alternates, version canonical policy and host verification                            |
| Markdown/AI exports                     | Partial fidelity                                              | Tested portable output contract and consistent visibility                                               |
| Customization/plugins                   | CSS/scripts and content components                            | Small stable slots/transforms backed by actual migration needs                                          |
| Dev workflow                            | Local preview/watch/rebuild and last-good compilation         | Promotion recovery, useful diagnostics, large-site edit latency, OS compatibility                       |
| Security/privacy                        | Trusted-author boundary documented; no default analytics      | Output recovery, dependency/advisory review, CSP recipe and visibility regression checks                |
| Hosting/packaging                       | Local fixtures and recipes                                    | Real-host root/subpath/404/cache tests, runtime/OS matrix, registry ownership and provenance            |
| Offline/blog/tags/RSS/social generation | Mixed metadata or unimplemented workflows                     | Inventory migration demand; explicit supported adapter or named exclusion per capability                |

Starlight's official [internationalization guide](https://starlight.astro.build/guides/i18n/) documents locale routing, fallback and RTL; its [search guide](https://starlight.astro.build/guides/site-search/) describes Pagefind-based search, and its [component override guide](https://starlight.astro.build/guides/overriding-components/) provides extension mechanisms. These establish relevant comparison dimensions, not a requirement to copy its implementation.

Material documents [versioning with mike](https://squidfunk.github.io/mkdocs-material/setup/setting-up-versioning/), [Mermaid diagrams](https://squidfunk.github.io/mkdocs-material/reference/diagrams/), and [math through configured integrations](https://squidfunk.github.io/mkdocs-material/reference/math/). Distinguish platform core, configuration, plugins and ecosystem workflows when comparing features; do not claim these all ship identically or require zero setup.

## Recommended scope and sequence

Three strategies were considered:

1. **Ship the current narrow static-docs product.** Lowest effort, but does not satisfy the requested replacement ambition and still needs A1 fixed.
2. **Pursue every feature in both ecosystems.** Unbounded maintenance, unclear release criteria and unnecessary hosted-product work.
3. **Define a replacement contract and prove representative migrations.** Recommended. More work before release, but every addition has a user need and a measurable exit condition.

The expanded target should include trustworthy output, migration/redirect fidelity, versioning, localization/RTL, realistic search/performance, production authoring coverage, accessible interaction and supported extension boundaries. Keep hosted analytics, AI chat, authentication services, a marketplace, AsyncAPI and an API execution console as separately scoped products unless a selected migration requires them. A capability cannot be called supported merely because custom JavaScript could theoretically implement it.

The dependency order and acceptance gates are in [PLAN.md](../PLAN.md). Resolve route identity before building separate locale/version/redirect/search implementations. Run representative migration inventories early, before freezing plugin or authoring APIs. Preserve the existing historical batch evidence while reopening replacement readiness.

## Limits and next review

This is a broad evidence-based audit, not a formal penetration test or exhaustive line-by-line security review. No package-advisory inventory, Windows/Linux run, real-host deployment, manual assistive-technology session or real competitor-site migration was completed here. API schema fidelity and media behavior need the proposed corpus tests. No public release date is defensible until the revised gates have evidence.

The next implementation deliverable should be **A1 output-promotion recovery**, followed by migration inventory and route-model design. Re-audit after each milestone against the same findings and budgets; do not replace evidence with an increasing test count.
