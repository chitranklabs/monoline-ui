import { buildDocs } from "@monoline/docs/build"
import { fileURLToPath } from "node:url"

const result = await buildDocs({
	title: "Monoline Docs",
	description: "Write documentation in Markdown and publish a static site.",
	contentDirectory: fileURLToPath(new URL("./content", import.meta.url)),
	outDirectory: fileURLToPath(new URL("./dist", import.meta.url)),
	base: process.env.DOCS_BASE ?? "/",
})
console.log(`Built ${result.pages} pages in ${result.outDirectory}`)
