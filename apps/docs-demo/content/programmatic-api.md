---
title: Programmatic API
description: Load configuration and build documentation from a Node.js script.
---

## Build from a script

In a project that already depends on `@chitrank2050/monoline-docs`:

```javascript
import { loadConfig } from "@chitrank2050/monoline-docs"
import { buildDocs } from "@chitrank2050/monoline-docs/build"

const config = await loadConfig({ config: "./monoline-docs.yml" })
const result = await buildDocs(config)
console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
```

`defineConfig` validates an object but does not resolve directory paths. Calling
`buildDocs` with an object directly resolves paths from the working directory;
use `loadConfig` when you want config-relative paths.

> [!CAUTION]
> Keep output separate from content and assets. Builds reject overlapping paths
> and refuse nonempty output folders they do not manage.
