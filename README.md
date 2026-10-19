<div align="center">
  <img src="./assets/logo.png" alt="Monoline logo" width="96" />
  <h1>Monoline</h1>
  <p>React components and a static documentation builder, with a shared design language.</p>

[UI Website](https://monolineui.chitrankagnihotri.com) · [UI Docs](https://monolineui.chitrankagnihotri.com/docs) · [Docs Website](https://monolinedocs.chitrankagnihotri.com) · [Docs Quickstart](https://monolinedocs.chitrankagnihotri.com/getting-started/)

[![UI npm](https://img.shields.io/npm/v/@chitrank2050/monoline-ui?label=UI%20npm)](https://www.npmjs.com/package/@chitrank2050/monoline-ui) [![Docs npm](https://img.shields.io/npm/v/@chitrank2050/monoline-docs?label=Docs%20npm)](https://www.npmjs.com/package/@chitrank2050/monoline-docs) [![CI](https://img.shields.io/github/actions/workflow/status/chitranklabs/monoline-ui/ci.yml?branch=main)](https://github.com/chitranklabs/monoline-ui/actions/workflows/ci.yml) [![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

</div>

## Why Monoline UI

Build developer portfolios, documentation and editorial interfaces with React
components, Tailwind CSS v4 and semantic light/dark tokens. Typed subpaths support
composition and distinguish static components from interactive client components.
See the [UI package guide](./packages/ui/README.md).

## Why Monoline Docs

Turn Markdown and MDX into static documentation with navigation, search,
highlighted code, authoring components, OpenAPI reference generation and Markdown/AI
exports. Docs works independently of Monoline UI; its authoring components use Astro.
See the [Docs package guide](./packages/docs/README.md).

## Quick Start

<a id="features"></a><a id="use-monoline-ui-in-a-react-app"></a><a id="try-monoline-docs"></a><a id="tech-stack"></a><a id="1-tailwind-css-v4"></a><a id="2-server-and-client-runtime-boundaries"></a><a id="3-react-19-server-actions"></a><a id="4-link-polymorphism"></a><a id="technical-specification"></a><a id="setup--integration"></a>

### Monoline UI

Use React 18.2 or 19 with Tailwind CSS v4:

```sh
npm install @chitrank2050/monoline-ui
```

Import once in your global CSS:

```css
@import "tailwindcss";
@import "@chitrank2050/monoline-ui/theme.css";
```

```tsx
import { Button } from "@chitrank2050/monoline-ui/button"

export function Example() {
	return <Button>View projects</Button>
}
```

Run your application to see the styled button. Continue with
[installation](https://monolineui.chitrankagnihotri.com/docs/installation),
[theming](https://monolineui.chitrankagnihotri.com/docs/theming) and the
[component catalog](https://monolineui.chitrankagnihotri.com/docs/components).

### Monoline Docs

Use Node.js 24.14 or newer in your documentation project:

```sh
npm install @chitrank2050/monoline-docs
npx monoline-docs init
npm run dev
```

Open the printed address and edit `content/index.md`. Run `npm run build` to
produce static output. Continue with [writing pages](https://monolinedocs.chitrankagnihotri.com/writing/),
[configuration](https://monolinedocs.chitrankagnihotri.com/configuration/) and
[deployment](https://monolinedocs.chitrankagnihotri.com/deployment/).

## Repository Workspaces

This monorepo contains two independently released packages and their consumer sites.
You can use either package without installing the other.

| Workspace        | Purpose                         | Guide                                                             |
| ---------------- | ------------------------------- | ----------------------------------------------------------------- |
| `packages/ui`    | React components and styling    | [UI package](./packages/ui/README.md)                             |
| `packages/docs`  | Static documentation builder    | [Docs package](./packages/docs/README.md)                         |
| `apps/website`   | UI documentation and playground | [UI documentation](https://monolineui.chitrankagnihotri.com/docs) |
| `apps/docs-demo` | Docs consumer and examples      | [Docs demo](./apps/docs-demo/README.md)                           |

## Documentation & Links

The [documentation index](./docs/README.md) connects consumer guides, AI authoring,
compatibility, accessibility and maintainer operations. Package READMEs own runtime
requirements and public entry points. UI is available on npm and JSR; Docs is
available on npm, with optional React 19 islands. MDX and JavaScript configuration
are trusted executable author input; see [support boundaries](https://monolinedocs.chitrankagnihotri.com/support/).

## Contributing

<a id="architecture"></a><a id="community--support"></a><a id="security--quality"></a><a id="development-commands"></a><a id="release-process"></a>

Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for setup and workspace-specific checks.
See [architecture](./docs/architecture.md) for package boundaries and
[UI releases](./docs/releases.md) or [Docs releases](./docs/docs-release.md) for
independent versioning and recovery. Report bugs through [issues](https://github.com/chitranklabs/monoline-ui/issues),
ask questions in [discussions](https://github.com/chitranklabs/monoline-ui/discussions),
and report vulnerabilities through [SECURITY.md](./SECURITY.md).

[Code of Conduct](./CODE_OF_CONDUCT.md) · [MIT License](./LICENSE) ·
[Quality checks](https://scorecard.dev/viewer/?uri=github.com/chitranklabs/monoline-ui) ·
[Support the project](https://ko-fi.com/D1D71U581P)

<p align="center">Developed by <a href="https://chitrankagnihotri.com">Chitrank Agnihotri</a></p>
