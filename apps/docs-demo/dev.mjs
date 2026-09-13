import { startDevServer } from "@monoline/docs/dev"

import config from "./config.mjs"

const preview = await startDevServer(config)
console.log(`Monoline Docs preview: ${preview.url}`)
for (const signal of ["SIGINT", "SIGTERM"])
	process.once(signal, () => {
		void preview.close()
	})
