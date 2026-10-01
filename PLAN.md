# Monoline Docs — First Public Release Plan

> Execute one batch at a time using the executing-plans skill. Update these checkboxes with evidence; do not equate implemented code with verified completion.

**Goal:** Publish a configurable documentation product for open-source libraries, SDKs, SaaS products and APIs.

**Architecture:** Astro compiles Markdown/MDX to static output. Monoline owns YAML configuration, the shell, semantic design tokens, navigation, search and safe publishing. React hydrates only explicitly requested examples.

**Scope:** `packages/docs`, `apps/docs-demo`, relevant consumer fixtures and narrowly required build/release scripts. Monoline UI and Docs remain independently published products.

**Architecture reference:** [Astro engine design](docs/superpowers/specs/2026-09-14-docs-astro-engine-design.md). This roadmap supersedes its implementation order for product completion; preserve its output-safety and isolation contracts.

## Tracking and execution

- Keep work on the current `feat/docs-astro-engine` branch unless the user requests otherwise.
- The user handles commits and PRs. Supply a commit title and concise PR materials; do not commit, push, publish or deploy automatically.
- Implement functionality first. Add one meaningful check for changed boundaries; defer comprehensive documentation, broad test expansion and performance campaigns to the release gate.
- Use the existing modules and installed dependencies. Add a package, abstraction or dependency only for a demonstrated requirement.
- A batch finishes when its user-facing behavior works, its focused check passes and remaining limitations are recorded here.
- Preserve unrelated changes. Do not mix parked release automation into product batches.

## Current evidence — October 1, 2026

| Batch        | State                                      | Evidence / remaining work                                                                                                                                                      |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1            | Foundation implemented; follow-up required | Commit `a009d1c`; nested config, frontmatter and slugs implemented. Remaining contract gaps are assigned below.                                                                |
| 2            | In progress                                | Shell changes remain uncommitted in four files. Prior browser checks passed root/subpath/clean URLs, themes, mobile, no-JS and axe. Visual review and missing controls remain. |
| 3–7          | Pending                                    | Existing primitives may be reused; no whole batch is accepted yet.                                                                                                             |
| Release gate | Pending                                    | Publication stays blocked until all batches and release checks pass.                                                                                                           |

## Batch 1 — Product configuration and stable content contract

**Owns:** `packages/docs/src/config.ts`, `load-config.ts`, `content.ts`, `navigation.ts`, `index.ts`; their existing focused tests and consumer config fixtures.

**Contract:** `defineConfig` validates and normalizes configuration; `loadConfig` resolves config-relative paths; `discoverPages` produces the single page/route manifest consumed by rendering and publishing.

- [x] Normalize nested `branding`, `header`, `appearance`, `content`, `search` and `seo` options while accepting existing flat aliases.
- [x] Add validated `navTitle`, `seoTitle`, `slug`, `search`, `noindex`, `updatedAt`, `tags`, `badge` and `layout` frontmatter.
- [x] Resolve explicit slugs through the existing route manifest and reject duplicate routes.
- [x] Wire title templates, navigation titles, search exclusions and page indexing controls into rendering.
- [x] Prevent Astro from interpreting Monoline's `layout` value as a component import.
- [x] Verify package regressions, production demo and packed consumers; prior run reported 115 package tests passing.
- [ ] Finish boundary review: real calendar-date validation, conflicting aliases, invalid slugs and safe file-derived routes. Add only the missing regression assertions.
- [ ] Allocate remaining configuration to its consumer batch: appearance/header/sidebar/content controls in Batch 2; sections/tabs in Batch 3; social metadata in Batch 6. Do not accept silent no-op options.

**Done when:** existing consumer configuration still works and every accepted option has a working consumer or an explicit validation error.

## Batch 2 — Premium responsive shell

**Owns:** `astro-page.astro`, `astro-navigation.astro`, `docs.css`, `client.js`, `search.js`; extend `config.ts` and engine serialization only for controls used here.

