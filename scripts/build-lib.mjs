import { spawn } from "node:child_process"
import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

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
