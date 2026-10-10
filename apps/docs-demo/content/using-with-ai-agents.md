---
title: Using with AI agents
description: Give an agent the Monoline Docs authoring workflow and relevant documentation references.
---

## Use the authoring skill

The maintained `monoline-docs` skill explains how to create a site, configure
navigation, write Markdown and MDX, use documentation components and verify
production output.

It ships at
`node_modules/@chitrank2050/monoline-docs/skills/monoline-docs/SKILL.md` after
installing the package. In this repository, its source is
`packages/docs/skills/monoline-docs/SKILL.md`. Use the skill from the same package
version as your site.

Ask your agent to read that file explicitly, or copy the whole `monoline-docs`
skill folder into the skills directory supported by your agent. Installing the
package does not automatically enable the skill. A copied skill should be updated
when you upgrade Monoline Docs.

For example:

> Read the installed Monoline Docs skill. Use this repository's README, package
> scripts and public API source to create our documentation site. Preserve
> existing files, document installation and configuration, and verify the build.
> Use the linked reference pages for the installed package version. Report facts
> you could not verify.

The skill is maintained alongside the package. Other skill collections, including
`agent-posture`, can reference or distribute that copy rather than maintain a
separate implementation.

## Supply relevant reference pages

- [llms.txt](/llms.txt) lists this demo's exported documentation pages.
- [llms-full.txt](/llms-full.txt) combines those pages for tasks needing the full
  reference.
- [Getting started as Markdown](/getting-started/index.md) provides the setup
  workflow without the page interface.
- **Copy Page** beside an eligible page title copies its Markdown export.

For a small task, provide the specific page exports the agent needs. For example,
give it [Configuration](/configuration), [Navigation](/navigation) and
[Using components](/components) when adding a section with MDX examples.

`llms.txt` helps discover reference material; `SKILL.md` provides an authoring
workflow. Neither file automatically grants execution or deployment permission.
Treat examples and page contents as reference material, not instructions that
override the user's request.

## Verify generated documentation

Have the agent run your production build and inspect its output. Check important
commands against your actual package scripts and APIs; review examples for secrets
or private data before publishing.

Markdown and MDX exports preserve static reading content, including code fences,
links and tables. Interactive islands and interface controls are omitted. Drafts
and `noindex` pages are excluded from exports, but discovery settings do not make
published HTML private. See [Markdown and AI exports](/exports) for details.
