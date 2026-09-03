import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

import {
	findClientComponentEntries,
	hasUseClientDirective,
} from "./lib/client-boundaries.mjs"
import { projectPaths } from "./lib/project-paths.mjs"
import { runTarballConsumers } from "./lib/tarball-consumers.mjs"

const { distDir, libraryRoot } = projectPaths

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

async function assertClientBoundaries() {
	const clientComponentEntries = await findClientComponentEntries(libraryRoot)
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
	const componentRoot = path.join(libraryRoot, "src", "components")
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
		path.join(libraryRoot, "src", "foundations", "theme", "tokens.css"),
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
		path.join(libraryRoot, "src", "foundations", "theme", "tailwind.css"),
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

async function runContract(name, contract) {
	const startedAt = performance.now()
	await contract()
	console.log(`✓ ${name} (${Math.round(performance.now() - startedAt)}ms)`)
}

await Promise.all([
	runContract("package export targets", assertExportTargetsExist),
	runContract("client boundaries", assertClientBoundaries),
	runContract("component CSS ownership", assertCssOwnership),
	runContract("acyclic theme aliases", assertThemeAliasesAreAcyclic),
	runContract("system light-theme parity", assertSystemLightThemeParity),
])
await runContract("real tarball consumers", runTarballConsumers)

console.log("Package contract verified")
