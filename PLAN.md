# Monoline Docs — Product Completion and Release Plan

> **Scope correction — October 2, 2026.** Following review of the audit findings, speculative competitor drop-in migration requirements (R1/A3, Starlight/MkDocs synthetic fixtures), multi-locale routing and versioning have been returned to Parked Work. Monoline Docs is an independent, high-performance static documentation product for Monoline, SDKs, and SaaS/API teams.
>
> Implementation work now proceeds directly through the focused **Release Gate** milestones below to resolve confirmed defects (A1, A4, A6, A7) and verify the production package for release.

**Goal:** Build a dependable, fast, accessible, and beautiful documentation engine for Monoline, modern library/SDK authors, and SaaS/API teams with static Markdown/MDX, semantic design tokens, clean navigation, local search, and OpenAPI support.

**Architecture:** Astro compiles Markdown/MDX to static output. Monoline owns YAML configuration, the shell, semantic design tokens, navigation, search and safe publishing. React hydrates only explicitly requested examples.

**Scope:** `packages/docs`, `apps/docs-demo`, relevant consumer adoption checks and narrowly required build/release scripts. Monoline UI and Docs remain independently published products.

**Architecture reference:** [Astro engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md). Preserve its output-safety and isolation contracts.

**Audit reference:** [October 2026 audit](docs/docs-audit-2026-10-02.md). Focus on confirmed defects: A1 (output promotion recovery), A4 (Unicode search highlight offset), A6 (mobile header & touch sizing), and A7 (prototype test cleanup).

## Required reading before implementation

Every implementing agent must read the [Docs engineering guidelines](packages/docs/AGENTS.md), [Astro engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md), and [audit](docs/docs-audit-2026-10-02.md), then the references for its milestone below.

