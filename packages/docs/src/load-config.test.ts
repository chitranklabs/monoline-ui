// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"

import { loadConfig } from "./load-config"

const roots: string[] = []
async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "docs-config-"))
	roots.push(root)
	return root
}
afterEach(async () => {
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	)
})

it.each([
	"monoline-docs.yml",
	"monoline-docs.yaml",
	"monoline-docs.config.mjs",
])("discovers %s through the same defaults and validation", async (name) => {
	const root = await fixture()
	await writeFile(
		join(root, name),
		name.endsWith("mjs")
			? 'export default { title: "Docs", defaultMode: "dark" }'
			: "title: Docs\ndefaultMode: dark\n"
	)
	expect(await loadConfig({ cwd: root })).toMatchObject({
		title: "Docs",
		defaultMode: "dark",
		contentDirectory: join(root, "content"),
		outDirectory: join(root, "dist"),
		indexing: true,
	})
})

it("rejects ambiguity and supports explicit legacy files relative to the supplied cwd", async () => {
	const root = await fixture()
	await expect(loadConfig({ cwd: root })).rejects.toThrow(
		"No documentation config"
	)
	await writeFile(join(root, "monoline-docs.yml"), "title: YAML")
	await writeFile(
		join(root, "monoline-docs.config.mjs"),
		'export default { title: "Module" }'
	)
	await expect(loadConfig({ cwd: root })).rejects.toThrow(
		"Multiple documentation configs"
	)
	await mkdir(join(root, "nested"))
	await writeFile(
		join(root, "nested/monoline.config.mjs"),
		'export default { title: "Legacy", assetsDirectory: "./assets" }'
	)
	expect(
		await loadConfig({ cwd: root, config: "nested/monoline.config.mjs" })
	).toMatchObject({
		title: "Legacy",
		assetsDirectory: join(root, "nested/assets"),
		contentDirectory: join(root, "nested/content"),
	})
})

it.each([
	["title: One\ntitle: Two", "duplicated"],
	["title: [", "config"],
	["title: One\n---\ntitle: Two", "single document"],
	["title: !!js/function 'function () {}'", "unknown scalar tag"],
	["title: Docs\nindexing: 'false'", "indexing must be a boolean"],
	["title: Docs\ntypo: true", "config.typo"],
	["", "input is empty"],
])("rejects invalid YAML %j with the file path", async (source, message) => {
	const root = await fixture()
	await writeFile(join(root, "monoline-docs.yml"), source)
	await expect(loadConfig({ cwd: root })).rejects.toThrow(message)
	await expect(loadConfig({ cwd: root })).rejects.toThrow(
		join(root, "monoline-docs.yml")
	)
})

it("applies only explicit build overrides and does not reinterpret YAML strings", async () => {
	const root = await fixture()
	await writeFile(
		join(root, "monoline-docs.yml"),
		"title: ${TEAM_NAME}\nsite: https://example.com\nbase: /production/\nindexing: true"
	)
	expect(
		await loadConfig({
			cwd: root,
			overrides: { base: "/preview/", indexing: false },
		})
	).toMatchObject({
		title: "${TEAM_NAME}",
		site: "https://example.com",
		base: "/preview/",
		indexing: false,
		environment: "production",
	})
	await expect(
		loadConfig({ cwd: root, overrides: { site: "javascript:alert(1)" } })
	).rejects.toThrow("HTTP(S)")
	await expect(
		loadConfig({ cwd: root, config: "config.json" })
	).rejects.toThrow("Supported config extensions")
})
