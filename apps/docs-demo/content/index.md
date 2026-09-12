---
title: Introduction
description: A small documentation site built from your Markdown files.
order: 0
---

## Write, build, publish

Monoline Docs turns a folder of Markdown into a static website. Navigation,
headings, and page links come from the same content, so updating a page does not
require editing the website layout.

Start with the [writing guide](writing.md), configure
[assets and appearance](appearance.md), or read about [deployment](deployment.md).

## What works today

- YAML frontmatter with a required title and optional description, order, and draft.
- Generated navigation or explicit groups with previous and next links.
- Tables, code fences, links, and a heading-based table of contents.
- Local images, downloads, fonts, and optional custom CSS.
- Persisted light, dark, and system themes.
- Highlighted code blocks with keyboard-accessible copy buttons.
- Local preview with watched rebuilds and browser reload.
- Static builds for a root domain or a repository subpath.

## Prototype limits

MDX execution, search, and release packaging are still pending. The build rejects
MDX with a clear error. This package remains private while those contracts are
being developed.
