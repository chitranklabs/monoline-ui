import { transform } from "esbuild"
import { execFileSync } from "node:child_process"
import {
	chmod,
	copyFile,
	mkdir,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises"
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
for (const name of ["theme.js", "client.js", "search.js"]) {
	const source = await readFile(
		new URL(`./src/${name}`, import.meta.url),
		"utf8"
	)
	const { code } = await transform(source, {
		loader: "js",
		minify: true,
		target: "es2022",
	})
	await writeFile(new URL(`./dist/${name}`, import.meta.url), code)
}
await chmod(new URL("./dist/cli.js", import.meta.url), 0o755)
for (const name of [
	"Table",
	"Card",
	"CardGrid",
	"Accordion",
	"Badge",
	"Button",
	"Callout",
	"FileTree",
	"Figure",
	"Preview",
	"CodeBlock",
	"CodeGroup",
	"PackageInstall",
	"PackageReference",
	"LinkCard",
	"Step",
	"Steps",
	"Tabs",
])
	await copyFile(
		new URL(`./src/components/${name}.astro`, import.meta.url),
		new URL(`./dist/components/${name}.astro`, import.meta.url)
	)
