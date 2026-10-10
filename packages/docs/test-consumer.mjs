import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import {
	cp,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	stat,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { verifyEngine } from "./test-engine.mjs"

const packageDirectory = fileURLToPath(new URL(".", import.meta.url))
const root = await mkdtemp(join(tmpdir(), "monoline-docs-consumer-"))
const ownedRoots = [root]
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
	assert((await stat(join(packageDirectory, "dist/cli.js"))).mode & 0o111)
	const packed = JSON.parse(
		run(
			"npm",
			["pack", "--json", "--ignore-scripts", "--pack-destination", root],
			packageDirectory
		)
	)[0]
	assert.ok(
		packed.files.some((file) => file.path === "skills/monoline-docs/SKILL.md"),
		"Published package must include the maintained authoring skill"
	)
	assert.ok(
		packed.files.some((file) => file.path === "schema.json"),
		"Published package must include the editor schema"
	)

	assert(
		packed.files.every(
			(file) =>
				!file.path.startsWith("src/") &&
				!file.path.split("/").includes("fixtures") &&
				!file.path.includes(".test.") &&
				!/^test-.*\.mjs$/.test(file.path)
		),
		"Published package must exclude sources, fixtures and test runners"
	)
	await writeFile(
		join(root, "package.json"),
		JSON.stringify({
			private: true,
			type: "module",
			dependencies: {
				"@chitrank2050/monoline-docs": `file:${join(root, packed.filename)}`,
				"@chitrank2050/ask-widget": "0.6.1",
				react: "19.3.0",
				"react-dom": "19.3.0",
			},
		})
	)
	run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"])
	const schemaPath = join(
		root,
		"node_modules/@chitrank2050/monoline-docs/schema.json"
	)
	assert.equal(
		JSON.parse(await readFile(schemaPath, "utf8")).required[0],
		"title"
	)
	run(process.execPath, [
		"--input-type=module",
		"-e",
		"import schema from '@chitrank2050/monoline-docs/schema.json' with { type: 'json' }; if (!schema.properties.navigation) throw new Error('Missing navigation schema');",
	])
	const cli = join(root, "node_modules/.bin/monoline-docs")
	for (const manager of ["npm", "pnpm"]) {
		const starter = await mkdtemp(
			join(tmpdir(), `monoline-docs-${manager}-starter-`)
		)
		ownedRoots.push(starter)
		assert.throws(
			() =>
				run(
					process.execPath,
					["--input-type=module", "-e", "import '@chitrank2050/monoline-docs'"],
					starter
				),
			/ERR_MODULE_NOT_FOUND/
		)
		run(cli, ["init"], starter)
		const originalConfig = await readFile(
			join(starter, "monoline-docs.yml"),
			"utf8"
		)
		assert.throws(() => run(cli, ["init"], starter), /already exists/)
		assert.equal(
			await readFile(join(starter, "monoline-docs.yml"), "utf8"),
			originalConfig
		)
		assert.throws(
			() => run(cli, ["init", "--base", "/docs/"], starter),
			/does not accept/
		)
		run(
			manager,
			manager === "npm"
				? [
						"install",
						join(root, packed.filename),
						"--ignore-scripts",
						"--no-audit",
						"--no-fund",
					]
				: [
						"add",
						join(root, packed.filename),
						"--ignore-scripts",
						"--strict-peer-dependencies",
					],
			starter
		)
		if (manager === "pnpm")
			await writeFile(
				join(starter, "pnpm-workspace.yaml"),
				"allowBuilds:\n  esbuild: false\n"
			)
		run(manager, ["run", "build"], starter)
		assert(
			(await readFile(join(starter, "dist/index.html"), "utf8")).includes(
				"Getting started"
			)
		)
		assert(
			!(await readFile(join(starter, "dist/index.html"), "utf8")).includes(
				"astro-island"
			)
		)
	}
	await verifyEngine(
		join(root, "node_modules/@chitrank2050/monoline-docs"),
		root
	)
	const authoringSource = (
		await readFile(
			new URL("./fixtures/browser/components.mdx", import.meta.url),
			"utf8"
		)
	)
		.replaceAll('href="/deployment"', 'href="/"')
		.replaceAll('href="/configuration"', 'href="/"')
	await mkdir(join(root, "content"))
	await mkdir(join(root, "assets"))
	await writeFile(
		join(root, "content/index.mdx"),
		'---\ntitle: Start\n---\nimport Tabs from "@chitrank2050/monoline-docs/components/Tabs.astro"\nimport LinkCard from "@chitrank2050/monoline-docs/components/LinkCard.astro"\n\n## Install\n\n<Tabs id="install" labels={["npm", "pnpm"]}><pre slot="npm"><code>npm install</code></pre><pre slot="pnpm"><code>pnpm add</code></pre></Tabs>\n<LinkCard href="/" title="Introduction" description="Return home" />\n'
	)
	await writeFile(
		join(root, "content/draft.md"),
		"---\ntitle: Draft\ndraft: true\n---\nUnpublished"
	)
	await writeFile(join(root, "content/components.mdx"), authoringSource)
	await writeFile(
		join(root, "content/source-preview.mdx"),
		'---\ntitle: Source preview\n---\nimport Preview from "@chitrank2050/monoline-docs/components/Preview.astro"\nimport Button from "@chitrank2050/monoline-docs/components/Button.astro"\nimport Table from "@chitrank2050/monoline-docs/components/Table.astro"\n\n<Preview title="Consumer source" source={"const a = 1\\nconst b = 2\\nconst c = 3\\nconst d = 4\\nconst e = 5"} language="js" showCaption={false}><Button>Example</Button><Button variant="outline">Secondary</Button><Button variant="ghost" href="/">Home</Button></Preview>\n<Preview title="Short source" source={"one\\ntwo\\nthree\\nfour"}><p>Short example</p></Preview>\n<Table caption="Generic values" variant="compact" columns={[{key:"name",label:"Name"},{key:"value",label:"Value"}]} rows={[{name:"zero",value:0},{name:"boolean",value:false}]} />\n'
	)
	await writeFile(
		join(root, "assets/build-flow.svg"),
		await readFile(
			new URL("../../apps/docs-demo/assets/build-flow.svg", import.meta.url)
		)
	)
	await writeFile(join(root, "assets/custom.css"), ":root { --radius: 0; }")
	await writeFile(
		join(root, "monoline.config.mjs"),
		`import { defineConfig } from '@chitrank2050/monoline-docs'; export default defineConfig({ title: 'Consumer', site: 'https://example.com', base: '/handbook/', assetsDirectory: './assets', stylesheet: '/assets/custom.css', defaultMode: 'dark' });`
	)
	const askWidget = join(root, "ask-widget")
	await cp(join(packageDirectory, "fixtures/ask-widget"), askWidget, {
		recursive: true,
	})
	run(cli, ["build", "--base", "/"], askWidget)
	await cp(join(askWidget, "dist"), join(askWidget, "dist-root"), {
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
	assert(
		(await readFile(join(askOutput, "getting-started.html"), "utf8")).includes(
			"astro-island"
		)
	)
	for (const [page, anchors] of Object.entries({
		"getting-started": ["installation", "basic-usage", "prerequisites"],
		api: ["chatwidget-props", "chatstreamhandler-type", "example-usage"],
		theming: ["built-in-themes", "custom-colors", "note-on-custom-colors"],
		hooks: ["usechat", "usessestream", "usesession"],
		architecture: [
			"component-layer",
			"state-hooks-layer-headless-api",
			"style-presentation-layer",
		],
	})) {
		const html = await readFile(join(askOutput, `${page}.html`), "utf8")
		for (const anchor of anchors)
			assert(html.includes(`id="${anchor}"`), `${page} lost #${anchor}`)
	}
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
		`import { defineConfig } from '@chitrank2050/monoline-docs'; export default defineConfig({ title: 'Consumer', site: 'https://example.com', base: '/handbook/', assetsDirectory: './assets', stylesheet: '/assets/custom.css', defaultMode: 'dark', react: true });`
	)
	for (const recipe of [
		"vercel.json",
		"netlify.toml",
		"github-pages.yml",
		"cloudflare-pages.md",
	])
		assert(
			(
				await readFile(
					join(
						root,
						"node_modules/@chitrank2050/monoline-docs/templates",
						recipe
					),
					"utf8"
				)
			).length > 0
		)
	// Invoke from another directory to verify paths belong to the config file.
	run(cli, ["build", "--config", join(root, "monoline.config.mjs")], tmpdir())
	const sourcePreview = await readFile(
		join(root, "dist/source-preview/index.html"),
		"utf8"
	)
	assert(sourcePreview.includes("docs-source-teaser"))
	assert(sourcePreview.includes("docs-source-complete"))
	assert.equal(
		(sourcePreview.match(/<summary>View code<\/summary>/g) ?? []).length,
		1
	)
	assert(sourcePreview.includes("docs-example-source"))
	assert(sourcePreview.includes("View code"))
	assert(sourcePreview.includes("docs-table-compact"))
	assert(sourcePreview.includes("Generic values"))
	for (const variant of ["primary", "outline", "ghost"])
		assert(sourcePreview.includes(`docs-button-${variant}`))
	assert(!sourcePreview.includes("demo-"))
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
		`import { defineConfig } from '@chitrank2050/monoline-docs'; import { buildDocs } from '@chitrank2050/monoline-docs/build'; import { startDevServer } from '@chitrank2050/monoline-docs/dev'; const config = defineConfig({ title: 'Docs', defaultMode: 'dark' }); void buildDocs(config); void startDevServer(config); // @ts-expect-error unsupported mode\ndefineConfig({ title: 'Docs', defaultMode: 'sepia' });`
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
		`import assert from 'node:assert/strict'; import { startDevServer } from '@chitrank2050/monoline-docs/dev'; import config from './monoline.config.mjs'; const preview = await startDevServer(config, 0); try { const response = await fetch(preview.url + 'search-index.json'); assert.equal(response.status, 200); assert((await response.text()).includes('Unpublished')); assert.equal((await fetch(preview.url + 'missing/')).status, 404); } finally { await preview.close(); }`
	)
	run(process.execPath, ["preview.mjs"])
	const pnpmRoot = await mkdtemp(join(tmpdir(), "monoline-docs-pnpm-consumer-"))
	ownedRoots.push(pnpmRoot)
	await mkdir(join(pnpmRoot, "content"), { recursive: true })
	await mkdir(join(pnpmRoot, "components"))
	await mkdir(join(pnpmRoot, "assets"))
	await writeFile(join(pnpmRoot, "content/components.mdx"), authoringSource)
	await writeFile(
		join(pnpmRoot, "assets/build-flow.svg"),
		await readFile(
			new URL("../../apps/docs-demo/assets/build-flow.svg", import.meta.url)
		)
	)
	await writeFile(
		join(pnpmRoot, "package.json"),
		JSON.stringify({
			private: true,
			type: "module",
			dependencies: {
				"@chitrank2050/monoline-docs": `file:${join(root, packed.filename)}`,
				"@chitrank2050/ask-widget": "0.6.1",
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
		"title: pnpm consumer\nbase: /reference/\nassetsDirectory: ./assets\nreact: true\n"
	)
	run(
		"pnpm",
		["install", "--ignore-scripts", "--strict-peer-dependencies"],
		pnpmRoot
	)
	run(join(pnpmRoot, "node_modules/.bin/monoline-docs"), ["build"], pnpmRoot)
	const pnpmAskWidget = join(pnpmRoot, "ask-widget")
	await cp(join(packageDirectory, "fixtures/ask-widget"), pnpmAskWidget, {
		recursive: true,
	})
	run(
		join(pnpmRoot, "node_modules/.bin/monoline-docs"),
		["build"],
		pnpmAskWidget
	)
	assert(
		(
			await readFile(join(pnpmAskWidget, "dist/getting-started.html"), "utf8")
		).includes("astro-island")
	)
	assert(
		(await readFile(join(pnpmRoot, "dist/index.html"), "utf8")).includes(
			"astro-island"
		)
	)
	for (const directory of [root, pnpmRoot]) {
		const ownDocs = join(directory, "monoline-docs-site")
		await mkdir(ownDocs)
		const demo = fileURLToPath(
			new URL("../../apps/docs-demo/", import.meta.url)
		)
		for (const name of [
			"content",
			"assets",
			"monoline-docs.yml",
			"example-api.yml",
		])
			await cp(join(demo, name), join(ownDocs, name), { recursive: true })
		run(join(directory, "node_modules/.bin/monoline-docs"), ["build"], ownDocs)
		const docsHome = await readFile(join(ownDocs, "dist/index.html"), "utf8")
		assert(docsHome.includes("Create your first site"))
		assert(docsHome.includes("Reference"))
		await assert.rejects(readFile(join(ownDocs, "dist/maintenance/index.html")))
		const components = await readFile(
			join(directory, "dist/components/index.html"),
			"utf8"
		)
		for (const expected of [
			'class="docs-card-grid"',
			'class="docs-accordion"',
			'class="docs-file-tree"',
			'class="docs-figure"',
			'class="docs-preview"',
			'data-sync="package-manager"',
			"Documentation options",
		])
			assert(
				components.includes(expected),
				`Packed authoring fixture missing ${expected}`
			)
		assert(
			!components.includes("astro-island"),
			"static authoring components must not hydrate"
		)
	}
	if (process.env.DOCS_BROWSER_CHANNEL) {
		execFileSync(
			process.execPath,
			[join(packageDirectory, "test-browser.mjs")],
			{
				cwd: packageDirectory,
				env: { ...process.env, DOCS_ASK_WIDGET_DIRECTORY: askWidget },
				timeout: 240000,
				stdio: "inherit",
			}
		)
	}
	console.log(
		"Docs consumer passed: npm and strict pnpm installs, Ask Widget clean routes, generated API data, CLI, React island, declarations, drafts, search and preview."
	)
} finally {
	await Promise.all(
		ownedRoots.map((directory) =>
			rm(directory, { recursive: true, force: true })
		)
	)
}
