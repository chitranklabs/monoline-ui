import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = fileURLToPath(new URL(".", import.meta.url))
const root = await mkdtemp(join(tmpdir(), "monoline-docs-consumer-"))
function run(command, args, cwd = root) {
	return execFileSync(command, args, {
		cwd,
		encoding: "utf8",
		timeout: 120000,
		stdio: ["ignore", "pipe", "pipe"],
	})
}
try {
	run("pnpm", ["build"], packageDirectory)
	const packed = JSON.parse(
		run(
			"npm",
			["pack", "--json", "--ignore-scripts", "--pack-destination", root],
			packageDirectory
		)
	)[0]
	assert(
		packed.files.every(
			(file) => !file.path.startsWith("src/") && !file.path.includes(".test.")
		)
	)
	await writeFile(
		join(root, "package.json"),
		JSON.stringify({
			private: true,
			type: "module",
			dependencies: { "@monoline/docs": `file:${join(root, packed.filename)}` },
		})
	)
	run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"])
	await mkdir(join(root, "content"))
	await mkdir(join(root, "assets"))
	await writeFile(
		join(root, "content/index.md"),
		"---\ntitle: Start\n---\n## Install\nStandalone consumer.\n"
	)
	await writeFile(
		join(root, "content/draft.md"),
		"---\ntitle: Draft\ndraft: true\n---\nUnpublished"
	)
	await writeFile(join(root, "assets/custom.css"), ":root { --radius: 0; }")
	await writeFile(
		join(root, "monoline.config.mjs"),
		`import { defineConfig } from '@monoline/docs'; export default defineConfig({ title: 'Consumer', site: 'https://example.com', base: '/handbook/', assetsDirectory: './assets', stylesheet: '/assets/custom.css', defaultMode: 'dark' });`
	)
	const cli = join(root, "node_modules/.bin/monoline-docs")
	await writeFile(
		join(root, "monoline-docs.yml"),
		"title: YAML consumer\nsite: https://example.com\nbase: /handbook/\nassetsDirectory: ./assets\nstylesheet: /assets/custom.css\ndefaultMode: dark\n"
	)
	run(cli, ["build", "--base", "/", "--indexing", "false"])
	assert(
		(await readFile(join(root, "dist/index.html"), "utf8")).includes(
			'content="noindex, nofollow"'
		)
	)
	assert(
		!(await readFile(join(root, "dist/search-index.json"), "utf8")).includes(
			"Unpublished"
		)
	)
	await assert.rejects(readFile(join(root, "dist/sitemap.xml")))
	assert.throws(() => run(cli, ["build", "--indexing", "maybe"]))
	await writeFile(join(root, "monoline-docs.yaml"), "title: Ambiguous")
	assert.throws(() => run(cli, ["build"]))
	await rm(join(root, "monoline-docs.yaml"))
	for (const recipe of ["vercel.json", "netlify.toml", "github-pages.yml"])
		assert(
			(
				await readFile(
					join(root, "node_modules/@monoline/docs/templates", recipe),
					"utf8"
				)
			).length > 0
		)
	// Invoke from another directory to verify paths belong to the config file.
	run(cli, ["build", "--config", join(root, "monoline.config.mjs")], tmpdir())
	const html = await readFile(join(root, "dist/index.html"), "utf8")
	assert(html.includes('data-theme="dark"'))
	assert(html.includes('href="https://example.com/handbook/"'))
	assert(
		!(await readFile(join(root, "dist/search-index.json"), "utf8")).includes(
			"Unpublished"
		)
	)
	assert.throws(() => run(cli, ["build", "--unknown"]))
	assert.throws(() => run(cli, ["dev", "--port", "70000"]))
	await writeFile(
		join(root, "contract.ts"),
		`import { defineConfig } from '@monoline/docs'; import { buildDocs } from '@monoline/docs/build'; import { startDevServer } from '@monoline/docs/dev'; const config = defineConfig({ title: 'Docs', defaultMode: 'dark' }); void buildDocs(config); void startDevServer(config); // @ts-expect-error unsupported mode\ndefineConfig({ title: 'Docs', defaultMode: 'sepia' });`
	)
	run("tsc", [
		"--noEmit",
		"--strict",
		"--module",
		"NodeNext",
		"--target",
		"ES2022",
		"contract.ts",
	])
	await writeFile(
		join(root, "preview.mjs"),
		`import assert from 'node:assert/strict'; import { startDevServer } from '@monoline/docs/dev'; import config from './monoline.config.mjs'; const preview = await startDevServer(config, 0); try { const response = await fetch(preview.url + 'search-index.json'); assert.equal(response.status, 200); assert((await response.text()).includes('Unpublished')); assert.equal((await fetch(preview.url + 'missing/')).status, 404); } finally { await preview.close(); }`
	)
	run(process.execPath, ["preview.mjs"])
	console.log(
		"Docs consumer passed: packed install, CLI, declarations, subpath build, drafts, search and preview."
	)
} finally {
	await rm(root, { recursive: true, force: true })
}
