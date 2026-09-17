import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import {
	cp,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { verifyEngine } from "./test-engine.mjs"

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
	await verifyEngine(join(root, "node_modules/@monoline/docs"), root)
	await mkdir(join(root, "content"))
	await mkdir(join(root, "assets"))
	await writeFile(
		join(root, "content/index.mdx"),
		'---\ntitle: Start\n---\nimport Tabs from "@monoline/docs/components/Tabs.astro"\nimport LinkCard from "@monoline/docs/components/LinkCard.astro"\n\n## Install\n\n<Tabs id="install" labels={["npm", "pnpm"]}><pre slot="npm"><code>npm install</code></pre><pre slot="pnpm"><code>pnpm add</code></pre></Tabs>\n<LinkCard href="/" title="Introduction" description="Return home" />\n'
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
	const askWidget = join(root, "ask-widget")
	await cp(join(packageDirectory, "fixtures/ask-widget"), askWidget, {
		recursive: true,
	})
	run(cli, ["build"], askWidget)
	const askOutput = join(askWidget, "dist")
	const expectedAskWidgetPages = [
		"index.html",
		"getting-started.html",
		"api.html",
		"theming.html",
		"hooks.html",
		"architecture.html",
		"changelog.html",
		"code-of-conduct.html",
	]
	for (const page of expectedAskWidgetPages)
		assert((await readFile(join(askOutput, page), "utf8")).includes("<main"))
	const askApi = await readFile(join(askOutput, "api.html"), "utf8")
	assert.equal((askApi.match(/<tr>/g) ?? []).length, 13)
	assert(askApi.includes("ChatStreamHandler"))
	assert(
		askApi.includes('href="https://chitranklabs.github.io/ask-widget/api"')
	)
	const askHome = await readFile(join(askOutput, "index.html"), "utf8")
	assert(askHome.includes('href="/ask-widget/getting-started"'))
	assert(!askHome.includes("vitepress"))
	assert(!askHome.includes("vue"))
	assert.deepEqual(
		(await readdir(askOutput))
			.filter((name) => name.endsWith(".html") && name !== "404.html")
			.sort(),
		expectedAskWidgetPages.sort()
	)
	await writeFile(
		join(askWidget, "data/api-props.mjs"),
		'export const apiRows = [{ name: "newOption", type: "boolean", default: "false", description: "Generated API change." }]\n'
	)
	run(cli, ["build"], askWidget)
	assert(
		(await readFile(join(askOutput, "api.html"), "utf8")).includes("newOption")
	)
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
	await mkdir(join(root, "components"))
	await writeFile(
		join(root, "components/Counter.jsx"),
		'import { useState } from "react"; export default function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Count {count}</button> }'
	)
	await writeFile(
		join(root, "content/react.mdx"),
		'---\ntitle: React example\n---\nimport Counter from "../components/Counter.jsx"\n\n## Counter\n\n<Counter client:load />\n'
	)
	await writeFile(
		join(root, "monoline.config.mjs"),
		`import { defineConfig } from '@monoline/docs'; export default defineConfig({ title: 'Consumer', site: 'https://example.com', base: '/handbook/', assetsDirectory: './assets', stylesheet: '/assets/custom.css', defaultMode: 'dark', react: true });`
	)
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
	const reactHtml = await readFile(join(root, "dist/react/index.html"), "utf8")
	assert(html.includes('data-theme="dark"'))
	assert(html.includes('class="docs-tabs"'))
	assert(html.includes('href="/handbook/"'))
	assert(html.includes('href="https://example.com/handbook/"'))
	assert(!html.includes("astro-island"))
	assert(!html.includes("/_astro/"))
	assert(reactHtml.includes("astro-island"))
	assert(/Count(?:<!--.*?-->|\s)*0/.test(reactHtml))
	assert(
		JSON.parse(
			await readFile(join(root, "dist/.monoline-generated.json"), "utf8")
		).some((name) => name.startsWith("_astro/") && name.endsWith(".js"))
	)
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
	const pnpmRoot = join(root, "pnpm-consumer")
	await mkdir(join(pnpmRoot, "content"), { recursive: true })
	await mkdir(join(pnpmRoot, "components"))
	await writeFile(
		join(pnpmRoot, "package.json"),
		JSON.stringify({
			private: true,
			type: "module",
			dependencies: {
				"@monoline/docs": `file:${join(root, packed.filename)}`,
				react: "19.3.0",
				"react-dom": "19.3.0",
			},
		})
	)
	await writeFile(
		join(pnpmRoot, "components/Counter.jsx"),
		'import { useState } from "react"; export default function Counter() { const [count] = useState(0); return <button>Count {count}</button> }'
	)
	await writeFile(
		join(pnpmRoot, "content/index.mdx"),
		'---\ntitle: pnpm consumer\n---\nimport Counter from "../components/Counter.jsx"\n\n<Counter client:load />\n'
	)
	await writeFile(
		join(pnpmRoot, "monoline-docs.yml"),
		"title: pnpm consumer\nbase: /reference/\nreact: true\n"
	)
	run(
		"pnpm",
		["install", "--ignore-scripts", "--strict-peer-dependencies"],
		pnpmRoot
	)
	run(join(pnpmRoot, "node_modules/.bin/monoline-docs"), ["build"], pnpmRoot)
	assert(
		(await readFile(join(pnpmRoot, "dist/index.html"), "utf8")).includes(
			"astro-island"
		)
	)
	console.log(
		"Docs consumer passed: npm and strict pnpm installs, Ask Widget clean routes, generated API data, CLI, React island, declarations, drafts, search and preview."
	)
} finally {
	await rm(root, { recursive: true, force: true })
}
