---
title: CLI
description: Initialize, preview and build documentation from the command line.
---

## Initialize

After installing Monoline Docs in a project:

```sh
npx monoline-docs init
```

Initialization creates `monoline-docs.yml`, `content/index.md` and build/dev scripts. It preserves existing package metadata and rejects conflicting files or scripts. It does not install packages.

## Preview and build

```sh
npx monoline-docs dev
npx monoline-docs build
```

`dev` watches content, assets and imported local content dependencies. Restart after configuration changes. `build` produces production output and excludes drafts.

## Options

| Option                   | Commands   | Purpose                         |
| ------------------------ | ---------- | ------------------------------- |
| `--config <path>`        | build, dev | Select a configuration file.    |
| `--site <url>`           | build, dev | Override the configured origin. |
| `--base <path>`          | build, dev | Override the deployment base.   |
| `--indexing true\|false` | build, dev | Override indexing.              |
| `--port <number>`        | dev        | Preview port; default 4321.     |

`init` accepts no build or preview flags. Ports must be integers from 1 to 65535. See [Configuration](/configuration) for file discovery and [Deployment](/deployment) for production hosting.
