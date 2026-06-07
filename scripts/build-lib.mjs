import { spawn } from "node:child_process"
import { cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const distDir = path.join(projectRoot, "dist")

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

await rm(distDir, { recursive: true, force: true })
// Run typescript build
await run("pnpm", ["exec", "tsc", "-p", "tsconfig.build.json"])

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
