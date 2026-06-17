import { readdirSync } from "node:fs"
import path from "node:path"
import { defineConfig } from "tsup"

const components = readdirSync("src/components", { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)

const foundations = readdirSync("src/foundations", { withFileTypes: true })
	.filter(
		(dirent) =>
			dirent.isFile() &&
			(dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")) &&
			!dirent.name.endsWith(".d.ts")
	)
	.map((dirent) => dirent.name.replace(/\.tsx?$/, ""))

const libs = readdirSync("src/lib", { withFileTypes: true })
	.filter(
		(dirent) =>
			dirent.isFile() &&
			(dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")) &&
			!dirent.name.endsWith(".d.ts")
	)
	.map((dirent) => dirent.name.replace(/\.tsx?$/, ""))

const entries: Record<string, string> = {
	index: "src/index.ts",
}

components.forEach((comp) => {
	entries[`components/${comp}/index`] = `src/components/${comp}/index.ts`
})

foundations.forEach((found) => {
	entries[`foundations/${found}`] = `src/foundations/${found}.ts`
})

libs.forEach((lib) => {
	entries[`lib/${lib}`] = `src/lib/${lib}.ts`
})

export default defineConfig({
	entry: entries,
	format: ["esm"],
	dts: true,
	minify: true,
	sourcemap: true,
	clean: true,
	splitting: true,
	treeshake: true,
	external: [
		"react",
		"react-dom",
		"@radix-ui/react-slot",
		"clsx",
		"tailwind-merge",
	],
	tsconfig: "tsconfig.build.json",
	outDir: "dist",
})
