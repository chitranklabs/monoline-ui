import {
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
import { performance } from "node:perf_hooks"

import { buildDocs } from "./dist/build.js"
import { searchEntries } from "./dist/search.js"

const median = (values) =>
	values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
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
		for (let run = 0; run < 30; run++) {
			const start = performance.now()
			searchEntries(entries, "configuration navigation")
			searches.push(performance.now() - start)
		}
		console.log(
			JSON.stringify({
				pages,
				buildMedianMs: median(builds),
				outputBytes: await size(output),
				indexBytes: Buffer.byteLength(raw),
				searchMedianMs: median(searches),
				node: process.version,
				platform: process.platform,
				arch: process.arch,
			})
		)
	}
} finally {
	await rm(temporary, { recursive: true, force: true })
}