| Milestone                            | Required references                                                                                                                                                                                  | What the agent must establish                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| RG1 — Output recovery                | [Audit A1](docs/docs-audit-2026-10-02.md#a1--p1-final-output-promotion-does-not-preserve-last-good-files-on-write-failure), [release/recovery guide](docs/docs-release.md)                           | Last-good-output guarantee, atomic promotion, and clean recovery failure modes.                                            |
| RG2 — Search Unicode highlighting    | [Audit A4](docs/docs-audit-2026-10-02.md#a4--p2-unicode-search-highlighting-uses-incompatible-offsets), `packages/docs/src/client/search.js`                                                         | Search match highlighting preserves correct character offsets across normalization length changes and combining marks.     |
| RG3 — Mobile reading & touch targets | [Audit A6](docs/docs-audit-2026-10-02.md#a6--p2-mobile-header-and-controls-need-a-reading-oriented-layout), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Reduced mobile header vertical footprint (target ≤160px) and accessible touch targets (≥44px primary) in reading flow.     |
| RG4 — Test scope cleanup             | [Audit A7](docs/docs-audit-2026-10-02.md#a7--p2-test-evidence-includes-an-inactive-markdown-renderer), `packages/docs/src/markdown-features.test.ts`                                                 | Retire inactive prototype renderer imports from test suite; verify all active authoring features run against Astro engine. |
| RG5 — Release verification           | [Release guide](docs/docs-release.md), [performance baselines](docs/docs-performance.md)                                                                                                             | Full package suite, packed npm/strict pnpm consumer builds, production demo build, and clean provenance.                   |

## Tracking and execution

- Keep work on the current `feat/docs-astro-engine` branch unless the user requests otherwise.
- The user handles commits and PRs. Supply a commit title and concise PR materials; do not commit, push, publish or deploy automatically.
- Verify each milestone's production behavior, accessibility and performance before marking it complete.
- Use existing modules and installed dependencies. Avoid adding speculative dependencies or synthetic migration fixtures.
- Preserve unrelated changes.

## Current evidence — October 2, 2026

**Implementation status:** Batches 1 to 7 are complete. RG1 (output promotion recovery) is complete and committed in `d7517cb`.

| Batch        | State       | Evidence / remaining work                                                                                                                                                                               |
| ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1            | Complete    | Boundary review verified: 146 package tests, typecheck, targeted lint, package build, engine fixture, nine-page demo and packed npm/strict pnpm consumers pass.                                         |
| 2            | Complete    | 159 package tests, typecheck/lint, demo/engine, packed consumers and production Chrome checks pass. Both densities/themes inspected on desktop/mobile; initial CLS below 0.01.                          |
| 3            | Complete    | 171 package tests, typecheck/lint, engine/demo and packed consumers pass; production Chrome verifies sections, sticky anchors, desktop/mobile scroll restoration and no-JS navigation.                  |
| 4            | Complete    | Static authoring components and synchronized CodeGroup verified: 171 package tests, engine/demo, packed npm/strict pnpm public imports, keyboard/no-JS/print and Chrome/axe at root/subpath/clean URLs. |
| 5            | Complete    | Library references and local OpenAPI verified: 193 tests, typecheck/lint, package/demo builds, packed npm/strict pnpm and Chrome/axe at root/subpath/clean URLs.                                        |
| 6            | Complete    | Search/SEO/exports verified: 202 package tests, typecheck/lint, package/engine/demo builds and production Chrome at root/subpath/clean URLs.                                                            |
| 7            | Complete    | Safe init, isolated packed npm/strict pnpm starts, own docs and Ask Widget migration verified. Root/subpath browser checks pass; host deployments remain release-gate work.                             |
| Release gate | In progress | RG1 and RG2 completed. Addressing RG3 (A6), RG4 (A7), and final verification RG5.                                                                                                                       |

## Release Gate — Audit Remediation and Packaging

### RG1 — Recover safely from failed output promotion (Audit A1)

**Owns:** `packages/docs/src/output.ts`, `output.test.ts`, `build.test.ts`, `dev.test.ts`. **Closes:** A1.

- [x] Add a regression reproducing a late write failure after an earlier tracked output was overwritten; observe the current failure first.
- [x] Define and implement promotion recovery for generated files and their manifest while preserving unrelated files. Keep staging on the appropriate filesystem; serialize or explicitly reject concurrent writers.
- [x] Exercise failed writes, stale-file removal and manifest replacement. Compare prior file bytes and manifest before/after; verify next successful build and dev preview recovery.
- [x] Run focused output/dev tests, package build and engine failure-preservation fixture; reconcile documented guarantee with measured behavior.

**Completed — October 2, 2026 (`d7517cb`):** Atomic output promotion implemented and verified. Fault-injection tests cover late page, stale-delete, manifest errors, concurrent writer locks (`.monoline-promotion`), and cross-filesystem staging. All 221 package tests pass.

### RG2 — Fix Unicode search highlighting offset drift (Audit A4)

**Owns:** `packages/docs/src/search.js`, `search.test.ts`. **Closes:** A4.

- [x] Add regression tests reproducing the offset drift when NFKC normalization changes string length (e.g. ligature `ﬃ`, combining marks, non-Latin strings).
- [x] Implement offset-safe match highlighting that maps normalized match bounds back to original authored code points.
- [x] Verify safe DOM text-node construction and highlight rendering across search queries.

**Completed — October 2, 2026:** Regression test in `search.test.ts` confirmed the `ﬃ setup` offset drift (`Received: "tup"` instead of `"setup"`). Implemented cumulative normalization index mapping (`buildIndexMap`) in `search.js`, handling length expansion (ligatures, fullwidth), contraction/composition (combining marks), and pure ASCII fast paths. All 222 package tests pass, typecheck passes, targeted ESLint passes, and `apps/docs-demo` builds 10 pages cleanly.

**Commit title:** `fix(docs): preserve correct Unicode search highlighting offsets`

**PR description:** Correct search highlight character offset drift caused by NFKC length changes and combining marks. Map normalized match bounds back to original code units and verify safe DOM text-node construction across search queries.

### RG3 — Polish mobile header layout and touch targets (Audit A6)

**Owns:** `docs.css`, `astro-page.astro`, `astro-navigation.astro`, `test-browser.mjs`. **Closes:** A6.

- [ ] Optimize mobile header vertical footprint to reduce viewport crowding (target ≤160px on 375px mobile viewports).
- [ ] Ensure primary interactive touch targets (search trigger, mobile menu toggle, theme toggle) meet the 44×44px sizing guideline while preserving clean visual density.
- [ ] Verify 320px reflow, zoom, and desktop/mobile layout integrity across light and dark themes.

### RG4 — Retire prototype renderer tests and align test scope (Audit A7)

**Owns:** `markdown-features.test.ts`, `test-engine.mjs`. **Closes:** A7.

- [ ] Audit remaining test files for imports of the inactive static prototype renderer (`renderMarkdown`).
- [ ] Migrate essential assertions to the production Astro engine or retire obsolete prototype tests.
- [ ] Ensure `pnpm --filter @chitrank2050/monoline-docs test` cleanly reflects production code paths only.

### RG5 — Final release verification and release decision

**Owns:** Release workflows, package manifests, demo application.

- [ ] Reverify isolated packed consumers (`npm` and strict `pnpm`) using clean `test-consumer.mjs` without synthetic migration fixtures.
- [ ] Run full package typecheck, lint, build, and `apps/docs-demo` build.
- [ ] Review package exports, readme, and changeset.
- [ ] Request explicit user authorization before tagging or publishing.

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

## Release Gate — Historical Baseline and Verification Record

Completed checks below describe the release candidate baseline established at Batch 7.

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

## Parked work

The following areas are explicitly parked outside this initial release to maintain a high-quality, focused product:

- Drop-in competitor migration fixtures and automated foreign framework parsers (MkDocs, Starlight).
- Multi-locale routing, fallback mechanisms, and right-to-left (RTL) layout switching.
- Multi-version documentation systems (e.g. `mike`-style or version selector dropdowns).
- 10,000-page Pagefind search replacement (current linear index is fast and compact at measured budgets).
- Hosted analytics, AI chat / retrieval backend, interactive API execution console, AsyncAPI, and theme marketplace.

## Handoff format

After each batch update its checkboxes, record the focused check and any blocker, then provide a commit title and short PR description. Keep temporary batch numbers in this plan and PR materials; source comments explain enduring behavior.
