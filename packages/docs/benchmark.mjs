import assert from "node:assert/strict"
import {
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	stat,
	symlink,
	writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { performance } from "node:perf_hooks"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { buildDocs } from "./dist/build.js"
import { searchEntries } from "./dist/search.js"

const median = (values) =>
	values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
const p95 = (values) =>
	values.sort((a, b) => a - b)[Math.ceil(values.length * 0.95) - 1]
const budgets = {
	100: { output: 2_400_000, index: 300_000 },
	1000: { output: 80_000_000, index: 3_000_000 },
}
async function size(directory) {
	let bytes = 0
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		bytes += entry.isDirectory() ? await size(path) : (await stat(path)).size
	}
	return bytes
}

const temporary = await mkdtemp(join(tmpdir(), "monoline-docs-benchmark-"))
try {
	for (const pages of [100, 1000]) {
		const content = join(temporary, String(pages))
		const output = join(temporary, `output-${pages}`)
		await mkdir(content)
		for (let index = 0; index < pages; index++) {
			await writeFile(
				join(content, index === 0 ? "index.md" : `${index}.md`),
				`---\ntitle: Guide ${index}\n---\n## Configuration\n${"Configure navigation and deploy static documentation. ".repeat(40)}\n\n## Example\n\n\`\`\`js\nconst page = ${index}\n\`\`\`\n`
			)
		}
		const builds = []
		for (let run = 0; run < 3; run++) {
			const start = performance.now()
			await buildDocs({
				title: "Benchmark",
				contentDirectory: content,
				outDirectory: output,
			})
			builds.push(performance.now() - start)
		}
		const raw = await readFile(join(output, "search-index.json"), "utf8")
		const entries = JSON.parse(raw)
		const searches = []
		const parses = []
		for (let run = 0; run < 100; run++) {
			const parseStart = performance.now()
			JSON.parse(raw)
			parses.push(performance.now() - parseStart)
			const start = performance.now()
			searchEntries(entries, "configuration navigation")
			searches.push(performance.now() - start)
		}
		const outputBytes = await size(output)
		const indexBytes = Buffer.byteLength(raw)
		const shell = []
		for (const name of ["theme.js", "client.js", "search.js"])
			shell.push(await readFile(join(output, name)))
		const shellJsGzipBytes = shell.reduce(
			(sum, script) => sum + gzipSync(script).length,
			0
		)
		assert(
			outputBytes <= budgets[pages].output,
			`${pages}-page output exceeded ${budgets[pages].output} bytes`
		)
		assert(
			indexBytes <= budgets[pages].index,
			`${pages}-page search index exceeded ${budgets[pages].index} bytes`
		)
		assert(
			shellJsGzipBytes <= 6_000,
			"static shell JavaScript exceeded 6 KB gzip"
		)
		assert(
			p95(searches) <= 20,
			"in-process search p95 exceeded 20 ms; rerun without concurrent workloads"
		)
		console.log(
			JSON.stringify({
				pages,
				buildMedianMs: median(builds),
				outputBytes,
				indexBytes,
				indexGzipBytes: gzipSync(raw).length,
				shellJsGzipBytes,
				parseMedianMs: median(parses),
				parseP95Ms: p95(parses),
				searchMedianMs: median(searches),
				searchP95Ms: p95(searches),
				node: process.version,
				platform: process.platform,
				arch: process.arch,
			})
		)
	}
	const islandContent = join(temporary, "island-content")
	const islandOutput = join(temporary, "island-output")
	await mkdir(islandContent)
	await symlink(
		fileURLToPath(new URL("../../node_modules", import.meta.url)),
		join(temporary, "node_modules"),
		"dir"
	)
	await writeFile(
		join(islandContent, "Counter.jsx"),
		'import { useState } from "react"; export default function Counter() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Count {count}</button> }'
	)
	await writeFile(
		join(islandContent, "index.mdx"),
		'---\ntitle: Island budget\n---\nimport Counter from "./Counter.jsx"\n\n<Counter client:load />\n'
	)
	await buildDocs({
		title: "Island budget",
		contentDirectory: islandContent,
		outDirectory: islandOutput,
		react: true,
	})
	const assets = (await readdir(join(islandOutput, "_astro"))).filter((name) =>
		name.endsWith(".js")
	)
	let islandJsGzipBytes = 0
	for (const name of assets)
		islandJsGzipBytes += gzipSync(
			await readFile(join(islandOutput, "_astro", name))
		).length
	assert(
		islandJsGzipBytes > 0 && islandJsGzipBytes <= 90_000,
		"optional React island must be present and remain within 90 KB gzip"
	)
	console.log(
		JSON.stringify({
			fixture: "react-counter",
			islandJsGzipBytes,
			islandAssets: assets.length,
		})
	)
} finally {
	await rm(temporary, { recursive: true, force: true })
}
