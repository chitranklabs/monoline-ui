import * as esbuild from "esbuild"
import { spawn } from "node:child_process"
import {
	cp,
	mkdir,
	readFile,
	readdir,
	unlink,
	writeFile,
} from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { findClientComponentEntries } from "./lib/client-boundaries.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const distDir = path.join(projectRoot, "dist")

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

	const tempEntryFile = path.join(projectRoot, "temp-entry-bundle.js")
	await writeFile(tempEntryFile, mockEntryContent, "utf8")

	try {
		const result = esbuild.buildSync({
			entryPoints: [tempEntryFile],
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
		const sizeKb = (gzipped.length / 1024).toFixed(1)
		const sizeStr = `${sizeKb}kb`

		// Read, update, and write metadata.json
		const updateMetadata = async (metaPath) => {
			let current = {}
			try {
				const raw = await readFile(metaPath, "utf8")
				current = JSON.parse(raw)
			} catch {
				// Ignore if file doesn't exist yet
			}
			current.size = sizeStr
			await writeFile(
				metaPath,
				JSON.stringify(current, null, "\t") + "\n",
				"utf8"
			)
		}

		await updateMetadata(path.join(projectRoot, "src", "metadata.json"))
		await updateMetadata(path.join(distDir, "metadata.json"))
		console.log(`✓ Calculated mock production gzipped bundle size: ${sizeStr}`)
	} catch (err) {
		console.error("Error calculating bundle size:", err)
	} finally {
		try {
			await unlink(tempEntryFile)
		} catch {
			// Ignore if file doesn't exist or was already unlinked
		}
	}
}

await calculateBundleSize()
