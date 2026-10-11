---
title: "Monoline documentation"
description: "Find Monoline UI and Docs package guides, contributor documentation, architecture and release operations."
---

# Monoline documentation

Use Monoline UI to build React interfaces, or Monoline Docs to build static
Markdown/MDX documentation. This index connects consumer documentation with
repository development and operations; each topic has one owning location.

## Start using a package

| Goal                             | Start here                                                                                                       | Continue with                                                                                                                                                |
| :------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add UI components to a React app | [UI package guide](https://github.com/chitranklabs/monoline-ui/blob/main/packages/ui/README.md)                  | [Installation](https://monolineui.chitrankagnihotri.com/docs/installation) and [component catalog](https://monolineui.chitrankagnihotri.com/docs/components) |
| Create a documentation site      | [Docs package guide](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/README.md#installation) | [Getting started](https://monolinedocs.chitrankagnihotri.com/getting-started/) and [writing pages](https://monolinedocs.chitrankagnihotri.com/writing/)      |
| Explore the Docs package in use  | [Run the demo](https://github.com/chitranklabs/monoline-ui/blob/main/apps/docs-demo/README.md)                   | [Authoring components](https://monolinedocs.chitrankagnihotri.com/components/)                                                                               |
| Generate Docs with an agent      | [Using with AI agents](https://monolinedocs.chitrankagnihotri.com/using-with-ai-agents/)                         | [Maintained Docs skill](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/skills/monoline-docs/SKILL.md)                                   |

Both packages are available on npm. The repository demo is an ordinary Docs
consumer, not an additional package API.

## Consumer guides and reference

**UI:** [Foundations](https://monolineui.chitrankagnihotri.com/docs/foundations),
[theming](https://monolineui.chitrankagnihotri.com/docs/theming),
[composition patterns](https://monolineui.chitrankagnihotri.com/docs/patterns),
[accessibility](https://monolineui.chitrankagnihotri.com/docs/accessibility) and
[compatibility](https://monolineui.chitrankagnihotri.com/docs/compatibility).

**Docs:** [Configuration](https://monolinedocs.chitrankagnihotri.com/configuration/),
[frontmatter](https://monolinedocs.chitrankagnihotri.com/frontmatter/),
[CLI](https://monolinedocs.chitrankagnihotri.com/cli/),
[programmatic API](https://monolinedocs.chitrankagnihotri.com/programmatic-api/),
[OpenAPI generation](https://monolinedocs.chitrankagnihotri.com/openapi/),
[Markdown/AI exports](https://monolinedocs.chitrankagnihotri.com/exports/),
[troubleshooting](https://monolinedocs.chitrankagnihotri.com/troubleshooting/) and
[support boundaries](https://monolinedocs.chitrankagnihotri.com/support/).

## Contribute and understand the repository

- [Contributor guide](https://github.com/chitranklabs/monoline-ui/blob/main/CONTRIBUTING.md): prerequisites, local setup, focused
  verification, component changes and PR workflow for all four workspaces.
- [Architecture](architecture.md): package boundaries, shared colors, build
  pipelines and verification layers.
- [Root guidelines](https://github.com/chitranklabs/monoline-ui/blob/main/AGENTS.md) and [Docs guidelines](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/AGENTS.md):
  engineering instructions for work in this repository.
- [Docs fixtures](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/fixtures/README.md): stable test consumers,
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
- [Docs roadmap](https://github.com/chitranklabs/monoline-ui/blob/main/packages/docs/ROADMAP.md): remaining package priorities and
  release acceptance gates.

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