- [x] Implement sticky header, reading column, sidebar active rail, breadcrumbs, page metadata and previous/next cards.
- [x] Add search shortcut, theme control, mobile drawer, copy-page-link action and TOC observation.
- [ ] Finish keyboard behavior: drawer focus containment, background interaction exclusion, Escape, focus restoration and viewport changes. Prefer native dialog behavior where practical.
- [ ] Add validated comfortable/compact density and use it in layout spacing.
- [ ] Add configurable header primary action and announcement banner, with safe internal/external links.
- [ ] Add explicit content controls for last-updated visibility and page-copy action; define whether copying means link or Markdown rather than mixing the actions.
- [ ] Add branding favicon, body/code font controls and radius/accent customization through validated tokens and local assets. No remote font fetch by default.
- [ ] Verify sticky offsets, heading scroll margins, very long titles, header wrapping and reference-page width.
- [ ] Inspect production screenshots on desktop/mobile in light/dark; correct spacing, contrast and visual hierarchy.
- [ ] Run the existing browser fixture with focused assertions for drawer and shortcut behavior; check print and reduced-motion presentation.

**Done when:** both themes and densities look intentional, the mobile drawer is accessible and all shell controls work with a no-JS reading/navigation fallback.

## Batch 3 — Navigation and content experience

**Owns:** `navigation.ts`, `config.ts`, `astro-navigation.astro`, `astro-page.astro`, `rendered-content.ts`, `links.ts`, `urls.ts`, `client.js`.

- [ ] Extend navigation to top-level sections/tabs while preserving existing link/group arrays.
- [ ] Resolve active section, sidebar and previous/next sequence from the same route manifest. Keep sections URL-driven.
- [ ] Support nested groups, ordering, optional icons/badges and configurable initial group expansion.
- [ ] Preserve sidebar scroll position per site base with storage failure fallback.
- [ ] Complete heading anchors, active TOC behavior and deep-link scrolling under the sticky header.
- [ ] Polish responsive tables/code overflow and the 404 experience without changing output URL semantics.
- [ ] Verify one nested site at root and subpath, an explicit slug, a missing route and a broken fragment.

**Done when:** guides and API sections navigate correctly, moving a source file with a retained slug preserves its public URL and no duplicate route source exists.

## Batch 4 — Essential authoring components

**Owns:** `src/components`, authoring styles and existing client enhancement; `build.mjs`/package exports only when required to ship components.

- [ ] Audit and reuse Steps, Tabs, Callouts, ApiTable, CodeBlock and LinkCard before creating replacements.
- [ ] Add CardGrid/Card, Accordion, FileTree, Badge and Figure/caption using static HTML where possible.
- [ ] Add CodeGroup with synchronized package-manager selection and keyboard operation.
- [ ] Add TypeTable and Preview with clear semantics for static examples and optional interactive islands.
- [ ] Make imports available from the packed package; keep plain Markdown independent of component imports.
- [ ] Render one component fixture in both themes, with keyboard and no-JS checks for interactive components.

**Done when:** every component can be imported by an external consumer and follows the same Monoline design and accessibility conventions.

## Batch 5 — Library and OpenAPI documentation

**Owns:** existing reference components and content/route pipeline; add a focused OpenAPI module only where existing responsibilities do not fit.

- [ ] Add package installation UI and npm/pnpm/Yarn/Bun examples using CodeGroup.
- [ ] Finish reference layout for types, exports, compatibility, package/source links and copyable examples.
- [ ] Accept local OpenAPI 3.0/3.1 files and validate unsupported/invalid input with the source path.
- [ ] Generate deterministic endpoint routes, tag navigation and operation/schema deep links in the existing manifest; reject collisions with authored pages.
- [ ] Render parameters, request bodies, response schemas and examples, including local references and recursive schemas without infinite expansion.
- [ ] Generate copyable request examples with explicit placeholders for credentials.
- [ ] Verify one packed library fixture and one OpenAPI fixture, including invalid spec and duplicate-operation cases.

