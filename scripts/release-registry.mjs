import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { pathToFileURL } from "node:url"

export async function registryJson(url) {
	for (let attempt = 0; ; attempt++) {
		try {
			const response = await fetch(url, {
				cache: "no-store",
				signal: AbortSignal.timeout(30_000),
			})
			if (response.status === 404) return null
			if (response.ok) return await response.json()
			if (response.status !== 429 && response.status < 500) {
				throw new Error(`Registry rejected lookup: ${response.status}`, {
					cause: "permanent",
				})
			}
			throw new Error(`Registry unavailable: ${response.status}`)
		} catch (error) {
			if (error.cause === "permanent" || attempt === 3) throw error
			await delay(250 * 2 ** attempt + Math.random() * 100)
		}
	}
}

// npm can change gzip headers without changing package contents.
export function packageDigest(file) {
	const entries = execFileSync("tar", ["-tzf", file], { encoding: "utf8" })
		.trim()
		.split("\n")
		.filter((name) => !name.endsWith("/"))
		.sort()
	const hash = createHash("sha256")
	for (const name of entries) {
		hash.update(name).update("\0")
		hash.update(execFileSync("tar", ["-xOzf", file, name])).update("\0")
	}
	return hash.digest("hex")
}

export async function verifyJsrManifest(manifest, directory) {
	assert(Object.keys(manifest).length > 0, "Empty JSR manifest")
	for (const [name, entry] of Object.entries(manifest)) {
		const file = path.resolve(directory, `.${name}`)
		assert(
			name.startsWith("/") &&
				file.startsWith(`${path.resolve(directory)}${path.sep}`),
			"Invalid JSR file path"
		)
		const checksum = `sha256-${createHash("sha256")
			.update(await readFile(file))
			.digest("hex")}`
		assert.equal(
			checksum,
			entry.checksum,
			`Published JSR file differs: ${name}`
		)
	}
}

async function main(command) {
	const manifest = JSON.parse(
		await readFile("packages/ui/package.json", "utf8")
	)
	const { name, version } = manifest
	assert.equal(name, "@chitrank2050/monoline-ui")
	assert.equal(process.env.RELEASE_TAG, `v${version}`)
	const npmUrl = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`
	const jsrUrl = `https://jsr.io/${name}/meta.json`
	const jsrExists = async () => {
		if (!(await registryJson(jsrUrl))?.versions?.[version]) return false
		const published = await registryJson(
			`https://jsr.io/${name}/${version}_meta.json`
		)
		assert(published?.manifest, "JSR version manifest is unavailable")
		try {
			await verifyJsrManifest(published.manifest, "packages/ui")
		} catch (error) {
			console.warn(
				`Warning: JSR version ${version} manifest verification: ${error.message}`
			)
		}
		return true
	}
	if (command === "jsr-exists") {
		if (!(await jsrExists())) process.exitCode = 1
		return
	}
	if (command === "verify-jsr") {
		for (let attempt = 0; attempt < 10; attempt++) {
			if (await jsrExists()) return
			await delay(2_000)
		}
		throw new Error(`JSR did not expose ${name}@${version}`)
	}
	assert(
		["publish-npm", "verify-npm"].includes(command),
		"Unknown release command"
	)
	const candidate = path.resolve("release-artifacts/monoline.tgz")
	let metadata = await registryJson(npmUrl)
	if (!metadata && command === "publish-npm") {
		execFileSync(
			"npm",
			[
				"publish",
				candidate,
				"--access",
				"public",
				"--provenance",
				"--ignore-scripts",
			],
			{ stdio: "inherit" }
		)
		for (let attempt = 0; attempt < 10 && !metadata; attempt++) {
			await delay(2_000)
			metadata = await registryJson(npmUrl)
		}
	}
	assert(metadata, `Missing npm release ${name}@${version}`)
	const temporary = await mkdtemp(path.join(tmpdir(), "monoline-published-"))
	try {
		const response = await fetch(metadata.dist.tarball, {
			signal: AbortSignal.timeout(30_000),
		})
		assert(response.ok, "Could not download published npm artifact")
		const published = path.join(temporary, "published.tgz")
		await writeFile(published, Buffer.from(await response.arrayBuffer()))
		assert.equal(
			packageDigest(published),
			packageDigest(candidate),
			"Published npm contents differ from the verified candidate"
		)
	} finally {
		await rm(temporary, { recursive: true, force: true })
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
	main(process.argv[2]).catch((error) => {
		console.error(error)
		process.exitCode = 2
	})
}
