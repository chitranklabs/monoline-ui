# Monoline Docs — Replacement Readiness and Release Plan

> **Release hold — October 2, 2026.** The user requested a deeper audit and delayed release. Follow the replacement roadmap below before resuming final release work. Historical batch completion does not establish replacement readiness.
>
> Execute approved implementation work one milestone at a time using the executing-plans skill. Update checkboxes with evidence; do not equate implemented code with verified completion. This revision is an audit and proposed roadmap, not approval to implement every proposed public API.

**Goal:** Build a dependable documentation replacement for library/SDK authors and SaaS/API teams, with proven migration fidelity, accessible UI, predictable performance and explicit support boundaries. The confirmed comparison targets are MkDocs (including Material for MkDocs) and Astro Starlight.

**Architecture:** Astro compiles Markdown/MDX to static output. Monoline owns YAML configuration, the shell, semantic design tokens, navigation, search and safe publishing. React hydrates only explicitly requested examples.

**Scope:** `packages/docs`, `apps/docs-demo`, relevant consumer fixtures and narrowly required build/release scripts. Monoline UI and Docs remain independently published products.

**Architecture reference:** [Astro engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md). This roadmap supersedes its implementation order for product completion; preserve its output-safety and isolation contracts.

**Audit and proposed scope:** [October 2026 replacement-readiness audit](docs/docs-audit-2026-10-02.md). Findings A1–A10, fresh measurements, comparison sources and evidence limitations live there. Keep one production renderer and one route manifest; do not implement versions, locales or redirects as disconnected URL systems.

## Required reading before implementation

Every implementing agent must read the [Docs engineering guidelines](packages/docs/AGENTS.md), [Astro engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md), and [replacement-readiness audit](docs/docs-audit-2026-10-02.md), then the references for its milestone below. Read the relevant sections, not just the page titles. Follow local discovery instructions before source inspection.

