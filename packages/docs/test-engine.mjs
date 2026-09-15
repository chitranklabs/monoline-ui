import assert from "node:assert/strict"
import {
	access,
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

export async function verifyEngine(packageDirectory, fixtureParent = tmpdir()) {
	const { buildAstroSite } = await import(
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
		await writeFile(
			join(contentDirectory, "index.mdx"),
			'---\ntitle: Home\n---\nimport Table from "../components/Table.astro"\n\n## API\n\n<Table />\n# Content\n\n## Café `API`\n\n## Café API\n\n## !!!\n'
		)
		await mkdir(join(contentDirectory, "guide"))
		await mkdir(join(project, "assets"))
		await writeFile(
			join(project, "assets/logo.svg"),
			'<svg xmlns="http://www.w3.org/2000/svg"/>'
		)
		await writeFile(
			join(contentDirectory, "guide/index.md"),
			'---\ntitle: Guide\nlayout: ./missing-layout.astro\n---\n# Installation\n\n<script>throw new Error("must be text")</script>\n\n# Content\n\n## Café `API`\n\n## Café API\n\n## !!!\n'
		)
		await writeFile(
			join(contentDirectory, "draft.mdx"),
			'---\ntitle: Draft\ndraft: true\n---\nimport Missing from "./not-present.js"\n\n<Missing />'
		)
		const options = {
			title: "Engine fixture",
			contentDirectory,
			outDirectory,
			base: "/ask-widget/",
			assetsDirectory: join(project, "assets"),
		}
		for (const name of ["index.mdx", "guide/index.md"]) {
			const path = join(contentDirectory, name)
			await writeFile(
				path,
				(await readFile(path, "utf8")) +
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
		assert.match(home, /<table>/)
		assert.match(home, /light \| dark/)
		assert.doesNotMatch(home, /<script\b/)
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
		assert.match(guide, /<h2[^>]*>Installation<\/h2>/)
		assert.doesNotMatch(guide, /<script\b/)
		assert.match(guide, /&lt;script&gt;/)
		for (const html of [home, guide]) {
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
			"src",
		])
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
