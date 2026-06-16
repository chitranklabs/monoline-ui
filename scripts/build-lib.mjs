import { spawn } from "node:child_process"
import {
	cp,
	mkdir,
	readFile,
	readdir,
	rm,
	stat,
	writeFile,
} from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const distDir = path.join(projectRoot, "dist")
const tscBin = path.join(projectRoot, "node_modules", ".bin", "tsc")

function run(command, args) {
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

async function fileExists(filePath) {
	try {
		const stats = await stat(filePath)
		return stats.isFile()
	} catch {
		return false
	}
}

async function rewriteEsmSpecifiers(filePath) {
	const source = await readFile(filePath, "utf8")
	const fileDir = path.dirname(filePath)
	const specifierPattern = /(from\s+["'])(\.{1,2}\/[^"']+)(["'])/g
	let output = ""
	let lastIndex = 0

	for (const match of source.matchAll(specifierPattern)) {
		const [fullMatch, prefix, specifier, suffix] = match

		if (!prefix || !specifier || !suffix || match.index === undefined) {
			continue
		}

		output += source.slice(lastIndex, match.index)
		lastIndex = match.index + fullMatch.length

		const extension = path.extname(specifier)
		if (extension) {
			output += fullMatch
			continue
		}

		const resolvedPath = path.resolve(fileDir, specifier)
		if (await fileExists(`${resolvedPath}.js`)) {
			output += `${prefix}${specifier}.js${suffix}`
			continue
		}

		if (await fileExists(path.join(resolvedPath, "index.js"))) {
			output += `${prefix}${specifier}/index.js${suffix}`
			continue
		}

		output += fullMatch
	}

	output += source.slice(lastIndex)

	if (output !== source) {
		await writeFile(filePath, output)
	}
}

async function rewriteDistEsmSpecifiers(directory) {
	const entries = await readdir(directory, { withFileTypes: true })

	await Promise.all(
		entries.map(async (entry) => {
			const entryPath = path.join(directory, entry.name)

			if (entry.isDirectory()) {
				await rewriteDistEsmSpecifiers(entryPath)
				return
			}

			if (entry.isFile() && entry.name.endsWith(".js")) {
				await rewriteEsmSpecifiers(entryPath)
			}
		})
	)
}

await rm(distDir, { recursive: true, force: true })
// Run typescript build
await run(tscBin, ["-p", "tsconfig.build.json"])
await rewriteDistEsmSpecifiers(distDir)

// Copy styles
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

// Copy template package.json and README.md
await cp(
	path.join(projectRoot, "package.json.lib"),
	path.join(distDir, "package.json")
)
await cp(path.join(projectRoot, "README.md"), path.join(distDir, "README.md"))