**Done when:** a library and an API can produce useful static reference pages without hand-authoring every endpoint.

**Deferred:** interactive API requests, credential storage, proxy services and AsyncAPI. Remote reference loading is opt-in only after fetch policy is designed.

## Batch 6 — Search, SEO and integration

**Owns:** `search.js`, `astro-engine.ts`, `astro-page.astro`, configuration and the existing rendered-content inspection.

- [ ] Add guide/API search scopes, highlighted matches, local recent searches and useful empty results.
- [ ] Honor site/page search controls without exposing drafts or excluded content. Preserve keyboard navigation and retry behavior.
- [ ] Measure current search on a representative large fixture; adopt Pagefind only if results justify the added dependency and migration.
- [ ] Complete canonical URLs, title templates, social images/cards, favicon, robots and sitemap exclusions for `noindex` pages.
- [ ] Add appropriate breadcrumb/technical-page structured data from the existing manifest; do not invent authors, dates or claims.
- [ ] Add filtered Markdown export, copy-as-Markdown and `llms.txt`/`llms-full.txt` using published content only.
- [ ] Add explicit optional analytics/custom-script configuration with no bundled provider or tracking by default.
- [ ] Verify one searchable guide/API pair, excluded content, subpath metadata and unsafe integration input.

**Done when:** discovery features agree on published routes and visibility rules, with stable metadata and useful search.

## Batch 7 — Adoption and real-product migration

**Owns:** `cli.js`, existing build/dev entry points, `apps/docs-demo`, Ask Widget fixture and packed-consumer verification.

- [ ] Implement `monoline-docs init` to create minimal config, content and scripts; refuse to overwrite existing files silently.
- [ ] Test an empty-directory start using a packed package with npm and strict pnpm resolution.
- [ ] Make Monoline Docs' own documentation use the completed product; keep repository maintainer documents outside published content unless explicitly selected.
- [ ] Complete Ask Widget migration in a fixture first, including all existing reference links and interactive examples. External repository edits require user authorization.
- [ ] Prepare portable static deployment configuration for Vercel, Netlify, GitHub Pages and Cloudflare Pages at root/subpath.
- [ ] Verify production output from all representative fixtures and record unresolved limitations.

**Done when:** a new consumer can initialize/build the site and real library/API documentation uses only the packed package's public surface.

## Release gate — after seven batches

- [ ] Reconcile every incomplete item above and publish accurate support/limitations documentation.
- [ ] Complete broader integration/browser coverage where the completed product reveals gaps; verify keyboard, screen reader, no-JS and reduced motion.
- [ ] Approve desktop/mobile screenshots in both themes and densities.
- [ ] Record build/output/search baselines for 100 and 1,000 pages; enforce budgets based on measured output, including shell JS versus optional islands.
- [ ] Verify real-host deployments and root/subpath behavior with separate user approval for external deployment.
- [ ] Verify package contents, supported runtime versions, consumer imports, provenance and rollback instructions.
- [ ] Reassess JSR compatibility before promising support; npm is the first release target while required Astro files remain incompatible.
- [ ] Finish and validate `docs-v*` tagging/npm workflows, including retry/idempotency, permissions and publish failure recovery.
- [ ] Prepare Changeset/release notes and user-facing commit/PR materials.
- [ ] Publish only after explicit user approval. Confirm the planned version from the repository's actual release state.

## Parked work

Full versioning, multilingual routing, hosted analytics, AI chat, interactive API console, theme marketplace, AsyncAPI, arbitrary shell replacement, registry/blocks and main website migration remain outside this release unless the user changes scope.

## Handoff format

After each batch update its checkboxes, record the focused check and any blocker, then provide a commit title and short PR description. Keep temporary batch numbers in this plan and PR materials; source comments explain enduring behavior.
