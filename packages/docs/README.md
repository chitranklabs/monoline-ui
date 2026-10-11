# Monoline Docs

Build static documentation from Markdown and MDX for libraries, SDKs and API
products. Includes navigation, local search, light/dark themes, highlighted code,
authoring components, OpenAPI reference generation and Markdown/AI exports.

## Installation

Use Node.js 24.14 or newer. In a new or existing project directory:

```sh
npm install @chitrank2050/monoline-docs
npx monoline-docs init
npm run dev
```

For pnpm, use `pnpm add @chitrank2050/monoline-docs`,
`pnpm exec monoline-docs init` and `pnpm dev`.

Open the address printed in your terminal and edit `content/index.md`.
Initialization creates the homepage, `monoline-docs.yml` and build/dev scripts.
It preserves existing package metadata and refuses conflicting files or scripts.

## Write and publish

Create another page in `content/`:

```markdown
---
title: Installation
description: Set up your project.
---

## Install

Describe your project's installation steps here.
```

Set your publishing origin in `monoline-docs.yml`:

```yaml
title: Team handbook
site: https://docs.example.com
```

Run `npm run build` to generate static output in `dist`. Deploy that directory
to your static host. See [deployment recipes](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-deployment.md)
for root/subpath layouts and [migration guidance](https://github.com/chitranklabs/monoline-ui/blob/main/docs/docs-migration.md)
when replacing an existing site.

## Guides and reference

- [Getting started](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/getting-started.mdx)
  and [writing pages](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/writing.md).
- [Configuration](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/configuration.md)
  and [appearance](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/appearance.md).
- [Authoring components](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/components.mdx)
  for steps, callouts, tables, code examples and guide cards.
- [OpenAPI documentation](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/openapi.md)
  and [Markdown/AI exports](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/exports.md).
- [Troubleshooting](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/troubleshooting.md)
  and [support boundaries](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/support.md).

## Using with AI agents

The package ships `skills/monoline-docs/SKILL.md`. Ask your agent to read that
installed file, or copy its folder into the agent's supported skills directory.
Installation does not automatically enable the skill; keep copied instructions
aligned with the installed package version.

Use generated page Markdown exports, `llms.txt` or `llms-full.txt` as reference.
See [the agent guide](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/using-with-ai-agents.md)
and [maintained skill](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/skills/monoline-docs/SKILL.md).

## Requirements

- Node.js 24.14 or newer; npm is supported, JSR is not.
- React 19 and React DOM 19 only for hydrated React islands.
- A published `content/index.md` or `content/index.mdx` homepage.

The initializer adds a hint for the installed YAML configuration schema.
Basic reading and navigation work without JavaScript; search, copying and
interactive examples use browser scripts.

## Package entry points

- `@chitrank2050/monoline-docs`: configuration and content utilities.
- `@chitrank2050/monoline-docs/build`: programmatic production builds.
- `@chitrank2050/monoline-docs/dev`: local preview server.
- `@chitrank2050/monoline-docs/components/*.astro`: authoring components.
- `@chitrank2050/monoline-docs/schema.json`: configuration editor schema.

See the [programmatic API](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/content/programmatic-api.md)
for usage and [contributor guide](https://github.com/chitranklabs/monoline-ui/blob/main/CONTRIBUTING.md)
for repository development.

Licensed under MIT.
