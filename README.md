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
    <a href="https://www.npmjs.com/package/@chitrank2050/monoline-docs">
    <img src="https://img.shields.io/npm/v/@chitrank2050/monoline-docs?label=Docs%20npm" alt="Monoline Docs on npm" />
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

[Why UI](#why-monoline-ui) • [Why Docs](#why-monoline-docs) • [Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Contributing](#contributing)

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
editorial interfaces. Compose React components with Tailwind CSS v4 and semantic
CSS tokens to keep light and dark styling consistent. Typed component subpaths
distinguish static primitives from interactive client components.

Start with the [component catalog](https://monolineui.chitrankagnihotri.com/docs)
and [UI package guide](./packages/ui/README.md) for examples and supported environments.

## Why Monoline Docs

Monoline Docs turns Markdown and MDX into a static documentation site. Start with
ordinary pages, then add authoring components for installation steps, code tabs
and reference tables. Navigation, local search and Markdown exports use the same
content; an OpenAPI specification can supply generated API reference pages.

The [Docs demo](./apps/docs-demo/README.md) demonstrates the package as a consumer.
The [Docs package guide](./packages/docs/README.md) covers creating your own site
and deploying its static output.

## Features <a id="features"></a>

| Product           | Capabilities                                                                                            |
| :---------------- | :------------------------------------------------------------------------------------------------------ |
| UI components     | React components, compound APIs, link composition and typed ESM subpaths.                               |
| UI styling        | Tailwind CSS v4 foundations and semantic tokens for light and dark themes.                              |
| Docs sites        | Markdown/MDX builds, navigation, local search, syntax highlighting and static HTML output.              |
| Docs authoring    | Installation steps, callouts, cards, tables, code tabs and interactive examples.                        |
| Docs integrations | OpenAPI reference generation, optional React islands, Markdown/AI exports and an agent authoring skill. |

## Quick Start <a id="quick-start"></a>

### Monoline UI

<a id="use-monoline-ui-in-a-react-app"></a>

Use an existing React 18.2 or React 19 application with Tailwind CSS v4:

```sh
npm install @chitrank2050/monoline-ui
```

Import the stylesheet once in your global CSS:

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

Follow the [UI package guide](./packages/ui/README.md) for framework setup,
theming and supported environments.

### Monoline Docs

<a id="try-monoline-docs"></a>

Use Node.js 24.14 or newer in your documentation project:

```sh
npm install @chitrank2050/monoline-docs
npx monoline-docs init
npm run dev
```

Edit `content/index.md`, then run `npm run build` to generate static output.
See the [Docs package guide](./packages/docs/README.md) for the next steps.

## Documentation & Links

The [documentation index](./docs/README.md) connects both packages' consumer
guides, AI authoring instructions and maintainer operations. Each topic has one
owning guide.

<a id="tech-stack"></a>

## Technical Specification

- **UI:** React and React DOM 18.2 or 19, Tailwind CSS v4, ESM exports and TypeScript
  declarations. Static component subpaths remain server-safe; interactive
  subpaths and the mixed root barrel declare client behavior.
- **Docs:** Node.js 24.14 or newer, Markdown/MDX compilation and static HTML output.
  React 19 islands are optional. MDX and JavaScript configuration are trusted
  executable author input.
- **Repository:** Use the Node.js engine and pnpm version declared in
  [package.json](./package.json). UI publishes to npm and JSR; Docs publishes to npm.

## Architecture <a id="architecture"></a>

The two packages release independently. Each has a consumer site in `apps/`;
shared repository scripts handle builds, verification and release preparation.
Read [the architecture guide](./docs/architecture.md) for package boundaries and
[the documentation index](./docs/README.md) for consumer and maintainer guides.

## Setup & Integration

<a id="1-tailwind-css-v4"></a>
<a id="2-server-and-client-runtime-boundaries"></a>
<a id="3-react-19-server-actions"></a>
<a id="4-link-polymorphism"></a>

For application integration, follow the [UI package guide](./packages/ui/README.md)
or [Docs package guide](./packages/docs/README.md).
To develop this repository, follow [CONTRIBUTING.md](./CONTRIBUTING.md) for
prerequisites, installation and workspace-specific checks.

## Development Commands

Run from the repository root:

| Task                         | Command                                 |
| :--------------------------- | :-------------------------------------- |
| UI website                   | `pnpm dev`                              |
| Docs demo                    | `pnpm --filter @monoline/docs-demo dev` |
| Both packages and sites      | `pnpm build:all`                        |
| All local verification gates | `pnpm check:all`                        |

## Release Process

Changesets drive independent releases: UI tags use `vX.Y.Z`, and Docs tags use
`docs-vX.Y.Z`. Read the [UI release guide](./docs/releases.md) or
[Docs release guide](./docs/docs-release.md) before preparing or recovering a release.

## Contributing <a id="contributing"></a>

<a id="community--support"></a>
<a id="security--quality"></a>

Start with [CONTRIBUTING.md](./CONTRIBUTING.md). Use
[issues](https://github.com/chitranklabs/monoline-ui/issues) for reproducible bugs
and [discussions](https://github.com/chitranklabs/monoline-ui/discussions) for questions.
Follow the [Code of Conduct](./CODE_OF_CONDUCT.md), and report vulnerabilities
through [SECURITY.md](./SECURITY.md).

Licensed under [MIT](./LICENSE).

<p align="center">❤️ Developed by <a href="https://chitrankagnihotri.com">Chitrank Agnihotri</a></p>
