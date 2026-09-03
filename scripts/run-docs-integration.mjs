import { spawn } from "node:child_process"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"

import { projectPaths } from "./lib/project-paths.mjs"

const projectRoot = path.resolve(import.meta.dirname, "..")
const host = "127.0.0.1"
const port = Number.parseInt(process.env.DOCS_TEST_PORT ?? "3200", 10)

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
	throw new Error("DOCS_TEST_PORT must be a valid TCP port")
}

const baseUrl = `http://${host}:${port}`
const nextBin = path.join(
	projectPaths.websiteRoot,
	"node_modules",
	"next",
	"dist",
	"bin",
	"next"
)
const playwrightBin = path.join(
	projectRoot,
	"node_modules",
	"@playwright",
	"test",
	"cli.js"
)

function run(command, args, env = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			cwd: projectRoot,
			env: { ...process.env, ...env },
			stdio: "inherit",
		})
		child.once("error", reject)
		child.once("exit", (code, signal) => {
			if (code === 0) resolve()
			else reject(new Error(`${command} exited with ${code ?? signal}`))
		})
	})
}

async function waitForServer(server) {
	const deadline = Date.now() + 60_000
	let lastError

	while (Date.now() < deadline) {
		if (server.exitCode !== null) {
			throw new Error(`Next.js exited before readiness (${server.exitCode})`)
		}
		try {
			const response = await fetch(`${baseUrl}/robots.txt`)
			if (response.ok) return
			lastError = new Error(`Readiness returned ${response.status}`)
		} catch (error) {
			lastError = error
		}
		await delay(200)
	}

	throw new Error(`Next.js was not ready after 60 seconds: ${lastError}`)
}

async function stopServer(server) {
	if (server.exitCode !== null) return
	const exited = new Promise((resolve) => server.once("exit", resolve))
	server.kill("SIGTERM")
	const forceKill = setTimeout(() => server.kill("SIGKILL"), 5_000)
	await exited
	clearTimeout(forceKill)
}

const server = spawn(
	process.execPath,
	[nextBin, "start", "--hostname", host, "--port", String(port)],
	{
		cwd: projectPaths.websiteRoot,
		env: { ...process.env, NODE_ENV: "production" },
		stdio: "inherit",
	}
)

try {
	await waitForServer(server)
	await run(process.execPath, ["scripts/seo-integration-test.mjs"], {
		TEST_BASE_URL: baseUrl,
	})
	await run(process.execPath, [playwrightBin, "test"], {
		PLAYWRIGHT_TEST_BASE_URL: baseUrl,
		PLAYWRIGHT_EXTERNAL_SERVER: "1",
	})
} finally {
	await stopServer(server)
}
