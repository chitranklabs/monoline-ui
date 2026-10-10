# Monoline documentation

Use Monoline UI to build React interfaces, or Monoline Docs to build static
Markdown/MDX documentation. This index connects consumer documentation with
repository development and operations; each topic has one owning location.

## Start using a package

| Goal                             | Start here                                                                | Continue with                                                                                                                                                |
| :------------------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add UI components to a React app | [UI package guide](../packages/ui/README.md)                              | [Installation](https://monolineui.chitrankagnihotri.com/docs/installation) and [component catalog](https://monolineui.chitrankagnihotri.com/docs/components) |
| Create a documentation site      | [Docs package guide](../packages/docs/README.md#installation)             | [Getting started](../apps/docs-demo/content/getting-started.mdx) and [writing pages](../apps/docs-demo/content/writing.md)                                   |
| Explore the Docs package in use  | [Run the demo](../apps/docs-demo/README.md)                               | [Authoring components](../apps/docs-demo/content/components.mdx)                                                                                             |
| Generate Docs with an agent      | [Using with AI agents](../apps/docs-demo/content/using-with-ai-agents.md) | [Maintained Docs skill](../packages/docs/skills/monoline-docs/SKILL.md)                                                                                      |

The UI package is published. Docs is awaiting its first release; its package
guide explains local tarball installation. The repository demo is an ordinary
Docs consumer, not an additional package API.

## Consumer guides and reference

**UI:** [Foundations](https://monolineui.chitrankagnihotri.com/docs/foundations),
[theming](https://monolineui.chitrankagnihotri.com/docs/theming),
[composition patterns](https://monolineui.chitrankagnihotri.com/docs/patterns),
[accessibility](https://monolineui.chitrankagnihotri.com/docs/accessibility) and
[compatibility](https://monolineui.chitrankagnihotri.com/docs/compatibility).

**Docs:** [Configuration](../apps/docs-demo/content/configuration.md),
[frontmatter](../apps/docs-demo/content/frontmatter.md),
[CLI](../apps/docs-demo/content/cli.md),
[programmatic API](../apps/docs-demo/content/programmatic-api.md),
[OpenAPI generation](../apps/docs-demo/content/openapi.md),
[Markdown/AI exports](../apps/docs-demo/content/exports.md),
[troubleshooting](../apps/docs-demo/content/troubleshooting.md) and
[support boundaries](../apps/docs-demo/content/support.md).

## Contribute and understand the repository

- [Contributor guide](../CONTRIBUTING.md): prerequisites, local setup, focused
  verification, component changes and PR workflow for all four workspaces.
- [Architecture](architecture.md): package boundaries, shared colors, build
  pipelines and verification layers.
- [Root guidelines](../AGENTS.md) and [Docs guidelines](../packages/docs/AGENTS.md):
  engineering instructions for work in this repository.
- [Docs fixtures](../packages/docs/fixtures/README.md): stable test consumers,
  separate from the public demo.

## Deploy and maintain

- [UI releases](releases.md): package version intent, prepare/finalize workflows
  and publication recovery.
- [Docs releases and recovery](docs-release.md): npm publication, visual
  baselines, output promotion and remaining external acceptance checks.
- [Docs deployment](docs-deployment.md): root/subpath recipes for consumer sites
  and the repository demo.
- [Docs migration](docs-migration.md): preserve URLs and configure host redirects
  when moving an existing site.
- [Docs performance](docs-performance.md): benchmark commands, measured scope and
  regression budgets.
- [Docs roadmap](../packages/docs/ROADMAP.md): remaining package priorities and
  first-release gates.

## Where documentation lives

| Location                  | Owns                                                                                       |
| :------------------------ | :----------------------------------------------------------------------------------------- |
| Root `README.md`          | Product choice, brief examples and repository entry points                                 |
| Package READMEs           | Installation, public entry points and package requirements; these ship with their packages |
| `apps/website/app/docs/`  | UI consumer tutorials, component references and examples                                   |
| `apps/docs-demo/content/` | Docs consumer tutorials, configuration/reference pages and examples                        |
| `CONTRIBUTING.md`         | Repository setup, contribution workflow and verification commands                          |
| `docs/`                   | Documentation navigation, architecture and operational guides                              |
| `packages/docs/skills/`   | Authoritative Docs instructions for agents                                                 |

When public behavior changes, update its owning consumer guide and link to it
from other entry points. Keep requirements tied to package manifests and commands
tied to existing scripts. Test fixtures and generated visual baselines belong
with tests; temporary reports and completed-work plans do not belong here.
