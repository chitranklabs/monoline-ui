import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import {
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import {
	findClientComponentEntries,
	hasUseClientDirective,
} from "./lib/client-boundaries.mjs"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, "..")
const distDir = path.join(projectRoot, "dist")
const execFileAsync = promisify(execFile)

const readJson = async (filePath) =>
	JSON.parse(await readFile(filePath, "utf8"))

async function assertExportTargetsExist() {
	const packageJson = await readJson(path.join(distDir, "package.json"))
	const themeExport = packageJson.exports["./theme.css"]
	assert.deepEqual(
		themeExport,
		{
			style: "./styles/theme.css",
			default: "./styles/theme.css",
		},
		"The theme export must support CSS-aware bundlers and standard resolution"
	)
	assert.deepEqual(
		packageJson.exports["./styles/theme.css"],
		themeExport,
		"The legacy styles/theme.css path must resolve to the canonical theme"
	)
	assert.ok(
		packageJson.sideEffects.includes("./styles/theme.css"),
		"Bundlers must not tree-shake the theme stylesheet"
	)

	for (const [exportName, exportTarget] of Object.entries(
		packageJson.exports
	)) {
		if (exportName.includes("*")) continue

		const targets =
			typeof exportTarget === "string"
				? [exportTarget]
				: Object.values(exportTarget)

		for (const target of targets) {
			const filePath = path.join(distDir, target.replace(/^\.\//, ""))
			await assert.doesNotReject(
				readFile(filePath),
				`${exportName} points to missing ${target}`
			)
		}
	}

	const themeCss = await readFile(
		path.join(distDir, "styles", "theme.css"),
		"utf8"
	)
	assert.match(
		themeCss,
		/@source "\.\.";/,
		"The published theme must register compiled component sources with Tailwind"
	)
}

async function assertInstalledPackageImports() {
	const packageJson = await readJson(path.join(distDir, "package.json"))
	const consumerDir = await mkdtemp(
		path.join(os.tmpdir(), "monoline-consumer-")
	)
	const packageScopeDir = path.join(
		consumerDir,
		"node_modules",
		"@chitrank2050"
	)
	await mkdir(packageScopeDir, { recursive: true })
	await symlink(distDir, path.join(packageScopeDir, "monoline-ui"), "dir")

	try {
		const importTargets = Object.entries(packageJson.exports)
			.filter(
				([exportName, exportTarget]) =>
					!exportName.includes("*") &&
					(typeof exportTarget === "string"
						? exportTarget.endsWith(".js")
						: typeof exportTarget.import === "string")
			)
			.map(([exportName]) =>
				exportName === "."
					? packageJson.name
					: `${packageJson.name}${exportName.slice(1)}`
			)
		const smokeFile = path.join(consumerDir, "smoke.mjs")
		await writeFile(
			smokeFile,
			`${importTargets.map((target) => `await import(${JSON.stringify(target)})`).join("\n")}\n`,
			"utf8"
		)
		await assert.doesNotReject(
			execFileAsync(process.execPath, [smokeFile], { cwd: consumerDir }),
			"A clean consumer could not import the published package subpaths"
		)
	} finally {
		await rm(consumerDir, { recursive: true, force: true })
	}
}

async function assertPackManifest() {
	const { stdout } = await execFileAsync(
		"npm",
		["pack", "--dry-run", "--json"],
		{ cwd: distDir }
	)
	const [packResult] = JSON.parse(stdout)
	const packedFiles = new Set(packResult.files.map((file) => file.path))

	for (const requiredFile of [
		"index.js",
		"index.d.ts",
		"styles/theme.css",
		"README.md",
		"LICENSE",
	]) {
		assert.equal(
			packedFiles.has(requiredFile),
			true,
			`The npm artifact must include ${requiredFile}`
		)
	}
}

async function assertNextRscConsumerBuild() {
	const consumerDir = await mkdtemp(
		path.join(projectRoot, ".tmp-next-rsc-consumer-")
	)
	const nodeModulesDir = path.join(consumerDir, "node_modules")
	const packageScopeDir = path.join(nodeModulesDir, "@chitrank2050")
	await mkdir(path.join(consumerDir, "app"), { recursive: true })
	await mkdir(packageScopeDir, { recursive: true })

	await symlink(distDir, path.join(packageScopeDir, "monoline-ui"), "dir")

	try {
		await writeFile(
			path.join(consumerDir, "package.json"),
			JSON.stringify({ private: true, type: "module" }),
			"utf8"
		)
		await writeFile(
			path.join(consumerDir, "app", "layout.jsx"),
			`export default function Layout({ children }) {
	return <html lang="en"><body>{children}</body></html>
}
`,
			"utf8"
		)
		await writeFile(
			path.join(consumerDir, "app", "page.jsx"),
			`import { Card } from "@chitrank2050/monoline-ui/card"
import { Toggle } from "@chitrank2050/monoline-ui/toggle"

export default function Page() {
	return <main><Card>Server-safe card</Card><Toggle aria-label="Theme" /></main>
}
`,
			"utf8"
		)

		await assert.doesNotReject(
			execFileAsync(
				path.join(projectRoot, "node_modules", ".bin", "next"),
				["build"],
				{
					cwd: consumerDir,
					env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
				}
			),
			"A Next.js Server Component could not consume static and client subpaths"
		)
	} finally {
		await rm(consumerDir, { recursive: true, force: true })
	}
}

async function assertClientBoundaries() {
	const clientComponentEntries = await findClientComponentEntries(projectRoot)
	const rootEntry = await readFile(path.join(distDir, "index.js"), "utf8")
	assert.equal(
		hasUseClientDirective(rootEntry),
		true,
		"The mixed root entry must be a client boundary; use server-safe subpaths for RSC optimization"
	)

	for (const component of clientComponentEntries) {
		const entry = await readFile(
			path.join(distDir, "components", component, "index.js"),
			"utf8"
		)
		assert.equal(
			hasUseClientDirective(entry),
			true,
			`${component} must preserve its client boundary in the published entry`
		)
	}

	const componentEntries = await readdir(path.join(distDir, "components"), {
		withFileTypes: true,
	})
	for (const entry of componentEntries) {
		if (!entry.isDirectory() || clientComponentEntries.includes(entry.name)) {
			continue
		}
		let source
		try {
			source = await readFile(
				path.join(distDir, "components", entry.name, "index.js"),
				"utf8"
			)
		} catch (error) {
			if (error.code === "ENOENT") continue
			throw error
		}
		assert.equal(
			hasUseClientDirective(source),
			false,
			`${entry.name} must remain server-safe in its component subpath`
		)
	}
}

async function assertCssOwnership() {
	const componentRoot = path.join(projectRoot, "src", "components")
	const componentDirs = await readdir(componentRoot, { withFileTypes: true })
	const componentNames = componentDirs
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)

	for (const entry of componentDirs) {
		if (!entry.isDirectory()) continue
		const cssPath = path.join(componentRoot, entry.name, `${entry.name}.css`)
		let css
		try {
			css = await readFile(cssPath, "utf8")
		} catch {
			continue
		}

		const selectors = [...css.matchAll(/\.ml-([a-z0-9-]+)(?=[\s.:>[#])/g)].map(
			(match) => match[1]
		)
		const foreignSelectors = selectors.filter((selector) => {
			const owner = componentNames
				.filter(
					(componentName) =>
						selector === componentName ||
						selector.startsWith(`${componentName}__`) ||
						selector.startsWith(`${componentName}--`) ||
						selector.startsWith(`${componentName}-`)
				)
				.sort((left, right) => right.length - left.length)[0]

			return owner !== undefined && owner !== entry.name
		})

		assert.deepEqual(
			[...new Set(foreignSelectors)],
			[],
			`${entry.name}.css styles another component namespace`
		)
	}
}

function readBalancedBlock(source, marker) {
	const markerIndex = source.indexOf(marker)
	assert.notEqual(markerIndex, -1, `Missing CSS block: ${marker}`)
	const start = source.indexOf("{", markerIndex)
	let depth = 0

	for (let index = start; index < source.length; index += 1) {
		if (source[index] === "{") depth += 1
		if (source[index] === "}") depth -= 1
		if (depth === 0) return source.slice(start + 1, index)
	}

	assert.fail(`Unclosed CSS block: ${marker}`)
}

function readCustomProperties(block) {
	return new Map(
		[...block.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gim)].map(
			([, name, value]) => [name, value.trim()]
		)
	)
}

async function assertSystemLightThemeParity() {
	const tokens = await readFile(
		path.join(projectRoot, "src", "foundations", "theme", "tokens.css"),
		"utf8"
	)
	const explicitLight = readCustomProperties(
		readBalancedBlock(tokens, '[data-theme="light"]')
	)
	const systemLight = readCustomProperties(
		readBalancedBlock(tokens, ":root:not([data-theme]):not(.dark):not(.light)")
	)
	const mismatches = []

	for (const [name, value] of explicitLight) {
		if (systemLight.get(name) !== value) mismatches.push(name)
	}

	assert.deepEqual(
		mismatches,
		[],
		"The system light theme must match every explicit light-theme token"
	)
}

async function assertThemeAliasesAreAcyclic() {
	const tailwindTheme = await readFile(
		path.join(projectRoot, "src", "foundations", "theme", "tailwind.css"),
		"utf8"
	)
	const cyclicAliases = [
		...tailwindTheme.matchAll(/^\s*--([a-z0-9-]+):\s*var\(--\1\);/gim),
	].map((match) => match[1])

	assert.deepEqual(
		cyclicAliases,
		[],
		"Tailwind theme aliases must not reference themselves"
	)
}

await assertExportTargetsExist()
await assertInstalledPackageImports()
await assertPackManifest()
await assertClientBoundaries()
await assertNextRscConsumerBuild()
await assertCssOwnership()
await assertThemeAliasesAreAcyclic()
await assertSystemLightThemeParity()

console.log("Package contract verified")
