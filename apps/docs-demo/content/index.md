---
title: Introduction
description: A small documentation site built from your Markdown files.
order: 0
---

## Write, build, publish

Monoline Docs turns a folder of Markdown into a static website. Navigation,
headings, and page links come from the same content, so updating a page does not
require editing the website layout.

This demo runs the first working prototype. Start with the
[writing guide](writing.md) or read about [deployment](deployment.md).

## What works today

- YAML frontmatter with a required title and optional description, order, and draft.
- Generated navigation or explicit groups with previous and next links.
- Tables, code fences, links, and a heading-based table of contents.
- A responsive layout that follows the system light or dark theme.
- Static builds for a root domain or a repository subpath.

## Prototype limits

MDX execution, local image handling, search, syntax highlighting, and live reload
are still pending. The build rejects MDX and local image references with a clear
error. This package is private while those contracts are being developed.
