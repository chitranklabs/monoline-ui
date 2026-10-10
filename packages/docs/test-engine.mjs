import assert from "node:assert/strict"
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	realpath,
	rename,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

export async function verifyEngine(packageDirectory, fixtureParent = tmpdir()) {
	const { buildAstroDocs, buildAstroSite } = await import(
		pathToFileURL(join(packageDirectory, "dist/astro-engine.js")).href
	)
	const packageFiles = (
		await readdir(packageDirectory, { recursive: true })
	).sort()
	const root = await mkdtemp(join(fixtureParent, "monoline-engine-"))
	const project = join(root, "site with spaces")
	const contentDirectory = join(project, "content")
	const outDirectory = join(project, "published")
	const outputs = []
	try {
		for (const directory of [
			contentDirectory,
			outDirectory,
			join(project, "components"),
			join(project, "src/pages"),
		])
			await mkdir(directory, { recursive: true })
		await writeFile(
			join(project, "astro.config.mjs"),
			'throw new Error("Consumer Astro config must not execute")'
		)
		await writeFile(
			join(project, "src/pages/unrelated.astro"),
			"<h1>Unrelated application</h1>"
		)
		await writeFile(
			join(outDirectory, "keep.txt"),
			"Previous output is not the engine staging directory"
		)
		await writeFile(
			join(project, "components/Table.astro"),
			'---\nconst rows = [{ name: "theme", type: "light | dark" }]\n---\n<h3 id="properties">Properties</h3><table><caption>Generated API</caption><tbody>{rows.map(row => <tr><th>{row.name}</th><td>{row.type}</td></tr>)}</tbody></table><a href={import.meta.env.BASE_URL + "guide/#installation"}>Installation</a><div data-docs-search="exclude"><h2>Example noise</h2></div>'
		)
		const authoringImports = [
			"Accordion",
			"Badge",
			"Callout",
			"FileTree",
			"Figure",
			"Preview",
			"Table",
			"CodeGroup",
			"PackageInstall",
			"PackageReference",
		]
			.map(
				(name) =>
					`import ${name} from ${JSON.stringify(join(packageDirectory, `dist/components/${name}.astro`))}`
			)
			.join("\n")
		const authoringMarkup = `
<PackageInstall id="sdk-install" name="@example/sdk" version="1.0.0" />
<PackageReference name="@example/sdk" packageHref="https://www.npmjs.com/package/example-sdk" sourceHref="https://github.com/example/sdk" compatibility={["Node.js 22", "ES modules"]} exports={[{ name: "Client", type: "class", description: "API client" }]}><CodeBlock code={"import { Client } from '@example/sdk'"} language="js" /></PackageReference>
<CodeGroup id="engine-install" commands={{ npm: "npm install sdk", pnpm: "pnpm add sdk", yarn: "yarn add sdk", bun: "bun add sdk" }} />
<Badge variant="accent">Stable</Badge>
<Accordion title="Configuration details"><p>Set your documentation base.</p></Accordion>
<Callout type="tip" title="Keep routes stable"><p>Set an explicit slug.</p></Callout>
<FileTree items={[{ name: "content", children: [{ name: "index.md", highlight: true }, { name: "guide", expanded: false, children: [{ name: "install.md" }] }] }, { name: "monoline-docs.yml" }]} />
<Figure src="/assets/logo.svg" alt="SDK diagram" width={640} height={320} caption="Local figure with reserved dimensions." />
<Table caption="SDK options" variant="reference" columns={[{ key: "name", label: "Name", format: "code" }, { key: "type", label: "Type", format: "code" }, { key: "required", label: "Required", format: "code" }, { key: "description", label: "Description" }]} rows={[{ name: "base", type: "string", required: "Yes", description: "Documentation path." }]} />
<Preview title="Static button"><button type="button">Read documentation</button><CodeBlock slot="code" code={'<button>Read documentation</button>'} language="html" /></Preview>
`
		await writeFile(
			join(contentDirectory, "index.mdx"),
			`---\ntitle: Home\n---\n${authoringImports}\nimport CardGrid from ${JSON.stringify(join(packageDirectory, "dist/components/CardGrid.astro"))}\nimport Card from ${JSON.stringify(join(packageDirectory, "dist/components/Card.astro"))}\nimport GeneratedTable from "../components/Table.astro"\nimport CodeBlock from ${JSON.stringify(join(packageDirectory, "dist/components/CodeBlock.astro"))}\nimport LinkCard from ${JSON.stringify(join(packageDirectory, "dist/components/LinkCard.astro"))}\nimport Steps from ${JSON.stringify(join(packageDirectory, "dist/components/Steps.astro"))}\nimport Step from ${JSON.stringify(join(packageDirectory, "dist/components/Step.astro"))}\n\n## API\n\n<GeneratedTable />\n<Table variant="reference" columns={[{ key: "name", label: "Name", format: "code" }, { key: "type", label: "Type", format: "code" }, { key: "default", label: "Default", format: "code" }, { key: "description", label: "Description" }]} caption="Options" rows={[{ name: "position", type: "string", default: "right", description: "Widget placement" }]} />\n<CodeBlock filename="config.yml" code={"title: Docs\\nbase: /docs/"} highlights={[2]} />\n<LinkCard href="/guide" title="Read the guide" description="Install the package." />\n<Steps><Step><strong>Install</strong></Step><Step><strong>Configure</strong></Step></Steps>\n${authoringMarkup}\n<CardGrid columns={2}><Card title="Configuration" href="/guide" description="Set up the SDK." /><Card title="Static example"><p>No client runtime required.</p></Card></CardGrid>\n\n# Content\n\n## Café \`API\`\n\n## Café API\n\n## !!!\n`
		)
		await mkdir(join(contentDirectory, "guide"))
		await mkdir(join(project, "assets"))
		await writeFile(
			join(project, "assets/logo.svg"),
			'<svg xmlns="http://www.w3.org/2000/svg"/>'
		)
		await writeFile(join(project, "assets/custom.css"), ":root{--test:1}")
		await writeFile(join(project, "assets/code.woff2"), "Fixture font bytes")
		await writeFile(
			join(contentDirectory, "guide/index.md"),
			'---\ntitle: Installation guide\nnavTitle: Guide\nseoTitle: Install the SDK\nslug: guide\nlayout: reference\nsearch: false\nnoindex: true\nupdatedAt: 2026-09-18\ntags: [guide, sdk]\nbadge: Beta\n---\n# Installation\n\n<script>throw new Error("must be text")</script>\n\n> [!NOTE]\n> Keep this safe.\n\n```js\nconst ready = true\n```\n\n# Content\n\n## Café `API`\n\n## Café API\n\n## !!!\n'
		)
		await writeFile(
			join(contentDirectory, "draft.mdx"),
			'---\ntitle: Draft\ndraft: true\n---\nimport Missing from "./not-present.js"\n\n<Missing />'
		)
		const options = {
			title: "Engine fixture",
			description: "Astro documentation fixture",
			site: "https://example.com",
			contentDirectory,
			outDirectory,
			base: "/ask-widget/",
			assetsDirectory: join(project, "assets"),
			stylesheet: "/assets/custom.css",
			branding: {
				favicon: "/assets/logo.svg",
				logo: {
					src: "/assets/logo.svg",
					alt: "Fixture logo",
					width: 24,
					height: 24,
				},
			},
			header: {
				links: [{ label: "GitHub", href: "https://github.com/example" }],
			},
			appearance: {
				defaultMode: "system",
				density: "compact",
				radius: 0.25,
				accent: { light: "#753c22", dark: "#e9b894" },
				fonts: { code: { family: "Local Code", src: "/assets/code.woff2" } },
			},
			search: { enabled: true },
			seo: { titleTemplate: "%s · Engine fixture" },
		}
		for (const name of ["index.mdx", "guide/index.md"]) {
			const path = join(contentDirectory, name)
			await writeFile(
				path,
				(await readFile(path, "utf8")) +
					'\n```unknown\n<script>alert("fence must stay text")</script>\n```\n\n```constructor\n<script>alert("inherited language must stay text")</script>\n```\n' +
					"\n[Guide](/guide/index.md?source=docs#installation)\n\n[Home][home]\n\n[home]: /index.mdx#api\n\n![Logo](/assets/logo.svg)\n\n![Reference logo][logo]\n\n[logo]: /assets/logo.svg\n"
			)
		}
		const sourceFiles = (await readdir(project, { recursive: true })).sort()
		const result = await buildAstroSite(options)
		outputs.push(result)
		assert.equal(result.pages.length, 2)
		assert.notEqual(result.directory, outDirectory)
		const home = await readFile(join(result.directory, "index.html"), "utf8")
		assert.match(home, /<h1[^>]*>Home<\/h1>/)
		assert.match(home, /<title>Home · Engine fixture<\/title>/)
		assert.match(home, /<table>/)
		assert.match(home, /class="[^"]*docs-table-reference[^"]*"/)
		assert.match(home, /class="docs-code-filename">config.yml/)
		assert.match(home, /class="docs-code-line" data-highlight="true"/)
		assert.match(home, /class="docs-link-card" href="\/ask-widget\/guide\/"/)
		assert.match(home, /class="docs-steps"/)
		assert.match(home, /light \| dark/)
		assert.match(home, /data-theme="system"/)
		assert.match(home, /data-density="compact"/)
		assert.match(home, /rel="icon" href="\/ask-widget\/assets\/logo.svg"/)
		const css = await readFile(join(result.directory, "docs.css"), "utf8")
		const markdown = await readFile(join(result.directory, "index.md"), "utf8")
		assert.match(
			markdown,
			/```js\nimport \{ Client \} from '@example\/sdk'\n```/
		)
		assert.match(
			markdown,
			/\[Installation\]\(\/ask-widget\/guide\/#installation\)/
		)
		assert.ok(
			markdown.includes("| `base` | `string` | `Yes` | Documentation path. |")
		)
		assert.doesNotMatch(markdown, /View code|Copy code block/)
		assert.ok(
			(
				await readFile(join(result.directory, "llms-full.txt"), "utf8")
			).includes(markdown.trim())
		)
		assert.match(css, /--radius:0.25rem/)
		assert.match(css, /--accent:light-dark\(#753c22,#e9b894\)/)
		assert.match(
			css,
			/src:url\("\/ask-widget\/assets\/code.woff2"\);font-display:optional/
		)
		assert.equal(
			await readFile(join(result.directory, "assets/code.woff2"), "utf8"),
			"Fixture font bytes"
		)
		assert.match(home, /href="\/ask-widget\/docs\.css"/)
		assert.match(home, /src="\/ask-widget\/theme\.js"/)
		assert.match(home, /src="\/ask-widget\/client\.js"/)
		assert.match(home, /src="\/ask-widget\/search\.js"/)
		assert.doesNotMatch(home, /_astro|astro-island|react/i)
		assert.match(home, /href="https:\/\/example\.com\/ask-widget\/"/)
		assert.match(home, /content="Astro documentation fixture"/)
		assert.match(home, /src="\/ask-widget\/assets\/logo\.svg"/)
		assert.match(home, /href="\/ask-widget\/assets\/custom\.css"/)
		assert.match(home, /aria-label="Documentation sidebar"/)
		assert.match(home, /aria-current="page"/)
		assert.match(home, /aria-label="On this page"/)
		assert.match(home, /href="#properties"/)
		assert.doesNotMatch(home, /<a[^>]*>Example noise<\/a>/)
		const index = JSON.parse(
			await readFile(join(result.directory, "search-index.json"), "utf8")
		)
		assert.ok(
			index.some(
				(entry) =>
					entry.url === "/ask-widget/#properties" &&
					entry.text.includes("theme light | dark")
			)
		)
		assert.ok(
			index.every(
				(entry) =>
					!entry.text.includes("Example noise") &&
					!entry.text.includes("import Table")
			)
		)
		const guide = await readFile(
			join(result.directory, "guide/index.html"),
			"utf8"
		)
		for (const className of [
			"docs-accordion",
			"docs-badge",
			"docs-file-tree",
			"docs-figure",
			"docs-preview",
		])
			assert(home.includes(`class="${className}"`), `Missing ${className}`)
		assert.match(home, /<figcaption>Local figure with reserved dimensions/)
		assert.match(home, /alt="SDK diagram" width="640" height="320"/)
		assert.match(home, /scope="col">Required/)
		assert.match(home, /callout callout-tip/)
		assert.match(home, /data-sync="package-manager"/)
		assert.match(home.replace(/<[^>]*>/g, ""), /pnpm add sdk/)
		assert.match(home, /class="docs-card-grid"/)
		assert.match(home, /Set up the SDK/)
		assert.match(home, /class="docs-link-card" href="\/ask-widget\/guide\/"/)
		assert.match(guide, /<h2[^>]*>Installation/)
		assert.match(guide, /<title>Install the SDK · Engine fixture<\/title>/)
		assert.match(guide, /<meta name="robots" content="noindex, nofollow"/)
		assert.match(guide, /data-layout="reference"/)
		assert.doesNotMatch(
			JSON.stringify(index),
			/Installation guide|Preview only/
		)
		assert.doesNotMatch(guide, /<script>throw new Error/)
		assert.doesNotMatch(guide, /_astro|astro-island|react/i)
		assert.match(guide, /&lt;script&gt;/)
		assert.match(guide, /class="callout callout-note"/)
		assert.doesNotMatch(guide, /class="callout-title"/)
		assert.match(guide, /aria-label="Note"/)
		assert.match(guide, /class="code-block"/)
		assert.match(guide, /class="copy-code"/)
		assert.match(guide, /class="token keyword">const/)
		assert.match(guide, /class="heading-anchor"/)
		for (const html of [home, guide]) {
			assert.match(
				html,
				/&lt;script&gt;alert\((?:"|&quot;)fence must stay text(?:"|&quot;)\)&lt;\/script&gt;/
			)
			assert.match(
				html,
				/&lt;script&gt;alert\((?:"|&quot;)inherited language must stay text(?:"|&quot;)\)&lt;\/script&gt;/
			)
			assert.doesNotMatch(html, /<script>alert\("(?:fence|inherited language)/)
			for (const id of ["content-1", "café-api", "café-api-1", "section"])
				assert.ok(html.includes(`id="${id}"`), `Missing stable heading ${id}`)
			assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
			assert.ok(
				html.includes('href="/ask-widget/guide/?source=docs#installation"')
			)
			assert.ok(html.includes('href="/ask-widget/#api"'))
			assert.ok(html.includes('src="/ask-widget/assets/logo.svg"'))
		}
		assert.match(
			await readFile(join(result.directory, "assets/logo.svg"), "utf8"),
			/<svg/
		)
		for (const name of [
			"404.html",
			"docs.css",
			"theme.js",
			"client.js",
			"search.js",
			"sitemap.xml",
		])
			await access(join(result.directory, name))
		assert.ok(
			!(await readdir(result.directory, { recursive: true })).some(
				(name) => name.startsWith("_astro/") && name.endsWith(".js")
			)
		)
		await assert.rejects(access(join(result.directory, "robots.txt")))
		await assert.rejects(access(join(result.directory, "unrelated/index.html")))
		await assert.rejects(access(join(result.directory, "draft/index.html")))
		assert.deepEqual(
			(await readdir(project, { recursive: true })).sort(),
			sourceFiles
		)
		await result.dispose()
		await result.dispose()
		await assert.rejects(access(dirname(result.directory)))
		await writeFile(
			join(contentDirectory, "draft.mdx"),
			"---\ntitle: Draft\ndraft: true\n---\n## Preview only\n"
		)
		const preview = await buildAstroSite({
			...options,
			base: "/",
			environment: "development",
		})
		outputs.push(preview)
		assert.ok(
			(await readFile(join(preview.directory, "index.html"), "utf8")).includes(
				'href="/guide/?source=docs#installation"'
			)
		)
		assert.equal(preview.pages.length, 3)
		assert.match(
			await readFile(join(preview.directory, "draft/index.html"), "utf8"),
			/Preview only/
		)
		await writeFile(
			join(contentDirectory, "broken.mdx"),
			"---\ntitle: Broken\n---\n<Unclosed"
		)
		const workspaces = new Set(
			(await readdir(tmpdir())).filter((name) =>
				name.startsWith("monoline-astro-")
			)
		)
		await assert.rejects(
			buildAstroSite(options),
			/broken\.mdx|Unclosed|Unexpected|end of file/i
		)
		assert.deepEqual(
			(await readdir(tmpdir())).filter(
				(name) => name.startsWith("monoline-astro-") && !workspaces.has(name)
			),
			[]
		)
		await rm(join(contentDirectory, "broken.mdx"))
		await writeFile(
			join(contentDirectory, "invalid-code.mdx"),
			`---\ntitle: Invalid code\n---\nimport CodeBlock from ${JSON.stringify(join(packageDirectory, "dist/components/CodeBlock.astro"))}\n\n<CodeBlock code="one line" highlights={[2]} />\n`
		)
		await assert.rejects(
			buildAstroSite(options),
			/CodeBlock highlights must reference existing positive line numbers/
		)
		await rm(join(contentDirectory, "invalid-code.mdx"))
		const invalidComponent = join(contentDirectory, "invalid-component.mdx")
		for (const [component, markup, message] of [
			["CardGrid", "<CardGrid columns={4} />", /CardGrid columns/],
			[
				"PackageInstall",
				'<PackageInstall id="unsafe" name="sdk; echo secret" />',
				/npm package name/,
			],
			[
				"PackageInstall",
				'<PackageInstall id="unsafe" name="sdk" version="$(echo secret)" />',
				/version or distribution tag/,
			],
			[
				"PackageReference",
				'<PackageReference name="sdk" packageHref="javascript:alert(1)" compatibility={["Node"]} exports={[]} />',
				/HTTP\(S\)/,
			],
			[
				"Accordion",
				'<Accordion title="Details" open="yes" />',
				/Accordion open/,
			],
			["Badge", '<Badge variant="unknown">Status</Badge>', /Badge variant/],
			["Callout", '<Callout type="unknown">Note</Callout>', /Callout type/],
			[
				"Figure",
				'<Figure src="/assets/logo.svg" alt="Diagram" width={0} height={80} />',
				/Figure width and height/,
			],
			[
				"Figure",
				'<Figure src="/assets/logo.svg" width={160} height={80} />',
				/Figure alt/,
			],
			["FileTree", '<FileTree items={[{name: ""}]} />', /FileTree names/],
			[
				"FileTree",
				'export const entries = []\n\nexport const added = entries.push({name: "loop", children: entries})\n\n<FileTree items={entries} />',
				/FileTree items/,
			],
			[
				"Table",
				'<Table caption="Invalid" columns={[{key: "name", label: "Name"}]} rows={[{name: {value: "base"}}]} />',
				/Table rows/,
			],
			[
				"CodeGroup",
				'<CodeGroup id="invalid" commands={{npm: "npm install"}} />',
				/CodeGroup requires at least two/,
			],
			[
				"CodeGroup",
				'<CodeGroup id="invalid" commands={{npm: "npm install", pnpm: ""}} />',
				/CodeGroup commands/,
			],
			[
				"CodeGroup",
				'<CodeGroup id="invalid" commands={{npm: "npm install", pip: "pip install"}} />',
				/CodeGroup commands/,
			],
			[
				"CodeGroup",
				'<CodeGroup id="123" commands={{npm: "npm install", pnpm: "pnpm add"}} />',
				/Tabs id/,
			],
		]) {
			await writeFile(
				invalidComponent,
				`---\ntitle: Invalid component\n---\nimport ${component} from ${JSON.stringify(join(packageDirectory, `dist/components/${component}.astro`))}\n\n${markup}\n`
			)
			await assert.rejects(buildAstroSite(options), message)
			assert.deepEqual(await readdir(outDirectory), ["keep.txt"])
		}
		await rm(invalidComponent)

		await writeFile(
			join(contentDirectory, "broken.md"),
			"---\ntitle: Broken link\n---\n[Missing](missing.md)"
		)
		await assert.rejects(buildAstroSite(options), /broken internal link/)
		await rm(join(contentDirectory, "broken.md"))
		const tablePath = join(project, "components/Table.astro")
		const tableSource = await readFile(tablePath, "utf8")
		for (const [markup, message] of [
			['<a href="#missing">Broken fragment</a>', /missing fragment/],
			['<a href="./missing/">Broken target</a>', /missing local target/],
			[
				'<img src="./assets/missing.svg" alt="Missing">',
				/missing local target/,
			],
			["<h2>No identifier</h2>", /heading requires a stable id/],
			['<div id="properties">Duplicate</div>', /duplicate id/],
		]) {
			await writeFile(tablePath, tableSource + markup)
			await assert.rejects(buildAstroSite(options), message)
			assert.deepEqual(await readdir(outDirectory), ["keep.txt"])
		}
		await writeFile(tablePath, tableSource)
		await writeFile(
			join(contentDirectory, "index.md"),
			"---\ntitle: Duplicate\n---\nDuplicate"
		)
		await assert.rejects(
			buildAstroSite(options),
			/Duplicate documentation route/
		)
		await rm(join(contentDirectory, "index.md"))
		await writeFile(
			join(contentDirectory, "index.mdx"),
			'---\ntitle: Home\n---\nimport GeneratedTable from "../components/Table.astro"\n\n## API\n\n<GeneratedTable />\n'
		)
		// The route remains stable when its source file moves with an explicit slug.
		await rename(
			join(contentDirectory, "guide/index.md"),
			join(contentDirectory, "guide/renamed.md")
		)
		await writeFile(
			join(contentDirectory, "guide/renamed.md"),
			(
				await readFile(join(contentDirectory, "guide/renamed.md"), "utf8")
			).replace("/guide/index.md?", "/guide?")
		)
		const published = join(project, "published-safe")
		const publishedOptions = {
			...options,
			outDirectory: published,
			navigation: {
				sections: [
					{ label: "API", href: "/", items: [{ label: "Home", href: "/" }] },
					{
						label: "Guides",
						href: "/guide",
						items: [{ label: "Guide", href: "/guide" }],
					},
				],
			},
		}
		const publishedResult = await buildAstroDocs(publishedOptions)
		assert.equal(publishedResult.pages, 2)
		const movedGuide = await readFile(
			join(published, "guide/index.html"),
			"utf8"
		)
		assert.match(movedGuide, /aria-current="true">Guides/)
		assert.match(movedGuide, /href="\/ask-widget\/guide\/" aria-current="page"/)
		await assert.rejects(access(join(published, "guide/renamed/index.html")))
		assert.equal(publishedResult.outDirectory, await realpath(published))
		assert.equal("dependencies" in publishedResult, false)
		await writeFile(join(published, "keep.txt"), "unrelated")
		await mkdir(join(published, "_astro"), { recursive: true })
		await writeFile(join(published, "_astro/stale.js"), "stale")
		const manifestPath = join(published, ".monoline-generated.json")
		const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
		await writeFile(
			manifestPath,
			JSON.stringify([...manifest, "_astro/stale.js"])
		)
		await buildAstroDocs(publishedOptions)
		assert.equal(
			await readFile(join(published, "keep.txt"), "utf8"),
			"unrelated"
		)
		await assert.rejects(access(join(published, "_astro/stale.js")))
		const lastGood = await readFile(join(published, "index.html"), "utf8")
		await writeFile(join(contentDirectory, "index.mdx"), "<Broken")
		await assert.rejects(buildAstroDocs(publishedOptions))
		assert.equal(
			await readFile(join(published, "index.html"), "utf8"),
			lastGood
		)
		await writeFile(manifestPath, JSON.stringify(["../outside.txt"]))
		await writeFile(
			join(contentDirectory, "index.mdx"),
			'---\ntitle: Home\n---\nimport GeneratedTable from "../components/Table.astro"\n\n## API\n\n<GeneratedTable />\n'
		)
		await assert.rejects(
			buildAstroDocs(publishedOptions),
			/Invalid generated-file manifest/
		)
		await rm(join(contentDirectory, "index.mdx"))
		await assert.rejects(buildAstroSite(options), /index\.md|home/i)
		assert.deepEqual(await readdir(outDirectory), ["keep.txt"])
		assert.equal(
			await readFile(join(outDirectory, "keep.txt"), "utf8"),
			"Previous output is not the engine staging directory"
		)
		assert.deepEqual((await readdir(project)).sort(), [
			"assets",
			"astro.config.mjs",
			"components",
			"content",
			"published",
			"published-safe",
			"src",
		])
		assert.deepEqual(
			(await readdir(packageDirectory, { recursive: true })).sort(),
			packageFiles
		)
		await writeFile(
			join(contentDirectory, "index.mdx"),
			"---\ntitle: Home\n---\n# Home\n\n## API"
		)
		const specFile = join(project, "api.json")
		const spec = {
			openapi: "3.1.0",
			info: { title: "Pets", version: "1" },
			paths: {
				"/pets/{id}": {
					get: {
						operationId: "getPet",
						tags: ["Pets"],
						parameters: [
							{
								name: "id",
								in: "path",
								required: true,
								schema: { type: "string" },
							},
						],
						responses: {
							200: {
								description: "Found",
								content: {
									"application/json": {
										schema: { $ref: "#/components/schemas/Pet" },
										example: { id: "one" },
									},
								},
							},
						},
					},
				},
			},
			components: {
				schemas: {
					Pet: {
						type: "object",
						properties: {
							id: { type: "string" },
							parent: { $ref: "#/components/schemas/Pet" },
						},
					},
				},
			},
		}
		await writeFile(specFile, JSON.stringify(spec))
		const apiOptions = {
			...options,
			navigation: undefined,
			openapi: { file: specFile, route: "/reference" },
		}
		for (const cleanUrls of [false, true]) {
			const apiOutput = await buildAstroSite({ ...apiOptions, cleanUrls })
			outputs.push(apiOutput)
			assert(apiOutput.dependencies.includes(specFile))
			const apiHtml = await readFile(
				join(
					apiOutput.directory,
					cleanUrls
						? "reference/operations/getpet.html"
						: "reference/operations/getpet/index.html"
				),
				"utf8"
			)
			assert(apiHtml.includes("&lt;ID&gt;"))
			assert(apiHtml.includes("Responses"))
			assert(apiHtml.includes("reference/schemas/pet"))
			assert(!apiHtml.includes("astro-island"))
		}
		const apiPublished = {
			...apiOptions,
			outDirectory: join(project, "published-api"),
		}
		await buildAstroDocs(apiPublished)
		const operationFile = join(
			apiPublished.outDirectory,
			"reference/operations/getpet/index.html"
		)
		const apiLastGood = await readFile(operationFile, "utf8")
		await writeFile(specFile, JSON.stringify({ ...spec, openapi: "2.0" }))
		await assert.rejects(
			buildAstroDocs(apiPublished),
			/api.json.*OpenAPI 3.0 or 3.1/
		)
		assert.equal(await readFile(operationFile, "utf8"), apiLastGood)
		assert.equal(
			await readFile(join(outDirectory, "keep.txt"), "utf8"),
			"Previous output is not the engine staging directory"
		)
		await writeFile(specFile, JSON.stringify(spec))
		await writeFile(
			join(contentDirectory, "collision.md"),
			"---\ntitle: Collision\nslug: reference/operations/getpet\n---"
		)
		await assert.rejects(
			buildAstroSite(apiOptions),
			/duplicate documentation route/
		)
		await writeFile(
			specFile,
			JSON.stringify({
				...spec,
				paths: {
					"/one": spec.paths["/pets/{id}"],
					"/two": spec.paths["/pets/{id}"],
				},
			})
		)
		await assert.rejects(buildAstroDocs(apiPublished), /Duplicate operationId/)
		assert.equal(await readFile(operationFile, "utf8"), apiLastGood)
		await assert.rejects(
			buildAstroDocs({
				...apiOptions,
				openapi: { file: join(outDirectory, "keep.txt"), route: "/reference" },
			}),
			/OpenAPI source must not be inside/
		)
		assert.deepEqual(
			(await readdir(packageDirectory, { recursive: true })).sort(),
			packageFiles
		)
		console.log(
			"Astro engine passed: MDX imports, static HTML, escaped Markdown, isolated routes/config, draft exclusion, failure and staging cleanup."
		)
	} finally {
		for (const output of outputs) await output.dispose()
		await rm(root, { recursive: true, force: true })
	}
}

if (
	process.argv[1] &&
	resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	await verifyEngine(dirname(fileURLToPath(import.meta.url)))
}
