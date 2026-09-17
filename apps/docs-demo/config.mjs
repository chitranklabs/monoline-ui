import { loadConfig } from "@chitrank2050/monoline-docs"
import { fileURLToPath } from "node:url"

if (
	process.env.DOCS_INDEXING !== undefined &&
	!["true", "false"].includes(process.env.DOCS_INDEXING)
)
	throw new Error("DOCS_INDEXING must be true or false")

export default await loadConfig({
	cwd: fileURLToPath(new URL(".", import.meta.url)),
	overrides: {
		...(process.env.DOCS_BASE !== undefined && { base: process.env.DOCS_BASE }),
		...(process.env.DOCS_SITE !== undefined && { site: process.env.DOCS_SITE }),
		...(process.env.DOCS_INDEXING !== undefined && {
			indexing: process.env.DOCS_INDEXING === "true",
		}),
	},
})
