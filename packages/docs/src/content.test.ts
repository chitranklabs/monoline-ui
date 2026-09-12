// @vitest-environment node
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { discoverPages, findPage } from "./content"

const temporaryDirectories: string[] = []

async function contentDirectory(): Promise<string> {
	const directory = await mkdtemp(join(tmpdir(), "monoline-docs-"))
	temporaryDirectories.push(directory)
	return directory
}

afterEach(async () => {
	await Promise.all(
		temporaryDirectories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true }))
	)
})

describe("discoverPages", () => {
	it("maps Markdown files to sorted documentation routes", async () => {
		const directory = await contentDirectory()
		await mkdir(join(directory, "guides", "advanced"), { recursive: true })
		await Promise.all([
			writeFile(join(directory, "index.md"), "---\ntitle: Home\n---\n# Home"),
			writeFile(
				join(directory, "guides", "install.mdx"),
				"---\ntitle: Install\ndescription: Install Monoline Docs.\norder: 1\n---\n# Install"
			),
			writeFile(
				join(directory, "guides", "advanced", "index.md"),
				"---\ntitle: Advanced\n---\n# Advanced"
			),
			writeFile(join(directory, "ignored.txt"), "Ignored"),
		])

		await expect(discoverPages(directory)).resolves.toEqual([
			{
				filePath: join(directory, "index.md"),
				format: "md",
				metadata: { title: "Home" },
				route: "/",
				source: "# Home",
			},
			{
				filePath: join(directory, "guides", "advanced", "index.md"),
				format: "md",
				metadata: { title: "Advanced" },
				route: "/guides/advanced",
				source: "# Advanced",
			},
			{
				filePath: join(directory, "guides", "install.mdx"),
				format: "mdx",
				metadata: {
					description: "Install Monoline Docs.",
					order: 1,
					title: "Install",
				},
				route: "/guides/install",
				source: "# Install",
			},
		])
	})

	it("rejects files that resolve to the same route", async () => {
		const directory = await contentDirectory()
		await mkdir(join(directory, "guides"))
		await Promise.all([
			writeFile(join(directory, "guides.md"), "---\ntitle: Guides\n---"),
			writeFile(
				join(directory, "guides", "index.md"),
				"---\ntitle: Guides\n---"
			),
		])

		await expect(discoverPages(directory)).rejects.toThrow(
			'Duplicate documentation route "/guides"'
		)
	})

	it("rejects missing or invalid metadata with the source path", async () => {
		const directory = await contentDirectory()
		const filePath = join(directory, "invalid.md")
		await writeFile(filePath, "---\ntitle: 42\n---\n# Invalid")

		await expect(discoverPages(directory)).rejects.toThrow(
			`Invalid documentation metadata in "${filePath}": title must be a non-empty string`
		)
	})

	it("excludes drafts only from production discovery", async () => {
		const directory = await contentDirectory()
		await writeFile(
			join(directory, "draft.md"),
			"---\ntitle: Draft\ndraft: true\n---\n# Draft"
		)

		await expect(
			discoverPages(directory, { environment: "development" })
		).resolves.toHaveLength(1)
		await expect(
			discoverPages(directory, { environment: "production" })
		).resolves.toEqual([])
	})

	it("normalizes CRLF bodies and preserves empty documents", async () => {
		const directory = await contentDirectory()
		await Promise.all([
			writeFile(
				join(directory, "crlf.md"),
				"---\r\ntitle: CRLF\r\n---\r\nFirst\r\n\r\nSecond"
			),
			writeFile(join(directory, "empty.mdx"), "---\ntitle: Empty\n---\n"),
		])

		const pages = await discoverPages(directory)
		expect(findPage(pages, "/crlf")).toMatchObject({
			format: "md",
			source: "First\n\nSecond",
		})
		expect(findPage(pages, "/empty")).toMatchObject({
			format: "mdx",
			source: "",
		})
	})

	it("returns undefined when a route does not exist", async () => {
		const directory = await contentDirectory()
		await writeFile(join(directory, "index.md"), "---\ntitle: Home\n---\n")

		expect(findPage(await discoverPages(directory), "/missing")).toBeUndefined()
	})
})
