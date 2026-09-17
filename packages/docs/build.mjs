import { execFileSync } from "node:child_process"
import { copyFile, mkdir, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const directory = fileURLToPath(new URL(".", import.meta.url))
execFileSync(process.execPath, ["sync-tokens.mjs", "--check"], {
	cwd: directory,
	stdio: "inherit",
})
// This directory contains only generated package artifacts, never site output.
await rm(new URL("./dist/", import.meta.url), { recursive: true, force: true })
execFileSync("tsc", ["-p", "tsconfig.build.json"], {
	cwd: directory,
	stdio: "inherit",
})
await mkdir(new URL("./dist/", import.meta.url), { recursive: true })
await mkdir(new URL("./dist/components/", import.meta.url), { recursive: true })
for (const name of [
	"docs.css",
	"theme-tokens.css",
	"theme.js",
	"client.js",
	"search.js",
	"dev-client.js",
	"cli.js",
	"astro-page.astro",
	"astro-navigation.astro",
]) {
	await copyFile(
		new URL(`./src/${name}`, import.meta.url),
		new URL(`./dist/${name}`, import.meta.url)
	)
}
for (const name of [
	"ApiTable",
	"CodeBlock",
	"LinkCard",
	"Step",
	"Steps",
	"Tabs",
])
	await copyFile(
		new URL(`./src/components/${name}.astro`, import.meta.url),
		new URL(`./dist/components/${name}.astro`, import.meta.url)
	)
