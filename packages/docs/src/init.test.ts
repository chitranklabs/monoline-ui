// @vitest-environment node
import {
	chmod,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"

import { initializeDocs } from "./init.ts"

const roots: string[] = []
async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "monoline-init-"))
	roots.push(root)
	return root
}
afterEach(async () => {
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))
	)
})

it("initializes an empty directory and refuses a repeat without changing files", async () => {
	const cwd = await fixture()
	await initializeDocs(cwd)
	const config = await readFile(join(cwd, "monoline-docs.yml"), "utf8")
	expect(config).toContain(
		"# yaml-language-server: $schema=./node_modules/@chitrank2050/monoline-docs/schema.json"
	)
	const manifest = JSON.parse(await readFile(join(cwd, "package.json"), "utf8"))
	expect(manifest.scripts).toEqual({
		build: "monoline-docs build",
		dev: "monoline-docs dev",
	})
	expect(manifest.dependencies["@chitrank2050/monoline-docs"]).toBeTruthy()
	expect(await readFile(join(cwd, "content/index.md"), "utf8")).toContain(
		"title: Introduction"
	)
	await expect(initializeDocs(cwd)).rejects.toThrow(/already exists/)
	expect(await readFile(join(cwd, "monoline-docs.yml"), "utf8")).toBe(config)
})

it("preserves existing manifest fields and dependencies while adding scripts", async () => {
	const cwd = await fixture()
	const existing = {
		name: "existing",
		scripts: { test: "vitest" },
		dependencies: { "@chitrank2050/monoline-docs": "file:docs.tgz" },
		custom: { retained: true },
	}
	await writeFile(join(cwd, "package.json"), JSON.stringify(existing))
	await initializeDocs(cwd)
	const manifest = JSON.parse(await readFile(join(cwd, "package.json"), "utf8"))
	expect(manifest).toMatchObject(existing)
	expect(manifest.scripts.build).toBe("monoline-docs build")
})

it.each(["package", "config", "symlink"])(
	"refuses %s conflicts before creating content",
	async (kind) => {
		const cwd = await fixture()
		if (kind === "package")
			await writeFile(
				join(cwd, "package.json"),
				JSON.stringify({ scripts: { build: "vite build" } })
			)
		if (kind === "config")
			await writeFile(
				join(cwd, "monoline-docs.config.mjs"),
				"export default {}"
			)
		if (kind === "symlink") await symlink(await fixture(), join(cwd, "content"))
		const before = await readdir(cwd)
		await expect(initializeDocs(cwd)).rejects.toThrow()
		expect(await readdir(cwd)).toEqual(before)
	}
)

it("rolls back created files when content cannot be written, preserving the manifest", async () => {
	const cwd = await fixture()
	const original = '{"name":"preserved","scripts":{"test":"vitest"}}\n'
	await writeFile(join(cwd, "package.json"), original)
	await mkdir(join(cwd, "content"), { mode: 0o555 })
	try {
		await expect(initializeDocs(cwd)).rejects.toThrow(/EACCES/)
		expect((await readdir(cwd)).sort()).toEqual(["content", "package.json"])
		expect(await readFile(join(cwd, "package.json"), "utf8")).toBe(original)
		expect(await readdir(join(cwd, "content"))).toEqual([])
	} finally {
		await chmod(join(cwd, "content"), 0o755)
	}
})
