---
title: Programmatic API
description: Load configuration, build documentation and start a local preview from Node.js.
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

## Start a local preview

```javascript
import { loadConfig } from "@chitrank2050/monoline-docs"
import { startDevServer } from "@chitrank2050/monoline-docs/dev"

const config = await loadConfig({ config: "./monoline-docs.yml" })
const preview = await startDevServer(config, 4321)
console.log(preview.url)

// Close the server and watchers when your embedding application stops.
process.once("SIGINT", async () => {
	await preview.close()
})
```

The preview binds to loopback only and builds in development mode. It watches
content, assets and imported dependencies; rebuild errors leave the last
successful output available. Restart after changing configuration. The returned
handle provides `url`, `rebuild()` and asynchronous `close()` methods. Pass port
`0` to let the operating system choose an available port. This is a local preview,
not a production server.
