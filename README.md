<div align="center">
  <img src="./assets/logo_stroke.png" alt="monoline-ui logo" width="200" height="auto" style="background: #000; padding: 24px; border-radius: 32px;" />
  <br/>
  <br/>
  <h1>Monoline</h1>

  <p>React components and a static documentation builder.<br/>
  Two independent packages with a shared Monoline design language.</p>

  <p>
    <a href="https://www.npmjs.com/package/@chitrank2050/monoline-ui">
    <img src="https://img.shields.io/npm/v/@chitrank2050/monoline-ui" alt="Monoline UI on npm" />
    </a>
    <a href="https://jsr.io/@chitrank2050/monoline-ui">
    <img src="https://jsr.io/badges/@chitrank2050/monoline-ui" alt="Monoline UI on JSR" />
    </a>
  </p>

  <p>
    <a href="https://github.com/chitranklabs/monoline-ui/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/chitranklabs/monoline-ui/ci.yml?branch=main&style=flat-square" alt="CI Status" />
    </a>
    <a href="https://github.com/chitranklabs/monoline-ui/actions/workflows/scorecard.yml">
      <img src="https://github.com/chitranklabs/monoline-ui/actions/workflows/scorecard.yml/badge.svg" alt="Scorecard Status" />
    </a>
    <a href="https://scorecard.dev/viewer/?uri=github.com/chitranklabs/monoline-ui">
      <img src="https://api.scorecard.dev/projects/github.com/chitranklabs/monoline-ui/badge" alt="OpenSSF Scorecard" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/github/license/chitranklabs/monoline-ui" alt="License" />
    </a>
  </p>

  <a href="https://ko-fi.com/D1D71U581P" target="_blank">
    <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy me a coffee at ko-fi.com" />
  </a>

  <br/>
  <br/>

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Setup](#setup--integration) • [Contributing](#contributing)

  <br/>
</div>

Monoline contains two products: **Monoline UI** for React interfaces and
**Monoline Docs** for static documentation sites. They share repository tooling
and semantic colors, with separate APIs, consumers and releases.

## Repository Workspaces

| Workspace        | Use it for                                                       | Start here                                                                  |
| :--------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `packages/ui`    | React components and Tailwind CSS v4 foundations                 | [UI package guide](./packages/ui/README.md)                                 |
| `apps/website`   | UI documentation, examples and playground                        | [Published UI documentation](https://monolineui.chitrankagnihotri.com/docs) |
| `packages/docs`  | Markdown/MDX documentation builder, CLI and authoring components | [Docs package guide](./packages/docs/README.md)                             |
| `apps/docs-demo` | A consumer demonstrating Docs features and authoring workflows   | [Run the Docs demo](./apps/docs-demo/README.md)                             |

Choose **UI** when you are building a React application. Choose **Docs** when you
want to write documentation and publish static HTML. You do not need the UI
package to use Docs; its authoring components are Astro components, not React
components from Monoline UI.

## Why Monoline UI

Monoline UI provides components for developer portfolios, documentation and
editorial interfaces. Typed component subpaths distinguish static primitives
from interactive client components, while CSS tokens keep light and dark styling
consistent. See [compatibility](https://monolineui.chitrankagnihotri.com/docs/compatibility)
for runtime boundaries and supported environments.

## Features <a id="features"></a>

| Product           | Capabilities                                                                                 |
| :---------------- | :------------------------------------------------------------------------------------------- |
| UI                | React components, compound APIs, semantic themes, link composition and typed ESM subpaths    |
| Docs              | Markdown/MDX builds, navigation, local search, syntax highlighting and light/dark themes     |
| Docs authoring    | Installation steps, callouts, cards, tables, code tabs and interactive examples              |
| Docs integrations | Local OpenAPI generation, optional React islands, Markdown/AI exports and an authoring skill |

## Quick Start <a id="quick-start"></a>

### Use Monoline UI in a React app

Install into an existing React application with Tailwind CSS v4:

```sh
pnpm add @chitrank2050/monoline-ui
```

Import the theme once in your global stylesheet:

```css
@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";
```

Then import a component through its subpath:

```tsx
import { Button } from "@chitrank2050/monoline-ui/button"

export function Example() {
	return <Button>View projects</Button>
}
```

Follow the [installation guide](https://monolineui.chitrankagnihotri.com/docs/installation)
for application setup and the [component catalog](https://monolineui.chitrankagnihotri.com/docs/components)
for examples and API details. The theme registers compiled component sources with
Tailwind; a package-specific `@source` path is not required.

### Try Monoline Docs

> [!IMPORTANT]
> Monoline Docs is not published yet. To create a separate documentation project,
> use the [package guide's local tarball workflow](./packages/docs/README.md#installation).
> Registry installation becomes available after the first release.

To explore the demo from a repository checkout, use Node.js 24.14 or newer and
the pnpm version declared in the root `packageManager` field:

```sh
pnpm install
pnpm --filter @monoline/docs-demo dev
```

Open the address printed by the preview server. Edit
`apps/docs-demo/content/index.mdx` to see content changes reload. The demo builds
the Docs package first; restart the preview after configuration changes.

Use the [getting started guide](./apps/docs-demo/content/getting-started.mdx) to
create a site, then [writing pages](./apps/docs-demo/content/writing.md) to author
content and [deployment](./docs/docs-deployment.md) to publish static output.

## Documentation & Links

The [documentation index](./docs/README.md) routes readers to consumer guides,
repository architecture and maintainer operations.

| Audience                 | Resources                                                                                                                                                                                                                                                                                          |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UI consumers             | [Installation](https://monolineui.chitrankagnihotri.com/docs/installation), [components](https://monolineui.chitrankagnihotri.com/docs/components), [theming](https://monolineui.chitrankagnihotri.com/docs/theming), [accessibility](https://monolineui.chitrankagnihotri.com/docs/accessibility) |
| Docs consumers           | [Getting started](./apps/docs-demo/content/getting-started.mdx), [configuration](./apps/docs-demo/content/configuration.md), [CLI](./apps/docs-demo/content/cli.md), [support](./apps/docs-demo/content/support.md)                                                                                |
| AI-assisted Docs authors | [Agent guide](./apps/docs-demo/content/using-with-ai-agents.md) and [maintained skill](./packages/docs/skills/monoline-docs/SKILL.md)                                                                                                                                                              |
| Contributors             | [Local setup and change workflow](./CONTRIBUTING.md)                                                                                                                                                                                                                                               |
| Maintainers              | [UI releases](./docs/releases.md), [Docs releases and recovery](./docs/docs-release.md), [Docs roadmap](./packages/docs/ROADMAP.md)                                                                                                                                                                |

## Tech Stack

Repository requirements are declared in [package.json](./package.json); use its
Node.js engine and pinned pnpm version. Package manifests are authoritative for
dependencies and peer ranges.

| Workspace    | Runtime and build                                          |
| :----------- | :--------------------------------------------------------- |
| UI package   | React, TypeScript, Tailwind CSS v4 and tsup                |
| UI website   | Next.js App Router, consuming built UI exports             |
| Docs package | Node.js CLI, Astro and MDX compilation, static HTML output |
| Docs demo    | Markdown/MDX content and configuration consumed by Docs    |

## Technical Specification

- **UI:** ESM, TypeScript declarations and a separate theme CSS import. React and
  React DOM 18.2 or 19 are supported. Static subpaths remain server-safe;
  interactive subpaths declare client behavior. The mixed root barrel is a
  client boundary.
- **Docs:** Node.js 24.14 or newer. Generated sites are static; React 19 and React
  DOM 19 are optional for explicitly hydrated islands. Configuration and MDX are
  trusted executable author input, not a sandbox for untrusted content.
- **Publication:** UI targets npm and JSR. Docs targets npm. Fixtures, visual
  baselines and consumer sites are repository assets, not published package APIs.

See the [UI package guide](./packages/ui/README.md) and
[Docs support boundaries](./apps/docs-demo/content/support.md) for details.

## Architecture <a id="architecture"></a>

```text
monoline-ui/
├── apps/
│   ├── website/           # UI documentation and playground
│   └── docs-demo/         # Docs consumer and documentation site
├── packages/
│   ├── ui/                # React components and CSS foundations
│   └── docs/              # Static documentation builder
├── scripts/               # Build, verification and release tooling
└── docs/                  # Documentation index, architecture and operations
```

The [architecture guide](./docs/architecture.md) explains package boundaries,
shared colors, site generation, verification and independent release paths.

## Setup & Integration

<a id="1-tailwind-css-v4"></a>
<a id="2-server-and-client-runtime-boundaries"></a>
<a id="3-react-19-server-actions"></a>
<a id="4-link-polymorphism"></a>

Application integration belongs in the consumer documentation:

- **UI:** [Installation](https://monolineui.chitrankagnihotri.com/docs/installation),
  [server/client boundaries](https://monolineui.chitrankagnihotri.com/docs/compatibility),
  [theming](https://monolineui.chitrankagnihotri.com/docs/theming) and
  [composition patterns](https://monolineui.chitrankagnihotri.com/docs/patterns).
- **Docs:** [Configuration](./apps/docs-demo/content/configuration.md),
  [authoring components](./apps/docs-demo/content/components.mdx),
  [programmatic builds](./apps/docs-demo/content/programmatic-api.md) and
  [deployment recipes](./docs/docs-deployment.md).

## Development Commands

Run commands from the repository root. Site commands build their owning package
first; the UI website needs `pnpm build:lib` again after library source edits.

| Task                         | Command                                 |
| :--------------------------- | :-------------------------------------- |
| UI website                   | `pnpm dev`                              |
| Docs demo                    | `pnpm --filter @monoline/docs-demo dev` |
| Both packages and sites      | `pnpm build:all`                        |
| UI package consumers         | `pnpm check:package`                    |
| UI production website        | `pnpm check:website`                    |
| Docs package and demo        | `pnpm check:docs`                       |
| All local verification gates | `pnpm check:all`                        |

Read [CONTRIBUTING.md](./CONTRIBUTING.md) for prerequisites, focused checks,
component changes and CI selection. Browser checks require Chromium; install it
with `pnpm test:browser:install`.

## Release Process

Monoline uses Changesets and independent prepare/finalize workflows. Keep
changesets for the two packages separate; site-only edits do not require a
package version bump. UI tags use `vX.Y.Z`; Docs tags use `docs-vX.Y.Z`.

Read the [UI release guide](./docs/releases.md) or
[Docs release and recovery guide](./docs/docs-release.md) before preparing or
retrying publication. UI release history lives in
[packages/ui/CHANGELOG.md](./packages/ui/CHANGELOG.md); the
[root changelog](./CHANGELOG.md) is historical.

## Contributing <a id="contributing"></a>

Start with the [contributor guide](./CONTRIBUTING.md). Select the workspace that
owns the change and update its consumer documentation when public behavior
changes. Repository and site documentation ownership is explained in the
[documentation index](./docs/README.md#where-documentation-lives).

## Community & Support

Use [GitHub issues](https://github.com/chitranklabs/monoline-ui/issues) for
reproducible bugs and [discussions](https://github.com/chitranklabs/monoline-ui/discussions)
for questions. Follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Security & Quality

Report vulnerabilities through [SECURITY.md](./SECURITY.md). Local hooks and CI
cover secret scanning, dependency checks and workflow analysis; automated checks
do not replace the external release acceptance gates recorded in the
[Docs roadmap](./packages/docs/ROADMAP.md).

<p align="center">❤️ Developed by <a href="https://chitrankagnihotri.com">Chitrank Agnihotri</a></p>