| Milestone                          | Required references                                                                                                                                                                                                                                                                                                                                                                                                                     | What the agent must establish                                                                                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| R0 — Output recovery               | [Audit A1](docs/docs-audit-2026-10-02.md#a1--p1-final-output-promotion-does-not-preserve-last-good-files-on-write-failure), [engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md), [release/recovery guide](docs/docs-release.md)                                                                                                                                                                              | Last-good-output guarantee, ownership boundaries and recovery failure cases                                                    |
| R1 — Migration contract            | [MkDocs configuration](https://www.mkdocs.org/user-guide/configuration/), [MkDocs authoring](https://www.mkdocs.org/user-guide/writing-your-docs/), [Material documentation](https://squidfunk.github.io/mkdocs-material/), [Starlight configuration](https://starlight.astro.build/reference/configuration/), [current Monoline support](apps/docs-demo/content/support.md)                                                            | Source configuration/content semantics, core versus plugin capabilities, and losses requiring conversion or explicit exclusion |
| R2 — Route and extension design    | [Monoline navigation](apps/docs-demo/content/navigation.md), [Monoline configuration](apps/docs-demo/content/configuration.md), [Starlight localization](https://starlight.astro.build/guides/i18n/), [Starlight component overrides](https://starlight.astro.build/guides/overriding-components/), [Material versioning](https://squidfunk.github.io/mkdocs-material/setup/setting-up-versioning/)                                     | Shared route identity, fallback/alias semantics and migration-backed extension needs                                           |
| R3 — Locales and versions          | [Starlight localization and RTL](https://starlight.astro.build/guides/i18n/), [Material versioning with mike](https://squidfunk.github.io/mkdocs-material/setup/setting-up-versioning/), [audit A2](docs/docs-audit-2026-10-02.md#a2--p1-for-replacement-language-configuration-is-not-localization)                                                                                                                                    | Translation, direction, equivalent-page switching and missing-page behavior; read the approved R2 design once linked here      |
| R4 — Authoring/API/export fidelity | [Monoline authoring](apps/docs-demo/content/writing.md), [component examples](apps/docs-demo/content/components.mdx), [OpenAPI support contract](apps/docs-demo/content/configuration.md), [MkDocs authoring](https://www.mkdocs.org/user-guide/writing-your-docs/), [Material diagrams](https://squidfunk.github.io/mkdocs-material/reference/diagrams/), [Material math](https://squidfunk.github.io/mkdocs-material/reference/math/) | Syntax compatibility, optional processor costs and HTML/search/export fidelity                                                 |
| R5 — Search and scale              | [Current performance evidence](docs/docs-performance.md), [Starlight search](https://starlight.astro.build/guides/site-search/), [Web Vitals definitions](https://web.dev/articles/vitals), [audit performance assessment](docs/docs-audit-2026-10-02.md#performance-and-optimization-assessment)                                                                                                                                       | Comparable corpus/device conditions, cold versus warm costs and lab versus field evidence                                      |
| R6 — Accessible UI                 | [Docs accessibility rules](packages/docs/AGENTS.md#accessibility-and-design), [audit UI assessment](docs/docs-audit-2026-10-02.md#ui-and-accessibility-assessment), [WCAG target size and exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)                                         | Applicable conformance criteria, product touch targets and manual/browser verification boundaries                              |
| R7 — Operations                    | [Release/recovery guide](docs/docs-release.md), [deployment instructions](apps/docs-demo/content/deployment.md), [support boundaries](apps/docs-demo/content/support.md), [verification commands](docs/docs-performance.md)                                                                                                                                                                                                             | Supported environments, consumer isolation, hosting assumptions and explicit publication authority                             |
| R8 — Release decision              | [Audit findings](docs/docs-audit-2026-10-02.md#confirmed-defects-and-release-risks), [capability matrix](docs/docs-audit-2026-10-02.md#replacement-capability-matrix), [release guide](docs/docs-release.md), completed R1 migration inventory and R2 design                                                                                                                                                                            | Every accepted requirement has current evidence and every exclusion narrows the public claim                                   |

Before implementing a milestone, record the references actually reviewed, access date, relevant installed/source versions and the resulting compatibility decisions in its evidence entry. Official documentation can change: check it against the selected migration's versions and this repository's dependencies. Competitor documentation informs comparison; it does not override Monoline's approved contracts.

When R1 inventories or R2/subsequent design documents are created, add direct links here and to every dependent milestone before handoff. If a required source is unavailable or contradicts the plan, record the unresolved point and verify it before implementing the affected behavior. Maintain these reading links whenever the plan changes.

## Tracking and execution

- Keep work on the current `feat/docs-astro-engine` branch unless the user requests otherwise.
- The user handles commits and PRs. Supply a commit title and concise PR materials; do not commit, push, publish or deploy automatically.
- Verify each milestone's production behavior, accessibility and performance before marking it complete. Do not defer foundational failure-path, migration or route-contract checks to the final release gate.
- Use the existing modules and installed dependencies. Add a package, abstraction or dependency only for a demonstrated requirement.
- A milestone finishes when its deliverable and acceptance checks pass, the audit finding is reconciled and remaining limitations are recorded here. A historical batch remains a record of its narrower original scope.
- Preserve unrelated changes. Do not mix parked release automation into product batches.

## Current evidence — October 2, 2026

**Fresh audit verification:** 209 package tests pass; package typecheck and ten-page demo build pass. Production Chrome passes root/subpath/clean URL fixtures, axe, keyboard, no-JS and reduced-motion checks. Additional actual-demo checks pass axe and viewport overflow at 320/375/768/1440px in both themes. Representative screenshots were inspected in `/private/tmp/monoline-oct-audit`; this is reviewer inspection, not final user screenshot approval.

**New findings:** A1 confirms partial final-output overwrite after a failed promotion; A4 confirms Unicode highlighting offsets are wrong for length-changing normalization. Mobile header height is 261.30px at 320/375px; several controls miss the proposed 44px touch target. The benchmark still passes (329ms/4,536ms build medians for 100/1,000 pages), but realistic cold-search, memory and browser responsiveness remain unverified. Locale/version routing, competitor migrations, redirects and extension contracts remain replacement gaps.

The following table records the original implementation batches. Their evidence is historical unless explicitly rerun above. They are not reset merely because the product scope has expanded.

| Batch        | State    | Evidence / remaining work                                                                                                                                                                               |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1            | Complete | Boundary review verified: 146 package tests, typecheck, targeted lint, package build, engine fixture, nine-page demo and packed npm/strict pnpm consumers pass.                                         |
| 2            | Complete | 159 package tests, typecheck/lint, demo/engine, packed consumers and production Chrome checks pass. Both densities/themes inspected on desktop/mobile; initial CLS below 0.01.                          |
| 3            | Complete | 171 package tests, typecheck/lint, engine/demo and packed consumers pass; production Chrome verifies sections, sticky anchors, desktop/mobile scroll restoration and no-JS navigation.                  |
| 4            | Complete | Static authoring components and synchronized CodeGroup verified: 171 package tests, engine/demo, packed npm/strict pnpm public imports, keyboard/no-JS/print and Chrome/axe at root/subpath/clean URLs. |
| 5            | Complete | Library references and local OpenAPI verified: 193 tests, typecheck/lint, package/demo builds, packed npm/strict pnpm and Chrome/axe at root/subpath/clean URLs.                                        |
| 6            | Complete | Search/SEO/exports verified: 202 package tests, typecheck/lint, package/engine/demo builds and production Chrome at root/subpath/clean URLs.                                                            |
| 7            | Complete | Safe init, isolated packed npm/strict pnpm starts, own docs and Ask Widget migration verified. Root/subpath browser checks pass; host deployments remain release-gate work.                             |
| Release gate | On hold  | Replacement milestones R0–R8 below supersede the former final-check-only path. Publication remains blocked.                                                                                             |

## Replacement roadmap — proposed order

**Scope decision:** pursue a measurable replacement contract. Shipping only the current narrow feature set misses the requested goal; cloning every plugin and hosted feature would leave no meaningful finish line. R1 must record each selected migration requirement as native support, supported conversion/extension, or an explicit exclusion that narrows the replacement claim.

**Dependency order:** R0 → R1 → R2 → R3. Start the R4 corpus and R5 measurements during R1; finalize R4–R7 against the route contract from R2/R3. R8 follows all earlier acceptance evidence. Do not freeze new public option names until the route/extension design is reviewed.

### R0 — Recover safely from failed output promotion

**Owns:** `packages/docs/src/output.ts`, `output.test.ts`, `build.test.ts`, `dev.test.ts`, existing engine fixture. **Closes:** A1.

- [x] Add a regression reproducing a late write failure after an earlier tracked output was overwritten; observe the current failure first.
- [x] Define and implement promotion recovery for generated files and their manifest while preserving unrelated files. Keep staging on the appropriate filesystem; specify interruption/crash recovery and either serialize or explicitly reject concurrent writers.
- [x] Exercise failed writes, stale-file removal and manifest replacement. Compare prior file bytes and manifest before/after; verify next successful build and dev preview recovery.
- [x] Run focused output/dev tests, package build and engine failure-preservation fixture; reconcile the documented guarantee with measured behavior.

**Exit:** a failed supported promotion leaves the last-good generated site usable and unrelated output untouched; crash/concurrency limits are explicit. Blocking even for a narrower preview release.

**Completed — October 2, 2026:** Three original fault-injection regressions first failed with `new-a` remaining after late page, stale-delete and manifest errors; they now pass. Ten focused output cases cover those failures, initial absent/empty output, staging-write failure, concurrent rejection, failed rollback with retained bytes, mounted-output staging and post-commit cleanup warning. Two added dev-preview checks verify prior page/search after failed promotion and new-route adoption after cleanup warning. All 221 package tests pass; package typecheck, targeted ESLint, package build and production engine failure/staging fixture pass. Independent review identified cleanup/commit semantics and cross-filesystem staging; both received regressions observed failing before correction. No UI, public exports or dependency changes; packed/browser UI checks were not rerun for this output-only milestone.

**References reviewed:** Docs engineering guidelines; audit A1; engine design output-safety/preview contract; release/recovery guide; [Node 24 filesystem API](https://nodejs.org/docs/latest-v24.x/api/fs.html), accessed October 2, 2026 (official page describes 24.21.0; local verification uses Node 24.14.0). Filesystem rename/copy/mkdir APIs require no dependency change.

**Rulings:** Work remains on the current branch without commits, preserving staged planning edits. Focused output fault tests live in `output.test.ts` to keep filesystem injection out of unrelated build fixtures. R0 supersedes the older spec's narrower compilation-only guarantee; its revised contract is linked in the [local recovery procedure](docs/docs-release.md#local-output-promotion-and-recovery). Exclusive `.monoline-promotion` creation rejects overlapping writers; staging/backups live inside output to support mounted destinations. Manifest replacement is the commit point: later cleanup warns and leaves a lock requiring inspection. Crash/power-loss and external mutation are explicitly outside automatic recovery; failed rollback retains evidence rather than erasing it. Costs: extra temporary disk space/I/O and manual recovery for interruption or persistent filesystem failure.

**Commit title:** `fix(docs): recover failed output promotion and retain recovery evidence`

**PR description:** Preserve prior generated files and the manifest after caught promotion failures, reject overlapping promotions, and retain backups when recovery cannot finish. Verify staging on the output filesystem, successful cleanup-warning semantics and dev-preview recovery. Update the output-safety contract and recovery instructions; release remains on hold for R1–R8.

### R1 — Define and rehearse the replacement contract

**Owns:** this plan, `docs/docs-audit-2026-10-02.md`, existing `packages/docs/test-consumer.mjs` fixture mechanism, `apps/docs-demo/content/support.md`. **Closes:** A3 scope/evidence gap; informs A9/A10.

- [ ] Inventory one representative MkDocs/Material site and one Starlight site: config, source syntax, metadata, components/plugins, assets, URLs/fragments, versions/locales and hosting assumptions. Use repository-owned fixtures; external source edits/deployments remain separately authorized.
- [ ] Produce a capability disposition table with migration effort and known losses. Include blog/RSS, tags, offline, social cards, docgen and custom integrations even when excluded; no silent omissions from the replacement promise.
- [ ] Establish baseline content counts and old URL/anchor manifests. Define the converter's dry-run, diagnostics and source-preservation behavior before implementing it.
- [ ] Rehearse through an isolated packed consumer. Native pages, converted pages and unsupported inputs must be separately reported.

**Exit:** success means all selected source content is accounted for and every old URL/fragment is preserved, deliberately redirected or explicitly retired. Unsupported syntax fails with a useful source location. “Everything” becomes a finite, reviewable contract.

### R2 — Design stable route identity, redirects and extension boundaries

**Owns:** `config.ts`, `content.ts`, `navigation.ts`, `urls.ts`, `links.ts`, `astro-engine.ts`; matching existing tests. **Closes:** A2/A3 route foundations and A9 design.

- [ ] Write and review a focused design for stable page identity, locale/version dimensions, equivalent-page mapping, aliases, redirect cycles/collisions, root/subpath and clean/directory URLs. Preserve existing single-site defaults.
- [ ] Specify how renderer, sidebar/pager, search, sitemap, canonical/hreflang and exports consume that same manifest. Define missing-translation/version-page behavior and visibility inheritance.
- [ ] Define only extension points demonstrated by R1: bounded shell slots, content transforms and/or build hooks, with typed inputs, ordering, error handling and visibility invariants. Retain Monoline-owned defaults.
- [ ] Implement the approved contract with collision, missing-target, redirect-chain and backward-compatibility tests; add config schema/editor support from the same validated options.

**Exit:** no independent route database in any consumer; two locales × two versions at root and subpath resolve consistently, with old configuration and URLs preserved. Host HTTP redirects and portable static fallbacks have distinct documented guarantees.

### R3 — Deliver localization, RTL and documentation versions

**Owns:** route/config modules from R2, `astro-page.astro`, `astro-navigation.astro`, `client.js`, `search.js`, `docs.css`, generated 404 and export metadata. **Closes:** A2 and pluralization/localization parts of A4/A6.

- [ ] Add translated shell strings, plural/date formatting, correct `lang`/`dir`, fallback notices and logical CSS. Cover Arabic RTL and a non-English LTR locale; keep code direction intentional.
- [ ] Add locale/version selectors preserving equivalent page context, explicit missing-page fallback and support/deprecation banners. Search must filter the selected published corpus.
- [ ] Generate truthful locale alternates, canonical/version policy, sitemap and export links; verify drafts and noindex remain excluded consistently.
- [ ] Verify keyboard, no-JS, RTL tab navigation, screen-reader labels and missing translations through production output and packed imports.

**Exit:** selectors are backed by real routes and metadata, not manually assembled links. A fully localized monolingual site also works without needing multiple locale trees.

### R4 — Prove authoring, API and export fidelity

**Owns:** `astro-engine.ts`, `rendered-content.ts`, `components/`, `openapi.ts`, existing engine/consumer tests and demo authoring docs. **Closes:** A7/A8/A10 and R1 content gaps.

- [ ] Map existing prototype-renderer tests to production assertions before retiring or labeling prototype-only coverage.
- [ ] Establish an output-tested corpus for footnotes, task lists, admonitions, tabs, rich code, diagrams, math, tables, links/assets and raw HTML migration. Add only the required optional processors, loaded only where needed.
- [ ] Replace regex-only export rewriting with a defined parser-based fidelity contract. Verify Markdown/MDX code, tables, relative images, reference links, subpaths and visibility controls.
- [ ] Validate representative OpenAPI 3.0/3.1 specifications against a published support matrix, including recursion, composition, examples and unsupported refs. Provide deterministic docgen refresh/drift checks for the selected library fixture.
- [ ] Define responsive-media and above-the-fold loading behavior; preserve image dimensions, accessible descriptions and print/export fallbacks.

**Exit:** supported authoring produces correct HTML, search and export output through the packed production engine. Unsupported input is diagnosed; no silent claims of full OpenAPI, Python Markdown or arbitrary MDX parity.

### R5 — Establish realistic search and scale budgets

**Owns:** `search.js`, `search.test.ts`, `benchmark.mjs`, production browser fixture, navigation generation and `docs/docs-performance.md`. **Closes:** A4/A5.

- [ ] Add the `ﬃ setup` highlighting regression plus combining-mark/non-Latin cases, then make highlighting offsets preserve authored text.
- [ ] Benchmark a varied corpus at 100, 1,000 and an exploratory 10,000 pages. Record raw/gzip HTML/index/media, DOM count, peak build memory, clean/incremental build time, cold/warm search, heap and long tasks under a fixed mobile CPU/network profile.
- [ ] Compare current search with preprocessing/partitioning and Pagefind using the same relevance queries, multilingual/version filters and cold-load measurements. Choose from evidence; retain accessible error/retry behavior.
- [ ] Bound repeated navigation output without making basic navigation depend on JavaScript. Add regression budgets for the chosen supported site-size envelope.
- [ ] Retain the existing 6KB gzip shell ceiling; separate optional feature/island costs. Set a provisional warm-search input-to-results p95 target of 100ms, cold-search target of 1s on the declared profile, and report misses before revising targets with rationale.

**Exit:** publish realistic supported scale and repeatable lab conditions; meet the declared budgets. Treat LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at field p75 as goals requiring eventual field evidence, not claims proven by Node timings. The 10,000-page run is exploratory until it passes its own envelope.

### R6 — Verify accessible UI across actual reading tasks

**Owns:** shell/components/CSS, `test-browser.mjs`, representative demo pages. **Closes:** A6 and accessibility evidence gaps.

- [ ] Reduce mobile header occupation; proposed target ≤160px at 375×812 with the current announcement/links/sections, or document an accepted task-tested alternative. Keep navigation, search, theme and necessary actions discoverable.
- [ ] Make primary touch controls at least 44×44 CSS px; independently assess WCAG 2.2 AA's 24px target/spacing exceptions for secondary controls. Verify compact density rather than shrinking every control uniformly.
- [ ] Test 320px reflow, 200% text, 400% zoom, text spacing, long labels, RTL, forced colors, reduced motion, print and sticky-focus visibility in both themes/densities.
- [ ] Run core journeys in Chromium, Firefox and WebKit; smoke-test real mobile virtual keyboard, safe areas and landscape. Add manual VoiceOver/Safari and NVDA/Firefox-or-Chrome task evidence.
- [ ] Inspect code-block hierarchy, mobile on-page orientation, loading/empty/error search states, copy failure recovery and no-JS fallbacks. Store a reproducible screenshot matrix and obtain final visual approval only after corrections.

**Exit:** no unresolved critical/serious automated violations on the selected matrix; manual task completion and applicable WCAG criteria are recorded. Do not equate an axe pass with conformance certification.

### R7 — Reverify package, developer workflow and operations

**Owns:** existing CLI/dev/consumer/release fixtures, `docs/docs-release.md`, support/deployment docs. **Closes:** operational evidence gaps.

- [ ] Test supported Node floors and OS combinations, isolated npm/strict pnpm installs, public exports, no-React consumers and optional-island consumers after the contract changes. Measure install footprint and startup/edit latency.
- [ ] Check configuration/editor diagnostics, actionable build errors, watcher recovery and clean shutdown. Correct fixture cleanup so a failed server start does not mask its original error.
- [ ] Review dependency advisories/licenses, the trusted-author boundary, explicit integration scripts and a workable CSP recipe. Recheck no secrets/drafts enter output; do not claim a full security assessment from this audit.
- [ ] With separately authorized deployment, verify real root/subpath hosts, 404 status, redirects, asset paths, cache invalidation and last-good rollback. Distinguish host configuration from portable output behavior.
- [ ] Reverify release workflow recovery, registry ownership and actual provenance for the final immutable artifact. Update support and recovery instructions from evidence.

**Exit:** a documented support matrix is backed by actual runs; missing platforms or integrations are named exclusions. External deployment/publication still requires user authorization.

### R8 — Repeat migrations and make the release decision

- [ ] Repeat R1's two migration rehearsals and the Ask Widget fixture using the final packed artifact; compare content, URL/anchor manifests, search, screenshots and exports.
- [ ] Close or explicitly disposition every A1–A10 finding and R1 requirement. No P1 defect remains; exclusions narrow the public replacement claim visibly.
- [ ] Re-run applicable original release checks below. Refresh Changeset/release notes and package support statements for the expanded scope; do not reuse the earlier release-candidate claims unchanged.
- [ ] Record final accessibility, performance, host, consumer and provenance evidence; then request explicit release authorization for the repository's actual planned version.

**Exit:** release readiness follows the evidence, not a calendar date. No public release date is set by this plan.

## Batch 1 — Product configuration and stable content contract

**Owns:** `packages/docs/src/config.ts`, `load-config.ts`, `content.ts`, `navigation.ts`, `index.ts`; their existing focused tests and consumer config fixtures.

**Contract:** `defineConfig` validates and normalizes configuration; `loadConfig` resolves config-relative paths; `discoverPages` produces the single page/route manifest consumed by rendering and publishing.

- [x] Normalize nested `branding`, `header`, `appearance`, `content`, `search` and `seo` options while accepting existing flat aliases.
- [x] Add validated `navTitle`, `seoTitle`, `slug`, `search`, `noindex`, `updatedAt`, `tags`, `badge` and `layout` frontmatter.
- [x] Resolve explicit slugs through the existing route manifest and reject duplicate routes.
- [x] Wire title templates, navigation titles, search exclusions and page indexing controls into rendering.
- [x] Prevent Astro from interpreting Monoline's `layout` value as a component import.
- [x] Verify package regressions, production demo and packed consumers; prior run reported 115 package tests passing.
- [x] Finish boundary review: real calendar-date validation, conflicting aliases, invalid slugs and safe file-derived routes. Add only the missing regression assertions.
- [x] Allocate remaining configuration to its consumer batch: appearance/header/sidebar/content controls in Batch 2; sections/tabs in Batch 3; social metadata in Batch 6. Do not accept silent no-op options.

**Verification — October 1, 2026:** All 146 Docs package tests pass, including regression assertions observed failing before the boundary fixes. Package typecheck, targeted ESLint, package build, production engine fixture, nine-page demo and packed npm/strict pnpm consumers pass. Formatting and whitespace checks pass. Tests use the installed Node CLI entrypoints where appropriate; local-server tests require execution outside the sandbox.

**Contract decisions:** Reject differing nested/flat aliases with both option names; matching values remain valid, including repeated normalization by `loadConfig` and the engine. Reuse `safeRoute` for slugs and filename-derived routes; unsafe filenames require renaming or an explicit safe slug. Validate calendar dates by ISO round-trip, including leap years.

**Remaining configuration ownership:** Batch 2 introduces appearance, header, sidebar and content controls together with their shell consumers. Batch 3 introduces sections/tabs with navigation consumers. Batch 6 introduces social metadata with generated head tags. Social metadata remains a validation error until its consumer is implemented; shell controls and sections now have working consumers. Focused assertions cover representative options in each group. Existing accepted configuration retains its working consumers. No Batch 1 blocker remains.

**Done when:** existing consumer configuration still works and every accepted option has a working consumer or an explicit validation error.

## Batch 2 — Premium responsive shell

**Owns:** `astro-page.astro`, `astro-navigation.astro`, `docs.css`, `client.js`, `search.js`; extend `config.ts` and engine serialization only for controls used here.

- [x] Implement sticky header, reading column, sidebar active rail, breadcrumbs, page metadata and previous/next cards.
- [x] Add search shortcut, theme control, mobile drawer, copy-page-link action and TOC observation.
- [x] Finish keyboard behavior: drawer focus containment, background interaction exclusion, Escape, focus restoration and viewport changes. Prefer native dialog behavior where practical.
- [x] Add validated comfortable/compact density and use it in layout spacing.
- [x] Add configurable header primary action and announcement banner, with safe internal/external links.
- [x] Add explicit content controls for last-updated visibility and page-copy action; define whether copying means link or Markdown rather than mixing the actions.
- [x] Add branding favicon, body/code font controls and radius/accent customization through validated tokens and local assets. No remote font fetch by default.
- [x] Verify sticky offsets, heading scroll margins, very long titles, header wrapping and reference-page width.
- [x] Inspect production screenshots on desktop/mobile in light/dark; correct spacing, contrast and visual hierarchy.
- [x] Run the existing browser fixture with focused assertions for drawer and shortcut behavior; check print and reduced-motion presentation.

**Verification — October 1, 2026:** All 159 Docs tests pass; new configuration assertions and the missing native-drawer browser assertion were observed failing before implementation. Package typecheck, targeted ESLint/Markdownlint, formatting, package build, engine fixture, nine-page demo and packed npm/strict pnpm consumers pass. Production Chrome fixture passes root, subpath and clean URLs, both themes, no-JS reading/navigation, axe, modal keyboard/background exclusion, Escape/focus restoration, resize and backdrop dismissal, repeated search shortcuts, print and reduced motion. Inspected comfortable/compact screenshots at 375px and 1440px, plus the actual demo in both themes at both widths. Screenshot artifacts: `/private/tmp/monoline-batch2-screenshots`.

**Performance evidence:** Customization is generated into the existing CSS at build time. No dependencies, runtime font loader, scroll/resize polling or duplicate sidebar markup added. Search fetches once on demand and reuses its index. `client.js` gzip changes from 1,822 to 1,951 bytes; `search.js` from 1,753 to 1,777 bytes (153 additional gzip bytes combined). Reserving enhanced controls and tab layout reduces measured desktop initial CLS from 0.027–0.033 to 0.0012–0.0015; measured mobile CLS is 0.0043–0.0047. The existing fixture asserts both below 0.01. These are local fixture measurements, not field Web Vitals or large-site benchmarks; broader performance campaigns stay in the release gate.

**Contract decisions and limits:** Native modal navigation reuses the static sidebar; the browser handles focus containment and background exclusion. Tab can reach browser chrome, but cannot focus background page content. Header offsets follow its observed size; with no JavaScript the header remains in normal flow. `content.copyPageLink` copies the current URL including its fragment; Markdown copying belongs to Batch 6. Fonts use local assets and `font-display: optional`; a slow first visit can keep the fallback. Existing custom CSS remains last and can override generated tokens. Independent production-diff review found no blocking issue. No Batch 2 blocker remains.

**Done when:** both themes and densities look intentional, the mobile drawer is accessible and all shell controls work with a no-JS reading/navigation fallback.

## Batch 3 — Navigation and content experience

**Owns:** `navigation.ts`, `config.ts`, `astro-navigation.astro`, `astro-page.astro`, `rendered-content.ts`, `links.ts`, `urls.ts`, `client.js`.

- [x] Extend navigation to top-level sections/tabs while preserving existing link/group arrays.
- [x] Resolve active section, sidebar and previous/next sequence from the same route manifest. Keep sections URL-driven.
- [x] Support nested groups, ordering, optional icons/badges and configurable initial group expansion.
- [x] Preserve sidebar scroll position per site base with storage failure fallback.
- [x] Complete heading anchors, active TOC behavior and deep-link scrolling under the sticky header.
- [x] Polish responsive tables/code overflow and the 404 experience without changing output URL semantics.
- [x] Verify one nested site at root and subpath, an explicit slug, a missing route and a broken fragment.

**Done when:** guides and API sections navigate correctly, moving a source file with a retained slug preserves its public URL and no duplicate route source exists.

**Verification:** Ordered guides/API sections use manifest routes for active header links, nested sidebar entries and section-local pagers. Legacy arrays remain supported. Package tests (171), typecheck, targeted lint/format, engine fixture, nine-page demo and packed npm/strict pnpm consumers pass. The engine moves a source file with a retained explicit slug, checks its unchanged public route and rejects missing targets/fragments without replacing prior output. Production Chrome covers root, subpath and clean URLs, native groups, deep links below the measured sticky header, active TOC through long content, sidebar restoration at the bottom and inside a mobile drawer, blocked storage, keyboard/search, axe, no-JS, print and reduced motion. Desktop/mobile light/dark screenshots were inspected. Initial CLS was 0.00103–0.00106 desktop and 0.00309–0.00369 mobile. Combined shell scripts grew from 3,953 to 4,561 gzip bytes (+608); section navigation adds no client code or dependency, and TOC scroll updates use cached positions, binary search and only two link mutations. Independent review's mobile scroll-owner and early restoration findings were fixed and verified.

## Batch 4 — Essential authoring components

**Owns:** `src/components`, authoring styles and existing client enhancement; `build.mjs`/package exports only when required to ship components.

- [x] Audit and reuse Steps, Tabs, Callouts, ApiTable, CodeBlock and LinkCard before creating replacements.
- [x] Add CardGrid/Card, Accordion, FileTree, Badge and Figure/caption using static HTML where possible.
- [x] Add CodeGroup with synchronized package-manager selection and keyboard operation.
- [x] Add TypeTable and Preview with clear semantics for static examples and optional interactive islands.
- [x] Make imports available from the packed package; keep plain Markdown independent of component imports.
- [x] Render one component fixture in both themes, with keyboard and no-JS checks for interactive components.

**Done when:** every component can be imported by an external consumer and follows the same Monoline design and accessibility conventions.

**Verification:** Reused Steps/Step, Tabs, Markdown callouts, ApiTable, CodeBlock and LinkCard. Ten added Astro components (CardGrid/Card, Accordion, FileTree, Badge, Figure, CodeGroup, TypeTable, Preview and the MDX Callout wrapper) ship through the existing wildcard export; both packed npm and strict pnpm consumers import and render the complete public fixture. Plain Markdown still builds without imports, and static component output has no islands. Typecheck, targeted lint/format, 171 package tests, engine fixture with thirteen invalid-input checks, nine-page demo and packed consumers pass. Astro lint uses the existing TypeScript parser via CLI parser-options because the repository's default Astro configuration does not select it. Production Chrome verifies root/subpath/clean URLs, synchronized and unsupported manager selections, independent ordinary tabs, keyboard focus, stored preferences and blocked storage, native disclosures, decoded local figures, explicit React previews, no-JS, print, mobile overflow and axe in both themes. Desktop/mobile screenshots were inspected in both densities. Saved-manager component CLS measured 0 on mobile and 0.00715–0.00845 on desktop; command panels retain equal height when switching. Combined shell JS grew from 4,561 to 4,831 gzip bytes (+270), with no dependency added. Independent review found no production blocker; its misplaced performance-measurement observation was corrected before final verification. Figure URL validation remains in the shared rendered-link boundary, unsupported managers leave that group's selection unchanged, and Preview hydration remains explicitly authored.

## Batch 5 — Library and OpenAPI documentation

**Owns:** existing reference components and content/route pipeline; add a focused OpenAPI module only where existing responsibilities do not fit.

- [x] Add package installation UI and npm/pnpm/Yarn/Bun examples using CodeGroup.
- [x] Finish reference layout for types, exports, compatibility, package/source links and copyable examples.
- [x] Accept local OpenAPI 3.0/3.1 files and validate unsupported/invalid input with the source path.
- [x] Generate deterministic endpoint routes, tag navigation and operation/schema deep links in the existing manifest; reject collisions with authored pages.
- [x] Render parameters, request bodies, response schemas and examples, including local references and recursive schemas without infinite expansion.
- [x] Generate copyable request examples with explicit placeholders for credentials.
- [x] Verify one packed library fixture and one OpenAPI fixture, including invalid spec and duplicate-operation cases.

**Done when:** a library and an API can produce useful static reference pages without hand-authoring every endpoint.

**Deferred:** interactive API requests, credential storage, proxy services and AsyncAPI. Remote reference loading is opt-in only after fetch policy is designed.

**Verification:** PackageInstall reuses CodeGroup for four package managers; PackageReference reuses TypeTable, explicit compatibility declarations, package/source links and slotted CodeBlock examples. Both components render through public imports in packed npm and strict pnpm consumers. Local JSON/YAML OpenAPI 3.0/3.1 files generate overview, operation and component-schema pages in the existing manifest, with default first-tag navigation and authored-route collision checks. Specifications are read once; pointer targets and validated schema objects are cached. Schema validation is independent of the six-level display bound; file/object/nesting/expansion limits and cycle detection prevent unbounded processing. Generated Markdown stays inside owned temporary staging, uses the existing renderer, and adds no client script or dependency. Preview tracks the specification dependency. Source/output overlap is rejected; invalid versions, duplicate operation IDs and authored collisions preserve last-good output and unrelated files. Independent review findings around examples, named dictionaries, boolean schemas, deep validation and security alternatives were fixed with regressions; focused re-review found no remaining important defect. All 193 package tests, typecheck, targeted lint/format, package build, engine fixture, nine-page demo and packed consumers pass. Production Chrome verifies copied request placeholders, schema links without JavaScript, both themes and 375/1440px widths across root/subpath/clean routes, with no axe violations or viewport overflow. API and library screenshots were inspected; saved-manager CLS remains 0 on mobile and 0.00715–0.00853 on desktop.

**Rulings and limits:** Explicit navigation remains authoritative; otherwise generated operations group by their first tag. Local JSON-pointer references are supported; external files, URLs and anchors are rejected. This renderer validates consumed structures rather than full OpenAPI conformance. Requests use explicit URL/value/body/authentication placeholders, while supplied documentation examples are published as escaped code and must contain fictitious data. No metadata fetching or compatibility inference is introduced.

## Batch 6 — Search, SEO and integration

**Owns:** `search.js`, `astro-engine.ts`, `astro-page.astro`, configuration and the existing rendered-content inspection.

- [x] Add guide/API search scopes, highlighted matches, local recent searches and useful empty results.
- [x] Honor site/page search controls without exposing drafts or excluded content. Preserve keyboard navigation and retry behavior.
- [x] Measure current search on a representative large fixture; adopt Pagefind only if results justify the added dependency and migration.
- [x] Complete canonical URLs, title templates, social images/cards, favicon, robots and sitemap exclusions for `noindex` pages.
- [x] Add appropriate breadcrumb/technical-page structured data from the existing manifest; do not invent authors, dates or claims.
- [x] Add filtered Markdown export, copy-as-Markdown and `llms.txt`/`llms-full.txt` using published content only.
- [x] Add explicit optional analytics/custom-script configuration with no bundled provider or tracking by default.
- [x] Verify one searchable guide/API pair, excluded content, subpath metadata and unsafe integration input.

**Done when:** discovery features agree on published routes and visibility rules, with stable metadata and useful search.

**Verification — October 1, 2026:** All 202 Docs package tests pass, including regressions observed failing for noindex search exposure, slugged Markdown links, disabled-index AI files, recent-search keyboard access and social-image configuration. Typecheck, targeted ESLint/Prettier/Markdownlint, package build, engine fixture, nine-page demo and whitespace checks pass. Production Chrome verifies guide/API search scopes, highlighted results, keyboard behavior, Markdown copy, no-JS reading/navigation and axe at root, subpath and clean URLs. Desktop/mobile light/dark screenshots were inspected; the search dialog was inspected at desktop width. A synthetic 5,000-section index (about 1,000 five-section pages; 829 KB JSON) measured 1.34 ms median and 1.98 ms p95 across 100 in-memory queries locally. This does not measure fetch or parsing on a slow device; Pagefind is deferred pending release-gate scale checks.

**Limits:** MDX exports contain readable rendered text and omit interactive island content and code-block formatting. Markdown exports keep authored Markdown and resolve common inline/reference page links to public routes; uncommon Markdown URL syntax and source-relative image paths need a dedicated export parser before claiming complete fidelity. `noindex` pages are absent from search, sitemap, Markdown and AI indexes; disabling site indexing removes AI indexes. `robots.txt` is emitted only for root deployment because a subpath build does not own the host root. External scripts remain explicit trusted author configuration, with no bundled tracking.

## Batch 7 — Adoption and real-product migration

**Owns:** `cli.js`, existing build/dev entry points, `apps/docs-demo`, Ask Widget fixture and packed-consumer verification.

- [x] Implement `monoline-docs init` to create minimal config, content and scripts; refuse to overwrite existing files silently.
- [x] Test an empty-directory start using a packed package with npm and strict pnpm resolution.
- [x] Make Monoline Docs' own documentation use the completed product; keep repository maintainer documents outside published content unless explicitly selected.
- [x] Complete Ask Widget migration in a fixture first, including all existing reference links and interactive examples. External repository edits require user authorization.
- [x] Prepare portable static deployment configuration for Vercel, Netlify, GitHub Pages and Cloudflare Pages at root/subpath.
- [x] Verify production output from all representative fixtures and record unresolved limitations.

**Done when:** a new consumer can initialize/build the site and real library/API documentation uses only the packed package's public surface.

**Verification — October 2, 2026:** The full project graph was indexed (3,547 nodes, 9,343 edges initially; seven partially parsed files reported, with no skipped files). Safe initialization passes six focused checks, including refusal/preservation and write-failure rollback; the complete package suite passes 209 tests. Package typecheck, targeted ESLint/Prettier/Markdownlint, package build, engine fixture and nine-page demo pass. Packed npm and strict pnpm consumers initialize and build from independent temporary roots, verify missing imports before installation, and render the actual own-docs content through public imports. Both packed managers build the Ask Widget 0.6.1 rehearsal, with all eight published pages, legacy reference anchors, updated API data and an explicit React 19 island. Production Chrome verifies root/subpath/clean routes, no-JS navigation, keyboard/search, themes, mobile overflow and axe; the actual widget opens, streams a local response and closes at root and `/ask-widget/`, at 375px and 1440px in both themes. Final screenshots were inspected in `/private/tmp/monoline-adoption-screenshots`. Independent review found ancestor dependency resolution weakening the initial consumer fixture; sibling temporary roots now isolate each install, and packed/browser checks pass after the correction.

**Rulings and limits:** `init` has no network/install side effects and no force overwrite mode. It adds only missing scripts/dependency declarations, retains existing dependency sources, writes new files exclusively and stages existing-manifest replacement; failures clean up operation-owned files. Initialization expects a local directory with no concurrent filesystem mutation. The unpublished `0.0.0` starter dependency requires a local tarball until release. The Ask Widget source repository was inspected read-only; this batch completes the repository-owned rehearsal, not an external migration. API rows remain a checked-in docgen snapshot with rebuild verification, and the demo stream is local rather than an authenticated backend. Root/subpath Vercel/Netlify templates and a Cloudflare Pages recipe supplement the existing SHA-pinned Pages workflow; URL `base` alone does not relocate output files. Real-host deployments, broader accessibility/scale checks and publishing remain in the release gate. No Batch 7 blocker remains.

## Original release gate — historical evidence, superseded by R0–R8

Completed checks below describe the earlier narrow candidate. Re-run relevant checks against the expanded product at R8; these checkmarks do not override the release hold.

- [x] Reconcile every incomplete item above and publish accurate support/limitations documentation.
- [ ] Complete broader integration/browser coverage where the completed product reveals gaps; verify keyboard, screen reader, no-JS and reduced motion.
- [ ] Approve desktop/mobile screenshots in both themes and densities.
- [x] Record build/output/search baselines for 100 and 1,000 pages; enforce budgets based on measured output, including shell JS versus optional islands.
- [ ] Verify real-host deployments and root/subpath behavior with separate user approval for external deployment.
- [ ] Verify package contents, supported runtime versions, consumer imports, provenance and rollback instructions.
- [x] Reassess JSR compatibility before promising support; npm is the first release target while required Astro files remain incompatible.
- [x] Finish and validate `docs-v*` tagging/npm workflows, including retry/idempotency, permissions and publish failure recovery.
- [x] Prepare Changeset/release notes and user-facing commit/PR materials.
- [ ] Publish only after explicit user approval. Confirm the planned version from the repository's actual release state.

**Local verification — October 2, 2026:** Package tests pass (209), typecheck and targeted ESLint pass, and the demo builds ten pages including support/limitations. Release/workflow/registry tests pass (63); offline Zizmor reports no findings with 12 existing suppressions. Packed npm and strict pnpm consumers pass on Node 24.14.0 and 24.18.0. Production Chrome coverage passes root/subpath/clean routes, keyboard, no-JS, reduced motion, themes/mobile and axe; accessible search-tree names are additionally asserted. Release screenshots are available at `/private/tmp/monoline-release-screenshots`; representative desktop/mobile images were inspected, but user approval across both densities remains open. Independent review reports no actionable findings.

**Measured budgets:** Three-build medians are 301 ms/4,245 ms for 100/1,000 pages; output is 1,936,786/64,914,284 bytes and raw indexes are 244,035/2,446,335 bytes. Static shell gzip is 5,628 bytes; the separate React counter island adds 69,177 bytes. The existing manual benchmark now enforces measured output/index/shell/island ceilings and a local search p95 budget. See `docs/docs-performance.md` for parsing timings and synthetic-corpus limitations.

**Release rulings:** Manual finalization validates and checks out the requested immutable Docs tag. A failed npm command is followed by bounded registry polling and actual tarball comparison; matching publication is accepted without republishing, mismatch or persistent absence fails. Recovery/rollback instructions are in `docs/docs-release.md`. The manifest remains `0.0.0` with a minor Changeset planning `0.1.0`; public npm lookup returned 404, not proof of private package state. A local JSR dry-run rejects the public Astro component syntax, so JSR remains unsupported. No version bump, tag, commit, deployment or publication was performed.

**Outstanding gates:** Manual screen-reader review and user screenshot approval; real root/subpath hosting; registry ownership/credentials and actual provenance attestation; explicit release authorization. Package contents, imports and two installed runtime versions are locally verified; provenance and rollback are documented but not exercised against a real release. Workflow completion above means local validation, not proof of a successful hosted run.

**Commit title:** `fix(docs): harden release recovery and establish release budgets`

**PR description:** Validate immutable-tag recovery and npm upload failure reconciliation, extend focused regression tests and measured performance budgets, and publish support/release limitations. Local package, consumer, browser and workflow checks pass; external deployment, accessibility approval and publishing remain separate gates.

## Parked work

Versioning and multilingual/RTL routing are now proposed replacement requirements in R2/R3. Migration-backed authoring and extension work belongs in R1/R4 rather than being implicitly excluded.

Hosted analytics, AI chat, interactive API console, theme marketplace, AsyncAPI, arbitrary shell replacement, registry/blocks and main website migration remain separately scoped. Inventory offline, blog/RSS, tags and social-card generation during R1 and record a deliberate support or exclusion decision; do not claim universal ecosystem parity.

## Handoff format

After each batch update its checkboxes, record the focused check and any blocker, then provide a commit title and short PR description. Keep temporary batch numbers in this plan and PR materials; source comments explain enduring behavior.
