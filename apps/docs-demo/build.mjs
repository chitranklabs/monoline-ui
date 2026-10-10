import { buildDocs } from "@chitrank2050/monoline-docs/build"

import config from "./config.mjs"

const result = await buildDocs(config)
console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
