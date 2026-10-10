---
title: Markdown and AI exports
description: Make published documentation available as Markdown and AI reading indexes.
---

## Markdown and AI exports

Published, indexable pages have a Copy Page action beside the title. It copies
the page's Markdown export. Markdown exports retain
authored text and common page links; MDX exports preserve static rendered headings,
code fences, links, lists and tables. Preview source is included once, without
interface controls or interactive islands. Export fidelity for
uncommon Markdown link syntax and source-relative images is limited.

`llms.txt` lists eligible pages and `llms-full.txt` combines their exports.
Production drafts, `noindex` pages and their content are absent. Disabling site
indexing removes AI indexes; `search: false` affects search only.

## Try it on this site

Read [Using with AI agents](/using-with-ai-agents) for the maintained authoring
skill and an example workflow using these exports.

Use **Copy Page** beside a page title to copy its Markdown. Inspect `llms.txt` or `llms-full.txt` for this demo.

These exports are reading formats, not an exact round-trip replacement for authored MDX. Published content remains public even when discovery is disabled.
