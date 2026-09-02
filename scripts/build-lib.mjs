import * as esbuild from "esbuild"
import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { findClientComponentEntries } from "./lib/client-boundaries.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const distDir = path.join(projectRoot, "dist")
const bundleBudgetBytes = 4 * 1024

function run(command, args = []) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: projectRoot,
			stdio: "inherit",
			shell: process.platform === "win32",
		})

		child.on("error", reject)
		child.on("exit", (code) => {
			if (code === 0) {
				resolve()
				return
			}

			reject(new Error(`${command} ${args.join(" ")} exited with ${code}`))
		})
	})
}

const tsupBin = path.join(projectRoot, "node_modules", ".bin", "tsup")

// Run tsup build
await run(tsupBin)

const clientComponentEntries = await findClientComponentEntries(projectRoot)

// The root barrel mixes server-safe and interactive exports, so it is a client
// boundary by design. Consumers that need RSC optimization use component
// subpaths; their server-safe entries remain directive-free.
const clientEntryFiles = [
	"index.js",
	"foundations/use-breakpoint.js",
	...clientComponentEntries.map(
		(component) => `components/${component}/index.js`
	),
]
for (const relativePath of clientEntryFiles) {
	const filePath = path.join(distDir, relativePath)
	const output = await readFile(filePath, "utf8")
	if (!output.startsWith('"use client";')) {
		await writeFile(filePath, `"use client";\n${output}`, "utf8")
	}
}

// Copy foundation styles
await mkdir(path.join(distDir, "styles"), { recursive: true })
await cp(
	path.join(projectRoot, "src/foundations/theme.css"),
	path.join(distDir, "styles/theme.css")
)
await cp(
	path.join(projectRoot, "src/foundations/theme"),
	path.join(distDir, "styles/theme"),
	{ recursive: true }
)

// Inject @source so consumers' Tailwind scans our chunk files for class names.
// Without this, utility classes used in JSX (h-ml-8, inline-flex, etc.) are
// missing from the generated CSS because node_modules is excluded by default.
const distThemePath = path.join(distDir, "styles/theme.css")
const themeContent = await readFile(distThemePath, "utf8")
await writeFile(distThemePath, themeContent + '\n@source "..";\n', "utf8")

// Copy per-component CSS files
const componentsDir = path.join(projectRoot, "src/components")
const componentEntries = await readdir(componentsDir, { withFileTypes: true })
for (const entry of componentEntries) {
	if (!entry.isDirectory()) continue
	const componentDir = path.join(componentsDir, entry.name)
	const cssFiles = (await readdir(componentDir)).filter((f) =>
		f.endsWith(".css")
	)
	for (const cssFile of cssFiles) {
		const destDir = path.join(distDir, "components", entry.name)
		await mkdir(destDir, { recursive: true })
		await cp(path.join(componentDir, cssFile), path.join(destDir, cssFile))
	}
}

// Copy package discovery, licensing, and contributor files so npm/JSR links do
// not become dead ends after the repository is packaged.
await cp(
	path.join(projectRoot, "package.json.lib"),
	path.join(distDir, "package.json")
)
await cp(path.join(projectRoot, "README.md"), path.join(distDir, "README.md"))
await cp(path.join(projectRoot, "assets"), path.join(distDir, "assets"), {
	recursive: true,
})
for (const file of [
	"LICENSE",
	"CHANGELOG.md",
	"CONTRIBUTING.md",
	"CODE_OF_CONDUCT.md",
	"SECURITY.md",
]) {
	await cp(path.join(projectRoot, file), path.join(distDir, file))
}

// Calculate dynamic bundle size (Gzipped) for a representative set of components
async function calculateBundleSize() {
	const componentsToBundle = ["Button", "Card", "Container", "SectionHead"]
	const mockEntryContent = componentsToBundle
		.map((c) => `import { ${c} } from './dist/index.js'; console.log(${c});`)
		.join("\n")

	const result = await esbuild.build({
		stdin: {
			contents: mockEntryContent,
			loader: "js",
			resolveDir: projectRoot,
			sourcefile: "bundle-size-entry.js",
		},
		bundle: true,
		minify: true,
		write: false,
		format: "esm",
		external: [
			"react",
			"react-dom",
			"@radix-ui/react-slot",
			"clsx",
			"tailwind-merge",
		],
	})

	const outputBuffer = result.outputFiles[0].contents
	const gzipped = gzipSync(outputBuffer)
	assert.ok(
		gzipped.length <= bundleBudgetBytes,
		`Representative bundle is ${gzipped.length} bytes gzipped; budget is ${bundleBudgetBytes} bytes`
	)
	const sizeKb = (gzipped.length / 1024).toFixed(1)
	const sizeStr = `${sizeKb}kb`

	const metadata = JSON.parse(
		await readFile(path.join(projectRoot, "src", "metadata.json"), "utf8")
	)
	metadata.size = sizeStr
	await writeFile(
		path.join(distDir, "metadata.json"),
		JSON.stringify(metadata, null, "\t") + "\n",
		"utf8"
	)
	console.log(`✓ Calculated mock production gzipped bundle size: ${sizeStr}`)
}

await calculateBundleSize()
