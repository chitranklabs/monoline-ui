import { execFileSync } from "node:child_process"
import { copyFile, mkdir, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const directory = fileURLToPath(new URL(".", import.meta.url))
// This directory contains only generated package artifacts, never site output.
await rm(new URL("./dist/", import.meta.url), { recursive: true, force: true })
execFileSync("tsc", ["-p", "tsconfig.build.json"], {
	cwd: directory,
	stdio: "inherit",
})
await mkdir(new URL("./dist/", import.meta.url), { recursive: true })
for (const name of [
	"docs.css",
	"theme.js",
	"client.js",
	"search.js",
	"dev-client.js",
	"cli.js",
]) {
	await copyFile(
		new URL(`./src/${name}`, import.meta.url),
		new URL(`./dist/${name}`, import.meta.url)
	)
}
