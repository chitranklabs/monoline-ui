import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { appendFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
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

export async function waitForNpmMetadata(
	url,
	{
		lookup = registryJson,
		pause = delay,
		attempts = 61,
		interval = 20_000,
	} = {}
) {
	// npm scans accepted uploads before exposing installable versions.
	for (let attempt = 0; attempt < attempts; attempt++) {
		const metadata = await lookup(url)
		if (metadata) return metadata
		if (attempt < attempts - 1) await pause(interval + Math.random() * 200)
	}
	return null
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

export async function verifyJsrManifest(manifest, directory, context = {}) {
	assert(Object.keys(manifest).length > 0, "Empty JSR manifest")
	if (context.files) {
		assert.deepEqual(
			Object.keys(manifest).sort(),
			context.files,
			"Published JSR file set differs"
		)
	}
	const jsrSource = context.dependencies
		? (await import("./lib/jsr-publication.mjs")).jsrSource
		: undefined
	for (const [name, entry] of Object.entries(manifest)) {
		const file = path.resolve(directory, `.${name}`)
		assert(
			name.startsWith("/") &&
				file.startsWith(`${path.resolve(directory)}${path.sep}`),
			"Invalid JSR file path"
		)
		const original = await readFile(file)
		const content = context.dependencies
			? jsrSource(
					original.toString("utf8"),
					file,
					context.dependencies,
					context.typeDependencies
				)
			: original
		const checksum = `sha256-${createHash("sha256")
			.update(content)
			.digest("hex")}`
		assert.equal(
			checksum,
			entry.checksum,
			`Published JSR file differs: ${name}`
		)
	}
}

export async function verifyPublishedJsrVersion(
	url,
	version,
	directory,
	context = {}
) {
	if (!(await registryJson(url))?.versions?.[version]) return false
	const published = await registryJson(
		url.replace(/meta\.json$/, `${version}_meta.json`)
	)
	assert(published?.manifest, "JSR version manifest is unavailable")
	if (context.exports) {
		assert.deepEqual(
			published.exports,
			context.exports,
			"Published JSR exports differ"
		)
	}
	await verifyJsrManifest(published.manifest, directory, context)
	return true
}

export function verifyJsrProvenance(metadata, policy = "required") {
	assert(
		["required", "disabled-for-recovery"].includes(policy),
		"Invalid JSR provenance policy"
	)
	assert(metadata, "JSR provenance metadata is unavailable")
	if (typeof metadata.rekorLogId === "string" && metadata.rekorLogId.length > 0)
		return true
	assert.equal(
		policy,
		"disabled-for-recovery",
		"Published JSR version has no provenance. Recovery requires explicitly selecting disabled-for-recovery; this cannot restore the missing attestation."
	)
	return false
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
		const { jsrPublicationContext } = await import("./lib/jsr-publication.mjs")
		if (
			!(await verifyPublishedJsrVersion(
				jsrUrl,
				version,
				"packages/ui",
				await jsrPublicationContext("packages/ui")
			))
		)
			return false
		const metadata = await registryJson(
			`https://api.jsr.io/scopes/chitrank2050/packages/monoline-ui/versions/${version}`
		)
		assert.equal(metadata?.version, version, "JSR provenance version differs")
		if (
			!verifyJsrProvenance(metadata, process.env.JSR_PROVENANCE || "required")
		) {
			const warning = `JSR ${name}@${version} has verified contents but no registry provenance attestation. Recovery does not restore that attestation.`
			console.warn(`::warning::${warning}`)
			if (process.env.JSR_RECOVERY_NOTES)
				await appendFile(
					process.env.JSR_RECOVERY_NOTES,
					`\n\n**Publication recovery:** ${warning}\n`
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
		console.log(
			"npm accepted the upload; waiting up to 20 minutes for registry availability."
		)
		metadata = await waitForNpmMetadata(npmUrl)
	}
	assert(
		metadata,
		`npm has not exposed ${name}@${version}. It may still be processing or awaiting review; retry verification of the same release when available.`
	)
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
