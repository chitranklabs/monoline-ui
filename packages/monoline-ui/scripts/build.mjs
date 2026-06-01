import { spawn } from "node:child_process"
import { cp, mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(scriptDir, "..")
const distDir = path.join(packageRoot, "dist")

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: packageRoot,
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
await run("pnpm", ["exec", "tsc", "-p", "tsconfig.build.json"])
await mkdir(path.join(distDir, "styles"), { recursive: true })
await cp(
	path.join(packageRoot, "src/foundations/theme.css"),
	path.join(distDir, "styles/theme.css"),
)
