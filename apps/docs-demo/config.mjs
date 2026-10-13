import { loadConfig } from "@chitrank2050/monoline-docs"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

if (
	process.env.DOCS_INDEXING !== undefined &&
	!["true", "false"].includes(process.env.DOCS_INDEXING)
)
	throw new Error("DOCS_INDEXING must be true or false")

const config = await loadConfig({
	cwd: fileURLToPath(new URL(".", import.meta.url)),
	overrides: {
		...(process.env.DOCS_BASE !== undefined && { base: process.env.DOCS_BASE }),
		...(process.env.DOCS_SITE !== undefined && { site: process.env.DOCS_SITE }),
		...(process.env.DOCS_INDEXING !== undefined && {
			indexing: process.env.DOCS_INDEXING === "true",
		}),
	},
})

// Keep the demo’s owner identity local; consumer sites supply their own entities.
const identity = JSON.parse(
	await readFile(
		new URL("../website/public/identity.json", import.meta.url),
		"utf8"
	)
)
const owner = {
	type: "Person",
	name: identity.name,
	url: identity.websiteUrl,
	sameAs: [identity.socials.github, identity.socials.linkedin],
}
config.seo = {
	...config.seo,
	author: owner,
	publisher: owner,
	socialImageAlt: "Monoline Docs — Markdown and MDX documentation",
}
export default config
