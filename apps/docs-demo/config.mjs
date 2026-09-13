import { defineConfig } from "@monoline/docs"
import { fileURLToPath } from "node:url"

export default defineConfig({
	title: "Monoline Docs",
	description: "Write documentation in Markdown and publish a static site.",
	contentDirectory: fileURLToPath(new URL("./content", import.meta.url)),
	assetsDirectory: fileURLToPath(new URL("./assets", import.meta.url)),
	outDirectory: fileURLToPath(new URL("./dist", import.meta.url)),
	base: process.env.DOCS_BASE ?? "/",
	defaultMode: "system",
	lang: "en",
	stylesheet: "/assets/custom.css",
	headerLinks: [
		{ label: "GitHub", href: "https://github.com/chitranklabs/monoline-ui" },
	],
})
