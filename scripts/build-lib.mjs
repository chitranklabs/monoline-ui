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

const clientEntryFiles = ["foundations/use-breakpoint.js"]
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

// Copy template package.json and README.md
await cp(
	path.join(projectRoot, "package.json.lib"),
	path.join(distDir, "package.json")
)
await cp(path.join(projectRoot, "README.md"), path.join(distDir, "README.md"))

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
